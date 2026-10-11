/**
 * Keep Material's .md-tabs pinned as a slim bottom bar.
 * Material toggles [hidden] on tabs (fade + translateY(50%)); we strip that
 * after every page swap and on scroll.
 */
(function () {
  function pinTabs() {
    var tabs = document.querySelector(".md-tabs");
    if (!tabs) return;
    if (tabs.hasAttribute("hidden")) {
      tabs.removeAttribute("hidden");
    }
    // force inline as last resort (cleared by our CSS too)
    tabs.style.setProperty("position", "fixed", "important");
    tabs.style.setProperty("top", "auto", "important");
    tabs.style.setProperty("bottom", "0", "important");
    tabs.style.setProperty("left", "0", "important");
    tabs.style.setProperty("right", "0", "important");
    tabs.style.setProperty("transform", "none", "important");
    tabs.style.setProperty("opacity", "1", "important");
    tabs.style.setProperty("visibility", "visible", "important");
    tabs.style.setProperty("display", "block", "important");
  }

  function watch() {
    pinTabs();
    var tabs = document.querySelector(".md-tabs");
    if (tabs && typeof MutationObserver !== "undefined") {
      new MutationObserver(pinTabs).observe(tabs, {
        attributes: true,
        attributeFilter: ["hidden", "style", "class"],
      });
    }
    window.addEventListener("scroll", pinTabs, { passive: true });
  }

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(watch);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watch);
  } else {
    watch();
  }
})();
