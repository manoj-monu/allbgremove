def fix():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    old_logic = """    // Draw Ruler (Scale Pati)
    if (includeRuler) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.font = '10px Arial';
      ctx.lineWidth = 1;
      
      // Top Ruler (X axis)
      for (let i = 0; i <= pW / MM_TO_PX; i++) {
        const x = i * MM_TO_PX;
        let tickLen = 5;
        if (i % 5 === 0) tickLen = 10;
        if (i % 10 === 0) {
          tickLen = 15;
          if (i > 0) ctx.fillText(i, x + 2, 10);
        }
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, tickLen);
        ctx.stroke();
      }
      
      // Left Ruler (Y axis)
      for (let i = 0; i <= pH / MM_TO_PX; i++) {
        const y = i * MM_TO_PX;
        let tickLen = 5;
        if (i % 5 === 0) tickLen = 10;
        if (i % 10 === 0) {
          tickLen = 15;
          if (i > 0) {
            ctx.save();
            ctx.translate(10, y + 2);
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
    }"""

    new_logic = """    // Draw Ruler (Scale Pati)
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
    }"""

    html = html.replace(old_logic, new_logic)

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    fix()
