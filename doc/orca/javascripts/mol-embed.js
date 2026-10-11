/**
 * Build 3D | input panels from .mol-panel produced by hooks/mol_fence.py,
 * then boot FastMol embed viewers.
 *
 * Re-runs after MkDocs Material's instant navigation (document$) so
 * molecules remount on every page change without a full reload.
 */
(function () {
  // tiny ball-stick mark (logo C)
  const ICON_SVG =
    '<svg viewBox="0 0 64 64" width="12" height="12" aria-hidden="true">' +
    '<g transform="translate(32,32)">' +
    '<line x1="-16" y1="12" x2="16" y2="-12" stroke="#5EEAD4" stroke-width="7" stroke-linecap="round"/>' +
    '<line x1="12" y1="-6" x2="20" y2="8" stroke="#5EEAD4" stroke-width="3.5" stroke-linecap="round"/>' +
    '<circle cx="-18" cy="14" r="11" fill="#2DD4BF"/>' +
    '<circle cx="22" cy="12" r="6" fill="#99F6E4"/>' +
    '<circle cx="18" cy="-14" r="14" fill="#14B8A6"/>' +
    "</g></svg>";

  const BADGE_SVG =
    '<svg viewBox="0 0 64 64" width="11" height="11" aria-hidden="true">' +
    '<g transform="translate(32,32)">' +
    '<line x1="-16" y1="12" x2="16" y2="-12" stroke="#5EEAD4" stroke-width="7" stroke-linecap="round"/>' +
    '<line x1="12" y1="-6" x2="20" y2="8" stroke="#5EEAD4" stroke-width="3.5" stroke-linecap="round"/>' +
    '<circle cx="-18" cy="14" r="11" fill="#2DD4BF"/>' +
    '<circle cx="22" cy="12" r="6" fill="#CCFBF1"/>' +
    '<circle cx="18" cy="-14" r="14" fill="#14B8A6"/>' +
    "</g></svg>";

  function buildPanel(panel) {
    if (panel.dataset.molBuilt) return;
    panel.dataset.molBuilt = "1";
    panel.dataset.mode = "3d";

    const xyzEl = panel.querySelector(".mol-xyz");
    const inpEl = panel.querySelector(".mol-input");
    const xyz = (xyzEl ? xyzEl.textContent : "").trim();
    const inp = (inpEl ? inpEl.textContent : "").trim();
    const title = panel.dataset.molTitle || "";
    const theme = panel.dataset.molTheme || "chem311";
    const height = panel.dataset.molHeight || "360px";
    const repr = panel.dataset.molRepr || "ball-stick";
    const format = (xyzEl && xyzEl.dataset.format) || "xyz";

    panel.textContent = "";

    const bar = document.createElement("div");
    bar.className = "mol-panel-bar";

    const tab3d = document.createElement("button");
    tab3d.type = "button";
    tab3d.textContent = "3D";
    tab3d.setAttribute("aria-selected", "true");

    const tabInp = document.createElement("button");
    tabInp.type = "button";
    tabInp.textContent = "input";
    tabInp.setAttribute("aria-selected", "false");

    const spacer = document.createElement("div");
    spacer.className = "mol-spacer";

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "mol-copy";
    copy.textContent = "复制";

    const brand = document.createElement("span");
    brand.className = "mol-brand";
    brand.innerHTML = ICON_SVG + "fast·mol";

    bar.append(tab3d, tabInp, spacer, copy, brand);

    const view = document.createElement("div");
    view.className = "mol-panel-view";
    view.style.height = /^\d+$/.test(String(height)) ? height + "px" : height;

    const host = document.createElement("div");
    host.className = "mol-host";
    host.style.height = "100%";
    view.appendChild(host);

    const badge = document.createElement("div");
    badge.className = "mol-badge";
    badge.innerHTML = BADGE_SVG + "fast·mol";
    view.appendChild(badge);

    const inputPane = document.createElement("div");
    inputPane.className = "mol-panel-input";
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = inp || xyz || "(empty)";
    pre.appendChild(code);
    inputPane.appendChild(pre);

    panel.append(bar, view, inputPane);

    function setMode(mode) {
      panel.dataset.mode = mode;
      tab3d.setAttribute("aria-selected", mode === "3d" ? "true" : "false");
      tabInp.setAttribute("aria-selected", mode === "input" ? "true" : "false");
    }
    tab3d.addEventListener("click", () => setMode("3d"));
    tabInp.addEventListener("click", () => setMode("input"));

    copy.addEventListener("click", async () => {
      const text = inp || xyz;
      try {
        await navigator.clipboard.writeText(text);
        copy.textContent = "已复制";
      } catch {
        copy.textContent = "复制失败";
      }
      setTimeout(() => {
        copy.textContent = "复制";
      }, 1500);
    });

    if (window.FastMol && window.FastMol.createViewer) {
      try {
        const v = window.FastMol.createViewer(host, {
          theme: theme,
          representation: repr,
          labels: "none",
        });
        if (xyz) {
          v.loadText(xyz, format);
        } else {
          host.innerHTML =
            '<div style="color:#94A3B8;padding:1.5rem;font:14px/1.5 system-ui">no coordinates — see <b>input</b> tab</div>';
        }
      } catch (err) {
        host.textContent = "FastMol failed: " + err;
      }
    } else {
      host.innerHTML =
        '<div style="color:#94A3B8;padding:1.5rem;font:14px/1.5 system-ui">fast-mol viewer not loaded</div>';
    }
  }

  function scan() {
    document.querySelectorAll(".mol-panel").forEach(buildPanel);
  }

  // MkDocs Material instant navigation
  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(scan);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else {
    scan();
  }

  // also catch late-injected content
  if (typeof MutationObserver !== "undefined") {
    new MutationObserver(() => scan()).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
