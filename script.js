// BURGER MENU
function toggleMenu() {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}

function closeMenu() {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');
  burger.classList.remove('open');
  navLinks.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

// SPLASH SCREEN
function enterSite() {
  const splash = document.getElementById('splash');
  const main = document.getElementById('mainContent');
  splash.classList.add('hide');
  setTimeout(() => {
    splash.style.display = 'none';
    main.classList.add('visible');
    window.scrollTo(0, 0);
  }, 800);
}

window.addEventListener('DOMContentLoaded', () => {
  const progress = document.getElementById('splashProgress');
  setTimeout(() => { if (progress) progress.style.width = '100%'; }, 100);
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash && !splash.classList.contains('hide')) enterSite();
  }, 3800);
});

// PARALLAXE BANNIÈRE
window.addEventListener('scroll', () => {
  const banner = document.querySelector('.top-banner-img');
  if (banner) banner.style.transform = 'translateY(' + (window.scrollY * 0.4) + 'px)';
});

// TEXTE RÉACTIF AU CURSEUR
window.addEventListener('load', () => {
  const title = document.querySelector('.hero h1');
  if (title) {
    const html = title.innerHTML;
    let newHtml = '';
    let inTag = false;
    for (let i = 0; i < html.length; i++) {
      const char = html[i];
      if (char === '<') { inTag = true; newHtml += char; }
      else if (char === '>') { inTag = false; newHtml += char; }
      else if (!inTag && char !== ' ') { newHtml += '<span class="letter">' + char + '</span>'; }
      else { newHtml += char; }
    }
    title.innerHTML = newHtml;
  }
  document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.letter').forEach(letter => {
      const rect = letter.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 120;
      if (dist < maxDist) {
        const force = (maxDist - dist) / maxDist;
        letter.style.transform = 'translate(' + (-dx * force * 0.4) + 'px, ' + (-dy * force * 0.4) + 'px)';
        letter.style.color = '#ff9a5c';
      } else {
        letter.style.transform = 'translate(0, 0)';
        letter.style.color = '';
      }
    });
  });
});

// COMPTEURS ANIMÉS
const counters = document.querySelectorAll('.stat strong');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const text = target.innerText;
      const num = parseInt(text);
      if (!isNaN(num)) {
        let count = 0;
        const increment = Math.ceil(num / 40);
        const suffix = text.replace(/[0-9]/g, '');
        const timer = setInterval(() => {
          count += increment;
          if (count >= num) { count = num; clearInterval(timer); }
          target.innerText = count + suffix;
        }, 40);
      }
      observer.unobserve(target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(counter => observer.observe(counter));

// FORMULAIRE CONTACT
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const btnText = form.querySelector('.btn-text');
    const btnLoading = form.querySelector('.btn-loading');
    const success = document.querySelector('.form-success');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    btn.disabled = true;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        form.style.display = 'none';
        success.style.display = 'block';
      } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        btn.disabled = false;
        alert('Erreur lors de l\'envoi. Veuillez réessayer.');
      }
    } catch (error) {
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      btn.disabled = false;
      alert('Erreur réseau. Veuillez réessayer.');
    }
  });
}// CARROUSEL ÉVÉNEMENTS
(function() {
  const track = document.getElementById('pubTrack');
  const dots  = document.querySelectorAll('.pub-dot');
  if (!track) return;
  let current = 0;
  const total = dots.length;

  function goTo(index) {
    current = index;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  setInterval(() => goTo((current + 1) % total), 3500);
})();
// PORTFOLIO MODAL - FLIP CARD
const portfolioData = {
  branding: {
    titre: "Communication & Branding",
    sous:  "Identité visuelle, chartes graphiques, packaging et brand content.",
    projets: [
      // { img: "https://i.ibb.co/xxx/image.jpg", label: "Logo GIZ CI" },
    ]
  },
  digital: {
    titre: "Communication Digitale",
    sous:  "Community management, Meta Ads, Google Ads et e-réputation.",
    projets: []
  },
audiovisuel: {
  titre: "Production Audiovisuelle",
  sous:  "Films institutionnels, spots pub, motion design, couverture événementielle.",
  projets: [
    {
      type:  "video",
      video: "https://www.youtube.com/embed/FCUgEJeyooc",
      label: "Film institutionnel GIZ / Fond PPP"
    }
  ]
},
  informatique: {
    titre: "Solutions Informatiques",
    sous:  "Sites web, applications mobiles, plateformes digitales et hébergement.",
    projets: []
  },
  "digital-transform": {
    titre: "Transformation Digitale",
    sous:  "Audit digital, automatisation de processus et conseil stratégique.",
    projets: []
  }
};

function openPortfolio(categorie) {
  const data = portfolioData[categorie];
  if (!data) return;

  document.getElementById('modalTitle').textContent = data.titre;
  document.getElementById('modalSub').textContent   = data.sous;

  const grid = document.getElementById('modalGrid');
  if (data.projets.length === 0) {
    grid.innerHTML = `
      <div class="modal-empty">
        <span>🚧</span>
        Réalisations à venir — revenez bientôt !
      </div>`;
  } else {
    grid.innerHTML = data.projets.map(p => {
      if (p.type === 'video') {
        return `
          <div class="modal-item modal-item-video">
            <div class="video-wrap">
              <iframe
                src="${p.video}?rel=0&modestbranding=1"
                title="${p.label}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            </div>
            <p class="modal-item-label">🎬 ${p.label}</p>
          </div>`;
      }
      return `
        <div class="modal-item">
          <img src="${p.img}" alt="${p.label}" loading="lazy"/>
          <p class="modal-item-label">${p.label}</p>
        </div>`;
    }).join('');
  }

  // Relance le flip à chaque ouverture
  const card = document.getElementById('flipCard');
  card.style.animation = 'none';
  card.offsetHeight; // force reflow
  card.style.animation = 'cardFlip 0.85s cubic-bezier(0.4, 0, 0.2, 1) both';

  document.getElementById('portfolioOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePortfolio() {
  document.getElementById('portfolioOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Fermer en cliquant sur le fond
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('portfolioOverlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) closePortfolio();
    });
  }
});

// Fermer avec la touche Échap
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePortfolio();
});
/* ── COMPTEURS STATS ── */
(function() {
  const numbers = document.querySelectorAll('.stat-number');
  if (!numbers.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    let count = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        count = target;
        clearInterval(timer);
      }
      el.textContent = count;
    }, 40);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  numbers.forEach(n => observer.observe(n));
})();
/* ── CHATBOT UCOM ── */
const chatResponses = {
  bonjour: {
    msg: "Bonjour et bienvenue chez UCOM VIZUART ! 👋 Je suis Vizubot, votre assistant digital. Comment puis-je vous aider aujourd'hui ?",
    suggestions: ["Vos services", "Demander un devis", "Délais de livraison", "Nous contacter"]
  },
  services: {
    msg: "UCOM VIZUART propose 5 domaines d'expertise :\n\n🎨 Communication & Branding\n📱 Communication Digitale\n🎬 Production Audiovisuelle\n💻 Solutions Informatiques\n🔄 Transformation Digitale\n\nQuel domaine vous intéresse ?",
    suggestions: ["Branding", "Site web", "Vidéo", "Devis gratuit"]
  },
  branding: {
    msg: "Notre offre Branding comprend la création de logo, charte graphique, plaquettes institutionnelles et packaging. Chaque projet est unique — contactez-nous pour un devis personnalisé gratuit sous 24h ! 🎨",
    suggestions: ["Demander un devis", "Délais", "Autres services"]
  },
  video: {
    msg: "Nous réalisons des films institutionnels, spots publicitaires, motion design et couvertures événementielles. Vous pouvez voir nos réalisations directement sur le site ! 🎬",
    suggestions: ["Demander un devis", "Délais", "Autres services"]
  },
  web: {
    msg: "Nous développons des sites web professionnels, applications mobiles et plateformes digitales sur mesure. Chaque projet inclut l'hébergement et la maintenance. 💻\n\nContactez-nous pour un devis gratuit adapté à vos besoins !",
    suggestions: ["Demander un devis", "Délais", "Autres services"]
  },
  devis: {
    msg: "Nos tarifs sont adaptés à chaque projet pour vous garantir le meilleur rapport qualité-prix. 📋\n\nContactez-nous dès maintenant et nous vous répondons sous 24h avec une proposition personnalisée et gratuite !",
    suggestions: ["Nous contacter", "Délais", "Vos références"]
  },
  delais: {
    msg: "Les délais dépendent de la nature et de la complexité de votre projet. Tout commence par un cahier des charges clair qui nous permet de vous donner un planning précis. ⏱️\n\nNous respectons toujours les délais convenus !",
    suggestions: ["Demander un devis", "Nous contacter", "Vos références"]
  },
  references: {
    msg: "Nous avons accompagné plus de 200 clients dans 6 pays — GIZ, Ecobank, Union Africaine, Orange Digital, Jumia et bien d'autres. 🌍\n\nPlus de 500 projets livrés en 10 ans d'expérience !",
    suggestions: ["Demander un devis", "Vos services", "Nous contacter"]
  },
  contact: {
    msg: "Vous pouvez nous joindre directement :\n\n📍 Cocody Riviera 2, Abidjan\n📞 27 22 74 52 10 / 07 08 65 44 02\n✉️ info@ucomvizuart.com\n\nOu remplissez le formulaire de contact sur le site — nous répondons sous 24h ! 😊",
    suggestions: ["Demander un devis", "Vos services", "Merci !"]
  },
  merci: {
    msg: "Merci pour votre intérêt pour UCOM VIZUART ! 🙏 N'hésitez pas à revenir si vous avez d'autres questions. À très bientôt ! 😊",
    suggestions: ["Vos services", "Nous contacter"]
  },
  default: {
    msg: "Je ne suis pas sûr de comprendre votre question. 😊 Voici ce que je peux vous dire :",
    suggestions: ["Vos services", "Demander un devis", "Délais de livraison", "Nous contacter", "Fondateur"]
  }
};

const keywordMap = {
  bonjour: ["bonjour", "bonsoir", "salut", "hello", "hi", "bjr"],
  services: ["service", "services", "offre", "offres", "faites", "proposez"],
  branding: ["logo", "branding", "charte", "identité", "visuelle", "graphique"],
  video: ["vidéo", "video", "film", "spot", "motion", "audiovisuel"],
  web: ["site", "web", "application", "app", "mobile", "informatique"],
  devis: ["devis", "prix", "tarif", "coût", "coute", "combien", "budget"],
  delais: ["délai", "delai", "temps", "durée", "duree", "livraison", "quand"],
  references: ["référence", "reference", "client", "partenaire", "projet", "réalisation"],
  contact: ["contact", "joindre", "appeler", "email", "adresse", "whatsapp"],
  merci: ["merci", "thanks", "thank", "super", "parfait", "ok"]
};

function detectIntent(msg) {
  const lower = msg.toLowerCase();
  for (const [intent, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(k => lower.includes(k))) return intent;
  }
  return 'default';
}

function addMessage(text, type) {
  const messages = document.getElementById('chatbotMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.innerHTML = text.replace(/\n/g, '<br/>');
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function showSuggestions(suggestions) {
  const container = document.getElementById('chatbotSuggestions');
  container.innerHTML = suggestions.map(s =>
    `<button class="chat-suggestion" onclick="handleSuggestion('${s}')">${s}</button>`
  ).join('');
}

function handleSuggestion(text) {
  addMessage(text, 'user');
  setTimeout(() => {
    const intent = detectIntent(text);
    const response = chatResponses[intent] || chatResponses.default;
    addMessage(response.msg, 'bot');
    showSuggestions(response.suggestions);
  }, 400);
}

function sendChatMessage() {
  const input = document.getElementById('chatbotInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addMessage(text, 'user');
  setTimeout(() => {
    const intent = detectIntent(text);
    const response = chatResponses[intent] || chatResponses.default;
    addMessage(response.msg, 'bot');
    showSuggestions(response.suggestions);
  }, 500);
}

function toggleChatbot() {
  const box = document.getElementById('chatbotBox');
  const notif = document.getElementById('chatbotNotif');
  box.classList.toggle('open');
  notif.style.display = 'none';
  if (box.classList.contains('open') && document.getElementById('chatbotMessages').children.length === 0) {
    setTimeout(() => {
      const response = chatResponses.bonjour;
      addMessage(response.msg, 'bot');
      showSuggestions(response.suggestions);
    }, 300);
  }
}
/* ── VIZUBOT MESSAGE PROACTIF ── */
setTimeout(() => {
  const bubble = document.getElementById('chatbotBubble');
  const box = document.getElementById('chatbotBox');
  if (box.classList.contains('open')) return;

  const proactif = document.createElement('div');
  proactif.id = 'chatbotProactif';
  proactif.innerHTML = `
    <p>👋 Bonjour ! Je suis <strong>Vizubot</strong>.<br/>Puis-je vous aider ?</p>
    <button onclick="document.getElementById('chatbotProactif').remove()">×</button>
  `;
  proactif.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 28px;
    background: var(--bleu-card);
    border: 1px solid rgba(255,107,43,0.35);
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 0.84rem;
    color: var(--blanc);
    z-index: 8887;
    max-width: 200px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    animation: fadeUp 0.4s ease both;
    line-height: 1.5;
    cursor: pointer;
  `;
  proactif.querySelector('button').style.cssText = `
    position: absolute;
    top: 6px;
    right: 8px;
    background: none;
    border: none;
    color: var(--gris);
    font-size: 1rem;
    cursor: pointer;
    line-height: 1;
  `;

  proactif.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') return;
    proactif.remove();
    toggleChatbot();
  });

  document.body.appendChild(proactif);

  // Disparaît automatiquement après 8 secondes
  setTimeout(() => {
    if (document.getElementById('chatbotProactif')) {
      proactif.style.opacity = '0';
      proactif.style.transition = 'opacity 0.5s ease';
      setTimeout(() => proactif.remove(), 500);
    }
  }, 8000);

}, 10000); // Apparaît après 10 secondes