'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { 
  Upload, 
  Download, 
  Image as ImageIcon, 
  Printer, 
  X, 
  Sun, 
  Maximize2,
  CheckCircle2,
  Layers,
  Crop as CropIcon,
  Palette
} from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Home() {
  // VERSION 5.0 - PREMIUM STUDIO EDITION
  console.log('Passport Studio v5.0 - Premium UI Active');
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
    <div className="app-container">
      {/* MODERN GLASS HEADER */}
      <header className="premium-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon"><Layers size={24} /></div>
            <div className="logo-text">
              <h1>PASSPORT <span>STUDIO</span></h1>
              <span className="version-badge">PRO v5.0</span>
            </div>
          </div>
          <div className="status-indicator">
            <CheckCircle2 size={16} />
            <span>AI Processing Active</span>
          </div>
        </div>
      </header>

      <main className="main-workspace">
        <div className="workspace-container">
          {/* CONTROL SIDEBAR */}
          <aside className="control-sidebar">
            <section className="control-card">
              <div className="card-header">
                <Upload size={18} />
                <h3>1. SOURCE IMAGE</h3>
              </div>
              <button className="primary-btn" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon size={18} />
                Choose Photo
              </button>
              <input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" />
            </section>

            <section className="control-card">
              <div className="card-header">
                <Palette size={18} />
                <h3>2. BACKGROUND</h3>
              </div>
              <div className="color-grid">
                {[
                  { name: 'Pure White', hex: '#ffffff' },
                  { name: 'Sky Blue', hex: '#3b82f6' },
                  { name: 'Red', hex: '#ef4444' },
                  { name: 'Green', hex: '#10b981' },
                  { name: 'Yellow', hex: '#fbbf24' },
                  { name: 'Deep Black', hex: '#000000' }
                ].map(c => (
                  <button 
                    key={c.hex} 
                    className={`color-swatch ${bgColor === c.hex ? 'active' : ''}`}
                    style={{ background: c.hex }}
                    onClick={() => setBgColor(c.hex)}
                    title={c.name}
                  />
                ))}
              </div>
            </section>

            <section className="control-card">
              <div className="card-header">
                <Printer size={18} />
                <h3>3. FINAL OUTPUT</h3>
              </div>
              <button 
                className="action-btn" 
                disabled={!image} 
                onClick={generateSheet}
              >
                Generate Print Sheet
              </button>
              <p className="hint">Auto-scales to 12 photos on 4x6 sheet</p>
            </section>
          </aside>

          {/* PREVIEW AREA */}
          <section className="preview-canvas">
            <div className="canvas-frame">
              {isProcessing && (
                <div className="processing-overlay">
                  <div className="premium-spinner"></div>
                  <p>AI REMOVING BACKGROUND...</p>
                </div>
              )}
              {image ? (
                <div className="image-wrapper">
                  <img src={image} alt="Preview" className="main-preview" />
                  <div className="image-badge">Preview</div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon"><ImageIcon size={64} /></div>
                  <h2>Ready to start?</h2>
                  <p>Upload a photo to see the magic happen</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* PRINT MODAL */}
      {showPrintModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Professional Print Sheet (4x6)</h3>
              <button className="close-btn" onClick={() => setShowPrintModal(false)}><X size={24} /></button>
            </div>
            <div className="modal-body">
              <div className="print-preview-scroll">
                <img src={printPreview!} alt="Final Sheet" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="download-btn" onClick={() => saveAs(printPreview!, 'Passport_Pro_Sheet.png')}>
                <Download size={20} />
                Download PNG for Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CROPPER MODAL */}
      {showCropper && (
        <div className="modal-overlay">
          <div className="modal-card cropper-card">
            <div className="modal-header">
              <h3><CropIcon size={20} /> Refine Portrait</h3>
            </div>
            <div className="modal-body">
              <div className="cropper-container">
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
              <div className="cropper-controls">
                <span>Zoom</span>
                <input 
                  type="range" 
                  value={zoom} 
                  min={1} 
                  max={3} 
                  step={0.1} 
                  onChange={(e) => setZoom(Number(e.target.value))} 
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="primary-btn" onClick={applyCrop}>Confirm Crop & Background</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@400;600;800&display=swap');

        :root {
          --primary: #6366f1;
          --primary-hover: #4f46e5;
          --bg-app: #f1f5f9;
          --bg-sidebar: rgba(255, 255, 255, 0.8);
          --text-main: #1e293b;
          --text-muted: #64748b;
          --shadow-sm: 0 4px 6px -1px rgba(0,0,0,0.1);
          --shadow-lg: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
        }

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-app);
          color: var(--text-main);
        }

        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* HEADER */
        .premium-header {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 50;
          padding: 0 24px;
          height: 72px;
          display: flex;
          align-items: center;
        }

        .header-content {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          background: var(--primary);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .logo-text h1 {
          margin: 0;
          font-family: 'Outfit', sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .logo-text h1 span {
          color: var(--primary);
        }

        .version-badge {
          background: #fef3c7;
          color: #92400e;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 4px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #10b981;
          font-weight: 600;
          background: #ecfdf5;
          padding: 6px 12px;
          border-radius: 20px;
        }

        /* WORKSPACE */
        .main-workspace {
          flex: 1;
          padding: 32px 24px;
          display: flex;
          justify-content: center;
        }

        .workspace-container {
          max-width: 1300px;
          width: 100%;
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 32px;
        }

        /* SIDEBAR */
        .control-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .control-card {
          background: var(--bg-sidebar);
          backdrop-filter: blur(8px);
          border: 1px solid white;
          padding: 24px;
          border-radius: 24px;
          box-shadow: var(--shadow-sm);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          color: var(--text-muted);
        }

        .card-header h3 {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .primary-btn {
          width: 100%;
          padding: 14px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .primary-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .action-btn {
          width: 100%;
          padding: 16px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }

        .action-btn:not(:disabled):hover {
          background: #059669;
          transform: scale(1.02);
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
        }

        .color-swatch {
          aspect-ratio: 1;
          border-radius: 10px;
          border: 2px solid white;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .color-swatch:hover {
          transform: scale(1.1);
        }

        .color-swatch.active {
          transform: scale(1.1);
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }

        .hint {
          font-size: 11px;
          color: var(--text-muted);
          text-align: center;
          margin-top: 12px;
        }

        /* PREVIEW AREA */
        .preview-canvas {
          height: 100%;
        }

        .canvas-frame {
          background: white;
          height: 100%;
          min-height: 600px;
          border-radius: 32px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .image-wrapper {
          position: relative;
          max-width: 90%;
        }

        .main-preview {
          max-width: 100%;
          max-height: 70vh;
          border-radius: 16px;
          display: block;
        }

        .image-badge {
          position: absolute;
          top: -12px;
          right: -12px;
          background: var(--primary);
          color: white;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .empty-state {
          text-align: center;
          color: var(--text-muted);
        }

        .empty-icon {
          opacity: 0.2;
          margin-bottom: 16px;
        }

        .empty-state h2 {
          font-family: 'Outfit', sans-serif;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        /* MODALS */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .modal-card {
          background: white;
          border-radius: 32px;
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .cropper-card {
          max-width: 550px;
        }

        .modal-header {
          padding: 24px 32px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          margin: 0;
          font-family: 'Outfit', sans-serif;
          font-size: 20px;
        }

        .close-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: var(--text-main);
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }

        .print-preview-scroll {
          background: #334155;
          padding: 40px;
          border-radius: 16px;
          display: flex;
          justify-content: center;
        }

        .print-preview-scroll img {
          max-width: 100%;
          box-shadow: 0 0 40px rgba(0,0,0,0.5);
          border: 4px solid white;
        }

        .modal-footer {
          padding: 24px 32px;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
        }

        .download-btn {
          width: 100%;
          padding: 18px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
        }

        /* CROPPER STYLES */
        .cropper-container {
          height: 400px;
          position: relative;
          background: #0f172a;
          border-radius: 16px;
          overflow: hidden;
        }

        .cropper-controls {
          margin-top: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cropper-controls input {
          flex: 1;
        }

        /* SPINNER */
        .premium-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(99, 102, 241, 0.1);
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          margin-bottom: 20px;
        }

        .processing-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.9);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          letter-spacing: 1px;
          color: var(--primary);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .workspace-container {
            grid-template-columns: 1fr;
          }
          .control-sidebar {
            order: 2;
          }
          .preview-canvas {
            order: 1;
          }
        }
      `}</style>
    </div>
  );
}
