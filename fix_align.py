def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    old_logic = """      // Perfectly center the grid
      const totalGridW = (cols * imgW) + ((cols - 1) * photoMargin);
      const totalGridH = (rows * imgH) + ((rows - 1) * photoMargin);
      const startX = (pW - totalGridW) / 2;
      const startY = (pH - totalGridH) / 2;"""

    new_logic = """      // Align grid to Top-Left ("ek line se") to allow studios to cut paper and reuse it
      const startX = pageMargin;
      const startY = pageMargin;"""

    html = html.replace(old_logic, new_logic)

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
