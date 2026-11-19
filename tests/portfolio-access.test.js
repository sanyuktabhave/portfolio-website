import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { accessPolicy, isAuthorized, protectionActive } from '../server/portfolio-access.js'
import middleware from '../middleware.js'

const password = 'a-long-random-test-only-password'
const policy = {
  username: 'recruiter', salt: 'test-salt',
  passwordHash: createHash('sha256').update(`test-salt:${password}`).digest('hex'),
  expiresAt: '2026-11-22T17:42:00.000Z',
}
const auth = value => `Basic ${btoa(value)}`
test('requires the correct username and password, rejects malformed credentials', async () => {
  assert.equal(await isAuthorized(auth(`recruiter:${password}`), policy), true)
  for (const header of [null, '', 'Bearer fake', 'Basic !!!', auth('recruiter'), auth('recruiter:wrong'), auth(`wrong:${password}`)]) {
    assert.equal(await isAuthorized(header, policy), false)
  }
})
test('automatically opens at the expiry boundary', () => {
  const expiry = Date.parse(policy.expiresAt)
  assert.equal(protectionActive(expiry - 1, policy), true)
  assert.equal(protectionActive(expiry, policy), false)
  assert.equal(protectionActive(expiry + 86400000, policy), false)
})
test('every unauthenticated page and asset gets an uncacheable challenge', async () => {
  // Freeze the clock before expiry so this remains a useful regression test later.
  const now = Date.now
  Date.now = () => Date.parse(accessPolicy.expiresAt) - 1000
  try {
    for (const path of ['/', '/blinkit-onboarding', '/assets/main.js', '/hero-lettering/name.webp', '/resume.html']) {
      const response = await middleware(new Request(`https://example.com${path}`))
      assert.equal(response.status, 401)
      assert.match(response.headers.get('www-authenticate'), /^Basic /)
      assert.match(response.headers.get('cache-control'), /no-store/)
      assert.match(response.headers.get('x-robots-tag'), /noindex/)
      assert.equal(response.headers.get('x-middleware-next'), null)
    }
  } finally { Date.now = now }
})
test('expiry allows normal delivery without authentication or noindex', async () => {
  const now = Date.now
  Date.now = () => Date.parse(accessPolicy.expiresAt)
  try {
    const response = await middleware(new Request('https://example.com/blinkit-onboarding'))
    assert.equal(response.headers.get('x-middleware-next'), '1')
    assert.equal(response.headers.get('www-authenticate'), null)
    assert.equal(response.headers.get('x-robots-tag'), null)
  } finally { Date.now = now }
})
