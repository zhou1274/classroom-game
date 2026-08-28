import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GAME_PAGES } from "./game-pages-data.mjs";
import { CATALOG_GAME_PAGES } from "./catalog-game-pages-data.mjs";
import { REMAINING_GAME_PAGES } from "./remaining-games-data.mjs";

const ASSET_VERSION = "20260828m";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const gamesDir = path.join(root, "games");
// ALL_GAME_PAGES is defined below after priority ordering.

const PRIORITY_GAME_SLUGS = [
  "minecraft",
  "1v1-lol",
  "moto-x3m",
  "hill-climb-racing",
  "drift-hunters",
  "subway-surfers",
  "temple-run",
  "geometry-dash",
  "slope",
  "ovo",
  "vex",
  "run-3",
  "among-us",
  "chess",
  "checkers",
  "solitaire",
  "uno",
  "cookie-clicker",
  "paper-io",
  "doodle-jump",
  "tetris",
  "math-games",
  "puzzle-games",
  "ball-sort-puzzle",
  "2048-classic",
  "wordle-extra",
  "minesweeper-classic",
  "tic-tac-toe-classic"
];

function orderGames(games) {
  const bySlug = new Map(games.map((game) => [game.slug, game]));
  const ordered = [];
  const used = new Set();
  for (const slug of PRIORITY_GAME_SLUGS) {
    const game = bySlug.get(slug);
    if (game && !used.has(slug)) {
      ordered.push(game);
      used.add(slug);
    }
  }
  for (const game of games) {
    if (!used.has(game.slug)) {
      ordered.push(game);
      used.add(game.slug);
    }
  }
  return ordered;
}

const ALL_GAME_PAGES = orderGames([...GAME_PAGES, ...CATALOG_GAME_PAGES, ...REMAINING_GAME_PAGES]);

function titleFor(game) {
  const variants = [
    `${game.name} - ${game.titleTag}`,
    `${game.name} - ${game.titleTag} at School`,
    `${game.name} - Fun Class Game for School Time`,
    `${game.name} - Quick Class Game`,
    `${game.name} - Fun Browser Game for Class`,
    `${game.name} - Easy Game for a Class Break`,
    `${game.name} - A Fun Class Break for School Time`,
    `${game.name} - Fun Class Game for Extra School Time`,
    `${game.name} - Fun Browser Game for School Time`,
    `${game.name} - Easy Class Break`
  ];
  const valid = variants.filter((value) => value.length >= 50 && value.length <= 60);
  return valid[0] || variants.sort((a, b) => Math.abs(a.length - 55) - Math.abs(b.length - 55))[0];
}

function descriptionFor(game) {
  const variants = [
    `Play ${game.shortName} online for free. No download or sign-up needed. Enjoy ${game.category} gameplay in the browser on a Chromebook, laptop, or phone at school. Start now.`,
    `Play ${game.shortName} online for free. No download or sign-up needed. Enjoy fast ${game.category} gameplay on a Chromebook, laptop, or phone at school. Start now.`,
    `Play ${game.shortName} online for free. No download or sign-up needed. Try a quick ${game.category} game for school devices. Start now.`,
    `Play ${game.shortName} online for free. No download or sign-up needed. A school-friendly ${game.category} in the browser. Start now.`,
    `Play ${game.shortName} online for free. No download or sign-up needed. A quick ${game.category} for classroom breaks. Start now.`
  ];
  const valid = variants.filter((value) => value.length >= 150 && value.length <= 160);
  if (valid.length) return valid[0];
  let description = variants.sort((a, b) => Math.abs(a.length - 155) - Math.abs(b.length - 155))[0];
  if (description.length > 160) description = description.replace(" Start now.", "");
  if (description.length < 150) description = description.replace("Start now.", "Start playing now.");
  return description;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function faqEntries(game) {
  return [
    {
      q: `How do I play ${game.name}?`,
      a: game.howToPlay
    },
    {
      q: `Is ${game.name} free to play?`,
      a: `Yes. ${game.name} is free to play in the browser. No download, account, or purchase is required for the current page.`
    },
    {
      q: `Can I play ${game.name} on a Chromebook or phone?`,
      a: `Yes. The page works in a modern browser on a Chromebook, laptop, tablet, or phone. ${game.mobileControls}`
    },
    {
      q: `Is ${game.name} good for a classroom?`,
      a: game.why
    },
    {
      q: `What if ${game.name} does not load at school?`,
      a: "Refresh the page and try again. If the game still does not open, check the connection or choose another game from the Games menu. School network rules can affect third-party game hosts."
    }
  ];
}

function jsonLd(type, payload) {
  return `<script type="application/ld+json">
${JSON.stringify({ "@context": "https://schema.org", "@type": type, ...payload }, null, 2)}
  </script>`;
}

function buildPage(game) {
  const title = titleFor(game);
  const description = descriptionFor(game);
  const canonical = `https://classroom-game.com/games/${game.slug}-unblocked.html`;
  const faqs = faqEntries(game);
  const introParagraphs = game.intro.split("\n\n").map((value) => `<p>${value}</p>`).join("\n      ");
  const faqHtml = faqs.map(({ q, a }) => `<h3>${q}</h3>\n      <p>${a}</p>`).join("\n\n      ");

  if (title.length < 50 || title.length > 60) {
    throw new Error(`${game.slug}: title length ${title.length}: ${title}`);
  }
  if (description.length < 150 || description.length > 160) {
    throw new Error(`${game.slug}: description length ${description.length}: ${description}`);
  }

  const website = jsonLd("WebSite", {
    name: "ClassroomGames",
    url: canonical,
    description,
    inLanguage: "en"
  });
  const videoGame = jsonLd("VideoGame", {
    name: game.name,
    url: canonical,
    description: `${game.name} is a free ${game.category}. ${game.why}`,
    gamePlatform: ["Web Browser"],
    applicationCategory: "Game",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock"
    }
  });
  const faqPage = jsonLd("FAQPage", {
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a
      }
    }))
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#1A2B3C">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ClassroomGames">
  <meta property="og:locale" content="en_US">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta name="twitter:card" content="summary">
  <link rel="icon" type="image/svg+xml" href="../assets/icons/favicon.svg">
  <link rel="stylesheet" href="../assets/css/style.css?v=${ASSET_VERSION}">

  ${website}

  ${videoGame}

  ${faqPage}
</head>

<body data-page="${game.slug}">
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <header class="site-header">
    <div class="header-inner container">
      <a class="brand" href="../index.html" aria-label="ClassroomGames home">
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
        <a href="../index.html">Home</a>
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
      <h1 id="hero-title">${escapeHtml(game.name)}</h1>
      <p>${escapeHtml(game.why)}</p>
    </section>

    <section class="game-area" id="game-area" aria-label="Play ${game.name}">
      <div class="game-shell">
        <div class="game-toolbar">
          <span class="game-toolbar-label">${escapeHtml(game.name)}</span>
          <button class="fullscreen-button" id="fullscreen-button" type="button">Fullscreen</button>
        </div>
        <div class="game-placeholder" id="game-placeholder" role="status" aria-live="polite">
          <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="20" height="14" rx="7" fill="#2563EB"/><circle cx="8" cy="10" r="1.3" fill="#fff"/><circle cx="12" cy="10" r="1.3" fill="#fff"/><circle cx="16" cy="10" r="1.3" fill="#fff"/><path d="M7 15h10" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>
          <strong>${escapeHtml(game.name)}</strong>
          <p>Loading ${escapeHtml(game.shortName)}. If the game does not appear, refresh the page and try again.</p>
        </div>
        <iframe
          class="game-frame"
          src="${game.embedUrl}"
          title="${escapeHtml(game.name)}"
          width="100%"
          height="540"
          frameborder="0"
          allow="pointer-lock; fullscreen; autoplay; encrypted-media; clipboard-write"
          allowfullscreen
          loading="lazy"
          tabindex="0">
        </iframe>
      </div>
      <p class="game-controls">
        ${escapeHtml(game.controls)} ${escapeHtml(game.mobileControls)}
      </p>
    </section>

    <div class="ad-slot" aria-hidden="true">
      <!-- AdSense Ad Slot: middle banner -->
    </div>

    <article class="content-card" id="content">
      <h2>Play ${escapeHtml(game.name)} at School</h2>
      ${introParagraphs}

      <p>${escapeHtml(game.name)} is part of a growing browser game menu for school. The Games tab always shows the current title, the other live games, and the quickest way to return to the game area. You can switch to another title without closing the page, which makes the whole catalog easier to explore when class time is short.</p>

      <h2>Why ${escapeHtml(game.name)} Is a Good Classroom Game</h2>
      <p>${escapeHtml(game.why)}</p>

      <h3>For Students</h3>
      <p>${escapeHtml(game.students)}</p>

      <h3>For Teachers</h3>
      <p>${escapeHtml(game.teachers)}</p>

      <h2>How to Play ${escapeHtml(game.name)}</h2>
      <p>${escapeHtml(game.howToPlay)}</p>

      <p>A good first session does not need a perfect score. Start with one short round, learn where the controls are, and then decide whether to try a higher goal in the next attempt. This keeps the game easy to stop and gives every student a fair way to measure progress.</p>

      <h3>Desktop Controls</h3>
      <p>${escapeHtml(game.controls)}</p>

      <h3>Mobile Controls</h3>
      <p>${escapeHtml(game.mobileControls)}</p>

      <h3>Classroom Tips</h3>
      <p>${escapeHtml(game.tip)}</p>

      <h2>Is ${escapeHtml(game.name)} Safe at School?</h2>
      <p>${escapeHtml(game.safety)}</p>

      <p>If you use this game with a group, keep the session short and let students know the stopping rule before the timer starts. A clear end time makes the browser break feel optional rather than open-ended, and it gives teachers more control over the transition back to class work.</p>

      <h3>Safe to Play</h3>
      <p>This page embeds ${escapeHtml(game.name)} in the game area. It does not add a download, sign-up form, or personal data request to the classroom site. Students should still stop if the game asks for payment or unusual permissions.</p>

      <h3>School Network Rules</h3>
      <p>This site does not bypass school filters or network policies. Some school networks limit third-party game hosts, so a title that works at home may not open at school. If that happens, refresh the page or choose another game from the menu.</p>

      <h2 id="faq">FAQ About ${escapeHtml(game.name)}</h2>
      ${faqHtml}
    </article>

    <div class="ad-slot" aria-hidden="true">
      <!-- AdSense Ad Slot: bottom banner -->
    </div>
  </main>

  <footer class="site-footer">
    <div class="footer-inner container">
      <nav aria-label="Footer navigation">
        <a href="../index.html">Home</a>
        <a href="#game-area">Play Now</a>
        <a href="#faq">FAQ</a>
      </nav>
      <p>ClassroomGames is an independent browser game page. Access may depend on your school network.</p>
      <p>© 2026 ClassroomGames. All rights reserved.</p>
    </div>
  </footer>

  <script src="../assets/js/games.js?v=${ASSET_VERSION}" defer></script>
  <script src="../assets/js/main.js?v=${ASSET_VERSION}" defer></script>
</body>
</html>
`;
}

function gamesJs() {
  const ordered = [
    { slug: "home", name: "Minecraft Unblocked", url: "/index.html#game-area", page: "home", status: "active" },
    ...ALL_GAME_PAGES.filter((game) => game.slug !== "minecraft")
  ];
  return `window.CLASSROOM_GAMES = [
${ordered.map((game) => `  { name: ${JSON.stringify(game.name)}, url: ${JSON.stringify(game.slug === "home" ? "/index.html#game-area" : `/games/${game.slug}-unblocked.html`)}, page: ${JSON.stringify(game.slug)}, status: ${JSON.stringify(game.status === "active" ? "active" : "live")} },`).join("\n")}
  { name: "Snake Unblocked", url: "/games/snake-unblocked.html", page: "snake", status: "live" },
  { name: "2048 Cupcakes Unblocked", url: "/games/cupcake-2048-unblocked.html", page: "cupcake-2048", status: "live" },
  { name: "Wordle Unblocked", url: "/games/wordle-unblocked.html", page: "wordle", status: "live" },
  { name: "Minesweeper Unblocked", url: "/games/minesweeper-unblocked.html", page: "minesweeper", status: "live" },
  { name: "Tic Tac Toe Unblocked", url: "/games/tic-tac-toe-unblocked.html", page: "tic-tac-toe", status: "live" },
];
`;
}

function sitemapXml() {
  const urls = [
    ["https://classroom-game.com/", "daily", "1.0", true],
    ...ALL_GAME_PAGES.map((game) => [`https://classroom-game.com/games/${game.slug}-unblocked.html`, "weekly", "0.9", false]),
    ["https://classroom-game.com/games/snake-unblocked.html", "weekly", "0.9", false],
    ["https://classroom-game.com/games/cupcake-2048-unblocked.html", "weekly", "0.9", false],
    ["https://classroom-game.com/games/wordle-unblocked.html", "weekly", "0.9", false],
    ["https://classroom-game.com/games/minesweeper-unblocked.html", "weekly", "0.9", false],
    ["https://classroom-game.com/games/tic-tac-toe-unblocked.html", "weekly", "0.9", false]
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, change, priority]) => `  <url>
    <loc>${loc}</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>${change}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
}

mkdirSync(gamesDir, { recursive: true });

const wordCounts = [];
for (const game of ALL_GAME_PAGES) {
  const html = buildPage(game);
  const article = html.match(/<article class="content-card" id="content">([\s\S]*?)<\/article>/)?.[1] || "";
  const words = (article.replace(/<[^>]+>/g, " ").match(/[A-Za-z]+/g) || []).length;
  wordCounts.push([game.slug, words]);
  writeFileSync(path.join(gamesDir, `${game.slug}-unblocked.html`), html, "utf8");
}

writeFileSync(path.join(root, "assets", "js", "games.js"), gamesJs(), "utf8");
writeFileSync(path.join(root, "sitemap.xml"), sitemapXml(), "utf8");

const problems = wordCounts.filter(([, count]) => count < 600);
if (problems.length) {
  throw new Error(`Word count below 600: ${problems.map(([slug, count]) => `${slug}=${count}`).join(", ")}`);
}

console.log(`Generated ${ALL_GAME_PAGES.length} game pages.`);
console.log(`Menu entries: ${1 + 5 + ALL_GAME_PAGES.length}. Sitemap URLs: ${1 + 5 + ALL_GAME_PAGES.length}.`);
console.log(`Lowest article word count: ${Math.min(...wordCounts.map(([, count]) => count))}.`);
