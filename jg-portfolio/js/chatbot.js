/* ══════════════════════════════════════════════════════
   Gizmo — FurBot AI Chatbot
   John Gil Mayor Portfolio v5.0
   ══════════════════════════════════════════════════════ */

(function initGizmo() {
  const toggle   = document.getElementById('gizmoToggle');
  const window_  = document.getElementById('gizmoWindow');
  const closeBtn = document.getElementById('gizmoClose');
  const input    = document.getElementById('gizmoInput');
  const sendBtn  = document.getElementById('gizmoSend');
  const messages = document.getElementById('gizmoMessages');
  const quickReplies = document.getElementById('gizmoQuickReplies');

  if (!toggle || !window_) return;

  let isOpen = false;
  let hasGreeted = false;

  // ── Knowledge Base ─────────────────────────────────
  const KB = {
    greet: [
      "Hey there! 🐾 I'm Gizmo, John Gil's FurBot AI! I know everything about this portfolio. Ask me about his skills, projects, or how to get in touch!",
      "Woof woof! 🦊 I'm Gizmo! John Gil's friendly AI assistant. What would you like to know about him?",
      "Hi hi! 🐾 Gizmo here — your fluffy guide to John Gil's portfolio! Ask me anything!"
    ],
    skills: "John Gil is skilled in:\n🌐 HTML/CSS (90%) · ⚡ JavaScript (80%) · 🐍 Python (75%) · 🗄️ MySQL (70%) · 🎨 UI/UX Design (78%) · 🔒 Security Basics (65%)\n\nHe also uses Git, Figma, REST APIs, and Agile workflows!",
    projects: "Here are John Gil's top projects:\n\n📌 **CLICKizenship** — A barangay digital services platform (HTML/CSS/JS)\n📌 **PVC Validity Extension System** — Dashboard UI for gov't ID validation\n📌 **OJT Attendance Tracker** — QR-based attendance system\n📌 **Passfolio** — Passport-themed portfolio concept\n📌 **Data Science Visualizations** — Python/matplotlib academic work",
    contact: "You can reach John Gil at:\n\n✉️ johngil.mayor@example.com\n📞 09692980415\n📍 Paranaque City, Metro Manila, Philippines\n🐙 github.com/johngil\n💼 linkedin.com/in/johngil",
    events: "John Gil attended some cool events in 2026!\n\n🔬 Research Colloquium 2026\n🌌 Cosmos 2026\n⭐ Stellar Bootcamp 2026\n\nCheck the Events tab to see the photo ops from each event!",
    about: "John Gil Mayor is a graduating BSIT student from the Polytechnic University of the Philippines (PUP). He's passionate about frontend development, UI/UX design, and building systems that help real people. He's currently looking for internship or junior developer opportunities! 🎓",
    gdg: "John Gil is a member of Google Developer Groups (GDG) Manila — PUP Chapter! He's active in the tech community and loves collaborative learning. 🌟",
    certifications: "John Gil holds Cisco NetAcad certifications and several Cisco badges! He's completed networking, cybersecurity, and programming courses. You can see his badges in the Skills section!",
    organizations: "John Gil is affiliated with:\n🔵 Google Developer Groups\n🔵 Cisco NetAcad\n🔵 PUP ICTSO\n🔵 IT Students' Association\n🔵 CyberSecurity Club\n🔵 Web Dev Society",
    mode: "This portfolio has two modes!\n\n🌙 **Dev Mode** — Dark, techy theme with animations, GDG ID card, depth effects, and events gallery.\n☀️ **Air Mode** — Professional, light corporate theme with certifications and achievements.\n\nClick the toggle icon in the top-right to switch!",
    python: "John Gil knows Python! 🐍 He uses it for data analysis, visualization (matplotlib, pandas), and scripting. Check the Skills section in Dev Mode where you can view a sample Python code snippet he wrote!",
    hire: "John Gil is open to opportunities! 🙌 He's looking for internships, junior developer roles, or collaboration projects. You can contact him at johngil.mayor@example.com or 09692980415. He's based in Paranaque City, Metro Manila!",
    fun: [
      "Did you know? 🐾 I'm named Gizmo because John Gil's favorite genre to build is gadget-like interactive UIs!",
      "Fun fact: ⚡ John Gil built this entire portfolio from scratch with pure HTML, CSS, and JavaScript — no frameworks!",
      "Woof! 🦊 John Gil can design AND code — a rare full-stack creative! His UI/UX skills make his projects stand out."
    ],
    fallback: [
      "Hmm, I'm not sure about that one! 🤔 Try asking me about John Gil's skills, projects, contact info, or events!",
      "Ruff! 🐾 I didn't quite catch that. Maybe ask me about his certifications, Python code, or how to hire him?",
      "Woof woof! 🦊 That's a tricky one. I know lots about John Gil — try: skills, projects, events, or contact!"
    ]
  };

  // ── Response Engine ─────────────────────────────────
  function getResponse(msg) {
    const m = msg.toLowerCase();

    if (/^(hi|hello|hey|yo|sup|greet|hola)/i.test(m))
      return rand(KB.greet);

    if (/skill|tech|language|html|css|js|javascript|python|mysql|ui|ux|design|know/i.test(m))
      return KB.skills;

    if (/project|work|clickiz|pvc|ojt|passfolio|data science|build|make|create/i.test(m))
      return KB.projects;

    if (/contact|email|phone|number|reach|hire|linkedin|github|available/i.test(m) && !/hire/.test(m))
      return KB.contact;

    if (/hire|internship|job|opportunity|recruit|looking|position|junior/i.test(m))
      return KB.hire;

    if (/event|colloquium|cosmos|stellar|bootcamp|photo|gallery/i.test(m))
      return KB.events;

    if (/about|who|background|study|pup|school|graduate|graduating|student/i.test(m))
      return KB.about;

    if (/gdg|google developer|group|member/i.test(m))
      return KB.gdg;

    if (/cert|cisco|badge|credential/i.test(m))
      return KB.certifications;

    if (/org|organization|affiliated|club|society|association/i.test(m))
      return KB.organizations;

    if (/mode|switch|air|dev|dark|light|theme/i.test(m))
      return KB.mode;

    if (/python|code|script|pandas|matplotlib|snippet/i.test(m))
      return KB.python;

    if (/fun|joke|cool|wow|nice|amazing|interesting/i.test(m))
      return rand(KB.fun);

    if (/help|what can|what do|ask|question/i.test(m))
      return "I can help with:\n🛠️ Skills & tools\n📁 Projects & works\n🎓 About John Gil\n🏅 Certifications\n📅 Events attended\n📩 How to contact\n💼 Job/internship info\n\nJust ask away! 🐾";

    return rand(KB.fallback);
  }

  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // ── UI Helpers ─────────────────────────────────────
  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `gizmo-msg ${type}`;
    // Format **bold** text
    msg.innerHTML = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return msg;
  }

  function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'gizmo-msg bot gizmo-typing';
    typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    typing.id = 'gizmoTyping';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    // Inject typing CSS
    if (!document.getElementById('gizmoTypingStyle')) {
      const style = document.createElement('style');
      style.id = 'gizmoTypingStyle';
      style.textContent = `
        .gizmo-typing { display: flex; gap: 5px; align-items: center; padding: 12px 16px !important; width: fit-content; }
        .typing-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,.4); animation: typingBounce 1.2s ease-in-out infinite; }
        .typing-dot:nth-child(2) { animation-delay: .2s; }
        .typing-dot:nth-child(3) { animation-delay: .4s; }
        @keyframes typingBounce { 0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-6px);background:rgba(109,40,217,.7);} }
      `;
      document.head.appendChild(style);
    }
  }

  function removeTypingIndicator() {
    const t = document.getElementById('gizmoTyping');
    if (t) t.remove();
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    input.value = '';
    showTypingIndicator();

    // Simulate thinking delay
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      removeTypingIndicator();
      addMessage(getResponse(text), 'bot');
    }, delay);
  }

  // ── Quick Replies ──────────────────────────────────
  document.querySelectorAll('.gizmo-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.quick;
      const map = { skills: 'Tell me about John Gil\'s skills!', projects: 'What projects has he worked on?', contact: 'How can I contact John Gil?' };
      if (map[key]) sendMessage(map[key]);
    });
  });

  // ── Open / Close ────────────────────────────────────
  function openChat() {
    isOpen = true;
    window_.classList.add('gizmo-open');
    window_.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    input.focus();

    // Remove notif dot on first open
    const dot = toggle.querySelector('.gizmo-notif-dot');
    if (dot) dot.style.display = 'none';

    // Greet on first open
    if (!hasGreeted) {
      hasGreeted = true;
      setTimeout(() => {
        addMessage(rand(KB.greet), 'bot');
      }, 400);
    }
  }

  function closeChat() {
    isOpen = false;
    window_.classList.remove('gizmo-open');
    window_.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeChat(); });

  // ── Send handlers ──────────────────────────────────
  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

})();
