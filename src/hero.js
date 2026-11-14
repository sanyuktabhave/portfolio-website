// Illustrated hero, implemented from the Figma design (file 8B9pSCr2juOhGWmed4gPvL,
// node 43:7036). The design frame is 1200 x 688; every position below is in those
// design pixels and is scaled by --u (one design pixel) so the scene stays
// proportional at any width.

// [class, left, top, width, height, flipped, innerLeft%, innerTop%, innerWidth%, innerHeight%]
const SCENE = [
  ['fig-art', 289, 423, 629, 278, false, -1.6, -67.57, 106.52, 167.59],
  ['fig-leaf fig-leaf-still-l', -48, 166, 406, 355, false, -21.31, -44.24, 257.3, 204.98],
  ['fig-leaf fig-leaf-still-r', 874, 167, 406, 355, true, -21.31, -44.24, 257.3, 204.98],
  ['fig-leaf fig-leaf-1', -48, 300, 521, 455, false, -21.31, -44.24, 257.3, 204.98],
  ['fig-leaf fig-leaf-2', 691, 294, 521, 455, true, -21.31, -44.24, 257.3, 204.98],
  ['fig-leaf fig-leaf-3', 162, 368, 521, 455, false, -21.31, -44.24, 257.3, 204.98],
  ['fig-leaf fig-leaf-4', 481, 362, 521, 455, true, -21.31, -44.24, 257.3, 204.98],
]

// The zigzag whose stroke reveals the crayon texture. Kept inline so the reveal
// can be animated; as an external mask image it would be static.
const SCRIBBLE_PATH = 'M1342.52 102.519L1239.19 159.379L1135.85 102.519L1032.52 159.379L929.186 102.519L825.852 159.379L722.519 102.519L619.186 159.379L515.852 102.519L412.519 159.379L309.186 102.519L205.852 159.379L102.519 102.519V214.209L205.852 271.069L309.186 214.209L412.519 271.069L515.852 214.209L619.186 271.069L722.519 214.209L825.852 271.069L929.186 214.209L1032.52 271.069L1135.85 214.209L1239.19 271.069L1342.52 214.209V325.899L1239.19 382.759L1135.85 325.899L1032.52 382.759L929.186 325.899L825.852 382.759L722.519 325.899L619.186 382.759L515.852 325.899L412.519 382.759L309.186 325.899L205.852 382.759L102.519 325.899V437.589L205.852 494.449L309.186 437.589L412.519 494.449L515.852 437.589L619.186 494.449L722.519 437.589L825.852 494.449L929.186 437.589L1032.52 494.449L1135.85 437.589L1239.19 494.449L1342.52 437.589V549.279L1239.19 606.139L1135.85 549.279L1032.52 606.139L929.186 549.279L825.852 606.139L722.519 549.279L619.186 606.139L515.852 549.279L412.519 606.139L309.186 549.279L205.852 606.139L102.519 549.279V660.969L205.852 717.829L309.186 660.969L412.519 717.829L515.852 660.969L619.186 717.829L722.519 660.969L825.852 717.829L929.186 660.969L1032.52 717.829L1135.85 660.969L1239.19 717.829L1342.52 660.969V772.659L1239.19 829.519L1135.85 772.659L1032.52 829.519L929.186 772.659L825.852 829.519L722.519 772.659L619.186 829.519L515.852 772.659L412.519 829.519L309.186 772.659L205.852 829.519L102.519 772.659'

const box = ([cls, x, y, w, h, flip, il, it, iw, ih], src, alt = '') => `
  <div class="${cls}${flip ? ' is-flipped' : ''}" style="--x:${x};--y:${y};--w:${w};--h:${h}">
    <img src="${src}" alt="${alt}" style="--il:${il}%;--it:${it}%;--iw:${iw}%;--ih:${ih}%" loading="eager" decoding="async">
  </div>`

export function renderFigmaHero(section) {
  section.className = 'fig-hero'
  section.removeAttribute('style')
  section.innerHTML = `
   <div class="fig-hero-stage">
    <div class="fig-hero-wash" aria-hidden="true"></div>
    <svg class="fig-hero-scribble" viewBox="117.928 101.11 1209.183 693.265" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <mask id="fig-hero-scribble-mask" maskUnits="userSpaceOnUse" x="117.928" y="101.11" width="1209.183" height="693.265">
          <path class="fig-hero-scribble-path" d="${SCRIBBLE_PATH}" pathLength="1" fill="none" stroke="#fff" stroke-width="205" stroke-linecap="round" stroke-linejoin="round"></path>
        </mask>
      </defs>
      <image href="/hero-assets/crayon-texture.webp" x="117.928" y="101.11" width="1209.183" height="693.265" preserveAspectRatio="xMidYMid slice" mask="url(#fig-hero-scribble-mask)"></image>
    </svg>
    <img class="fig-hero-crayon" src="/hero-assets/crayon.webp" alt="" aria-hidden="true" decoding="async">
    ${box(SCENE[0], '/hero-assets/artwork-centre.webp')}
    ${SCENE.slice(1).map(item => box(item, '/hero-assets/leaf.webp')).join('')}
    <div class="fig-hero-card" aria-hidden="true"><img src="/hero-assets/paper-card.svg" alt="" decoding="async"></div>
    <div class="fig-hero-copy">
      <h1><span class="fig-hero-mark-wrap"><span class="fig-hero-mark" aria-hidden="true"></span><span class="fig-hero-words">Hi, I am <em>Sanyukta</em></span></span></h1>
      <p>I design mobility experiences. Currently at <strong>Blinkit</strong>, previously at Uber, and studying XR design at IIT Jodhpur.</p>
    </div>
   </div>`
  return section
}
