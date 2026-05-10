'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Bell, Settings, Download, Wand2, Layers3, ImageIcon, 
  Crop as CropIcon, Scaling, RotateCcw, Palette, Brush, Zap, 
  Printer, Sun, Contrast, X, Globe, ChevronDown, CheckCircle2, Upload,
  Sticker, Frame, Layers, Monitor, ScanLine, AlignCenter,
  Undo2, Redo2, Maximize2, MoreVertical, Star, LayoutGrid, Check,
  User, MessageSquare, ShieldCheck, ZapOff, Clock, MousePointer2, 
  Minus, Plus, AlignLeft, AlignRight, Type, Sparkles, Ghost, Smile
} from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Home() {
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
    whites: 0,
    blacks: 0,
    temperature: 0,
    tint: 0,
    vibrance: 0
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
    } finally {
      setIsProcessing(false);
    }
  };

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
    <div className="min-h-screen bg-[#050816] text-white font-sans selection:bg-blue-600 overflow-x-hidden">
      {/* 1. HEADER */}
      <header className="flex items-center justify-between px-10 py-5 border-b border-white/5 backdrop-blur-xl sticky top-0 z-[100] bg-[#050816]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Layers3 size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Passport Photo Maker</h1>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-semibold text-gray-400">
          <a href="#" className="text-white">Home</a>
          <a href="#" className="hover:text-white transition">Photo Requirements</a>
          <a href="#" className="hover:text-white transition">Guidelines</a>
          <a href="#" className="hover:text-white transition">Pricing</a>
          <a href="#" className="hover:text-white transition">Blog</a>
        </nav>

        <div className="flex items-center gap-5">
           <button className="flex items-center gap-2 text-xs font-bold text-gray-400">
             <Globe size={16} /> EN <ChevronDown size={12} />
           </button>
           <button className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-sm font-bold shadow-lg shadow-blue-600/20">
             Sign In
           </button>
        </div>
      </header>

      {/* 2. HERO / UPLOAD SECTION */}
      {!image && (
        <section className="relative px-6 lg:px-20 py-20 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="max-w-2xl">
             <h2 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6">
                Create Perfect <br/>
                Passport Photos <span className="text-blue-500">Instantly</span>
             </h2>
             <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg">
                Professional passport photos that meet official requirements. 100% compliant with government standards.
             </p>
             <div className="flex flex-wrap gap-4 mb-12">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                  <Check size={14} /> 100% Compliant
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                  <Maximize2 size={14} /> High Quality
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                  <Download size={14} /> Instant Download
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                   {[1,2,3,4,5].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050816] bg-gray-700 overflow-hidden"><img src={`https://i.pravatar.cc/100?u=${i}`} /></div>)}
                </div>
                <div className="flex flex-col">
                   <div className="flex items-center gap-1 text-yellow-500"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/> <span className="text-white text-xs font-bold ml-1">4.9/5</span></div>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Trusted by 1M+ users</p>
                </div>
             </div>
          </div>

          <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
             <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-500/40 rounded-3xl p-12 text-center hover:border-blue-500 transition group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition">
                   <Upload size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Upload Your Photo</h3>
                <p className="text-xs text-gray-500 mb-8 font-medium uppercase tracking-wider">JPG, JPEG or PNG. Max size 10MB</p>
                <button className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-bold shadow-xl shadow-blue-600/20">
                  Choose Photo
                </button>
             </div>
          </div>
          <input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" />
        </section>
      )}

      {/* 3. EDITOR MAIN WORKSPACE */}
      {image && (
        <section className="px-6 lg:px-10 py-10">
          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-[80px_320px_1fr_320px] min-h-[850px]">
              
              {/* Sidebar 1: Icons */}
              <div className="bg-[#f8faff] border-r border-gray-100 py-10 flex flex-col items-center gap-6">
                {[
                  { id: 'Crop', icon: <CropIcon size={20}/> },
                  { id: 'Resize', icon: <Scaling size={20}/> },
                  { id: 'Rotate', icon: <RotateCcw size={20}/> },
                  { id: 'Background', icon: <Palette size={20}/> },
                  { id: 'Adjustments', icon: <Settings size={20}/> },
                  { id: 'Retouch', icon: <Brush size={20}/> },
                  { id: 'Filters', icon: <Zap size={20}/> },
                  { id: 'Text', icon: <Type size={20}/> },
                  { id: 'Stickers', icon: <Sticker size={20}/> },
                  { id: 'Frames', icon: <Frame size={20}/> },
                  { id: 'Overlays', icon: <Layers size={20}/> },
                  { id: 'Blur', icon: <Ghost size={20}/> },
                  { id: 'Shadow', icon: <Sun size={20}/> },
                  { id: 'Highlights', icon: <Sun size={20}/> },
                  { id: 'Levels', icon: <Sun size={20}/> },
                  { id: 'Curves', icon: <Sun size={20}/> },
                  { id: 'Vignette', icon: <Smile size={20}/> },
                ].map(tool => (
                  <button 
                    key={tool.id} 
                    onClick={() => setActiveTool(tool.id)}
                    className={`p-3 rounded-xl transition-all relative group ${activeTool === tool.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                  >
                    {tool.icon}
                    <span className="absolute left-16 px-3 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">{tool.id}</span>
                  </button>
                ))}
              </div>

              {/* Sidebar 2: Options */}
              <div className="bg-white border-r border-gray-100 p-8 flex flex-col gap-10">
                <div>
                   <h3 className="text-gray-900 font-bold text-xl mb-6">Crop & Align</h3>
                   <div className="mb-6">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Aspect Ratio</label>
                      <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold bg-[#fcfdfe]">
                        35mm x 45mm (Passport) <ChevronDown size={14} />
                      </button>
                   </div>
                   <div className="mb-8">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Alignment Tools</label>
                      <div className="flex gap-2">
                        {[AlignCenter, AlignLeft, AlignRight, AlignCenter, AlignCenter].map((Icon, i) => (
                           <button key={i} className="flex-1 aspect-square rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition"><Icon size={18}/></button>
                        ))}
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-gray-700">Auto Crop</span>
                         <div className="w-10 h-5 bg-blue-600 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-gray-700">Show Grid</span>
                         <div className="w-10 h-5 bg-blue-600 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                      </div>
                   </div>
                </div>

                <div>
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Sizes</h4>
                   <div className="space-y-3">
                      {[
                        { id: 'IN', label: '35mm x 45mm', sub: 'Passport' },
                        { id: 'US', label: '40mm x 60mm', sub: 'Visa' },
                        { id: 'ID', label: '50mm x 50mm', sub: 'ID Card' },
                        { id: '2x2', label: '2in x 2in', sub: 'US Passport' },
                      ].map(s => (
                        <div key={s.id} className={`flex items-center justify-between p-4 rounded-2xl border transition ${s.id === 'IN' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-gray-100 hover:border-blue-200 cursor-pointer'}`}>
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center"><ScanLine size={16} className="text-gray-400"/></div>
                              <div>
                                 <p className="text-[13px] font-bold text-gray-800 leading-none mb-1">{s.label}</p>
                                 <p className="text-[10px] text-gray-400 font-medium">{s.sub}</p>
                              </div>
                           </div>
                           {s.id === 'IN' && <Check size={14} className="text-blue-500" />}
                        </div>
                      ))}
                      <div className="p-4 rounded-2xl border border-gray-100 border-dashed text-center text-xs font-bold text-gray-400 hover:border-blue-500 hover:text-blue-500 transition cursor-pointer">Custom Size</div>
                   </div>
                </div>
              </div>

              {/* Center: Canvas Area */}
              <div className="bg-[#fafcff] p-8 flex flex-col">
                 <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-3 mb-8 shadow-sm">
                    <div className="flex items-center gap-2">
                       <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-100 transition"><Undo2 size={16}/> Undo</button>
                       <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-100 transition"><Redo2 size={16}/> Redo</button>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2">
                          <button className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200" onClick={() => setZoom(z => Math.max(z-0.1, 0.5))}><Minus size={14}/></button>
                          <span className="text-xs font-black text-blue-600 min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
                          <button className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200" onClick={() => setZoom(z => Math.min(z+0.1, 3))}><Plus size={14}/></button>
                       </div>
                       <div className="w-px h-6 bg-gray-100 mx-2"></div>
                       <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-100 transition"><Search size={16}/> Fit</button>
                       <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition"><Maximize2 size={16}/></button>
                    </div>
                    <div className="flex items-center gap-3">
                       <button className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2" onClick={generateSheet}><Download size={16}/> Download</button>
                       <button className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-100 transition"><MoreVertical size={18}/></button>
                    </div>
                 </div>

                 <div className="flex-1 rounded-[40px] border-2 border-dashed border-blue-200 bg-white relative flex items-center justify-center p-12 overflow-hidden shadow-inner">
                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-[0.03] pointer-events-none">
                       {[...Array(16)].map((_, i) => <div key={i} className="border border-blue-500"></div>)}
                    </div>
                    
                    <div 
                      className="relative rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.15)]"
                      style={{ transform: `scale(${zoom})`, width: 380, height: 480, background: bgColor }}
                    >
                       {processedImage && (
                          <img src={processedImage} className="w-full h-full object-contain" style={{ filter: `brightness(${100+adjustments.brightness}%) contrast(${100+adjustments.contrast}%)` }} />
                       )}
                       {/* Crop Helper Lines */}
                       <div className="absolute inset-0 border border-blue-500 opacity-40 pointer-events-none"></div>
                       <div className="absolute top-[33.3%] left-0 right-0 border-t border-blue-500/20 pointer-events-none"></div>
                       <div className="absolute top-[66.6%] left-0 right-0 border-t border-blue-500/20 pointer-events-none"></div>
                       <div className="absolute left-[33.3%] top-0 bottom-0 border-l border-blue-500/20 pointer-events-none"></div>
                       <div className="absolute left-[66.6%] top-0 bottom-0 border-l border-blue-500/20 pointer-events-none"></div>
                       {/* Corner Markers */}
                       <div className="absolute top-0 left-0 w-3 h-3 bg-blue-600 rounded-full border-4 border-white -translate-x-1.5 -translate-y-1.5 shadow-md"></div>
                       <div className="absolute top-0 right-0 w-3 h-3 bg-blue-600 rounded-full border-4 border-white translate-x-1.5 -translate-y-1.5 shadow-md"></div>
                       <div className="absolute bottom-0 left-0 w-3 h-3 bg-blue-600 rounded-full border-4 border-white -translate-x-1.5 translate-y-1.5 shadow-md"></div>
                       <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 rounded-full border-4 border-white translate-x-1.5 translate-y-1.5 shadow-md"></div>

                       {isProcessing && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-[10px] font-black uppercase tracking-widest text-blue-600">AI Syncing Face...</p></div>}
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2 shadow-sm backdrop-blur-md">
                       <CheckCircle2 size={16} className="text-green-500" />
                       <span className="text-[11px] font-bold text-green-700">Face detected and perfectly aligned</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 mt-8 overflow-x-auto pb-2 scrollbar-hide">
                    {[1,2,3,4,5,6].map(i => (
                       <div key={i} className={`min-w-[100px] aspect-[3/4] rounded-xl overflow-hidden border-2 transition ${i===1 ? 'border-blue-500 scale-105 shadow-lg' : 'border-white shadow-sm hover:border-blue-100'}`}>
                          <img src={processedImage || ''} className="w-full h-full object-cover" />
                       </div>
                    ))}
                    <button className="min-w-[100px] aspect-[3/4] rounded-xl bg-[#f8faff] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500 hover:border-blue-200 transition">
                       <Plus size={20} />
                       <span className="text-[10px] font-bold">Add Photo</span>
                    </button>
                 </div>
              </div>

              {/* Sidebar 4: Adjustments */}
              <div className="bg-[#f8faff] border-l border-gray-100 p-8 flex flex-col gap-10 overflow-y-auto">
                 <div className="flex border-b border-gray-100">
                    <button className="flex-1 py-3 text-sm font-black text-blue-600 border-b-2 border-blue-600">Adjustments</button>
                    <button className="flex-1 py-3 text-sm font-bold text-gray-400">Presets</button>
                 </div>

                 <div className="space-y-10">
                    <div>
                       <div className="flex items-center justify-between mb-6"><h4 className="text-[13px] font-black text-gray-900">Basic Adjustments</h4><ChevronDown size={14} className="text-gray-400"/></div>
                       <div className="space-y-6">
                          {['Brightness', 'Contrast', 'Saturation', 'Sharpness'].map(label => (
                             <div key={label}>
                                <div className="flex justify-between text-[11px] font-bold mb-3"><span className="text-gray-500">{label}</span><span className="text-gray-900">0</span></div>
                                <input type="range" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                             </div>
                          ))}
                       </div>
                    </div>

                    <div>
                       <div className="flex items-center justify-between mb-6 text-gray-400"><h4 className="text-[13px] font-black text-gray-900">Advanced Adjustments</h4><ChevronDown size={14}/></div>
                       <div className="space-y-6 opacity-30">
                          {['Highlights', 'Shadows', 'Whites', 'Blacks'].map(label => (
                             <div key={label}>
                                <div className="flex justify-between text-[11px] font-bold mb-3"><span>{label}</span><span>0</span></div>
                                <input type="range" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none" disabled />
                             </div>
                          ))}
                       </div>
                    </div>

                    <div>
                       <div className="flex items-center justify-between mb-6 text-gray-400"><h4 className="text-[13px] font-black text-gray-900">Color Adjustments</h4><ChevronDown size={14}/></div>
                       <div className="space-y-6 opacity-30">
                          {['Temperature', 'Tint', 'Vibrance'].map(label => (
                             <div key={label}>
                                <div className="flex justify-between text-[11px] font-bold mb-3"><span>{label}</span><span>0</span></div>
                                <div className="h-1.5 w-full bg-gradient-to-r from-blue-300 via-gray-200 to-yellow-300 rounded-full"></div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Tools</h4>
                    <div className="space-y-3">
                       {[
                         { icon: <Sparkles size={16}/>, label: 'Auto Enhance', desc: 'Enhance photo automatically' },
                         { icon: <Palette size={16}/>, label: 'Remove Background', desc: 'Remove and replace background' },
                         { icon: <Smile size={16}/>, label: 'Retouch Face', desc: 'Smooth skin and remove blemishes' },
                       ].map(t => (
                         <div key={t.label} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 transition cursor-pointer group" onClick={t.label === 'Remove Background' ? handleRemoveBackground : undefined}>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">{t.icon}</div>
                            <div>
                               <p className="text-[12px] font-black text-gray-900 leading-none mb-1">{t.label}</p>
                               <p className="text-[9px] text-gray-400 font-medium">{t.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. CONTENT SECTIONS BELOW EDITOR */}
      <section className="px-6 lg:px-20 py-20 bg-white/5 border-t border-white/5">
         <div className="grid lg:grid-cols-5 gap-10 mb-20">
            {[
              { icon: <Maximize2 />, title: 'AI Face Detection', desc: 'Automatically detect and align faces perfectly' },
              { icon: <Palette />, title: 'Background Removal', desc: 'Remove or change background easily' },
              { icon: <Zap />, title: 'Smart Enhancement', desc: 'Enhance quality and sharpness automatically' },
              { icon: <LayoutGrid />, title: 'Batch Processing', desc: 'Process multiple photos at once' },
              { icon: <ShieldCheck />, title: '100% Secure', desc: 'Your photos are private and secure' },
            ].map(f => (
               <div key={f.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center shrink-0">{f.icon}</div>
                  <div>
                     <h4 className="text-sm font-bold mb-1">{f.title}</h4>
                     <p className="text-[11px] text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
               </div>
            ))}
         </div>

         <div className="grid lg:grid-cols-3 gap-16">
            {/* Countries */}
            <div>
               <h3 className="text-xl font-bold mb-8">Popular Countries</h3>
               <div className="space-y-4">
                  {[
                    { name: 'United States', size: '2in x 2in' },
                    { name: 'India', size: '35mm x 45mm', active: true },
                    { name: 'United Kingdom', size: '35mm x 45mm' },
                    { name: 'Canada', size: '50mm x 70mm' },
                    { name: 'Australia', size: '35mm x 45mm' },
                  ].map(c => (
                    <div key={c.name} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500 transition">
                       <div className="flex items-center gap-3">
                          <img src={`https://flagcdn.com/w40/${c.name === 'United States' ? 'us' : c.name === 'India' ? 'in' : c.name === 'United Kingdom' ? 'gb' : c.name === 'Canada' ? 'ca' : 'au'}.png`} className="w-6 h-4 object-cover rounded-[2px]" />
                          <span className="text-sm font-bold">{c.name}</span>
                       </div>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${c.active ? 'text-blue-500' : 'text-gray-500'}`}>{c.size}</span>
                    </div>
                  ))}
                  <button className="w-full py-4 text-xs font-black text-blue-500 uppercase tracking-widest hover:underline transition">View All Countries</button>
               </div>
            </div>

            {/* Sizes */}
            <div>
               <div className="flex items-center justify-between mb-8"><h3 className="text-xl font-bold">Popular Sizes</h3> <button className="text-xs font-bold text-blue-500">View All Sizes</button></div>
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: '35mm x 45mm', sub: 'Passport', active: true },
                    { label: '40mm x 60mm', sub: 'Visa' },
                    { label: '50mm x 50mm', sub: 'ID Card' },
                    { label: '2in x 2in', sub: 'US Passport' },
                    { label: '33mm x 48mm', sub: 'Driving License' },
                    { label: '26mm x 32mm', sub: 'Student ID' },
                  ].map(s => (
                    <div key={s.label} className={`p-5 rounded-2xl border transition text-center ${s.active ? 'bg-white/10 border-blue-500' : 'bg-white/5 border-white/10'}`}>
                       <h4 className="text-xs font-black mb-1">{s.label}</h4>
                       <p className="text-[10px] text-gray-500 font-bold">{s.sub}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Testimonials */}
            <div>
               <h3 className="text-xl font-bold mb-8">What Our Users Say</h3>
               <div className="space-y-6">
                  {[
                    { name: 'Priya Sharma', text: 'Best passport photo maker! Very easy to use and got perfect results.', days: '2 days ago' },
                    { name: 'Rahul Verma', text: 'Great tool with all the features like Photoshop. Highly recommended!', days: '1 week ago' },
                    { name: 'Anita Patel', text: 'Saved so much time and money. Works perfectly for all requirements.', days: '2 weeks ago' },
                  ].map(t => (
                    <div key={t.name} className="p-6 rounded-3xl bg-white/5 border border-white/10">
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 font-bold">{t.name[0]}</div>
                             <div>
                                <p className="text-xs font-black leading-none mb-1">{t.name}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t.days}</p>
                             </div>
                          </div>
                          <div className="flex text-yellow-500 gap-0.5"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div>
                       </div>
                       <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic">"{t.text}"</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="px-6 lg:px-20 py-20">
         <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[48px] p-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-32 -translate-y-32"></div>
            <div className="flex flex-col lg:flex-row items-center gap-8 z-10 text-center lg:text-left">
               <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl">
                 <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg"><User className="text-white" size={24}/></div>
               </div>
               <div>
                  <h3 className="text-3xl font-black mb-2 tracking-tighter">Ready to Create Your Perfect Passport Photo?</h3>
                  <p className="text-blue-100 font-medium">Join millions of satisfied users who trust our passport photo maker.</p>
               </div>
            </div>
            <button className="px-12 py-5 rounded-2xl bg-blue-500 hover:bg-blue-400 transition text-lg font-black shadow-2xl relative z-10 flex items-center gap-3 active:scale-95">
               Get Started Now <ArrowRight size={20}/>
            </button>
         </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="px-10 py-20 bg-black/40 border-t border-white/5">
         <div className="grid lg:grid-cols-4 gap-16 mb-20">
            <div className="space-y-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center"><Layers3 size={20} /></div>
                  <h3 className="text-lg font-bold">Passport Photo Maker</h3>
               </div>
               <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Create professional passport photos online quickly and easily. 100% compliant with official requirements.
               </p>
               <div className="flex gap-4">
                  {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => <Icon key={i} size={18} className="text-gray-500 hover:text-white cursor-pointer transition" />)}
               </div>
            </div>

            <div className="lg:ml-10">
               <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-10">Quick Links</h4>
               <ul className="space-y-4 text-sm text-gray-500 font-bold">
                  <li className="hover:text-blue-500 transition cursor-pointer">Home</li>
                  <li className="hover:text-blue-500 transition cursor-pointer">Photo Requirements</li>
                  <li className="hover:text-blue-500 transition cursor-pointer">Guidelines</li>
                  <li className="hover:text-blue-500 transition cursor-pointer">Pricing</li>
                  <li className="hover:text-blue-500 transition cursor-pointer">Blog</li>
               </ul>
            </div>

            <div>
               <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-10">Support</h4>
               <ul className="space-y-4 text-sm text-gray-500 font-bold">
                  <li className="hover:text-blue-500 transition cursor-pointer">Help Center</li>
                  <li className="hover:text-blue-500 transition cursor-pointer">Contact Us</li>
                  <li className="hover:text-blue-500 transition cursor-pointer">Privacy Policy</li>
                  <li className="hover:text-blue-500 transition cursor-pointer">Terms of Service</li>
                  <li className="hover:text-blue-500 transition cursor-pointer">Refund Policy</li>
               </ul>
            </div>

            <div className="space-y-10">
               <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Newsletter</h4>
               <p className="text-sm text-gray-500 font-medium">Subscribe to get tips and updates.</p>
               <div className="flex flex-col gap-3">
                  <input type="email" placeholder="Enter your email" className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-600 transition text-sm" />
                  <button className="py-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20">Subscribe</button>
               </div>
            </div>
         </div>
         <div className="pt-10 border-t border-white/5 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
            © 2024 Passport Photo Maker. All rights reserved.
         </div>
      </footer>
    </div>
  );
}
