import { useScrollProgress } from '../lib/hooks'
import { navigate } from '../lib/router'

export default function Nav({ label = 'Portfolio', route = '/' }) {
  const progress = useScrollProgress()

  // The hash is owned by the router, so the CTA scrolls to the contact section
  // manually rather than relying on a native anchor jump.
  const goToContact = () => {
    const scroll = () =>
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    if (route !== '/') {
      navigate('/')
      requestAnimationFrame(() => requestAnimationFrame(scroll))
    } else {
      scroll()
    }
  }

  return (
    <>
      <div className="progress" aria-hidden="true">
        <div className="progress__bar" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <header className="topbar">
        <a className="brand" href="#/" data-cursor="link">
          {label} <span className="brand__dot" />
        </a>
        <button className="btn btn--ink hire-btn" onClick={goToContact} data-cursor="link">
          Hire me
        </button>
      </header>
    </>
  )
}
