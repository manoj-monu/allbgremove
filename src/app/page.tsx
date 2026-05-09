'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Crop as CropIcon, Scaling, RotateCcw, Palette, Settings, Brush, Zap, Type, 
  Frame, Layers, Globe, ChevronDown, Upload, Download, Search, Undo2, Redo2, 
  CheckCircle2, ImageIcon, ArrowRight, ShieldCheck, Wand2, Smile, Ghost, Info, 
  Grid, Maximize2, X, Printer, CloudLightning, Sun, Contrast, Aperture, Wind, 
  MoreHorizontal, Play, Heart, Star, Share2, Mail, Instagram, Facebook, Twitter, Linkedin, Youtube,
  Sticker, Sliders, Monitor, ScanLine, AlignCenter
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
    sharpness: 0
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
      alert("Background removal service unavailable. Please check backend.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSliderChange = (key: keyof typeof adjustments, val: string) => {
    setAdjustments(prev => ({ ...prev, [key]: parseInt(val) }));
  };

  // --- PRINT GENERATION (3mm Margin & 3mm Gap) ---
  const generateSheet = async () => {
    if (!processedImage) return;

    // Standard 300 DPI: 1mm = 11.811 pixels
    const MM_TO_PX = 11.811;
    const marginPx = 3 * MM_TO_PX; // 3mm Margin
    const gapPx = 3 * MM_TO_PX;    // 3mm Gap
    const photoWidthMm = 35;       // Standard Passport Width
    const photoHeightMm = 45;      // Standard Passport Height
    const pw = photoWidthMm * MM_TO_PX;
    const ph = photoHeightMm * MM_TO_PX;

    let canvasWidth, canvasHeight, rows, cols;

    if (printSize === '4x6') {
      canvasWidth = 4 * 300;  // 1200px
      canvasHeight = 6 * 300; // 1800px
      cols = 3;
      rows = 4; // Total 12
    } else {
      // A4: 210mm x 297mm approx 2480x3508 at 300DPI
      canvasWidth = 2480;
      canvasHeight = 3508;
      cols = 5;
      rows = 6; // Total 30
    }

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill Page BG
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = processedImage;
    await new Promise(r => img.onload = r);

    // Draw grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = marginPx + col * (pw + gapPx);
        const y = marginPx + row * (ph + gapPx);

        // Draw Custom Background Color behind image if image has transparency
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, pw, ph);

        // Draw the image
        ctx.drawImage(img, x, y, pw, ph);

        // Draw a light cutting border
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, pw, ph);
      }
    }

    canvas.toBlob((blob) => { 
      if (blob) saveAs(blob, `passport_${printSize}_3mm.png`); 
    }, 'image/png');
  };

  return (
    <div className="v10-studio">
      {/* 1. HEADER */}
      <header className="header">
        <div className="logo">
          <div className="logo-box"><Layers size={20} /></div>
          Passport Photo Maker
        </div>
        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#">Requirements</a>
          <a href="#">Pricing</a>
          <a href="#">A4 Prints (30 Pcs)</a>
        </nav>
        <div className="header-btns">
          <button className="sign-in" onClick={() => setPrintSize(prev => prev === '4x6' ? 'A4' : '4x6')}>
            Switch to {printSize === '4x6' ? 'A4' : '4x6'}
          </button>
          <button className="sign-in" style={{background:'#059669'}}>Login</button>
        </div>
      </header>

      {/* 2. HERO */}
      {!image && (
        <section className="hero">
          <div className="hero-left">
            <h1>Bulk Passport Printing <br/> <span>3mm Margins</span></h1>
            <p>Generate 12 photos on 4x6 or 30 photos on A4 sheet with precise 3mm gaps. Professional grade studio tool.</p>
            <div className="trust-badges">
              <div className="badge"><ShieldCheck size={16} color="#3b82f6"/> 3mm Gaps Enabled</div>
              <div className="badge"><Printer size={16} color="#3b82f6"/> Print Ready</div>
            </div>
          </div>
          <div className="quick-start">
            <div className="quick-head">Upload Subject Photo</div>
            <div className="upload-dashed" onClick={() => fileInputRef.current?.click()}>
              <Upload size={32} color="#3b82f6" />
              <h3>Drop Image Here</h3>
              <p>Supports PNG, JPG, JPEG</p>
              <button className="choose-btn">Select File</button>
            </div>
            <input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" />
          </div>
        </section>
      )}

      {/* 4. EDITOR SECTION */}
      {image && (
        <section className="editor-section">
          <div className="editor-main-card">
            {/* TOOLS */}
            <aside className="sidebar-tools">
              {[
                { id: 'crop', icon: <CropIcon size={18} />, label: 'Crop' },
                { id: 'bg', icon: <Palette size={18} />, label: 'BG Color' },
                { id: 'adjust', icon: <Settings size={18} />, label: 'Adjust' },
                { id: 'print', icon: <Printer size={18} />, label: 'Print' },
              ].map(t => (
                <button key={t.id} className={`tool-btn ${activeTool === t.id ? 'active' : ''}`} onClick={() => setActiveTool(t.id)}>
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </aside>

            {/* TOOL OPTIONS */}
            <aside className="tool-options">
              <h3>{activeTool === 'bg' ? 'Background Color' : 'Editor Options'}</h3>
              
              {activeTool === 'bg' && (
                <div className="option-group">
                  <label>Select Custom Color</label>
                  <div style={{display:'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 15}}>
                    {['#ffffff', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#000000', '#f1f5f9', '#ffeb3b'].map(c => (
                      <div 
                        key={c} 
                        onClick={() => setBgColor(c)}
                        style={{
                          width:35, height:35, background:c, borderRadius:8, cursor:'pointer', 
                          border: bgColor === c ? '3px solid #2563eb' : '1px solid #ddd'
                        }} 
                      />
                    ))}
                  </div>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{width:'100%', marginTop:20}} />
                </div>
              )}

              {activeTool === 'crop' && (
                <div className="option-group">
                   <label>Aspect Ratio</label>
                   <select className="option-select">
                     <option>35mm x 45mm (India)</option>
                     <option>2in x 2in (US)</option>
                   </select>
                   <button className="choose-btn" style={{marginTop:20}} onClick={handleRemoveBackground} disabled={isProcessing}>
                     {isProcessing ? 'Removing...' : 'AI Remove BG'}
                   </button>
                </div>
              )}

              {activeTool === 'print' && (
                <div className="option-group">
                   <label>Paper Size</label>
                   <div className="size-card" style={{borderColor: printSize==='4x6'?'var(--primary)':'#eee'}} onClick={()=>setPrintSize('4x6')}>
                      <h4>4x6 Inch Sheet</h4>
                      <p>12 Photos (3x4 Grid)</p>
                   </div>
                   <div className="size-card" style={{marginTop:10, borderColor: printSize==='A4'?'var(--primary)':'#eee'}} onClick={()=>setPrintSize('A4')}>
                      <h4>A4 Sheet</h4>
                      <p>30 Photos (5x6 Grid)</p>
                   </div>
                   <div style={{marginTop:20, padding:15, background:'#f8fafc', borderRadius:10, fontSize:12}}>
                      <b>Settings:</b><br/>
                      Margin: 3mm<br/>
                      Gap: 3mm
                   </div>
                </div>
              )}
            </aside>

            {/* CANVAS */}
            <main className="canvas-area">
              <div className="canvas-toolbar">
                <div style={{display:'flex', gap:10}}>
                  <button className="option-select" style={{width: 'auto', padding: '6px 15px'}} onClick={() => { setImage(null); setProcessedImage(null); }}><X size={14}/> Reset</button>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:15}}>
                   <button onClick={() => setZoom(z => Math.max(z - 0.1, 1))}>−</button>
                   <span style={{fontWeight:800, fontSize:13}}>{Math.round(zoom * 100)}%</span>
                   <button onClick={() => setZoom(z => Math.min(z + 0.1, 3))}>+</button>
                </div>
                <div style={{display:'flex', gap:10}}>
                  <button className="choose-btn" style={{padding: '8px 25px'}} onClick={generateSheet}><Download size={14}/> Download Print Sheet</button>
                </div>
              </div>
              
              <div className="canvas-view">
                <div className="photo-canvas" style={{ 
                  transform: `scale(${zoom})`, 
                  background: bgColor,
                  width: 350, height: 450,
                  display:'flex', alignItems:'center', justifyCenter:'center'
                }}>
                  {processedImage && (
                    <img src={processedImage} alt="Preview" style={{ 
                      width: '100%', height: '100%', objectFit: 'contain',
                      filter: `brightness(${100 + adjustments.brightness}%) contrast(${100 + adjustments.contrast}%)` 
                    }} />
                  )}
                  {isProcessing && <div style={{position:'absolute', inset:0, background:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', justifyContent:'center'}}>AI Processing...</div>}
                </div>
                <div className="face-badge"><CheckCircle2 size={14}/> Auto-aligned for {printSize} print</div>
              </div>
            </main>

            {/* ADJUSTMENTS */}
            <aside className="adjustments-panel">
              <div className="panel-tabs">
                <button className="panel-tab active">Adjust</button>
              </div>
              
              <div className="adjust-group">
                 {[
                   { id: 'brightness', label: 'Brightness' },
                   { id: 'contrast', label: 'Contrast' },
                   { id: 'saturation', label: 'Saturation' },
                 ].map(item => (
                   <div key={item.id} className="slider-wrap">
                     <div className="slider-head"><span>{item.label}</span><span>{adjustments[item.id as keyof typeof adjustments]}</span></div>
                     <input type="range" min="-50" max="50" value={adjustments[item.id as keyof typeof adjustments]} onChange={(e) => handleSliderChange(item.id as any, e.target.value)} />
                   </div>
                 ))}
              </div>

              <div style={{marginTop:40}}>
                <button className="option-select" style={{marginBottom:10, display:'flex', alignItems:'center', gap:10, fontWeight:700}} onClick={() => setBgColor('#3b82f6')}>
                  <Palette size={16} color="#3b82f6"/> Blue Background
                </button>
                <button className="option-select" style={{marginBottom:10, display:'flex', alignItems:'center', gap:10, fontWeight:700}} onClick={() => setBgColor('#ffffff')}>
                  <Palette size={16} color="#3b82f6"/> White Background
                </button>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* 5. FEATURES STRIP */}
      <section className="features-strip">
        {[
          { icon: <ScanLine />, title: '3mm Margin', desc: 'Paper edge safety' },
          { icon: <Palette />, title: '3mm Gap', desc: 'Easy photo cutting' },
          { icon: <Printer />, title: 'A4 Support', desc: '30 Pcs per sheet' },
          { icon: <Scaling />, title: '4x6 Support', desc: '12 Pcs per sheet' },
          { icon: <ShieldCheck />, title: 'High Res', desc: '300 DPI Quality' },
        ].map((f, i) => (
          <div key={i} className="f-card">
            <div className="f-icon-box">{f.icon}</div>
            <div className="f-info"><h4>{f.title}</h4><p>{f.desc}</p></div>
          </div>
        ))}
      </section>

      {/* 8. FOOTER */}
      <footer className="footer-main">
        <div className="foot-col">
          <div className="logo"><div className="logo-box"><Layers size={20}/></div> Passport Studio Pro</div>
          <p>Professional passport printing tool with precise margins and AI background removal.</p>
        </div>
        <div className="foot-col">
          <h4>Support</h4>
          <div className="foot-links">
            <a href="#">Help Center</a>
            <a href="#">Print Guidelines</a>
          </div>
        </div>
        <div className="foot-col">
          <h4>Paper Sizes</h4>
          <div className="foot-links">
            <a href="#">4x6 Inch (12 Pcs)</a>
            <a href="#">A4 Sheet (30 Pcs)</a>
          </div>
        </div>
        <div className="foot-col">
          <h4>Newsletter</h4>
          <div className="news-box">
            <input type="email" placeholder="Email" />
            <button>Join</button>
          </div>
        </div>
      </footer>
      
      <div style={{background: '#050816', color: '#475569', textAlign:'center', padding:'20px', fontSize:12, borderTop:'1px solid rgba(255,255,255,0.05)'}}>
        © 2024 Passport Studio Pro. Precise Margins & Gaps Enabled.
      </div>
    </div>
  );
}
