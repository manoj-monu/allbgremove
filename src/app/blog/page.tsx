export default function Blog() {
    const posts = [
        { title: "Top 5 Uses for a Transparent Background", excerpt: "Learn how removing backgrounds can boost your e-commerce sales...", date: "Oct 12, 2026" },
        { title: "How AI is changing professional photography", excerpt: "AI tools like U2Net are revolutionizing post-processing...", date: "Oct 10, 2026" },
        { title: "Best Free Tools to Remove Backgrounds", excerpt: "A review of modern tools for automated background removal...", date: "Oct 05, 2026" },
    ];

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-12 border-b border-neutral-800 pb-4">Blog & Articles</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {posts.map((post, idx) => (
                        <article key={idx} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer group">
                            <div className="w-full h-40 bg-neutral-800 rounded-xl mb-4" />
                            <p className="text-xs text-blue-400 font-medium mb-3">{post.date}</p>
                            <h2 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{post.title}</h2>
                            <p className="text-neutral-400 text-sm leading-relaxed">{post.excerpt}</p>
                        </article>
                    ))}
                </div>

                <div className="w-full bg-neutral-800 text-neutral-500 h-[300px] flex items-center justify-center rounded-xl">
                    AdSense Article Inline Ad Placeholder
                </div>
            </div>
        </main>
    );
}
