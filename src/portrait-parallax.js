// Pointer parallax for the hero portrait: the photo and each sticker layer
// drift by a few pixels as the cursor crosses the hero, which makes the
// collage feel assembled from depth rather than flat.
//
// Progressive enhancement. Nothing moves unless the visitor has a fine
// pointer and has not asked for reduced motion, and every offset is applied
// with a CSS custom property so the stylesheet keeps control of the rest of
// the transform.
const LAYERS = [
  ['.portfolio-portrait > img', 4],
  ['.portrait-decal-pink', 20],
  ['.portrait-decal-yellow', 16],
  ['.portrait-decal-blue', 24],
  ['.portrait-decal-creative', 30],
  ['.portrait-decal-edgy', 26],
  ['.portrait-decal-timeless', 34],
]

export function setupPortraitParallax() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const fine = matchMedia('(hover: hover) and (pointer: fine)')
  let teardown = () => {}

  function mount() {
    teardown()
    const portraits = [...document.querySelectorAll('.portfolio-portrait')]
    if (!portraits.length) return

    // Always clear any offset left over from a previous pointer mode.
    const reset = () => {
      for (const portrait of portraits) {
        for (const [selector] of LAYERS) {
          for (const el of portrait.querySelectorAll(selector)) {
            el.style.removeProperty('--parallax-x')
            el.style.removeProperty('--parallax-y')
          }
        }
        portrait.classList.remove('is-parallax')
      }
    }

    if (reduced.matches || !fine.matches) { reset(); teardown = () => {}; return }

    const tracked = portraits.map(portrait => ({
      portrait,
      layers: LAYERS.flatMap(([selector, depth]) =>
        [...portrait.querySelectorAll(selector)].map(el => ({ el, depth }))),
    })).filter(entry => entry.layers.length)
    if (!tracked.length) { teardown = () => {}; return }

    for (const { portrait } of tracked) portrait.classList.add('is-parallax')

    let frame = 0
    let pointer = null

    const apply = () => {
      frame = 0
      if (!pointer) return
      for (const { portrait, layers } of tracked) {
        const box = portrait.getBoundingClientRect()
        if (!box.width || !box.height) continue
        // -0.5..0.5 relative to the portrait's centre, clamped so a cursor
        // far outside the figure does not keep pushing the layers.
        const dx = Math.max(-1, Math.min(1, (pointer.x - (box.left + box.width / 2)) / (box.width / 2))) / 2
        const dy = Math.max(-1, Math.min(1, (pointer.y - (box.top + box.height / 2)) / (box.height / 2))) / 2
        for (const { el, depth } of layers) {
          el.style.setProperty('--parallax-x', `${(dx * depth).toFixed(2)}px`)
          el.style.setProperty('--parallax-y', `${(dy * depth).toFixed(2)}px`)
        }
      }
    }

    const onMove = event => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      pointer = { x: event.clientX, y: event.clientY }
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const onLeave = () => {
      pointer = null
      if (frame) { cancelAnimationFrame(frame); frame = 0 }
      for (const { layers } of tracked) {
        for (const { el } of layers) {
          el.style.setProperty('--parallax-x', '0px')
          el.style.setProperty('--parallax-y', '0px')
        }
      }
    }

    addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    addEventListener('blur', onLeave)

    teardown = () => {
      removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      removeEventListener('blur', onLeave)
      if (frame) cancelAnimationFrame(frame)
      reset()
    }
  }

  reduced.addEventListener('change', mount)
  fine.addEventListener('change', mount)
  mount()
}
