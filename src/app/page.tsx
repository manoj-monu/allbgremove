'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { 
  Upload, 
  Download, 
  Image as ImageIcon, 
  User, 
  Printer, 
  X, 
  Sun, 
  Contrast, 
  RotateCcw, 
  Maximize2,
  Type as TypeIcon
} from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Home() {
  // VERSION 3.4 - AGGRESSIVE CACHE BUSTING
  console.log('Passport Photo Maker v3.4 - Yellow Header Edition');
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transparentImage, setTransparentImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  
  // Tools
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showLabel, setShowLabel] = useState(false);
  const [userName, setUserName] = useState('');
  const [userDate, setUserDate] = useState(new Date().toISOString().split('T')[0]);

  // Print Preview
  const [printPreview, setPrintPreview] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [currentPaper, setCurrentPaper] = useState<'4x6' | 'A4'>('4x6');

  // Cropping
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ width: number; height: number; x: number; y: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (transparentImage && !showCropper) { renderFinalPreview(); }
  }, [bgColor, transparentImage, showCropper, brightness, contrast, showLabel, userName, userDate]);

  const renderFinalPreview = () => {
    if (!transparentImage) return;
    const img = new Image(); img.src = transparentImage; img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); if (!ctx) return;
      canvas.width = img.width; canvas.height = img.height;
      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(img, 0, 0);
      if (showLabel) {
        const h = canvas.height * 0.15;
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, canvas.height - h, canvas.width, h);
        ctx.fillStyle = '#000000'; ctx.textAlign = 'center';
        ctx.font = `bold ${h * 0.35}px Arial`; ctx.fillText(userName.toUpperCase(), canvas.width / 2, canvas.height - (h * 0.5));
        ctx.font = `${h * 0.25}px Arial`; ctx.fillText(userDate, canvas.width / 2, canvas.height - (h * 0.15));
      }
      setImage(canvas.toDataURL('image/png'));
    };
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file); setOriginalImage(url); setImage(url); setTransparentImage(null);
      processBackgroundRemoval(file);
    }
  };

  const processBackgroundRemoval = async (file: File) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const apiUrl = 'https://manojkumarsh-allbgremove-api.hf.space';
      const response = await fetch(`${apiUrl}/api/remove-bg`, { method: 'POST', body: formData });
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setTransparentImage(url); setShowCropper(true);
      }
    } catch (err) { console.error(err); } finally { setIsProcessing(false); }
  };

  const generateCroppedImage = async () => {
    if (!croppedAreaPixels || !transparentImage) return;
    const img = new Image(); img.src = transparentImage; img.crossOrigin = "anonymous";
    await new Promise((resolve) => { img.onload = resolve; });
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); if (!ctx) return;
    canvas.width = croppedAreaPixels.width; canvas.height = croppedAreaPixels.height;
    ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, canvas.width, canvas.height);
    setTransparentImage(canvas.toDataURL('image/png')); setShowCropper(false);
  };

  const openPrintPreview = (paper: '4x6' | 'A4') => {
    if (!image) return;
    setCurrentPaper(paper);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.src = image; img.crossOrigin = "anonymous";
    img.onload = () => {
      const dpi = 300;
      const mmToPx = (mm: number) => Math.round((mm * dpi) / 25.4);
      let width, height, cols, rows;
      if (paper === '4x6') { width = 4 * dpi; height = 6 * dpi; cols = 3; rows = 4; }
      else { width = mmToPx(210); height = mmToPx(297); cols = 5; rows = 6; }
      
      canvas.width = width; canvas.height = height;
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height);
      
      const pW = mmToPx(35), pH = mmToPx(45);
      const margin = mmToPx(8);
      const gap = mmToPx(4);

      // Draw RED Dashed Lines
      ctx.setLineDash([20, 15]);
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;

      for (let c = 0; c <= cols; c++) {
        const x = margin + c * (pW + gap) - gap/2;
        if (x > margin/2 && x < width - margin/2) {
          ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, height - 20); ctx.stroke();
        }
      }
      for (let r = 0; r <= rows; r++) {
        const y = margin + r * (pH + gap) - gap/2;
        if (y > margin/2 && y < height - margin/2) {
          ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(width - 20, y); ctx.stroke();
        }
      }

      // Margin Text
      ctx.setLineDash([]);
      ctx.fillStyle = '#000000';
      ctx.font = `bold ${mmToPx(5)}px Arial`;
      ctx.save(); ctx.translate(margin/2, height/2); ctx.rotate(-Math.PI/2); ctx.textAlign = 'center'; ctx.fillText("PASSPORT SIZE PHOTOS", 0, 0); ctx.restore();
      ctx.save(); ctx.translate(width - margin/2, height/2); ctx.rotate(Math.PI/2); ctx.textAlign = 'center'; ctx.fillText(`PRINT READY ${paper}`, 0, 0); ctx.restore();

      // Photos
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = margin + c * (pW + gap);
          const y = margin + r * (pH + gap);
          ctx.strokeStyle = '#000000'; ctx.lineWidth = 1; ctx.strokeRect(x, y, pW, pH);
          ctx.drawImage(img, x, y, pW, pH);
        }
      }
      setPrintPreview(canvas.toDataURL('image/png'));
      setShowPrintModal(true);
    };
  };

  return (
    <div className="app-root">
      <header className="header" style={{background: '#ffeb3b'}}>
        <div className="container header-inner">
          <div className="logo"><div className="logo-icon"><Printer size={20} /></div><span className="logo-text">v3.4 - NEW PRINT ENGINE</span></div>
          <div style={{color: 'red', fontWeight: 'bold'}}>VERSION 3.4 - RELOAD IF NOT YELLOW</div>
        </div>
      </header>

      <main className="container workspace-container">
        <div className="workspace-grid">
          <div className="steps-panel card">
            <div className="step-item">
              <h3 className="step-title">1. UPLOAD</h3>
              <div className="upload-area" onClick={() => fileInputRef.current?.click()}><Upload size={24} /><p>CLICK TO UPLOAD</p><input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" /></div>
            </div>
            <div className="step-item">
              <h3 className="step-title">2. SETTINGS</h3>
              <div className="tool-row"><Sun size={14} /><span>Brightness</span><input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} /></div>
              <div className="color-presets" style={{marginTop: '12px'}}>
                {['#ffffff', '#3b82f6', '#ef4444', '#10b981'].map(c => (
                  <button key={c} className={`color-circle ${bgColor === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setBgColor(c)}></button>
                ))}
              </div>
            </div>
            <div className="step-item">
              <h3 className="step-title">3. FINAL PRINT</h3>
              <div className="action-buttons">
                <button className="btn btn-primary btn-sm" onClick={() => openPrintPreview('4x6')}>PREVIEW 4x6 (12)</button>
              </div>
            </div>
          </div>

          <div className="preview-panel card">
            <div className="preview-canvas-area" style={{ background: '#fff', aspectRatio: '35/45' }}>
              {isProcessing && <div className="loader-overlay"><div className="loader"></div><p>AI Studio...</p></div>}
              {image ? <img src={image} alt="Preview" className="main-preview-img" /> : <div className="empty-preview" onClick={() => fileInputRef.current?.click()}><ImageIcon size={48} /><p>No Photo</p></div>}
            </div>
            <div className="preview-controls">
              <button className="control-btn" onClick={() => setShowCropper(true)}><Maximize2 size={18} /><span>Crop</span></button>
              <button className="control-btn" onClick={() => { setBrightness(100); setContrast(100); setShowLabel(false); }}><RotateCcw size={14} /> Reset</button>
            </div>
          </div>
        </div>
      </main>

      {showPrintModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{maxWidth: '850px'}}>
            <div className="modal-header"><h3>Print Sheet Preview ({currentPaper})</h3><button onClick={() => setShowPrintModal(false)}><X /></button></div>
            <div className="print-preview-container" style={{maxHeight: '70vh', overflowY: 'auto', background: '#000', padding: '40px', textAlign: 'center'}}>
              <img src={printPreview!} alt="Print Preview" style={{width: '100%', boxShadow: '0 0 50px rgba(255,255,255,0.3)', border: '1px solid #fff'}} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-success btn-full" onClick={() => saveAs(printPreview!, `Studio_Final.png`)}><Download size={18} /> DOWNLOAD FINAL SHEET</button>
            </div>
          </div>
        </div>
      )}

      {showCropper && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{maxWidth: '500px'}}>
            <div className="modal-header"><h3>Crop Photo</h3><button onClick={() => setShowCropper(false)}><X /></button></div>
            <div className="cropper-container" style={{height: '400px'}}><Cropper image={transparentImage || image!} crop={crop} zoom={zoom} aspect={35/45} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} /></div>
            <div className="modal-footer"><button className="btn btn-primary btn-full" onClick={generateCroppedImage}>Apply Crop</button></div>
          </div>
        </div>
      )}

      <style jsx>{`
        .app-root { min-height: 100vh; background: #fdfdff; font-family: 'Inter', sans-serif; --primary: #3b82f6; --success: #22c55e; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .header { border-bottom: 2px solid #000; padding: 15px 0; }
        .header-inner { display: flex; align-items: center; justify-content: space-between; }
        .logo { display: flex; align-items: center; gap: 8px; font-weight: 900; font-size: 20px; }
        .workspace-grid { display: grid; grid-template-columns: 320px 1fr; gap: 20px; padding: 30px 0; }
        .card { background: #fff; border: 1px solid #ddd; border-radius: 12px; padding: 20px; }
        .step-item { margin-bottom: 24px; }
        .step-title { font-size: 11px; font-weight: 900; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 6px; text-transform: uppercase; }
        .upload-area { border: 3px dashed var(--primary); border-radius: 10px; padding: 20px; text-align: center; cursor: pointer; color: var(--primary); font-weight: 800; }
        .tool-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 12px; font-weight: 700; }
        .tool-row input { flex: 1; }
        .color-presets { display: flex; gap: 8px; }
        .color-circle { width: 25px; height: 25px; border-radius: 50%; border: 1px solid #ddd; cursor: pointer; }
        .color-circle.active { outline: 3px solid #000; }
        .action-buttons { display: flex; gap: 8px; }
        .btn { border: none; border-radius: 8px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-full { width: 100%; padding: 12px; }
        .btn-primary { background: var(--primary); color: #fff; padding: 12px; }
        .btn-success { background: var(--success); color: #fff; }
        .preview-canvas-area { border: 2px solid #000; border-radius: 12px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; width: 100%; background-color: #fff; }
        .main-preview-img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .loader-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.9); z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; font-weight: 800; }
        .loader { width: 30px; height: 30px; border: 4px solid #eee; border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
      `}</style>
    </div>
  );
}
