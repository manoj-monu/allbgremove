"use client";
import { useState } from "react";
import ImageEditor from "@/components/ImageEditor";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import Link from "next/link";

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
    <main className="min-h-screen bg-[#f4f6f8] text-slate-800 flex flex-col items-center font-sans tracking-tight">
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 px-6 md:px-10 bg-transparent">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-[22px] font-bold text-gray-800 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-700">
              <path d="M12 2l-10 5 10 5 10-5-10-5z" opacity="0.6" />
              <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" />
              <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            removebg
          </Link>
          <nav className="hidden lg:flex space-x-6 text-[15px] font-medium text-gray-600">
            <a href="#" className="hover:text-gray-900 border-b-2 border-transparent">Uploads</a>
            <a href="#" className="hover:text-gray-900 border-b-2 border-transparent">Bulk Editing</a>
            <a href="#" className="hover:text-gray-900 border-b-2 border-transparent">API</a>
            <a href="#" className="hover:text-gray-900 border-b-2 border-transparent">Plugins</a>
            <a href="#" className="hover:text-gray-900 border-b-2 border-transparent">Pricing</a>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-[15px] font-medium text-gray-600">
          <a href="#" className="hover:text-gray-900 hidden sm:block">Log in</a>
          <a href="#" className="bg-gray-200/50 hover:bg-gray-200 px-5 py-2.5 rounded-full text-gray-800 transition font-semibold text-sm">Sign up</a>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full flex flex-col items-center flex-grow mt-8">
        {!uploadedFile ? (
          <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 px-6">
            <div className="text-left w-full md:w-1/2 flex flex-col items-start pt-8 pb-12">
              <h1 className="text-5xl md:text-[60px] font-extrabold leading-[1.1] text-gray-900 mb-6 font-sans">
                Remove Image <br />Background
              </h1>
              <p className="text-xl text-gray-600 mb-8 font-medium">100% Automatically and <span className="text-yellow-500 rounded px-1 bg-yellow-50">Free</span></p>

              {/* Upload Area */}
              <div className="w-full max-w-[400px]">
                <div
                  className="w-full bg-[#0066FF] hover:bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 transition-all duration-300 p-4 flex items-center justify-center cursor-pointer mb-4"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileUpload}
                    title="Upload an image"
                  />
                  <span className="text-lg font-bold tracking-wide">Upload Image</span>
                </div>
                <div
                  className="w-full text-center text-gray-500 font-medium py-3 border-2 border-dashed border-gray-300 rounded-2xl bg-white/50 cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  or drop a file, paste image or URL
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex justify-center pb-20">
              <div className="relative w-full max-w-[450px]">
                {/* Decorative blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 rounded-full blur-3xl -z-10 opacity-70"></div>

                <div className="w-full aspect-[3/4] md:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-4 border-white relative group">
                  <ReactCompareSlider
                    className="w-full h-full"
                    position={50}
                    itemOne={<ReactCompareSliderImage src="/demo-before.jpg" alt="Original Image" className="w-full h-full object-cover" />}
                    itemTwo={
                      <div className="w-full h-full relative" style={{ backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}>
                        <ReactCompareSliderImage src="/demo-after.png" alt="Removed Background" className="w-full h-full object-cover absolute inset-0" />
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center max-w-6xl px-4 pb-20">
            <ImageEditor file={uploadedFile} onReset={() => setUploadedFile(null)} />
          </div>
        )}
      </div>
    </main>
  );
}
