// Asset map — semantic keys to the original Framer files downloaded into /public/media.
// Images and videos are served from the public root at /media/...
const img = (f) => `/media/img/${f}`
const vid = (f) => `/media/video/${f}`

export const IMG = {
  // repeated up-arrow icon inside each impact card
  impactArrow: img('Jk1SZwLNjgiuZ9G2Zlsu6NhDaE.png'),
  // "Why we started" — conversion funnel table
  funnelTable: img('2lbimmomOyaoiMMt4KtuuPvQj4.png'),
  // Step 1 — mapping the current onboarding (rider downloads two apps)
  step1a: img('DsSPT579W6jwDAmbhgHbs1pI8pU.png'),
  step1b: img('ueZJnxA3th6ZkacqsxU59Q7usc.png'),
  // Step 2 — questionnaire doc
  questionnaireA: img('cHwCIDXOeV7gZuOrFc8RIaxy7U.png'),
  questionnaireB: img('CoZwucneU08h8dZu1ExS4147UA.png'),
  questionnaireC: img('umtqtL0aTBODWHt8Fq7v3fwUE.png'),
  // What we heard from riders
  heardA: img('bq07U733dmpmgveJUcDtEXeot38.png'),
  heardB: img('s4CXtjwagSaSDF0NvVUUkbaXDg.png'),
  // 35% downloaded the consumer app
  consumerDataA: img('xVZw5SBrI6uDL8OuXUGw8hBXlY.png'),
  consumerDataB: img('VtuufHjzu6UmpIqNbk47OcpvvXs.png'),
  // Rider quote 1 (aadhaar / pan)
  quote1a: img('rR6DuykHPZKKILRGi3UMQUSxwM.png'),
  quote1b: img('4sfJ1qbve5g0K2dloxH0FdVqW3w.png'),
  // Rider quote 2 (verification pending)
  quote2a: img('bBuTJeId4nNQy2NiLV6XZrrPiwk.png'),
  quote2b: img('7UDEPRYSpKKF82Te2pU3E0szwM.png'),
  // Goals panel (initial / current)
  goalA: img('PS31c6AQ9SxgPMgcpUtKiKb3Ws.png'),
  goalB: img('MgTjoJdXNs2Cbt2lOxl1DDTnM.png'),
  // Designing for the first touchpoint — 30% download rider app
  touchpoint: img('gvPSSQFB7Cd8qU2C4B62MxdCqM.png'),
  // Consumer app vs partner app comparison
  appCompare: img('6BFJIXYm4JyTBMYg9rLJBkTqj6k.png'),
  // Logo exploration (dark theme variants)
  logoDark1: img('yUQKvCJG8Epl399ULywyE6jWxI.png'),
  logoDark2: img('XjOejLvZSVVz0L6EeHzmQucH0A.png'),
  logoDark3: img('9PuqBFIFVgQI8i0BMF7cDADjMT0.png'),
  logoDark4: img('7UaQhZrLd23tjs2dM7VDr2t49c.png'),
  logoDark5: img('c7tYRHEudGHqr3AIORu1hRqQxKo.png'),
  // Yellow version of the logo
  logoYellow: img('fa2ycX7LQoAOzxatQxmN4dBmzU.png'),
  // Final logo
  logoFinal1: img('aIPGWeGNYI7LmK6QSATbXRwAU.png'),
  logoFinal2: img('qajWUx2tIoG96VOi0fX2Azlt5uE.png'),
  // Impact for this change (reducing funnel / target users)
  changeA: img('gzSUTbUvEkmJ5RpzNSeIp1ESy8A.png'),
  changeB: img('FhzNini6HQ59C9CgLcD5Fwoyrsg.png'),
  // Logical flow diagram
  flowMain: img('u36QDMqMd2VKNoJGuAmzfaTNIU.png'),
  flowA: img('zDlxtiNbjMiAR863B6AaPO81KQk.png'),
  flowB: img('BxFPSkAab9rGHW6G91TvxiK6Q2I.png'),
  flowC: img('RvhjqpsOe14ggdfPzrsNOVI0YE.png'),
  // Showcase blocks
  showFirstA: img('fcVUx2P0IhhpsoH5xQMLqTfI.png'),
  showFirstB: img('d9w1xqTFKp8Ej4Iri7qySvH5dno.png'),
  showUnderstanding: img('mIJmgMB7B0XzIBtLjdoF1rMVG4.png'),
  showHelp: img('PLNtLWUp4P55lZypWb22SOeaCYU.png'),
  showContextual: img('jN8HbbJsUQtcMSlCO8bITusGOzc.png'),
  // Decorative SVG (hand-drawn arrow)
  arrowSvg: img('8Li3bEi2pBFSRCKmHpW1kYBntrg.svg'),
}

export const VIDEO = {
  hero: vid('CUQW1mWKkH3AkrhHPsWv9JJAYB8.mp4'), // 37MB — main onboarding walkthrough
  hmw: vid('kypC6gKPm47czUIirsZuWg13hA.mp4'), // builds up the "How might we" statements
  showcase1: vid('fTph3mK54J7NqtgfUHQAGbD6g.mp4'),
  showcase2: vid('RSSx4DPrxTctl1ke4ISOkrZa0TM.mp4'),
}
