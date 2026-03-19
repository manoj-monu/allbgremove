"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { 
  Upload, Sparkles, Zap, Shield, Tag, 
  ArrowRight, Check, CheckCircle, Smartphone, 
  Layers, Smile, Instagram, Facebook as FbIcon, 
  X, Menu, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageEditor from "@/components/ImageEditor";
import BulkEditor from "@/components/BulkEditor";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFiles(Array.from(e.dataTransfer.files));
    }
  };

  if (uploadedFiles.length > 0) {
    return (
      <main className="min-h-screen bg-neutral-50 p-8 flex justify-center items-start">
        <div className="w-full max-w-7xl animate-in fade-in zoom-in duration-500">
           {uploadedFiles.length === 1 ? (
             <ImageEditor file={uploadedFiles[0]} onReset={() => setUploadedFiles([])} />
           ) : (
             <BulkEditor files={uploadedFiles} onReset={() => setUploadedFiles([])} />
           )}
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">PixelCut</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="#how-it-works" className="text-slate-600 font-bold text-sm uppercase tracking-widest hover:text-blue-600 transition-colors">How it works</Link>
            <Link href="/pricing" className="text-slate-600 font-bold text-sm uppercase tracking-widest hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="/about" className="text-slate-600 font-bold text-sm uppercase tracking-widest hover:text-blue-600 transition-colors">About Us</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/contact" className="hidden md:flex text-slate-900 font-bold px-6 py-2 rounded-xl hover:bg-slate-50 transition-all border border-slate-200">Help center</Link>
            <button className="md:hidden p-2 text-slate-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-[60] bg-white p-6 flex flex-col pt-24 gap-8">
            <button className="absolute top-6 right-6 p-2" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
            <Link href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-900">How it works</Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-900">Pricing</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-900">About Us</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-900">Contact</Link>
            <div className="mt-auto pb-10">
              <button className="w-full btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Close Menu</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-32">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-600/5 blur-3xl animate-pulse"></div>
            <div className="px-5 py-2 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-[2px] border border-blue-100 relative z-10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              99.8% AI Precision — Completely Free
            </div>
          </div>

          <h1 className="text-center text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight mb-8">
            Professional <br/>
            <span className="text-blue-600">Background </span> 
            Removal
          </h1>
          
          <p className="max-w-lg text-center text-slate-500 font-medium text-lg md:text-xl mb-12">
            Automate tedious image editing. Simply upload your photo and let our AI create perfect transparency in seconds.
          </p>

          {/* UPLOAD CENTER */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full max-w-2xl bg-slate-50/50 p-4 lg:p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative group mb-20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/2 to-indigo-600/2 rounded-[2.5rem]"></div>
            
            <div className="relative z-10 w-full h-80 lg:h-[400px] border-3 border-dashed border-slate-200 rounded-[2rem] bg-white flex flex-col items-center justify-center transition-all group-hover:border-blue-400 group-hover:bg-blue-50/30">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30 mb-8 transform group-hover:scale-110 transition-transform duration-500">
                <Upload className="w-10 h-10" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2">Drop your image here</h3>
              <p className="text-slate-500 font-medium mb-8">Supports PNG, JPG, JPEG and WebP</p>

              <button 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="btn-primary px-10 py-5 rounded-2xl text-lg shadow-2xl shadow-blue-500/20 active:scale-95 transform transition-transform"
              >
                Choose Photo and Start
              </button>
              <input id="file-upload" type="file" multiple className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>

            <div className="flex gap-4 items-center justify-center mt-6">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No Image? Try these:</p>
              <div className="flex gap-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-lg bg-slate-200 cursor-pointer hover:scale-110 transition-transform overflow-hidden border border-slate-300">
                     <img src={`https://picsum.photos/id/${i+10}/100/100`} alt="demo" className="w-full h-full object-cover" />
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* TRUSTED BY */}
          <div className="w-full py-10 border-t border-slate-100 flex flex-col items-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-10 text-center">Loved by 20,000+ creators worldwide</p>
             <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 grayscale opacity-40">
                <span className="text-2xl font-black tracking-tighter">CREATOR</span>
                <span className="text-2xl font-black tracking-tighter italic text-sky-800">STUDIO</span>
                <span className="text-2xl font-black tracking-tighter text-blue-900 underline">PHOTO</span>
                <span className="text-2xl font-black tracking-tighter border border-current px-4 py-1">HQ</span>
             </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="bg-slate-50 py-32 mt-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Built for Professionals. <br/> Free for Everyone.</h2>
              <p className="text-slate-500 font-medium text-lg mt-4">Why users choose PixelCut for their everyday editing.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "AI Precision", desc: "Our advanced neural network isolates complex subjects like hair and fur with pixel-perfect accuracy.", icon: <Sparkles className="w-8 h-8" /> },
                { title: "Standard Processing", desc: "Experience the fastest background removal in your browser, no waiting in line or cloud delays.", icon: <Zap className="w-8 h-8" /> },
                { title: "HD Resolution", desc: "Export your images in full 4K resolution without losing any detail or clarity.", icon: <Layers className="w-8 h-8" /> },
                { title: "Bulk Export", desc: "Process hundreds of images at once for your e-commerce store with our batch manager.", icon: <LayoutGrid className="w-8 h-8" /> },
                { title: "Data Security", desc: "Your images never leave your browser memory. We prioritize your privacy above everything.", icon: <Shield className="w-8 h-8" /> },
                { title: "Built-in Editor", desc: "Tweak margins, add colors, or apply beautiful stock backgrounds natively in our studio.", icon: <Tag className="w-8 h-8" /> },
              ].map((f, i) => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-shadow group">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{f.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="bg-blue-600 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-10 relative z-10 leading-[1.1]">Ready to Create <br/> Stunning Visuals?</h2>
            <div className="flex flex-col md:flex-row gap-6 justify-center relative z-10">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-white text-blue-600 font-black px-12 py-6 rounded-2xl shadow-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-lg"
              >
                Upload Now <ArrowRight className="w-6 h-6" />
              </button>
              <Link href="/pricing" className="bg-blue-700 text-white font-black px-12 py-6 rounded-2xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3 text-lg">
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white pt-24 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">P</div>
                <span className="text-2xl font-black tracking-tighter">PixelCut</span>
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
                <li><Link href="#features" className="hover:text-white transition-colors">Bulk Editor</Link></li>
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
            <p className="text-slate-500 text-sm">© Copyright 2026 PixelCut AI. All rights reserved.</p>
            <p className="text-slate-500 text-xs flex items-center gap-2">Built with ♥ for Creators everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Add these to make it work in page.tsx locally if not in separate files
const LayoutGrid = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);
