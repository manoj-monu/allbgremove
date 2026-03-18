"use client";
import { Check, Sparkles, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for testing the quality and getting started.",
    features: [
      "Standard Resolution Results",
      "Unlimited Transparent PNGs",
      "Access to Basic Editor",
      "Manual High-Res export wait"
    ],
    button: "Get Started",
    highlight: false
  },
  {
    name: "Creator Pro",
    price: "12",
    description: "The best value for individual creators and photographers.",
    features: [
      "4K Ultra HD Processing",
      "Instant Bulk Processing",
      "Advanced AI Enhancement",
      "No Ads or Watermarks",
      "Priority Cloud Storage"
    ],
    button: "Start Free Trial",
    highlight: true
  },
  {
    name: "Agency Bulk",
    price: "49",
    description: "Professional power for enterprises and high-volume teams.",
    features: [
      "API & Zapier Integration",
      "White-labeling Options",
      "1000+ High-Res Exports/mo",
      "Dedicated Account Manager",
      "Custom Filter Models"
    ],
    button: "Contact Sales",
    highlight: false
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header section */}
      <section className="pt-32 pb-20 px-6 text-center bg-gradient-to-b from-blue-50/50 to-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Transparent <span className="text-blue-600">Pricing</span></h1>
          <p className="text-xl text-gray-500 font-medium">Choose the perfect plan for your high-definition needs.</p>
        </motion.div>
      </section>

      {/* Pricing Grids */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-10 rounded-[2.5rem] border flex flex-col items-start text-left relative transition-all duration-500 ${plan.highlight ? 'bg-blue-600 border-blue-600 shadow-2xl shadow-blue-500/30' : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-xl'}`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-white/20 px-5 py-2 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">Most Popular</div>
              )}
              
              <h3 className={`text-2xl font-black mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className={`text-5xl font-black tracking-tighter ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>${plan.price}</span>
                <span className={`text-[15px] font-bold ${plan.highlight ? 'text-blue-100' : 'text-gray-400'}`}>/month</span>
              </div>
              <p className={`mb-10 text-[15px] leading-relaxed font-medium ${plan.highlight ? 'text-blue-50' : 'text-gray-500'}`}>{plan.description}</p>
              
              <div className="h-px w-full bg-current opacity-10 mb-10"></div>
              
              <ul className="space-y-5 mb-12 flex-grow">
                {plan.features.map(feature => (
                  <li key={feature} className={`flex items-center gap-3 text-[14px] font-bold ${plan.highlight ? 'text-white' : 'text-gray-700'}`}>
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-white/20' : 'bg-blue-50'}`}>
                      <Check className={`w-3 h-3 ${plan.highlight ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-5 rounded-3xl font-black text-[15px] flex items-center justify-center gap-2 transition-all active:scale-95 ${plan.highlight ? 'bg-white text-blue-600 hover:bg-white/90' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-black/10'}`}>
                {plan.button} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Comparison Footnote */}
        <div className="mt-20 p-10 rounded-[3rem] bg-gray-50 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Need a custom plan?</h4>
              <p className="text-gray-500 font-medium">Special pricing available for high-volume enterprise needs.</p>
            </div>
          </div>
          <button className="px-10 py-5 bg-white border border-gray-200 rounded-2xl font-black text-gray-800 hover:bg-gray-100 transition-colors uppercase tracking-widest text-xs">Contact Support</button>
        </div>
      </section>
    </div>
  );
}
