"use client";
import { useState } from "react";
import ImageEditor from "@/components/ImageEditor";
import BulkEditor from "@/components/BulkEditor";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import Link from "next/link";
import { Sparkles, Zap, Camera, Lock, Tag, Upload, Download, ArrowRight, Instagram, Facebook, LayoutGrid, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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

  // If files are uploaded, switch to editors
  if (uploadedFiles.length > 0) {
    return (
      <main className="min-h-screen bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-indigo-900 via-fuchsia-600 to-rose-500 font-sans">
        <div className="w-full flex justify-center max-w-7xl mx-auto px-4 py-8 relative z-10">
          {uploadedFiles.length === 1 ? (
            <ImageEditor file={uploadedFiles[0]} onReset={() => setUploadedFiles([])} />
          ) : (
            <BulkEditor files={uploadedFiles} onReset={() => setUploadedFiles([])} />
          )}
        </div>
      </main>
    );
  }

  // GLASSMORPHIC UTILITY
  const glassPanel = "bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]";

  return (
    <main className="min-h-screen bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-purple-800 via-fuchsia-500 to-sky-400 text-white font-sans relative overflow-x-hidden pt-8 pb-16">
      {/* Background ambient light blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-400/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center gap-16">
        
        {/* --- HERO SECTION --- */}
        <section className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 mt-4">
          {/* Left: Text & Upload */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-1/2 flex flex-col items-start">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4 tracking-tight drop-shadow-sm">
              Remove Image <br/>Background Instantly
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-md font-medium">
              100% automatic, free & high-quality<br/>background remover powered by AI
            </p>

            {/* Glass Dropzone */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`w-full max-w-md ${glassPanel} rounded-3xl p-6 flex flex-col items-center justify-center border-dashed border-2 border-white/40 hover:bg-white/20 transition-all group`}
            >
              <div className="bg-white/20 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-white drop-shadow-md" />
              </div>
              <p className="text-white/90 font-medium mb-6">Drag & Drop Image Here <span className="text-white/60 text-sm">or</span></p>
              
              <div className="flex gap-3 w-full">
                <button onClick={() => document.getElementById('file-upload')?.click()} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 border border-blue-400">
                  Upload Image
                </button>
                <button onClick={() => document.getElementById('file-upload')?.click()} className="flex-1 bg-white text-blue-600 hover:bg-gray-50 font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 border border-white/50">
                  Try a Sample
                </button>
                <input id="file-upload" type="file" multiple className="hidden" accept="image/*" onChange={handleFileUpload} />
              </div>
            </div>
          </motion.div>

          {/* Right: Hero Slider */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full lg:w-1/2 flex justify-end">
            <div className={`w-full max-w-lg aspect-square ${glassPanel} rounded-[2.5rem] p-3 overflow-hidden`}>
              <div className="w-full h-full rounded-[2rem] overflow-hidden relative border border-white/20 shadow-inner">
                <ReactCompareSlider
                  itemOne={<ReactCompareSliderImage src="/demo-before.jpg" alt="Original" />}
                  itemTwo={
                    <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '16px 16px', backgroundColor: 'white' }}>
                      <ReactCompareSliderImage src="/demo-after.png" alt="Removed" className="absolute inset-0" />
                    </div>
                  }
                  className="w-full h-full"
                />
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-white">Before</div>
                <div className="absolute top-4 right-4 bg-white/90 text-black px-4 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-lg shadow-white/20">After</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- SEE THE MAGIC --- */}
        <section className="w-full flex flex-col items-center">
          <div className="flex items-center gap-4 w-full mb-8">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-white/30"></div>
            <h2 className="text-2xl font-bold tracking-wide">See the Magic</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-white/30"></div>
          </div>

          <div className={`w-full max-w-4xl min-h-[400px] ${glassPanel} rounded-[2rem] p-3 relative overflow-hidden`}>
            <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative border border-white/20">
              <ReactCompareSlider
                itemOne={<div className="bg-gray-900 w-full h-[380px] flex items-center justify-center text-white/50">(Replace with Car Before Image)</div>}
                itemTwo={
                    <div className="w-full h-[380px] flex items-center justify-center text-black/50" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '16px 16px', backgroundColor: 'white' }}>
                      (Replace with Car After Image)
                    </div>
                }
                className="w-full h-[380px]"
              />
              <div className="absolute top-4 right-4 bg-white/90 text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">After</div>
            </div>
          </div>
        </section>

        {/* --- WHY CHOOSE US --- */}
        <section className="w-full flex flex-col items-center">
          <div className="flex items-center gap-4 w-full mb-8">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-white/30"></div>
            <h2 className="text-2xl font-bold tracking-wide text-white">Why Choose Us?</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-white/30"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 w-full">
            <div className={`${glassPanel} rounded-2xl p-4 flex flex-col items-start hover:-translate-y-1 transition-transform cursor-default min-w-[180px] flex-1`}>
              <div className="flex items-center gap-2 mb-2 font-bold text-white"><Zap className="w-5 h-5 text-yellow-300" /> Instant Results</div>
              <p className="text-white/70 text-xs font-medium">Remove backgrounds in seconds</p>
            </div>
            <div className={`${glassPanel} rounded-2xl p-4 flex flex-col items-start hover:-translate-y-1 transition-transform cursor-default min-w-[180px] flex-1`}>
              <div className="flex items-center gap-2 mb-2 font-bold text-white"><Sparkles className="w-5 h-5 text-white" /> AI Powered</div>
              <p className="text-white/70 text-xs font-medium">Advanced AI Technology</p>
            </div>
            <div className={`${glassPanel} rounded-2xl p-4 flex flex-col items-start hover:-translate-y-1 transition-transform cursor-default min-w-[180px] flex-1`}>
              <div className="flex items-center gap-2 mb-2 font-bold text-white"><Camera className="w-5 h-5 text-white" /> HD Quality</div>
              <p className="text-white/70 text-xs font-medium">High Resolution Output</p>
            </div>
            <div className={`${glassPanel} rounded-2xl p-4 flex flex-col items-start hover:-translate-y-1 transition-transform cursor-default min-w-[180px] flex-1`}>
              <div className="flex items-center gap-2 mb-2 font-bold text-white"><Lock className="w-5 h-5 text-slate-800 fill-slate-800" /> Secure & Private</div>
              <p className="text-white/70 text-xs font-medium">Your images are safe</p>
            </div>
            <div className={`${glassPanel} rounded-2xl p-4 flex flex-col items-start hover:-translate-y-1 transition-transform cursor-default min-w-[180px] flex-1`}>
              <div className="flex items-center gap-2 mb-2 font-bold text-white"><Tag className="w-5 h-5 text-white" /> Free to Use</div>
              <p className="text-white/70 text-xs font-medium">100% Free & Easy</p>
            </div>
          </div>
        </section>

        {/* --- PERFECT FOR ANY PROJECT --- */}
        <section className="w-full flex flex-col items-center">
          <div className="flex items-center gap-4 w-full mb-8">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-white/30"></div>
            <h2 className="text-2xl font-bold tracking-wide">Perfect for Any Project</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-white/30"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {[
              { id: 1, name: "E-Commerce", b: "bg-orange-500/20" },
              { id: 2, name: "Profile Pictures", b: "bg-blue-600/20" },
              { id: 3, name: "Car Photos", b: "bg-red-600/20" },
              { id: 4, name: "Social Media", b: "bg-indigo-600/20" }
            ].map(cat => (
              <div key={cat.id} className={`${glassPanel} ${cat.b} rounded-2xl overflow-hidden group relative aspect-[4/3] flex flex-col justify-end p-4 border border-white/20 hover:border-white/50 transition-colors`}>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <LayoutGrid className="w-8 h-8 text-white/60" />
                </div>
                <div className="relative z-10 w-full text-center">
                  <div className={`w-full py-2.5 rounded-xl ${glassPanel} font-bold text-sm tracking-wide shadow-lg border-white/30`}>
                    {cat.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- HOW IT WORKS --- */}
        <section className="w-full flex flex-col items-center">
          <div className="flex items-center gap-4 w-full mb-8">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-white/30"></div>
            <h2 className="text-2xl font-bold tracking-wide">How It Works</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-white/30"></div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full max-w-4xl">
            <div className={`${glassPanel} flex-1 w-full rounded-2xl py-6 px-4 flex flex-col items-center text-center`}>
              <Upload className="w-8 h-8 mb-3 text-white" />
              <h3 className="font-bold text-sm">1. Upload Image</h3>
            </div>
            <ArrowRight className="hidden md:block w-8 h-8 text-white/50" />
            <div className={`${glassPanel} flex-1 w-full rounded-2xl py-6 px-4 flex flex-col items-center text-center border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.3)] bg-white/20`}>
              <Sparkles className="w-8 h-8 mb-3 text-white drop-shadow" />
              <h3 className="font-bold text-sm text-white">2. AI Removes Background</h3>
            </div>
            <ArrowRight className="hidden md:block w-8 h-8 text-white/50" />
            <div className={`${glassPanel} flex-1 w-full rounded-2xl py-6 px-4 flex flex-col items-center text-center`}>
              <Download className="w-8 h-8 mb-3 text-white" />
              <h3 className="font-bold text-sm">3. Download HD Image</h3>
            </div>
          </div>
        </section>

        {/* --- PRICING PLANS --- */}
        <section className="w-full flex flex-col items-center mb-10">
          <div className="flex items-center gap-4 w-full mb-8">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-white/30"></div>
            <h2 className="text-2xl font-bold tracking-wide">Pricing Plans</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-white/30"></div>
          </div>

          <div className={`${glassPanel} rounded-[2.5rem] p-2 w-full max-w-4xl relative overflow-hidden group border border-white/30`}>
            {/* The golden glow behind dark card */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-br from-amber-400/20 via-rose-500/20 to-purple-700/20 blur-3xl opacity-50"></div>
            
            <div className="flex flex-col md:flex-row relative z-10 h-[320px]">
               
               {/* VS Badge */}
               <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-orange-500 to-rose-500 rounded-lg items-center justify-center font-black text-white shadow-xl z-20">
                 VS
               </div>

               {/* Free Plan Card */}
               <div className="bg-white text-gray-900 rounded-[2rem] p-8 md:w-1/2 flex flex-col relative overflow-hidden shadow-2xl z-10 border border-white/50 m-1">
                 {/* Internal swoop for free plan */}
                 <div className="absolute bottom-0 right-0 w-[150%] h-[100px] bg-gradient-to-tr from-amber-100/50 via-rose-50/50 to-transparent blur-xl -rotate-12 translate-y-10 translate-x-10"></div>
                 
                 <h3 className="text-2xl font-black text-center mb-6">Free Plan</h3>
                 
                 <ul className="space-y-4 mb-10 text-sm font-semibold flex-grow px-4 text-gray-700">
                   <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-gray-500" /> Basic Resolution</li>
                   <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-gray-500" /> Limited Features</li>
                 </ul>
                 
                 <button className="w-full max-w-[200px] mx-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 z-20">
                   Get Started
                 </button>
               </div>

               {/* Premium Dark Card */}
               <div className="bg-[#1a1442]/90 backdrop-blur-xl text-white rounded-[2rem] p-8 md:pl-16 md:w-1/2 flex flex-col relative overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10 z-0 m-1">
                  <div className="absolute bottom-0 left-0 w-[150%] h-[100px] bg-gradient-to-tr from-rose-500/20 via-orange-400/20 to-transparent blur-2xl rotate-12 translate-y-10 -translate-x-10"></div>
                 
                 <div className="mb-6 flex items-end gap-2 justify-center pb-2">
                   <span className="text-4xl font-black tracking-tighter">₹0</span>
                   <span className="text-sm text-white/80 font-semibold mb-1">Always Free</span>
                 </div>
                 
                 <ul className="space-y-4 mb-10 text-sm font-medium flex-grow md:pl-4 text-white/90">
                   <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-white" /> Gemini-Grade Resolution</li>
                   <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-white" /> Absolute Full Features</li>
                 </ul>
                 
                 <button className="w-full max-w-[200px] mx-auto bg-gradient-to-r from-[#201040] to-[#1a103c] border border-white/20 hover:border-white/40 text-white font-bold py-3.5 rounded-xl shadow-2xl transition-all active:scale-95 z-20 hover:shadow-purple-500/20 relative overflow-hidden mix-blend-screen">
                   <span className="relative z-10">Upgrade Now</span>
                 </button>
               </div>

            </div>
          </div>
        </section>

      </div>

      {/* --- FOOTER --- */}
      <div className="w-full mt-6 pb-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 text-xs font-semibold text-white/80 px-6 max-w-4xl mx-auto">
          <Link href="#" className="hover:text-white transition-colors">About</Link>
          <Link href="#" className="hover:text-white transition-colors">Features</Link>
          <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          
          <div className="flex gap-4 ml-auto">
             <Facebook className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
             <Instagram className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
             <div className="w-4 h-4 rounded-full border-2 border-current hover:text-white cursor-pointer transition-colors flex items-center justify-center"><div className="w-1.5 h-1.5 bg-current rounded-full" /></div>
          </div>
        </div>
      </div>

    </main>
  );
}
