import { useEffect, useState } from 'react'

// Hash routing keeps the site deployable on any static host (GitHub Pages included)
// without server rewrite rules.

export function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/')

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.slice(1) || '/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return route
}

export function navigate(to) {
  window.location.hash = to
}
