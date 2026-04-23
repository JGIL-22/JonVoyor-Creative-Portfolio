document.addEventListener("DOMContentLoaded", function () {
    console.log("Accessibility Script Loaded - Fixed Position Version");

    // ============================================================
    // 0. INJECT CSS (LOCKED POSITION & STABILITY)
    // ============================================================
    const accStyle = `
        /* --- FAB BUTTON (LOCKED BOTTOM LEFT) --- */
        #acc-fab {
            position: fixed !important; /* Force stay on screen */
            bottom: 30px !important;
            left: 30px !important;
            width: 60px;
            height: 60px;
            background: #0d47a1;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            cursor: pointer;
            z-index: 2147483647; /* Maximum Z-Index to stay on top of everything */
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 2px solid white;
            transition: transform 0.2s;
            transform: translateZ(0); /* Prevents jitter on scroll */
        }
        #acc-fab:hover { transform: scale(1.1); }

        /* --- MENU PANEL (LOCKED ABOVE BUTTON) --- */
        #acc-menu {
            position: fixed !important; /* Force stay on screen */
            bottom: 100px !important;   /* Always 100px from bottom of SCREEN */
            left: 30px !important;      /* Always 30px from left of SCREEN */
            width: 340px;
            max-height: 70vh;           /* Prevent overflowing small screens */
            overflow-y: auto;           /* Scroll inside menu if needed */
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.25);
            padding: 20px;
            display: none;
            z-index: 2147483647; /* Maximum Z-Index */
            font-family: 'Segoe UI', sans-serif;
            border: 1px solid #e0e0e0;
            transform: translateZ(0); /* Prevents jitter on scroll */
        }
        
        #acc-menu.active { display: block; animation: accFadeUp 0.3s ease; }
        @keyframes accFadeUp { from {opacity:0; transform:translateY(10px);} to {opacity:1; transform:translateY(0);} }

        /* --- HEADER --- */
        .acc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .acc-header h4 { margin: 0; font-weight: 700; color: #333; }
        .acc-close { font-size: 24px; cursor: pointer; color: #666; }

        /* --- GRID LAYOUT (STABLE) --- */
        .acc-grid {
            display: grid;
            grid-template-columns: 1fr 1fr; /* 2 Columns strict */
            gap: 12px;
        }

        /* --- BUTTONS (NO JUMPING) --- */
        .acc-btn {
            background: #f8f9fa;
            border: 2px solid transparent; /* STABILITY: Pre-reserve border space */
            border-radius: 12px;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 90px; /* STABILITY: Fixed height */
            box-sizing: border-box; /* STABILITY: Padding doesn't affect width */
            color: #333;
        }

        .acc-btn i { font-size: 24px; margin-bottom: 8px; color: #555; }
        .acc-btn span { font-size: 12px; font-weight: 500; line-height: 1.2; }

        .acc-btn:hover { background: #e9ecef; }

        /* ACTIVE STATE (Visual Only, No Size Change) */
        .acc-btn.active-feature {
            background: #e3f2fd;
            border-color: #0d47a1; /* Only color changes */
            color: #0d47a1;
        }
        .acc-btn.active-feature i { color: #0d47a1; }

        /* --- RESET BUTTON --- */
        .acc-reset {
            width: 100%;
            margin-top: 15px;
            padding: 12px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        }
        .acc-reset:hover { background: #5a6268; }

        /* --- READING GUIDE --- */
        #acc-reading-guide {
            position: fixed;
            left: 0;
            width: 100%;
            height: 25px;
            background: rgba(255, 255, 0, 0.4);
            border-top: 2px solid red;
            border-bottom: 2px solid red;
            pointer-events: none;
            z-index: 2147483647;
            display: none;
        }

        /* --- MODE CLASSES --- */
        .acc-grayscale { filter: grayscale(100%); }
        .acc-invert { filter: invert(100%); }
        .acc-high-contrast { filter: contrast(150%); background-color: black !important; color: yellow !important; }
        .acc-high-contrast * { background-color: black !important; color: yellow !important; border-color: yellow !important; }
        .acc-dyslexia * { font-family: 'Comic Sans MS', 'Verdana', sans-serif !important; letter-spacing: 0.5px; }
        .acc-big-cursor, .acc-big-cursor * { cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="black"><path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2.9-3.2-7.4-4.4 4.6z"/></svg>'), auto !important; }
        
        .acc-highlight-links a { background: yellow !important; color: black !important; text-decoration: underline !important; font-weight: bold; }
        
        /* Color Blindness Filters */
        .acc-cb-protanopia { filter: url('#protanopia'); }
        .acc-cb-deuteranopia { filter: url('#deuteranopia'); }
        .acc-cb-tritanopia { filter: url('#tritanopia'); }
        
        /* Screen Reader Highlight */
        .speaking-highlight { outline: 3px solid #ff9800 !important; background-color: rgba(255, 152, 0, 0.2) !important; }
    `;

    // 1. Inject CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = accStyle;
    document.head.appendChild(styleSheet);

    // 2. Inject HTML (Appended to BODY to ensure Fixed Position works)
    const widgetHTML = `
        <div id="acc-fab" onclick="toggleAccMenu()" title="Accessibility Menu">
            <i class="fas fa-universal-access"></i>
        </div>

        <div id="acc-menu">
            <div class="acc-header">
                <h4>Accessibility Menu</h4>
                <div class="acc-close" onclick="toggleAccMenu()">&times;</div>
            </div>
            
            <div class="acc-grid">
                <div class="acc-btn" onclick="resizeText(1)">
                    <i class="fas fa-search-plus"></i>
                    <span>Bigger Text</span>
                </div>
                <div class="acc-btn" onclick="resizeText(-1)">
                    <i class="fas fa-search-minus"></i>
                    <span>Smaller Text</span>
                </div>

                <div class="acc-btn" id="btn-grayscale" onclick="toggleFeature('acc-grayscale')">
                    <i class="fas fa-adjust"></i>
                    <span>Grayscale</span>
                </div>
                <div class="acc-btn" id="btn-contrast" onclick="toggleFeature('acc-high-contrast')">
                    <i class="fas fa-circle-half-stroke"></i>
                    <span>High Contrast</span>
                </div>
                <div class="acc-btn" id="btn-invert" onclick="toggleFeature('acc-invert')">
                    <i class="fas fa-lightbulb"></i>
                    <span>Invert Colors</span>
                </div>
                <div class="acc-btn" id="btn-dyslexia" onclick="toggleFeature('acc-dyslexia')">
                    <i class="fas fa-font"></i>
                    <span>Dyslexia Font</span>
                </div>

                <div class="acc-btn" id="btn-colorblind" onclick="cycleColorBlindness()">
                    <i class="fas fa-palette"></i>
                    <span id="txt-colorblind">Color Blindness</span>
                </div>

                <div class="acc-btn" id="btn-speech" onclick="toggleScreenReader()">
                    <i class="fas fa-volume-up"></i>
                    <span>Text to Speech</span>
                </div>

                <div class="acc-btn" id="btn-links" onclick="toggleFeature('acc-highlight-links')">
                    <i class="fas fa-link"></i>
                    <span>Highlight Links</span>
                </div>
                <div class="acc-btn" id="btn-cursor" onclick="toggleFeature('acc-big-cursor')">
                    <i class="fas fa-mouse-pointer"></i>
                    <span>Big Cursor</span>
                </div>
                <div class="acc-btn" id="btn-guide" onclick="toggleReadingGuide()">
                    <i class="fas fa-ruler-horizontal"></i>
                    <span>Reading Guide</span>
                </div>
            </div>

            <button class="acc-reset" onclick="resetAccessibility()">Reset All Settings</button>
        </div>

        <div id="acc-reading-guide"></div>

        <svg style="display: none;">
            <defs>
                <filter id="protanopia">
                    <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
                </filter>
                <filter id="deuteranopia">
                    <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
                </filter>
                <filter id="tritanopia">
                    <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
                </filter>
            </defs>
        </svg>
    `;

    // Ensure we append to body to respect position:fixed
    document.body.insertAdjacentHTML('beforeend', widgetHTML);
    loadAccSettings();
});

// === LOGIC FUNCTIONS ===

function toggleAccMenu() {
    document.getElementById('acc-menu').classList.toggle('active');
}

// 1. Text Resizer
let currentZoom = 100;
function resizeText(dir) {
    if (dir === 1) currentZoom += 10;
    if (dir === -1) currentZoom -= 10;
    if (currentZoom < 80) currentZoom = 80;
    if (currentZoom > 150) currentZoom = 150;
    
    document.documentElement.style.fontSize = currentZoom + '%';
    localStorage.setItem('acc_zoom', currentZoom);
}

// 2. Feature Toggler
function toggleFeature(className) {
    document.body.classList.toggle(className);
    
    const btnId = getBtnId(className);
    if(btnId) {
        const btn = document.getElementById(btnId);
        if(btn) btn.classList.toggle('active-feature');
    }

    if (className === 'acc-high-contrast' && document.body.classList.contains('acc-high-contrast')) {
        document.body.classList.remove('acc-grayscale');
        document.body.classList.remove('acc-invert');
        document.getElementById('btn-grayscale').classList.remove('active-feature');
        document.getElementById('btn-invert').classList.remove('active-feature');
    }
    saveAccSettings();
}

function getBtnId(cls) {
    if(cls === 'acc-grayscale') return 'btn-grayscale';
    if(cls === 'acc-high-contrast') return 'btn-contrast';
    if(cls === 'acc-invert') return 'btn-invert';
    if(cls === 'acc-dyslexia') return 'btn-dyslexia';
    if(cls === 'acc-highlight-links') return 'btn-links';
    if(cls === 'acc-big-cursor') return 'btn-cursor';
    return null;
}

// 3. Color Blindness Cycler
const cbModes = ['', 'acc-cb-protanopia', 'acc-cb-deuteranopia', 'acc-cb-tritanopia'];
const cbLabels = ['Color Blindness', 'Protanopia Mode', 'Deuteranopia Mode', 'Tritanopia Mode'];
let cbIndex = 0;

function cycleColorBlindness() {
    if(cbModes[cbIndex]) document.body.classList.remove(cbModes[cbIndex]);
    cbIndex = (cbIndex + 1) % cbModes.length;
    if(cbModes[cbIndex]) document.body.classList.add(cbModes[cbIndex]);

    document.getElementById('txt-colorblind').innerText = cbLabels[cbIndex];
    const btn = document.getElementById('btn-colorblind');
    
    if (cbIndex > 0) btn.classList.add('active-feature');
    else btn.classList.remove('active-feature');

    saveAccSettings();
}

// 4. SCREEN READER (UPDATED FOR KEYBOARD)
let screenReaderActive = false;
let synthesis = window.speechSynthesis;

function toggleScreenReader() {
    screenReaderActive = !screenReaderActive;
    const btn = document.getElementById('btn-speech');

    if (screenReaderActive) {
        document.body.classList.add('acc-screen-reader');
        btn.classList.add('active-feature');
        speakText("Screen Reader Activated. Use Tab key to navigate or hover over text.");
        
        // MAKE TEXT TABBABLE (Critical for Blind Users)
        makeTextTabbable(true);
    } else {
        document.body.classList.remove('acc-screen-reader');
        btn.classList.remove('active-feature');
        synthesis.cancel();
        
        // REMOVE TABBABILITY
        makeTextTabbable(false);
    }
    saveAccSettings();
}

// Helper: Adds tabindex="0" to text elements so Tab key stops on them
function makeTextTabbable(enable) {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, label');
    textElements.forEach(el => {
        if (enable) {
            // Only add if it's not already interactive
            if (!el.getAttribute('tabindex')) el.setAttribute('tabindex', '0');
        } else {
            // Only remove if we added it (basic check)
            if (el.getAttribute('tabindex') === '0') el.removeAttribute('tabindex');
        }
    });
}

function speakText(text) {
    if (!screenReaderActive) return;
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1; 
    synthesis.speak(utterance);
}

// EVENT 1: MOUSE HOVER (For Low Vision)
document.addEventListener('mouseover', function(e) {
    if (!screenReaderActive) return;
    handleReaderEvent(e.target);
});

// EVENT 2: KEYBOARD FOCUS (For Blind Users - TAB KEY)
document.addEventListener('focusin', function(e) {
    if (!screenReaderActive) return;
    handleReaderEvent(e.target);
});

// Shared Logic for Reading
function handleReaderEvent(target) {
    const validTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'BUTTON', 'LABEL', 'SPAN', 'LI', 'INPUT', 'SELECT'];
    
    // Skip if it's the widget itself (to prevent constant reading of the menu)
    if (target.closest('#acc-menu') || target.closest('#acc-fab')) return;

    if (target.tagName === 'INPUT' || target.tagName === 'SELECT') {
         // Read Input Placeholder or Label
         let text = "Input field. ";
         if (target.labels && target.labels.length > 0) text += target.labels[0].innerText;
         else text += (target.placeholder || "");
         speakText(text);
         return;
    }

    if (validTags.includes(target.tagName) && target.innerText.trim().length > 0) {
        speakText(target.innerText);
        
        // Visual Highlight
        target.classList.add('speaking-highlight');
        
        // Remove highlight on mouseout or blur (focus lost)
        const removeHighlight = () => {
            target.classList.remove('speaking-highlight');
            target.removeEventListener('mouseout', removeHighlight);
            target.removeEventListener('focusout', removeHighlight);
        };

        target.addEventListener('mouseout', removeHighlight);
        target.addEventListener('focusout', removeHighlight);
    }
}

// 5. Reading Guide
let guideActive = false;
function toggleReadingGuide() {
    guideActive = !guideActive;
    const guide = document.getElementById('acc-reading-guide');
    const btn = document.getElementById('btn-guide');

    if (guideActive) {
        guide.style.display = 'block';
        if(btn) btn.classList.add('active-feature');
        document.addEventListener('mousemove', moveGuide);
    } else {
        guide.style.display = 'none';
        if(btn) btn.classList.remove('active-feature');
        document.removeEventListener('mousemove', moveGuide);
    }
    saveAccSettings();
}

function moveGuide(e) {
    const guide = document.getElementById('acc-reading-guide');
    if(guide) guide.style.top = e.clientY + 'px';
}

// 6. Save/Load Settings
function saveAccSettings() {
    const settings = {
        grayscale: document.body.classList.contains('acc-grayscale'),
        contrast: document.body.classList.contains('acc-high-contrast'),
        invert: document.body.classList.contains('acc-invert'),
        dyslexia: document.body.classList.contains('acc-dyslexia'),
        links: document.body.classList.contains('acc-highlight-links'),
        cursor: document.body.classList.contains('acc-big-cursor'),
        guide: guideActive,
        cbIndex: cbIndex,
        screenReader: screenReaderActive
    };
    localStorage.setItem('acc_settings', JSON.stringify(settings));
}

function loadAccSettings() {
    const savedZoom = localStorage.getItem('acc_zoom');
    if (savedZoom) {
        currentZoom = parseInt(savedZoom);
        document.documentElement.style.fontSize = currentZoom + '%';
    }

    const saved = localStorage.getItem('acc_settings');
    if (!saved) return;

    const s = JSON.parse(saved);

    if(s.grayscale) toggleFeature('acc-grayscale');
    if(s.contrast) toggleFeature('acc-high-contrast');
    if(s.invert) toggleFeature('acc-invert');
    if(s.dyslexia) toggleFeature('acc-dyslexia');
    if(s.links) toggleFeature('acc-highlight-links');
    if(s.cursor) toggleFeature('acc-big-cursor');
    if(s.guide) toggleReadingGuide();

    if (s.cbIndex && s.cbIndex > 0) {
        cbIndex = s.cbIndex - 1; 
        cycleColorBlindness();
    }

    if (s.screenReader) toggleScreenReader();
}

function resetAccessibility() {
    localStorage.removeItem('acc_settings');
    localStorage.removeItem('acc_zoom');
    location.reload();
}