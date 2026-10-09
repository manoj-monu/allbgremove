def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Hide grid layout dropdown in UI
    old_ui = """          <div class="form-group">
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
    
    new_ui = """          <div class="form-group" style="display:none;">
            <label>Auto-Fit Grid (Scale to fit)</label>
            <select id="gridLayout" onchange="updatePrintLayout()">
              <option value="actual" selected>Actual Size (From Crop Step)</option>
            </select>
          </div>"""
    html = html.replace(old_ui, new_ui)

    # Refactor grid logic
    import re
    
    # We want to replace the whole block from // Calculate Grid down to the loops
    # Let's find the boundaries
    start_str = "// Calculate Grid"
    end_str = "let printed = 0;"
    
    start_idx = html.find(start_str)
    end_idx = html.find(end_str)
    
    if start_idx != -1 and end_idx != -1:
        new_grid_logic = """// Calculate Grid
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

      // Perfectly center the grid
      const totalGridW = (cols * imgW) + ((cols - 1) * photoMargin);
      const totalGridH = (rows * imgH) + ((rows - 1) * photoMargin);
      const startX = (pW - totalGridW) / 2;
      const startY = (pH - totalGridH) / 2;
      
      """
        
        html = html[:start_idx] + new_grid_logic + html[end_idx:]

        # Also need to fix the drawing loop inside the new logic
        # Wait, the drawing loop uses actualHGap and actualVGap currently.
        # Let's replace actualHGap and actualVGap with photoMargin inside the loop
        
        # In the rest of the html, replace actualHGap -> photoMargin
        loop_start = html.find("for(let r=0; r<rows; r++) {", start_idx)
        loop_end = html.find("// Draw Ruler (Scale Pati)", loop_start)
        
        loop_code = html[loop_start:loop_end]
        loop_code = loop_code.replace("actualHGap", "photoMargin")
        loop_code = loop_code.replace("actualVGap", "photoMargin")
        
        html = html[:loop_start] + loop_code + html[loop_end:]

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
