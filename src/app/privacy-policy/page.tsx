export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4">
            <div className="max-w-4xl mx-auto prose prose-invert">
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                <p className="mb-4">Effective Date: Today</p>
                <p className="mb-4">Your privacy is important to us. This Privacy Policy explains how we handle your data when you use our background removal service.</p>

                {/* Placeholder Ad */}
                <div className="w-full bg-neutral-800 text-neutral-500 h-24 flex items-center justify-center rounded-xl mb-8">
                    AdSense Banner Placeholder
                </div>

                <h2 className="text-xl font-semibold mb-4 mt-8">Information Collection</h2>
                <p className="mb-4">We do NOT store the images you upload. They are processed in-memory and discarded upon completion. No personal data is saved to our servers.</p>

                <h2 className="text-xl font-semibold mb-4 mt-8">Third-Party Services</h2>
                <p className="mb-4">We may use Google AdSense to serve ads. Third party vendors, including Google, use cookies to serve ads based on a user's prior visits.</p>
            </div>
        </main>
    );
}
