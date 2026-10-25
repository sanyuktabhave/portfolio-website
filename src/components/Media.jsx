import { useEffect } from 'react'
import { useLightbox } from './Lightbox'
import { useReveal } from '../lib/hooks'

export function Figure({ src, cap, alt, className = '', zoom = true }) {
  const { register, open } = useLightbox()
  const [ref, seen] = useReveal()

  useEffect(() => {
    if (zoom) register({ src, alt, cap })
  }, [zoom, src, alt, cap, register])

  return (
    <figure ref={ref} className={`media reveal reveal--up ${seen ? 'is-in' : ''} ${className}`}>
      <button
        className="media__btn"
        onClick={zoom ? () => open(src) : undefined}
        disabled={!zoom}
        data-cursor={zoom ? 'view' : undefined}
        aria-label={zoom ? `Enlarge: ${alt || cap || 'image'}` : undefined}
      >
        <img src={src} alt={alt || cap || ''} loading="lazy" />
      </button>
      {cap && <figcaption className="figcap">{cap}</figcaption>}
    </figure>
  )
}

export function Video({ src, label, className = '' }) {
  const [ref, seen] = useReveal()

  return (
    <figure ref={ref} className={`media media--video reveal reveal--up ${seen ? 'is-in' : ''} ${className}`}>
      <video src={src} autoPlay muted loop playsInline preload="metadata" aria-label={label} />
    </figure>
  )
}
