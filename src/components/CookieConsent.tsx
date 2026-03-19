"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "true");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] z-[100]"
                >
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-2xl backdrop-blur-xl bg-opacity-95 flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
                                <Cookie className="w-6 h-6" />
                            </div>
                            <h3 className="text-white font-bold text-lg tracking-tight">Cookie Preferences</h3>
                        </div>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                            We use AI-enhancing cookies to improve your background removal experience and for site analytics. By clicking accept, you agree to our <a href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</a>.
                        </p>
                        <div className="flex gap-3 w-full mt-2">
                            <button 
                                onClick={handleAccept}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-colors"
                            >
                                Accept All
                            </button>
                            <button 
                                onClick={() => setIsVisible(false)}
                                className="px-4 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
