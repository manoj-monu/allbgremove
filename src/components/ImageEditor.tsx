"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { Download, IterationCcw, Loader2, Image as ImageIcon, PaintBucket, Ban, Upload, Sparkles, LayoutGrid, Palette, X } from "lucide-react";
import PassportMaker from "./PassportMaker";
import AlbumMaker from "./AlbumMaker";
import { saveAs } from "file-saver";

interface ImageEditorProps {
    file: File;
    onReset: () => void;
}

const PREDEFINED_COLORS = [
    "#ef4444", "#ec4899", "#d946ef", "#8b5cf6", "#6366f1", "#3b82f6",
    "#0ea5e9", "#06b6d4", "#14b8a6", "#10b981", "#22c55e", "#84cc16",
    "#eab308", "#f59e0b", "#f97316", "#ffffff", "#e5e7eb", "#9ca3af",
    "#4b5563", "#000000"
];

const PREDEFINED_PHOTOS = [
    "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1682687982501-1e5898cb8f4b?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1682687220199-d0124f48f95b?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop",
];

export default function ImageEditor({ file, onReset }: ImageEditorProps) {
    const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
    const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [bgColor, setBgColor] = useState<string>("transparent");
    const [customBgImage, setCustomBgImage] = useState<string | null>(null);
    const [showBackgroundOptions, setShowBackgroundOptions] = useState<boolean>(false);
    const [bgTab, setBgTab] = useState<"color" | "image">("color");

    const [passportMode, setPassportMode] = useState<boolean>(false);
    const [passportImageUrl, setPassportImageUrl] = useState<string>("");

    const [albumMode, setAlbumMode] = useState<boolean>(false);
    const [albumImageUrl, setAlbumImageUrl] = useState<string>("");

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [enhance, setEnhance] = useState<boolean>(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://bg-remover-api-vbi7.onrender.com";

    useEffect(() => {
        // Show preview of original
        const objectUrl = URL.createObjectURL(file);
        setOriginalImageUrl(objectUrl);

        const img = new window.Image();
        img.src = objectUrl;

        // Call API
        const processImage = async () => {
            try {
                setIsProcessing(true);
                const formData = new FormData();
                formData.append("file", file);

                // STEP 1: Queue the image for processing
                const response = await fetch(`${apiUrl}/api/remove-bg-async?enhance=${enhance}`, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Server is too busy or rejected the file");
                }

                const data = await response.json();
                const taskId = data.task_id;
                setCurrentTaskId(taskId);

                // STEP 2: Silently poll status every 2 seconds
                let isCompleted = false;
                while (!isCompleted) {
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    const statusRes = await fetch(`${apiUrl}/api/status/${taskId}`);
                    if (!statusRes.ok) throw new Error("Lost connection to processing server");

                    const statusData = await statusRes.json();

                    if (statusData.status === "completed") {
                        isCompleted = true;
                    } else if (statusData.status === "failed") {
                        throw new Error(statusData.error || "AI processing failed on server");
                    }
                }

                // STEP 3: Download the final result
                const resultRes = await fetch(`${apiUrl}/api/result/${taskId}`);
                if (!resultRes.ok) throw new Error("Failed to download processed image");

                const blob = await resultRes.blob();
                const processedUrl = URL.createObjectURL(blob);
                setProcessedImageUrl(processedUrl);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setIsProcessing(false);
            }
        };

        processImage();

        return () => {
            URL.revokeObjectURL(objectUrl);
            if (processedImageUrl) URL.revokeObjectURL(processedImageUrl);
        };
    }, [file, enhance]);

    const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setCustomBgImage(url);
            setBgColor(""); // Clear color if image is uploaded
        }
    };


    const handleDownload = async () => {
        if (!processedImageUrl || !canvasRef.current) return;

        let filename = "bg-removed.png";
        if (file && file.name) {
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
            filename = `${nameWithoutExt}-bg-removed.png`;
        }

        // SCENARIO 1: Simple Download with Transparent Background
        // By downloading straight from the Python server, we guarantee a pure, native file stream
        // that completely circumvents any Chromium Memory Blob corruption bugs or Canvas ICC stripping issues.
        if (bgColor === "transparent" && !customBgImage && currentTaskId) {
            window.location.href = `${apiUrl}/api/result/${currentTaskId}?download_name=${encodeURIComponent(filename)}`;
            return;
        }

        // SCENARIO 2: Background Color or Image Applied (CANVAS REQUIRED FOR RE-ENCODING)
        // For custom backgrounds, we must combine elements using the local Canvas.
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        try {
            // CRITICAL STEP to prevent local CORS and canvas taint:
            // Fetch the image into a local blob FIRST before putting it on the canvas.
            const response = await fetch(processedImageUrl);
            const blob = await response.blob();
            const safeLocalImageUrl = URL.createObjectURL(blob);

            const imgElement = new window.Image();
            imgElement.src = safeLocalImageUrl;

            imgElement.onload = () => {
                canvas.width = imgElement.width;
                canvas.height = imgElement.height;

                // Draw background color
                if (bgColor && bgColor !== "transparent") {
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                // Draw background image
                if (customBgImage) {
                    const bgImgElement = new window.Image();
                    bgImgElement.crossOrigin = "anonymous";
                    bgImgElement.src = customBgImage;

                    bgImgElement.onload = () => {
                        ctx.drawImage(bgImgElement, 0, 0, canvas.width, canvas.height);
                        ctx.drawImage(imgElement, 0, 0);
                        triggerDownload(canvas, filename);
                        URL.revokeObjectURL(safeLocalImageUrl); // Cleanup
                    };

                    bgImgElement.onerror = () => {
                        ctx.drawImage(imgElement, 0, 0);
                        triggerDownload(canvas, filename);
                        URL.revokeObjectURL(safeLocalImageUrl);
                    }
                    return;
                }

                // Draw transparent image
                ctx.drawImage(imgElement, 0, 0);
                triggerDownload(canvas, filename);
                URL.revokeObjectURL(safeLocalImageUrl);
            };

            imgElement.onerror = () => {
                URL.revokeObjectURL(safeLocalImageUrl);
                throw new Error("Local image load failed");
            }

        } catch (error) {
            console.error("Canvas draw failed:", error);
            saveAs(processedImageUrl, filename);
        }
    };

    const triggerDownload = (canvas: HTMLCanvasElement, filename: string) => {
        try {
            canvas.toBlob(async (blob) => {
                if (blob) {
                    try {
                        // Bypass Chrome Memory Blob/file-saver corruption entirely using a true HTTP trip
                        const formData = new FormData();
                        formData.append("file", blob, filename);

                        const res = await fetch(`${apiUrl}/api/stash`, {
                            method: "POST",
                            body: formData,
                        });

                        if (!res.ok) throw new Error("Stash endpoint failed");

                        const data = await res.json();

                        // Force real OS-level download stream through an explicit HTTP redirect!
                        window.location.href = `${apiUrl}/api/download-stashed/${data.stash_id}`;

                    } catch (err) {
                        console.error("Stash download failed, falling back manually...", err);
                        saveAs(blob, filename);
                    }
                } else {
                    console.error("Canvas toBlob failed.");
                    if (processedImageUrl) saveAs(processedImageUrl, "bg-removed-fallback.png");
                }
            }, "image/png", 1.0);
        } catch (e) {
            console.error("Download failed:", e);
            if (processedImageUrl) {
                saveAs(processedImageUrl, "bg-removed-fallback.png");
            }
        }
    };

    const handleCreatePassport = () => {
        if (!processedImageUrl || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const imgElement = new window.Image();
        imgElement.src = processedImageUrl;

        imgElement.onload = () => {
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;

            if (bgColor && bgColor !== "transparent") {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            if (customBgImage) {
                const bgImgElement = new window.Image();
                if (customBgImage.startsWith("http")) {
                    bgImgElement.crossOrigin = "anonymous";
                }
                bgImgElement.src = customBgImage;
                bgImgElement.onload = () => {
                    ctx.drawImage(bgImgElement, 0, 0, canvas.width, canvas.height);
                    ctx.drawImage(imgElement, 0, 0);
                    setPassportImageUrl(canvas.toDataURL("image/png", 1.0));
                    setPassportMode(true);
                };
                return;
            }

            ctx.drawImage(imgElement, 0, 0);
            setPassportImageUrl(canvas.toDataURL("image/png", 1.0));
            setPassportMode(true);
        };
    };

    const handleCreateAlbum = () => {
        if (!processedImageUrl || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const imgElement = new window.Image();
        imgElement.src = processedImageUrl;

        imgElement.onload = () => {
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;

            if (bgColor && bgColor !== "transparent") {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            if (customBgImage) {
                const bgImgElement = new window.Image();
                if (customBgImage.startsWith("http")) {
                    bgImgElement.crossOrigin = "anonymous";
                }
                bgImgElement.src = customBgImage;
                bgImgElement.onload = () => {
                    ctx.drawImage(bgImgElement, 0, 0, canvas.width, canvas.height);
                    ctx.drawImage(imgElement, 0, 0);
                    setAlbumImageUrl(canvas.toDataURL("image/png", 1.0));
                    setAlbumMode(true);
                };
                return;
            }

            ctx.drawImage(imgElement, 0, 0);
            setAlbumImageUrl(canvas.toDataURL("image/png", 1.0));
            setAlbumMode(true);
        };
    };

    if (passportMode && passportImageUrl) {
        return <PassportMaker imageUrl={passportImageUrl} onBack={() => setPassportMode(false)} />;
    }

    if (albumMode && albumImageUrl) {
        return <AlbumMaker imageUrl={albumImageUrl} onBack={() => setAlbumMode(false)} />;
    }

    return (
        <div className="w-full flex justify-center mt-4">
            <canvas ref={canvasRef} className="hidden" />

            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-5xl overflow-hidden flex flex-col items-center p-6 relative">

                {/* Close Button top right */}
                <button
                    onClick={onReset}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Tabs removed as interactive Before/After slider now handles this elegantly */}

                <div className="w-full flex flex-col md:flex-row gap-8">
                    {/* Left side: Image Display */}
                    <div className="w-full md:w-[60%] flex flex-col items-center">
                        <div className="w-full aspect-[4/3] bg-[url('https://www.remove.bg/images/transparency_demo_1.png')] bg-repeat rounded-2xl overflow-hidden flex items-center justify-center relative shadow-inner border border-gray-200" style={{ backgroundSize: '20px 20px' }}>
                            {isProcessing ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                                    <p className="font-semibold text-gray-700">Removing background...</p>
                                </div>
                            ) : error ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10 p-6 text-center">
                                    <p className="text-red-500 font-medium">{error}</p>
                                </div>
                            ) : null}

                            {!isProcessing && !error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full h-full relative"
                                >
                                    {processedImageUrl && originalImageUrl ? (
                                        <div className="w-full h-full">
                                            <ReactCompareSlider
                                                className="w-full h-full select-none"
                                                itemOne={
                                                    <div className="w-full h-full relative">
                                                        <ReactCompareSliderImage src={originalImageUrl} alt="Original" />
                                                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide z-10 shadow-lg border border-white/20">
                                                            Before
                                                        </div>
                                                    </div>
                                                }
                                                itemTwo={
                                                    <div className="w-full h-full relative" style={{
                                                        backgroundColor: bgColor !== "transparent" ? bgColor : undefined,
                                                        backgroundImage: customBgImage ? `url(${customBgImage})` : undefined,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}>
                                                        <ReactCompareSliderImage src={processedImageUrl} alt="Removed Background" />
                                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide z-10 shadow-lg border border-white/20">
                                                            After
                                                        </div>
                                                    </div>
                                                }
                                                handle={
                                                    <div className="w-1 h-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center relative cursor-ew-resize">
                                                        <div className="w-8 h-8 bg-white text-gray-800 rounded-full shadow-lg flex items-center justify-center border border-gray-200">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M15 18l-6-6 6-6" />
                                                                <path d="M9 18l6-6-6-6" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </div>
                                    ) : null}
                                </motion.div>
                            )}
                        </div>

                        {/* Tools Toolbar under image */}
                        {!isProcessing && !error && (
                            <div className="mt-4 flex flex-wrap gap-2 justify-center w-full">
                                <button
                                    onClick={() => setShowBackgroundOptions(!showBackgroundOptions)}
                                    className={`px-4 py-2 border rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${showBackgroundOptions ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <Palette className="w-4 h-4" /> Add Background
                                </button>
                                <button
                                    onClick={() => setEnhance(!enhance)}
                                    className={`px-4 py-2 border rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${enhance ? 'border-purple-500 text-purple-600 bg-purple-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <Sparkles className="w-4 h-4" /> AI Enhance {enhance ? 'On' : 'Off'}
                                </button>
                                <button
                                    onClick={handleCreatePassport}
                                    className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <LayoutGrid className="w-4 h-4" /> Passport Photo
                                </button>
                                <button
                                    onClick={handleCreateAlbum}
                                    className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <ImageIcon className="w-4 h-4" /> Album Picture
                                </button>
                            </div>
                        )}

                        {/* Background Options Panel */}
                        <AnimatePresence>
                            {showBackgroundOptions && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="w-full mt-4 overflow-hidden"
                                >
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                                        <div className="flex gap-4 mb-4 border-b border-gray-200 pb-2">
                                            <button
                                                onClick={() => setBgTab("color")}
                                                className={`text-sm font-semibold transition-colors ${bgTab === "color" ? "text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
                                            >
                                                Color
                                            </button>
                                            <button
                                                onClick={() => setBgTab("image")}
                                                className={`text-sm font-semibold transition-colors ${bgTab === "image" ? "text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
                                            >
                                                Image
                                            </button>
                                        </div>

                                        {bgTab === "color" && (
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => { setBgColor("transparent"); setCustomBgImage(null); }}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110 bg-[url('https://www.remove.bg/images/transparency_demo_1.png')] bg-repeat ${bgColor === "transparent" && !customBgImage ? "border-blue-500" : "border-gray-200"}`}
                                                    style={{ backgroundSize: '10px 10px' }}
                                                    title="Transparent"
                                                >
                                                    <Ban className="w-4 h-4 text-gray-600" />
                                                </button>

                                                <div className="relative w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden cursor-pointer hover:scale-110 transition-transform"
                                                    title="Custom Color"
                                                    style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}>
                                                    <input
                                                        type="color"
                                                        className="absolute inset-[0] w-[200%] h-[200%] cursor-pointer opacity-0"
                                                        onChange={(e) => { setBgColor(e.target.value); setCustomBgImage(null); }}
                                                    />
                                                </div>

                                                {PREDEFINED_COLORS.map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => { setBgColor(color); setCustomBgImage(null); }}
                                                        className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 shadow-sm ${bgColor === color && !customBgImage ? 'border-black' : 'border-transparent'}`}
                                                        style={{ background: color, border: bgColor === color ? '2px solid black' : color === '#ffffff' ? '1px solid #e5e5e5' : 'none' }}
                                                        title={color}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {bgTab === "image" && (
                                            <div className="flex flex-wrap gap-2">
                                                <label className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all">
                                                    <Upload className="w-5 h-5 text-gray-400" />
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleCustomBgUpload} />
                                                </label>

                                                {PREDEFINED_PHOTOS.map((photo, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => { setCustomBgImage(photo); setBgColor(""); }}
                                                        className={`w-16 h-16 rounded-lg border-2 overflow-hidden transition-transform hover:scale-105 ${customBgImage === photo ? 'border-blue-500 scale-105' : 'border-transparent'}`}
                                                    >
                                                        <img src={photo} alt="bg" className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right side: Download Panel */}
                    <div className="w-full md:w-[40%] flex flex-col pt-4">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col h-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Download Image</h3>

                            {/* Standard Download Option */}
                            <div className="flex flex-col mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-gray-800 text-lg">Preview Image</span>
                                    <span className="text-sm text-gray-500 font-medium">600 × 400</span>
                                </div>
                                <button
                                    onClick={handleDownload}
                                    disabled={isProcessing || !processedImageUrl || !!error}
                                    className="w-full py-3.5 bg-[#0066FF] hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-full font-bold text-lg transition-colors shadow-lg shadow-blue-500/30 flex justify-center items-center"
                                >
                                    Download
                                </button>
                                <p className="text-xs text-gray-500 text-center mt-2 font-medium">Good quality up to 0.25 megapixels</p>
                            </div>

                            <div className="h-px bg-gray-200 w-full mb-6"></div>

                            {/* HD Download Option - Often disabled or paid in remove.bg, styling differently */}
                            <div className="flex flex-col mb-auto">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-gray-800 text-lg">HD Image</span>
                                    <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Up to 4K</span>
                                </div>
                                <button
                                    onClick={handleDownload}
                                    disabled={isProcessing || !processedImageUrl || !!error}
                                    className="w-full py-3.5 bg-white border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 text-gray-800 rounded-full font-bold text-lg transition-colors flex justify-center items-center"
                                >
                                    Download HD
                                </button>
                                <p className="text-xs text-gray-500 text-center mt-2 font-medium">Best quality • 1 credit</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
