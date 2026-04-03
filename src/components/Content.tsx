'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import AddressSearch from './AddressSearch'
import Reveal from './Reveal'

const BeforeAfter = dynamic(() => import('./BeforeAfter'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: 480, background: '#F3EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#8C8279' }}>Loading...</span></div>,
})

const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: '#F3EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#8C8279' }}>Loading map...</span></div>,
})

interface SearchResult {
  lat: number
  lng: number
  label: string
}

interface Props {
  onAddressSelect?: (address: string) => void
  currentAddress?: string
}

const services = [
  {
    title: 'Recurring Cleaning',
    desc: 'Weekly, bi-weekly, or monthly. Same team, every time — we learn your home so each visit feels effortless.',
  },
  {
    title: 'Deep Cleaning',
    desc: 'Inside appliances, behind furniture, baseboards, vents, window tracks. The full treatment for every surface.',
  },
  {
    title: 'Move-In / Move-Out',
    desc: 'Full interior clean for fresh starts and clean departures. Deposit-ready, move-in perfect.',
  },
]

const plans = [
  {
    name: 'Fresh Start',
    label: 'One-Time Deep Clean',
    price: '189',
    unit: 'from',
    desc: 'A thorough, top-to-bottom clean for seasonal refreshes or first-time service.',
    features: ['All rooms dusted & vacuumed', 'Kitchen & bath deep clean', 'Baseboards & trim', 'Floor mopping & polishing'],
    highlight: false,
  },
  {
    name: 'Sweet as Tea',
    label: 'Bi-Weekly',
    price: '129',
    unit: 'per visit',
    desc: 'Our most popular plan. Consistent, reliable cleaning from the same team you trust.',
    features: ['Everything in Fresh Start', 'Dedicated cleaning team', 'Flexible rescheduling', 'Priority booking'],
    highlight: true,
  },
  {
    name: 'Front Porch',
    label: 'Weekly',
    price: '109',
    unit: 'per visit',
    desc: 'The full treatment, every week. Laundry, linen changes, and picture-perfect spaces.',
    features: ['Everything in Sweet as Tea', 'Laundry folding', 'Bed linen changes', 'Fridge & pantry tidy'],
    highlight: false,
  },
]

export default function Content({ onAddressSelect, currentAddress }: Props) {
  const goBooking = () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)

  useEffect(() => {
    if (!currentAddress) setSearchResult(null)
  }, [currentAddress])

  const handleAddress = (address: string) => {
    onAddressSelect?.(address)
    goBooking()
  }

  return (
    <>
      {/* Services */}
      <section id="services" style={st.section}>
        <div style={st.narrow}>
          <Reveal>
            <div style={st.eyebrow}>Services</div>
            <h2 style={st.heading}>What We Do</h2>
          </Reveal>
          <div style={st.servicesGrid} className="services-grid">
            {services.map((svc, i) => (
              <Reveal key={i} delay={100 + i * 80}>
                <div style={st.serviceItem} className="service-item">
                  <div className="service-accent" />
                  <h3 style={st.serviceTitle}>{svc.title}</h3>
                  <p style={st.serviceDesc}>{svc.desc}</p>
                  <button style={st.serviceLink} onClick={goBooking}
                    onMouseOver={e => e.currentTarget.style.color = '#C8A84E'}
                    onMouseOut={e => e.currentTarget.style.color = '#6B5744'}
                  >
                    Book this service →
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div style={st.divider} />

      {/* Pricing */}
      <section id="pricing" style={st.pricingSection}>
        <div style={st.narrow}>
          <Reveal>
            <div style={st.pricingHeader} className="pricing-header">
              <div>
                <div style={st.eyebrow}>Pricing</div>
                <h2 style={st.heading}>Straightforward Rates</h2>
              </div>
              <p style={{ ...st.body, margin: 0, textAlign: 'right' as const, maxWidth: 340 }}>
                No hidden fees. No surprises.<br />Just honest pricing.
              </p>
            </div>
          </Reveal>
          <div style={st.pricingTable} className="pricing-table">
            {plans.map((plan, i) => (
              <div
                key={i}
                className="plan-col"
                style={{
                  ...st.planCol,
                  ...(plan.highlight ? st.planColHighlight : {}),
                }}
                onMouseOver={e => {
                  const line = e.currentTarget.querySelector('.plan-line') as HTMLElement
                  if (line) line.style.width = '48px'
                }}
                onMouseOut={e => {
                  const line = e.currentTarget.querySelector('.plan-line') as HTMLElement
                  if (line) line.style.width = '32px'
                }}
              >
                {plan.highlight && (
                  <div style={st.planAccent} />
                )}
                {plan.highlight && <span style={st.planRecommended}>Most Popular</span>}
                <span style={st.planLabel}>{plan.label}</span>
                <h3 style={st.planName}>{plan.name}</h3>
                <p style={st.planDesc}>{plan.desc}</p>

                <div style={st.planPriceWrap}>
                  <span style={st.planDollar}>$</span>
                  <span style={st.planPrice}>{plan.price}</span>
                </div>
                <span style={st.planUnit}>{plan.unit}</span>

                <div className="plan-line" style={st.planLine} />

                <ul style={st.planFeatures}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={st.planFeature}>
                      <span style={st.featureCheck}>✦</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button style={st.planBtn} onClick={goBooking}
                  onMouseOver={e => { e.currentTarget.style.color = '#C8A84E' }}
                  onMouseOut={e => { e.currentTarget.style.color = '#6B5744' }}
                >
                  Book this plan →
                </button>
              </div>
            ))}
          </div>
          <div style={st.pricingFooter}>
            <p style={st.priceNote}>Move-in/move-out from $249. Custom quotes available.</p>
            <p style={st.priceNote}>All prices for standard homes. Large or specialty homes quoted individually.</p>
          </div>
        </div>
      </section>

      <BeforeAfter />

      <div style={st.divider} />

      {/* Contact / Map */}
      <section id="contact" style={st.mapSection}>
        <div style={st.mapHeader}>
          <div style={st.narrow}>
            <Reveal>
              <div style={st.mapHeaderInner}>
                <div>
                  <div style={st.eyebrow}>Find Us</div>
                  <h2 style={{ ...st.heading, marginBottom: 0 }}>Cincinnati & Beyond</h2>
                </div>
                <div style={st.contactInline}>
                  <a href="tel:5135552532" style={st.inlineItem}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C8A84E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    (513) 555-CLEAN
                  </a>
                  <span style={st.inlineDot}>·</span>
                  <a href="mailto:hello@ivoryandoakcleaning.com" style={st.inlineItem}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C8A84E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    hello@ivoryandoakcleaning.com
                  </a>
                  <span style={st.inlineDot}>·</span>
                  <span style={st.inlineItem}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C8A84E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    Mon – Sat, 8am – 6pm
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
        <div style={st.mapSearchWrap}>
          <AddressSearch
            onAddressSelect={handleAddress}
            onSearchResult={(result) => setSearchResult(result)}
          />
          {searchResult && (
            <div style={st.selectedCard}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A7A5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <div>
                <div style={st.selectedLabel}>Selected Address</div>
                <div style={st.selectedAddr}>{searchResult.label}</div>
              </div>
            </div>
          )}
        </div>
        <div style={st.mapStrip}>
          <span style={st.mapStripText}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A84E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
            Search for your address or click on the map to set your location
          </span>
        </div>
        <div style={st.mapFull}>
          <InteractiveMap
            searchResult={searchResult}
            onMapClick={handleAddress}
          />
        </div>
      </section>
      <style>{`
        .service-item {
          position: relative;
        }
        .service-accent {
          display: none;
        }
        @media (max-width: 768px) {
          .services-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .pricing-table { grid-template-columns: 1fr !important; }
          .pricing-header { flex-direction: column !important; align-items: flex-start !important; }
          .service-item {
            padding: 20px 16px 20px 20px !important;
            background: rgba(255,255,255,0.5);
            border: 1px solid rgba(234,226,214,0.6);
            border-radius: 8px;
            margin-bottom: 12px;
          }
        }
      `}</style>
    </>
  )
}

const st: Record<string, React.CSSProperties> = {
  section: {
    padding: '80px 0', overflow: 'hidden',
  },
  narrow: {
    maxWidth: 1100, margin: '0 auto', padding: '0 32px',
  },
  eyebrow: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600,
    letterSpacing: '0.18em', textTransform: 'uppercase' as const,
    color: '#C8A84E', marginBottom: 12,
  },
  heading: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 400,
    color: '#3E2E20', lineHeight: 1.15, marginBottom: 16,
  },
  body: {
    fontSize: '0.95rem', color: '#5C534A', lineHeight: 1.7, maxWidth: 540,
  },
  divider: {
    width: '100%', maxWidth: 1100, margin: '0 auto', height: 1,
    background: 'linear-gradient(90deg, transparent, #EAE2D6, transparent)',
  },
  servicesGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40,
    marginTop: 40,
  },
  serviceItem: {},
  serviceTitle: {
    fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem',
    fontWeight: 600, color: '#3E2E20', marginBottom: 12,
  },
  serviceDesc: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem',
    color: '#5C534A', lineHeight: 1.7, marginBottom: 16,
  },
  serviceLink: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 600,
    color: '#6B5744', background: 'none', border: 'none', cursor: 'pointer',
    padding: 0, transition: 'color 0.2s', letterSpacing: '0.02em',
  },
  featuresStrip: {
    display: 'flex', flexWrap: 'wrap' as const, gap: 32, justifyContent: 'center',
  },
  featureItem: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  featureText: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem',
    fontWeight: 500, color: '#5C534A',
  },
  pricingSection: {
    padding: '80px 0',
  },
  pricingHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    flexWrap: 'wrap' as const, gap: 20, marginBottom: 48,
    paddingBottom: 28, borderBottom: '1px solid #EAE2D6',
  },
  pricingTable: {
    display: 'grid', gridTemplateColumns: '1fr 1.08fr 1fr',
  },
  planCol: {
    padding: '36px 28px 32px', borderBottom: '1px solid #EAE2D6',
    borderRight: '1px solid #EAE2D6', position: 'relative' as const,
    display: 'flex', flexDirection: 'column', transition: 'background 0.3s ease',
  },
  planColHighlight: {
    background: 'rgba(200,168,78,0.04)',
    borderLeft: '1px solid #EAE2D6',
  },
  planAccent: {
    position: 'absolute' as const, top: 0, left: 28, right: 28,
    height: 2, background: '#C8A84E',
  },
  planRecommended: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', fontWeight: 700,
    letterSpacing: '0.16em', textTransform: 'uppercase' as const,
    color: '#C8A84E', marginBottom: 14,
  },
  planLabel: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.66rem', fontWeight: 600,
    letterSpacing: '0.12em', textTransform: 'uppercase' as const,
    color: '#8C8279', marginBottom: 8,
  },
  planName: {
    fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem',
    fontWeight: 500, color: '#3E2E20', marginBottom: 10, lineHeight: 1.15,
  },
  planDesc: {
    fontFamily: "'Playfair Display', Georgia, serif", fontSize: '0.88rem',
    fontStyle: 'italic', color: '#5C534A', lineHeight: 1.6,
    marginBottom: 28,
  },
  planPriceWrap: {
    display: 'flex', alignItems: 'flex-start', gap: 2, marginBottom: 2,
  },
  planDollar: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 600,
    color: '#3E2E20', marginTop: 8,
  },
  planPrice: {
    fontFamily: "'Playfair Display', Georgia, serif", fontSize: '3rem',
    fontWeight: 400, color: '#3E2E20', lineHeight: 1, letterSpacing: '-0.02em',
  },
  planUnit: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem',
    color: '#8C8279', marginBottom: 18,
  },
  planLine: {
    width: 32, height: 1.5, background: '#C8A84E', marginBottom: 20,
    transition: 'width 0.3s ease',
  },
  planFeatures: {
    listStyle: 'none', padding: 0, margin: '0 0 24px',
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  planFeature: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem',
    color: '#5C534A', display: 'flex', alignItems: 'center', gap: 8,
  },
  featureCheck: {
    color: '#C8A84E', fontSize: '0.55rem',
  },
  planBtn: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 600,
    color: '#6B5744', background: 'none', border: 'none', cursor: 'pointer',
    padding: 0, textAlign: 'left' as const, transition: 'color 0.2s',
    letterSpacing: '0.02em', marginTop: 'auto',
  },
  pricingFooter: {
    marginTop: 12, paddingTop: 12,
    display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' as const,
    gap: 8,
  },
  priceNote: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem',
    color: '#8C8279',
  },
  testimonial: {
    textAlign: 'center' as const, maxWidth: 640, margin: '0 auto',
  },
  quote: {
    fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
    fontWeight: 400, fontStyle: 'italic', color: '#3E2E20', lineHeight: 1.6,
    margin: '20px 0',
  },
  quoteAuthor: {
    display: 'flex', flexDirection: 'column', gap: 2,
  },
  quoteName: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
    fontWeight: 600, color: '#3E2E20',
  },
  quoteLoc: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#8C8279',
  },
  mapSection: {
    paddingBottom: 0,
  },
  mapHeader: {
    padding: '60px 0 0', background: '#FAF7F2',
  },
  mapHeaderInner: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    flexWrap: 'wrap' as const, gap: 24, paddingBottom: 32,
    borderBottom: '1px solid #EAE2D6',
  },
  contactInline: {
    display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' as const,
  },
  inlineItem: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem',
    color: '#5C534A', textDecoration: 'none', fontWeight: 500,
  },
  inlineDot: {
    color: '#C8B99A', fontSize: '0.9rem',
  },
  mapSearchWrap: {
    maxWidth: 1100, margin: '0 auto', padding: '20px 32px 0',
    position: 'relative' as const, zIndex: 10,
  },
  selectedCard: {
    display: 'flex', alignItems: 'center', gap: 12,
    marginTop: 12, padding: '12px 16px',
    background: 'rgba(90,122,90,0.06)', border: '1px solid rgba(90,122,90,0.15)',
    borderRadius: 6,
  },
  selectedLabel: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase' as const,
    color: '#5A7A5A', marginBottom: 2,
  },
  selectedAddr: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem',
    color: '#3E2E20', fontWeight: 500, lineHeight: 1.4,
  },
  mapStrip: {
    maxWidth: 1100, margin: '0 auto', padding: '0 32px',
  },
  mapStripText: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 16px',
    background: 'rgba(200,168,78,0.04)', borderBottom: '1px solid #EAE2D6',
    borderTop: '1px solid #EAE2D6',
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem',
    fontWeight: 500, color: '#8C8279',
  },
  mapFull: {
    width: '100%', height: 420,
  },
}
