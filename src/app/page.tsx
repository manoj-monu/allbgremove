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
  // VERSION 4.1 - ORANGE THEME FORCE
  console.log('Passport Studio v4.1 - Orange Theme Active');
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
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); if (!ctx) return;
    const dpi = 300;
    canvas.width = 4 * dpi; canvas.height = 6 * dpi;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const pW = Math.round((35 * dpi) / 25.4), pH = Math.round((45 * dpi) / 25.4);
    const margin = Math.round((10 * dpi) / 25.4), gap = Math.round((4 * dpi) / 25.4);
    
    const img = new Image(); img.src = image; img.crossOrigin = "anonymous";
    img.onload = () => {
      // BLACK BOLD DASHED LINES
      ctx.setLineDash([25, 10]); ctx.strokeStyle = '#000000'; ctx.lineWidth = 2;
      for (let c = 0; c <= 3; c++) {
        const x = margin + c * (pW + gap) - gap/2;
        ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x, canvas.height - 10); ctx.stroke();
      }
      for (let r = 0; r <= 4; r++) {
        const y = margin + r * (pH + gap) - gap/2;
        ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(canvas.width - 10, y); ctx.stroke();
      }
      // MARGIN TEXT
      ctx.setLineDash([]); ctx.fillStyle = '#000'; ctx.font = 'bold 50px Arial';
      ctx.save(); ctx.translate(35, canvas.height/2); ctx.rotate(-Math.PI/2); ctx.textAlign='center'; ctx.fillText("PASSPORT PHOTOS", 0, 0); ctx.restore();
      ctx.save(); ctx.translate(canvas.width - 35, canvas.height/2); ctx.rotate(Math.PI/2); ctx.textAlign='center'; ctx.fillText("PRINT READY 4x6", 0, 0); ctx.restore();
      // DRAW PHOTOS
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 3; c++) {
          const x = margin + c * (pW + gap), y = margin + r * (pH + gap);
          ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.strokeRect(x, y, pW, pH);
          ctx.drawImage(img, x, y, pW, pH);
        }
      }
      setPrintPreview(canvas.toDataURL('image/png')); setShowPrintModal(true);
    };
  };

  return (
    <div style={{minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif'}}>
      <header style={{background: '#f97316', padding: '15px', textAlign: 'center', borderBottom: '4px solid #000'}}>
        <h1 style={{margin: 0, fontSize: '24px', color: '#fff'}}>LAB STUDIO v4.1 - ORANGE THEME</h1>
        <p style={{margin: '5px 0 0', fontWeight: 'bold', color: '#fff'}}>IF YOU SEE ORANGE, THIS IS THE NEW VERSION</p>
      </header>

      <main style={{maxWidth: '1100px', margin: '30px auto', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', padding: '0 20px'}}>
        <div style={{background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #ddd'}}>
          <button onClick={() => fileInputRef.current?.click()} style={{width: '100%', padding: '15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px'}}>1. UPLOAD PHOTO</button>
          <input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" />
          
          <div style={{marginBottom: '20px'}}>
            <p style={{fontWeight: 'bold', fontSize: '14px'}}>2. BACKGROUND COLOR</p>
            <div style={{display: 'flex', gap: '8px'}}>
              {['#ffffff', '#3b82f6', '#ef4444', '#10b981'].map(c => (
                <div key={c} onClick={() => setBgColor(c)} style={{width: '35px', height: '35px', borderRadius: '50%', background: c, border: bgColor===c?'3px solid #000':'1px solid #ddd', cursor: 'pointer'}}></div>
              ))}
            </div>
          </div>

          <button onClick={generateSheet} style={{width: '100%', padding: '15px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>3. PREVIEW & DOWNLOAD SHEET</button>
        </div>

        <div style={{background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #ddd', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
          {isProcessing && <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>AI IS PROCESSING...</div>}
          {image ? <img src={image} alt="Preview" style={{maxWidth: '100%', borderRadius: '8px'}} /> : <p style={{color: '#aaa'}}>Upload Photo to Start</p>}
        </div>
      </main>

      {showPrintModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
          <div style={{background: '#fff', padding: '20px', borderRadius: '15px', maxWidth: '850px', width: '100%'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}><h3>Final Lab Sheet</h3><X onClick={() => setShowPrintModal(false)} style={{cursor: 'pointer'}} /></div>
            <div style={{maxHeight: '70vh', overflowY: 'auto', background: '#000', padding: '30px', textAlign: 'center'}}>
              <img src={printPreview!} alt="Print" style={{width: '100%', border: '1px solid #fff'}} />
            </div>
            <button onClick={() => saveAs(printPreview!, 'Studio_Print_Sheet.png')} style={{width: '100%', padding: '18px', marginTop: '15px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'}}>DOWNLOAD NOW</button>
          </div>
        </div>
      )}

      {showCropper && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{background: '#fff', padding: '20px', borderRadius: '15px', width: '500px'}}>
            <h3>Crop Photo</h3>
            <div style={{height: '400px', position: 'relative', background: '#000'}}><Cropper image={transparentImage!} crop={crop} zoom={zoom} aspect={35/45} onCropChange={setCrop} onCropComplete={(a,p)=>setPArea(p)} onZoomChange={setZoom} /></div>
            <button onClick={applyCrop} style={{width: '100%', padding: '15px', marginTop: '15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'}}>CONFIRM CROP</button>
          </div>
        </div>
      )}
    </div>
  );
}
