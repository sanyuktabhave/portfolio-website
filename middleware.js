import { next } from '@vercel/functions'
import { accessPolicy, isAuthorized, protectionActive } from './server/portfolio-access.js'

// Match every page and static asset; direct file URLs must also authenticate.
export const config = { matcher: '/:path*' }

const privateHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Vary': 'Authorization',
}

export default async function middleware(request) {
  // Time-based expiry does not depend on a cron job or another deployment.
  if (!protectionActive()) return next()
  if (await isAuthorized(request.headers.get('authorization'))) {
    return next({ headers: privateHeaders })
  }
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Private portfolio · Sanyukta Bhave</title><style>body{margin:0;min-height:100svh;display:grid;place-items:center;background:#fffcef;color:#340019;font:18px/1.65 system-ui,sans-serif}main{max-width:440px;margin:24px;padding:36px;border:1px solid #34001922;border-radius:20px}small{font-size:13px;letter-spacing:.12em;text-transform:uppercase}h1{font-size:32px;line-height:1.2}p{margin-bottom:0}a{color:inherit}</style></head><body><main><small>Sanyukta Bhave</small><h1>A little privacy, for now.</h1><p>This portfolio is temporarily password protected. Use the username and password shared with you in your browser’s sign-in prompt.</p><p><a href="">Try signing in again ↗</a></p></main></body></html>`, {
    status: 401,
    headers: {
      ...privateHeaders,
      'Content-Type': 'text/html; charset=utf-8',
      'WWW-Authenticate': 'Basic realm="Sanyukta portfolio", charset="UTF-8"',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
