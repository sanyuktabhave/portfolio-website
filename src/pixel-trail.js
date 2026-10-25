// Lightweight pixel-grid trail inspired by React Bits' Pixel Trail.
export function mountPixelTrail() {
  const canvas = document.createElement('canvas')
  canvas.className = 'pixel-trail'; canvas.setAttribute('aria-hidden','true')
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}
  document.body.append(canvas)
  const cells = new Map(), size = 9, lifetime = 650
  let frame = 0, previous = null
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2)
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr
    ctx.setTransform(dpr,0,0,dpr,0,0); cells.clear(); previous = null
  }
  const draw = now => {
    ctx.clearRect(0,0,innerWidth,innerHeight)
    for (const [key,p] of cells) {
      const age = (now-p.time)/lifetime
      if(age>=1){cells.delete(key);continue}
      ctx.globalAlpha = .65 * (1-age) ** 1.5
      ctx.fillStyle = p.color
      const edge = size * (1-age*.6)
      ctx.fillRect(p.x+(size-edge)/2,p.y+(size-edge)/2,edge,edge)
    }
    ctx.globalAlpha=1
    frame = cells.size ? requestAnimationFrame(draw) : 0
  }
  const stamp = (x,y,time) => {
    const gx=Math.floor(x/size),gy=Math.floor(y/size)
    for(let dx=-1;dx<=1;dx++) for(let dy=-1;dy<=1;dy++) {
      if(Math.abs(dx)+Math.abs(dy)>1) continue
      const key=`${gx+dx}:${gy+dy}`
      cells.set(key,{x:(gx+dx)*size,y:(gy+dy)*size,time,color:['#df79bb','#a09ae9','#78c7e6'][(gx+gy+dx+dy+30000)%3]})
    }
    if(cells.size>450) for(const key of [...cells.keys()].slice(0,cells.size-450))cells.delete(key)
  }
  const move = e => {
    if(e.pointerType==='touch')return
    const now=performance.now(),x=e.clientX,y=e.clientY
    const from=previous || {x,y},distance=Math.hypot(x-from.x,y-from.y)
    const steps=Math.min(32,Math.max(1,Math.ceil(distance/6)))
    for(let i=1;i<=steps;i++)stamp(from.x+(x-from.x)*i/steps,from.y+(y-from.y)*i/steps,now)
    previous={x,y}
    if(!frame)frame=requestAnimationFrame(draw)
  }
  const leave=()=>{previous=null}
  resize();addEventListener('resize',resize);addEventListener('pointermove',move,{passive:true})
  document.addEventListener('pointerleave',leave);addEventListener('blur',leave)
  return ()=>{cancelAnimationFrame(frame);canvas.remove();removeEventListener('resize',resize);removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);removeEventListener('blur',leave)}
}
