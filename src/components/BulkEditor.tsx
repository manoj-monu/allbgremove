"use client";
import { useState, useEffect } from "react";
import { 
  AnimatePresence, motion 
} from "framer-motion";
import { 
  Copy, CheckCircle, Ban, Download, Loader2, 
  ArrowLeft, Image as ImageIcon, Sparkles, LayoutGrid, X,
  FileArchive
} from "lucide-react";
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
  const [elapsedTime, setElapsedTime] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://bg-remover-api-vbi7.onrender.com";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessingAll) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessingAll]);

  useEffect(() => {
    const newTasks = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      processedUrl: null,
      status: "pending" as const,
    }));
    setTasks(newTasks);
    startBatchProcessing(newTasks);
    return () => newTasks.forEach(t => URL.revokeObjectURL(t.originalUrl));
  }, [files]);

  const updateTask = (id: string, updates: Partial<ProcessedFile>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const startBatchProcessing = async (taskList: ProcessedFile[]) => {
    setIsProcessingAll(true);
    for (const task of taskList) {
      if (task.status === "done") continue;
      try {
        updateTask(task.id, { status: "uploading" });
        const formData = new FormData();
        formData.append("file", task.originalFile);
        const response = await fetch(`${apiUrl}/api/remove-bg-async?enhance=false`, {
            method: "POST", body: formData,
        });
        if (!response.ok) throw new Error("Upload failed");
        const data = await response.json();
        const taskId = data.task_id;
        updateTask(task.id, { status: "processing" });

        let isCompleted = false;
        while (!isCompleted) {
            await new Promise(r => setTimeout(r, 2000));
            const statusRes = await fetch(`${apiUrl}/api/status/${taskId}`);
            const statusData = await statusRes.json();
            if (statusData.status === "completed") isCompleted = true;
            else if (statusData.status === "failed") throw new Error("Failed");
        }

        const resultRes = await fetch(`${apiUrl}/api/result/${taskId}`);
        const blob = await resultRes.blob();
        updateTask(task.id, { status: "done", processedUrl: URL.createObjectURL(blob) });
      } catch (err) {
        updateTask(task.id, { status: "error", errorMsg: "Error" });
      }
    }
    setIsProcessingAll(false);
  };

  const downloadAllZip = async () => {
    const zip = new JSZip();
    const doneTasks = tasks.filter(t => t.status === "done" && t.processedUrl);
    await Promise.all(doneTasks.map(async task => {
      const response = await fetch(task.processedUrl!);
      const blob = await response.blob();
      zip.file(`${task.originalFile.name.split('.')[0]}.png`, blob);
    }));
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "bulk_exports.zip");
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
           <button onClick={onReset} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-2 group">
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Exit Bulk Studio
           </button>
           <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Batch Manager</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col items-end border-r border-slate-100 pr-6">
             <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Total Time</span>
             <span className="text-lg font-black text-slate-600">{elapsedTime}s</span>
          </div>
          <div className="hidden lg:flex flex-col items-end">
             <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Processing Progress</span>
             <span className="text-lg font-black text-blue-600">{tasks.filter(t => t.status === "done").length} <span className="text-slate-300">/</span> {tasks.length}</span>
          </div>
          <button 
             onClick={downloadAllZip}
             disabled={tasks.filter(t => t.status === "done").length === 0}
             className="btn-primary py-4 px-10 rounded-2xl shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
          >
            <FileArchive className="w-5 h-5" /> Download All ZIP
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {tasks.map(task => (
           <div key={task.id} className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm relative group overflow-hidden flex flex-col items-center">
              <div className="w-full aspect-square bg-slate-50 rounded-[1.5rem] overflow-hidden relative flex items-center justify-center">
                 <img src={task.processedUrl || task.originalUrl} alt="preview" className={`w-full h-full object-contain ${task.status !== 'done' ? 'opacity-30 blur-[2px] grayscale' : ''}`} />
                 
                 {task.status !== "done" && task.status !== "error" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 backdrop-blur-[2px]">
                       <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    </div>
                 )}

                 {task.status === "done" && (
                    <div className="absolute inset-x-0 bottom-4 px-4 z-20">
                       <button onClick={() => saveAs(task.processedUrl!, "export.png")} className="w-full bg-white text-blue-600 py-3 rounded-xl shadow-xl flex items-center justify-center gap-2 font-black text-xs hover:scale-105 active:scale-95 transition-all">
                         <Download className="w-4 h-4" /> Download
                       </button>
                    </div>
                 )}
              </div>
              <div className="w-full mt-4 flex items-center justify-between px-2">
                 <p className="text-xs font-bold text-slate-500 truncate max-w-[150px]">{task.originalFile.name}</p>
                 {task.status === "done" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                 {task.status === "error" && <Ban className="w-4 h-4 text-red-500" />}
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}
