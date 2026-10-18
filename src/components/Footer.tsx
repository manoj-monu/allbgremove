import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-base mb-3">PassportPhoto Pro</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official biometric compliance passport, visa, and ID photo generator. Powered by client-side browser AI for 100% privacy.
            </p>
            <p className="text-[11px] text-slate-500 mt-3">
              Designed to meet official government requirements. Not affiliated with any government agency.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Popular Countries</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/united-states/passport-photo" className="hover:text-white">US Passport Photo (2x2")</Link></li>
              <li><Link href="/united-kingdom/passport-photo" className="hover:text-white">UK Passport Photo (35x45mm)</Link></li>
              <li><Link href="/canada/passport-photo" className="hover:text-white">Canada Passport Photo (50x70mm)</Link></li>
              <li><Link href="/india/passport-photo" className="hover:text-white">India Passport Photo (35x45mm)</Link></li>
              <li><Link href="/australia/passport-photo" className="hover:text-white">Australia Passport Photo (35x45mm)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Guides & Solutions</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/united-states/baby-passport-photo" className="hover:text-white">Baby Passport Photos</Link></li>
              <li><Link href="/united-states/passport-photo-at-home" className="hover:text-white">Take Passport Photo at Home</Link></li>
              <li><Link href="/united-states/photo-rejected-reasons" className="hover:text-white">Common Rejection Reasons</Link></li>
              <li><Link href="/requirements.html" className="hover:text-white">All Country Specifications</Link></li>
              <li><Link href="/pricing.html" className="hover:text-white">Pricing & Print Formats</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Legal & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy.html" className="hover:text-white">Privacy Policy (GDPR / BIPA)</Link></li>
              <li><Link href="/terms.html" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/refund.html" className="hover:text-white">Refund Policy (Guarantee)</Link></li>
              <li><Link href="/disclaimer.html" className="hover:text-white">Government Disclaimer</Link></li>
              <li><Link href="/contact.html" className="hover:text-white">Support & Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PassportPhoto Pro. All rights reserved.</p>
          <p>Local Processing Guarantee: Photos never touch or reside on our servers.</p>
        </div>
      </div>
    </footer>
  );
}
