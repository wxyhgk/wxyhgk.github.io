/**
 * Re-typeset MathJax after MkDocs Material instant-navigation page swaps.
 */
(function () {
  function typeset() {
    if (!window.MathJax || !MathJax.typesetPromise) return;
    if (MathJax.typesetClear) {
      MathJax.typesetClear();
    }
    MathJax.typesetPromise().catch(() => {});
  }

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(() => {
      // MathJax may still be loading on first paint
      if (window.MathJax && MathJax.typesetPromise) {
        typeset();
      } else {
        window.addEventListener("load", typeset, { once: true });
      }
    });
  } else {
    window.addEventListener("load", typeset, { once: true });
  }
})();
