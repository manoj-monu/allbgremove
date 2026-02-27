import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | ALLBgremove Support & Inquiries",
    description: "Get in touch with the ALLBgremove team. Whether you need support, have business inquiries, or feature suggestions for our AI background remover.",
};

export default function ContactUs() {
    return (
        <main className="min-h-screen bg-white text-gray-800 flex flex-col items-center py-16 px-6 font-sans">
            <div className="w-full max-w-3xl text-left bg-white rounded-3xl shadow-lg border border-gray-100 p-10 md:p-16">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-900 border-b border-gray-100 pb-4">Contact Us</h1>

                <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
                    <p>
                        We love hearing from our users! Whether you have a question about how to use the ALLBgremove AI tools, a suggestion for a feature, or want to discuss a partnership, our team is here to listen.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Reach Us</h2>

                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-8 p-4">
                        <h3 className="font-bold text-gray-800 text-xl mb-2">Direct Email Support</h3>
                        <p>
                            For general inquiries, technical assistance, or business proposals, please email us directly at:
                            <br />
                            <a href="mailto:support@allbgremove.com" className="text-blue-600 font-bold hover:underline">support@allbgremove.com</a>
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Feedback & Bug Reports</h2>
                    <p>
                        If you encounter an issue where the background was not removed correctly or our editor bugs out, please send us the original image (if comfortable sharing) along with your browser name and the problem description. This helps us train our AI and improve the open-source community around background removal.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Business & API Partnerships</h2>
                    <p>
                        Are you looking to integrate our powerful background removal AI directly into your massive e-commerce platform, plugin, or app? We offer robust API solutions. Reach out via email to discuss limits and seamless integration options.
                    </p>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <p className="text-sm">
                            Note: As an automated, 100% free service, we receive a high volume of requests. While we try to respond to every valid inquiry within 24-48 hours, some responses might be delayed.
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center text-blue-600 font-semibold text-base hover:underline">
                    <Link href="/">← Go back Home</Link>
                </div>
            </div>
        </main>
    );
}
