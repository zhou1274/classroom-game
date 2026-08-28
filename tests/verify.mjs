import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GAME_PAGES } from "../tools/game-pages-data.mjs";
import { CATALOG_GAME_PAGES } from "../tools/catalog-game-pages-data.mjs";
import { REMAINING_GAME_PAGES } from "../tools/remaining-games-data.mjs";
const ALL_GAME_PAGES = [...GAME_PAGES, ...CATALOG_GAME_PAGES, ...REMAINING_GAME_PAGES];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const passes = [];

const expectedTitle = "Classroom Games Unblocked - Play Free Games Online at School";
const expectedDescription = "Play classroom games unblocked online for free. No download or sign-up needed. Enjoy fast browser games on a Chromebook, laptop, or phone at school. Start now.";
const canonical = "https://classroom-game.com/";
const sitemapUrl = "https://classroom-game.com/sitemap.xml";
const snakeTitle = "Snake Unblocked - Play a Classic Browser Game at School";
const snakeDescription = "Play Snake Unblocked online for free. Guide the snake, eat food, and avoid walls in this classic browser game for school. No download or account needed.";
const snakeCanonical = "https://classroom-game.com/games/snake-unblocked.html";

const requiredFiles = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "assets/css/style.css",
  "assets/js/games.js",
  "assets/js/main.js",
  "assets/icons/favicon.svg",
  "privacy-policy.html",
  "terms.html",
  "about.html",
  "contact.html",
  "assets/games/2048/index.html",
  "assets/games/2048/LICENSE.txt",
  "games/snake-unblocked.html",
  "assets/games/snake/index.html",
  "assets/games/snake/patch/master-loader.js",
  "assets/games/snake/patch/unity-2020.js",
  "assets/games/snake/Build/Snake MLG Edition_3.0.35.4044.data.unityweb",
  "assets/games/snake/Build/Snake MLG Edition_3.0.35.4044.wasm.unityweb",
  "games/cupcake-2048-unblocked.html",
  "assets/games/cupcake-2048/index.html",
  "games/wordle-unblocked.html",
  "assets/games/wordle/index.html",
  "games/minesweeper-unblocked.html",
  "assets/games/minesweeper/index.html",
  "games/tic-tac-toe-unblocked.html",
  "assets/games/tic-tac-toe/index.html"
];

for (const file of requiredFiles) {
  if (existsSync(path.join(root, file))) {
    passes.push(`File exists: ${file}`);
  } else {
    failures.push(`Missing file: ${file}`);
  }
}


for (const game of ALL_GAME_PAGES) {
  const file = "games/" + game.slug + "-unblocked.html";
  if (existsSync(path.join(root, file))) {
    passes.push("File exists: " + file);
  } else {
    failures.push("Missing file: " + file);
  }
}
function readOrEmpty(file) {
  const fullPath = path.join(root, file);
  return existsSync(fullPath) ? readFileSync(fullPath, "utf8") : "";
}

const html = readOrEmpty("index.html");
const snakeHtml = readOrEmpty("games/snake-unblocked.html");
const gamesJs = readOrEmpty("assets/js/games.js");
const mainJs = readOrEmpty("assets/js/main.js");
const css = readOrEmpty("assets/css/style.css");
const robots = readOrEmpty("robots.txt");
const sitemap = readOrEmpty("sitemap.xml");
const notFound = readOrEmpty("404.html");
const favicon = readOrEmpty("assets/icons/favicon.svg");
const gameHtml = readOrEmpty("assets/games/2048/index.html");
const snakeGameHtml = readOrEmpty("assets/games/snake/index.html");
const snakeLoaderJs = readOrEmpty("assets/games/snake/patch/master-loader.js");
const snakeUnityJs = readOrEmpty("assets/games/snake/patch/unity-2020.js");
const snakePokiStub = readOrEmpty("assets/games/snake/patch/poki-sdk.js");
const cupcakeHtml = readOrEmpty("games/cupcake-2048-unblocked.html");
const wordleHtml = readOrEmpty("games/wordle-unblocked.html");
const minesweeperHtml = readOrEmpty("games/minesweeper-unblocked.html");
const ticTacToeHtml = readOrEmpty("games/tic-tac-toe-unblocked.html");
const cupcakeGameHtml = readOrEmpty("assets/games/cupcake-2048/index.html");
const wordleGameHtml = readOrEmpty("assets/games/wordle/index.html");
const minesweeperGameHtml = readOrEmpty("assets/games/minesweeper/index.html");
const ticTacToeGameHtml = readOrEmpty("assets/games/tic-tac-toe/index.html");

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

function articleWordText(page) {
  const match = page.match(/<article class="content-card" id="content">([\s\S]*?)<\/article>/);
  return match ? match[1].replace(/<[^>]+>/g, " ") : "";
}

function articleWordCount(page) {
  return (articleWordText(page).match(/[A-Za-z]+/g) || []).length;
}

function assertJsonLd(page, label) {
  const blocks = page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  check(blocks.length === 3, `${label}: three JSON-LD blocks (got ${blocks.length})`);
  blocks.forEach((block, index) => {
    const payload = block.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
    try {
      JSON.parse(payload);
      passes.push(`${label}: JSON-LD block ${index + 1} parses`);
    } catch (error) {
      failures.push(`${label}: JSON-LD block ${index + 1} invalid: ${error.message}`);
    }
  });
}

check(/<html lang="en">/i.test(html), "home html lang=en");
check(html.includes(`<title>${expectedTitle}</title>`), "home title exact");
check(html.includes(`<meta name="description" content="${expectedDescription}">`), "home description exact");
check(html.includes(`<link rel="canonical" href="${canonical}">`), "home canonical");
check(html.includes(`<meta property="og:url" content="${canonical}">`), "home og:url");
check(html.includes('<body data-page="home">'), "home body data-page");
check(count(html, /<h1\b/gi) === 1, "home exactly one H1");
check(/<h1[^>]*>\s*Classroom Games Unblocked\s*<\/h1>/i.test(html), "home H1 text exact");
check(count(html, /<h4\b/gi) === 0, "home no H4");
check(html.includes("Play Classroom Games Unblocked Online"), "home H2 content heading");
check(html.includes("What Are Classroom Games Unblocked?"), "home H2 explainer heading");
check(html.includes("Best Classroom Games Unblocked for Class"), "home H2 best games heading");
check(html.includes("How to Play Classroom Games Unblocked at School"), "home H2 how-to heading");
check(html.includes("FAQ About Classroom Games Unblocked"), "home H2 FAQ heading");
check(html.includes("Minecraft Unblocked"), "home mentions Minecraft Unblocked");
check(html.includes('class="game-frame'), "home game iframe uses game-frame class");
check(html.includes('src="https://minecraft-free-online.github.io/minecraft-github/"'), "home game iframe Minecraft source");
check(html.includes('class="game-controls"'), "home game controls helper present");
check(html.includes("Use WASD to move, the mouse to look"), "home Minecraft controls copy present");
check(html.includes('class="skip-link"'), "home skip link present");
check(html.includes('id="game-placeholder"'), "home game placeholder present");
check(!html.includes("Once the featured game is confirmed"), "home no developer placeholder note");
check(mainJs.includes("placeholder.hidden = true"), "main.js hides placeholder after game loads");
check(mainJs.includes("hidePlaceholder(); focusGameFrame();"), "main.js placeholder fallback timer");
check(mainJs.includes("focusGameFrame"), "main.js focuses game frame after load");
check(mainJs.includes("gameFrame.focus()"), "main.js calls iframe focus");
check(html.includes('tabindex="0"'), "home iframe is keyboard focusable");
check(css.includes("pointer-events: none;"), "CSS placeholder never blocks clicks");
check(css.includes("max-width: 900px"), "CSS game area uses full main width");
check(css.includes("height: 540px"), "CSS desktop game height 600px");
check(css.includes("height: 450px"), "CSS mobile game height 480px");
check(html.includes('height="540"'), "home iframe height 540");
check(html.includes("assets/css/style.css?v=20260828n"), "home versioned stylesheet");
check(html.includes("assets/js/games.js?v=20260828n"), "home versioned games script");
check(html.includes('allow="pointer-lock; fullscreen; autoplay; encrypted-media; clipboard-write"'), "home iframe pointer lock permission");
check(!mainJs.includes("Now Playing"), "no false playing claim");
check(mainJs.includes("document.body.dataset.page"), "main.js reads current page");
check(mainJs.includes("game.page === currentPage"), "main.js marks current game page");
check(mainJs.includes('badge.textContent = "This Page"'), "main.js this page badge label");
check(mainJs.includes('link.setAttribute("aria-label"'), "main.js placeholder uses aria-label");
check(!mainJs.includes("aria-disabled"), "main.js no conflicting disabled state");
check(!/<img\b/i.test(html), "home no raster images");
check(!html.includes("adsbygoogle"), "home no AdSense script");
check(!/fonts\.googleapis\.com|fonts\.gstatic\.com|@font-face/i.test(html), "home no external fonts");
check(!html.includes("src=\"javascript:"), "home no javascript URLs");

const homeArticleWords = articleWordCount(html);
check(homeArticleWords >= 600, `home SEO article words >=600 (got ${homeArticleWords})`);
const homeCoreCount = (articleWordText(html).match(/classroom games unblocked/gi) || []).length;
check(homeCoreCount >= 10 && homeCoreCount <= 16, `home core phrase 10-16 times (got ${homeCoreCount})`);

for (const comment of [
  "<!-- AdSense Ad Slot: top banner -->",
  "<!-- AdSense Ad Slot: middle banner -->",
  "<!-- AdSense Ad Slot: bottom banner -->"
]) {
  check(html.includes(comment), `home ad comment: ${comment}`);
}

const statuses = [...gamesJs.matchAll(/status:\s*"(active|live|coming-soon)"/g)].map((match) => match[1]);
check(statuses.length === 422, "422 menu entries (got " + statuses.length + ")");
check(statuses[0] === "active", "first game is 2048 active");
check(statuses.slice(1).every((status) => status === "live"), "all other entries are live");
check(!statuses.includes("coming-soon"), "no coming-soon entries in menu");
const menuNames = [...gamesJs.matchAll(/name: "([^"]+)"/g)].map((match) => match[1]);
check(menuNames[0] === "Minecraft Unblocked", "menu first game is Minecraft");
check(menuNames[1] === "1v1 LOL Unblocked", "menu second game is 1v1 LOL");
check(menuNames[2] === "Moto X3M Unblocked", "menu third game is Moto X3M");
check(menuNames.slice(0, 28).includes("Hill Climb Racing Unblocked"), "popular racing game is high in menu");
check(gamesJs.includes('page: "home"'), "games.js marks home page");
check(gamesJs.includes('page: "snake"'), "games.js marks snake page");
check(gamesJs.includes("/games/snake-unblocked.html"), "games.js uses Snake page URL");
check(!gamesJs.includes("javascript:void"), "games.js no javascript:void");
check(mainJs.includes("preventDefault"), "main.js prevents placeholder navigation");
check(mainJs.includes("aria-current"), "main.js marks current tab");
check(mainJs.includes("requestFullscreen"), "main.js supports fullscreen");

check(/<html lang="en">/i.test(snakeHtml), "snake html lang=en");
check(snakeHtml.includes(`<title>${snakeTitle}</title>`), "snake title exact");
check(snakeHtml.includes(`<meta name="description" content="${snakeDescription}">`), "snake description exact");
check(snakeHtml.includes(`<link rel="canonical" href="${snakeCanonical}">`), "snake canonical");
check(snakeHtml.includes('<body data-page="snake">'), "snake body data-page");
check(count(snakeHtml, /<h1\b/gi) === 1, "snake exactly one H1");
check(/<h1[^>]*>\s*Snake Unblocked\s*<\/h1>/i.test(snakeHtml), "snake H1 text exact");
check(count(snakeHtml, /<h4\b/gi) === 0, "snake no H4");
check(snakeHtml.includes("Why Snake Is a Good Classroom Game"), "snake teacher/student heading");
check(snakeHtml.includes("FAQ About Snake Unblocked"), "snake FAQ heading");
check(snakeHtml.includes('src="../assets/games/snake/index.html"'), "snake iframe local source");
check(snakeHtml.includes('class="game-frame'), "snake iframe uses game-frame class");
check(snakeHtml.includes('class="game-controls"'), "snake controls helper present");
check(snakeHtml.includes('class="skip-link"'), "snake skip link present");
check(snakeHtml.includes('id="game-placeholder"'), "snake game placeholder present");
check(!/<img\b/i.test(snakeHtml), "snake no raster images");
check(!snakeHtml.includes("adsbygoogle"), "snake no AdSense script");
check(!/fonts\.googleapis\.com|fonts\.gstatic\.com|@font-face/i.test(snakeHtml), "snake no external fonts");
check(!snakeHtml.includes("src=\"javascript:"), "snake no javascript URLs");
const snakeArticleWords = articleWordCount(snakeHtml);
check(snakeArticleWords >= 600, `snake SEO article words >=600 (got ${snakeArticleWords})`);

for (const comment of [
  "<!-- AdSense Ad Slot: top banner -->",
  "<!-- AdSense Ad Slot: middle banner -->",
  "<!-- AdSense Ad Slot: bottom banner -->"
]) {
  check(snakeHtml.includes(comment), `snake ad comment: ${comment}`);
}

assertJsonLd(html, "home");
assertJsonLd(snakeHtml, "snake");

const newPages = [
  {
    html: cupcakeHtml,
    title: "2048 Cupcakes Unblocked - Sweet School Number Puzzle",
    canonical: "https://classroom-game.com/games/cupcake-2048-unblocked.html",
    h1: "2048 Cupcakes Unblocked",
    page: "cupcake-2048",
    iframe: "../assets/games/cupcake-2048/index.html",
    label: "cupcake"
  },
  {
    html: wordleHtml,
    title: "Wordle Unblocked - Play the Daily Word Game at School",
    canonical: "https://classroom-game.com/games/wordle-unblocked.html",
    h1: "Wordle Unblocked",
    page: "wordle",
    iframe: "../assets/games/wordle/index.html",
    label: "wordle"
  },
  {
    html: minesweeperHtml,
    title: "Minesweeper Unblocked - Play the Classic Puzzle at School",
    canonical: "https://classroom-game.com/games/minesweeper-unblocked.html",
    h1: "Minesweeper Unblocked",
    page: "minesweeper",
    iframe: "../assets/games/minesweeper/index.html",
    label: "minesweeper"
  },
  {
    html: ticTacToeHtml,
    title: "Tic Tac Toe Unblocked - Play XOXO Online at School",
    canonical: "https://classroom-game.com/games/tic-tac-toe-unblocked.html",
    h1: "Tic Tac Toe Unblocked",
    page: "tic-tac-toe",
    iframe: "../assets/games/tic-tac-toe/index.html",
    label: "tic-tac-toe"
  }
];

for (const pageData of newPages) {
  const name = pageData.label;
  check(/<html lang="en">/i.test(pageData.html), `${name} html lang=en`);
  check(pageData.html.includes(`<title>${pageData.title}</title>`), `${name} title exact`);
  check(pageData.html.includes(`<link rel="canonical" href="${pageData.canonical}">`), `${name} canonical`);
  check(count(pageData.html, /<h1\b/gi) === 1, `${name} exactly one H1`);
  check(pageData.html.includes(pageData.h1), `${name} H1 text`);
  check(count(pageData.html, /<h4\b/gi) === 0, `${name} no H4`);
  check(pageData.html.includes(`<body data-page="${pageData.page}">`), `${name} body data-page`);
  check(pageData.html.includes(`src="${pageData.iframe}"`), `${name} local iframe`);
  check(pageData.html.includes('class="game-frame'), `${name} game frame class`);
  check(pageData.html.includes('class="game-controls"'), `${name} controls helper`);
  check(pageData.html.includes('id="faq"'), `${name} FAQ anchor`);
  check(articleWordCount(pageData.html) >= 600, `${name} SEO article words >=600`);
  assertJsonLd(pageData.html, name);
}

for (const [gameName, gameHtml] of [
  ["cupcake embed", cupcakeGameHtml],
  ["wordle embed", wordleGameHtml],
  ["minesweeper embed", minesweeperGameHtml],
  ["tic tac toe embed", ticTacToeGameHtml]
]) {
  check(gameHtml.includes("noindex"), `${gameName} noindex`);
  check(!/src="https?:\/\//i.test(gameHtml), `${gameName} no remote script`);
}

check(cupcakeGameHtml.includes("2048 Cupcakes"), "cupcake embed title");
check(wordleGameHtml.includes("Wordle"), "wordle embed title");
check(minesweeperGameHtml.includes("Minesweeper"), "minesweeper embed title");
check(ticTacToeGameHtml.includes("Tic Tac Toe"), "tic tac toe embed title");

check(gameHtml.includes('content="noindex"'), "2048 embed noindex");
check(gameHtml.includes("MIT License"), "2048 embed license notice");
check(snakeGameHtml.includes('content="noindex, follow"'), "snake embed noindex");
check(snakeGameHtml.includes("Source: jasongamesdev.github.io/snake.io"), "snake embed source comment");
check(snakeLoaderJs.includes("master-loader.js"), "snake loader is local");
check(snakePokiStub.includes("isAdBlocked"), "snake Poki stub handles SDK");

const forbiddenPatterns = [
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "@import",
  "fetch(",
  "XMLHttpRequest",
  "WebSocket(",
  "new Function",
  "eval(",
  "document.cookie"
];
for (const pattern of forbiddenPatterns) {
  check(!snakeGameHtml.includes(pattern), `snake embed no forbidden pattern: ${pattern}`);
  check(!snakeLoaderJs.includes(pattern), `snake loader no forbidden pattern: ${pattern}`);
}
check(snakeLoaderJs.includes("document.body.appendChild"), "snake loads local scripts");
check(!/src="https?:\/\//i.test(snakeGameHtml), "snake no remote script source");
check(!/href="https?:\/\//i.test(snakeGameHtml), "snake no remote stylesheet source");

for (const rule of [
  "padding-left: 292px",
  "width: 260px",
  "max-width: 960px",
  "height: 540px",
  "height: 450px",
  "overflow-x: auto",
  "min-height: 56px",
  "min-width: 150px",
  "min-height: 44px",
  "min-height: 100vh",
  ".game-placeholder",
  ".game-controls",
  ".skip-link",
  "scroll-behavior: smooth",
  "linear-gradient",
  "line-height: 1.75",
  "prefers-reduced-motion"
]) {
  check(css.includes(rule), `CSS rule: ${rule}`);
}

check(Buffer.byteLength(css, "utf8") < 25 * 1024, "CSS under 25 KB");
check(Buffer.byteLength(gamesJs, "utf8") + Buffer.byteLength(mainJs, "utf8") < 80 * 1024, "JS combined under 80 KB");
check(Buffer.byteLength(favicon, "utf8") < 2 * 1024, "favicon under 2 KB");

check(robots.includes(`Sitemap: ${sitemapUrl}`), "robots Sitemap");
check(sitemap.includes(`<loc>${canonical}</loc>`), "sitemap home loc");
check(sitemap.includes(`<loc>${snakeCanonical}</loc>`), "sitemap snake loc");
check(sitemap.includes("<lastmod>2026-08-28</lastmod>"), "sitemap lastmod");
check(sitemap.includes("<changefreq>daily</changefreq>"), "sitemap home changefreq");
check(sitemap.includes("<changefreq>weekly</changefreq>"), "sitemap snake changefreq");
check(sitemap.includes("<priority>1.0</priority>"), "sitemap home priority");
check(sitemap.includes("<priority>0.9</priority>"), "sitemap snake priority");
check(notFound.includes('href="games/snake-unblocked.html"'), "404 Snake real link");
check(notFound.includes('href="games/minecraft-unblocked.html"'), "404 Minecraft real link");
for (const game of ["2048 Unblocked", "Snake Unblocked", "Minecraft Unblocked", "Tetris Unblocked", "Chess Unblocked", "Math Games Unblocked"]) {
  check(notFound.includes(game), "404 link: " + game);
}


for (const game of ALL_GAME_PAGES) {
  const url = "https://classroom-game.com/games/" + game.slug + "-unblocked.html";
  check(sitemap.includes("<loc>" + url + "</loc>"), "sitemap " + game.slug);
}

if (failures.length) {
  console.error(`FAIL (${failures.length} checks failed)`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log(`PASS (${passes.length} checks passed)`);
}
