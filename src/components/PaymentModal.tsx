"use client";
import { useState } from "react";
import { X, CheckCircle, Shield, CreditCard, Sparkles, Loader2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  price: number;
}

export default function PaymentModal({ isOpen, onClose, onSuccess, price }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment process
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess();
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {!isSuccess ? (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                       <Sparkles className="w-5 h-5 text-amber-500" /> Premium 4K Export
                   </h3>
                   <p className="text-xs text-slate-500 font-medium mt-1">Unlock ultra-high resolution without watermark</p>
                </div>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative z-10 bg-slate-50 rounded-full">
                  <X className="w-5 h-5" />
                </button>
            </div>
            
            <div className="p-8">
               <div className="flex justify-center mb-8">
                  <div className="flex items-end gap-1">
                     <span className="text-6xl font-black text-slate-900 tracking-tighter">₹{price}</span>
                     <span className="text-slate-500 font-bold mb-2">/image</span>
                  </div>
               </div>

               <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-600 font-medium">
                     <CheckCircle className="w-5 h-5 text-emerald-500" /> <span className="text-sm">Full 4K Ultra-HD Resolution</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-medium">
                     <CheckCircle className="w-5 h-5 text-emerald-500" /> <span className="text-sm">Pristine Edge Details (Hair/Fur)</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-medium">
                     <CheckCircle className="w-5 h-5 text-emerald-500" /> <span className="text-sm">Priority Server Processing</span>
                  </div>
               </div>

               <button 
                  onClick={handlePayment} 
                  disabled={isProcessing}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
               >
                  {isProcessing ? (
                     <><Loader2 className="w-5 h-5 animate-spin" /> Processing Payment...</>
                  ) : (
                     <><CreditCard className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" /> Pay & Unlock</>
                  )}
               </button>

               <div className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <Shield className="w-3 h-3" /> Secure Payment Gateway
               </div>
            </div>
          </>
        ) : (
            <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300 shadow-xl shadow-emerald-500/20">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Payment Successful!</h3>
                <p className="text-slate-500 font-medium">Your 4K image is now unlocking...</p>
            </div>
        )}
      </div>
    </div>
  );
}
