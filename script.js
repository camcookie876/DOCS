document.addEventListener("DOMContentLoaded", () => {

  //========================================
  // Catalog (search data)
  //========================================
  const catalog = [
    { name: "Home", url: "https://camcookie876.github.io/DOCS/" },
    { name: "Camcookie Music", url: "https://camcookie876.github.io/DOCS/music/" },
    { name: "Archive Radio", url: "https://camcookie876.github.io/DOCS/music/1" },
    { name: "Camcookie Arduino", url: "https://camcookie876.github.io/DOCS/arduino/" },
    { name: "Camcookie Security - UNO R3", url: "https://camcookie876.github.io/DOCS/arduino/1/" }
  ];

  const searchBox = document.getElementById("searchBox");
  const searchBtn = document.getElementById("searchBtn");
  const results = document.getElementById("results");
  const themeToggle = document.getElementById("themeToggle");

  //========================================
  // Search System
  //========================================
  function runSearch() {
    const query = searchBox.value.toLowerCase().trim();
    results.innerHTML = "";

    if (!query) {
      results.classList.remove("show");
      return;
    }

    const matches = catalog.filter(item =>
      item.name.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      results.innerHTML = `<div style="padding:6px; opacity:.7;">No results</div>`;
    } else {
      matches.forEach(item => {
        const a = document.createElement("a");
        a.href = item.url;
        a.textContent = item.name;
        results.appendChild(a);
      });
    }

    results.classList.add("show");
  }

  searchBtn.addEventListener("click", runSearch);
  searchBox.addEventListener("input", runSearch);

  document.addEventListener("click", (e) => {
    if (!results.contains(e.target) && e.target !== searchBox) {
      results.classList.remove("show");
    }
  });

  //========================================
  // Theme Toggle
  //========================================
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
  });

  //========================================
  // Right‑Click Menu (JS‑only)
  //========================================

  // Inject CSS
  const rcStyle = document.createElement("style");
  rcStyle.textContent = `
    #docsMenu {
      position: absolute;
      background: #3ab0ff;
      color: white;
      border-radius: 8px;
      padding: 6px 0;
      width: 160px;
      display: none;
      z-index: 99999;
      box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      font-family: system-ui, sans-serif;
    }

    #docsMenu .menu-item {
      padding: 10px;
      cursor: pointer;
      font-size: 15px;
    }

    #docsMenu .menu-item:hover {
      background: rgba(255,255,255,0.2);
    }
  `;
  document.head.appendChild(rcStyle);

  // Create menu container
  const docsMenu = document.createElement("div");
  docsMenu.id = "docsMenu";
  document.body.appendChild(docsMenu);

  // Menu items
  const docsMenuItems = [
    { name: "Go Home", action: "home" },
    { name: "Camcookie", action: "main" },
    { name: "Print", action: "print" }
  ];

  // Build menu items
  docsMenuItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.dataset.action = item.action;
    div.textContent = item.name;
    docsMenu.appendChild(div);
  });

  // Right‑click handler
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    docsMenu.style.left = e.pageX + "px";
    docsMenu.style.top = e.pageY + "px";
    docsMenu.style.display = "block";
  });

  // Hide on left click
  document.addEventListener("click", () => {
    docsMenu.style.display = "none";
  });

  // Action handler
  docsMenu.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    if (action === "home") {
      window.location.href = "https://camcookie876.github.io/DOCS/";
    }

    if (action === "main") {
      window.location.href = "https://camcookie876.github.io/";
    }

    if (action === "print") {
      docsMenu.style.display = "none";
      setTimeout(() => window.print(), 1000);
    }
  });

});