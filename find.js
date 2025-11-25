    // ====== INSERT YOUR JSON FILE URL OR PATH HERE ======
    const JSON_URL = "https://camcookie876.github.io/DOCS/catalog.json";

    let data = [];
    fetch(JSON_URL).then(res => res.json()).then(json => data = json);

    const searchBox = document.getElementById('searchBox');
    const searchBtn = document.getElementById('searchBtn');
    const results = document.getElementById('results');

    function renderResults(query) {
      results.innerHTML = '';
      if (!query) { results.classList.remove('show'); return; }

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

    // Theme system
    const themes = {
      dark: { "--bg":"#0f1115","--text":"#e7ebf3","--accent":"#3ab0ff","--surface":"#151922" },
      light: { "--bg":"#f9f9f9","--text":"#111","--accent":"#0077cc","--surface":"#fff" },
      alt: { "--bg":"#1a1a2e","--text":"#eaeaea","--accent":"#ff6f61","--surface":"#16213e" }
    };
    const themeToggle = document.getElementById('themeToggle');
    let currentTheme = localStorage.getItem('theme') || 'dark';
    function applyTheme(name) {
      const theme = themes[name];
      for (const key in theme) document.documentElement.style.setProperty(key, theme[key]);
      localStorage.setItem('theme', name);
      currentTheme = name;
    }
    themeToggle.addEventListener('click', () => {
      const order = ["dark","light","alt"];
      const next = order[(order.indexOf(currentTheme)+1)%order.length];
      applyTheme(next);
    });
    applyTheme(currentTheme);