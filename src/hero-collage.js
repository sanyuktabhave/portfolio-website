import './hero-collage.css'
import { setupCrayonHandwriting } from './crayon-handwriting.js'

export function setupHeroCollage() {
  document.body.classList.add('has-collage-hero')
  document.querySelectorAll('section.compact-hero').forEach((section, index) => {
    section.classList.add('collage-hero')
    const leaf = (id,x,y,w,h,flip=false) => `<div class="hc-leaf" style="left:${x/12}%;top:${y/6.88}%;width:${w/12}%;height:${h/6.88}%;${flip?'scale:-1 1;':''}"><div class="hc-crop ${id ? `hc-motion-${id}` : ''}"><img src="/hero-collage/leaves.webp" alt=""></div></div>`
    const doodles=['orange','pink','purple','spiral','swoosh','green'].map((name,i)=>`<span class="hc-crayon-doodle hc-doodle-${name}" aria-hidden="true"><span style="--col:${i%3};--row:${Math.floor(i/3)}"></span></span>`).join('')
    section.innerHTML = `<div class="hc-scene">
      <div class="hc-texture" aria-hidden="true"></div>
      <div class="hc-girl"><video poster="/hero-collage/girl-poster.webp" autoplay muted loop playsinline preload="auto" aria-label="Illustrated Sanyukta drawing at her laptop with her cat"><source src="/hero-collage/girl.webm" type="video/webm"></video></div>
      <div class="hc-note"><div class="hc-intro"><h1 class="hc-crayon-title" aria-label="I am Sanyukta"><img class="hc-crayon-name" src="/hero-lettering/name.webp" width="1825" height="862" alt="I am Sanyukta" fetchpriority="high" decoding="async">${doodles}</h1><p>I have experience designing mobility and transport experiences. I’m currently working on my thesis on the visual anatomy of Indian scripts and their evolution at IIT Jodhpur.</p></div></div>
      ${leaf(null,-80,500,340,297)}${leaf(null,940,500,340,297,true)}
    </div>
    `
    setupCrayonHandwriting(section)
    const video=section.querySelector('video')
    const reduced=matchMedia('(prefers-reduced-motion: reduce)')
    const sync=()=>{if(reduced.matches)video.pause();else video.play().catch(()=>{})}
    video.addEventListener('loadeddata',sync)
    reduced.addEventListener('change',sync)
    sync()
  })
}
