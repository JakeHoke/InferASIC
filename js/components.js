/**
 * InferASIC static site - load header and footer from separate HTML components.
 * Serve the site over HTTP (e.g. python -m http.server, npx serve) so fetch() can load the component files.
 */
(function () {
  'use strict';

  var HEADER_SELECTOR = '.site-header-placeholder';
  var FOOTER_SELECTOR = '.site-footer-placeholder';
  var HEADER_PATH = 'components/header.html';
  var FOOTER_PATH = 'components/footer.html';

  function injectHtml(selector, html, isHeader) {
    var placeholder = document.querySelector(selector);
    if (!placeholder) return null;
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    var node = wrapper.firstChild;
    placeholder.parentNode.replaceChild(node, placeholder);
    if (isHeader) initHeader(node);
    return node;
  }

  function loadComponent(selector, path, isHeader) {
    var placeholder = document.querySelector(selector);
    if (!placeholder) return;

    fetch(path)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + path);
        return res.text();
      })
      .then(function (html) {
        injectHtml(selector, html, isHeader);
      })
      .catch(function (err) {
        console.warn('Components failed to load. Serve the site over HTTP (e.g. npx serve) so header and footer can load from ' + path);
      });
  }

  function initHeader(headerEl) {
    var toggle = headerEl.querySelector('.nav-toggle');
    var nav = headerEl.querySelector('.nav');
    if (!toggle || !nav) return;

    if (window.matchMedia('(max-width: 768px)').matches) {
      toggle.hidden = false;
      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !expanded);
        nav.classList.toggle('nav-open', !expanded);
      });
    }
  }

  function init() {
    loadComponent(HEADER_SELECTOR, HEADER_PATH, true);
    loadComponent(FOOTER_SELECTOR, FOOTER_PATH, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
