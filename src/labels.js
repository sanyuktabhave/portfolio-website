// Replace the exported template's generic accessible names with meaningful ones.
export function improveLabels() {
  const text = el => el.textContent.replace(/\s+/g, ' ').trim()
  for (const a of document.querySelectorAll('[aria-label="Footer Link"]')) {
    const label = text(a).replace(/^Porfolio$/, 'Portfolio')
    if (label) a.setAttribute('aria-label', /linkedin/i.test(a.href || label) ? 'LinkedIn profile' : label)
    else a.removeAttribute('aria-label')
  }
  for (const a of document.querySelectorAll('a[aria-label="Social Icon"]')) {
    a.setAttribute('aria-label', /linkedin/i.test(a.href) ? 'Sanyukta on LinkedIn' : 'Social profile')
  }
  // Project thumbnails: describe the project the card belongs to.
  for (const img of document.querySelectorAll('img[alt="Project Image"]')) {
    let card = img.parentElement
    while (card && !card.querySelector('h3') && card !== document.body) card = card.parentElement
    const title = card && card !== document.body ? text(card.querySelector('h3')) : ''
    img.alt = title ? `${title} — project preview` : ''
    const link = img.closest('a')
    if (link && !text(link) && title) link.setAttribute('aria-label', `Open ${title}`)
  }
  for (const img of document.querySelectorAll('img[alt="A young girl smiling"]')) img.alt = 'Portrait of Sanyukta Bhave'
  for (const img of document.querySelectorAll('img[alt="Back Arrow"],img[alt="Next Arrow"]')) img.alt = ''
}
