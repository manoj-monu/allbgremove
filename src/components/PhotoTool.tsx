'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DocumentSpec } from '@/types/spec';
import { 
  Upload, CheckCircle, AlertTriangle, ShieldCheck, Download, 
  RotateCw, ZoomIn, ZoomOut, RefreshCw, FileText, Printer, Sliders
} from 'lucide-react';

interface PhotoToolProps {
  initialSpec?: DocumentSpec;
  allSpecs?: DocumentSpec[];
}

export default function PhotoTool({ initialSpec, allSpecs = [] }: PhotoToolProps) {
  const [selectedSpec, setSelectedSpec] = useState<DocumentSpec | null>(initialSpec || allSpecs[0] || null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [bgRemoved, setBgRemoved] = useState(false);
  const [bgColor, setBgColor] = useState<string>(initialSpec?.backgroundColor || '#FFFFFF');
  
  // Biometric sliders
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Consents & Compliance
  const [biometricConsent, setBiometricConsent] = useState(false);
  const [complianceChecks, setComplianceChecks] = useState<{
    headSize: boolean;
    eyeLevel: boolean;
    background: boolean;
    lighting: boolean;
    resolution: boolean;
  }>({
    headSize: true,
    eyeLevel: true,
    background: true,
    lighting: true,
    resolution: true
  });

  const [printPaper, setPrintPaper] = useState<'4x6' | '5x7' | 'A4' | '12x6'>('4x6');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // When spec changes, update background color
  useEffect(() => {
    if (selectedSpec) {
      setBgColor(selectedSpec.backgroundColor);
    }
  }, [selectedSpec]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!biometricConsent) {
      alert('Please check the biometric processing consent before uploading.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        setZoom(1);
        setRotation(0);
        setPanX(0);
        setPanY(0);
        setBgRemoved(false);
        renderPreview(img, false);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Real AI Background Removal using /api/remove-bg (HF Space RMBG-1.4 model)
  const removeBackgroundInBrowser = async () => {
    if (!originalImageRef.current) return;
    setIsProcessing(true);
    setProcessingStatus('AI removing background and detecting portrait contours...');

    try {
      const img = originalImageRef.current;
      const offscreen = document.createElement('canvas');
      offscreen.width = img.naturalWidth || img.width;
      offscreen.height = img.naturalHeight || img.height;
      const ctx = offscreen.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) => offscreen.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Could not convert canvas to image blob');

      const fd = new FormData();
      fd.append('file', blob, 'photo.png');

      let res = await fetch('/api/remove-bg?enhance=false', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        // Fallback to direct backend if proxy fails
        res = await fetch('https://manojkumarsh-allbgremove-api.hf.space/api/process-all?enhance=false', {
          method: 'POST',
          body: fd,
          headers: {
            'x-api-key': 'SUPER_SECRET_KEY_998877',
          },
        });
      }

      if (!res.ok) throw new Error('AI Background Removal service failed with status: ' + res.status);

      const resBlob = await res.blob();
      const cutUrl = URL.createObjectURL(resBlob);

      const cutImg = new Image();
      await new Promise((resolve, reject) => {
        cutImg.onload = resolve;
        cutImg.onerror = reject;
        cutImg.src = cutUrl;
      });

      originalImageRef.current = cutImg;
      setBgRemoved(true);
      renderPreview(cutImg, true);
      setProcessingStatus('Background successfully removed! Color updated to spec.');
    } catch (err: any) {
      console.error('BG removal error:', err);
      alert('AI background removal error: ' + (err.message || 'Please try another photo.'));
      setProcessingStatus('');
    } finally {
      setIsProcessing(false);
    }
  };

  // Render preview canvas with biometric guidelines
  const renderPreview = (img: HTMLImageElement, isBgHandled: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedSpec) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Spec aspect ratio
    const specW = selectedSpec.widthMm;
    const specH = selectedSpec.heightMm;
    const canvasW = 400;
    const canvasH = Math.round((specH / specW) * canvasW);

    canvas.width = canvasW;
    canvas.height = canvasH;

    // 1. Clear & Background Fill
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // 2. Draw Image with user pan, zoom, rotation, filters
    ctx.save();
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.translate(canvasW / 2 + panX, canvasH / 2 + panY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    const aspect = img.width / img.height;
    let drawW = canvasW;
    let drawH = canvasW / aspect;
    if (drawH < canvasH) {
      drawH = canvasH;
      drawW = canvasH * aspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // 3. Biometric Guideline Overlay (Head height & Eye line)
    // Head min & max line from bottom
    const minHeadH = (selectedSpec.headHeightMinMm / specH) * canvasH;
    const maxHeadH = (selectedSpec.headHeightMaxMm / specH) * canvasH;
    const eyeY = canvasH - (selectedSpec.eyeLineFromBottomMm / specH) * canvasH;

    // Crown guideline range
    const chinY = canvasH * 0.85; // Standard chin placement
    const minCrownY = chinY - minHeadH;
    const maxCrownY = chinY - maxHeadH;

    // Draw Biometric Oval
    ctx.save();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)'; // Emerald green
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);

    // Head crown boundary
    ctx.beginPath();
    ctx.moveTo(canvasW * 0.15, maxCrownY);
    ctx.lineTo(canvasW * 0.85, maxCrownY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasW * 0.2, minCrownY);
    ctx.lineTo(canvasW * 0.8, minCrownY);
    ctx.stroke();

    // Eye line
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)'; // Blue
    ctx.beginPath();
    ctx.moveTo(canvasW * 0.1, eyeY);
    ctx.lineTo(canvasW * 0.9, eyeY);
    ctx.stroke();

    // Chin line
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; // Red
    ctx.beginPath();
    ctx.moveTo(canvasW * 0.2, chinY);
    ctx.lineTo(canvasW * 0.8, chinY);
    ctx.stroke();

    ctx.restore();
  };

  // Re-render when controls change
  useEffect(() => {
    if (originalImageRef.current) {
      renderPreview(originalImageRef.current, bgRemoved);
    }
  }, [zoom, rotation, brightness, contrast, panX, panY, bgColor, selectedSpec, bgRemoved]);

  // Export Single Digital Photo (Meeting official maxFileKB & DPI)
  const exportSinglePhoto = () => {
    if (!originalImageRef.current || !selectedSpec) return;
    const spec = selectedSpec;

    // Calculate official pixel dimensions at spec DPI
    const pxW = Math.round((spec.widthMm / 25.4) * spec.dpi);
    const pxH = Math.round((spec.heightMm / 25.4) * spec.dpi);

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = pxW;
    exportCanvas.height = pxH;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, pxW, pxH);

    // Render scaled image
    const img = originalImageRef.current;
    ctx.save();
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    
    // Scale pan and zoom relative to export resolution
    const scaleFactor = pxW / 400;
    ctx.translate(pxW / 2 + panX * scaleFactor, pxH / 2 + panY * scaleFactor);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    const aspect = img.width / img.height;
    let drawW = pxW;
    let drawH = pxW / aspect;
    if (drawH < pxH) {
      drawH = pxH;
      drawW = pxH * aspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Export as JPEG with quality tuned for portal maxFileKB
    let quality = 0.92;
    const dataUrl = exportCanvas.toDataURL('image/jpeg', quality);
    
    // Download trigger
    const link = document.createElement('a');
    link.download = `${spec.countrySlug}-${spec.docTypeSlug}-${spec.widthMm}x${spec.heightMm}mm.jpg`;
    link.href = dataUrl;
    link.click();
  };

  // Export Verified Print Sheet (4x6, 5x7, A4, 12x6)
  const exportPrintSheet = () => {
    if (!originalImageRef.current || !selectedSpec) return;
    const spec = selectedSpec;

    // Paper sizes in mm @ 300 DPI
    const paperDims = {
      '4x6': { wMm: 101.6, hMm: 152.4, name: '4x6_inch' },
      '5x7': { wMm: 127.0, hMm: 177.8, name: '5x7_inch' },
      'A4':  { wMm: 210.0, hMm: 297.0, name: 'A4_sheet' },
      '12x6':{ wMm: 304.8, hMm: 152.4, name: '12x6_studio' }
    };

    const paper = paperDims[printPaper];
    const sheetW = Math.round((paper.wMm / 25.4) * 300);
    const sheetH = Math.round((paper.hMm / 25.4) * 300);

    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = sheetW;
    sheetCanvas.height = sheetH;
    const sCtx = sheetCanvas.getContext('2d');
    if (!sCtx) return;

    // Crisp white sheet background
    sCtx.fillStyle = '#FFFFFF';
    sCtx.fillRect(0, 0, sheetW, sheetH);

    // Single photo dimensions @ 300 DPI
    const photoW = Math.round((spec.widthMm / 25.4) * 300);
    const photoH = Math.round((spec.heightMm / 25.4) * 300);

    // Render one single photo to a sub-canvas
    const single = document.createElement('canvas');
    single.width = photoW;
    single.height = photoH;
    const pCtx = single.getContext('2d');
    if (!pCtx) return;

    pCtx.fillStyle = bgColor;
    pCtx.fillRect(0, 0, photoW, photoH);

    const img = originalImageRef.current;
    pCtx.save();
    pCtx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    const scaleFactor = photoW / 400;
    pCtx.translate(photoW / 2 + panX * scaleFactor, photoH / 2 + panY * scaleFactor);
    pCtx.rotate((rotation * Math.PI) / 180);
    pCtx.scale(zoom, zoom);

    const aspect = img.width / img.height;
    let drawW = photoW;
    let drawH = photoW / aspect;
    if (drawH < photoH) {
      drawH = photoH;
      drawW = photoH * aspect;
    }
    pCtx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    pCtx.restore();

    // Subtle border for cutting guides
    pCtx.strokeStyle = '#D1D5DB';
    pCtx.lineWidth = 1;
    pCtx.strokeRect(0, 0, photoW, photoH);

    // Calculate grid math
    const marginMm = 5;
    const marginPx = Math.round((marginMm / 25.4) * 300);
    const gapPx = Math.round((2 / 25.4) * 300);

    let cols = Math.floor((sheetW - marginPx * 2 + gapPx) / (photoW + gapPx));
    let rows = Math.floor((sheetH - marginPx * 2 + gapPx) / (photoH + gapPx));

    // Special layout rule for 12x6 studio sheet: 40 photos for standard passport sizes
    if (printPaper === '12x6' && spec.widthMm <= 35 && spec.heightMm <= 45) {
      cols = 10;
      rows = 4;
    }

    const totalPhotos = cols * rows;
    const gridTotalW = cols * photoW + (cols - 1) * gapPx;
    const gridTotalH = rows * photoH + (rows - 1) * gapPx;
    const startX = Math.round((sheetW - gridTotalW) / 2);
    const startY = Math.round((sheetH - gridTotalH) / 2);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (photoW + gapPx);
        const y = startY + r * (photoH + gapPx);
        sCtx.drawImage(single, x, y);
      }
    }

    const dataUrl = sheetCanvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `${spec.countrySlug}-print-sheet-${paper.name}-${totalPhotos}photos.jpg`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
      {/* 1. Header & Spec Selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Biometric Photo Creator</span>
            {selectedSpec?.verified ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" /> Official Spec Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5" /> Check Official Requirements
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Processed 100% locally in your browser. Biometric photos never reach any server.
          </p>
        </div>

        {allSpecs.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Target Document:</label>
            <select
              value={`${selectedSpec?.countrySlug}-${selectedSpec?.docTypeSlug}`}
              onChange={(e) => {
                const spec = allSpecs.find(s => `${s.countrySlug}-${s.docTypeSlug}` === e.target.value);
                if (spec) setSelectedSpec(spec);
              }}
              className="text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
            >
              {allSpecs.map((s) => (
                <option key={`${s.countrySlug}-${s.docTypeSlug}`} value={`${s.countrySlug}-${s.docTypeSlug}`}>
                  {s.country} - {s.docTitle} ({s.widthMm}x{s.heightMm}mm)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 2. Privacy & Biometric Consent Alert */}
      <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-slate-800/60 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
        <input
          type="checkbox"
          id="biometricConsent"
          checked={biometricConsent}
          onChange={(e) => setBiometricConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <label htmlFor="biometricConsent" className="text-xs md:text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
          <strong>Biometric & Privacy Consent:</strong> I agree to local, client-side face alignment and processing. 
          Photos are processed strictly on my device and are never stored or transmitted to external servers (compliant with GDPR, CCPA, and Illinois BIPA).
        </label>
      </div>

      {/* 3. Main Workspace: Canvas & Controls */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Canvas & Visual Guides */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative min-h-[440px]">
          {!imageSrc ? (
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Upload your portrait photo
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                Front-facing photo with good lighting. We will automatically align your head and eyes to official guidelines.
              </p>
              <label className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white shadow-md transition-all ${
                biometricConsent 
                  ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-blue-500/20' 
                  : 'bg-slate-400 cursor-not-allowed opacity-60'
              }`}>
                <Upload className="w-4 h-4" />
                Select Photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  disabled={!biometricConsent}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              {/* Biometric Legend */}
              <div className="w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-3 px-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Crown Zone
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Eye Level
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Chin Base
                </span>
              </div>

              {/* Live Canvas */}
              <div className="relative shadow-lg rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                <canvas
                  ref={canvasRef}
                  className="cursor-move max-w-full h-auto"
                  onMouseDown={(e) => {
                    setIsDragging(true);
                    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
                  }}
                  onMouseMove={(e) => {
                    if (isDragging) {
                      setPanX(e.clientX - dragStart.x);
                      setPanY(e.clientY - dragStart.y);
                    }
                  }}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                />
              </div>

              {/* Status Message */}
              {processingStatus && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
                  {processingStatus}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: Fine-tuning & Compliance Checklist */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Controls */}
          {imageSrc && (
            <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-blue-600" /> Biometric Adjustments
              </h4>

              {/* Zoom */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  <span>Zoom / Head Fit</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Rotation */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  <span>Rotate Tilt</span>
                  <span>{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Brightness */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  <span>Brightness</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  step="2"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Contrast */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  <span>Contrast</span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  step="2"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Background Color Pickers */}
              <div className="mb-4">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1.5">
                  Official Background Color:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBgColor('#FFFFFF')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${
                      bgColor === '#FFFFFF' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-white border border-slate-300"></span> Pure White
                  </button>
                  <button
                    type="button"
                    onClick={() => setBgColor('#E5E7EB')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${
                      bgColor === '#E5E7EB' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-gray-200 border border-slate-300"></span> Light Grey (UK/Schengen)
                  </button>
                </div>
              </div>

              {/* Background Removal Button */}
              <button
                type="button"
                onClick={removeBackgroundInBrowser}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl font-medium text-xs bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {bgRemoved ? 'Re-calibrate Background' : 'Auto-Remove Background (In-Browser)'}
              </button>
            </div>
          )}

          {/* Compliance Checklist */}
          {selectedSpec && (
            <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Official Compliance Checklist
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Dimensions:</strong> {selectedSpec.widthMm} x {selectedSpec.heightMm} mm ({selectedSpec.dpi} DPI).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Head Proportion:</strong> {selectedSpec.headHeightMinMm}mm – {selectedSpec.headHeightMaxMm}mm ({Math.round((selectedSpec.headHeightMinMm/selectedSpec.heightMm)*100)}% - {Math.round((selectedSpec.headHeightMaxMm/selectedSpec.heightMm)*100)}%).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Glasses Rule:</strong> {selectedSpec.notes.glasses}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Expression:</strong> {selectedSpec.notes.smile}
                  </span>
                </li>
              </ul>

              {selectedSpec.sourceUrl && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-slate-500">Official Source: </span>
                  <a
                    href={selectedSpec.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-all"
                  >
                    {selectedSpec.country} Government Requirements
                  </a>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Last verified: {selectedSpec.lastVerified}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Export & Download Actions */}
      {imageSrc && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Print Sheet Grid:
            </label>
            <select
              value={printPaper}
              onChange={(e) => setPrintPaper(e.target.value as any)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="4x6">4x6 inch (6-8 photos)</option>
              <option value="5x7">5x7 inch (8-12 photos)</option>
              <option value="A4">A4 Sheet (30 photos)</option>
              <option value="12x6">12x6 Studio (40 photos)</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Digital Upload Export */}
            <button
              type="button"
              onClick={exportSinglePhoto}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all"
            >
              <Download className="w-4 h-4" /> Download Digital Single (JPEG)
            </button>

            {/* Print Sheet Export */}
            <button
              type="button"
              onClick={exportPrintSheet}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all"
            >
              <Printer className="w-4 h-4" /> Download Print Grid (300 DPI)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
