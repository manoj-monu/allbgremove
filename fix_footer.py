def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    old_li = '<li><a href="privacy.html" class="hover:text-white transition">Privacy Policy</a></li>'
    new_li = '<li><a href="privacy.html" class="hover:text-white transition">Privacy Policy</a></li>\n              <li><a href="refund.html" class="hover:text-white transition">Refund Policy</a></li>'

    html = html.replace(old_li, new_li)

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
