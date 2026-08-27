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
check(html.includes('class="skip-link"'), "skip link present");
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
  "height: 600px",
  "overflow-x: auto",
  "min-height: 56px",
  "min-width: 150px",
  "min-height: 44px",
  "min-height: 100vh",
  ".game-placeholder",
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
