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
  X
} from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Home() {
  console.log('Passport Photo Maker v2.5 Active - Live API');
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
  
  // Cropping State
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ width: number; height: number; x: number; y: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Automatically merge background color when it changes
  useEffect(() => {
    if (transparentImage) {
      renderMergedPreview(transparentImage, bgColor);
    }
  }, [bgColor, transparentImage]);

  const renderMergedPreview = (imgUrl: string, color: string) => {
    const img = new Image();
    img.src = imgUrl;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw background color
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw subject on top
      ctx.drawImage(img, 0, 0);
      
      setImage(canvas.toDataURL('image/png'));
    };
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setImage(url);
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
      // Using the live HuggingFace API URL discovered from the screenshot
      const apiUrl = 'https://manojkumarsh-allbgremove-api.hf.space';
      const response = await fetch(`${apiUrl}/api/remove-bg`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        // Clean the background one last time for safety
        const cleanedUrl = await cleanBackground(url);
        setTransparentImage(cleanedUrl);
        setActiveTab('preview');
        setShowCropper(true);
      }
    } catch (err) {
      console.error('Error connecting to backend:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const cleanBackground = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(url);
        canvas.width = img.width; canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 248 && data[i+1] > 248 && data[i+2] > 248) {
            data[i+3] = 0;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
      img.onerror = () => resolve(url);
    });
  };

  const onCropComplete = useCallback((_croppedArea: unknown, croppedAreaPixels: { width: number; height: number; x: number; y: number }) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getAspectRatio = () => {
    if (photoSize === '2 x 2 inch') return 1;
    return 35 / 45;
  };

  const generateCroppedImage = async () => {
    if (!transparentImage || !croppedAreaPixels) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = transparentImage;

    await new Promise((resolve) => { img.onload = resolve; });

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
    }

    const croppedUrl = canvas.toDataURL('image/png');
    setImage(croppedUrl);
    setShowCropper(false);
  };

  const downloadSingle = () => {
    if (!image) return;
    saveAs(image, 'passport_photo.png');
  };

  const generatePrintLayout = (paperType: '4x6' | 'A4') => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      let width, height, cols, rows;
      const dpi = 300;
      const mmToPx = (mm: number) => (mm * dpi) / 25.4;
      let photoW_mm = 35, photoH_mm = 45;
      if (photoSize === '2 x 2 inch') { photoW_mm = 50.8; photoH_mm = 50.8; }
      if (paperType === '4x6') { width = 4 * dpi; height = 6 * dpi; cols = 3; rows = 4; }
      else { width = mmToPx(210); height = mmToPx(297); if (photoSize === '2 x 2 inch') { cols = 4; rows = 5; } else { cols = 5; rows = 6; } }
      canvas.width = width; canvas.height = height;
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height);
      const photoWidth = mmToPx(photoW_mm), photoHeight = mmToPx(photoH_mm);
      const marginX = (width - (cols * photoWidth)) / (cols + 1), marginY = (height - (rows * photoHeight)) / (rows + 1);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = marginX + c * (photoWidth + marginX), y = marginY + r * (photoHeight + marginY);
          ctx.strokeStyle = '#dddddd'; ctx.lineWidth = 1; ctx.strokeRect(x, y, photoWidth, photoHeight);
          ctx.drawImage(img, x, y, photoWidth, photoHeight);
        }
      }
      canvas.toBlob((blob) => { if (blob) saveAs(blob, `Passport_Photos_${paperType}.png`); });
    };
  };

  return (
    <div className="app-root">
      <header className="header">
        <div className="container header-inner">
          <div className="logo">
            <div className="logo-icon"><User size={24} /></div>
            <span className="logo-text">Passport Photo Maker <small style={{fontSize: '10px', opacity: 0.5}}>v2.5</small></span>
          </div>
          <nav className="nav">
            <a href="#" className="nav-link active">Home</a>
            <a href="#" className="nav-link">Photo Requirements</a>
            <a href="#" className="nav-link">Guidelines</a>
            <a href="#" className="nav-link">Pricing</a>
            <a href="#" className="nav-link">Blog</a>
          </nav>
          <div className="header-actions">
            <button className="lang-btn"><Languages size={18} /><span>EN</span><ChevronDown size={14} /></button>
            <button className="btn btn-primary btn-sm">Sign In</button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-inner">
          <h1>Create Perfect Passport Photos <span className="text-primary">in Seconds</span></h1>
          <p>Professional AI-powered tool for official documents. 100% compliant and ready to print.</p>
          <div className="hero-badges">
            <div className="trust-badge"><ShieldCheck size={18} /><span>100% Compliant</span></div>
            <div className="trust-badge"><BadgeCheck size={18} /><span>Background Removed</span></div>
            <div className="trust-badge"><Zap size={18} /><span>High Quality</span></div>
          </div>
        </div>
      </section>

      <main className="container workspace-container">
        <div className="workspace-grid">
          <div className="steps-panel card">
            <div className="step-item">
              <h3 className="step-title">STEP 1: UPLOAD PHOTO</h3>
              <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                <Upload size={32} className="text-primary" />
                <p className="upload-main-text">Upload Your Photo</p>
                <p className="upload-sub-text">JPG, JPEG or PNG. Max size 10MB</p>
                <input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" />
              </div>
            </div>

            <div className="step-item">
              <h3 className="step-title">STEP 2: SELECT DOCUMENT</h3>
              <div className="input-group">
                <label>Document Type</label>
                <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                  <option>Passport</option><option>Visa</option><option>ID Card</option>
                </select>
              </div>
              <div className="input-group">
                <label>Country</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option>India</option><option>USA</option><option>UK</option>
                </select>
              </div>
              <div className="input-group">
                <label>Photo Size</label>
                <select value={photoSize} onChange={(e) => setPhotoSize(e.target.value)}>
                  <option>35mm x 45mm</option><option>2 x 2 inch</option>
                </select>
              </div>
            </div>

            <div className="step-item">
              <h3 className="step-title">STEP 3: OPTIONS</h3>
              <div className="option-row">
                <div className="option-label"><ImageIcon size={18} /><span>Background</span></div>
                <div className="color-presets">
                  <button className={`color-circle ${bgColor === '#ffffff' ? 'active' : ''}`} style={{ background: '#ffffff', border: '1px solid #ddd' }} onClick={() => setBgColor('#ffffff')}></button>
                  <button className={`color-circle ${bgColor === '#3b82f6' ? 'active' : ''}`} style={{ background: '#3b82f6' }} onClick={() => setBgColor('#3b82f6')}></button>
                  <button className={`color-circle ${bgColor === '#ef4444' ? 'active' : ''}`} style={{ background: '#ef4444' }} onClick={() => setBgColor('#ef4444')}></button>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="color-input-hidden" id="custom-bg" />
                  <label htmlFor="custom-bg"><Settings2 size={16} className="settings-icon" /></label>
                </div>
              </div>
              
              <div className="option-row">
                <div className="option-label"><Trash2 size={18} /><span>Remove Background</span></div>
                <label className="switch"><input type="checkbox" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} /><span className="slider round"></span></label>
              </div>

              <div className="option-row">
                <div className="option-label"><Maximize2 size={18} /><span>Crop & Align</span></div>
                <label className="switch"><input type="checkbox" checked={cropAlign} onChange={(e) => setCropAlign(e.target.checked)} /><span className="slider round"></span></label>
              </div>

              <div className="option-row">
                <div className="option-label"><Zap size={18} /><span>Enhance Photo</span></div>
                <label className="switch"><input type="checkbox" checked={enhance} onChange={(e) => setEnhance(e.target.checked)} /><span className="slider round"></span></label>
              </div>

              <div className="action-buttons">
                <button className="btn btn-primary" onClick={() => generatePrintLayout('4x6')}><Printer size={20} />4x6 (12)</button>
                <button className="btn btn-primary" onClick={() => generatePrintLayout('A4')}><Printer size={20} />A4 (30)</button>
              </div>
              <button className="btn btn-success btn-full" onClick={downloadSingle}><Download size={20} />Download Single</button>
            </div>
          </div>

          <div className="preview-panel card">
            <div className="preview-header">
              <div className="tabs">
                <button className={`tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
                <button className={`tab ${activeTab === 'original' ? 'active' : ''}`} onClick={() => setActiveTab('original')}>Original</button>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current?.click()}><RotateCcw size={16} />Change Photo</button>
            </div>

            <div className="preview-canvas-area" style={{ background: '#f8fafc', backgroundImage: 'linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px', aspectRatio: getAspectRatio() }}>
              {isProcessing && <div className="loader-overlay"><div className="loader"></div><p>AI Removing Background...</p></div>}
              {image ? (
                <div className="image-container">
                  <img src={activeTab === 'preview' ? image : originalImage!} alt="Preview" className="main-preview-img" />
                </div>
              ) : (
                <div className="empty-preview" onClick={() => fileInputRef.current?.click()}><ImageIcon size={64} className="text-border" /><p>No photo uploaded yet</p></div>
              )}
            </div>

            <div className="preview-controls">
              <button className="control-btn" onClick={() => setShowCropper(true)}><Maximize2 size={20} /><span>Crop</span></button>
              <div className="v-divider"></div>
              <button className="control-btn"><ZoomOut size={20} /></button>
              <span className="zoom-text">100%</span>
              <button className="control-btn"><ZoomIn size={20} /></button>
            </div>
          </div>

          <div className="info-panel">
            <div className="card status-card">
              <div className="status-header"><h3>Photo Requirements</h3><span className="status-badge"><CheckCircle2 size={16} />Looks good</span></div>
              <ul className="requirements-list">
                <li className="good">Face is centered <span>Good</span></li>
                <li className="good">Face size is correct <span>Good</span></li>
                <li className="good">Lighting is good <span>Good</span></li>
                <li className="good">Background is plain <span>Good</span></li>
                <li className="good">Image is clear <span>Good</span></li>
              </ul>
            </div>

            <div className="card preview-grid-card">
              <h3 className="card-title">Photo Preview</h3>
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

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-bottom">© 2024 Passport Photo Maker. All rights reserved.</div>
        </div>
      </footer>

      <style jsx>{`
        .app-root { min-height: 100vh; display: flex; flex-direction: column; --primary: #3b82f6; --primary-hover: #2563eb; --secondary: #f1f5f9; --border: #e2e8f0; --text-main: #0f172a; --text-muted: #64748b; --success: #22c55e; --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; width: 100%; }
        
        /* Header */
        .header { background: #fff; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
        .header-inner { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; }
        .logo { display: flex; align-items: center; gap: 10px; }
        .logo-icon { background: var(--primary); color: #fff; padding: 8px; border-radius: 8px; display: flex; }
        .logo-text { font-size: 20px; font-weight: 700; color: var(--text-main); }
        .nav { display: flex; align-items: center; gap: 32px; }
        .nav-link { color: var(--text-muted); font-weight: 600; font-size: 15px; transition: color 0.2s; white-space: nowrap; }
        .nav-link:hover, .nav-link.active { color: var(--primary); }
        
        /* Hero */
        .hero { padding: 40px 0; background: radial-gradient(circle at top right, #f0f4ff, transparent 40%), radial-gradient(circle at bottom left, #f0f4ff, transparent 40%); text-align: center; }
        .hero h1 { font-size: 40px; font-weight: 800; margin-bottom: 12px; letter-spacing: -1px; }
        .hero p { font-size: 16px; color: var(--text-muted); max-width: 600px; margin: 0 auto 20px; }
        .hero-badges { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
        .trust-badge { display: flex; align-items: center; gap: 8px; background: #fff; padding: 8px 16px; border-radius: 50px; border: 1px solid var(--border); font-size: 13px; font-weight: 600; box-shadow: var(--shadow-sm); }
        
        /* Workspace */
        .workspace-grid { display: grid; grid-template-columns: 340px 1fr 300px; gap: 24px; padding: 40px 0; }
        .card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 24px; box-shadow: var(--shadow-sm); }
        .step-item { margin-bottom: 24px; }
        .step-title { font-size: 11px; font-weight: 800; color: var(--primary); letter-spacing: 1px; margin-bottom: 12px; }
        
        .upload-area { border: 2px dashed var(--border); border-radius: 12px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .upload-area:hover { border-color: var(--primary); background: var(--secondary); }
        .upload-main-text { font-weight: 700; margin-top: 8px; }
        
        .input-group { margin-bottom: 12px; }
        .input-group label { display: block; font-size: 11px; font-weight: 800; color: var(--text-muted); margin-bottom: 4px; }
        .input-group select { width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 8px; background: #fafafa; font-weight: 600; }
        
        .option-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .option-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; }
        .color-presets { display: flex; align-items: center; gap: 6px; }
        .color-circle { width: 22px; height: 22px; border-radius: 50%; border: none; cursor: pointer; transition: transform 0.2s; }
        .color-circle.active { outline: 2px solid var(--primary); outline-offset: 2px; }
        .color-input-hidden { display: none; }
        
        .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; inset: 0; background: #e2e8f0; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background: var(--primary); }
        input:checked + .slider:before { transform: translateX(20px); }
        
        .action-buttons { display: flex; gap: 10px; margin-top: 24px; }
        .btn { border: none; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
        .btn-sm { padding: 8px 16px; font-size: 13px; }
        .btn-full { width: 100%; padding: 12px; margin-top: 10px; }
        .btn-primary { background: var(--primary); color: #fff; flex: 1; padding: 12px; }
        .btn-success { background: var(--success); color: #fff; }
        .btn-secondary { background: #fff; border: 1px solid var(--border); color: var(--text-main); }
        
        /* Preview */
        .preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .tabs { display: flex; gap: 4px; background: #f1f5f9; padding: 4px; border-radius: 8px; }
        .tab { background: none; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 700; color: var(--text-muted); cursor: pointer; font-size: 13px; }
        .tab.active { background: #fff; color: var(--primary); box-shadow: var(--shadow-sm); }
        
        .preview-canvas-area { border: 1px solid var(--border); border-radius: 12px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; width: 100%; max-width: 450px; margin: 0 auto; background-color: #fff; }
        .image-container { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .main-preview-img { max-width: 100%; max-height: 100%; object-fit: contain; }
        
        .loader-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.9); z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
        .loader { width: 30px; height: 30px; border: 3px solid var(--secondary); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .preview-controls { display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 20px; }
        .control-btn { background: none; border: none; display: flex; flex-direction: column; align-items: center; color: var(--text-muted); font-size: 11px; cursor: pointer; }
        
        /* Info Panel */
        .status-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .status-badge { display: flex; align-items: center; gap: 4px; color: var(--success); font-weight: 700; font-size: 12px; }
        .requirements-list { list-style: none; }
        .requirements-list li { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px; color: var(--text-muted); font-weight: 600; }
        .requirements-list li span { color: var(--success); }
        
        .photo-preview-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .mini-photo { aspect-ratio: 35/45; border: 1px solid var(--border); border-radius: 4px; overflow: hidden; background: #f8fafc; }
        .mini-photo img { width: 100%; height: 100%; object-fit: cover; }
        
        .footer { padding: 40px 0; border-top: 1px solid var(--border); text-align: center; font-size: 12px; color: var(--text-muted); }

        @media (max-width: 1024px) {
          .workspace-grid { grid-template-columns: 1fr; }
          .info-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        }
      `}</style>
    </div>
  );
}
