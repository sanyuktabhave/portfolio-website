export default function Marquee({ items, speed = 38, tilt = -2 }) {
  // Duplicated track so the translate(-50%) loop is seamless.
  const track = [...items, ...items]

  return (
    <div className="marquee" style={{ '--tilt': `${tilt}deg` }} aria-hidden="true">
      <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
        {track.map((item, i) => (
          <span className="marquee__item" key={i}>
            {item}
            <span className="marquee__sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
