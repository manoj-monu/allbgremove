def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Find where the grid logic starts and where the loop starts
    import re
    
    start_match = re.search(r'// Calculate Grid', html)
    loop_match = re.search(r'for\s*\(let r\s*=\s*0;\s*r\s*<\s*rows;\s*r\+\+\)', html)
    
    if start_match and loop_match:
        start_idx = start_match.start()
        end_idx = loop_match.start()
        
        clean_logic = """// Calculate Grid
      const availableW = pW - (2 * pageMargin);
      const availableH = pH - (2 * pageMargin);
  
      let imgW, imgH, cols, rows;
      
      // Always use Actual Physical Size
      imgW = +document.getElementById('cropW').value * MM_TO_PX;
      imgH = +document.getElementById('cropH').value * MM_TO_PX;
      cols = Math.floor((availableW + photoMargin) / (imgW + photoMargin));
      rows = Math.floor((availableH + photoMargin) / (imgH + photoMargin));
      
      if (cols < 1) cols = 1;
      if (rows < 1) rows = 1;

      // Align grid to Top-Left ("ek line se") to allow studios to cut paper and reuse it
      const startX = pageMargin;
      const startY = pageMargin;
      
      let printed = 0;
      
      """
        
        html = html[:start_idx] + clean_logic + html[end_idx:]

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
