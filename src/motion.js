import { mountPixelTrail } from './pixel-trail.js'
// Progressive enhancement: content stays visible if motion is unavailable.
export function setupMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const fine = matchMedia('(hover: hover) and (pointer: fine)')
  let cleanup = () => {}
  function mount() {
    cleanup()
    if (reduced.matches) return
    const animations = new Set()
    const targets = [...document.querySelectorAll('section > div, footer > div')]
      .filter(el => !el.closest('svg') && !el.querySelector('section') && el.offsetHeight > 45)
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target
        observer.unobserve(el)
        // Skip content already above the viewport, including restored scroll positions.
        if (entry.boundingClientRect.bottom < 0) continue
        const animation = el.animate([
          { opacity: 0, translate: '0 28px' },
          { opacity: 1, translate: '0 0' }
        ], { duration: 760, delay: Number(el.dataset.motionDelay || 0), easing: 'cubic-bezier(.16,1,.3,1)', fill: 'none' })
        animations.add(animation)
        animation.finished.catch(() => {}).finally(() => animations.delete(animation))
      }
    }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' })
    targets.forEach(el => {
      el.dataset.motionDelay = String(Math.min([...el.parentElement.children].indexOf(el) * 55, 165))
      observer.observe(el)
    })
    const progress = document.createElement('div')
    progress.className = 'reading-progress'
    progress.setAttribute('aria-hidden', 'true')
    document.body.append(progress)
    let scrollFrame = 0
    const updateProgress = () => {
      scrollFrame = 0
      const total = document.documentElement.scrollHeight - innerHeight
      progress.style.scale = `${total > 0 ? scrollY / total : 0} 1`
    }
    const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress) }
    addEventListener('scroll', onScroll, { passive: true })
    updateProgress()

    let cursorCleanup = () => {}
    if (fine.matches) cursorCleanup = mountPixelTrail()

    cleanup = () => {
      observer.disconnect(); animations.forEach(a => a.cancel()); cursorCleanup()
      progress.remove(); removeEventListener('scroll', onScroll); cancelAnimationFrame(scrollFrame)
    }
  }
  reduced.addEventListener('change', mount); fine.addEventListener('change', mount)
  mount()
}
