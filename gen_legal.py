import os

def create_page(filename, title, content):
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} - PassportSnap Pro</title>
  <meta name="description" content="{title} for PassportSnap Pro. Read about our policies and terms.">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {{
      theme: {{
        extend: {{
          fontFamily: {{ sans: ['Inter', 'sans-serif'] }},
          colors: {{ primary: '#6366f1' }}
        }}
      }}
    }}
  </script>
</head>
<body class="bg-gray-50 text-gray-800 flex flex-col min-h-screen font-sans">
  <!-- Navbar -->
  <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <div class="flex items-center gap-2 cursor-pointer" onclick="window.location.href='index.html'">
          <i class="fa-solid fa-camera-retro text-primary text-3xl"></i>
          <span class="font-bold text-2xl tracking-tight text-gray-900">PassportSnap <span class="text-primary">Pro</span></span>
        </div>
        <nav class="hidden md:flex gap-8 font-medium text-gray-600">
          <a href="index.html" class="hover:text-primary transition">Home</a>
          <a href="pricing.html" class="hover:text-primary transition">Pricing</a>
          <a href="about.html" class="hover:text-primary transition">About</a>
          <a href="contact.html" class="hover:text-primary transition">Contact</a>
        </nav>
        <div class="flex gap-4">
          <button class="px-5 py-2 text-primary font-medium hover:bg-indigo-50 rounded-full transition hidden sm:block">Login</button>
          <button class="px-5 py-2 bg-primary text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-600 transition" onclick="window.location.href='index.html'">Start App</button>
        </div>
      </div>
    </div>
  </header>

  <!-- Content -->
  <main class="flex-grow max-w-4xl mx-auto w-full px-4 py-16 sm:px-6 lg:px-8">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 border-b pb-4">{title}</h1>
      <div class="prose prose-indigo max-w-none text-gray-600 space-y-6">
        {content}
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white pt-20 pb-10 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-12">
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-2 mb-6">
            <i class="fa-solid fa-camera-retro text-primary text-2xl"></i>
            <span class="font-bold text-xl tracking-tight">PassportSnap <span class="text-primary">Pro</span></span>
          </div>
          <p class="text-gray-400 text-sm mb-6">Create passport, visa, ID and more photos with our easy-to-use online tool.</p>
        </div>
        <div>
          <h4 class="font-bold mb-6 text-lg">Quick Links</h4>
          <ul class="space-y-3 text-sm text-gray-400">
            <li><a href="index.html" class="hover:text-white transition">Home</a></li>
            <li><a href="pricing.html" class="hover:text-white transition">Pricing</a></li>
            <li><a href="about.html" class="hover:text-white transition">About</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-6 text-lg">Tools</h4>
          <ul class="space-y-3 text-sm text-gray-400">
            <li><a href="index.html" class="hover:text-white transition">Passport Photo Maker</a></li>
            <li><a href="index.html" class="hover:text-white transition">Background Remover</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-6 text-lg">Support</h4>
          <ul class="space-y-3 text-sm text-gray-400">
            <li><a href="terms.html" class="hover:text-white transition">Terms & Conditions</a></li>
            <li><a href="privacy.html" class="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="refund.html" class="hover:text-white transition">Refund Policy</a></li>
            <li><a href="contact.html" class="hover:text-white transition">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div class="text-center text-sm text-gray-500">
        &copy; 2026 PassportSnap Pro. All rights reserved.
      </div>
    </div>
  </footer>
</body>
</html>"""
    
    filepath = os.path.join('public', filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)


def main():
    os.makedirs('public', exist_ok=True)
    
    # 1. Privacy Policy
    privacy = """
    <p>Last updated: October 2026</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">1. Introduction</h3>
    <p>Welcome to PassportSnap Pro ("we", "our", "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">2. Data Collection and Usage</h3>
    <p>When you use our background removal and photo editing tools, your photos are processed securely. We do not permanently store, share, or use your uploaded photos for any purpose other than providing the requested service. All uploaded images are automatically deleted from our servers shortly after processing.</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">3. Cookies and Tracking Technologies</h3>
    <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">4. Third-Party Services</h3>
    <p>We use third-party services (like Google AdSense and payment gateways) which may collect information used to identify you. These third-party service providers have their own privacy policies addressing how they use such information.</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">5. Contact Us</h3>
    <p>If you have any questions about this Privacy Policy, please contact us through our Contact page.</p>
    """
    create_page('privacy.html', 'Privacy Policy', privacy)

    # 2. Terms of Service
    terms = """
    <p>Last updated: October 2026</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">1. Acceptance of Terms</h3>
    <p>By accessing or using PassportSnap Pro, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">2. Use License</h3>
    <p>Permission is granted to temporarily use the tools on PassportSnap Pro's website for personal or commercial photo editing. This is the grant of a license, not a transfer of title, and under this license you may not use the materials for any illegal purpose.</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">3. Disclaimer</h3>
    <p>The materials on PassportSnap Pro's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">4. Limitations</h3>
    <p>In no event shall PassportSnap Pro or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">5. Governing Law</h3>
    <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
    """
    create_page('terms.html', 'Terms of Service', terms)

    # 3. About Us
    about = """
    <p class="text-lg">Welcome to PassportSnap Pro, your ultimate destination for professional photo editing and formatting.</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">Our Mission</h3>
    <p>We believe that creating the perfect passport, visa, or ID photo shouldn't require expensive software or professional photography skills. Our mission is to provide an accessible, high-quality, AI-powered tool that empowers individuals and photo studios to generate perfect, compliant photos in seconds.</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">What We Do</h3>
    <p>PassportSnap Pro leverages cutting-edge Artificial Intelligence (AI) to automatically remove backgrounds, enhance facial features, and format photos to strict government and international standards. Whether you're an individual applying for a visa or a photo studio serving hundreds of customers, our platform is built to save you time and money.</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">Why Choose Us?</h3>
    <ul class="list-disc pl-6 space-y-2 mt-4">
      <li><strong>AI Precision:</strong> Flawless background removal and facial enhancement.</li>
      <li><strong>Print-Ready Layouts:</strong> Instantly generate A4, 4x6, or custom print sheets.</li>
      <li><strong>Privacy First:</strong> Your photos are processed securely and never stored.</li>
      <li><strong>B2B Ready:</strong> Specialized tools for photo studios and CSC centers.</li>
    </ul>
    """
    create_page('about.html', 'About Us', about)

    # 4. Contact Us
    contact = """
    <p class="text-lg mb-6">We'd love to hear from you! Whether you have a question about features, pricing, or need technical support, our team is ready to answer all your questions.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <div>
        <h3 class="text-xl font-bold text-gray-800">Get in Touch</h3>
        <p class="mt-4"><strong>Email:</strong> support@passportsnappro.com</p>
        <p class="mt-2"><strong>Phone:</strong> +91 98765 43210</p>
        <p class="mt-2"><strong>Address:</strong><br>123 Startup Hub, Tech Park<br>New Delhi, India 110001</p>
      </div>
      
      <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="Your Name">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="your@email.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="How can we help you?"></textarea>
          </div>
          <button type="button" class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-600 transition">Send Message</button>
        </form>
      </div>
    </div>
    """
    create_page('contact.html', 'Contact Us', contact)
    
    # 5. Refund Policy
    refund = """
    <p>Last updated: October 2026</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">1. Pro Wallet Recharges</h3>
    <p>All wallet recharges and purchases made for Pro Tokens on PassportSnap Pro are generally non-refundable. Tokens do not expire and can be used at any time for our premium background removal and enhancement services.</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">2. Technical Failures</h3>
    <p>If a technical error on our platform causes a token to be deducted without generating the expected high-resolution image, the system will automatically refund the token to your account. If the automated system fails, you may contact our support team within 7 days of the incident with your transaction ID for a manual credit adjustment.</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">3. Cash Refunds</h3>
    <p>We do not offer cash refunds back to your bank account, credit card, or UPI ID for unused tokens. We encourage users to start with a smaller recharge amount to evaluate the service before making large wallet top-ups.</p>
    <h3 class="text-xl font-bold text-gray-800 mt-6">4. Contact</h3>
    <p>For any billing disputes or refund requests related to technical errors, please reach out to us via our Contact Us page.</p>
    """
    create_page('refund.html', 'Refund Policy', refund)

if __name__ == '__main__':
    main()
