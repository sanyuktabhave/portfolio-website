import { contactEmail, contactHref } from './portfolio-contact.js'
import { setupVideoFallbacks } from './video-fallbacks.js'
import { setupGlowCursor } from './glow-cursor.js'
import { setupLiquidButtons } from './liquid-buttons.js'
import { setupHomeInteractions } from './home-interactions.js'
import { setupImpactCounters } from './impact-counters.js'
import { setupBlinkitPage } from './blinkit-page.js'
import { setupHomeDetails } from './home-details.js'
import { setupMotion } from './motion.js'
import './site.css'

// Published portfolio layouts are local, editable HTML/CSS. No hosted Framer
// runtime, telemetry, account, or iframe is required to render the portfolio.
//
// Each layout is a separate dynamic chunk: visiting one route must not download
// the markup and stylesheets of the other three.
const pages = {
  '/blinkit-onboarding': () => import('./pages/blinkit.js'),
  '/': () => import('./pages/home.js'),
  '/creator-ai': () => import('./pages/creator-ai.js'),
  '/tm': () => import('./pages/tm.js'),
}

// Wrapped in an async function rather than using top-level await, which the
// build target does not support (it would drop Safari 14).
async function start() {
  const path = location.pathname.replace(/\/$/, '') || '/'
  const loadPage = pages[path]
  if (!loadPage) {
    document.getElementById('app').innerHTML = '<main class="not-found"><h1>Page not found</h1><a href="/">Back to portfolio</a></main>'
  } else {
    const page = (await loadPage()).default
    document.title = page.title
    document.body.classList.toggle('blinkit-reference-page', path === '/blinkit-onboarding')
    document.getElementById('app').innerHTML = page.html
    if (path === '/') {
      const grid = document.querySelector('.framer-1pteqwh')
      const project = document.createElement('article')
      project.className = 'blinkit-project'
      project.innerHTML = `<div class="blinkit-project-image"><span class="blinkit-company"><img src="/home-assets/blinkit.svg" alt="Blinkit" width="54" height="54"></span><img src="/projects/blinkit-onboarding.png" width="1152" height="592" alt="Blinkit delivery partner onboarding: welcome screen, vehicle selection, and store selection" loading="lazy"></div><div class="blinkit-project-copy"><h3>Reducing Drop-offs in Delivery Partner Onboarding</h3><a class="project-case-button" href="/blinkit-onboarding">View Case Study</a></div>`
      grid.classList.add('project-grid-with-blinkit')
      grid.prepend(project)
      grid.closest('section').classList.add('has-blinkit-project')

      // Share the selected work cards across the original responsive layouts.
      for (const section of document.querySelectorAll('section.framer-1w72wk3, section.framer-16ncxy9')) {
        const legacyGrid = section.querySelector(':scope > [data-framer-name="Container"]')
        legacyGrid.replaceWith(grid.cloneNode(true))
        section.classList.add('has-blinkit-project')
      }
    }
    const root = document.querySelector('[data-framer-root]')
    function updateBreakpoint() {
      if (!root) return
      for (const bp of page.breakpoints) root.classList.toggle(`framer-${bp.hash}`, matchMedia(bp.mediaQuery).matches)
    }
    updateBreakpoint()
    for (const bp of page.breakpoints) matchMedia(bp.mediaQuery).addEventListener('change', updateBreakpoint)

    // Expose a stable settled state for the original entrance animations.
    for (const el of document.querySelectorAll('[data-framer-component-type="RichTextContainer"] span')) {
      if (el.style.opacity && Number(el.style.opacity) < 0.01) el.style.opacity = '1'
    }
    const visible = el => el.getClientRects().length > 0
    const homeTargets = {
      '#portfolio': '.project-grid-with-blinkit > .blinkit-project',
      '#reviews': 'section[data-framer-name="Section - Testimonial"]',
    }
    function scrollToHomeTarget(hash, focus = false) {
      const selector = homeTargets[hash]
      if (path !== '/' || !selector) return
      const target = [...document.querySelectorAll(selector)].find(visible)
      if (!target) return
      if (focus) {
        target.tabIndex = -1
        target.focus({ preventScroll: true })
      }
      target.scrollIntoView({ block: 'start' })
    }
    for (const a of document.querySelectorAll('a')) {
      const label = a.textContent.trim()
      if (path === '/' && new URL(a.href, location.href).pathname.replace(/\/$/, '') === '/creator-ai') {
        a.href = 'https://www.figma.com/deck/JcByCBJO6rSmfZJIFuzVrU/Creator-AI?node-id=4-2624&viewport=-136%2C-13%2C0.63&t=SNKZZ9O51dKOTBLd-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1'
        a.target = '_blank'
      }
      if (label === 'Portfolio' || label === 'Porfolio' || label === 'See my Portfolio') {
        a.href = '/#portfolio'
      }
      if (label === 'Hire Me!' || label === 'Contact Me') {
        a.textContent = 'Contact'
        a.href = contactHref
        a.removeAttribute('target')
      }
      if (label === 'Resume') { a.textContent = 'Resume'; a.href = '/resume.html'; a.removeAttribute('target') }
      if (/^linkedin$/i.test(label) || a.href === 'https://linkedin.com/') a.href = 'https://www.linkedin.com/in/sanyuktabhave/'
      if (label === 'Reviews' && a.closest('footer')) { a.remove(); continue }
      if (a.matches('[aria-label="Social Icon"]') && a.hostname.endsWith('linkedin.com')) {
        a.setAttribute('aria-label', 'Sanyukta Bhave on LinkedIn')
      }
      if (a.matches('[aria-label="Footer Link"]')) {
        if (/^linkedin$/i.test(label)) a.setAttribute('aria-label', 'Sanyukta Bhave on LinkedIn')
        else a.removeAttribute('aria-label')
      }
      if (a.target === '_blank') a.rel = 'noopener noreferrer'
    }
    // Provide keyboard-accessible mobile navigation matching the compact header.
    for (const header of document.querySelectorAll('header[data-framer-name="Phone Closed"],header[data-framer-name="Tablet Closed"]')) {
      const icon = [...header.querySelectorAll('[data-framer-name]')].find(el => /^(menu icon|hamburger|menu)$/i.test(el.dataset.framerName))
      const toggle = icon || header.lastElementChild
      if (!toggle) continue
      toggle.setAttribute('role','button');toggle.tabIndex=0;toggle.setAttribute('aria-label','Open navigation');toggle.setAttribute('aria-expanded','false')
      const menu = document.createElement('nav');menu.className='mobile-menu';menu.hidden=true
      menu.innerHTML = `<a href="/#portfolio">Selected work</a><a href="/resume.html">Resume</a><a href="https://www.linkedin.com/in/sanyuktabhave/">LinkedIn</a><a href="${contactHref}">Contact</a>`
      header.append(menu)
      const flip=()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden));toggle.setAttribute('aria-label',menu.hidden?'Open navigation':'Close navigation')}
      toggle.addEventListener('click',flip)
      toggle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}})
      menu.addEventListener('click', e => { if (e.target.closest('a') && !menu.hidden) flip() })
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !menu.hidden) { flip(); toggle.focus() }
      })
    }
    if (path === '/') {
      const otherArtwork = {
        '7a2c704b6df85c53': 'Hyperbots AI chatbot design',
        '2f15f03125d0983f': 'HDFC Bank summer internship design work',
        '363031ec6553a2b2': 'Character design and illustration from the summer internship',
        'd82637d664ab2834': 'Checkpoint and waypoint design for Uber drivers',
        '2791d75a3dc74cc2': 'HDFC Bank summer internship design work',
        'b405dc8eaf4de157': 'Character design and illustration from the summer internship',
      }
      for (const section of document.querySelectorAll('section[data-framer-name="Featured Projects Section"]')) {
        for (const image of section.querySelectorAll('img')) {
          const key = image.getAttribute('src')?.split('/').pop().split('.')[0]
          if (otherArtwork[key]) image.alt = otherArtwork[key]
        }
        for (const link of section.querySelectorAll('a')) {
          if (link.textContent.trim() !== 'See Project') continue
          const title = link.closest('[data-framer-name="Container"]')?.querySelector('h3')?.textContent.trim() || ''
          if (/character design|hdfc/i.test(title)) {
            link.href = 'https://www.behance.net/gallery/187715663/Summer-Internship23'
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            link.setAttribute('aria-label', `See project on Behance: ${title}`)
          } else if (link.pathname === '/') {
            link.remove()
          } else if (title) {
            link.setAttribute('aria-label', `See project: ${title}`)
          }
        }
      }
      for (const image of document.querySelectorAll('img[alt="Project Image"]')) {
        // Responsive variants also carry hidden illustrations for these projects.
        const aliases = {
          'bada9b489ea912a5': 'Checkpoint and waypoint design for Uber drivers',
          'a627653247c8b19e': 'Hyperbots AI chatbot design',
          '69dedbdc53b87038': 'HDFC Bank internship design work',
          '119d83318617c8fa': 'Uber Fleet supplier portal design',
        }
        const key = image.getAttribute('src')?.split('/').pop().split('.')[0]
        image.alt = aliases[key] || otherArtwork[key] || ''
      }
      for (const card of document.querySelectorAll('.project-grid-with-blinkit > *')) {
        const title = card.querySelector('h3')?.textContent.trim()
        if (!title) continue
        const thumbnail = card.querySelector('[data-framer-name="Image wrapper"] a')
        if (thumbnail) thumbnail.setAttribute('aria-label', `View case study: ${title}`)
        const action = [...card.querySelectorAll('a')].find(a => a.textContent.trim() === 'View Case Study')
        if (action) action.setAttribute('aria-label', `View case study: ${title}`)
      }
      for (const footer of document.querySelectorAll('footer')) {
        for (const wrapper of footer.querySelectorAll('div[aria-label="Footer Link"]')) {
          if (wrapper.textContent.trim() === 'Reviews') wrapper.remove()
          else wrapper.removeAttribute('aria-label')
        }
        for (const link of footer.querySelectorAll('a')) {
          if (/made\s*with\s*blood/i.test(link.textContent)) link.classList.add('footer-credit-link')
        }
      }
      for (const item of document.querySelectorAll('footer p')) {
        if (item.textContent.trim() !== contactEmail) continue
        const link = document.createElement('a')
        link.href = contactHref
        link.className = 'footer-email-link'
        link.textContent = contactEmail
        item.replaceChildren(link)
      }

      document.addEventListener('click', event => {
        const link = event.target.closest('a[href^="/#"]')
        if (!link || !homeTargets[link.hash] || event.defaultPrevented || event.button !== 0 ||
            event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        if (location.hash !== link.hash) history.pushState(null, '', link.hash)
        scrollToHomeTarget(link.hash, true)
      })
      addEventListener('hashchange', () => scrollToHomeTarget(location.hash))
      if (homeTargets[location.hash]) requestAnimationFrame(() => scrollToHomeTarget(location.hash))
    }
  }

  setupHomeDetails()
  setupHomeInteractions()
  setupBlinkitPage()
  setupVideoFallbacks()
  setupImpactCounters()
  if (path !== '/blinkit-onboarding') setupMotion()

  setupLiquidButtons()
  setupGlowCursor()
}

start()
