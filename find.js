// ====== INSERT YOUR JSON FILE URL OR PATH HERE ======
const JSON_URL = "https://camcookie876.github.io/DOCS/catalog.json";

// ================= CATALOG / SEARCH =================
let data = [];
fetch(JSON_URL).then(res => res.json()).then(json => data = json);

const searchBox = document.getElementById('searchBox');
const searchBtn = document.getElementById('searchBtn');
const results = document.getElementById('results');

function renderResults(query) {
  results.innerHTML = '';
  if (!query) {
    results.classList.remove('show');
    return;
  }

  const filtered = data.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    const msg = document.createElement('div');
    msg.textContent = "No results found";
    msg.style.color = "var(--text)";
    msg.style.padding = "6px";
    results.appendChild(msg);
    results.classList.add('show');
    return;
  }

  filtered.forEach(item => {
    const link = document.createElement('a');
    link.href = item.url;
    link.textContent = item.title;
    results.appendChild(link);
  });

  results.classList.add('show');
}

if (searchBox && searchBtn && results) {
  searchBox.addEventListener('input', e => renderResults(e.target.value));
  searchBtn.addEventListener('click', () => renderResults(searchBox.value));
}

// ================= THEME SYSTEM =================
const themes = {
  dark: {
    "--bg":"#0f1115",
    "--text":"#e7ebf3",
    "--accent":"#3ab0ff",
    "--surface":"#151922",

    "--desc-bg":"#1a1d24",
    "--desc-border":"#3ab0ff",
    "--desc-heading":"#3ab0ff",
    "--desc-text":"#e7ebf3",

    "--menu-bg":"rgba(10,12,18,0.96)",
    "--menu-border":"#3ab0ff"
  },

  light: {
    "--bg":"#f9f9f9",
    "--text":"#111",
    "--accent":"#0077cc",
    "--surface":"#fff",

    "--desc-bg":"#ffffff",
    "--desc-border":"#0077cc",
    "--desc-heading":"#0077cc",
    "--desc-text":"#111",

    "--menu-bg":"rgba(255,255,255,0.96)",
    "--menu-border":"#0077cc"
  },

  alt: {
    "--bg":"#1a1a2e",
    "--text":"#eaeaea",
    "--accent":"#ff6f61",
    "--surface":"#16213e",

    "--desc-bg":"#16213e",
    "--desc-border":"#ff6f61",
    "--desc-heading":"#ff6f61",
    "--desc-text":"#eaeaea",

    "--menu-bg":"rgba(22,33,62,0.96)",
    "--menu-border":"#ff6f61"
  },

  orange: {
    "--bg":"#fff4e5",
    "--text":"#5a2a00",
    "--accent":"#ff8c00",
    "--surface":"#ffe8cc",

    "--desc-bg":"#fff0d9",
    "--desc-border":"#ff8c00",
    "--desc-heading":"#ff8c00",
    "--desc-text":"#5a2a00",

    "--menu-bg":"rgba(255,244,229,0.98)",
    "--menu-border":"#ff8c00"
  }
};

const themeToggle = document.getElementById('themeToggle');
let currentTheme = localStorage.getItem('theme') || 'dark';

function applyTheme(name) {
  const theme = themes[name];
  if (!theme) return;
  for (const key in theme) {
    document.documentElement.style.setProperty(key, theme[key]);
  }
  localStorage.setItem('theme', name);
  currentTheme = name;
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const order = ["dark", "light", "alt", "orange"];
    const next = order[(order.indexOf(currentTheme) + 1) % order.length];
    applyTheme(next);
  });
}

applyTheme(currentTheme);

// ================= DEVELOPER MODE - CORE =================
const DEV_CODE = "66554433221100";
const DEV_MODE_SESSION_KEY = "devMode";
const DEV_MODE_REMEMBER_KEY = "devModeRemember"; // "session" | "24h" | null
const DEV_MODE_TIMESTAMP_KEY = "devModeUntil";

let devMode = false;

// DevMode persistence initialization
(function initDevMode() {
  const remember = localStorage.getItem(DEV_MODE_REMEMBER_KEY);
  const until = localStorage.getItem(DEV_MODE_TIMESTAMP_KEY);
  const now = Date.now();

  if (remember === "24h" && until && Number(until) > now) {
    devMode = true;
  } else if (sessionStorage.getItem(DEV_MODE_SESSION_KEY) === "true") {
    devMode = true;
  } else {
    devMode = false;
  }
})();

function enableDevMode(options = { remember: "none" }) {
  devMode = true;
  sessionStorage.setItem(DEV_MODE_SESSION_KEY, "true");

  if (options.remember === "24h") {
    const until = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem(DEV_MODE_REMEMBER_KEY, "24h");
    localStorage.setItem(DEV_MODE_TIMESTAMP_KEY, String(until));
  } else if (options.remember === "session") {
    localStorage.removeItem(DEV_MODE_REMEMBER_KEY);
    localStorage.removeItem(DEV_MODE_TIMESTAMP_KEY);
  } else {
    localStorage.removeItem(DEV_MODE_REMEMBER_KEY);
    localStorage.removeItem(DEV_MODE_TIMESTAMP_KEY);
  }

  ensureDevPanel();
  showDevPanel();
}

// ================= DEVTOOLS PANEL (UI SHELL) =================
let devPanel = null;
let devPanelHeader = null;
let devPanelTabs = null;
let devPanelBody = null;
let devPanelResizeHandle = null;

const DEV_PANEL_POS_KEY = "devPanelPosition";
const DEV_PANEL_SIZE_KEY = "devPanelSize";
const DEV_ACTIVE_TAB_KEY = "devActiveTab";

const DEV_TABS = [
  "elements",
  "styles",
  "console",
  "network",
  "storage",
  "theme",
  "page"
];

function ensureDevPanel() {
  if (devPanel) return;

  devPanel = document.createElement("div");
  devPanel.id = "devPanel";
  Object.assign(devPanel.style, {
    position: "fixed",
    top: "40px",
    right: "40px",
    width: "480px",
    height: "360px",
    background: "var(--surface)",
    color: "var(--text)",
    borderRadius: "10px",
    border: "2px solid var(--accent)",
    zIndex: 999999,
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    overflow: "hidden",
    fontFamily: "system-ui, sans-serif",
    fontSize: "13px"
  });

  // Restore size/position from storage
  try {
    const posStr = localStorage.getItem(DEV_PANEL_POS_KEY);
    const sizeStr = localStorage.getItem(DEV_PANEL_SIZE_KEY);
    if (posStr) {
      const pos = JSON.parse(posStr);
      if (typeof pos.top === "number" && typeof pos.left === "number") {
        devPanel.style.top = pos.top + "px";
        devPanel.style.left = pos.left + "px";
        devPanel.style.right = "auto";
      }
    }
    if (sizeStr) {
      const size = JSON.parse(sizeStr);
      if (typeof size.width === "number" && typeof size.height === "number") {
        devPanel.style.width = size.width + "px";
        devPanel.style.height = size.height + "px";
      }
    }
  } catch (e) {}

  // Header
  devPanelHeader = document.createElement("div");
  Object.assign(devPanelHeader.style, {
    padding: "6px 8px",
    background: "var(--accent)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "move"
  });

  const title = document.createElement("div");
  title.textContent = "DevTools";
  title.style.fontWeight = "bold";
  devPanelHeader.appendChild(title);

  const headerButtons = document.createElement("div");
  headerButtons.style.display = "flex";
  headerButtons.style.gap = "6px";

  const pinBtn = document.createElement("button");
  pinBtn.textContent = "Pin";
  styleDevHeaderButton(pinBtn);
  headerButtons.appendChild(pinBtn);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  styleDevHeaderButton(closeBtn);
  closeBtn.onclick = () => hideDevPanel();
  headerButtons.appendChild(closeBtn);

  devPanelHeader.appendChild(headerButtons);
  devPanel.appendChild(devPanelHeader);

  // Tabs
  devPanelTabs = document.createElement("div");
  Object.assign(devPanelTabs.style, {
    display: "flex",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    background: "rgba(0,0,0,0.04)"
  });

  DEV_TABS.forEach(tabId => {
    const tab = document.createElement("div");
    tab.textContent = tabId.toUpperCase();
    Object.assign(tab.style, {
      padding: "4px 8px",
      cursor: "pointer",
      userSelect: "none",
      fontSize: "11px",
      borderRight: "1px solid rgba(0,0,0,0.08)"
    });
    tab.dataset.tab = tabId;
    tab.onclick = () => setActiveDevTab(tabId);
    devPanelTabs.appendChild(tab);
  });

  devPanel.appendChild(devPanelTabs);

  // Body
  devPanelBody = document.createElement("div");
  Object.assign(devPanelBody.style, {
    flex: "1",
    background: "var(--surface)",
    color: "var(--text)",
    overflow: "auto",
    padding: "8px",
    fontFamily: "monospace"
  });

  devPanel.appendChild(devPanelBody);

  // Resize handle
  devPanelResizeHandle = document.createElement("div");
  Object.assign(devPanelResizeHandle.style, {
    position: "absolute",
    right: "0",
    bottom: "0",
    width: "16px",
    height: "16px",
    cursor: "nwse-resize",
    background:
      "linear-gradient(135deg, transparent 0, transparent 40%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.3) 100%)"
  });
  devPanel.appendChild(devPanelResizeHandle);

  document.body.appendChild(devPanel);

  makeDevPanelDraggable();
  makeDevPanelResizable();

  // Restore active tab
  const savedTab = sessionStorage.getItem(DEV_ACTIVE_TAB_KEY);
  setActiveDevTab(savedTab && DEV_TABS.includes(savedTab) ? savedTab : "console", true);
}

function styleDevHeaderButton(btn) {
  Object.assign(btn.style, {
    border: "none",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    padding: "2px 6px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "11px"
  });
}

function showDevPanel() {
  if (!devPanel) ensureDevPanel();
  devPanel.style.display = "flex";
}

function hideDevPanel() {
  if (devPanel) devPanel.style.display = "none";
}

// Draggable behavior
function makeDevPanelDraggable() {
  let isDragging = false;
  let startX = 0, startY = 0;
  let startTop = 0, startLeft = 0;

  devPanelHeader.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = devPanel.getBoundingClientRect();
    startTop = rect.top;
    startLeft = rect.left;
    e.preventDefault();
  });

  window.addEventListener("mousemove", e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newTop = startTop + dy;
    const newLeft = startLeft + dx;
    devPanel.style.top = newTop + "px";
    devPanel.style.left = newLeft + "px";
    devPanel.style.right = "auto";
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    saveDevPanelPosition();
  });
}

// Resizable behavior
function makeDevPanelResizable() {
  let isResizing = false;
  let startX = 0, startY = 0;
  let startW = 0, startH = 0;

  devPanelResizeHandle.addEventListener("mousedown", e => {
    isResizing = true;
    const rect = devPanel.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startW = rect.width;
    startH = rect.height;
    e.preventDefault();
  });

  window.addEventListener("mousemove", e => {
    if (!isResizing) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newW = Math.max(320, startW + dx);
    const newH = Math.max(240, startH + dy);
    devPanel.style.width = newW + "px";
    devPanel.style.height = newH + "px";
  });

  window.addEventListener("mouseup", () => {
    if (!isResizing) return;
    isResizing = false;
    saveDevPanelSize();
  });
}

function saveDevPanelPosition() {
  const rect = devPanel.getBoundingClientRect();
  const pos = { top: rect.top, left: rect.left };
  localStorage.setItem(DEV_PANEL_POS_KEY, JSON.stringify(pos));
}

function saveDevPanelSize() {
  const rect = devPanel.getBoundingClientRect();
  const size = { width: rect.width, height: rect.height };
  localStorage.setItem(DEV_PANEL_SIZE_KEY, JSON.stringify(size));
}

// ================= DEV TABS & CONTENT =================
function setActiveDevTab(tabId, initial = false) {
  if (!devPanelTabs || !devPanelBody) return;
  DEV_TABS.forEach(t => {
    const el = devPanelTabs.querySelector(`[data-tab="${t}"]`);
    if (!el) return;
    el.style.background =
      t === tabId ? "rgba(0,0,0,0.15)" : "transparent";
    el.style.fontWeight = t === tabId ? "bold" : "normal";
  });

  devPanelBody.innerHTML = "";
  sessionStorage.setItem(DEV_ACTIVE_TAB_KEY, tabId);

  if (tabId === "elements") renderElementsTab();
  else if (tabId === "styles") renderStylesTab();
  else if (tabId === "console") renderConsoleTab(initial);
  else if (tabId === "network") renderNetworkTab();
  else if (tabId === "storage") renderStorageTab();
  else if (tabId === "theme") renderThemeTab();
  else if (tabId === "page") renderPageTab();
}

// ========== TAB: ELEMENTS (upgraded inspector) ==========
let inspectorActive = false;
let inspectorSelected = null;
let inspectorOverlay = null;

function renderElementsTab() {
  const headerRow = document.createElement("div");
  headerRow.style.display = "flex";
  headerRow.style.justifyContent = "space-between";
  headerRow.style.alignItems = "center";
  headerRow.style.marginBottom = "4px";

  const title = document.createElement("div");
  title.textContent = "Element Inspector";
  title.style.fontWeight = "bold";
  headerRow.appendChild(title);

  const inspectBtn = document.createElement("button");
  inspectBtn.textContent = inspectorActive ? "Stop Inspecting" : "Start Inspecting";
  styleSimpleBtn(inspectBtn);
  inspectBtn.onclick = () => toggleInspectorMode(inspectBtn);
  headerRow.appendChild(inspectBtn);

  devPanelBody.appendChild(headerRow);

  const breadcrumb = document.createElement("div");
  breadcrumb.id = "devElementsBreadcrumb";
  breadcrumb.style.fontSize = "11px";
  breadcrumb.style.marginBottom = "4px";
  breadcrumb.textContent = "Breadcrumb: (none)";
  devPanelBody.appendChild(breadcrumb);

  const toolsRow = document.createElement("div");
  toolsRow.style.display = "flex";
  toolsRow.style.flexWrap = "wrap";
  toolsRow.style.gap = "4px";
  toolsRow.style.marginBottom = "4px";

  const copySelectorBtn = document.createElement("button");
  copySelectorBtn.textContent = "Copy selector";
  styleSimpleBtn(copySelectorBtn);
  copySelectorBtn.onclick = () => {
    if (!inspectorSelected) return alert("No element selected.");
    copyToClipboard(getElementSelector(inspectorSelected));
  };
  toolsRow.appendChild(copySelectorBtn);

  const copyOuterBtn = document.createElement("button");
  copyOuterBtn.textContent = "Copy outerHTML";
  styleSimpleBtn(copyOuterBtn);
  copyOuterBtn.onclick = () => {
    if (!inspectorSelected) return alert("No element selected.");
    copyToClipboard(inspectorSelected.outerHTML);
  };
  toolsRow.appendChild(copyOuterBtn);

  const copyInnerBtn = document.createElement("button");
  copyInnerBtn.textContent = "Copy innerHTML";
  styleSimpleBtn(copyInnerBtn);
  copyInnerBtn.onclick = () => {
    if (!inspectorSelected) return alert("No element selected.");
    copyToClipboard(inspectorSelected.innerHTML);
  };
  toolsRow.appendChild(copyInnerBtn);

  const copyTextBtn = document.createElement("button");
  copyTextBtn.textContent = "Copy textContent";
  styleSimpleBtn(copyTextBtn);
  copyTextBtn.onclick = () => {
    if (!inspectorSelected) return alert("No element selected.");
    copyToClipboard(inspectorSelected.textContent.trim());
  };
  toolsRow.appendChild(copyTextBtn);

  devPanelBody.appendChild(toolsRow);

  const info = document.createElement("pre");
  info.id = "devElementsInfo";
  info.style.marginTop = "4px";
  info.textContent = inspectorSelected ? describeElement(inspectorSelected) : "No element selected.";
  devPanelBody.appendChild(info);

  updateBreadcrumb();
}

function toggleInspectorMode(btn) {
  inspectorActive = !inspectorActive;
  btn.textContent = inspectorActive ? "Stop Inspecting" : "Start Inspecting";
  if (inspectorActive) {
    document.addEventListener("mousemove", inspectorHoverHandler);
    document.addEventListener("click", inspectorClickHandler, true);
  } else {
    document.removeEventListener("mousemove", inspectorHoverHandler);
    document.removeEventListener("click", inspectorClickHandler, true);
    clearInspectorHighlight();
  }
}

function ensureInspectorOverlay() {
  if (!inspectorOverlay) {
    inspectorOverlay = document.createElement("div");
    Object.assign(inspectorOverlay.style, {
      position: "fixed",
      border: "2px solid #00aaff",
      background: "rgba(0,170,255,0.15)",
      pointerEvents: "none",
      zIndex: 999998
    });
    document.body.appendChild(inspectorOverlay);
  }
}

function inspectorHoverHandler(e) {
  if (!inspectorActive) return;
  const target = e.target;
  if (!target || target === devPanel || devPanel.contains(target)) return;

  ensureInspectorOverlay();
  const rect = target.getBoundingClientRect();
  Object.assign(inspectorOverlay.style, {
    top: rect.top + "px",
    left: rect.left + "px",
    width: rect.width + "px",
    height: rect.height + "px",
    display: "block"
  });
}

function inspectorClickHandler(e) {
  if (!inspectorActive) return;
  const target = e.target;
  if (!target || target === devPanel || devPanel.contains(target)) return;
  e.preventDefault();
  e.stopPropagation();
  inspectorSelected = target;
  const info = devPanelBody.querySelector("#devElementsInfo");
  if (info) info.textContent = describeElement(target);
  updateBreadcrumb();
  toggleInspectorMode(devPanelBody.querySelector("button"));
}

function updateBreadcrumb() {
  const bc = devPanelBody && devPanelBody.querySelector("#devElementsBreadcrumb");
  if (!bc) return;
  if (!inspectorSelected) {
    bc.textContent = "Breadcrumb: (none)";
    return;
  }
  const chain = [];
  let el = inspectorSelected;
  while (el && el.nodeType === 1) {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? "#" + el.id : "";
    const cls = el.className ? "." + String(el.className).split(/\s+/).join(".") : "";
    chain.unshift(tag + id + cls);
    if (el.tagName.toLowerCase() === "html") break;
    el = el.parentElement;
  }
  bc.textContent = "Breadcrumb: " + chain.join(" > ");
}

function clearInspectorHighlight() {
  if (inspectorOverlay) inspectorOverlay.style.display = "none";
}

function describeElement(el) {
  if (!el) return "No element.";
  const tag = el.tagName.toLowerCase();
  const id = el.id ? "#" + el.id : "";
  const cls = el.className ? "." + String(el.className).split(/\s+/).join(".") : "";
  const attrs = Array.from(el.attributes)
    .map(a => `${a.name}="${a.value}"`)
    .join(" ");
  const inline = el.getAttribute("style") || "";
  return [
    `Tag: ${tag}${id}${cls}`,
    `Attributes: ${attrs || "(none)"}`,
    `Inline styles: ${inline || "(none)"}`,
    `Text: ${el.textContent.trim().slice(0,200) || "(none)"}`
  ].join("\n");
}

function getElementSelector(el) {
  if (!el) return "";
  if (el.id) return `#${el.id}`;
  let path = [];
  while (el && el.nodeType === 1 && el.tagName.toLowerCase() !== "html") {
    let selector = el.tagName.toLowerCase();
    if (el.className) {
      const cls = String(el.className).trim().split(/\s+/).join(".");
      if (cls) selector += "." + cls;
    }
    const siblingIndex = Array.from(el.parentNode.children).indexOf(el) + 1;
    selector += `:nth-child(${siblingIndex})`;
    path.unshift(selector);
    el = el.parentElement;
  }
  return path.join(" > ");
}

// ========== TAB: STYLES (skeleton) ==========
function renderStylesTab() {
  const pre = document.createElement("pre");
  pre.textContent =
    "Styles inspector skeleton.\nNext: show computed styles for inspectorSelected element.";
  devPanelBody.appendChild(pre);
}

// ========== TAB: CONSOLE (real) ==========
const CONSOLE_HISTORY_KEY = "devConsoleHistory";
let consoleHistory = [];
let consoleHistoryIndex = -1;
let consoleOutputEl = null;

function renderConsoleTab(initial) {
  if (initial) {
    try {
      const raw = sessionStorage.getItem(CONSOLE_HISTORY_KEY);
      consoleHistory = raw ? JSON.parse(raw) : [];
    } catch {
      consoleHistory = [];
    }
  }

  const output = document.createElement("div");
  output.style.height = "70%";
  output.style.overflow = "auto";
  output.style.border = "1px solid rgba(0,0,0,0.2)";
  output.style.padding = "4px";
  output.style.marginBottom = "4px";
  consoleOutputEl = output;
  devPanelBody.appendChild(output);

  const inputRow = document.createElement("div");
  inputRow.style.display = "flex";
  inputRow.style.gap = "4px";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter JS expression...";
  input.style.flex = "1";
  input.style.fontFamily = "monospace";
  input.style.fontSize = "12px";

  const runBtn = document.createElement("button");
  runBtn.textContent = "Run";
  styleSimpleBtn(runBtn);

  runBtn.onclick = () => {
    const code = input.value.trim();
    if (!code) return;
    devConsoleRun(code);
    input.value = "";
  };

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      runBtn.onclick();
    } else if (e.key === "ArrowUp") {
      if (consoleHistory.length > 0) {
        consoleHistoryIndex = Math.max(0, consoleHistoryIndex - 1);
        input.value = consoleHistory[consoleHistoryIndex].message || "";
        e.preventDefault();
      }
    } else if (e.key === "ArrowDown") {
      if (consoleHistory.length > 0) {
        consoleHistoryIndex = Math.min(consoleHistory.length, consoleHistoryIndex + 1);
        if (consoleHistoryIndex >= consoleHistory.length) {
          input.value = "";
        } else {
          input.value = consoleHistory[consoleHistoryIndex].message || "";
        }
        e.preventDefault();
      }
    }
  });

  inputRow.appendChild(input);
  inputRow.appendChild(runBtn);

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "Clear";
  styleSimpleBtn(clearBtn);
  clearBtn.onclick = () => {
    output.innerHTML = "";
  };

  devPanelBody.appendChild(inputRow);
  devPanelBody.appendChild(clearBtn);

  consoleHistory.forEach(entry => {
    appendConsoleLine(entry.type, entry.message);
  });
}

function devConsoleRun(expr) {
  try {
    const result = eval(expr);
    devConsoleLog("log", `> ${expr}`);
    devConsoleLog("log", String(result));
    consoleHistory.push({ type: "input", message: expr });
  } catch (err) {
    devConsoleLog("error", `Error: ${err.message}`);
    consoleHistory.push({ type: "error", message: expr });
  }
  sessionStorage.setItem(CONSOLE_HISTORY_KEY, JSON.stringify(consoleHistory));
  consoleHistoryIndex = consoleHistory.length;
}

function devConsoleLog(type, message) {
  appendConsoleLine(type, message);
}

function appendConsoleLine(type, message) {
  if (!consoleOutputEl) return;
  const line = document.createElement("div");
  line.textContent = message;
  if (type === "error") line.style.color = "red";
  else if (type === "warn") line.style.color = "#d9a600";
  consoleOutputEl.appendChild(line);
  consoleOutputEl.scrollTop = consoleOutputEl.scrollHeight;
}

function styleSimpleBtn(btn) {
  btn.style.border = "1px solid rgba(0,0,0,0.2)";
  btn.style.background = "rgba(0,0,0,0.05)";
  btn.style.cursor = "pointer";
  btn.style.fontSize = "11px";
  btn.style.borderRadius = "4px";
}

// ========== TAB: NETWORK (skeleton + hook) ==========
let networkLogs = [];

const originalFetch = window.fetch.bind(window);
window.fetch = async (...args) => {
  const start = performance.now();
  try {
    const res = await originalFetch(...args);
    const end = performance.now();
    networkLogs.push({
      url: String(args[0]),
      method: (args[1] && args[1].method) || "GET",
      status: res.status,
      time: (end - start).toFixed(1)
    });
    return res;
  } catch (err) {
    const end = performance.now();
    networkLogs.push({
      url: String(args[0]),
      method: (args[1] && args[1].method) || "GET",
      status: "ERROR",
      time: (end - start).toFixed(1)
    });
    throw err;
  }
};

function renderNetworkTab() {
  const pre = document.createElement("pre");
  pre.textContent = networkLogs.length
    ? networkLogs.map(l => `${l.method} ${l.url} [${l.status}] ${l.time}ms`).join("\n")
    : "No network activity logged yet.";
  devPanelBody.appendChild(pre);
}

// ========== TAB: STORAGE (real viewer) ==========
function renderStorageTab() {
  const wrap = document.createElement("div");

  const title = document.createElement("div");
  title.textContent = "Storage viewer";
  title.style.fontWeight = "bold";
  title.style.marginBottom = "4px";
  wrap.appendChild(title);

  const sectionLS = document.createElement("div");
  sectionLS.innerHTML = "<strong>localStorage</strong>";
  const preLS = document.createElement("pre");
  preLS.style.maxHeight = "120px";
  preLS.style.overflow = "auto";
  preLS.textContent = dumpStorage(localStorage);
  sectionLS.appendChild(preLS);
  wrap.appendChild(sectionLS);

  const sectionSS = document.createElement("div");
  sectionSS.innerHTML = "<strong>sessionStorage</strong>";
  const preSS = document.createElement("pre");
  preSS.style.maxHeight = "120px";
  preSS.style.overflow = "auto";
  preSS.textContent = dumpStorage(sessionStorage);
  sectionSS.appendChild(preSS);
  wrap.appendChild(sectionSS);

  devPanelBody.appendChild(wrap);
}

function dumpStorage(store) {
  const lines = [];
  for (let i = 0; i < store.length; i++) {
    const key = store.key(i);
    const val = store.getItem(key);
    lines.push(`${key}: ${val}`);
  }
  return lines.length ? lines.join("\n") : "(empty)";
}

// ========== TAB: THEME (viewer + export) ==========
function renderThemeTab() {
  const wrap = document.createElement("div");

  const title = document.createElement("div");
  title.textContent = "Theme tools";
  title.style.fontWeight = "bold";
  title.style.marginBottom = "4px";
  wrap.appendChild(title);

  const current = document.createElement("div");
  current.textContent = `Current theme: ${currentTheme}`;
  current.style.marginBottom = "4px";
  wrap.appendChild(current);

  const preVars = document.createElement("pre");
  const styles = getComputedStyle(document.documentElement);
  const vars = themes[currentTheme] || {};
  const lines = [];
  Object.keys(vars).forEach(k => {
    lines.push(`${k}: ${styles.getPropertyValue(k).trim()}`);
  });
  preVars.textContent = lines.join("\n") || "(no vars)";
  preVars.style.maxHeight = "160px";
  preVars.style.overflow = "auto";
  wrap.appendChild(preVars);

  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export theme JSON";
  styleSimpleBtn(exportBtn);
  exportBtn.onclick = () => {
    const json = JSON.stringify(vars, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `theme-${currentTheme}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  wrap.appendChild(exportBtn);

  devPanelBody.appendChild(wrap);
}

// ========== TAB: PAGE (real-ish tools) ==========
function renderPageTab() {
  const desc = document.createElement("div");
  desc.textContent = "Page tools:";
  desc.style.marginBottom = "4px";
  devPanelBody.appendChild(desc);

  const btns = [
    ["Screenshot full page (print)", screenshotPage],
    ["Save HTML snapshot", saveHTMLSnapshot],
    ["Save DOM text snapshot", saveDOMTextSnapshot]
  ];
  btns.forEach(([label, fn]) => {
    const b = document.createElement("button");
    b.textContent = label;
    styleSimpleBtn(b);
    b.style.display = "block";
    b.style.marginBottom = "4px";
    b.onclick = fn;
    devPanelBody.appendChild(b);
  });
}

// ================= DEV PASSCODE PROMPT =================
function showDevPrompt() {
  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    position: "fixed",
    inset: "0",
    background: "rgba(0,0,0,0.45)",
    zIndex: 999997,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  });

  const box = document.createElement("div");
  Object.assign(box.style, {
    background: "var(--surface)",
    color: "var(--text)",
    padding: "16px",
    borderRadius: "10px",
    border: "2px solid var(--accent)",
    width: "260px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
    fontSize: "13px"
  });

  const title = document.createElement("div");
  title.textContent = "Developer Code";
  title.style.fontWeight = "bold";
  title.style.marginBottom = "6px";
  box.appendChild(title);

  const input = document.createElement("input");
  input.type = "password";
  input.placeholder = "Enter code";
  input.style.width = "100%";
  input.style.marginBottom = "8px";
  box.appendChild(input);

  const rememberRow = document.createElement("div");
  rememberRow.style.display = "flex";
  rememberRow.style.flexDirection = "column";
  rememberRow.style.gap = "4px";
  rememberRow.style.marginBottom = "8px";

  const rememberSession = document.createElement("label");
  const rsInput = document.createElement("input");
  rsInput.type = "radio";
  rsInput.name = "rememberDev";
  rsInput.value = "session";
  rememberSession.appendChild(rsInput);
  rememberSession.append(" Remember this session");

  const remember24 = document.createElement("label");
  const r24Input = document.createElement("input");
  r24Input.type = "radio";
  r24Input.name = "rememberDev";
  r24Input.value = "24h";
  remember24.appendChild(r24Input);
  remember24.append(" Remember for 24 hours");

  rememberRow.appendChild(rememberSession);
  rememberRow.appendChild(remember24);
  box.appendChild(rememberRow);

  const error = document.createElement("div");
  error.style.color = "red";
  error.style.minHeight = "14px";
  error.style.marginBottom = "6px";
  box.appendChild(error);

  const row = document.createElement("div");
  row.style.display = "flex";
  row.style.justifyContent = "flex-end";
  row.style.gap = "6px";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  styleSimpleBtn(cancelBtn);
  cancelBtn.onclick = () => document.body.removeChild(wrapper);

  const okBtn = document.createElement("button");
  okBtn.textContent = "Unlock";
  styleSimpleBtn(okBtn);
  okBtn.onclick = () => {
    const val = input.value.trim();
    if (val === DEV_CODE) {
      let remember = "none";
      if (r24Input.checked) remember = "24h";
      else if (rsInput.checked) remember = "session";
      enableDevMode({ remember });
      document.body.removeChild(wrapper);
    } else {
      error.textContent = "Incorrect code";
    }
  };

  row.appendChild(cancelBtn);
  row.appendChild(okBtn);
  box.appendChild(row);

  wrapper.appendChild(box);
  document.body.appendChild(wrapper);
  input.focus();
}

// ================= RIGHT-CLICK MENU (EXPANDED) =================
let menuOverlay = null;

document.addEventListener("contextmenu", e => {
  e.preventDefault();
  showCustomMenu(e);
});

function createMenuOverlay() {
  menuOverlay = document.createElement("div");
  Object.assign(menuOverlay.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.8)",
    opacity: "0",
    width: "320px",
    maxHeight: "80vh",
    padding: "14px",
    background: "var(--menu-bg)",
    color: "var(--text)",
    borderRadius: "12px",
    border: "2px solid var(--menu-border)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    zIndex: 999995,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    overflowY: "auto",
    fontSize: "13px",
    transition: "opacity 0.18s ease-out, transform 0.18s ease-out"
  });

  document.body.appendChild(menuOverlay);
}

function styleMenuButton(btn) {
  btn.style.padding = "6px 8px";
  btn.style.fontSize = "13px";
  btn.style.border = "none";
  btn.style.borderRadius = "6px";
  btn.style.background = "var(--accent)";
  btn.style.color = "white";
  btn.style.cursor = "pointer";
  btn.style.textAlign = "left";
  btn.style.transition = "0.12s ease";
}

function showCustomMenu(event) {
  if (!menuOverlay) createMenuOverlay();
  menuOverlay.innerHTML = "";

  const title = document.createElement("div");
  title.textContent = "Page Tools";
  title.style.fontSize = "15px";
  title.style.fontWeight = "bold";
  title.style.marginBottom = "4px";
  menuOverlay.appendChild(title);

  const hasSelection = window.getSelection().toString().trim().length > 0;

  if (hasSelection) {
    const copySel = document.createElement("button");
    copySel.textContent = "Copy selection";
    styleMenuButton(copySel);
    copySel.onclick = () => {
      navigator.clipboard.writeText(window.getSelection().toString());
      hideMenu();
    };
    menuOverlay.appendChild(copySel);
  }

  // User tools
  addMenuButton("Print page", () => { window.print(); });
  addMenuButton("Copy page URL", () => copyToClipboard(location.href));
  addMenuButton("Copy page title", () => copyToClipboard(document.title));
  addMenuButton("Copy all text", copyAllText);
  addMenuButton("Copy all links", copyAllLinks);
  addMenuButton("Save page as HTML", savePageAsHTML);
  addMenuButton("Save page as Markdown (basic)", savePageAsMarkdown);

  // Media tools
  addMenuButton("Download all images (list URLs)", downloadAllImages);
  addMenuButton("Download all audio (list URLs)", downloadAllAudio);
  addMenuButton("Download all video (list URLs)", downloadAllVideo);
  addMenuButton("Extract all links (file)", extractAllLinks);
  addMenuButton("Extract all text (file)", extractAllText);

  // Accessibility tools
  addMenuButton("Increase text size", () => adjustFontSize(1));
  addMenuButton("Decrease text size", () => adjustFontSize(-1));
  addMenuButton("Toggle high contrast mode", toggleHighContrastMode);
  addMenuButton("Toggle dyslexia-friendly font", toggleDyslexiaFont);

  // Info tools
  addMenuButton("Download info as PDF", downloadPDF);
  addMenuButton("Save info as .txt", saveInfoAsTxt);
  addMenuButton("Screenshot page (print)", screenshotPage);

  // Developer tools
  addMenuButton("Developer Tools", () => {
    if (devMode) {
      ensureDevPanel();
      showDevPanel();
    } else {
      showDevPrompt();
    }
  });

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  styleMenuButton(closeBtn);
  closeBtn.onclick = hideMenu;
  menuOverlay.appendChild(closeBtn);

  menuOverlay.style.display = "flex";
  requestAnimationFrame(() => {
    menuOverlay.style.opacity = "1";
    menuOverlay.style.transform = "translate(-50%, -50%) scale(1)";
  });
}

function addMenuButton(label, fn) {
  const btn = document.createElement("button");
  btn.textContent = label;
  styleMenuButton(btn);
  btn.onclick = () => { fn(); hideMenu(); };
  menuOverlay.appendChild(btn);
}

function hideMenu() {
  if (!menuOverlay) return;
  menuOverlay.style.opacity = "0";
  menuOverlay.style.transform = "translate(-50%, -50%) scale(0.9)";
  setTimeout(() => { if (menuOverlay) menuOverlay.style.display = "none"; }, 180);
}

// ================= INFO EXPORTS =================
function downloadPDF() {
  const infoBox = document.querySelector(".description-box");
  if (!infoBox) return alert("No information box found.");

  const win = window.open("", "_blank");
  win.document.write(`
    <html>
      <head><title>Info PDF</title></head>
      <body>${infoBox.outerHTML}</body>
    </html>
  `);
  win.document.close();
  win.print();
}

function saveInfoAsTxt() {
  const infoBox = document.querySelector(".description-box");
  if (!infoBox) return alert("No information box found.");

  const text = infoBox.innerText || "";
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "info.txt";
  a.click();
  URL.revokeObjectURL(url);
}

function screenshotPage() {
  window.print();
}

function saveHTMLSnapshot() {
  const html = document.documentElement.outerHTML;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "page.html";
  a.click();
  URL.revokeObjectURL(url);
}

function saveDOMTextSnapshot() {
  const text = document.body.innerText || "";
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "page.txt";
  a.click();
  URL.revokeObjectURL(url);
}

// ================= RIGHT-CLICK HELPERS =================
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

function copyAllText() {
  copyToClipboard(document.body.innerText || "");
}

function copyAllLinks() {
  const links = Array.from(document.querySelectorAll("a[href]")).map(a => a.href);
  copyToClipboard(links.join("\n"));
}

function savePageAsHTML() {
  saveHTMLSnapshot();
}

function savePageAsMarkdown() {
  const text = document.body.innerText || "";
  const links = Array.from(document.querySelectorAll("a[href]")).map(a => `- [${a.innerText}](${a.href})`);
  const md = text + "\n\nLinks:\n" + links.join("\n");
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "page.md";
  a.click();
  URL.revokeObjectURL(url);
}

// Media tools (listing URLs for now)
function downloadAllImages() {
  const imgs = Array.from(document.images).map(img => img.src);
  if (!imgs.length) return alert("No images found.");
  alert("Image URLs:\n" + imgs.join("\n"));
}

function downloadAllAudio() {
  const audios = Array.from(document.querySelectorAll("audio")).map(a => a.src).filter(Boolean);
  if (!audios.length) return alert("No audio sources found.");
  alert("Audio URLs:\n" + audios.join("\n"));
}

function downloadAllVideo() {
  const vids = Array.from(document.querySelectorAll("video")).map(v => v.src).filter(Boolean);
  if (!vids.length) return alert("No video sources found.");
  alert("Video URLs:\n" + vids.join("\n"));
}

function extractAllLinks() {
  const links = Array.from(document.querySelectorAll("a[href]")).map(a => `${a.innerText} -> ${a.href}`);
  const blob = new Blob([links.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "links.txt";
  a.click();
  URL.revokeObjectURL(url);
}

function extractAllText() {
  saveDOMTextSnapshot();
}

// ================= ACCESSIBILITY =================
const FONT_SIZE_KEY = "pageFontSizeScale";
const ACCESS_MODE_KEY = "accessMode";

(function initAccessibility() {
  const scale = Number(localStorage.getItem(FONT_SIZE_KEY) || "0");
  if (scale !== 0) applyFontScale(scale);
  const mode = localStorage.getItem(ACCESS_MODE_KEY);
  if (mode) applyAccessibilityMode(mode, true);
})();

function adjustFontSize(delta) {
  const current = Number(localStorage.getItem(FONT_SIZE_KEY) || "0");
  const next = current + delta;
  localStorage.setItem(FONT_SIZE_KEY, String(next));
  applyFontScale(next);
}

function applyFontScale(scale) {
  document.documentElement.style.fontSize = (100 + scale * 5) + "%";
}

function toggleHighContrastMode() {
  const mode = localStorage.getItem(ACCESS_MODE_KEY) === "high-contrast" ? null : "high-contrast";
  applyAccessibilityMode(mode);
}

function toggleDyslexiaFont() {
  const mode = localStorage.getItem(ACCESS_MODE_KEY) === "dyslexia" ? null : "dyslexia";
  applyAccessibilityMode(mode);
}

function applyAccessibilityMode(mode, initial) {
  localStorage.setItem(ACCESS_MODE_KEY, mode || "");
  document.documentElement.dataset.accessMode = mode || "";
  if (!initial) {
    alert(mode ? `Accessibility mode: ${mode}` : "Accessibility mode cleared");
  }
}