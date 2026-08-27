# Greedy Snake local changes

- Copied from `xosg/WebGames` repository, commit `f854382d2e8a97ed4a9d04fdd9dd4f7d449e24f1`.
- Source folder: `greedy-snake/`.
- Repository README declares: “All games and code are provided under the MIT License.”
- No LICENSE file was present in the root or `greedy-snake/` subfolder at the time of audit.
- Added `noindex` metadata and a relative favicon link.
- Added `embed.css` for responsive iframe sizing without changing gameplay.
- Kept upstream `README.md` and added `UPSTREAM_README.md` containing the repository-level MIT statement.
- No external fonts, CDNs, network requests, cookies, `eval`, dynamic code loading, or third-party libraries were found.
- The game stores a high score in `localStorage` under key `snake-high-score`.
