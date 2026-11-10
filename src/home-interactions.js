import './home-interactions.css'
import { availability, gmailContactHref } from './portfolio-contact.js'

export function setupHomeInteractions() {
  if ((location.pathname.replace(/\/$/, '') || '/') !== '/') return
  document.body.classList.add('interactive-home')
  document.querySelectorAll('section').forEach(section => {
    if ([...section.querySelectorAll('h2')].some(h => h.textContent.replace(/\s/g, '') === 'Latelyvibecoding')) section.remove()
  })
  const sections = name => [...document.querySelectorAll(`section[data-framer-name="${name}"]`)]
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const titles = new Map([
    ['Mynot-sosecretsauce', 'My not-so secret sauce'],
    ['Thingsmademeblush', 'Things made me blush'],
  ])
  const observer = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('heading-arrived'); observer.unobserve(e.target) }
  }), {threshold: .5})
  document.querySelectorAll('h2').forEach(h => {
    const title = titles.get(h.textContent.replace(/\s/g,''))
    if (!title) return
    h.textContent = ''; h.classList.add('playful-heading'); h.setAttribute('aria-label',title)
    title.split(' ').forEach((word,i) => {
      const span=document.createElement('span'); span.textContent=word; span.setAttribute('aria-hidden','true'); span.style.setProperty('--word',i); h.append(span,document.createTextNode(' '))
    }); observer.observe(h)
  })
  // Restore the interactive Framer process variants in every responsive layout.
  const processSteps = [
    ['Exploration and confusion', 'I start with curiosity — diving into user needs, context, and data like solving a puzzle. Which also includes lot of calls with product managers and engineers'],
    ['Framing the context', 'I turn insights into clear problem statements, aligned with business and tech goals, which also includes lots of fight and disagreements but most importantly putting all the stakeholders on the same page'],
    ['Create', 'I experiment through sketches, prototypes, and feedback loops — keeping it iterative.'],
    ['Launch & High Fives', 'Everything goes live, invloves lots of testing and the anxiety to see the product developed']
  ]
  document.querySelectorAll('[data-framer-name^="Step 1 -"]').forEach((card, instance) => {
    const copy = card.querySelector('[data-framer-name="Title and Text"]')
    const heading = copy?.querySelector('h3'), body = copy?.querySelector('p')
    const image = card.querySelector('img[alt="Illustration "]')
    if (!heading || !body || !image) return
    const initialImage = image.getAttribute('src')
    const oldTabs = copy.previousElementSibling
    const tabs = document.createElement('div')
    tabs.className = 'process-tabs'; tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'My design process')
    copy.id = `process-panel-${instance}`; copy.setAttribute('role', 'tabpanel')
    let selected = 0
    const buttons = processSteps.map(([title], i) => {
      const button = document.createElement('button')
      button.type = 'button'; button.className = 'process-tab'; button.textContent = i + 1
      button.id = `process-tab-${instance}-${i}`; button.setAttribute('role', 'tab')
      button.setAttribute('aria-label', `${i + 1}: ${title}`); button.setAttribute('aria-controls', copy.id)
      button.addEventListener('click', () => select(i))
      tabs.append(button); return button
    })
    function select(index) {
      selected = index
      buttons.forEach((button, i) => { button.setAttribute('aria-selected', String(i === index)); button.tabIndex = i === index ? 0 : -1 })
      copy.setAttribute('aria-labelledby', buttons[index].id)
      heading.textContent = processSteps[index][0]; body.textContent = processSteps[index][1]
      image.removeAttribute('srcset'); image.src = index ? `/home-assets/process-${index + 1}.png` : initialImage
      image.alt = `${processSteps[index][0]} — original process illustration`
    }
    tabs.addEventListener('keydown', e => {
      const index = e.key === 'ArrowRight' ? (selected + 1) % 4 : e.key === 'ArrowLeft' ? (selected + 3) % 4 : e.key === 'Home' ? 0 : e.key === 'End' ? 3 : null
      if (index === null) return
      e.preventDefault(); select(index); buttons[index].focus()
    })
    oldTabs.replaceWith(tabs); select(0)
  })
  const companies = [
    ['Blinkit','blinkit.svg','Currently the sole designer on the delivery partner app — onboarding, the new rider experience, and a reimagined referral program.'],
    ['Uber','uber.svg','Started as an intern on the driver app, then converted to contractor for the supplier portal — trip management for B2B riders taking Uber’s office shuttles. Best team I’ve worked with. 💛'],
    ['HDFC','hdfc.svg','My summer internship, and my first time doing design research outside an academic setting. Also where I finally learned auto layout.']
  ]
  document.querySelectorAll('section.has-blinkit-project').forEach((s,sectionIndex)=>{
    const grid = s.querySelector('.project-grid-with-blinkit')
    const title = s.querySelector('[data-framer-name="Heading and Label"]')
    if (!grid || !title) return
    s.classList.add('has-company-strip')
    title.className = 'selected-work-title'
    title.innerHTML = '<h2>Selected work</h2>'
    title.removeAttribute('style')
    grid.prepend(title)
    const strip=document.createElement('div');strip.className='company-strip';strip.innerHTML='<p>Places I Have Worked In</p><div class="company-logos"></div>'
    const row=strip.querySelector('.company-logos')
    companies.forEach(([name,asset,copy],i)=>{
      if(i){const star=document.createElement('span');star.className='company-divider';star.textContent='✦';star.setAttribute('aria-hidden','true');row.append(star)}
      const item=document.createElement('div');item.className='company-item'
      const button=document.createElement('button');button.type='button';button.className='company-logo-button';button.setAttribute('aria-label',`My experience at ${name}`);button.setAttribute('aria-expanded','false')
      const logo=document.createElement('img');logo.src=`/home-assets/${asset}`;logo.alt=name;button.append(logo)
      const note=document.createElement('div');note.className='company-note';note.id=`company-note-${sectionIndex}-${i}`;button.setAttribute('aria-controls',note.id);note.setAttribute('role','note')
      const heading=document.createElement('strong');heading.textContent=name;const body=document.createElement('p');body.textContent=copy;note.append(heading,body)
      item.append(button,note);row.append(item)
      const show=on=>{item.classList.toggle('note-open',on);button.setAttribute('aria-expanded',String(on))}
      item.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')show(true)})
      item.addEventListener('pointerleave',()=>show(false))
      button.addEventListener('focus',()=>{if(button.matches(':focus-visible'))show(true)})
      item.addEventListener('focusout',e=>{if(!item.contains(e.relatedTarget))show(false)})
      item.addEventListener('keydown',e=>{if(e.key==='Escape'){show(false);e.stopPropagation()}})
      document.addEventListener('pointerdown',e=>{if(!item.contains(e.target))show(false)})
    });s.prepend(strip)
  })
  for (const oldHeader of document.querySelectorAll('header[data-framer-name="Phone Closed"], header[data-framer-name="Tablet Closed"], header[data-framer-name="Desktop"]')) oldHeader.remove()
  const header = document.createElement('header')
  header.className = 'portfolio-header'
  header.innerHTML = `
    <a class="portfolio-brand" href="/" aria-label="Sanyukta Bhave, home">Sanyukta</a>
    <nav aria-label="Portfolio navigation">
      <a href="/#portfolio">Selected work</a>
      <a class="portfolio-linkedin" href="https://www.linkedin.com/in/sanyuktabhave/" target="_blank" rel="noopener noreferrer" aria-label="Sanyukta Bhave on LinkedIn">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
          <path d="M20.45 2H3.55A1.55 1.55 0 0 0 2 3.55v16.9A1.55 1.55 0 0 0 3.55 22h16.9A1.55 1.55 0 0 0 22 20.45V3.55A1.55 1.55 0 0 0 20.45 2ZM8.08 18.94H5.11V9.39h2.97v9.55ZM6.59 8.09a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.35 10.85h-2.97v-4.65c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.66V9.39h2.85v1.3h.04a3.12 3.12 0 0 1 2.81-1.54c3 0 3.56 1.98 3.56 4.55v5.24Z"/>
        </svg>
      </a>
      <a href="${gmailContactHref}" target="_blank" rel="noopener noreferrer">Contact</a>
    </nav>`
  document.querySelector('#app').prepend(header)

  // Reuse the illustration layers from the original desktop portrait at every breakpoint.
  const originalPortrait = document.querySelector('[data-framer-name="Image Box Area"].framer-7yyc0g')
  const portraitStickers = [
    ['creative', 'Creative', '.framer-drn9mx-container svg'],
    ['edgy', 'Edgy', '.framer-1h224it-container svg'],
    ['timeless', 'Timeless', '.framer-tqofvi-container svg'],
    ['pink', '', '[data-framer-name="Big Pink"] svg'],
    ['yellow', '', '[data-framer-name="Big Yellow"] svg'],
    ['blue', '', '[data-framer-name="Big Blue"] svg'],
  ]
  sections('Hero Section').forEach((section, index) => {
    const original = section.querySelector('img')
    if (!original) return
    const source = original.getAttribute('src')
    section.classList.add('compact-hero')
    section.innerHTML = `
      <div class="portfolio-intro">
        <p class="portfolio-current"><span aria-hidden="true">✦</span> Sanyukta Bhave · Product Designer</p>
        <h1>Making complex<br> workflows <span>simpler.</span></h1>
        <p class="portfolio-value">I design mobility experiences. Currently at <strong>Blinkit</strong>, previously at Uber, and studying XR design at IIT Jodhpur.</p>
        <p class="portfolio-availability">${availability}</p>
      </div>
      <figure class="portfolio-portrait">
        <img src="${source}" alt="Sanyukta Bhave smiling" width="682" height="1024">
      </figure>`
    const portrait = section.querySelector('.portfolio-portrait')
    for (const [name, label, selector] of portraitStickers) {
      const artwork = originalPortrait?.querySelector(selector)?.cloneNode(true)
      if (!artwork) continue
      const sticker = document.createElement('span')
      sticker.className = `portrait-decal portrait-decal-${name}`
      sticker.setAttribute('aria-hidden', 'true')
      if (!artwork.hasAttribute('viewBox')) artwork.setAttribute('viewBox', '0 0 50 50')
      sticker.append(artwork)
      if (label) {
        const caption = document.createElement('span')
        caption.textContent = label
        sticker.append(caption)
      }
      portrait.append(sticker)
    }
    const control = document.createElement('button')
    control.type = 'button'
    control.className = 'portrait-reveal'
    control.setAttribute('aria-label', 'Show LEGO-style portrait')
    control.setAttribute('aria-pressed', 'false')
    control.setAttribute('aria-controls', `lego-portrait-${index}`)
    const lego = document.createElement('img')
    lego.id = `lego-portrait-${index}`
    lego.className = 'portrait-lego'
    lego.alt = ''
    lego.width = 682
    lego.height = 1024
    lego.addEventListener('load', () => portrait.classList.add('has-lego'))
    lego.src = '/home-assets/portrait-lego.jpg'
    control.addEventListener('click', () => {
      const shown = portrait.classList.toggle('show-lego')
      control.setAttribute('aria-pressed', String(shown))
    })
    portrait.append(lego, control)
  })
  const experienceEntries = [
    ['April 2026 – Present', 'Product Designer 1 · Blinkit', 'I design the delivery partner app, including onboarding, the new rider experience, and the referral program.'],
    ['2025 – 2027', 'Master’s in XR design · IIT Jodhpur', 'I’m studying interaction design for extended reality.'],
    ['April 2024 – June 2025', 'Product Design Contractor · Uber', 'I worked on trip management for fleet suppliers and on navigation workflows for drivers of high capacity vehicles.'],
    ['December 2023 – April 2024', 'Product Design Intern · Hyperbots Inc', 'I designed conversational flows for an AI chatbot and contributed to the brand and website.'],
    ['May 2023 – August 2023', 'Product Design Intern · HDFC Bank', 'I worked on PayZapp and researched the needs of merchants using the HDFC merchant app.'],
    ['2020 – 2024', 'Bachelor’s in Interaction Design · JK Lakshmipat University', 'My mentors and peers at JKLU helped shape me as a designer. Thanks to Dr Devanuj for teaching me interaction design, Chandni Naidu for inspiring me to make something of my own, and Prakriti Sharma and Himangi Puri for the projects we created together.'],
  ]
  sections('My Experience Section').forEach(section => {
    section.classList.add('timeline-section')
    section.querySelectorAll('svg use').forEach(use => {
      if (['#svg11928655256','#svg9612504074','#svg11100914896'].includes(use.getAttribute('href'))) use.closest('[data-framer-component-type="SVG"]')?.remove()
    })
    const list = section.children[1]
    if (!list) return
    list.classList.add('experience-timeline')
    list.replaceChildren(...experienceEntries.map(([date, title, summary], index) => {
      const entry = document.createElement('article')
      entry.className = index ? 'timeline-entry' : 'timeline-entry timeline-current'
      const time = document.createElement('p')
      time.className = 'timeline-date'
      time.textContent = date
      const heading = document.createElement('h3')
      heading.textContent = title
      const copy = document.createElement('p')
      copy.textContent = summary
      entry.append(time, heading, copy)
      return entry
    }))
  })
  sections('My Experience Section').forEach(s=>{
    const stars=document.createElement('div');stars.className='timeline-margin-stars';stars.setAttribute('aria-hidden','true')
    stars.innerHTML='<span>✧</span><span>✧</span>';s.append(stars)
  })
  sections('About Me Section').forEach(s=>{
    s.querySelector('a[href^="mailto:"]')?.remove()
    const intro = [...s.querySelectorAll('p')].find(p => p.textContent.includes('Hello! I’m Sanyukta'))
    if (intro) {
      const more = [...s.querySelectorAll('p')].find(p => p.textContent.startsWith('I love collaborating with clients'))
      more?.remove()
      intro.textContent = 'I’m Sanyukta, a product designer at Blinkit. I work on the delivery partner app, and previously designed fleet and driver workflows at Uber. I’m pursuing a master’s in XR design at IIT Jodhpur (2025–2027). ' + availability
    }
    const imgs=[...s.querySelectorAll('img')];if(!imgs.length)return
    let common=imgs[0].parentElement;while(common && !imgs.every(i=>common.contains(i)))common=common.parentElement
    if(!common || common===s)return
    const stack=document.createElement('div');stack.className='memory-stack';stack.setAttribute('aria-label','Draggable personal photos')
    let top=3
    imgs.forEach((img,i)=>{
      const card=document.createElement('button');card.type='button';card.className='memory-card';card.style.setProperty('--angle',`${(i-1)*10}deg`);card.style.setProperty('--offset',`${(i-1)*35}px`);card.setAttribute('aria-label',`Move photo ${i+1}; use arrow keys or drag`)
      const photo=img.cloneNode();photo.removeAttribute('style');photo.draggable=false;photo.alt=`Sanyukta’s personal photo ${i+1}`;card.append(photo);stack.append(card)
      let x=0,y=0,drag=null
      const place=()=>{const bx=Math.max(30,(stack.clientWidth-card.offsetWidth)/2);x=Math.max(-bx,Math.min(bx,x));y=Math.max(-90,Math.min(90,y));card.style.translate=`${x}px ${y}px`}
      card.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,ox:x,oy:y};card.setPointerCapture(e.pointerId);card.style.zIndex=++top;card.classList.add('dragging')})
      card.addEventListener('pointermove',e=>{if(!drag)return;x=drag.ox+e.clientX-drag.x;y=drag.oy+e.clientY-drag.y;place()})
      const stop=()=>{drag=null;card.classList.remove('dragging')};card.addEventListener('pointerup',stop);card.addEventListener('pointercancel',stop)
      card.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();card.style.zIndex=++top;if(e.key==='Home'){x=0;y=0}else{x+=e.key==='ArrowRight'?20:e.key==='ArrowLeft'?-20:0;y+=e.key==='ArrowDown'?20:e.key==='ArrowUp'?-20:0}place()})
    });common.replaceWith(stack)
  })
  sections('Section - Testimonial').forEach(s=>{
    const sources=['/reference-assets/503ec92c687b8018.png','/reference-assets/809a5cb3ab8cfbc3.png','/reference-assets/4f83d1d3a9d7a919.png'];if(!s.querySelector('img'))return
    const heading=[...s.children].find(c=>c.querySelector('h2')) || s.firstElementChild;
    // Keep the original section heading, replace only the static testimonial artwork.
    [...s.children].forEach(c=>{if(c!==heading)c.remove()})
    s.classList.add('testimonial-section')
    const carousel=document.createElement('div');carousel.className='blush-carousel';carousel.setAttribute('aria-roledescription','carousel');carousel.setAttribute('aria-label','Testimonials')
    carousel.innerHTML=`<div class="blush-slides">${sources.map((src,i)=>`<figure class="blush-slide" ${i?'hidden':''}><a href="${src}" target="_blank" rel="noopener noreferrer" aria-label="Read testimonial ${i+1} at full size"><img src="${src}" alt="Testimonial ${i+1} from Sanyukta’s colleagues" loading="lazy"></a></figure>`).join('')}</div><div class="blush-controls"><button type="button" aria-label="Previous testimonial">←</button><span aria-live="polite">1 / ${sources.length}</span><button type="button" aria-label="Next testimonial">→</button></div>`
    let current=0;const slides=[...carousel.querySelectorAll('figure')];const change=step=>{current=(current+step+slides.length)%slides.length;slides.forEach((f,i)=>f.hidden=i!==current);carousel.querySelector('[aria-live]').textContent=`${current+1} / ${slides.length}`;if(!reduced.matches)slides[current].animate([{opacity:.2,translate:'15px 0'},{opacity:1,translate:'0 0'}],{duration:300})}
    const buttons=carousel.querySelectorAll('button');buttons[0].onclick=()=>change(-1);buttons[1].onclick=()=>change(1);carousel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();change(e.key==='ArrowRight'?1:-1)}})
    let touchX=null;carousel.addEventListener('touchstart',e=>touchX=e.touches[0].clientX,{passive:true});carousel.addEventListener('touchend',e=>{if(touchX!==null&&Math.abs(e.changedTouches[0].clientX-touchX)>50)change(e.changedTouches[0].clientX<touchX?1:-1);touchX=null},{passive:true});s.append(carousel)
  })
  // Move the actual sections so reading order and keyboard order match the layout.
  const achievements = sections('Section - Testimonial')
  const experience = sections('My Experience Section')
  const about = sections('About Me Section')
  const process = sections('Section - Process')
  sections('Featured Projects Section').forEach((projects, index) => {
    const heading = projects.querySelector('h2')
    if (heading && heading.textContent.trim() === 'Featured Projects') heading.textContent = 'Other projects'
    // Framer's phone layout also assigns CSS order to the project blocks.
    for (const sibling of projects.parentElement.children) sibling.style.setProperty('order', 'initial', 'important')
    let anchor = projects
    for (const section of [achievements[index], experience[index], about[index], process[index]]) {
      if (!section) continue
      anchor.after(section)
      section.style.setProperty('order', 'initial', 'important')
      anchor = section
    }
  })

}
