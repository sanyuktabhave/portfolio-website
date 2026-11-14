import './name-fonts.css'

const names = [
  { lang: 'en', text: 'Sanyukta', font: 'Name en', size: '1em' },
  { lang: 'hi', text: 'संयुक्ता', font: 'Name hi', size: '.9em' },
  { lang: 'ja', text: 'サンユクタ', font: 'Name ja', size: '.82em' },
  { lang: 'ko', text: '산육타', font: 'Name ko', size: '.94em' },
  { lang: 'ta', text: 'சம்யுக்தா', font: 'Name ta', size: '.82em' },
  { lang: 'gu', text: 'સંયુક્તા', font: 'Name gu', size: '.9em' },
  { lang: 'bn', text: 'সংযুক্তা', font: 'Name bn', size: '.9em' },
]

export function setupNameCycle(section) {
  const mark = section.querySelector('.hc-intro h1 mark')
  const text = document.createElement('span')
  text.className = 'hc-name-text'
  mark.classList.add('hc-name-slot')
  mark.setAttribute('aria-hidden', 'true')
  mark.replaceChildren(text)
  section.querySelector('h1').setAttribute('aria-label', 'Hi, I am Sanyukta')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  let index = 0, timer, visible = false, running = false
  function render(name) {
    text.textContent = name.text
    text.lang = name.lang
    text.style.fontFamily = `'${name.font}', sans-serif`
    text.style.fontSize = name.size
  }
  render(names[0])
  // Matched medium-weight subset fonts are local and tiny; they never block the initial English name.
  const ready = names.map(name => document.fonts.load(`500 24px '${name.font}'`, name.text).catch(() => []))
  const schedule = () => {
    clearTimeout(timer)
    if (visible && !document.hidden && !reduced.matches) timer = setTimeout(change, 2600)
  }
  async function change() {
    if (running || !visible || document.hidden || reduced.matches) return
    running = true
    const next = (index + 1) % names.length
    await ready[next]
    if (!visible || document.hidden || reduced.matches) { running = false; return }
    await text.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-4px)' }], { duration: 160, fill: 'forwards', easing: 'ease-in' }).finished.catch(() => {})
    if (reduced.matches) { text.getAnimations().forEach(a => a.cancel()); render(names[0]); running = false; return }
    const oldWidth=mark.getBoundingClientRect().width
    index = next
    render(names[index])
    const newWidth=text.getBoundingClientRect().width
    mark.style.width=`${oldWidth}px`
    text.getAnimations().forEach(a => a.cancel())
    const resize=mark.animate([{width:`${oldWidth}px`},{width:`${newWidth}px`}],{duration:460,fill:'forwards',easing:'cubic-bezier(.22,1,.36,1)'})
    const reveal=text.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,delay:60,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'})
    await Promise.all([resize.finished.catch(()=>{}),reveal.finished.catch(()=>{})])
    resize.cancel()
    mark.style.width=''
    running = false
    schedule()
  }
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting
    schedule()
  }, { threshold: .15 })
  observer.observe(section)
  document.addEventListener('visibilitychange', schedule)
  reduced.addEventListener('change', () => {
    clearTimeout(timer)
    if (reduced.matches) { text.getAnimations().forEach(a => a.cancel()); mark.getAnimations().forEach(a=>a.cancel()); mark.style.width=''; index = 0; render(names[0]) }
    else schedule()
  })
}
