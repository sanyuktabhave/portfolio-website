// Reveal the supplied raster lettering along pen strokes without changing its texture.
const strokes = [
  { clip: '0,320 350,320 350,815 0,815', width: 128, duration: 580,
    d: 'M290 425 C245 335 102 400 131 477 C151 536 286 538 292 639 C308 743 97 775 96 645' },
  { clip: '345,340 571,340 600,720 345,720', width: 105, duration: 380,
    d: 'M395 454 C502 359 550 459 529 563 C506 673 382 697 391 590 C401 518 509 510 530 567 L552 639' },
  { clip: '560,330 785,330 800,660 585,665', width: 96, duration: 340,
    d: 'M607 408 L628 599 M626 468 C677 369 742 375 748 499 L753 595' },
  { clip: '780,340 1008,340 1008,820 730,820 730,630 800,630', width: 109, duration: 480,
    d: 'M820 403 C808 581 940 553 953 407 L940 649 C934 779 816 777 803 678' },
  { clip: '1000,350 1200,350 1200,680 1000,680', width: 108, duration: 300,
    d: 'M1043 420 L1038 525 C1033 636 1164 639 1163 527 L1159 420' },
  { clip: '1190,250 1405,250 1405,680 1190,680', width: 102, duration: 360,
    d: 'M1258 318 L1230 624 M1348 411 L1242 501 L1338 600' },
  { clip: '1375,250 1585,250 1585,685 1375,685', width: 110, duration: 350,
    d: 'M1468 316 L1421 525 C1394 660 1504 652 1536 550 M1406 422 L1538 409' },
  { clip: '1530,380 1810,380 1810,780 1530,780', width: 108, duration: 410,
    d: 'M1605 463 C1721 370 1742 483 1726 590 C1702 708 1570 702 1598 609 C1617 547 1702 541 1727 590 L1750 697' },
]
// Animate pen lifts separately: one dash animation on several M subpaths produces patches.
const penStrokes = strokes.flatMap(stroke => {
  const parts = stroke.d.match(/M[^M]+/g)
  return parts.map(d => ({ ...stroke, d, duration: stroke.duration / parts.length }))
})
const ns = 'http://www.w3.org/2000/svg'
let nextId = 0
export function setupCrayonHandwriting(section) {
  const original = section.querySelector('.hc-crayon-name')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  if (!original || reduced.matches) return
  const id = `crayon-writing-${nextId++}`
  const svg = document.createElementNS(ns, 'svg')
  svg.setAttribute('viewBox', '0 0 1825 862')
  svg.setAttribute('class', 'hc-crayon-name hc-handwriting')
  svg.setAttribute('aria-hidden', 'true')
  // The top line stays visible. Individual letter clips prevent nearby strokes leaking in.
  svg.innerHTML = `<defs><filter id="${id}-soft-tip" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="2.5"/></filter>${strokes.map((s,i)=>`<clipPath id="${id}-letter-${i}"><polygon points="${s.clip}"/></clipPath>`).join('')}<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="1825" height="862"><rect x="625" y="0" width="580" height="325" fill="white"/><g filter="url(#${id}-soft-tip)">${penStrokes.map(s=>`<g clip-path="url(#${id}-letter-${strokes.findIndex(letter=>letter.clip===s.clip)})"><path d="${s.d}" fill="none" stroke="white" stroke-width="${s.width}" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" opacity="0"/></g>`).join('')}</g><rect class="hc-writing-finish" width="1825" height="862" fill="white" opacity="0"/></mask></defs><image href="${original.getAttribute('src')}" width="1825" height="862" mask="url(#${id})"/>`
  original.replaceWith(svg)
  const art = svg.querySelector('image')
  let played = false
  let animations = []
  const finish = () => {
    animations.forEach(animation => animation.cancel())
    art.removeAttribute('mask')
    svg.dataset.writing = 'complete'
  }
  const observer = new IntersectionObserver(entries => {
    if (played || !entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .5)) return
    played = true
    observer.disconnect()
    if (reduced.matches) { finish(); return }
    svg.dataset.writing = 'playing'
    // Decode before the pen starts so a cold image request cannot hide the animation.
    const ready = new Image()
    ready.src = original.src
    ready.decode().catch(()=>{}).then(() => {
      if (reduced.matches) { finish(); return }
      let delay = 150
      animations = [...svg.querySelectorAll('mask path')].map((path,i) => {
        const animation = path.animate([
          {strokeDashoffset:'1', opacity:0},
          {strokeDashoffset:'.99', opacity:1, offset:.035},
          {strokeDashoffset:'0', opacity:1},
        ], {
          duration:penStrokes[i].duration, delay, easing:'cubic-bezier(.3,.1,.3,1)', fill:'forwards',
        })
        delay += penStrokes[i].duration - 12
        return animation
      })
      Promise.all(animations.map(animation => animation.finished)).then(() => {
        // Blend the last pigment specks into place; never snap off an incomplete mask.
        const settle = svg.querySelector('.hc-writing-finish').animate([{opacity:0},{opacity:1}], {
          duration:220, easing:'ease-out', fill:'forwards',
        })
        animations.push(settle)
        return settle.finished
      }).then(finish).catch(()=>{})
    })
  }, {threshold:.5})
  observer.observe(svg)
  reduced.addEventListener('change', () => { if (reduced.matches) { played = true; observer.disconnect(); finish() } })
}
