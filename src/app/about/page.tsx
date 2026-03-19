import Link from "next/link";
import { Sparkles, Globe, Heart, Shield } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white py-32 px-6">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="px-5 py-2 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-[2px] border border-blue-100 mb-8 inline-block">The Mission</div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8">Empowering <span className="text-blue-600">Creators</span> Worldwide</h1>
                    <p className="max-w-2xl mx-auto text-slate-500 font-medium text-lg md:text-xl">
                        Design shouldn&apos;t be a struggle. We built ALLBgremove.com to democratize high-end AI editing tools for everyone.
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-slate-50/50 p-10 md:p-16 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden w-full">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="space-y-12 relative z-10 w-full">
                        <section className="flex flex-col md:flex-row gap-10 items-start">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0 shadow-lg border border-slate-100"><Sparkles className="w-8 h-8"/></div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Our Story</h3>
                                <p className="text-slate-600 leading-relaxed font-medium text-lg">
                                    Founded in 2023, ALLBgremove emerged from a simple observation: removing backgrounds is the most common but tedious task in visual design. We gathered a team of AI researchers and product designers to build a tool that isn&apos;t just fast, but incredibly precise.
                                </p>
                            </div>
                        </section>

                        <section className="flex flex-col md:flex-row gap-10 items-start">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-500 flex-shrink-0 shadow-lg border border-slate-100"><Shield className="w-8 h-8"/></div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Privacy First</h3>
                                <p className="text-slate-600 leading-relaxed font-medium text-lg">
                                    We believe you shouldn&apos;t have to trade your identity for a tool. Our browser-based processing ensures that your photos are processed securely within your device&apos;s memory whenever possible, and immediately deleted from our buffers once our AI is done.
                                </p>
                            </div>
                        </section>

                        <section className="flex flex-col md:flex-row gap-10 items-start">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-500 flex-shrink-0 shadow-lg border border-slate-100"><Heart className="w-8 h-8"/></div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Community Driven</h3>
                                <p className="text-slate-600 leading-relaxed font-medium text-lg">
                                    What started as a tool for e-commerce sellers is now used by photographers, influencers, and marketers across 180 countries. Your feedback drives every update we ship.
                                </p>
                            </div>
                        </section>

                        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex flex-col text-center md:text-left">
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[3px] mb-2">Developed with focus</span>
                                <span className="text-xl font-black text-slate-900 tracking-tighter">— The ALLBgremove Team</span>
                            </div>
                            <Link href="/" className="btn-primary px-10 shadow-xl shadow-blue-500/20">
                                Try It Yourself
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                   <Link href="/" className="text-slate-400 font-black uppercase text-xs tracking-[4px] hover:text-blue-600 transition-colors">← Back to tool</Link>
                </div>
            </div>
        </main>
    );
}
