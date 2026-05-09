'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Crop as CropIcon, 
  Scaling, 
  RotateCcw, 
  Palette, 
  Settings, 
  Brush, 
  Zap, 
  Type, 
  Frame, 
  Layers, 
  Globe, 
  ChevronDown, 
  Upload, 
  Download, 
  Search, 
  Undo2, 
  Redo2, 
  CheckCircle2, 
  ImageIcon, 
  ArrowRight, 
  ShieldCheck, 
  Wand2, 
  Smile, 
  Ghost,
  Info,
  Grid,
  Maximize2,
  X,
  Printer,
  CloudLightning,
  Sun,
  Contrast,
  Aperture,
  Wind
} from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTool, setActiveTool] = useState('crop');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSliderChange = (key: keyof typeof adjustments, val: string) => {
    setAdjustments(prev => ({ ...prev, [key]: parseInt(val) }));
  };

  const generateSheet = async () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1200, 1800);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    await new Promise(r => img.onload = r);

    const photoWidth = 350;
    const photoHeight = 450;
    const margin = 50;
    const gap = 30;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const x = margin + col * (photoWidth + gap);
        const y = margin + row * (photoHeight + gap);
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, photoWidth, photoHeight);
        ctx.drawImage(img, x, y, photoWidth, photoHeight);
        
        ctx.setLineDash([10, 10]);
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 5, y - 5, photoWidth + 10, photoHeight + 10);
      }
    }

    canvas.toBlob((blob) => {
      if (blob) saveAs(blob, 'passport_sheet.png');
    });
  };

  const tools = [
    { id: 'crop', icon: <CropIcon size={20} />, label: 'Crop' },
    { id: 'resize', icon: <Scaling size={20} />, label: 'Resize' },
    { id: 'rotate', icon: <RotateCcw size={20} />, label: 'Rotate' },
    { id: 'bg', icon: <Palette size={20} />, label: 'Background' },
    { id: 'adjust', icon: <Settings size={20} />, label: 'Adjustments' },
    { id: 'retouch', icon: <Brush size={20} />, label: 'Retouch' },
    { id: 'filters', icon: <Zap size={20} />, label: 'Filters' },
    { id: 'text', icon: <Type size={20} />, label: 'Text' },
    { id: 'frames', icon: <Frame size={20} />, label: 'Frames' },
  ];

  const countries = [
    { name: 'India', size: '35mm x 45mm' },
    { name: 'United States', size: '2in x 2in' },
    { name: 'Canada', size: '50mm x 70mm' },
    { name: 'United Kingdom', size: '35mm x 45mm' },
    { name: 'Australia', size: '35mm x 45mm' },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 backdrop-blur-lg sticky top-0 z-50 bg-[#050816]/90">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-600/30 transition-transform hover:scale-105">
            P
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Passport Pro</h1>
            <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">AI Studio v9.0</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition">Dashboard</a>
          <a href="#" className="hover:text-white transition">Templates</a>
          <a href="#" className="hover:text-white transition">Pricing</a>
          <a href="#" className="hover:text-white transition">API Docs</a>
        </nav>

        <div className="flex items-center gap-4">
           <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition text-sm">
             <Globe size={14} /> EN
           </button>
           <button className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold shadow-lg shadow-blue-600/20 active:scale-95">
             Sign In
           </button>
        </div>
      </header>

      {/* Hero Section */}
      {!image && (
        <section className="relative overflow-hidden px-6 lg:px-24 py-20 lg:py-32">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider">
                <CloudLightning size={14} /> Next-Gen AI Processing
              </div>

              <h2 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter">
                Perfect <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Passport</span> <br/>
                Photos.
              </h2>

              <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
                Transform any selfie into a government-compliant passport photo in seconds. 
                AI-driven background removal, face alignment, and high-res print layouts.
              </p>

              <div className="flex flex-wrap gap-5">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-lg font-bold shadow-2xl shadow-blue-600/40 flex items-center gap-3 active:scale-95"
                >
                  <Upload size={22} /> Upload Photo
                </button>
                <button className="px-8 py-5 rounded-2xl border border-white/20 hover:bg-white/10 transition text-lg font-bold">
                  Live Demo
                </button>
              </div>

              <div className="flex items-center gap-12 pt-4">
                <div>
                  <div className="text-3xl font-black text-white">150+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Countries</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <div className="text-3xl font-black text-white">100%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Compliant</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-2xl shadow-2xl overflow-hidden">
                <div 
                  className="border-2 border-dashed border-blue-500/30 rounded-[30px] py-20 text-center hover:border-blue-500 transition cursor-pointer group/upload"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 mx-auto rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 mb-8 group-hover/upload:scale-110 transition duration-500">
                    <Upload size={40} />
                  </div>
                  <h3 className="text-3xl font-black mb-3">Drop your photo</h3>
                  <p className="text-gray-500 font-medium">JPEG, PNG or HEIC supported</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Editor */}
      {image && (
        <section className="px-6 lg:px-12 py-10">
          <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.15)] border border-gray-100">
            <div className="grid grid-cols-12 min-h-[850px]">
              {/* Left Sidebar */}
              <div className="col-span-12 lg:col-span-2 bg-[#f8faff] border-r border-gray-100 p-6">
                <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-8">Studio Tools</h3>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${
                        activeTool === tool.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                        : 'bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600 border border-gray-100'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTool === tool.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                        {tool.icon}
                      </div>
                      {tool.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Center Editor */}
              <div className="col-span-12 lg:col-span-7 bg-white p-8 flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50/50 rounded-3xl border border-gray-100 p-4 mb-8">
                  <div className="flex items-center gap-2">
                    <button className="p-3 rounded-xl hover:bg-white transition text-gray-400 hover:text-blue-600"><Undo2 size={20}/></button>
                    <button className="p-3 rounded-xl hover:bg-white transition text-gray-400 hover:text-blue-600"><Redo2 size={20}/></button>
                  </div>

                  <div className="flex items-center gap-5">
                    <button onClick={() => setZoom(z => Math.max(z - 0.1, 1))} className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-700 hover:shadow-md transition">−</button>
                    <span className="font-bold text-gray-900 w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(z + 0.1, 3))} className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-700 hover:shadow-md transition">+</button>
                  </div>

                  <button 
                    onClick={generateSheet}
                    className="px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2"
                  >
                    <Download size={20} /> Download HD
                  </button>
                </div>

                <div className="flex-1 rounded-[40px] bg-[#fdfdff] border-2 border-dashed border-blue-200 relative overflow-hidden flex items-center justify-center group/canvas">
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-[0.03] pointer-events-none">
                    {[...Array(36)].map((_, i) => <div key={i} className="border border-blue-900"></div>)}
                  </div>

                  <div className="relative shadow-[0_50px_100px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out" style={{ 
                    transform: `scale(${zoom}) translate(${crop.x}px, ${crop.y}px)` 
                  }}>
                    <img
                      src={image}
                      alt="Passport"
                      className="max-h-[600px] w-auto rounded-xl"
                      style={{ 
                        filter: `brightness(${100 + adjustments.brightness}%) contrast(${100 + adjustments.contrast}%) saturate(${100 + adjustments.saturation}%)` 
                      }}
                    />
                    <div className="absolute inset-0 border-2 border-blue-500/50 pointer-events-none rounded-xl"></div>
                    
                    {/* Face Guides */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[200px] h-[260px] border border-blue-400/30 rounded-[100px] pointer-events-none">
                      <div className="absolute top-[40%] left-0 right-0 h-px bg-blue-400/20"></div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-gray-100 shadow-xl opacity-0 group-hover/canvas:opacity-100 transition duration-500">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span className="text-sm font-bold text-gray-800">Perfectly Centered</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-8 overflow-x-auto pb-4 scrollbar-hide">
                  <div className="min-w-[100px] h-[100px] rounded-2xl bg-blue-50 border-2 border-dashed border-blue-300 flex items-center justify-center text-blue-500 cursor-pointer hover:bg-blue-100 transition" onClick={() => fileInputRef.current?.click()}>
                    <X size={24} className="rotate-45" />
                  </div>
                  {[1, 2].map((item) => (
                    <div key={item} className={`min-w-[100px] h-[100px] rounded-2xl overflow-hidden border-4 transition cursor-pointer ${item === 1 ? 'border-blue-500 shadow-lg' : 'border-transparent opacity-50'}`}>
                      <img src={image} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel */}
              <div className="col-span-12 lg:col-span-3 bg-[#fbfcfe] border-l border-gray-100 p-8 overflow-y-auto">
                <div className="space-y-10">
                  <section>
                    <h3 className="text-gray-900 text-xl font-black mb-6">Fine Tune</h3>
                    <div className="space-y-6">
                      {[
                        { id: 'brightness', label: 'Brightness', icon: <Sun size={14}/> },
                        { id: 'contrast', label: 'Contrast', icon: <Contrast size={14}/> },
                        { id: 'saturation', label: 'Saturation', icon: <Aperture size={14}/> },
                      ].map((item) => (
                        <div key={item.id}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-gray-700 font-bold text-xs uppercase tracking-wider">
                              {item.icon} {item.label}
                            </div>
                            <span className="text-blue-600 font-bold text-xs">{adjustments[item.id as keyof typeof adjustments]}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="-50" max="50"
                            value={adjustments[item.id as keyof typeof adjustments]}
                            onChange={(e) => handleSliderChange(item.id as any, e.target.value)}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                          />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-gray-900 font-black text-xl mb-6">Country Format</h4>
                    <div className="space-y-3">
                      {countries.map((country, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                        >
                          <span className="text-gray-800 font-bold group-hover:text-blue-600 transition">{country.name}</span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{country.size}</span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-[30px] p-8 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition duration-1000"></div>
                    <h4 className="text-2xl font-black mb-3 relative z-10">AI Auto-Fix</h4>
                    <p className="text-sm text-white/70 mb-8 relative z-10 leading-relaxed">
                      Instant background removal and lighting correction.
                    </p>
                    <button 
                      onClick={() => setAdjustments(prev => ({...prev, brightness: 10, contrast: 15}))}
                      className="w-full py-4 rounded-2xl bg-white text-blue-600 font-black hover:bg-gray-100 transition active:scale-95 shadow-xl relative z-10"
                    >
                      Run Optimizer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="px-6 lg:px-24 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-black mb-6">Built for Professionals.</h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">Simple enough for a quick selfie, powerful enough for a photography studio.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'AI Face Sync', desc: 'Auto alignment powered by advanced computer vision.', icon: <Search size={28}/> },
            { title: 'BG Remover', desc: 'Clean, professional edges with one-click background removal.', icon: <Palette size={28}/> },
            { title: 'HD Studio Print', desc: 'Export 4x6 inch sheets ready for any local photo printer.', icon: <Printer size={28}/> },
            { title: 'Ultra HD 4K', desc: 'No compression, keeping your photo sharp and clear.', icon: <ShieldCheck size={28}/> },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-[35px] p-10 backdrop-blur-xl hover:border-blue-500/50 transition-all duration-500 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 lg:px-24 py-20 bg-black/40 backdrop-blur-2xl">
        <div className="grid lg:grid-cols-4 gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold">P</div>
              <h3 className="text-2xl font-black tracking-tighter">Passport Pro</h3>
            </div>
            <p className="text-gray-500 leading-relaxed font-medium">
              The world's most advanced AI-powered passport photo studio. Professional results, zero effort.
            </p>
          </div>

          <div>
            <h4 className="text-gray-100 font-bold mb-8 uppercase tracking-widest text-xs">Navigation</h4>
            <ul className="space-y-4 text-gray-500 font-medium text-sm">
              <li className="hover:text-blue-500 transition cursor-pointer">Live Editor</li>
              <li className="hover:text-blue-500 transition cursor-pointer">Pricing Plans</li>
              <li className="hover:text-blue-500 transition cursor-pointer">API Integration</li>
              <li className="hover:text-blue-500 transition cursor-pointer">Enterprise</li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-100 font-bold mb-8 uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-4 text-gray-500 font-medium text-sm">
              <li className="hover:text-blue-500 transition cursor-pointer">Privacy Policy</li>
              <li className="hover:text-blue-500 transition cursor-pointer">Terms of Service</li>
              <li className="hover:text-blue-500 transition cursor-pointer">Photo Guide</li>
              <li className="hover:text-blue-500 transition cursor-pointer">Contact Support</li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-gray-100 font-bold uppercase tracking-widest text-xs">Stay Updated</h4>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-blue-600 transition"
              />
              <button className="py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 transition font-bold shadow-xl shadow-blue-600/20 active:scale-95">
                Join Studio
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-20 pt-10 flex flex-wrap justify-between items-center gap-6">
          <p className="text-gray-600 text-sm font-medium">© 2026 Passport Studio Pro. All rights reserved.</p>
          <div className="flex items-center gap-8 text-gray-600">
             <Globe size={18} className="hover:text-white transition cursor-pointer" />
             <Wind size={18} className="hover:text-white transition cursor-pointer" />
             <Aperture size={18} className="hover:text-white transition cursor-pointer" />
          </div>
        </div>
      </footer>

      <input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" />
    </div>
  );
}
