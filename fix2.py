def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    html = html.replace(
        '<img id="cropImg" style="cursor:move; transform-origin: top left;" />',
        '<img id="cropImg" style="cursor:move; transform-origin: top left; max-width: none !important;" />'
    )

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
