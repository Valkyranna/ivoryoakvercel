'use client'

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        <div style={s.top}>
          <div style={s.brand}>
            <img src="/logo.png" alt="Ivory & Oak" style={{ height: 28, width: 'auto', display: 'block' }} />
            <span style={s.brandText}>Ivory & Oak Cleaning Co. LLC</span>
          </div>
          <span style={s.tagline}>Rooted in care, finished with grace.</span>
        </div>
        <div style={s.divider} />
        <div style={s.bottom}>
          <span style={s.copy}>&copy; {new Date().getFullYear()} Ivory & Oak Cleaning Co. LLC. All rights reserved.</span>
          <span style={s.copy}>Cincinnati, Ohio</span>
        </div>
      </div>
    </footer>
  )
}

const s: Record<string, React.CSSProperties> = {
  footer: {
    padding: '40px 0 32px', background: '#F3EDE4',
  },
  inner: {
    maxWidth: 1100, margin: '0 auto', padding: '0 32px',
  },
  top: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap' as const, gap: 12, marginBottom: 20,
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  brandText: {
    fontFamily: "var(--font-playfair), Georgia, serif", fontSize: '1rem',
    fontWeight: 600, color: '#3E2E20',
  },
  tagline: {
    fontFamily: "var(--font-playfair), Georgia, serif", fontSize: '0.9rem',
    fontStyle: 'italic', color: '#C8A84E',
  },
  divider: {
    height: 1, background: 'linear-gradient(90deg, transparent, #C8B99A, transparent)',
    marginBottom: 20,
  },
  bottom: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap' as const, gap: 12,
  },
  copy: {
    fontFamily: "var(--font-dm-sans), sans-serif", fontSize: '0.75rem', color: '#8C8279',
  },
}
