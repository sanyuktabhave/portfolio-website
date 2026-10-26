export function setupImpactCounters() {
  if (location.pathname.replace(/\/$/, '') !== '/blinkit-onboarding') return
  const section = document.querySelector('#blinkit-impact')
  if (!section) return
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const counters = [...section.querySelectorAll('[data-count]')].map(el => {
    const raw = el.dataset.count
    const label = raw + '%'
    const value = Number(raw)
    const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
    el.setAttribute('aria-label', raw + ' percent reported improvement')
    const visual = document.createElement('span')
    visual.setAttribute('aria-hidden', 'true'); visual.textContent = raw
    const suffix = document.createElement('small'); suffix.textContent = '%'; suffix.setAttribute('aria-hidden','true')
    const arrow = document.createElement('small'); arrow.className = 'be-up-arrow'; arrow.textContent = '↑ '; arrow.setAttribute('aria-hidden', 'true')
    el.replaceChildren(arrow, visual, suffix); el.classList.add('impact-counter')
    return { visual, label: raw, value, decimals }
  })
  if (!counters.length || reduced.matches) return
  let frame = 0, started = false
  const finish = () => {
    cancelAnimationFrame(frame)
    counters.forEach(c => c.visual.textContent = c.label)
  }
  const observer = new IntersectionObserver(entries => {
    if (started || !entries.some(e => e.isIntersecting)) return
    started = true; observer.disconnect()
    const start = performance.now()
    const tick = now => {
      let pending = false
      counters.forEach((c, index) => {
        const progress = Math.min(1, Math.max(0, (now - start - index * 80) / 1600))
        const eased = 1 - (1 - progress) ** 3
        c.visual.textContent = progress === 1 ? c.label : `${(c.value * eased).toFixed(c.decimals)}`
        if (progress < 1) pending = true
      })
      if (pending) frame = requestAnimationFrame(tick)
    }
    counters.forEach(c => c.visual.textContent = `${(0).toFixed(c.decimals)}`)
    frame = requestAnimationFrame(tick)
  }, { threshold: .2 })
  observer.observe(section)
  reduced.addEventListener('change', () => {
    if (reduced.matches) { started = true; observer.disconnect(); finish() }
  })
  addEventListener('pagehide', () => { observer.disconnect(); finish() }, { once: true })
}
