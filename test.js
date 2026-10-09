
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#4f46e5',
            secondary: '#ec4899',
            light: '#f3f4f6',
            dark: '#111827',
          },
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'sans-serif'],
          }
        }
      }
    }
  


  // State
  let currentStep = 1;
  let originalImage = new Image();
  let croppedImage = new Image();
  let bgRemovedImage = new Image(); // Stores image with transparent bg
  let finalImage = new Image(); // Stores final adjusted image
    let bgRemovedFullImage = new Image();
  
  // Base scales
  const MM_TO_PX = 11.811; // 300 DPI roughly

  // Navigate steps
  function goToStep(step) {
    document.querySelectorAll('.view-panel').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.step').forEach((el, idx) => {
      el.classList.remove('active');
      if(idx < step-1) el.classList.add('completed');
      else el.classList.remove('completed');
    });
    
    document.getElementById('step-'+step).classList.add('active');
    document.getElementById('st-'+step).classList.add('active');
    currentStep = step;
  }

  // 1. Upload
  function loadExample(url) {
    document.getElementById('landing-page-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    window.scrollTo(0,0);
    originalImage.crossOrigin = "Anonymous";
    originalImage.src = url;
    originalImage.onload = () => {
      setupCrop();
      goToStep(2);
    };
  }

  function handleUpload(e) {
      document.getElementById('landing-page-container').style.display = 'none';
      document.getElementById('app-container').style.display = 'block';
      window.scrollTo(0,0);
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
      originalImage.src = event.target.result;
      originalImage.onload = () => {
        setupCrop();
        goToStep(2);
      }
    };
    reader.readAsDataURL(file);
  }

  // 2. Crop logic (Simplified for UI visualization)
  let drag = false, startX, startY, imgX=0, imgY=0, imgScale=1;
  function setupCrop() {
    const img = document.getElementById('cropImg');
    img.src = originalImage.src;
    imgX=0; imgY=0; imgScale=1; // reset
    updateCropBox();
    
    // Basic drag logic
    img.onmousedown = (e) => { drag = true; startX = e.clientX - imgX; startY = e.clientY - imgY; e.preventDefault(); };
    document.onmousemove = (e) => { if(drag) { imgX = e.clientX - startX; imgY = e.clientY - startY; img.style.transform = `translate(${imgX}px, ${imgY}px) scale(${imgScale})`; } };
    document.onmouseup = () => { drag = false; };
    // Wheel zoom
    document.getElementById('cropWrapper').onwheel = (e) => {
      e.preventDefault();
      imgScale += e.deltaY * -0.001;
      imgScale = Math.max(0.1, imgScale);
      img.style.transform = `translate(${imgX}px, ${imgY}px) scale(${imgScale})`;
    };
  }

  function updateCropBox() {
    const size = document.getElementById('cropSize').value;
    let w, h;
    if(size !== 'custom') {
      [w, h] = size.split('x').map(Number);
      document.getElementById('cropW').value = w;
      document.getElementById('cropH').value = h;
    } else {
      w = +document.getElementById('cropW').value;
      h = +document.getElementById('cropH').value;
    }
    const wrap = document.getElementById('cropWrapper');
    // Scale for visualization
    const visualW = w * 5;
    const visualH = h * 5;
    wrap.style.width = visualW + 'px';
    wrap.style.height = visualH + 'px';

    // Auto-scale to fit nicely initially
    if (imgScale === 1 && originalImage.width) {
      const scaleToFitW = visualW / originalImage.width;
      const scaleToFitH = visualH / originalImage.height;
      imgScale = Math.max(scaleToFitW, scaleToFitH);
      imgX = (visualW - (originalImage.width * imgScale)) / 2;
      imgY = (visualH - (originalImage.height * imgScale)) / 2;
    }

    document.getElementById('cropImg').style.transform = `translate(${imgX}px, ${imgY}px) scale(${imgScale})`;
  }

  function applyCropAndNext() {
    // Render crop to a real canvas
    const w = +document.getElementById('cropW').value * MM_TO_PX;
    const h = +document.getElementById('cropH').value * MM_TO_PX;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    
    // Reverse engineer the visual scale to actual scale
    const visualW = +document.getElementById('cropW').value * 5;
    const ratio = w / visualW;
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,w,h);
    ctx.drawImage(originalImage, imgX * ratio, imgY * ratio, originalImage.width * imgScale * ratio, originalImage.height * imgScale * ratio);
    
    croppedImage.src = c.toDataURL('image/png');
    croppedImage.onload = () => {
      bgRemovedImage.src = croppedImage.src; // Init bg removed as same
      bgRemovedImage.onload = () => {
        initBgCanvas();
        goToStep(3);
      }
    }
  }

  // 3. Background
  function initBgCanvas() {
    applyBgColor();
  }

  function setBg(color) {
    document.getElementById('bgColor').value = color;
    applyBgColor();
  }

  function applyBgColor() {
    const c = document.getElementById('bgCanvas');
    c.width = bgRemovedImage.width; c.height = bgRemovedImage.height;
    const ctx = c.getContext('2d');
    ctx.fillStyle = document.getElementById('bgColor').value;
    ctx.fillRect(0,0,c.width,c.height);
    ctx.drawImage(bgRemovedImage, 0, 0);
  }

  async function removeBgApi() {
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
      
      if(!res.ok) throw new Error("API Failed: " + res.status);
      let resBlob = await res.blob();
      let url = URL.createObjectURL(resBlob);
      
      bgRemovedImage.onload = () => {
        clearInterval(interval);
        pb.style.width = '100%';
        pt.textContent = '100% Complete!';
        setTimeout(() => {
            document.getElementById('scannerOverlay').style.display = 'none';
            document.getElementById('progressContainer').style.display = 'none';
            document.getElementById('progressText').style.display = 'none';
            applyBgColor();
        }, 500);
      };
      
      bgRemovedImage.onerror = () => {
        clearInterval(interval);
        alert('Failed to load processed image from API.');
        document.getElementById('scannerOverlay').style.display = 'none';
        document.getElementById('progressContainer').style.display = 'none';
        document.getElementById('progressText').style.display = 'none';
      };

      bgRemovedImage.src = url;
    } catch (e) {
      clearInterval(interval);
      console.error(e);
      alert('Background removal failed. API might be offline.');
      document.getElementById('scannerOverlay').style.display = 'none';
      document.getElementById('progressContainer').style.display = 'none';
      document.getElementById('progressText').style.display = 'none';
    }
  }

  
  function downloadImage(canvasId, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = document.getElementById(canvasId).toDataURL('image/png');
    link.click();
  }

  // 4. Adjustments
  function applyAdjustments() {
    const b = document.getElementById('slB').value;
    const c = document.getElementById('slC').value;
    const s = document.getElementById('slS').value;
    
    document.getElementById('vB').textContent = b + '%';
    document.getElementById('vC').textContent = c + '%';
    document.getElementById('vS').textContent = s + '%';

    const canvas = document.getElementById('adjCanvas');
    canvas.width = bgRemovedImage.width; canvas.height = bgRemovedImage.height;
    const ctx = canvas.getContext('2d');
    
    // Draw BG
    ctx.fillStyle = document.getElementById('bgColor').value;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    // CSS Filters trick for canvas
    ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
    ctx.drawImage(bgRemovedImage, 0, 0);
    ctx.filter = 'none'; // reset
  }

  function autoEnhance() {
    document.getElementById('slB').value = 110;
    document.getElementById('slC').value = 115;
    document.getElementById('slS').value = 105;
    applyAdjustments();
  }

  // 5. Print Layout
  function preparePrintStep() {
    // Save final adjusted image
    applyAdjustments();
    finalImage.src = document.getElementById('adjCanvas').toDataURL('image/png');
    finalImage.onload = () => {
      updatePrintLayout();
      goToStep(5);
    }
  }

  function updatePrintLayout(includeRuler = true) {
    const c = document.getElementById('printCanvas');
    const ctx = c.getContext('2d');
    
    const paperSize = document.getElementById('paperSize').value;
    let pW, pH;
    if(paperSize === 'A4P') { pW = 210 * MM_TO_PX; pH = 297 * MM_TO_PX; }
    else if(paperSize === 'A4L') { pW = 297 * MM_TO_PX; pH = 210 * MM_TO_PX; }
    else if(paperSize === '4x6L') { pW = 152 * MM_TO_PX; pH = 102 * MM_TO_PX; }
    else if(paperSize === '4x6P') { pW = 102 * MM_TO_PX; pH = 152 * MM_TO_PX; }
    else if(paperSize === '5x7L') { pW = 178 * MM_TO_PX; pH = 127 * MM_TO_PX; }
    else if(paperSize === '5x7P') { pW = 127 * MM_TO_PX; pH = 178 * MM_TO_PX; }

    c.width = pW; c.height = pH;
    ctx.fillStyle = "#ffffff"; // Paper color
    ctx.fillRect(0,0,pW,pH);

    const count = +document.getElementById('photoCount').value;
    const photoMargin = +document.getElementById('photoMargin').value * MM_TO_PX;
    const pageMargin = +document.getElementById('pageMargin').value * MM_TO_PX;
    
    const bColor = document.getElementById('borderColor').value;
    const bWidth = +document.getElementById('borderWidth').value;

    // Calculate Grid
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
      
      for(let r=0; r<rows; r++) {
      for(let col=0; col<cols; col++) {
        if(printed >= count) break;
        const x = startX + (col * (imgW + photoMargin));
        const y = startY + (r * (imgH + photoMargin));
        
        ctx.drawImage(finalImage, x, y, imgW, imgH);
        
        if(bWidth > 0) {
          ctx.strokeStyle = bColor;
          ctx.lineWidth = bWidth;
          ctx.strokeRect(x, y, imgW, imgH);
        }
        printed++;
      }
    }
    
    // Draw Ruler (Scale Pati)
    if (includeRuler) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.font = '35px Arial';
      ctx.lineWidth = 2;
      
      // Top Ruler (X axis)
      for (let i = 0; i <= pW / MM_TO_PX; i++) {
        const x = i * MM_TO_PX;
        let tickLen = 10;
        if (i % 5 === 0) tickLen = 20;
        if (i % 10 === 0) {
          tickLen = 30;
          if (i > 0) ctx.fillText(i, x + 6, 30);
        }
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, tickLen);
        ctx.stroke();
      }
      
      // Left Ruler (Y axis)
      for (let i = 0; i <= pH / MM_TO_PX; i++) {
        const y = i * MM_TO_PX;
        let tickLen = 10;
        if (i % 5 === 0) tickLen = 20;
        if (i % 10 === 0) {
          tickLen = 30;
          if (i > 0) {
            ctx.save();
            ctx.translate(30, y + 8);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(i, 0, 0);
            ctx.restore();
          }
        }
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(tickLen, y);
        ctx.stroke();
      }
    }
  }

  function printSheet() {
    // Re-render WITHOUT ruler for the print dataUrl
    updatePrintLayout(false);
    
    const c = document.getElementById('printCanvas');
    const dataUrl = c.toDataURL('image/png');
    
    // Restore ruler on the UI preview
    updatePrintLayout(true);
    
    const paperSize = document.getElementById('paperSize').value;
    let cssPageSize = 'auto';
    if(paperSize === 'A4P') cssPageSize = 'A4 portrait';
    if(paperSize === 'A4L') cssPageSize = 'A4 landscape';
    if(paperSize === '4x6P') cssPageSize = '4in 6in';
    if(paperSize === '4x6L') cssPageSize = '6in 4in';
    if(paperSize === '5x7P') cssPageSize = '5in 7in';
    if(paperSize === '5x7L') cssPageSize = '7in 5in';
    
    // Open a new window for pure printing
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html>
        <head>
          <title>Print Passport Photos</title>
          <style>
            @page { size: ${cssPageSize}; margin: 0mm; }
            body { margin: 0; display:flex; justify-content:center; align-items:center; background:#fff; }
            img { width: 100%; height: 100%; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWin.document.close();
  }

  function zoomImage(delta) {
    imgScale += delta;
    imgScale = Math.max(0.1, imgScale);
    document.getElementById('cropImg').style.transform = `translate(${imgX}px, ${imgY}px) scale(${imgScale})`;
  }

  function resetZoom() {
    imgScale = 1;
    imgX = 0;
    imgY = 0;
    updateCropBox(); // Recalculate auto-fit
  }


