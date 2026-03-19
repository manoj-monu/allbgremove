import Link from "next/link";
import { ChevronRight, ArrowRight, Sparkles } from "lucide-react";

const POSTS = [
    { 
        title: "How to Optimize Product Photos for e-Commerce in 2026", 
        excerpt: "Learn how the pixel-perfect background removal can boost your shop's conversion rate by up to 34%...", 
        date: "Oct 12, 2026",
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"
    },
    { 
        title: "Why AI Background Removal is the Secret to Professional Portraits", 
        excerpt: "Our deep-dive into how neural networks isolate complex hair structures and furs with precision...", 
        date: "Oct 10, 2026",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop"
    },
    { 
        title: "Top 10 Free AI Design Tools for Modern Content Creators", 
        excerpt: "A curated list of tools like PixelCut that help you produce high-end content on a zero budget...", 
        date: "Oct 05, 2026",
        img: "https://images.unsplash.com/photo-1550745165-9bc0b252723f?q=80&w=800&auto=format&fit=crop"
    },
];

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-white py-32 px-6">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                
                {/* Header */}
                <div className="text-center mb-24">
                    <div className="px-5 py-2 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-[2px] border border-blue-100 mb-8 inline-block">PixelCut Stories</div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 tracking-tighter">Insights & <span className="text-blue-600">Guides</span></h1>
                    <p className="max-w-2xl mx-auto text-slate-500 font-medium text-lg md:text-xl">
                        Become a visual editing expert with our latest research and tutorials on AI photography.
                    </p>
                </div>

                {/* Featured Post */}
                <div className="w-full mb-16 group cursor-pointer">
                    <div className="bg-slate-50 rounded-[3rem] p-6 lg:p-10 border border-slate-100 flex flex-col lg:flex-row gap-12 hover:shadow-2xl transition-all duration-700">
                        <div className="lg:w-1/2 aspect-[16/9] bg-white rounded-[2rem] overflow-hidden shadow-2xl relative">
                           <img src="https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1200&auto=format&fit=crop" alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        <div className="lg:w-1/2 flex flex-col justify-center py-4">
                            <span className="text-blue-500 font-black text-xs uppercase tracking-[3px] mb-6">Editor&apos;s Pick</span>
                            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 leading-[1.1] group-hover:text-blue-600 transition-colors">The Future of <br/>Synthetic Imagery</h2>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10 max-w-md">How AI is changing the way we perceive reality, and what it means for photographers in 2026.</p>
                            <div className="flex items-center gap-4 text-slate-900 font-black text-sm uppercase tracking-widest group-hover:gap-6 transition-all">
                                Read Article <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* AdSense Placeholder */}
                <div className="w-full h-[250px] bg-slate-50 border border-slate-100 rounded-3xl mb-20 flex flex-col items-center justify-center text-slate-300">
                   <span className="text-[10px] font-black uppercase tracking-[4px]">Google AdSense Placeholder</span>
                   <span className="text-[9px] font-medium mt-1">Responsive Horizontal Banner</span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
                    {POSTS.map((post, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="aspect-[4/3] bg-slate-100 rounded-[2.5rem] overflow-hidden mb-8 border border-slate-200 shadow-sm group-hover:shadow-xl transition-all duration-500">
                                <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:rotate-1 transition-transform duration-700" />
                            </div>
                            <span className="text-slate-400 font-black text-[10px] uppercase tracking-[3px] mb-4 block">{post.date}</span>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[2px] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                View Full Post <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-32 pt-20 border-t border-slate-100 w-full flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 border border-blue-100"><Sparkles className="w-8 h-8"/></div>
                    <h3 className="text-2xl font-black mb-4 tracking-tighter">Stay Inspired.</h3>
                    <p className="text-slate-500 font-medium mb-12">New articles published every Tuesday and Friday.</p>
                    <Link href="/" className="btn-primary px-12 shadow-xl shadow-blue-500/20">
                        Back to Editor Tool
                    </Link>
                </div>
            </div>
        </main>
    );
}
