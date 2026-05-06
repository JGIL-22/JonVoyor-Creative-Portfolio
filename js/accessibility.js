/* ═══════════════════════════════════════════════════════════════
   ACCESSIBILITY WIDGET
   Key fixes:
   - Filters applied to #acc-filter-wrap (NOT body) so position:fixed
     elements (FAB, panel, toast, cursors) are never broken
   - Text control labelled "Zoom" and uses CSS zoom property
   - Panel is truly fixed — immune to any page scroll or filter
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. CSS ─────────────────────────────────────────────── */
  document.head.insertAdjacentHTML('beforeend', `<style>
    /* Filter target — wraps page content, NOT body */
    #acc-filter-wrap { transition: filter .25s ease; }

    /* FAB */
    #acc-fab {
      position: fixed !important;
      bottom: 28px !important; left: 28px !important;
      width: 54px; height: 54px;
      background: #0d47a1; color: #fff;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; cursor: pointer;
      z-index: 2147483647;
      box-shadow: 0 4px 18px rgba(0,0,0,.4);
      border: 2px solid rgba(255,255,255,.25);
      transition: transform .2s ease, box-shadow .2s ease;
    }
    #acc-fab:hover { transform: scale(1.08); box-shadow: 0 6px 26px rgba(0,0,0,.5); }

    /* Panel */
    #acc-menu {
      position: fixed !important;
      bottom: 94px !important; left: 28px !important;
      width: 320px;
      max-height: calc(100vh - 120px);
      overflow-y: auto; overscroll-behavior: contain;
      background: #fff; border-radius: 18px;
      box-shadow: 0 12px 48px rgba(0,0,0,.22), 0 2px 8px rgba(0,0,0,.08);
      padding: 18px;
      display: none;
      z-index: 2147483647;
      font-family: 'Segoe UI', system-ui, sans-serif;
      border: 1px solid #e0e0e0;
    }
    #acc-menu.open {
      display: block;
      animation: _accPop .25s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes _accPop {
      from { opacity:0; transform:translateY(10px) scale(.97); }
      to   { opacity:1; transform:translateY(0)    scale(1);   }
    }

    /* Header */
    .acc-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid #eee; }
    .acc-header h4 { margin:0; font-size:14px; font-weight:700; color:#1a1a2e; }
    .acc-close { width:28px; height:28px; border-radius:50%; background:#f0f0f0; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:16px; color:#555; line-height:1; transition:background .2s; }
    .acc-close:hover { background:#ddd; color:#111; }

    /* Zoom row */
    .acc-zoomrow { display:flex; align-items:center; gap:8px; background:#f8f9fa; border-radius:10px; padding:8px 12px; margin-bottom:12px; }
    .acc-zoomrow label { font-size:12px; font-weight:600; color:#444; flex:1; display:flex; align-items:center; gap:6px; }
    .acc-zoomrow label i { font-size:14px; color:#0d47a1; }
    .acc-sz-btns { display:flex; align-items:center; gap:6px; }
    .acc-sz-btn { width:34px; height:34px; border-radius:8px; border:1.5px solid #ddd; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:13px; color:#333; font-weight:700; transition:all .18s; font-family:inherit; }
    .acc-sz-btn:hover:not(:disabled) { background:#0d47a1; color:#fff; border-color:#0d47a1; }
    .acc-sz-btn:disabled { opacity:.35; cursor:not-allowed; }
    .acc-zoom-val { font-size:12px; font-weight:700; color:#0d47a1; min-width:36px; text-align:center; }

    /* Grid */
    .acc-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
    .acc-btn { background:#f8f9fa; border:2px solid transparent; border-radius:10px; padding:10px 8px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; height:80px; box-sizing:border-box; color:#333; gap:6px; text-align:center; transition:background .18s, border-color .18s, color .18s; }
    .acc-btn i { font-size:20px; color:#555; transition:color .18s; }
    .acc-btn span { font-size:11px; font-weight:600; line-height:1.25; }
    .acc-btn:hover { background:#e9ecef; border-color:#bbb; }
    .acc-btn.on { background:#e3f2fd; border-color:#0d47a1; color:#0d47a1; }
    .acc-btn.on i { color:#0d47a1; }

    /* Reset */
    .acc-reset { width:100%; margin-top:12px; padding:10px; background:#6c757d; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:600; font-size:13px; transition:background .18s; font-family:inherit; }
    .acc-reset:hover { background:#495057; }

    /* Reading guide — also fixed, outside filter wrap */
    #acc-guide-line { position:fixed; left:0; width:100%; height:24px; background:rgba(255,230,0,.38); border-top:2px solid #e60; border-bottom:2px solid #e60; pointer-events:none; z-index:2147483646; display:none; }

    /* Feature classes — on wrapper, never body */
    #acc-filter-wrap.acc-grayscale { filter: grayscale(100%); }
    #acc-filter-wrap.acc-invert    { filter: invert(100%); }
    #acc-filter-wrap.acc-hi-con    { filter: contrast(160%) brightness(.9); }
    #acc-filter-wrap.acc-cb-prot   { filter: url('#_acc_prot');  }
    #acc-filter-wrap.acc-cb-deut   { filter: url('#_acc_deut');  }
    #acc-filter-wrap.acc-cb-trit   { filter: url('#_acc_trit');  }

    /* Dyslexia + links + cursor still on body (no filter involved) */
    body.acc-dyslexia * { font-family:'Comic Sans MS','Verdana',sans-serif !important; letter-spacing:.04em !important; }
    body.acc-highlight-links a { background:#ff0 !important; color:#000 !important; text-decoration:underline !important; outline:2px solid #e60 !important; font-weight:bold !important; }
    body.acc-big-cursor, body.acc-big-cursor * { cursor:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='black'><path d='M7 2l12 11.2-5.8.5 3.3 7.3-2.2.9-3.2-7.4-4.4 4.6z'/></svg>") 0 0,auto !important; }
    .acc-sr-hl { outline:3px solid #f90 !important; background:rgba(255,153,0,.15) !important; border-radius:3px; }
  </style>`);

  /* ── 2. HTML ─────────────────────────────────────────────── */
  document.body.insertAdjacentHTML('beforeend', `
    <div id="acc-fab" role="button" tabindex="0" aria-label="Open Accessibility Menu" title="Accessibility">
      <i class="fas fa-universal-access"></i>
    </div>

    <div id="acc-menu" role="dialog" aria-label="Accessibility Options" aria-modal="true">
      <div class="acc-header">
        <h4><i class="fas fa-universal-access" style="margin-right:6px;color:#0d47a1"></i>Accessibility</h4>
        <div class="acc-close" id="acc-close-btn" role="button" tabindex="0" aria-label="Close">&times;</div>
      </div>

      <div class="acc-zoomrow">
        <label><i class="fas fa-magnifying-glass"></i> Zoom</label>
        <div class="acc-sz-btns">
          <button class="acc-sz-btn" id="acc-sz-down" aria-label="Zoom out">−</button>
          <span class="acc-zoom-val" id="acc-zoom-val">100%</span>
          <button class="acc-sz-btn" id="acc-sz-up" aria-label="Zoom in">+</button>
        </div>
      </div>

      <div class="acc-grid">
        <div class="acc-btn" id="btn-grayscale"  tabindex="0" role="button" aria-pressed="false"><i class="fas fa-adjust"></i><span>Grayscale</span></div>
        <div class="acc-btn" id="btn-contrast"   tabindex="0" role="button" aria-pressed="false"><i class="fas fa-circle-half-stroke"></i><span>High Contrast</span></div>
        <div class="acc-btn" id="btn-invert"     tabindex="0" role="button" aria-pressed="false"><i class="fas fa-lightbulb"></i><span>Invert Colors</span></div>
        <div class="acc-btn" id="btn-dyslexia"   tabindex="0" role="button" aria-pressed="false"><i class="fas fa-font"></i><span>Dyslexia Font</span></div>
        <div class="acc-btn" id="btn-colorblind" tabindex="0" role="button" aria-pressed="false"><i class="fas fa-palette"></i><span id="txt-cb">Color Blind</span></div>
        <div class="acc-btn" id="btn-speech"     tabindex="0" role="button" aria-pressed="false"><i class="fas fa-volume-up"></i><span>Text to Speech</span></div>
        <div class="acc-btn" id="btn-links"      tabindex="0" role="button" aria-pressed="false"><i class="fas fa-link"></i><span>Highlight Links</span></div>
        <div class="acc-btn" id="btn-cursor"     tabindex="0" role="button" aria-pressed="false"><i class="fas fa-mouse-pointer"></i><span>Big Cursor</span></div>
        <div class="acc-btn" id="btn-guide"      tabindex="0" role="button" aria-pressed="false"><i class="fas fa-ruler-horizontal"></i><span>Reading Guide</span></div>
      </div>
      <button class="acc-reset" id="acc-reset-btn">↺ Reset All Settings</button>
    </div>

    <div id="acc-guide-line" aria-hidden="true"></div>

    <svg style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
      <defs>
        <filter id="_acc_prot"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/></filter>
        <filter id="_acc_deut"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/></filter>
        <filter id="_acc_trit"><feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/></filter>
      </defs>
    </svg>
  `);

  /* ── 3. STATE ────────────────────────────────────────────── */
  const WRAP = document.getElementById('acc-filter-wrap');
  const STEP = 10, MIN = 80, MAX = 150;
  let zoom = 100;

  // Filter features → applied to WRAP (no fixed-position breakage)
  const FW = {
    grayscale: { cls:'acc-grayscale', btn:'btn-grayscale', on:false },
    contrast:  { cls:'acc-hi-con',   btn:'btn-contrast',  on:false },
    invert:    { cls:'acc-invert',   btn:'btn-invert',    on:false },
  };
  const CB_CLS  = ['','acc-cb-prot','acc-cb-deut','acc-cb-trit'];
  const CB_LBLS = ['Color Blind','Protanopia','Deuteranopia','Tritanopia'];
  let cbIdx = 0;

  // Non-filter features → safe to put on body
  const FB = {
    dyslexia: { cls:'acc-dyslexia',       btn:'btn-dyslexia', on:false },
    links:    { cls:'acc-highlight-links', btn:'btn-links',    on:false },
    cursor:   { cls:'acc-big-cursor',      btn:'btn-cursor',   on:false },
  };

  let guideOn=false, srOn=false, menuOpen=false;
  const $ = id => document.getElementById(id);

  /* ── 4. ZOOM (CSS zoom — scales whole viewport content) ── */
  function applyZoom() {
    // CSS zoom scales the rendered page without affecting layout geometry
    WRAP.style.zoom = (zoom / 100);
    const el = $('acc-zoom-val');
    if (el) el.textContent = zoom + '%';
    $('acc-sz-up').disabled   = zoom >= MAX;
    $('acc-sz-down').disabled = zoom <= MIN;
    save();
  }

  $('acc-sz-up').addEventListener('click', () => {
    if (zoom < MAX) { zoom = Math.min(MAX, zoom + STEP); applyZoom(); }
  });
  $('acc-sz-down').addEventListener('click', () => {
    if (zoom > MIN) { zoom = Math.max(MIN, zoom - STEP); applyZoom(); }
  });

  /* ── 5. HELPERS ─────────────────────────────────────────── */
  function setBtn(id, on) {
    const el = $(id);
    if (!el) return;
    el.classList.toggle('on', on);
    el.setAttribute('aria-pressed', String(on));
  }

  // Toggle filter feature on WRAP
  function toggleFW(key) {
    const f = FW[key];
    f.on = !f.on;
    WRAP.classList.toggle(f.cls, f.on);
    // mutual exclusion
    if (key === 'contrast' && f.on) {
      ['grayscale','invert'].forEach(k => { FW[k].on=false; WRAP.classList.remove(FW[k].cls); setBtn(FW[k].btn,false); });
    }
    if (key === 'grayscale' && f.on) { FW.contrast.on=false; WRAP.classList.remove(FW.contrast.cls); setBtn(FW.contrast.btn,false); }
    if (key === 'invert'    && f.on) { FW.contrast.on=false; WRAP.classList.remove(FW.contrast.cls); setBtn(FW.contrast.btn,false); }
    setBtn(f.btn, f.on);
    save();
  }

  // Toggle body feature (no filter)
  function toggleFB(key) {
    const f = FB[key];
    f.on = !f.on;
    document.body.classList.toggle(f.cls, f.on);
    setBtn(f.btn, f.on);
    save();
  }

  function cycleCB() {
    if (cbIdx > 0) WRAP.classList.remove(CB_CLS[cbIdx]);
    cbIdx = (cbIdx + 1) % CB_CLS.length;
    if (cbIdx > 0) WRAP.classList.add(CB_CLS[cbIdx]);
    const lbl = $('txt-cb');
    if (lbl) lbl.textContent = CB_LBLS[cbIdx];
    setBtn('btn-colorblind', cbIdx > 0);
    save();
  }

  /* ── 6. MENU ─────────────────────────────────────────────── */
  function openMenu()  { menuOpen=true;  $('acc-menu').classList.add('open');    $('acc-close-btn').focus(); }
  function closeMenu() { menuOpen=false; $('acc-menu').classList.remove('open'); $('acc-fab').focus(); }
  function toggleMenu() { menuOpen ? closeMenu() : openMenu(); }

  $('acc-fab').addEventListener('click', toggleMenu);
  $('acc-fab').addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleMenu();} });
  $('acc-close-btn').addEventListener('click', closeMenu);
  $('acc-close-btn').addEventListener('keydown', e => { if(e.key==='Enter')closeMenu(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape'&&menuOpen)closeMenu(); });
  document.addEventListener('click', e => {
    if(!menuOpen) return;
    if(!$('acc-menu').contains(e.target)&&!$('acc-fab').contains(e.target)) closeMenu();
  });

  /* ── 7. WIRE BUTTONS ────────────────────────────────────── */
  const wire = (id, fn) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener('click', fn);
    el.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();} });
  };

  wire('btn-grayscale',  () => toggleFW('grayscale'));
  wire('btn-contrast',   () => toggleFW('contrast'));
  wire('btn-invert',     () => toggleFW('invert'));
  wire('btn-dyslexia',   () => toggleFB('dyslexia'));
  wire('btn-links',      () => toggleFB('links'));
  wire('btn-cursor',     () => toggleFB('cursor'));
  wire('btn-colorblind', () => cycleCB());

  /* ── 8. READING GUIDE ───────────────────────────────────── */
  function moveGuide(e) {
    const l = $('acc-guide-line');
    if (l) l.style.top = (e.clientY - 12) + 'px';
  }
  function toggleGuide() {
    guideOn = !guideOn;
    $('acc-guide-line').style.display = guideOn ? 'block' : 'none';
    setBtn('btn-guide', guideOn);
    guideOn
      ? document.addEventListener('mousemove', moveGuide, {passive:true})
      : document.removeEventListener('mousemove', moveGuide);
    save();
  }
  wire('btn-guide', toggleGuide);

  /* ── 9. TEXT TO SPEECH ──────────────────────────────────── */
  const synth = window.speechSynthesis;
  function speak(txt) {
    if(!srOn||!txt?.trim()) return;
    synth.cancel();
    synth.speak(Object.assign(new SpeechSynthesisUtterance(txt.trim().slice(0,250)),{rate:1}));
  }
  function toggleSR() {
    srOn = !srOn;
    setBtn('btn-speech', srOn);
    if(srOn) speak('Screen reader activated. Hover over text to hear it.');
    else synth.cancel();
    save();
  }
  document.addEventListener('mouseover', e => {
    if(!srOn) return;
    const t = e.target;
    if(t.closest('#acc-menu')||t.closest('#acc-fab')) return;
    if(['P','H1','H2','H3','H4','H5','H6','A','BUTTON','LABEL','SPAN','LI'].includes(t.tagName)&&t.innerText?.trim()){
      speak(t.innerText);
      t.classList.add('acc-sr-hl');
      const rm = () => { t.classList.remove('acc-sr-hl'); t.removeEventListener('mouseout',rm); };
      t.addEventListener('mouseout', rm);
    }
  });
  wire('btn-speech', toggleSR);

  /* ── 10. RESET ──────────────────────────────────────────── */
  $('acc-reset-btn').addEventListener('click', () => {
    localStorage.removeItem('acc_v2');
    location.reload();
  });

  /* ── 11. PERSIST ────────────────────────────────────────── */
  function save() {
    try {
      localStorage.setItem('acc_v2', JSON.stringify({
        zoom,
        fw: Object.fromEntries(Object.entries(FW).map(([k,v])=>[k,v.on])),
        fb: Object.fromEntries(Object.entries(FB).map(([k,v])=>[k,v.on])),
        cbIdx, guideOn, srOn
      }));
    } catch(_) {}
  }

  function load() {
    let s;
    try { s = JSON.parse(localStorage.getItem('acc_v2')); } catch(_) {}
    if (!s) return;
    if (s.zoom && s.zoom !== 100) { zoom = Math.min(MAX, Math.max(MIN, s.zoom)); }
    if (s.fw) Object.keys(FW).forEach(k => { if(s.fw[k]){ FW[k].on=true; WRAP.classList.add(FW[k].cls); setBtn(FW[k].btn,true); } });
    if (s.fb) Object.keys(FB).forEach(k => { if(s.fb[k]){ FB[k].on=true; document.body.classList.add(FB[k].cls); setBtn(FB[k].btn,true); } });
    if (s.cbIdx > 0) { for(let i=0;i<s.cbIdx;i++) cycleCB(); }
    if (s.guideOn) toggleGuide();
    if (s.srOn) toggleSR();
  }

  load();
  applyZoom();
});
