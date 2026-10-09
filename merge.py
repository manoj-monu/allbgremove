import re

def merge():
    with open('public/app.html', 'r', encoding='utf-8') as f:
        app_html = f.read()
    
    with open('public/index.html', 'r', encoding='utf-8') as f:
        index_html = f.read()

    # Extract CSS from app.html
    css_match = re.search(r'<style>(.*?)</style>', app_html, re.DOTALL)
    app_css = css_match.group(1) if css_match else ""

    # Extract App HTML body
    # We need everything from <div class="stepper"> to just before <script>
    body_match = re.search(r'(<div class="stepper">.*?)(?=<script>)', app_html, re.DOTALL)
    app_body = body_match.group(1) if body_match else ""
    
    # We don't need the step-1 (Upload) from the app anymore, but it's fine to keep it and just skip it, 
    # but the user might want it hidden. Actually, we should keep it because it might be needed if they go back.
    # Wait, the prompt says "first page se hi pura kaam hona chahiye". 
    # Let's wrap the app_body in a div
    app_body_wrapped = f'\n<div id="app-container" style="display:none; padding-top: 100px;">\n{app_body}\n</div>\n'

    # Extract JS from app.html
    js_match = re.search(r'<script>(.*?)</script>(?=\s*</body>)', app_html, re.DOTALL)
    app_js = js_match.group(1) if js_match else ""
    
    # Update JS to hide landing page and show app
    app_js = app_js.replace(
        "function handleUpload(e) {",
        "function handleUpload(e) {\n      document.getElementById('landing-page-container').style.display = 'none';\n      document.getElementById('app-container').style.display = 'block';\n      window.scrollTo(0,0);"
    )
    
    # Modify index.html
    # Insert app_css into index.html <head>
    index_html = index_html.replace('</head>', f'<style>\n/* APP CSS */\n{app_css}\n</style>\n</head>')
    
    # Wrap index body content
    # Find start of body, after <body ...>
    body_start_match = re.search(r'<body[^>]*>', index_html)
    if body_start_match:
        body_start_idx = body_start_match.end()
        # Find end of footer
        footer_end_idx = index_html.find('</footer>') + 9
        
        landing_content = index_html[body_start_idx:footer_end_idx]
        wrapped_landing = f'\n<div id="landing-page-container">\n{landing_content}\n</div>\n'
        
        index_html = index_html[:body_start_idx] + wrapped_landing + app_body_wrapped + f'\n<script>\n{app_js}\n</script>\n' + index_html[footer_end_idx:]

    # Connect Hero Upload button
    # Change href="app.html" in the hero section upload box to trigger fileIn
    # The original is: <a href="app.html" class="block border-2 ... cursor-pointer">
    # We change it to <div onclick="document.getElementById('fileIn').click()" class="block border-2 ... cursor-pointer">
    index_html = index_html.replace(
        '<a href="app.html" class="block border-2 border-dashed border-primary bg-indigo-50/50 rounded-2xl p-8 text-center hover:bg-indigo-50 hover:border-indigo-600 transition group cursor-pointer">',
        '<div onclick="document.getElementById(\'fileIn\').click()" class="block border-2 border-dashed border-primary bg-indigo-50/50 rounded-2xl p-8 text-center hover:bg-indigo-50 hover:border-indigo-600 transition group cursor-pointer">'
    )
    index_html = index_html.replace(
        '</button>\n          <p class="text-sm text-gray-500 font-medium">Click to browse or drag and drop<br>JPG, PNG (Max 10MB)</p>\n        </a>',
        '</button>\n          <p class="text-sm text-gray-500 font-medium">Click to browse or drag and drop<br>JPG, PNG (Max 10MB)</p>\n        </div>'
    )
    
    # Connect other Try Free buttons to scroll to upload or open upload
    index_html = index_html.replace('href="app.html"', 'href="#" onclick="document.getElementById(\'fileIn\').click(); return false;"')

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(index_html)

if __name__ == "__main__":
    merge()
