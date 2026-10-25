// All site copy lives here so it can be edited without touching layout code.
import { IMG, VIDEO } from './assets'

export const PROFILE = {
  first: 'Sanyukta',
  last: 'Bhave',
  role: 'Product Designer',
  intro:
    'A product designer with crazy energy for building products with passion.',
  blurb:
    'Currently pursuing masters in design from IITJ. I have worked in banking and mobility sectors — and right now I design for the people who actually move things: delivery partners.',
  sauce: 'I start with curiosity — diving into user needs, context, and data like solving a puzzle.',
  // TODO(sanyukta): drop in your real profile URL and email — the Framer site
  // only had a bare linkedin.com link and no address, so these are placeholders.
  links: {
    linkedin: 'https://www.linkedin.com/',
    email: '',
  },
}

export const MARQUEE = [
  'Product design',
  'User research',
  'Interaction',
  'Design systems',
  'Prototyping',
  'Vibe coding',
]

export const PROJECTS = [
  {
    slug: 'onboarding',
    title: 'Reducing Drop-offs in Delivery Partner Onboarding',
    org: 'Blinkit',
    year: '2026',
    tags: ['Product design', 'Research', 'Onboarding'],
    summary:
      'Only 1 in 9 riders who signed up finished onboarding. We rebuilt the journey around confidence instead of step-count — and moved completion from 23.5% to 29.45%.',
    stat: { value: '5.9%', label: 'completion lift' },
    to: '/case/onboarding',
    kind: 'internal',
    poster: VIDEO.hero,
    accent: 'yellow',
  },
  {
    slug: 'creator-economy',
    title: 'Elevating the Creator Economy: A UX Redesign for Instagram Growth',
    org: 'Self-initiated',
    year: '2025',
    tags: ['UX redesign', 'Creator tools'],
    summary:
      'A redesign exploring how Instagram could help small creators grow — rethinking discovery, insights and the path from first post to first paycheck.',
    href: null,
    kind: 'soon',
    accent: 'pink',
  },
  {
    slug: 'est',
    title: 'Trip management for Employee Shift Transportation',
    org: 'Uber',
    year: '2024–25',
    tags: ['Mobility', 'B2B', 'Ops tooling'],
    summary:
      'Trip management for shift-based employee transport — scheduling, tracking and exception handling for the teams running the fleet.',
    href: 'https://www.figma.com/deck/GZYJxVTv89R29iHzScRuLK/Trip-management',
    kind: 'external',
    accent: 'blue',
  },
  {
    slug: 'waypoint',
    title: 'Seamless Journey: From Checkpoint to Waypoint',
    org: 'Uber',
    year: '2024–25',
    tags: ['Mobility', 'Navigation'],
    summary:
      'Rethinking how a driver moves through a route — turning rigid checkpoints into waypoints that bend around the real world.',
    href: 'https://www.figma.com/deck/ffdiJq0pG5S5eU4XxkqKFj',
    kind: 'external',
    accent: 'green',
  },
]

export const OTHER_WORK = [
  { title: 'HDFC Bank Summer Internship', note: 'Banking · design internship' },
  { title: 'Hyperbots chatbot', note: 'Graduation project · conversation design' },
  { title: 'Character Design', note: 'Side practice · illustration' },
]

export const EXPERIENCE = [
  {
    period: '2026 – Present',
    title: 'Product design at Blinkit',
    note: 'Delivery partner experience — onboarding, assignment and everything riders touch.',
    current: true,
  },
  {
    period: '2025 – Present',
    title: 'Pursuing MDes at IITJ',
    note: 'Focused on XR and interaction design.',
    current: true,
  },
  {
    period: '2024 – 2025',
    title: 'Product design intern / contract at Uber',
    note: 'Mobility — employee shift transportation and driver journey.',
  },
  {
    period: '2024',
    title: 'Graduation project at Startup — Hyperbots',
    note: 'Designed a chatbot experience end to end.',
  },
  {
    period: '2020 – 2024',
    title: 'BDes from JKLU',
    note: 'Where the exploration-and-confusion habit started.',
  },
]

export const APPROACH = [
  {
    step: '01',
    title: 'Exploration and confusion',
    body: 'I sit in the mess first. Map the journey end to end, write down everything that feels off, and resist the urge to solve too early.',
  },
  {
    step: '02',
    title: 'Talk to actual humans',
    body: 'Riders, drivers, creators — whoever it is for. I call the people who dropped off, not just the ones who succeeded. The drop-offs tell you more.',
  },
  {
    step: '03',
    title: 'Follow the data',
    body: 'Funnels tell me where it breaks. Conversations tell me why. I need both before I open Figma.',
  },
  {
    step: '04',
    title: 'Ship, measure, repeat',
    body: 'Design that never ships is a mood board. I work close with PM, data and engineering and watch the numbers after launch.',
  },
]

export { IMG, VIDEO }
