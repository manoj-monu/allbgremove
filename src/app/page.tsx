"use client";
import { useState } from "react";
import ImageEditor from "@/components/ImageEditor";
import { UploadCloud, CheckCircle } from "lucide-react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

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
    <main className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col items-center py-6 px-4 font-sans selection:bg-pink-100">
      {/* Header */}
      <header className="w-full max-w-7xl flex justify-between items-center mb-10 md:mb-16 px-4">
        <a
          href="/"
          className="text-2xl font-black tracking-tighter text-slate-800 flex items-center gap-2 cursor-pointer"
          title="Go to Home"
        >
          {/* A simple geometric logo placeholder like removal.ai */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF4B82] to-[#7135D8] flex items-center justify-center text-white text-lg font-bold">R</div>
          BgRemover<span className="text-[#FF4B82] font-medium text-xl">.ai</span>
        </a>
        <nav className="space-x-8 text-sm font-bold text-slate-600 hidden md:block tracking-wide">
          <a href="/" className="hover:text-[#FF4B82] transition-colors">HOW TO USE</a>
          <a href="/about" className="hover:text-[#FF4B82] transition-colors">TOOLS & API</a>
          <a href="/blog" className="hover:text-[#FF4B82] transition-colors">PRICING</a>
          <a href="/contact" className="hover:text-[#FF4B82] transition-colors">CONTACT</a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-7xl flex flex-col items-center flex-grow">
        {!uploadedFile ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full mt-4 md:mt-6 px-4">

            {/* Left Side: Upload Column */}
            <div className="text-left w-full md:w-[45%] flex flex-col items-start pr-0 md:pr-8">
              <span className="text-[13px] font-bold tracking-widest text-[#7135D8] mb-4 uppercase">FAST, EASY AND AUTOMATED</span>
              <h1 className="text-5xl md:text-[64px] font-black leading-[1.1] text-slate-900 mb-6 font-sans tracking-tight">
                IMAGE BACKGROUND <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B82] to-[#7135D8]">REMOVER</span>
              </h1>

              <ul className="space-y-4 mb-10 text-slate-600 font-medium text-[15px]">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> <span className="opacity-90">Remove background from image automatically</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> <span className="opacity-90">Instantly get transparent background image</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> <span className="opacity-90">Fully automatic AI processing in 3 seconds</span></li>
              </ul>

              {/* Upload Area */}
              <div
                className="relative group w-full rounded-[2rem] border-[1.5px] border-slate-200 bg-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(255,75,130,0.15)] transition-all duration-300 p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF4B82]/30"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                />

                <button className="bg-gradient-to-r from-[#FF4B82] to-[#7135D8] hover:from-[#ff3a75] hover:to-[#612abc] text-white font-bold py-4 px-10 rounded-full text-lg shadow-[0_10px_20px_-10px_rgba(255,75,130,0.6)] transform transition-transform group-hover:-translate-y-1 mb-4 flex items-center gap-3 uppercase tracking-wide">
                  <UploadCloud className="w-6 h-6" />
                  UPLOAD IMAGE
                </button>
                <p className="text-sm text-slate-500 font-medium tracking-wide">Or drag and drop an image</p>
                <div className="text-[11px] text-slate-400 mt-6 max-w-[280px] text-center opacity-80 leading-relaxed">
                  By uploading an image or URL you agree to our Terms of Service and Privacy Policy.
                </div>
              </div>
            </div>

            {/* Right Side: Demo Slider */}
            <div className="w-full md:w-[55%] flex justify-center lg:justify-end mt-12 md:mt-0 relative">
              {/* Decorative background blobs to mimic removal.ai sleek aesthetic */}
              <div className="absolute top-10 right-20 w-72 h-72 bg-[#FF4B82]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
              <div className="absolute bottom-10 left-20 w-80 h-80 bg-[#7135D8]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

              <div className="w-full max-w-[620px] h-[550px] rounded-[1.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 relative bg-[#f8fafc] hidden md:block group">

                <ReactCompareSlider
                  className="w-full h-full object-cover"
                  position={50}
                  itemOne={<ReactCompareSliderImage src="/demo-before.jpg" alt="Original Image" className="w-full h-full object-cover" />}
                  itemTwo={
                    <div className="w-full h-full relative" style={{ backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}>
                      <ReactCompareSliderImage src="/demo-after.png" alt="Removed Background" className="w-full h-full object-cover absolute inset-0 drop-shadow-2xl" />
                    </div>
                  }
                />
              </div>
            </div>

          </div>
        ) : (
          <div className="w-full flex justify-center max-w-5xl">
            <ImageEditor file={uploadedFile} onReset={() => setUploadedFile(null)} />
          </div>
        )}
      </div>

      {/* Footer for SEO & Legal */}
      <footer className="w-full max-w-7xl mt-auto pt-20 pb-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400 font-medium px-4">
        <p>&copy; 2026 BgRemover AI. All rights reserved.</p>
        <div className="space-x-6 mt-4 md:mt-0">
          <a href="/privacy-policy" className="hover:text-[#FF4B82] transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-[#FF4B82] transition-colors">Terms & Conditions</a>
        </div>
      </footer>
    </main>
  );
}
