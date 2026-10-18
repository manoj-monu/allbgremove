import React from 'react';
import Link from 'next/link';
import { Camera, ShieldCheck, Globe, HelpCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Camera className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
            PassportPhoto<span className="text-blue-600">Pro</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/united-states/passport-photo" className="hover:text-blue-600 transition-colors">
            US Passport
          </Link>
          <Link href="/united-kingdom/passport-photo" className="hover:text-blue-600 transition-colors">
            UK Passport
          </Link>
          <Link href="/india/passport-photo" className="hover:text-blue-600 transition-colors">
            India Passport
          </Link>
          <Link href="/requirements.html" className="hover:text-blue-600 transition-colors">
            Global Specs
          </Link>
          <Link href="/pricing.html" className="hover:text-blue-600 transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% In-Browser Privacy
          </span>
          <Link
            href="/united-states/passport-photo"
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all"
          >
            Create Photo
          </Link>
        </div>
      </div>
    </header>
  );
}
