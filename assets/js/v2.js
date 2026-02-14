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

// === 2. Particle Network Background ===
(function() {
  const canvas = document.getElementById('bg-flow');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  const mouse = { x: -9999, y: -9999, active: false };
  const PARTICLE_COUNT = 70;
  const CONNECTION_DIST = 150;
  const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
  const MOUSE_RADIUS = 200;
  const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
  const particles = [];

  let resizeTimer;
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  resize();
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  // Track pointer on document (works for mouse + touch + pen)
  document.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  document.addEventListener('pointerleave', () => {
    mouse.active = false;
  });

  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      // Alternate between cyan and purple tinted particles
      color: i % 3 === 0
        ? [0, 212, 255]   // cyan
        : i % 3 === 1
          ? [168, 85, 247] // purple
          : [6, 182, 212], // teal
    });
  }

  function drawParticles(time) {
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, width, height);

    const t = time * 0.001;

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Gentle drift with sine wobble
      p.x += p.vx + Math.sin(t * 0.5 + i) * 0.1;
      p.y += p.vy + Math.cos(t * 0.4 + i * 0.7) * 0.1;

      // Wrap edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse interaction — gentle repulsion
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < MOUSE_RADIUS_SQ && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      // Draw particle with glow
      const [r, g, b] = p.color;
      const alpha = 0.4 + Math.sin(t + i * 0.5) * 0.15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();

      // Subtle glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.1})`;
      ctx.fill();
    }

    // Draw connections (squared distance to avoid sqrt)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < CONNECTION_DIST_SQ) {
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw mouse connections
    if (mouse.active) {
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < MOUSE_RADIUS_SQ) {
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / MOUSE_RADIUS) * 0.2;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  window._bgDraw = drawParticles;
})();

// === 3. Animated Cover Art Generator (dark theme) ===

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
  const saturation = 60 + (h2 >> 16) % 20;
  const lightness = 30 + (h1 >> 8) % 20;
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

  const t = time * 0.0004;

  ctx.clearRect(0, 0, width, height);

  // Layer 1: Dark gradient background
  const angleRad = ((gradientAngle + Math.sin(t * 0.3) * 15) * Math.PI) / 180;
  const gx1 = width / 2 - Math.cos(angleRad) * width;
  const gy1 = height / 2 - Math.sin(angleRad) * height;
  const gx2 = width / 2 + Math.cos(angleRad) * width;
  const gy2 = height / 2 + Math.sin(angleRad) * height;
  const gradient = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
  const hueShift = Math.sin(t * 0.2) * 8;
  gradient.addColorStop(0, `hsl(${hue1 + hueShift}, ${saturation}%, ${lightness * 0.4}%)`);
  gradient.addColorStop(1, `hsl(${hue2 + hueShift}, ${saturation}%, ${lightness * 0.5}%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Layer 2: Animated pattern
  ctx.save();
  if (patternType === 0) {
    const meshCount = 5 + Math.floor(random() * 4);
    for (let i = 0; i < meshCount; i++) {
      const baseX = random() * width, baseY = random() * height;
      const x = baseX + Math.sin(t * 0.5 + i * 1.7) * 12;
      const y = baseY + Math.cos(t * 0.4 + i * 2.1) * 10;
      const radius = (50 + random() * 150) * Math.min(width, height) / 400;
      const pulse = 1 + Math.sin(t * 0.6 + i) * 0.08;
      const radialGrad = ctx.createRadialGradient(x, y, 0, x, y, radius * pulse);
      radialGrad.addColorStop(0, `hsla(${hue3 + hueShift}, ${saturation + 10}%, ${lightness + 15}%, 0.3)`);
      radialGrad.addColorStop(1, `hsla(${hue1 + hueShift}, ${saturation}%, ${lightness}%, 0)`);
      ctx.fillStyle = radialGrad;
      ctx.beginPath(); ctx.arc(x, y, radius * pulse, 0, Math.PI * 2); ctx.fill();
    }
  } else if (patternType === 1) {
    const centerX = width / 2 + (random() - 0.5) * width * 0.3;
    const centerY = height / 2 + (random() - 0.5) * height * 0.3;
    const ringCount = 6 + Math.floor(random() * 4);
    const maxRadius = Math.max(width, height) * 0.7;
    for (let i = 0; i < ringCount; i++) {
      const breath = 1 + Math.sin(t * 0.5 + i * 0.8) * 0.06;
      const radius = (maxRadius / ringCount) * (i + 1) * breath;
      const alpha = 0.18 + Math.sin(t * 0.3 + i * 0.5) * 0.06;
      ctx.strokeStyle = `hsla(${(hue2 + i * 15 + hueShift) % 360}, ${saturation}%, ${lightness + 15}%, ${alpha})`;
      ctx.lineWidth = 8 + random() * 15;
      ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.stroke();
    }
  } else if (patternType === 2) {
    const triCount = 8 + Math.floor(random() * 8);
    for (let i = 0; i < triCount; i++) {
      const baseX = random() * width, baseY = random() * height;
      const tx = baseX + Math.sin(t * 0.3 + i * 1.3) * 8;
      const ty = baseY + Math.cos(t * 0.25 + i * 1.7) * 8;
      const size = (30 + random() * 100) * Math.min(width, height) / 400;
      const rot = random() * Math.PI * 2 + t * 0.15;
      const alpha = 0.2 + Math.sin(t * 0.4 + i) * 0.06;
      ctx.fillStyle = `hsla(${(hue1 + i * 20 + hueShift) % 360}, ${saturation}%, ${lightness + 10}%, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(tx + Math.cos(rot) * size, ty + Math.sin(rot) * size);
      ctx.lineTo(tx + Math.cos(rot + Math.PI * 2/3) * size, ty + Math.sin(rot + Math.PI * 2/3) * size);
      ctx.lineTo(tx + Math.cos(rot + Math.PI * 4/3) * size, ty + Math.sin(rot + Math.PI * 4/3) * size);
      ctx.closePath(); ctx.fill();
    }
  } else {
    const waveCount = 5 + Math.floor(random() * 5);
    for (let i = 0; i < waveCount; i++) {
      const hueVal = (hue3 + i * 25 + hueShift) % 360;
      const alpha = 0.25 + Math.sin(t * 0.3 + i * 0.9) * 0.08;
      ctx.strokeStyle = `hsla(${hueVal}, ${saturation}%, ${lightness + 10}%, ${alpha})`;
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
    const alpha = 0.12 + random() * 0.2 + Math.sin(t * 0.5 + i) * 0.04;
    ctx.fillStyle = `hsla(${(hue2 + i * 30 + hueShift) % 360}, ${saturation + 10}%, ${lightness + 15}%, ${alpha})`;
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

  // Layer 4: Twinkling stars
  const dotSpacing = 18;
  for (let dx = dotSpacing / 2; dx < width; dx += dotSpacing) {
    for (let dy = dotSpacing / 2; dy < height; dy += dotSpacing) {
      if (random() > 0.65) {
        const twinkle = 0.05 + Math.sin(t * 1.5 + dx * 0.1 + dy * 0.13) * 0.04;
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        ctx.beginPath(); ctx.arc(dx, dy, 0.8, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
}

// === 4. Typing Animation ===
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initTyping() {
  const el = document.querySelector('[data-typing]');
  if (!el) return;

  const text = el.getAttribute('data-typing');
  if (!text) return;

  // For screen readers: keep full text accessible via aria
  el.setAttribute('aria-label', text);

  // Skip animation if reduced motion preferred
  if (prefersReducedMotion) {
    el.textContent = text;
    return;
  }

  el.textContent = '';
  el.classList.add('typing-cursor');
  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 60 + Math.random() * 40);
    } else {
      setTimeout(() => el.classList.remove('typing-cursor'), 3000);
    }
  }

  setTimeout(type, 500);
}

// === 5. Scroll Fade-in Animations ===
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// === 6. Animation loop ===
document.addEventListener('DOMContentLoaded', () => {
  // Init typing
  initTyping();

  // Init scroll animations
  initScrollAnimations();

  // Init cover canvases
  const canvases = document.querySelectorAll('canvas.auto-cover[data-seed]');
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

  // Unified animation loop (skip continuous animation if reduced motion)
  if (!prefersReducedMotion) {
    let lastFrame = 0;
    function animate(now) {
      if (now - lastFrame > 30) {
        lastFrame = now;
        if (window._bgDraw) window._bgDraw(now);
        visibleCanvases.forEach(canvas => {
          drawCover(canvas, canvas.dataset.seed, now);
        });
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  } else {
    // Draw once for static state
    if (window._bgDraw) window._bgDraw(0);
  }
});
