(function () {
  'use strict';

  var root = document.querySelector('.jx');
  if (!root) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var menuButton = root.querySelector('.burger');
  var drawer = root.querySelector('#jx-drawer');

  if (menuButton && drawer) {
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      drawer.hidden = expanded;
    });
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
