"use client";
import { X, Mail, Lock, Sparkles, ArrowRight, Loader2, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialType = "login" }: AuthModalProps) {
  const [type, setType] = useState<"login" | "signup">(initialType);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
        setIsLoading(false);
        onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          ></motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-lg rounded-[2.5rem] p-4 lg:p-6 shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors z-20"><X className="w-6 h-6" /></button>
            
            <div className="flex flex-col items-center px-4 py-8 relative z-10">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-6">
                    <Sparkles className="w-8 h-8" />
                </div>
                
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">
                    {type === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-slate-500 font-medium mb-10 text-center">
                    {type === "login" ? "Enter your credentials to manage your subscriptions." : "Join 20,000+ creators building with PixelCut."}
                </p>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            required type="email" placeholder="Email Address" 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium" 
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            required type="password" placeholder="Password" 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium" 
                        />
                    </div>

                    <button disabled={isLoading} className="btn-primary w-full py-5 rounded-2xl shadow-xl shadow-blue-500/20 mt-6 font-black text-lg">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (type === "login" ? "Access My Studio" : "Begin My Journey")}
                    </button>
                </form>

                <div className="w-full flex items-center gap-4 my-10">
                    <div className="flex-grow h-px bg-slate-100"></div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[3px]">Secure Access Level</span>
                    <div className="flex-grow h-px bg-slate-100"></div>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <button className="w-full py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                        <img src="https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="G" className="w-5 h-5" />
                        Continue with Google
                    </button>
                    {type === "login" ? (
                        <p className="text-sm font-medium text-slate-500 text-center mt-4">
                            Don&apos;t have a subscription yet? <button onClick={() => setType("signup")} className="text-blue-600 font-black hover:underline">Subscribe Now</button>
                        </p>
                    ) : (
                        <p className="text-sm font-medium text-slate-500 text-center mt-4">
                            Already a subscriber? <button onClick={() => setType("login")} className="text-blue-600 font-black hover:underline">Sign In</button>
                        </p>
                    )}
                </div>
            </div>
            
            <div className="bg-slate-900 p-6 flex flex-col items-center justify-center text-center">
                 <p className="text-white/60 text-[10px] font-bold uppercase tracking-[3px] mb-2">Verified Professional Environment</p>
                 <div className="flex gap-4 opacity-40">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Stripe_Logo%2C_revised_2016.png" className="h-4 invert" alt="Stripe" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/PayPal_logo.svg" className="h-4" alt="PayPal" />
                 </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
