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
    blacks: 0,
    temperature: 0,
    tint: 0,
    vibrance: 0
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
      }
    }
    canvas.toBlob((blob) => { if (blob) saveAs(blob, 'passport_studio.png'); });
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
          <a href="#">Photo Requirements</a>
          <a href="#">Guidelines</a>
          <a href="#">Pricing</a>
          <a href="#">Blog</a>
        </nav>
        <div className="header-btns">
          <button className="lang-btn"><Globe size={16} /> EN <ChevronDown size={14} /></button>
          <button className="sign-in">Sign In</button>
        </div>
      </header>

      {/* 2. HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1>Create Perfect <br/> Passport Photos <span>Instantly</span></h1>
          <p>Professional passport photos that meet official requirements. <br/> 100% compliant with government standards.</p>
          <div className="trust-badges">
            <div className="badge"><ShieldCheck size={16} color="#3b82f6"/> 100% Compliant</div>
            <div className="badge"><ImageIcon size={16} color="#3b82f6"/> High Quality</div>
            <div className="badge"><Download size={16} color="#3b82f6"/> Instant Download</div>
          </div>
        </div>
        <div className="quick-start">
          <div className="quick-head">Quick Start</div>
          <div className="upload-dashed" onClick={() => fileInputRef.current?.click()}>
            <Upload size={32} color="#3b82f6" />
            <h3>Upload Your Photo</h3>
            <p>JPG, JPEG or PNG. Max size 10MB</p>
            <button className="choose-btn">Choose Photo</button>
          </div>
          <input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" />
        </div>
      </section>

      {/* 3. SOCIAL PROOF */}
      <section className="social-proof">
        <div className="trusted-text">Trusted by 1M+ users worldwide</div>
        <div className="stars">★★★★★</div>
        <div className="user-count">4.9/5 (12,540 reviews)</div>
      </section>

      {/* 4. EDITOR SECTION */}
      <section className="editor-section">
        <div className="editor-main-card">
          {/* TOOLS */}
          <aside className="sidebar-tools">
            {[
              { id: 'crop', icon: <CropIcon size={18} />, label: 'Crop' },
              { id: 'resize', icon: <Scaling size={18} />, label: 'Resize' },
              { id: 'rotate', icon: <RotateCcw size={18} />, label: 'Rotate' },
              { id: 'bg', icon: <Palette size={18} />, label: 'Background' },
              { id: 'adjust', icon: <Settings size={18} />, label: 'Adjustments' },
              { id: 'retouch', icon: <Brush size={18} />, label: 'Retouch' },
              { id: 'filters', icon: <Zap size={18} />, label: 'Filters' },
              { id: 'stickers', icon: <Sticker size={18} />, label: 'Stickers' },
              { id: 'frames', icon: <Frame size={18} />, label: 'Frames' },
              { id: 'overlays', icon: <Layers size={18} />, label: 'Overlays' },
              { id: 'blur', icon: <Wind size={18} />, label: 'Blur' },
              { id: 'curves', icon: <Sliders size={18} />, label: 'Curves' },
            ].map(t => (
              <button key={t.id} className={`tool-btn ${activeTool === t.id ? 'active' : ''}`} onClick={() => setActiveTool(t.id)}>
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </aside>

          {/* TOOL OPTIONS */}
          <aside className="tool-options">
            <h3>Crop & Align</h3>
            <div className="option-group">
              <label>Aspect Ratio</label>
              <select className="option-select">
                <option>35mm x 45mm (Passport)</option>
                <option>40mm x 60mm (Visa)</option>
                <option>2in x 2in (US Passport)</option>
              </select>
            </div>
            <div className="option-group">
              <label>Alignment Tools</label>
              <div style={{display:'flex', gap:8}}>
                <button className="option-select" style={{padding:8}}><Maximize2 size={14}/></button>
                <button className="option-select" style={{padding:8}}><Grid size={14}/></button>
                <button className="option-select" style={{padding:8}}><AlignCenter size={14}/></button>
              </div>
            </div>
            <div className="option-group" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
               <label style={{margin:0}}>Auto Crop</label>
               <input type="checkbox" defaultChecked />
            </div>
            <div className="option-group" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
               <label style={{margin:0}}>Show Grid</label>
               <input type="checkbox" defaultChecked />
            </div>
            <div className="option-group">
               <label>Quick Sizes</label>
               <div className="size-card" style={{borderColor: 'var(--primary)', background: '#f0f7ff', marginBottom: 10}}>
                  <h4>35mm x 45mm</h4>
                  <p>Passport</p>
               </div>
               <div className="size-card">
                  <h4>40mm x 60mm</h4>
                  <p>Visa</p>
               </div>
            </div>
          </aside>

          {/* CANVAS */}
          <main className="canvas-area">
            <div className="canvas-toolbar">
              <div style={{display:'flex', gap:10}}>
                <button className="option-select" style={{width: 'auto', padding: '6px 15px'}}><Undo2 size={14}/> Undo</button>
                <button className="option-select" style={{width: 'auto', padding: '6px 15px'}}><Redo2 size={14}/> Redo</button>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:15}}>
                 <button onClick={() => setZoom(z => Math.max(z - 0.1, 1))}>−</button>
                 <span style={{fontWeight:800, fontSize:13}}>{Math.round(zoom * 100)}%</span>
                 <button onClick={() => setZoom(z => Math.min(z + 0.1, 3))}>+</button>
              </div>
              <div style={{display:'flex', gap:10}}>
                <button className="option-select" style={{width: 'auto', padding: '6px 15px'}}><Search size={14}/> Fit</button>
                <button className="choose-btn" style={{padding: '8px 25px'}} onClick={generateSheet}><Download size={14}/> Download</button>
              </div>
            </div>
            
            <div className="canvas-view">
              <div className="photo-canvas" style={{ transform: `scale(${zoom}) translate(${crop.x}px, ${crop.y}px)` }}>
                {image ? (
                  <img src={image} alt="Target" style={{ 
                    maxHeight: '500px',
                    filter: `brightness(${100 + adjustments.brightness}%) contrast(${100 + adjustments.contrast}%) saturate(${100 + adjustments.saturation}%)` 
                  }} />
                ) : (
                  <div style={{padding:100, textAlign:'center', color: '#cbd5e1'}}>
                    <ImageIcon size={64} />
                    <p>No Image Uploaded</p>
                  </div>
                )}
                {image && <div style={{position:'absolute', inset:0, border: '1px solid rgba(37,99,235,0.3)', pointerEvents:'none'}}></div>}
              </div>
              {image && <div className="face-badge"><CheckCircle2 size={14}/> Face detected and perfectly aligned</div>}
            </div>

            <div style={{marginTop: 30, display:'flex', gap:12, overflowX:'auto', paddingBottom:10}}>
               {image && [1,2,3,4,5].map(i => (
                 <div key={i} style={{minWidth:80, height:100, borderRadius:12, overflow:'hidden', border: i===1 ? '3px solid var(--primary)' : '1px solid var(--border)'}}>
                   <img src={image} style={{width:'100%', height:'100%', objectCover:'cover'}} />
                 </div>
               ))}
               <div style={{minWidth:80, height:100, borderRadius:12, border: '2px dashed var(--border)', display:'flex', alignItems:'center', justifyCenter:'center', cursor:'pointer'}} onClick={() => fileInputRef.current?.click()}>
                  <X size={20} style={{transform: 'rotate(45deg)', color: '#cbd5e1'}}/>
               </div>
            </div>
          </main>

          {/* ADJUSTMENTS */}
          <aside className="adjustments-panel">
            <div className="panel-tabs">
              <button className="panel-tab active">Adjustments</button>
              <button className="panel-tab">Presets</button>
            </div>
            
            <div className="adjust-group">
               <h4 style={{fontSize:13, marginBottom:20, display:'flex', justifyContent:'space-between'}}>Basic Adjustments <ChevronDown size={14}/></h4>
               {[
                 { id: 'brightness', label: 'Brightness' },
                 { id: 'contrast', label: 'Contrast' },
                 { id: 'saturation', label: 'Saturation' },
                 { id: 'sharpness', label: 'Sharpness' }
               ].map(item => (
                 <div key={item.id} className="slider-wrap">
                   <div className="slider-head"><span>{item.label}</span><span>{adjustments[item.id as keyof typeof adjustments]}</span></div>
                   <input type="range" min="-50" max="50" value={adjustments[item.id as keyof typeof adjustments]} onChange={(e) => handleSliderChange(item.id as any, e.target.value)} />
                 </div>
               ))}
            </div>

            <div className="adjust-group">
               <h4 style={{fontSize:13, marginBottom:20, display:'flex', justifyContent:'space-between'}}>Advanced Adjustments <ChevronDown size={14}/></h4>
               {[
                 { id: 'highlights', label: 'Highlights' },
                 { id: 'shadows', label: 'Shadows' },
                 { id: 'whites', label: 'Whites' },
                 { id: 'blacks', label: 'Blacks' }
               ].map(item => (
                 <div key={item.id} className="slider-wrap">
                   <div className="slider-head"><span>{item.label}</span><span>{adjustments[item.id as keyof typeof adjustments]}</span></div>
                   <input type="range" min="-50" max="50" value={adjustments[item.id as keyof typeof adjustments]} onChange={(e) => handleSliderChange(item.id as any, e.target.value)} />
                 </div>
               ))}
            </div>

            <div style={{marginTop:40}}>
              <button className="option-select" style={{marginBottom:10, display:'flex', alignItems:'center', gap:10, fontWeight:700}} onClick={() => setAdjustments(prev => ({...prev, brightness: 10, contrast: 15}))}>
                <Wand2 size={16} color="#3b82f6"/> Auto Enhance
              </button>
              <button className="option-select" style={{marginBottom:10, display:'flex', alignItems:'center', gap:10, fontWeight:700}} onClick={() => setActiveTool('bg')}>
                <Ghost size={16} color="#3b82f6"/> Remove Background
              </button>
              <button className="option-select" style={{marginBottom:10, display:'flex', alignItems:'center', gap:10, fontWeight:700}}>
                <Smile size={16} color="#3b82f6"/> Retouch Face
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* 5. FEATURES STRIP */}
      <section className="features-strip">
        {[
          { icon: <ScanLine />, title: 'AI Face Detection', desc: 'Auto alignment' },
          { icon: <Palette />, title: 'BG Removal', desc: 'Remove bg easily' },
          { icon: <Zap />, title: 'Smart Enhance', desc: 'Auto quality fix' },
          { icon: <Layers />, title: 'Batch Process', desc: 'Process many' },
          { icon: <ShieldCheck />, title: '100% Secure', desc: 'Private data' },
        ].map((f, i) => (
          <div key={i} className="f-card">
            <div className="f-icon-box">{f.icon}</div>
            <div className="f-info"><h4>{f.title}</h4><p>{f.desc}</p></div>
          </div>
        ))}
      </section>

      {/* 6. DATA GRID */}
      <section className="data-grid">
        <div className="grid-col">
          <h3>Popular Countries</h3>
          <div className="list-row"><span>🇺🇸 United States</span><span>2in x 2in</span></div>
          <div className="list-row active"><span>🇮🇳 India</span><span>35mm x 45mm</span></div>
          <div className="list-row"><span>🇬🇧 United Kingdom</span><span>35mm x 45mm</span></div>
          <div className="list-row"><span>🇨🇦 Canada</span><span>50mm x 70mm</span></div>
          <div className="list-row"><span>🇦🇺 Australia</span><span>35mm x 45mm</span></div>
          <button className="option-select" style={{marginTop:20, color: 'var(--primary)', fontWeight:800}}>View All Countries</button>
        </div>
        <div className="grid-col">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:30}}>
            <h3 style={{margin:0}}>Popular Sizes</h3>
            <a href="#" style={{fontSize:13, fontWeight:700, color: 'var(--primary)'}}>View All Sizes</a>
          </div>
          <div className="size-card-grid">
             <div className="size-card"><h4>35mm x 45mm</h4><p>Passport</p></div>
             <div className="size-card"><h4>40mm x 60mm</h4><p>Visa</p></div>
             <div className="size-card"><h4>50mm x 50mm</h4><p>ID Card</p></div>
             <div className="size-card"><h4>2in x 2in</h4><p>US Passport</p></div>
             <div className="size-card"><h4>33mm x 48mm</h4><p>Driving License</p></div>
             <div className="size-card"><h4>26mm x 32mm</h4><p>Student ID</p></div>
          </div>
        </div>
        <div className="grid-col">
          <h3>What Our Users Say</h3>
          {[
            { name: 'Priya Sharma', text: 'Best passport photo maker! Very easy to use and got perfect results.' },
            { name: 'Rahul Verma', text: 'Great tool with all the features like Photoshop. Highly recommended!' },
          ].map((t, i) => (
            <div key={i} className="testimonial">
              <div className="t-user">
                <div className="t-avatar"></div>
                <div className="t-info"><b>{t.name}</b><span>2 days ago</span></div>
                <div style={{marginLeft:'auto', color:'#fbbf24', fontSize:10}}>★★★★★</div>
              </div>
              <p className="t-text">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOOTER CTA */}
      <section className="footer-cta">
        <h2>Ready to Create Your Perfect Passport Photo?</h2>
        <p>Join millions of satisfied users who trust our passport photo maker.</p>
        <button className="cta-btn">Get Started Now <ArrowRight size={18} style={{verticalAlign:'middle', marginLeft:10}}/></button>
      </section>

      {/* 8. FOOTER */}
      <footer className="footer-main">
        <div className="foot-col">
          <div className="logo"><div className="logo-box"><Layers size={20}/></div> Passport Photo Maker</div>
          <p>Create professional passport photos online quickly and easily. 100% compliant with official requirements.</p>
        </div>
        <div className="foot-col">
          <h4>Quick Links</h4>
          <div className="foot-links">
            <a href="#">Home</a>
            <a href="#">Photo Requirements</a>
            <a href="#">Guidelines</a>
            <a href="#">Pricing</a>
            <a href="#">Blog</a>
          </div>
        </div>
        <div className="foot-col">
          <h4>Support</h4>
          <div className="foot-links">
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div className="foot-col">
          <h4>Newsletter</h4>
          <p>Subscribe to get tips and updates.</p>
          <div className="news-box">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </footer>
      
      <div style={{background: '#050816', color: '#475569', textAlign:'center', padding:'20px', fontSize:12, borderTop:'1px solid rgba(255,255,255,0.05)'}}>
        © 2024 Passport Photo Maker. All rights reserved.
      </div>
    </div>
  );
}
