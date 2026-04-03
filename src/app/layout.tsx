import type { Metadata } from 'next'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import MobileCTA from '@/components/MobileCTA'
import GrainOverlay from '@/components/GrainOverlay'
import ScrollToTop from '@/components/ScrollToTop'
import ChatBot from '@/components/ChatBot'

export const metadata: Metadata = {
  title: 'Ivory & Oak Cleaning Co. | Rooted in Care, Finished with Grace',
  description: 'Cincinnati\'s warmest, most reliable home cleaning service. Recurring cleans, deep cleans, and move-in/move-out services — with Southern charm and professional care.',
  openGraph: {
    title: 'Ivory & Oak Cleaning Co.',
    description: 'Professional home cleaning with the warmth of Southern hospitality. Serving Cincinnati and surrounding areas.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Ivory & Oak Cleaning Co.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ivory & Oak Cleaning Co.',
    description: 'Professional home cleaning with the warmth of Southern hospitality. Serving Cincinnati and surrounding areas.',
  },
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/hero-poster.jpg" fetchPriority="high" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Fraunces:ital,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400;1,9..144,500&family=DM+Sans:wght@400;500;600&display=swap" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </head>
      <body>
        <GrainOverlay />
        {children}
        <ScrollToTop />
        <ChatBot />
        <MobileCTA />
      </body>
    </html>
  )
}
