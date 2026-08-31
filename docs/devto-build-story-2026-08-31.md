# 发布说明（不计入正文）
- 用途：同步到 dev.to，并作为站内博客内容的一部分。
- 发布到 dev.to 时：在 canonical URL 字段填你站上的原文章节 `https://classroom-game.com/how-i-built-400-plus-game-static-site.html`。
- 若原文尚未发布，先在你站上发一版，再同步 dev.to 并设 canonical，避免重复内容。

---

# How I Built a 400+ Game Static Site for Schools (No Framework, No Build Step)

I wanted a free, instant game site that a student could open on a school Chromebook and play in seconds — no download, no signup, nothing for IT to install. The simplest way to get there was to build it as a plain static site with zero frameworks and zero build step. Here's how it works and why I made those choices.

You can see the live result at [classroom-game.com](https://classroom-game.com) — free browser games for classrooms. The rest of this post is about how it was built.

## The core constraint

The main constraint was *school computers*. That means Chromebooks, locked-down networks, and often slow connections. So the site had to be:

- lightweight (fast on modest hardware)
- fully browser-based (nothing to install)
- responsive (phone, tablet, laptop)
- easy to host and cheap to run

That pushed me toward a plain static site: HTML, CSS, and vanilla JavaScript. No React, no Next.js, no bundler, no server.

## The big idea: embed games, don't rebuild them

A big part of keeping the site lightweight is that I don't host or reimplement the games. Each game is loaded in an `<iframe>` pointing to its own hosted URL.

```html
<iframe
  class="game-frame"
  src="https://example-host/game"
  title="2048 Classic"
  width="100%"
  height="540"
  frameborder="0"
  allow="pointer-lock; fullscreen; autoplay; encrypted-media; clipboard-write"
  allowfullscreen
  loading="lazy"
  tabindex="0">
</iframe>
```

This means the game code lives elsewhere, and my page just provides a clean, consistent frame around it. The `<iframe>` gets lazy-loaded, and the surrounding layout stays small. For a real production launch, you'd want to verify each source's embed terms or use an official embed from a licensed game platform — but architecturally, iframes keep the site fast and cheap.

## Generating hundreds of pages from data

The tricky part was scale. I didn't want to hand-write hundreds of near-identical pages. So I keep the game catalog as data and generate the pages with one script.

```js
// tools/generate_game_pages.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { GAME_PAGES } from "./game-pages-data.mjs";
import { CATALOG_GAME_PAGES } from "./catalog-game-pages-data.mjs";
import { REMAINING_GAME_PAGES } from "./remaining-games-data.mjs";

const ASSET_VERSION = "20260828p";
```

Each game is just an object:

```js
{
  slug: "2048-classic",
  name: "2048 Classic",
  embedUrl: "https://example-host/game"
}
```

The script orders the games by a priority list, then renders a page for each one and writes it to the `games/` directory. Re-run the script and the whole site regenerates.

One nice detail: the asset version constant.

```js
<link rel="stylesheet" href="../assets/css/style.css?v=20260828p">
```

Every CSS/JS reference is suffixed with `?v=20260828p`, so when I update assets I bump the constant and visitors get the new files instead of a stale cache.

## The layout

The site uses a two-column layout: a left sidebar listing the games, and a larger main area on the right where the game loads. It's the kind of clean, predictable layout that works for a "pick a game and play" flow.

On mobile the sidebar collapses so it doesn't cover the game. Keeping that simple and predictable was more important than anything fancy.

## SEO as a first-class concern

A game site lives on search traffic, so SEO wasn't an afterthought. Every generated page gets:

- a unique `<title>` and `<meta name="description">`
- a self-referencing `<link rel="canonical">`
- Open Graph tags (`og:title`, `og:description`, `og:type`, `og:url`)
- `robots` meta set to `index, follow`
- structured data via JSON-LD (`WebSite`, plus `VideoGame` for the game area and `FAQPage` for the FAQ)
- one `<h1>` per page, with a clean `H2`/`H3` hierarchy

The site also ships a `robots.txt` that allows all crawlers and declares `sitemap.xml`, and a `sitemap.xml` that lists every indexable URL.

```text
User-agent: *
Allow: /

Sitemap: https://classroom-game.com/sitemap.xml
```

## Performance and analytics

Since everything is static, performance is easy. No heavy scripts, no external font library, no big images. Google Analytics is loaded with `async` so it doesn't block rendering, and it sits right after the `<title>` in the head. Because the analytics and the game frame are independent, the analytics script never delays the game.

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Deployment

The whole thing is a folder of static files, so deploying is trivial. I serve it from a static host and put Cloudflare in front for DNS and caching. No server to maintain, no build pipeline, no database.

## What's next

The catalog grows over time, so the main workflow is "add a game to the data + re-run the generator." Beyond that, I'd like to improve internal linking between games, make the game pages richer, and eventually add more focused content around the games to help teachers find what they need.

Building it this way kept the site fast, cheap, and easy to maintain — and let me focus on the thing that actually matters: giving a student a game they can play in the next ten seconds.
