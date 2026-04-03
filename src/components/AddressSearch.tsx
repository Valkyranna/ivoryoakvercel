'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface SearchResult {
  lat: number
  lng: number
  label: string
}

interface Props {
  onAddressSelect: (address: string) => void
  onSearchResult?: (result: SearchResult) => void
}

// Ohio bounding box: viewbox=left,top,right,bottom (lon,lat)
const OHIO_VIEWBOX = '-84.82,41.98,-80.52,38.40'

export default function AddressSearch({ onAddressSelect, onSearchResult }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([])
  const [searching, setSearching] = useState(false)
  const [sent, setSent] = useState(false)
  const [focused, setFocused] = useState(false)
  const debounceRef = useRef<number>(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (results.length > 0 && dropdownRef.current) {
      setTimeout(() => {
        dropdownRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)
    }
  }, [results])

  const doSearch = useCallback(async (value: string) => {
    if (value.trim().length < 3) {
      setResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    setSent(false)
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=6&viewbox=${OHIO_VIEWBOX}&bounded=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      if (resp.ok) {
        const data = await resp.json()
        setResults(data)
      }
    } catch {
      setResults([])
    }
    setSearching(false)
  }, [])

  const onChange = (value: string) => {
    setQuery(value)
    setSent(false)
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => doSearch(value), 350)
  }

  const sendToForm = (address: string) => {
    setQuery(address)
    setResults([])
    setSent(true)
    setFocused(false)
    onAddressSelect(address)
  }

  return (
    <div style={s.container}>
      <div style={s.inputWrap}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C8279" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        <input
          id="map-address-search"
          name="mapAddress"
          type="text"
          value={query}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Enter your Ohio address..."
          style={s.input}
          autoComplete="off"
        />
        {searching && (
          <span style={s.spinner}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8A84E" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2a10 10 0 0 1 10 10"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path>
            </svg>
          </span>
        )}
      </div>

      {focused && results.length > 0 && !sent && (
        <div style={s.dropdown} ref={dropdownRef}>
          {results.map((r, i) => (
            <button key={i} style={s.resultItem} onMouseDown={() => {
              sendToForm(r.display_name)
              onSearchResult?.({ lat: parseFloat(r.lat), lng: parseFloat(r.lon), label: r.display_name })
            }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(200,168,78,0.06)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A84E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span style={s.resultText}>{r.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {focused && query.trim().length >= 3 && results.length === 0 && !searching && !sent && (
        <div style={s.noResults}>
          <span style={s.noResultsText}>No Ohio addresses found — try a different search</span>
        </div>
      )}

      {sent && (
        <div style={s.sent}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A7A5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span style={s.sentText}>Address added — booking form updated</span>
        </div>
      )}
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative' as const,
  },
  inputWrap: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 14px', background: '#FFFFFF',
    border: '1px solid #EAE2D6', borderRadius: 6,
  },
  input: {
    flex: 1, border: 'none', background: 'transparent', outline: 'none',
    fontFamily: "var(--font-dm-sans), sans-serif", fontSize: '0.88rem',
    color: '#3E2E20',
  },
  spinner: {
    flexShrink: 0, display: 'flex', alignItems: 'center',
  },
  dropdown: {
    position: 'relative' as const,
    background: '#FFFFFF', border: '1px solid #EAE2D6',
    borderRadius: '0 0 6px 6px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    zIndex: 2000, maxHeight: 260, overflowY: 'auto' as const,
  },
  resultItem: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    padding: '10px 14px', width: '100%', background: 'transparent',
    border: 'none', borderBottom: '1px solid #F3EDE4',
    cursor: 'pointer', textAlign: 'left' as const,
    transition: 'background 0.15s',
  },
  resultText: {
    fontFamily: "var(--font-dm-sans), sans-serif", fontSize: '0.82rem',
    color: '#3E2E20', lineHeight: 1.4,
  },
  noResults: {
    position: 'relative' as const,
    background: '#FFFFFF', border: '1px solid #EAE2D6',
    borderRadius: '0 0 6px 6px', padding: '12px 14px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 2000,
  },
  noResultsText: {
    fontFamily: "var(--font-dm-sans), sans-serif", fontSize: '0.82rem',
    color: '#8C8279', fontStyle: 'italic',
  },
  sent: {
    display: 'flex', alignItems: 'center', gap: 8,
    marginTop: 10, padding: '8px 12px',
    background: 'rgba(90,122,90,0.06)', borderRadius: 4,
  },
  sentText: {
    fontFamily: "var(--font-dm-sans), sans-serif", fontSize: '0.78rem',
    color: '#5A7A5A', fontWeight: 500,
  },
}
