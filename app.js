(() => {
  const SITE_LABELS = {
    rankomat: "Rankomat",
    kioskpolis: "Kiosk Polis",
    insurify: "Insurify",
    thezebra: "The Zebra",
    nerdwallet: "NerdWallet",
    gocompare: "GoCompare",
    lemonade: "Lemonade",
    mubi: "Mubi",
    beesafe: "Beesafe",
    link4: "Link4",
    policygenius: "Policygenius",
    marshmallow: "Marshmallow",
    getsafe: "Getsafe",
    feather: "Feather",
    comparethemarket: "Compare the Market",
    confused: "Confused.com",
    root: "Root Insurance",
    progressive: "Progressive",
    hedvig: "Hedvig",
    trasti: "Trasti",
    warta: "Warta",
    ominimo: "Ominimo",
    pevno: "Pevno",
    redclick: "Redclick",
    klik: "Klik.cz",
    rixo: "Rixo.cz",
    lovys: "Lovys",
    pillow: "Pillow.cz",
    jerry: "Jerry",
    hugo: "Hugo",
    cleverea: "Cleverea",
    balcia: "Balcia",
  };

  // Rynek przechwyconego flow (kraj strony/aplikacji). Każdy nowy site → dopisz tutaj.
  const SITE_COUNTRIES = {
    rankomat: "PL",
    kioskpolis: "PL",
    mubi: "PL",
    beesafe: "PL",
    link4: "PL",
    insurify: "US",
    thezebra: "US",
    nerdwallet: "US",
    lemonade: "US",
    policygenius: "US",
    gocompare: "GB",
    marshmallow: "GB",
    getsafe: "DE",
    feather: "DE",
    comparethemarket: "GB",
    confused: "GB",
    root: "US",
    progressive: "US",
    hedvig: "SE",
    trasti: "PL",
    warta: "PL",
    ominimo: "PL",
    pevno: "PL",
    redclick: "PL",
    klik: "CZ",
    rixo: "CZ",
    lovys: "FR",
    pillow: "CZ",
    jerry: "US",
    hugo: "US",
    cleverea: "ES",
    balcia: "PL",
  };

  // Strony ukryte w galerii (pliki i wpisy w images.json zostają). Aby przywrócić — usuń id z listy.
  const HIDDEN_SITES = new Set(["balcia"]);

  const COUNTRIES = {
    PL: { flag: "\u{1F1F5}\u{1F1F1}", name: "Polska" },
    US: { flag: "\u{1F1FA}\u{1F1F8}", name: "USA" },
    GB: { flag: "\u{1F1EC}\u{1F1E7}", name: "UK" },
    DE: { flag: "\u{1F1E9}\u{1F1EA}", name: "Niemcy" },
    SE: { flag: "\u{1F1F8}\u{1F1EA}", name: "Szwecja" },
    CZ: { flag: "\u{1F1E8}\u{1F1FF}", name: "Czechy" },
    FR: { flag: "\u{1F1EB}\u{1F1F7}", name: "Francja" },
    ES: { flag: "\u{1F1EA}\u{1F1F8}", name: "Hiszpania" },
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

  const state = {
    images: [],
    sites: [],
    siteCounts: {}, // { site: { desktop: n, mobile: n } } z images.json
    tagsOpen: false,
    device: "desktop",
    site: null,
    stepIndex: 0,
    search: "",
    activeTag: null,
    view: "home", // home | flow | compare
    lightbox: false,
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  function siteLabel(id) {
    return SITE_LABELS[id] || id;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);
  }

  function siteCountry(id) {
    const code = SITE_COUNTRIES[id];
    return code && COUNTRIES[code] ? { code, ...COUNTRIES[code] } : null;
  }

  // flaga (emoji) z dostępną etykietą; przy braku obsługi emoji CSS pokazuje kod kraju
  function siteFlag(id) {
    const c = siteCountry(id);
    if (!c) return "";
    return `<span class="site-flag" role="img" aria-label="${c.name}" title="${c.name}" data-code="${c.code}">${c.flag}</span>`;
  }

  function siteName(id) {
    return `${siteFlag(id)}<span class="site-name">${escapeHtml(siteLabel(id))}</span>`;
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

  function countSites() {
    const counts = {};
    state.images.forEach((i) => {
      if (!i.site || !i.device) return;
      const c = (counts[i.site] = counts[i.site] || { desktop: 0, mobile: 0 });
      c[i.device] = (c[i.device] || 0) + 1;
    });
    return counts;
  }

  function siteHasDevice(siteId, device = state.device) {
    const c = state.siteCounts[siteId];
    return Boolean(c && c[device] > 0);
  }

  // strony, które mają choć jeden ekran dla bieżącego urządzenia
  function visibleSites() {
    return state.sites.filter((id) => siteHasDevice(id));
  }

  function matchesSearch(item, q) {
    if (!q) return true;
    const hay = [
      ...(item.tags || []),
      item.tag,
      item.label,
      item.description,
      item.site,
      siteLabel(item.site),
    ]
      .map(normalizeTag)
      .join(" ");
    return hay.includes(q);
  }

  function siteMatchesQuery(siteId, q) {
    if (!q) return false;
    return (
      normalizeTag(siteId).includes(q) ||
      normalizeTag(siteLabel(siteId)).includes(q)
    );
  }

  function flowItems() {
    return state.images
      .filter((i) => i.site === state.site && i.device === state.device)
      .sort((a, b) => a.step - b.step);
  }

  function coverForSite(siteId) {
    const forDevice = state.images
      .filter((i) => i.site === siteId && i.device === state.device)
      .sort((a, b) => a.step - b.step);
    if (forDevice.length) return forDevice[0];
    const any = state.images
      .filter((i) => i.site === siteId)
      .sort((a, b) => a.step - b.step);
    return any[0] || null;
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

  function updateSearchChrome() {
    const wrap = document.querySelector(".search-wrap");
    if (wrap) {
      wrap.classList.toggle(
        "has-filter",
        Boolean(state.activeTag || state.search)
      );
    }
  }

  function setTagsOpen(open) {
    state.tagsOpen = Boolean(open);
    const pop = $("#tag-popover");
    if (pop) pop.hidden = !state.tagsOpen;
    updateSearchChrome();
  }

  function updateChrome() {
    const back = $("#back-btn");
    const siteLabelEl = $("#site-current-label");
    const onFlow = state.view === "flow";
    const onCompare = state.view === "compare";
    if (back) back.hidden = !(onFlow || onCompare);
    if (siteLabelEl) {
      if (onFlow && state.site) {
        siteLabelEl.hidden = false;
        siteLabelEl.innerHTML = siteName(state.site);
      } else {
        siteLabelEl.hidden = true;
      }
    }
    updateSearchChrome();
  }

  function renderSiteCards() {
    const el = $("#site-cards");
    if (!el) return;
    el.innerHTML = visibleSites()
      .map((id) => {
        const cover = coverForSite(id);
        const mobile = state.device === "mobile" ? " is-mobile" : "";
        const img = cover
          ? `<img class="site-card-thumb" src="${cover.path}" alt="" loading="lazy" />`
          : `<div class="site-card-thumb" style="display:flex;align-items:center;justify-content:center;color:var(--faint);font-size:13px">Brak zrzutu</div>`;
        return `<button type="button" class="site-card${mobile}" data-site="${id}">
          ${img}
          <span class="site-card-label">${siteName(id)}</span>
        </button>`;
      })
      .join("");
  }

  function renderTagChips() {
    const el = $("#tag-chips");
    if (!el) return;
    const q = state.search;
    const siteChips = visibleSites()
      .filter((id) => !q || siteMatchesQuery(id, q))
      .map((id) => {
        const active = q && siteMatchesQuery(id, q);
        return `<button type="button" class="tag-chip is-site${
          active ? " is-active" : ""
        }" data-site-chip="${id}">${siteName(id)}</button>`;
      })
      .join("");
    const tags = allTagsForDevice().filter(([t]) => {
      if (!q) return true;
      return (
        normalizeTag(t).includes(q) ||
        normalizeTag(tagLabel(t)).includes(q)
      );
    });
    const tagChips = tags
      .map(([t, n]) => {
        const active =
          state.activeTag === t ||
          (state.search && normalizeTag(t).includes(state.search));
        return `<button type="button" class="tag-chip${
          active ? " is-active" : ""
        }" data-tag="${t}">${tagLabel(t)} · ${n}</button>`;
      })
      .join("");
    el.innerHTML = siteChips + tagChips;
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
    $("#sidebar-site").innerHTML = siteName(item.site);
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

    renderStepNav(items);

    if (!item) {
      $("#shot-open").hidden = true;
      img.removeAttribute("src");
      empty.hidden = false;
      renderSidebar(null);
      closeLightbox();
      return;
    }

    empty.hidden = true;
    $("#shot-open").hidden = false;
    if (img.getAttribute("src") !== item.path) {
      // nowy ekran = start od góry (wysoki screenshot przewija się wewnątrz .stage)
      const stage = frame.closest(".stage");
      if (stage) stage.scrollTop = 0;
    }
    img.src = item.path;
    img.alt = item.description || `${item.site} krok ${item.step}`;
    renderSidebar(item);
    revealActiveThumb();
    preloadNeighbours(items);
    if (state.lightbox) renderLightbox();
  }

  function renderStepNav(items) {
    const total = items.length;
    const atStart = state.stepIndex <= 0;
    const atEnd = state.stepIndex >= total - 1;
    const counter = total ? `${state.stepIndex + 1} / ${total}` : "—";
    $("#stage-nav").hidden = !total;
    $("#stage-counter").textContent = counter;
    $("#stage-prev").disabled = !total || atStart;
    $("#stage-next").disabled = !total || atEnd;
    $("#lightbox-counter").textContent = counter;
    $("#lightbox-prev").disabled = !total || atStart;
    $("#lightbox-next").disabled = !total || atEnd;
  }

  function revealActiveThumb() {
    const strip = $("#step-strip");
    const el = strip && strip.querySelector(".step-thumb.is-active");
    if (!el) return;
    const s = strip.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (r.left < s.left) strip.scrollLeft += r.left - s.left - 8;
    else if (r.right > s.right) strip.scrollLeft += r.right - s.right + 8;
    if (r.top < s.top) strip.scrollTop += r.top - s.top - 8;
    else if (r.bottom > s.bottom) strip.scrollTop += r.bottom - s.bottom + 8;
  }

  function preloadNeighbours(items) {
    [state.stepIndex - 1, state.stepIndex + 1].forEach((i) => {
      if (items[i]) new Image().src = items[i].path;
    });
  }

  function goStep(delta) {
    const items = flowItems();
    if (!items.length) return;
    const next = Math.min(
      items.length - 1,
      Math.max(0, state.stepIndex + delta)
    );
    if (next === state.stepIndex) return;
    state.stepIndex = next;
    renderFlow();
  }

  /* ——— Lightbox (pojedynczy ekran powiększony) ——— */
  function renderLightbox() {
    const items = flowItems();
    const item = items[state.stepIndex];
    if (!item) return;
    const box = $("#lightbox");
    const img = $("#lightbox-img");
    box.classList.toggle("is-mobile", item.device === "mobile");
    img.src = item.path;
    img.alt = item.description || `${item.site} krok ${item.step}`;
    $("#lightbox-title").innerHTML = `${siteName(item.site)} · krok ${
      item.step
    } · ${escapeHtml(tagLabel(item.tag))}`;
  }

  function openLightbox() {
    if (state.view !== "flow" || !flowItems().length) return;
    state.lightbox = true;
    $("#lightbox").hidden = false;
    document.body.classList.add("lightbox-open");
    renderLightbox();
    renderStepNav(flowItems());
    $("#lightbox-close").focus();
  }

  function closeLightbox() {
    if (!state.lightbox) return;
    state.lightbox = false;
    $("#lightbox").hidden = true;
    document.body.classList.remove("lightbox-open");
    const opener = $("#shot-open");
    if (opener && !opener.hidden) opener.focus({ preventScroll: true });
  }

  function bindSwipe(el) {
    let start = null;
    el.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length !== 1) {
          start = null;
          return;
        }
        start = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      },
      { passive: true }
    );
    el.addEventListener(
      "touchend",
      (e) => {
        if (!start) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        start = null;
        if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        el.dataset.swiped = "1";
        setTimeout(() => delete el.dataset.swiped, 400);
        goStep(dx < 0 ? 1 : -1);
      },
      { passive: true }
    );
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

    const matches = state.images
      .filter((i) => i.device === state.device)
      .filter((i) => {
        if (state.activeTag) {
          return (i.tags || [i.tag]).includes(state.activeTag);
        }
        if (siteMatchesQuery(i.site, q)) return true;
        return matchesSearch(i, q);
      })
      .sort((a, b) => {
        const bySite = siteLabel(a.site).localeCompare(siteLabel(b.site), "pl");
        if (bySite) return bySite;
        return a.step - b.step;
      });

    grid.className = "result-cards";
    grid.innerHTML = matches
      .map((item) => {
        const desc = (item.description || "").trim();
        const mobile = state.device === "mobile" ? " is-mobile" : "";
        const descHtml = desc
          ? `<span class="result-card-desc">${desc}</span>`
          : "";
        return `<button type="button" class="result-card${mobile}" data-site="${item.site}" data-step="${item.step}">
          <img class="result-card-thumb" src="${item.path}" alt="" loading="lazy" />
          <span class="result-card-app">${siteName(item.site)}</span>
          <span class="result-card-step">krok ${item.step}</span>
          ${descHtml}
        </button>`;
      })
      .join("");

    sub.textContent = `${matches.length} ekranów · ${
      state.device === "mobile" ? "Mobile" : "Desktop"
    }`;
    empty.hidden = matches.length > 0;
  }

  function syncMode() {
    // strona bez ekranów dla bieżącego urządzenia → powrót do siatki
    if (state.site && !siteHasDevice(state.site)) {
      state.site = null;
      state.stepIndex = 0;
    }
    if (isCompareMode()) {
      state.view = "compare";
    } else if (state.site) {
      state.view = "flow";
    } else {
      state.view = "home";
    }

    $("#home-mode").hidden = state.view !== "home";
    $("#flow-mode").hidden = state.view !== "flow";
    $("#compare-mode").hidden = state.view !== "compare";
    document.body.classList.toggle("is-compare", state.view === "compare");
    document.body.classList.toggle("is-home", state.view === "home");
    document.body.classList.toggle("is-flow", state.view === "flow");

    updateChrome();
    renderTagChips();

    if (state.view === "home") renderSiteCards();
    else if (state.view === "compare") renderCompare();
    else renderFlow();
    if (state.view !== "flow") closeLightbox();
  }

  function setDevice(device) {
    state.device = device;
    state.stepIndex = 0;
    $$(".device-toggle .pill-btn").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.device === device)
    );
    syncMode();
  }

  function goHome() {
    state.site = null;
    state.stepIndex = 0;
    state.search = "";
    state.activeTag = null;
    $("#tag-search").value = "";
    setTagsOpen(false);
    syncMode();
  }

  function setSite(site) {
    state.site = site;
    state.stepIndex = 0;
    state.search = "";
    state.activeTag = null;
    $("#tag-search").value = "";
    setTagsOpen(false);
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
    $("#back-btn").addEventListener("click", () => goHome());
    const appTitle = $("#app-title");
    if (appTitle) {
      appTitle.addEventListener("click", (e) => {
        e.preventDefault();
        goHome();
      });
    }
    const searchInput = $("#tag-search");
    const searchBox = $("#tag-search-box");
    searchInput.addEventListener("focus", () => {
      setTagsOpen(true);
      renderTagChips();
    });
    searchInput.addEventListener("click", (e) => {
      e.stopPropagation();
      setTagsOpen(true);
      searchInput.focus();
    });
    searchBox.addEventListener("click", (e) => e.stopPropagation());
    $("#tag-popover").addEventListener("click", (e) => e.stopPropagation());
    document.addEventListener("click", () => {
      if (state.tagsOpen) setTagsOpen(false);
    });
    $("#site-cards").addEventListener("click", (e) => {
      const card = e.target.closest("[data-site]");
      if (!card) return;
      setSite(card.dataset.site);
    });
    searchInput.addEventListener("input", (e) => {
      state.search = normalizeTag(e.target.value);
      state.activeTag = null;
      state.stepIndex = 0;
      setTagsOpen(true);
      syncMode();
    });
    $("#tag-chips").addEventListener("click", (e) => {
      const siteBtn = e.target.closest("[data-site-chip]");
      if (siteBtn) {
        setSite(siteBtn.dataset.siteChip);
        return;
      }
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
    $$("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        goStep(Number(btn.dataset.nav));
      });
    });
    $("#shot-open").addEventListener("click", () => {
      if ($("#stage-frame").dataset.swiped) return;
      openLightbox();
    });
    $("#lightbox-close").addEventListener("click", () => closeLightbox());
    $("#lightbox").addEventListener("click", (e) => {
      // klik w tło (poza obrazem i przyciskami) zamyka podgląd
      if (e.target.closest("button, img")) return;
      if ($("#lightbox-stage").dataset.swiped) return;
      closeLightbox();
    });
    bindSwipe($("#stage-frame"));
    bindSwipe($("#lightbox-stage"));
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
      if (state.lightbox) {
        if (e.key === "Escape") {
          e.preventDefault();
          closeLightbox();
        } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          goStep(1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          goStep(-1);
        } else if (e.key === "Tab") {
          // fokus zostaje w oknie podglądu
          const f = $$("#lightbox button:not([disabled])");
          if (!f.length) return;
          const i = f.indexOf(document.activeElement);
          const n = e.shiftKey
            ? (i <= 0 ? f.length - 1 : i - 1)
            : (i + 1) % f.length;
          e.preventDefault();
          f[n].focus();
        }
        return;
      }
      if (e.key === "Escape" && state.tagsOpen) {
        e.preventDefault();
        setTagsOpen(false);
        return;
      }
      if (state.view !== "flow") return;
      if (e.target.matches("input, textarea")) return;
      if (!flowItems().length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goStep(1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goStep(-1);
      }
    });
  }

  // Czy przeglądarka rysuje flagi (kolorowe piksele)? Jeśli nie → body.flags-text (kod kraju).
  async function detectFlagSupport() {
    try {
      if (document.fonts && document.fonts.load) {
        await document.fonts.load('20px "Twemoji Country Flags"', "\u{1F1F5}\u{1F1F1}");
      }
      const cv = document.createElement("canvas");
      cv.width = cv.height = 24;
      const ctx = cv.getContext("2d", { willReadFrequently: true });
      ctx.font = '20px "Twemoji Country Flags", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.textBaseline = "top";
      ctx.fillStyle = "#000";
      ctx.fillText("\u{1F1F5}\u{1F1F1}", 0, 0);
      const d = ctx.getImageData(0, 0, 24, 24).data;
      let colored = false;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] && (Math.abs(d[i] - d[i + 1]) > 40 || Math.abs(d[i] - d[i + 2]) > 40)) {
          colored = true;
          break;
        }
      }
      document.documentElement.classList.toggle("flags-text", !colored);
    } catch (e) {
      document.documentElement.classList.add("flags-text");
    }
  }

  async function init() {
    detectFlagSupport();
    const res = await fetch("images.json");
    state.images = (await res.json()).filter((i) => !HIDDEN_SITES.has(i.site));
    state.images.forEach((i) => {
      i.tags = (i.tags || []).filter((t) => t !== "ranking ofert");
      if (i.tag === "ranking ofert") i.tag = "offers";
      if (!i.tags.includes(i.tag)) i.tags.unshift(i.tag);
    });
    state.sites = discoverSites();
    state.siteCounts = countSites();
    state.site = null;
    bind();
    setTagsOpen(false);
    syncMode();
  }

  init().catch((err) => {
    console.error(err);
    $("#home-mode").hidden = false;
    $("#site-cards").innerHTML =
      "<p class=\"empty-state\">Nie udało się wczytać images.json.</p>";
  });
})();
