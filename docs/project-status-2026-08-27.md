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
