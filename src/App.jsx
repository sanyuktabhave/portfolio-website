import { useEffect } from 'react'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import { LightboxProvider } from './components/Lightbox'
import Home from './pages/Home'
import CaseOnboarding from './pages/CaseOnboarding'
import { useRoute } from './lib/router'
import { PROFILE } from './content'

const TITLES = {
  '/': 'Sanyukta Bhave — Product Designer',
  '/case/onboarding': 'Reducing Drop-offs in Delivery Partner Onboarding — Sanyukta Bhave',
}

function NotFound() {
  return (
    <main className="wrap notfound">
      <h1 className="display">Nothing here (yet)</h1>
      <p className="lede">This page doesn&rsquo;t exist. The good stuff is back home.</p>
      <a className="btn btn--ink" href="#/" data-cursor="link">
        Take me back
      </a>
    </main>
  )
}

export default function App() {
  const route = useRoute()

  useEffect(() => {
    document.title = TITLES[route] || `Not found — ${PROFILE.first} ${PROFILE.last}`
    // 'instant' is required here — 'auto' inherits the smooth scroll-behavior
    // from CSS and animates across the whole document on route change.
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [route])

  const isCase = route.startsWith('/case/')

  return (
    <LightboxProvider>
      <Cursor />
      <Nav label={isCase ? 'Viewing work' : 'Sanyukta'} route={route} />

      {route === '/' && <Home />}
      {route === '/case/onboarding' && <CaseOnboarding />}
      {route !== '/' && route !== '/case/onboarding' && <NotFound />}

      <footer className="footer">
        <div className="wrap footer__inner">
          <p className="footer__name">
            {PROFILE.first} {PROFILE.last}
          </p>
          <p className="footer__note">
            {PROFILE.role} · Designed &amp; built from scratch · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </LightboxProvider>
  )
}
