def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    old_html = """        <div class="form-group">
            <label>Saturation <span id="vS" class="slider-val">100%</span></label>
            <input type="range" id="slS" min="0" max="200" value="100" oninput="applyAdjustments()">
          </div>
  
          <div class="nav-footer">"""
    
    new_html = """        <div class="form-group">
            <label>Saturation <span id="vS" class="slider-val">100%</span></label>
            <input type="range" id="slS" min="0" max="200" value="100" oninput="applyAdjustments()">
          </div>
          
          <button class="btn btn-outline" style="width:100%; margin-bottom:20px; border-color:var(--primary); color:var(--primary);" onclick="downloadImage('adjCanvas', 'adjusted_passport.png')">⬇ Download Final Single Photo</button>
  
          <div class="nav-footer">"""
    
    if old_html in html:
        html = html.replace(old_html, new_html)
    else:
        # Fallback using regex
        import re
        html = re.sub(r'(<input type="range" id="slS" min="0" max="200" value="100" oninput="applyAdjustments\(\)">\s*</div>\s*)<div class="nav-footer">',
                      r'\1<button class="btn btn-outline" style="width:100%; margin-bottom:20px; border-color:var(--primary); color:var(--primary);" onclick="downloadImage(\'adjCanvas\', \'adjusted_passport.png\')">⬇ Download Final Single Photo</button>\n          <div class="nav-footer">', html)

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
