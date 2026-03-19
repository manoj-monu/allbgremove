import Link from "next/link";
import { Mail, MessageCircle, Phone, Sparkles } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white py-32 px-6">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="px-5 py-2 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-[2px] border border-blue-100 mb-8 inline-block">Support Center</div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8">How can we <span className="text-blue-600">Help You?</span></h1>
                    <p className="max-w-2xl mx-auto text-slate-500 font-medium text-lg md:text-xl">
                        Have a complex photo that AI didn&apos;t handle well? Or need help with your API integration?
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-slate-50/50 p-10 md:p-16 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden w-full">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="space-y-12 relative z-10 w-full">
                        <section className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg mb-8"><Mail className="w-8 h-8"/></div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Direct Support</h3>
                            <p className="text-slate-500 font-medium mb-12">We respond to every single valid inquiry within 12 hours.</p>
                            <a href="mailto:support@pixelcut.com" className="text-3xl font-black text-blue-600 tracking-tighter hover:underline">support@pixelcut.com</a>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-start">
                                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">Partnerships</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    Are you looking to integrate our AI into your app or marketplace? Our developer team will help you with custom API endpoints.
                                </p>
                            </section>

                            <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-start">
                                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">Report a Bug</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    Encountered an issue with your specific image resolution? Send us the original file and we&apos;ll use it to improve our edge neural network.
                                </p>
                            </section>
                        </div>

                        <div className="pt-10 border-t border-slate-200 text-center">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[3px] mb-8">Currently serving 1.2M+ monthly users with zero downtime</p>
                            <Link href="/" className="btn-secondary px-10 shadow-sm">
                                Back to Main App
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
