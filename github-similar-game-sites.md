# GitHub 类似项目调研：classroom games unblocked 小游戏站

> 数据核对日期：2026-08-27  
> 目标场景：做一个英文 classroom games unblocked 网站，参考 classroomgame.github.io 的形态，并兼顾 SEO 与可落地性。

## 结论

如果目标是“尽快做一个可上线的静态游戏站，并且重视 SEO”，最合适的参考是 **classrooms6xunblocked/classrooms6xunblocked.github.io**：它已经是纯静态 GitHub Pages，页面数量适中，游戏页有较完整的 title、description、H2/H3、FAQ 与相关内容结构，但仓库没有许可证，适合参考结构而不是直接照抄。

**UBGHyper** 的线上 SEO 页最接近“每个知名游戏一个长尾页”的形态，但它的源码仓库在核对当天返回 404，因此只能作为线上样本，不能作为可克隆模板。

**classroomgame.github.io** 本身也是纯静态站：master 分支有 871 个 HTML 文件、1149 个文件，Actions 只上传整个仓库。它的页面数量大，但单独游戏页的 title、description、H1 普遍缺少独立长尾文案，robots.txt 还引用了别的站的 sitemap，属于“页面多、内容粗放”的典型。

因此建议采取：纯静态或静态生成 + 一个关键词一个页面；先做首页、分类页和 10 个游戏长尾页，再逐步扩展到数百页；优先使用 MIT/开源/原创资源，不要复制无 license 站的 HTML、文案或未授权游戏资源。

## 原始站点源码说明

### classroomgame.github.io

- 站点：<https://classroomgame.github.io/>
- 仓库：<https://github.com/classroomgame/classroomgame.github.io>
- 默认分支 `main` 只有 README；线上站源码在 `master` 分支。
- `master` 分支：871 个 `.html` 文件、1149 个文件，最近推送 2026-08-18；纯静态 GitHub Pages，部署 workflow 只上传整个仓库。
- 首页 `index.html`：恰好 1 个 H1；H2 共 12 个，包括 New Games、You May Like、Popular Classroom Games、Play Classroom Unblocked Games Online、Classroom Games Unblocked、Looking for Classroom 6x or Classroom 10x?、Classroom Games GitHub.io、Google Classroom Games、Explore Classroom Games by Category、How to Play Classroom Games、About ClassroomGame、Frequently Asked Questions；H3 约 160 个。
- SEO 基础：已使用 canonical、Open Graph、GA4、AdSense、WebSite/CollectionPage/FAQPage JSON-LD；含 29 个 CollectionPage 和 10 个 FAQ 问题。
- 主要短板：
  - 仓库没有许可证文件。
  - 单独游戏页如 `minecraft-classic-sandbox.html` 的 title、description、H1 都只是“Minecraft Classic Sandbox”，没有独立长尾文案。
  - `puzzle.html` 的 H1 只是 Puzzle，H2 为 0。
  - 仓库没有自己的 `sitemap.xml`。
  - `robots.txt` 的 Sitemap 写的是 `https://driftboss-online.gitlab.io/sitemap.xml`，疑似从其他站复制。

## 最直接参考项目

### 1. classrooms6xunblocked —— 最适合直接作为静态参考

- 仓库：<https://github.com/classrooms6xunblocked/classrooms6xunblocked.github.io>
- 站点：<https://classrooms6xunblocked.github.io/>
- 规模：44 个 HTML 页面、84 个文件。
- 结构：`category/*.html` 与 `game/*-unblocked.html`，例如 `game/2048-unblocked.html`。
- 首页：title 为 `Classroom 6x Unblocked Games — Play Free Browser Games at School`；1 个 H1、2 个 H2、11 个 H3。
- 游戏页：title 为 `Play 2048 at School | Classroom 6x unblocked`；H2 为 `2048 Unblocked: One Weekend, Four Million Players, Zero Dollars`；H3 包括 Slide Merge Repeat、Why This Is Harder Than It Looks、Controls、Why This Works at School、The Corner Strategy That Actually Works、One Weekend Project That Changed Puzzle Gaming、Common Questions、More Thinking Games、Report an Issue。

优点：

- 页面数量适中，便于完整浏览和总结结构。
- 游戏页有标题、内容段落、控制说明、学校场景、FAQ、相关游戏等模块，适合作为 SEO 页面结构参考。
- 已经用 GitHub Pages 部署，静态站形态与目标接近。

注意：

- 仓库没有许可证。
- 游戏页没有 H1；建议参考它的内容分区方式，但每页自行补 1 个 H1。
- 与 classroomgame.github.io 一样存在“unblocked”类站点的法律与内容风险，游戏资源授权需要单独核实。

### 2. UBGHyper —— 线上 SEO 样本，源码当前不可克隆

- 站点：<https://ubghyper.github.io/>
- 部分 SEO 页面：
  - <https://ubghyper.github.io/games/Slope.html>
  - <https://ubghyper.github.io/games/Tetris.html>
  - <https://ubghyper.github.io/unblocked-games-chromebook.html>
  - <https://ubghyper.github.io/tyrones-unblocked-games.html>
  - <https://ubghyper.github.io/github-unblocked-games.html>
  - <https://ubghyper.github.io/free-online-games.html>
- 特点：
  - 每个知名游戏有一个长尾页。
  - 有独立关键词页，如 unblocked-games-chromebook、tyrones-unblocked-games、github-unblocked-games。
  - 每页有 FAQ、原创介绍、控制/技巧、相关游戏。
  - 页面声称 430+ 至 620+ 游戏、无广告。

注意：

- 页面标注的源码仓库 <https://github.com/UBGHyper/UBGHyper.github.io> 在 2026-08-27 通过 GitHub API 返回 404，可能已设为私有或删除。
- 因此只能作为线上 SEO 样本，不要声称可以克隆。

## 其他可选项目

| 项目 | Stars / Forks | 语言 | 许可 | 最近推送 | 特点 | 适合用途 | 注意事项 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [Radon-Games/Radon-Games](https://github.com/Radon-Games/Radon-Games) | 218 / 1568 | TypeScript | AGPL-3.0 | 2025-08-02 | 开源完整、功能强；官网为 <https://radon.games> | 研究功能、部署和维护方式 | 首页是客户端 React 空壳，纯 SEO 较弱 |
| [thedogecraft/lunaar.org](https://github.com/thedogecraft/lunaar.org) | 253 / 540 | JavaScript | GPL-3.0 | 2026-04-16 | 热门开源 unblocked 站 | 研究功能与交互 | 不适合作为内容型 SEO 模板 |
| [PeteZah-Games/PeteZahGames](https://github.com/PeteZah-Games/PeteZahGames) | 90 / 253 | JavaScript | 无 license | 2026-08-25 | 仍在活跃维护 | 看现代前端组织方式 | 注意许可证缺失 |
| [dotgui-dev/DotGUI](https://github.com/dotgui-dev/DotGUI) | 72 / 151 | HTML | Apache-2.0 | 2026-08-22 | 静态站、80+ 游戏、多平台可部署、含代理工具 | 研究静态部署和工具组织 | 需要剥离与目标无关的功能 |
| [TheUnblockedHubOfficial/UBH-V1](https://github.com/TheUnblockedHubOfficial/UBH-V1) | 52 / 276 | HTML | AGPL-3.0 | 2024-03-29 | 游戏 + 应用 + 模拟器 + 代理 all-in-one | 了解 unblocked 站常见扩展 | 较旧，维护可能已停止 |
| [suiyec/H5game](https://github.com/suiyec/H5game) | 2 / 2 | TypeScript | MIT | 2025-05-30 | Next.js 14 + App Router + static export + metadata + AdSense/GA/双语 | 适合现代 SEO 工程骨架 | 规模小，仍是演示级 |
| [sausi-7/games](https://github.com/sausi-7/games) | 11 / 10 | JavaScript | MIT | 2026-04-26 | 142 个浏览器游戏、纯静态可部署 | 可作为游戏资产来源 | 不是 SEO 站点模板 |
| [attogram/games](https://github.com/attogram/games) | 166 / 81 | PHP | MIT | 2026-07-23 | 自托管游戏目录，可安装大量开源 web games | 后台化、大批量管理 | 不符合静态 SEO 最佳路线 |
| [parcoillegacy/nativelite](https://github.com/parcoillegacy/nativelite) | 21 / 562 | CSS | 无 license | 2024-12-19 | Unblocked Games Template | 快速看 UX | 不假设可直接商用 |
| [DevinEats314/GamesSiteTemplate](https://github.com/DevinEats314/GamesSiteTemplate) | 6 / 22 | JavaScript | 无 license | 2026-04-03 | 学生向模板 | 查看简化页面组织 | 页面规模较小 |
| [marco48vx/classroom-6x](https://github.com/marco48vx/classroom-6x) | 2 / 14 | HTML | 无 license | 2024-10-23 | 591 个 HTML、1913 个文件，`category/*.html` 与 `game/*.html` | 对比页面规模 | 首页 H1 为 0、无 sitemap，属于反面示例 |
| [shakirdmr/free-unblocked-games](https://github.com/shakirdmr/free-unblocked-games) | 0 / 0 | HTML | 无 license | 2026-04-23 | 声称 250+ games，但只有 index.html，内容主要靠前端加载 | 仅做对比 | 不推荐作为 SEO 参考 |

> Star / Fork、语言、许可证、最近推送时间均以 2026-08-27 核对结果为准，没有使用未经验证的估算值。

## SEO 可借鉴点

### 页面结构

1. 一个页面只做一个核心关键词。
2. 首页只服务 `classroom games unblocked`，不要同时抢多个核心词。
3. 游戏页使用 `/games/slope-unblocked.html`、`/games/tetris-unblocked.html` 这类“游戏名 + unblocked”URL。
4. 分类页使用 `/category/puzzle.html` 这类语义化 URL。
5. 场景页单独做 `/unblocked-games-for-school.html`、`/unblocked-games-chromebook.html`、`/classroom-games.html` 等关键词页面。

### 每个游戏页建议至少包含

- 1 个 H1。
- 2–5 个 H2：How to Play、Controls、Why It Works at School、Is It Safe、FAQ。
- 300–600 字原创内容，围绕该游戏和页面关键词展开。
- 该游戏简介、玩法、控制方式、学校场景说明、常见问题。
- 相关游戏推荐。
- 面包屑导航。
- JSON-LD：Game/VideoGame、FAQPage、BreadcrumbList、WebSite。
- canonical、Open Graph、正确的 title 和 description。

### 站内链路

- 所有页面都链接回首页。
- 首页链接到最新页面，帮助新页获得权重并加速收录。
- 每个页面都有向上一层的链接，形成“首页 → 分类页 → 游戏页 → 首页”的闭环。
- 游戏页底部放相关游戏，延续浏览，降低跳出率。

## 不要照抄的点

- 不要直接复制无 license 站的 HTML、文案、图片或数据结构。
- 不要使用未经授权的游戏资源；优先选择 MIT/开源/自托管的游戏。
- 不要复制 `classroomgame.github.io` 那种把 title、description、H1 都写成同一个短标题的做法。
- 不要只堆页面数量而不写内容；`marco48vx/classroom-6x` 是“页面多但 SEO 粗放”的典型。
- 不要遗漏 `sitemap.xml`、robots.txt、canonical、OG、JSON-LD、内链。
- 不要把别人的 `robots.txt` 整段复制过来，尤其是 Sitemap 指向其他域名的错误文案。
- 不要因为是 GitHub Pages 就忽略许可证问题；无 license 不等于可以自由复制。

## 后续可执行建议

1. 先定技术栈：推荐使用纯静态模板 + 自写生成脚本，或者 Next.js static export + 每页 metadata。
2. 第一版只做首页、一个分类页和 10 个游戏长尾页。
3. 为每个游戏页写独立 title、description、H1、2–5 个 H2、FAQ 和相关游戏链接。
4. 生成正确且完整的 `sitemap.xml`，并让 `robots.txt` 指向自己的 sitemap。
5. 补 canonical、OG、结构化数据、面包屑和内链。
6. 先验证静态站可部署到 GitHub Pages；再考虑接入 AdSense/GA4。
7. 每次新增页面后检查 H1/H2/H3、重复 title、缺失 canonical、无效链接、重复 meta。
8. 在积累一定页面后，再增加场景词页面和分类词页面，逐步扩到数百页。

## 来源链接

### 原始目标站

- <https://classroomgame.github.io/>
- <https://github.com/classroomgame/classroomgame.github.io>

### 最直接参考

- <https://classrooms6xunblocked.github.io/>
- <https://github.com/classrooms6xunblocked/classrooms6xunblocked.github.io>
- <https://ubghyper.github.io/>
- <https://github.com/UBGHyper/UBGHyper.github.io>（2026-08-27 核对时 404）

### 其他候选

- <https://github.com/Radon-Games/Radon-Games>
- <https://github.com/thedogecraft/lunaar.org>
- <https://github.com/PeteZah-Games/PeteZahGames>
- <https://github.com/dotgui-dev/DotGUI>
- <https://github.com/TheUnblockedHubOfficial/UBH-V1>
- <https://github.com/suiyec/H5game>
- <https://github.com/sausi-7/games>
- <https://github.com/attogram/games>
- <https://github.com/parcoillegacy/nativelite>
- <https://github.com/DevinEats314/GamesSiteTemplate>
- <https://github.com/marco48vx/classroom-6x>
- <https://github.com/shakirdmr/free-unblocked-games>

## 2026-08-27 补充：GitHub 上可直接考虑的 HTML5 游戏候选

> 本部分只列“许可证已核实或仓库本身许可证清晰”的来源。MIT 仓库不保证其中每个子游戏、图片、音频都使用了同样的许可证，正式上线前仍需逐游戏核对。

| 游戏/仓库 | 许可证 | 包含内容 | 适合本站的方式 | 风险/注意 |
| --- | --- | --- | --- | --- |
| [gabrielecirulli/2048](https://github.com/gabrielecirulli/2048) | MIT | 原版 2048，键盘/触屏 | 已选定并本地自托管为首页主游戏 | 低；已保留版权声明与 LICENSE.txt |
| [sausi-7/games](https://github.com/sausi-7/games) | MIT | 142 个浏览器游戏，无构建步骤，含 Snake、2048、Tetris、Memory、Chess 等 | 按分类挑选自托管；仓库本身就是静态站 | 中；部分名称/风格可能带既有品牌感，需改名或替换素材 |
| [SK8-infi/OpenCade](https://github.com/SK8-infi/OpenCade) | MIT | 纯 HTML/CSS/JS 复古街机合集，无框架 | 参考结构或挑选其中小游戏自托管 | 中；社区提交项目需逐个确认子游戏来源 |
| [ellisonleao/clumsy-bird](https://github.com/ellisonleao/clumsy-bird) | MIT | Flappy Bird 玩法移植（MelonJS） | 可作为 Flappy 类游戏候选 | 中；需确认构建产物/依赖，不应直接复制 Flappy Bird 品牌 |
| [jsdevspace/snake-js](https://github.com/jsdevspace/snake-js) | MIT | 纯 JS/HTML/CSS 贪吃蛇 | 可直接作为 Snake Unblocked 候选 | 低 |
| [addiebart/tictactoe](https://github.com/addiebart/tictactoe) | MIT | HTML5 Tic-Tac-Toe | 可直接作为课堂小游戏候选 | 低 |
| [Hextris/hextris](https://github.com/Hextris/hextris) | GPL-3.0 | 六边形方块益智游戏 | 可作为 Tetris 类游戏替代 | 中；使用 GPL 代码时需遵守开源义务 |
| [wangzifan396-wzf/mini-browser-games](https://github.com/wangzifan396-wzf/mini-browser-games) | 未核实 | 约 118 个单文件浏览器小游戏 | 可浏览试玩，但不要直接上线 | 高；需要先确认 LICENSE 与每个游戏来源 |
| [xosg/WebGames](https://github.com/xosg/WebGames) | 未核实 | classic HTML5/CSS/JS 游戏合集 | 仅作参考 | 高；许可证不明 |
| [chengzuopeng/game-space](https://github.com/chengzuopeng/game-space) | 未核实 | 60 款 HTML5 小游戏合集 | 仅作参考 | 高；许可证不明 |

### 推荐顺序

1. 首选 **2048**：原版 MIT、单文件、键盘/触屏、课堂适应度最高。
2. 次选 **Snake**（jsdevspace/snake-js 或 sausi-7 版本）：玩法简单、代码轻量。
3. 第三选 **Tic Tac Toe**（addiebart/tictactoe）：无版权争议、开发成本低。
4. 若需要批量扩展，可以用 **sausi-7/games** 做选品来源，但每个游戏必须改成中性名称，并自托管你确认过的版本。
5. 如果使用 **Hextris**，确认你的站点和分发方式能接受 GPL-3.0 的开源义务。
6. 不要直接使用 `wangzifan396-wzf/mini-browser-games`、`xosg/WebGames`、`chengzuopeng/game-space` 等许可证不明的仓库上线。

### 进一步建议

- 每个候选游戏都应先拉到一个本地临时目录，检查是否只引用相对路径、是否有外部 CDN、是否适合 iframe。
- 若游戏代码使用 Phaser、Three.js，也要确认引擎许可和打包后的资源体积。
- 不要在一期首页直接嵌入 142 个游戏；一期先锁定一个主游戏，二期再逐个新增 SEO 游戏页。
