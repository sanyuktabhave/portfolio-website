const asset = (name, ext = 'png') => `work-folders/${name}.${ext}`
const image = (name, className = '', ext = 'png') => `<img class="${className}" src="${asset(name, ext)}" alt="" draggable="false">`
const creatorLink = 'https://www.figma.com/deck/JcByCBJO6rSmfZJIFuzVrU/Creator-AI?node-id=4-2624&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1'
const collections = [
  { name: 'Blinkit', front: 'imgVector12', logo: 'imgImage19', color: 'yellow', projects: [
    ['Delivery partner onboarding', '/blinkit-onboarding'],
    ['Delivering the first 50 orders', '/case-studies/first-50-deliveries'],
  ] },
  { name: 'Uber', front: 'imgVector13', logo: 'imgImage20', color: 'blue', projects: [
    ['Designing for fleet managers', '/tm'],
    ['Designing for drivers', 'https://www.figma.com/deck/ffdiJq0pG5S5eU4XxkqKFj'],
  ] },
  { name: 'Other projects', front: 'imgVector14', logo: 'imgImage21', color: 'orange', projects: [
    ['Catyukta · Character design', 'https://www.behance.net/gallery/235132075/Catyukta-Character-design'],
    ['Apple Vision Pro · XR micro-interactions', 'https://www.behance.net/gallery/238199471/Micro-interaction-for-vision-pro'],
    ['FLOATFIT · Wardrobe organisation', 'https://www.behance.net/gallery/245908199/FLOATFIT-Wardrobe-That-Adapts-to-Chaos'],
    ['Creator AI', creatorLink],
  ] },
]

function blinkitCards() {
  return `<div class="wf-card wf-onboarding">
    ${image('imgEllipse1', 'wf-glow wf-glow-one', 'svg')}
    ${image('imgEllipse1', 'wf-glow wf-glow-two', 'svg')}
    ${image('imgEllipse2', 'wf-glow wf-glow-three', 'svg')}
    ${image('imgEllipse4', 'wf-glow wf-glow-four', 'svg')}
    <span>Delivery partner<br>onboarding</span>
    <div class="wf-phone-crop">${image('imgImage22')}</div>
  </div>
  <div class="wf-card wf-first-fifty">${image('imgFrame5', 'wf-fifty-paper', 'svg')}<span>Delivering 0–50<br>orders</span>
    ${image('imgEllipse7699', 'wf-rider-shadow', 'svg')}
    <div class="wf-rider-crop">${image('imgImage54532')}</div>
    <div class="wf-rider-badge">${image('imgScreenshot20261101At112737Am1')}</div>
  </div>`
}
function uberCards() {
  return `<div class="wf-card wf-fleet">${image('imgEllipse3', 'wf-glow wf-glow-two', 'svg')}<span>Designing for<br>fleet managers</span><div class="wf-fleet-crop">${image('imgScreenshot20261114At121940Pm1')}</div></div>
  <div class="wf-card wf-driver">${image('imgEllipse3', 'wf-glow wf-glow-two', 'svg')}${image('imgEllipse3', 'wf-glow wf-glow-three', 'svg')}<span>Designing for<br>drivers</span><div class="wf-driver-crop">${image('imgScreenshot20261114At122116Pm1')}</div></div>`
}
function otherCards() {
  return `<div class="wf-mini wf-mini-one">${image('imgScreenshot20261114At123009Pm1')}</div><div class="wf-mini wf-mini-two">${image('imgScreenshot20261114At123042Pm1')}</div><div class="wf-mini wf-mini-three">${image('imgScreenshot20261114At123136Pm1')}</div><div class="wf-mini wf-mini-four">${image('imgScreenshot20261114At123109Pm1')}</div>`
}

export function createWorkArchive(assetBase = '/', idPrefix = 'work') {
  const root = document.createElement('section')
  root.className = 'work-archive'
  root.setAttribute('aria-label', 'Selected work and other projects')
  root.innerHTML = `<div class="wf-content"><h2>Works</h2><div class="wf-folders">${collections.map((collection, index) => `
    <article class="wf-folder wf-${collection.color}">
      <div class="wf-stage"><span class="wf-back" aria-hidden="true"></span><span class="wf-cards">${index === 0 ? blinkitCards() : index === 1 ? uberCards() : otherCards()}</span>
      <span class="wf-frost" aria-hidden="true"><span class="wf-cards">${index === 0 ? blinkitCards() : index === 1 ? uberCards() : otherCards()}</span></span><button type="button" class="wf-open" aria-label="Open ${collection.name}${index === 2 ? '' : ' projects'}" aria-expanded="false" aria-controls="${idPrefix}-panel-${index}">${image(collection.front, 'wf-front', 'svg')}</button><span class="wf-logo" aria-hidden="true">${image(collection.logo)}</span></div>
    </article>`).join('')}</div>
    ${image('imgVector', 'wf-bottom-doodle', 'svg')}

  </div>`
  for (const img of root.querySelectorAll('img')) {
    img.src = assetBase + img.getAttribute('src')
  }
  const shortSummary = {
    'Delivery partner onboarding':'Onboarding completion improved from 23.5% to 29.45%.',
    'Delivering the first 50 orders':'Helping new riders understand offers, one milestone at a time.',
    'Designing for fleet managers':'Simplifying trip assignment for employee shuttle fleets.',
    'Designing for drivers':'Navigation designed for drivers of high-capacity vehicles.',
    'Catyukta · Character design':'Catyukta — a playful character brought to life through illustration.',
    'Apple Vision Pro · XR micro-interactions':'Exploring playful micro-interactions for Apple Vision Pro.',
    'FLOATFIT · Wardrobe organisation':'FLOATFIT — organising wardrobe chaos. Third place at a hackathon.',
    'Creator AI':'Turning brand briefs into clear next steps for creators.',
  }
  root.querySelectorAll('.wf-folder').forEach((folder,index)=>{
    const collection=collections[index]
    const front=folder.querySelector('.wf-open')
    const cover=document.createElement('span')
    cover.className=front.className
    cover.setAttribute('aria-hidden','true')
    cover.append(...front.childNodes)
    front.replaceWith(cover)
    const summary=document.createElement('p')
    summary.className='wf-hover-summary'
    summary.id=`${idPrefix}-summary-${index}`
    const setSummary=title=>{summary.textContent=shortSummary[title]}
    setSummary(collection.projects[0][0])
    folder.append(summary)
    const cards=folder.querySelectorAll('.wf-stage>.wf-cards>.wf-card,.wf-stage>.wf-cards>.wf-mini')
    cards.forEach((artwork,cardIndex)=>{
      const [title,href]=collection.projects[cardIndex]
      const card=document.createElement('a')
      card.href=href
      card.className=artwork.className
      card.setAttribute('aria-label',`View ${title}`)
      card.setAttribute('aria-describedby',summary.id)
      if(href.startsWith('https:')){card.target='_blank';card.rel='noopener noreferrer'}
      card.append(...artwork.childNodes)
      artwork.replaceWith(card)
      card.addEventListener('pointerenter',()=>setSummary(title))
      card.addEventListener('focus',()=>setSummary(title))
    })
    folder.addEventListener('pointerleave',()=>setSummary(collection.projects[0][0]))
  })
  return root
}

export function setupWorkArchive() {
  document.querySelectorAll('section.has-blinkit-project').forEach((section, index) => {
    const grid = section.querySelector('.project-grid-with-blinkit')
    if (!grid) return
    grid.replaceWith(createWorkArchive('/', `work-${index}`))
    section.classList.add('has-work-archive')
  })
  document.querySelectorAll('section[data-framer-name="Featured Projects Section"]').forEach(section => section.remove())
}
