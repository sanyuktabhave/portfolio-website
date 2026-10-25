import Reveal from '../components/Reveal'
import { Figure, Video } from '../components/Media'
import { useActiveSection, useCountUp } from '../lib/hooks'
import { IMG, VIDEO } from '../assets'

const CHAPTERS = [
  ['impact', 'Impact'],
  ['why', 'Why we started'],
  ['research', 'Research'],
  ['heard', 'What we heard'],
  ['goals', 'Goals'],
  ['touchpoint', 'First touchpoint'],
  ['logical-flow', 'Logical flow'],
  ['showcases', 'The designs'],
]

function ChapterNav() {
  const active = useActiveSection(CHAPTERS.map(([id]) => id))

  return (
    <nav className="chapters" aria-label="Case study sections">
      <ul>
        {CHAPTERS.map(([id, label]) => (
          <li key={id}>
            <button
              className={active === id ? 'is-active' : ''}
              onClick={() =>
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              data-cursor="link"
            >
              <span className="chapters__tick" aria-hidden="true" />
              <span className="chapters__label">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function SectionTitle({ children, mark = 'yellow', id }) {
  return (
    <Reveal as="h2" className="h-section" id={id}>
      <span className={`mark mark--${mark}`}>{children}</span>
    </Reveal>
  )
}

/* ---------- hero ---------- */

function Hero() {
  return (
    <section className="hero wrap" id="top">
      <div className="hero__grid">
        <div>
          <Reveal as="h1" className="display">
            Reducing Drop-offs in Delivery Partner Onboarding
          </Reveal>
          <Reveal as="p" className="lede hero__lede" delay={120}>
            The objective was to reduce drop-off across the onboarding journey, especially at the
            Aadhaar step, and help more Delivery Partners complete onboarding.
          </Reveal>
        </div>
        <Reveal as="aside" className="meta" delay={180}>
          <div className="meta__row">
            <div className="meta__label">My role</div>
            <div className="meta__value">Product design</div>
          </div>
          <div className="meta__row">
            <div className="meta__label">The journey</div>
            <div className="meta__value">May–June 2026</div>
          </div>
          <div className="meta__row">
            <div className="meta__label">The scope</div>
            <div className="meta__value">Onboarding experience</div>
          </div>
          <div className="meta__row">
            <div className="meta__label">Today</div>
            <div className="meta__value meta__value--live">
              <span className="live-dot" aria-hidden="true" />
              LIVE
            </div>
          </div>
          <div className="meta__row">
            <div className="meta__label">Team</div>
            <div className="avatars">
              <span className="avatar avatar--pm">PM</span>
              <span className="avatar avatar--da">DA</span>
              <span className="avatar avatar--fe">FE</span>
              <span className="avatar avatar--be">BE</span>
              <span className="avatar avatar--be">BE</span>
            </div>
          </div>
        </Reveal>
      </div>
      <Reveal className="hero__video media media--video" delay={120}>
        <video
          src={VIDEO.hero}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Onboarding walkthrough"
        />
      </Reveal>
    </section>
  )
}

/* ---------- impact ---------- */

const IMPACT = [
  { value: 5.9, decimals: 1, from: '23.5%', to: '29.45%', label: 'onboarding completion' },
  { value: 8.7, decimals: 1, from: '66.9%', to: '75.66%', label: 'store selection conversion' },
  { value: 3, decimals: 0, from: '45.3%', to: '48.3%', label: 'document submission conversion' },
  { value: 2.3, decimals: 1, from: '12.5%', to: '14.77%', label: 'First Order Delivered conversion' },
]

function ImpactCard({ item, index }) {
  const [ref, display] = useCountUp(item.value, { decimals: item.decimals, duration: 1000 + index * 120 })

  return (
    <div className="impact-card" ref={ref}>
      <div className="impact-card__top">
        <span className="impact-card__num">{display}%</span>
        <img className="impact-card__arrow" src={IMG.impactArrow} alt="" aria-hidden="true" />
      </div>
      <p className="impact-card__desc">
        {item.label}, from <b>{item.from}</b> to <b>{item.to}</b>.
      </p>
    </div>
  )
}

function Impact() {
  return (
    <section className="section wrap">
      <SectionTitle id="impact">Impact overview</SectionTitle>
      <div className="impact-grid">
        {IMPACT.map((item, i) => (
          <Reveal key={item.label} delay={i * 90}>
            <ImpactCard item={item} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------- narrative sections ---------- */

function WhyStarted() {
  return (
    <section className="section wrap">
      <SectionTitle id="why">Why we started redesigning?</SectionTitle>
      <div className="two-col two-col--spaced">
        <Reveal>
          <h3 className="h-sub h-sub--gap">Confusion, Delays, and Trust Gaps in Onboarding</h3>
          <p className="body-text">
            Blinkit&rsquo;s delivery partner onboarding involved <b>multiple steps</b>, from vehicle
            and store selection to document submission and verification.
          </p>
          <p className="body-text body-text--gap">
            Despite a straightforward flow, <b>confusion around document requirements</b> and{' '}
            <b>unclear post-submission steps</b> led to significant drop-offs. Only 1 in 9 users who
            signed up completed onboarding, which was quite sad for the product tbh.
          </p>
        </Reveal>
        <Figure src={IMG.funnelTable} alt="Onboarding conversion funnel table" cap="The funnel we started with" />
      </div>
    </section>
  )
}

function StepGlyph() {
  return (
    <svg className="step-badge__glyph" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" />
      <path d="M12 5.5 14 10l4.5 2-4.5 2-2 4.5-2-4.5L5.5 12 10 10z" />
    </svg>
  )
}

const THEMES = [
  {
    label: 'Discoverability',
    insight: 'Riders struggled to find the right app and identify relevant options.',
    stat: 'Through data, there were 35% of riders who downloaded the consumer app',
  },
  {
    label: 'Clarity',
    insight: 'Requirements and next steps weren’t always easy to understand.',
    hi: 'humare pass aadhar card hai lekin pan card nahi hai',
    en: 'I have aadhaar card but not pan card',
  },
  {
    label: 'Transparency',
    insight: 'The verification process lacked clear expectations and status updates.',
    hi: 'madam ek hafte se verification pending dikha raha hai, bola tha 10 min mein hojayega, kya dikkhat aa rahi hai',
    en: 'It’s been a week since it’s showing me verification pending, i thought it will be done in 10 mins, what’s the problem?',
  },
  {
    label: 'Support and trust',
    insight: 'Riders needed accessible guidance and reassurance throughout onboarding.',
    hi: 'pata nahi yeh gaadi approve hogi, kisiko reach out kar sakte hai?',
    en: 'I don’t know whether the vehicle i have is okay, who to reach out',
  },
]

const PRIORITIES = [
  {
    title: 'Reduce onboarding abandonment',
    text: 'Simplify the flow by removing unnecessary steps, inputs, and decisions.',
  },
  {
    title: 'Make the next step obvious and achievable',
    text: 'Clarify vehicle eligibility, documentation requirements, city and store selection, and verification expectations.',
  },
  {
    title: 'Improve the quality of onboarding conversions',
    text: 'Help the right users enter the funnel, recommend suitable stores, and make fees and referral options transparent.',
  },
]

function Research() {
  return (
    <section className="section wrap">
      <SectionTitle id="research">How I tackled this problem?</SectionTitle>

      <div className="stack stack--lg">
        <div>
          <Reveal as="h3" className="h-sub">
            <span className="mark mark--pink">Step 1: Mapping out the current onboarding</span>
          </Reveal>
          <div className="two-col two-col--spaced">
            <Reveal as="p" className="body-text">
              This was the first project i got when i joined the org, knowing the journey end to end
              was difficult let alone understanding riders, before going to riders i studied the flow
              end to end and put my fresh perspective on the notes
            </Reveal>
            <Figure src={IMG.step1a} alt="Rider downloads two apps — mapping" />
          </div>
          <div className="block-gap">
            <Figure src={IMG.step1b} alt="Step-by-step map of the existing onboarding flow" />
          </div>
        </div>

        <div>
          <Reveal>
            <h3 className="step-badge">
              <StepGlyph />
              Step 2: Listening before designing
            </h3>
          </Reveal>
          <Reveal as="p" className="body-text body-text--gap">
            We spent our time with rider calling, we called <b>two types</b> of riders — Riders who
            just dropped off and rider who were recently onboarded
          </Reveal>

          <Reveal className="objective" variant="scale">
            <p className="objective__label">Research objective</p>
            <p className="objective__text">
              Identify the root causes of delivery partner drop-offs during onboarding.
            </p>
          </Reveal>

          <Reveal as="h4" className="h-sub h-sub--gap">
            Created a questionnaire doc
          </Reveal>
          <div className="qdoc">
            <Reveal as="p" className="body-text">
              These questions weren&rsquo;t followed to the tee but it gave me a basic idea on how to
              talk to the user and in which manner i should go about it, the questions were designed
              for <b>riders who were recently onboarded and rider who were dropped off</b>.
            </Reveal>
            <div className="qdoc__shots">
              <Figure src={IMG.questionnaireA} alt="Questionnaire doc — English and Hindi tabs" />
              <Figure src={IMG.questionnaireB} alt="Questionnaire — drop-off riders" />
              <Figure src={IMG.questionnaireC} alt="Questionnaire — recently onboarded riders" />
            </div>
          </div>

          <Reveal as="h4" className="h-sub h-sub--center" id="heard">
            What we heard from riders
          </Reveal>
          <div className="themes">
            {THEMES.map((t, i) => (
              <Reveal className="theme" key={t.label} delay={i * 110}>
                <span className="theme__label">{t.label}</span>
                <p className="theme__note">{t.insight}</p>
                {t.stat && <p className="theme__stat">{t.stat}</p>}
                {t.hi && (
                  <p className="theme__quote">
                    <span className="theme__quote-hi">&ldquo;{t.hi}&rdquo;</span>
                    <span className="theme__quote-en">&ldquo;{t.en}&rdquo;</span>
                  </p>
                )}
              </Reveal>
            ))}
          </div>

          <div className="block-gap">
            <Video src={VIDEO.hmw} label="How might we" />
          </div>

          <Reveal className="objectives">
            <h4 className="objectives__title">The objective</h4>
            <div className="objectives__grid">
              {PRIORITIES.map((p, i) => (
                <div className="priority" key={p.title}>
                  <p className="priority__rank">Priority {i + 1}</p>
                  <p className="priority__title">{p.title}</p>
                  <p className="priority__text">{p.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Challenge() {
  return (
    <section className="section wrap">
      <Reveal as="p" className="callout" variant="scale">
        The challenge wasn&rsquo;t simply the number of steps in the onboarding flow.{' '}
        <span className="accent">
          It was the uncertainty and friction riders encountered while moving through them.
        </span>
      </Reveal>
    </section>
  )
}

function Goals() {
  return (
    <section className="section wrap" id="goals">
      <Reveal className="goals">
        <div>
          <div className="goals__label">Initial goal</div>
          <p className="goals__text goals__text--struck">Reducing number of pages &amp; clicks</p>
        </div>
        <div>
          <div className="goals__label">Current goal</div>
          <p className="goals__text">
            Make riders confidently onboard the app without any friction and provide help when needed
          </p>
        </div>
      </Reveal>
    </section>
  )
}

function Touchpoint() {
  return (
    <section className="section wrap">
      <SectionTitle id="touchpoint">Designing for the First Touchpoint</SectionTitle>
      <Reveal as="p" className="body-text body-text--measure body-text--gap">
        <b>From the data:</b> 30% of the users download our rider app thinking it&rsquo;s our
        consumer app
      </Reveal>

      <div className="two-col two-col--spaced">
        <Figure src={IMG.touchpoint} cap="Consumer app" alt="Consumer app" />
        <Figure src={IMG.appCompare} cap="Partner app" alt="Partner app" />
      </div>

      <div className="block-gap">
        <Reveal as="p" className="body-text body-text--measure">
          Explored a dark theme using rider app&rsquo;s black and green palette for brand consistency.
        </Reveal>
        <div className="logo-row">
          {[IMG.logoDark1, IMG.logoDark2, IMG.logoDark3, IMG.logoDark4, IMG.logoDark5].map((s, i) => (
            <Figure key={i} src={s} alt={`Dark logo exploration ${i + 1}`} />
          ))}
        </div>
      </div>

      <div className="two-col two-col--spaced">
        <div>
          <Reveal as="p" className="body-text body-text--gap">
            Explored the yellow version but found it could add to rider confusion.
          </Reveal>
          <Figure src={IMG.logoYellow} alt="Yellow logo version" />
        </div>
        <div>
          <Reveal as="p" className="body-text body-text--gap">
            Final logo ✨
          </Reveal>
          <div className="two-col two-col--tight">
            <Figure src={IMG.logoFinal1} alt="Final logo" />
            <Figure src={IMG.logoFinal2} alt="Final logo" />
          </div>
        </div>
      </div>

      <div className="block-gap">
        <Reveal as="h3" className="h-sub">
          Impact for this change
        </Reveal>
        <Reveal as="p" className="body-text body-text--measure body-text--gap">
          Signups went down to ~50% but the OB count is same. That means we were reducing the funnel
          by attracting our target users (delivery partners).
        </Reveal>
        <div className="two-col two-col--spaced">
          <Figure src={IMG.changeA} alt="Signup funnel change" />
          <Figure src={IMG.changeB} alt="Onboarding count unchanged" />
        </div>
      </div>
    </section>
  )
}

function LogicalFlow() {
  return (
    <section className="section wrap">
      <Reveal as="h3" className="h-sub" id="logical-flow">
        <span className="mark mark--pink">Designing a More Logical Onboarding Flow</span>
      </Reveal>
      <div className="showcase__media">
        <Figure src={IMG.flowMain} alt="Proposed onboarding flow" />
      </div>
      <div className="doodles" aria-hidden="true">
        <img className="doodle" src={IMG.arrowSvg} alt="" />
        <img className="doodle doodle--tilt" src={IMG.arrowSvg} alt="" />
      </div>
      <Reveal as="p" className="body-text body-text--wide body-text--gap">
        Although auto-selecting the city was already decided, we debated where it should sit in the
        redesigned journey. The product team wanted to combine it with store selection, but that page
        already needed to display store type, distance, accepted vehicle types, onboarding fees, and
        a map. Adding city selection would clutter the experience. Asking for vehicle type first also
        allowed us to filter relevant stores, creating a more logical flow. We moved ahead with the
        proposed journey.
      </Reveal>
    </section>
  )
}

function Showcase({ title, children }) {
  return (
    <section className="showcase wrap">
      <Reveal as="h3" className="h-sub">
        <span className="mark mark--pink">{title}</span>
      </Reveal>
      <div className="showcase__media">{children}</div>
    </section>
  )
}

function Showcases() {
  return (
    <div className="section" id="showcases">
      <Showcase title="Designing for the first impression">
        <Video src={VIDEO.showcase1} label="First impression" />
      </Showcase>
      <Showcase title="Enabling better understanding">
        <Video src={VIDEO.showcase2} label="Enabling better understanding" />
        <div className="showcase__media">
          <Figure src={IMG.showUnderstanding} alt="Enabling better understanding" />
        </div>
      </Showcase>
      <Showcase title="Providing help when needed">
        <Figure src={IMG.showHelp} alt="Providing help when needed" />
      </Showcase>
      <Showcase title="Keeping it contextual">
        <Figure src={IMG.showContextual} alt="Keeping it contextual" />
      </Showcase>
    </div>
  )
}

function NextUp() {
  return (
    <section className="section wrap nextup">
      <Reveal>
        <p className="nextup__label">That&rsquo;s the case study</p>
        <a href="#/" className="nextup__link" data-cursor="link">
          ← Back to all work
        </a>
      </Reveal>
    </section>
  )
}

export default function CaseOnboarding() {
  return (
    <main>
      <ChapterNav />
      <Hero />
      <Impact />
      <WhyStarted />
      <Research />
      <Challenge />
      <Goals />
      <Touchpoint />
      <LogicalFlow />
      <Showcases />
      <NextUp />
    </main>
  )
}
