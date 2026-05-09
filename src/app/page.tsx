'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { 
  Upload, 
  Download, 
  Image as ImageIcon, 
  Printer, 
  X, 
  Settings,
  Maximize2,
  CheckCircle2,
  Layers,
  Crop as CropIcon,
  Palette,
  ArrowRight,
  Info
} from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Home() {
  // VERSION 6.0 - STUDIO LAB EDITION (COMPACT & PROFESSIONAL)
  console.log('Passport Studio v6.0 - Studio Lab Active');
  const [image, setImage] = useState<string | null>(null);
  const [transparentImage, setTransparentImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  
  const [printPreview, setPrintPreview] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const [pArea, setPArea] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (transparentImage && !showCropper) {
      const img = new Image(); img.src = transparentImage; img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); if (!ctx) return;
        canvas.width = img.width; canvas.height = img.height;
        ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setImage(canvas.toDataURL('image/png'));
      };
    }
  }, [bgColor, transparentImage, showCropper]);

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

  return (
    <div className="studio-root">
      {/* PROFESSIONAL SLIM HEADER */}
      <header className="studio-header">
        <div className="header-left">
          <div className="app-logo"><Layers size={20} /></div>
          <span className="app-name">PASSPORT <b>STUDIO</b> <small>v6.0</small></span>
        </div>
        <div className="header-right">
          <div className="ai-badge">
            <div className="pulse-dot"></div>
            AI ENGINE ACTIVE
          </div>
        </div>
      </header>

      <main className="studio-main">
        {/* COMPACT CONTROL PANEL */}
        <aside className="studio-panel">
          <div className="panel-section">
            <label className="section-label">1. SOURCE</label>
            <div className="control-group">
              <button className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                <Upload size={16} />
                <span>Upload New Photo</span>
              </button>
              <input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" />
            </div>
          </div>

          <div className="panel-section">
            <label className="section-label">2. CUSTOMIZE</label>
            <div className="control-group">
              <div className="sub-label">Background Color</div>
              <div className="swatch-grid">
                {[
                  { name: 'White', hex: '#ffffff' },
                  { name: 'Sky', hex: '#3b82f6' },
                  { name: 'Red', hex: '#ef4444' },
                  { name: 'Green', hex: '#10b981' },
                  { name: 'Pila', hex: '#fbbf24' },
                  { name: 'Black', hex: '#000000' }
                ].map(c => (
                  <button 
                    key={c.hex} 
                    className={`swatch-btn ${bgColor === c.hex ? 'active' : ''}`}
                    style={{ background: c.hex }}
                    onClick={() => setBgColor(c.hex)}
                  />
                ))}
              </div>
            </div>
            <div className="control-group mt-15">
              <button className="tool-btn" onClick={() => setShowCropper(true)} disabled={!image}>
                <CropIcon size={14} /> Refine Crop
              </button>
            </div>
          </div>

          <div className="panel-section last">
            <label className="section-label">3. EXPORT</label>
            <div className="control-group">
              <button 
                className="export-btn" 
                disabled={!image} 
                onClick={generateSheet}
              >
                Generate 4x6 Sheet <ArrowRight size={16} />
              </button>
            </div>
            <div className="info-tag">
              <Info size={12} />
              Outputs 12 photos (3x4)
            </div>
          </div>
        </aside>

        {/* WORKSPACE AREA */}
        <section className="studio-workspace">
          <div className="workspace-inner">
            {isProcessing && (
              <div className="lab-overlay">
                <div className="lab-spinner"></div>
                <span>PROCESSING ASSET...</span>
              </div>
            )}
            
            <div className="canvas-wrapper">
              {image ? (
                <div className="preview-container">
                  <div className="preview-label">Live Preview</div>
                  <img src={image} alt="Studio Preview" className="studio-img" />
                </div>
              ) : (
                <div className="studio-empty">
                  <ImageIcon size={48} />
                  <h3>Studio Workspace</h3>
                  <p>Start by uploading a high-quality portrait</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* COMPACT MODALS */}
      {showPrintModal && (
        <div className="studio-modal-overlay">
          <div className="studio-modal">
            <div className="modal-top">
              <h3>Ready for Print</h3>
              <button className="close-icon" onClick={() => setShowPrintModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-content">
              <div className="sheet-view">
                <img src={printPreview!} alt="Final Lab Sheet" />
              </div>
            </div>
            <div className="modal-bottom">
              <button className="lab-download-btn" onClick={() => saveAs(printPreview!, 'Passport_Lab_Sheet.png')}>
                Download 4x6 Sheet (300 DPI)
              </button>
            </div>
          </div>
        </div>
      )}

      {showCropper && (
        <div className="studio-modal-overlay">
          <div className="studio-modal compact">
            <div className="modal-top">
              <h3>Adjust Portrait</h3>
              <button className="close-icon" onClick={() => setShowCropper(false)}><X size={20} /></button>
            </div>
            <div className="modal-content">
              <div className="lab-cropper-box">
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
              <div className="lab-zoom-panel">
                <span>Zoom</span>
                <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} />
              </div>
            </div>
            <div className="modal-bottom">
              <button className="confirm-btn" onClick={applyCrop}>Apply Adjustments</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap');

        :root {
          --studio-bg: #f8fafc;
          --studio-sidebar: #ffffff;
          --studio-border: #e2e8f0;
          --studio-primary: #2563eb;
          --studio-text: #0f172a;
          --studio-text-muted: #64748b;
          --studio-accent: #10b981;
        }

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background-color: var(--studio-bg);
          color: var(--studio-text);
          overflow: hidden;
        }

        .studio-root {
          height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* HEADER */
        .studio-header {
          height: 48px;
          background: #ffffff;
          border-bottom: 1px solid var(--studio-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .app-logo {
          background: var(--studio-primary);
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .app-name {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: -0.2px;
        }

        .app-name b {
          font-weight: 700;
          color: var(--studio-primary);
        }

        .app-name small {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          background: #f1f5f9;
          padding: 2px 4px;
          border-radius: 4px;
          margin-left: 4px;
          color: var(--studio-text-muted);
        }

        .ai-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          color: var(--studio-accent);
          background: #f0fdf4;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #dcfce7;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          background: var(--studio-accent);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        /* MAIN LAYOUT */
        .studio-main {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        /* SIDE PANEL */
        .studio-panel {
          width: 280px;
          background: var(--studio-sidebar);
          border-right: 1px solid var(--studio-border);
          display: flex;
          flex-direction: column;
          padding: 20px;
        }

        .panel-section {
          margin-bottom: 24px;
        }

        .section-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--studio-text-muted);
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .upload-zone {
          width: 100%;
          padding: 12px;
          background: #f1f5f9;
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
          color: var(--studio-text);
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-zone:hover {
          background: #e2e8f0;
          border-color: var(--studio-primary);
        }

        .sub-label {
          font-size: 12px;
          font-weight: 500;
          color: var(--studio-text-muted);
          margin-bottom: 8px;
        }

        .swatch-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 6px;
        }

        .swatch-btn {
          aspect-ratio: 1;
          border-radius: 4px;
          border: 1px solid var(--studio-border);
          cursor: pointer;
          transition: transform 0.1s;
        }

        .swatch-btn.active {
          box-shadow: 0 0 0 2px white, 0 0 0 4px var(--studio-primary);
        }

        .tool-btn {
          width: 100%;
          padding: 8px;
          background: white;
          border: 1px solid var(--studio-border);
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
        }

        .tool-btn:hover:not(:disabled) {
          background: var(--studio-bg);
        }

        .export-btn {
          width: 100%;
          padding: 12px;
          background: var(--studio-primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }

        .export-btn:disabled {
          background: #cbd5e1;
          box-shadow: none;
          cursor: not-allowed;
        }

        .info-tag {
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          color: var(--studio-text-muted);
          background: #f8fafc;
          padding: 6px;
          border-radius: 4px;
        }

        .mt-15 { margin-top: 15px; }

        /* WORKSPACE */
        .studio-workspace {
          flex: 1;
          background: #f1f5f9;
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: auto;
        }

        .workspace-inner {
          width: 100%;
          height: 100%;
          background: white;
          border-radius: 12px;
          border: 1px solid var(--studio-border);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          max-width: 900px;
          max-height: 700px;
        }

        .preview-container {
          position: relative;
          max-width: 80%;
          max-height: 80%;
        }

        .preview-label {
          position: absolute;
          top: -30px;
          left: 0;
          font-size: 12px;
          font-weight: 700;
          color: var(--studio-text-muted);
        }

        .studio-img {
          max-width: 100%;
          max-height: 100%;
          border-radius: 4px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }

        .studio-empty {
          text-align: center;
          color: var(--studio-text-muted);
        }

        .studio-empty h3 {
          color: var(--studio-text);
          margin: 12px 0 4px;
        }

        .studio-empty p {
          font-size: 13px;
        }

        /* MODALS */
        .studio-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .studio-modal {
          background: white;
          width: 100%;
          max-width: 800px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .studio-modal.compact { max-width: 450px; }

        .modal-top {
          padding: 16px 20px;
          border-bottom: 1px solid var(--studio-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-top h3 { margin: 0; font-size: 16px; }

        .close-icon {
          background: none;
          border: none;
          color: var(--studio-text-muted);
          cursor: pointer;
        }

        .modal-content {
          padding: 24px;
          max-height: 70vh;
          overflow-y: auto;
        }

        .sheet-view {
          background: #334155;
          padding: 24px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
        }

        .sheet-view img {
          max-width: 100%;
          border: 4px solid white;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }

        .modal-bottom {
          padding: 16px 20px;
          background: #f8fafc;
          border-top: 1px solid var(--studio-border);
        }

        .lab-download-btn, .confirm-btn {
          width: 100%;
          padding: 12px;
          background: var(--studio-accent);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
        }

        .confirm-btn { background: var(--studio-primary); }

        .lab-cropper-box {
          height: 350px;
          position: relative;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
        }

        .lab-zoom-panel {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
        }

        .lab-zoom-panel input { flex: 1; }

        /* OVERLAYS */
        .lab-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          z-index: 10;
        }

        .lab-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #f1f5f9;
          border-top: 3px solid var(--studio-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 800px) {
          .studio-panel { width: 100%; height: auto; border-right: none; border-bottom: 1px solid var(--studio-border); }
          .studio-main { flex-direction: column; }
          .studio-workspace { padding: 16px; }
          body { overflow: auto; }
        }
      `}</style>
    </div>
  );
}
