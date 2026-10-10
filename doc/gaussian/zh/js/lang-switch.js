(function () {
  var KEY = "lang-switch-pos";

  function headings() {
    return Array.prototype.slice.call(
      document.querySelectorAll(".md-content__inner h1, .md-content__inner h2, .md-content__inner h3, .md-content__inner h4, .md-content__inner h5, .md-content__inner h6"));
  }

  // where the reader is: last heading above the viewport top, plus offset inside that section
  function capture() {
    var hs = headings(), y = window.scrollY, idx = -1, delta = 0;
    for (var i = 0; i < hs.length; i++) {
      var top = hs[i].getBoundingClientRect().top + y;
      if (top - 80 <= y) { idx = i; delta = y - (top - 80); } else break;
    }
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return { idx: idx, delta: delta, ratio: y / max, n: hs.length };
  }

  function restore(key) {
    var raw; try { raw = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch (e) {}
    if (!raw) return;
    var s; try { s = JSON.parse(raw); } catch (e) { return; }
    if (!s || s.to !== key) return;
    var hs = headings(), y;
    if (s.n === hs.length && s.idx >= 0) {
      y = hs[s.idx].getBoundingClientRect().top + window.scrollY - 80 + s.delta;
    } else if (s.n === hs.length) {
      y = s.delta;
    } else {
      y = s.ratio * Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    }
    window.scrollTo(0, Math.max(0, y));
  }

  function init() {
    // The ZH site lives in <root>/zh/ ; the EN site in <root>/ .
    var scope = (typeof __md_scope !== "undefined" && __md_scope.pathname) || "/";
    var isZh = /\/zh\/$/.test(scope);
    var enRoot = isZh ? scope.replace(/zh\/$/, "") : scope;
    var zhRoot = isZh ? scope : scope + "zh/";
    var path = location.pathname;
    if (path.indexOf(scope) !== 0) return;
    var rel = path.slice(scope.length);
    if (!rel || rel === "index.html") {
      rel = "index.html";
    }
    var target = isZh
      ? enRoot + rel.replace(/_zh\.html$/, ".html")
      : zhRoot + (rel === "index.html" ? "index.html" : rel.replace(/\.html$/, "_zh.html"));
    restore(path);
    var a = document.createElement("a");
    a.className = "lang-switch";
    a.textContent = isZh ? "EN" : "中文";
    a.title = isZh ? "Switch to English" : "切换到中文";
    a.href = target;
    a.addEventListener("click", function () {
      var s = capture(); s.to = target;
      try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    });
    var inner = document.querySelector(".md-header__inner");
    var search = inner && inner.querySelector(".md-search");
    if (!inner) return;
    inner.insertBefore(a, search || null);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
