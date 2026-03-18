"use client";
import { useState } from "react";
import ImageEditor from "@/components/ImageEditor";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import Link from "next/link";
import { Sparkles, Zap, Palette, Check, Twitter, Instagram, Linkedin, Upload, MousePointer2, Layers, Monitor, ShieldCheck, MessageCircle, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-slate-900 flex flex-col items-center font-sans selection:bg-blue-100">
      {/* Dynamic Header */}
      <header className="w-full sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-gray-900">ALLBgremove</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-gray-500">
              <Link href="#" className="hover:text-blue-600 transition">Home</Link>
              <Link href="#" className="hover:text-blue-600 transition">How it Works</Link>
              <Link href="#pricing" className="hover:text-blue-600 transition">Pricing</Link>
              <Link href="#" className="hover:text-blue-600 transition">Blog</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-[14px] font-bold text-gray-700 hover:text-gray-900 px-4 py-2">Login</button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold px-6 py-2.5 rounded-full shadow-lg shadow-blue-500/20 transition-all active:scale-95">Sign Up</button>
          </div>
        </div>
      </header>

      <div className="w-full flex-grow flex flex-col items-center">
        {!uploadedFile ? (
          <div className="w-full max-w-7xl mx-auto px-6 pt-16 pb-24">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              
              {/* Left Column: Text & Upload */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-[45%] flex flex-col items-start"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-widest mb-6">
                  <Sparkles className="w-3.5 h-3.5" /> #1 AI Background Remover
                </div>
                
                <h1 className="text-5xl md:text-[64px] font-black leading-[1.05] text-gray-900 mb-6 tracking-tight">
                  Instant Background <br /><span className="text-blue-600">Remover</span>
                </h1>
                
                <p className="text-lg text-gray-500 font-medium mb-10 leading-relaxed max-w-lg">
                  Erase backgrounds from your photos in one click. Fast, free, and accurate. Trusted by 2M+ creators.
                </p>

                {/* PixelCut Style Dropzone */}
                <div 
                  className="w-full bg-white rounded-[2rem] border-2 border-dashed border-gray-200 p-2 shadow-xl shadow-gray-200/40 hover:border-blue-400 transition-all group"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <div className="w-full bg-gray-50/50 rounded-[1.8rem] py-10 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Upload className="w-7 h-7 text-blue-600" />
                    </div>
                    <div className="text-[15px] font-bold text-gray-800 mb-1 uppercase tracking-wider">Drag & Drop your image here</div>
                    <div className="text-xs text-gray-400 font-medium mb-6 uppercase tracking-widest">or</div>
                    
                    <button 
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Upload className="w-5 h-5" /> Upload Image
                    </button>
                    <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </div>
                </div>

                {/* Features Row */}
                <div className="mt-12 flex items-center gap-8 w-full border-t border-gray-100 pt-8">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 tracking-tight">AI-Powered<br/>Accuracy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 tracking-tight">Batch<br/>Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 tracking-tight">High-Resolution<br/>Quality</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Comparison & Samples */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="w-full lg:w-[55%] flex flex-col items-center relative"
              >
                {/* Floating Effect Circles */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 rounded-full blur-[100px] opacity-20 -z-10"></div>

                <div className="w-full aspect-[1.3] rounded-[2.5rem] bg-white shadow-2xl shadow-blue-900/10 border-8 border-white overflow-hidden relative group">
                  <ReactCompareSlider
                    className="w-full h-full"
                    position={50}
                    itemOne={<ReactCompareSliderImage src="/demo-before.jpg" alt="Original" className="object-cover" />}
                    itemTwo={
                      <div className="w-full h-full relative" style={{ backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)', backgroundSize: '20px 20px' }}>
                        <ReactCompareSliderImage src="/demo-after.png" alt="Clean" className="object-cover absolute inset-0" />
                      </div>
                    }
                  />
                  {/* Floating Hand Indicator */}
                  <motion.div 
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500"
                  >
                    <MousePointer2 className="w-3 h-3 text-blue-600" /> Slide to compare
                  </motion.div>
                </div>

                {/* Try Sample Images Section */}
                <div className="mt-10 bg-white/50 backdrop-blur-sm p-5 rounded-[2rem] border border-white flex items-center gap-6 shadow-sm">
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Try Sample Images</span>
                  <div className="flex gap-3">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className="w-14 h-14 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500 border-2 border-transparent transition-all hover:-translate-y-1"
                        onClick={() => {/* Mock Sample Selection */}}
                      >
                        <img src="/demo-before.jpg" alt="Sample" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Premium Sections integrated into main page flow for PixelCut feel */}
            {/* Elite AI Quality showcase section... */}
            <div className="mt-32 w-full">
              <div className="w-full bg-[#050505] text-white py-24 px-10 rounded-[3rem] overflow-hidden relative shadow-3xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
                  <div className="md:w-1/2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
                      <Sparkles className="w-3.5 h-3.5" /> Elite AI Quality
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-8 leading-[1.1] tracking-tight">Better than Adobe.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Fast as Light.</span></h2>
                    <div className="space-y-6 text-gray-400 text-sm font-medium">
                      <div className="flex gap-4">
                        <Zap className="text-blue-400 w-5 h-5 flex-shrink-0" />
                        <p>Pixel-Perfect Alpha Matting: Handles single strands of hair with zero debris.</p>
                      </div>
                      <div className="flex gap-4">
                        <Palette className="text-purple-400 w-5 h-5 flex-shrink-0" />
                        <p>Color Isolation: Ensures colors don&apos;t bleed into transparency.</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 grid grid-cols-2 gap-4 w-full">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
                      <div className="text-2xl font-black text-blue-400">0.8s</div>
                      <div className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">Speed</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
                      <div className="text-2xl font-black">4K</div>
                      <div className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">Export</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Section styled cleanly */}
            <section id="pricing" className="mt-32 w-full text-center">
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Transparent Pricing</h2>
              <p className="text-gray-500 font-medium mb-16 underline underline-offset-8 decoration-blue-200">Start for free, upgrade when you&apos;re ready for scale.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Simplified Card Style */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col items-start text-left group">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Social</h3>
                  <div className="text-4xl font-black mb-8 underline decoration-4 decoration-blue-100">$0</div>
                  <ul className="space-y-4 mb-10 flex-grow text-gray-500 font-medium text-sm">
                    <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-blue-500" /> SD Results</li>
                    <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-blue-500" /> Standard Edits</li>
                  </ul>
                  <button className="w-full py-4 rounded-2xl bg-gray-50 text-gray-600 font-black text-[13px] hover:bg-gray-100 transition-colors uppercase tracking-widest">Get Started</button>
                </div>

                <div className="bg-blue-600 p-10 rounded-[2.5rem] shadow-2xl shadow-blue-500/30 flex flex-col items-start text-left relative overflow-hidden transform md:-translate-y-4">
                  <div className="absolute top-0 right-0 bg-white/20 px-3 py-1 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-xl">Pro</div>
                  <h3 className="text-xl font-bold text-white mb-6">Creator</h3>
                  <div className="text-4xl font-black text-white mb-8">$12</div>
                  <ul className="space-y-4 mb-10 flex-grow text-blue-100 font-medium text-sm">
                    <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-white" /> 4K Ultra HD</li>
                    <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-white" /> AI Enhancement</li>
                    <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-white" /> Bulk Processing</li>
                  </ul>
                  <button className="w-full py-4 rounded-2xl bg-white text-blue-600 font-black text-[13px] hover:bg-gray-100 transition-colors uppercase tracking-widest">Start Trial</button>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col items-start text-left group">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Agency</h3>
                  <div className="text-4xl font-black mb-8 underline decoration-4 decoration-blue-100">$49</div>
                  <ul className="space-y-4 mb-10 flex-grow text-gray-500 font-medium text-sm">
                    <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-blue-500" /> API Access</li>
                    <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-blue-500" /> Account Manager</li>
                  </ul>
                  <button className="w-full py-4 rounded-2xl bg-gray-50 text-gray-600 font-black text-[13px] hover:bg-gray-100 transition-colors uppercase tracking-widest">Contact Sales</button>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="w-full flex justify-center max-w-7xl px-4 py-16">
            <ImageEditor file={uploadedFile} onReset={() => setUploadedFile(null)} />
          </div>
        )}
      </div>

      {/* Floating Chat Button (Mockup detail) */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full shadow-2xl shadow-blue-600/40 flex items-center justify-center text-white z-[150]"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </main>
  );
}
