import Link from "next/link";
import { Scale, Sparkles } from "lucide-react";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white py-32 px-6">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="px-5 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-black uppercase tracking-[2px] border border-indigo-100 mb-8 inline-block">Service Agreement</div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8">User <span className="text-indigo-600">Terms</span> of Service</h1>
                    <p className="max-w-2xl mx-auto text-slate-500 font-medium text-lg md:text-xl text-center">
                        Simple rules to ensure a smooth and fair experience for every ALLBgremove user.
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-slate-50/50 p-10 md:p-16 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden w-full">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="space-y-12 relative z-10 w-full">
                        <article className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-p:font-medium prose-p:text-slate-600 prose-p:leading-relaxed prose-h2:text-slate-900 prose-h2:text-3xl prose-h2:tracking-tight prose-h2:mb-8 prose-h2:pt-8 prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2">
                            <p className="text-xl font-bold text-slate-900 mb-12 border-b border-slate-200 pb-8 tracking-tight italic">Last Updated: October 12, 2026</p>
                            
                            <h2 id="acceptance">1. Acceptance of Terms</h2>
                            <p>By using ALLBgremove AI at allbgremove.com, you agree to be bound by these terms. If you do not agree, please do not use our services. We may update these terms periodically to reflect new features or legal requirements.</p>

                            <h2 id="use-license">2. Permitted Use</h2>
                            <p>You may use ALLBgremove for personal or commercial projects. However, you must respect the following:</p>
                            <ul>
                                <li>No automated scraping or bot-based use that degrades our server performance.</li>
                                <li>No uploading of illegal or infringing content.</li>
                                <li>No resale of our base API access without an enterprise agreement.</li>
                            </ul>

                            <h2 id="limitations">3. Limitations of Service</h2>
                            <p>While we aim for 100% accuracy, AI results may vary depending on image complexity. ALLBgremove provides its service "as is" and "as available". We are not responsible for any data loss during transit or processing.</p>

                            <h2 id="termination">4. Service Access</h2>
                            <p>We reserve the right to block access to specific IPs or users who violate our technical rate limits or these Terms of Service.</p>

                            <h2 id="contact">5. Legal Inquiries</h2>
                            <p>For legal queries or formal complaints, please contact our legal team at <a href="mailto:legal@allbgremove.com" className="text-blue-600 hover:underline">legal@allbgremove.com</a>.</p>
                        </article>

                        <div className="pt-10 border-t border-slate-200 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-lg mb-8 border border-slate-100 -rotate-12"><Scale className="w-8 h-8"/></div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[3px] mb-8">Binding Service Level Agreement for All Users</p>
                            <Link href="/" className="btn-secondary px-10 shadow-sm">
                                I Understand, Back to App
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
