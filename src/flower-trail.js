export function flowerPhase(now,born){
  const age=Math.max(0,now-born)
  return {age,grow:Math.max(0,Math.min(1,age/180)),fade:Math.max(0,Math.min(1,(1600-age)/900))}
}
const petalColours=['#dca5bb','#e3bd72','#a6b9da','#b3c5a1','#bd9cb8']
export function setupFlowerTrail(section){
  const canvas=document.createElement('canvas')
  canvas.className='about-flower-trail';canvas.setAttribute('aria-hidden','true')
  section.prepend(canvas)
  const ctx=canvas.getContext('2d'),cells=new Map(),reduced=matchMedia('(prefers-reduced-motion: reduce)')
  let width=0,height=0,frame=0,visible=false
  const resize=()=>{const r=section.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  new ResizeObserver(resize).observe(section);resize()
  const draw=now=>{
    frame=0;ctx.clearRect(0,0,width,height)
    for(const [key,cell] of cells){
      const {age,grow,fade}=flowerPhase(now,cell.born)
      if(age>1600){cells.delete(key);continue}
      ctx.save();ctx.translate(cell.x,cell.y);ctx.rotate(cell.turn);ctx.globalAlpha=.7*fade
      const radius=cell.size*grow
      ctx.fillStyle=cell.colour
      for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*Math.PI/3);ctx.beginPath();ctx.ellipse(0,-radius*.5,radius*.34,radius*.55,0,0,Math.PI*2);ctx.fill();ctx.restore()}
      ctx.fillStyle='#fff9e4';ctx.beginPath();ctx.arc(0,0,radius*.23,0,Math.PI*2);ctx.fill();ctx.restore()
    }
    if(cells.size&&visible&&!reduced.matches)frame=requestAnimationFrame(draw)
  }
  const bloom=event=>{
    if(!visible||reduced.matches||event.target.closest('.flower-garden'))return
    const r=section.getBoundingClientRect(),x=event.clientX-r.left,y=event.clientY-r.top
    const gx=Math.round(x/24),gy=Math.round(y/24),now=performance.now()
    for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){
      const cx=(gx+dx)*24,cy=(gy+dy)*24,distance=Math.hypot(cx-x,cy-y)
      if(distance>64)continue
      const key=`${gx+dx}:${gy+dy}`,old=cells.get(key),seed=Math.abs((gx+dx)*73+(gy+dy)*137)
      if(old){old.born=Math.min(old.born+60,now-180);continue}
      cells.set(key,{x:cx,y:cy,born:now,size:4+(1-distance/70)*7,colour:petalColours[seed%petalColours.length],turn:seed%6})
    }
    if(!frame)frame=requestAnimationFrame(draw)
  }
  section.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')bloom(e)},{passive:true})
  section.addEventListener('pointerdown',bloom,{passive:true})
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;cells.clear();ctx.clearRect(0,0,width,height)}},{threshold:0}).observe(section)
  reduced.addEventListener('change',()=>{cells.clear();cancelAnimationFrame(frame);frame=0;ctx.clearRect(0,0,width,height)})
}
