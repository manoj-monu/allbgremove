def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Restore grid layout dropdown in UI
    old_ui = """          <div class="form-group" style="display:none;">
            <label>Auto-Fit Grid (Scale to fit)</label>
            <select id="gridLayout" onchange="updatePrintLayout()">
              <option value="actual" selected>Actual Size (From Crop Step)</option>
            </select>
          </div>"""
    
    new_ui = """          <div class="form-group">
            <label>Auto-Fit Grid (Scale to fit)</label>
            <select id="gridLayout" onchange="updatePrintLayout()">
              <option value="actual">Actual Size (From Crop Step)</option>
              <option value="2x2">Fit 4 Photos</option>
              <option value="3x2">Fit 6 Photos</option>
              <option value="4x2" selected>Fit 8 Photos</option>
              <option value="3x3">Fit 9 Photos</option>
              <option value="4x3">Fit 12 Photos</option>
              <option value="5x3">Fit 15 Photos</option>
              <option value="4x4">Fit 16 Photos</option>
            </select>
          </div>"""
    
    if old_ui in html:
        html = html.replace(old_ui, new_ui)
    else:
        print("UI block not found!")

    # Restore grid logic
    import re
    
    start_str = "// Calculate Grid"
    end_str = "let printed = 0;"
    
    start_idx = html.find(start_str)
    end_idx = html.find(end_str)
    
    if start_idx != -1 and end_idx != -1:
        new_grid_logic = """// Calculate Grid
      const availableW = pW - (2 * pageMargin);
      const availableH = pH - (2 * pageMargin);
  
      let imgW, imgH, cols, rows;
      const gridLayout = document.getElementById('gridLayout').value;
      
      if (gridLayout === 'actual') {
        imgW = +document.getElementById('cropW').value * MM_TO_PX;
        imgH = +document.getElementById('cropH').value * MM_TO_PX;
        cols = Math.floor((availableW + photoMargin) / (imgW + photoMargin));
        rows = Math.floor((availableH + photoMargin) / (imgH + photoMargin));
      } else {
        const parts = gridLayout.split('x').map(Number);
        const maxGrid = Math.max(parts[0], parts[1]);
        const minGrid = Math.min(parts[0], parts[1]);
        
        if (availableW >= availableH) {
           cols = maxGrid;
           rows = minGrid;
        } else {
           cols = minGrid;
           rows = maxGrid;
        }
        
        const cellW = (availableW - ((cols - 1) * photoMargin)) / cols;
        const cellH = (availableH - ((rows - 1) * photoMargin)) / rows;
        
        const aspect = finalImage.width / finalImage.height;
        let drawW = cellW;
        let drawH = drawW / aspect;
        if (drawH > cellH) {
            drawH = cellH;
            drawW = drawH * aspect;
        }
        imgW = drawW;
        imgH = drawH;
      }
      
      if (cols < 1) cols = 1;
      if (rows < 1) rows = 1;

      // Align grid to Top-Left ("ek line se") to allow studios to cut paper and reuse it
      const startX = pageMargin;
      const startY = pageMargin;
      
      """
        
        html = html[:start_idx] + new_grid_logic + html[end_idx:]
    else:
        print("Logic block not found!")

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
