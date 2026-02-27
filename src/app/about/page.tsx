import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | ALLBgremove - The Best Free AI Background Remover",
    description: "Learn more about ALLBgremove, a completely free, fast, and automated AI image background removal and editing tool built for professionals and creators.",
};

export default function AboutUs() {
    return (
        <main className="min-h-screen bg-white text-gray-800 flex flex-col items-center py-16 px-6 font-sans">
            <div className="w-full max-w-4xl text-left bg-white rounded-3xl shadow-lg border border-gray-100 p-10 md:p-16">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-900 border-b border-gray-100 pb-4">About Us</h1>

                <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
                    <p>
                        Welcome to <strong>ALLBgremove.com</strong>, your ultimate destination for instant, precise, and 100% free AI background removal.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
                    <p>
                        We believe that high-quality design shouldn&apos;t be expensive or time-consuming. In a world driven by visuals, we saw the need for an accessible tool that automates the tedious task of cutting out backgrounds. Be it for e-commerce product photos, social media graphics, passport photos, or personal projects, our mission is to empower creators, businesses, and individuals worldwide to elevate their imagery with a single click.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How It Works</h2>
                    <p>
                        ALLBgremove leverages state-of-the-art Artificial Intelligence and Machine Learning models to detect the foreground of any image automatically. Without you having to draw manual paths or select pixels, our AI intelligently isolates the subject and turns the background transparent in seconds. Furthermore, our robust built-in editor allows you to apply professional layouts, correct margins, and change backgrounds seamlessly all within the browser.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Privacy & Security First</h2>
                    <p>
                        We take your privacy incredibly seriously. Unlike many cloud-based services, <strong>we do not store or sell your images</strong>. In fact, our specialized architecture processes your images securely and removes them. What belongs to you, stays with you.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Choose Us?</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>100% Free:</strong> No hidden charges, no subscription tiers.</li>
                        <li><strong>Instant AI Processing:</strong> Get perfect cutouts in seconds.</li>
                        <li><strong>High Quality & Accuracy:</strong> Exceptional edge detection even for complicated subjects like hair and fur.</li>
                        <li><strong>All-in-One Editor:</strong> Custom backdrops, color overlays, and robust passport photo creation features.</li>
                    </ul>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <p>
                            Thank you for trusting ALLBgremove. We are constantly improving our AI algorithms and expanding our toolset to give you the absolute best editing experience possible.
                        </p>
                        <p className="mt-4 font-bold text-gray-800">
                            — The ALLBgremove Team
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center text-blue-600 font-semibold text-base hover:underline">
                    <Link href="/">← Return to Homepage</Link>
                </div>
            </div>
        </main>
    );
}
