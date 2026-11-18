import './crayon-section-headings.css'

export function setupCrayonSectionHeadings() {
  for (const heading of document.querySelectorAll('h2')) {
    const text = (heading.getAttribute('aria-label') || heading.textContent).trim().replace(/\s+/g, ' ')
    const kind = text === 'Works' ? 'works' : /^Things (that )?made me blush$/i.test(text) ? 'blush' : /^My not.?so.?secret sauce$/i.test(text) ? 'process' : null
    if (!kind) continue
    heading.classList.add('crayon-section-heading', `crayon-section-heading-${kind}`)
    heading.setAttribute('aria-label', text)
    const artwork = document.createElement('img')
    artwork.src = `/hero-lettering/heading-${kind}.webp`
    artwork.width = kind === 'works' ? 2081 : kind === 'process' ? 1824 : 1968
    artwork.height = kind === 'works' ? 755 : kind === 'process' ? 862 : 799
    artwork.alt = ''
    artwork.setAttribute('aria-hidden', 'true')
    artwork.className = 'settling-title-piece'
    artwork.decoding = 'async'
    artwork.loading = 'lazy'
    // The heading keeps its accessible name and existing viewport-entry animation.
    heading.replaceChildren(artwork)
    const decorations = kind === 'works' ? ['ramen', 'orange', 'purple'] : kind === 'blush' ? ['cat', 'pink', 'green'] : ['orange', 'pink', 'purple']
    for (const decoration of decorations) {
      const doodle = document.createElement('span')
      doodle.className = `heading-doodle heading-doodle-${decoration} settling-title-piece`
      doodle.setAttribute('aria-hidden', 'true')
      heading.append(doodle)
    }
  }
}
