// === 1. Mobile nav toggle ===
const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && event.target !== menuBtn) {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// === 2. Flowing Background ===
(function() {
  const bg = document.getElementById('bg-flow');
  if (!bg) return;
  const ctx = bg.getContext('2d');

  function resize() {
    bg.width = window.innerWidth;
    bg.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // 6 soft blobs with visible drift
  const blobs = [];
  const palette = [
    [147, 197, 253, 0.18], // soft blue
    [196, 181, 253, 0.15], // soft lavender
    [165, 243, 252, 0.14], // soft cyan
    [191, 219, 254, 0.16], // pale blue
    [221, 214, 254, 0.13], // pale purple
    [186, 230, 253, 0.15], // sky
  ];
  for (let i = 0; i < palette.length; i++) {
    blobs.push({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.003,
      vy: (Math.random() - 0.5) * 0.003,
      r: 0.18 + Math.random() * 0.15,
      color: palette[i],
      phase: (i / palette.length) * Math.PI * 2,
    });
  }

  function drawBg(t) {
    const w = bg.width, h = bg.height;
    // Soft base
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    const s = Math.max(w, h);
    for (const b of blobs) {
      // Visible drift with sine wobble
      b.x += b.vx + Math.sin(t * 0.003 + b.phase) * 0.002;
      b.y += b.vy + Math.cos(t * 0.0025 + b.phase * 1.3) * 0.002;
      // Wrap around edges
      if (b.x < -0.3) b.x = 1.3;
      if (b.x > 1.3) b.x = -0.3;
      if (b.y < -0.3) b.y = 1.3;
      if (b.y > 1.3) b.y = -0.3;

      const pulse = b.r + Math.sin(t * 0.004 + b.phase) * 0.05;
      const cx = b.x * w, cy = b.y * h, cr = pulse * s;
      const [r, g, bl, a] = b.color;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
      grad.addColorStop(0, `rgba(${r},${g},${bl},${a})`);
      grad.addColorStop(0.5, `rgba(${r},${g},${bl},${a * 0.4})`);
      grad.addColorStop(0.8, `rgba(${r},${g},${bl},${a * 0.1})`);
      grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(cx - cr, cy - cr, cr * 2, cr * 2);
    }
  }

  // Run on same rAF as cover art
  window._bgDraw = drawBg;
})();

// === 3. Animated Cover Art Generator ===

function hashString(str) {
  let h1 = 5381, h2 = 52711;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = (h1 * 33) ^ ch;
    h2 = (h2 * 33) ^ ch;
  }
  return { h1: h1 >>> 0, h2: h2 >>> 0 };
}

function deriveParams(hash) {
  const { h1, h2 } = hash;
  const hue1 = (h1 & 0xFFFF) % 360;
  const hue2 = (hue1 + 60 + (h1 >> 16) % 120) % 360;
  const hue3 = (hue1 + 180 + (h2 & 0xFFFF) % 120) % 360;
  const saturation = 50 + (h2 >> 16) % 26;
  const lightness = 45 + (h1 >> 8) % 21;
  const shapeCount = 3 + (h1 >> 24) % 5;
  const patternType = h2 % 4;
  const gradientAngle = (h1 >> 12) % 360;
  return { hue1, hue2, hue3, saturation, lightness, shapeCount, patternType, gradientAngle };
}

function seededRandom(seed) {
  let state = seed;
  return function() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xFFFFFFFF;
  };
}

function drawCover(canvas, seed, time) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;

  const hash = hashString(seed);
  const params = deriveParams(hash);
  const random = seededRandom(hash.h1);
  const { hue1, hue2, hue3, saturation, lightness, shapeCount, patternType, gradientAngle } = params;

  // Slow time factor for gentle animation
  const t = time * 0.0004;

  ctx.clearRect(0, 0, width, height);

  // Layer 1: Animated gradient background
  const angleRad = ((gradientAngle + Math.sin(t * 0.3) * 15) * Math.PI) / 180;
  const gx1 = width / 2 - Math.cos(angleRad) * width;
  const gy1 = height / 2 - Math.sin(angleRad) * height;
  const gx2 = width / 2 + Math.cos(angleRad) * width;
  const gy2 = height / 2 + Math.sin(angleRad) * height;
  const gradient = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
  const hueShift = Math.sin(t * 0.2) * 8;
  gradient.addColorStop(0, `hsl(${hue1 + hueShift}, ${saturation}%, ${lightness}%)`);
  gradient.addColorStop(1, `hsl(${hue2 + hueShift}, ${saturation}%, ${lightness + 5}%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Layer 2: Animated pattern
  ctx.save();
  if (patternType === 0) {
    // Floating mesh blobs
    const meshCount = 5 + Math.floor(random() * 4);
    for (let i = 0; i < meshCount; i++) {
      const baseX = random() * width, baseY = random() * height;
      const x = baseX + Math.sin(t * 0.5 + i * 1.7) * 12;
      const y = baseY + Math.cos(t * 0.4 + i * 2.1) * 10;
      const radius = (50 + random() * 150) * Math.min(width, height) / 400;
      const pulse = 1 + Math.sin(t * 0.6 + i) * 0.08;
      const radialGrad = ctx.createRadialGradient(x, y, 0, x, y, radius * pulse);
      radialGrad.addColorStop(0, `hsla(${hue3 + hueShift}, ${saturation + 10}%, ${lightness + 10}%, 0.25)`);
      radialGrad.addColorStop(1, `hsla(${hue1 + hueShift}, ${saturation}%, ${lightness}%, 0)`);
      ctx.fillStyle = radialGrad;
      ctx.beginPath(); ctx.arc(x, y, radius * pulse, 0, Math.PI * 2); ctx.fill();
    }
  } else if (patternType === 1) {
    // Breathing concentric circles
    const centerX = width / 2 + (random() - 0.5) * width * 0.3;
    const centerY = height / 2 + (random() - 0.5) * height * 0.3;
    const ringCount = 6 + Math.floor(random() * 4);
    const maxRadius = Math.max(width, height) * 0.7;
    for (let i = 0; i < ringCount; i++) {
      const breath = 1 + Math.sin(t * 0.5 + i * 0.8) * 0.06;
      const radius = (maxRadius / ringCount) * (i + 1) * breath;
      const alpha = 0.15 + Math.sin(t * 0.3 + i * 0.5) * 0.05;
      ctx.strokeStyle = `hsla(${(hue2 + i * 15 + hueShift) % 360}, ${saturation}%, ${lightness}%, ${alpha})`;
      ctx.lineWidth = 8 + random() * 15;
      ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.stroke();
    }
  } else if (patternType === 2) {
    // Drifting & rotating triangles
    const triCount = 8 + Math.floor(random() * 8);
    for (let i = 0; i < triCount; i++) {
      const baseX = random() * width, baseY = random() * height;
      const tx = baseX + Math.sin(t * 0.3 + i * 1.3) * 8;
      const ty = baseY + Math.cos(t * 0.25 + i * 1.7) * 8;
      const size = (30 + random() * 100) * Math.min(width, height) / 400;
      const rot = random() * Math.PI * 2 + t * 0.15;
      const alpha = 0.2 + Math.sin(t * 0.4 + i) * 0.05;
      ctx.fillStyle = `hsla(${(hue1 + i * 20 + hueShift) % 360}, ${saturation - 10}%, ${lightness}%, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(tx + Math.cos(rot) * size, ty + Math.sin(rot) * size);
      ctx.lineTo(tx + Math.cos(rot + Math.PI * 2/3) * size, ty + Math.sin(rot + Math.PI * 2/3) * size);
      ctx.lineTo(tx + Math.cos(rot + Math.PI * 4/3) * size, ty + Math.sin(rot + Math.PI * 4/3) * size);
      ctx.closePath(); ctx.fill();
    }
  } else {
    // Undulating bezier waves
    const waveCount = 5 + Math.floor(random() * 5);
    for (let i = 0; i < waveCount; i++) {
      const hueVal = (hue3 + i * 25 + hueShift) % 360;
      const alpha = 0.25 + Math.sin(t * 0.3 + i * 0.9) * 0.08;
      ctx.strokeStyle = `hsla(${hueVal}, ${saturation}%, ${lightness - 5}%, ${alpha})`;
      ctx.lineWidth = 3 + random() * 8;
      ctx.lineCap = 'round';
      const drift = Math.sin(t * 0.4 + i) * 15;
      ctx.beginPath();
      ctx.moveTo(random() * width, random() * height + drift);
      ctx.bezierCurveTo(
        random() * width, random() * height + drift * 0.7,
        random() * width, random() * height - drift * 0.5,
        random() * width, random() * height + drift
      );
      ctx.stroke();
    }
  }
  ctx.restore();

  // Layer 3: Floating decorative shapes
  for (let i = 0; i < shapeCount; i++) {
    const baseX = random() * width, baseY = random() * height;
    const x = baseX + Math.sin(t * 0.35 + i * 2.3) * 10;
    const y = baseY + Math.cos(t * 0.3 + i * 1.9) * 8;
    const size = (10 + random() * 40) * Math.min(width, height) / 400;
    const shapeType = Math.floor(random() * 3);
    const alpha = 0.1 + random() * 0.25 + Math.sin(t * 0.5 + i) * 0.04;
    ctx.fillStyle = `hsla(${(hue2 + i * 30 + hueShift) % 360}, ${saturation + 10}%, ${lightness + 10}%, ${alpha})`;
    if (shapeType === 0) {
      ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
    } else if (shapeType === 1) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4 + t * 0.1);
      ctx.fillRect(-size, -size, size * 2, size * 2); ctx.restore();
    } else {
      ctx.beginPath(); ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y + size); ctx.lineTo(x - size, y + size);
      ctx.closePath(); ctx.fill();
    }
  }

  // Layer 4: Twinkling dot texture
  const dotSpacing = 15;
  for (let dx = dotSpacing / 2; dx < width; dx += dotSpacing) {
    for (let dy = dotSpacing / 2; dy < height; dy += dotSpacing) {
      if (random() > 0.6) {
        const twinkle = 0.03 + Math.sin(t * 1.5 + dx * 0.1 + dy * 0.13) * 0.025;
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        ctx.beginPath(); ctx.arc(dx, dy, 1, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
}

// === 4. Animation loop ===
document.addEventListener('DOMContentLoaded', () => {
  const canvases = document.querySelectorAll('canvas.auto-cover[data-seed]');

  // Initialize cover canvas sizes
  canvases.forEach(canvas => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    drawCover(canvas, canvas.dataset.seed, 0);
  });

  // Observe visibility for cover canvases
  const visibleCanvases = new Set();
  if (canvases.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visibleCanvases.add(entry.target);
        else visibleCanvases.delete(entry.target);
      });
    }, { threshold: 0.05 });
    canvases.forEach(c => observer.observe(c));
  }

  // Unified animation loop: background + cover art
  let lastFrame = 0;
  function animate(now) {
    if (now - lastFrame > 30) {
      lastFrame = now;
      // Flowing background
      if (window._bgDraw) window._bgDraw(now);
      // Cover art
      visibleCanvases.forEach(canvas => {
        drawCover(canvas, canvas.dataset.seed, now);
      });
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
});
