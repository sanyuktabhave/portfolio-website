import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const LightboxContext = createContext(null)

export function useLightbox() {
  const ctx = useContext(LightboxContext)
  if (!ctx) throw new Error('useLightbox must be used inside <LightboxProvider>')
  return ctx
}

export function LightboxProvider({ children }) {
  // Figures register themselves on mount so arrow keys can walk the whole page.
  const [items, setItems] = useState([])
  const [index, setIndex] = useState(null)

  const register = useCallback((item) => {
    setItems((prev) => (prev.some((i) => i.src === item.src) ? prev : [...prev, item]))
  }, [])

  const open = useCallback((src) => {
    setIndex((prev) => {
      const next = items.findIndex((i) => i.src === src)
      return next === -1 ? prev : next
    })
  }, [items])

  const close = useCallback(() => setIndex(null), [])
  const step = useCallback(
    (dir) => setIndex((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length]
  )

  useEffect(() => {
    if (index === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [index, close, step])

  const value = useMemo(() => ({ register, open }), [register, open])
  const current = index === null ? null : items[index]

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {current && (
        <div className="lb" role="dialog" aria-modal="true" aria-label={current.alt || 'Image viewer'}>
          <div className="lb__scrim" onClick={close} />
          <button className="lb__close" onClick={close} aria-label="Close" data-cursor="link">×</button>
          <button
            className="lb__nav lb__nav--prev"
            onClick={() => step(-1)}
            aria-label="Previous image"
            data-cursor="link"
          >
            ←
          </button>
          <figure className="lb__frame" key={current.src}>
            <img src={current.src} alt={current.alt || ''} />
            {current.cap && <figcaption>{current.cap}</figcaption>}
          </figure>
          <button
            className="lb__nav lb__nav--next"
            onClick={() => step(1)}
            aria-label="Next image"
            data-cursor="link"
          >
            →
          </button>
          <div className="lb__count">
            {index + 1} / {items.length}
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  )
}
