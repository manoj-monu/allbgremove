import Link from "next/link";
import { Info, Sparkles } from "lucide-react";

export default function DisclaimerPage() {
    return (
        <main className="min-h-screen bg-white py-32 px-6">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="px-5 py-2 rounded-full bg-orange-50 text-orange-600 text-[11px] font-black uppercase tracking-[2px] border border-orange-100 mb-8 inline-block">Liability Disclosure</div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8">Service <span className="text-orange-600">Disclaimers</span></h1>
                    <p className="max-w-2xl mx-auto text-slate-500 font-medium text-lg md:text-xl text-center">
                        Wait, here&apos;s a quick note on the limits of AI and our service.
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-slate-50/50 p-10 md:p-16 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden w-full">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="space-y-12 relative z-10 w-full">
                        <article className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-p:font-medium prose-p:text-slate-600 prose-p:leading-relaxed prose-h2:text-slate-900 prose-h2:text-3xl prose-h2:tracking-tight prose-h2:mb-8 prose-h2:pt-8 prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2">
                            <p className="text-xl font-bold text-slate-900 mb-12 border-b border-slate-200 pb-8 tracking-tight italic">Revision: October 12, 2026</p>
                            
                            <h2 id="ai-accuracy">1. AI Model Variance</h2>
                            <p>PixelCut uses current transformer models for image segmentation. While they are world-class, they are not 100% perfect. Results may vary on extremely low-resolution images, heavy motion blur, or when subjects share a nearly identical color with the background. We provide the "Magic" tool but do not guarantee specific quality for any given input.</p>

                            <h2 id="financial">2. No Financial Advice</h2>
                            <p>Nothing on this website, including our pricing comparisons or ROI claims, constitutes financial or legal advice. Our pricing is reflective of our market position and AI processing costs.</p>

                            <h2 id="third-party">3. External Links</h2>
                            <p>We may link to external tools, stock photo sites, or design inspiration. We do not control or endorse the content on these sites and are not responsible for their data policies or service levels.</p>

                            <h2 id="liability">4. Limitation of Liability</h2>
                            <p>To the maximum extent permitted by law, PixelCut AI and its developers are not liable for any indirect, incidental, or consequential damages arising from the use of our image processing tool or our website as a whole.</p>

                            <h2 id="contact">5. Clarification</h2>
                            <p>If you need clarification on any point of this disclosure, feel free to visit our <Link href="/contact" className="text-blue-600 hover:underline">Help Center</Link>.</p>
                        </article>

                        <div className="pt-10 border-t border-slate-200 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-600 flex-shrink-0 shadow-lg mb-8 border border-slate-100 rotate-45"><Info className="w-8 h-8"/></div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[3px] mb-8">Transparent and Professional Disclosure</p>
                            <Link href="/" className="btn-secondary px-10 shadow-sm">
                                Back to App
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
