import { useEffect, useRef, useState } from 'react'
import Reveal from '../components/Reveal'
import Marquee from '../components/Marquee'
import { APPROACH, EXPERIENCE, MARQUEE, OTHER_WORK, PROFILE, PROJECTS } from '../content'

/* ---------- hero ---------- */

function Hero() {
  const gridRef = useRef(null)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    // Dot-grid spotlight follows the pointer — the one bit of "alive" on load.
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <section className="hero-home" ref={gridRef} id="top">
      <div className="hero-home__glow" aria-hidden="true" />
      <div className="wrap hero-home__inner">
        <p className="hero-home__hi stagger" style={{ '--i': 0 }}>
          Hi, I&rsquo;m
        </p>

        <h1 className="hero-home__name">
          {PROFILE.first.split('').map((ch, i) => (
            <span className="hero-home__ch stagger" style={{ '--i': i + 1 }} key={i}>
              {ch}
            </span>
          ))}
        </h1>

        <p className="hero-home__intro stagger" style={{ '--i': 10 }}>
          {PROFILE.intro}
        </p>

        <div className="hero-home__cta stagger" style={{ '--i': 11 }}>
          <a
            className="btn btn--ink"
            href="#/case/onboarding"
            data-cursor="link"
          >
            Look what I made!
          </a>
          <a className="btn btn--ghost" href={PROFILE.links.linkedin} target="_blank" rel="noreferrer" data-cursor="link">
            Hire me
          </a>
        </div>

        <div className="hero-home__scroll stagger" style={{ '--i': 12 }} aria-hidden="true">
          <span>scroll</span>
          <span className="hero-home__arrow">↓</span>
        </div>
      </div>
    </section>
  )
}

/* ---------- work ---------- */

function ProjectCard({ project, index }) {
  const [hover, setHover] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (hover) v.play().catch(() => {})
    else v.pause()
  }, [hover])

  const isLink = project.kind === 'internal' || project.kind === 'external'
  const href = project.kind === 'internal' ? `#${project.to}` : project.href

  const inner = (
    <>
      <div className="pcard__media">
        {project.poster ? (
          <video
            ref={videoRef}
            src={project.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        ) : (
          <div className="pcard__placeholder" aria-hidden="true">
            <span>{project.org}</span>
          </div>
        )}
        {project.stat && (
          <div className="pcard__stat">
            <strong>{project.stat.value}</strong>
            <span>{project.stat.label}</span>
          </div>
        )}
      </div>

      <div className="pcard__body">
        <div className="pcard__meta">
          <span className="pcard__num">{String(index + 1).padStart(2, '0')}</span>
          <span className="pcard__org">{project.org}</span>
          <span className="pcard__year">{project.year}</span>
        </div>
        <h3 className="pcard__title">{project.title}</h3>
        <p className="pcard__summary">{project.summary}</p>
        <ul className="pcard__tags">
          {project.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <span className="pcard__action">
          {project.kind === 'internal' && 'Read the case study'}
          {project.kind === 'external' && 'Open the Figma deck'}
          {project.kind === 'soon' && 'Write-up in progress'}
          {isLink && <span className="pcard__arrow">→</span>}
        </span>
      </div>
    </>
  )

  return (
    <Reveal
      variant="up"
      delay={index * 90}
      className={`pcard pcard--${project.accent} ${isLink ? '' : 'pcard--soon'}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isLink ? (
        <a
          href={href}
          className="pcard__hit"
          data-cursor="view"
          {...(project.kind === 'external' ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {inner}
        </a>
      ) : (
        <div className="pcard__hit">{inner}</div>
      )}
    </Reveal>
  )
}

function Work() {
  return (
    <section className="section wrap" id="work">
      <Reveal as="h2" className="h-section">
        <span className="mark mark--yellow">Look what I made!</span>
      </Reveal>

      <div className="pgrid">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>

      <Reveal className="other-work">
        <h3 className="other-work__head">Other projects</h3>
        <ul>
          {OTHER_WORK.map((o) => (
            <li key={o.title}>
              <span className="other-work__title">{o.title}</span>
              <span className="other-work__note">{o.note}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}

/* ---------- approach ---------- */

function Approach() {
  return (
    <section className="section wrap" id="approach">
      <Reveal as="h2" className="h-section">
        <span className="mark mark--pink">My not-so secret sauce</span>
      </Reveal>

      <Reveal as="p" className="quote quote--hi sauce-quote" delay={80}>
        &ldquo;{PROFILE.sauce}&rdquo;
      </Reveal>

      <div className="approach">
        {APPROACH.map((a, i) => (
          <Reveal className="approach__item" key={a.step} delay={i * 80}>
            <span className="approach__step">{a.step}</span>
            <h3 className="approach__title">{a.title}</h3>
            <p className="approach__body">{a.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------- experience ---------- */

function Experience() {
  return (
    <section className="section wrap" id="experience">
      <Reveal as="h2" className="h-section">
        <span className="mark mark--yellow">My experience</span>
      </Reveal>

      <ol className="timeline">
        {EXPERIENCE.map((e, i) => (
          <Reveal as="li" className="timeline__row" key={e.period + e.title} delay={i * 70}>
            <span className="timeline__period">{e.period}</span>
            <span className="timeline__dot" aria-hidden="true" />
            <div className="timeline__body">
              <h3 className="timeline__title">
                {e.title}
                {e.current && <span className="timeline__badge">now</span>}
              </h3>
              <p className="timeline__note">{e.note}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

/* ---------- about + contact ---------- */

function About() {
  return (
    <section className="section wrap" id="about">
      <div className="about">
        <Reveal className="about__copy">
          <h2 className="h-section">
            <span className="mark mark--pink">About me</span>
          </h2>
          <p className="lede about__lede">{PROFILE.blurb}</p>
          <p className="body-text about__body">
            I like problems where the interface is only half the answer — where you also have to fix
            the order of things, the words, and what happens after someone taps submit. Outside of
            that: illustration, character design, and lately, vibe coding little tools for myself.
          </p>
        </Reveal>

        <Reveal className="about__card" delay={120}>
          <div className="sticker">
            <p className="sticker__text">
              Currently designing for <b>delivery partners</b> at Blinkit, and studying <b>XR &amp;
              interaction design</b> at IITJ.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Contact() {
  const { email, linkedin } = PROFILE.links
  return (
    <section className="section wrap contact" id="contact">
      <Reveal as="h2" className="contact__head">
        Let&rsquo;s make something
        <br />
        <span className="contact__head-alt">worth blushing about.</span>
      </Reveal>
      <Reveal className="contact__links" delay={100}>
        <a href={linkedin} target="_blank" rel="noreferrer" className="btn btn--ink" data-cursor="link">
          LinkedIn
        </a>
        {email && (
          <a href={email} className="btn btn--ghost" data-cursor="link">
            Email me
          </a>
        )}
      </Reveal>
    </section>
  )
}

/* ---------- page ---------- */

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee items={MARQUEE} />
      <Work />
      <Approach />
      <Experience />
      <About />
      <Contact />
    </main>
  )
}
