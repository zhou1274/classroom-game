# 30 个 iframe 游戏迁移记录（2026-08-28）

> 本期按站长确认执行：先以 iframe 方式上线，暂不本地化；每页均生成独立 SEO 页面。
> 所有 iframe 指向第三方托管页，生产环境是否可玩取决于上游可用性和学校网络策略。

## 1. 页面规模

- 已有本地游戏页：Snake、2048 Cupcakes、Wordle、Minesweeper、Tic Tac Toe（5 个）。
- 本期新增 iframe 游戏页：30 个。
- 首页 + 游戏菜单：36 项（首页 2048 active + 35 个游戏页 live）。
- `sitemap.xml`：36 个 URL。
- 每个新页面均含：唯一 H1、title 50–60 字符、description 150–160 字符、canonical、Open Graph、WebSite/VideoGame/FAQPage JSON-LD、600+ 英文词正文、三个广告位注释。

## 2. 页面 URL 与来源

| 游戏 | 页面 URL | iframe 来源 | 来源说明 |
| --- | --- | --- | --- |
| Minecraft Unblocked | `/games/minecraft-unblocked.html` | `https://minecraft-free-online.github.io/minecraft-github/` | classroomgame 无同名页，探测到的 Eaglercraft 网页版替代来源 |
| Tetris Unblocked | `/games/tetris-unblocked.html` | `https://emfls.github.io/game/TetrisGame/` | classroomgame 无同名页，探测到的 Tetris 替代来源 |
| Math Games Unblocked | `/games/math-games-unblocked.html` | `https://jitenrajpurohit.github.io/Math-Quiz-Game/` | classroomgame 无同名页，Math Quiz 替代来源 |
| Puzzle Games Unblocked | `/games/puzzle-games-unblocked.html` | `https://jasongamesdev.github.io/wood-block-puzzle/` | classroomgame 无同名页，Wood Block Puzzle 替代来源 |
| Geometry Dash Unblocked | `/games/geometry-dash-unblocked.html` | `https://ubg98.github.io/GeometryDash/` | classroomgame embed 链 |
| Slope Unblocked | `/games/slope-unblocked.html` | `https://jasongamesdev.github.io/slope/` | classroomgame embed 链 |
| Subway Surfers Unblocked | `/games/subway-surfers-unblocked.html` | `https://jasongamesdev.github.io/subway-surfers/` | classroomgame embed 链 |
| Temple Run Unblocked | `/games/temple-run-unblocked.html` | `https://jasongamesdev.github.io/temple-run/` | classroomgame embed 链 |
| Among Us Unblocked | `/games/among-us-unblocked.html` | `https://jasongamesdev.github.io/among-us/` | classroomgame embed 链 |
| 8 Ball Pool Unblocked | `/games/8-ball-pool-unblocked.html` | `https://jasongamesdev.github.io/8-ball-pool/` | classroomgame embed 链 |
| Basketball Legends Unblocked | `/games/basketball-legends-unblocked.html` | `https://jasongamesdev.github.io/basketball-legends/` | classroomgame embed 链 |
| Crossy Road Unblocked | `/games/crossy-road-unblocked.html` | `https://jasongamesdev.github.io/crossy-road/` | classroomgame embed 链 |
| Paper.io Unblocked | `/games/paper-io-unblocked.html` | `https://jasongamesdev.github.io/paper-io/` | classroomgame embed 链 |
| Doodle Jump Unblocked | `/games/doodle-jump-unblocked.html` | `https://jasongamesdev.github.io/doodle-jump/` | classroomgame embed 链 |
| Pac-Man Unblocked | `/games/pac-man-unblocked.html` | `https://ubg98.github.io/PacmanHTML5/` | classroomgame embed 链 |
| Flappy Bird Unblocked | `/games/flappy-bird-unblocked.html` | `https://jasongamesdev.github.io/flappy-bird/` | classroomgame embed 链 |
| Cookie Clicker Unblocked | `/games/cookie-clicker-unblocked.html` | `https://jasongamesdev.github.io/cookie-clicker/` | classroomgame embed 链 |
| 1v1 LOL Unblocked | `/games/1v1-lol-unblocked.html` | `https://1v1lolunblocked.com/games/1v1-lol/index.html` | classroomgame embed 链；第三方商业/未知来源 |
| Chess Unblocked | `/games/chess-unblocked.html` | `https://jasongamesdev.github.io/chess/` | classroomgame embed 链 |
| Checkers Unblocked | `/games/checkers-unblocked.html` | `https://ubg98.github.io/CheckersLegend/` | classroomgame embed 链 |
| Solitaire Unblocked | `/games/solitaire-unblocked.html` | `https://klondikesolitaire.github.io/` | classroomgame embed 链 |
| UNO Unblocked | `/games/uno-unblocked.html` | `https://jasongamesdev.github.io/classic-uno/` | classroomgame embed 链 |
| Ball Sort Puzzle Unblocked | `/games/ball-sort-puzzle-unblocked.html` | `https://ubg98.github.io/BallSortPuzzle/` | classroomgame embed 链 |
| Stickman Hook Unblocked | `/games/stickman-hook-unblocked.html` | `https://jasongamesdev.github.io/stickman-hook/` | classroomgame embed 链 |
| Moto X3M Unblocked | `/games/moto-x3m-unblocked.html` | `https://jasongamesdev.github.io/moto-x3m/` | classroomgame embed 链 |
| Drift Hunters Unblocked | `/games/drift-hunters-unblocked.html` | `https://jasongamesdev.github.io/drift-hunters/` | classroomgame embed 链 |
| Run 3 Unblocked | `/games/run-3-unblocked.html` | `https://jasongamesdev.github.io/run-3/` | classroomgame embed 链 |
| Vex Unblocked | `/games/vex-unblocked.html` | `https://jasongamesdev.github.io/vex-3/` | classroomgame embed 链 |
| Red Ball Unblocked | `/games/red-ball-unblocked.html` | `https://redballunblocked.github.io/4/` | classroomgame embed 链 |
| Bloons Tower Defense Unblocked | `/games/bloons-tower-defense-unblocked.html` | `https://ubgwtf.gitlab.io/bloons-tower-defense-3/` | classroomgame embed 链 |

## 3. 来源发现方法

- 对 `classroomgame.github.io` 的 `embed/*.html` 做 iframe / data-embed 追踪，见 `tools/inspect_embeds.py`。
- 对 `classroomgame.github.io` 不存在的四个游戏名，直接请求候选上游 URL 并检查状态码、标题和 iframe 响应头。
- 当前上游均为第三方静态托管页，未作为本站源码复制，仅通过 iframe 引用。

## 4. 风险与维护

- 这些来源大多缺少可核对的授权证明，属于“公开可访问但未确认可再分发”的第三方页面。
- 1v1 LOL 来自独立商业域名，HTML5 游戏场景中最复杂；如后续被上游变更或政策限制，应优先替换或移除。
- 每个 iframe 页都明确说明学校网络可能限制第三方游戏源，不承诺绕过过滤器。
- 后续建议：优先替换为 GameDistribution / Poki / CrazyGames 官方嵌入，或将课堂常用游戏逐个迁移为已确认 MIT/开源版本。
- 菜单数据仍由 `assets/js/games.js` 单一数组维护；加游戏只需新增 `{name,url,page,status}` 并同步生成页面与 sitemap。
