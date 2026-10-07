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
    tagsOpen: false,
    device: "desktop",
    site: null,
    stepIndex: 0,
    search: "",
    activeTag: null,
    view: "home", // home | flow | compare
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  function siteLabel(id) {
    return SITE_LABELS[id] || id;
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
        siteLabelEl.textContent = siteLabel(state.site);
      } else {
        siteLabelEl.hidden = true;
      }
    }
    updateSearchChrome();
  }

  function renderSiteCards() {
    const el = $("#site-cards");
    if (!el) return;
    el.innerHTML = state.sites
      .map((id) => {
        const cover = coverForSite(id);
        const mobile = state.device === "mobile" ? " is-mobile" : "";
        const img = cover
          ? `<img class="site-card-thumb" src="${cover.path}" alt="" loading="lazy" />`
          : `<div class="site-card-thumb" style="display:flex;align-items:center;justify-content:center;color:var(--faint);font-size:13px">Brak zrzutu</div>`;
        return `<button type="button" class="site-card${mobile}" data-site="${id}">
          ${img}
          <span class="site-card-label">${siteLabel(id)}</span>
        </button>`;
      })
      .join("");
  }

  function renderTagChips() {
    const el = $("#tag-chips");
    if (!el) return;
    const q = state.search;
    const siteChips = state.sites
      .filter((id) => !q || siteMatchesQuery(id, q))
      .map((id) => {
        const active = q && siteMatchesQuery(id, q);
        return `<button type="button" class="tag-chip is-site${
          active ? " is-active" : ""
        }" data-site-chip="${id}">${siteLabel(id)}</button>`;
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
          <span class="result-card-app">${siteLabel(item.site)}</span>
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
      if (e.key === "Escape" && state.tagsOpen) {
        e.preventDefault();
        setTagsOpen(false);
        return;
      }
      if (state.view !== "flow") return;
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
