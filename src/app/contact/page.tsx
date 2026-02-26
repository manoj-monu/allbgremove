export default function Contact() {
    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
                <p className="text-center text-neutral-400 mb-12">
                    Have questions or business inquiries? Drop us a message below.
                </p>

                <form className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors" placeholder="Your name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input type="email" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors" placeholder="your@email.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea rows={5} className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors" placeholder="How can we help?" />
                    </div>
                    <button type="button" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">
                        Send Message
                    </button>
                </form>

                <div className="w-full mt-12 bg-neutral-800 text-neutral-500 h-24 flex items-center justify-center rounded-xl">
                    AdSense Banner Placeholder
                </div>
            </div>
        </main>
    );
}
