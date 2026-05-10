import { useState } from 'react'
import { Link } from 'react-router-dom'

const LINKS = [
  {
    icon: '🌹',
    title: 'Our Wedding Website',
    sub: 'General information, RSVP & registry',
    href: 'https://www.zola.com/wedding/liangbigus',
    external: true,
  },
  {
    icon: '🗺️',
    title: 'Interactive Map',
    sub: 'Venues, walking routes & things to do in NOLA',
    to: '/map',
  },
  {
    icon: '👗',
    title: 'Dress Code',
    sub: 'What to wear to our wedding',
    to: '/dress-code',
  },
  {
    icon: '🏨',
    title: 'Hotel Room Block',
    sub: 'Coming soon',
    disabled: true,
  },
]

export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false)

  return (
    <div className="home">
      {/* Hero photo */}
      <div className="home-hero">
        <img
          src="/hero.jpg"
          alt="Sarah and Brandon"
          className={`home-hero-img${heroLoaded ? ' home-hero-img--loaded' : ''}`}
          onLoad={() => setHeroLoaded(true)}
        />
        <div className="home-hero-fade" />
      </div>

      {/* Content */}
      <div className="home-content">
        <header className="home-header">
          <p className="home-eyebrow">New Orleans · February 20, 2027</p>
          <h1 className="home-title">Sarah & Brandon</h1>
          <div className="home-divider" />
        </header>

        <nav className="home-links">
          {LINKS.map((link) => {
            if (link.disabled) {
              return (
                <div key={link.title} className="home-link home-link--disabled">
                  <span className="home-link-icon">{link.icon}</span>
                  <div className="home-link-text">
                    <span className="home-link-title">{link.title}</span>
                    <span className="home-link-sub">{link.sub}</span>
                  </div>
                  <span className="home-link-badge">Coming Soon</span>
                </div>
              )
            }

            if (link.external) {
              return (
                <a
                  key={link.title}
                  className="home-link"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="home-link-icon">{link.icon}</span>
                  <div className="home-link-text">
                    <span className="home-link-title">{link.title}</span>
                    <span className="home-link-sub">{link.sub}</span>
                  </div>
                  <span className="home-link-arrow">↗</span>
                </a>
              )
            }

            return (
              <Link key={link.title} className="home-link" to={link.to}>
                <span className="home-link-icon">{link.icon}</span>
                <div className="home-link-text">
                  <span className="home-link-title">{link.title}</span>
                  <span className="home-link-sub">{link.sub}</span>
                </div>
                <span className="home-link-arrow">→</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
