import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PhotoTool from '@/components/PhotoTool';
import { getAllSpecs, getSpecsForCountry, getAllCountrySlugs } from '@/lib/specs';
import { Home as HomeIcon, Smartphone, Sun, Camera, CheckCircle2 } from 'lucide-react';

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
    title: `How to Take a ${spec.country} Passport Photo at Home With Your Phone`,
    description: `Complete DIY guide to taking an official ${spec.country} passport or visa photo at home with a smartphone. Learn exact lighting, distance, and DIY background setup.`,
    alternates: {
      canonical: `https://allbgremove.com/${spec.countrySlug}/passport-photo-at-home`,
    }
  };
}

export default async function PassportPhotoAtHome({ params }: PageProps) {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-semibold mb-4">
            <HomeIcon className="w-4 h-4 text-blue-600" />
            DIY Smartphone Guide
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Take a {spec.country} Passport Photo at Home
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Skip expensive photo booths and pharmacies. You can take an officially compliant passport photo using your phone and our alignment tool in 3 minutes.
          </p>
        </div>

        {/* Embedded Photo Tool */}
        <div className="mb-14">
          <PhotoTool initialSpec={spec} allSpecs={allSpecs} />
        </div>

        {/* Step by Step Home Guide */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 mb-16">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Step-by-Step Instructions:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col">
              <Sun className="w-6 h-6 text-amber-500 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">1. Find Good Lighting</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                Face a bright window during daylight hours. This provides soft, even lighting across your cheeks, nose, and forehead without casting harsh shadows behind you.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col">
              <Smartphone className="w-6 h-6 text-blue-500 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">2. Eye Level & Distance</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                Have a family member hold the phone 4–6 feet (1.5–2 meters) away, aligned exactly with your eye level. Avoid selfies, as front lenses distort facial geometry.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col">
              <Camera className="w-6 h-6 text-emerald-500 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">3. Upload & Auto-Crop</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                Upload your picture above. Our tool checks head height ({spec.headHeightMinMm}–{spec.headHeightMaxMm}mm), clears the background to {spec.backgroundColor}, and prepares a 300 DPI print sheet.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
