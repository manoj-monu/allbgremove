import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | ALLBgremove Data Usage & Security",
    description: "Read the ALLBgremove Privacy Policy. Understand how our free AI tool processes images automatically while keeping your personal data completely secure.",
};

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-white text-gray-800 flex flex-col items-center py-16 px-6 font-sans">
            <div className="w-full max-w-4xl text-left bg-white rounded-3xl shadow-lg border border-gray-100 p-10 md:p-16">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-900 border-b border-gray-100 pb-4">Privacy Policy</h1>

                <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
                    <p className="text-sm font-bold text-gray-500 mb-6">Last Updated: October 2023</p>
                    <p>
                        At ALLBgremove.com, accessible from https://allbgremove.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ALLBgremove and how we use it.
                    </p>
                    <p>
                        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
                    <p>
                        The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
                    </p>
                    <p>
                        When you interact with ALLBgremove by uploading images for background removal, we process this imagery solely for the purpose of generating your transparent output.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Image Processing & Retention</h2>
                    <p>
                        <strong>We Do NOT Store Your Images.</strong> Unlike many cloud-based services, our application processes your uploaded images dynamically in-memory or immediately deletes them off our servers once the background removal transaction is complete. You retain full copyright and ownership of your images. We do not use them to train machine learning models.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Log Files</h2>
                    <p>
                        ALLBgremove follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Cookies and Web Beacons</h2>
                    <p>
                        Like any other website, ALLBgremove uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Google DoubleClick DART Cookie</h2>
                    <p>
                        Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:underline">https://policies.google.com/technologies/ads</a>
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Third Party Privacy Policies</h2>
                    <p>
                        ALLBgremove's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options. You can choose to disable cookies through your individual browser options.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Children's Information</h2>
                    <p>
                        Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. ALLBgremove does not knowingly collect any Personal Identifiable Information from children under the age of 13.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Consent</h2>
                    <p>
                        By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
                    </p>
                </div>

                <div className="mt-12 text-center text-blue-600 font-semibold text-base hover:underline">
                    <Link href="/">← Go back Home</Link>
                </div>
            </div>
        </main>
    );
}
