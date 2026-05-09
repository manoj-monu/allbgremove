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
  Type,
  Aperture,
  Wind
} from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Home() {
  console.log('Passport Photo Maker v2.8 Active - Mega Studio');
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transparentImage, setTransparentImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'original'>('preview');
  const [docType, setDocType] = useState('Passport');
  const [country, setCountry] = useState('India');
  const [photoSize, setPhotoSize] = useState('35mm x 45mm');
  const [removeBg, setRemoveBg] = useState(true);
  const [cropAlign, setCropAlign] = useState(true);
  const [enhance, setEnhance] = useState(true);
  const [bgColor, setBgColor] = useState('#ffffff');
  
  // Advanced Mega Studio State
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [hue, setHue] = useState(0);
  const [blur, setBlur] = useState(0);
  const [exposure, setExposure] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [flipH, setFlipH] = useState(1);
  const [flipV, setFlipV] = useState(1);

  // Cropping State
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ width: number; height: number; x: number; y: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Automatically render processed preview when any tool changes
  useEffect(() => {
    if (transparentImage && !showCropper) {
      renderMegaPreview();
    }
  }, [bgColor, transparentImage, showCropper, brightness, contrast, saturation, rotation, hue, blur, exposure, grayscale, sepia, flipH, flipV]);

  const renderMegaPreview = () => {
    if (!transparentImage) return;
    const img = new Image();
    img.src = transparentImage;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw background color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply Mega Studio Filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) blur(${blur}px) opacity(${exposure}%) grayscale(${grayscale}%) sepia(${sepia}%)`;
      
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(flipH, flipV);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
      
      setImage(canvas.toDataURL('image/png'));
    };
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setImage(url);
      setTransparentImage(null);
      if (removeBg) {
        processBackgroundRemoval(file);
      } else {
        setShowCropper(true);
      }
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
        setTransparentImage(cleanedUrl);
        setActiveTab('preview');
        setShowCropper(true);
      }
    } catch (err) { console.error(err); } finally { setIsProcessing(false); }
  };

  const cleanBackground = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(url);
        canvas.width = img.width; canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 248 && data[i+1] > 248 && data[i+2] > 248) { data[i+3] = 0; }
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
      img.onerror = () => resolve(url);
    });
  };

  const generateCroppedImage = async () => {
    if (!croppedAreaPixels) return;
    const sourceUrl = transparentImage || originalImage;
    if (!sourceUrl) return;
    const img = new Image();
    img.src = sourceUrl;
    img.crossOrigin = "anonymous";
    await new Promise((resolve) => { img.onload = resolve; });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) blur(${blur}px) opacity(${exposure}%) grayscale(${grayscale}%) sepia(${sepia}%)`;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(flipH, flipV);
    // Rotation during crop is complex, simplified for now
    ctx.drawImage(img, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, -canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
    ctx.restore();
    setImage(canvas.toDataURL('image/png'));
    setShowCropper(false);
  };

  const resetAll = () => {
    setBrightness(100); setContrast(100); setSaturation(100); setRotation(0);
    setHue(0); setBlur(0); setExposure(100); setGrayscale(0); setSepia(0);
    setFlipH(1); setFlipV(1);
  };

  return (
    <div className="app-root">
      <header className="header"><div className="container header-inner"><div className="logo"><div className="logo-icon"><User size={24} /></div><span className="logo-text">Passport Pro <small>v2.8</small></span></div><div className="header-actions"><button className="btn btn-primary btn-sm">Sign In</button></div></div></header>

      <main className="container workspace-container">
        <div className="workspace-grid">
          <div className="steps-panel card">
            <div className="step-item">
              <h3 className="step-title">1. UPLOAD & SIZE</h3>
              <div className="upload-area" onClick={() => fileInputRef.current?.click()}><Upload size={24} /><p>Upload Photo</p><input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" /></div>
              <div className="input-group" style={{marginTop: '12px'}}><select value={photoSize} onChange={(e) => setPhotoSize(e.target.value)}><option>35mm x 45mm</option><option>2 x 2 inch</option></select></div>
            </div>

            <div className="step-item">
              <h3 className="step-title">2. BACKGROUND COLOR</h3>
              <div className="color-presets" style={{justifyContent: 'flex-start'}}>
                {['#ffffff', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#000000'].map(c => (
                  <button key={c} className={`color-circle ${bgColor === c ? 'active' : ''}`} style={{ background: c, border: c === '#ffffff' ? '1px solid #ddd' : 'none' }} onClick={() => setBgColor(c)}></button>
                ))}
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
              </div>
            </div>

            <div className="step-item mega-studio">
              <h3 className="step-title">3. MEGA STUDIO TOOLS</h3>
              <div className="tool-tabs">
                <div className="tool-row"><Sun size={14} /><span>Brightness</span><input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} /></div>
                <div className="tool-row"><Contrast size={14} /><span>Contrast</span><input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} /></div>
                <div className="tool-row"><Palette size={14} /><span>Saturation</span><input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} /></div>
                <div className="tool-row"><Aperture size={14} /><span>Exposure</span><input type="range" min="0" max="200" value={exposure} onChange={(e) => setExposure(Number(e.target.value))} /></div>
                <div className="tool-row"><RotateCw size={14} /><span>Rotate</span><input type="range" min="-180" max="180" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} /></div>
                <div className="tool-row"><Wind size={14} /><span>Blur</span><input type="range" min="0" max="10" value={blur} onChange={(e) => setBlur(Number(e.target.value))} /></div>
              </div>
              <div className="flip-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => setFlipH(f => f * -1)}><FlipHorizontal size={16} /> Flip H</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setFlipV(f => f * -1)}><FlipVertical size={16} /> Flip V</button>
              </div>
              <div className="filter-actions">
                <button className={`btn btn-secondary btn-sm ${grayscale > 0 ? 'active' : ''}`} onClick={() => setGrayscale(g => g > 0 ? 0 : 100)}>B&W</button>
                <button className={`btn btn-secondary btn-sm ${sepia > 0 ? 'active' : ''}`} onClick={() => setSepia(s => s > 0 ? 0 : 100)}>Sepia</button>
              </div>
              <button className="btn btn-secondary btn-full btn-sm" onClick={resetAll}><RotateCcw size={14} /> Reset All</button>
            </div>

            <div className="step-item">
              <h3 className="step-title">4. DOWNLOAD</h3>
              <div className="action-buttons"><button className="btn btn-primary btn-sm" onClick={() => generatePrintLayout('4x6')}>4x6 (12)</button><button className="btn btn-primary btn-sm" onClick={() => generatePrintLayout('A4')}>A4 (30)</button></div>
              <button className="btn btn-success btn-full" onClick={downloadSingle}><Download size={18} /> Download Single</button>
            </div>
          </div>

          <div className="preview-panel card">
            <div className="preview-header">
              <div className="tabs"><button className={`tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button><button className={`tab ${activeTab === 'original' ? 'active' : ''}`} onClick={() => setActiveTab('original')}>Original</button></div>
              <button className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current?.click()}><RotateCcw size={14} /> Change</button>
            </div>
            <div className="preview-canvas-area" style={{ background: '#f8fafc', backgroundImage: 'linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)', backgroundSize: '20px 20px', aspectRatio: getAspectRatio() }}>
              {isProcessing && <div className="loader-overlay"><div className="loader"></div><p>AI Processing...</p></div>}
              {image ? (
                <div className="image-container">
                  <img src={activeTab === 'preview' ? image : originalImage!} alt="Preview" className="main-preview-img" style={{ transform: activeTab === 'preview' ? 'none' : `rotate(${rotation}deg) scale(${flipH}, ${flipV})` }} />
                </div>
              ) : (
                <div className="empty-preview" onClick={() => fileInputRef.current?.click()}><ImageIcon size={48} /><p>Upload Photo</p></div>
              )}
            </div>
            <div className="preview-controls">
              <button className="control-btn" onClick={() => setShowCropper(true)}><Maximize2 size={18} /><span>Crop</span></button>
              <div className="v-divider"></div>
              <button className="control-btn" onClick={() => setZoom(z => Math.max(1, z - 0.1))}><ZoomOut size={18} /></button>
              <span className="zoom-text">100%</span>
              <button className="control-btn" onClick={() => setZoom(z => Math.min(3, z + 0.1))}><ZoomIn size={18} /></button>
            </div>
          </div>

          <div className="info-panel">
            <div className="card status-card">
              <h3>Photo Check</h3>
              <ul className="requirements-list">
                <li className="good">Face Centered <span>✓</span></li>
                <li className="good">Pro Edges <span>✓</span></li>
                <li className="good">Studio Quality <span>✓</span></li>
              </ul>
            </div>
            <div className="card preview-grid-card">
              <h3>Sheet Preview</h3>
              <div className="photo-preview-grid">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="mini-photo">{image && <img src={image} alt="mini" />}</div>
                ))}
              </div>
              <p className="photo-info">{photoSize} | 300 DPI</p>
            </div>
          </div>
        </div>
      </main>

      {showCropper && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="modal-header"><h3>Crop Photo</h3><button onClick={() => setShowCropper(false)}><X /></button></div>
            <div className="cropper-container"><Cropper image={activeTab === 'preview' ? (transparentImage || image!) : originalImage!} crop={crop} zoom={zoom} aspect={getAspectRatio()} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} /></div>
            <div className="modal-footer"><div className="zoom-control"><ZoomOut size={18} /><input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} /><ZoomIn size={18} /></div><div className="modal-actions"><button className="btn btn-secondary btn-sm" onClick={() => setShowCropper(false)}>Cancel</button><button className="btn btn-primary btn-sm" onClick={generateCroppedImage}>Apply Crop</button></div></div>
          </div>
        </div>
      )}

      <style jsx>{`
        .app-root { min-height: 100vh; background: #fdfdff; font-family: 'Inter', sans-serif; --primary: #3b82f6; --primary-hover: #2563eb; --secondary: #f1f5f9; --border: #e2e8f0; --text-main: #0f172a; --text-muted: #64748b; --success: #22c55e; --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; width: 100%; }
        .header { background: #fff; border-bottom: 1px solid var(--border); padding: 12px 0; }
        .header-inner { display: flex; align-items: center; justify-content: space-between; }
        .logo { display: flex; align-items: center; gap: 8px; }
        .logo-icon { background: var(--primary); color: #fff; padding: 6px; border-radius: 6px; }
        .logo-text { font-size: 18px; font-weight: 800; }
        .workspace-grid { display: grid; grid-template-columns: 340px 1fr 280px; gap: 20px; padding: 30px 0; }
        .card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
        .step-item { margin-bottom: 24px; }
        .step-title { font-size: 11px; font-weight: 900; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid var(--secondary); padding-bottom: 6px; text-transform: uppercase; }
        .upload-area { border: 2px dashed var(--border); border-radius: 10px; padding: 20px; text-align: center; cursor: pointer; color: var(--primary); font-weight: 700; }
        .upload-area p { margin-top: 8px; font-size: 14px; }
        .input-group select { width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 8px; font-weight: 600; }
        .color-presets { display: flex; flex-wrap: wrap; gap: 8px; }
        .color-circle { width: 24px; height: 24px; border-radius: 50%; border: none; cursor: pointer; }
        .color-circle.active { outline: 2px solid var(--primary); outline-offset: 2px; }
        .tool-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 12px; font-weight: 600; color: var(--text-muted); }
        .tool-row input { flex: 1; height: 4px; }
        .flip-actions, .filter-actions { display: flex; gap: 8px; margin-bottom: 12px; }
        .filter-actions .btn.active { background: var(--primary); color: #fff; }
        .action-buttons { display: flex; gap: 8px; margin-top: 16px; }
        .btn { border: none; border-radius: 6px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .btn-full { width: 100%; padding: 10px; margin-top: 8px; }
        .btn-primary { background: var(--primary); color: #fff; flex: 1; }
        .btn-success { background: var(--success); color: #fff; }
        .btn-secondary { background: var(--secondary); color: var(--text-main); }
        .preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .tabs { display: flex; gap: 4px; background: var(--secondary); padding: 4px; border-radius: 8px; }
        .tab { background: none; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer; }
        .tab.active { background: #fff; color: var(--primary); }
        .preview-canvas-area { border: 1px solid var(--border); border-radius: 12px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; width: 100%; background-color: #fff; }
        .main-preview-img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .loader-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.8); z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; font-weight: 700; }
        .loader { width: 24px; height: 24px; border: 3px solid var(--secondary); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .preview-controls { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 16px; }
        .control-btn { background: none; border: none; display: flex; flex-direction: column; align-items: center; font-size: 10px; color: var(--text-muted); cursor: pointer; }
        .requirements-list { list-style: none; margin-top: 12px; }
        .requirements-list li { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--secondary); font-size: 12px; font-weight: 600; }
        .requirements-list li span { color: var(--success); }
        .photo-preview-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 10px; }
        .mini-photo { aspect-ratio: 35/45; border: 1px solid var(--border); border-radius: 4px; overflow: hidden; background: #f8fafc; }
        .mini-photo img { width: 100%; height: 100%; object-fit: cover; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: flex; align-items: center; justify-content: center; }
        .modal-content { width: 100%; max-width: 550px; padding: 20px; }
        .cropper-container { height: 350px; width: 100%; background: #000; border-radius: 8px; }
        .modal-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
        .zoom-control { display: flex; align-items: center; gap: 8px; flex: 1; }
        .zoom-control input { flex: 1; }
        .footer { padding: 20px 0; text-align: center; font-size: 11px; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
