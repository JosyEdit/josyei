(function () {
  'use strict';

  var root = document.querySelector('.jx');
  if (!root) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var menuButton = root.querySelector('.burger');
  var drawer = root.querySelector('#jx-drawer');

  // Plus de menu du haut (demande du 30/10) : Accueil (logo), Présentation, Actualités, Google Ads,
  // Expertises et Outils sont dans le pied de page. Retire les anciens liens si une page les a encore
  // (par exemple un article publié avec l'ancien modèle) et masque le bouton Menu devenu vide.
  root.querySelectorAll('nav.menu, #jx-drawer').forEach(function (nav) {
    nav.querySelectorAll('a[href="/"], a[href="/outils/"], a[href="/presentation/"], a[href="/actualites/"], a[href="/pack-google-site/"]').forEach(function (link) { link.remove(); });
  });
  if (menuButton && (!drawer || !drawer.querySelector('a'))) menuButton.style.display = 'none';

  // Haut du site (demande du 30/10) : barre de recherche + lien vers le diagnostic gratuit (page d'accueil).
  var topBar = root.querySelector('header.top .w');
  if (topBar && !topBar.querySelector('.top-tools')) {
    var tools = document.createElement('div');
    tools.className = 'top-tools';
    var form = document.createElement('form');
    form.className = 'top-search';
    form.setAttribute('role', 'search');
    var input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'Rechercher sur le site';
    input.setAttribute('aria-label', 'Rechercher sur le site');
    input.autocomplete = 'off';
    var results = document.createElement('ul');
    results.className = 'top-search-results';
    results.hidden = true;
    form.appendChild(input);
    form.appendChild(results);
    var diag = document.createElement('a');
    diag.className = 'top-diag';
    diag.href = '/';
    diag.textContent = 'Diagnostic gratuit';
    if (location.pathname === '/' || location.pathname === '/index.html') diag.setAttribute('aria-current', 'page');
    tools.appendChild(form);
    tools.appendChild(diag);
    topBar.appendChild(tools);

    var pages = null;
    var normalize = function (text) {
      return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };
    var loadPages = function () {
      if (pages) return Promise.resolve(pages);
      var index = fetch('/assets/recherche.json').then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; });
      // Les articles publiés après la dernière mise à jour de l'index sont repris du flux RSS.
      var feed = fetch('/feed.xml').then(function (r) { return r.ok ? r.text() : ''; }).then(function (xml) {
        if (!xml) return [];
        var doc = new DOMParser().parseFromString(xml, 'application/xml');
        return Array.prototype.map.call(doc.querySelectorAll('item'), function (item) {
          var link = (item.querySelector('link') || {}).textContent || '';
          return { t: (item.querySelector('title') || {}).textContent || '', d: (item.querySelector('description') || {}).textContent || '', u: link.replace(/^https:\/\/josyei\.com/, '') };
        });
      }).catch(function () { return []; });
      return Promise.all([index, feed]).then(function (lists) {
        var seen = {};
        pages = lists[0].concat(lists[1]).filter(function (page) {
          if (!page.u || seen[page.u]) return false;
          seen[page.u] = true;
          return true;
        });
        return pages;
      });
    };
    var search = function () {
      var words = normalize(input.value).split(/\s+/).filter(function (w) { return w.length > 1; });
      if (!words.length) { results.hidden = true; results.replaceChildren(); return Promise.resolve([]); }
      return loadPages().then(function (list) {
        var found = list.map(function (page) {
          var title = normalize(page.t), text = title + ' ' + normalize(page.d);
          var score = 0;
          words.forEach(function (w) { if (text.indexOf(w) !== -1) score += title.indexOf(w) !== -1 ? 3 : 1; else score -= 100; });
          return { page: page, score: score };
        }).filter(function (r) { return r.score > 0; }).sort(function (a, b) { return b.score - a.score; }).slice(0, 6);
        results.replaceChildren();
        if (!found.length) {
          var empty = document.createElement('li');
          empty.className = 'top-search-empty';
          empty.textContent = 'Aucun résultat';
          results.appendChild(empty);
        }
        found.forEach(function (r) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = r.page.u;
          a.textContent = r.page.t;
          li.appendChild(a);
          results.appendChild(li);
        });
        results.hidden = false;
        return found;
      });
    };
    input.addEventListener('input', search);
    input.addEventListener('focus', loadPages);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      search().then(function (found) { if (found.length) location.href = found[0].page.u; });
    });
    document.addEventListener('click', function (event) { if (!form.contains(event.target)) results.hidden = true; });
    input.addEventListener('keydown', function (event) { if (event.key === 'Escape') results.hidden = true; });
  }

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
          ['Agents IA pour le support client', '/expertises/agents-ia-support-client/'],
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
          ['Glossaire de l’IA', '/expertises/glossaire-ia/'],
          ['FAQ (Foire Aux Questions)', '/expertises/faq-ia/'],
          ['Outils & Simulateurs', '/expertises/outils-simulateurs/'],
          ['Outils recommandés', '/outils/'],
          ['Marketing digital', '/expertises/marketing-digital/'],
          ['Visibilité et SEO local', '/visibilite-seo-local/']
        ]
      },
      {
        title: 'ARTISANS DE LA VIENNE',
        links: [
          ['Chauffagistes', '/trouver-clients-chauffagiste-vienne/'],
          ['Couvreurs', '/trouver-clients-couvreur-vienne/'],
          ['Menuisiers', '/trouver-clients-menuisier-vienne/'],
          ['Électriciens', '/trouver-clients-electricien-vienne/'],
          ['Garages', '/trouver-clients-garage-vienne/'],
          ['Plombiers', '/trouver-clients-plombier-vienne/'],
          ['Maçons', '/trouver-clients-macon-vienne/'],
          ['Peintres', '/trouver-clients-peintre-vienne/'],
          ['Carreleurs', '/trouver-clients-carreleur-vienne/'],
          ['Paysagistes', '/trouver-clients-paysagiste-vienne/'],
          ['Serruriers', '/trouver-clients-serrurier-vienne/'],
          ['Charpentiers', '/trouver-clients-charpentier-vienne/'],
          ['Plaquistes et plâtriers', '/trouver-clients-plaquiste-vienne/'],
          ['Terrassiers', '/trouver-clients-terrassier-vienne/'],
          ['Ramoneurs', '/trouver-clients-ramoneur-vienne/']
        ]
      },
      {
        title: 'AUTOUR DE MONTMORILLON',
        links: [
          ['Montmorillon', '/trouver-clients-montmorillon/'],
          ['Lussac-les-Châteaux', '/trouver-clients-lussac-les-chateaux/'],
          ['Chauvigny', '/trouver-clients-chauvigny/'],
          ['Saint-Savin', '/trouver-clients-saint-savin/'],
          ['L’Isle-Jourdain', '/trouver-clients-l-isle-jourdain/'],
          ['Le Blanc', '/trouver-clients-le-blanc/'],
          ['Vivonne', '/trouver-clients-vivonne/'],
          ['Gençay', '/trouver-clients-gencay/'],
          ['Nouaillé-Maupertuis', '/trouver-clients-nouaille-maupertuis/'],
          ['Les 50 communes', '/trouver-clients-autour-de-montmorillon/']
        ]
      },
      {
        title: 'INFORMATIONS',
        links: [
          ['Accueil : diagnostic gratuit', '/'],
          ['Le média : actualités et outils', '/le-media/'],
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
    // Présentation, Actualités et Google Ads, retirées du menu du haut, sont rangées sous le bloc JOSY EI.
    var identityLinks = document.createElement('ul');
    identityLinks.className = 'footer-identity-links';
    [['Présentation', '/presentation/'], ['Actualités', '/actualites/'], ['Google Ads', '/pack-google-site/']].forEach(function (item) {
      var listItem = document.createElement('li');
      var link = document.createElement('a');
      link.href = item[1];
      link.textContent = item[0];
      listItem.appendChild(link);
      identityLinks.appendChild(listItem);
    });
    identity.appendChild(identityTitle);
    identity.appendChild(identityCopy);
    identity.appendChild(identityLinks);
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

  // Pas de bloc d'outils sur la page diagnostic, devenue l'accueil (demandes du 30/10)
  var onDiagnostic = location.pathname === '/' || location.pathname === '/index.html' || location.pathname.indexOf('/diagnostic-visibilite/') === 0;
  if (footer && !root.querySelector('.digital-action-gateway') && !onDiagnostic) {
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
      ['🔎', 'Je ne sais pas si mes clients me trouvent sur Google.',
        'Faites le diagnostic gratuit en 2 minutes.', '/#diagnostic']
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
      link.textContent = item[3] === '/#diagnostic' ? 'Faire le diagnostic' : 'Découvrir l’outil';
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
    || /404/.test(location.pathname) || document.title.indexOf('404') !== -1
    || onDiagnostic; // accueil épuré en trois sections (30/10)
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

/* AJOUT 29/10 : bloc d'action vers /pack-google-site/ sur chaque page (le lien du menu est passé dans le pied de page le 30/10) */
(function () {
  'use strict';
  var PACK = '/pack-google-site/';
  var path = location.pathname;
  if (path.indexOf(PACK) === 0 || path.indexOf('/diagnostic-visibilite/') === 0 || path === '/' || path === '/index.html' || path.indexOf('/le-media/') === 0) return;
  var foot = document.querySelector('footer.foot') || document.querySelector('footer');
  if (!foot || document.getElementById('pack-cta')) return;
  var s = document.createElement('section');
  s.id = 'pack-cta';
  s.setAttribute('aria-label', 'Offres Google');
  s.style.cssText = 'background:#0f172a;border-top:1px solid #1e293b;padding:2.4rem 16px;text-align:center;color:#e2e8f0;font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif';
  s.innerHTML =
    '<div style="max-width:720px;margin:0 auto">' +
    '<h2 style="margin:0 0 .6rem;font-size:clamp(1.3rem,3vw,1.7rem);color:#fff">Être trouvé par les clients de votre ville ?</h2>' +
    '<p style="margin:0 0 .4rem">Site web, fiche Google et publicité Google Ads, mis en place et gérés pour vous, à votre nom et entièrement à distance.</p>' +
    '<p style="margin:0 0 1.2rem;color:#b0b8d4">✓ Diagnostic gratuit en 2 minutes · ✓ Solution adaptée à votre situation · ✓ Tout reste à votre nom</p>' +
    '<a href="/" style="display:inline-block;background:#0066ff;color:#fff;font-weight:800;text-decoration:none;border-radius:10px;padding:.85rem 1.4rem">Faire le diagnostic gratuit</a>' +
    ' <a href="' + PACK + '#offres" style="display:inline-block;color:#7dd3fc;padding:.85rem .6rem">Voir les offres</a>' +
    '</div>';
  foot.parentNode.insertBefore(s, foot);
})();

/* ANIMATIONS 2026 (02/11) : début de page animé, image animée près du titre, boutons 3D,
   apparition au défilement, cartes en relief. Rien ne s'anime si le visiteur a demandé
   « réduire les animations » ; le contenu reste toujours lisible sans script. */
(function () {
  'use strict';
  var root = document.querySelector('.jx');
  if (!root) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var main = root.querySelector('main') || root;
  var svgNS = 'http://www.w3.org/2000/svg';

  // 1. Début de page : le premier bloc qui contient le titre reçoit le fond animé.
  var h1 = main.querySelector('h1');
  var hero = h1 && (h1.closest('section, header:not(.top), .hero, .ac-hero') || h1.parentElement);
  if (hero && hero !== main && !hero.classList.contains('ax-hero')) {
    hero.classList.add('ax-hero');
    if (!reduce) {
      var aurora = document.createElement('div');
      aurora.className = 'ax-aurora';
      aurora.setAttribute('aria-hidden', 'true');
      aurora.innerHTML = '<i></i><i></i><i></i><b></b><b></b><b></b><b></b><b></b>';
      hero.insertBefore(aurora, hero.firstChild);
    }
    // Image animée du titre (radar), sauf si la page a déjà son illustration.
    if (!hero.querySelector('.ax-emblem, svg, img:not([width="32"])')) {
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 120 120');
      svg.setAttribute('class', 'ax-emblem ax-emblem-float');
      svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = '<defs><radialGradient id="axfg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#00d4ff" stop-opacity=".35"/><stop offset="1" stop-color="#00d4ff" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="axfs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#00d4ff" stop-opacity="0"/><stop offset="1" stop-color="#00d4ff" stop-opacity=".55"/></linearGradient></defs>' +
        '<circle cx="60" cy="60" r="56" fill="url(#axfg)"/><circle cx="60" cy="60" r="56" fill="none" stroke="#1d4ed8" stroke-width="1"/><circle cx="60" cy="60" r="36" fill="none" stroke="#1d4ed8" stroke-width="1" stroke-dasharray="3 4"/>' +
        '<circle class="ax-ring" cx="60" cy="60" r="56"/><circle class="ax-ring" cx="60" cy="60" r="56"/><circle class="ax-ring" cx="60" cy="60" r="56"/>' +
        '<path class="ax-sweep" d="M60 60 L116 60 A56 56 0 0 0 99.6 20.4 Z" fill="url(#axfs)"/>' +
        '<circle class="ax-dot" cx="34" cy="38" r="3" fill="#22c55e"/><circle class="ax-dot" cx="88" cy="80" r="3" fill="#22c55e"/><circle class="ax-dot" cx="80" cy="34" r="2.5" fill="#7dd3fc"/><circle class="ax-dot" cx="30" cy="84" r="2.5" fill="#7dd3fc"/>' +
        '<g class="ax-pin"><path d="M60 34c-8.3 0-15 6.6-15 14.8C45 60 60 74 60 74s15-14 15-25.2C75 40.6 68.3 34 60 34z" fill="#0066ff" stroke="#fff" stroke-width="2"/><circle cx="60" cy="49" r="5.5" fill="#fff"/></g>';
      var firstContent = hero.querySelector(':scope > .ax-aurora');
      hero.insertBefore(svg, firstContent ? firstContent.nextSibling : hero.firstChild);
    }
  }
  if (h1 && !h1.querySelector('*:not(br)') && !h1.classList.contains('ax-shine')) h1.classList.add('ax-shine');

  // 2. Boutons 3D (le premier bouton du début de page « respire » pour attirer l'œil).
  var buttons = root.querySelectorAll('.btn, .ex-btn, .ac-go, .top-diag, .modal-btn, .digital-case-link, .dg-id-btn, #pack-cta a, .pg-cta a, .ax-btn');
  buttons.forEach(function (b) {
    b.classList.add('ax-b3d');
    if (b.classList.contains('btn-s') || b.classList.contains('sec') || (b.closest('#pack-cta') && b.previousElementSibling)) b.classList.add('ax-ghost');
  });
  var mainBtn = hero && hero.querySelector('.ax-b3d');
  if (mainBtn && !reduce) mainBtn.classList.add('ax-main');
  var sticky = root.querySelector('.ex-sticky');
  if (sticky && !reduce) sticky.classList.add('ax-main');

  // 3. Sous-titres avec barre lumineuse.
  main.querySelectorAll('h2').forEach(function (h) {
    if (h.closest('.modal-box, #page-resultats, .top-search') || h.querySelector('a')) return;
    if (getComputedStyle(h).textAlign === 'center') h.classList.add('ax-h2');
  });

  if (reduce || !('IntersectionObserver' in window)) return;
  root.classList.add('ax-on');

  // 4. Apparition au défilement, en cascade, seulement sous la ligne de flottaison.
  var selectors = 'main h2, main .card, main .ex-card, main .ac-card, main .steps li, main .faq details, main .note, main .ex-proof, main .ex-trust > div, main .ex-reas li, main .grid > *, main .ax-city, main article, .digital-action-card, footer.foot nav, footer.foot section, #pack-cta > div';
  var fold = window.innerHeight || 800;
  var seen = [];
  root.querySelectorAll(selectors).forEach(function (el) {
    if (el.closest('.modal-box, #page-resultats, .ax-hero, [hidden]')) return;
    if (seen.some(function (p) { return p.contains(el); })) return;
    if (el.getBoundingClientRect().top < fold * 0.92) return;
    seen.push(el);
    var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.setProperty('--ax-d', Math.min(siblings, 6) * 0.07 + 's');
    el.classList.add('ax-rv');
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('ax-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -6% 0px' });
  root.querySelectorAll('.ax-rv, .ax-h2').forEach(function (el) { io.observe(el); });
  // Sécurité : tout est affiché au bout de 4 s quoi qu'il arrive (impression, robots, onglet caché).
  setTimeout(function () { root.querySelectorAll('.ax-rv, .ax-h2').forEach(function (el) { el.classList.add('ax-in'); }); }, 4000);
  window.addEventListener('beforeprint', function () { root.classList.remove('ax-on'); });

  // 5. Relief qui suit la souris (ordinateur uniquement) pour cartes et boutons.
  if (!finePointer) return;
  var tiltTargets = root.querySelectorAll('main .card, main .ex-card, main .ac-card, main .ax-city, .digital-action-card');
  tiltTargets.forEach(function (el) { el.classList.add('ax-tilt'); });
  var bind = function (el, max) {
    el.addEventListener('pointermove', function (ev) {
      var r = el.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
      el.style.setProperty('--ax-ry', ((x - 0.5) * max).toFixed(2) + 'deg');
      el.style.setProperty('--ax-rx', ((0.5 - y) * max).toFixed(2) + 'deg');
      el.style.setProperty('--ax-mx', (x * 100).toFixed(1) + '%');
      el.style.setProperty('--ax-my', (y * 100).toFixed(1) + '%');
    });
    el.addEventListener('pointerleave', function () {
      el.style.setProperty('--ax-rx', '0deg');
      el.style.setProperty('--ax-ry', '0deg');
    });
  };
  tiltTargets.forEach(function (el) { bind(el, 7); });
  root.querySelectorAll('.ax-b3d:not(.ex-sticky)').forEach(function (el) { bind(el, 12); });
})();

/* IMAGES ANIMÉES DES SECTIONS (02/11) : une petite illustration animée au-dessus du titre de chaque section,
   choisie d'après le sujet du titre. Rien n'est retiré de la page ; décoratif (aria-hidden). */
(function () {
  'use strict';
  var root = document.querySelector('.jx');
  if (!root) return;
  var main = root.querySelector('main') || root;
  var G = '<defs><linearGradient id="axIcoG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0066ff"/><stop offset="1" stop-color="#00d4ff"/></linearGradient></defs>';
  var S = 'fill="none" stroke="url(#axIcoG)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"';
  var icons = {
    loupe: '<circle cx="32" cy="32" r="26" class="ax-ico-bg"/><g class="ax-i-loupe"><circle cx="28" cy="28" r="11" ' + S + '/><path d="M36 36l10 10" ' + S + '/></g><circle class="ax-i-tw" cx="16" cy="18" r="1.8" fill="#7dd3fc"/><circle class="ax-i-tw" cx="48" cy="20" r="1.5" fill="#22c55e"/>',
    prix: '<circle cx="32" cy="32" r="26" class="ax-ico-bg"/><g class="ax-i-flip"><circle cx="32" cy="32" r="15" ' + S + '/><path d="M37 25.5a8 8 0 1 0 0 13M24 30h10M24 34.5h10" ' + S + ' stroke-width="2.6"/></g>',
    etapes: '<circle cx="32" cy="32" r="26" class="ax-ico-bg"/><rect class="ax-i-bar" x="17" y="34" width="7" height="12" rx="2" fill="url(#axIcoG)"/><rect class="ax-i-bar" x="28.5" y="27" width="7" height="19" rx="2" fill="url(#axIcoG)"/><rect class="ax-i-bar" x="40" y="19" width="7" height="27" rx="2" fill="url(#axIcoG)"/>',
    question: '<circle cx="32" cy="32" r="26" class="ax-ico-bg"/><path d="M16 22a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v13a6 6 0 0 1-6 6H29l-8 7v-7h0a6 6 0 0 1-5-6z" ' + S + '/><circle class="ax-i-dot" cx="25" cy="28.5" r="2.4" fill="#00d4ff"/><circle class="ax-i-dot" cx="32" cy="28.5" r="2.4" fill="#00d4ff"/><circle class="ax-i-dot" cx="39" cy="28.5" r="2.4" fill="#00d4ff"/>',
    zone: '<circle cx="32" cy="32" r="26" class="ax-ico-bg"/><circle class="ax-i-ring" cx="32" cy="44" r="12" fill="none" stroke="#00d4ff" stroke-width="1.6"/><g class="ax-i-bob"><path d="M32 13c-6.6 0-12 5.2-12 11.7C20 33.5 32 45 32 45s12-11.5 12-20.3C44 18.2 38.6 13 32 13z" ' + S + '/><circle cx="32" cy="25" r="4" fill="#00d4ff"/></g>',
    confiance: '<circle cx="32" cy="32" r="26" class="ax-ico-bg"/><path d="M32 12l16 6v12c0 10-7 17.5-16 21-9-3.5-16-11-16-21V18z" ' + S + '/><path class="ax-i-draw" d="M24.5 31.5l5.5 5.5 10-11" ' + S + ' stroke="#22c55e"/>',
    chiffres: '<circle cx="32" cy="32" r="26" class="ax-ico-bg"/><path d="M15 46h34M15 46V16" ' + S + ' stroke-width="2.4"/><path class="ax-i-draw" d="M19 40l8-9 7 5 11-14" ' + S + '/><circle class="ax-i-dot" cx="45" cy="22" r="3" fill="#22c55e"/>',
    reglages: '<circle cx="32" cy="32" r="26" class="ax-ico-bg"/><g class="ax-i-spin" style="transform-origin:26px 28px"><circle cx="26" cy="28" r="6" ' + S + '/><path d="M26 16v4M26 36v4M14 28h4M34 28h4M17.5 19.5l2.8 2.8M31.7 33.7l2.8 2.8M17.5 36.5l2.8-2.8M31.7 22.3l2.8-2.8" ' + S + ' stroke-width="2.6"/></g><g class="ax-i-spinr" style="transform-origin:42px 42px"><circle cx="42" cy="42" r="4" ' + S + ' stroke-width="2.4"/><path d="M42 34.5v2.5M42 47v2.5M34.5 42h2.5M47 42h2.5" ' + S + ' stroke-width="2.4"/></g>',
    ia: '<circle cx="32" cy="32" r="26" class="ax-ico-bg"/><rect x="20" y="20" width="24" height="24" rx="5" ' + S + '/><path d="M26 14v6M32 14v6M38 14v6M26 44v6M32 44v6M38 44v6M14 26h6M14 32h6M14 38h6M44 26h6M44 32h6M44 38h6" ' + S + ' stroke-width="2.2"/><circle class="ax-i-dot" cx="32" cy="32" r="4.5" fill="#00d4ff"/>',
    contact: '<circle cx="32" cy="32" r="26" class="ax-ico-bg"/><rect x="15" y="21" width="34" height="23" rx="4" ' + S + '/><path class="ax-i-flap" d="M16 23l16 12 16-12" ' + S + '/>',
    appel: '<circle cx="32" cy="32" r="26" class="ax-ico-bg"/><g class="ax-i-ring2"><path d="M22 15h6l3 8-4 3a20 20 0 0 0 11 11l3-4 8 3v6a4 4 0 0 1-4 4C29 46 18 35 18 19a4 4 0 0 1 4-4z" ' + S + '/></g><path class="ax-i-wave" d="M38 16a10 10 0 0 1 10 10M38 22a4 4 0 0 1 4 4" ' + S + ' stroke-width="2.4"/>',
    eclat: '<circle cx="32" cy="32" r="26" class="ax-ico-bg"/><path class="ax-i-star" d="M32 14l4.5 11.5L48 30l-11.5 4.5L32 46l-4.5-11.5L16 30l11.5-4.5z" ' + S + '/><circle class="ax-i-tw" cx="47" cy="17" r="2" fill="#7dd3fc"/><circle class="ax-i-tw" cx="18" cy="46" r="1.8" fill="#22c55e"/>'
  };
  var rules = [
    ['question', /question|faq|vous vous demandez/],
    ['prix', /prix|€|co[uû]t|tarif|combien|offre|abonnement|paiement/],
    ['chiffres', /chiffre|r[ée]sultat|rapport|donn[ée]es|statisti|bilan|diagnostic|mesure/],
    ['etapes', /comment|[ée]tape|m[ée]thode|d[ée]marr|par o[uù]|commencer/],
    ['loupe', /recherch|google|tapent|trouv|visibilit|seo|cherch/],
    ['appel', /appel|t[ée]l[ée]phone|d[ée]pannage|aujourd|se passe|urgence/],
    ['zone', /zone|ville|commune|autour|o[uù] se trouv|carte|proche|r[ée]gion|vienne|montmorillon|poitiers/],
    ['confiance', /savoir|confiance|garantie|s[ée]curit|avec qui|engagement|rgpd|l[ée]gal|protection/],
    ['ia', /\bia\b|intelligence|agent|automatis|robot|chatbot|llm/],
    ['contact', /contact|e-?mail|[ée]crire|message|linkedin/],
    ['reglages', /mets en place|mise en place|outil|service|expertise|ce que je|compris|solution|fonctionn/]
  ];
  var defaults = ['eclat', 'ia', 'reglages', 'chiffres'];
  var count = 0;
  var pick = function (text) {
    var t = (text || '').toLowerCase();
    for (var i = 0; i < rules.length; i++) if (rules[i][1].test(t)) return rules[i][0];
    return defaults[count++ % defaults.length];
  };
  var heads = main.querySelectorAll('h2');
  Array.prototype.forEach.call(heads, function (h) {
    if (h.closest('.modal-box, #page-resultats, .top-search, .ax-hero, [hidden], details, nav')) return;
    var prev = h.previousElementSibling;
    if (prev && (prev.matches('svg, img, picture, figure, .ax-ico') || prev.querySelector && prev.querySelector('svg, img'))) return;
    var box = h.closest('section, article, div') || h.parentElement;
    var first = box && box.querySelector('svg, img');
    if (first && (first.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_FOLLOWING) && !first.closest('.ax-ico') && box.contains(first) && first.getBoundingClientRect().top < h.getBoundingClientRect().top && Math.abs(first.getBoundingClientRect().top - h.getBoundingClientRect().top) < 200) return;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 64 64');
    svg.setAttribute('width', '60');
    svg.setAttribute('height', '60');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var kind = pick(h.textContent);
    svg.setAttribute('class', 'ax-ico ax-ico-' + kind);
    svg.innerHTML = G + icons[kind];
    var align = getComputedStyle(h).textAlign;
    if (align === 'left' || align === 'start') svg.classList.add('ax-ico-left');
    h.parentNode.insertBefore(svg, h);
  });
})();

// Urgences vraies (02/11/2026) : bandeau tournant + bloc « Pourquoi maintenant ».
// Règle : uniquement des faits vrais calculés en direct (date du jour, saison, échéance légale
// réelle du 1er septembre 2027). Aucun faux compte à rebours, aucune fausse rareté, aucun chiffre inventé.
(function () {
  'use strict';
  var root = document.querySelector('.jx');
  if (!root) return;
  var path = location.pathname;
  if (/mentions-legales|politique-de-confidentialite|informations|merci/.test(path)) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var now = new Date();
  var jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  var mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var auj = jours[now.getDay()] + ' ' + now.getDate() + (now.getDate() === 1 ? 'er' : '') + ' ' + mois[now.getMonth()];
  var m = now.getMonth();
  var saison;
  if (m >= 10 || m <= 1) saison = 'L’hiver arrive : pannes de chauffage, fuites de toit, dépannages… les gens cherchent sur Google le jour où le problème arrive.';
  else if (m <= 4) saison = 'Le printemps arrive : travaux, rénovations et entretien se décident maintenant, souvent après une recherche Google.';
  else if (m <= 7) saison = 'L’été : les clients qui préparent la rentrée cherchent dès maintenant qui appeler.';
  else saison = 'La rentrée : les projets de l’automne et de l’hiver se décident maintenant.';
  var echeance = new Date(2027, 8, 1);
  var restant = Math.ceil((echeance - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
  var diag = '/#diagnostic';

  var msgs = [
    { t: 'Aujourd’hui, ' + auj + ' : un client qui cherche aujourd’hui appelle celui qu’il trouve aujourd’hui.', a: 'Voir si on vous trouve', h: diag },
    { t: saison, a: 'Faire le diagnostic gratuit', h: diag }
  ];
  if (restant > 0) msgs.push({ t: 'Facture électronique : plus que ' + restant + ' jours avant le 1er septembre 2027, date où les petites entreprises devront l’émettre.', a: 'La check-list', h: '/facturation-electronique-tpe-vienne/' });
  msgs.push({ t: 'Je travaille seul : je suis un nombre limité d’entreprises en même temps.', a: 'Commencer par le diagnostic', h: diag });

  // 1. Bandeau en haut de page (fermable, mémorisé pour la visite)
  var ferme = false;
  try { ferme = sessionStorage.getItem('ux-band-off') === '1'; } catch (e) {}
  if (!ferme) {
    var band = document.createElement('div');
    band.className = 'ux-band';
    band.setAttribute('role', 'region');
    band.setAttribute('aria-label', 'À savoir aujourd’hui');
    band.innerHTML = '<span class="ux-dot" aria-hidden="true"></span><p class="ux-msg" aria-live="polite"></p><a class="ux-cta"></a><button type="button" class="ux-x" aria-label="Fermer">×</button>';
    root.insertBefore(band, root.firstChild);
    var p = band.querySelector('.ux-msg'), a = band.querySelector('.ux-cta'), i = 0;
    var show = function () {
      var x = msgs[i % msgs.length];
      p.classList.remove('ux-in');
      void p.offsetWidth;
      p.textContent = x.t; a.textContent = x.a + ' →'; a.href = x.h;
      p.classList.add('ux-in');
      i++;
    };
    show();
    if (!reduce) {
      var timer = setInterval(show, 7000);
      band.addEventListener('mouseenter', function () { clearInterval(timer); });
      band.addEventListener('mouseleave', function () { timer = setInterval(show, 7000); });
    }
    band.querySelector('.ux-x').addEventListener('click', function () {
      band.remove();
      try { sessionStorage.setItem('ux-band-off', '1'); } catch (e) {}
    });
  }

  // 2. Bloc « Pourquoi maintenant » : accueil, page offres et pages trouver-clients
  var main = root.querySelector('main');
  if (!main || !(path === '/' || /^\/(index\.html)?$|pack-google-site|trouver-clients|diagnostic-visibilite/.test(path))) return;
  var box = document.createElement('section');
  box.className = 'ux-now';
  box.setAttribute('aria-labelledby', 'ux-now-t');
  box.innerHTML =
    '<div class="ux-now-in">' +
    '<p class="ux-kick"><span class="ux-dot" aria-hidden="true"></span>' + auj.charAt(0).toUpperCase() + auj.slice(1) + '</p>' +
    '<h2 id="ux-now-t">Pourquoi s’en occuper maintenant</h2>' +
    '<div class="ux-grid">' +
    '<div class="ux-card"><b class="ux-big">Aujourd’hui</b><p>Quand quelqu’un a besoin d’un professionnel, il cherche sur Google et appelle souvent l’un des premiers qu’il voit. Ce qui n’est pas visible aujourd’hui ne reçoit pas l’appel d’aujourd’hui.</p></div>' +
    '<div class="ux-card"><b class="ux-big">La saison</b><p>' + saison + '</p></div>' +
    (restant > 0 ? '<div class="ux-card"><b class="ux-big"><span class="ux-count" data-n="' + restant + '">' + (reduce ? restant : 0) + '</span> jours</b><p>avant le 1er septembre 2027 : les petites entreprises devront émettre leurs factures au format électronique. <a href="/facturation-electronique-tpe-vienne/">Voir la check-list</a></p></div>' : '') +
    '</div>' +
    '<p class="ux-note">Je travaille seul et je suis un nombre limité d’entreprises en même temps. Le diagnostic est gratuit et le résultat s’affiche tout de suite.</p>' +
    '<a class="ux-go" href="' + diag + '">Faire mon diagnostic gratuit →</a>' +
    '</div>';
  var diagSec = main.querySelector('#diagnostic');
  if (diagSec) diagSec.parentNode.insertBefore(box, diagSec);
  else main.appendChild(box);
  if (path === '/' || /^\/index\.html$/.test(path)) box.querySelector('.ux-go').href = '#diagnostic';

  var c = box.querySelector('.ux-count');
  if (c && !reduce) {
    var run = function () {
      var n = +c.dataset.n, t0 = null;
      var step = function (ts) {
        if (!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / 1400);
        c.textContent = Math.round(n * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { run(); io.disconnect(); } });
      }, { threshold: 0.4 });
      io.observe(c);
    } else run();
    setTimeout(function () { if (c.textContent === '0') c.textContent = c.dataset.n; }, 4000);
  }
})();

/* Fenêtre « Votre métier ? » : un clic sur le bouton SMS ouvre des cases d'un mot,
   chaque case ouvre l'application SMS avec un message déjà écrit. Rien n'est envoyé ni stocké par le site. */
(function () {
  var btns = document.querySelectorAll('a.smsb-btn[href^="sms:"]');
  if (!btns.length) return;
  var M = [
    ['Plombier', 'je suis plombier'], ['Électricien', 'je suis électricien'], ['Maçon', 'je suis maçon'],
    ['Peintre', 'je suis peintre'], ['Carreleur', 'je suis carreleur'], ['Couvreur', 'je suis couvreur'],
    ['Menuisier', 'je suis menuisier'], ['Charpentier', 'je suis charpentier'], ['Chauffagiste', 'je suis chauffagiste'],
    ['Plaquiste', 'je suis plaquiste'], ['Paysagiste', 'je suis paysagiste'], ['Serrurier', 'je suis serrurier'],
    ['Terrassier', 'je suis terrassier'], ['Ramoneur', 'je suis ramoneur'], ['Garage', 'j’ai un garage'],
    ['Commerce', 'j’ai un commerce'], ['Restaurant', 'j’ai un restaurant']
  ];
  var css = '.smm{position:fixed;inset:0;z-index:100000;display:none;align-items:flex-end;justify-content:center;background:rgba(2,6,23,.72)}' +
    '.smm.on{display:flex}@media(min-width:640px){.smm{align-items:center}}' +
    '.smm-b{width:100%;max-width:34rem;max-height:90vh;overflow:auto;box-sizing:border-box;background:linear-gradient(135deg,#0b1a3d,#062b45);border:1px solid #00b4ff66;border-radius:20px 20px 0 0;padding:1.4rem 1.1rem 1.2rem;color:#e2e8f0;text-align:center;box-shadow:0 -10px 40px -10px #00b4ff88}' +
    '@media(min-width:640px){.smm-b{border-radius:20px}}' +
    '.smm-t{margin:0 0 .3rem;font-size:1.25rem;font-weight:800;color:#fff}.smm-s{margin:0 0 1rem;color:#cbd5e1;font-size:.95rem}' +
    '.smm-g{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center}' +
    '.smm-c{display:inline-block;padding:.65rem 1rem;border-radius:999px;border:1px solid #38bdf8;background:#0f2a4a;color:#fff!important;font-weight:700;font-size:1rem;text-decoration:none!important;transition:background .15s,transform .15s}' +
    '.smm-c:hover,.smm-c:focus-visible{background:#0066ff;transform:translateY(-1px)}.smm-c.cur{background:#0066ff;border-color:#7dd3fc}' +
    '.smm-c.autre{background:transparent;border-style:dashed}' +
    '.smm-x{margin-top:1rem;background:none;border:0;color:#94a3b8;font-size:.95rem;text-decoration:underline;cursor:pointer}' +
    '.smm-h{margin:.9rem 0 0;color:#7dd3fc;font-size:.85rem}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var box = document.createElement('div'); box.className = 'smm'; box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'smm-t');
  box.innerHTML = '<div class="smm-b"><p class="smm-t" id="smm-t">Votre métier ?</p>' +
    '<p class="smm-s">Touchez votre métier : le SMS s’ouvre, déjà écrit. Il ne reste qu’à l’envoyer.</p>' +
    '<div class="smm-g"></div><p class="smm-h">Gratuit, sans engagement. Rien n’est stocké sur le site.</p>' +
    '<button type="button" class="smm-x">Fermer</button></div>';
  document.body.appendChild(box);
  var grid = box.querySelector('.smm-g'), last = null;
  function close() { box.classList.remove('on'); if (last) last.focus(); }
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  box.querySelector('.smm-x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('on')) close(); });
  var page = (location.pathname.match(/trouver-clients-([a-z]+)-vienne/) || [])[1] || '';
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function open(a) {
    last = a;
    var href = a.getAttribute('href'), orig = '';
    try { orig = decodeURIComponent((href.split('body=')[1] || '')); } catch (e) {}
    var ville = (orig.match(/mon entreprise est (à|au|aux) ([^,]+),/) || []);
    var lieu = ville[2] ? ', mon entreprise est ' + ville[1] + ' ' + ville[2] : '';
    grid.innerHTML = '';
    M.forEach(function (m) {
      var c = document.createElement('a'); c.className = 'smm-c' + (page && norm(m[0]) === page ? ' cur' : '');
      c.textContent = m[0];
      c.href = 'sms:+33759168260?&body=' + encodeURIComponent('Bonjour Josy, ' + m[1] + lieu +
        '. Je veux mon diagnostic gratuit. ' + (lieu ? 'Son nom : ' : 'Mon entreprise : '));
      if (c.className.indexOf('cur') > 0) grid.insertBefore(c, grid.firstChild); else grid.appendChild(c);
    });
    var o = document.createElement('a'); o.className = 'smm-c autre'; o.textContent = 'Autre'; o.href = href;
    grid.appendChild(o);
    box.classList.add('on'); grid.firstChild.focus();
  }
  btns.forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); open(a); }); });
})();
