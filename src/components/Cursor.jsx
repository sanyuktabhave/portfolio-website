import { useEffect, useRef } from 'react'
import { useIsTouch } from '../lib/hooks'

/**
 * Two-part cursor: an ink dot that tracks exactly, and a ring that lags behind.
 * Elements can opt into states via `data-cursor="view" | "link" | "drag"`.
 */
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const isTouch = useIsTouch()

  useEffect(() => {
    if (isTouch) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const target = { x: innerWidth / 2, y: innerHeight / 2 }
    const ringPos = { ...target }
    let raf

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`

      const hit = e.target.closest?.('[data-cursor]')
      const state = hit ? hit.dataset.cursor : ''
      if (ring.dataset.state !== state) {
        ring.dataset.state = state
        ring.textContent = state === 'view' ? 'VIEW' : ''
      }
    }

    const loop = () => {
      // Lerp toward the pointer so the ring trails with a bit of weight.
      ringPos.x += (target.x - ringPos.x) * 0.18
      ringPos.y += (target.y - ringPos.y) * 0.18
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    const onLeave = () => { dot.style.opacity = '0'; ring.style.opacity = '0' }
    const onEnter = () => { dot.style.opacity = '1'; ring.style.opacity = '1' }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf)
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  )
}
