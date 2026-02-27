import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms and Conditions | ALLBgremove Rules of Usage",
    description: "Read the Terms and Conditions for using ALLBgremove's free AI background removal tool and photo editing services.",
};

export default function TermsAndConditions() {
    return (
        <main className="min-h-screen bg-white text-gray-800 flex flex-col items-center py-16 px-6 font-sans">
            <div className="w-full max-w-4xl text-left bg-white rounded-3xl shadow-lg border border-gray-100 p-10 md:p-16">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-900 border-b border-gray-100 pb-4">Terms and Conditions</h1>

                <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
                    <p className="text-sm font-bold text-gray-500 mb-6">Last Updated: October 2023</p>
                    <p>
                        Welcome to ALLBgremove! These terms and conditions outline the rules and regulations for the use of ALLBgremove's Website, located at https://allbgremove.com.
                    </p>
                    <p>
                        By accessing this website we assume you accept these terms and conditions. Do not continue to use ALLBgremove if you do not agree to take all of the terms and conditions stated on this page.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. License & Usage</h2>
                    <p>
                        Unless otherwise stated, ALLBgremove and/or its licensors own the intellectual property rights for all material on ALLBgremove (excluding the images you upload yourself). All intellectual property rights are reserved. You may access this from ALLBgremove for your own personal use subjected to restrictions set in these terms and conditions.
                    </p>
                    <p>
                        You must not:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>Republish material (like code or UI elements) from ALLBgremove</li>
                        <li>Sell, rent or sub-license material from ALLBgremove</li>
                        <li>Reproduce, duplicate or copy material from ALLBgremove</li>
                        <li>Redistribute content from ALLBgremove</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Your Images & Uploads</h2>
                    <p>
                        ALLBgremove provides a tool to remove backgrounds from your own images. By uploading an image to ALLBgremove, you warrant and represent that you own the rights to the image or have been granted express permission to modify it. We do not claim any ownership rights to the images you process through our AI.
                    </p>
                    <p>
                        We process your images dynamically and DO NOT store them on our servers permanently. Once processed and downloaded, the file is actively discarded from our working memory.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Prohibited Uses</h2>
                    <p>
                        You agree not to use the automated background removal tool for any unlawful purpose or in any way that violates any applicable local, national, or international law. You specifically agree not to upload explicit, illegal, or copyrighted material you do not own for processing. ALLBgremove bears no responsibility for the content you choose to upload or download.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Cookies and Advertisements</h2>
                    <p>
                        We employ the use of cookies. By accessing ALLBgremove, you agreed to use cookies in agreement with the ALLBgremove's Privacy Policy. Most interactive websites use cookies to let us retrieve the user's details for each visit. We also utilize third-party ad networks such as Google AdSense which utilize tracking cookies to display relevant advertisements to you.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Modifications and Interruptions</h2>
                    <p>
                        We reserve the right to change, modify, or remove the contents of ALLBgremove at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the ALLBgremove service without notice at any time. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the service.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Disclaimer of Warranties</h2>
                    <p>
                        This website and the materials on it are provided "as is". ALLBgremove makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>

                    <div className="mt-12 text-center text-blue-600 font-semibold text-base hover:underline">
                        <Link href="/">← Go back Home</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
