import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const CHECKLIST = [
  {
    label: 'Tea length or longer (or a nice suit!)',
    detail: 'Midi, maxi, or floor-length. Long dresses with slits are fine, too!',
  },
  {
    label: 'Elevated fabric',
    detail: 'Chiffon, satin, silk, lace, velvet, crepe, charmeuse, organza — basically anything with drape, sheen, or texture. If it looks good in a photo, you\'re good.',
  },
  {
    label: 'Colors: basically anything',
    detail: 'Florals, jewel tones, neutrals, bold — go for it. Just skip head-to-toe white (that one\'s mine).',
  },
]

const PIN_COL_WIDTH = 150

function setPinAttributes(el) {
  const width = el.parentElement.offsetWidth
  const cols = Math.max(2, Math.floor(width / PIN_COL_WIDTH))
  const colWidth = Math.floor(width / cols)
  el.setAttribute('data-pin-board-width', String(width))
  el.setAttribute('data-pin-scale-width', String(colWidth))
  el.setAttribute('data-pin-scale-height', String(Math.round(colWidth * 5)))
}

export default function DressCode() {
  const pinRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const el = pinRef.current
    if (!el) return

    setPinAttributes(el)

    const observer = new ResizeObserver(() => {
      setPinAttributes(el)
      if (window.PinUtils) window.PinUtils.build()
    })
    observer.observe(el.parentElement)

    if (window.PinUtils) {
      window.PinUtils.build()
    } else {
      const script = document.createElement('script')
      script.src = '//assets.pinterest.com/js/pinit.js'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
      return () => {
        observer.disconnect()
        if (document.body.contains(script)) document.body.removeChild(script)
      }
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="dc-page">
      <Link to="/" className="back-link">← Back</Link>

      <header className="dc-header">
        <p className="dc-eyebrow">New Orleans · February 20, 2027</p>
        <h1 className="dc-title">Dress Code</h1>
        <div className="dc-divider" />
        <p className="dc-subtitle">Formal &amp; Festive</p>
      </header>

      {/* ── Intro ── */}
      <section className="dc-section dc-section--intro">
        <p className="dc-body">
          The dress code is{' '}
          <strong>formal</strong>, which for gentlemen means a suit and tie, and for ladies means
          a floor- or midi-length dress in an elevated fabric. 
          We want everyone to feel comfortable and enjoy the elegance of the occasion!
        </p>
      </section>
      
      {/* ── Ladies ── */}
      <section className="dc-section">
        <h2 className="dc-section-title">For the Ladies</h2>
        <p className="dc-body">
          I (Sarah) want to apologize in advance for how stressfull wedding dress codes are.
          Hopefully the checklist and the inspo board helps, but ultimately, use this as your excuse to wear the dress you've been saving,
          lean into the occasion, and feel a little extra for a night in New Orleans.
        </p>

        <ul className="dc-checklist">
          {CHECKLIST.map(({ label, detail }) => (
            <li key={label} className="dc-checklist-item">
              <span className="dc-check">✓</span>
              <div className="dc-check-text">
                <strong>{label}</strong>
                <span>{detail}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="dc-pinterest">
          <p className="dc-pinterest-label">Need some inspo? Here's a board.</p>
          <a
            ref={pinRef}
            data-pin-do="embedBoard"
            href="https://www.pinterest.com/iliketurtles99/wedding-guest-inspo/"
          />
          <a
            href="https://www.pinterest.com/iliketurtles99/wedding-guest-inspo/"
            className="dc-pinterest-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Pinterest ↗
          </a>
        </div>
      </section>

      {/* ── Bridal party ── */}
      <section className="dc-section dc-section--callout">
        <h2 className="dc-section-title">Bridal Party</h2>
        <p className="dc-body">
          I'm still finalizing what the bridal party is wearing... check back closer to the date! What we
          can tell you now is that we're genuinely not precious about color. If you already own a
          dress in whatever shade we end up going with, wear it. We'd love to see it on you.
        </p>
      </section>

      {/* ── Shoe callout ── */}
      <section className="dc-section dc-section--callout">
        <h2 className="dc-section-title">A Note on Shoes</h2>
        <p className="dc-body">
          Our wedding festivities will take place indoors, but there will be walking outdoors between locations (ceremony → reception → second line to afterparty). 
          The more the night flows, the less formal it becomes, and your feet will know it.
        </p>
        <p className="dc-body" style={{ marginTop: '12px' }}>
          It is completely normal to pack a second pair of shoes: flats, block heels, sneakers,
          whatever gets you to the afterparty in one piece. No one will judge. In fact, they'll
          probably be doing the same.
        </p>
      </section>

      {/* ── Dudes ── */}
      <section className="dc-section dc-section--dudes">
        <h2 className="dc-section-title">For the Gentlemen</h2>
        <p className="dc-body">
          Lucky for you, your job is easy: wear a suit and tie. That's it!
        </p>
      </section>
    </div>
  )
}
