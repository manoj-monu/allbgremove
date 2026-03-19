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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-start w-full">
                                <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Direct Support</h3>
                                <div className="space-y-4 w-full">
                                    <div className="flex items-center gap-4 text-slate-600 font-medium">
                                        <Mail className="w-5 h-5 text-blue-600" /> support@pixelcut.com
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-600 font-medium">
                                        <Phone className="w-5 h-5 text-blue-600" /> +1 (555) 012-3456
                                    </div>
                                </div>
                                <div className="mt-10 pt-10 border-t border-slate-50 w-full">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                        Response time: Under 12 Hours
                                    </p>
                                </div>
                            </section>

                            <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm w-full">
                                <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Send a Message</h3>
                                <form className="space-y-4">
                                    <input type="text" placeholder="Your Name" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600/10 focus:outline-none" />
                                    <input type="email" placeholder="Email Address" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600/10 focus:outline-none" />
                                    <textarea placeholder="How can we help?" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-medium h-32 focus:ring-2 focus:ring-blue-600/10 focus:outline-none resize-none"></textarea>
                                    <button className="btn-primary w-full py-4 text-sm">Submit Inquiry</button>
                                </form>
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
