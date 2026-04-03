'use client'

import { useState, useEffect, useRef } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('')
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (id: string) => {
    setMobileOpen(false)
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const navLinks = [
    { id: 'services', label: 'Services' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <>
      <nav ref={navRef} style={{
        ...s.nav,
        background: '#FAF7F2',
        borderBottom: scrolled ? '1px solid rgba(200,185,154,0.25)' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.06)' : 'none',
      }}>
        <div style={s.inner}>
          {/* Logo */}
          <a href="#" style={s.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span style={s.logoMark}>
              <img src="/logo.png" alt="Ivory & Oak" style={{ height: 36, width: 'auto', display: 'block' }} />
            </span>
            <div style={s.logoTextWrap}>
              <span style={s.logoName}>Ivory & Oak</span>
              <span style={s.logoSub}>Cleaning Co.</span>
            </div>
          </a>

          {/* Desktop links */}
          <div className="nav-links-wrap" style={s.linksWrap}>
            {navLinks.map(link => (
              <button
                key={link.id}
                style={{
                  ...s.link,
                  color: active === link.id ? '#C8A84E' : '#5C534A',
                }}
                onClick={() => goTo(link.id)}
                onMouseOver={e => {
                  e.currentTarget.style.color = '#C8A84E'
                  const bar = e.currentTarget.querySelector('.nav-bar') as HTMLElement
                  if (bar) bar.style.transform = 'scaleX(1)'
                }}
                onMouseOut={e => {
                  if (active !== link.id) e.currentTarget.style.color = '#5C534A'
                  const bar = e.currentTarget.querySelector('.nav-bar') as HTMLElement
                  if (bar && active !== link.id) bar.style.transform = 'scaleX(0)'
                }}
              >
                {link.label}
                <span className="nav-bar" style={{
                  ...s.linkBar,
                  transform: active === link.id ? 'scaleX(1)' : 'scaleX(0)',
                }} />
              </button>
            ))}
            <span style={s.sep} />
            <a href="tel:5135552532" style={s.phone}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              (513) 555-2532
            </a>
            <button style={s.bookBtn} onClick={() => goTo('booking')}
              onMouseOver={e => {
                e.currentTarget.style.background = '#B8983E'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#C8A84E'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Book a Cleaning
            </button>
          </div>

          {/* Hamburger */}
          <button className="nav-hamburger" style={s.hamburger} onClick={() => setMobileOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3E2E20" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="17" x2="20" y2="17"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div style={{
        ...s.drawer,
        transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        pointerEvents: mobileOpen ? 'all' : 'none',
      }}>
        <div style={s.drawerHeader}>
          <span style={s.drawerLogo}>Ivory & Oak</span>
          <button style={s.closeBtn} onClick={() => setMobileOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3E2E20" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div style={s.drawerLinks}>
          {navLinks.map(link => (
            <button key={link.id} style={s.drawerLink} onClick={() => goTo(link.id)}>
              {link.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8B99A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ))}
        </div>
        <div style={s.drawerFooter}>
          <a href="tel:5135552532" style={s.drawerPhone}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            (513) 555-2532
          </a>
          <button style={s.drawerBook} onClick={() => goTo('booking')}>Book a Cleaning</button>
        </div>
      </div>

      {/* Drawer backdrop */}
      {mobileOpen && (
        <div style={s.backdrop} onClick={() => setMobileOpen(false)} />
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-wrap { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-links-wrap { margin-left: 0 !important; }
        }
      `}</style>
    </>
  )
}

const s: Record<string, React.CSSProperties> = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    transition: 'all 0.35s ease',
  },
  inner: {
    maxWidth: 1200, margin: '0 auto', padding: '0 40px',
    height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
  },
  logoMark: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: 0.9,
  },
  logoTextWrap: {
    display: 'flex', flexDirection: 'column', lineHeight: 1,
  },
  logoName: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.1rem', fontWeight: 600, color: '#3E2E20',
    letterSpacing: '0.01em',
  },
  logoSub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.14em',
    textTransform: 'uppercase' as const, color: '#C8A84E',
    marginTop: 2,
  },
  linksWrap: {
    display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto',
  },
  link: {
    position: 'relative', fontSize: '0.8rem', fontWeight: 500,
    background: 'none', border: 'none', cursor: 'pointer',
    transition: 'color 0.2s', letterSpacing: '0.02em',
    fontFamily: "'DM Sans', sans-serif", padding: '6px 14px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  },
  linkBar: {
    position: 'absolute', bottom: 0, left: '50%', marginLeft: -10,
    width: 20, height: 1.5, background: '#C8A84E', borderRadius: 1,
    transition: 'transform 0.25s ease', transformOrigin: 'center',
  },
  sep: {
    width: 1, height: 20, background: 'rgba(200,185,154,0.35)', margin: '0 12px',
  },
  phone: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 500,
    color: '#8C8279', textDecoration: 'none', transition: 'color 0.2s',
    marginRight: 16,
  },
  bookBtn: {
    padding: '9px 22px', background: '#C8A84E', color: '#FFFFFF',
    fontSize: '0.78rem', fontWeight: 600, borderRadius: 4, border: 'none',
    cursor: 'pointer', transition: 'all 0.25s ease', letterSpacing: '0.03em',
    fontFamily: "'DM Sans', sans-serif",
  },
  hamburger: {
    display: 'none', alignItems: 'center', justifyContent: 'center',
    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
  },
  drawer: {
    position: 'fixed', top: 0, right: 0, bottom: 0, width: 300,
    background: '#FAF7F2', zIndex: 1002,
    transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex', flexDirection: 'column',
    boxShadow: '-8px 0 30px rgba(0,0,0,0.08)',
  },
  drawerHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px', borderBottom: '1px solid #EAE2D6',
  },
  drawerLogo: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.05rem', fontWeight: 600, color: '#3E2E20',
  },
  closeBtn: {
    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
    display: 'flex', alignItems: 'center',
  },
  drawerLinks: {
    flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column',
  },
  drawerLink: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 24px', fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.92rem', fontWeight: 500, color: '#3E2E20',
    background: 'none', border: 'none', cursor: 'pointer',
    borderBottom: '1px solid rgba(234,226,214,0.6)',
    transition: 'background 0.15s',
  },
  drawerFooter: {
    padding: '20px 24px', borderTop: '1px solid #EAE2D6',
    display: 'flex', flexDirection: 'column', gap: 14,
  },
  drawerPhone: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
    color: '#8C8279', textDecoration: 'none',
  },
  drawerBook: {
    width: '100%', padding: '12px 0', background: '#6B5744', color: '#FAF7F2',
    fontSize: '0.85rem', fontWeight: 600, borderRadius: 4, border: 'none',
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
    textAlign: 'center' as const,
  },
  backdrop: {
    position: 'fixed', inset: 0, zIndex: 1001,
    background: 'rgba(0,0,0,0.2)', cursor: 'pointer',
  },
}
