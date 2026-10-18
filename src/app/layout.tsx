import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Passport Size Photo Maker Online Free - AI Background Remover | allbgremove.com',
  description: 'Create official biometric passport size photos online in 5 seconds. Free AI background removal, white & blue background changer, face enhancer, and print-ready 4x6, 12x6 (40 photos) & A4 sheets for Indian Passport, Visa, PAN Card & Govt Jobs.',
  keywords: [
    'passport size photo maker',
    'create passport photo online free',
    'indian passport photo size',
    'all bg remove',
    'remove background from photo',
    'change photo background to white',
    'change photo background to blue',
    '35x45 mm photo maker',
    'pan card photo size maker online',
    'visa photo maker online',
    'passport photo 4x6 sheet',
    'passport photo 12x6 40 photos',
    'passport photo a4 30 photos',
    'sarkari job admit card photo',
  ],
  authors: [{ name: 'allbgremove.com' }],
  metadataBase: new URL('https://allbgremove.com'),
  alternates: {
    canonical: 'https://allbgremove.com/',
  },
  openGraph: {
    title: 'Passport Size Photo Maker Online Free - AI Background Remover | allbgremove.com',
    description: 'Create official passport size photos online in 5 seconds with AI background removal and print sheets.',
    url: 'https://allbgremove.com/',
    siteName: 'allbgremove.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Passport Size Photo Maker Online Free - AI Background Remover | allbgremove.com',
    description: 'Create official passport size photos online with AI background removal and print sheets.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.png?v=2', type: 'image/png' },
      { url: '/favicon.ico?v=2' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=2' },
    ],
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
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-H1LPVQJ1QL"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-H1LPVQJ1QL');
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
