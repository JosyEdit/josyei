(function () {
  'use strict';

  var root = document.querySelector('.jx');
  if (!root) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var menuButton = root.querySelector('.burger');
  var drawer = root.querySelector('#jx-drawer');

  var expertiseGroups = [
    {
      title: 'IA & automatisation',
      links: [
        ['Intelligence artificielle pour PME', '/expertises/intelligence-artificielle-pme/'],
        ['Automatisation des processus', '/expertises/automatisation-processus/'],
        ['Agents IA et support client', '/expertises/agents-ia-support-client/'],
        ['Conseil en systèmes informatiques', '/expertises/conseil-systemes-informatiques/'],
        ['No-code et low-code', '/expertises/developpement-no-code-low-code/']
      ]
    },
    {
      title: 'Solutions métiers',
      links: [
        ['Digitalisation des artisans', '/expertises/digitalisation-artisans/'],
        ['IA pour indépendants', '/expertises/solutions-ia-independants/'],
        ['Productivité des TPE', '/expertises/gain-productivite-tpe/'],
        ['Transformation digitale locale', '/expertises/transformation-digitale-locale/'],
        ['Marketing digital', '/expertises/marketing-digital/']
      ]
    },
    {
      title: 'SEO local & conseil',
      links: [
        ['Conseil en intelligence artificielle', '/expertises/conseil-intelligence-artificielle/'],
        ['Conseil informatique dans la Vienne', '/expertises/conseil-informatique-vienne/'],
        ['Freelance informatique en Nouvelle-Aquitaine', '/expertises/freelance-informatique-nouvelle-aquitaine/'],
        ['Audit numérique d’entreprise', '/expertises/audit-numerique-entreprise/'],
        ['Création de sites web', '/expertises/creation-sites-web/'],
        ['Toutes les expertises', '/expertises/']
      ]
    }
  ];

  var desktopMenu = root.querySelector('.menu');
  if (desktopMenu && !desktopMenu.querySelector('.expertise-nav')) {
    var expertiseMenu = document.createElement('details');
    expertiseMenu.className = 'expertise-nav';
    var expertiseSummary = document.createElement('summary');
    expertiseSummary.textContent = 'Expertises';
    expertiseMenu.appendChild(expertiseSummary);
    var expertisePanel = document.createElement('div');
    expertiseGroups.forEach(function (group) {
      var section = document.createElement('section');
      var heading = document.createElement('h2');
      heading.textContent = group.title;
      section.appendChild(heading);
      group.links.forEach(function (item) {
        var link = document.createElement('a');
        link.href = item[1];
        link.textContent = item[0];
        section.appendChild(link);
      });
      expertisePanel.appendChild(section);
    });
    expertiseMenu.appendChild(expertisePanel);
    var newsLink = desktopMenu.querySelector('a[href="/actualites/"]');
    if (newsLink) newsLink.after(expertiseMenu);
    else desktopMenu.appendChild(expertiseMenu);
  }

  if (menuButton && drawer) {
    if (!drawer.querySelector('.expertise-drawer-group')) {
      var mobileGroup = document.createElement('div');
      mobileGroup.className = 'expertise-drawer-group';
      var mobileHeading = document.createElement('strong');
      mobileHeading.textContent = 'Expertises';
      mobileGroup.appendChild(mobileHeading);
      expertiseGroups.forEach(function (group) {
        group.links.forEach(function (item) {
          if (drawer.querySelector('a[href="' + item[1] + '"]')) return;
          var link = document.createElement('a');
          link.href = item[1];
          link.textContent = item[0];
          mobileGroup.appendChild(link);
        });
      });
      var mobileNewsLink = drawer.querySelector('a[href="/actualites/"]');
      if (mobileNewsLink) mobileNewsLink.after(mobileGroup);
      else drawer.appendChild(mobileGroup);
    }

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
          ['Formation IA & Acculturation', '/formation-accompagnement/']
        ]
      },
      {
        title: 'MÉTIERS & CIBLES',
        links: [
          ['IA pour les Artisans', '/expertises/digitalisation-artisans/'],
          ['IA pour les Indépendants', '/expertises/solutions-ia-independants/'],
          ['IA pour les TPE & PME', '/expertises/ia-pour-tpe-pme/'],
          ['IA pour les Professions Libérales', '/expertises/ia-pour-professions-liberales/'],
          ['Expert IA Montmorillon (86)', '/expertises/expert-ia-montmorillon-vienne/']
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
    identityCopy.textContent = 'Conseil en systèmes informatiques, automatisation et IA pour les TPE, PME, artisans et indépendants.';
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

  if (footer && !root.querySelector('.digital-action-gateway')) {
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
      ['Je perds des heures sur mes factures et devis.',
        'Automatisez avec Relevance AI.', 'https://relevanceai.com?via=josyei'],
      ['Je n’ai pas assez de clients, la prospection est longue.',
        'Trouvez des leads avec Volia.', 'https://volia.fr/signup?ref=BgzXx5'],
      ['Mon site web est lent et tombe souvent en panne.',
        'Hébergez-le chez Hostinger.', 'https://www.hostinger.com?REFERRALCODE=INPMRJOSYASH']
    ].forEach(function (item) {
      var card = document.createElement('article');
      card.className = 'digital-action-card digital-case-card';
      var problem = document.createElement('h3');
      var icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '😩 ';
      problem.appendChild(icon);
      problem.appendChild(document.createTextNode('Le problème : ' + item[0]));
      var solution = document.createElement('p');
      solution.className = 'digital-case-solution';
      solution.textContent = 'La solution : ' + item[1];
      var link = document.createElement('a');
      link.className = 'digital-case-link';
      link.href = item[2];
      link.target = '_blank';
      link.rel = 'sponsored noopener';
      link.textContent = 'Découvrir l’outil';
      card.appendChild(problem);
      card.appendChild(solution);
      card.appendChild(link);
      grid.appendChild(card);
    });
    var caseNote = document.createElement('p');
    caseNote.className = 'digital-affiliate-note digital-case-note';
    caseNote.textContent = 'Liens affiliés : JOSY EI peut percevoir une commission.';
    var lead = document.createElement('p');
    lead.className = 'digital-action-lead';
    lead.textContent = 'Les outils que j’utilise pour gagner du temps, trouver des clients et mettre un site en ligne.';
    wrapper.appendChild(title);
    wrapper.appendChild(lead);
    wrapper.appendChild(grid);
    wrapper.appendChild(caseNote);
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

  // Outils recommandés (liens d'affiliation) : sous la section d'action, en bas des articles. Mention d'affiliation visible au-dessus des cartes (obligation légale).
  var isArticle = /^\/actualites\/[^/]+\/$/.test(location.pathname) && root.querySelector('.digital-article');
  var actionGateway = root.querySelector('.digital-action-gateway');
  if (actionGateway && isArticle && !root.querySelector('.digital-affiliate')) {
    var affiliate = document.createElement('section');
    affiliate.className = 'digital-affiliate';
    affiliate.setAttribute('aria-labelledby', 'digital-affiliate-title');
    var affiliateWrapper = document.createElement('div');
    affiliateWrapper.className = 'w';
    var affiliateTitle = document.createElement('h2');
    affiliateTitle.id = 'digital-affiliate-title';
    affiliateTitle.textContent = 'Les outils que je recommande';
    var affiliateNote = document.createElement('p');
    affiliateNote.className = 'digital-affiliate-note';
    affiliateNote.textContent = 'Lien affilié : JOSY EI peut percevoir une commission.';
    var affiliateGrid = document.createElement('div');
    affiliateGrid.className = 'digital-affiliate-grid';
    [
      ['🚀', 'Boostez votre site avec Hostinger',
        'Hébergement web et services associés pour mettre votre site en ligne.',
        'Découvrir Hostinger', 'https://www.hostinger.com?REFERRALCODE=INPMRJOSYASH'],
      ['🧠', 'Créez votre agent IA avec Relevance AI',
        'Créez et déployez des agents IA personnalisés pour automatiser vos processus et votre support client.',
        'Découvrir Relevance AI', 'https://relevanceai.com?via=josyei'],
      ['🎯', 'Prospectez avec Volia',
        'Outil français de prospection B2B pour trouver des leads qualifiés et rédiger vos emails de prospection.',
        'Découvrir Volia', 'https://volia.fr/signup?ref=BgzXx5']
    ].forEach(function (item) {
      var card = document.createElement('article');
      card.className = 'digital-affiliate-card';
      var cardTitle = document.createElement('h3');
      var icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = item[0];
      cardTitle.appendChild(icon);
      cardTitle.appendChild(document.createTextNode(' ' + item[1]));
      var cardText = document.createElement('p');
      cardText.textContent = item[2];
      var cardLink = document.createElement('a');
      cardLink.className = 'digital-affiliate-link';
      cardLink.href = item[4];
      cardLink.target = '_blank';
      cardLink.rel = 'sponsored noopener';
      cardLink.textContent = item[3];
      card.appendChild(cardTitle);
      card.appendChild(cardText);
      card.appendChild(cardLink);
      affiliateGrid.appendChild(card);
    });
    affiliateWrapper.appendChild(affiliateTitle);
    affiliateWrapper.appendChild(affiliateNote);
    affiliateWrapper.appendChild(affiliateGrid);
    affiliate.appendChild(affiliateWrapper);
    actionGateway.after(affiliate);
  }

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
