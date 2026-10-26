import './liquid-buttons.css'
// One visual surface per control: exported Framer buttons sometimes contain a
// second button and several decorative backgrounds inside their actual link.
export function setupLiquidButtons() {
  const cta = /^(Hire Me!?|Contact Me|See my Portfolio|View Case Study|See Project|Back to projects.*|Back to portfolio.*)$/
  for (const button of [...document.querySelectorAll('button,a,[role="button"]')]) {
    if (!button.isConnected || button.matches('.memory-card,.portrait-switch,.company-logo-button,[data-enlarge]') || button.closest('svg')) continue
    if (button.parentElement.closest('.liquid-button')) continue
    const label = button.textContent.trim()
    if (button.tagName === 'A' && !cta.test(label) && !button.classList.contains('project-case-button')) continue
    if (!label && !button.getAttribute('aria-label')) continue
    if (cta.test(label)) {
      button.replaceChildren()
      const text=document.createElement('span');text.className='liquid-label';text.textContent=label;button.append(text)
      button.classList.remove('micro-button')
      button.classList.add('unified-cta')
      if (/^Hire Me/.test(label)) button.classList.add('unified-cta-dark')
      // Preserve rounded clipping on the control, but let its shadow and focus
      // ring extend through the old fixed-size layout wrappers.
      let parent=button.parentElement
      while(parent && !parent.matches('section,header,footer,body,[data-framer-root]')) {
        parent.classList.add('button-layout-container')
        parent=parent.parentElement
      }
    }
    button.classList.add('liquid-button','liquid-host')
    if (getComputedStyle(button).position === 'static') button.style.position='relative'
    const layer=document.createElement('span');layer.className='liquid-surface';layer.setAttribute('aria-hidden','true');button.append(layer)
  }
}
