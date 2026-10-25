export function setupBlinkitPage() {
  const page = document.querySelector('.blinkit-editorial')
  if (!page) return
  const dialog = page.querySelector('dialog')
  const image = dialog.querySelector('img')
  const scroller = dialog.querySelector('.be-lightbox-scroll')
  const zoom = dialog.querySelector('[data-zoom]')
  let trigger, priorOverflow
  page.querySelectorAll('[data-enlarge]').forEach(button => button.addEventListener('click', () => {
    trigger = button
    image.src = button.dataset.enlarge
    image.alt = button.querySelector('img').alt
    dialog.querySelector('.be-lightbox-caption').textContent = image.alt
    scroller.classList.remove('is-zoomed')
    zoom.textContent = 'Zoom in +'
    zoom.setAttribute('aria-pressed', 'false')
    priorOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
  }))
  zoom.addEventListener('click', () => {
    const enlarged = scroller.classList.toggle('is-zoomed')
    zoom.textContent = enlarged ? 'Fit image −' : 'Zoom in +'
    zoom.setAttribute('aria-pressed', String(enlarged))
  })
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close())
  dialog.addEventListener('close', () => { document.body.style.overflow = priorOverflow || ''; trigger?.focus() })
  const toggle = page.querySelector('.be-design-trigger')
  const subsections = page.querySelector('#design-subsections')
  toggle.addEventListener('click', () => {
    const expanded = true
    toggle.setAttribute('aria-expanded', String(expanded))
    subsections.hidden = !expanded
  })
  if ([...subsections.querySelectorAll('a')].some(link => link.hash === location.hash)) {
    toggle.setAttribute('aria-expanded', 'true')
    subsections.hidden = false
  }
  page.querySelectorAll('.be-nav > .be-wrap > a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false')
      subsections.hidden = true
    })
  })
  const links = [...page.querySelectorAll('.be-nav a')]
  const targets = links.map(link => ({link, section: document.querySelector(link.hash)})).filter(item => item.section)
  let scheduled = false
  const updateNavigation = () => {
    scheduled = false
    let active = targets[0]
    for (const target of targets) {
      if (target.section.getBoundingClientRect().top <= innerHeight * .35) active = target
    }
    links.forEach(link => {
      if (link === active?.link) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    })
  }
  addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation) }
  }, {passive:true})
  addEventListener('resize', updateNavigation)
  updateNavigation()
}
