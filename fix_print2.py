def fix():
    import re
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Replace the buttons using regex to bypass emoji issues
    html = re.sub(
        r'<button class="btn btn-primary" style="width:100%; font-size:18px; padding:15px;" onclick="printSheet\(\)">.*?Print Now</button>',
        r'<button class="btn btn-primary" style="width:100%; font-size:18px; padding:15px;" onclick="downloadSheet()">⬇ Download Print Sheet</button>\n            <button class="btn btn-outline" style="width:100%;" onclick="printSheet()">🖨️ Direct Print</button>',
        html
    )
    
    # Add downloadSheet function
    new_func = """  function downloadSheet() {
      // Re-render WITHOUT ruler
      updatePrintLayout(false);
      const c = document.getElementById('printCanvas');
      const dataUrl = c.toDataURL('image/jpeg', 1.0);
      const blob = dataURLtoBlob(dataUrl);
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'passport_sheet_ready.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Restore ruler
      updatePrintLayout(true);
  }
  
  function printSheet() {"""
  
    if "function downloadSheet" not in html:
        html = html.replace('  function printSheet() {', new_func)

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
