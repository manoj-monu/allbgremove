import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixelCut — Professional AI Background Remover & Studio",
  description: "The world's most accurate AI background remover. 100% free and automatic. Perfect for e-commerce, photographers, and content creators. Process HD images in seconds.",
  keywords: ["background remover", "image background remover", "free background remover", "photo editor", "remove background from image", "AI background removal", "pixelcut", "transparent background", "batch photo editor"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "PixelCut — Professional AI Background Remover",
    description: "Remove image backgrounds instantly with high precision AI.",
    url: "https://allbgremove.com",
    siteName: "PixelCut",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelCut AI Background Remover",
    description: "Instant, HD background removal in your browser.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PixelCut",
    "operatingSystem": "Web",
    "applicationCategory": "DesignApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "12450"
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
