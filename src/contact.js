export const EMAIL = 'sanyuktawork39@gmail.com'
export const MAILTO = `mailto:${EMAIL}`

const visible = el => el && el.getClientRects().length && getComputedStyle(el).display !== 'none'

// Land directly on the first project card, not on the section heading above it.
export function scrollToWork() {
  const grid = [...document.querySelectorAll('.project-grid-with-blinkit')].find(visible)
  if (!grid) return
  grid.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', '/#portfolio')
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true } catch {}
  // Fallback for browsers without the async clipboard API.
  const field = Object.assign(document.createElement('textarea'), { value: text })
  field.setAttribute('readonly', ''); field.style.cssText = 'position:fixed;opacity:0'
  document.body.append(field); field.select()
  let ok = false
  try { ok = document.execCommand('copy') } catch {}
  field.remove()
  return ok
}

export function copyEmailButton(label = 'Copy email') {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'copy-email'
  button.setAttribute('aria-label', `Copy email address ${EMAIL}`)
  const text = document.createElement('span'); text.textContent = label
  const status = document.createElement('span'); status.className = 'visually-hidden'; status.setAttribute('aria-live', 'polite')
  button.append(text, status)
  let timer
  button.addEventListener('click', async () => {
    const ok = await copy(EMAIL)
    text.textContent = ok ? 'Copied!' : EMAIL
    status.textContent = ok ? 'Email address copied' : `Email address: ${EMAIL}`
    button.classList.toggle('is-copied', ok)
    clearTimeout(timer)
    timer = setTimeout(() => { text.textContent = label; status.textContent = ''; button.classList.remove('is-copied') }, 2200)
  })
  return button
}
