# 剩余游戏盘点与来源说明（2026-08-28）

## 1. 当前边界

- `classroomgame.github.io` 仓库 `master` 分支共有 `embed/*.html`：420 个。
- 已迁移并上线：30 个 iframe 游戏页。
- 按“最终 iframe 目标 URL”差集计算，尚未迁移：392 个 embed 入口。
- 392 个入口对应 376 个唯一上游目标；有 16 组同名/近似重复项，例如 `baldi-s-basics` / `baldis-basics`、`vex-4` / `vex4`、`five-nights-at-freddy*`。
- 文件清单：
  - `docs/embed-catalog-2026-08-28.tsv`：完整 420 个 embed 入口及最终目标。
  - `docs/embed-remaining-2026-08-28.tsv`：392 个尚未迁移入口。

## 2. 这些游戏资源从哪里找到

1. 官方公开仓库：<https://github.com/classroomgame/classroomgame.github.io>，线上站点 `master` 分支。
2. 仓库内含 `embed/*.html`，每个文件都以 `data-embed` 或 iframe `src` 指向第三方游戏页面。
3. 本次通过浅克隆仓库后逐文件解析，420/420 均成功提取出最终 iframe 地址。
4. 工具：
   - `tools/inspect_embeds.py`：按指定游戏名追踪 iframe。
   - `tools/crawl_embed_catalog.py`：从本地 clone 完整提取 420 个 embed 目标。
5. 上游主要托管分布：
   - `jasongamesdev.github.io`：210 个剩余入口
   - `ubg98.github.io`：98 个剩余入口
   - `ubgwtf.gitlab.io`：36 个剩余入口
   - 其余为 `cmug.gitlab.io`、`fireboyandwatergirlunblocked.github.io`、`htmlxm.github.io`、`script.google.com`、多个独立游戏域名等。

## 3. 上一批 30 个的替代来源

部分游戏在 `classroomgame.github.io` 没有同名页，之前手工确认了替代地址：

- Minecraft：`minecraft-free-online.github.io/minecraft-github/`
- Tetris：`emfls.github.io/game/TetrisGame/`
- Math Games：`jitenrajpurohit.github.io/Math-Quiz-Game/`
- Puzzle Games：`jasongamesdev.github.io/wood-block-puzzle/`

## 4. 全部接入的现实问题

- 392 个入口大量是同类玩法的续作/变体，纯页面数量会比“独立游戏数量”虚高。
- 包含大量知名 IP / 商业名称，例如 FNAF、Dragon Ball、Squid Game、Papa's 系列、Fireboy & Watergirl 等。
- 有 `script.google.com` 等非游戏来源、第三方商业站点和 Flash/Ruffle 重打包页。
- 上游多为公开 GitHub/GitLab Pages，可被技术性 iframe，但授权边界并不统一。
- 全量生成 SEO 页可自动完成，但会产生约 390 个近似模板页面，内容差异会变小，可能影响长期质量。

## 5. 建议接入方式

- 方案 A：全部 392 个入口全部生成，页面保留“Live + 免责说明”。最快，但体积和风险最高。
- 方案 B：先去重，并按课堂友好度筛选约 50–80 个：益智、棋盘、卡牌、反应、数学、单词、休闲运动类优先。
- 方案 C：先生成完整目录，由站长圈定名单后再批量生成。
- 无论选哪个方案，后续都可以继续用现有生成器批量创建页面并同步菜单、sitemap。

## 6. 下一步需要确认

确认采用 A、B 或 C 后，我再继续实施，避免一次性生成几百个无法维护或不想上线的页面。

## 7. 当前决策（2026-08-28）

- 已选择方案 B。
- 从 392 个未接入入口中精选 68 个课堂友好/热门游戏，已通过生成器批量创建完整 SEO 页面。
- 菜单现共 104 项：首页 active + 103 个游戏页 live。
- 完整清单：`docs/catalog-games-batch-2026-08-28.md`。

## 8. 当前决策更新（A 方案）

- 剩余 324 个未接入入口中，有 5 个上游入口不可用，已排除。
- 最终新增 319 个 iframe 页面，菜单共 423 项，`sitemap.xml` 423 个 URL。
