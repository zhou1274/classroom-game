# Single-Page Classroom Game Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> User constraint: **Do not use subagents.** When execution begins, use `superpowers:executing-plans` and execute tasks inline with review checkpoints.

**Goal:** Build a pure-static English single-page game site at `classroom-game.com` with a responsive game area (desktop 680px, mobile 520px), a responsive left game-tab list, three AdSense placeholders, 1,000+ words of SEO content, FAQPage/WebSite/VideoGame structured data, and the required static companion files.

**Architecture:** Use hand-written `index.html`, `style.css`, `games.js`, and `main.js`. The left game tabs are rendered from a simple JavaScript array `{name, url, status}` so future games can be added without restructuring the page. `404.html`, `robots.txt`, `sitemap.xml`, and a small SVG favicon complete the static deploy.

**Tech Stack:** Plain HTML5, CSS3, vanilla JavaScript, JSON-LD, SVG favicon. No framework, no build step, no external font, no package dependencies, no images beyond the SVG icon.

## Global Constraints

- Domain: `classroom-game.com`.
- Site language: English with `<html lang="en">`.
- One page, one H1: `Classroom Games Unblocked`.
- Title: `Classroom Games Unblocked - Play Free Games Online at School` (60 characters).
- Description: `Play classroom games unblocked online for free. No download or sign-up needed. Enjoy fast browser games on a Chromebook, laptop, or phone at school. Start now.` (159 characters).
- Canonical: `https://classroom-game.com/`.
- OG URL: `https://classroom-game.com/`.
- Homepage body copy: at least 600 English words; current sample is about 1,042 words.
- Keyword density target: core phrase plus semantic variants, roughly 3%–5%; exact core phrase 5–8 times.
- Desktop sidebar: fixed width `260px`; main content left offset `292px`.
- Game area: max width `960px`; desktop height `680px`, mobile height `520px`; rounded container.
- Mobile: sidebar becomes a horizontal scrollable game-tab strip; no hamburger required.
- Ad slots: exactly three HTML comments `<!-- AdSense Ad Slot: top banner -->`, `<!-- AdSense Ad Slot: middle banner -->`, `<!-- AdSense Ad Slot: bottom banner -->`; no AdSense script or fake ad copy.
- No `adsbygoogle`, no external fonts, no `@font-face`, no large images, no hidden text.
- No `javascript:void(0)` in any site file.
- Production JSON-LD must not include a fake `aggregateRating`; the design spec's rating placeholder is documentation-only and must be removed before deployment.
- Performance budgets: `assets/css/style.css` under 25 KB; `assets/js/games.js` + `assets/js/main.js` combined under 20 KB; `assets/icons/favicon.svg` under 2 KB.
- `robots.txt`: allow all crawlers and point Sitemap to `https://classroom-game.com/sitemap.xml`.
- `sitemap.xml`: include `https://classroom-game.com/` with `2026-08-27`, `daily`, `1.0`.
- `404.html`: `noindex, follow`, friendly copy, home link, six candidate game links that use in-page anchors in Phase 1.
- The plan creates site code only after the user confirms the plan. This file is a plan, not an implementation.

## File Structure

Create or modify these files:

```text
/.gitignore
/index.html
/404.html
/robots.txt
/sitemap.xml
/assets/css/style.css
/assets/js/games.js
/assets/js/main.js
/assets/icons/favicon.svg
/tests/verify.mjs
```

Responsibilities:

| File | Responsibility |
| --- | --- |
| `index.html` | All visible content, SEO metadata, JSON-LD, ad placeholders, game iframe |
| `assets/js/games.js` | Single source of truth for `{name, url, status}` game entries |
| `assets/js/main.js` | Render tabs, Coming Soon behavior, active tab, fullscreen button, toast |
| `assets/css/style.css` | Responsive layout, colors, game shell, side tabs, footer |
| `404.html` | Friendly error page with home link and Phase 1 game anchors |
| `robots.txt` | Crawler rules and Sitemap declaration |
| `sitemap.xml` | Homepage URL entry |
| `assets/icons/favicon.svg` | Small game-controller favicon |
| `tests/verify.mjs` | Node verification script, zero dependencies |

---

### Task 0: Initialize Version Control and Baseline

**Files:**
- Create: `.gitignore`

**Interfaces:**
- Produces: A git repository and `.gitignore` for all later tasks.

- [ ] **Step 1: Initialize git and required directories**

Run:

```powershell
git init
New-Item -ItemType Directory -Force assets\css, assets\js, assets\icons, tests | Out-Null
```

Expected: no errors; `.git/` exists.

- [ ] **Step 2: Create `.gitignore`**

Create `.gitignore` with exactly this content:

```text
.DS_Store
Thumbs.db
node_modules/
*.log
```

- [ ] **Step 3: Verify baseline and commit**

Run:

```powershell
git rev-parse --is-inside-work-tree
git status --short
git add .gitignore
git commit -m "chore: initialize static game site repository"
```

Expected: `true`, empty status after commit.

---

### Task 1: Create Index Page with SEO, Structured Data, and Game Area

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `assets/css/style.css`, `assets/js/games.js`, `assets/js/main.js`, `assets/icons/favicon.svg` in later tasks.
- Produces: DOM IDs `game-list`, `game-area`, `fullscreen-button`; classes `sidebar`, `game-shell`, `ad-slot`, `content-card`, `hero`.

- [ ] **Step 1: Write `index.html`**

Create `index.html` with this exact structure and content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#1A2B3C">
  <title>Classroom Games Unblocked - Play Free Games Online at School</title>
  <meta name="description" content="Play classroom games unblocked online for free. No download or sign-up needed. Enjoy fast browser games on a Chromebook, laptop, or phone at school. Start now.">
  <link rel="canonical" href="https://classroom-game.com/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ClassroomGames">
  <meta property="og:locale" content="en_US">
  <meta property="og:url" content="https://classroom-game.com/">
  <meta property="og:title" content="Classroom Games Unblocked - Play Free Games Online at School">
  <meta property="og:description" content="Play classroom games unblocked online for free. No download or sign-up needed. Enjoy fast browser games on a Chromebook, laptop, or phone at school. Start now.">
  <meta name="twitter:card" content="summary">
  <link rel="icon" type="image/svg+xml" href="assets/icons/favicon.svg">
  <link rel="stylesheet" href="assets/css/style.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ClassroomGames",
    "url": "https://classroom-game.com/",
    "description": "Play classroom games unblocked online for free. No download or sign-up needed. Enjoy fast browser games on a Chromebook, laptop, or phone at school. Start now.",
    "inLanguage": "en"
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": "2048 Unblocked",
    "url": "https://classroom-game.com/",
    "description": "2048 Unblocked is a free browser number puzzle. Slide matching tiles, build bigger numbers, and play in the game area with no download or sign-up.",
    "gamePlatform": ["Web Browser"],
    "applicationCategory": "Game",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are classroom games unblocked?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "These are free browser games that you can open on a compatible school or personal device without installing extra software. They are designed for quick play between classes, during a short break, or as part of a supervised classroom activity."
        }
      },
      {
        "@type": "Question",
        "name": "Are these games free to play?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The games shown here are free to play in the browser. No purchase is required to start a game, and no account is needed for the current experience. Third-party game providers may show their own ads, so always check the source before pressing play."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to download anything?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. You do not need to download an app or install a game file. Everything loads in the browser, which makes the experience fast and easy on school laptops and Chromebooks."
        }
      },
      {
        "@type": "Question",
        "name": "Can I play on a Chromebook or phone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. A Chromebook, laptop, tablet, or phone with a modern browser can usually open the game page. Touch controls and keyboard controls depend on the game title, so choose a game that matches your device."
        }
      },
      {
        "@type": "Question",
        "name": "Are these games safe for school?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When a game comes from a reviewed source, avoids personal data requests, and runs without downloads, it is generally a safe browser experience. Teachers should still review the game and follow school internet rules. If a page asks for private details, payment, or unusual permissions, stop and choose another game."
        }
      },
      {
        "@type": "Question",
        "name": "What if a game does not load at school?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Try refreshing the page, checking your connection, or choosing another game from the tabs. Some school networks apply their own filters, and this site does not bypass them. If the problem continues, ask your teacher or network administrator whether the site is allowed."
        }
      }
    ]
  }
  </script>
</head>

<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <header class="site-header">
    <div class="header-inner container">
      <a class="brand" href="index.html" aria-label="ClassroomGames home">
        <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="5" width="20" height="14" rx="7" fill="#2563EB"/>
          <circle cx="8" cy="10" r="1.3" fill="#fff"/>
          <circle cx="12" cy="10" r="1.3" fill="#fff"/>
          <circle cx="16" cy="10" r="1.3" fill="#fff"/>
          <path d="M7 15h10" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span>ClassroomGames</span>
      </a>
      <nav class="site-nav" aria-label="Main navigation">
        <a href="#site-title">Home</a>
        <a href="#game-area">Play Now</a>
        <a href="#faq">FAQ</a>
      </nav>
    </div>
  </header>

  <aside class="sidebar" aria-label="Games">
    <p class="sidebar-title">Games</p>
    <nav aria-label="Game list">
      <ul class="game-list" id="game-list"></ul>
    </nav>
  </aside>

  <main class="main-content" id="main-content">
    <div class="ad-slot" aria-hidden="true">
      <!-- AdSense Ad Slot: top banner -->
    </div>

    <section class="hero" id="site-title" aria-labelledby="hero-title">
      <h1 id="hero-title">Classroom Games Unblocked</h1>
      <p>Play classroom games unblocked online for free. Choose a game tab below and start playing in your browser.</p>
    </section>

    <section class="game-area" id="game-area" aria-label="Play 2048 Unblocked">
      <div class="game-shell">
        <div class="game-toolbar">
          <span class="game-toolbar-label">2048 Unblocked</span>
          <button class="fullscreen-button" id="fullscreen-button" type="button">Fullscreen</button>
        </div>
        <div class="game-placeholder" id="game-placeholder" role="status" aria-live="polite">
          <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="20" height="14" rx="7" fill="#2563EB"/><circle cx="8" cy="10" r="1.3" fill="#fff"/><circle cx="12" cy="10" r="1.3" fill="#fff"/><circle cx="16" cy="10" r="1.3" fill="#fff"/><path d="M7 15h10" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>
          <strong>2048 Unblocked</strong>
          <p>Loading 2048. If the game does not appear, refresh the page and try again.</p>
        </div>
        <iframe
          class="game-frame"
          src="assets/games/2048/index.html"
          title="2048 Unblocked"
          width="100%"
          height="680"
          frameborder="0"
          allowfullscreen
          loading="lazy">
        </iframe>
      </div>
    </section>

    <div class="ad-slot" aria-hidden="true">
      <!-- AdSense Ad Slot: middle banner -->
    </div>

    <article class="content-card" id="content">
      <h2>Play Classroom Games Unblocked Online</h2>
      <p>Looking for a quick break between classes? You can play classroom games unblocked right here in your browser. These free classroom games run directly on the page. Choose a game tab, click Play, and enjoy a game without downloading software or creating an account. Whether you are on a school Chromebook, a shared classroom computer, or your own laptop, the game loads directly on this page. If your network allows the site, you can start playing in seconds.</p>

      <p>2048 Unblocked is a free number puzzle that takes seconds to understand. Slide matching tiles together, reach the 2048 tile if you can, and start a new round whenever class is about to begin. Everything runs in the browser, with no download, no account, and no setup.</p>

      <p>Use the arrow keys on a computer or swipe on a phone to move the tiles. When two matching numbers touch, they merge into one. Your score appears at the top of the game, and you can press New Game to begin again. If a tab is marked Coming Soon, it means that title is being prepared for its own page rather than available here today.</p>

      <p>Every game on this page is made to be easy to start and easy to pause when class begins again. If a title is marked Coming Soon, it means the game is being prepared for its own page. When it arrives, you will find controls, tips, and classroom-friendly details right here.</p>

      <h2>What Are Classroom Games Unblocked?</h2>
      <p>Classroom games unblocked are browser games you can open on a school computer or personal device when the site is permitted by your network. They run in a web browser, need no download, and usually take only a few minutes to play. Some people search for unblocked games for school when they want a simple title that opens without installers. The word unblocked simply means the game is available in your current browser environment. It does not mean a site bypasses filters, so availability can still depend on your school's network rules.</p>

      <h3>Why Students Need Unblocked Games</h3>
      <p>Short browser games fit naturally between lessons and give students a quick mental reset. A game that loads in the browser removes setup time, so the focus stays on the fun instead of installing software. Games like number puzzles, word challenges, and memory games can also help students practice focus and pattern recognition in a low-pressure setting.</p>

      <h3>Are Unblocked Games Safe to Play?</h3>
      <p>Most free browser games are safe when they come from a reviewed source and do not ask for personal details. This site uses games that run directly in the browser, without downloads or sign-up forms. Students should still follow school rules, and teachers should review any game before using it with a class. If a game asks for money, private information, or unusual permissions, close it and choose another game.</p>

      <h2>Best Unblocked Games for Classroom</h2>
      <p>The best classroom games unblocked are simple to explain, quick to load, and easy to end between periods. Puzzle games work well for quiet brain breaks, while word games and math challenges fit learning goals. The Games menu shows 2048 Unblocked and a short list of titles that are planned for upcoming pages.</p>

      <h3>Popular Games You Can Play Unblocked</h3>
      <p>Popular choices include 2048, Snake, word games, and classroom-friendly puzzle games. They share the same pattern: short rounds, clear rules, and no download required. When a new game is added, it will get its own page with a longer description, controls, and tips.</p>

      <h3>How to Find More Games</h3>
      <p>Use the Games menu to find classroom games unblocked quickly. If a game shows Coming Soon, it means the page is planned but not live yet. You can also return to the top of the page and use the navigation links to get back to 2048 Unblocked or jump to the FAQ.</p>

      <h2>How to Play Unblocked Games at School</h2>
      <p>To play games at school, pick a game from the Games menu, make sure the game area is visible, and click the play prompt inside the frame. If the game does not load, refresh the page and try again. Some school networks may limit certain sites, so a game that works at home may not open at school. This site does not bypass network policies and does not guarantee that every title will be available everywhere.</p>

      <h3>Do Unblocked Games Require Download?</h3>
      <p>No. These games run in the browser and do not require a download, installation, or account. This makes them easier to use on shared school devices and Chromebooks. If you see a download button or a request to install an app, you are not on the intended game experience and should return to this page.</p>

      <h3>Can I Play Unblocked Games on a Chromebook?</h3>
      <p>Yes, most browser games can run on a Chromebook. Type the address into Chrome, open the game page, and play in the browser. Compatibility still depends on the game title, browser version, device settings, and the network rules set by your school.</p>

      <h2 id="faq">FAQ About Classroom Games Unblocked</h2>
      <h3>What are classroom games unblocked?</h3>
      <p>These are free browser games that you can open on a compatible school or personal device without installing extra software. They are designed for quick play between classes, during a short break, or as part of a supervised classroom activity.</p>

      <h3>Are these games free to play?</h3>
      <p>Yes. The games shown here are free to play in the browser. No purchase is required to start a game, and no account is needed for the current experience. Third-party game providers may show their own ads, so always check the source before pressing play.</p>

      <h3>Do I need to download anything?</h3>
      <p>No. You do not need to download an app or install a game file. Everything loads in the browser, which makes the experience fast and easy on school laptops and Chromebooks.</p>

      <h3>Can I play on a Chromebook or phone?</h3>
      <p>Yes. A Chromebook, laptop, tablet, or phone with a modern browser can usually open the game page. Touch controls and keyboard controls depend on the game title, so choose a game that matches your device.</p>

      <h3>Are these games safe for school?</h3>
      <p>When a game comes from a reviewed source, avoids personal data requests, and runs without downloads, it is generally a safe browser experience. Teachers should still review the game and follow school internet rules. If a page asks for private details, payment, or unusual permissions, stop and choose another game.</p>

      <h3>What if a game does not load at school?</h3>
      <p>Try refreshing the page, checking your connection, or choosing another game from the tabs. Some school networks apply their own filters, and this site does not bypass them. If the problem continues, ask your teacher or network administrator whether the site is allowed.</p>
    </article>

    <div class="ad-slot" aria-hidden="true">
      <!-- AdSense Ad Slot: bottom banner -->
    </div>
  </main>

  <footer class="site-footer">
    <div class="footer-inner container">
      <nav aria-label="Footer navigation">
        <a href="index.html">Home</a>
        <a href="#game-area">Play Now</a>
        <a href="#faq">FAQ</a>
      </nav>
      <p>ClassroomGames is an independent browser game page. Access may depend on your school network.</p>
      <p>© 2026 ClassroomGames. All rights reserved.</p>
    </div>
  </footer>

  <script src="assets/js/games.js" defer></script>
  <script src="assets/js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verify the initial skeleton**

Run:

```powershell
rg -c "<h1" index.html
rg -n "<meta name=\"description\"" index.html
rg -n "AdSense Ad Slot: top banner|AdSense Ad Slot: middle banner|AdSense Ad Slot: bottom banner" index.html
rg -c "<h4" index.html
```

Expected: H1 count `1`; description present; three ad comments; H4 count `0`.

- [ ] **Step 3: Commit**

```powershell
git add index.html
git commit -m "feat: add homepage shell, SEO metadata, and game area"
```

---

### Task 2: Implement Game Tab Data and Rendering Scripts

**Files:**
- Create: `assets/js/games.js`
- Create: `assets/js/main.js`

**Interfaces:**
- Consumes: DOM IDs from Task 1: `game-list`, `fullscreen-button`; CSS class `.game-shell`.
- Produces: `window.CLASSROOM_GAMES` array with fields `name` (string), `url` (string), `status` (`"active" | "coming-soon" | "live"`); functions `renderGameList()`, `showToast(message)`, `initFullscreen()`.

- [ ] **Step 1: Create `assets/js/games.js`**

Create exactly:

```js
window.CLASSROOM_GAMES = [
  { name: "2048 Unblocked", url: "#game-area", status: "active" },
  { name: "Minecraft Unblocked", url: "/games/minecraft-unblocked.html", status: "coming-soon" },
  { name: "Tetris Unblocked", url: "/games/tetris-unblocked.html", status: "coming-soon" },
  { name: "Snake Unblocked", url: "/games/snake-unblocked.html", status: "coming-soon" },
  { name: "Wordle Unblocked", url: "/games/wordle-unblocked.html", status: "coming-soon" },
  { name: "Math Games Unblocked", url: "/games/math-games-unblocked.html", status: "coming-soon" },
  { name: "Puzzle Games Unblocked", url: "/games/puzzle-games-unblocked.html", status: "coming-soon" }
]
];
```

- [ ] **Step 2: Create `assets/js/main.js`**

Create exactly:

```js
(() => {
  const games = window.CLASSROOM_GAMES || [];
  const list = document.getElementById("game-list");
  if (!games.length || !list) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);

  let toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2000);
  }

  function createBadge(status) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.setAttribute("aria-hidden", "true");
    if (status === "active") {
      badge.textContent = "This Page";
    } else if (status === "live") {
      badge.textContent = "Live";
    } else {
      badge.textContent = "Soon";
    }
    return badge;
  }

  function renderGameList() {
    list.innerHTML = "";

    games.forEach((game) => {
      const item = document.createElement("li");
      const link = document.createElement("a");

      if (game.status === "active") {
        link.href = game.url;
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      } else if (game.status === "live") {
        link.href = game.url;
        link.classList.add("is-live");
      } else {
        link.href = "#";
        link.classList.add("is-coming-soon");
        link.setAttribute("aria-label", game.name + " is coming soon");
        link.addEventListener("click", (event) => {
          event.preventDefault();
          showToast(`${game.name} is coming soon.`);
        });
      }

      link.textContent = game.name + " ";
      link.appendChild(createBadge(game.status));
      item.appendChild(link);
      list.appendChild(item);
    });

    const activeItem = list.querySelector(".is-active");
    if (activeItem) {
      requestAnimationFrame(() => {
        activeItem.scrollIntoView({ block: "nearest", inline: "center" });
      });
    }
  }

  function initFullscreen() {
    const button = document.getElementById("fullscreen-button");
    const shell = document.querySelector(".game-shell");
    if (!button || !shell) {
      return;
    }

    button.addEventListener("click", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      } else {
        shell.requestFullscreen?.();
      }
    });
  }

  const placeholder = document.getElementById("game-placeholder");
  const gameFrame = document.querySelector(".game-frame");
  if (placeholder && gameFrame) {
    gameFrame.addEventListener("load", () => {
      if (gameFrame.src) {
        placeholder.hidden = true;
      }
    });
  }

  renderGameList();
  initFullscreen();
})();
```

- [ ] **Step 3: Verify syntax and data**

Run:

```powershell
node --check assets/js/games.js
node --check assets/js/main.js
rg -n "status: \"active\"" assets/js/games.js
rg -c "status: \"coming-soon\"" assets/js/games.js
rg -n "preventDefault|aria-current|requestFullscreen" assets/js/main.js
```

Expected: both syntax checks pass; one active status; six coming-soon entries; the four main.js behaviors are present.

- [ ] **Step 4: Commit**

```powershell
git add assets/js/games.js assets/js/main.js
git commit -m "feat: add game tab data and interaction script"
```

---

### Task 3: Add Responsive Styles

**Files:**
- Create: `assets/css/style.css`

**Interfaces:**
- Consumes: HTML classes from Task 1 and Task 2: `sidebar`, `game-list`, `is-active`, `is-coming-soon`, `badge`, `game-shell`, `game-toolbar`, `fullscreen-button`, `ad-slot`, `hero`, `content-card`, `site-footer`, `toast`.
- Produces: Responsive desktop/mobile layout and visual identity.

- [ ] **Step 1: Write `assets/css/style.css`**

Create exactly:

```css
:root {
  --primary: #2563EB;
  --bg: #F4F6F9;
  --sidebar-bg: #1A2B3C;
  --card-bg: #FFFFFF;
  --text: #0F172A;
  --muted: #475569;
  --border: #E2E8F0;
  --hover-bg: #EFF6FF;
  --ad-bg: #FAFAFA;
  --font-stack: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-stack);
  line-height: 1.6;
}

a {
  color: var(--primary);
  text-decoration: none;
}

a:focus-visible,
button:focus-visible {
  outline: 3px solid #93C5FD;
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  left: 12px;
  top: -48px;
  z-index: 200;
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--primary);
  color: #fff;
  font-weight: 700;
  transition: top 160ms ease;
}

.skip-link:focus {
  top: 12px;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 60;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 32px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-weight: 800;
  font-size: 18px;
}

.site-nav {
  display: flex;
  gap: 18px;
}

.site-nav a {
  color: var(--muted);
  font-weight: 600;
}

.site-nav a:hover {
  color: var(--primary);
}

.sidebar {
  background: var(--sidebar-bg);
  color: #fff;
}

.sidebar-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.game-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.game-list a {
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  line-height: 1.25;
}

.game-list a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.game-list a.is-active {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.18);
}

.game-list a.is-coming-soon {
  color: rgba(255, 255, 255, 0.72);
}

.badge {
  flex: 0 0 auto;
  padding: 2px 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font-size: 11px;
}

.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px;
}

.ad-slot {
  max-width: 960px;
  min-height: 90px;
  margin: 16px auto;
  background: transparent;
}

.hero {
  max-width: 960px;
  margin: 0 auto 32px;
  padding: 32px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--card-bg);
  text-align: center;
}

.hero h1 {
  margin: 0 0 12px;
  font-size: 36px;
  line-height: 1.2;
}

.hero p {
  margin: 0;
  color: var(--muted);
}

.game-area {
  max-width: 960px;
  margin: 0 auto;
}

.game-shell {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--card-bg);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.game-placeholder {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  text-align: center;
  background: var(--card-bg);
  color: var(--muted);
}

.game-placeholder[hidden] {
  display: none;
}

.game-placeholder svg {
  color: var(--primary);
}

.game-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  background: var(--card-bg);
}

.game-toolbar-label {
  color: var(--muted);
  font-size: 14px;
  font-weight: 700;
}

.fullscreen-button {
  padding: 7px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.fullscreen-button:hover {
  background: var(--hover-bg);
  color: var(--primary);
}

.game-frame {
  display: block;
  width: 100%;
  height: 680px;
  border: 0;
}

.game-shell:fullscreen {
  max-width: none;
  border-radius: 0;
}

.content-card {
  max-width: 960px;
  margin: 32px auto;
  padding: 32px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--card-bg);
}

.content-card h2 {
  margin-top: 2rem;
  font-size: 28px;
  line-height: 1.25;
}

.content-card h2:first-child {
  margin-top: 0;
}

.content-card h3 {
  margin-top: 1.5rem;
  font-size: 20px;
  line-height: 1.3;
}

.content-card p {
  color: var(--muted);
  line-height: 1.75;
  margin-bottom: 1.1em;
}

.site-footer {
  margin-top: 48px;
  border-top: 1px solid var(--border);
  background: var(--card-bg);
  color: var(--muted);
}

.footer-inner {
  padding: 24px 32px;
  text-align: center;
}

.footer-inner nav {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-bottom: 10px;
}

.footer-inner a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: 8px 10px;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 100;
  padding: 12px 18px;
  border-radius: 8px;
  background: var(--text);
  color: #fff;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 12px);
  transition: opacity 180ms ease, transform 180ms ease;
}

.toast.is-visible {
  opacity: 1;
  transform: translate(-50%, 0);
}

@media (min-width: 1024px) {
  body {
    padding-left: 292px;
    background: linear-gradient(to right, var(--sidebar-bg) 0 260px, var(--bg) 260px);
  }

  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 50;
    width: 260px;
    min-height: 100vh;
    overflow-y: auto;
    padding: 24px 16px;
  }
}

@media (max-width: 1023px) {
  .sidebar {
    width: 100%;
    min-height: 56px;
    padding: 12px 16px;
    background: var(--card-bg);
    color: var(--text);
    border-bottom: 1px solid var(--border);
    overflow-x: auto;
  }

  .sidebar-title {
    margin-bottom: 8px;
    color: var(--muted);
  }

  .game-list {
    flex-direction: row;
    gap: 8px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .game-list li {
    flex: 0 0 auto;
  }

  .game-list a {
    min-width: 150px;
    color: var(--muted);
    white-space: nowrap;
  }

  .game-list a.is-active {
    color: #fff;
  }

  .game-list a.is-coming-soon {
    color: #64748B;
  }
}

@media (max-width: 767px) {
  .header-inner {
    padding: 12px;
  }

  .site-nav {
    display: none;
  }

  .main-content {
    padding: 16px;
  }

  .hero {
    padding: 24px 18px;
  }

  .hero h1 {
    font-size: 30px;
  }

  .game-shell {
    border-radius: 12px;
  }

  .content-card {
    padding: 24px 18px;
  }

  .footer-inner {
    padding: 24px 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify key layout rules**

Run:

```powershell
rg -n "padding-left: 292px|width: 260px|max-width: 960px|height: 680px|height: 520px|overflow-x: auto" assets/css/style.css
```

Expected: all five rules present.

- [ ] **Step 3: Commit**

```powershell
git add assets/css/style.css
git commit -m "feat: add responsive styles for game homepage"
```

---

### Task 4: Create the 404 Page

**Files:**
- Create: `404.html`

**Interfaces:**
- Consumes: `assets/css/style.css`.
- Produces: In-page anchor links back to `index.html#game-area`.

- [ ] **Step 1: Write `404.html`**

Create exactly:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, follow">
  <title>404 - Game Not Found | ClassroomGames</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <main class="not-found-page">
    <h1>Oops! That Game Is Not Here</h1>
    <p>The page you are looking for may have moved, or the game may still be on its way. Go back to the classroom games hub and choose a game that is ready to play.</p>
    <a class="fullscreen-button" href="index.html">Back to Home</a>

    <section class="content-card" aria-label="Games you can try">
      <h2>Try another game</h2>
      <ul class="not-found-links">
        <li><a href="index.html#game-area">2048 Unblocked</a></li>
        <li><a href="index.html#game-area">Snake Unblocked</a></li>
        <li><a href="index.html#game-area">Tetris Unblocked</a></li>
        <li><a href="index.html#game-area">Wordle Unblocked</a></li>
        <li><a href="index.html#game-area">Math Games Unblocked</a></li>
        <li><a href="index.html#game-area">Puzzle Games Unblocked</a></li>
      </ul>
    </section>
  </main>
</body>
</html>
```

- [ ] **Step 2: Verify 404 content**

Run:

```powershell
rg -n "noindex, follow|Back to Home|2048 Unblocked|Snake Unblocked|Tetris Unblocked|Wordle Unblocked|Math Games Unblocked|Puzzle Games Unblocked" 404.html
```

Expected: all 8 strings present.

- [ ] **Step 3: Commit**

```powershell
git add 404.html
git commit -m "feat: add friendly 404 page"
```

---

### Task 5: Add Static Companion Files

**Files:**
- Create: `robots.txt`
- Create: `sitemap.xml`
- Create: `assets/icons/favicon.svg`

**Interfaces:**
- Produces: canonical site assets referenced by `index.html` and deployment host.

- [ ] **Step 1: Create `robots.txt`**

Create exactly:

```text
User-agent: *
Allow: /

Sitemap: https://classroom-game.com/sitemap.xml
```

- [ ] **Step 2: Create `sitemap.xml`**

Create exactly:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://classroom-game.com/</loc>
    <lastmod>2026-08-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 3: Create `assets/icons/favicon.svg`**

Create exactly:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="ClassroomGames">
  <rect width="32" height="32" rx="7" fill="#1A2B3C"/>
  <rect x="4" y="8" width="24" height="16" rx="8" fill="#2563EB"/>
  <circle cx="10" cy="14" r="1.8" fill="#fff"/>
  <circle cx="15" cy="14" r="1.8" fill="#fff"/>
  <circle cx="20" cy="14" r="1.8" fill="#fff"/>
  <path d="M9 21h14" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 4: Verify files**

Run:

```powershell
rg -n "Sitemap: https://classroom-game.com/sitemap.xml" robots.txt
rg -n "<loc>https://classroom-game.com/</loc>|<lastmod>2026-08-27</lastmod>|<changefreq>daily</changefreq>|<priority>1.0</priority>" sitemap.xml
node -e "const fs=require('fs'); const s=fs.readFileSync('assets/icons/favicon.svg','utf8'); if(!s.includes('<svg')||!s.includes('</svg>')) process.exit(1);"
```

Expected: all commands succeed.

- [ ] **Step 5: Commit**

```powershell
git add robots.txt sitemap.xml assets/icons/favicon.svg
git commit -m "feat: add robots, sitemap, and favicon"
```

---

### Task 6: Add Automated Verification Script

**Files:**
- Create: `tests/verify.mjs`

**Interfaces:**
- Consumes: all files from Tasks 1–5.
- Produces: exit code `0` when all checks pass, `1` otherwise.

- [ ] **Step 1: Write `tests/verify.mjs`**

Create exactly:

```js
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const passes = [];

const expectedTitle = "Classroom Games Unblocked - Play Free Games Online at School";
const expectedDescription = "Play classroom games unblocked online for free. No download or sign-up needed. Enjoy fast browser games on a Chromebook, laptop, or phone at school. Start now.";
const canonical = "https://classroom-game.com/";
const sitemapUrl = "https://classroom-game.com/sitemap.xml";

const requiredFiles = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "assets/css/style.css",
  "assets/js/games.js",
  "assets/js/main.js",
  "assets/icons/favicon.svg"
];

for (const file of requiredFiles) {
  if (existsSync(path.join(root, file))) {
    passes.push(`File exists: ${file}`);
  } else {
    failures.push(`Missing file: ${file}`);
  }
}

function readOrEmpty(file) {
  const fullPath = path.join(root, file);
  return existsSync(fullPath) ? readFileSync(fullPath, "utf8") : "";
}

const html = readOrEmpty("index.html");
const gamesJs = readOrEmpty("assets/js/games.js");
const mainJs = readOrEmpty("assets/js/main.js");
const css = readOrEmpty("assets/css/style.css");
const robots = readOrEmpty("robots.txt");
const sitemap = readOrEmpty("sitemap.xml");
const notFound = readOrEmpty("404.html");
const favicon = readOrEmpty("assets/icons/favicon.svg");

function check(condition, label) {
  if (condition) {
    passes.push(label);
  } else {
    failures.push(label);
  }
}

function count(text, pattern) {
  return (text.match(pattern) || []).length;
}

check(/<html lang="en">/i.test(html), "html lang=en");
check(html.includes(`<title>${expectedTitle}</title>`), "title exact");
check(html.includes(`<meta name="description" content="${expectedDescription}">`), "description exact");
check(html.includes(`<link rel="canonical" href="${canonical}">`), "canonical");
check(html.includes(`<meta property="og:url" content="${canonical}">`), "og:url");
check(count(html, /<h1\b/gi) === 1, "exactly one H1");
check(/<h1[^>]*>\s*Classroom Games Unblocked\s*<\/h1>/i.test(html), "H1 text exact");
check(count(html, /<h4\b/gi) === 0, "no H4 in page");
check(html.includes("Play Classroom Games Unblocked Online"), "H2 content heading");
check(html.includes("What Are Classroom Games Unblocked?"), "H2 explainer heading");
check(html.includes("Best Unblocked Games for Classroom"), "H2 best games heading");
check(html.includes("How to Play Unblocked Games at School"), "H2 how-to heading");
check(html.includes("FAQ About Classroom Games Unblocked"), "H2 FAQ heading");
check(html.includes('class="game-frame"'), "game iframe uses game-frame class");
check(html.includes("class=\"skip-link\""), "skip link present");
check(html.includes("id=\"game-placeholder\""), "game placeholder present");
check(!html.includes("Once the featured game is confirmed"), "no developer placeholder note");
check(mainJs.includes("placeholder.hidden = true"), "placeholder hides after game loads");
check(!mainJs.includes("Now Playing"), "no false playing claim");
check(html.includes("Games menu shows"), "device-neutral games menu copy");
check(html.includes("Games menu to explore"), "explore copy is device neutral");
check(html.includes("Games menu to find"), "find copy is device neutral");
check(!html.includes("left sidebar"), "no desktop-only sidebar copy");
check(css.includes(".game-placeholder svg"), "placeholder icon style");
check(mainJs.includes('badge.textContent = "This Page"'), "this page badge label");
check(mainJs.includes('link.setAttribute("aria-label"'), "placeholder uses aria-label");
check(!mainJs.includes("aria-disabled"), "no conflicting disabled state");
check(!/<img\b/i.test(html), "no raster images in HTML");

const articleMatch = html.match(/<article class="content-card" id="content">([\s\S]*?)<\/article>/);
const articleText = articleMatch ? articleMatch[1].replace(/<[^>]+>/g, " ") : "";
const articleWords = (articleText.match(/[A-Za-z]+/g) || []).length;
check(articleWords >= 600, `SEO article words >=600 (got ${articleWords})`);
const coreCount = (articleText.match(/classroom games unblocked/gi) || []).length;
check(coreCount >= 5 && coreCount <= 8, `core phrase 5-8 times (got ${coreCount})`);

const adComments = [
  "<!-- AdSense Ad Slot: top banner -->",
  "<!-- AdSense Ad Slot: middle banner -->",
  "<!-- AdSense Ad Slot: bottom banner -->"
];
for (const comment of adComments) {
  check(html.includes(comment), `ad comment: ${comment}`);
}

check(!html.includes("adsbygoogle"), "no AdSense script");
check(!/fonts\.googleapis\.com|fonts\.gstatic\.com|@font-face/i.test(html), "no external fonts");
check(!/style="[^"]*(display\s*:\s*none|visibility\s*:\s*hidden)/i.test(html), "no hidden text");
check(!html.includes("src=\"javascript:"), "no javascript urls in HTML");

const statuses = [...gamesJs.matchAll(/status:\s*"(active|coming-soon|live)"/g)].map((match) => match[1]);
check(statuses.length === 7, `seven game entries (got ${statuses.length})`);
check(statuses[0] === "active", "first game is active");
check(statuses.slice(1).every((status) => status === "coming-soon"), "six placeholder entries");
check(!gamesJs.includes("javascript:void"), "no javascript:void in games.js");
check(mainJs.includes("preventDefault"), "main.js prevents placeholder navigation");
check(mainJs.includes("aria-current"), "main.js marks current tab");
check(mainJs.includes("requestFullscreen"), "main.js supports fullscreen");

for (const rule of [
  "padding-left: 292px",
  "width: 260px",
  "max-width: 960px",
  "height: 680px",
  "height: 520px",
  "overflow-x: auto",
  "min-height: 56px",
  "min-height: 100vh",
  ".game-placeholder",
  ".skip-link",
  "min-width: 150px",
  "prefers-reduced-motion"
]) {
  check(css.includes(rule), `CSS rule: ${rule}`);
}

check(Buffer.byteLength(css, "utf8") < 25 * 1024, "CSS under 25 KB");
check(Buffer.byteLength(gamesJs, "utf8") + Buffer.byteLength(mainJs, "utf8") < 20 * 1024, "JS combined under 20 KB");
check(Buffer.byteLength(favicon, "utf8") < 2 * 1024, "favicon under 2 KB");

check(robots.includes(`Sitemap: ${sitemapUrl}`), "robots Sitemap");
check(sitemap.includes(`<loc>${canonical}</loc>`), "sitemap loc");
check(sitemap.includes("<lastmod>2026-08-27</lastmod>"), "sitemap lastmod");
check(sitemap.includes("<changefreq>daily</changefreq>"), "sitemap changefreq");
check(sitemap.includes("<priority>1.0</priority>"), "sitemap priority");
check(notFound.includes("noindex, follow"), "404 noindex");
check(notFound.includes("Back to Home"), "404 home link");
for (const game of ["2048 Unblocked", "Snake Unblocked", "Tetris Unblocked", "Wordle Unblocked", "Math Games Unblocked", "Puzzle Games Unblocked"]) {
  check(notFound.includes(game), `404 link: ${game}`);
}

const ldBlocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
check(ldBlocks.length === 3, `three JSON-LD blocks (got ${ldBlocks.length})`);
ldBlocks.forEach((block, index) => {
  const payload = block.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
  try {
    JSON.parse(payload);
    passes.push(`JSON-LD block ${index + 1} parses`);
  } catch (error) {
    failures.push(`JSON-LD block ${index + 1} invalid: ${error.message}`);
  }
});

if (failures.length) {
  console.error(`FAIL (${failures.length} checks failed)`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log(`PASS (${passes.length} checks passed)`);
}
```

- [ ] **Step 2: Run the verification script**

Run:

```powershell
node tests/verify.mjs
```

Expected: `PASS (... checks passed)` and exit code `0`.

- [ ] **Step 3: Commit**

```powershell
git add tests/verify.mjs
git commit -m "test: add static site verification script"
```

---

### Task 7: Run Local Preview and Final QA

**Files:**
- No new files.

**Interfaces:**
- Verifies the complete integrated site from Tasks 1–6.

- [ ] **Step 1: Start a local static server**

Run:

```powershell
python -m http.server 8080
```

Expected: `Serving HTTP on ::1 port 8080`.

- [ ] **Step 2: Open and inspect**

Open:

```text
http://localhost:8080/
http://localhost:8080/404.html
http://localhost:8080/robots.txt
http://localhost:8080/sitemap.xml
```

Expected: all pages load; `404.html` shows friendly copy; `robots.txt` and `sitemap.xml` render as raw text.

- [ ] **Step 3: Check response codes**

Run in a second terminal:

```powershell
curl.exe -I http://localhost:8080/
curl.exe -I http://localhost:8080/404.html
curl.exe -I http://localhost:8080/robots.txt
```

Expected: HTTP `200` for all three.

- [ ] **Step 4: Manual responsive checks**

At widths `500px`, `768px`, `1024px`, and `1440px`, confirm:

- Left sidebar becomes a horizontal tab strip below the header on small screens.
- The active tab is visible and highlighted.
- The game area is centered at `960px` on desktop and full width on mobile.
- The iframe is not clipped horizontally.
- Ad placeholders do not cover the iframe.
- One H1 is visible, and no H4 appears in the page outline.
- FAQ questions are H3 under the FAQ H2.
- Coming Soon tabs show a toast and do not navigate.
- Fullscreen button works or gracefully does nothing when unsupported.

- [ ] **Step 5: Run final verification and commit**

Run:

```powershell
node tests/verify.mjs
git status --short
git add .
git commit -m "chore: complete single-page game site QA"
```

Expected: `PASS`; no unexpected untracked files.

---

## Spec Coverage Map

| Design spec section | Plan task |
| --- | --- |
| 0. Reference analysis | Global Constraints only; no copying of reference markup |
| 1. Positioning and goals | Global Constraints; deployment needs to be confirmed by site owner |
| 2. Keyword table | Global Constraints; all keywords are planned as future URL entries, not stuffed into homepage |
| 3. Layout and components | Task 1 + Task 3 |
| 4. Head SEO | Task 1; exact title/description/canonical/OG/JSON-LD included |
| 5. Left game tabs | Task 2 + Task 3 |
| 6. Game iframe candidate | Task 1 + Task 3; local MIT 2048 source, licensed replacement required for future games |
| 7. SEO content tree | Task 1 |
| 8. Ad slots | Task 1 + Task 3 |
| 9. Companion files | Task 4 + Task 5 |
| 10. Copy style | Task 1 |
| 11. Launch checklist | Task 7 + Deployment Notes |
| 12. Coding agent checklist | Task 0 through Task 7 |

---

## Deployment Notes

- Host on Vercel, Cloudflare Pages, or GitHub Pages as a static site.
- Do not deploy `tests/`; the static host can ignore it.
- After deployment, confirm `https://classroom-game.com/` returns the homepage.
- Set Cloudflare SSL/TLS to **Full (strict)**.
- Submit `https://classroom-game.com/sitemap.xml` to Google Search Console.
- The main game is already the local MIT 2048 build. Replace it only after confirming the license for any future game.
- Add AdSense code only after approval; keep the three HTML comments in place.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-27-single-page-game-site.md`.

User preference is **inline execution**, not subagent-driven execution. After the user confirms this plan, use `superpowers:executing-plans` and execute tasks one by one with a review checkpoint after each task.


---

## 2026-08-27 实施后状态更新

- 主游戏已接入本地 MIT 2048：`assets/games/2048/index.html`。
- 游戏源内页已精简为适合桌面 680px / 移动端 520px iframe 的嵌入版，保留 MIT 声明并设置 `noindex`。
- 首页选项卡、游戏区标题、VideoGame schema 与正文介绍已同步为 `2048 Unblocked`。
- 下一阶段可继续把 `Snake Unblocked`、`Tic Tac Toe` 等作为独立页面接入。
