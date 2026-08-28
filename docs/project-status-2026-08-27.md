# Classroom Game Site 项目进度（2026-08-27）

> 本文用于对齐当前代码、设计文档、来源许可和剩余工作。

## 1. 当前已上线页面

| 页面 | URL | 状态 | 说明 |
| --- | --- | --- | --- |
| 首页 | `https://classroom-game.com/` | 已完成 | 核心词 classroom games unblocked；主游戏为本地 MIT 2048 |
| Snake Unblocked | `https://classroom-game.com/games/snake-unblocked.html` | 已实现（来源待补证） | 独立 SEO 页；本地 Snake；选项卡 Live；来源许可证尚未最终确认 |

## 2. 已实现功能

- 2048：MIT `gabrielecirulli/2048`，本地自托管，桌面 680px / 移动 520px。
- Snake：当前来自 `xosg/WebGames` 的 `greedy-snake`（commit f854382...），本地自托管；仓库 README 声明 MIT，但未发现 LICENSE 文件，上线前必须补证或替换为 `sen-ltd/snake`。
- 左栏 7 个游戏选项卡：2048 active、Snake live、其余 coming-soon。
- 首页与 Snake 页均有独立 H1、title、description、canonical、OG、WebSite、VideoGame、FAQPage。
- `sitemap.xml` 已包含首页和 Snake 页；`404.html` 已链接 Snake。
- 三个 AdSense 占位注释均保留在游戏区外。

## 3. 当前验证结果

- `node tests/verify.mjs`：PASS（169 checks）。
- `python tests/visual_check.py`：首页 2048 桌面/移动/全屏通过。
- `python tests/visual_check_snake.py`：Snake 500/768/1024/1440 全通过；无内部滚动、无横向溢出、全屏填充。

## 4. 来源与许可证

- 2048：`gabrielecirulli/2048`，MIT，保留 LICENSE。
- Snake：`xosg/WebGames` 的 `greedy-snake`，commit f854382...；仓库 README 声明 MIT，但未发现 LICENSE 文件。不是已验证的 `sen-ltd/snake`。
- 详细审查见 `docs/game-source-license-review-2026-08-27.md` 与 `docs/game-embed-source-review-2026-08-27.md`。

## 5. 尚未完成

- 先为 Snake 补正式许可证或替换为已验证 MIT 的 `sen-ltd/snake`。
- `/games/2048-unblocked.html` 独立游戏页。
- Minecraft、Tetris、Wordle、Math Games、Puzzle Games 等后续页面。
- AdSense 申请与接入。
- 正式域名 `classroom-game.com` 绑定与 Search Console 提交。

## 6. 下一阶段建议

1. 先处理 Snake 来源许可证，避免用 README MIT 声明代替正式 LICENSE。
2. 然后将 2048 独立页接入，使首页和游戏页词群完整。
3. 继续新增 Tic Tac Toe、Memory 等低风险课堂游戏。
4. 接入 AdSense 前先完成域名和收录验证。


## 7. 当前部署状态（2026-08-27 更新）

- 正式环境：Cloudflare DNS/Proxy → Railway（Caddy 静态托管）。
- Cloudflare Nameserver、Railway CNAME 与 `_railway-verify` TXT 已生效。
- 已验证：首页、Snake 页、CSS、robots、sitemap 返回 200；未知路径返回自定义 404。
- 正式域名：`https://classroom-game.com/`。
- Vercel 仍可保留，但不再作为正式域名入口。


## 8. 第一批游戏迁移结果（2026-08-28）

- 新增本地自托管游戏：2048 Cupcakes、Wordle、Minesweeper、Snake（Unity 版）、Tic Tac Toe。
- 上游来源：`jasongamesdev.github.io` 对应游戏目录；迁移脚本见 `tools/asset_mirror.py`。
- Snake、Tic Tac Toe 已用本地无网络 Poki SDK stub，移除 Google Analytics / 外部字体 / Unity 远程分析请求。
- 新增独立页面：`games/cupcake-2048-unblocked.html`、`games/wordle-unblocked.html`、`games/minesweeper-unblocked.html`、`games/tic-tac-toe-unblocked.html`；Snake 继续使用 `/games/snake-unblocked.html`。
- 导航统一显示 10 个游戏选项卡：6 个 Live + 4 个 Coming Soon。
- 验证：`node tests/verify.mjs` 244 项通过；首页、Snake、5 个新游戏页的 Playwright 视觉测试通过；无外部网络请求。
- 当前 `jasongamesdev` 无公开源码仓库，因此这些文件属于迁移副本，不视为有公开许可证的原始源码；后续可按同玩法策略逐个替换为已验证 MIT 版本。

## 9. 30 个 iframe 游戏迁移（2026-08-28 更新）

- 已按站长确认新增 30 个 iframe 游戏页，全部走第三方托管源，不做本地化。
- 页面包括 Minecraft、Tetris、Math、Puzzle、Geometry Dash、Slope、Subway Surfers、Temple Run、Among Us、8 Ball Pool、Basketball Legends、Crossy Road、Paper.io、Doodle Jump、Pac-Man、Flappy Bird、Cookie Clicker、1v1 LOL、Chess、Checkers、Solitaire、UNO、Ball Sort Puzzle、Stickman Hook、Moto X3M、Drift Hunters、Run 3、Vex、Red Ball、Bloons Tower Defense。
- 菜单现为 36 项：首页 2048 active + 35 个游戏页 live；`sitemap.xml` 36 个 URL。
- 每个新页面：唯一 H1、title/description 长度校验、canonical、OG、WebSite/VideoGame/FAQPage、600+ 英文词、三个广告注释。
- 来源映射与风险说明见 `docs/iframe-game-migration-2026-08-28.md`。
- 生成器：`tools/generate_game_pages.mjs`；数据源：`tools/game-pages-data.mjs`。
- 再生命令：`node tools/generate_game_pages.mjs`；全量静态校验：`node tests/verify.mjs`。

## 10. 第二批精选游戏（2026-08-28）

- 从 classroomgame 的 392 个未接入入口中按“课堂友好 + 热门 + 可 iframe”精选 68 个。
- 新增页面全部走 iframe，不本地化；每页包含完整 SEO 结构、命中词、FAQ、广告位与版本化脚本。
- 菜单现共 104 项：首页 active + 103 个游戏页 live；`sitemap.xml` 共 104 个 URL。
- 清单与来源：`docs/catalog-games-batch-2026-08-28.md`。
- 生成工具：`tools/build_catalog_data.py`、`tools/generate_game_pages.mjs`。
- 验证：`node tests/verify.mjs` 439 项、`node tests/verify-iframe-pages.mjs` 3332 项、视觉检查全部通过。
