export function setupVideoFallbacks() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
  const videos = document.querySelectorAll('.be-video-media video')
  if (!videos.length) return

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const video = entry.target
      observer.unobserve(video)
      if (!reducedMotion.matches && !navigator.connection?.saveData) video.play().catch(() => {})
    }
  }, { threshold: .2 })

  for (const video of videos) {
    const fallback = video.parentElement.querySelector('.be-video-fallback')
    let stallTimer
    const clearStall = () => clearTimeout(stallTimer)
    const showFallback = () => {
      clearStall()
      observer.unobserve(video)
      video.hidden = true
      video.pause()
      fallback.hidden = false
    }
    const isWaiting = () => !video.paused && !video.hidden && video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA
    const watchForStall = () => {
      clearStall()
      if (isWaiting()) stallTimer = setTimeout(() => { if (isWaiting()) showFallback() }, 8000)
    }
    for (const event of ['play', 'waiting', 'stalled']) video.addEventListener(event, watchForStall)
    for (const event of ['playing', 'pause', 'ended']) video.addEventListener(event, clearStall)
    video.addEventListener('error', showFallback)
    video.querySelector('source')?.addEventListener('error', showFallback)
    if (video.hasAttribute('data-autoplay')) observer.observe(video)
  }
}
