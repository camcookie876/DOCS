document.addEventListener("DOMContentLoaded", () => {

  //========================================
  // Catalog
  //========================================
const catalog = [
  {
    name: "Home",
    url: "https://camcookie876.github.io/DOCS/"
  },
  {
    name: "Camcookie Music",
    url: "https://camcookie876.github.io/DOCS/music/"
  },
  {
    name: "Archive Radio",
    url: "https://camcookie876.github.io/DOCS/music/1"
  },
  {
    name: "Camcookie Arduino",
    url: "https://camcookie876.github.io/DOCS/arduino/"
  },
  {
    name: "Camcookie Security - UNO R3",
    url: "https://camcookie876.github.io/DOCS/arduino/1/"
  }
];

  const searchBox = document.getElementById("searchBox");
  const searchBtn = document.getElementById("searchBtn");
  const results = document.getElementById("results");

  //========================================
  // Search Function
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

  // Hide results when clicking outside
  document.addEventListener("click", (e) => {
    if (!results.contains(e.target) && e.target !== searchBox) {
      results.classList.remove("show");
    }
  });

  //========================================
  // Theme Toggle
  //========================================
  const themeToggle = document.getElementById("themeToggle");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
  });

});