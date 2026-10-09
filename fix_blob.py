def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Add dataURLtoBlob function and update downloadImage
    old_download = """  function downloadImage(canvasId, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = document.getElementById(canvasId).toDataURL('image/png');
    link.click();
  }"""
    
    new_download = """  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  function downloadImage(canvasId, filename) {
    const c = document.getElementById(canvasId);
    // Use JPEG for better compatibility and smaller size
    const dataUrl = c.toDataURL('image/jpeg', 1.0);
    const blob = dataURLtoBlob(dataUrl);
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = filename.replace('.png', '.jpg');
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }"""
  
    html = html.replace(old_download, new_download)
    
    # Also update downloadSheet
    old_sheet = """  function downloadSheet() {
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
  }"""
  
    new_sheet = """  function downloadSheet() {
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
  }"""
  
    html = html.replace(old_sheet, new_sheet)
    
    # Also fix download buttons that pass .png hardcoded (it will be replaced by .jpg in the function, but better safe)
    
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
