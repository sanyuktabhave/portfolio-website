import { useReveal } from '../lib/hooks'

/**
 * Wraps children in a scroll-triggered reveal.
 * `variant` picks the motion; `delay` staggers siblings (ms).
 */
export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  as: Tag = 'div',
  className = '',
  ...rest
}) {
  const [ref, seen] = useReveal()

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${seen ? 'is-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
