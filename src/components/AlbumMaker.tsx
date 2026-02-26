"use client";
import React, { useState, useRef, useEffect } from "react";
import { useCallback } from "react";
import Cropper from "react-easy-crop";
import html2canvas from "html2canvas";
import { ArrowLeft, Printer, Download, Settings2, Image as ImageIcon, Layout as LayoutIcon, Camera } from "lucide-react";

interface AlbumMakerProps {
    imageUrl: string;
    onBack: () => void;
}

const colors = [
    { name: 'White', value: '#FFFFFF' }, { name: 'Black', value: '#1A1A1A' },
    { name: 'Gold', value: '#FFD700' }, { name: 'Silver', value: '#E0E0E0' },
    { name: 'Oak', value: '#8b5a2b' }, { name: 'Walnut', value: '#3e2723' },
    { name: 'Rose', value: '#B76E79' }, { name: 'Navy', value: '#000080' },
    { name: 'Crimson', value: '#DC143C' }, { name: 'Teal', value: '#008080' },
    { name: 'Pink', value: '#FFD1DC' }, { name: 'Mint', value: '#98FF98' },
    { name: 'Lavender', value: '#E6E6FA' }, { name: 'Peach', value: '#FFE5B4' }
];

const styles = [
    { name: 'Solid', value: 'solid', thickness: 15 },
    { name: 'Double', value: 'double', thickness: 20 },
    { name: 'Ridge', value: 'ridge', thickness: 25 },
    { name: 'Groove', value: 'groove', thickness: 25 },
    { name: 'Inset', value: 'inset', thickness: 15 },
    { name: 'Outset', value: 'outset', thickness: 15 },
    { name: 'Dashed', value: 'dashed', thickness: 10 },
    { name: 'Dotted', value: 'dotted', thickness: 12 }
];

const svg3DWoodLove = `data:image/svg+xml;utf8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
  <defs>
    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4e311b"/>
      <stop offset="30%" stop-color="#694326"/>
      <stop offset="70%" stop-color="#3d2412"/>
      <stop offset="100%" stop-color="#54331a"/>
    </linearGradient>
    <filter id="drop"><feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.8"/></filter>
    <filter id="inner"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.9" flood-color="#000"/></filter>
  </defs>
  <!-- Outer wood frame with drop shadow and cutout -->
  <path d="M0,0 h100 v100 h-100 Z M12,12 v63 h76 v-63 Z" fill="url(#wood)" fill-rule="evenodd" filter="url(#drop)"/>
  
  <!-- Inner dark border for depth -->
  <path d="M11,11 h78 v65 h-78 Z M12,12 v63 h76 v-63 Z" fill="#1a0f07" fill-rule="evenodd"/>
  
  <!-- 3D Heart 1 -->
  <path d="M22,87 A4,4 0 0,1 26,83 A4,4 0 0,1 30,87 Q30,93 26,97 Q22,93 22,87 Z" fill="#e11d48" filter="url(#drop)"/>
  
  <!-- 3D Heart 2 -->
  <path d="M70,87 A4,4 0 0,1 74,83 A4,4 0 0,1 78,87 Q78,93 74,97 Q70,93 70,87 Z" fill="#e11d48" filter="url(#drop)"/>
  
  <!-- LOVE Text -->
  <text x="50" y="93" font-family="'Arial Black', sans-serif" font-size="12" font-weight="900" fill="#ffd700" letter-spacing="3" text-anchor="middle" filter="url(#drop)">LOVE</text>
  
  <!-- Glass Reflection overlay on photo area -->
  <path d="M12,12 L35,12 L12,35 Z" fill="#ffffff" opacity="0.15"/>
</svg>`);

const svg3DFamily = `data:image/svg+xml;utf8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
  <defs>
    <linearGradient id="wht" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e4e4e7"/>
    </linearGradient>
    <filter id="sh"><feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.4"/></filter>
  </defs>
  
  <!-- Bevel border frame -->
  <path d="M0,0 h100 v100 h-100 Z M8,22 v70 h84 v-70 Z" fill="url(#wht)" fill-rule="evenodd" filter="url(#sh)"/>
  <path d="M6,20 h88 v74 h-88 Z M8,22 v70 h84 v-70 Z" fill="#d4d4d8" fill-rule="evenodd"/>
  
  <text x="50" y="14" font-family="'Trebuchet MS', sans-serif" font-size="8" font-weight="900" text-anchor="middle" fill="#27272a" letter-spacing="4" filter="url(#sh)">FAMILY</text>
  
  <!-- Greenery aesthetic -->
  <path d="M25,12 Q30,6 35,12 Q30,18 25,12" fill="#166534" filter="url(#sh)"/>
  <path d="M75,12 Q70,6 65,12 Q70,18 75,12" fill="#166534" filter="url(#sh)"/>
</svg>`);

const svg3DGold = `data:image/svg+xml;utf8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
  <defs>
    <linearGradient id="gld" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#bf953f"/>
      <stop offset="25%" stop-color="#fcf6ba"/>
      <stop offset="50%" stop-color="#b38728"/>
      <stop offset="75%" stop-color="#fbf5b7"/>
      <stop offset="100%" stop-color="#aa771c"/>
    </linearGradient>
    <filter id="gldsh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1" dy="4" stdDeviation="4" flood-opacity="0.9"/>
    </filter>
  </defs>
  <!-- Main thick golden border -->
  <path d="M0,0 h100 v100 h-100 Z M18,18 v64 h64 v-64 Z" fill="url(#gld)" fill-rule="evenodd" filter="url(#gldsh)"/>
  
  <!-- Corner Ornaments (Round rivets) -->
  <circle cx="9" cy="9" r="3" fill="url(#gld)" filter="url(#gldsh)"/>
  <circle cx="91" cy="9" r="3" fill="url(#gld)" filter="url(#gldsh)"/>
  <circle cx="9" cy="91" r="3" fill="url(#gld)" filter="url(#gldsh)"/>
  <circle cx="91" cy="91" r="3" fill="url(#gld)" filter="url(#gldsh)"/>
  
  <!-- Stepped inner ridge -->
  <path d="M15,15 h70 v70 h-70 Z M18,18 v64 h64 v-64 Z" fill="#785311" fill-rule="evenodd"/>
</svg>`);

export type AlbumFrameType = { id: string, name: string, getStyle: () => React.CSSProperties, overlayUrl?: string };

const ALBUM_FRAMES: AlbumFrameType[] = [
    { id: 'none', name: 'No Custom Frame', getStyle: () => ({}) },
    { id: 'real-wood-love', name: '3D Romantic Wood', getStyle: () => ({ padding: "12% 12% 25% 12%" }), overlayUrl: svg3DWoodLove },
    { id: 'real-family', name: '3D Classic Family', getStyle: () => ({ padding: "22% 8% 8% 8%" }), overlayUrl: svg3DFamily },
    { id: 'real-gold', name: '3D Royal Gold Ornate', getStyle: () => ({ padding: "18%" }), overlayUrl: svg3DGold },
    { id: 'polaroid', name: 'Classic Polaroid', getStyle: () => ({ border: "16px solid white", borderBottom: "60px solid white", boxShadow: "0 10px 20px rgba(0,0,0,0.4)", backgroundColor: "white" }) }
];

colors.forEach(c => {
    styles.forEach(s => {
        ALBUM_FRAMES.push({
            id: `${s.name.toLowerCase()}-${c.name.toLowerCase()}`,
            name: `${s.name} ${c.name}`,
            getStyle: () => ({ borderStyle: s.value as React.CSSProperties["borderStyle"], borderColor: c.value, borderWidth: `${s.thickness}px`, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" })
        });
    });
    ALBUM_FRAMES.push({
        id: `matte-${c.name.toLowerCase()}`,
        name: `${c.name} Gallery Matte`,
        getStyle: () => ({ padding: `20px`, backgroundColor: c.value, border: `3px solid #333`, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" })
    });
});


const PAPER_SIZES = [
    { name: "A4 (21 x 29.7 cm)", width: 21, height: 29.7, unit: "cm" },
    { name: "4x6 inches", width: 4, height: 6, unit: "in" },
    { name: "8x10 inches", width: 8, height: 10, unit: "in" },
    { name: "Custom", width: 21, height: 29.7, unit: "cm" }
];

export default function AlbumMaker({ imageUrl, onBack }: AlbumMakerProps) {
    const [step, setStep] = useState<"crop" | "layout">("crop");
    const [selectedFrameId, setSelectedFrameId] = useState("none");

    // Crop State
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    // Photo Dimensions (Default: typical Indian passport 3.5 x 4.5 cm)
    const [photoWidth, setPhotoWidth] = useState(3.5);
    const [photoHeight, setPhotoHeight] = useState(4.5);
    const [unit, setUnit] = useState<"cm" | "in">("cm");
    const [copies, setCopies] = useState<number>(0); // 0 = Auto-fill

    // Layout State
    const [paperSize, setPaperSize] = useState(PAPER_SIZES[0]);
    const [margin, setMargin] = useState(1.0); // 1cm margin
    const [gap, setGap] = useState(0.4); // 4mm gap
    const [borderWidth, setBorderWidth] = useState(2); // px
    const [borderColor, setBorderColor] = useState("#000000");

    // Adjustments
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);

    const previewContainerRef = useRef<HTMLDivElement>(null);
    const [previewScale, setPreviewScale] = useState(1);

    const onCropComplete = useCallback((croppedArea: { x: number, y: number, width: number, height: number }, croppedAreaPixels: { x: number, y: number, width: number, height: number }) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createCroppedImage = async () => {
        if (!croppedAreaPixels) return;
        try {
            const image = new window.Image();
            image.crossOrigin = "anonymous";
            image.src = imageUrl;
            await new Promise((resolve) => { image.onload = resolve; });

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            setCroppedImage(canvas.toDataURL("image/png", 1.0));
            setStep("layout");
        } catch (e) {
            console.error(e);
        }
    };

    // Helper functions for layout calculation
    // Conversions: 1 inch = 2.54 cm. We will render preview at somewhat 96 DPI scale for screen
    const DPcm = 37.7952755906; // dots per cm approx (96 DPI)

    const paperWidthPx = paperSize.unit === "cm" ? paperSize.width * DPcm : paperSize.width * 2.54 * DPcm;
    const paperHeightPx = paperSize.unit === "cm" ? paperSize.height * DPcm : paperSize.height * 2.54 * DPcm;

    // Real Photo unit calculations
    const photoWidthPx = unit === "cm" ? photoWidth * DPcm : photoWidth * 2.54 * DPcm;
    const photoHeightPx = unit === "cm" ? photoHeight * DPcm : photoHeight * 2.54 * DPcm;

    const marginPx = unit === "cm" ? margin * DPcm : margin * 2.54 * DPcm;
    const gapPx = unit === "cm" ? gap * DPcm : gap * 2.54 * DPcm;

    // Calculate how many photos fit
    const availableWidth = paperWidthPx - (marginPx * 2);
    const availableHeight = paperHeightPx - (marginPx * 2);

    const cols = Math.floor((availableWidth + gapPx) / (photoWidthPx + gapPx));
    const rows = Math.floor((availableHeight + gapPx) / (photoHeightPx + gapPx));
    const totalPhotos = Math.max(0, cols * rows);
    const renderedPhotos = copies > 0 ? Math.min(copies, totalPhotos) : totalPhotos;

    useEffect(() => {
        if (step !== "layout") return;

        const updateScale = () => {
            if (!previewContainerRef.current) return;
            const cw = previewContainerRef.current.clientWidth - 40; // internal container padding
            const ch = previewContainerRef.current.clientHeight - 40;
            const scaleW = cw / paperWidthPx;
            const scaleH = ch / paperHeightPx;
            setPreviewScale(Math.min(scaleW, scaleH, 1));
        };

        updateScale();
        const timeoutId = setTimeout(updateScale, 50); // Frame delay specifically for initial render bounds
        window.addEventListener("resize", updateScale);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("resize", updateScale);
        };
    }, [step, paperWidthPx, paperHeightPx]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadSheet = async () => {
        if (!croppedImage) return;

        const paper = document.getElementById("printable-paper");
        if (!paper) return;

        // Temporarily reset zoom to natively capture 100% full quality sheet with absolute positions disabled
        const oldTransform = paper.style.transform;
        const oldLeft = paper.style.left;
        const oldTop = paper.style.top;

        paper.style.transform = "none";
        paper.style.left = "0px";
        paper.style.top = "0px";

        try {
            const canvas = await html2canvas(paper, {
                scale: 3, // High DPI capture for print readiness
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
            });

            const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "album_sheet.jpg";
            link.click();
        } catch (e) {
            console.error("Failed to capture album frame:", e);
        } finally {
            // Restore visual layout
            paper.style.transform = oldTransform;
            paper.style.left = oldLeft;
            paper.style.top = oldTop;
        }
    };


    if (step === "crop") {
        return (
            <div className="w-full flex flex-col items-center max-w-5xl mx-auto animate-in fade-in zoom-in-95 mt-4">
                <div className="w-full flex justify-between items-center mb-6">
                    <button onClick={onBack} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors font-medium">
                        <ArrowLeft className="w-5 h-5" /> Back to Editor
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 p-2 rounded-xl">
                            <span className="text-xs text-neutral-400 pl-2">Size</span>
                            <input type="number" step="0.1" value={photoWidth} onChange={e => setPhotoWidth(Number(e.target.value))} className="w-16 bg-neutral-800 text-white rounded outline-none px-2 py-1 text-sm text-center focus:border-blue-500 border border-transparent" />
                            <span className="text-xs text-neutral-500">x</span>
                            <input type="number" step="0.1" value={photoHeight} onChange={e => setPhotoHeight(Number(e.target.value))} className="w-16 bg-neutral-800 text-white rounded outline-none px-2 py-1 text-sm text-center focus:border-blue-500 border border-transparent" />
                            <select value={unit} onChange={(e) => setUnit(e.target.value as "cm" | "in")} className="bg-transparent text-white text-xs outline-none mr-2">
                                <option value="cm">cm</option>
                                <option value="in">in</option>
                            </select>
                        </div>
                        <button
                            onClick={createCroppedImage}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20"
                        >
                            Confirm Crop
                        </button>
                    </div>
                </div>

                <div className="w-full bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl relative flex flex-col justify-center items-center h-[65vh] overflow-hidden">
                    <div className="relative w-full h-full flex-grow">
                        <Cropper
                            image={imageUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={photoWidth / photoHeight}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    {/* Photo zoom control */}
                    <div className="w-full bg-neutral-900/80 border-t border-neutral-800 p-4 flex items-center justify-center gap-6 shrink-0 backdrop-blur-md z-10">
                        <span className="text-white font-medium text-sm">Zoom Photo</span>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.05}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full max-w-xs accent-blue-500 cursor-pointer"
                        />
                        <span className="text-neutral-400 text-sm">{Math.round(zoom * 100)}%</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col md:flex-row gap-8 items-start justify-center max-w-7xl mx-auto mt-4">

            {/* Paper Preview Area */}
            <div className="w-full md:w-[65%] flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-6">
                    <button onClick={() => setStep("crop")} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors font-medium">
                        <ArrowLeft className="w-5 h-5" /> Re-Crop
                    </button>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Camera className="w-6 h-6 text-blue-400" />
                        Live Print Preview
                    </h2>
                </div>

                {/* Print Context styles injected here */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        body * { visibility: hidden; }
                        #printable-paper, #printable-paper * { visibility: visible; }
                        #printable-paper {
                            position: absolute;
                            left: 0;
                            top: 0;
                            transform: none !important;
                            box-shadow: none !important;
                            border: none !important;
                        }
                        @page { size: ${paperSize.width}${paperSize.unit} ${paperSize.height}${paperSize.unit}; margin: 0; }
                    }
                `}} />

                <div
                    ref={previewContainerRef}
                    className="p-8 bg-neutral-900 rounded-3xl border border-neutral-800 flex items-center justify-center overflow-hidden h-[75vh] w-full relative"
                >
                    {/* Floating Info Pill */}
                    <div className="absolute top-4 right-4 bg-neutral-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-700 text-xs text-neutral-300 z-10 font-medium">
                        Photos: {renderedPhotos}/{totalPhotos} &nbsp;&bull;&nbsp; Margin: {margin}{unit} &nbsp;&bull;&nbsp; Gap: {gap}{unit}
                    </div>

                    {/* Visual Scaled Representation (The "Paper") */}
                    <div
                        id="printable-paper"
                        className="bg-white shadow-2xl absolute print:w-full print:h-full print:static print:transform-none"
                        style={{
                            width: paperWidthPx,
                            height: paperHeightPx,
                            transform: `translate(-50%, -50%) scale(${previewScale})`,
                            transformOrigin: "center center",
                            left: "50%",
                            top: "50%"
                        }}
                    >
                        {cols > 0 && rows > 0 ? (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: `repeat(${cols}, ${photoWidthPx}px)`,
                                    gridTemplateRows: `repeat(${rows}, ${photoHeightPx}px)`,
                                    gap: `${gapPx}px`,
                                    paddingTop: `${marginPx}px`,
                                    paddingLeft: `${marginPx}px`,
                                    width: "100%",
                                    height: "100%",
                                    boxSizing: "border-box"
                                }}
                            >
                                {Array.from({ length: renderedPhotos }).map((_, i) => (
                                    <div
                                        key={i}
                                        style={{ width: photoWidthPx, height: photoHeightPx }}
                                    >
                                        <div
                                            className="w-full h-full box-border flex items-center justify-center relative overflow-hidden"
                                            style={{
                                                ...(ALBUM_FRAMES.find(f => f.id === selectedFrameId) || ALBUM_FRAMES[0]).getStyle(),
                                                // Optional manual border fallback on top of it all
                                                border: selectedFrameId === "none" ? `${borderWidth}px solid ${borderColor}` : undefined
                                            }}
                                        >
                                            <img src={croppedImage!} alt="Album" className="w-full h-full object-cover" style={{ filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` }} />
                                            {(ALBUM_FRAMES.find(f => f.id === selectedFrameId)?.overlayUrl) && (
                                                <img src={ALBUM_FRAMES.find(f => f.id === selectedFrameId)!.overlayUrl!} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-red-500">
                                Photos are too large or margins too big to fit on configured paper.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar Controls */}
            <div className="w-full md:w-[35%] flex flex-col gap-6">
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 backdrop-blur-lg custom-scrollbar max-h-[85vh] overflow-y-auto">

                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white border-b border-neutral-800 pb-4">
                        <LayoutIcon className="w-5 h-5 text-neutral-400" />
                        Layout Settings
                    </h3>

                    <div className="space-y-6">
                        {/* Paper & Unit */}
                        <div>
                            <label className="text-sm text-neutral-400 block mb-2 font-medium">Paper Size</label>
                            <select
                                className="w-full bg-neutral-800 text-white rounded-xl px-4 py-3 border border-neutral-700 outline-none focus:border-blue-500"
                                value={paperSize.name}
                                onChange={(e) => {
                                    const size = PAPER_SIZES.find(s => s.name === e.target.value);
                                    if (size) setPaperSize(size);
                                }}
                            >
                                {PAPER_SIZES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>

                        {/* Unit and Copies Switch added here */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-neutral-400 block mb-2 font-medium">Units</label>
                                <select
                                    className="w-full bg-neutral-800 text-white rounded-xl px-4 py-3 border border-neutral-700 outline-none focus:border-blue-500"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value as "cm" | "in")}
                                >
                                    <option value="cm">Centimeters (cm)</option>
                                    <option value="in">Inches (in)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-neutral-400 block mb-2 font-medium">Total Copies</label>
                                <input
                                    type="number"
                                    value={copies === 0 ? "" : copies}
                                    placeholder="Auto-fill page"
                                    onChange={e => setCopies(Number(e.target.value) || 0)}
                                    className="w-full bg-neutral-800 text-white rounded-xl px-4 py-3 border border-neutral-700 outline-none focus:border-blue-500 placeholder:text-neutral-600"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-neutral-400 block mb-2 font-medium">Photo Width ({unit})</label>
                                <input type="number" step="0.1" value={photoWidth} onChange={e => setPhotoWidth(Number(e.target.value))} className="w-full bg-neutral-800 text-white rounded-xl px-4 py-3 border border-neutral-700 outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="text-sm text-neutral-400 block mb-2 font-medium">Photo Height ({unit})</label>
                                <input type="number" step="0.1" value={photoHeight} onChange={e => setPhotoHeight(Number(e.target.value))} className="w-full bg-neutral-800 text-white rounded-xl px-4 py-3 border border-neutral-700 outline-none focus:border-blue-500" />
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                let pWidth = paperSize.width;
                                let pHeight = paperSize.height;
                                if (paperSize.unit === "in" && unit === "cm") { pWidth *= 2.54; pHeight *= 2.54; }
                                else if (paperSize.unit === "cm" && unit === "in") { pWidth /= 2.54; pHeight /= 2.54; }
                                setPhotoWidth(Number((pWidth - 2 * margin).toFixed(2)));
                                setPhotoHeight(Number((pHeight - 2 * margin).toFixed(2)));
                            }}
                            className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl flex items-center justify-center gap-2 text-sm transition-colors border border-neutral-700 mt-2 font-medium"
                        >
                            <LayoutIcon className="w-4 h-4" /> Maximize Photo to Fit Paper
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-neutral-400 block mb-2 font-medium">Margin ({unit})</label>
                                <input type="number" step="0.1" value={margin} onChange={e => setMargin(Number(e.target.value))} className="w-full bg-neutral-800 text-white rounded-xl px-4 py-3 border border-neutral-700 outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="text-sm text-neutral-400 block mb-2 font-medium">Gap ({unit})</label>
                                <input type="number" step="0.1" value={gap} onChange={e => setGap(Number(e.target.value))} className="w-full bg-neutral-800 text-white rounded-xl px-4 py-3 border border-neutral-700 outline-none focus:border-blue-500" />
                            </div>
                        </div>

                        {/* Border Controls */}
                        <h3 className="text-lg font-bold mb-2 mt-8 flex items-center gap-2 text-white border-b border-neutral-800 pb-3">
                            <ImageIcon className="w-4 h-4 text-neutral-400" />
                            Border & Stroke
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-neutral-400 block mb-2 font-medium">Thickness (px)</label>
                                <input type="number" value={borderWidth} onChange={e => setBorderWidth(Number(e.target.value))} className="w-full bg-neutral-800 text-white rounded-xl px-4 py-3 border border-neutral-700 outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="text-sm text-neutral-400 block mb-2 font-medium">Color</label>
                                <div className="relative w-full h-[50px] rounded-xl border border-neutral-700 overflow-hidden cursor-pointer" style={{ background: borderColor }}>
                                    <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer opacity-0" />
                                </div>
                            </div>
                        </div>

                        {/* Huge 100+ Gallery Frames Picker */}
                        <h3 className="text-lg font-bold mb-2 mt-8 flex items-center gap-2 text-white border-b border-neutral-800 pb-3">
                            <ImageIcon className="w-4 h-4 text-blue-400" />
                            Premium Frame Gallery
                        </h3>
                        <div>
                            <p className="text-xs text-neutral-400 mb-4 font-medium block">Select to preview & apply</p>
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-72 overflow-y-auto custom-scrollbar bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                                {ALBUM_FRAMES.map(frame => (
                                    <button
                                        key={frame.id}
                                        onClick={() => setSelectedFrameId(frame.id)}
                                        className={`w-full aspect-square rounded-lg flex items-center justify-center relative overflow-hidden transition-all duration-200 cursor-pointer ${selectedFrameId === frame.id ? 'ring-2 ring-blue-500 scale-[1.05] z-10 shadow-lg shadow-blue-500/30' : 'ring-1 ring-neutral-700 hover:ring-neutral-500'}`}
                                        style={{ backgroundColor: '#262626' }}
                                        title={frame.name}
                                    >
                                        <div className="w-[80%] h-[80%] relative box-border bg-neutral-400 flex items-center justify-center" style={{ ...(frame.getStyle()) }}>
                                            {!frame.overlayUrl && frame.id !== 'none' && <span className="text-[10px] text-neutral-800 opacity-50 font-bold mix-blend-overlay">Preview</span>}
                                            {frame.overlayUrl && <img src={frame.overlayUrl} className="absolute inset-0 w-full h-full pointer-events-none" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-neutral-500 mt-2">*Note: When a premium frame is active, the manual border stroke is disabled.</p>
                        </div>

                        {/* Adjustments */}
                        <h3 className="text-lg font-bold mb-2 mt-8 flex items-center gap-2 text-white border-b border-neutral-800 pb-3">
                            <Settings2 className="w-4 h-4 text-neutral-400" />
                            Adjust & Clean
                        </h3>

                        <div>
                            <div className="flex justify-between mb-1"><span className="text-sm text-neutral-400">Brightness</span><span className="text-sm font-bold">{brightness}%</span></div>
                            <input type="range" min="0" max="200" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-blue-500" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1"><span className="text-sm text-neutral-400">Contrast</span><span className="text-sm font-bold">{contrast}%</span></div>
                            <input type="range" min="0" max="200" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-blue-500" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1"><span className="text-sm text-neutral-400">Saturation (Color)</span><span className="text-sm font-bold">{saturation}%</span></div>
                            <input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full accent-blue-500" />
                        </div>

                    </div>
                </div>

                {/* Final Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleDownloadSheet}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        <Download className="w-5 h-5" />
                        Download PDF / Sheet
                    </button>
                    <button
                        onClick={handlePrint}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Printer className="w-5 h-5" />
                        Print Directly
                    </button>
                </div>
            </div>
        </div>
    );
}
