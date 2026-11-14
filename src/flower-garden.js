import { gardenUrl,gardenKey } from './garden-config.js'
import { setupFlowerTrail } from './flower-trail.js'
import './flower-garden.css'

const colours=[['Plum','#52233b'],['Pink','#db8dac'],['Gold','#e1ac4b'],['Blue','#7b99c3'],['Green','#76946b']]
const ns='http://www.w3.org/2000/svg',listeners=new Set()
let flowers=[],loadPromise,refreshTimer
const headers={apikey:gardenKey,'Content-Type':'application/json'}
async function request(path,options={}){
  const response=await fetch(`${gardenUrl}/rest/v1/${path}`,{...options,headers:{...headers,...options.headers},signal:AbortSignal.timeout(15000)})
  const data=await response.json().catch(()=>null)
  if(!response.ok)throw new Error(data?.message||'The garden could not connect. Please try again.')
  return data
}
function load(){
  if(!loadPromise)loadPromise=request('garden_flowers?select=id,drawing,created_at&order=created_at.desc&limit=60').then(data=>{flowers=data;listeners.forEach(fn=>fn());return data}).finally(()=>{loadPromise=null})
  return loadPromise
}
function artwork(drawing){
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 320 220');svg.setAttribute('role','img');svg.setAttribute('aria-label','A flower drawn by a visitor')
  for(const stroke of Array.isArray(drawing)?drawing:[]){
    if(!Array.isArray(stroke.points)||!colours.some(c=>c[1]===stroke.color))continue
    const path=document.createElementNS(ns,'path')
    const points=stroke.points.filter(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite))
    if(!points.length)continue
    path.setAttribute('d',`M${points.map(p=>p.join(',')).join(' L')} l.01,.01`)
    path.setAttribute('fill','none');path.setAttribute('stroke',stroke.color);path.setAttribute('stroke-width','4');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');svg.append(path)
  }
  return svg
}
function starterFlower(){
  const drawing=[]
  for(let petal=0;petal<6;petal++){
    const angle=petal*Math.PI/3,points=[]
    for(let i=0;i<=30;i++){const t=i/30*Math.PI*2,r=23+Math.sin(t*3)*.6;const x=Math.cos(t)*r*.65,y=Math.sin(t)*r;points.push([Math.round(160+Math.cos(angle)*24+x*Math.cos(angle)-y*Math.sin(angle)),Math.round(82+Math.sin(angle)*24+x*Math.sin(angle)+y*Math.cos(angle))])}
    drawing.push({color:'#db8dac',points})
  }
  const center=[];for(let i=0;i<=30;i++){const t=i/30*Math.PI*2;center.push([Math.round(160+Math.cos(t)*11),Math.round(82+Math.sin(t)*11)])}
  drawing.push({color:'#e1ac4b',points:center},{color:'#76946b',points:[[160,126],[158,143],[161,165],[157,190]]},{color:'#76946b',points:[[160,160],[141,144],[126,146],[139,160],[160,160]]})
  return drawing
}
export function setupFlowerGarden(){
  if(!refreshTimer)refreshTimer=setInterval(()=>{if(!document.hidden&&[...document.querySelectorAll('.flower-garden')].some(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.bottom>0&&r.top<innerHeight}))load().catch(()=>{})},30000)
  const openGarden=()=>{if(location.hash==='#garden')requestAnimationFrame(()=>[...document.querySelectorAll('.flower-garden')].find(e=>e.offsetWidth>0)?.scrollIntoView({block:'start'}))}
  window.addEventListener('hashchange',openGarden)
  document.querySelectorAll('section[data-framer-name="About Me Section"]').forEach((section,index)=>{
    setupFlowerTrail(section)
    const garden=document.createElement('div');garden.className='flower-garden'
    garden.innerHTML=`<div class="fg-heading"><div><p class="fg-eyebrow">Draw something</p><h3>A garden of hellos.</h3></div><button type="button" class="fg-action fg-open">Leave a flower <span aria-hidden="true">✿</span></button></div>
    <div class="fg-editor" hidden><div class="fg-editor-heading"><h4>Something only you could draw.</h4><button type="button" class="fg-close" aria-label="Close flower drawing">Close ×</button></div><p id="fg-help-${index}">Draw a flower with your mouse or finger, or start with one and make it yours.</p><div class="fg-draw-layout"><div class="fg-paper"><svg class="fg-canvas" viewBox="0 0 320 220" role="img" aria-label="Your flower drawing" aria-describedby="fg-help-${index}"></svg><span class="fg-paper-hint" aria-hidden="true">A little flower goes a long way.</span></div><div class="fg-tools"><div class="fg-colours" role="group" aria-label="Drawing colour">${colours.map(([name,colour],i)=>`<button type="button" class="fg-swatch" style="--swatch:${colour}" data-colour="${colour}" aria-label="Draw with ${name.toLowerCase()}" aria-pressed="${i===0}"></button>`).join('')}</div><button type="button" class="fg-starter">Start with a flower</button><div class="fg-edit-actions"><button type="button" class="fg-undo" disabled>Undo</button><button type="button" class="fg-clear" disabled>Clear</button></div><button type="button" class="fg-action fg-plant" disabled>Plant my flower ↗</button><p class="fg-public-note">Your flower will be visible to everyone. No name or email needed.</p></div></div></div>
    <p class="fg-status" role="status" aria-live="polite">Loading the garden…</p><div class="fg-board" aria-label="Flowers left by visitors"></div><p class="fg-empty" hidden>The first flower could be yours.</p>`
    section.append(garden)
    const editor=garden.querySelector('.fg-editor'),canvas=garden.querySelector('.fg-canvas'),board=garden.querySelector('.fg-board'),status=garden.querySelector('.fg-status'),hint=garden.querySelector('.fg-paper-hint'),plant=garden.querySelector('.fg-plant'),undo=garden.querySelector('.fg-undo'),clear=garden.querySelector('.fg-clear')
    let drawing=[],active=null,colour=colours[0][1],saving=false,noticeUntil=0
    const redraw=()=>{
      canvas.replaceChildren(...artwork(drawing).childNodes)
      plant.disabled=!drawing.length||saving;undo.disabled=!drawing.length||saving;clear.disabled=!drawing.length||saving
      hint.hidden=!!drawing.length
    }
    const renderGarden=()=>{
      board.replaceChildren(...flowers.map((flower,i)=>{
        const item=document.createElement('figure');item.className='fg-flower';item.style.setProperty('--tilt',`${(i%5-2)*1.5}deg`);item.append(artwork(flower.drawing))
        const caption=document.createElement('figcaption');caption.textContent=new Date(flower.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'});item.append(caption);return item
      }))
      garden.querySelector('.fg-empty').hidden=flowers.length>0
      if(Date.now()<noticeUntil)return
      status.textContent=flowers.length?`${flowers.length===60?'Latest 60':flowers.length} little ${flowers.length===1?'hello':'hellos'} planted here.`:'A space for your little hello.'
    }
    listeners.add(renderGarden)
    let loaded=false
    const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!loaded){loaded=true;observer.disconnect();load().catch(()=>{status.textContent='The garden is taking a little longer to load. You can still draw a flower.'})}},{rootMargin:'200px'})
    observer.observe(garden)
    garden.querySelector('.fg-open').addEventListener('click',()=>{editor.hidden=false;garden.querySelector('.fg-starter').focus({preventScroll:true});editor.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})})
    const close=()=>{editor.hidden=true;garden.querySelector('.fg-open').focus({preventScroll:true})}
    garden.querySelector('.fg-close').addEventListener('click',close)
    editor.addEventListener('keydown',event=>{if(event.key==='Escape')close()})
    garden.querySelectorAll('.fg-swatch').forEach(button=>button.addEventListener('click',()=>{colour=button.dataset.colour;garden.querySelectorAll('.fg-swatch').forEach(b=>b.setAttribute('aria-pressed',String(b===button)))}))
    garden.querySelector('.fg-starter').addEventListener('click',()=>{drawing=starterFlower();redraw()})
    undo.addEventListener('click',()=>{drawing.pop();redraw()});clear.addEventListener('click',()=>{drawing=[];redraw()})
    const point=event=>{const r=canvas.getBoundingClientRect();return [Math.max(0,Math.min(320,Math.round((event.clientX-r.left)*320/r.width))),Math.max(0,Math.min(220,Math.round((event.clientY-r.top)*220/r.height)))]}
    canvas.addEventListener('pointerdown',event=>{
      if(event.button!==0||saving)return
      if(drawing.length>=24){status.textContent='A little flower is enough. Undo a stroke to keep drawing.';return}
      active={color:colour,points:[point(event)]};drawing.push(active);canvas.setPointerCapture(event.pointerId);redraw()
    })
    canvas.addEventListener('pointermove',event=>{if(!active||active.points.length>=256)return;const next=point(event),last=active.points.at(-1);if(Math.hypot(next[0]-last[0],next[1]-last[1])<2)return;if(drawing.reduce((sum,s)=>sum+s.points.length,0)>=1600)return;active.points.push(next);redraw()})
    const stop=()=>{active=null};canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop)
    plant.addEventListener('click',async()=>{
      if(saving||!drawing.length)return
      saving=true;plant.textContent='Planting…';redraw();status.textContent='Finding a place for your flower…'
      try{
        const id=await request('rpc/plant_garden_flower',{method:'POST',body:JSON.stringify({drawing})})
        flowers=[{id,drawing:JSON.parse(JSON.stringify(drawing)),created_at:new Date().toISOString()},...flowers].slice(0,60)
        listeners.forEach(fn=>fn());drawing=[];editor.hidden=true;noticeUntil=Date.now()+10000;status.textContent='Your flower is planted. Everyone can see it. Thank you!'
        garden.querySelector('.fg-open').focus({preventScroll:true})
        load().catch(()=>{})
      }catch(error){status.textContent=error.message||'Your flower could not be planted. Please try again.'}
      finally{saving=false;plant.textContent='Plant my flower ↗';redraw()}
    })
  })
  openGarden()
}
