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
