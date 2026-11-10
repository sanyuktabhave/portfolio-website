// Reusable zoomable lightbox.
//
// The Blinkit case study ships its own lightbox baked into its markup
// (`[data-enlarge]` buttons + a dialog). This is the equivalent for pages
// whose markup is generated, where the trigger has to be attached to the
// image itself.
export function setupLightbox({ images, label = 'Enlarge image' } = {}) {
  const targets = [...new Set(images)].filter(Boolean)
  if (!targets.length) return () => {}

  const dialog = document.createElement('dialog')
  dialog.className = 'lb-dialog'
  dialog.innerHTML = `
    <div class="lb-bar">
      <button type="button" class="lb-zoom" aria-pressed="false">Zoom in +</button>
      <button type="button" class="lb-close" aria-label="Close image">Close ✕</button>
    </div>
    <div class="lb-scroll"><img class="lb-image" alt=""></div>
    <p class="lb-caption"></p>`
  document.body.append(dialog)

  const scroll = dialog.querySelector('.lb-scroll')
  const full = dialog.querySelector('.lb-image')
  const zoom = dialog.querySelector('.lb-zoom')
  const caption = dialog.querySelector('.lb-caption')
  let trigger = null
  let priorOverflow = ''

  const setZoom = on => {
    scroll.classList.toggle('is-zoomed', on)
    zoom.textContent = on ? 'Fit image −' : 'Zoom in +'
    zoom.setAttribute('aria-pressed', String(on))
  }

  function open(image) {
    trigger = image
    full.src = image.currentSrc || image.src
    full.alt = image.alt || ''
    caption.textContent = image.alt || ''
    caption.hidden = !image.alt
    setZoom(false)
    scroll.scrollTo(0, 0)
    priorOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
  }

  zoom.addEventListener('click', () => setZoom(!scroll.classList.contains('is-zoomed')))
  dialog.querySelector('.lb-close').addEventListener('click', () => dialog.close())
  // Clicking the backdrop (but not the image itself) closes.
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close() })
  dialog.addEventListener('close', () => {
    document.body.style.overflow = priorOverflow || ''
    full.removeAttribute('src')
    trigger?.focus()
  })

  const onClick = event => open(event.currentTarget)
  const onKey = event => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    open(event.currentTarget)
  }

  for (const image of targets) {
    image.classList.add('lb-target')
    image.tabIndex = 0
    image.setAttribute('role', 'button')
    image.setAttribute('aria-label', image.alt ? `${label}: ${image.alt}` : label)
    image.addEventListener('click', onClick)
    image.addEventListener('keydown', onKey)
  }

  return () => {
    for (const image of targets) {
      image.classList.remove('lb-target')
      image.removeAttribute('role')
      image.removeAttribute('tabindex')
      image.removeEventListener('click', onClick)
      image.removeEventListener('keydown', onKey)
    }
    dialog.remove()
  }
}
