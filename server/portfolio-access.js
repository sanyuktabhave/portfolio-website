// Only a verifier is stored here. The generated 120-bit password is never committed.
export const accessPolicy = Object.freeze({
  "username": "recruiter",
  "salt": "dbd8d48cfb0d3b52216be4aa0f1a9f4265c9a9f722941e63",
  "passwordHash": "ac4adac8a8d837cd3098233b0a629513946ee08488ebb9b75968ce3751d5956e",
  "expiresAt": "2026-11-22T17:42:00.000Z"
})

export async function isAuthorized(header, policy = accessPolicy) {
  if (!header || header.length > 256 || !/^Basic /i.test(header)) return false
  let credentials
  try { credentials = atob(header.slice(6).trim()) } catch { return false }
  const separator = credentials.indexOf(':')
  if (separator < 0 || credentials.slice(0, separator) !== policy.username) return false
  const password = credentials.slice(separator + 1)
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${policy.salt}:${password}`))
  const hash = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('')
  let mismatch = hash.length ^ policy.passwordHash.length
  for (let index = 0; index < hash.length; index++) mismatch |= hash.charCodeAt(index) ^ policy.passwordHash.charCodeAt(index)
  return mismatch === 0
}

export function protectionActive(now = Date.now(), policy = accessPolicy) {
  return now < Date.parse(policy.expiresAt)
}
