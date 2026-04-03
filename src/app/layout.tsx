import type { Metadata } from 'next'
import { Playfair_Display, Fraunces, DM_Sans } from 'next/font/google'
import './globals.css'
import MobileCTA from '@/components/MobileCTA'
import GrainOverlay from '@/components/GrainOverlay'
import ScrollToTop from '@/components/ScrollToTop'
import ChatBot from '@/components/ChatBot'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-fraunces',
  display: 'swap',
  preload: true,
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
})

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
    <html lang="en" className={`${playfair.variable} ${fraunces.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preload" as="image" href="/hero-poster.jpg" fetchPriority="high" />
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
