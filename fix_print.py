def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Update the buttons
    old_buttons = """          <div class="nav-footer" style="flex-direction:column; gap:10px;">
            <button class="btn btn-primary" style="width:100%; font-size:18px; padding:15px;" onclick="printSheet()">🖨️ Print Now</button>
            <button class="btn btn-outline" style="width:100%;" onclick="goToStep(4)">Back to Adjust</button>
          </div>"""
          
    new_buttons = """          <div class="nav-footer" style="flex-direction:column; gap:10px;">
            <button class="btn btn-primary" style="width:100%; font-size:18px; padding:15px;" onclick="downloadSheet()">⬇ Download Print Sheet</button>
            <button class="btn btn-outline" style="width:100%;" onclick="printSheet()">🖨️ Direct Print</button>
            <button class="btn btn-outline" style="width:100%;" onclick="goToStep(4)">Back to Adjust</button>
          </div>"""
          
    html = html.replace(old_buttons, new_buttons)
    
    # Add downloadSheet function
    new_func = """  function downloadSheet() {
      // Re-render WITHOUT ruler
      updatePrintLayout(false);
      const c = document.getElementById('printCanvas');
      const dataUrl = c.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'passport_sheet_ready.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Restore ruler
      updatePrintLayout(true);
  }
  
  function printSheet() {"""
  
    html = html.replace('  function printSheet() {', new_func)

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
