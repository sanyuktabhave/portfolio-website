// Replay each title when it enters view, then let it settle while the section is read.
export function setupSectionHeadingMotion() {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)')
  const targets=[...document.querySelectorAll('h2')].filter(h=>/^(works?|things (that )?made me blush|my not.?so.?secret sauce|my notes)$/i.test(h.textContent.trim().replace(/\s+/g,' ')))
  const inside=new WeakSet()
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting || entry.intersectionRatio<.35){inside.delete(entry.target);continue}
      if(inside.has(entry.target))continue
      inside.add(entry.target)
      entry.target.dataset.titleVisits=String(Number(entry.target.dataset.titleVisits||0)+1)
      if(reduced.matches)continue
      entry.target.querySelectorAll('.settling-title-piece').forEach((piece,index)=>{
        piece.getAnimations().forEach(animation=>animation.cancel())
        piece.animate([
          {opacity:.25,transform:'translateY(22px) rotate(-2deg)'},
          {opacity:1,transform:'translateY(-3px) rotate(.4deg)',offset:.72},
          {opacity:1,transform:'translateY(0) rotate(0)'}
        ],{duration:650,delay:index*65,easing:'cubic-bezier(.2,.75,.25,1)',fill:'none'})
      })
      entry.target.dataset.titleSettled='true'
    }
  },{threshold:[0,.35],rootMargin:'0px 0px -15px 0px'})
  targets.forEach(heading=>{
    const text=heading.textContent.trim()
    heading.setAttribute('aria-label',text)
    heading.textContent=''
    const pieces=text==='Works'?[...text]:text.split(/\s+/)
    pieces.forEach((text,index)=>{
      const span=document.createElement('span')
      span.className='settling-title-piece';span.textContent=text
      span.setAttribute('aria-hidden','true')
      heading.append(span)
      if(pieces.length>1&&heading.getAttribute('aria-label')!=='Works'&&index<pieces.length-1)heading.append(' ')
    })
    observer.observe(heading)
  })
}
