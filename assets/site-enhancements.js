(function () {
  'use strict';

  var root = document.querySelector('.jx');
  if (!root) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var menuButton = root.querySelector('.burger');
  var drawer = root.querySelector('#jx-drawer');

  // Menu du haut limité à 3 liens (Actualités, Présentation, Pack Google) ; Accueil (logo),
  // Expertises et Outils sont dans le pied de page. Retire les anciens liens si une page les a encore.
  root.querySelectorAll('nav.menu, #jx-drawer').forEach(function (nav) {
    nav.querySelectorAll('a[href="/"], a[href="/outils/"]').forEach(function (link) { link.remove(); });
  });

  if (menuButton && drawer) {
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      drawer.hidden = expanded;
    });
  }

  var footer = root.querySelector('footer.foot');
  var footerGrid = footer && footer.querySelector('.fcols');
  if (footerGrid && !footerGrid.querySelector('.footer-directory')) {
    var footerGroups = [
      {
        title: 'SERVICES & IA',
        links: [
          ['Création d’Agents IA 24/7', '/expertises/agents-ia-support-client/'],
          ['Automatisation de Processus', '/expertises/automatisation-processus/'],
          ['Intégration de Chatbots & LLM', '/expertises/conseil-intelligence-artificielle/'],
          ['Audit & Conseil Numérique', '/expertises/audit-numerique-entreprise/'],
          ['Accompagnement No-Code', '/expertises/developpement-no-code-low-code/'],
          ['Formation IA & Acculturation', '/formation-accompagnement/'],
          ['Intelligence artificielle en entreprise', '/expertises/intelligence-artificielle-pme/'],
          ['Conseil en systèmes informatiques', '/expertises/conseil-systemes-informatiques/'],
          ['Création de sites web', '/expertises/creation-sites-web/'],
          ['Toutes les expertises', '/expertises/']
        ]
      },
      {
        title: 'MÉTIERS & CIBLES',
        links: [
          ['IA pour les Artisans', '/expertises/digitalisation-artisans/'],
          ['IA pour les Indépendants', '/expertises/solutions-ia-independants/'],
          ['IA pour les entreprises', '/expertises/ia-pour-tpe-pme/'],
          ['IA pour les Professions Libérales', '/expertises/ia-pour-professions-liberales/'],
          ['Expert IA Montmorillon (86)', '/expertises/expert-ia-montmorillon-vienne/'],
          ['Productivité des petites entreprises', '/expertises/gain-productivite-tpe/'],
          ['Transformation digitale locale', '/expertises/transformation-digitale-locale/'],
          ['Conseil informatique dans la Vienne', '/expertises/conseil-informatique-vienne/'],
          ['Freelance informatique en Nouvelle-Aquitaine', '/expertises/freelance-informatique-nouvelle-aquitaine/']
        ]
      },
      {
        title: 'RESSOURCES',
        links: [
          ['Études de Cas & Succès', '/expertises/etudes-de-cas/'],
          ['Le Blog de l’IA', '/actualites/'],
          ['Glossaire de l’IA', '/expertises/glossaire-ia/'],
          ['FAQ (Foire Aux Questions)', '/expertises/faq-ia/'],
          ['Outils & Simulateurs', '/expertises/outils-simulateurs/'],
          ['Outils recommandés', '/outils/'],
          ['Marketing digital', '/expertises/marketing-digital/'],
          ['Visibilité et SEO local', '/visibilite-seo-local/']
        ]
      },
      {
        title: 'INFORMATIONS',
        links: [
          ['Accueil', '/'],
          ['À propos', '/a-propos/'],
          ['Contact', '/contact/'],
          ['Conditions Générales de Vente', '/informations/cgv/'],
          ['Gestion des Cookies', '/informations/politique-cookies/'],
          ['Mentions légales', '/mentions-legales/'],
          ['Politique de confidentialité', '/politique-de-confidentialite/'],
          ['Plan du site', '/informations/plan-du-site/'],
          ['Zone d’intervention', '/zone-intervention/'],
          ['Espace partenaires', '/expertises/espace-partenaires/'],
          ['Me contacter sur LinkedIn', 'https://www.linkedin.com/in/josyei/']
        ]
      }
    ];
    var directory = document.createElement('div');
    directory.className = 'footer-directory';
    var identity = document.createElement('section');
    identity.className = 'footer-identity';
    var identityTitle = document.createElement('h2');
    identityTitle.textContent = 'JOSY EI';
    var identityCopy = document.createElement('p');
    identityCopy.textContent = 'Conseil en systèmes informatiques, automatisation et IA pour les professionnels et les curieux.';
    identity.appendChild(identityTitle);
    identity.appendChild(identityCopy);
    directory.appendChild(identity);
    footerGroups.forEach(function (group) {
      var navigation = document.createElement('nav');
      navigation.setAttribute('aria-label', group.title);
      var heading = document.createElement('h2');
      heading.textContent = group.title;
      var list = document.createElement('ul');
      group.links.forEach(function (item) {
        var listItem = document.createElement('li');
        var link = document.createElement('a');
        link.href = item[1];
        link.textContent = item[0];
        if (item[1].indexOf('https://') === 0) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        listItem.appendChild(link);
        list.appendChild(listItem);
      });
      navigation.appendChild(heading);
      navigation.appendChild(list);
      directory.appendChild(navigation);
    });
    footerGrid.replaceChildren(directory);
  }

  // Pas de bloc d'outils sur la page diagnostic (demande du 30/10)
  if (footer && !root.querySelector('.digital-action-gateway') && location.pathname.indexOf('/diagnostic-visibilite/') !== 0) {
    var gateway = document.createElement('section');
    gateway.className = 'digital-action-gateway';
    gateway.setAttribute('aria-labelledby', 'digital-action-title');
    var wrapper = document.createElement('div');
    wrapper.className = 'w';
    var title = document.createElement('h2');
    title.id = 'digital-action-title';
    title.textContent = '🚀 Passez à la vitesse supérieure !';
    var grid = document.createElement('div');
    grid.className = 'digital-action-grid';
    [
      ['⏳', 'Je perds des heures sur mes factures et devis.',
        'Automatisez avec Relevance AI.', '/outils/'],
      ['🎯', 'Je n’ai pas assez de clients, la prospection est longue.',
        'Trouvez des leads avec Volia.', '/outils/'],
      ['🐌', 'Mon site web est lent et tombe souvent en panne.',
        'Hébergez-le chez Hostinger.', '/outils/']
    ].forEach(function (item) {
      var card = document.createElement('article');
      card.className = 'digital-action-card digital-case-card';
      var problem = document.createElement('h3');
      var icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = item[0] + ' ';
      problem.appendChild(icon);
      problem.appendChild(document.createTextNode('Le problème : ' + item[1]));
      var solution = document.createElement('p');
      solution.className = 'digital-case-solution';
      solution.textContent = 'La solution : ' + item[2];
      var link = document.createElement('a');
      link.className = 'digital-case-link';
      link.href = item[3];
      link.textContent = 'Découvrir l’outil';
      card.appendChild(problem);
      card.appendChild(solution);
      card.appendChild(link);
      grid.appendChild(card);
    });

    var lead = document.createElement('p');
    lead.className = 'digital-action-lead';
    if (/^\/actualites\/[^/]+\/$/.test(location.pathname)) {
      // Fin d'article : accroche chiffrée, avec sa source (Google, Digital Diary, mai 2016).
      lead.appendChild(document.createTextNode('Saviez-vous que 76 % des personnes qui cherchent un commerce à proximité sur leur smartphone s’y rendent dans la journée ('));
      var leadSource = document.createElement('a');
      leadSource.href = 'https://www.thinkwithgoogle.com/_qs/documents/620/mobile-search-trends-consumers-to-stores.pdf';
      leadSource.target = '_blank';
      leadSource.rel = 'noopener';
      leadSource.textContent = 'Google, 2016';
      lead.appendChild(leadSource);
      lead.appendChild(document.createTextNode(') ? Une fiche Google soignée vous aide à capter ce trafic.'));
    } else {
      lead.textContent = 'Les outils que j’utilise pour gagner du temps, trouver des clients et mettre un site en ligne.';
    }
    wrapper.appendChild(title);
    wrapper.appendChild(lead);
    wrapper.appendChild(grid);
    gateway.appendChild(wrapper);
    footer.before(gateway);
  }

  // Badge discret « Les outils que j'utilise » sous le h1, vers /outils/ (sauf pages légales, merci, 404, /outils/)
  var pageH1 = root.querySelector('main h1') || root.querySelector('h1');
  var noToolsLine = /^\/(outils|mentions-legales|politique-de-confidentialite|merci|informations\/cgv|informations\/politique-cookies)\//.test(location.pathname)
    || /404/.test(location.pathname) || document.title.indexOf('404') !== -1;
  if (pageH1 && !noToolsLine && !root.querySelector('.digital-tools-line')) {
    var toolsLine = document.createElement('p');
    toolsLine.className = 'digital-tools-line';
    var toolsBadge = document.createElement('a');
    toolsBadge.className = 'digital-tools-badge';
    toolsBadge.href = '/outils/';
    var bulb = document.createElement('span');
    bulb.setAttribute('aria-hidden', 'true');
    bulb.textContent = '💡 ';
    toolsBadge.appendChild(bulb);
    toolsBadge.appendChild(document.createTextNode('Les outils que j’utilise'));
    toolsLine.appendChild(toolsBadge);
    pageH1.after(toolsLine);
  }

  // Une seule section d'appel à l'action : « Passez à la vitesse supérieure ! ».
  // Les blocs « Passer à l'action » des articles générés sont retirés.
  root.querySelectorAll('.pg-cta').forEach(function (element) {
    if (element.querySelector('a[href="/outils/"]')) element.remove();
  });

  if (!reducedMotion && 'IntersectionObserver' in window) {
    root.classList.add('digital-motion');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    root.querySelectorAll('.digital-reveal').forEach(function (element) {
      observer.observe(element);
    });

    var metrics = root.querySelectorAll('[data-count]');
    var metricObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var element = entry.target;
        element.textContent = element.getAttribute('data-count');
        metricObserver.unobserve(element);
      });
    }, { threshold: 0.6 });
    metrics.forEach(function (element) {
      metricObserver.observe(element);
    });

    var parallaxImages = root.querySelectorAll('[data-parallax]');
    var updateParallax = function () {
      var viewportHeight = window.innerHeight || 1;
      parallaxImages.forEach(function (image) {
        var rect = image.getBoundingClientRect();
        var offset = Math.max(-10, Math.min(10, (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight * -10));
        image.style.setProperty('--parallax-y', offset.toFixed(2) + 'px');
      });
    };
    if (parallaxImages.length) {
      window.addEventListener('scroll', updateParallax, { passive: true });
      window.addEventListener('resize', updateParallax);
      updateParallax();
    }
  } else {
    root.querySelectorAll('.digital-reveal').forEach(function (element) {
      element.classList.add('is-visible');
    });
    root.querySelectorAll('[data-count]').forEach(function (element) {
      element.textContent = element.getAttribute('data-count');
    });
  }
})();

/* AJOUT 29/10 : lien « Pack Google » dans le menu et bloc d'action vers /pack-google-site/ sur chaque page */
(function () {
  'use strict';
  var PACK = '/pack-google-site/';
  var path = location.pathname;
  document.querySelectorAll('nav.menu, #jx-drawer').forEach(function (nav) {
    if (nav.querySelector('a[href="' + PACK + '"]')) return;
    var a = document.createElement('a');
    a.href = PACK; a.textContent = 'Pack Google';
    a.className = 'nav-pack';
    nav.appendChild(a);
  });
  if (path.indexOf(PACK) === 0 || path.indexOf('/diagnostic-visibilite/') === 0 || path === '/' || path === '/index.html') return;
  var foot = document.querySelector('footer.foot') || document.querySelector('footer');
  if (!foot || document.getElementById('pack-cta')) return;
  var s = document.createElement('section');
  s.id = 'pack-cta';
  s.setAttribute('aria-label', 'Pack visibilité Google');
  s.style.cssText = 'background:#0f172a;border-top:1px solid #1e293b;padding:2.4rem 16px;text-align:center;color:#e2e8f0;font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif';
  s.innerHTML =
    '<div style="max-width:720px;margin:0 auto">' +
    '<h2 style="margin:0 0 .6rem;font-size:clamp(1.3rem,3vw,1.7rem);color:#fff">Pas encore de fiche Google ni de site ?</h2>' +
    '<p style="margin:0 0 .4rem">Le Pack visibilité Google crée les deux, à votre nom et entièrement à distance : une fiche Google complète et un site d’une page avec bouton d’appel.</p>' +
    '<p style="margin:0 0 1.2rem;color:#b0b8d4">✓ 390 € net · ✓ Nom de domaine et email inclus · ✓ Site en ligne sous 5 jours ouvrés</p>' +
    '<a href="' + PACK + '" style="display:inline-block;background:#0066ff;color:#fff;font-weight:800;text-decoration:none;border-radius:10px;padding:.85rem 1.4rem">Découvrir le Pack visibilité Google</a>' +
    ' <a href="' + PACK + '#exemples-secteurs" style="display:inline-block;color:#7dd3fc;padding:.85rem .6rem">Voir les exemples par secteur</a>' +
    '</div>';
  foot.parentNode.insertBefore(s, foot);
})();
