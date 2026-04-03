'use client'

import { useState, useRef, useCallback } from 'react'

const comparisons = [
  {
    before: '/images/before-after/kitchen-before.avif',
    after: '/images/before-after/kitchen-after.avif',
    label: 'Kitchen',
  },
  {
    before: '/images/before-after/livingroom-before.avif',
    after: '/images/before-after/livingroom-after.avif',
    label: 'Living Room',
  },
  {
    before: '/images/before-after/bathroom-before.avif',
    after: '/images/before-after/bathroom-after.avif',
    label: 'Bathroom',
  },
]

export default function BeforeAfter() {
  const [activeTab, setActiveTab] = useState(0)
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setSliderPos((x / rect.width) * 100)
  }, [])

  const onMouseDown = () => { dragging.current = true }
  const onMouseUp = () => { dragging.current = false }
  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging.current) handleMove(e.clientX)
  }
  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true
  }
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    if (touch) handleMove(touch.clientX)
  }

  const current = comparisons[activeTab]!

  return (
    <section style={s.section}>
      <div style={s.narrow}>
        <div style={s.header}>
          <div>
            <div style={s.eyebrow}>Results</div>
            <h2 style={s.heading}>See the Difference</h2>
          </div>
          <p style={s.body}>Drag the slider to reveal the transformation.</p>
        </div>

        <div style={s.tabs}>
          {comparisons.map((c, i) => (
            <button
              key={i}
              style={{
                ...s.tab,
                color: i === activeTab ? '#3E2E20' : '#8C8279',
                borderBottom: i === activeTab ? '2px solid #C8A84E' : '2px solid transparent',
              }}
              onClick={() => { setActiveTab(i); setSliderPos(50) }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div
          ref={containerRef}
          style={s.comparison}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseMove={onMouseMove}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onMouseUp}
        >
          {/* After (background) */}
          <div style={{
            ...s.imageLayer,
            backgroundImage: `url(${current.after})`,
          }} />

          {/* Before (clipped) */}
          <div style={{
            ...s.imageLayer,
            backgroundImage: `url(${current.before})`,
            clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
          }} />

          {/* Slider line */}
          <div style={{ ...s.sliderLine, left: `${sliderPos}%` }}>
            <div style={s.sliderHandle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>

          {/* Labels */}
          <span style={{ ...s.imageLabel, left: 16 }}>Before</span>
          <span style={{ ...s.imageLabel, right: 16 }}>After</span>
        </div>
      </div>
    </section>
  )
}

const s: Record<string, React.CSSProperties> = {
  section: {
    padding: '48px 0 80px',
  },
  narrow: {
    maxWidth: 1100, margin: '0 auto', padding: '0 32px',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    flexWrap: 'wrap' as const, gap: 20, marginBottom: 24,
  },
  eyebrow: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600,
    letterSpacing: '0.18em', textTransform: 'uppercase' as const,
    color: '#C8A84E', marginBottom: 12,
  },
  heading: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 400,
    color: '#3E2E20', lineHeight: 1.15, marginBottom: 0,
  },
  body: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem',
    color: '#8C8279', margin: 0,
  },
  tabs: {
    display: 'flex', gap: 0, marginBottom: 0,
    borderBottom: '1px solid #EAE2D6',
  },
  tab: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 600,
    letterSpacing: '0.04em', padding: '12px 24px',
    background: 'none', border: 'none', cursor: 'pointer',
    transition: 'all 0.2s',
  },
  comparison: {
    position: 'relative' as const, width: '100%', height: 480,
    cursor: 'ew-resize', overflow: 'hidden',
    userSelect: 'none' as const, WebkitUserSelect: 'none' as const,
    touchAction: 'none',
  },
  imageLayer: {
    position: 'absolute' as const, inset: 0,
    backgroundSize: 'cover', backgroundPosition: 'center',
  },
  sliderLine: {
    position: 'absolute' as const, top: 0, bottom: 0,
    width: 2, background: '#FFFFFF',
    transform: 'translateX(-50%)', zIndex: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    pointerEvents: 'none' as const,
  },
  sliderHandle: {
    position: 'absolute' as const, top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 40, height: 40, borderRadius: '50%',
    background: 'rgba(200,168,78,0.95)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 0, boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
  },
  imageLabel: {
    position: 'absolute' as const, bottom: 16,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 700,
    letterSpacing: '0.14em', textTransform: 'uppercase' as const,
    color: '#FFFFFF', background: 'rgba(0,0,0,0.45)',
    padding: '4px 12px', borderRadius: 4, zIndex: 5,
  },
}
