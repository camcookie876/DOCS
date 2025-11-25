// ====== INSERT YOUR JSON FILE URL OR PATH HERE ======
const JSON_URL = "https://camcookie876.github.io/DOCS/catalog.json";

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

searchBox.addEventListener('input', e => renderResults(e.target.value));
searchBtn.addEventListener('click', () => renderResults(searchBox.value));


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
  for (const key in theme) {
    document.documentElement.style.setProperty(key, theme[key]);
  }
  localStorage.setItem('theme', name);
  currentTheme = name;
}

themeToggle.addEventListener('click', () => {
  const order = ["dark", "light", "alt", "orange"];
  const next = order[(order.indexOf(currentTheme) + 1) % order.length];
  applyTheme(next);
});

applyTheme(currentTheme);


// ================= DEVELOPER MODE =================
const DEV_CODE = "66554433221100";
let devMode = false; // resets when browser closes

// Floating devtools panel
let devPanel = null;

function createDevPanel() {
  devPanel = document.createElement("div");
  Object.assign(devPanel.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "var(--surface)",
    color: "var(--text)",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "2px solid var(--accent)",
    zIndex: "999999",
    fontSize: "14px",
    width: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)"
  });

  const title = document.createElement("div");
  title.textContent = "Developer Tools";
  title.style.fontWeight = "bold";
  title.style.marginBottom = "4px";
  devPanel.appendChild(title);

  addDevButton("Show Theme Vars", showThemeVars);
  addDevButton("Show JSON Data", showJsonData);
  addDevButton("Reload JSON", refetchJson);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Hide Dev Tools";
  styleMenuButton(closeBtn);
  closeBtn.onclick = () => devPanel.style.display = "none";
  devPanel.appendChild(closeBtn);

  document.body.appendChild(devPanel);
}

function addDevButton(label, action) {
  const btn = document.createElement("button");
  btn.textContent = label;
  styleMenuButton(btn);
  btn.onclick = action;
  devPanel.appendChild(btn);
}

function unlockDevMode() {
  devMode = true;
  if (!devPanel) createDevPanel();
  devPanel.style.display = "flex";
}

function showDevPrompt() {
  const code = prompt("Enter Developer Code:");
  if (code === DEV_CODE) unlockDevMode();
  else alert("Incorrect code");
}


// ================= RIGHT-CLICK MENU (DOWNLOADS ONLY) =================
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
    width: "300px",
    padding: "20px",
    background: "var(--menu-bg)",
    color: "var(--text)",
    borderRadius: "12px",
    border: "2px solid var(--menu-border)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    zIndex: "999998",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    transition: "opacity 0.18s ease-out, transform 0.18s ease-out"
  });

  document.body.appendChild(menuOverlay);
}

function styleMenuButton(btn) {
  btn.style.padding = "10px 14px";
  btn.style.fontSize = "15px";
  btn.style.border = "none";
  btn.style.borderRadius = "8px";
  btn.style.background = "var(--accent)";
  btn.style.color = "white";
  btn.style.cursor = "pointer";
  btn.style.transition = "0.12s ease";
}

function showCustomMenu(event) {
  if (!menuOverlay) createMenuOverlay();

  menuOverlay.innerHTML = "";

  const hasSelection = window.getSelection().toString().trim().length > 0;

  const title = document.createElement("div");
  title.textContent = "Page Tools";
  title.style.fontSize = "18px";
  title.style.fontWeight = "bold";
  menuOverlay.appendChild(title);

  if (hasSelection) {
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy Selection";
    styleMenuButton(copyBtn);
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(window.getSelection().toString());
      hideMenu();
    };
    menuOverlay.appendChild(copyBtn);
  }

  const pdfBtn = document.createElement("button");
  pdfBtn.textContent = "Download Info as PDF";
  styleMenuButton(pdfBtn);
  pdfBtn.onclick = () => {
    downloadPDF();
    hideMenu();
  };
  menuOverlay.appendChild(pdfBtn);

  const txtBtn = document.createElement("button");
  txtBtn.textContent = "Save Info as .txt";
  styleMenuButton(txtBtn);
  txtBtn.onclick = () => {
    saveInfoAsTxt();
    hideMenu();
  };
  menuOverlay.appendChild(txtBtn);

  const screenshotBtn = document.createElement("button");
  screenshotBtn.textContent = "Screenshot Page";
  styleMenuButton(screenshotBtn);
  screenshotBtn.onclick = () => {
    screenshotPage();
    hideMenu();
  };
  menuOverlay.appendChild(screenshotBtn);

  const devBtn = document.createElement("button");
  devBtn.textContent = "Developer Tools";
  styleMenuButton(devBtn);
  devBtn.onclick = () => {
    showDevPrompt();
    hideMenu();
  };
  menuOverlay.appendChild(devBtn);

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

function hideMenu() {
  menuOverlay.style.opacity = "0";
  menuOverlay.style.transform = "translate(-50%, -50%) scale(0.9)";
  setTimeout(() => menuOverlay.style.display = "none", 180);
}


// ================= ACTIONS =================
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

  const text = infoBox.innerText;
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


// ================= DEVTOOLS FUNCTIONS =================
function showThemeVars() {
  const styles = getComputedStyle(document.documentElement);
  let msg = "Theme Variables:\n\n";
  Object.keys(themes[currentTheme]).forEach(k => {
    msg += `${k}: ${styles.getPropertyValue(k).trim()}\n`;
  });
  alert(msg);
}

function showJsonData() {
  alert(JSON.stringify(data.slice(0, 5), null, 2));
}

function refetchJson() {
  fetch(JSON_URL)
    .then(res => res.json())
    .then(json => {
      data = json;
      alert("Catalog reloaded.");
    });
}