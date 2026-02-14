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

// === 2. Cover Art Generator ===

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

function drawCover(canvas, seed) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;

  const hash = hashString(seed);
  const params = deriveParams(hash);
  const random = seededRandom(hash.h1);
  const { hue1, hue2, hue3, saturation, lightness, shapeCount, patternType, gradientAngle } = params;

  ctx.clearRect(0, 0, width, height);

  // Layer 1: Gradient background
  const angleRad = (gradientAngle * Math.PI) / 180;
  const gx1 = width / 2 - Math.cos(angleRad) * width;
  const gy1 = height / 2 - Math.sin(angleRad) * height;
  const gx2 = width / 2 + Math.cos(angleRad) * width;
  const gy2 = height / 2 + Math.sin(angleRad) * height;
  const gradient = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
  gradient.addColorStop(0, `hsl(${hue1}, ${saturation}%, ${lightness}%)`);
  gradient.addColorStop(1, `hsl(${hue2}, ${saturation}%, ${lightness + 5}%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Layer 2: Pattern
  ctx.save();
  if (patternType === 0) {
    // Mesh gradient
    const meshCount = 5 + Math.floor(random() * 4);
    for (let i = 0; i < meshCount; i++) {
      const x = random() * width, y = random() * height;
      const radius = (50 + random() * 150) * Math.min(width, height) / 400;
      const radialGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      radialGrad.addColorStop(0, `hsla(${hue3}, ${saturation + 10}%, ${lightness + 10}%, 0.25)`);
      radialGrad.addColorStop(1, `hsla(${hue1}, ${saturation}%, ${lightness}%, 0)`);
      ctx.fillStyle = radialGrad;
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
    }
  } else if (patternType === 1) {
    // Concentric circles
    const centerX = width / 2 + (random() - 0.5) * width * 0.3;
    const centerY = height / 2 + (random() - 0.5) * height * 0.3;
    const ringCount = 6 + Math.floor(random() * 4);
    const maxRadius = Math.max(width, height) * 0.7;
    for (let i = 0; i < ringCount; i++) {
      const radius = (maxRadius / ringCount) * (i + 1);
      ctx.strokeStyle = `hsla(${(hue2 + i * 15) % 360}, ${saturation}%, ${lightness}%, 0.15)`;
      ctx.lineWidth = 8 + random() * 15;
      ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.stroke();
    }
  } else if (patternType === 2) {
    // Triangles
    const triCount = 8 + Math.floor(random() * 8);
    for (let i = 0; i < triCount; i++) {
      const tx = random() * width, ty = random() * height;
      const size = (30 + random() * 100) * Math.min(width, height) / 400;
      const rot = random() * Math.PI * 2;
      ctx.fillStyle = `hsla(${(hue1 + i * 20) % 360}, ${saturation - 10}%, ${lightness}%, 0.2)`;
      ctx.beginPath();
      ctx.moveTo(tx + Math.cos(rot) * size, ty + Math.sin(rot) * size);
      ctx.lineTo(tx + Math.cos(rot + Math.PI * 2/3) * size, ty + Math.sin(rot + Math.PI * 2/3) * size);
      ctx.lineTo(tx + Math.cos(rot + Math.PI * 4/3) * size, ty + Math.sin(rot + Math.PI * 4/3) * size);
      ctx.closePath(); ctx.fill();
    }
  } else {
    // Bezier waves
    const waveCount = 5 + Math.floor(random() * 5);
    for (let i = 0; i < waveCount; i++) {
      ctx.strokeStyle = `hsla(${(hue3 + i * 25) % 360}, ${saturation}%, ${lightness - 5}%, 0.25)`;
      ctx.lineWidth = 3 + random() * 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(random() * width, random() * height);
      ctx.bezierCurveTo(random() * width, random() * height, random() * width, random() * height, random() * width, random() * height);
      ctx.stroke();
    }
  }
  ctx.restore();

  // Layer 3: Decorative shapes
  for (let i = 0; i < shapeCount; i++) {
    const x = random() * width, y = random() * height;
    const size = (10 + random() * 40) * Math.min(width, height) / 400;
    const shapeType = Math.floor(random() * 3);
    const alpha = 0.1 + random() * 0.25;
    ctx.fillStyle = `hsla(${(hue2 + i * 30) % 360}, ${saturation + 10}%, ${lightness + 10}%, ${alpha})`;
    if (shapeType === 0) {
      ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
    } else if (shapeType === 1) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4);
      ctx.fillRect(-size, -size, size * 2, size * 2); ctx.restore();
    } else {
      ctx.beginPath(); ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y + size); ctx.lineTo(x - size, y + size);
      ctx.closePath(); ctx.fill();
    }
  }

  // Layer 4: Dot texture
  const dotSpacing = 15;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let dx = dotSpacing / 2; dx < width; dx += dotSpacing) {
    for (let dy = dotSpacing / 2; dy < height; dy += dotSpacing) {
      if (random() > 0.6) {
        ctx.beginPath(); ctx.arc(dx, dy, 1, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
}

// === 3. Auto-init ===
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('canvas.auto-cover[data-seed]').forEach(canvas => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    drawCover(canvas, canvas.dataset.seed);
  });
});
