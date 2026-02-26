"use client";
import { useState } from "react";
import ImageEditor from "@/components/ImageEditor";
import { UploadCloud } from "lucide-react";
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
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center py-12 px-4 selection:bg-blue-500/30">
      <header className="w-full max-w-6xl flex justify-between items-center mb-16">
        <a
          href="/"
          className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent cursor-pointer"
          title="Go to Home"
        >
          BgRemover AI
        </a>
        <nav className="space-x-4 text-sm font-medium text-neutral-400">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <a href="/about" className="hover:text-white transition-colors">About Us</a>
          <a href="/blog" className="hover:text-white transition-colors">Blog</a>
          <a href="/contact" className="hover:text-white transition-colors">Contact</a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-6xl flex flex-col items-center flex-grow">
        {!uploadedFile ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full mt-4 md:mt-12">

            {/* Left Side: Upload Column */}
            <div className="text-left w-full md:w-1/2 flex flex-col items-start">
              <h2 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
                Remove Image <br />
                <span className="text-neutral-500">Backgrounds.</span>
              </h2>
              <p className="text-lg text-neutral-400 mb-10">
                100% automatically and Free.
              </p>

              {/* Upload Area */}
              <div
                className="relative group w-full max-w-md rounded-[2.5rem] border-2 border-dashed border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800/80 hover:border-blue-500/50 transition-all duration-300 p-10 flex flex-col items-center justify-center cursor-pointer shadow-xl"
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
                <div className="h-20 w-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                  <UploadCloud className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Upload Image</h3>
                <p className="text-sm text-neutral-500">or drop a file, paste image or URL</p>
              </div>
            </div>

            {/* Right Side: Demo Slider */}
            <div className="w-full md:w-1/2 flex justify-center lg:justify-end mt-12 md:mt-0">
              <div className="w-full max-w-[400px] h-[550px] rounded-[2rem] overflow-hidden shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)] border border-neutral-700/50 relative bg-[#111] bg-[url('https://transparenttextures.com/patterns/cubes.png')] hidden md:block group">

                {/* Floating Labels */}
                <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Original</div>
                <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-blue-500/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-blue-400/30 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Removed</div>

                <ReactCompareSlider
                  className="w-full h-full object-cover"
                  position={50}
                  itemOne={<ReactCompareSliderImage src="/demo-before.jpg" alt="Original Image" className="w-full h-full object-cover" />}
                  itemTwo={
                    <div className="w-full h-full relative" style={{ backgroundImage: 'linear-gradient(45deg, #262626 25%, transparent 25%), linear-gradient(-45deg, #262626 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #262626 75%), linear-gradient(-45deg, transparent 75%, #262626 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}>
                      <ReactCompareSliderImage src="/demo-after.png" alt="Removed Background" className="w-full h-full object-cover absolute inset-0" />
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
      <footer className="w-full max-w-6xl mt-auto pt-16 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
        <p>&copy; 2026 BgRemover AI. All rights reserved.</p>
        <div className="space-x-4 mt-4 md:mt-0">
          <a href="/privacy-policy" className="hover:text-neutral-300">Privacy Policy</a>
          <a href="/terms" className="hover:text-neutral-300">Terms & Conditions</a>
        </div>
      </footer>
    </main>
  );
}
