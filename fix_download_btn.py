def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    old_html = """          <div class="form-group">
            <label>Saturation <span id="vS" class="slider-val">100%</span></label>
            <input type="range" id="slS" min="0" max="200" value="100" oninput="applyAdjustments()">
          </div>
  
          <div class="nav-footer">"""
    
    new_html = """          <div class="form-group">
            <label>Saturation <span id="vS" class="slider-val">100%</span></label>
            <input type="range" id="slS" min="0" max="200" value="100" oninput="applyAdjustments()">
          </div>
          
          <button class="btn btn-outline" style="width:100%; margin-bottom:20px; border-color:var(--primary); color:var(--primary);" onclick="downloadImage('adjCanvas', 'passport_photo_final.png')">⬇ Download Single Photo</button>
  
          <div class="nav-footer">"""

    html = html.replace(old_html, new_html)

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
