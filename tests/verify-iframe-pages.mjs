import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GAME_PAGES } from "../tools/game-pages-data.mjs";
import { CATALOG_GAME_PAGES } from "../tools/catalog-game-pages-data.mjs";
import { REMAINING_GAME_PAGES } from "../tools/remaining-games-data.mjs";
const ALL_GAME_PAGES = [...GAME_PAGES, ...CATALOG_GAME_PAGES, ...REMAINING_GAME_PAGES];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
let passes = 0;

function check(condition, label) {
  if (condition) {
    passes += 1;
  } else {
    failures.push(label);
  }
}

function count(text, pattern) {
  return (text.match(pattern) || []).length;
}

function articleWordCount(html) {
  const article = html.match(/<article class="content-card" id="content">([\s\S]*?)<\/article>/);
  return article ? (article[1].replace(/<[^>]+>/g, " ").match(/[A-Za-z]+/g) || []).length : 0;
}

const menu = readFileSync(path.join(root, "assets/js/games.js"), "utf8");
const sitemap = readFileSync(path.join(root, "sitemap.xml"), "utf8");

for (const game of ALL_GAME_PAGES) {
  const label = game.slug;
  const file = path.join(root, "games", `${game.slug}-unblocked.html`);
  check(existsSync(file), `${label}: file exists`);
  if (!existsSync(file)) continue;

  const html = readFileSync(file, "utf8");
  const canonical = `https://classroom-game.com/games/${game.slug}-unblocked.html`;
  const actualTitle = (html.match(/<title>(.*?)<\/title>/) || [])[1] || "";
  const description = (html.match(/<meta name="description" content="([^"]*)">/) || [])[1] || "";

  check(/<html lang="en">/i.test(html), `${label}: html lang=en`);
  check(html.includes(`<meta name="robots" content="index, follow">`), `${label}: indexed`);
  check(actualTitle.startsWith(game.name + " - "), `${label}: title based on game name`);
  check(actualTitle.length >= 50 && actualTitle.length <= 60, `${label}: title length ${actualTitle.length}`);
  check(description.length >= 150 && description.length <= 160, `${label}: description length ${description.length}`);
  check(html.includes(`<link rel="canonical" href="${canonical}">`), `${label}: canonical`);
  check(html.includes(`<meta property="og:url" content="${canonical}">`), `${label}: og:url`);
  check(html.includes(`<meta property="og:title" content="${actualTitle}">`), `${label}: og:title`);
  check(html.includes(`<body data-page="${game.slug}">`), `${label}: body data-page`);
  check(count(html, /<h1\b/gi) === 1, `${label}: one H1`);
  check(count(html, /<h4\b/gi) === 0, `${label}: no H4`);

  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  check(blocks.length === 3, `${label}: three JSON-LD blocks (got ${blocks.length})`);
  const parsedBlocks = blocks.map((block) => {
    try {
      return JSON.parse(block.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, ""));
    } catch (error) {
      failures.push(`${label}: JSON-LD parse error ${error.message}`);
      return {};
    }
  });
  const types = parsedBlocks.map((item) => item["@type"]);
  check(types[0] === "WebSite" && types[1] === "VideoGame" && types[2] === "FAQPage", `${label}: JSON-LD types`);
  const faqSchema = parsedBlocks.find((item) => item["@type"] === "FAQPage");
  const faqSection = (html.match(/<h2 id="faq">([\s\S]*?)<div class="ad-slot"/) || [])[1] || "";
  const visibleFaqCount = count(faqSection, /<h3\b/gi);
  const schemaFaqCount = faqSchema?.mainEntity?.length || 0;
  check(schemaFaqCount >= 4 && schemaFaqCount <= 6, `${label}: FAQ schema count ${schemaFaqCount}`);
  check(visibleFaqCount === schemaFaqCount, `${label}: visible FAQ ${visibleFaqCount} matches schema ${schemaFaqCount}`);

  const iframe = (html.match(/<iframe[\s\S]*?class="game-frame"[\s\S]*?src="([^"]+)"/) || [])[1] || "";
  check(iframe === game.embedUrl, `${label}: iframe source exact`);
  check(/^https:\/\//.test(iframe), `${label}: iframe is remote HTTPS`);
  check(html.includes('loading="lazy"'), `${label}: iframe lazy loading`);
  check(html.includes('class="game-controls"'), `${label}: controls helper`);
  check(html.includes('id="game-placeholder"'), `${label}: game placeholder`);
  check(html.includes('class="skip-link"'), `${label}: skip link`);

  for (const comment of [
    "<!-- AdSense Ad Slot: top banner -->",
    "<!-- AdSense Ad Slot: middle banner -->",
    "<!-- AdSense Ad Slot: bottom banner -->"
  ]) {
    check(html.includes(comment), `${label}: ad comment ${comment}`);
  }

  const words = articleWordCount(html);
  check(words >= 600, `${label}: article words ${words}`);
  check(!/<img\b/i.test(html), `${label}: no raster images`);
  check(!html.includes("adsbygoogle"), `${label}: no AdSense script`);
  check(!/fonts\.googleapis\.com|fonts\.gstatic\.com|@font-face/i.test(html), `${label}: no external fonts`);
  check(!html.includes("javascript:"), `${label}: no javascript URLs`);
  check(!html.includes("aggregateRating"), `${label}: no fake aggregateRating`);
  check(menu.includes(`page: "${game.slug}"`) && menu.includes(`status: "live"`), `${label}: menu live entry`);
  check(menu.includes(`/games/${game.slug}-unblocked.html`), `${label}: menu URL`);
  check(sitemap.includes(`<loc>${canonical}</loc>`), `${label}: sitemap URL`);
}

if (failures.length) {
  console.error(`FAIL (${failures.length} checks failed, ${passes} passed)`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log(`PASS (${passes} checks passed for ${ALL_GAME_PAGES.length} iframe game pages)`);
}
