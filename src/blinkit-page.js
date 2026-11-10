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
  const nav = page.querySelector('.be-nav')
  const group = nav.querySelector('.be-nav-design-group')
  const toggle = nav.querySelector('.be-design-trigger')
  const subsections = nav.querySelector('#design-subsections')
  const links = [...nav.querySelectorAll('a')]
  const designLinks = [...subsections.querySelectorAll('a')]
  const hoverLayout = matchMedia('(min-width: 1100px) and (hover: hover) and (pointer: fine)')
  let pinned = false
  let hovered = false

  function syncDisclosure() {
    const expanded = pinned || hovered
    toggle.setAttribute('aria-expanded', String(expanded))
    subsections.hidden = !expanded
    page.style.setProperty('--be-nav-height', `${nav.offsetHeight}px`)
  }

  group.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || !hoverLayout.matches) return
    hovered = true
    syncDisclosure()
  })
  group.addEventListener('pointerleave', () => {
    if (subsections.contains(document.activeElement)) return
    hovered = false
    syncDisclosure()
  })
  group.addEventListener('focusout', event => {
    if (!group.contains(event.relatedTarget) && !group.matches(':hover')) {
      hovered = false
      syncDisclosure()
    }
  })
  hoverLayout.addEventListener('change', () => {
    hovered = false
    syncDisclosure()
  })
  nav.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || subsections.hidden) return
    event.preventDefault()
    pinned = hovered = false
    toggle.focus({ preventScroll: true })
    syncDisclosure()
  })

  function syncHash() {
    const hash = location.hash
    pinned = hash === toggle.hash || designLinks.some(link => link.hash === hash)
    hovered = false
    syncDisclosure()
  }
  addEventListener('hashchange', syncHash)
  for (const link of links) {
    link.addEventListener('click', () => {
      pinned = link === toggle || designLinks.includes(link)
      hovered = false
      syncDisclosure()
    })
  }
  syncHash()
  new ResizeObserver(() => page.style.setProperty('--be-nav-height', `${nav.offsetHeight}px`)).observe(nav)

  const targets = links.map(link => ({link, section: page.querySelector(link.hash)})).filter(item => item.section)
  let scheduled = false
  function updateNavigation() {
    scheduled = false
    let active = targets[0]
    const top = Math.min(innerHeight * .35, 200)
    for (const target of targets) {
      if (target.section.getBoundingClientRect().top <= top) active = target
    }
    links.forEach(link => {
      if (link === active?.link) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    })
    toggle.classList.toggle('is-current-group', designLinks.includes(active?.link))
  }
  addEventListener('scroll', () => {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(updateNavigation)
  }, { passive: true })
  addEventListener('resize', updateNavigation)
  updateNavigation()
}
