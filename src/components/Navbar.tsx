"use client";
import Link from "next/link";
import { Sparkles, Menu, X, Upload } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{isOpen: boolean, type: "login" | "signup"}>({ isOpen: false, type: "login" });

  return (
    <>
      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
        initialType={authModal.type} 
      />
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">ALLBgremove</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/#how-it-works" className="text-slate-600 font-bold text-sm uppercase tracking-widest hover:text-blue-600 transition-colors">How it works</Link>
            <Link href="/pricing" className="text-slate-600 font-bold text-sm uppercase tracking-widest hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="/about" className="text-slate-600 font-bold text-sm uppercase tracking-widest hover:text-blue-600 transition-colors">About Us</Link>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setAuthModal({ isOpen: true, type: "login" })}
              className="hidden md:flex text-slate-900 font-bold px-6 py-2 rounded-xl hover:bg-slate-50 transition-all border border-slate-200"
            >
              Sign In
            </button>
            <button 
              onClick={() => setAuthModal({ isOpen: true, type: "signup" })}
              className="btn-primary py-2.5 px-6 hidden lg:flex"
            >
              Get Started
            </button>
            <button className="md:hidden p-2 text-slate-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="fixed inset-0 z-[60] bg-white p-6 flex flex-col pt-24 gap-8"
          >
            <button className="absolute top-6 right-6 p-2" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
            <Link href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-900">How it works</Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-900">Pricing</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-900">About Us</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-900">Contact</Link>
            <div className="mt-auto pb-10">
              <button className="w-full btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Close Menu</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
