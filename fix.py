import re

def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # The file currently looks like:
    # <body class="overflow-x-hidden">
    # <div id="landing-page-container">
    # 
    # 
    #   <!-- Navbar -->
    #   <nav class="fixed w-full z-50 glass shadow-sm">
    # ...
    #   </nav>
    # 
    # <div id="landing-page-container">
    #   <!-- Hero Section -->

    # We want to remove the first `<div id="landing-page-container">`
    # We can just replace the first occurrence of it.
    
    html = html.replace('<div id="landing-page-container">', '', 1)

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
