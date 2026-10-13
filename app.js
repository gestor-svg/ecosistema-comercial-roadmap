// Ecosistema Comercial Completo — Roadmap PWA
// Lógica de la app: fechas, estado, checklist, búsqueda en Google, sync con Sheets.

const LS_KEYS = {
  startDate: "ecr.startDate",
  city: "ecr.city",
  sheetsUrl: "ecr.sheetsUrl",
  state: "ecr.state", // { [taskId]: { done: bool, timestamp: number } }
  queue: "ecr.queue", // array of pending syncs
};

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function addDays(isoDate, days) {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function loadState() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.state)) || {}; }
  catch { return {}; }
}
function saveState(state) {
  localStorage.setItem(LS_KEYS.state, JSON.stringify(state));
}
function loadQueue() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.queue)) || []; }
  catch { return []; }
}
function saveQueue(q) {
  localStorage.setItem(LS_KEYS.queue, JSON.stringify(q));
}

function getStartDate() {
  return localStorage.getItem(LS_KEYS.startDate) || null;
}
function getCity() {
  return localStorage.getItem(LS_KEYS.city) || "México";
}
function getSheetsUrl() {
  return localStorage.getItem(LS_KEYS.sheetsUrl) || "";
}

// ---------- Fechas calculadas por tarea ----------
function taskDate(task) {
  const start = getStartDate();
  if (!start) return null;
  return addDays(start, task.offset);
}

// ---------- Google Search ----------
function openGoogleSearch(query) {
  const city = getCity();
  const finalQuery = query.replace("{plaza}", city);
  const url = "https://www.google.com/search?q=" + encodeURIComponent(finalQuery);
  window.open(url, "_blank", "noopener");
}

// ---------- Estado de tareas ----------
function isDone(taskId) {
  const state = loadState();
  return !!(state[taskId] && state[taskId].done);
}

function setDone(taskId, done) {
  const state = loadState();
  const entry = { done, timestamp: Date.now() };
  state[taskId] = entry;
  saveState(state);
  queueSync(taskId, entry);
  updateCardInPlace(taskId, done);
  renderProgress();
}

// Actualiza solo la tarjeta afectada (sin redibujar toda la lista), para no
// perder el foco/estado del checkbox que el usuario acaba de tocar.
function updateCardInPlace(taskId, done) {
  const card = document.querySelector(`.task-card[data-id="${taskId}"]`);
  if (card) card.classList.toggle("done", done);
}

// ---------- Sincronización con Google Sheets (Apps Script Web App) ----------
function queueSync(taskId, entry) {
  const task = ROADMAP_TASKS.find(t => t.id === taskId);
  const payload = {
    taskId,
    title: task ? task.title : "",
    horizon: task ? task.horizon : "",
    period: task ? task.period : "",
    date: task ? (taskDate(task) || "") : "",
    done: entry.done,
    timestamp: entry.timestamp,
  };
  const q = loadQueue();
  q.push(payload);
  saveQueue(q);
  flushQueue();
}

async function flushQueue() {
  const url = getSheetsUrl();
  if (!url) return;
  let q = loadQueue();
  if (q.length === 0) return;
  const remaining = [];
  for (const item of q) {
    try {
      // Sin headers personalizados: evita el preflight CORS en Apps Script.
      await fetch(url, { method: "POST", body: JSON.stringify(item) });
    } catch (err) {
      remaining.push(item);
    }
  }
  saveQueue(remaining);
  updateSyncBadge();
}

async function pullFromSheets() {
  const url = getSheetsUrl();
  if (!url) return;
  try {
    const res = await fetch(url + (url.includes("?") ? "&" : "?") + "action=list");
    const json = await res.json();
    if (!json.ok || !Array.isArray(json.data)) return;
    const state = loadState();
    json.data.forEach(row => {
      const remoteTs = Number(row.timestamp) || 0;
      const local = state[row.taskId];
      if (!local || remoteTs > local.timestamp) {
        state[row.taskId] = { done: row.done === true || row.done === "true" || row.done === "TRUE", timestamp: remoteTs };
      }
    });
    saveState(state);
    render();
  } catch (err) {
    // sin conexión o Apps Script no configurado todavía — se ignora silenciosamente
  }
}

function updateSyncBadge() {
  const badge = document.getElementById("syncBadge");
  if (!badge) return;
  const url = getSheetsUrl();
  const pending = loadQueue().length;
  if (!url) {
    badge.textContent = "Sin sincronizar (configúralo en Ajustes)";
    badge.className = "sync-badge off";
  } else if (pending > 0) {
    badge.textContent = pending + " cambio(s) pendientes de subir";
    badge.className = "sync-badge pending";
  } else {
    badge.textContent = "Sincronizado con Google Sheets";
    badge.className = "sync-badge ok";
  }
}

// ---------- Vistas ----------
let currentView = "hoy"; // "hoy" | "todo"
let currentHorizonFilter = "todos";

function tasksForToday() {
  const start = getStartDate();
  if (!start) return [];
  const today = todayISO();
  // "Hoy" = tareas cuya fecha calculada ya llegó o pasó y no están hechas,
  // más las que caen exactamente hoy.
  return ROADMAP_TASKS.filter(t => {
    const d = taskDate(t);
    return d && d <= today;
  }).sort((a, b) => a.offset - b.offset);
}

function overdueOrTodayPending() {
  return tasksForToday().filter(t => !isDone(t.id));
}

function allTasksSorted() {
  return [...ROADMAP_TASKS].sort((a, b) => a.offset - b.offset);
}

function progressStats() {
  const total = ROADMAP_TASKS.length;
  const done = ROADMAP_TASKS.filter(t => isDone(t.id)).length;
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

function render() {
  updateSyncBadge();
  renderProgress();
  if (!getStartDate()) {
    renderOnboarding();
    return;
  }
  if (currentView === "hoy") {
    renderHoy();
  } else {
    renderTodo();
  }
}

function renderProgress() {
  const { total, done, pct } = progressStats();
  const bar = document.getElementById("progressBar");
  const label = document.getElementById("progressLabel");
  if (bar) bar.style.width = pct + "%";
  if (label) label.textContent = done + " / " + total + " tareas completadas (" + pct + "%)";
}

function taskCard(task) {
  const done = isDone(task.id);
  const date = taskDate(task);
  const dateLabel = date ? new Date(date + "T00:00:00").toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" }) : "";
  const searchBtn = task.search
    ? `<button class="btn-search" data-search="${encodeURIComponent(task.search)}">🔎 Buscar en Google</button>`
    : "";
  return `
    <div class="task-card ${done ? "done" : ""}" data-id="${task.id}">
      <label class="task-check">
        <input type="checkbox" ${done ? "checked" : ""} data-id="${task.id}">
        <span class="checkmark"></span>
      </label>
      <div class="task-body">
        <div class="task-meta">
          <span class="pill pill-${task.horizon}">${HORIZON_LABELS[task.horizon]}</span>
          <span class="task-period">${task.period}${dateLabel ? " · " + dateLabel : ""}</span>
        </div>
        <div class="task-title">${task.title}</div>
        <div class="task-desc">${task.desc}</div>
        ${searchBtn}
      </div>
    </div>
  `;
}

function renderHoy() {
  const container = document.getElementById("appBody");
  const pending = overdueOrTodayPending();
  const today = todayISO();
  const nextUpcoming = ROADMAP_TASKS
    .filter(t => { const d = taskDate(t); return d && d > today; })
    .sort((a, b) => a.offset - b.offset)
    .slice(0, 3);

  let html = `<h2 class="section-title">Pendientes de hoy y atrasadas</h2>`;
  if (pending.length === 0) {
    html += `<p class="empty-msg">🎉 No tienes tareas pendientes hasta hoy. ¡Vas al día!</p>`;
  } else {
    html += pending.map(taskCard).join("");
  }

  if (nextUpcoming.length) {
    html += `<h2 class="section-title" style="margin-top:28px;">Próximas</h2>`;
    html += nextUpcoming.map(taskCard).join("");
  }

  container.innerHTML = html;
  attachCardEvents();
}

function renderTodo() {
  const container = document.getElementById("appBody");
  let tasks = allTasksSorted();
  if (currentHorizonFilter !== "todos") {
    tasks = tasks.filter(t => t.horizon === currentHorizonFilter);
  }
  const html = `
    <div class="filters">
      ${["todos", "30dias", "trimestre", "año1"].map(h => `
        <button class="filter-btn ${currentHorizonFilter === h ? "active" : ""}" data-filter="${h}">
          ${h === "todos" ? "Todos" : HORIZON_LABELS[h]}
        </button>
      `).join("")}
    </div>
    ${tasks.map(taskCard).join("")}
  `;
  container.innerHTML = html;
  attachCardEvents();
  container.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentHorizonFilter = btn.dataset.filter;
      renderTodo();
    });
  });
}

function renderOnboarding() {
  const container = document.getElementById("appBody");
  container.innerHTML = `
    <div class="onboarding">
      <h2>Vamos a empezar</h2>
      <p>¿Qué día arrancas el Día 1 de la hoja de ruta? A partir de esta fecha la app calcula automáticamente qué tarea corresponde a cada día, semana y mes.</p>
      <input type="date" id="onboardingDate" value="${todayISO()}">
      <button id="onboardingStart" class="btn-primary">Empezar</button>
    </div>
  `;
  document.getElementById("onboardingStart").addEventListener("click", () => {
    const val = document.getElementById("onboardingDate").value || todayISO();
    localStorage.setItem(LS_KEYS.startDate, val);
    render();
  });
}

function attachCardEvents() {
  document.querySelectorAll('input[type="checkbox"][data-id]').forEach(cb => {
    cb.addEventListener("change", () => setDone(cb.dataset.id, cb.checked));
  });
  document.querySelectorAll(".btn-search").forEach(btn => {
    btn.addEventListener("click", () => openGoogleSearch(decodeURIComponent(btn.dataset.search)));
  });
}

// ---------- Ajustes ----------
function openSettings() {
  document.getElementById("settingsModal").classList.add("open");
  document.getElementById("settingStartDate").value = getStartDate() || todayISO();
  document.getElementById("settingCity").value = getCity();
  document.getElementById("settingSheetsUrl").value = getSheetsUrl();
}
function closeSettings() {
  document.getElementById("settingsModal").classList.remove("open");
}
function saveSettings() {
  localStorage.setItem(LS_KEYS.startDate, document.getElementById("settingStartDate").value);
  localStorage.setItem(LS_KEYS.city, document.getElementById("settingCity").value || "México");
  localStorage.setItem(LS_KEYS.sheetsUrl, document.getElementById("settingSheetsUrl").value.trim());
  closeSettings();
  pullFromSheets();
  render();
}

// ---------- Init ----------
function init() {
  document.getElementById("navHoy").addEventListener("click", () => { currentView = "hoy"; setActiveNav(); render(); });
  document.getElementById("navTodo").addEventListener("click", () => { currentView = "todo"; setActiveNav(); render(); });
  document.getElementById("navSettings").addEventListener("click", openSettings);
  document.getElementById("settingsClose").addEventListener("click", closeSettings);
  document.getElementById("settingsSave").addEventListener("click", saveSettings);

  window.addEventListener("online", flushQueue);
  setInterval(flushQueue, 60000);

  render();
  pullFromSheets();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

function setActiveNav() {
  document.getElementById("navHoy").classList.toggle("active", currentView === "hoy");
  document.getElementById("navTodo").classList.toggle("active", currentView === "todo");
}

document.addEventListener("DOMContentLoaded", init);
