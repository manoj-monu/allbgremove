import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PhotoTool from '@/components/PhotoTool';
import { getAllSpecs, getSpecBySlug } from '@/lib/specs';
import { ShieldCheck, CheckCircle2, AlertCircle, FileCheck, ArrowRight, ExternalLink } from 'lucide-react';

interface PageProps {
  params: Promise<{
    country: string;
    docType: string;
  }>;
}

// Statically generate all verified specs
export async function generateStaticParams() {
  const specs = getAllSpecs();
  return specs
    .filter(s => s.verified) // Strictly generate pages for verified specs only
    .map(s => ({
      country: s.countrySlug,
      docType: `${s.docTypeSlug}-photo`,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const docTypeSlug = resolvedParams.docType.replace('-photo', '');
  const spec = getSpecBySlug(resolvedParams.country, docTypeSlug);

  if (!spec) {
    return {
      title: 'Photo Requirement Not Found',
      robots: { index: false }
    };
  }

  const title = `${spec.country} ${spec.docTitle} Maker (${spec.widthMm}x${spec.heightMm}mm) - Official Requirements`;
  const description = `Create compliant ${spec.country} ${spec.docTitle} online. Size: ${spec.widthMm}x${spec.heightMm}mm, background: ${spec.backgroundColor}. In-browser biometric alignment and 100% privacy guarantee.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://allbgremove.com/${spec.countrySlug}/${spec.docTypeSlug}-photo`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://allbgremove.com/${spec.countrySlug}/${spec.docTypeSlug}-photo`,
    }
  };
}

export default async function SpecPage({ params }: PageProps) {
  const resolvedParams = await params;
  const docTypeSlug = resolvedParams.docType.replace('-photo', '');
  const spec = getSpecBySlug(resolvedParams.country, docTypeSlug);

  if (!spec) {
    notFound();
  }

  const allSpecs = getAllSpecs();

  // Structured Data (SoftwareApplication + FAQPage)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: `PassportPhoto Pro - ${spec.country} ${spec.docTitle}`,
        operatingSystem: 'All',
        applicationCategory: 'MultimediaApplication',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'USD'
        },
        description: `Create official ${spec.country} ${spec.docTitle} with automatic face alignment and background color replacement to ${spec.backgroundColor}.`
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What is the official size for a ${spec.country} ${spec.docType}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The official photo size for ${spec.country} ${spec.docType} is ${spec.widthMm}mm in width by ${spec.heightMm}mm in height, with a head height between ${spec.headHeightMinMm}mm and ${spec.headHeightMaxMm}mm.`
            }
          },
          {
            '@type': 'Question',
            name: `What background color is required for ${spec.country}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The required background is ${spec.backgroundColor === '#FFFFFF' ? 'plain white' : 'plain light grey/neutral'}, completely free of shadows and textures.`
            }
          },
          {
            '@type': 'Question',
            name: `Can I wear glasses in my ${spec.country} passport photo?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: spec.notes.glasses
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <a href="/" className="hover:underline">Home</a>
          <span>/</span>
          <span className="capitalize">{spec.country}</span>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">{spec.docTitle}</span>
        </div>

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Designed to meet official {spec.country} requirements
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {spec.country} {spec.docTitle}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Create verified {spec.widthMm}x{spec.heightMm} mm biometric photos instantly. Automatic head size alignment, background removal, and digital or printable sheet export.
          </p>

          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
            <span>Verified on: <strong className="text-slate-700 dark:text-slate-300">{spec.lastVerified}</strong></span>
            <span>•</span>
            <a
              href={spec.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Official Government Source <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Embedded Interactive Biometric Photo Tool */}
        <div className="mb-14">
          <PhotoTool initialSpec={spec} allSpecs={allSpecs} />
        </div>

        {/* Official Specifications Table */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-12">
          <div className="px-6 py-4 bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" /> Official Photo Specifications
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
              Strict Verification Active
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
              <span className="font-medium text-slate-500">Physical Dimensions</span>
              <span className="sm:col-span-2 font-semibold text-slate-900 dark:text-white">
                {spec.widthMm} mm x {spec.heightMm} mm ({Math.round(spec.widthMm / 25.4 * 10) / 10}" x {Math.round(spec.heightMm / 25.4 * 10) / 10}")
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
              <span className="font-medium text-slate-500">Resolution / DPI</span>
              <span className="sm:col-span-2 font-semibold text-slate-900 dark:text-white">
                {spec.dpi} DPI (Minimum {spec.minPx.width}x{spec.minPx.height} px, Max {spec.maxPx.width}x{spec.maxPx.height} px)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
              <span className="font-medium text-slate-500">Head Proportion</span>
              <span className="sm:col-span-2 font-semibold text-slate-900 dark:text-white">
                {spec.headHeightMinMm} mm to {spec.headHeightMaxMm} mm from chin to crown ({Math.round((spec.headHeightMinMm / spec.heightMm) * 100)}% - {Math.round((spec.headHeightMaxMm / spec.heightMm) * 100)}% of total height)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
              <span className="font-medium text-slate-500">Eye Height Guideline</span>
              <span className="sm:col-span-2 font-semibold text-slate-900 dark:text-white">
                Approximately {spec.eyeLineFromBottomMm} mm from the bottom edge of the photograph
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
              <span className="font-medium text-slate-500">Background Color</span>
              <span className="sm:col-span-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: spec.backgroundColor }}></span>
                {spec.backgroundColor === '#FFFFFF' ? 'Clean Plain White' : 'Plain Light Neutral Grey'} ({spec.backgroundColor})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
              <span className="font-medium text-slate-500">Glasses Policy</span>
              <span className="sm:col-span-2 text-slate-700 dark:text-slate-300">
                {spec.notes.glasses}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
              <span className="font-medium text-slate-500">Facial Expression</span>
              <span className="sm:col-span-2 text-slate-700 dark:text-slate-300">
                {spec.notes.smile}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
              <span className="font-medium text-slate-500">Baby & Children Rules</span>
              <span className="sm:col-span-2 text-slate-700 dark:text-slate-300">
                {spec.notes.babyRules}
              </span>
            </div>
          </div>
        </div>

        {/* Guides Links (Baby photo, Rejected reasons, At home) */}
        <div className="max-w-4xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href={`/${spec.countrySlug}/baby-passport-photo`}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all shadow-sm group"
          >
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-blue-600 flex items-center justify-between">
              Baby Passport Photos <ArrowRight className="w-4 h-4" />
            </h4>
            <p className="text-xs text-slate-500">
              Official relaxed guidelines for newborns and infants in {spec.country}.
            </p>
          </a>

          <a
            href={`/${spec.countrySlug}/passport-photo-at-home`}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all shadow-sm group"
          >
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-blue-600 flex items-center justify-between">
              Take Photo at Home <ArrowRight className="w-4 h-4" />
            </h4>
            <p className="text-xs text-slate-500">
              Lighting, camera angle, and background tips using your smartphone.
            </p>
          </a>

          <a
            href={`/${spec.countrySlug}/photo-rejected-reasons`}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all shadow-sm group"
          >
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-blue-600 flex items-center justify-between">
              Rejection Reasons <ArrowRight className="w-4 h-4" />
            </h4>
            <p className="text-xs text-slate-500">
              Avoid shadows, glare, wrong head scale, and unapproved backgrounds.
            </p>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
