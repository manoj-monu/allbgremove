'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { 
  Upload, Download, Image as ImageIcon, Printer, X, Settings, Maximize2, 
  CheckCircle2, Layers, Crop as CropIcon, Palette, ArrowRight, Info,
  RotateCcw, RotateCw, Undo2, Redo2, Scaling, Scissors, Brush, Wand2,
  Type, Smile, Frame, Grid, Ghost, Sun, Zap, HelpCircle, ChevronDown,
  Globe, Search, Star, MessageSquare, ShieldCheck, ZapIcon, Users, CreditCard
} from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Home() {
  // VERSION 7.1 - ULTIMATE STUDIO (FORCE LIVE BUILD)
  // Build Timestamp: 2026-05-09 14:53:00
  console.log('Passport Studio v7.1 - Ultimate Edition (Live Sync)');
  
  const [image, setImage] = useState<string | null>(null);
  const [transparentImage, setTransparentImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  
  const [activeTool, setActiveTool] = useState('crop');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printPreview, setPrintPreview] = useState<string | null>(null);

  // Sliders State
  const [adjustments, setAdjustments] = useState({
    brightness: 0, contrast: 0, saturation: 0, sharpness: 0,
    highlights: 0, shadows: 0, whites: 0, blacks: 0,
    temp: 0, tint: 0, vibrance: 0
  });

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const [pArea, setPArea] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (transparentImage && !showCropper) {
      applyBgAndFilters();
    }
  }, [bgColor, transparentImage, showCropper, adjustments]);

  const applyBgAndFilters = () => {
    if (!transparentImage) return;
    const img = new Image(); img.src = transparentImage; img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); if (!ctx) return;
      canvas.width = img.width; canvas.height = img.height;
      
      // Background
      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Filters
      ctx.filter = `brightness(${100 + adjustments.brightness}%) contrast(${100 + adjustments.contrast}%) saturate(${100 + adjustments.saturation}%)`;
      ctx.drawImage(img, 0, 0);
      setImage(canvas.toDataURL('image/png'));
    };
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file); setImage(url); setTransparentImage(null);
      setIsProcessing(true);
      const formData = new FormData(); formData.append('file', file);
      fetch('https://manojkumarsh-allbgremove-api.hf.space/api/remove-bg', { method: 'POST', body: formData })
        .then(res => res.blob())
        .then(blob => {
          setTransparentImage(URL.createObjectURL(blob)); setShowCropper(true); setIsProcessing(false);
        }).catch(() => setIsProcessing(false));
    }
  };

  const applyCrop = async () => {
    if (!pArea || !transparentImage) return;
    const img = new Image(); img.src = transparentImage; img.crossOrigin = "anonymous";
    await new Promise((resolve) => { img.onload = resolve; });
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); if (!ctx) return;
    canvas.width = pArea.width; canvas.height = pArea.height;
    ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, pArea.x, pArea.y, pArea.width, pArea.height, 0, 0, canvas.width, canvas.height);
    setTransparentImage(canvas.toDataURL('image/png')); setShowCropper(false);
  };

  const generateSheet = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 1800;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const outerPadding = 70;
    const gap = 25;
    const photoPadding = 12;
    const cols = 3;
    const rows = 4;

    const availableWidth = canvas.width - (outerPadding * 2) - (gap * (cols - 1));
    const boxW = availableWidth / cols;
    const availableHeight = canvas.height - (outerPadding * 2) - (gap * (rows - 1));
    const boxH = availableHeight / rows;

    const img = new Image();
    img.src = image;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = outerPadding + c * (boxW + gap);
          const y = outerPadding + r * (boxH + gap);
          ctx.setLineDash([8, 6]);
          ctx.strokeStyle = '#888888';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, boxW, boxH);
          const drawX = x + photoPadding;
          const drawY = y + photoPadding;
          const drawW = boxW - (photoPadding * 2);
          const drawH = boxH - (photoPadding * 2);
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
        }
      }
      ctx.setLineDash([]);
      ctx.fillStyle = '#666666';
      ctx.font = 'bold 36px Arial';
      ctx.save(); ctx.translate(40, canvas.height / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.fillText("PASSPORT SIZE PHOTOS", 0, 0); ctx.restore();
      ctx.save(); ctx.translate(canvas.width - 40, canvas.height / 2); ctx.rotate(Math.PI / 2); ctx.textAlign = 'center'; ctx.fillText("PRINT READY 4x6", 0, 0); ctx.restore();

      setPrintPreview(canvas.toDataURL('image/png'));
      setShowPrintModal(true);
    };
  };

  const handleSliderChange = (key: keyof typeof adjustments, val: string) => {
    setAdjustments(prev => ({ ...prev, [key]: Number(val) }));
  };

  return (
    <div className="ultimate-app minimalist">
      {/* 1. TOP NAVBAR */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-box"><Layers size={22} /></div>
            <span>Passport Studio Pro</span>
          </div>
          <div className="nav-actions">
            <div className="lang-select"><Globe size={16} /> EN <ChevronDown size={14} /></div>
            <button className="sign-in-btn">Sign In</button>
          </div>
        </div>
      </nav>

      {/* 2. MAIN EDITOR (NOW PRIMARY CONTENT) */}
      <section className="editor-section minimalist-view">
        <div className="editor-container">
          
          {/* A. LEFT TOOLS SIDEBAR */}
          <aside className="tool-sidebar">
            {[
              { id: 'crop', icon: <CropIcon size={20} />, label: 'Crop' },
              { id: 'resize', icon: <Scaling size={20} />, label: 'Resize' },
              { id: 'rotate', icon: <RotateCcw size={20} />, label: 'Rotate' },
              { id: 'bg', icon: <Palette size={20} />, label: 'Background' },
              { id: 'adjust', icon: <Settings size={20} />, label: 'Adjust' },
              { id: 'retouch', icon: <Brush size={20} />, label: 'Retouch' },
              { id: 'filters', icon: <Zap size={20} />, label: 'Filters' },
            ].map(t => (
              <button 
                key={t.id} 
                className={`tool-icon-btn ${activeTool === t.id ? 'active' : ''}`}
                onClick={() => setActiveTool(t.id)}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </aside>

          {/* B. TOOL PANEL (CONTEXTUAL) */}
          <div className="tool-panel">
            {activeTool === 'crop' && (
              <>
                <div className="panel-header">Crop & Align</div>
                <div className="panel-group">
                  <label>Aspect Ratio</label>
                  <select className="panel-select">
                    <option>35mm x 45mm (Passport)</option>
                    <option>40mm x 60mm (Visa)</option>
                    <option>2in x 2in (US Passport)</option>
                  </select>
                </div>
                <div className="panel-group">
                  <label>Alignment Tools</label>
                  <div className="align-grid">
                    <button onClick={() => setZoom(z => Math.min(z + 0.1, 3))}><Scaling size={16} /></button>
                    <button><Grid size={16} /></button>
                    <button onClick={() => setZoom(1)}><Maximize2 size={16} /></button>
                    <button onClick={() => setCrop({x:0, y:0})}><RotateCcw size={16} /></button>
                  </div>
                </div>
                <button className="apply-tool-btn" onClick={() => setShowCropper(true)}>Refine Portrait Crop</button>
              </>
            )}

            {activeTool === 'bg' && (
              <>
                <div className="panel-header">Background Color</div>
                <div className="color-swatches-panel">
                  {[
                    { name: 'White', hex: '#ffffff' },
                    { name: 'Sky Blue', hex: '#3b82f6' },
                    { name: 'Royal Blue', hex: '#1e40af' },
                    { name: 'Red', hex: '#ef4444' },
                    { name: 'Grey', hex: '#f1f5f9' },
                    { name: 'Yellow', hex: '#fbbf24' }
                  ].map(c => (
                    <div key={c.hex} className="swatch-item-wrapper">
                      <button 
                        className={`swatch-circle ${bgColor === c.hex ? 'active' : ''}`}
                        style={{ background: c.hex }}
                        onClick={() => setBgColor(c.hex)}
                      />
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
                <div className="panel-group mt-24">
                  <label>Custom Hex Code</label>
                  <div className="hex-input-wrapper">
                    <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="panel-select" />
                    <div className="color-preview" style={{ background: bgColor }}></div>
                  </div>
                </div>
              </>
            )}

            {activeTool !== 'crop' && activeTool !== 'bg' && (
              <div className="empty-tool-state">
                <Info size={32} />
                <h3>{activeTool.charAt(0).toUpperCase() + activeTool.slice(1)} Tool</h3>
                <p>Advanced controls for {activeTool} are active.</p>
                <button className="apply-tool-btn" onClick={() => setActiveTool('crop')}>Back to Crop</button>
              </div>
            )}
          </div>

          {/* C. CENTER CANVAS */}
          <div className="canvas-area">
            <div className="canvas-top-bar">
              <div className="undo-redo">
                <button><Undo2 size={18} /></button>
                <button><Redo2 size={18} /></button>
              </div>
              <div className="zoom-controls">
                <button onClick={() => setZoom(z => Math.max(z - 0.1, 1))}>−</button>
                <span className="zoom-val">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(z + 0.1, 3))}>+</button>
              </div>
              <div className="canvas-actions">
                <button onClick={() => {setZoom(1); setCrop({x:0, y:0})}}><Search size={16} /> Fit</button>
                <button className="canvas-download-btn" onClick={generateSheet}>
                  <Download size={18} /> Download
                </button>
              </div>
            </div>

            <div className="canvas-main">
              {isProcessing && <div className="canvas-loader"><div className="spin"></div> PROCESSING...</div>}
              {image ? (
                <div className="photo-view" style={{ transform: `scale(${zoom}) translate(${crop.x}px, ${crop.y}px)` }}>
                  <img src={image} alt="Target" style={{ 
                    filter: `brightness(${100 + adjustments.brightness}%) contrast(${100 + adjustments.contrast}%) saturate(${100 + adjustments.saturation}%)` 
                  }} />
                  <div className="status-badge"><CheckCircle2 size={12} /> Ready for Export</div>
                </div>
              ) : (
                <div className="canvas-placeholder">
                  <div className="upload-prompt" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={64} color="#2563eb" />
                    <h3>Click to Upload Photo</h3>
                    <p>JPG, PNG supported</p>
                  </div>
                </div>
              )}
            </div>

            <div className="canvas-bottom-strip">
              <div className="thumb-list">
                {image && <div className="thumb active"><img src={image} /></div>}
                <div className="thumb add" onClick={() => fileInputRef.current?.click()}><X size={20} style={{transform: 'rotate(45deg)'}}/> Add</div>
              </div>
            </div>
          </div>

          {/* D. RIGHT ADJUSTMENTS SIDEBAR */}
          <aside className="adjust-sidebar">
            <div className="adjust-tabs">
              <button className="active">Tools</button>
              <button>Presets</button>
            </div>

            <div className="adjust-content">
              <div className="adjust-section">
                <div className="section-head">Adjustments</div>
                {[
                  { id: 'brightness', label: 'Brightness' },
                  { id: 'contrast', label: 'Contrast' },
                  { id: 'saturation', label: 'Saturation' }
                ].map(item => (
                  <div key={item.id} className="slider-box">
                    <div className="slider-label">
                      <span>{item.label}</span>
                      <span>{adjustments[item.id as keyof typeof adjustments]}</span>
                    </div>
                    <input 
                      type="range" 
                      min="-50" max="50" 
                      value={adjustments[item.id as keyof typeof adjustments]} 
                      onChange={(e) => handleSliderChange(item.id as any, e.target.value)} 
                    />
                  </div>
                ))}
              </div>

              <div className="adjust-tools">
                <button className="tool-row" onClick={() => setAdjustments(prev => ({...prev, brightness: 10, contrast: 15}))}>
                  <Wand2 size={16} /> Auto Enhance
                </button>
                <button className="tool-row" onClick={() => setActiveTool('bg')}>
                  <Ghost size={16} /> Change Background
                </button>
                <button className="tool-row" onClick={generateSheet}>
                  <Printer size={16} /> Print Sheet (4x6)
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 3. MINIMAL FOOTER */}
      <footer className="minimal-footer">
        <div className="footer-bottom">
          © 2024 Passport Studio Pro. Powered by AI Backend.
        </div>
      </footer>

      {/* MODALS */}
      {showPrintModal && (
        <div className="print-modal-overlay">
          <div className="print-modal">
            <div className="modal-header">
              <h3>Final Print Sheet (4x6)</h3>
              <X onClick={() => setShowPrintModal(false)} className="close" />
            </div>
            <div className="modal-preview">
              <img src={printPreview!} alt="Print" />
            </div>
            <button className="download-sheet-btn" onClick={() => saveAs(printPreview!, 'Passport_Sheet.png')}>
              Download PNG for Print
            </button>
          </div>
        </div>
      )}

      {showCropper && (
        <div className="crop-modal-overlay">
          <div className="crop-modal">
            <h3>Refine Portrait</h3>
            <div className="cropper-wrapper">
              <Cropper 
                image={transparentImage!} 
                crop={crop} 
                zoom={zoom} 
                aspect={35/45} 
                onCropChange={setCrop} 
                onCropComplete={(a,p)=>setPArea(p)} 
                onZoomChange={setZoom} 
              />
            </div>
            <div className="crop-controls">
              <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e)=>setZoom(Number(e.target.value))} />
              <button onClick={applyCrop}>Apply Crop</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --primary: #2563eb;
          --primary-hover: #1d4ed8;
          --bg-dark: #020617;
          --bg-card: #0f172a;
          --bg-border: #1e293b;
          --text-light: #f8fafc;
          --text-dim: #94a3b8;
        }

        body {
          margin: 0;
          padding: 0;
          background: var(--bg-dark);
          color: var(--text-light);
          font-family: 'Plus Jakarta Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* NAVBAR */
        .top-nav {
          height: 70px;
          border-bottom: 1px solid var(--bg-border);
          display: flex;
          align-items: center;
          background: rgba(2, 6, 23, 0.8);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-container {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          font-size: 20px;
        }

        .logo-box {
          background: var(--primary);
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-links {
          display: flex;
          gap: 32px;
        }

        .nav-links a {
          color: var(--text-dim);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-links a:hover { color: white; }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .lang-select {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: var(--text-dim);
          cursor: pointer;
        }

        .sign-in-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        /* HERO */
        .hero-section {
          padding: 100px 40px;
          background: radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.15) 0%, transparent 70%);
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 80px;
          align-items: center;
        }

        .hero-text h1 {
          font-size: 64px;
          line-height: 1.1;
          margin-bottom: 24px;
          font-weight: 800;
        }

        .hero-text h1 span { color: var(--primary); }

        .hero-text p {
          font-size: 18px;
          color: var(--text-dim);
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .trust-badges {
          display: flex;
          gap: 24px;
          margin-bottom: 60px;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          color: var(--text-dim);
          border: 1px solid var(--bg-border);
        }

        .trusted-by {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-avatars { display: flex; margin-left: 10px; }
        .avatar { width: 32px; height: 32px; background: #444; border-radius: 50%; border: 2px solid var(--bg-dark); margin-left: -10px; }

        .rating span { font-size: 13px; color: var(--text-dim); margin-left: 10px; }
        .stars { color: #facc15; font-size: 18px; display: inline-block; }

        .quick-start-card {
          background: var(--bg-card);
          border: 1px solid var(--bg-border);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .quick-header { font-weight: 700; margin-bottom: 24px; font-size: 18px; }

        .upload-box {
          background: rgba(37, 99, 235, 0.05);
          border: 2px dashed var(--primary);
          border-radius: 20px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-box:hover { background: rgba(37, 99, 235, 0.1); }

        .upload-icon-circle {
          width: 60px; height: 60px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
        }

        .upload-info h3 { margin: 0 0 8px; font-size: 18px; }
        .upload-info p { margin: 0 0 24px; font-size: 14px; color: var(--text-dim); }

        .choose-btn {
          width: 100%; padding: 12px; background: var(--primary); border: none; border-radius: 12px; color: white; font-weight: 700; cursor: pointer;
        }

        .editor-section { padding: 40px; background: #000; }
        .editor-container {
          max-width: 1440px; margin: 0 auto; background: var(--bg-card); border-radius: 32px; border: 1px solid var(--bg-border);
          display: grid; grid-template-columns: 80px 300px 1fr 320px; min-height: 850px; max-height: 95vh; overflow: hidden;
        }

        .minimalist-view { display: flex; align-items: center; justify-content: center; padding: 60px 20px; min-height: calc(100vh - 140px); }
        .minimalist .editor-container { box-shadow: 0 50px 100px rgba(0,0,0,0.5); }
        
        .minimal-footer { padding: 40px; border-top: 1px solid var(--bg-border); background: #020617; text-align: center; color: var(--text-dim); font-size: 14px; }

        .tool-sidebar { background: #020617; border-right: 1px solid var(--bg-border); padding: 20px 0; display: flex; flex-direction: column; align-items: center; gap: 20px; overflow-y: auto; }
        .tool-icon-btn {
          background: none; border: none; color: var(--text-dim); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; width: 100%; transition: 0.2s;
        }
        .tool-icon-btn span { font-size: 10px; font-weight: 600; }
        .tool-icon-btn:hover, .tool-icon-btn.active { color: var(--primary); }

        .tool-panel { border-right: 1px solid var(--bg-border); padding: 24px; overflow-y: auto; }
        .panel-header { font-weight: 700; font-size: 18px; margin-bottom: 32px; }
        .panel-group { margin-bottom: 24px; }
        .panel-group label { display: block; font-size: 13px; font-weight: 600; color: var(--text-dim); margin-bottom: 12px; }
        .panel-select { width: 100%; background: #1e293b; border: 1px solid #334155; color: white; padding: 10px; border-radius: 8px; font-size: 14px; margin-bottom: 8px; }
        .panel-desc { font-size: 13px; color: var(--text-dim); margin: -20px 0 24px; line-height: 1.4; }

        .color-swatches-panel { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .swatch-item-wrapper { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .swatch-item-wrapper span { font-size: 10px; color: var(--text-dim); font-weight: 600; }
        .swatch-circle { width: 48px; height: 48px; border-radius: 50%; border: 2px solid #334155; cursor: pointer; transition: 0.2s; position: relative; }
        .swatch-circle.active { border-color: var(--primary); transform: scale(1.1); box-shadow: 0 0 15px rgba(37, 99, 235, 0.4); }
        .swatch-circle.active::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; text-shadow: 0 1px 4px rgba(0,0,0,0.5); }

        .hex-input-wrapper { display: flex; gap: 12px; align-items: center; }
        .color-preview { width: 40px; height: 40px; border-radius: 8px; border: 1px solid #334155; flex-shrink: 0; }

        .apply-tool-btn { width: 100%; margin-top: 24px; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .apply-tool-btn:hover { background: var(--primary-hover); transform: translateY(-2px); }

        .empty-tool-state { text-align: center; padding: 40px 0; color: var(--text-dim); }
        .empty-tool-state h3 { color: white; margin: 16px 0 8px; font-size: 16px; }
        .empty-tool-state p { font-size: 13px; margin-bottom: 24px; line-height: 1.5; }

        .mt-24 { margin-top: 24px; }
        .align-grid button { aspect-ratio: 1; background: #1e293b; border: 1px solid #334155; color: white; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        .panel-toggle { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .panel-toggle label { font-size: 14px; font-weight: 600; }
        .toggle-switch { width: 44px; height: 24px; background: #334155; border-radius: 12px; position: relative; cursor: pointer; }
        .toggle-switch::after { content: ''; position: absolute; left: 4px; top: 4px; width: 16px; height: 16px; background: white; border-radius: 50%; transition: 0.2s; }
        .toggle-switch.active { background: var(--primary); }
        .toggle-switch.active::after { left: 24px; }

        .quick-sizes label { display: block; margin-bottom: 16px; font-size: 14px; font-weight: 700; }
        .size-card { background: #1e293b; border: 1px solid #334155; padding: 16px; border-radius: 12px; margin-bottom: 12px; display: flex; align-items: center; gap: 16px; cursor: pointer; transition: 0.2s; }
        .size-card.active { border-color: var(--primary); background: rgba(37, 99, 235, 0.1); }
        .size-info b { display: block; font-size: 14px; margin-bottom: 2px; }
        .size-info span { font-size: 12px; color: var(--text-dim); }

        .canvas-area { background: #0a0f1d; display: flex; flex-direction: column; }
        .canvas-top-bar { height: 60px; border-bottom: 1px solid var(--bg-border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
        .undo-redo { display: flex; gap: 16px; }
        .undo-redo button { background: none; border: none; color: var(--text-dim); cursor: pointer; }
        .zoom-controls { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 600; }
        .zoom-controls button { width: 28px; height: 28px; background: #1e293b; border: none; color: white; border-radius: 4px; cursor: pointer; }
        .canvas-actions { display: flex; gap: 12px; }
        .canvas-actions button { background: none; border: none; color: var(--text-dim); cursor: pointer; font-weight: 600; font-size: 13px; }
        .canvas-download-btn { background: var(--primary) !important; color: white !important; padding: 8px 16px; border-radius: 8px !important; display: flex; align-items: center; gap: 8px; }

        .canvas-main { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; padding: 40px; }
        .photo-view { position: relative; box-shadow: 0 0 100px rgba(0,0,0,0.5); }
        .photo-view img { max-height: 600px; max-width: 100%; border: 1px solid #333; }
        .status-badge { position: absolute; bottom: -50px; left: 50%; transform: translateX(-50%); background: #ecfdf5; color: #059669; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; white-space: nowrap; }

        .canvas-bottom-strip { height: 100px; border-top: 1px solid var(--bg-border); display: flex; align-items: center; padding: 0 24px; }
        .thumb-list { display: flex; gap: 12px; }
        .thumb { width: 60px; height: 60px; border-radius: 8px; border: 2px solid #333; overflow: hidden; cursor: pointer; }
        .thumb.active { border-color: var(--primary); }
        .thumb img { width: 100%; height: 100%; object-fit: cover; }
        .thumb.add { display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 10px; color: var(--text-dim); border-style: dashed; }

        .adjust-sidebar { border-left: 1px solid var(--bg-border); background: #020617; display: flex; flex-direction: column; overflow: hidden; }
        .adjust-tabs { display: flex; border-bottom: 1px solid var(--bg-border); flex-shrink: 0; }
        .adjust-tabs button { flex: 1; padding: 16px; background: none; border: none; color: var(--text-dim); font-weight: 600; cursor: pointer; }
        .adjust-tabs button.active { color: var(--primary); border-bottom: 2px solid var(--primary); }
        .adjust-content { padding: 24px; overflow-y: auto; flex: 1; padding-bottom: 100px; }
        .adjust-section { margin-bottom: 32px; }
        .section-head { font-weight: 700; display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
        .slider-box { margin-bottom: 16px; }
        .slider-label { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-dim); margin-bottom: 8px; }
        input[type=range] { width: 100%; accent-color: var(--primary); }

        .adjust-tools label { display: block; font-weight: 700; margin-bottom: 16px; font-size: 14px; }
        .tool-row { width: 100%; padding: 12px; background: #1e293b; border: 1px solid #334155; color: white; border-radius: 12px; margin-bottom: 8px; text-align: left; display: flex; align-items: center; gap: 12px; font-size: 14px; cursor: pointer; }

        /* FEATURES */
        .features-section { padding: 80px 40px; background: var(--bg-dark); }
        .features-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; }
        .feature-item { background: var(--bg-card); border: 1px solid var(--bg-border); padding: 24px; border-radius: 20px; text-align: center; }
        .f-icon { background: var(--primary); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .f-text h3 { font-size: 15px; margin-bottom: 8px; }
        .f-text p { font-size: 12px; color: var(--text-dim); line-height: 1.4; }

        /* SIZES SECTION */
        .sizes-section { padding: 80px 40px; background: #000; border-top: 1px solid var(--bg-border); }
        .sizes-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.5fr 1fr; gap: 60px; }
        .country-list { margin-top: 24px; border: 1px solid var(--bg-border); border-radius: 16px; overflow: hidden; }
        .country-row { padding: 16px; display: flex; justify-content: space-between; border-bottom: 1px solid var(--bg-border); font-size: 14px; }
        .country-row.active { background: rgba(37, 99, 235, 0.1); color: var(--primary); }
        .view-all-btn { width: 100%; padding: 16px; background: none; border: none; color: var(--primary); font-weight: 700; cursor: pointer; }

        .sizes-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; }
        .sizes-header a { font-size: 14px; color: var(--primary); text-decoration: none; }
        .sizes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .size-box { background: var(--bg-card); border: 1px solid var(--bg-border); padding: 20px; border-radius: 16px; }
        .size-box h3 { font-size: 18px; margin-bottom: 4px; }
        .size-box p { color: var(--text-dim); font-size: 13px; }

        .testimonial-item { background: var(--bg-card); border: 1px solid var(--bg-border); padding: 20px; border-radius: 16px; margin-bottom: 16px; }
        .t-head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .t-avatar { width: 40px; height: 40px; background: #444; border-radius: 50%; }
        .t-info { flex: 1; }
        .t-info b { display: block; font-size: 14px; }
        .t-info span { font-size: 12px; color: var(--text-dim); }
        .t-stars { color: #facc15; font-size: 12px; }
        .testimonial-item p { font-size: 13px; line-height: 1.5; color: var(--text-dim); }

        /* FOOTER CTA */
        .footer-cta { padding: 60px 40px; background: var(--bg-dark); }
        .cta-content { max-width: 1200px; margin: 0 auto; background: var(--primary); border-radius: 32px; padding: 40px 60px; display: flex; align-items: center; gap: 40px; }
        .cta-icon { background: rgba(255,255,255,0.2); width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .cta-text { flex: 1; }
        .cta-text h2 { font-size: 28px; margin-bottom: 8px; }
        .cta-text p { font-size: 16px; opacity: 0.9; }
        .get-started-btn { background: white; color: var(--primary); border: none; padding: 16px 32px; border-radius: 16px; font-weight: 800; font-size: 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; }

        /* FOOTER */
        .main-footer { padding: 80px 40px 40px; border-top: 1px solid var(--bg-border); }
        .footer-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.5fr; gap: 60px; margin-bottom: 60px; }
        .footer-brand p { margin: 24px 0; color: var(--text-dim); line-height: 1.6; font-size: 14px; }
        .social-links { display: flex; gap: 16px; }
        .footer-links h3, .footer-news h3 { font-size: 18px; margin-bottom: 24px; }
        .footer-links a { display: block; color: var(--text-dim); text-decoration: none; margin-bottom: 12px; font-size: 14px; transition: 0.2s; }
        .footer-links a:hover { color: white; }
        .footer-news p { color: var(--text-dim); font-size: 14px; margin-bottom: 20px; }
        .news-input { display: flex; background: #1e293b; border-radius: 8px; padding: 4px; }
        .news-input input { flex: 1; background: none; border: none; color: white; padding: 10px; font-size: 14px; outline: none; }
        .news-input button { background: var(--primary); color: white; border: none; padding: 0 20px; border-radius: 6px; font-weight: 700; cursor: pointer; }
        .footer-bottom { border-top: 1px solid var(--bg-border); padding-top: 40px; text-align: center; color: var(--text-dim); font-size: 14px; max-width: 1200px; margin: 0 auto; }

        /* MODALS */
        .print-modal-overlay, .crop-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .print-modal { background: #fff; color: #000; padding: 32px; border-radius: 24px; max-width: 900px; width: 100%; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-header .close { cursor: pointer; color: #666; }
        .modal-preview { background: #333; padding: 40px; border-radius: 16px; margin-bottom: 24px; display: flex; justify-content: center; }
        .modal-preview img { max-width: 100%; border: 4px solid white; box-shadow: 0 0 40px rgba(0,0,0,0.5); }
        .download-sheet-btn { width: 100%; padding: 18px; background: #10b981; color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 18px; cursor: pointer; }

        .crop-modal { background: #fff; color: #000; padding: 32px; border-radius: 24px; width: 500px; }
        .cropper-wrapper { height: 400px; position: relative; background: #000; border-radius: 12px; overflow: hidden; margin: 20px 0; }
        .crop-controls { display: flex; flex-direction: column; gap: 16px; }
        .crop-controls button { padding: 14px; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }

        /* LOADER */
        .canvas-loader { position: absolute; inset: 0; background: rgba(0,0,0,0.8); z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; font-weight: 800; color: var(--primary); }
        .spin { width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        @media (max-width: 1200px) {
          .hero-content { grid-template-columns: 1fr; text-align: center; }
          .trust-badges { justify-content: center; }
          .trusted-by { justify-content: center; }
          .editor-container { grid-template-columns: 80px 1fr; height: auto; }
          .tool-panel, .adjust-sidebar { display: none; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .sizes-container { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
