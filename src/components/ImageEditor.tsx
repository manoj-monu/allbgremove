"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, Loader2, Image as ImageIcon, PaintBucket, 
  Ban, Upload, Sparkles, LayoutGrid, Palette, X,
  ChevronRight, ArrowLeft, RefreshCw, ZoomIn, ZoomOut,
  Type, Move
} from "lucide-react";
import { saveAs } from "file-saver";
import imageCompression from 'browser-image-compression';

interface ImageEditorProps {
    file: File;
    onReset: () => void;
}

const PREDEFINED_COLORS = [
    "#ef4444", "#ec4899", "#d946ef", "#8b5cf6", "#6366f1", "#3b82f6",
    "#0ea5e9", "#06b6d4", "#14b8a6", "#10b981", "#22c55e", "#84cc16",
    "#eab308", "#f59e0b", "#f97316", "#ffffff", "#000000"
];

export default function ImageEditor({ file, onReset }: ImageEditorProps) {
    const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
    const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [bgColor, setBgColor] = useState<string>("transparent");
    const [customBgImage, setCustomBgImage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"background" | "enhance" | "export">("background");
    const [enhanceLevel, setEnhanceLevel] = useState<number>(20);
    const [zoom, setZoom] = useState<number>(1);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://bg-remover-api-vbi7.onrender.com";

    useEffect(() => {
        const objectUrl = URL.createObjectURL(file);
        setOriginalImageUrl(objectUrl);

        const processImage = async () => {
            try {
                setIsProcessing(true);
                const options = { maxSizeMB: 2, maxWidthOrHeight: 2048, useWebWorker: true };
                let fileToUpload = file;
                try { fileToUpload = await imageCompression(file, options); } catch (e) {}

                const formData = new FormData();
                formData.append("file", fileToUpload);

                const response = await fetch(`${apiUrl}/api/remove-bg-async?enhance=false`, {
                    method: "POST", body: formData,
                });

                if (!response.ok) throw new Error("Server error");
                const data = await response.json();
                const taskId = data.task_id;
                setCurrentTaskId(taskId);

                let isCompleted = false;
                while (!isCompleted) {
                    await new Promise(r => setTimeout(r, 2000));
                    const statusRes = await fetch(`${apiUrl}/api/status/${taskId}`);
                    const statusData = await statusRes.json();
                    if (statusData.status === "completed") isCompleted = true;
                    else if (statusData.status === "failed") throw new Error("Processing failed");
                }

                const resultRes = await fetch(`${apiUrl}/api/result/${taskId}`);
                const blob = await resultRes.blob();
                setProcessedImageUrl(URL.createObjectURL(blob));
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setIsProcessing(false);
            }
        };

        processImage();
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const handleDownload = async () => {
        if (!processedImageUrl || !canvasRef.current) return;
        let filename = file.name.replace(/\.[^/.]+$/, "") + "-no-bg.png";
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const imgElement = new window.Image();
        imgElement.crossOrigin = "anonymous";
        imgElement.src = processedImageUrl;

        imgElement.onload = () => {
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;
            if (bgColor && bgColor !== "transparent") {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            if (customBgImage) {
                const bgImg = new window.Image();
                bgImg.crossOrigin = "anonymous";
                bgImg.src = customBgImage;
                bgImg.onload = () => {
                    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
                    ctx.drawImage(imgElement, 0, 0);
                    triggerDownload(canvas, filename);
                };
                return;
            }
            ctx.drawImage(imgElement, 0, 0);
            triggerDownload(canvas, filename);
        };
    };

    const triggerDownload = (canvas: HTMLCanvasElement, filename: string) => {
        canvas.toBlob((blob) => {
            if (blob) saveAs(blob, filename);
        }, "image/png", 1.0);
    };

    return (
        <div className="w-full flex justify-center py-10">
            <canvas ref={canvasRef} className="hidden" />

            <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row overflow-hidden min-h-[700px]">
                
                {/* --- Left Sidebar (Controls) --- */}
                <div className="w-full md:w-[350px] border-r border-slate-100 flex flex-col bg-slate-50 relative z-10">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">P</div>
                             <span className="text-xl font-bold text-slate-900 tracking-tighter">PixelCut Studio</span>
                         </div>
                         <button onClick={onReset} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                             <X className="w-5 h-5" />
                         </button>
                    </div>

                    <div className="p-6 flex-grow flex flex-col gap-8">
                        {/* Tab Switcher */}
                        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl">
                             {[
                               { id: "background", icon: <Palette className="w-4 h-4" /> },
                               { id: "enhance", icon: <Sparkles className="w-4 h-4" /> },
                               { id: "export", icon: <Download className="w-4 h-4" /> }
                             ].map(tab => (
                               <button 
                                 key={tab.id}
                                 onClick={() => setActiveTab(tab.id as any)}
                                 className={`flex-1 flex items-center justify-center py-2.5 rounded-xl transition-all ${activeTab === tab.id ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10" : "text-slate-500 hover:text-slate-900"}`}
                               >
                                 {tab.icon}
                               </button>
                             ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === "background" && (
                                <motion.div key="bg" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex flex-col gap-6">
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-[2px] text-slate-400 mb-4">Solids</h4>
                                        <div className="grid grid-cols-6 gap-2">
                                            <button onClick={() => setBgColor("transparent")} className={`w-10 h-10 rounded-lg border-2 bg-white flex items-center justify-center ${bgColor === "transparent" ? "border-blue-600" : "border-slate-200"}`}><Ban className="w-4 h-4 text-slate-300" /></button>
                                            {PREDEFINED_COLORS.map(c => <button key={c} onClick={() => {setBgColor(c); setCustomBgImage(null);}} className={`w-10 h-10 rounded-lg border-2 ${bgColor === c ? "border-blue-600" : "border-slate-200"}`} style={{ backgroundColor: c }} />)}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-[2px] text-slate-400 mb-4">Visuals</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <label className="w-12 h-12 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center cursor-pointer hover:border-blue-600 transition-all"><Upload className="w-4 h-4 text-slate-400" /><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && setCustomBgImage(URL.createObjectURL(e.target.files[0]))} /></label>
                                            {[1,2,3,4,5].map(i => (
                                                <button key={i} onClick={() => setCustomBgImage(`https://picsum.photos/id/${i+50}/600/400`)} className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200"><img src={`https://picsum.photos/id/${i+50}/100/100`} alt="bg" className="w-full h-full object-cover" /></button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "enhance" && (
                                <motion.div key="enh" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex flex-col gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-3 opacity-5 text-blue-600"><Sparkles className="w-20 h-20" /></div>
                                        <h4 className="text-slate-900 font-bold mb-2">AI Edge Smoothing</h4>
                                        <p className="text-slate-500 text-xs font-medium mb-6 leading-relaxed">Refine hair and complex edges for a professional cut-out.</p>
                                        <input type="range" min="0" max="100" value={enhanceLevel} onChange={(e) => setEnhanceLevel(Number(e.target.value))} className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-2" />
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span>Fast</span><span>Precise</span></div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "export" && (
                                <motion.div key="exp" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex flex-col gap-6">
                                     <div className="bg-blue-600/5 p-8 rounded-[2rem] border border-blue-600/10 flex flex-col items-center">
                                         <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-6"><Download className="w-8 h-8" /></div>
                                         <h4 className="text-xl font-bold text-slate-900 mb-2">High Resolution</h4>
                                         <p className="text-slate-500 text-sm font-medium text-center mb-8 px-4">Your image is ready to download in full transparent PNG format.</p>
                                         <button onClick={handleDownload} className="w-full btn-primary shadow-xl shadow-blue-500/30 font-black">Download JPG/PNG</button>
                                     </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-8 border-t border-slate-100 text-center">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Cloud storage included</p>
                    </div>
                </div>

                {/* --- Main Area (Preview) --- */}
                <div className="flex-grow bg-slate-100 flex items-center justify-center relative p-8">
                    {/* Viewport UI Tabs */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex bg-white rounded-full p-1 shadow-2xl border border-slate-200">
                         <button className="px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-lg">Preview</button>
                         <button className="px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Compare</button>
                    </div>

                    <div className="absolute top-6 right-6 z-20 flex gap-2">
                        <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="p-3 bg-white rounded-xl shadow-lg border border-slate-200 text-slate-500 hover:text-blue-600"><ZoomOut className="w-5 h-5" /></button>
                        <button onClick={() => setZoom(z => Math.min(2, z + 0.25))} className="p-3 bg-white rounded-xl shadow-lg border border-slate-200 text-slate-500 hover:text-blue-600"><ZoomIn className="w-5 h-5" /></button>
                    </div>

                    <div className="w-full max-w-2xl aspect-[4/3] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white flex items-center justify-center group" 
                         style={{ backgroundImage: "radial-gradient(#e2e8f0 0.5px, transparent 0.5px), radial-gradient(#e2e8f0 0.5px, #ffffff 0.5px)", backgroundSize: "16px 16px", backgroundPosition: "0 0, 8px 8px" }}>
                        
                        {isProcessing ? (
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl">
                                <div className="relative">
                                    <Loader2 className="w-20 h-20 text-blue-600 animate-spin" />
                                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mt-8 tracking-tighter">Analyzing Subject...</h3>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-[3px] mt-3 animate-pulse">Running AI Neural Network</p>
                            </div>
                        ) : error ? (
                            <div className="p-10 text-center flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-2"><X className="w-10 h-10" /></div>
                                <h3 className="text-xl font-bold text-slate-900">Wait, something went wrong</h3>
                                <p className="text-slate-500 font-medium px-10">{error}</p>
                                <button onClick={() => window.location.reload()} className="mt-4 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold">Try again</button>
                            </div>
                        ) : (
                            <div 
                              className="w-full h-full relative p-12 transition-transform duration-300" 
                              style={{ transform: `scale(${zoom})`, backgroundColor: bgColor, backgroundImage: customBgImage ? `url(${customBgImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            >
                                <div className="absolute inset-0 bg-[url('https://www.remove.bg/images/transparency_demo_1.png')] bg-repeat opacity-5 z-0" style={{ backgroundSize: '20px 20px', display: bgColor === "transparent" && !customBgImage ? "block" : "none" }}></div>
                                <img 
                                    src={processedImageUrl || originalImageUrl} 
                                    alt="Result" 
                                    className="w-full h-full object-contain relative z-10 transition-all duration-300 pointer-events-none drop-shadow-2xl"
                                    style={{ filter: `contrast(${1 + (enhanceLevel * 0.001)}) saturate(${1 + (enhanceLevel * 0.002)}) brightness(${1 + (enhanceLevel * 0.001)})` }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex bg-white/80 backdrop-blur-md rounded-2xl px-6 py-3 shadow-xl border border-white gap-8 pointer-events-none">
                         <div className="flex flex-col items-center gap-1">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">AI Online</span>
                         </div>
                         <div className="h-8 w-px bg-slate-200"></div>
                         <div className="flex flex-col items-center gap-1">
                             <span className="text-[10px] font-black text-slate-900">4096 x 3072</span>
                             <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">HD Resolution</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
