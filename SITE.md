# Ivory & Oak Cleaning Co. — Site Documentation

## Project Overview

A single-page marketing and booking website for **Ivory & Oak Cleaning Co. LLC**, a Cincinnati-based residential cleaning company. The brand blends professional service with Southern warmth and a modern, editorial design.

**Tagline:** "Rooted in care, finished with grace"

**Brand voice:** Friendly, Southern, welcoming. Polished and trustworthy for modern homeowners.

**Production URL:** https://ivoryoak.vercel.app/
**GitHub:** https://github.com/Valkyranna/ivoryoakvercel

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16.2.0 | React framework (App Router) |
| Bun | 1.2.21 | Package manager & runtime |
| TypeScript | 5.x | Type safety |
| React | 19.2.4 | UI library |
| Leaflet / react-leaflet | Latest | Interactive map |
| Compromise.js | 14.15.0 | Client-side NLP for chatbot |
| Fuse.js | 7.1.0 | Fuzzy search for chatbot FAQ |
| CSS-in-JS | Inline styles | All component styling |
| Vercel | — | Hosting & CI/CD |

**IMPORTANT:** The dev script uses `next dev --webpack` because Turbopack in Next.js 16.2 has a bug with `'use client'` form handlers that throws `components.ComponentMod.handler is not a function`.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Google Fonts, metadata, OG tags, favicon
│   ├── page.tsx            # Main page — assembles all sections, manages shared address state
│   ├── globals.css         # CSS variables, base styles, responsive rules, grain texture
│   └── not-found.tsx       # Custom 404 page
└── components/
    ├── Navbar.tsx          # Fixed top navigation with mobile drawer
    ├── Hero.tsx            # Split hero: video background + booking form
    ├── Content.tsx         # Services, Pricing, Before/After, Contact/Map sections
    ├── BeforeAfter.tsx     # Draggable before/after image comparison slider
    ├── AddressSearch.tsx   # Ohio-only geocoding address search
    ├── InteractiveMap.tsx  # Leaflet map with search result pins
    ├── ChatBot.tsx         # AI-like chatbot with NLP, FAQ, and booking flow
    ├── Reveal.tsx          # Scroll-triggered fade-up animation wrapper
    ├── MobileCTA.tsx       # Sticky "Book a Cleaning" button on mobile
    ├── ScrollToTop.tsx     # Scroll-to-top button (appears near bottom of page)
    ├── GrainOverlay.tsx    # SVG noise texture overlay for paper-like feel
    └── Footer.tsx          # Minimal footer with brand and copyright
```

---

## Fonts

Loaded via Google Fonts `<link>` tag in `layout.tsx`. **DO NOT use `next/font/google`** — it only loads fallback fonts with the webpack dev server.

- **Fraunces** — Hero headline, section headings, form title (soft, warm serif)
- **Playfair Display** — Service titles, navbar logo, footer (elegant editorial serif)
- **DM Sans** — Body text, labels, UI elements (clean sans-serif)

Font references in components use direct names: `'Fraunces'`, `'Playfair Display'`, `'DM Sans'`.

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Ivory | `#FAF7F2` | Main background |
| Cream | `#F3EDE4` | Secondary backgrounds |
| Linen | `#EAE2D6` | Borders, dividers |
| Sand | `#C8B99A` | Muted accents |
| Oak | `#6B5744` | Buttons, links, dark text |
| Oak Dark | `#3E2E20` | Headings, hero background |
| Gold | `#C8A84E` | Primary accent, CTAs, chat icon |
| Green | `#5A7A5A` | Success states |
| Text | `#2A2420` | Primary text |
| Text Mid | `#5C534A` | Secondary text |
| Text Light | `#8C8279` | Muted text |

---

## Page Sections

### 1. Navbar
- Fixed top, 60px height, opaque ivory background
- Left: logo PNG + "Ivory & Oak" / "Cleaning Co." stacked text
- Right: Services, Pricing, Contact links with gold underline hover + separator + phone number + gold "Book a Cleaning" button
- Mobile: hamburger → slide-in drawer from right with backdrop
- Links smooth-scroll with 72px offset for fixed navbar

### 2. Hero
- Split layout: left 52% (video/image) + right 440px (white booking form panel)
- Desktop: 1080p video. Mobile: 480p video (4.2MB vs 15MB)
- Video auto-plays, loops, muted, playsInline with poster image preloaded
- Fraunces heading: "Rooted in Care, Finished with Grace"
- Booking form: Name, Phone, Email, Address (with Ohio-only geocoding), Service type, Home size, Date, Notes
- Submit shows "Sending..." for 1.5s then success state
- `isMobile` state detected via window resize

### 3. Services ("What We Do")
- 3-column grid: Recurring Cleaning, Deep Cleaning, Move-In/Move-Out
- Playfair Display titles, DM Sans descriptions, "Book this service →" links
- Staggered scroll-reveal animations
- Mobile: single column with card-like items, gold left accent, background tint

### 4. Before/After Slider
- 3 tabs: Kitchen, Living Room, Bathroom
- Draggable slider with gold circular handle
- Touch-friendly: `touch-action: none`, `preventDefault` on touch move
- "Before" and "After" labels

### 5. Pricing
- Split header: "Straightforward Rates" left, subtitle right
- 3-column editorial table (not cards)
- Middle plan slightly wider with gold top accent
- Each: label, name, italic description, large price, gold line, feature list with ✦ markers
- "Book this plan →" text link
- Footer: pricing notes

### 6. Contact / Map
- Header: "Cincinnati & Beyond" left, inline contact right
- Address search: Ohio-only geocoding (Nominatim API), real-time search as you type
- Interactive Leaflet map (OpenStreetMap tiles, CartoDB Voyager)
- Click map to drop pin and set address
- Selected address card shows below search
- Search flows address to booking form and scrolls to hero

### 7. Footer
- Sunflower logo + "Ivory & Oak Cleaning Co. LLC"
- Italic tagline: "Rooted in care, finished with grace."
- Copyright

### 8. ChatBot
- Floating white button with gold icon (bottom-right desktop, bottom: 70px mobile)
- Hides when chat is open
- Chat panel: full-screen on mobile, 380x500px on desktop
- Fade-in animation on open

**ChatBot Features:**
- **10 FAQ entries** covering services, pricing, supplies, pets, insurance, cancellation, areas, booking, timing
- **Fuse.js fuzzy matching** for question understanding
- **Compromise.js NLP:**
  - Name extraction (`nlp().people()`)
  - Date parsing (today, tomorrow, next [day], month/day, MM/DD)
  - Sentiment detection (frustrated/positive/neutral)
  - Intent detection (desire verbs + cleaning nouns)
  - Possessive property type inference ("my office" → Commercial)
  - Room count parsing ("3 bedrooms" → 2-3 Bedrooms)
  - Contraction normalization
  - Negation detection
- **Booking flow:** Service → Size → Address (with Ohio geocoding) → Date → Name → Phone → Email → Confirm
- **Smart skipping:** Skips steps if data was already extracted from initial message
- **Handoff to human:** When bot fails, offers Call/Email/Book options
- **Conversation memory:** Tracks last 4 topics for context
- **Rich responses:** Pricing includes scroll link to pricing section
- **Persistent chat:** localStorage with 2-hour expiry
- **Mobile:** Full-screen, 16px input (prevents iOS zoom), "Close Chat" button, bigger touch targets

---

## Security Headers (next.config.ts)

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- X-DNS-Prefetch-Control: on
- Permissions-Policy: camera=(), microphone=(), geolocation=()

---

## Key Configuration

### next.config.ts
```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.0.84'],
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
```

### package.json scripts
```json
{
  "dev": "next dev --webpack",
  "build": "next build",
  "start": "next start"
}
```

---

## Third-Party Services

| Service | Usage | Free? |
|---------|-------|-------|
| Unsplash | Before/After images | Yes |
| Google Maps Embed | Contact section map | Yes |
| Nominatim (OSM) | Address geocoding (Ohio-only) | Yes |
| Google Fonts | Fraunces, Playfair Display, DM Sans | Yes |
| Leaflet + OpenStreetMap | Interactive map tiles | Yes |
| CartoDB | Map tile style (Voyager) | Yes |

**No API keys required.** All services are free.

---

## Deployment

- **Hosting:** Vercel
- **CI/CD:** Auto-deploys on push to `main` branch on GitHub
- **Branch:** `main` (NOT `master`)
- **Domain:** https://ivoryoak.vercel.app/

---

## Known Issues & Notes

1. **Turbopack broken** — Must use `--webpack` flag for dev. Turbopack throws handler errors with client components.
2. **Dark Reader** — Browser extension causes hydration mismatches. `color-scheme: light` meta tag helps but doesn't fully prevent it.
3. **Dark mode** — The site has a warm ivory palette. Dark mode extensions will distort colors. CSS `color-scheme: light` is set.
4. **Video files** — `hero-video.webm` (1080p, 15MB) and `hero-video-480p.webm` (480p, 4.2MB) in `public/`.
5. **Logo** — `MainCompanyLogo.png` copied to `public/logo.png`.
6. **Favicon** — `Favicon.png` copied to `public/favicon.png`.
7. **Before/After images** — Unsplash URLs. Bathroom images have been problematic (portrait photos, duplicates). Current set works but may need verification.
8. **Address search** — Uses Nominatim API which is free but rate-limited. Debounced at 350ms.
9. **Chatbot localStorage** — Expires after 2 hours. On SSR build, localStorage check is wrapped in try/catch.
10. **Grain overlay** — SVG feTurbulence noise, opacity 0.35, mix-blend-mode multiply. Some users find it too subtle or too heavy.

---

## Running Locally

```bash
bun install
bun run dev
# Opens at http://localhost:3000
# Network at http://192.168.0.84:3000
```

---

## What's NOT Implemented (Discussed but Deferred)

- **Form submission** — Currently fakes a 1.5s delay with success message. No backend or email. Discussed Formspree, mailto, WhatsApp — all deferred.
- **Payment** — Invoice after service. No payment processing on site.
- **Real testimonials** — Placeholder design exists but no real reviews yet.
- **About section** — No brand story, founding details, or team info yet.
- **FAQ page** — Info exists in chatbot but not on the main page.
- **Social media links** — Not added yet.
- **Referral program** — Discussed but not implemented.
- **Gift certificates** — Discussed but not implemented.
- **Voice input** — Web Speech API discussed but not implemented.
