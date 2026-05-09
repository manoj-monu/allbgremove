'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, Settings, Download, Wand2, Layers3, ImageIcon, 
  Crop as CropIcon, Scaling, RotateCcw, Palette, Brush, Zap, 
  Printer, Sun, Contrast, X, Globe, ChevronDown, CheckCircle2, Upload
} from 'lucide-react';
import { saveAs } from 'file-saver';

export default function PassportPhotoMakerUI() {
  // --- STATE ---
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTool, setActiveTool] = useState('Crop');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [zoom, setZoom] = useState(1);
  const [printSize, setPrintSize] = useState<'4x6' | 'A4'>('4x6');
  
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
    highlights: 0,
    shadows: 0,
    temperature: 0,
    exposure: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImage(result);
      setProcessedImage(result);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async () => {
    if (!image) return;
    setIsProcessing(true);
    try {
      const response = await fetch('https://manoj-monu-allbgremove.hf.space/remove_bg/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: image.split(',')[1] }),
      });
      const data = await response.json();
      if (data.image) {
        setProcessedImage(`data:image/png;base64,${data.image}`);
      }
    } catch (err) {
      console.error("BG Removal Failed", err);
      alert("Background removal service unavailable.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSliderChange = (key: keyof typeof adjustments, val: string) => {
    setAdjustments(prev => ({ ...prev, [key]: parseInt(val) }));
  };

  // --- PRINT GENERATION (Precise 3mm Logic) ---
  const generateSheet = async () => {
    if (!processedImage) return;

    const MM_TO_PX = 11.811;
    const marginPx = 3 * MM_TO_PX;
    const gapPx = 3 * MM_TO_PX;
    const pw = 35 * MM_TO_PX;
    const ph = 45 * MM_TO_PX;

    let canvasWidth, canvasHeight, rows, cols;
    if (printSize === '4x6') {
      canvasWidth = 1200; canvasHeight = 1800; cols = 3; rows = 4;
    } else {
      canvasWidth = 2480; canvasHeight = 3508; cols = 5; rows = 6;
    }

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = processedImage;
    await new Promise(r => img.onload = r);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = marginPx + col * (pw + gapPx);
        const y = marginPx + row * (ph + gapPx);
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, pw, ph);
        ctx.drawImage(img, x, y, pw, ph);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, pw, ph);
      }
    }

    canvas.toBlob((blob) => { if (blob) saveAs(blob, `passport_${printSize}.png`); });
  };

  const tools = [
    { id: 'Crop', icon: <CropIcon size={18} /> },
    { id: 'Resize', icon: <Scaling size={18} /> },
    { id: 'Rotate', icon: <RotateCcw size={18} /> },
    { id: 'Background', icon: <Palette size={18} /> },
    { id: 'Adjustments', icon: <Settings size={18} /> },
    { id: 'Retouch', icon: <Brush size={18} /> },
    { id: 'Filters', icon: <Zap size={18} /> },
  ];

  const countries = [
    { name: 'India', size: '35mm x 45mm' },
    { name: 'United States', size: '2in x 2in' },
    { name: 'Canada', size: '50mm x 70mm' },
    { name: 'United Kingdom', size: '35mm x 45mm' },
    { name: 'Australia', size: '35mm x 45mm' },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans selection:bg-blue-500">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 backdrop-blur-lg sticky top-0 z-50 bg-[#050816]/90">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-600/30">
            P
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">Passport Photo Maker</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AI Professional Studio</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300 font-medium">
          <a href="#" className="hover:text-blue-400 transition">Home</a>
          <a href="#" className="hover:text-blue-400 transition" onClick={() => setPrintSize(prev => prev === '4x6' ? 'A4' : '4x6')}>Mode: {printSize}</a>
          <a href="#" className="hover:text-blue-400 transition">Pricing</a>
          <a href="#" className="hover:text-blue-400 transition">Templates</a>
          <a href="#" className="hover:text-blue-400 transition">Contact</a>
        </nav>

        <button className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-bold">
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      {!image && (
        <section className="relative overflow-hidden px-6 lg:px-16 py-24">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-black uppercase tracking-widest mb-8">
                <Zap size={14} /> AI Powered Passport Editor
              </div>

              <h2 className="text-6xl lg:text-8xl font-black leading-none tracking-tighter mb-8">
                Create Perfect <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">Passport Photos</span>
              </h2>

              <p className="text-xl text-gray-400 max-w-xl leading-relaxed mb-10 font-medium">
                Advanced online passport photo maker with 3mm precision margins, AI background removal, and HD export for 4x6 & A4 sheets.
              </p>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-lg font-black shadow-2xl shadow-blue-600/30 active:scale-95"
                >
                  Upload Photo
                </button>
                <button className="px-10 py-5 rounded-2xl border border-white/10 hover:bg-white/5 transition text-lg font-black active:scale-95">
                  Watch Demo
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-16">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-lg">
                  <h3 className="text-4xl font-black text-blue-500">150+</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Countries</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-lg">
                  <h3 className="text-4xl font-black text-blue-500">3mm</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Margins</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-lg">
                  <h3 className="text-4xl font-black text-blue-500">AI</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Face Sync</p>
                </div>
              </div>
            </motion.div>

            {/* Upload Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/[0.03] border border-white/10 rounded-[48px] p-10 backdrop-blur-3xl shadow-2xl"
            >
              <div 
                className="border-2 border-dashed border-blue-500/30 rounded-[35px] p-16 text-center hover:border-blue-500 transition cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-28 h-28 mx-auto rounded-full bg-blue-600/20 flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition duration-500">
                  <Upload size={40} className="text-blue-500" />
                </div>
                <h3 className="text-4xl font-black mb-4 tracking-tighter">Upload Photo</h3>
                <p className="text-gray-500 font-bold mb-8">JPG, PNG, JPEG Supported</p>
                <button className="px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-lg font-black shadow-xl shadow-blue-600/20">
                  Choose File
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Editor */}
      {image && (
        <section className="px-6 lg:px-16 pb-24 pt-10">
          <div className="bg-white rounded-[48px] overflow-hidden shadow-2xl border border-gray-200">
            <div className="grid grid-cols-12 min-h-[900px]">
              {/* Left Sidebar */}
              <div className="col-span-12 lg:col-span-2 bg-[#f8faff] border-r border-gray-100 p-6">
                <h3 className="text-gray-900 font-black text-xl mb-8 tracking-tighter">Tools</h3>

                <div className="space-y-4">
                  {tools.map((tool, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTool(tool.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all font-bold text-sm ${activeTool === tool.id ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' : 'bg-white text-gray-700 border-gray-100 hover:border-blue-500 hover:bg-blue-50'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTool === tool.id ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        {tool.icon}
                      </div>
                      {tool.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Center Editor */}
              <div className="col-span-12 lg:col-span-7 bg-[#fafcff] p-8 flex flex-col">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl border border-gray-100 p-5 mb-8 shadow-sm">
                  <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition" onClick={() => setImage(null)}>Reset</button>
                    <button className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition">Undo</button>
                  </div>

                  <div className="flex items-center gap-4 text-gray-700">
                    <button className="w-10 h-10 rounded-xl bg-gray-100 font-bold text-xl hover:bg-gray-200 transition" onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}>-</button>
                    <span className="font-black text-blue-600 min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
                    <button className="w-10 h-10 rounded-xl bg-gray-100 font-bold text-xl hover:bg-gray-200 transition" onClick={() => setZoom(z => Math.min(z + 0.1, 3))}>+</button>
                  </div>

                  <button 
                    onClick={generateSheet}
                    className="px-8 py-3.5 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 active:scale-95"
                  >
                    Download HD {printSize}
                  </button>
                </div>

                {/* Canvas */}
                <div className="flex-1 rounded-[40px] border-2 border-dashed border-blue-200 bg-white relative overflow-hidden flex items-center justify-center p-10 group">
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-[0.05] pointer-events-none">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-blue-500"></div>
                    ))}
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ 
                      width: 350, height: 450, 
                      background: bgColor, 
                      transform: `scale(${zoom})`,
                      boxShadow: '0 30px 60px rgba(0,0,0,0.1)'
                    }}
                    className="relative rounded-2xl overflow-hidden"
                  >
                    {processedImage && (
                      <img
                        src={processedImage}
                        alt="Passport"
                        className="w-full h-full object-contain"
                        style={{ filter: `brightness(${100 + adjustments.brightness}%) contrast(${100 + adjustments.contrast}%) saturate(${100 + adjustments.saturation}%)` }}
                      />
                    )}
                    {isProcessing && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-50">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">AI Rendering...</span>
                      </div>
                    )}
                  </motion.div>

                  {/* UI Indicators */}
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-600 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition duration-500">
                    3mm Safe Margin Enabled
                  </div>
                </div>

                {/* Bottom Thumbnails */}
                <div className="flex items-center gap-5 mt-8 overflow-x-auto pb-4 scrollbar-hide">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className={`min-w-[100px] h-[130px] rounded-2xl overflow-hidden border-4 transition-all ${item === 1 ? 'border-blue-600 shadow-xl scale-105' : 'border-white shadow-md hover:border-blue-200'}`}
                    >
                      <img
                        src={processedImage || ''}
                        alt="thumb"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <button onClick={() => fileInputRef.current?.click()} className="min-w-[100px] h-[130px] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 hover:text-blue-500 hover:border-blue-500 transition">
                    <X size={24} style={{transform:'rotate(45deg)'}}/>
                  </button>
                </div>
              </div>

              {/* Right Panel */}
              <div className="col-span-12 lg:col-span-3 bg-[#f8faff] border-l border-gray-100 p-8 overflow-y-auto">
                <h3 className="text-gray-900 text-2xl font-black mb-8 tracking-tighter">Adjustments</h3>

                <div className="space-y-8">
                  {[
                    { id: 'brightness', label: 'Brightness' },
                    { id: 'contrast', label: 'Contrast' },
                    { id: 'saturation', label: 'Saturation' },
                    { id: 'sharpness', label: 'Sharpness' },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-3 font-bold">
                        <span className="text-gray-700 text-sm">{item.label}</span>
                        <span className="text-blue-600 text-sm">{adjustments[item.id as keyof typeof adjustments]}%</span>
                      </div>
                      <input 
                        type="range" min="-50" max="50" 
                        value={adjustments[item.id as keyof typeof adjustments]}
                        onChange={(e) => handleSliderChange(item.id as any, e.target.value)}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <h4 className="text-gray-900 font-black text-xl mb-6 tracking-tighter">Templates</h4>
                  <div className="space-y-4">
                    {countries.map((country, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center justify-between px-6 py-5 rounded-[25px] bg-white border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                      >
                        <span className="text-gray-800 font-bold group-hover:text-blue-600 transition">{country.name}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{country.size}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                  <h4 className="text-2xl font-black mb-3 relative z-10 tracking-tighter">AI Enhancement</h4>
                  <p className="text-sm text-white/70 mb-8 relative z-10 leading-relaxed font-medium">
                    Automatically remove background, enhance lighting, and align your face perfectly.
                  </p>
                  <button 
                    onClick={handleRemoveBackground}
                    disabled={isProcessing}
                    className="w-full py-5 rounded-[25px] bg-white text-blue-600 font-black hover:bg-gray-100 transition active:scale-95 shadow-xl relative z-10"
                  >
                    {isProcessing ? 'Processing...' : 'Apply AI Tools'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="px-6 lg:px-24 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'AI Face Sync', icon: '✨' },
            { title: 'BG Remover', icon: '🎨' },
            { title: 'HD Studio Print', icon: '📸' },
            { title: '3mm Margin', icon: '📏' },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl hover:border-blue-500/50 transition-all duration-500 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition duration-500">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tighter">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Professional level editing features powered by AI for exact printing results.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 lg:px-24 py-20 bg-black/40 backdrop-blur-2xl">
        <div className="grid lg:grid-cols-4 gap-16">
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold">P</div>
              <div>
                <h3 className="text-2xl font-black tracking-tighter">Passport Pro</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">AI Studio</p>
              </div>
            </div>

            <p className="text-gray-500 leading-relaxed font-medium">
              Create professional passport, visa, and ID photos online with advanced AI and 3mm margin precision.
            </p>
          </div>

          <div>
            <h4 className="text-gray-100 font-bold mb-10 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4 text-gray-500 font-bold text-sm">
              <li className="hover:text-blue-500 transition cursor-pointer">Live Editor</li>
              <li className="hover:text-blue-500 transition cursor-pointer">Features</li>
              <li className="hover:text-blue-500 transition cursor-pointer">Pricing</li>
              <li className="hover:text-blue-500 transition cursor-pointer">A4 Sheets</li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-100 font-bold mb-10 uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-4 text-gray-500 font-bold text-sm">
              <li className="hover:text-blue-500 transition cursor-pointer">Help Center</li>
              <li className="hover:text-blue-500 transition cursor-pointer">Privacy Policy</li>
              <li className="hover:text-blue-500 transition cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-blue-500 transition cursor-pointer">Contact Us</li>
            </ul>
          </div>

          <div className="space-y-10">
            <h4 className="text-gray-100 font-bold uppercase tracking-widest text-xs">Newsletter</h4>
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-blue-600 transition font-medium"
              />
              <button className="py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 transition font-black shadow-xl shadow-blue-600/20 active:scale-95">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-20 pt-12 text-center text-gray-600 text-sm font-bold uppercase tracking-widest">
          © 2026 Passport Photo Maker. All Rights Reserved.
        </div>
      </footer>

      <input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" />
    </div>
  );
}
