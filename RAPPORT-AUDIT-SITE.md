# Rapport d’audit du site JOSY EI

**Périmètre :** dossier `website-deploy-work`
**Date de l’audit :** 23 octobre 2026
**Méthode :** inventaire des fichiers HTML, lecture des titres, méta-descriptions, titres de sections et références d’images, puis contrôle des balises de formulaire, CTA, Open Graph, sitemaps et encodage.

## 1. Arborescence

Le site contient **38 fichiers HTML** : 24 pages principales et 14 fichiers sous `actualites/` (index, 12 articles et une ancienne archive).

```text
website-deploy-work/
├── 404.html
├── index.html
├── a-propos/
│   └── index.html
├── actualites/
│   ├── index.html
│   ├── agents-ia-autonomes-mythes-realite-pme/index.html
│   ├── automatisation-ia-distance-gagner-temps/index.html
│   ├── consultant-informatique-distance-guide-2026/index.html
│   ├── contenu-seo-ia-sans-nuits/index.html
│   ├── crm-outils-suivi-choisir-budget/index.html
│   ├── devis-relances-automatisation-controle/index.html
│   ├── digitaliser-entreprise-distance-methode-3-etapes/index.html
│   ├── erreurs-seo-visibilite-tpe/index.html
│   ├── fiche-google-business-optimiser-distance/index.html
│   ├── josy-ei-lance-le-cortex-agents-ia-tpe-vienne/index.html
│   ├── pourquoi-100-en-ligne-tpe-pme-2026/index.html
│   ├── role-humain-automatisation-ia/index.html
│   └── securiser-donnees-ia/index.html
├── automatisation-ia/index.html
├── automatisation-pme-poitiers-vienne-par-ou-commencer/index.html
├── automatiser-relances-clients-sans-crm/index.html
├── conseil-ingenierie-si/index.html
├── consultant-informatique-poitiers/index.html
├── cyberattaque-tpe-que-faire/index.html
├── demander-avis-google-sans-contrepartie/index.html
├── developpement-logiciel/index.html
├── facturation-electronique-tpe-vienne/index.html
├── formation-accompagnement/index.html
├── former-equipe-outils-numeriques/index.html
├── informatique-artisans-batiment-vienne/index.html
├── mentions-legales/index.html
├── merci/index.html
├── politique-de-confidentialite/index.html
├── pourquoi-audit-informatique-avant-projet-digital/index.html
├── ressources/index.html
├── sauvegardes-tpe-verifier-qu-elles-fonctionnent/index.html
├── seo-local-optimiser-fiche-google-business-profile/index.html
├── visibilite-seo-local/index.html
├── zone-intervention/index.html
├── assets/
│   ├── site-enhancements.css
│   └── site-enhancements.js
└── img/
    ├── actus/
    └── secteurs/
```

Les dossiers de pages, en plus de `a-propos/` et `actualites/`, sont : `automatisation-ia/`, `automatisation-pme-poitiers-vienne-par-ou-commencer/`, `automatiser-relances-clients-sans-crm/`, `conseil-ingenierie-si/`, `consultant-informatique-poitiers/`, `cyberattaque-tpe-que-faire/`, `demander-avis-google-sans-contrepartie/`, `developpement-logiciel/`, `facturation-electronique-tpe-vienne/`, `formation-accompagnement/`, `former-equipe-outils-numeriques/`, `informatique-artisans-batiment-vienne/`, `mentions-legales/`, `merci/`, `politique-de-confidentialite/`, `pourquoi-audit-informatique-avant-projet-digital/`, `ressources/`, `sauvegardes-tpe-verifier-qu-elles-fonctionnent/`, `seo-local-optimiser-fiche-google-business-profile/`, `visibilite-seo-local/` et `zone-intervention/`.

Autres fichiers racine présents : `.article_generator.py`, `.nojekyll`, `CNAME`, `favicon.ico`, `news-sitemap.xml`, `robots.txt`, `sitemap.xml` et `Portrait professionnel corporate de Josy Ei - Photo de Profil - Site Web et Reseaux Sociaux.png`. Le dossier `img/` contient aussi des variantes JPG/WebP, favicons et images de secteurs ; la section Images liste les références réellement trouvées dans les pages.

## 2. Pages du site

Les résumés ci-dessous reprennent les principaux titres H1/H2 relevés dans chaque fichier. Les chemins sont relatifs à la racine du dépôt ; la racine correspond à `https://josyei.com/`.

| Page / fichier | `<title>` | Méta-description | Résumé des sections |
|---|---|---|---|
| Accueil — `index.html` | Consultant informatique dans la France \| JOSY EI | Consultant indépendant dans la France : visibilité Google, contenus et automatisation pour TPE et artisans. Un échange, puis un devis sur-mesure. | Expertise digitale ; présentation ; services ; processus ; FAQ interactive. |
| À propos — `a-propos/index.html` | À propos : conseil informatique en ligne en France \| JOSY EI | JOSY EI, conseil en systèmes et logiciels informatiques à distance, partout en France : transparence, autonomie client et réactivité. | Présentation ; raison d’être ; expertise ; accompagnement à distance ; valeurs ; méthode ; CTA LinkedIn. Le portrait et ses références Open Graph/Twitter ont été retirés de cette page. |
| Page introuvable — `404.html` | Page introuvable \| JOSY EI | Cette page n'existe pas. | Message « Page introuvable ». |
| Automatisation et IA — `automatisation-ia/index.html` | Automatisation et IA pour PME, Poitiers et Vienne \| JOSY EI | Automatisez vos tâches répétitives, déployez des assistants IA encadrés et simplifiez vos parcours clients. Pour TPE, PME et artisans. Audit offert. | Public ; problèmes traités ; prestations ; livrables ; FAQ ; étapes ; ressources ; CTA. |
| Automatisation PME — `automatisation-pme-poitiers-vienne-par-ou-commencer/index.html` | Automatisation PME à Poitiers et dans la France \| JOSY EI | PME de Poitiers, la France ou votre ville : comment choisir les premières tâches à automatiser, avec quels outils et quelles précautions. | Choix des tâches ; critères d’automatisation ; exemples ; outils ; précautions ; accompagnement ; CTA. |
| Relances sans CRM — `automatiser-relances-clients-sans-crm/index.html` | Automatiser ses relances clients sans CRM coûteux \| JOSY EI | Devis sans réponse, factures oubliées : comment une TPE peut automatiser ses relances avec les outils qu'elle a déjà, sans logiciel coûteux. | Problème des relances ; liste de devis ; règles ; rappels ; mesure ; choix d’un CRM ; CTA. |
| Conseil SI — `conseil-ingenierie-si/index.html` | Conseil en systèmes d'information dans la France \| JOSY EI | Conseil en systèmes d'information pour les TPE et PME de la France et de la France : audit, architecture, sécurité, intégration. Audit offert. | Public ; problèmes ; prestations ; livrables ; FAQ ; étapes ; ressources. |
| Consultant à Poitiers — `consultant-informatique-poitiers/index.html` | Consultant informatique à Poitiers : IA, SEO, sécurité \| JOSY EI | Consultant informatique pour les TPE, PME et cabinets de Poitiers et du Grand Poitiers : conseil, automatisation, IA et visibilité. Audit offert. | Besoins locaux ; apport de JOSY EI ; intervention ; urgence ; FAQ. |
| Cyberattaque — `cyberattaque-tpe-que-faire/index.html` | Cyberattaque en TPE : que faire dans les premières heures \| JOSY EI | Rançongiciel, piratage, compte compromis : les bons gestes des premières heures, qui prévenir et comment redémarrer depuis une sauvegarde saine. | Signes d’alerte ; isolement ; rançon ; preuves ; interlocuteurs ; mots de passe ; restauration ; prévention ; CTA. |
| Avis Google — `demander-avis-google-sans-contrepartie/index.html` | Demander des avis Google à ses clients, dans les règles \| JOSY EI | Quand, comment et à qui demander un avis Google, comment répondre aux critiques, et ce qui est interdit : le guide pour les entreprises locales. | Pratiques interdites ; moment de sollicitation ; réponses ; routine de demande ; CTA. |
| Développement logiciel — `developpement-logiciel/index.html` | Développeur logiciel et web dans la France \| JOSY EI | Cahier des charges, sites et applications B2B, intégration de CRM et maintenance pour TPE et PME. Des outils adaptés à votre métier. Audit offert. | Public ; problèmes ; prestations ; livrables ; FAQ ; étapes ; ressources. |
| Facturation électronique — `facturation-electronique-tpe-vienne/index.html` | Facturation électronique TPE 2026-2027 : se préparer \| JOSY EI | Réception depuis septembre 2026, émission en septembre 2027 : la check-list pour qu'une TPE de la France passe à la facture électronique sereinement. | Calendrier ; changements ; listes de préparation réception/émission ; points par métier ; automatisation ; accompagnement. |
| Formation — `formation-accompagnement/index.html` | Formation numérique pour TPE/PME dans la France \| JOSY EI | Formez vos équipes à leurs outils numériques et rendez vos dirigeants autonomes : ateliers pratiques dans la France ou à distance. | Public ; problèmes ; prestations ; livrables ; FAQ ; étapes ; ressources ; CTA. |
| Former son équipe — `former-equipe-outils-numeriques/index.html` | Former son équipe aux outils numériques rapidement \| JOSY EI | Sessions courtes, cas réels, supports écrits : la méthode pour qu'une TPE ou PME de la France maîtrise enfin les outils qu'elle paie déjà. | Sous-utilisation ; tâches ; sessions ; fichiers réels ; support ; droit à l’erreur ; suivi ; CTA. |
| Informatique bâtiment — `informatique-artisans-batiment-vienne/index.html` | Informatique pour artisans du bâtiment, Vienne (86) \| JOSY EI | Devis sur chantier, factures électroniques, photos et sauvegardes : des outils simples pour les artisans du bâtiment de la France et de la France. | Quotidien numérique ; devis ; factures ; photos ; sauvegardes ; administratif ; visibilité ; accompagnement. |
| Mentions légales — `mentions-legales/index.html` | Mentions légales \| JOSY EI | Mentions légales du site josyei.com : éditeur JOSY EI, entrepreneur individuel (SIRET 00021), hébergeur et propriété intellectuelle. | Éditeur ; hébergeur ; propriété intellectuelle ; données personnelles ; CTA. |
| Merci — `merci/index.html` | Merci pour votre message \| JOSY EI | Votre demande a bien été envoyée à JOSY EI. Nous vous orientez votre demande via le formulaire de contact. | Confirmation de message ; accès à la page d’avis Google. |
| Confidentialité — `politique-de-confidentialite/index.html` | Politique de confidentialité \| JOSY EI | Comment JOSY EI collecte et protège vos données : finalités, bases légales, durée de conservation et exercice de vos droits RGPD. | Responsable ; données ; finalités ; conservation ; destinataires ; cookies ; droits ; CTA. |
| Audit informatique — `pourquoi-audit-informatique-avant-projet-digital/index.html` | Pourquoi un audit informatique avant un projet digital \| JOSY EI | Nouveau site, CRM, automatisation : pourquoi faire le point sur son informatique avant d'investir évite les mauvaises surprises aux TPE et PME. | Risques du projet lancé trop vite ; contenu d’un audit ; bénéfices ; déroulement ; CTA. |
| Ressources — `ressources/index.html` | Conseils informatique, IA et SEO local pour TPE \| JOSY EI | Articles pratiques pour les TPE, PME et artisans : automatiser ses relances, optimiser sa fiche Google, préparer un projet digital. | Index de ressources et guides pratiques. |
| Sauvegardes — `sauvegardes-tpe-verifier-qu-elles-fonctionnent/index.html` | Sauvegardes TPE : vérifier qu'elles fonctionnent \| JOSY EI | Une sauvegarde jamais testée n'est pas une sauvegarde. La méthode simple pour qu'une TPE vérifie qu'elle pourrait vraiment récupérer ses données. | Causes d’échec ; données ; règle 3-2-1 ; restauration ; vérifications ; accès ; récapitulatif ; CTA. |
| Guide fiche Google — `seo-local-optimiser-fiche-google-business-profile/index.html` | SEO local : optimiser sa fiche Google Business Profile \| JOSY EI | Catégories, zone desservie, photos, avis, publications : la méthode pas à pas pour qu'une TPE locale apparaisse sur Google Maps. | Importance de la fiche ; revendication ; catégories ; informations ; photos ; avis ; publications ; mesure ; CTA. |
| Visibilité SEO — `visibilite-seo-local/index.html` | SEO local dans la France et Poitiers, fiche Google \| JOSY EI | Soyez trouvé sur Google Maps : SEO local, fiche Google Business, prospection B2B et contenus pour votre site. TPE et artisans de la France (86). | Public ; problèmes ; prestations ; livrables ; FAQ ; étapes ; ressources. |
| Zone d’intervention — `zone-intervention/index.html` | Accompagnement informatique 100 % à distance en France \| JOSY EI | Conseil informatique, automatisation, IA et SEO local : un accompagnement en ligne pour les TPE, PME, artisans et indépendants partout en France. | Offre à distance ; accessibilité ; déroulement ; avantages ; couverture ; CTA. |

## 3. Actualités et articles de blog

L’index `/actualites/` annonce et relie 12 articles. Chaque article comprend un hero, des blocs de synthèse, des conseils ou étapes, une FAQ et un CTA LinkedIn.

| URL | Titre SEO | Méta-description | Résumé des sections | Image utilisée |
|---|---|---|---|---|
| `/actualites/consultant-informatique-distance-guide-2026/` | Consultant informatique à distance : le guide 2026 \| JOSY EI | Guide pratique pour choisir un consultant informatique à distance, cadrer une mission et sécuriser le suivi de votre TPE ou PME en 2026. | Périmètre du conseil ; choix du consultant ; analyse initiale ; organisation/livrables ; sécurité ; mesure de l’utilité ; FAQ et récapitulatif. | [Visuel télétravail Unsplash](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80) |
| `/actualites/automatisation-ia-distance-gagner-temps/` | Automatisation IA à distance : gagnez 10h par semaine \| JOSY EI | Méthode pour repérer les tâches automatisables par l'IA, estimer le temps concerné et garder une validation humaine à distance. | Mesure des tâches répétitives ; cas d’usage ; évaluation d’outils ; gain net ; sécurité ; déploiement ; FAQ et récapitulatif. | [Visuel IA Unsplash](https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80) |
| `/actualites/devis-relances-automatisation-controle/` | Devis et relances : automatisez sans perdre le contrôle \| JOSY EI | Automatisez la préparation des devis et le suivi des relances avec des règles explicites, des contrôles et une validation humaine. | Parcours du devis ; automatisation de la préparation ; règles de relance ; données de gestion ; fiabilité ; déploiement réversible ; FAQ. | [Visuel équipe/CRM Unsplash](https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80) |
| `/actualites/pourquoi-100-en-ligne-tpe-pme-2026/` | Pourquoi le 100% en ligne séduit les TPE/PME en 2026 \| JOSY EI | Découvrez les avantages et les limites d'un accompagnement numérique 100 % en ligne pour les petites entreprises en 2026. | Souplesse ; livrables ; mesure ; limites ; confidentialité ; choix du format ; FAQ et récapitulatif. | [Visuel télétravail Unsplash](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80) |
| `/actualites/fiche-google-business-optimiser-distance/` | Fiche Google Business : dominez les recherches locales depuis chez vous \| JOSY EI | Optimisez une fiche Google Business Profile à distance : informations exactes, catégories, contenus, avis et suivi conforme. | Éligibilité et exactitude ; catégories ; contenus ; avis ; indicateurs ; gestion à distance ; FAQ. | [Visuel SEO Unsplash](https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=800&q=80) |
| `/actualites/erreurs-seo-visibilite-tpe/` | Les 5 erreurs SEO qui tuent la visibilité de votre TPE \| JOSY EI | Repérez cinq erreurs SEO fréquentes des TPE et appliquez une méthode simple pour améliorer la qualité de vos pages web. | Rédaction pour les lecteurs ; pages similaires ; titres/descriptions ; liens internes ; technique ; priorisation des corrections ; FAQ. | [Visuel SEO Unsplash](https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=800&q=80) |
| `/actualites/agents-ia-autonomes-mythes-realite-pme/` | Agents IA autonomes : mythes et réalités pour les PME \| JOSY EI | Comprenez ce qu'un agent IA peut réellement faire, ses limites et les contrôles indispensables dans une PME. | Limites d’autonomie ; permissions ; validation humaine ; consignes malveillantes ; pilote réaliste ; FAQ. | [Visuel IA Unsplash](https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80) |
| `/actualites/securiser-donnees-ia/` | Comment sécuriser ses données quand on travaille avec une IA \| JOSY EI | Mesures pratiques pour protéger les données d'entreprise utilisées avec une IA : minimisation, accès, contrats, tests et suivi. | Classification ; conditions fournisseur ; permissions ; invites et documents ; supervision/incidents ; réévaluation ; FAQ. | [Visuel cybersécurité Unsplash](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80) |
| `/actualites/role-humain-automatisation-ia/` | Le rôle de l'humain dans un monde automatisé par l'IA \| JOSY EI | Pourquoi le jugement humain, la responsabilité et la relation restent essentiels dans les processus automatisés par l'IA. | Définition du problème ; vérification ; relation et nuance ; amélioration ; accès ; décisions d’automatisation ; FAQ. | [Visuel équipe/CRM Unsplash](https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80) |
| `/actualites/contenu-seo-ia-sans-nuits/` | Créer du contenu SEO sans y passer ses nuits grâce à l'IA \| JOSY EI | Utilisez l'IA pour structurer et relire du contenu SEO sans sacrifier l'exactitude, l'expertise ni la voix de votre entreprise. | Questions réelles ; exactitude ; plan ; expertise et ton ; révision SEO/accessibilité ; cadence soutenable ; FAQ. | [Visuel rédaction Unsplash](https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80) |
| `/actualites/crm-outils-suivi-choisir-budget/` | CRM et outils de suivi : comment choisir sans se ruiner \| JOSY EI | Choisissez un CRM adapté à une petite équipe : besoins, effort total, données, intégrations et critères de test. | Besoins ; effort total ; adoption ; intégrations et données ; comparaison ; préparation de l’adoption et de la sortie ; FAQ. | [Visuel équipe/CRM Unsplash](https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80) |
| `/actualites/digitaliser-entreprise-distance-methode-3-etapes/` | La méthode en 3 étapes pour digitaliser son entreprise à distance \| JOSY EI | Une méthode en trois étapes pour diagnostiquer, tester et déployer des outils numériques dans une petite entreprise à distance. | Diagnostic ; conception et test ; déploiement ; place des personnes ; protection des données ; mesure des effets ; FAQ. | [Visuel télétravail Unsplash](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80) |

**Index des actualités** — `/actualites/index.html`
Titre SEO : « Actualités IA et numérique pour les TPE et PME en France | JOSY EI ».
Méta-description : « Actualités, guides et conseils sur le numérique et l’intelligence artificielle pour les TPE et PME en France. »
Sections : introduction et grille de cartes des 12 articles. Les cartes réutilisent les six visuels Unsplash listés ci-dessus.

**Archive historique supplémentaire** — `/actualites/josy-ei-lance-le-cortex-agents-ia-tpe-vienne/`
Titre : « Archive : une initiative autour des agents IA | JOSY EI ». Méta-description : « Archive d’une initiative numérique consacrée à l’automatisation et aux agents IA pour les petites entreprises. » Cette page ne contient pas de section H1/H2 relevée, pas d’image, et ne possède pas de métadonnées Open Graph.

## 4. Images réellement référencées

### Fichiers locaux

- `/img/portrait-josy-ei-640.webp` — portrait affiché sur l’accueil. Il n’est plus référencé dans le HTML ni les métadonnées de la page À propos.
- `/img/secteurs/josy-ei-informatique-salle-serveurs-640.jpg` — visuel de la page Conseil en systèmes d’information.
- `/img/secteurs/josy-ei-formation-salle-tableau-640.jpg` — visuel de la page Formation et accompagnement.
- `/img/og-josy-ei.jpg` — image Open Graph/Twitter partagée par les pages qui la déclarent ; cette image contient un portrait et a été retirée des métadonnées de la page À propos.
- `/favicon.ico`, `/img/favicon-32.png`, `/img/favicon-192.png` et `/img/apple-touch-icon.png` — icônes de site référencées dans les en-têtes HTML.

### Images externes

| URL Unsplash | Usage |
|---|---|
| `https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80` | Rédaction et création de contenu SEO. |
| `https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80` | Travail à distance et digitalisation. |
| `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80` | Sécurité des données et IA. |
| `https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80` | Équipe, CRM, organisation et automatisation. |
| `https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=800&q=80` | SEO et fiche Google Business. |
| `https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80` | Intelligence artificielle et agents IA. |

Les variantes d’images locales présentes dans `img/actus/` et `img/secteurs/` ne sont pas toutes directement utilisées par les balises `img` des pages inventoriées ; seules les références effectivement trouvées sont présentées comme usages.

## 5. Liens, boutons et formulaires

- **14 CTA de contenu repérés** : un sur l’accueil, un sur À propos et un sur chacun des 12 articles. Tous pointent vers `https://www.linkedin.com/messaging/compose/?to=josyei`.
- Les boutons de navigation mobile sont des boutons de menu, pas des CTA commerciaux.
- **Aucune balise `<form>`** n’a été trouvée dans les 38 fichiers HTML contrôlés. Les mots « formulaire » sur la page Merci sont du texte de métadonnées/contenu, et non un formulaire HTML présent dans ce dépôt.

## 6. SEO et technique

- **Titres SEO et méta-descriptions :** présents dans les 38 fichiers HTML contrôlés.
- **Open Graph :** trouvé dans 37 fichiers sur 38. La page d’archive `actualites/josy-ei-lance-le-cortex-agents-ia-tpe-vienne/index.html` est l’exception.
- **Sitemap XML :** `sitemap.xml` existe et contient 16 entrées `<loc>`.
- **Sitemap actualités :** `news-sitemap.xml` existe, avec une entrée pointant vers l’ancienne URL d’archive ci-dessus. Celle-ci n’est pas parmi les 12 articles de l’index actuel.
- **Encodage :** les 38 fichiers HTML et l’ensemble des fichiers texte contrôlés (CSS, JavaScript, XML, TXT, Markdown, Python, `CNAME` et `.nojekyll`) se décodent en UTF-8. Les deux sitemaps déclarent également `encoding="UTF-8"`. Les fichiers image binaires ne sont pas des fichiers texte et ne relèvent pas de ce contrôle.
- **Contrôle de contenu à prévoir :** plusieurs métadonnées et titres de pages de service contiennent encore des formulations telles que « dans la France » ou « la France et de la France ». La méta-description de la page Merci parle d’un formulaire alors qu’aucun formulaire HTML n’est présent. Ces incohérences de texte sont relevées pour correction éditoriale ultérieure, sans modification dans le cadre de cet audit.
