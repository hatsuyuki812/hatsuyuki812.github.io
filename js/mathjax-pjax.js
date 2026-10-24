(function () {
  'use strict';

  // Icarus marks scripts as data-pjax, so this file can be evaluated again
  // after every navigation. Install the listeners only once.
  if (window.__antipathyMathJaxPjax) return;
  window.__antipathyMathJaxPjax = true;

  function article() {
    return document.querySelector('[role="article"] .content');
  }

  function typeset() {
    if (!window.MathJax || typeof window.MathJax.typesetPromise !== 'function') return;
    var target = article();
    if (!target) return;
    try {
      // Clear MathJax's cache for nodes removed by PJAX before rendering the
      // new article. The old article is no longer reachable from the DOM, so
      // clearing without an element list is the only reliable way to remove
      // its MathItems.
      if (typeof window.MathJax.typesetClear === 'function') {
        window.MathJax.typesetClear();
      }
      window.MathJax.typesetPromise([target]).catch(function (error) {
        console.error('MathJax PJAX typeset failed:', error);
      });
    } catch (error) {
      console.error('MathJax PJAX refresh failed:', error);
    }
  }

  window.addEventListener('load', typeset, { once: true });
  ['pjax:success', 'pjax:complete', 'pjax:end'].forEach(function (eventName) {
    document.addEventListener(eventName, function () {
      // Wait until Icarus has replaced the article and browser layout is ready.
      window.requestAnimationFrame(typeset);
    });
  });
}());
