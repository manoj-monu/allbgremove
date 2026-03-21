import Link from "next/link";
import { Instagram, Facebook as FbIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-24 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">A</div>
                <span className="text-2xl font-black tracking-tighter">ALLBgremove</span>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
                Empowering creators with elite AI tools. World&apos;s most accurate background removal at the cost of zero.
              </p>
              <div className="flex gap-4 mt-8">
                 <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer"><Instagram className="w-5 h-5" /></div>
                 <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer"><FbIcon className="w-5 h-5" /></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-black text-sm uppercase tracking-[3px] mb-8 text-blue-500">Products</h4>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><Link href="/" className="hover:text-white transition-colors">Free Removal</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-white transition-colors">Bulk Editor</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-sm uppercase tracking-[3px] mb-8 text-blue-500">Company</h4>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-sm uppercase tracking-[3px] mb-8 text-blue-500">Legal</h4>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-sm">© Copyright 2026 ALLBgremove.com. All rights reserved.</p>
            <p className="text-slate-500 text-xs flex items-center gap-2">Built with ♥ for Creators everywhere.</p>
          </div>
        </div>
      </footer>
  );
}
