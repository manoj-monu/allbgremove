def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    old_css = """  /* Two column layout for Editor Steps */
  .editor-layout { display: grid; grid-template-columns: 380px 1fr; gap: 30px; width: 100%; align-items: start; }"""
    
    new_css = """  /* Two column layout for Editor Steps (Responsive & Swapped) */
  .editor-layout { display: flex; flex-direction: column-reverse; gap: 30px; width: 100%; align-items: stretch; }
  .sidebar { width: 100%; flex-shrink: 0; }
  .canvas-container { flex-grow: 1; min-width: 0; width: 100%; }
  
  @media (min-width: 900px) {
    .editor-layout { flex-direction: row-reverse; align-items: flex-start; }
    .sidebar { width: 380px; }
  }"""

    html = html.replace(old_css, new_css)

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
