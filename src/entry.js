// Load case study styles independently from the existing portfolio pages.
const path = location.pathname.replace(/\/$/, '') || '/'
if (path === '/case-studies/first-50-deliveries') {
  import('./first-fifty/mount.tsx')
} else {
  import('./main.js')
}
