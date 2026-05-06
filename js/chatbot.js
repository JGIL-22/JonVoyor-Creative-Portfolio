/* ══════════════════════════════════════════════════════
   Gizmo — FurBot AI · Enhanced v6.0
   John Gil Mayor Portfolio
   Bilingual (English + Filipino) · Smarter responses
   ══════════════════════════════════════════════════════ */

(function initGizmo() {
  const toggle     = document.getElementById('gizmoToggle');
  const window_    = document.getElementById('gizmoWindow');
  const closeBtn   = document.getElementById('gizmoClose');
  const input      = document.getElementById('gizmoInput');
  const sendBtn    = document.getElementById('gizmoSend');
  const messages   = document.getElementById('gizmoMessages');
  const quickReplies = document.getElementById('gizmoQuickReplies');

  if (!toggle || !window_) return;

  let isOpen     = false;
  let hasGreeted = false;
  let lang       = 'en'; // detected language: 'en' | 'fil'
  let msgCount   = 0;
  let lastTopic  = null;

  // ── Language Detection ───────────────────────────────
  const FIL_WORDS = /\b(ano|kumusta|kamusta|sino|saan|kailan|paano|bakit|anong|maganda|meron|may|ba|po|opo|salamat|salamat|hindi|oo|naman|yung|yun|ako|ikaw|siya|kami|tayo|kayo|sila|nag|mag|mga|ng|sa|na|at|kasi|para|lang|dito|doon|talaga|syempre|nandito|pwede|pwedeng|gusto|ayaw|mahal|libre|libre|baka|siguro|palagi|lagi|eto|ito|iyon|hayaan|sige|sure|ganun|ganon|dba|di|wala|meron|merong|bilang|bago|luma|mabilis|mabait|magaling|galing|astig|grabe|sana|nawa)\b/i;

  function detectLang(text) {
    if (FIL_WORDS.test(text)) return 'fil';
    // Also detect if text contains common Filipino question starters
    if (/^(ano|kumusta|sino|saan|paano|bakit|maganda|meron)/i.test(text.trim())) return 'fil';
    return 'en';
  }

  // ── Knowledge Base ───────────────────────────────────
  const KB = {

    greet: {
      en: [
        "Hey there! 🐾 I'm **Gizmo**, John Gil's FurBot AI assistant! I know everything about this portfolio. Ask me about his skills, projects, certifications, or how to get in touch!",
        "Woof! 🦊 Gizmo here — your fluffy AI guide to John Gil Mayor's portfolio! What would you like to know? Try asking about his projects, skills, or the Events tab!",
        "Hi hi! 🐾 I'm Gizmo! Ask me anything about John Gil — his background, tech stack, certifications, or internship availability. I'm all ears! 👂"
      ],
      fil: [
        "Hoy hoy! 🐾 Ako si **Gizmo**, ang FurBot AI ni John Gil! Alam ko lahat tungkol sa portfolio na ito. Tanungin mo ako tungkol sa kanyang skills, projects, o kung paano makipag-ugnayan sa kanya!",
        "Woof! 🦊 Gizmo ako! Ang iyong malikhaing gabay sa portfolio ni John Gil Mayor. Ano ang gusto mong malaman? Pwede kang magtanong tungkol sa kanyang mga projects, skills, o certifications!",
        "Kumusta! 🐾 Gizmo ang pangalan ko! Magtanong ka tungkol kay John Gil — background niya, tech skills, certifications, o kung available siya para sa internship. Nandito lang ako! 👂"
      ]
    },

    name: {
      en: "I'm **Gizmo** 🦊 — John Gil's personal FurBot AI! I'm a virtual fox mascot built to help visitors learn about John Gil's portfolio, projects, and background. I speak both English and Filipino! 🐾",
      fil: "Ako si **Gizmo** 🦊 — ang personal na FurBot AI ni John Gil! Isang virtual na fox mascot na ginawa para tulungan ang mga bisita na matuto tungkol sa portfolio, projects, at background ni John Gil. Nagsasalita ako ng English at Filipino! 🐾"
    },

    who: {
      en: "**John Gil Mayor** is a graduating BSIT student from the **Polytechnic University of the Philippines (PUP)**. 🎓\n\nHe's a passionate frontend developer and UI/UX designer with hands-on experience building civic tech platforms, government systems, and interactive web applications.\n\nCurrently seeking internship or junior developer roles in Metro Manila! 💼",
      fil: "Si **John Gil Mayor** ay isang graduating na BSIT student mula sa **Polytechnic University of the Philippines (PUP)**. 🎓\n\nSiya ay isang passionate na frontend developer at UI/UX designer na may hands-on na karanasan sa paggawa ng civic tech platforms, government systems, at interactive web apps.\n\nNaghahanap siya ngayon ng internship o junior developer roles sa Metro Manila! 💼"
    },

    skills: {
      en: "Here's John Gil's tech stack! 💻\n\n**Languages & Markup:**\n🌐 HTML/CSS — 90% · Advanced layouts & animations\n⚡ JavaScript — 80% · DOM, APIs, logic\n🐍 Python — 75% · Data, scripting, Flask\n🗄️ MySQL — 70% · Database design & queries\n\n**Design & Tools:**\n🎨 UI/UX Design (Figma) — 78%\n🔒 Cybersecurity Basics — 65%\n🔗 REST APIs · Git/GitHub · Agile/Scrum\n\nHe builds things that look great AND work well! ✨",
      fil: "Ito ang tech stack ni John Gil! 💻\n\n**Languages & Markup:**\n🌐 HTML/CSS — 90% · Advanced layouts at animations\n⚡ JavaScript — 80% · DOM, APIs, logic\n🐍 Python — 75% · Data, scripting, Flask\n🗄️ MySQL — 70% · Database design at queries\n\n**Design at Tools:**\n🎨 UI/UX Design (Figma) — 78%\n🔒 Cybersecurity Basics — 65%\n🔗 REST APIs · Git/GitHub · Agile/Scrum\n\nGumagawa siya ng mga bagay na maganda at gumagana rin! ✨"
    },

    projects: {
      en: "John Gil's proudest builds! 🚀\n\n📌 **CLICKizenship** — Barangay digital services platform with QR-based request flows for local government use. *(Capstone Extension Project 2026)*\n\n📌 **PVC Validity Extension System** — Government ID validation dashboard with structured form workflows and approval pipeline.\n\n📌 **OJT Attendance Tracker** — QR-based attendance system with real-time logging, report generation & admin controls.\n\n📌 **Passfolio** — Passport-themed personal portfolio with achievement stamps.\n\n📌 **Data Science Visualizations** — Python/matplotlib academic mini-projects.\n\nWant details on any of these? Just ask! 🐾",
      fil: "Ang mga pinaka-proud na ginawa ni John Gil! 🚀\n\n📌 **CLICKizenship** — Barangay digital services platform na may QR-based na request flows para sa local government. *(Capstone Extension Project 2026)*\n\n📌 **PVC Validity Extension System** — Government ID validation dashboard na may structured form workflows at approval pipeline.\n\n📌 **OJT Attendance Tracker** — QR-based na attendance system na may real-time logging, report generation at admin controls.\n\n📌 **Passfolio** — Passport-themed personal portfolio na may achievement stamps.\n\n📌 **Data Science Visualizations** — Python/matplotlib academic mini-projects.\n\nGusto mo bang malaman ang detalye ng isa sa mga ito? Itanong mo lang! 🐾"
    },

    contact: {
      en: "Here's how to reach John Gil! 📬\n\n✉️ **Email:** jmayor.devhub@gmail.com\n📞 **Phone:** 09692980415\n📍 **Location:** Paranaque City, Metro Manila, Philippines\n🐙 **GitHub:** github.com/JGIL-22\n💼 **LinkedIn:** linkedin.com/in/johngil-mayor22\n📘 **Facebook:** facebook.com/JgTrek\n📸 **Instagram:** instagram.com/jm_voyor\n\nFeel free to send him a message directly from the **Contact tab** too! 🐾",
      fil: "Ganito makipag-ugnayan kay John Gil! 📬\n\n✉️ **Email:** jmayor.devhub@gmail.com\n📞 **Phone:** 09692980415\n📍 **Location:** Paranaque City, Metro Manila, Philippines\n🐙 **GitHub:** github.com/JGIL-22\n💼 **LinkedIn:** linkedin.com/in/johngil-mayor22\n📘 **Facebook:** facebook.com/JgTrek\n📸 **Instagram:** instagram.com/jm_voyor\n\nPwede ka ring mag-message sa kanya direkta mula sa **Contact tab**! 🐾"
    },

    hire: {
      en: "John Gil is **actively open to opportunities!** 🙌\n\nHe's looking for:\n💼 IT internships\n🖥️ Junior frontend / full-stack developer roles\n🎨 UI/UX design positions\n🤝 Collaborative open-source projects\n\nHe's based in **Paranaque City, Metro Manila** and can work onsite or remote. Reach him at **jmayor.devhub@gmail.com** or **09692980415**! Don't be shy — he's friendly! 😊",
      fil: "Si John Gil ay **aktibong naghahanap ng trabaho!** 🙌\n\nHinahanap niya ang:\n💼 IT internships\n🖥️ Junior frontend / full-stack developer roles\n🎨 UI/UX design positions\n🤝 Collaborative open-source projects\n\nNakatira siya sa **Paranaque City, Metro Manila** at pwedeng magtrabaho onsite o remote. Makipag-ugnayan sa kanya sa **jmayor.devhub@gmail.com** o **09692980415**! Huwag mahiyang makipag-ugnayan — mabait siya! 😊"
    },

    events: {
      en: "John Gil attended some amazing events in 2026! 📸\n\n🔬 **Research Colloquium 2026** — PUP Paranaque Campus. Academic research showcase.\n\n🌌 **Cosmos 2026** — PUP Manila. Tech conference exploring possibilities in innovation.\n\n⭐ **Stellar Bootcamp 2026** — White Cloak Technologies Inc., Ortigas. Hands-on tech bootcamp.\n\nHead over to the **Events tab** in Dev Mode to see actual photos from each event! 📷",
      fil: "Nagsali si John Gil sa mga kamangha-manghang events noong 2026! 📸\n\n🔬 **Research Colloquium 2026** — PUP Paranaque Campus. Academic research showcase.\n\n🌌 **Cosmos 2026** — PUP Manila. Tech conference tungkol sa innovation.\n\n⭐ **Stellar Bootcamp 2026** — White Cloak Technologies Inc., Ortigas. Hands-on tech bootcamp.\n\nPuntahan ang **Events tab** sa Dev Mode para makita ang mga tunay na larawan mula sa bawat event! 📷"
    },

    gdg: {
      en: "John Gil is a proud member of **Google Developer Groups (GDG) — PUP Chapter**! 🌟\n\nGDG is a community of developers supported by Google where students explore technology, share knowledge, and collaborate on projects. His GDG ID card is showcased on the Home tab in Dev Mode! 🪪",
      fil: "Si John Gil ay isang proud na miyembro ng **Google Developer Groups (GDG) — PUP Chapter**! 🌟\n\nAng GDG ay isang komunidad ng mga developer na sinusuportahan ng Google kung saan nag-eexplore ang mga estudyante ng teknolohiya, nagbabahagi ng kaalaman, at nagkokolabora sa mga project. Ang kanyang GDG ID card ay makikita sa Home tab ng Dev Mode! 🪪"
    },

    certifications: {
      en: "John Gil's credentials and badges! 🏅\n\n📜 **Cisco Networking Basics** — Cisco NetAcad\n📜 **Introduction to Cybersecurity** — Cisco NetAcad (2026)\n📜 **Python Essentials** — Cisco NetAcad\n🎖️ **Cisco NetAcad Badges** — Multiple earned\n🥇 **Capstone Extension Project 2026** — CLICKizenship\n🏆 **President's Lister** — PUP Paranaque (2023–2026)\n\nCheck the **About tab** in Air Mode to see them displayed! 🐾",
      fil: "Ang mga credentials at badges ni John Gil! 🏅\n\n📜 **Cisco Networking Basics** — Cisco NetAcad\n📜 **Introduction to Cybersecurity** — Cisco NetAcad (2026)\n📜 **Python Essentials** — Cisco NetAcad\n🎖️ **Cisco NetAcad Badges** — Maraming nakuha\n🥇 **Capstone Extension Project 2026** — CLICKizenship\n🏆 **President's Lister** — PUP Paranaque (2023–2026)\n\nTingnan ang **About tab** sa Air Mode para makita ang mga ito! 🐾"
    },

    organizations: {
      en: "John Gil is affiliated with several organizations! 🏛️\n\n🔵 Google Developer Groups (GDG) — PUP Chapter\n🔵 Cisco NetAcad\n🔵 PUP ICTSO\n🔵 IT Students' Association\n🔵 Cybersecurity Club\n🔵 Web Dev Society\n\nHe's passionate about building community alongside building software! 🤝",
      fil: "Si John Gil ay kabilang sa maraming organisasyon! 🏛️\n\n🔵 Google Developer Groups (GDG) — PUP Chapter\n🔵 Cisco NetAcad\n🔵 PUP ICTSO\n🔵 IT Students' Association\n🔵 Cybersecurity Club\n🔵 Web Dev Society\n\nMahal niya ang pagbuo ng komunidad kasabay ng pagbuo ng software! 🤝"
    },

    mode: {
      en: "This portfolio has **two amazing modes!** 🎨\n\n🌙 **Dev Mode** — Dark techy theme with canvas animations, glitch effects, GDG ID card, stories panel, events gallery, and code snippets. Built for developers!\n\n☀️ **Air Mode** — Clean, professional corporate theme with certifications, achievements, and a formal layout. Built for recruiters!\n\nClick the **toggle icon** in the top-right corner of the navbar to switch! It has a smooth curtain transition! ✨",
      fil: "Ang portfolio na ito ay may **dalawang napakagandang mode!** 🎨\n\n🌙 **Dev Mode** — Dark na techy theme na may canvas animations, glitch effects, GDG ID card, stories panel, events gallery, at code snippets. Para sa mga developer!\n\n☀️ **Air Mode** — Malinis at propesyonal na corporate theme na may certifications, achievements, at formal na layout. Para sa mga recruiter!\n\nI-click ang **toggle icon** sa kanang sulok ng navbar para lumipat! May smooth na curtain transition ito! ✨"
    },

    python: {
      en: "John Gil uses **Python** for several things! 🐍\n\n- Data analysis with **pandas** and **numpy**\n- Visualization with **matplotlib** and **seaborn**\n- Backend scripting with **Flask**\n- Automation scripts and QR-code generation\n\nHis OJT Attendance Tracker system was built using Python + Flask! Check the **Skills section** in Dev Mode to see a live Python code snippet he wrote. 💻",
      fil: "Ginagamit ni John Gil ang **Python** para sa maraming bagay! 🐍\n\n- Data analysis gamit ang **pandas** at **numpy**\n- Visualization gamit ang **matplotlib** at **seaborn**\n- Backend scripting gamit ang **Flask**\n- Automation scripts at QR-code generation\n\nAng kanyang OJT Attendance Tracker system ay ginawa gamit ang Python + Flask! Tingnan ang **Skills section** sa Dev Mode para makita ang live na Python code snippet na sinulat niya. 💻"
    },

    school: {
      en: "John Gil studies at the **Polytechnic University of the Philippines (PUP)** — one of the largest state universities in the Philippines! 🎓\n\nHe's under the **College of Computer and Information Sciences (CCIS)**, pursuing **Bachelor of Science in Information Technology (BSIT)**. Graduating Class of 2026! 📚",
      fil: "Nag-aaral si John Gil sa **Polytechnic University of the Philippines (PUP)** — isa sa pinakamalaking state university sa Pilipinas! 🎓\n\nSiya ay nasa **College of Computer and Information Sciences (CCIS)**, kumukuha ng **Bachelor of Science in Information Technology (BSIT)**. Graduating Class of 2026! 📚"
    },

    location: {
      en: "John Gil is based in **Paranaque City, Metro Manila, Philippines** (ZIP: 1700). 📍\n\nHe's open to working onsite in Metro Manila or fully remote for the right opportunity! 🗺️",
      fil: "Si John Gil ay nakatira sa **Paranaque City, Metro Manila, Philippines** (ZIP: 1700). 📍\n\nBukas siya sa pag-trabaho onsite sa Metro Manila o fully remote para sa tamang oportunidad! 🗺️"
    },

    achievements: {
      en: "John Gil's top achievements! 🏆\n\n🏆 **President's Lister** — PUP Paranaque (2023–2026)\n🥇 **Capstone Extension Project Award 2026** — CLICKizenship chosen as official Extension Project\n📜 **Cisco Cybersecurity Certification** — Completed 2026\n🌌 **Cosmos 2026 Participant** — Tech conference attendee\n⭐ **Stellar Bootcamp Graduate** — White Cloak Technologies Inc.\n\nHe's consistent both in academics and extracurriculars! 💪",
      fil: "Ang mga pinakamataas na tagumpay ni John Gil! 🏆\n\n🏆 **President's Lister** — PUP Paranaque (2023–2026)\n🥇 **Capstone Extension Project Award 2026** — Ang CLICKizenship ay pinili bilang opisyal na Extension Project\n📜 **Cisco Cybersecurity Certification** — Natapos 2026\n🌌 **Cosmos 2026 Participant** — Tech conference attendee\n⭐ **Stellar Bootcamp Graduate** — White Cloak Technologies Inc.\n\nKonsistente siya sa academics at extracurriculars! 💪"
    },

    fun: {
      en: [
        "Fun fact! 🐾 John Gil built this entire portfolio from scratch using **pure HTML, CSS, and JavaScript** — no heavy frameworks! That means every animation, transition, and effect you see is hand-crafted. 🎨",
        "Did you know? 🦊 John Gil's capstone project **CLICKizenship** was actually selected as an **Extension Project for 2026** — meaning it's going to help a real barangay community! Pretty cool, right?",
        "Woof! ⚡ John Gil can both **design and code** — a rare combo! He uses Figma for wireframes and prototypes, then brings them to life with HTML, CSS, and JS himself.",
        "Here's a fun one! 🐾 This portfolio has **two full modes** — Dev Mode (dark & techy) and Air Mode (clean & corporate). Both are completely different in look, feel, and content. All built in one HTML file!",
        "Cool fact! 🌟 John Gil is a **President's Lister** — meaning he maintained top academic standing throughout his BSIT program at PUP from 2023 to 2026. Books AND code! 📚💻"
      ],
      fil: [
        "Fun fact! 🐾 Ginawa ni John Gil ang buong portfolio na ito mula sa simula gamit ang **pure HTML, CSS, at JavaScript** — walang mabibigat na frameworks! Ibig sabihin, bawat animation, transition, at effect na nakikita mo ay ginawa ng kanyang sariling kamay. 🎨",
        "Alam mo ba? 🦊 Ang capstone project ni John Gil na **CLICKizenship** ay napili bilang **Extension Project para sa 2026** — ibig sabihin, makakatulong ito sa isang tunay na barangay community! Astig 'di ba?",
        "Woof! ⚡ Kaya ni John Gil ang parehong **mag-design at mag-code** — bihirang kombinasyon! Gumagamit siya ng Figma para sa wireframes at prototypes, tapos binibigayan niya ito ng buhay gamit ang HTML, CSS, at JS.",
        "Fun fact! 🐾 Ang portfolio na ito ay may **dalawang buong mode** — Dev Mode (dark at techy) at Air Mode (malinis at corporate). Magkaiba ang hitsura, pakiramdam, at nilalaman ng dalawa. Lahat ay ginawa sa iisang HTML file!",
        "Cool fact! 🌟 Si John Gil ay isang **President's Lister** — ibig sabihin, pinananatili niya ang pinakamataas na academic standing sa kanyang BSIT program sa PUP mula 2023 hanggang 2026. Books AT code! 📚💻"
      ]
    },

    help: {
      en: "Here's what I can tell you about! 🐾\n\n🛠️ **Skills** — Tech stack, languages, tools\n📁 **Projects** — CLICKizenship, OJT Tracker & more\n🎓 **About** — Background, school, PUP\n🏅 **Certifications** — Cisco, badges, credentials\n🏆 **Achievements** — Awards, recognitions\n📅 **Events** — Colloquium, Cosmos, Stellar Bootcamp\n📩 **Contact** — Email, phone, socials\n💼 **Hire** — Internship & job availability\n🎨 **Portfolio Modes** — Dev Mode vs Air Mode\n🌟 **Fun Facts** — Interesting trivia!\n\nJust type naturally — I understand English and Filipino! 🦊",
      fil: "Ito ang mga pwede kong sabihin sa iyo! 🐾\n\n🛠️ **Skills** — Tech stack, languages, tools\n📁 **Projects** — CLICKizenship, OJT Tracker at iba pa\n🎓 **About** — Background, paaralan, PUP\n🏅 **Certifications** — Cisco, badges, credentials\n🏆 **Achievements** — Awards, recognitions\n📅 **Events** — Colloquium, Cosmos, Stellar Bootcamp\n📩 **Contact** — Email, phone, socials\n💼 **Hire** — Internship at job availability\n🎨 **Portfolio Modes** — Dev Mode vs Air Mode\n🌟 **Fun Facts** — Mga kawili-wiling trivia!\n\nMag-type lang ng natural — naiintindihan ko ang English at Filipino! 🦊"
    },

    thanks: {
      en: [
        "You're welcome! 🐾 That's what I'm here for! Anything else you'd like to know about John Gil?",
        "Happy to help! 🦊 Feel free to ask me anything else about John Gil's portfolio!",
        "Anytime! 🌟 I love talking about John Gil's work. Any other questions?"
      ],
      fil: [
        "Walang anuman! 🐾 Para doon ako! May iba pa bang gusto mong malaman tungkol kay John Gil?",
        "Masaya akong tumulong! 🦊 Huwag mag-atubiling magtanong pa tungkol sa portfolio ni John Gil!",
        "Anumang oras! 🌟 Gustong-gusto kong pag-usapan ang gawa ni John Gil. May iba pang tanong?"
      ]
    },

    fallback: {
      en: [
        "Hmm, I'm not quite sure about that one! 🤔 Try asking me about John Gil's **skills**, **projects**, **certifications**, **events**, or how to **contact** him!",
        "Ruff! 🐾 That's a tricky question for me. I know tons about John Gil though — try asking about his **tech stack**, **achievements**, **school**, or **portfolio modes**!",
        "Woof woof! 🦊 I didn't quite catch that. I'm best at answering questions about John Gil's work, background, and portfolio. Type **help** to see everything I can answer! 🐾"
      ],
      fil: [
        "Hmm, hindi ako sigurado doon! 🤔 Subukan mong tanungin ako tungkol sa **skills**, **projects**, **certifications**, **events**, o kung paano **makipag-ugnayan** kay John Gil!",
        "Ruff! 🐾 Mahirap na tanong iyon para sa akin. Pero marami akong alam tungkol kay John Gil — subukan mong tanungin ang kanyang **tech stack**, **achievements**, **paaralan**, o **portfolio modes**!",
        "Woof woof! 🦊 Hindi ko masyadong naintindihan iyon. Pinakamahusay akong sumagot ng mga tanong tungkol sa gawa, background, at portfolio ni John Gil. I-type ang **tulong** para makita ang lahat ng pwede kong sagutin! 🐾"
      ]
    }
  };

  // ── Smart Response Engine ────────────────────────────
  function getResponse(msg) {
    const m   = msg.toLowerCase().trim();
    lang      = detectLang(msg);
    const L   = lang; // shorthand
    msgCount++;

    // Helper to pick correct language branch
    const t = (key) => {
      const node = KB[key];
      if (!node) return null;
      if (Array.isArray(node[L])) return rand(node[L]);
      return node[L] || node.en;
    };

    // ── Greetings ──
    if (/^(hi|hello|hey|yo|sup|hoy|uy|kamusta|kumusta|musta|good morning|good afternoon|good evening|magandang|maayong)/i.test(m))
      return t('greet');

    // ── Who is Gizmo / what are you ──
    if (/gizmo|furbot|who are you|what are you|sino ka|ano ka|ikaw/i.test(m) && !/john|mayor/.test(m))
      return t('name');

    // ── About John Gil ──
    if (/who is john|sino si john|about john|tungkol kay john|tell me about john|about him|background|student|pup|university|school|college|course|bsit|graduating|nag-aaral|pinag-aralan/i.test(m))
      return t('who');

    // ── School / PUP specifically ──
    if (/pup|polytechnic|university|school|college|ccis|campus|paaralan|unibersidad/i.test(m) && !/org/.test(m))
      return t('school');

    // ── Skills / Tech Stack ──
    if (/skill|tech|stack|language|html|css|javascript|python|mysql|ui|ux|design|figma|know|tools|kaya|gamit|ginamit|ano.*alam|kakayahan/i.test(m))
      return t('skills');

    // ── Projects ──
    if (/project|work|clickiz|pvc|ojt|passfolio|data science|build|make|create|gawa|nagawa|trabaho|system|platform|app/i.test(m))
      return t('projects');

    // ── Hire / Availability ──
    if (/hire|internship|job|opportunity|recruit|looking|position|junior|available|work|salary|open|bakante|trabaho.*niya|available.*siya/i.test(m))
      return t('hire');

    // ── Contact ──
    if (/contact|email|phone|number|reach|linkedin|github|facebook|instagram|social|makipag-ugnayan|numero|telepono/i.test(m) && !/hire/.test(m))
      return t('contact');

    // ── Events ──
    if (/event|colloquium|cosmos|stellar|bootcamp|photo|gallery|attend|larawan|litrato|event.*niya|events/i.test(m))
      return t('events');

    // ── GDG ──
    if (/gdg|google developer|developer group|google.*group|grupo/i.test(m))
      return t('gdg');

    // ── Certifications ──
    if (/cert|cisco|badge|credential|netacad|certification|sertipiko/i.test(m))
      return t('certifications');

    // ── Organizations ──
    if (/org|organization|affiliated|club|society|association|samahan|miyembro|member/i.test(m))
      return t('organizations');

    // ── Portfolio Modes ──
    if (/mode|switch|air|dev mode|dark|light|theme|portfolio.*mode|dalawang mode/i.test(m))
      return t('mode');

    // ── Python ──
    if (/python|flask|pandas|matplotlib|script|snippet|code/i.test(m))
      return t('python');

    // ── Location ──
    if (/location|address|where|city|manila|paranaque|live|nakatira|saan.*nakatira|lugar/i.test(m))
      return t('location');

    // ── Achievements / Awards ──
    if (/achieve|award|honor|lister|president|recogni|award|panalo|nanalo|award.*niya|accomplishment|tagumpay/i.test(m))
      return t('achievements');

    // ── Fun / Trivia ──
    if (/fun|joke|cool|wow|nice|amazing|interesting|trivia|random|kwento|interesting.*fact|alam mo ba/i.test(m))
      return t('fun');

    // ── Thanks ──
    if (/thank|thanks|salamat|ty|thx|maraming salamat|pasalamat/i.test(m))
      return t('thanks');

    // ── Help / What can you do ──
    if (/help|what can|what do|ask|guide|tulong|ano.*pwede|pwede.*tanungin|saan.*humingi/i.test(m))
      return t('help');

    // ── Follow-up context (if user types short replies) ──
    if (m.length < 5 && lastTopic) return t(lastTopic);

    return t('fallback');
  }

  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // ── UI Helpers ─────────────────────────────────────
  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `gizmo-msg ${type}`;
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
    if (!document.getElementById('gizmoTypingStyle')) {
      const style = document.createElement('style');
      style.id = 'gizmoTypingStyle';
      style.textContent = `
        .gizmo-typing { display:flex;gap:5px;align-items:center;padding:12px 16px!important;width:fit-content; }
        .typing-dot { width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.4);animation:typingBounce 1.2s ease-in-out infinite; }
        .typing-dot:nth-child(2){animation-delay:.2s;}
        .typing-dot:nth-child(3){animation-delay:.4s;}
        @keyframes typingBounce{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-6px);background:rgba(109,40,217,.7);}}
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

    // Dynamic delay based on response length
    const delay = 700 + Math.random() * 700;
    setTimeout(() => {
      removeTypingIndicator();
      const response = getResponse(text);
      addMessage(response, 'bot');

      // Suggest follow-up chips after a few messages
      if (msgCount === 2) {
        setTimeout(() => addMessage("💡 _Tip: You can ask me in **Filipino** too! / Pwede kang magtanong sa **Filipino**!_", 'bot'), 500);
      }
    }, delay);
  }

  // ── Quick Replies ──────────────────────────────────
  document.querySelectorAll('.gizmo-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.quick;
      const map = {
        skills:   "Tell me about John Gil's skills!",
        projects: "What projects has he built?",
        contact:  "How can I contact John Gil?"
      };
      if (map[key]) sendMessage(map[key]);
    });
  });

  // ── Open / Close ────────────────────────────────────
  function openChat() {
    isOpen = true;
    window_.classList.add('gizmo-open');
    window_.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    const dot = toggle.querySelector('.gizmo-notif-dot');
    if (dot) dot.style.display = 'none';
    input.focus();
    if (!hasGreeted) {
      hasGreeted = true;
      setTimeout(() => addMessage(rand(KB.greet.en), 'bot'), 400);
    }
  }

  function closeChat() {
    isOpen = false;
    window_.classList.remove('gizmo-open');
    window_.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click',  () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeChat(); });

  sendBtn.addEventListener('click',  () => sendMessage(input.value));
  input.addEventListener('keydown',  e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input.value); }
  });

})();
