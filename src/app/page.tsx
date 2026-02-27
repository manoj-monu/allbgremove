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
            ALLBgremove.com
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

        {/* Feature Showcase Section */}
        {!uploadedFile && (
          <div className="w-full bg-white flex justify-center py-24 px-6 mt-16 shadow-sm shadow-gray-100 border-t border-gray-100">
            <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-16">
              {/* Text Side */}
              <div className="lg:w-1/2 flex flex-col items-start text-left">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#3a3a3a] leading-tight mb-6">
                  All-in-one AI background remover & generator
                </h2>
                <p className="text-[#6b6b6b] text-lg mb-6 leading-relaxed">
                  ALLBgremove is your go-to, high-quality background remover, making it easy to <span className="font-bold text-gray-800">cut out a picture</span> and isolate the background with incredible accuracy.
                </p>
                <p className="text-[#6b6b6b] text-lg leading-relaxed">
                  But it doesn&apos;t stop there. With the AI background editor, you can instantly <span className="font-bold text-gray-800">create custom backdrops</span>, add beautiful colors, or make standard passport photo layouts seamlessly.
                </p>
              </div>

              {/* Image Side */}
              <div className="lg:w-1/2 w-full flex justify-center items-center mt-10 lg:mt-0">
                <div className="relative w-full max-w-lg">
                  {/* Decorative background element behind images */}
                  <div className="absolute inset-0 bg-[#f4f6f8] rounded-[2.5rem] transform -rotate-2 -scale-x-100 z-0 shadow-inner"></div>

                  <div className="relative z-10 flex gap-4 p-6 w-full">
                    {/* Before Image */}
                    <div className="w-1/2 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-gray-200">
                      <img src="/demo-before.jpg" alt="Original Background" className="w-full h-full object-cover" />
                    </div>
                    {/* After Image */}
                    <div className="w-1/2 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl relative bg-blue-50">
                      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)', backgroundSize: '16px 16px', backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px', opacity: 0.5 }}></div>
                      <img src="/demo-after.png" alt="Removed Background Result" className="w-full h-full object-cover relative z-10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Text Content block (Only visible on initial load when no file is uploaded) */}
        {!uploadedFile && (
          <div className="w-full max-w-6xl px-6 py-20 mt-8 text-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">100% Free AI Background Remover & Editor</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <h3 className="text-xl font-bold mb-3 text-blue-700">Instant Background Removal</h3>
                <p className="leading-relaxed text-sm">Remove backgrounds automatically in seconds. Our advanced AI instantly cuts out the background from your images and portraits, creating flawless transparent backgrounds perfect for design projects, profile pictures, or e-commerce products without any manual effort.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-blue-700">Change & Custom Backgrounds</h3>
                <p className="leading-relaxed text-sm">Don&apos;t just remove your background — replace it! With our fast editing tools, you can easily change your background to a solid color, an aesthetic gradient, or upload a custom image. Perfect for creating professional headshots or engaging Instagram posts.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-blue-700">Passport Photo Maker</h3>
                <p className="leading-relaxed text-sm">Need a passport or visa photo quickly? Use our built-in Passport Photo Layout setting to auto-adjust margins, apply borders, and automatically tile your images exactly to standard print formats like 4x6 inches or A4. Get high-quality printable layouts legally instantly.</p>
              </div>
            </div>

            <div className="mt-12 text-sm text-gray-500 text-center">
              By using our service, you agree to our terms. ALLBgremove is the fastest online tool to remove image backgrounds with high definition accuracy. Stop paying for expensive software and use our instantly accessible application for perfect background erasing!
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
