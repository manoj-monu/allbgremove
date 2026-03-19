import Link from "next/link";
import { Shield, Sparkles } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-white py-32 px-6">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="px-5 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase tracking-[2px] border border-emerald-100 mb-8 inline-block">Security First</div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8">Our <span className="text-emerald-500">Privacy</span> Protocol</h1>
                    <p className="max-w-2xl mx-auto text-slate-500 font-medium text-lg md:text-xl text-center">
                        Transparent. Secure. Private. Your data belongs to you, and we work hard to keep it that way.
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-slate-50/50 p-10 md:p-16 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden w-full">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="space-y-12 relative z-10 w-full">
                        <article className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-p:font-medium prose-p:text-slate-600 prose-p:leading-relaxed prose-h2:text-slate-900 prose-h2:text-3xl prose-h2:tracking-tight prose-h2:mb-8 prose-h2:pt-8 prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2">
                            <p className="text-xl font-bold text-slate-900 mb-12 border-b border-slate-200 pb-8 tracking-tight italic">Effective Date: October 12, 2026</p>
                            
                            <h2 id="data-collection">1. Data Minimization</h2>
                            <p>PixelCut is designed from the ground up to collect as little data as possible. We do not require account creation for basic functional use. When you upload an image for processing, the image is buffered in our server&apos;s volatile memory during the AI inference phase and immediately purged once the download link is provided or the session expires.</p>

                            <h2 id="usage-tracking">2. Usage Tracking</h2>
                            <p>We use industry-standard, privacy-respecting analytics tools to understand how many users visit our service. This data is aggregated and does not personally identify you. We use this to monitor server capacity and improve our AI models&apos; response times.</p>

                            <h2 id="cookies">3. Cookies & Local Storage</h2>
                            <p>We use simple local storage to remember your editor preferences (like zoom levels or background color choices) during a single session. We do not use persistent cross-site tracking cookies to build profiles for advertisers.</p>

                            <h2 id="third-party">4. Third-party Processing</h2>
                            <p>Our AI models run on secured infrastructure. Your images are never sent to third-party marketplaces or used to publicly aggregate data. We do not sell your data to anyone.</p>

                            <h2 id="contact">5. Privacy Inquiries</h2>
                            <p>If you have questions about our data protocol or wish to request information, please contact our privacy lead at <a href="mailto:privacy@pixelcut.com" className="text-blue-600 hover:underline">privacy@pixelcut.com</a>.</p>
                        </article>

                        <div className="pt-10 border-t border-slate-200 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-500 flex-shrink-0 shadow-lg mb-8 border border-slate-100 rotate-12"><Shield className="w-8 h-8"/></div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[3px] mb-8">Verified Secure Processing Environment</p>
                            <Link href="/" className="btn-secondary px-10 shadow-sm">
                                Back to Editor
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
