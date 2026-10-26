import { setupGlowCursor } from './glow-cursor.js'
import { setupLiquidButtons } from './liquid-buttons.js'
import { setupHomeInteractions } from './home-interactions.js'
import { setupImpactCounters } from './impact-counters.js'
import { setupBlinkitPage } from './blinkit-page.js'
import blinkitCSS from './blinkit-editorial.css?raw'
import { setupHomeDetails } from './home-details.js'
import blinkitHTML from './blinkit.html?raw'
import { setupMotion } from './motion.js'
import homeHTML from './reference/home.html?raw'
import homeCSS from './reference/home.css?raw'
import homeBreakpoints from './reference/home.json'
import creatorHTML from './reference/creator-ai.html?raw'
import creatorCSS from './reference/creator-ai.css?raw'
import creatorBreakpoints from './reference/creator-ai.json'
import tripHTML from './reference/tm-rendered.html?raw'
import tripCSS from './reference/tm.css?raw'
import tripBreakpoints from './reference/tm.json'
import './site.css'

// Published portfolio layouts are local, editable HTML/CSS. No hosted Framer
// runtime, telemetry, account, or iframe is required to render the portfolio.
const pages = {
  '/blinkit-onboarding': {html:blinkitHTML,css:blinkitCSS,breakpoints:[],title:'Blinkit Onboarding — Sanyukta Bhave'},
  '/': {html: homeHTML, css: homeCSS, breakpoints: homeBreakpoints, title: 'Sanyukta Bhave — Product Designer'},
  '/creator-ai': {html: creatorHTML, css: creatorCSS, breakpoints: creatorBreakpoints, title: 'Creator AI — Sanyukta Bhave'},
  '/tm': {html: tripHTML, css: tripCSS, breakpoints: tripBreakpoints, title: 'Trip Management — Sanyukta Bhave'},
}
const path = location.pathname.replace(/\/$/, '') || '/'
const page = pages[path]
if (!page) {
  document.getElementById('app').innerHTML = '<main class="not-found"><h1>Page not found</h1><a href="/">Back to portfolio</a></main>'
} else {
  document.title = page.title
  document.body.classList.toggle('blinkit-reference-page', path === '/blinkit-onboarding')
  const style = document.createElement('style')
  style.textContent = page.css
  document.head.append(style)
  document.getElementById('app').innerHTML = page.html
  if (path === '/') {
    for (const section of document.querySelectorAll('section[data-framer-name="Section - Projects"]')) {
      if (!section.textContent.includes('View Case Study')) continue
      section.classList.add('has-blinkit-project')
      const project = document.createElement('article')
      project.className = 'blinkit-project'
      project.innerHTML = `<div class="blinkit-project-image"><span class="blinkit-company">blinkit</span><img src="/projects/blinkit-onboarding.png" width="1152" height="592" alt="Blinkit delivery partner onboarding: welcome screen, vehicle selection, and store selection" loading="lazy"></div><div class="blinkit-project-copy"><h3>Reducing Drop-offs in Delivery Partner Onboarding</h3><a class="project-case-button" href="/blinkit-onboarding">View Case Study</a></div>`
      const grid = section.querySelector('.framer-1pteqwh') || section.children[1]
      grid.classList.add('project-grid-with-blinkit')
      grid.prepend(project)
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
  for (const v of document.querySelectorAll('video')) {
    v.muted = true
    v.playsInline = true
    if (v.autoplay) v.play().catch(() => {})
  }
  // Correct placeholder navigation while preserving the published visual design.
  const visible = el => el && el.getClientRects().length && getComputedStyle(el).display !== 'none'
  const findSection = name => [...document.querySelectorAll('[data-framer-name]')].find(el => el.dataset.framerName === name && visible(el))
  const scrollToSection = name => findSection(name)?.scrollIntoView({behavior: 'smooth', block: 'start'})
  for (const a of document.querySelectorAll('a')) {
    const label = a.textContent.trim()
    if (label === 'Portfolio' || label === 'Porfolio' || label === 'See my Portfolio') {
      a.href = '/#portfolio'
      a.addEventListener('click', e => { if(path === '/') {e.preventDefault();scrollToSection('Section - Projects')} })
    }
    if (label === 'Hire Me!' || label === 'Contact Me') {
      a.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=sanyuktawork39%40gmail.com'
      a.target = '_blank'
    }
    if (label === 'Linkedin' || a.href === 'https://linkedin.com/') a.href = 'https://www.linkedin.com/in/sanyuktabhave/'
    if (label === 'Reviews') {
      a.href = '/#reviews'
      a.addEventListener('click',e=>{if(path==='/'){e.preventDefault();scrollToSection('Section - Testimonial')}})
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
    menu.innerHTML='<a href="/#portfolio">Portfolio</a><a href="https://drive.google.com/file/d/1idadaWzmwQDFvkmgy5-AE-Zk19soHNHG/view?usp=sharing" target="_blank" rel="noopener noreferrer">Resume</a><a href="https://www.linkedin.com/in/sanyuktabhave/">LinkedIn</a><a target="_blank" rel="noopener noreferrer" href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=sanyuktawork39%40gmail.com">Hire Me!</a>'
    header.append(menu)
    const flip=()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden));toggle.setAttribute('aria-label',menu.hidden?'Open navigation':'Close navigation')}
    toggle.addEventListener('click',flip)
    toggle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}})
    menu.addEventListener('click',e=>{if(e.target.closest('a')){menu.hidden=true;toggle.setAttribute('aria-expanded','false');if(e.target.getAttribute('href')==='/#portfolio'){e.preventDefault();scrollToSection('Section - Projects')}}})
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.hidden=true;toggle.setAttribute('aria-expanded','false')}})
  }
  if (location.hash === '#portfolio') requestAnimationFrame(()=>scrollToSection('Section - Projects'))
  if (location.hash === '#reviews') requestAnimationFrame(()=>scrollToSection('Section - Testimonial'))
}

setupHomeDetails()
setupHomeInteractions()
setupBlinkitPage()
setupImpactCounters()
if (path !== '/blinkit-onboarding') setupMotion()

setupLiquidButtons()
setupGlowCursor()
