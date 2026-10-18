import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PhotoTool from '@/components/PhotoTool';
import { getAllSpecs, getSpecsForCountry, getAllCountrySlugs } from '@/lib/specs';
import { AlertOctagon, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllCountrySlugs();
  return slugs.map(slug => ({ country: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const countrySpecs = getSpecsForCountry(resolvedParams.country);
  const spec = countrySpecs[0];

  if (!spec) return { title: 'Not Found' };

  return {
    title: `${spec.country} Passport Photo Rejection Reasons & How to Avoid Them`,
    description: `Why was your ${spec.country} passport or visa photo rejected? Understand official biometric rejection rules: wrong head size, background glare, shadows, and glasses.`,
    alternates: {
      canonical: `https://allbgremove.com/${spec.countrySlug}/photo-rejected-reasons`,
    }
  };
}

export default async function RejectionReasonsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const countrySpecs = getSpecsForCountry(resolvedParams.country);
  const spec = countrySpecs[0];

  if (!spec) notFound();

  const allSpecs = getAllSpecs();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 text-xs font-semibold mb-4">
            <AlertOctagon className="w-4 h-4 text-red-600" />
            Official Compliance Analysis
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Top {spec.country} Photo Rejection Reasons
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Over 25% of passport applications encounter delays due to invalid photos. Review the most common mistakes cited by {spec.country} passport offices.
          </p>
        </div>

        {/* Embedded Photo Tool */}
        <div className="mb-14">
          <PhotoTool initialSpec={spec} allSpecs={allSpecs} />
        </div>

        {/* Breakdown of Rejection Reasons */}
        <div className="max-w-4xl mx-auto space-y-6 mb-16">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                1. Incorrect Head Size or Proportion
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                For {spec.country}, the chin-to-crown measurement must be between <strong>{spec.headHeightMinMm}mm and {spec.headHeightMaxMm}mm</strong>. If the face is cropped too close or zoomed out too far, the automated biometric scanner at the passport agency will immediately reject the file.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                2. Unapproved Background Color or Shadows
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The official background requirement is <strong>{spec.backgroundColor === '#FFFFFF' ? 'pure white' : 'light neutral grey/cream'}</strong>. Shadows behind the head, patterns, textured wallpaper, or dark backgrounds are unacceptable. Our tool automatically clears background noise.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                3. Eyeglasses or Frame Reflections
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {spec.notes.glasses} In many countries (such as the US and Australia), glasses are prohibited outright. In others, lens reflections or thick frames that obscure the eyes cause automatic rejections.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                4. Exaggerated Smiles or Non-Neutral Expression
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {spec.notes.smile} Both eyes must be looking straight ahead, open and clear, with the mouth naturally closed. Smiling with open teeth alters facial geometry and invalidates computer biometric recognition.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
