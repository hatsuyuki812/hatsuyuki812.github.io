(function () {
  'use strict';

  // Icarus marks scripts as data-pjax, so this file can be evaluated again
  // after every navigation. Install the listeners only once.
  if (window.__antipathyMathJaxPjax) return;
  window.__antipathyMathJaxPjax = true;

  function articles() {
    return Array.from(document.querySelectorAll('[role="article"] > .content'));
  }

  function typeset() {
    if (!window.MathJax || typeof window.MathJax.typesetPromise !== 'function') return;
    var targets = articles();
    if (!targets.length) return;
    try {
      window.MathJax.typesetPromise(targets).catch(function (error) {
        console.error('MathJax PJAX typeset failed:', error);
      });
    } catch (error) {
      console.error('MathJax PJAX refresh failed:', error);
    }
  }

  // Clear the OLD articles while their DOM nodes are still present. Clearing
  // after a normal page load makes MathJax typeset its own assistive MathML a
  // second time. Initial page typesetting is already handled by MathJax itself.
  document.addEventListener('pjax:send', function () {
    if (window.MathJax && typeof window.MathJax.typesetClear === 'function') {
      window.MathJax.typesetClear(articles());
    }
  });
  document.addEventListener('pjax:success', function () {
    window.requestAnimationFrame(typeset);
  });
}());
