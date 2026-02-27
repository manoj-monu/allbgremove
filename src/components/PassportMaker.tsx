"use client";
import React, { useState, useRef, useEffect } from "react";
import { useCallback } from "react";
import Cropper from "react-easy-crop";
import { ArrowLeft, Printer, Download, Settings2, Image as ImageIcon, Layout as LayoutIcon, Camera } from "lucide-react";
import { saveAs } from "file-saver";

interface PassportMakerProps {
    imageUrl: string;
    onBack: () => void;
}

const PAPER_SIZES = [
    { name: "A4 (21 x 29.7 cm)", width: 21, height: 29.7, unit: "cm", defaultMargin: 1.0, defaultGap: 0.4 },
    { name: "4x6 inches", width: 4, height: 6, unit: "in", defaultMargin: 0.32, defaultGap: 0.2 },
    { name: "8x10 inches", width: 8, height: 10, unit: "in", defaultMargin: 0.5, defaultGap: 0.3 },
    { name: "Custom", width: 21, height: 29.7, unit: "cm", defaultMargin: 1.0, defaultGap: 0.4 }
];

export default function PassportMaker({ imageUrl, onBack }: PassportMakerProps) {
    const [step, setStep] = useState<"crop" | "layout">("crop");

    // Crop State
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    // Photo Dimensions (Default: 3 x 3.5 cm to fit 12 photos perfectly on 4x6)
    const [photoWidth, setPhotoWidth] = useState(3);
    const [photoHeight, setPhotoHeight] = useState(3.5);
    const [unit, setUnit] = useState<"cm" | "in">("cm");
    const [dpi, setDpi] = useState<number>(300);
    const [copies, setCopies] = useState<number>(0); // 0 = Auto-fill

    // Layout State
    const [paperSize, setPaperSize] = useState(PAPER_SIZES[1]); // Default to 4x6
    const [margin, setMargin] = useState(PAPER_SIZES[1].defaultMargin); // 0.32cm margin
    const [gap, setGap] = useState(PAPER_SIZES[1].defaultGap); // 0.2cm gap
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

            const targetWidthPx = unit === "cm" ? photoWidth * (dpi / 2.54) : photoWidth * dpi;
            const targetHeightPx = unit === "cm" ? photoHeight * (dpi / 2.54) : photoHeight * dpi;

            canvas.width = targetWidthPx;
            canvas.height = targetHeightPx;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                targetWidthPx,
                targetHeightPx
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

        // Render actual High-Res HD canvas (dynamic DPI for high quality)
        const HD_DPI_MULTIPLIER = dpi / 96; // scale everything up to requested dpi
        const hdDPcm = DPcm * HD_DPI_MULTIPLIER;

        const hdPaperW = paperSize.unit === "cm" ? paperSize.width * hdDPcm : paperSize.width * 2.54 * hdDPcm;
        const hdPaperH = paperSize.unit === "cm" ? paperSize.height * hdDPcm : paperSize.height * 2.54 * hdDPcm;

        const hdPhotoW = unit === "cm" ? photoWidth * hdDPcm : photoWidth * 2.54 * hdDPcm;
        const hdPhotoH = unit === "cm" ? photoHeight * hdDPcm : photoHeight * 2.54 * hdDPcm;

        const hdMargin = unit === "cm" ? margin * hdDPcm : margin * 2.54 * hdDPcm;
        const hdGap = unit === "cm" ? gap * hdDPcm : gap * 2.54 * hdDPcm;

        const downloadCanvas = document.createElement("canvas");
        const hdCtx = downloadCanvas.getContext("2d");
        if (!hdCtx) return;

        downloadCanvas.width = hdPaperW;
        downloadCanvas.height = hdPaperH;

        // Fill white paper
        hdCtx.fillStyle = "#ffffff";
        hdCtx.fillRect(0, 0, hdPaperW, hdPaperH);

        const img = new window.Image();
        img.src = croppedImage;
        await new Promise((resolve) => { img.onload = resolve; });

        // Apply filters
        hdCtx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

        let count = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (count >= renderedPhotos) break;

                const x = hdMargin + c * (hdPhotoW + hdGap);
                const y = hdMargin + r * (hdPhotoH + hdGap);

                // Draw photo
                hdCtx.drawImage(img, x, y, hdPhotoW, hdPhotoH);

                // Draw border
                if (borderWidth > 0) {
                    hdCtx.lineWidth = borderWidth * HD_DPI_MULTIPLIER;
                    hdCtx.strokeStyle = borderColor;
                    hdCtx.strokeRect(x, y, hdPhotoW, hdPhotoH);
                }

                count++;
            }
        }

        downloadCanvas.toBlob((blob) => {
            if (blob) {
                const fileObj = new File([blob], "passport_sheet.png", { type: "image/png" });
                const blobUrl = window.URL.createObjectURL(fileObj);

                const link = document.createElement("a");
                link.style.display = "none";
                link.href = blobUrl;
                link.download = "passport_sheet.png";
                document.body.appendChild(link);

                const clickEvent = new MouseEvent("click", {
                    view: window,
                    bubbles: true,
                    cancelable: false,
                });
                link.dispatchEvent(clickEvent);

                setTimeout(() => {
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                }, 1000);
            }
        }, "image/png", 1.0);
    };


    if (step === "crop") {
        return (
            <div className="w-full flex flex-col items-center max-w-5xl mx-auto animate-in fade-in zoom-in-95 mt-4">
                <div className="w-full flex justify-between items-center mb-6">
                    <button onClick={onBack} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors font-medium">
                        <ArrowLeft className="w-5 h-5" /> Back to Editor
                    </button>
                    <div className="flex items-center gap-4 flex-wrap justify-end">
                        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 p-2 rounded-xl text-neutral-400">
                            <span className="text-xs pl-2">Print Quality</span>
                            <select
                                value={dpi}
                                onChange={(e) => setDpi(Number(e.target.value))}
                                className="bg-transparent text-white text-sm outline-none font-bold cursor-pointer"
                            >
                                <option value={200} className="bg-neutral-900">200 DPI</option>
                                <option value={300} className="bg-neutral-900">300 DPI</option>
                                <option value={400} className="bg-neutral-900">400 DPI</option>
                                <option value={500} className="bg-neutral-900">500 DPI</option>
                                <option value={600} className="bg-neutral-900">600 DPI</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 p-2 rounded-xl">
                            <span className="text-xs text-neutral-400 pl-2">Size</span>
                            <input type="number" step="0.1" value={photoWidth} onChange={e => setPhotoWidth(Number(e.target.value))} className="w-16 bg-neutral-800 text-white rounded outline-none px-2 py-1 text-sm text-center focus:border-blue-500 border border-transparent" />
                            <span className="text-xs text-neutral-500">x</span>
                            <input type="number" step="0.1" value={photoHeight} onChange={e => setPhotoHeight(Number(e.target.value))} className="w-16 bg-neutral-800 text-white rounded outline-none px-2 py-1 text-sm text-center focus:border-blue-500 border border-transparent" />
                            <select value={unit} onChange={(e) => setUnit(e.target.value as "cm" | "in")} className="bg-transparent text-white text-xs outline-none mr-2 cursor-pointer">
                                <option value="cm" className="bg-neutral-900">cm</option>
                                <option value="in" className="bg-neutral-900">in</option>
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
                                            className="w-full h-full box-border overflow-hidden"
                                            style={{
                                                borderStyle: borderWidth > 0 ? "solid" : "none",
                                                borderColor: borderColor,
                                                borderWidth: `${borderWidth}px`,
                                                filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
                                            }}
                                        >
                                            <img src={croppedImage!} alt="Passport" className="w-full h-full object-cover" style={{ display: 'block' }} />
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
            <div className="w-full md:w-[35%] flex flex-col gap-4">

                {/* Final Actions at Top for visibility */}
                <div className="flex gap-3">
                    <button
                        onClick={handleDownloadSheet}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-colors shadow-lg shadow-emerald-500/20 text-sm"
                    >
                        <Download className="w-4 h-4" />
                        PDF / Sheet
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-colors shadow-lg shadow-blue-500/20 text-sm"
                    >
                        <Printer className="w-4 h-4" />
                        Print Directly
                    </button>
                </div>

                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 backdrop-blur-lg custom-scrollbar max-h-[75vh] overflow-y-auto">

                    {/* Layout Settings */}
                    <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-white border-b border-neutral-800 pb-2">
                        <LayoutIcon className="w-4 h-4 text-neutral-400" />
                        Layout Settings
                    </h3>

                    <div className="space-y-4">
                        {/* Paper & Unit row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-neutral-400 block mb-1 font-medium">Paper Size</label>
                                <select
                                    className="w-full bg-neutral-800 text-white rounded-lg px-2 py-2 text-sm border border-neutral-700 outline-none focus:border-blue-500"
                                    value={paperSize.name}
                                    onChange={(e) => {
                                        const size = PAPER_SIZES.find(s => s.name === e.target.value);
                                        if (size) {
                                            setPaperSize(size);
                                            setMargin(size.defaultMargin);
                                            setGap(size.defaultGap);
                                        }
                                    }}
                                >
                                    {PAPER_SIZES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-neutral-400 block mb-1 font-medium">Units</label>
                                <select
                                    className="w-full bg-neutral-800 text-white rounded-lg px-2 py-2 text-sm border border-neutral-700 outline-none focus:border-blue-500"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value as "cm" | "in")}
                                >
                                    <option value="cm">Centimeters (cm)</option>
                                    <option value="in">Inches (in)</option>
                                </select>
                            </div>
                        </div>

                        {/* Dimensions row */}
                        <div className="grid grid-cols-4 gap-2">
                            <div className="col-span-1">
                                <label className="text-xs text-neutral-400 block mb-1 font-medium truncate">W ({unit})</label>
                                <input type="number" step="0.1" value={photoWidth} onChange={e => setPhotoWidth(Number(e.target.value))} className="w-full bg-neutral-800 text-white rounded-lg px-2 py-2 text-sm border border-neutral-700 outline-none focus:border-blue-500" />
                            </div>
                            <div className="col-span-1">
                                <label className="text-xs text-neutral-400 block mb-1 font-medium truncate">H ({unit})</label>
                                <input type="number" step="0.1" value={photoHeight} onChange={e => setPhotoHeight(Number(e.target.value))} className="w-full bg-neutral-800 text-white rounded-lg px-2 py-2 text-sm border border-neutral-700 outline-none focus:border-blue-500" />
                            </div>
                            <div className="col-span-1">
                                <label className="text-xs text-neutral-400 block mb-1 font-medium truncate">Margin</label>
                                <input type="number" step="0.1" value={margin} onChange={e => setMargin(Number(e.target.value))} className="w-full bg-neutral-800 text-white rounded-lg px-2 py-2 text-sm border border-neutral-700 outline-none focus:border-blue-500" />
                            </div>
                            <div className="col-span-1">
                                <label className="text-xs text-neutral-400 block mb-1 font-medium truncate">Gap</label>
                                <input type="number" step="0.1" value={gap} onChange={e => setGap(Number(e.target.value))} className="w-full bg-neutral-800 text-white rounded-lg px-2 py-2 text-sm border border-neutral-700 outline-none focus:border-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* Border Controls */}
                    <h3 className="text-base font-bold mb-3 mt-4 flex items-center gap-2 text-white border-b border-neutral-800 pb-2">
                        <ImageIcon className="w-4 h-4 text-neutral-400" />
                        Border & Copies
                    </h3>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs text-neutral-400 block mb-1 font-medium">Thick (px)</label>
                            <input type="number" value={borderWidth} onChange={e => setBorderWidth(Number(e.target.value))} className="w-full bg-neutral-800 text-white rounded-lg px-2 py-2 text-sm border border-neutral-700 outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-400 block mb-1 font-medium">Color</label>
                            <div className="relative w-full h-[38px] rounded-lg border border-neutral-700 overflow-hidden cursor-pointer" style={{ background: borderColor }}>
                                <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer opacity-0" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-neutral-400 block mb-1 font-medium">Copies</label>
                            <input
                                type="number"
                                value={copies === 0 ? "" : copies}
                                placeholder="Auto"
                                onChange={e => setCopies(Number(e.target.value) || 0)}
                                className="w-full bg-neutral-800 text-white rounded-lg px-2 py-2 text-sm border border-neutral-700 outline-none focus:border-blue-500 placeholder:text-neutral-600"
                            />
                        </div>
                    </div>

                    {/* Adjustments */}
                    <h3 className="text-base font-bold mb-3 mt-4 flex items-center gap-2 text-white border-b border-neutral-800 pb-2">
                        <Settings2 className="w-4 h-4 text-neutral-400" />
                        Adjust & Clean
                    </h3>

                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between mb-1"><span className="text-xs text-neutral-400">Brightness</span><span className="text-xs font-bold">{brightness}%</span></div>
                            <input type="range" min="0" max="200" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full h-1.5 accent-blue-500" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1"><span className="text-xs text-neutral-400">Contrast</span><span className="text-xs font-bold">{contrast}%</span></div>
                            <input type="range" min="0" max="200" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full h-1.5 accent-blue-500" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1"><span className="text-xs text-neutral-400">Saturation</span><span className="text-xs font-bold">{saturation}%</span></div>
                            <input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full h-1.5 accent-blue-500" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
