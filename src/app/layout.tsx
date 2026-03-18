import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://allbgremove.com'),
  title: {
    default: 'ALLBgremove | 100% Free AI Background Remover & Editor',
    template: '%s | ALLBgremove'
  },
  description: 'Remove image backgrounds instantly in 1 second. 100% free with no signup required. Create transparent backgrounds with Gemini-level AI precision. Perfect for e-commerce, profiles, and cars.',
  keywords: [
    'free background remover', 'remove image background online', 'transparent background maker', 
    'AI photo editor', 'passport photo maker', 'change background color', 'ALLBgremove', 
    'bulk background remover', 'free transparent PNG maker'
  ],
  authors: [{ name: 'ALLBgremove' }],
  creator: 'ALLBgremove',
  publisher: 'ALLBgremove',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: 'Free AI Background Remover - 100% Automatic & Instant',
    description: 'Instantly remove backgrounds from images for free with AI. Get Gemini-level precision edges without paying.',
    url: 'https://allbgremove.com',
    siteName: 'ALLBgremove',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'ALLBgremove AI Free Service',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALLBgremove - Free AI Background Remover',
    description: 'Remove background from any image using AI in 1 second for free.',
    images: ['https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1200&auto=format&fit=crop'],
  },
  alternates: {
    canonical: 'https://allbgremove.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        {/* Google Analytics Tracking */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-H1LPVQJ1QL`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H1LPVQJ1QL');
          `
        }} />

        {/* AdSense Verification & Auto Ads Script */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* JSON-LD Schema Data for Google Search Rich Snippets */}
        <Script id="schema-structured-data" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ALLBgremove",
            "operatingSystem": "All",
            "applicationCategory": "DesignApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Remove image backgrounds instantly in 1 second. 100% free with no signup required.",
            "url": "https://allbgremove.com",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1250"
            }
          })
        }} />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>

          {/* Universal Footer for AdSense and Navigation */}
          <Footer />
        </div>
      </body>
    </html>
  )
}
