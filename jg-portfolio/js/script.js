/* ══════════════════════════════════════════════════════
   John Gil Mayor — Portfolio Script  v5.0
   Full overhaul: Events tab, Python viewer, Depth effect,
   Org carousel, Updated nav tabs, Air reveal observer
   ══════════════════════════════════════════════════════ */

/* ── Year ──────────────────────────────────────────── */
document.querySelectorAll('.yr').forEach(el => el.textContent = new Date().getFullYear());

/* ══════════════════════════════════════════════════════
   SIMPLE MODE — TAB SYSTEM  (defined first)
   ══════════════════════════════════════════════════════ */
const airRevealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('s-visible');
      airRevealObserver.unobserve(e.target);
    }
  });
}, { threshold: .1, rootMargin: '0px 0px -30px 0px' });

function activateSimpleTab(tabId) {
  document.querySelectorAll('.s-tab-panel').forEach(p => p.classList.remove('s-active'));
  document.querySelectorAll('.snav-tab, .sftab').forEach(b => b.classList.remove('active'));

  const panel = document.getElementById('stab-' + tabId);
  if (panel) {
    panel.classList.add('s-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger s-reveal elements in this panel
    setTimeout(() => {
      panel.querySelectorAll('.s-reveal').forEach(el => {
        airRevealObserver.observe(el);
      });
      // Re-trigger skill bars
      if (tabId === 'about') {
        setTimeout(() => {
          panel.querySelectorAll('.s-bar-fill').forEach(f => {
            f.style.width = '0';
            setTimeout(() => { f.style.width = f.dataset.w + '%'; }, 80);
          });
        }, 100);
      }
    }, 80);
  }

  document.querySelectorAll(`[data-stab="${tabId}"]`).forEach(el => {
    if (el.classList.contains('snav-tab') || el.classList.contains('sftab')) {
      el.classList.add('active');
    }
  });
}

// Delegate all [data-stab] clicks
document.addEventListener('click', e => {
  const trigger = e.target.closest('[data-stab]');
  if (!trigger) return;
  activateSimpleTab(trigger.dataset.stab);
});

/* ══════════════════════════════════════════════════════
   DRAWER LINKS  (updates based on mode)
   ══════════════════════════════════════════════════════ */
function updateDrawerLinks(mode) {
  const container = document.getElementById('drawerLinks');
  if (!container) return;

  if (mode === 'dev') {
    container.innerHTML = `
      <button class="drawer-link" data-tab="home"    data-close>Home</button>
      <button class="drawer-link" data-tab="about"   data-close>About</button>
      <button class="drawer-link" data-tab="events"  data-close>Events</button>
      <button class="drawer-link" data-tab="works"   data-close>Works</button>
      <button class="drawer-link btn-drawer" data-tab="contact" data-close>Contact</button>`;
  } else {
    container.innerHTML = `
      <button class="drawer-link" data-stab="home"    data-close>Home</button>
      <button class="drawer-link" data-stab="about"   data-close>About</button>
      <button class="drawer-link" data-stab="works"   data-close>Works</button>
      <button class="drawer-link btn-drawer" data-stab="contact" data-close>Contact</button>`;
  }
}

/* ══════════════════════════════════════════════════════
   MODE MANAGER
   ══════════════════════════════════════════════════════ */
const ModeManager = (() => {
  const html       = document.documentElement;
  const curtain    = document.getElementById('modeCurtain');
  const modeToggle = document.getElementById('modeToggle');

  let currentMode = localStorage.getItem('jg-mode') || 'dev';
  if (currentMode === 'simple') {
    currentMode = 'air';
    localStorage.setItem('jg-mode', 'air');
  }

  let transitioning = false;

  function applyMode(mode, skipTransition) {
    html.setAttribute('data-mode', mode);
    currentMode = mode;
    localStorage.setItem('jg-mode', mode);
    updateDrawerLinks(mode);

    ['cursorDot','cursorRing','cursorTrail'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.opacity = mode === 'dev' ? '1' : '0';
    });

    if (mode === 'air') {
      setTimeout(() => activateSimpleTab('home'), 50);
    }
  }

  function switchTo(newMode) {
    if (transitioning || newMode === currentMode) return;
    transitioning = true;

    curtain.classList.remove('opening');
    curtain.classList.add('closing');

    setTimeout(() => {
      applyMode(newMode, false);

      if (newMode === 'air') {
        const sci = document.getElementById('airIntro');
        if (sci) {
          sci.classList.remove('done');
          sci.classList.add('open');
          sci.style.display = 'flex';
        }
      }

      if (newMode === 'dev') {
        if (typeof window.playDevIntro === 'function') {
          window.playDevIntro();
        }
      }

      curtain.classList.remove('closing');
      curtain.classList.add('opening');

      setTimeout(() => {
        curtain.classList.remove('opening');
        transitioning = false;

        if (newMode === 'air') {
          const sci = document.getElementById('airIntro');
          if (sci) {
            setTimeout(() => {
              sci.classList.remove('open');
              sci.classList.add('done');
              setTimeout(() => { sci.style.display = 'none'; }, 600);
            }, 1200);
          }
        }
      }, 500);
    }, 450);
  }

  function init() {
    applyMode(currentMode, true);

    if (modeToggle) {
      modeToggle.addEventListener('click', () => {
        switchTo(currentMode === 'dev' ? 'air' : 'dev');
      });
    }
  }

  function getCurrentMode() { return currentMode; }

  return { init, getCurrentMode, switchTo };
})();

/* ══════════════════════════════════════════════════════
   CUSTOM CURSOR
   ══════════════════════════════════════════════════════ */
(function initCursor() {
  const dot   = document.getElementById('cursorDot');
  const ring  = document.getElementById('cursorRing');
  const trail = document.getElementById('cursorTrail');
  if (!dot) return;

  let mx=-200, my=-200, rx=-200, ry=-200, tx=-200, ty=-200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  (function animCursor() {
    rx += (mx-rx)*.18; ry += (my-ry)*.18;
    tx += (mx-tx)*.08; ty += (my-ty)*.08;
    ring.style.left  = rx+'px'; ring.style.top  = ry+'px';
    trail.style.left = tx+'px'; trail.style.top = ty+'px';
    requestAnimationFrame(animCursor);
  })();

  const sel = 'a, button, .chip, .tag, .project-card, .about-card, .clink, .skill-item, .s-project, .mode-toggle, .gdg-id-card, .depth-scene, .event-photo-card, .cisco-badge-sq, .org-item';
  document.addEventListener('mouseover', e => { if (e.target.closest(sel)) document.body.classList.add('cursor-hover'); });
  document.addEventListener('mouseout',  e => { if (e.target.closest(sel)) document.body.classList.remove('cursor-hover'); });
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
  document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; trail.style.opacity='0'; });
  document.addEventListener('mouseenter', () => {
    if (ModeManager.getCurrentMode() === 'dev') {
      dot.style.opacity='1'; ring.style.opacity='1'; trail.style.opacity='1';
    }
  });

  // Magnetic hover
  const magEls = document.querySelectorAll('.nav-cta, .btn-primary, .profile-btn');
  magEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      if(ModeManager.getCurrentMode() !== 'dev') return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    el.addEventListener('mouseleave', () => {
      if(ModeManager.getCurrentMode() === 'dev') el.style.transform = '';
    });
  });
})();

/* ══════════════════════════════════════════════════════
   DEV MODE INTRO OVERLAY
   ══════════════════════════════════════════════════════ */
window.playDevIntro = function() {
  const intro  = document.getElementById('intro');
  const fill   = document.getElementById('introFill');
  const pctEl  = document.getElementById('introPct');
  const canvas = document.getElementById('introCanvas');
  if (!intro) return;

  intro.classList.remove('hide');
  intro.style.display = 'flex';
  intro.style.pointerEvents = 'all';

  if(fill) fill.style.width = '0%';
  if(pctEl) pctEl.textContent = '0%';

  const ctx = canvas.getContext('2d');
  let W, H;
  function resizeI() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resizeI();
  window.addEventListener('resize', resizeI);

  const SYMS = ['{ }','//','01','</','&&','=>','[]','++','**','::','fn','<>',';;','🐍','⚡','🌐'];
  const particles = Array.from({length:38}, () => ({
    x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight,
    sym: SYMS[Math.floor(Math.random()*SYMS.length)],
    size: 10+Math.random()*10, alpha: .04+Math.random()*.12,
    vx: (Math.random()-.5)*.4, vy: -.2-Math.random()*.4,
    color: Math.random()>.5 ? '109,40,217' : '14,165,233',
  }));

  let rafI;
  function drawI() {
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => {
      ctx.font = `${p.size}px 'Syne',monospace`;
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fillText(p.sym, p.x, p.y);
      p.x += p.vx; p.y += p.vy;
      if (p.y < -30) { p.y = H+10; p.x = Math.random()*W; }
    });
    rafI = requestAnimationFrame(drawI);
  }
  drawI();

  let progress=0, done=false;
  let start = null;
  const DURATION=2200;

  function tick(now) {
    if (done) return;
    if (!start) start = now;
    progress = Math.min(((now - start) / DURATION) * 100, 100);
    if (isNaN(progress)) progress = 0;
    if (fill)  fill.style.width = Math.max(0, progress) + '%';
    if (pctEl) pctEl.textContent = Math.floor(Math.max(0, progress)) + '%';
    if (progress < 100) { requestAnimationFrame(tick); }
    else { setTimeout(dismiss, 260); }
  }
  requestAnimationFrame(tick);

  function dismiss() {
    if (done) return; done=true;
    cancelAnimationFrame(rafI);
    intro.classList.add('hide');
    setTimeout(() => { intro.style.display='none'; }, 720);
  }

  intro.addEventListener('click', dismiss);
  document.addEventListener('keydown', dismiss, {once:true});
  document.getElementById('introSkip')?.addEventListener('click', dismiss);
};

if(ModeManager.getCurrentMode() === 'dev') {
  window.playDevIntro();
} else {
  const intro = document.getElementById('intro');
  if (intro) { intro.style.display = 'none'; intro.classList.add('hide'); }
}

/* ══════════════════════════════════════════════════════
   BACKGROUND CANVAS — Futuristic Particle Network
   ══════════════════════════════════════════════════════ */
(function initBg() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  const PARTICLE_COUNT = 90;
  const CONNECTION_DIST = 160;
  const COLORS = ['0,255,200', '100,120,255', '180,80,255', '0,200,255'];

  let particles = [];

  function mkParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r:  1.2 + Math.random() * 1.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.012 + Math.random() * 0.016,
    }));
  }

  // Scan line
  let scanY = -50;
  let scanSpeed = 0.55;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Scan line sweep
    scanY += scanSpeed;
    if (scanY > H + 50) scanY = -50;
    const scanGrad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
    scanGrad.addColorStop(0,   'rgba(0,255,200,0)');
    scanGrad.addColorStop(0.5, 'rgba(0,255,200,0.035)');
    scanGrad.addColorStop(1,   'rgba(0,255,200,0)');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 60, W, 120);

    // Update and draw particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.pulse += p.pulseSpeed;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      const glow = 0.5 + 0.5 * Math.sin(p.pulse);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + glow * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${0.5 + glow * 0.4})`;
      ctx.fill();

      // Outer glow ring
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      grad.addColorStop(0, `rgba(${p.color},0.15)`);
      grad.addColorStop(1, `rgba(${p.color},0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.22;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${a.color},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize(); mkParticles(); draw();
  window.addEventListener('resize', () => { resize(); mkParticles(); });

  // Repel particles from mouse
  document.addEventListener('mousemove', e => {
    particles.forEach(p => {
      const dx = p.x - e.clientX, dy = p.y - e.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        p.vx += (dx / dist) * 0.5;
        p.vy += (dy / dist) * 0.5;
        const maxV = 2.5;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxV) { p.vx = (p.vx / speed) * maxV; p.vy = (p.vy / speed) * maxV; }
      }
    });
  });
})();


/* ══════════════════════════════════════════════════════
   NAVBAR  (scroll shadow)
   ══════════════════════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 24), {passive:true});
})();

/* ══════════════════════════════════════════════════════
   DEV MODE — TAB SYSTEM
   ══════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold:.1, rootMargin:'0px 0px -40px 0px' });

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width + '%';
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold:.5 });

function activateDevTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));

  const panel = document.getElementById('tab-' + tabId);
  if (panel) {
    panel.classList.add('active');
    window.scrollTo({ top:0, behavior:'smooth' });
    setTimeout(() => {
      panel.querySelectorAll('.reveal').forEach(el => { el.classList.remove('visible'); revealObserver.observe(el); });
      panel.querySelectorAll('.skill-fill').forEach(f => { f.style.width='0'; skillObserver.observe(f); });
    }, 50);
  }

  document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(el => {
    if (el.classList.contains('nav-tab')) el.classList.add('active');
  });
}

// Initial reveals
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.skill-fill').forEach(f => skillObserver.observe(f));

// Delegate [data-tab] clicks (Dev Mode)
document.addEventListener('click', e => {
  const trigger = e.target.closest('[data-tab]');
  if (!trigger || trigger.closest('.mode-toggle')) return;
  const tabId = trigger.dataset.tab;
  if (tabId) activateDevTab(tabId);
});

/* ══════════════════════════════════════════════════════
   MOBILE DRAWER
   ══════════════════════════════════════════════════════ */
(function initDrawer() {
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('drawer');
  const overlay   = document.getElementById('drawerOverlay');
  const closeBtn  = document.getElementById('drawerClose');

  function open() {
    drawer.classList.add('open'); overlay.classList.add('open');
    overlay.removeAttribute('aria-hidden');
    hamburger.classList.add('open'); hamburger.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    drawer.classList.remove('open'); overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key==='Escape') close(); });
  document.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
})();

/* ══════════════════════════════════════════════════════
   TYPING EFFECT  (Dev Mode hero)
   ══════════════════════════════════════════════════════ */
(function initTyping() {
  const el = document.getElementById('typeText');
  if (!el) return;
  const words = ['beautiful UIs.', 'real systems.', 'things that help people.', 'clean code.'];
  let w=0, i=0, del=false;
  function loop() {
    el.textContent = words[w].slice(0, i);
    if (!del) { i++; if (i > words[w].length) { del=true; setTimeout(loop,1100); return; } }
    else { i--; if (i===0) { del=false; w=(w+1)%words.length; } }
    setTimeout(loop, del ? 38 : 52);
  }
  loop();
})();

/* ══════════════════════════════════════════════════════
   3D DEPTH EFFECT  (Dev Mode Casual Photo)
   ══════════════════════════════════════════════════════ */
(function initDepthEffect() {
  const scene = document.getElementById('depthScene');
  const photo = document.getElementById('depthPhoto');
  if (!scene) return;

  scene.addEventListener('mousemove', e => {
    const rect = scene.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    scene.style.transform = `perspective(600px) rotateX(${y * -10}deg) rotateY(${x * 10}deg)`;
    if (photo) photo.style.transform = `translateZ(20px) scale(1.02) translate(${x * -8}px, ${y * -8}px)`;
  });

  scene.addEventListener('mouseleave', () => {
    scene.style.transform = 'perspective(600px) rotateX(0) rotateY(0)';
    if (photo) photo.style.transform = '';
  });
})();

/* ══════════════════════════════════════════════════════
   RUN CODE — Python Skills Trick
   ══════════════════════════════════════════════════════ */
(function initRunCode() {
  const btn      = document.getElementById('runCodeBtn');
  const label    = document.getElementById('runCodeLabel');
  const terminal = document.getElementById('rcaTerminal');
  const termBody = document.getElementById('rcaTermBody');
  const grid     = document.getElementById('skillsGrid');
  if (!btn || !terminal || !grid) return;

  const SKILLS = [
    { name: 'HTML',       pct: 90 },
    { name: 'CSS',        pct: 80 },
    { name: 'JavaScript', pct: 70 },
    { name: 'PHP',        pct: 80 },
    { name: 'MySQL',      pct: 70 },
    { name: 'C++',        pct: 30 },
    { name: 'Python',     pct: 70 },
  ];

  let hasRun = false;

  function bar(pct) {
    const filled = Math.round(pct / 10);
    return '█'.repeat(filled) + '░'.repeat(10 - filled);
  }

  function addLine(html, cls, delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        const span = document.createElement('span');
        span.className = 'rca-line ' + (cls || '');
        span.innerHTML = html;
        termBody.appendChild(span);
        termBody.scrollTop = termBody.scrollHeight;
        resolve();
      }, delay);
    });
  }

  function unlockSkill(item, pct, delay) {
    setTimeout(() => {
      item.classList.remove('skill-locked');
      item.classList.add('skill-unlocked');
      // Update pct label
      const pctEl = item.querySelector('.skill-pct');
      if (pctEl) pctEl.textContent = pct + '%';
      // Animate fill bar
      const fill = item.querySelector('.skill-fill');
      if (fill) {
        fill.style.transition = 'width 1s cubic-bezier(0.22,1,0.36,1)';
        fill.style.width = pct + '%';
      }
    }, delay);
  }

  btn.addEventListener('click', () => {
    if (hasRun) return; // prevent double-run
    hasRun = true;

    // ── Button: Running state
    btn.classList.add('rca-running');
    btn.disabled = true;
    label.textContent = '⏳ Running...';

    // ── Show terminal
    terminal.removeAttribute('hidden');
    termBody.innerHTML = '';

    // ── Sequence of terminal lines
    const lines = [
      { html: '<span class="rca-prompt">$</span> python skills_analyzer.py', cls: '', t: 200 },
      { html: '→ Loading skill dataset...', cls: 'rca-output', t: 700 },
      { html: `→ Found ${SKILLS.length} languages.`, cls: 'rca-output', t: 1200 },
      { html: '→ Computing proficiency scores...', cls: 'rca-output', t: 1700 },
    ];

    // Per-skill output lines
    SKILLS.forEach((s, i) => {
      lines.push({
        html: `<span style="color:rgba(255,255,255,.4)">  ${s.name.padEnd(13, '\u00a0')}</span><span class="rca-result">[${bar(s.pct)}] ${s.pct}%</span>`,
        cls: '',
        t: 2300 + i * 260,
      });
    });

    const doneT = 2300 + SKILLS.length * 260 + 200;
    lines.push({ html: '✅ Analysis complete! Rendering visuals...', cls: 'rca-success', t: doneT });

    // Fire all lines
    lines.forEach(l => addLine(l.html, l.cls, l.t));

    // ── Unlock skill bars staggered, after per-skill lines
    const skillItems = grid.querySelectorAll('.skill-item');
    SKILLS.forEach((s, i) => {
      const item = skillItems[i];
      if (item) unlockSkill(item, s.pct, 2300 + i * 260 + 120);
    });

    // ── Button done state
    setTimeout(() => {
      btn.classList.remove('rca-running');
      btn.classList.add('rca-done');
      label.textContent = '✓ Done';
    }, doneT + 400);
  });
})();

/* ══════════════════════════════════════════════════════
   TILT EFFECT (About Cards)
   ══════════════════════════════════════════════════════ */
(function initTilts() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    const shine = card.querySelector('.card-shine');
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.05s linear';
    });
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const cx = r.width/2, cy = r.height/2;
      card.style.transform = `perspective(700px) rotateX(${((y-cy)/cy)*-5}deg) rotateY(${((x-cx)/cx)*5}deg) scale(1.02)`;
      if (shine) shine.style.background = `radial-gradient(circle at ${(x/r.width*100).toFixed(0)}% ${(y/r.height*100).toFixed(0)}%, rgba(255,255,255,.15), transparent 55%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)';
      card.style.transform = '';
      if (shine) shine.style.background = '';
    });
  });
})();

/* ══════════════════════════════════════════════════════
   CONTACT FORMS
   ══════════════════════════════════════════════════════ */
function setupForm(formId, noteId) {
  const form = document.getElementById(formId);
  const note = document.getElementById(noteId);
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = (form.querySelector('input[type=text]') || {}).value?.trim() || '';
    note.style.color = 'rgba(16,185,129,.9)';
    note.textContent = `✅ Thanks${name ? ', '+name : ''}! Message received. (Connect Formspree for real delivery.)`;
    setTimeout(() => { form.reset(); note.textContent = ''; }, 5000);
  });
}
setupForm('devContactForm',    'devFormNote');
setupForm('simpleContactForm', 'simpleFormNote');

/* ══════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════ */
ModeManager.init();

// Initial air reveals for default active s-tab
document.querySelectorAll('#stab-home .s-reveal').forEach(el => airRevealObserver.observe(el));

/* ══════════════════════════════════════════════════════
   GDG STORIES — Instagram-style cycling images
   ══════════════════════════════════════════════════════ */
(function initGDGStories() {
  const STORY_COUNT   = 5;
  const STORY_DUR_MS  = 6000; // 6 seconds per story (slower rotation)
  const EMOJIS        = ['❤️','🧡','💛','💚','💙','💜','🤍','💖','💗','💘'];

  let currentStory  = 0;
  let storyTimer    = null;
  let isRunning     = false;

  const imgWrap     = document.getElementById('gdgStoriesImgWrap');
  const floodEl     = document.getElementById('gdgHeartFlood');
  if (!imgWrap || !floodEl) return;

  function getStoryImg(i)  { return document.getElementById('gdgStory' + i); }
  function getStorySeg(i)  { return document.getElementById('gdgSeg' + i);   }
  function getStoryFill(i) { return document.getElementById('gdgFill' + i);  }

  function showStory(idx) {
    currentStory = (idx + STORY_COUNT) % STORY_COUNT;

    // Update image visibility
    for (let i = 0; i < STORY_COUNT; i++) {
      const img = getStoryImg(i);
      if (img) img.classList.toggle('active', i === currentStory);
    }

    // Update progress segments
    for (let i = 0; i < STORY_COUNT; i++) {
      const seg  = getStorySeg(i);
      const fill = getStoryFill(i);
      if (!seg || !fill) continue;

      seg.classList.remove('active', 'done');
      fill.style.animation = 'none';
      // Force reflow so animation restarts
      void fill.offsetWidth;

      if (i < currentStory) {
        seg.classList.add('done');
      } else if (i === currentStory) {
        seg.style.setProperty('--story-dur', (STORY_DUR_MS / 1000) + 's');
        seg.classList.add('active');
        fill.style.animation = '';
      }
    }

    // Auto advance
    clearTimeout(storyTimer);
    storyTimer = setTimeout(() => {
      showStory(currentStory + 1);
    }, STORY_DUR_MS);
  }

  /* ── Hearts flood on click ── */
  function spawnHeartFlood() {
    const count = 28;
    for (let i = 0; i < count; i++) {
      const emoji = document.createElement('span');
      emoji.className = 'flood-emoji';
      const em = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      emoji.textContent = em;

      // Random horizontal position inside the wrap
      const leftPct = 5 + Math.random() * 90;
      emoji.style.left = leftPct + '%';

      // Slight random rotation
      const rot = (Math.random() - 0.5) * 40;
      emoji.style.setProperty('--rot', rot + 'deg');

      // Stagger delay
      const delay = (Math.random() * 0.6).toFixed(2);
      emoji.style.setProperty('--delay', delay + 's');

      // Random duration
      const dur = (0.9 + Math.random() * 0.7).toFixed(2);
      emoji.style.setProperty('--dur', dur + 's');

      // Size variation
      const size = 16 + Math.floor(Math.random() * 14);
      emoji.style.fontSize = size + 'px';

      floodEl.appendChild(emoji);

      // Remove after animation
      const totalMs = (parseFloat(delay) + parseFloat(dur)) * 1000 + 200;
      setTimeout(() => emoji.remove(), totalMs);
    }
  }

  imgWrap.addEventListener('click', () => {
    spawnHeartFlood();
  });

  // Start the stories loop
  showStory(0);
})();