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
  Maximize2
} from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Home() {
  // VERSION 4.2 - PILA (YELLOW) THEME - RED DASHED LINES
  console.log('Passport Studio v4.2 - Yellow Theme & Red Lines Active');
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

    // PROFESSIONAL PRINT SPECS (4x6 Inch @ 300 DPI)
    canvas.width = 1200;
    canvas.height = 1800;

    // 1. FILL WHITE BACKGROUND
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const outerPadding = 70;
    const gap = 25;
    const photoPadding = 12;
    const cols = 3;
    const rows = 4;

    // Calculate box dimensions
    const availableWidth = canvas.width - (outerPadding * 2) - (gap * (cols - 1));
    const boxW = availableWidth / cols;
    const availableHeight = canvas.height - (outerPadding * 2) - (gap * (rows - 1));
    const boxH = availableHeight / rows;

    const img = new Image();
    img.src = image;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // 2. DRAW GRID
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = outerPadding + c * (boxW + gap);
          const y = outerPadding + r * (boxH + gap);

          // Draw Dashed Box Border
          ctx.setLineDash([8, 6]);
          ctx.strokeStyle = '#888888';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, boxW, boxH);

          // Draw Image inside with Padding
          const drawX = x + photoPadding;
          const drawY = y + photoPadding;
          const drawW = boxW - (photoPadding * 2);
          const drawH = boxH - (photoPadding * 2);
          
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
        }
      }

      // 3. SIDE LABELS
      ctx.setLineDash([]);
      ctx.fillStyle = '#666666';
      ctx.font = 'bold 36px Arial';
      
      // Left Label
      ctx.save();
      ctx.translate(40, canvas.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText("PASSPORT SIZE PHOTOS", 0, 0);
      ctx.restore();

      // Right Label
      ctx.save();
      ctx.translate(canvas.width - 40, canvas.height / 2);
      ctx.rotate(Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText("PRINT READY 4x6", 0, 0);
      ctx.restore();

      setPrintPreview(canvas.toDataURL('image/png'));
      setShowPrintModal(true);
    };
  };

  return (
    <div style={{minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif'}}>
      <header style={{background: '#fbbf24', padding: '15px', textAlign: 'center', borderBottom: '4px solid #000'}}>
        <h1 style={{margin: 0, fontSize: '24px', color: '#000'}}>PASSPORT STUDIO v4.2 - PILA (YELLOW) THEME</h1>
        <p style={{margin: '5px 0 0', fontWeight: 'bold', color: '#000'}}>NEW DEPLOYMENT: RED DASHED LINES & 3MM MARGINS ACTIVE</p>
      </header>

      <main style={{maxWidth: '1100px', margin: '30px auto', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', padding: '0 20px'}}>
        <div style={{background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #ddd', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}>
          <button onClick={() => fileInputRef.current?.click()} style={{width: '100%', padding: '15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', transition: 'all 0.2s'}}>1. UPLOAD PHOTO</button>
          <input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" />
          
          <div style={{marginBottom: '20px'}}>
            <p style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '10px'}}>2. BACKGROUND COLOR</p>
            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
              {['#ffffff', '#3b82f6', '#ef4444', '#10b981', '#fbbf24', '#000000'].map(c => (
                <div key={c} onClick={() => setBgColor(c)} style={{width: '35px', height: '35px', borderRadius: '50%', background: c, border: bgColor===c?'3px solid #000':'1px solid #ddd', cursor: 'pointer', transition: 'transform 0.1s'}} onMouseEnter={(e) => e.currentTarget.style.transform='scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform='scale(1)'}></div>
              ))}
            </div>
          </div>

          <button onClick={generateSheet} disabled={!image} style={{width: '100%', padding: '15px', background: image ? '#22c55e' : '#94a3b8', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: image ? 'pointer' : 'not-allowed', boxShadow: image ? '0 4px 14px 0 rgba(34, 197, 94, 0.39)' : 'none'}}>3. PREVIEW & DOWNLOAD SHEET</button>
        </div>

        <div style={{background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #ddd', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}>
          {isProcessing && <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexDirection: 'column', gap: '10px'}}><div className="spinner"></div>AI IS PROCESSING...</div>}
          {image ? <img src={image} alt="Preview" style={{maxWidth: '100%', maxHeight: '600px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} /> : <div style={{textAlign: 'center', color: '#aaa'}}><ImageIcon size={48} style={{margin: '0 auto 10px'}} /><p>Upload Photo to Start</p></div>}
        </div>
      </main>

      {showPrintModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
          <div style={{background: '#fff', padding: '20px', borderRadius: '15px', maxWidth: '900px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}><h3 style={{margin: 0}}>Final Print Sheet (4x6 Inches)</h3><X onClick={() => setShowPrintModal(false)} style={{cursor: 'pointer'}} /></div>
            <p style={{fontSize: '12px', color: '#666', marginBottom: '10px'}}>Dashed lines indicate cutting paths. Red text is for verification and will be outside the photos.</p>
            <div style={{maxHeight: '65vh', overflowY: 'auto', background: '#333', padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
              <img src={printPreview!} alt="Print" style={{maxWidth: '100%', border: '2px solid #fff', boxShadow: '0 0 20px rgba(0,0,0,0.5)'}} />
            </div>
            <button onClick={() => saveAs(printPreview!, 'Passport_Sheet_4x6.png')} style={{width: '100%', padding: '18px', marginTop: '15px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px'}}>DOWNLOAD PRINT SHEET</button>
          </div>
        </div>
      )}

      {showCropper && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{background: '#fff', padding: '20px', borderRadius: '15px', width: '500px'}}>
            <h3 style={{marginTop: 0}}>Crop Photo (Passport Ratio)</h3>
            <div style={{height: '400px', position: 'relative', background: '#000', borderRadius: '8px', overflow: 'hidden'}}><Cropper image={transparentImage!} crop={crop} zoom={zoom} aspect={35/45} onCropChange={setCrop} onCropComplete={(a,p)=>setPArea(p)} onZoomChange={setZoom} /></div>
            <div style={{marginTop: '15px'}}>
              <p style={{fontSize: '12px', color: '#666', marginBottom: '5px'}}>Zoom to adjust head size</p>
              <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} style={{width: '100%'}} />
            </div>
            <button onClick={applyCrop} style={{width: '100%', padding: '15px', marginTop: '15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'}}>CONFIRM CROP</button>
          </div>
        </div>
      )}
      <style jsx>{`
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
