import re

def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Add state variable
    html = html.replace(
        "let finalImage = new Image(); // Stores final adjusted image",
        "let finalImage = new Image(); // Stores final adjusted image\n    let bgRemovedFullImage = new Image();"
    )

    # 2. Update step-3 HTML layout
    old_html = """        <div class="canvas-container">
          <div style="position:relative; display:flex; max-width:100%; max-height:65vh;">
            <canvas id="bgCanvas" style="max-height: 65vh; object-fit: contain;"></canvas>
            <div id="scannerOverlay" class="scanner-overlay"><div class="scanner-line"></div></div>
          </div>
        </div>"""
    
    new_html = """        <div class="canvas-container" style="background:#e5e7eb; padding:20px; border-radius:var(--radius);">
          <div id="dualView" style="display:flex; flex-direction:row; gap:30px; align-items:flex-start; width:100%; flex-wrap:wrap; justify-content:center;">
            
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; min-width:250px;">
              <h3 style="color:#4b5563; margin-bottom:15px; font-size:18px;">Passport Photo</h3>
              <div style="position:relative; display:flex; max-width:100%; max-height:55vh;">
                <canvas id="bgCanvas" style="max-height: 55vh; max-width:100%; object-fit: contain; box-shadow:0 5px 15px rgba(0,0,0,0.1); border-radius:8px;"></canvas>
                <div id="scannerOverlay" class="scanner-overlay"><div class="scanner-line"></div></div>
              </div>
              <button id="btnDownloadPassport" class="btn btn-outline" style="margin-top:20px; display:none; background:white;" onclick="downloadImage('bgCanvas', 'passport_photo.png')">⬇ Download Passport</button>
            </div>
            
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; min-width:250px;">
              <h3 style="color:#4b5563; margin-bottom:15px; font-size:18px;">Full Photo</h3>
              <div style="position:relative; display:flex; max-width:100%; max-height:55vh;">
                <canvas id="bgCanvasFull" style="max-height: 55vh; max-width:100%; object-fit: contain; box-shadow:0 5px 15px rgba(0,0,0,0.1); border-radius:8px;"></canvas>
                <div id="scannerOverlay2" class="scanner-overlay"><div class="scanner-line"></div></div>
              </div>
              <button id="btnDownloadFull" class="btn btn-outline" style="margin-top:20px; display:none; background:white;" onclick="downloadImage('bgCanvasFull', 'full_photo.png')">⬇ Download Full Photo</button>
            </div>
            
          </div>
        </div>"""
    
    html = html.replace(old_html, new_html)

    # 3. Add downloadImage function
    download_func = """
  function downloadImage(canvasId, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = document.getElementById(canvasId).toDataURL('image/png');
    link.click();
  }
"""
    html = html.replace("// 4. Adjustments", download_func + "\n  // 4. Adjustments")

    # 4. Update applyBgColor
    old_applyBgColor = """  function applyBgColor() {
    const c = document.getElementById('bgCanvas');
    const ctx = c.getContext('2d');
    c.width = bgRemovedImage.width;
    c.height = bgRemovedImage.height;
    ctx.fillStyle = document.getElementById('bgColor').value;
    ctx.fillRect(0,0,c.width,c.height);
    ctx.drawImage(bgRemovedImage, 0, 0);
  }"""

    new_applyBgColor = """  function applyBgColor() {
    // Passport canvas
    const c1 = document.getElementById('bgCanvas');
    if (bgRemovedImage.width > 0) {
      const ctx1 = c1.getContext('2d');
      c1.width = bgRemovedImage.width; c1.height = bgRemovedImage.height;
      ctx1.fillStyle = document.getElementById('bgColor').value;
      ctx1.fillRect(0,0,c1.width,c1.height);
      ctx1.drawImage(bgRemovedImage, 0, 0);
    }
    
    // Full photo canvas
    const c2 = document.getElementById('bgCanvasFull');
    if (bgRemovedFullImage && bgRemovedFullImage.width > 0) {
      const ctx2 = c2.getContext('2d');
      c2.width = bgRemovedFullImage.width; c2.height = bgRemovedFullImage.height;
      ctx2.fillStyle = document.getElementById('bgColor').value;
      ctx2.fillRect(0,0,c2.width,c2.height);
      ctx2.drawImage(bgRemovedFullImage, 0, 0);
    }
  }"""
    html = html.replace(old_applyBgColor, new_applyBgColor)

    # 5. Update removeBgApi
    old_removeBgApi = """  async function removeBgApi() {
    document.getElementById('scannerOverlay').style.display = 'block';
    document.getElementById('progressContainer').style.display = 'block';
    document.getElementById('progressText').style.display = 'block';
    
    let pb = document.getElementById('progressBar');
    let pt = document.getElementById('progressText');
    let progress = 0;
    
    let interval = setInterval(() => {
       progress += Math.random() * 4;
       if(progress > 95) progress = 95;
       pb.style.width = progress + '%';
       pt.textContent = Math.round(progress) + '% AI Processing...';
    }, 200);

    try {
      const tempC = document.createElement('canvas');
      tempC.width = croppedImage.width; tempC.height = croppedImage.height;
      tempC.getContext('2d').drawImage(croppedImage, 0, 0);
      const blob = await new Promise(res => tempC.toBlob(res, 'image/png'));
      const fd = new FormData(); 
      fd.append('file', blob, 'photo.png');

      const isEnhance = document.getElementById('doEnhance').checked;

      let res = await fetch('https://ojnsbnq4x2d99y-8888.proxy.runpod.net/api/process-all?enhance=' + isEnhance, {
        method: 'POST',
        body: fd,
        mode: 'cors',
        headers: { 'Accept': 'image/png, */*' }
      });
      
      if(!res.ok) throw new Error("API Error");
      
      const url = URL.createObjectURL(await res.blob());
      const img = new Image();
      img.src = url;
      img.onload = () => {
        bgRemovedImage = img;
        clearInterval(interval);
        pb.style.width = '100%';
        pt.textContent = 'Complete!';
        document.getElementById('scannerOverlay').style.display = 'none';
        
        setTimeout(() => {
          document.getElementById('progressContainer').style.display = 'none';
          document.getElementById('progressText').style.display = 'none';
        }, 1000);
        
        initBgCanvas();
      };
    } catch (err) {
      clearInterval(interval);
      pt.textContent = 'Error occurred!';
      document.getElementById('scannerOverlay').style.display = 'none';
      alert("Error removing background. Please try again.");
    }
  }"""

    new_removeBgApi = """  async function removeBgApi() {
    document.getElementById('scannerOverlay').style.display = 'block';
    document.getElementById('scannerOverlay2').style.display = 'block';
    document.getElementById('progressContainer').style.display = 'block';
    document.getElementById('progressText').style.display = 'block';
    
    // Hide download buttons during processing
    document.getElementById('btnDownloadPassport').style.display = 'none';
    document.getElementById('btnDownloadFull').style.display = 'none';
    
    let pb = document.getElementById('progressBar');
    let pt = document.getElementById('progressText');
    let progress = 0;
    
    let interval = setInterval(() => {
       progress += Math.random() * 4;
       if(progress > 95) progress = 95;
       pb.style.width = progress + '%';
       pt.textContent = Math.round(progress) + '% AI Processing (HD)...';
    }, 200);

    try {
      const isEnhance = document.getElementById('doEnhance').checked;
      
      // 1. Process Passport Photo
      const tempC1 = document.createElement('canvas');
      tempC1.width = croppedImage.width; tempC1.height = croppedImage.height;
      tempC1.getContext('2d').drawImage(croppedImage, 0, 0);
      const blob1 = await new Promise(res => tempC1.toBlob(res, 'image/png'));
      const fd1 = new FormData(); fd1.append('file', blob1, 'photo.png');
      
      // 2. Process Full Photo (Scale down safely if too large to save network time)
      const tempC2 = document.createElement('canvas');
      let scale = 1;
      if (originalImage.width > 2000) scale = 2000 / originalImage.width;
      tempC2.width = originalImage.width * scale;
      tempC2.height = originalImage.height * scale;
      tempC2.getContext('2d').drawImage(originalImage, 0, 0, tempC2.width, tempC2.height);
      const blob2 = await new Promise(res => tempC2.toBlob(res, 'image/png', 0.9));
      const fd2 = new FormData(); fd2.append('file', blob2, 'full.png');

      // Run API requests concurrently
      const [res1, res2] = await Promise.all([
        fetch('https://ojnsbnq4x2d99y-8888.proxy.runpod.net/api/process-all?enhance=' + isEnhance, { method: 'POST', body: fd1, mode: 'cors', headers: { 'Accept': 'image/png, */*' } }),
        fetch('https://ojnsbnq4x2d99y-8888.proxy.runpod.net/api/process-all?enhance=' + isEnhance, { method: 'POST', body: fd2, mode: 'cors', headers: { 'Accept': 'image/png, */*' } })
      ]);
      
      if(!res1.ok || !res2.ok) throw new Error("API Error");
      
      const url1 = URL.createObjectURL(await res1.blob());
      const url2 = URL.createObjectURL(await res2.blob());
      
      const img1 = new Image(); img1.src = url1;
      const img2 = new Image(); img2.src = url2;
      
      await Promise.all([
         new Promise(r => img1.onload = r),
         new Promise(r => img2.onload = r)
      ]);
      
      bgRemovedImage = img1;
      bgRemovedFullImage = img2;
      
      clearInterval(interval);
      pb.style.width = '100%';
      pt.textContent = 'Complete!';
      
      document.getElementById('scannerOverlay').style.display = 'none';
      document.getElementById('scannerOverlay2').style.display = 'none';
      
      // Show download buttons
      document.getElementById('btnDownloadPassport').style.display = 'inline-block';
      document.getElementById('btnDownloadFull').style.display = 'inline-block';
      
      setTimeout(() => {
        document.getElementById('progressContainer').style.display = 'none';
        document.getElementById('progressText').style.display = 'none';
      }, 1000);
      
      initBgCanvas();
      
    } catch (err) {
      clearInterval(interval);
      pt.textContent = 'Error occurred!';
      document.getElementById('scannerOverlay').style.display = 'none';
      document.getElementById('scannerOverlay2').style.display = 'none';
      alert("Error removing background. Please try again.");
    }
  }"""
    html = html.replace(old_removeBgApi, new_removeBgApi)

    # 6. Make sure to reset bgRemovedFullImage when cropImage is called
    old_croppedImage_onload = """      croppedImage.onload = () => {
        bgRemovedImage.src = croppedImage.src; // Init bg removed as same
        bgRemovedImage.onload = () => {
          initBgCanvas();
          goToStep(3);
        }
      }"""
    
    new_croppedImage_onload = """      croppedImage.onload = () => {
        bgRemovedImage.src = croppedImage.src; // Init bg removed as same
        bgRemovedFullImage.src = originalImage.src; // Init full bg as original
        
        let loaded = 0;
        const checkDone = () => {
           loaded++;
           if (loaded === 2) {
             initBgCanvas();
             goToStep(3);
             // Hide download buttons on new crop
             document.getElementById('btnDownloadPassport').style.display = 'none';
             document.getElementById('btnDownloadFull').style.display = 'none';
           }
        };
        bgRemovedImage.onload = checkDone;
        bgRemovedFullImage.onload = checkDone;
      }"""
    html = html.replace(old_croppedImage_onload, new_croppedImage_onload)

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
