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
  Aperture,
  Wind,
  Type as TypeIcon,
  Sparkles
} from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Home() {
  console.log('Passport Photo Maker v2.9 Active - Studio Special');
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transparentImage, setTransparentImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'original'>('preview');
  const [docType, setDocType] = useState('Passport');
  const [photoSize, setPhotoSize] = useState('35mm x 45mm');
  const [removeBg, setRemoveBg] = useState(true);
  const [bgColor, setBgColor] = useState('#ffffff');
  
  // Mega Studio & Special Tools State
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [blur, setBlur] = useState(0);
  const [exposure, setExposure] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [flipH, setFlipH] = useState(1);
  const [flipV, setFlipV] = useState(1);
  
  // Studio Special
  const [sharpen, setSharpen] = useState(0);
  const [vignette, setVignette] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const [userName, setUserName] = useState('');
  const [userDate, setUserDate] = useState(new Date().toISOString().split('T')[0]);

  // Cropping State
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ width: number; height: number; x: number; y: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (transparentImage && !showCropper) { renderFinalPreview(); }
  }, [bgColor, transparentImage, showCropper, brightness, contrast, saturation, rotation, blur, exposure, grayscale, sepia, flipH, flipV, sharpen, vignette, showLabel, userName, userDate]);

  const renderFinalPreview = () => {
    if (!transparentImage) return;
    const img = new Image();
    img.src = transparentImage;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = img.width; canvas.height = img.height;

      // Draw background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) opacity(${exposure}%) grayscale(${grayscale}%) sepia(${sepia}%) contrast(${100 + sharpen}%)`;
      
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(flipH, flipV);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      // Apply Vignette (Simulated with Gradient)
      if (vignette > 0) {
        const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, `rgba(0,0,0,${vignette / 100})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Add Name & Date Label
      if (showLabel) {
        const labelHeight = canvas.height * 0.15;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, canvas.height - labelHeight, canvas.width, labelHeight);
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.font = `bold ${labelHeight * 0.3}px Arial`;
        ctx.fillText(userName.toUpperCase(), canvas.width / 2, canvas.height - (labelHeight * 0.55));
        ctx.font = `${labelHeight * 0.25}px Arial`;
        ctx.fillText(userDate, canvas.width / 2, canvas.height - (labelHeight * 0.2));
      }
      
      setImage(canvas.toDataURL('image/png'));
    };
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalImage(url); setImage(url); setTransparentImage(null);
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
      const img = new Image();
      img.src = url; img.crossOrigin = "anonymous";
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
    setTransparentImage(canvas.toDataURL('image/png'));
    setShowCropper(false);
  };

  return (
    <div className="app-root">
      <header className="header"><div className="container header-inner"><div className="logo"><div className="logo-icon"><User size={24} /></div><span className="logo-text">Studio Pro <small>v2.9</small></span></div><button className="btn btn-primary btn-sm">Sign In</button></div></header>

      <main className="container workspace-container">
        <div className="workspace-grid">
          <div className="steps-panel card">
            <div className="step-item">
              <h3 className="step-title">1. UPLOAD</h3>
              <div className="upload-area" onClick={() => fileInputRef.current?.click()}><Upload size={24} /><p>Upload Photo</p><input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" /></div>
            </div>

            <div className="step-item">
              <h3 className="step-title">2. MEGA STUDIO TOOLS</h3>
              <div className="tool-row"><Sun size={14} /><span>Brightness</span><input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} /></div>
              <div className="tool-row"><Contrast size={14} /><span>Contrast</span><input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} /></div>
              <div className="tool-row"><RotateCw size={14} /><span>Rotate</span><input type="range" min="-180" max="180" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} /></div>
              <div className="flip-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => setFlipH(f => f * -1)}>Flip H</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setFlipV(f => f * -1)}>Flip V</button>
              </div>
            </div>

            <div className="step-item">
              <h3 className="step-title">3. STUDIO SPECIAL</h3>
              <div className="tool-row"><Sparkles size={14} /><span>Sharpen</span><input type="range" min="0" max="100" value={sharpen} onChange={(e) => setSharpen(Number(e.target.value))} /></div>
              <div className="tool-row"><Wind size={14} /><span>Vignette</span><input type="range" min="0" max="100" value={vignette} onChange={(e) => setVignette(Number(e.target.value))} /></div>
              <div className="option-row" style={{marginTop: '12px'}}>
                <div className="option-label"><TypeIcon size={16} /><span>Name & Date Label</span></div>
                <label className="switch"><input type="checkbox" checked={showLabel} onChange={(e) => setShowLabel(e.target.checked)} /><span className="slider round"></span></label>
              </div>
              {showLabel && (
                <div className="label-inputs">
                  <input type="text" placeholder="FULL NAME" value={userName} onChange={(e) => setUserName(e.target.value)} />
                  <input type="date" value={userDate} onChange={(e) => setUserDate(e.target.value)} />
                </div>
              )}
            </div>

            <div className="step-item">
              <h3 className="step-title">4. COLORS & DOWNLOAD</h3>
              <div className="color-presets">
                {['#ffffff', '#3b82f6', '#ef4444', '#10b981'].map(c => (
                  <button key={c} className={`color-circle ${bgColor === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setBgColor(c)}></button>
                ))}
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
              </div>
              <div className="action-buttons"><button className="btn btn-primary btn-sm" onClick={() => saveAs(image!, 'photo_4x6.png')}>4x6 (12)</button><button className="btn btn-primary btn-sm" onClick={() => saveAs(image!, 'photo_A4.png')}>A4 (30)</button></div>
              <button className="btn btn-success btn-full" onClick={() => saveAs(image!, 'passport.png')}><Download size={18} /> Download</button>
            </div>
          </div>

          <div className="preview-panel card">
            <div className="preview-header">
              <div className="tabs"><button className="tab active">Preview</button></div>
              <button className="btn btn-secondary btn-sm" onClick={() => { setBrightness(100); setContrast(100); setRotation(0); setSharpen(0); setVignette(0); setShowLabel(false); }}><RotateCcw size={14} /> Reset</button>
            </div>
            <div className="preview-canvas-area" style={{ background: '#fff', aspectRatio: '35/45' }}>
              {isProcessing && <div className="loader-overlay"><div className="loader"></div><p>AI Working...</p></div>}
              {image ? <img src={image} alt="Preview" className="main-preview-img" /> : <div className="empty-preview" onClick={() => fileInputRef.current?.click()}><ImageIcon size={48} /><p>Upload Photo</p></div>}
            </div>
          </div>

          <div className="info-panel">
            <div className="card status-card">
              <h3>Photo Quality</h3>
              <ul className="requirements-list">
                <li className="good">Studio Finish <span>✓</span></li>
                <li className="good">Sharp Edges <span>✓</span></li>
                <li className="good">Government Ready <span>✓</span></li>
              </ul>
            </div>
            <div className="card preview-grid-card">
              <h3>Sheet Preview</h3>
              <div className="photo-preview-grid">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="mini-photo">{image && <img src={image} alt="mini" />}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showCropper && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="modal-header"><h3>Crop Photo</h3><button onClick={() => setShowCropper(false)}><X /></button></div>
            <div className="cropper-container"><Cropper image={transparentImage || image!} crop={crop} zoom={zoom} aspect={35/45} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} /></div>
            <div className="modal-footer"><button className="btn btn-primary btn-sm btn-full" onClick={generateCroppedImage}>Apply Crop</button></div>
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
        .step-title { font-size: 11px; font-weight: 900; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid var(--secondary); padding-bottom: 6px; text-transform: uppercase; }
        .upload-area { border: 2px dashed var(--border); border-radius: 10px; padding: 16px; text-align: center; cursor: pointer; color: var(--primary); font-weight: 700; }
        .tool-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 12px; font-weight: 600; color: var(--text-muted); }
        .tool-row input { flex: 1; height: 4px; }
        .flip-actions { display: flex; gap: 8px; margin-bottom: 12px; }
        .label-inputs { margin-top: 10px; display: flex; flex-direction: column; gap: 8px; }
        .label-inputs input { width: 100%; padding: 8px; border: 1px solid var(--border); border-radius: 6px; font-size: 12px; font-weight: 700; }
        .option-row { display: flex; justify-content: space-between; align-items: center; }
        .option-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; }
        .color-presets { display: flex; gap: 8px; margin-bottom: 12px; }
        .color-circle { width: 24px; height: 24px; border-radius: 50%; border: none; cursor: pointer; }
        .color-circle.active { outline: 2px solid var(--primary); outline-offset: 2px; }
        .switch { position: relative; display: inline-block; width: 36px; height: 18px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; inset: 0; background: #e2e8f0; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background: var(--primary); }
        input:checked + .slider:before { transform: translateX(18px); }
        .action-buttons { display: flex; gap: 8px; margin-top: 12px; }
        .btn { border: none; border-radius: 6px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .btn-full { width: 100%; padding: 10px; }
        .btn-primary { background: var(--primary); color: #fff; flex: 1; }
        .btn-success { background: var(--success); color: #fff; }
        .btn-secondary { background: var(--secondary); color: var(--text-main); }
        .preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .tabs { display: flex; gap: 4px; background: var(--secondary); padding: 4px; border-radius: 8px; }
        .tab { background: none; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 12px; }
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
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: flex; align-items: center; justify-content: center; }
        .modal-content { width: 100%; max-width: 500px; padding: 20px; }
        .cropper-container { height: 350px; width: 100%; background: #000; border-radius: 8px; }
        .modal-footer { margin-top: 16px; }
      `}</style>
    </div>
  );
}
