"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, CheckCircle, Ban, Download, Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import imageCompression from 'browser-image-compression';
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface BulkEditorProps {
  files: File[];
  onReset: () => void;
}

interface ProcessedFile {
  id: string;
  originalFile: File;
  originalUrl: string;
  processedUrl: string | null;
  status: "pending" | "uploading" | "processing" | "done" | "error";
  errorMsg?: string;
}

export default function BulkEditor({ files, onReset }: BulkEditorProps) {
  const [tasks, setTasks] = useState<ProcessedFile[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://bg-remover-api-vbi7.onrender.com";

  useEffect(() => {
    // Initialize task list from files
    const newTasks = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      processedUrl: null,
      status: "pending" as const,
    }));
    setTasks(newTasks);
    
    // Automatically start processing
    startBatchProcessing(newTasks);

    return () => {
      // Cleanup URLs
      newTasks.forEach(t => {
        URL.revokeObjectURL(t.originalUrl);
        if (t.processedUrl) URL.revokeObjectURL(t.processedUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const updateTask = (id: string, updates: Partial<ProcessedFile>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const startBatchProcessing = async (taskList: ProcessedFile[]) => {
    setIsProcessingAll(true);
    
    // Process sequentially to not overload the user's browser or hit rate limits instantly
    // The backend queue already handles parallel drops safely.
    for (const task of taskList) {
      if (task.status === "done") continue;

      try {
        updateTask(task.id, { status: "uploading" });

        // Compress
        let fileToUpload = task.originalFile;
        try {
            fileToUpload = await imageCompression(task.originalFile, {
                maxSizeMB: 0.8, maxWidthOrHeight: 1024, useWebWorker: true
            });
        } catch (e) {
            console.warn("Compression failed for", task.originalFile.name);
        }

        const formData = new FormData();
        formData.append("file", fileToUpload);

        // Upload
        const response = await fetch(`${apiUrl}/api/remove-bg-async?enhance=false`, {
            method: "POST", body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");
        const data = await response.json();
        const taskId = data.task_id;

        updateTask(task.id, { status: "processing" });

        // Poll
        let isCompleted = false;
        while (!isCompleted) {
            await new Promise(r => setTimeout(r, 2000));
            const statusRes = await fetch(`${apiUrl}/api/status/${taskId}`);
            if (!statusRes.ok) throw new Error("Connection lost");
            const statusData = await statusRes.json();

            if (statusData.status === "completed") isCompleted = true;
            else if (statusData.status === "failed") throw new Error("Failed processing");
        }

        // Fetch result
        const resultRes = await fetch(`${apiUrl}/api/result/${taskId}`);
        if (!resultRes.ok) throw new Error("Result download failed");
        const blob = await resultRes.blob();
        const processedUrl = URL.createObjectURL(blob);

        updateTask(task.id, { status: "done", processedUrl });

      } catch (err) {
        updateTask(task.id, { 
          status: "error", 
          errorMsg: err instanceof Error ? err.message : "Unknown error" 
        });
      }
    }
    
    setIsProcessingAll(false);
  };

  const downloadAllZip = async () => {
    const doneTasks = tasks.filter(t => t.status === "done" && t.processedUrl);
    if (doneTasks.length === 0) return;

    const zip = new JSZip();
    
    // Create promises to fetch all blob data
    const fetchPromises = doneTasks.map(async (task, i) => {
      const response = await fetch(task.processedUrl!);
      const blob = await response.blob();
      // Keep original name but change extension to .png
      const originalName = task.originalFile.name;
      const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
      zip.file(`${baseName}_rmbg.png`, blob);
    });

    await Promise.all(fetchPromises);
    
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "allbgremove_bulk.zip");
  };

  const doneCount = tasks.filter(t => t.status === "done").length;
  const errorCount = tasks.filter(t => t.status === "error").length;
  const totalCount = tasks.length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Cancel Bulk
        </button>
        
        <div className="flex items-center gap-6">
          <div className="text-sm font-semibold text-gray-500">
            Processed: <span className="text-blue-600 font-black">{doneCount}</span> / {totalCount}
          </div>
          <button 
            onClick={downloadAllZip}
            disabled={doneCount === 0 || isProcessingAll}
            className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              doneCount > 0 
                ? "bg-black hover:bg-gray-800 text-white shadow-lg shadow-black/20" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Download className="w-5 h-5" /> Download All ZIP
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2rem] p-3 shadow-lg shadow-gray-200/40 border border-gray-100 flex flex-col items-center relative group"
            >
              <div className="w-full aspect-square rounded-[1.5rem] bg-gray-50 overflow-hidden relative"
                style={{ backgroundImage: task.status === 'done' ? 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)' : '', backgroundSize: '16px 16px' }}
              >
                <img 
                  src={task.processedUrl || task.originalUrl} 
                  alt="preview" 
                  className={`w-full h-full object-contain ${task.status !== 'done' ? 'opacity-50 blur-[2px]' : ''} transition-all duration-500`} 
                />
                
                {/* Status Overlays */}
                {task.status === "uploading" && (
                  <div className="absolute inset-0 bg-white/40 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                    <span className="text-xs font-bold text-gray-700">Uploading</span>
                  </div>
                )}
                {task.status === "processing" && (
                  <div className="absolute inset-0 bg-white/40 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-2" />
                    <span className="text-xs font-bold text-gray-700">AI Magic...</span>
                  </div>
                )}
                {task.status === "error" && (
                  <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center p-4 text-center">
                    <Ban className="w-8 h-8 text-red-500 mb-2" />
                    <span className="text-[10px] font-bold text-red-600">{task.errorMsg}</span>
                  </div>
                )}
                {task.status === "done" && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => saveAs(task.processedUrl!, `allbg_${task.originalFile.name}.png`)}
                      className="bg-white text-gray-900 p-2 rounded-xl flex items-center gap-1 text-xs font-bold hover:scale-105 transition-transform"
                    >
                      <Download className="w-4 h-4" /> Save
                    </button>
                  </div>
                )}
              </div>
              
              <div className="w-full mt-3 px-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 truncate max-w-[70%]">
                  {task.originalFile.name}
                </span>
                {task.status === "done" && <CheckCircle className="w-4 h-4 text-green-500" />}
                {task.status === "pending" && <Loader2 className="w-4 h-4 text-gray-300" />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
