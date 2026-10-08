/* Motyw jasny/ciemny dla viewera.
   Atrybut data-theme ustawia już inline skrypt w <head> (bez mignięcia). */
(() => {
  const KEY = "theme";
  const root = document.documentElement;
  const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function stored() {
    try {
      const v = localStorage.getItem(KEY);
      return v === "dark" || v === "light" ? v : null;
    } catch (e) {
      return null;
    }
  }

  function current() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function syncUi() {
    const dark = current() === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      const hint = dark ? "Przełącz motyw (włącz jasny)" : "Przełącz motyw (włącz ciemny)";
      btn.setAttribute("title", hint);
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#121214" : "#ffffff");
  }

  function apply(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (persist) {
      try { localStorage.setItem(KEY, theme); } catch (e) { /* ignore */ }
    }
    syncUi();
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    apply(current() === "dark" ? "light" : "dark", true);
  });

  // Bez zapisanego wyboru — podążaj za ustawieniem systemu na żywo.
  if (mq) {
    const onChange = (ev) => { if (!stored()) apply(ev.matches ? "dark" : "light", false); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  if (!root.hasAttribute("data-theme")) {
    apply(stored() || (mq && mq.matches ? "dark" : "light"), false);
  } else {
    syncUi();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", syncUi);
})();
