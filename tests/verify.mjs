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
  "assets/games/2048/index.html",
  "assets/games/2048/LICENSE.txt",
  "games/snake-unblocked.html",
  "assets/games/snake/index.html",
  "assets/games/snake/embed.css",
  "assets/games/snake/CHANGES.md",
  "assets/games/snake/UPSTREAM_README.md"
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
const snakeGameCss = readOrEmpty("assets/games/snake/embed.css");
const snakeMainJs = readOrEmpty("assets/games/snake/main.js");

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
check(html.includes("Best Unblocked Games for Classroom"), "home H2 best games heading");
check(html.includes("How to Play Unblocked Games at School"), "home H2 how-to heading");
check(html.includes("FAQ About Classroom Games Unblocked"), "home H2 FAQ heading");
check(html.includes("Snake Unblocked"), "home mentions Snake Unblocked");
check(html.includes('class="game-frame"'), "home game iframe uses game-frame class");
check(html.includes('src="assets/games/2048/index.html"'), "home game iframe local 2048");
check(html.includes('class="game-controls"'), "home game controls helper present");
check(html.includes("Use arrow keys or swipe to move."), "home 2048 controls copy present");
check(html.includes('class="skip-link"'), "home skip link present");
check(html.includes('id="game-placeholder"'), "home game placeholder present");
check(!html.includes("Once the featured game is confirmed"), "home no developer placeholder note");
check(mainJs.includes("placeholder.hidden = true"), "main.js hides placeholder after game loads");
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
check(homeCoreCount >= 5 && homeCoreCount <= 8, `home core phrase 5-8 times (got ${homeCoreCount})`);

for (const comment of [
  "<!-- AdSense Ad Slot: top banner -->",
  "<!-- AdSense Ad Slot: middle banner -->",
  "<!-- AdSense Ad Slot: bottom banner -->"
]) {
  check(html.includes(comment), `home ad comment: ${comment}`);
}

const statuses = [...gamesJs.matchAll(/status:\s*"(active|coming-soon|live)"/g)].map((match) => match[1]);
check(statuses.length === 7, `seven game entries (got ${statuses.length})`);
check(statuses[0] === "active", "first game is 2048 active");
check(statuses[1] === "live", "second game is Snake live");
check(statuses.slice(2).every((status) => status === "coming-soon"), "remaining entries are coming soon");
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
check(snakeHtml.includes('class="game-frame"'), "snake iframe uses game-frame class");
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

check(gameHtml.includes('content="noindex"'), "2048 embed noindex");
check(gameHtml.includes("MIT License"), "2048 embed license notice");
check(snakeGameHtml.includes('content="noindex, follow"'), "snake embed noindex");
check(snakeGameHtml.includes('href="../../icons/favicon.svg"'), "snake embed favicon relative");
check(snakeGameHtml.includes("Source: https://github.com/xosg/WebGames"), "snake embed source comment");
check(snakeGameHtml.includes("MIT License"), "snake embed license statement");
check(snakeGameCss.includes("aspect-ratio"), "snake embed responsive canvas");

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
  check(!snakeGameCss.includes(pattern), `snake embed CSS no forbidden pattern: ${pattern}`);
  check(!snakeMainJs.includes(pattern), `snake game no forbidden pattern: ${pattern}`);
}
check(snakeMainJs.includes("localStorage"), "snake uses local high score storage");
check(!/src="https?:\/\//i.test(snakeGameHtml), "snake no remote script source");
check(!/href="https?:\/\//i.test(snakeGameHtml), "snake no remote stylesheet source");

for (const rule of [
  "padding-left: 292px",
  "width: 260px",
  "max-width: 960px",
  "height: 680px",
  "height: 520px",
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
check(Buffer.byteLength(gamesJs, "utf8") + Buffer.byteLength(mainJs, "utf8") < 20 * 1024, "JS combined under 20 KB");
check(Buffer.byteLength(favicon, "utf8") < 2 * 1024, "favicon under 2 KB");

check(robots.includes(`Sitemap: ${sitemapUrl}`), "robots Sitemap");
check(sitemap.includes(`<loc>${canonical}</loc>`), "sitemap home loc");
check(sitemap.includes(`<loc>${snakeCanonical}</loc>`), "sitemap snake loc");
check(sitemap.includes("<lastmod>2026-08-27</lastmod>"), "sitemap lastmod");
check(sitemap.includes("<changefreq>daily</changefreq>"), "sitemap home changefreq");
check(sitemap.includes("<changefreq>weekly</changefreq>"), "sitemap snake changefreq");
check(sitemap.includes("<priority>1.0</priority>"), "sitemap home priority");
check(sitemap.includes("<priority>0.9</priority>"), "sitemap snake priority");
check(notFound.includes("noindex, follow"), "404 noindex");
check(notFound.includes("Back to Home"), "404 home link");
check(notFound.includes('href="games/snake-unblocked.html"'), "404 Snake real link");
for (const game of ["2048 Unblocked", "Snake Unblocked", "Tetris Unblocked", "Wordle Unblocked", "Math Games Unblocked", "Puzzle Games Unblocked"]) {
  check(notFound.includes(game), `404 link: ${game}`);
}

if (failures.length) {
  console.error(`FAIL (${failures.length} checks failed)`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log(`PASS (${passes.length} checks passed)`);
}
