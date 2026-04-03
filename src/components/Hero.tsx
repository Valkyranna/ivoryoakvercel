'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  initialAddress?: string
  onAddressChange?: (address: string) => void
}

export default function Hero({ initialAddress = '', onAddressChange }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [addrResults, setAddrResults] = useState<Array<{ display_name: string }>>([])
  const [addrFocused, setAddrFocused] = useState(false)
  const addrDebounce = useRef<number>(0)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', service: '', homeSize: '', date: '', notes: '',
  })

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (initialAddress) setForm(p => ({ ...p, address: initialAddress }))
  }, [initialAddress])

  const set = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    if (k === 'address') onAddressChange?.(v)
  }

  const searchAddress = (value: string) => {
    set('address', value)
    setAddrResults([])
    if (addrDebounce.current) window.clearTimeout(addrDebounce.current)
    if (value.trim().length < 3) return
    addrDebounce.current = window.setTimeout(async () => {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=4&viewbox=-84.82,41.98,-80.52,38.40&bounded=1`,
          { headers: { 'Accept-Language': 'en' } }
        )
        if (resp.ok) setAddrResults(await resp.json())
      } catch { /* silent */ }
    }, 350)
  }

  const selectAddress = (address: string) => {
    set('address', address)
    setAddrResults([])
    setAddrFocused(false)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  return (
    <section id="booking" style={s.hero} className="hero-section">
      {/* Left: Imagery & branding */}
      <div style={s.left} className="hero-left">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/hero-poster.jpg"
            style={s.bgVideo}
          >
            <source src={isMobile ? '/hero-video-480p.webm' : '/hero-video.webm'} type="video/webm" />
          </video>
        <div style={s.overlay} />
        <div style={s.leftContent} className="hero-left-content">
          <h1 style={s.heading} className="hero-heading">
            Rooted in Care,<br />
            Finished with Grace
          </h1>
          <p style={s.sub} className="hero-sub">
            Professional home cleaning with the warmth of Southern hospitality. 
            Recurring, deep cleans, and move-in/move-out.
          </p>
          {isMobile && (
            <a href="tel:5135552532" style={s.callBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call to Book: (513) 555-CLEAN
            </a>
          )}
        </div>
      </div>

      {/* Right: Booking form */}
      <div style={s.right} className="hero-right">
        {submitted ? (
          <div style={s.success}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5A7A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3 style={s.successTitle}>We&apos;ll Be in Touch</h3>
            <p style={s.successText}>
              Thank you! We&apos;ll confirm your appointment within 2 hours.
            </p>
            <button style={s.resetBtn} onClick={() => {
              setSubmitted(false)
              setForm({ name: '', phone: '', email: '', address: '', service: '', homeSize: '', date: '', notes: '' })
            }}>
              Book Another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} style={s.form}>
            <h2 style={s.formTitle}>Book Your Cleaning</h2>

            <div style={s.formGroup}>
              <label style={s.formLabel} htmlFor="booking-name">Full Name</label>
              <input id="booking-name" name="name" style={s.input} required placeholder="Full name" autoComplete="name"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>

            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.formLabel} htmlFor="booking-phone">Phone</label>
                <input id="booking-phone" name="phone" style={s.input} type="tel" required placeholder="Phone number" autoComplete="tel"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel} htmlFor="booking-email">Email</label>
                <input id="booking-email" name="email" style={s.input} type="email" required placeholder="you@email.com" autoComplete="email"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
            </div>

            <div style={s.formGroup}>
              <label style={s.formLabel} htmlFor="booking-address">Service Address</label>
              <div style={s.addressWrap}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A84E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <input id="booking-address" name="address" style={s.addressInput} placeholder="Start typing your address..." autoComplete="street-address"
                  value={form.address}
                  onChange={e => searchAddress(e.target.value)}
                  onFocus={() => setAddrFocused(true)}
                  onBlur={() => setTimeout(() => setAddrFocused(false), 200)}
                />
              </div>
              {addrFocused && addrResults.length > 0 && (
                <div style={s.addrDropdown}>
                  {addrResults.map((r, i) => (
                    <button key={i} style={s.addrResult} type="button"
                      onMouseDown={() => selectAddress(r.display_name)}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(200,168,78,0.06)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C8A84E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span style={s.addrResultText}>{r.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
              {!form.address && !addrFocused && <span style={s.addressHint}>Or use the map below to find your location</span>}
            </div>

            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.formLabel} htmlFor="booking-service">Service</label>
                <select id="booking-service" name="service" style={s.input} required value={form.service} onChange={e => set('service', e.target.value)}>
                  <option value="">Select service</option>
                  <option value="recurring">Recurring Cleaning</option>
                  <option value="deep">Deep Cleaning</option>
                  <option value="movein">Move-In / Move-Out</option>
                  <option value="custom">Custom / Other</option>
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel} htmlFor="booking-homesize">Home Size</label>
                <select id="booking-homesize" name="homeSize" style={s.input} required value={form.homeSize} onChange={e => set('homeSize', e.target.value)}>
                  <option value="">Select size</option>
                  <option value="studio">Studio / 1 BR</option>
                  <option value="2-3">2–3 Bedrooms</option>
                  <option value="4-5">4–5 Bedrooms</option>
                  <option value="6+">6+ Bedrooms</option>
                  <option value="custom">Custom / Other</option>
                </select>
              </div>
            </div>

            <div style={s.formGroup}>
              <label style={s.formLabel} htmlFor="booking-date">Preferred Date</label>
              <input id="booking-date" name="date" style={s.input} type="date" required
                value={form.date} onChange={e => set('date', e.target.value)} />
            </div>

            <div style={s.formGroup}>
              <label style={s.formLabel} htmlFor="booking-notes">Notes (optional)</label>
              <textarea id="booking-notes" name="notes" style={{ ...s.input, height: 64, resize: 'vertical' as const }}
                placeholder="Pets, gate code, special requests..."
                value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>

            <button type="submit" style={{
              ...s.submit,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'wait' : 'pointer',
            }} disabled={submitting}
              onMouseOver={e => { if (!submitting) e.currentTarget.style.background = '#3E2E20' }}
              onMouseOut={e => { if (!submitting) e.currentTarget.style.background = '#6B5744' }}
            >
              {submitting ? 'Sending...' : 'Book My Cleaning'}
            </button>
          </form>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-section { flex-direction: column !important; height: auto !important; }
          .hero-left { min-height: 280px !important; height: auto !important; flex: none !important; }
          .hero-right { max-width: 100% !important; min-height: auto !important; flex: none !important; overflow: visible !important; height: auto !important; }
          .hero-left-content { padding: 80px 24px 40px !important; }
          .hero-heading { font-size: 1.8rem !important; }
          .hero-sub { font-size: 0.9rem !important; }
        }
        }
      `}</style>
    </section>
  )
}

const s: Record<string, React.CSSProperties> = {
  hero: {
    display: 'flex', minHeight: '85vh',
  },
  left: {
    flex: '1 1 52%', position: 'relative', minHeight: '85vh',
    display: 'flex', alignItems: 'center', overflow: 'hidden',
    background: '#3E2E20',
  },
  bgVideo: {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%', objectFit: 'cover' as const,
    transform: 'scale(1.02)',
  },
  bgStatic: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(135deg, #3E2E20 0%, #5A7A5A 100%)',
  },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(135deg, rgba(62,46,32,0.72) 0%, rgba(62,46,32,0.55) 50%, rgba(90,122,90,0.3) 100%)',
  },
  leftContent: {
    position: 'relative', zIndex: 2, padding: '120px 60px 80px', maxWidth: 560,
  },
  eyebrow: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600,
    letterSpacing: '0.2em', textTransform: 'uppercase' as const,
    color: 'rgba(200,168,78,0.9)', marginBottom: 20,
  },
  heading: {
    fontFamily: "'Fraunces', Georgia, serif", fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
    fontWeight: 300, color: '#FAF7F2', lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em',
    fontOpticalSizing: 'auto',
    willChange: 'opacity',
    opacity: 1,
  },
  sub: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '1.05rem', color: 'rgba(250,247,242,0.75)',
    lineHeight: 1.7, marginBottom: 32, maxWidth: 440,
  },
  callBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 20px', background: 'rgba(200,168,78,0.2)',
    border: '1px solid rgba(200,168,78,0.4)', borderRadius: 6,
    color: '#FAF7F2', fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
    marginBottom: 20,
  },
  trustBar: {
    display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const,
  },
  trustItem: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 500,
    color: 'rgba(250,247,242,0.7)',
  },
  trustDot: {
    color: 'rgba(250,247,242,0.3)', fontSize: '0.9rem',
  },
  right: {
    flex: '0 0 440px', minHeight: '85vh', background: '#FFFFFF',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '32px', boxShadow: '-4px 0 30px rgba(0,0,0,0.06)',
    overflowY: 'auto' as const,
  },
  form: {
    width: '100%', maxWidth: 380, marginTop: -8,
  },
  formTitle: {
    fontFamily: "'Fraunces', Georgia, serif", fontSize: '1.6rem',
    fontWeight: 500, color: '#3E2E20', marginBottom: 4,
  },
  formSub: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem',
    color: '#8C8279', marginBottom: 24,
  },
  formGroup: {
    marginBottom: 14, flex: 1,
  },
  formLabel: {
    fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em',
    textTransform: 'uppercase' as const, color: '#5C534A',
    marginBottom: 6, display: 'block',
    fontFamily: "'DM Sans', sans-serif",
  },
  input: {
    width: '100%', padding: '10px 12px', background: '#FAF7F2',
    border: '1px solid #EAE2D6', borderRadius: 4, fontSize: '0.85rem',
    color: '#2A2420', fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s',
  },
  formRow: {
    display: 'flex', gap: 12,
  },
  addressWrap: {
    display: 'flex', alignItems: 'center', gap: 8,
    width: '100%', padding: '10px 12px', background: '#FAF7F2',
    border: '1px solid #EAE2D6', borderRadius: 4,
  },
  addressInput: {
    flex: 1, border: 'none', background: 'transparent', outline: 'none',
    fontSize: '0.85rem', color: '#2A2420', fontFamily: "'DM Sans', sans-serif",
  },
  addressHint: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem',
    color: '#C8A84E', marginTop: 4, display: 'block',
  },
  addrDropdown: {
    background: '#FFFFFF', border: '1px solid #EAE2D6',
    borderRadius: '0 0 4px 4px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
    marginTop: -1,
  },
  addrResult: {
    display: 'flex', alignItems: 'flex-start', gap: 8,
    padding: '10px 12px', width: '100%', background: 'transparent',
    border: 'none', borderBottom: '1px solid #F3EDE4',
    cursor: 'pointer', textAlign: 'left' as const,
    transition: 'background 0.15s',
  },
  addrResultText: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem',
    color: '#3E2E20', lineHeight: 1.4,
  },
  submit: {
    width: '100%', padding: '13px 0', background: '#6B5744', color: '#FAF7F2',
    fontSize: '0.88rem', fontWeight: 600, borderRadius: 4, border: 'none',
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.03em', transition: 'background 0.2s', marginTop: 4,
  },
  formNote: {
    textAlign: 'center' as const, fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.72rem', color: '#8C8279', marginTop: 12,
  },
  success: {
    textAlign: 'center' as const, padding: '40px 20px',
  },
  successTitle: {
    fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem',
    fontWeight: 500, color: '#3E2E20', margin: '20px 0 12px',
  },
  successText: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem',
    color: '#5C534A', lineHeight: 1.6, marginBottom: 24,
  },
  resetBtn: {
    padding: '10px 24px', background: 'transparent', color: '#6B5744',
    fontSize: '0.85rem', fontWeight: 500, borderRadius: 4,
    border: '1px solid #C8B99A', cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
}
