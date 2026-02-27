import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'ALLBgremove | Free AI Background Remover - 100% Automatic & Instant',
  description: 'Remove image backgrounds automatically in 1 second, 100% free with no signup required. Create transparent background images using advanced AI immediately.',
  keywords: 'free background remover, remove image background online, transparent background maker, AI photo editor, passport photo maker, cut out image, ALLBgremove',
  openGraph: {
    title: 'Free AI Background Remover - 100% Automatic',
    description: 'Instantly remove backgrounds from images for free with AI.',
    url: 'https://allbgremove.com',
    siteName: 'ALLBgremove',
    images: [
      {
        url: 'https://allbgremove.com/demo-after.png',
        width: 800,
        height: 600,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Background Remover',
    description: 'Remove background from any image using AI in 1 second for free.',
  },
  alternates: {
    canonical: 'https://allbgremove.com',
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
        {/* Replace the ca-pub-XXX with your actual Publisher ID from AdSense once you log in and get it */}
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
            "description": "Remove image backgrounds completely free using advanced AI without losing quality.",
            "url": "https://allbgremove.com"
          })
        }} />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>

          {/* Universal Footer for AdSense and Navigation */}
          <footer className="w-full bg-white border-t border-gray-200 py-10 mt-auto">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
              <div className="mb-4 md:mb-0 flex items-center">
                <span className="font-bold text-gray-800 text-lg mr-2">ALLBgremove</span>
                &copy; {new Date().getFullYear()} All Rights Reserved.
              </div>

              <div className="flex flex-wrap justify-center gap-6 font-medium text-gray-600">
                <a href="/about" className="hover:text-blue-600 transition">About Us</a>
                <a href="/contact" className="hover:text-blue-600 transition">Contact</a>
                <a href="/privacy-policy" className="hover:text-blue-600 transition">Privacy Policy</a>
                <a href="/terms" className="hover:text-blue-600 transition">Terms & Conditions</a>
                <a href="/disclaimer" className="hover:text-blue-600 transition">Disclaimer</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

