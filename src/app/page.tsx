'use client';

import React, { useState, useRef } from 'react';
import { 
  Crop as CropIcon, Scaling, RotateCcw, Palette, Settings, Brush, Zap, 
  Layers, Globe, ChevronDown, Upload, Download, Search, Undo2, Redo2, 
  CheckCircle2, ImageIcon, ArrowRight, ShieldCheck, Wand2, Smile, Ghost, 
  Grid, Maximize2, X, Printer, Sun, Contrast, Wind, Aperture
} from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Home() {
  // --- STATE ---
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTool, setActiveTool] = useState('crop');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [zoom, setZoom] = useState(1);
  const [printSize, setPrintSize] = useState<'4x6' | 'A4'>('4x6');
  
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
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

  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 backdrop-blur-lg sticky top-0 z-50 bg-[#050816]/90">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-600/30">
            P
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">Passport Studio</h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">AI Professional v10.5</p>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-10 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition">Features</a>
          <a href="#" className="hover:text-white transition">Pricing</a>
          <button className="text-blue-500 font-bold" onClick={() => setPrintSize(printSize === '4x6' ? 'A4' : '4x6')}>
            MODE: {printSize}
          </button>
        </nav>

        <div className="flex items-center gap-6">
          <button className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition">
            <Globe size={18} /> EN <ChevronDown size={14} />
          </button>
          <button className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 transition font-bold shadow-xl shadow-blue-600/20 active:scale-95">
            Sign In
          </button>
        </div>
      </header>

      {/* Hero / Upload */}
      {!image && (
        <section className="relative pt-20 pb-32 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent -z-10"></div>
          
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest animate-pulse">
              <Zap size={14} /> Next-Gen AI Processing
            </div>
            
            <h2 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none">
              Perfect <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">Photos.</span>
            </h2>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Transform any selfie into a government-compliant passport photo in seconds. AI-driven background removal and 3mm margin print layouts.
            </p>

            <div className="flex flex-col items-center gap-6 pt-10">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex items-center gap-4 px-12 py-6 rounded-[30px] bg-white text-black font-black text-xl hover:bg-blue-500 hover:text-white transition-all duration-500 shadow-2xl hover:shadow-blue-500/40"
              >
                <Upload size={24} /> Upload Photo
                <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
              </button>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Supports 4x6 (12 Pcs) & A4 (30 Pcs)</p>
            </div>
          </div>
        </section>
      )}

      {/* Editor Interface */}
      {image && (
        <section className="p-6 lg:p-12">
          <div className="max-w-[1600px] mx-auto bg-white/[0.02] border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="grid lg:grid-cols-[1fr_400px] min-h-[800px]">
              {/* Left Side: Canvas Area */}
              <div className="p-8 lg:p-12 flex flex-col gap-10 border-r border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white" onClick={() => setImage(null)}>
                      <X size={20} />
                    </button>
                    <h3 className="text-xl font-bold">Studio Workspace</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-6 py-3 rounded-xl bg-white/5 text-sm font-bold border border-white/10 hover:bg-white/10 transition" onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}>−</button>
                    <span className="w-16 text-center font-mono font-bold text-blue-500">{Math.round(zoom * 100)}%</span>
                    <button className="px-6 py-3 rounded-xl bg-white/5 text-sm font-bold border border-white/10 hover:bg-white/10 transition" onClick={() => setZoom(prev => Math.min(prev + 0.1, 3))}>+</button>
                  </div>
                </div>

                <div className="flex-1 bg-black/40 rounded-[35px] border border-white/5 relative flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent"></div>
                  
                  <div 
                    className="relative shadow-2xl transition-transform duration-300"
                    style={{ 
                      transform: `scale(${zoom})`,
                      width: 350, height: 450,
                      background: bgColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    {processedImage && (
                      <img 
                        src={processedImage} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                        style={{ filter: `brightness(${100 + adjustments.brightness}%) contrast(${100 + adjustments.contrast}%)` }}
                      />
                    )}
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-black uppercase tracking-widest text-blue-500">AI Processing...</span>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center gap-3 shadow-2xl">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-gray-300">Live Studio Engine Ready</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button onClick={generateSheet} className="px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 transition font-black flex items-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95">
                    <Printer size={20} /> Export {printSize} Sheet
                  </button>
                  <button onClick={handleRemoveBackground} className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-black flex items-center gap-3 active:scale-95">
                    <Palette size={20} /> Remove Background
                  </button>
                </div>
              </div>

              {/* Right Side: Toolbars */}
              <div className="p-8 lg:p-12 space-y-12 bg-black/20">
                <div className="space-y-8">
                  <h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest">Adjustments</h4>
                  <div className="space-y-10">
                    {[
                      { id: 'brightness', label: 'Brightness', icon: <Sun size={18} /> },
                      { id: 'contrast', label: 'Contrast', icon: <Contrast size={18} /> },
                    ].map(item => (
                      <div key={item.id} className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-gray-300 font-bold text-sm">
                            {item.icon} {item.label}
                          </div>
                          <span className="text-blue-500 font-bold text-sm">{adjustments[item.id as keyof typeof adjustments]}%</span>
                        </div>
                        <input 
                          type="range" min="-50" max="50"
                          value={adjustments[item.id as keyof typeof adjustments]}
                          onChange={(e) => handleSliderChange(item.id as any, e.target.value)}
                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest">Background Color</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {['#ffffff', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#000000', '#f1f5f9', '#ffeb3b'].map(c => (
                      <button 
                        key={c} 
                        onClick={() => setBgColor(c)}
                        className={`aspect-square rounded-xl border-2 transition-all duration-300 ${bgColor === c ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/20' : 'border-transparent hover:border-white/20'}`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl cursor-pointer" />
                </div>

                <div className="space-y-8 pt-8 border-t border-white/10">
                  <h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest">Print Configuration</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPrintSize('4x6')}
                      className={`p-6 rounded-2xl border-2 transition-all ${printSize === '4x6' ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                    >
                      <div className="font-black text-xl mb-1 text-white">4x6</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">12 Photos</div>
                    </button>
                    <button 
                      onClick={() => setPrintSize('A4')}
                      className={`p-6 rounded-2xl border-2 transition-all ${printSize === 'A4' ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                    >
                      <div className="font-black text-xl mb-1 text-white">A4</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">30 Photos</div>
                    </button>
                  </div>
                  <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-500/20 space-y-2">
                    <div className="flex justify-between text-xs font-bold"><span className="text-gray-500">Margin</span><span className="text-blue-500">3mm Precise</span></div>
                    <div className="flex justify-between text-xs font-bold"><span className="text-gray-500">Photo Gap</span><span className="text-blue-500">3mm Precise</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Strip */}
      <section className="px-6 lg:px-24 py-24 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: 'AI Face Sync', desc: 'Auto alignment for professional prints.', icon: <Search size={28}/> },
          { title: '3mm Precision', desc: 'Standard margins for photo studios.', icon: <Scaling size={28}/> },
          { icon: <Printer size={28}/>, title: 'A4 Support', desc: '30 Pcs per sheet ready to print.' },
          { icon: <ShieldCheck size={28}/>, title: 'Ultra HD', desc: '300 DPI high resolution export.' },
        ].map((feature, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-[35px] p-10 backdrop-blur-xl hover:border-blue-500/50 transition-all duration-500 group">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm font-medium">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 lg:px-24 py-20 bg-black/40 backdrop-blur-2xl text-center">
        <div className="flex flex-col items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold">P</div>
            <h3 className="text-2xl font-black tracking-tighter">Passport Studio Pro</h3>
          </div>
          <p className="text-gray-500 max-w-xl font-medium">The world's most advanced AI-powered passport photo studio. Professional results with precise 3mm margins.</p>
          <p className="text-gray-600 text-sm font-medium">© 2026 Passport Studio Pro. All rights reserved.</p>
        </div>
      </footer>

      <input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" />
    </div>
  );
}
