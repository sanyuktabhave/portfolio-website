// Soft drifting light inspired by React Bits' Glow Cursor, tuned for a light portfolio.
// This 2D version avoids a continuous full-screen fluid simulation on reading pages.
export function setupGlowCursor() {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)')
  const mouse=matchMedia('(hover: hover) and (pointer: fine)')
  let cleanup=()=>{}
  const mount=()=>{
    cleanup()
    if(reduced.matches || !mouse.matches)return
    const canvas=document.createElement('canvas');canvas.className='portfolio-glow';canvas.setAttribute('aria-hidden','true')
    const ctx=canvas.getContext('2d');if(!ctx)return
    document.body.append(canvas)
    let particles=[],previous=null,frame=0,lastStamp=0
    const resize=()=>{const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);particles=[];previous=null}
    const draw=now=>{
      ctx.clearRect(0,0,innerWidth,innerHeight)
      particles=particles.filter(p=>now-p.time<850)
      for(const p of particles){
        const age=(now-p.time)/850,fade=(1-age)**2,radius=16+age*29
        const x=p.x+p.vx*age,y=p.y-18*age+p.vy*age
        const glow=ctx.createRadialGradient(x,y,0,x,y,radius)
        glow.addColorStop(0,`rgba(255,235,185,${.28*fade})`)
        glow.addColorStop(.28,`rgba(${p.color},${.24*fade})`)
        glow.addColorStop(1,`rgba(${p.color},0)`)
        ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill()
      }
      frame=particles.length?requestAnimationFrame(draw):0
    }
    const move=e=>{
      if(e.pointerType==='touch'||document.hidden)return
      const now=performance.now();if(now-lastStamp<14)return;lastStamp=now
      const dx=previous?e.clientX-previous.x:0,dy=previous?e.clientY-previous.y:0
      const steps=Math.min(6,Math.max(1,Math.ceil(Math.hypot(dx,dy)/12)))
      for(let i=1;i<=steps;i++)particles.push({x:e.clientX-dx*(1-i/steps),y:e.clientY-dy*(1-i/steps),vx:Math.max(-22,Math.min(22,dx))*.5,vy:Math.max(-15,Math.min(15,dy))*.4,time:now,color:Math.floor(now/650)%2?'211,150,190':'173,155,217'})
      particles=particles.slice(-85);previous={x:e.clientX,y:e.clientY};if(!frame)frame=requestAnimationFrame(draw)
    }
    const reset=()=>{previous=null;particles=[];cancelAnimationFrame(frame);frame=0;ctx.clearRect(0,0,innerWidth,innerHeight)}
    resize();addEventListener('pointermove',move,{passive:true});addEventListener('resize',resize);addEventListener('blur',reset);document.addEventListener('visibilitychange',reset);document.addEventListener('pointerleave',reset)
    cleanup=()=>{reset();canvas.remove();removeEventListener('pointermove',move);removeEventListener('resize',resize);removeEventListener('blur',reset);document.removeEventListener('visibilitychange',reset);document.removeEventListener('pointerleave',reset)}
  }
  reduced.addEventListener('change',mount);mouse.addEventListener('change',mount);mount()
}
