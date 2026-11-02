/* Entrée des pages métier (02/11/2026) : recherche tapée en boucle + bulles qui apparaissent une à une.
   Rien d'inventé : les recherches sont celles listées sur la page, les bulles sont les étapes de l'offre. */
(function () {
  var hero = document.querySelector('.hm-hero');
  if (!hero) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Le badge « Les outils que j'utilise » ajouté sous le titre gêne la lecture de l'entrée : on le place après les boutons.
  var tools = hero.querySelector('.digital-tools-line');
  var mini = hero.querySelector('.hm-mini');
  if (tools && mini) mini.after(tools);
  if (reduce) return;
  hero.classList.add('hm-js');

  var bulles = [].slice.call(hero.querySelectorAll('.hm-bulles li'));
  var i = 0;
  (function suivante() {
    if (i < bulles.length) { bulles[i++].classList.add('hm-on'); setTimeout(suivante, i === 1 ? 500 : 1100); }
  })();
  setTimeout(function () { bulles.forEach(function (b) { b.classList.add('hm-on'); }); }, 8000); // sécurité

  var box = hero.querySelector('.hm-search'), q = hero.querySelector('.hm-q');
  if (!box || !q) return;
  var liste = (box.getAttribute('data-q') || '').split('|').filter(Boolean);
  if (liste.length < 2) return;
  var n = 0;
  function taper(txt, k) {
    q.textContent = txt.slice(0, k);
    if (k < txt.length) setTimeout(function () { taper(txt, k + 1); }, 70);
    else setTimeout(effacer, 2200);
  }
  function effacer() {
    var t = q.textContent;
    if (t.length) { q.textContent = t.slice(0, -1); setTimeout(effacer, 30); }
    else { n = (n + 1) % liste.length; taper(liste[n], 1); }
  }
  setTimeout(effacer, 2600);
})();
