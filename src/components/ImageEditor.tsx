"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { Download, IterationCcw, Loader2, Image as ImageIcon, PaintBucket, Ban, Upload, Sparkles, LayoutGrid, Palette } from "lucide-react";
import PassportMaker from "./PassportMaker";
import AlbumMaker from "./AlbumMaker";

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
    const [isProcessing, setIsProcessing] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [bgColor, setBgColor] = useState<string>("transparent");
    const [customBgImage, setCustomBgImage] = useState<string | null>(null);
    const [sliderPosition, setSliderPosition] = useState<number>(100);
    const [aspectRatio, setAspectRatio] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<"magic" | "photo" | "color">("color");

    const [passportMode, setPassportMode] = useState<boolean>(false);
    const [passportImageUrl, setPassportImageUrl] = useState<string>("");

    const [albumMode, setAlbumMode] = useState<boolean>(false);
    const [albumImageUrl, setAlbumImageUrl] = useState<string>("");

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [enhance, setEnhance] = useState<boolean>(true);

    useEffect(() => {
        // Show preview of original
        const objectUrl = URL.createObjectURL(file);
        setOriginalImageUrl(objectUrl);

        const img = new window.Image();
        img.src = objectUrl;
        img.onload = () => {
            setAspectRatio(img.naturalWidth / img.naturalHeight);
        };

        // Call API
        const processImage = async () => {
            try {
                setIsProcessing(true);
                const formData = new FormData();
                formData.append("file", file);

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const response = await fetch(`${apiUrl}/api/remove-bg?enhance=${enhance}`, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Failed to process image");
                }

                const blob = await response.blob();
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
            setSliderPosition(0); // Show full transparent image when changing bg
        }
    };

    // Auto-slide animation when image processing finishes
    useEffect(() => {
        if (processedImageUrl) {
            let pos = 100;
            const targetPos = 0;
            const interval = setInterval(() => {
                pos -= 2;
                if (pos <= targetPos) {
                    pos = targetPos;
                    clearInterval(interval);
                }
                setSliderPosition(pos);
            }, 16);
            return () => clearInterval(interval);
        }
    }, [processedImageUrl]);

    const handleDownload = () => {
        if (!processedImageUrl || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // We need to draw the background (color or image) and then the processed image on top
        const imgElement = new window.Image();
        imgElement.crossOrigin = "anonymous";
        imgElement.src = processedImageUrl;

        imgElement.onload = () => {
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;

            // Draw Background Color
            if (bgColor && bgColor !== "transparent") {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Draw Custom Background Image
            if (customBgImage) {
                const bgImgElement = new window.Image();
                bgImgElement.crossOrigin = "anonymous";
                bgImgElement.src = customBgImage;
                bgImgElement.onload = () => {
                    // Draw bg image stretched to fit
                    ctx.drawImage(bgImgElement, 0, 0, canvas.width, canvas.height);
                    // Draw transparent subject
                    ctx.drawImage(imgElement, 0, 0);
                    triggerDownload(canvas);
                };
                return; // Wait for bg image to load
            }

            // Draw transparent subject (if no bg image)
            ctx.drawImage(imgElement, 0, 0);
            triggerDownload(canvas);
        };
    };

    const triggerDownload = (canvas: HTMLCanvasElement) => {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `removed_bg_${file.name.split('.')[0]}.png`;
        link.click();
    };

    const handleCreatePassport = () => {
        if (!processedImageUrl || !canvasRef.current) return;

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
                const bgImgElement = new window.Image();
                bgImgElement.crossOrigin = "anonymous";
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
                const bgImgElement = new window.Image();
                bgImgElement.crossOrigin = "anonymous";
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
        <div className="w-full flex flex-col md:flex-row gap-8 items-start justify-center mt-8">
            {/* Hidden Canvas for Export */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Main Preview Area */}
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full md:w-2/3 max-w-3xl flex-shrink-0"
            >
                <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl z-10 w-full min-h-[400px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {isProcessing ? (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative z-20 flex w-full min-h-[400px] min-w-[300px]"
                            >
                                <div className="w-1/2 h-full p-4 flex items-center justify-center">
                                    {originalImageUrl ? (
                                        <img src={originalImageUrl} alt="Original" className="max-h-full rounded-lg shadow-lg opacity-80 filter blur-sm" />
                                    ) : null}
                                </div>
                                <div className="w-1/2 flex flex-col items-center justify-center bg-neutral-900/40 backdrop-blur-md p-4 text-center">
                                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                                    <p className="font-semibold text-blue-400">Removing Background.<br />Hold on tight!</p>
                                </div>
                            </motion.div>
                        ) : error ? (
                            <div className="z-20 text-red-500 font-medium p-4 bg-red-500/10 min-h-[400px] min-w-[300px] flex items-center justify-center">
                                {error}
                            </div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative z-20 flex"
                            >
                                {processedImageUrl && originalImageUrl && aspectRatio && (
                                    <ReactCompareSlider
                                        position={sliderPosition}
                                        onPositionChange={(pos) => setSliderPosition(pos)}
                                        className="mx-auto rounded-lg shadow-xl shrink-0"
                                        style={{
                                            width: "100%",
                                            aspectRatio: `${aspectRatio}`,
                                            maxWidth: `min(100%, calc(70vh * ${aspectRatio}))`,
                                            maxHeight: `70vh`
                                        }}
                                        itemOne={<img src={originalImageUrl} alt="Original Image" className="block w-full h-full object-cover" />}
                                        itemTwo={<img src={processedImageUrl} alt="Processed Image" className="block w-full h-full object-cover"
                                            style={{
                                                backgroundColor: bgColor !== "transparent" ? bgColor : undefined,
                                                backgroundImage: customBgImage
                                                    ? `url(${customBgImage})`
                                                    : bgColor === "transparent"
                                                        ? 'linear-gradient(45deg, #1f1f1f 25%, transparent 25%), linear-gradient(-45deg, #1f1f1f 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f1f1f 75%), linear-gradient(-45deg, transparent 75%, #1f1f1f 75%)'
                                                        : undefined,
                                                backgroundSize: customBgImage ? 'cover' : '20px 20px',
                                                backgroundPosition: customBgImage ? 'center' : '0 0, 0 10px, 10px -10px, -10px 0px',
                                                backgroundRepeat: customBgImage ? 'no-repeat' : 'repeat',
                                            }}
                                        />}
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Sidebar Tooling */}
            <AnimatePresence>
                {!isProcessing && !error && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="w-full md:w-1/3 flex flex-col gap-6"
                    >
                        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-lg flex flex-col min-h-[400px]">
                            {/* Tabs Header */}
                            <div className="flex border-b border-neutral-800">
                                <button
                                    onClick={() => setActiveTab("magic")}
                                    className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === "magic" ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5" : "text-neutral-400 hover:text-neutral-200"}`}
                                >
                                    Magic
                                </button>
                                <button
                                    onClick={() => setActiveTab("photo")}
                                    className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === "photo" ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5" : "text-neutral-400 hover:text-neutral-200"}`}
                                >
                                    Photo
                                </button>
                                <button
                                    onClick={() => setActiveTab("color")}
                                    className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === "color" ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5" : "text-neutral-400 hover:text-neutral-200"}`}
                                >
                                    Color
                                </button>
                            </div>

                            {/* Tab Content Area */}
                            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar max-h-[450px]">
                                {activeTab === "color" && (
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                        {/* Transparent */}
                                        <button
                                            onClick={() => { setBgColor("transparent"); setCustomBgImage(null); setSliderPosition(0); }}
                                            className={`aspect-square rounded-xl flex items-center justify-center border-2 transition-transform hover:scale-105 ${bgColor === "transparent" && !customBgImage ? "border-blue-500 bg-neutral-800" : "border-neutral-700 bg-neutral-900"}`}
                                            title="Transparent"
                                        >
                                            <Ban className="w-6 h-6 text-neutral-400" />
                                        </button>

                                        {/* Color Picker */}
                                        <div className="relative aspect-square rounded-xl border-2 border-neutral-700 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                                            title="Custom Color"
                                            style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}>
                                            <input
                                                type="color"
                                                className="absolute inset-[0] w-[200%] h-[200%] cursor-pointer opacity-0"
                                                onChange={(e) => { setBgColor(e.target.value); setCustomBgImage(null); setSliderPosition(0); }}
                                            />
                                        </div>

                                        {/* Predefined Colors */}
                                        {PREDEFINED_COLORS.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => { setBgColor(color); setCustomBgImage(null); setSliderPosition(0); }}
                                                className={`aspect-square rounded-xl border-2 transition-transform hover:scale-105 ${bgColor === color && !customBgImage ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                                                style={{ background: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                )}

                                {activeTab === "photo" && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {/* Upload Custom BG */}
                                        <label className="aspect-square rounded-xl border-2 border-dashed border-neutral-600 bg-neutral-800 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-neutral-700 transition-all">
                                            <Upload className="w-5 h-5 text-neutral-400 mb-1" />
                                            <span className="text-[10px] text-neutral-400 font-medium">Upload</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleCustomBgUpload} />
                                        </label>

                                        {/* Predefined Photos */}
                                        {PREDEFINED_PHOTOS.map((photo, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setCustomBgImage(photo); setBgColor(""); setSliderPosition(0); }}
                                                className={`aspect-square rounded-xl border-2 overflow-hidden transition-transform hover:scale-105 ${customBgImage === photo ? 'border-blue-500 scale-105' : 'border-transparent'}`}
                                            >
                                                <img src={photo} alt="bg" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {activeTab === "magic" && (
                                    <div className="flex flex-col items-center justify-center p-6 gap-6 min-h-[300px]">

                                        {/* AI Photo Enhance Toggle */}
                                        <div className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-5 flex items-center justify-between transition-all hover:bg-neutral-800">
                                            <div className="flex flex-col gap-1 pr-4">
                                                <h4 className="font-bold text-neutral-100 flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                                    AI Enhance Photo
                                                </h4>
                                                <p className="text-xs text-neutral-400 leading-relaxed">
                                                    Automatically improve colors, contrast, and clarify faces using AI (like Remini).
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => setEnhance(!enhance)}
                                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${enhance ? 'bg-blue-500' : 'bg-neutral-600'}`}
                                            >
                                                <span
                                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${enhance ? 'translate-x-6' : 'translate-x-1'}`}
                                                />
                                            </button>
                                        </div>

                                        <div className="w-full h-[1px] bg-neutral-800"></div>

                                        <div className="text-center text-neutral-500 flex flex-col items-center gap-2 mt-4">
                                            <ImageIcon className="w-8 h-8 opacity-50" />
                                            <p className="text-sm font-medium">Magic Backgrounds<br />(Coming Soon)</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleCreatePassport}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20 mb-2"
                            >
                                <LayoutGrid className="w-5 h-5" />
                                Create Passport Photos
                            </button>
                            <button
                                onClick={handleCreateAlbum}
                                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-500/20 mb-2"
                            >
                                <Palette className="w-5 h-5" />
                                Create Album Picture
                            </button>
                            <button
                                onClick={handleDownload}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                            >
                                <Download className="w-5 h-5" />
                                Download HD
                            </button>
                            <button
                                onClick={onReset}
                                className="w-full py-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <IterationCcw className="w-4 h-4" />
                                Upload Another Image
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
