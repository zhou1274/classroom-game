import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://classroom-game.com";

function htmlFiles(dir) {
  const output = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === ".git" || entry === "node_modules") continue;
      output.push(...htmlFiles(full));
    } else if (entry.endsWith(".html")) {
      output.push(full);
    }
  }
  return output;
}

function canonicalFor(file) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  if (relative === "index.html") return `${siteUrl}/`;
  return `${siteUrl}/${relative}`;
}

function meta(content, name) {
  const match = content.match(
    new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*content="([^"]*)"[^>]*>`, "i")
  );
  return match ? match[1] : null;
}

function metaProperty(content, name) {
  const match = content.match(
    new RegExp(`<meta\\s+[^>]*property=["']${name}["'][^>]*content="([^"]*)"[^>]*>`, "i")
  );
  return match ? match[1] : null;
}

function countTags(content, tag) {
  return (content.match(new RegExp(`<${tag}\\b`, "gi")) || []).length;
}

function headings(content) {
  const output = [];
  const regex = /<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = regex.exec(content))) {
    output.push({
      level: Number(match[1][1]),
      text: match[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    });
  }
  return output;
}

function textContent(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function sectionText(html, tag, attribute) {
  const match = html.match(new RegExp(`<${tag}\\b[^>]*${attribute}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? textContent(match[1]) : "";
}

function keywords(html, article = "") {
  const body = textContent(
    article || html.match(/<body[\s\S]*<\/body>/i)?.[0] || html
  );
  const words = body.match(/[A-Za-z]+/g) || [];
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]
    ?.replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "classroom games unblocked";
  const target = h1.toLowerCase();
  const occurrences = body.toLowerCase().split(target).length - 1;
  const termWords = target.split(/\s+/).filter(Boolean).length;
  return {
    words: words.length,
    phrase: occurrences,
    target,
    density: words.length ? (occurrences * termWords / words.length) * 100 : 0
  };
}

function jsons(content) {
  const output = [];
  const regex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(content))) {
    try {
      output.push(JSON.parse(match[1]));
    } catch (error) {
      output.push({ __parseError: error.message });
    }
  }
  return output;
}

function checkEntity(entity, file, issues, required = true) {
  if (required && !entity) {
    issues.push(`${file} - missing required entity`);
  }
}

const rootHtml = readdirSync(root)
  .filter((entry) => entry.endsWith(".html"))
  .map((entry) => path.join(root, entry));
const files = [...rootHtml, ...htmlFiles(path.join(root, "games"))];

const report = [];

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const relative = path.relative(root, file).replace(/\\/g, "/");
  const isGamePage = relative.startsWith("games/");
  const issues = [];
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]?.trim() || "";
  const description = meta(html, "description");
  const canonical = (html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i) || [])[1] || "";
  const ogTitle = metaProperty(html, "og:title");
  const ogDescription = metaProperty(html, "og:description");
  const ogType = metaProperty(html, "og:type");
  const ogUrl = metaProperty(html, "og:url");
  const lang = (html.match(/<html\s+[^>]*lang=["']([^"']+)["']/i) || [])[1] || "";
  const heads = headings(html);
  const h1Count = countTags(html, "h1");
  const h4Count = countTags(html, "h4");
  const parsedJsons = jsons(html);
  const article = sectionText(html, "article", 'class="content-card id="content"') ||
    sectionText(html, "article", 'id="content"');
  const articleWords = (article.match(/[A-Za-z]+/g) || []).length;
  const iframes = [];
  const iframeRegex = /<iframe\b[^>]*>/gi;
  let iframeMatch;
  while ((iframeMatch = iframeRegex.exec(html))) {
    iframes.push(iframeMatch[0]);
  }
  const noIndex = /<meta\s+[^>]*name=["']robots["'][^>]*content=["']noindex[^"']*["'][^>]*>/i.test(html);

  if (lang !== "en") issues.push(`${relative} - html lang should be "en"`);
  if (!title) issues.push(`${relative} - missing <title>`);
  if (title.length < 50 || title.length > 60) {
    issues.push(`${relative} - title length ${title.length} (expected 50-60)`);
  }
  if (!description) issues.push(`${relative} - missing meta description`);
  if (description && (description.length < 150 || description.length > 160)) {
    issues.push(`${relative} - description length ${description.length} (expected 150-160)`);
  }
  if (!canonical) issues.push(`${relative} - missing canonical`);
  if (canonical && canonical !== canonicalFor(file)) {
    issues.push(`${relative} - canonical mismatch: ${canonical}`);
  }
  for (const [name, value] of [
    ["og:title", ogTitle],
    ["og:description", ogDescription],
    ["og:type", ogType],
    ["og:url", ogUrl]
  ]) {
    if (value === null || value === undefined || value === "") {
      issues.push(`${relative} - missing ${name}`);
    }
  }
  if (h1Count !== 1) issues.push(`${relative} - H1 count ${h1Count} (must be exactly 1)`);
  if (h4Count) issues.push(`${relative} - contains ${h4Count} H4 (project forbids H4)`);
  for (let i = 0; i < heads.length; i += 1) {
    const current = heads[i];
    const next = heads[i + 1];
    if (current.level === 2 && next && next.level >= 4 && !heads.slice(i + 1).some((item) => item.level === 3 && item.level > 2)) {
      issues.push(`${relative} - H2 skips to H${next.level}: ${current.text}`);
      break;
    }
    if (current.level === 1 && next && next.level > 2) {
      issues.push(`${relative} - H1 skips to H${next.level}: ${current.text}`);
      break;
    }
  }
  if ((relative === "index.html" || isGamePage) && articleWords > 0 && articleWords < 600) {
    issues.push(`${relative} - article word count ${articleWords} (expected 600+)`);
  }
  for (const iframe of iframes) {
    if (!/\btitle=["'][^"']+["']/i.test(iframe)) issues.push(`${relative} - iframe missing title`);
    if (!/\ballowfullscreen\b/i.test(iframe)) issues.push(`${relative} - iframe missing allowfullscreen`);
    if (!/\bloading=["']lazy["']/i.test(iframe)) issues.push(`${relative} - iframe missing loading=lazy`);
  }
  if (!/Skip to main content/i.test(html)) issues.push(`${relative} - missing skip link`);
  if (!/<a\s+[^>]*href=["']#main-content["']/i.test(html)) issues.push(`${relative} - skip link does not target main content`);
  if (/user-scalable=no|maximum-scale=1/i.test(html)) issues.push(`${relative} - viewport blocks zoom`);

  const parsed = parsedJsons.filter((item) => !item.__parseError);
  const types = parsed.map((item) => item["@type"]);
  const isCompliancePage = /^(privacy-policy|terms|about|contact)\.html$/.test(relative);
  if (relative !== "404.html") {
    checkEntity(types.includes("WebSite"), "WebSite", issues);
    if (!isCompliancePage) {
      checkEntity(types.includes("VideoGame"), "VideoGame", issues);
      checkEntity(types.includes("FAQPage"), "FAQPage", issues);
    }
    if (types.includes("WebSite")) {
      const website = parsed.find((item) => item["@type"] === "WebSite");
      if (website && website.url !== `${siteUrl}/`) {
        issues.push(`${relative} - WebSite schema url should point to homepage, got ${website.url}`);
      }
    }
    if (types.includes("VideoGame")) {
      const videoGame = parsed.find((item) => item["@type"] === "VideoGame");
      if (videoGame && videoGame.url !== canonicalFor(file)) {
        issues.push(`${relative} - VideoGame schema url does not match canonical`);
      }
    }
  }
  if (parsedJsons.some((item) => item.__parseError)) {
    issues.push(`${relative} - invalid JSON-LD`);
  }
  if (relative === "404.html" && !noIndex) issues.push(`${relative} - 404 should be noindex`);
  if (relative !== "404.html" && noIndex) issues.push(`${relative} - indexable page should not be noindex`);
  if (isGamePage) {
    const internalLinks = (html.match(/href="\.\.\/games\//g) || []).length;
    if (internalLinks < 4) {
      issues.push(`${relative} - too few static internal game links (${internalLinks})`);
    }
    if (!/Privacy Policy/i.test(html) || !/Terms of Service/i.test(html) || !/About Us/i.test(html) || !/Contact Us/i.test(html)) {
      issues.push(`${relative} - footer missing Privacy/Terms/About/Contact links`);
    }
    if (!/cookies?/i.test(html)) issues.push(`${relative} - footer/body lacks cookie disclosure`);
  }
  if (relative === "index.html") {
    const internalLinks = (html.match(/href="games\//g) || []).length;
    if (internalLinks < 5) {
      issues.push(`${relative} - too few static internal game links (${internalLinks})`);
    }
  }

  const kws = keywords(html, article);
  report.push({
    file: relative,
    title,
    titleLength: title.length,
    descriptionLength: description?.length || 0,
    h1: h1Count,
    articleWords,
    phrase: kws.phrase,
    keywordText: kws.target,
    density: kws.density,
    jsonLdTypes: types,
    issues
  });
}

const rootFiles = readdirSync(root)
  .filter((entry) => entry.endsWith(".html"))
  .map((entry) => path.join(root, entry));

for (const file of rootFiles) {
  const html = readFileSync(file, "utf8");
  const relative = path.relative(root, file).replace(/\\/g, "/");
  const missingFooter = !/Privacy Policy/i.test(html) ||
    !/Terms of Service/i.test(html) ||
    !/About Us/i.test(html) ||
    !/Contact Us/i.test(html);
  if (missingFooter) {
    report.find((entry) => entry.file === relative)?.issues.push(
      `${relative} - footer missing Privacy/Terms/About/Contact links`
    );
  }
  if (!/cookies?/i.test(html)) {
    report.find((entry) => entry.file === relative)?.issues.push(`${relative} - footer/body lacks cookie disclosure`);
  }
}

const sitemapPath = path.join(root, "sitemap.xml");
const sitemap = readFileSync(sitemapPath, "utf8");
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const duplicateLocs = sitemapLocs.filter((loc, index) => sitemapLocs.indexOf(loc) !== index);
if (!/^<\?xml version="1\.0"/.test(sitemap)) {
  report.push({ file: "sitemap.xml", issues: ["sitemap missing XML declaration"] });
}
if (duplicateLocs.length) {
  report.push({ file: "sitemap.xml", issues: [`duplicate loc: ${duplicateLocs.join(", ")}`] });
}
for (const loc of sitemapLocs) {
  const rel = loc.slice(siteUrl.length + 1) || "index.html";
  const local = rel.endsWith("/") ? path.join(root, "index.html") : path.join(root, rel);
  if (!readFileSync(local, "utf8")) {
    report.push({ file: "sitemap.xml", issues: [`listed file does not exist locally: ${loc}`] });
  }
}

const robots = readFileSync(path.join(root, "robots.txt"), "utf8");
if (!/User-agent:\s*\*/i.test(robots)) report.push({ file: "robots.txt", issues: ["missing User-agent: *"] });
if (!/Allow:\s*\/\s*$/m.test(robots)) report.push({ file: "robots.txt", issues: ["missing Allow: /"] });
if (!/Sitemap:\s*https:\/\/classroom-game\.com\/sitemap\.xml/i.test(robots)) {
  report.push({ file: "robots.txt", issues: ["missing Sitemap directive"] });
}

const css = readFileSync(path.join(root, "assets", "css", "style.css"), "utf8");
const cssIssues = [];
if (!/@media\s*\(max-width:\s*767px\)/i.test(css)) cssIssues.push("missing <=767px breakpoint");
if (!/@media\s*\(max-width:\s*1023px\)/i.test(css)) cssIssues.push("missing <=1023px breakpoint");
if (!/@media\s*\(min-width:\s*1024px\)/i.test(css)) cssIssues.push("missing >=1024px breakpoint");
if (/transition:\s*all/i.test(css)) cssIssues.push("transition: all");
if (/outline:\s*none/i.test(css)) cssIssues.push("outline: none without replacement");
if (/font-family\s*:\s*[^;]*(http|url\s*\()/i.test(css)) cssIssues.push("external font URL in CSS");
if (cssIssues.length) report.push({ file: path.join("assets", "css", "style.css"), issues: cssIssues });

const errorFiles = report.flatMap((entry) => entry.issues.map((issue) => `${entry.file}: ${issue}`));
const warnings = report.flatMap((entry) => {
  if (/^(404|privacy-policy|terms|about|contact)\.html$/.test(entry.file)) return [];
  return entry.density < 3 || entry.density > 5
    ? [`${entry.file}: ${entry.keywordText} density ${entry.density.toFixed(2)}% (outside 3-5%)`]
    : [];
});

console.log(`Audited ${report.length} HTML files.`);
console.log(`Sitemap loc count: ${sitemapLocs.length}.`);
console.log(`Error count: ${errorFiles.length}.`);
if (warnings.length) {
  console.log(`Density warnings: ${warnings.length}`);
  console.log(warnings.slice(0, 10).join("\n"));
}
if (errorFiles.length) {
  console.log(errorFiles.slice(0, 80).join("\n"));
  if (errorFiles.length > 80) console.log(`... and ${errorFiles.length - 80} more`);
}
process.exitCode = errorFiles.length ? 1 : 0;
