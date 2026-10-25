export function setupBlinkitNavigation() {
  if (location.pathname.replace(/\/$/, '') !== '/blinkit-onboarding') return
  const toggle = document.querySelector('[data-framer-name="closed"]')
  if (!toggle) return
  toggle.setAttribute('role','button');toggle.setAttribute('aria-label','Open case study navigation');toggle.setAttribute('aria-expanded','false')
  const closeIcon = document.createElement('span')
  closeIcon.className='case-menu-close-icon';closeIcon.setAttribute('aria-hidden','true');toggle.append(closeIcon)
  const menu = document.createElement('nav')
  menu.className='blinkit-reference-menu';menu.hidden=true;menu.setAttribute('aria-label','Case study navigation')
  const links=[['Overview','.framer-rynpi7'],['Impact','.framer-2qab67'],['Research','.framer-1mbhd00'],['Approach','.framer-uczsc5'],['Designs','.framer-egnk3o'],['Portfolio','/']]
  for (const [label,target] of links) {
    const a=document.createElement('a');a.textContent=label
    if(target==='/')a.href='/'
    else {
      const section=document.querySelector(target)
      if(!section)continue
      section.id='blinkit-'+label.toLowerCase();a.href='#'+section.id
    }
    menu.append(a)
  }
  toggle.parentElement.append(menu)
  function setOpen(open){menu.hidden=!open;toggle.classList.toggle('case-menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close case study navigation':'Open case study navigation')}
  toggle.addEventListener('click',()=>setOpen(menu.hidden))
  toggle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setOpen(menu.hidden)}})
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setOpen(false);toggle.focus()}})
  document.addEventListener('click',e=>{if(!toggle.parentElement.contains(e.target))setOpen(false)})
  menu.addEventListener('click',e=>{if(e.target.closest('a'))setOpen(false)})
}
