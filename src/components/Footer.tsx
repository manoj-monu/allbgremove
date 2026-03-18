"use client";
import Link from "next/link";
import { Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 py-16 px-6 mt-auto">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12">
        <div className="col-span-2">
          <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-700">
              <path d="M12 2l-10 5 10 5 10-5-10-5z" opacity="0.6" />
              <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" />
              <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            ALLBgremove
          </Link>
          <p className="text-gray-500 text-sm font-medium mb-6">The world&apos;s leading high-definition AI background removal service for professionals, creators and e-commerce.</p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-500 cursor-pointer transition-colors">
              <Twitter className="w-4 h-4" />
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-purple-500 cursor-pointer transition-colors">
              <Instagram className="w-4 h-4" />
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-700 cursor-pointer transition-colors">
              <Linkedin className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-6 uppercase text-[10px] tracking-widest">Solutions</h4>
          <ul className="space-y-4 text-sm font-medium text-gray-500">
            <li><Link href="#" className="hover:text-blue-600 transition">Individual</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition">Photography</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition">E-commerce</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition">Marketing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-6 uppercase text-[10px] tracking-widest">Company</h4>
          <ul className="space-y-4 text-sm font-medium text-gray-500">
            <li><Link href="/about" className="hover:text-blue-600 transition">About Us</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition">API Docs</Link></li>
            <li><Link href="/terms" className="hover:text-blue-600 transition">Terms & GDPR</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition">Contact Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-6 uppercase text-[10px] tracking-widest">Resources</h4>
          <ul className="space-y-4 text-sm font-medium text-gray-500">
            <li><Link href="#" className="hover:text-blue-600 transition">Help Center</Link></li>
            <li><Link href="/blog" className="hover:text-blue-600 transition">Blog</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition">Bulk Upload</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition">Passport Grid</Link></li>
          </ul>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto pt-16 mt-16 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-xs font-medium">© {new Date().getFullYear()} ALLBgremove. All rights reserved.</p>
        <div className="flex gap-8 text-[10px] uppercase tracking-widest font-black text-gray-300">
          <Link href="/privacy-policy" className="hover:text-gray-600 transition">Privacy Policy</Link>
          <Link href="/disclaimer" className="hover:text-gray-600 transition">Disclaimer</Link>
          <Link href="#" className="hover:text-gray-600 transition">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
