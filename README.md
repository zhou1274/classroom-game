# Classroom Games Unblocked

**Free browser games for classrooms and school computers.**

ClassroomGames is a free, lightweight browser game hub for students and teachers. Open the site, pick a game, and play in seconds — no download, no signup, no account. It's built for school networks, Chromebooks, and classroom time.

Live site: [https://classroom-game.com](https://classroom-game.com)

---

## What it is

A single-page-style static site with a left game list and a main game area, plus 400+ dedicated game pages. It's free, fast, and designed for school use:

- **No install, no signup, no data collection for kids**
- **400+ browser games**, grouped by type (classics, puzzles, math, word, arcade)
- **Works on Chromebooks and school-issued laptops**
- Clean, quiet, and easy to pause for classroom routines
- Target keyword: `classroom games unblocked`

## Features

- Static-only front end (HTML + CSS + vanilla JS), no framework, no build step
- Data-driven game catalog → hundreds of pages generated with a single script
- Games embedded via `<iframe>` from their own hosted URLs; a few lightweight games are self-hosted
- Per-page SEO: unique titles/descriptions, self-referencing canonical, Open Graph, JSON-LD (`WebSite` / `VideoGame` / `FAQPage` / `BlogPosting`), single `H1`
- `robots.txt` + `sitemap.xml` for crawlers
- Google Analytics 4 (`G-RM24028WLP`) on every page
- Google AdSense ready (auto-ads script sitewide + `ads.txt`)
- Responsive layout, accessibility (`skip-link`, semantic HTML), security headers via Caddy
- Compliance & content pages (Privacy Policy, Terms, About, Contact, 404)

## Tech stack

| Layer | Used |
| --- | --- |
| Front end | HTML5, CSS3, vanilla JavaScript |
| Pages | Static `.html`, generated game pages |
| Game embedding | `<iframe>` (external hosted games) + self-hosted HTML5 games |
| Analytics | Google Analytics 4 |
| Ads | Google AdSense (auto ads) |
| SEO | canonical, Open Graph, JSON-LD, sitemap, robots |
| Hosting | Railway (Docker + Caddy), Cloudflare DNS/SSL; also Vercel-ready |

## Project structure

```
.
├── index.html                 # Homepage (game list + game area)
├── *.html                     # Blog / compliance / about / contact / 404 / build story
├── games/                     # 400+ generated game pages (one per game)
├── assets/
│   ├── css/ js/ icons/        # Site assets & styling
│   ├── brand/                 # Logo (classroom-games-logo.png)
│   ├── ph-launch/             # Product Hunt launch screenshots
│   └── games/                 # Self-hosted HTML5 games (snake, wordle, 2048, …)
├── tools/
│   ├── generate_game_pages.mjs# Generates every /games/*.html from catalog data
│   ├── game-pages-data.mjs     # Game catalog (slug, name, embedUrl)
│   ├── catalog-game-pages-data.mjs
│   ├── remaining-games-data.mjs
│   └── audit_seo.mjs           # SEO audit script
├── tests/                     # Verification / visual / SEO check scripts
├── docs/                      # SEO, AdSense, GA4, deployment, link-building guides
├── ads.txt                    # AdSense publisher declaration
├── robots.txt                 # Crawler rules + sitemap
├── sitemap.xml                # All indexable URLs
├── Dockerfile                 # Caddy static server (Railway)
└── Caddyfile                  # gzip, security headers, 404, port config
```

## Local dev

The site is static — just serve the folder:

```bash
# any static server works, e.g.
npx serve .
# or
python -m http.server 8000
```

Then open `http://localhost:8000`. Some games load from external iframes, so an internet connection is needed for those.

## Adding or regenerating games

The game catalog is data, not hand-written pages. Each game is an object in a data module:

```js
{ slug: "2048-classic", name: "2048 Classic", embedUrl: "https://example-host/game" }
```

To regenerate all game pages after changing the catalog:

```bash
node tools/generate_game_pages.mjs
```

This writes every page in `games/` and keeps assets, SEO, analytics, and AdSense code consistent.

## Deployment

Deploying is close to zero-config because the output is a folder of static files.

**Railway** (current) — the repo ships a `Dockerfile` + `Caddyfile`; Railway detects Docker and serves the static site with gzip, security headers, and a custom 404. Bind your domain under **Networking**, then point Cloudflare CNAME to Railway (keep the Cloudflare proxy on and set SSL/TLS to **Full**).

**Vercel** — also works as-is via static file detection.

**Cloudflare** — used for DNS, SSL, and caching in front.

## SEO, analytics & ads

- Each page carries a self-referencing `canonical`, Open Graph tags, and relevant JSON-LD.
- `robots.txt` allows all crawlers and points to `sitemap.xml`.
- GA4 is loaded `async` in every page's `<head>`.
- AdSense is enabled sitewide (auto ads) and declared in `ads.txt`. Ads live outside the game area.

## Tests & checks

The `tests/` folder contains validation and visual-check scripts (iframe verification, SEO checks, UI/visual metrics, article checks). Run the ones relevant to a change, e.g.:

```bash
node tests/verify.mjs
node tools/audit_seo.mjs
```

## Documentation

See [`docs/`](docs/) for the full set of operational guides: SEO audit, AdSense integration & approval tips, GA4 / traffic monitoring, Railway deployment, adding games, backlink strategy, and project status.

## Note on embedded games

The game library is primarily embedded from third-party hosted URLs rather than bundled. Verify each source's embed/license terms before using it at scale. A few lightweight games are self-hosted under `assets/games/`.
