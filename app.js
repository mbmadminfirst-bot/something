import {
  DESTINATIONS,
  FILTERS,
  MOODS,
  filterDestinations,
  recommendedForMood,
  resolveItinerary,
} from "./data.js";

const STORAGE_KEY = "yol-itinerary-v1";
const THEME_KEY = "yol-theme";
const state = {
  category: "all",
  query: "",
  mood: "history",
  plannedIds: [],
  openDestination: null,
  lastSurprise: null,
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const destinationById = new Map(DESTINATIONS.map((destination) => [destination.id, destination]));
let lastFocusedElement = null;
let toastTimer = 0;

function readStoredPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved)) return resolveItinerary(saved).stops.map((stop) => stop.id);
  } catch (_) {
    // Private browsing or malformed older data should never stop the atlas loading.
  }
  return [];
}

function persistPlan() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.plannedIds));
  } catch (_) {
    showToast("Brauzer saqlashga ruxsat bermadi. Reja sahifa ochiq turganda ishlaydi.");
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2900);
}

function icon(name) {
  return `<svg aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function renderFilters() {
  $("#filter-list").innerHTML = FILTERS.map((filter) => `
    <button class="filter-chip" type="button" data-category="${filter.id}" aria-pressed="${state.category === filter.id}">${filter.label}</button>
  `).join("");
}

function renderMoodOptions() {
  $("#mood-options").innerHTML = MOODS.map((mood) => `
    <button class="mood-option" type="button" data-mood="${mood.id}" aria-pressed="${state.mood === mood.id}">
      <span class="mood-option-icon" aria-hidden="true">${mood.icon}</span>${mood.label}
    </button>
  `).join("");
}

function renderMoodResult() {
  const mood = MOODS.find((entry) => entry.id === state.mood) || MOODS[0];
  const suggestions = recommendedForMood(mood.id);
  const destination = suggestions[0];
  if (!destination) return;

  const additionalNames = suggestions.slice(1).map((item) => item.name).join(" · ");
  const isPlanned = state.plannedIds.includes(destination.id);
  $("#mood-result").innerHTML = `
    <img src="${destination.image}" alt="${destination.imageAlt}" loading="lazy" />
    <div class="mood-result-top">SIZ TANLAGAN KAYFIYAT</div>
    <div class="mood-result-body">
      <span class="mood-result-kicker">${destination.categoryLabel.toLocaleUpperCase("uz")}</span>
      <h3>${destination.name}</h3>
      <p>${mood.description}</p>
      <div class="mood-result-actions">
        <button class="mood-result-link" type="button" data-open-destination="${destination.id}">Manzilga nazar ${icon("arrow")}</button>
        <span class="mood-other">Yana: ${additionalNames}</span>
      </div>
    </div>
  `;
  const result = $("#mood-result");
  result.setAttribute("aria-label", `${mood.label}: ${destination.name}`);
  result.dataset.featured = destination.id;
  result.dataset.planned = String(isPlanned);
}

function renderDestinations() {
  const destinations = filterDestinations({ query: state.query, category: state.category });
  const grid = $("#destination-grid");
  const empty = $("#empty-results");
  $("#result-count").textContent = `${destinations.length} manzil`;
  empty.hidden = destinations.length !== 0;
  grid.hidden = destinations.length === 0;

  grid.innerHTML = destinations.map((destination, index) => {
    const added = state.plannedIds.includes(destination.id);
    return `
      <article class="destination-card">
        <button class="destination-card-media" type="button" data-open-destination="${destination.id}" aria-label="${destination.name} haqida batafsil ma’lumot">
          <img src="${destination.image}" alt="${destination.imageAlt}" loading="lazy" decoding="async" />
          <span class="card-number">${String(index + 1).padStart(2, "0")}</span>
          <span class="card-type">${destination.categoryLabel.toLocaleUpperCase("uz")}</span>
        </button>
        <div class="card-body">
          <div class="card-heading"><h3>${destination.name}</h3></div>
          <p class="card-region">${destination.region}</p>
          <p class="card-note">${destination.cardNote}</p>
          <div class="card-footer">
            <span class="card-duration">${icon("clock")} ${destination.duration} kun · tavsiya</span>
            <button class="add-stop${added ? " is-added" : ""}" type="button" data-plan-toggle="${destination.id}" aria-label="${added ? `${destination.name}ni rejadan olib tashlash` : `${destination.name}ni rejaga qo‘shish`}" aria-pressed="${added}" title="${added ? "Rejadan olib tashlash" : "Rejaga qo‘shish"}">
              ${icon(added ? "check" : "plus")}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderMapPins() {
  $("#map-pins").innerHTML = DESTINATIONS.map((destination) => {
    const planned = state.plannedIds.includes(destination.id);
    return `
      <button class="map-pin${planned ? " is-planned" : ""}" type="button" data-open-destination="${destination.id}" data-side="${destination.mapLabelSide || "bottom"}" style="--left:${destination.coordinates.x}%;--top:${destination.coordinates.y}%" aria-label="${destination.name} haqida batafsil ma’lumot${planned ? ", safar rejangizda" : ""}" title="${destination.name}">
        <span class="map-pin-dot" aria-hidden="true"></span><span class="map-pin-label">${destination.name}</span>
      </button>
    `;
  }).join("");
}

function renderMapRoute() {
  const route = $("#map-route-selected");
  const canvas = $("#map-canvas");
  const points = state.plannedIds
    .map((id) => destinationById.get(id))
    .filter(Boolean)
    .map(({ coordinates }) => `${(coordinates.x * 10).toFixed(1)},${(coordinates.y * 6.4).toFixed(1)}`);

  if (points.length < 2) {
    route.setAttribute("d", "");
    canvas.classList.remove("has-route");
    return;
  }

  route.setAttribute("d", `M ${points.join(" L ")}`);
  canvas.classList.add("has-route");
}

function renderPlan() {
  const summary = resolveItinerary(state.plannedIds);
  const countLabel = $("#header-count");
  countLabel.textContent = String(summary.count);
  $("#planner-summary").innerHTML = `
    <span>${summary.count}<small>MANZIL</small></span>
    <i aria-hidden="true"></i>
    <span>${summary.days}<small>KUN · TAVSIYA</small></span>
  `;

  const list = $("#planner-stops");
  list.innerHTML = summary.stops.map((destination, index) => `
    <div class="planner-stop" data-stop-id="${destination.id}">
      <span class="stop-index">${String(index + 1).padStart(2, "0")}</span>
      <span class="stop-name">${destination.name}</span>
      <span class="stop-days">${destination.duration} kun</span>
      <span class="stop-move-controls">
        <button class="stop-move" type="button" data-move-stop="${destination.id}" data-direction="up" aria-label="${destination.name}ni yuqoriga ko‘chirish" ${index === 0 ? "disabled" : ""}>↑</button>
        <button class="stop-move" type="button" data-move-stop="${destination.id}" data-direction="down" aria-label="${destination.name}ni pastga ko‘chirish" ${index === summary.count - 1 ? "disabled" : ""}>↓</button>
      </span>
      <button class="stop-remove" type="button" data-remove-stop="${destination.id}" aria-label="${destination.name}ni rejadan olib tashlash">${icon("close")}</button>
    </div>
  `).join("");

  const empty = $("#planner-empty");
  empty.hidden = summary.count > 0;
  $("#share-plan").disabled = summary.count === 0;
  $("#clear-plan").disabled = summary.count === 0;
  $("#planner-note").textContent = summary.count
    ? "Tartibni ↑ ↓ bilan o‘zgartiring. Reja shu brauzerda saqlanadi."
    : "Rejangiz faqat shu brauzerda saqlanadi.";

  renderDestinations();
  renderMapPins();
  renderMapRoute();
  renderMoodResult();
}

function togglePlan(id) {
  const destination = destinationById.get(id);
  if (!destination) return;

  const existingIndex = state.plannedIds.indexOf(id);
  if (existingIndex >= 0) {
    state.plannedIds.splice(existingIndex, 1);
    showToast(`${destination.name} rejangizdan olib tashlandi.`);
  } else {
    state.plannedIds.push(id);
    showToast(`${destination.name} safar rejangizga qo‘shildi.`);
  }

  persistPlan();
  renderPlan();
  if (state.openDestination) {
    renderDetail(state.openDestination);
    $("#detail-content [data-detail-toggle]")?.focus({ preventScroll: true });
  }
}

function moveStop(id, direction) {
  const index = state.plannedIds.indexOf(id);
  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || nextIndex < 0 || nextIndex >= state.plannedIds.length) return;
  [state.plannedIds[index], state.plannedIds[nextIndex]] = [state.plannedIds[nextIndex], state.plannedIds[index]];
  persistPlan();
  renderPlan();
}

function renderDetail(destination) {
  const added = state.plannedIds.includes(destination.id);
  $("#detail-content").innerHTML = `
    <div class="detail-layout">
      <div class="detail-visual">
        <img src="${destination.image}" alt="${destination.imageAlt}" />
        <span class="detail-image-label">${destination.categoryLabel.toLocaleUpperCase("uz")}</span>
      </div>
      <div class="detail-copy">
        <div class="detail-eyebrow">MANZIL · ${destination.categoryLabel.toLocaleUpperCase("uz")}</div>
        <h2 id="detail-title">${destination.name}</h2>
        <p class="detail-region">${destination.region}</p>
        <div class="detail-facts"><span>${icon("clock")} ${destination.duration} kun tavsiya</span><span>${icon("sun")} ${destination.season}</span></div>
        <p class="detail-story" id="detail-story">${destination.story}</p>
        <h3>YO‘LDA KO‘RING</h3>
        <ul class="detail-highlights">${destination.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}</ul>
        <div class="detail-tip"><strong>MAHALLIY MASLAHAT</strong>${destination.localTip}</div>
        <div class="detail-actions">
          <button class="button button-dark" type="button" data-detail-toggle="${destination.id}" aria-pressed="${added}">${icon(added ? "check" : "plus")} ${added ? "Rejadan olib tashlash" : "Safar rejasiga qo‘shish"}</button>
          <span class="detail-save-note">Rejangiz shu qurilmada saqlanadi.</span>
        </div>
      </div>
    </div>
  `;
}

function openDetail(id, trigger = document.activeElement) {
  const destination = destinationById.get(id);
  if (!destination) return;
  state.openDestination = destination;
  lastFocusedElement = trigger instanceof HTMLElement ? trigger : null;
  renderDetail(destination);
  $("#detail-modal").hidden = false;
  document.body.classList.add("modal-open");
  $(".modal-close").focus({ preventScroll: true });
}

function closeDetail() {
  const modal = $("#detail-modal");
  if (modal.hidden) return;
  const destinationId = state.openDestination?.id;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  state.openDestination = null;
  const fallback = destinationId
    ? document.querySelector(`.map-pin[data-open-destination="${destinationId}"]`)
      || document.querySelector(`[data-open-destination="${destinationId}"]`)
    : null;
  (lastFocusedElement?.isConnected ? lastFocusedElement : fallback || $("#destinations-title"))?.focus({ preventScroll: true });
  lastFocusedElement = null;
}

function surpriseMe() {
  const pool = DESTINATIONS.filter((destination) => destination.id !== state.lastSurprise);
  const destination = pool[Math.floor(Math.random() * pool.length)] || DESTINATIONS[0];
  state.lastSurprise = destination.id;
  openDetail(destination.id);
  showToast(`Bugungi kutilmagan manzil: ${destination.name}.`);
}

function buildShareText(summary) {
  const lines = summary.stops.map((destination, index) => `${index + 1}. ${destination.name} — ${destination.duration} kun tavsiya`);
  return [
    "YO‘L — mening O‘zbekiston sayohat rejam",
    "",
    ...lines,
    "",
    `Jami: ${summary.count} manzil · ${summary.days} kun tavsiya`,
    "",
    "Rejamni ko‘ring:",
  ].join("\n");
}

function buildShareUrl() {
  const url = new URL(window.location.href);
  url.hash = "reja";
  url.searchParams.set("safar", state.plannedIds.join(","));
  return url.toString();
}

async function sharePlan() {
  const summary = resolveItinerary(state.plannedIds);
  if (!summary.count) return;
  const text = buildShareText(summary);
  const url = buildShareUrl();
  const payload = { title: "Yo‘l — sayohat rejam", text, url };

  if (typeof navigator.share === "function") {
    try {
      await navigator.share(payload);
      showToast("Safar rejangiz ulashildi.");
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    showToast("Safar rejangiz va havola nusxalandi.");
  } catch (_) {
    const field = document.createElement("textarea");
    field.value = `${text}\n${url}`;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    showToast(copied ? "Safar rejangiz va havola nusxalandi." : "Havolani manzil satridan nusxalab ulashing.");
  }
}

function setTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  const button = $("#theme-toggle");
  const nextLabel = nextTheme === "dark" ? "Kunduzgi ko‘rinishga o‘tish" : "Tungi ko‘rinishga o‘tish";
  button.setAttribute("aria-label", nextLabel);
  button.setAttribute("title", nextLabel);
  const themeColor = document.querySelector('meta[name="theme-color"]');
  themeColor?.setAttribute("content", nextTheme === "dark" ? "#171f1d" : "#f4f1e8");
  try { localStorage.setItem(THEME_KEY, nextTheme); } catch (_) {}
}

function initializeFromUrl() {
  const sharedRoute = new URLSearchParams(window.location.search).get("safar");
  if (!sharedRoute) return false;
  const ids = sharedRoute.split(",").filter((id) => destinationById.has(id));
  if (!ids.length) return false;
  state.plannedIds = resolveItinerary(ids).stops.map((stop) => stop.id);
  persistPlan();
  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete("safar");
  window.history.replaceState({}, "", cleanUrl);
  return true;
}

function bindEvents() {
  $("#filter-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    $$(".filter-chip").forEach((chip) => chip.setAttribute("aria-pressed", String(chip === button)));
    renderDestinations();
  });

  $("#destination-search").addEventListener("input", (event) => {
    state.query = event.currentTarget.value;
    renderDestinations();
  });

  $("#clear-search").addEventListener("click", () => {
    state.query = "";
    state.category = "all";
    $("#destination-search").value = "";
    renderFilters();
    renderDestinations();
    $("#destination-search").focus();
  });

  $("#mood-options").addEventListener("click", (event) => {
    const button = event.target.closest("[data-mood]");
    if (!button) return;
    state.mood = button.dataset.mood;
    $$(".mood-option").forEach((option) => option.setAttribute("aria-pressed", String(option === button)));
    renderMoodResult();
  });

  document.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-open-destination]");
    if (openButton) {
      openDetail(openButton.dataset.openDestination, openButton);
      return;
    }

    const planButton = event.target.closest("[data-plan-toggle]");
    if (planButton) {
      const id = planButton.dataset.planToggle;
      togglePlan(id);
      document.querySelector(`[data-plan-toggle="${id}"]`)?.focus({ preventScroll: true });
      return;
    }

    const detailButton = event.target.closest("[data-detail-toggle]");
    if (detailButton) {
      togglePlan(detailButton.dataset.detailToggle);
      return;
    }

    const removeButton = event.target.closest("[data-remove-stop]");
    if (removeButton) {
      const rows = $$(".planner-stop");
      const removedIndex = rows.indexOf(removeButton.closest(".planner-stop"));
      togglePlan(removeButton.dataset.removeStop);
      const remaining = $$(".stop-remove");
      (remaining[Math.min(removedIndex, remaining.length - 1)] || $("#planner-title")).focus({ preventScroll: true });
      return;
    }

    const moveButton = event.target.closest("[data-move-stop]");
    if (moveButton && !moveButton.disabled) {
      const id = moveButton.dataset.moveStop;
      moveStop(id, moveButton.dataset.direction);
      document.querySelector(`[data-remove-stop="${id}"]`)?.focus({ preventScroll: true });
      return;
    }

    const scrollButton = event.target.closest("[data-scroll]");
    if (scrollButton) {
      document.getElementById(scrollButton.dataset.scroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
      $("#main-nav").classList.remove("is-open");
      $("#menu-toggle").setAttribute("aria-expanded", "false");
    }
  });

  $$(".surprise-trigger").forEach((button) => button.addEventListener("click", surpriseMe));
  $("#theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "light" : "dark");
  });
  $("#share-plan").addEventListener("click", sharePlan);
  $("#clear-plan").addEventListener("click", () => {
    if (!state.plannedIds.length) return;
    state.plannedIds = [];
    persistPlan();
    renderPlan();
    showToast("Safar daftaringiz tozalandi.");
  });

  $("#detail-modal").addEventListener("click", (event) => {
    if (event.target.closest("[data-close-modal]")) closeDetail();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDetail();
    if (event.key === "Tab" && !$("#detail-modal").hidden) {
      const focusable = $$("button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex='-1'])", $("#detail-modal"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      document.getElementById("manzillar").scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => $("#destination-search").focus(), 280);
    }
  });

  $("#menu-toggle").addEventListener("click", () => {
    const menu = $("#main-nav");
    const open = menu.classList.toggle("is-open");
    $("#menu-toggle").setAttribute("aria-expanded", String(open));
    $("#menu-toggle").setAttribute("aria-label", open ? "Menyuni yopish" : "Menyuni ochish");
  });

  $$("#main-nav a").forEach((link) => link.addEventListener("click", () => {
    $("#main-nav").classList.remove("is-open");
    $("#menu-toggle").setAttribute("aria-expanded", "false");
    $("#menu-toggle").setAttribute("aria-label", "Menyuni ochish");
  }));
}

function initialize() {
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // The atlas remains fully usable when service workers are unavailable.
    });
  }

  const imported = initializeFromUrl();
  if (!imported) state.plannedIds = readStoredPlan();

  renderFilters();
  renderMoodOptions();
  renderPlan();
  bindEvents();
  setTheme(document.documentElement.dataset.theme || "light");

  if (imported) {
    window.setTimeout(() => {
      showToast("Ulashilgan safar rejasi ochildi — uni o‘zingizga moslang.");
      document.getElementById("reja").scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  }
}

initialize();
