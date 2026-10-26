import './home-interactions.css'

export function setupHomeInteractions() {
  if ((location.pathname.replace(/\/$/, '') || '/') !== '/') return
  document.body.classList.add('interactive-home')
  document.querySelectorAll('section').forEach(section => {
    if ([...section.querySelectorAll('h2')].some(h => h.textContent.replace(/\s/g, '') === 'Latelyvibecoding')) section.remove()
  })
  const sections = name => [...document.querySelectorAll(`section[data-framer-name="${name}"]`)]
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const titles = ['Look what I made!', 'My not-so secret sauce', 'Things made me blush']
  const observer = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('heading-arrived'); observer.unobserve(e.target) }
  }), {threshold: .5})
  document.querySelectorAll('h2').forEach(h => {
    const title = titles.find(t => t.replace(/\s/g,'') === h.textContent.replace(/\s/g,''))
    if (!title) return
    h.textContent = ''; h.classList.add('playful-heading'); h.setAttribute('aria-label',title)
    title.split(' ').forEach((word,i) => {
      const span=document.createElement('span'); span.textContent=word; span.setAttribute('aria-hidden','true'); span.style.setProperty('--word',i); h.append(span,document.createTextNode(' '))
    }); observer.observe(h)
  })
  const companies = [
    ['Blinkit','blinkit.svg','Currently the sole designer on the delivery partner app — onboarding, the new rider experience, and a reimagined referral program.'],
    ['Uber','uber.svg','Started as an intern on the driver app, then converted to contractor for the supplier portal — trip management for B2B riders taking Uber’s office shuttles. Best team I’ve worked with. 💛'],
    ['HDFC','hdfc.svg','My summer internship, and my first time doing design research outside an academic setting. Also where I finally learned auto layout.']
  ]
  document.querySelectorAll('section').forEach((s,sectionIndex)=>{
    if(![...s.querySelectorAll('.playful-heading')].some(h=>h.getAttribute('aria-label')==='Look what I made!'))return
    s.classList.add('has-company-strip')
    const strip=document.createElement('div');strip.className='company-strip';strip.innerHTML='<p>A few places I’ve designed with</p><div class="company-logos"></div>'
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
  sections('Hero Section').forEach(s=>{
    const actions=[...s.querySelectorAll('a')].filter(a=>/^(Hire Me!|See my Portfolio)$/.test(a.textContent.trim()))
    if(actions.length===2){
      let common=actions[0].parentElement
      while(common && !common.contains(actions[1]))common=common.parentElement
      if(common && common!==s){const row=document.createElement('div');row.className='hero-action-row';row.append(...actions);common.replaceWith(row)}
    }
    const original=s.querySelector('img');if(!original)return
    const frame=original.parentElement;frame.classList.add('portrait-switch');frame.tabIndex=0;frame.setAttribute('role','button');frame.setAttribute('aria-label','Show illustrated portrait');frame.setAttribute('aria-pressed','false')
    const illustration=document.createElement('img');illustration.src='/home-assets/portrait-illustrated.png';illustration.alt='Illustrated portrait of Sanyukta';illustration.className='illustrated-portrait';frame.append(illustration)
    const toggle=()=>{const on=frame.classList.toggle('show-illustration');frame.setAttribute('aria-pressed',String(on))};frame.addEventListener('click',toggle);frame.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}})
  })
  sections('My Experience Section').forEach(s=>{
    s.classList.add('timeline-section')
    s.querySelectorAll('svg use').forEach(use=>{
      if (['#svg11928655256','#svg9612504074','#svg11100914896'].includes(use.getAttribute('href'))) use.closest('[data-framer-component-type="SVG"]')?.remove()
    })
    const list=s.children[1];if(!list)return;list.classList.add('experience-timeline')
    for(const row of [...list.children]) {
      const title=row.querySelector('h3');if(!title)continue
      const paragraphs=[...row.querySelectorAll('p')].map(p=>p.textContent.trim()).filter(Boolean)
      const entry=document.createElement('article');entry.className='timeline-entry'
      const date=document.createElement('p');date.className='timeline-date';date.textContent=paragraphs.find(t=>/^20\d\d/.test(t)) || ''
      const heading=document.createElement('h3');heading.textContent=title.textContent
      const body=document.createElement('p');body.textContent=paragraphs.filter(t=>t!==date.textContent).join(' ')
      entry.append(date,heading,body);row.replaceWith(entry)
    }
  })
  sections('My Experience Section').forEach(s=>{
    const stars=document.createElement('div');stars.className='timeline-margin-stars';stars.setAttribute('aria-hidden','true')
    stars.innerHTML='<span>✧</span><span>✧</span>';s.append(stars)
  })
  sections('About Me Section').forEach(s=>{
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
}
