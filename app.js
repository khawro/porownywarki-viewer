(() => {
  const SITE_LABELS = {
    rankomat: "Rankomat",
    kioskpolis: "Kiosk Polis",
    insurify: "Insurify",
    thezebra: "The Zebra",
    nerdwallet: "NerdWallet",
    gocompare: "GoCompare",
  };

  const TAG_LABELS = {
    home: "start",
    vehicle: "pojazd",
    driver: "kierowca",
    details: "dane",
    loading: "ładowanie",
    offers: "oferty",
    checkout: "checkout",
    payment: "płatność",
  };

  const NAV_KEY = "porownywarki-nav-variant";

  const state = {
    images: [],
    sites: [],
    siteFilter: "",
    navOpen: false,
    tagsOpen: false,
    navVariant: localStorage.getItem(NAV_KEY) === "overlay" ? "overlay" : "bottom",
    device: "desktop",
    site: null,
    stepIndex: 0,
    search: "",
    activeTag: null,
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  function siteLabel(id) {
    return SITE_LABELS[id] || id;
  }

  function updateSiteLabel() {
    const label = $("#site-current-label");
    const openBtn = $("#site-nav-open");
    if (label) label.textContent = state.site ? siteLabel(state.site) : "Strony";
    if (openBtn) {
      openBtn.setAttribute("aria-expanded", state.navOpen ? "true" : "false");
    }
  }

  function updateTagSearchLabel() {
    const label = $("#tag-search-label");
    const toggle = $("#tag-search-toggle");
    if (!label || !toggle) return;
    if (state.activeTag) {
      label.textContent = tagLabel(state.activeTag);
    } else if (state.search) {
      label.textContent = `„${state.search}”`;
    } else {
      label.textContent = "Szukaj po tagach";
    }
    toggle.classList.toggle("has-filter", Boolean(state.activeTag || state.search));
    toggle.setAttribute("aria-expanded", state.tagsOpen ? "true" : "false");
  }

  function setTagsOpen(open) {
    state.tagsOpen = Boolean(open);
    const pop = $("#tag-popover");
    if (pop) pop.hidden = !state.tagsOpen;
    updateTagSearchLabel();
    if (state.tagsOpen) {
      const input = $("#tag-search");
      if (input) requestAnimationFrame(() => input.focus());
    }
  }

  function applyNavVariant() {
    document.body.classList.toggle("nav-bottom", state.navVariant === "bottom");
    document.body.classList.toggle("nav-overlay", state.navVariant === "overlay");
    $$(".nav-variant-toggle .pill-btn").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.nav === state.navVariant)
    );
    localStorage.setItem(NAV_KEY, state.navVariant);
  }

  function setNavVariant(variant) {
    if (variant !== "bottom" && variant !== "overlay") return;
    state.navVariant = variant;
    applyNavVariant();
  }

  function setNavOpen(open) {
    state.navOpen = Boolean(open);
    const panel = $("#site-nav-panel");
    const backdrop = $("#site-nav-backdrop");
    if (!panel || !backdrop) return;
    panel.classList.toggle("is-open", state.navOpen);
    panel.setAttribute("aria-hidden", state.navOpen ? "false" : "true");
    backdrop.hidden = !state.navOpen;
    document.body.classList.toggle("nav-open", state.navOpen);
    updateSiteLabel();
    if (state.navOpen) {
      const input = $("#site-search");
      if (input) requestAnimationFrame(() => input.focus());
    }
  }

  function tagLabel(t) {
    return TAG_LABELS[t] || t;
  }

  function normalizeTag(t) {
    return String(t || "").toLowerCase().trim();
  }

  function discoverSites() {
    const set = new Set(state.images.map((i) => i.site).filter(Boolean));
    return [...set].sort((a, b) =>
      siteLabel(a).localeCompare(siteLabel(b), "pl")
    );
  }

  function matchesSearch(item, q) {
    if (!q) return true;
    const hay = [...(item.tags || []), item.tag, item.label, item.description]
      .map(normalizeTag)
      .join(" ");
    return hay.includes(q);
  }

  function flowItems() {
    return state.images
      .filter((i) => i.site === state.site && i.device === state.device)
      .sort((a, b) => a.step - b.step);
  }

  function allTagsForDevice() {
    const set = new Map();
    state.images
      .filter((i) => i.device === state.device)
      .forEach((i) => {
        (i.tags || [i.tag]).forEach((t) => {
          if (!set.has(t)) set.set(t, 0);
          set.set(t, set.get(t) + 1);
        });
      });
    return [...set.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }

  function isCompareMode() {
    return Boolean(state.search || state.activeTag);
  }

  function compareQuery() {
    return state.activeTag || state.search;
  }

  function renderSiteList() {
    const el = $("#site-list");
    if (!el) return;
    const q = normalizeTag(state.siteFilter);
    const filtered = state.sites.filter((id) => {
      if (!q) return true;
      return (
        normalizeTag(id).includes(q) ||
        normalizeTag(siteLabel(id)).includes(q)
      );
    });
    if (!filtered.length) {
      el.innerHTML = `<div class="site-list-empty">Brak stron</div>`;
      return;
    }
    el.innerHTML = filtered
      .map((id) => {
        const n = state.images.filter((i) => i.site === id).length;
        const active = id === state.site ? " is-active" : "";
        return `<button type="button" class="site-list-item${active}" role="option" aria-selected="${
          id === state.site
        }" data-site="${id}"><span>${siteLabel(
          id
        )}</span><span class="site-count">${n}</span></button>`;
      })
      .join("");
  }

  function renderTagChips() {
    const el = $("#tag-chips");
    const tags = allTagsForDevice();
    el.innerHTML = tags
      .map(([t, n]) => {
        const active =
          state.activeTag === t ||
          (state.search && normalizeTag(t).includes(state.search));
        return `<button type="button" class="tag-chip${
          active ? " is-active" : ""
        }" data-tag="${t}">${tagLabel(t)} · ${n}</button>`;
      })
      .join("");
  }

  function renderStepStrip(items) {
    const strip = $("#step-strip");
    if (!items.length) {
      strip.innerHTML = "";
      return;
    }
    strip.innerHTML = items
      .map((item, idx) => {
        const active = idx === state.stepIndex ? " is-active" : "";
        const mobile = state.device === "mobile" ? " is-mobile" : "";
        return `
          <button type="button" class="step-thumb${active}${mobile}" data-idx="${idx}">
            <img src="${item.path}" alt="" loading="lazy" />
            <div class="step-meta">
              <strong>${item.step}</strong>
              <span>${tagLabel(item.tag)}</span>
            </div>
          </button>`;
      })
      .join("");
  }

  function renderSidebar(item) {
    if (!item) {
      $("#sidebar-tags").innerHTML = "";
      $("#sidebar-desc").textContent = "—";
      $("#sidebar-site").textContent = "—";
      $("#sidebar-step").textContent = "—";
      $("#sidebar-device").textContent = "—";
      return;
    }
    $("#sidebar-tags").innerHTML = (item.tags || [item.tag])
      .map(
        (t) =>
          `<button type="button" class="sidebar-tag" data-tag="${t}">${tagLabel(
            t
          )}</button>`
      )
      .join("");
    $("#sidebar-desc").textContent = item.description || "—";
    $("#sidebar-site").textContent = siteLabel(item.site);
    $("#sidebar-step").textContent = `${item.step}`;
    $("#sidebar-device").textContent =
      item.device === "mobile" ? "Mobile" : "Desktop";
  }

  function renderFlow() {
    const items = flowItems();
    if (state.stepIndex >= items.length)
      state.stepIndex = Math.max(0, items.length - 1);
    const item = items[state.stepIndex];
    const frame = $("#stage-frame");
    const img = $("#main-shot");
    const empty = $("#flow-empty");

    frame.classList.toggle("is-mobile", state.device === "mobile");
    renderStepStrip(items);

    if (!item) {
      img.hidden = true;
      img.removeAttribute("src");
      empty.hidden = false;
      renderSidebar(null);
      return;
    }

    empty.hidden = true;
    img.hidden = false;
    img.src = item.path;
    img.alt = item.description || `${item.site} krok ${item.step}`;
    renderSidebar(item);
  }

  function renderCompare() {
    const q = normalizeTag(compareQuery());
    const grid = $("#compare-grid");
    const empty = $("#compare-empty");
    const title = $("#compare-title");
    const sub = $("#compare-sub");

    title.textContent = state.activeTag
      ? `Tag: ${tagLabel(state.activeTag)}`
      : `Szukaj: „${state.search}”`;

    let total = 0;
    grid.innerHTML = state.sites
      .map((site) => {
        const matches = state.images
          .filter((i) => i.site === site && i.device === state.device)
          .filter((i) => {
            if (state.activeTag) {
              return (i.tags || [i.tag]).includes(state.activeTag);
            }
            return matchesSearch(i, q);
          })
          .sort((a, b) => a.step - b.step);
        total += matches.length;
        const cards = matches.length
          ? matches
              .map(
                (item) => `
          <button type="button" class="compare-card${
            state.device === "mobile" ? " is-mobile" : ""
          }" data-site="${item.site}" data-step="${item.step}">
            <img src="${item.path}" alt="" loading="lazy" />
            <div class="compare-card-meta">
              <span class="step">Krok ${item.step}</span>
              <div class="tags">${(item.tags || [item.tag])
                .map((t) => `<span>${tagLabel(t)}</span>`)
                .join("")}</div>
            </div>
          </button>`
              )
              .join("")
          : `<div class="compare-col-empty">Brak ekranów</div>`;
        return `
        <div class="compare-col">
          <h2 class="compare-col-title">${siteLabel(site)} · ${
          matches.length
        }</h2>
          ${cards}
        </div>`;
      })
      .join("");

    sub.textContent = `${total} ekranów · ${
      state.device === "mobile" ? "Mobile" : "Desktop"
    } · ${state.sites.map(siteLabel).join(" · ")}`;
    empty.hidden = total > 0;
  }

  function syncMode() {
    const compare = isCompareMode();
    $("#flow-mode").hidden = compare;
    $("#compare-mode").hidden = !compare;
    document.body.classList.toggle("is-compare", compare);
    updateSiteLabel();
    updateTagSearchLabel();
    renderSiteList();
    renderTagChips();
    if (compare) renderCompare();
    else renderFlow();
  }

  function setDevice(device) {
    state.device = device;
    state.stepIndex = 0;
    $$(".device-toggle .pill-btn").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.device === device)
    );
    syncMode();
  }

  function setSite(site) {
    state.site = site;
    state.stepIndex = 0;
    state.search = "";
    state.activeTag = null;
    $("#tag-search").value = "";
    setNavOpen(false);
    syncMode();
  }

  function activateTag(tag) {
    state.activeTag = tag;
    state.search = "";
    $("#tag-search").value = "";
    syncMode();
  }

  function clearSearch() {
    state.search = "";
    state.activeTag = null;
    $("#tag-search").value = "";
    syncMode();
  }

  function bind() {
    $$(".device-toggle .pill-btn").forEach((btn) => {
      btn.addEventListener("click", () => setDevice(btn.dataset.device));
    });
    $("#tag-search-toggle").addEventListener("click", (e) => {
      e.stopPropagation();
      setTagsOpen(!state.tagsOpen);
    });
    $("#tag-popover").addEventListener("click", (e) => e.stopPropagation());
    document.addEventListener("click", () => {
      if (state.tagsOpen) setTagsOpen(false);
    });
    $$(".nav-variant-toggle .pill-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setNavVariant(btn.dataset.nav);
        if (state.navOpen) {
          // re-open so layout variant applies cleanly
          setNavOpen(false);
          requestAnimationFrame(() => setNavOpen(true));
        }
      });
    });
    $("#site-nav-open").addEventListener("click", () => {
      if (!state.navOpen) setTagsOpen(false);
      setNavOpen(!state.navOpen);
    });
    $("#site-nav-close").addEventListener("click", () => setNavOpen(false));
    $("#site-nav-backdrop").addEventListener("click", () => setNavOpen(false));
    $("#site-list").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-site]");
      if (!btn) return;
      setSite(btn.dataset.site);
    });
    $("#site-search").addEventListener("input", (e) => {
      state.siteFilter = e.target.value;
      renderSiteList();
    });
    $("#tag-search").addEventListener("input", (e) => {
      state.search = normalizeTag(e.target.value);
      state.activeTag = null;
      state.stepIndex = 0;
      syncMode();
    });
    $("#tag-chips").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tag]");
      if (!btn) return;
      const tag = btn.dataset.tag;
      if (state.activeTag === tag) clearSearch();
      else activateTag(tag);
      setTagsOpen(false);
    });
    $("#step-strip").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-idx]");
      if (!btn) return;
      state.stepIndex = Number(btn.dataset.idx);
      renderFlow();
    });
    $("#sidebar-tags").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tag]");
      if (!btn) return;
      activateTag(btn.dataset.tag);
    });
    $("#compare-grid").addEventListener("click", (e) => {
      const card = e.target.closest("[data-site][data-step]");
      if (!card) return;
      state.site = card.dataset.site;
      state.search = "";
      state.activeTag = null;
      $("#tag-search").value = "";
      const items = flowItems();
      const idx = items.findIndex((i) => String(i.step) === card.dataset.step);
      state.stepIndex = idx >= 0 ? idx : 0;
      syncMode();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.navOpen) {
        e.preventDefault();
        setNavOpen(false);
        return;
      }
      if (e.key === "Escape" && state.tagsOpen) {
        e.preventDefault();
        setTagsOpen(false);
        return;
      }
      if (isCompareMode()) return;
      if (e.target.matches("input, textarea")) return;
      const items = flowItems();
      if (!items.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        state.stepIndex = Math.min(items.length - 1, state.stepIndex + 1);
        renderFlow();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        state.stepIndex = Math.max(0, state.stepIndex - 1);
        renderFlow();
      }
    });
  }

  async function init() {
    const res = await fetch("images.json");
    state.images = await res.json();
    state.images.forEach((i) => {
      i.tags = (i.tags || []).filter((t) => t !== "ranking ofert");
      if (i.tag === "ranking ofert") i.tag = "offers";
      if (!i.tags.includes(i.tag)) i.tags.unshift(i.tag);
    });
    state.sites = discoverSites();
    state.site = state.sites.includes("rankomat")
      ? "rankomat"
      : state.sites[0] || null;
    bind();
    applyNavVariant();
    setNavOpen(false);
    syncMode();
  }

  init().catch((err) => {
    console.error(err);
    $("#flow-empty").hidden = false;
    $("#flow-empty").innerHTML =
      "<p>Nie udało się wczytać images.json. Uruchom lokalny serwer HTTP z folderu aplikacji.</p>";
  });
})();
