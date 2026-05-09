'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { 
  Upload, 
  CheckCircle2, 
  Download, 
  Image as ImageIcon, 
  User, 
  Languages, 
  ShieldCheck, 
  Zap, 
  BadgeCheck, 
  ChevronDown,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Settings2,
  Printer,
  X,
  Sun,
  Contrast,
  Palette,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Type as TypeIcon,
  Sparkles,
  Eye
} from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Home() {
  console.log('Passport Photo Maker v3.2 Active - Reference Match');
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transparentImage, setTransparentImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'original'>('preview');
  const [docType, setDocType] = useState('Passport');
  const [photoSize, setPhotoSize] = useState('35mm x 45mm');
  const [removeBg, setRemoveBg] = useState(true);
  const [bgColor, setBgColor] = useState('#ffffff');
  
  // Tools State
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(1);
  const [flipV, setFlipV] = useState(1);
  const [showLabel, setShowLabel] = useState(false);
  const [userName, setUserName] = useState('');
  const [userDate, setUserDate] = useState(new Date().toISOString().split('T')[0]);

  // Print Preview State
  const [printPreview, setPrintPreview] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [currentPaper, setCurrentPaper] = useState<'4x6' | 'A4'>('4x6');

  // Cropping State
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ width: number; height: number; x: number; y: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (transparentImage && !showCropper) { renderFinalPreview(); }
  }, [bgColor, transparentImage, showCropper, brightness, contrast, rotation, flipH, flipV, showLabel, userName, userDate]);

  const renderFinalPreview = () => {
    if (!transparentImage) return;
    const img = new Image(); img.src = transparentImage; img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); if (!ctx) return;
      canvas.width = img.width; canvas.height = img.height;
      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.save(); ctx.translate(canvas.width / 2, canvas.height / 2); ctx.scale(flipH, flipV); ctx.rotate((rotation * Math.PI) / 180); ctx.drawImage(img, -img.width / 2, -img.height / 2); ctx.restore();
      if (showLabel) {
        const labelHeight = canvas.height * 0.15;
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, canvas.height - labelHeight, canvas.width, labelHeight);
        ctx.fillStyle = '#000000'; ctx.textAlign = 'center';
        ctx.font = `bold ${labelHeight * 0.3}px Arial`; ctx.fillText(userName.toUpperCase(), canvas.width / 2, canvas.height - (labelHeight * 0.55));
        ctx.font = `${labelHeight * 0.25}px Arial`; ctx.fillText(userDate, canvas.width / 2, canvas.height - (labelHeight * 0.2));
      }
      setImage(canvas.toDataURL('image/png'));
    };
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file); setOriginalImage(url); setImage(url); setTransparentImage(null);
      if (removeBg) processBackgroundRemoval(file); else setShowCropper(true);
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
        const cleanedUrl = await cleanBackground(url);
        setTransparentImage(cleanedUrl); setActiveTab('preview'); setShowCropper(true);
      }
    } catch (err) { console.error(err); } finally { setIsProcessing(false); }
  };

  const cleanBackground = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image(); img.src = url; img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); if (!ctx) return resolve(url);
        canvas.width = img.width; canvas.height = img.height; ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) { if (data[i] > 248 && data[i+1] > 248 && data[i+2] > 248) { data[i+3] = 0; } }
        ctx.putImageData(imageData, 0, 0); resolve(canvas.toDataURL());
      };
    });
  };

  const generateCroppedImage = async () => {
    if (!croppedAreaPixels) return;
    const sourceUrl = transparentImage || originalImage;
    if (!sourceUrl) return;
    const img = new Image(); img.src = sourceUrl; img.crossOrigin = "anonymous";
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
      
      const photoWidth = mmToPx(35), photoHeight = mmToPx(45);
      const paperMargin = mmToPx(8); // Wider margins to accommodate text
      const photoGap = mmToPx(4); // Professional gap

      // Draw Dashed Lines in Gaps
      ctx.setLineDash([15, 10]);
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 1;

      // Vertical dashed lines
      for (let c = 0; c <= cols; c++) {
        const x = paperMargin + c * (photoWidth + photoGap) - (photoGap / 2);
        if (x > paperMargin/2 && x < width - paperMargin/2) {
          ctx.beginPath(); ctx.moveTo(x, paperMargin/2); ctx.lineTo(x, height - paperMargin/2); ctx.stroke();
        }
      }
      // Horizontal dashed lines
      for (let r = 0; r <= rows; r++) {
        const y = paperMargin + r * (photoHeight + photoGap) - (photoGap / 2);
        if (y > paperMargin/2 && y < height - paperMargin/2) {
          ctx.beginPath(); ctx.moveTo(paperMargin/2, y); ctx.lineTo(width - paperMargin/2, y); ctx.stroke();
        }
      }

      // Add Margin Text (Exactly like reference)
      ctx.setLineDash([]);
      ctx.fillStyle = '#333333';
      ctx.font = `bold ${mmToPx(4)}px Arial`;
      
      // Left vertical text
      ctx.save();
      ctx.translate(paperMargin/2, height/2);
      ctx.rotate(-Math.PI/2);
      ctx.textAlign = 'center';
      ctx.fillText("PASSPORT SIZE PHOTOS", 0, 0);
      ctx.restore();

      // Right vertical text
      ctx.save();
      ctx.translate(width - paperMargin/2, height/2);
      ctx.rotate(Math.PI/2);
      ctx.textAlign = 'center';
      ctx.fillText(`PRINT READY ${paper}`, 0, 0);
      ctx.restore();

      // Draw Photos with Border
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = paperMargin + c * (photoWidth + photoGap);
          const y = paperMargin + r * (photoHeight + photoGap);
          
          // Photo Outline
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, photoWidth, photoHeight);
          
          ctx.drawImage(img, x, y, photoWidth, photoHeight);
        }
      }
      setPrintPreview(canvas.toDataURL('image/png'));
      setShowPrintModal(true);
    };
  };

  return (
    <div className="app-root">
      <header className="header"><div className="container header-inner"><div className="logo"><div className="logo-icon"><Printer size={20} /></div><span className="logo-text">Premium Studio Pro <small>v3.2</small></span></div><div className="header-actions"><button className="btn btn-primary btn-sm">Sign In</button></div></div></header>

      <main className="container workspace-container">
        <div className="workspace-grid">
          <div className="steps-panel card">
            <div className="step-item">
              <h3 className="step-title">1. UPLOAD</h3>
              <div className="upload-area" onClick={() => fileInputRef.current?.click()}><Upload size={24} /><p>Upload Photo</p><input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" /></div>
            </div>
            <div className="step-item">
              <h3 className="step-title">2. PHOTO EDIT</h3>
              <div className="tool-row"><Sun size={14} /><span>Brightness</span><input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} /></div>
              <div className="tool-row"><Contrast size={14} /><span>Contrast</span><input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} /></div>
            </div>
            <div className="step-item">
              <h3 className="step-title">3. STUDIO OPTIONS</h3>
              <div className="option-row">
                <div className="option-label"><TypeIcon size={16} /><span>Add Name & Date</span></div>
                <label className="switch"><input type="checkbox" checked={showLabel} onChange={(e) => setShowLabel(e.target.checked)} /><span className="slider round"></span></label>
              </div>
              {showLabel && (
                <div className="label-inputs">
                  <input type="text" placeholder="NAME" value={userName} onChange={(e) => setUserName(e.target.value)} />
                  <input type="date" value={userDate} onChange={(e) => setUserDate(e.target.value)} />
                </div>
              )}
              <div className="color-presets" style={{marginTop: '12px'}}>
                {['#ffffff', '#3b82f6', '#ef4444', '#10b981'].map(c => (
                  <button key={c} className={`color-circle ${bgColor === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setBgColor(c)}></button>
                ))}
              </div>
            </div>
            <div className="step-item">
              <h3 className="step-title">4. PRINT SHEETS</h3>
              <div className="action-buttons">
                <button className="btn btn-primary btn-sm" onClick={() => openPrintPreview('4x6')}><Printer size={16} /> 4x6 (12)</button>
                <button className="btn btn-primary btn-sm" onClick={() => openPrintPreview('A4')}><Printer size={16} /> A4 (30)</button>
              </div>
              <button className="btn btn-success btn-full" style={{marginTop: '8px'}} onClick={() => saveAs(image!, 'photo.png')}><Download size={18} /> Download Single</button>
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

          <div className="info-panel">
            <div className="card status-card">
              <h3>Lab Ready</h3>
              <ul className="requirements-list">
                <li className="good">Lab Reference Match <span>✓</span></li>
                <li className="good">Dashed Cut Guides <span>✓</span></li>
                <li className="good">Margin Branding <span>✓</span></li>
              </ul>
            </div>
            <div className="card preview-grid-card">
              <h3>Sheet Grid</h3>
              <div className="photo-preview-grid">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="mini-photo">{image && <img src={image} alt="mini" />}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showPrintModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{maxWidth: '850px'}}>
            <div className="modal-header"><h3>Final Print Preview ({currentPaper})</h3><button onClick={() => setShowPrintModal(false)}><X /></button></div>
            <div className="print-preview-container" style={{maxHeight: '70vh', overflowY: 'auto', background: '#333', padding: '40px', textAlign: 'center'}}>
              <img src={printPreview!} alt="Print Preview" style={{width: '100%', boxShadow: '0 0 40px rgba(0,0,0,0.6)', border: '1px solid #fff'}} />
            </div>
            <div className="modal-footer">
              <p style={{fontSize: '13px', color: '#666'}}>* Exactly matching professional lab reference.</p>
              <button className="btn btn-success btn-full" onClick={() => saveAs(printPreview!, `Studio_Print_Sheet_${currentPaper}.png`)}><Download size={18} /> Download High-Quality Sheet</button>
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
        .app-root { min-height: 100vh; background: #fdfdff; font-family: 'Inter', sans-serif; --primary: #3b82f6; --primary-hover: #2563eb; --secondary: #f1f5f9; --border: #e2e8f0; --text-main: #0f172a; --text-muted: #64748b; --success: #22c55e; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .header { background: #fff; border-bottom: 1px solid var(--border); padding: 12px 0; }
        .header-inner { display: flex; align-items: center; justify-content: space-between; }
        .logo { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 18px; }
        .logo-icon { background: var(--primary); color: #fff; padding: 6px; border-radius: 6px; }
        .workspace-grid { display: grid; grid-template-columns: 320px 1fr 280px; gap: 20px; padding: 30px 0; }
        .card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
        .step-item { margin-bottom: 24px; }
        .step-title { font-size: 10px; font-weight: 900; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid var(--secondary); padding-bottom: 6px; text-transform: uppercase; }
        .upload-area { border: 2px dashed var(--border); border-radius: 10px; padding: 16px; text-align: center; cursor: pointer; color: var(--primary); font-weight: 700; }
        .tool-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 12px; font-weight: 600; color: var(--text-muted); }
        .tool-row input { flex: 1; height: 4px; }
        .label-inputs { margin-top: 10px; display: flex; flex-direction: column; gap: 8px; }
        .label-inputs input { width: 100%; padding: 8px; border: 1px solid var(--border); border-radius: 6px; font-size: 12px; font-weight: 700; }
        .option-row { display: flex; justify-content: space-between; align-items: center; }
        .color-presets { display: flex; gap: 8px; }
        .color-circle { width: 20px; height: 20px; border-radius: 50%; border: none; cursor: pointer; }
        .color-circle.active { outline: 2px solid var(--primary); outline-offset: 2px; }
        .switch { position: relative; display: inline-block; width: 34px; height: 16px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; inset: 0; background: #e2e8f0; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 2px; bottom: 2px; background: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background: var(--primary); }
        input:checked + .slider:before { transform: translateX(18px); }
        .action-buttons { display: flex; gap: 8px; margin-top: 12px; }
        .btn { border: none; border-radius: 6px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .btn-full { width: 100%; padding: 10px; }
        .btn-primary { background: var(--primary); color: #fff; flex: 1; }
        .btn-success { background: var(--success); color: #fff; }
        .btn-secondary { background: var(--secondary); color: var(--text-main); }
        .preview-canvas-area { border: 1px solid var(--border); border-radius: 12px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; width: 100%; background-color: #fff; }
        .main-preview-img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .loader-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.8); z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; font-weight: 700; }
        .loader { width: 24px; height: 24px; border: 3px solid var(--secondary); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .requirements-list { list-style: none; margin-top: 12px; }
        .requirements-list li { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--secondary); font-size: 12px; font-weight: 600; }
        .requirements-list li span { color: var(--success); }
        .photo-preview-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 10px; }
        .mini-photo { aspect-ratio: 35/45; border: 1px solid var(--border); border-radius: 4px; overflow: hidden; background: #f8fafc; }
        .mini-photo img { width: 100%; height: 100%; object-fit: cover; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
      `}</style>
    </div>
  );
}
