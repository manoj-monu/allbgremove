"use client";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, Zap, Sparkles, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";

const PLANS = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for testing the quality and individuals.",
    features: [
      "5 HD Images Per Day",
      "Standard AI Precision",
      "Access to Basic Studio",
      "Standard Resolution Exports"
    ],
    button: "Get Started Free",
    highlight: false
  },
  {
    name: "Creator Pro",
    price: "12",
    description: "The best value for designers and photographers.",
    features: [
      "Unlimited HD Images",
      "4K Ultra-Res Processing",
      "Instant Bulk Mode (50/Batch)",
      "Priority AI Optimization",
      "No Ads or Watermarks",
      "Priority Email Support"
    ],
    button: "Go Pro Now",
    highlight: true,
    tag: "Best Value"
  },
  {
    name: "Business",
    price: "49",
    description: "Enterprise power for high-volume teams.",
    features: [
      "API & Webhook Access (v1.0)",
      "Team seats (Up to 10)",
      "White-labeling Options",
      "Custom Filter Models",
      "Dedicated account manager",
      "SLAs & Legal Support"
    ],
    button: "Contact Sales",
    highlight: false
  }
];

export default function PricingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 py-32 px-6">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialType="signup" />
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="px-5 py-2 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-[2px] border border-blue-100 mb-8 inline-block">Simple & Transparent</div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">Choose the <span className="text-blue-600">Perfect Plan</span></h1>
          <p className="max-w-2xl text-slate-500 font-medium text-lg md:text-xl">
             Start for free and scale as you grow. Our AI tools are built to handle single edits or thousands of images at once.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-20">
          {PLANS.map((plan, idx) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-10 rounded-[3rem] border flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${plan.highlight ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/30' : 'bg-white border-slate-100 text-slate-900 shadow-sm'}`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 p-6 opacity-10 text-white"><Sparkles className="w-24 h-24" /></div>
              )}
              
              <div className="mb-10">
                <h3 className={`text-2xl font-black mb-2 ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                   <span className="text-5xl font-black tracking-tighter">${plan.price}</span>
                   <span className={`text-[15px] font-bold ${plan.highlight ? 'text-blue-100 opacity-60' : 'text-slate-400'}`}>/month</span>
                </div>
                <p className={`text-[15px] leading-relaxed font-medium ${plan.highlight ? 'text-blue-50' : 'text-slate-500'}`}>{plan.description}</p>
              </div>

              <div className={`h-px w-full mb-10 ${plan.highlight ? 'bg-white/20' : 'bg-slate-100'}`}></div>

              <ul className="space-y-5 mb-12 flex-grow">
                 {plan.features.map((f, i) => (
                   <li key={i} className={`flex items-center gap-3 font-bold text-sm ${plan.highlight ? 'text-white' : 'text-slate-700'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-white/20 shadow-lg' : 'bg-blue-50'}`}>
                         <Check className={`w-3.5 h-3.5 ${plan.highlight ? 'text-white' : 'text-blue-600'}`} />
                      </div>
                      {f}
                   </li>
                 ))}
              </ul>

              <button 
                onClick={() => setIsAuthOpen(true)}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${plan.highlight ? 'bg-white text-blue-600 hover:bg-slate-50 shadow-xl' : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-black/10'}`}>
                {plan.button} <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Footer info */}
        <div className="w-full max-w-4xl p-10 md:p-14 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0 shadow-sm border border-blue-100">
                 <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                 <h4 className="text-xl font-black text-slate-900 mb-2">Enterprise Solutions</h4>
                 <p className="text-slate-500 font-medium">Looking for customized API access or white-labeling for your entire corporation?</p>
              </div>
           </div>
           <Link href="/contact" className="px-10 py-5 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-black hover:bg-slate-50 transition-all shadow-sm whitespace-nowrap">
              Talk to Sales
           </Link>
        </div>

        <div className="mt-20">
           <Link href="/" className="text-slate-400 font-black uppercase text-xs tracking-[4px] hover:text-blue-600 transition-colors">← Back to tool</Link>
        </div>
      </div>
    </main>
  );
}
