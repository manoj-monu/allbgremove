import re

def fix_navbar():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Find where <div id="landing-page-container"> is
    html = html.replace('<div id="landing-page-container">\n  \n  \n    <!-- Navbar -->', '<!-- Navbar -->')
    
    # Insert it before Hero Section
    html = html.replace('<!-- Hero Section -->', '<div id="landing-page-container">\n  <!-- Hero Section -->')

    # Now the navbar is outside the container.
    # We should also hide the footer when the app is open.
    # The footer is inside the landing-page-container because my previous script put it at the very end.
    # Wait, the previous script put </div> right after </footer>:
    # `footer_end_idx = index_html.find('</footer>') + 9`
    # So the footer is already inside `landing-page-container`. This is correct.

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix_navbar()
