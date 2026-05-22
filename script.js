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
      type: "video",
      videoId: "aog0lCWXklI",
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
    grid.innerHTML = data.projets.map(p => `
      <div class="modal-item">
        <img src="${p.img}" alt="${p.label}" loading="lazy"/>
        <p class="modal-item-label">${p.label}</p>
      </div>
    `).join('');
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