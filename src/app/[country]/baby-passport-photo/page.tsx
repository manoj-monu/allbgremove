import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PhotoTool from '@/components/PhotoTool';
import { getAllSpecs, getSpecsForCountry, getAllCountrySlugs } from '@/lib/specs';
import { Baby, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

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

  if (!spec) {
    return { title: 'Not Found' };
  }

  const title = `${spec.country} Baby Passport Photo Guide & Tool - Official Rules`;
  const description = `Take official ${spec.country} infant & baby passport photos at home. Learn baby exception rules: eyes, mouth, support guidelines, and background specs.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://allbgremove.com/${spec.countrySlug}/baby-passport-photo`,
    }
  };
}

export default async function BabyPassportPhotoPage({ params }: PageProps) {
  const resolvedParams = await params;
  const countrySpecs = getSpecsForCountry(resolvedParams.country);
  const spec = countrySpecs[0];

  if (!spec) {
    notFound();
  }

  const allSpecs = getAllSpecs();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 text-xs font-semibold mb-4">
            <Baby className="w-4 h-4 text-pink-600" />
            Infant & Newborn Photo Guide
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {spec.country} Baby Passport Photo
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Taking passport photos of infants and toddlers can be challenging. Here are official exceptions allowed by the {spec.country} government and our specialized tool to crop and align.
          </p>
        </div>

        {/* Embedded Photo Tool */}
        <div className="mb-14">
          <PhotoTool initialSpec={spec} allSpecs={allSpecs} />
        </div>

        {/* Official Baby Exceptions Box */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 mb-12">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Official Baby Requirements for {spec.country}
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 mb-6">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">Government Rule:</p>
            <p>{spec.notes.babyRules}</p>
          </div>

          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3">Top Tips for Taking Baby Photos at Home:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-white mb-1">1. Lay Baby on a Plain Sheet</strong>
              Lay your baby on their back on a plain white sheet or blanket. Stand directly above to capture a square, top-down portrait.
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-white mb-1">2. No Hands or Props Visible</strong>
              No parent hands, pacifiers, toys, or car seat straps should appear in the frame. If supporting the baby's head, do so from underneath the sheet.
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-white mb-1">3. Soft Natural Light</strong>
              Use natural window daylight from the front to avoid harsh shadows under the baby's nose and chin. Never use direct camera flash near an infant's eyes.
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-white mb-1">4. Capture Burst Shots</strong>
              Take multiple photos when the baby is calm and awake. Pick the clearest photo where the face is looking forward.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
