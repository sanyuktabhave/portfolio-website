// Individual translate/scale properties preserve the artwork's original rotation.
export function setupHomeDetails() {
  const path = location.pathname.replace(/\/$/, '') || '/'
  if (path !== '/') return

  for (const [index, label] of ['Creative', 'Timeless', 'Edgy'].entries()) {
    const text = [...document.querySelectorAll('p,h2,h3')].find(el => el.textContent.trim() === label)
    const sticker = text?.parentElement?.parentElement?.parentElement
    if (!sticker) continue
    sticker.classList.add('micro-sticker')
    sticker.style.setProperty('--float-duration', `${5.8 + index * .8}s`)
    sticker.style.setProperty('--float-delay', `${index * -1.7}s`)
  }

  for (const grid of document.querySelectorAll('.project-grid-with-blinkit')) {
    for (const card of grid.children) {
      card.classList.add('micro-project-card')
      const image = card.querySelector('.blinkit-project-image,[data-framer-name="Image wrapper"]')
      image?.classList.add('micro-project-image')
      const artwork = image?.querySelector('a[data-framer-name="Image"]') || image?.querySelector('img')
      artwork?.classList.add('micro-project-artwork')
    }
  }
  for (const button of document.querySelectorAll('a,button')) {
    if (/^(View Case Study|See Project|Hire Me!|See my Portfolio)$/.test(button.textContent.trim())) {
      button.classList.add('micro-button')
    }
  }

  // Floating decoration rests when it is outside the viewport or the tab is hidden.
  const stickers = [...document.querySelectorAll('.micro-sticker')]
  const visible = new Set()
  const update = () => stickers.forEach(el => el.classList.toggle('is-floating', visible.has(el) && !document.hidden))
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target))
    update()
  })
  stickers.forEach(el => observer.observe(el))
  document.addEventListener('visibilitychange', update)
}
