def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Replace onchange handler
    html = html.replace('<select id="gridLayout" onchange="updatePrintLayout()">', '<select id="gridLayout" onchange="onGridLayoutChange()">')

    # Add the onGridLayoutChange function
    new_func = """
  function onGridLayoutChange() {
    const val = document.getElementById('gridLayout').value;
    if (val !== 'actual') {
       const parts = val.split('x').map(Number);
       document.getElementById('photoCount').value = parts[0] * parts[1];
    }
    updatePrintLayout();
  }

  function updatePrintLayout(includeRuler = true) {"""
    
    html = html.replace('  function updatePrintLayout(includeRuler = true) {', new_func)

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
