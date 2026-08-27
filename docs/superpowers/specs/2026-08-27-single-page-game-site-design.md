# Single-Page Classroom Game Website Design Specification

> 目标域名：classroom-game.com  
> 文档版本：v2 
> 文件状态：当前唯一版本，旧版已删除，不再引用  
> 设计日期：2026-08-27  
> 文档状态：待站长确认，确认后才进入下一阶段  

## 0. 参考站分析摘要（已实测）

本章记录对 <https://classroomgame.github.io/> 的实际分析结果。本项目的布局和交互可以借鉴其“干净、好用、游戏优先”的单页体验，但不能复制其 HTML、CSS、图片、文案或结构化数据，因为参考仓库没有可明确使用的许可证。

### 0.1 参考站整体结构

参考站是典型的“左侧深色导航栏 + 右侧浅色内容区”单页结构：

- 桌面端左侧 `<aside>` 固定宽 `260px`，纵向铺满视口，背景接近 `rgba(26, 43, 60, 0.7)`，即深海军蓝 `#1A2B3C`。
- 右侧 `<main>` 使用浅灰背景 `#F4F6F9`，桌面端通过 `padding-left: 292px` 给左侧栏留出空间。
- 顶部导航栏在移动端显示 Logo、搜索和汉堡按钮；桌面端显示分类菜单、搜索框和更多入口。
- 左栏先展示分类项（Car、Sports、Puzzle、Arcade、Action 等），再展示一个可展开/收起的 `All Games` 列表。
- 当前页面没有固定“当前游戏高亮条”的明显样式；本版会补上，以改善可用性。

### 0.2 参考站游戏页的游戏区

参考站单个游戏页给出的可复用视觉模式如下：

- 游戏区外层是 `<section class="area-mid rounded-md overflow-hidden">`，圆角较小，外层有 `overflow: hidden`。
- 游戏容器使用固定高度 `600px`，即参考站实际使用 `game-container h-[600px]`。
- iframe 放在容器内，宽高都是 `100%`，外层用绝对定位或 flex 撑满。
- 游戏未点击前展示封面、游戏名、`Play Game` 按钮和说明；点击后才加载 iframe。
- 右下角提供全屏按钮，方便玩家把注意力集中到游戏本身。

参考站首页的游戏卡片是方形缩略图卡片：白底、`border-radius: 16px`、细边框、轻微阴影，悬停时轻微上移，底部叠加游戏名。它使用懒加载图片和近方形缩略图，整体视觉在“游戏站”和“内容站”之间取得平衡。

### 0.3 参考站的 SEO 短板

参考站内容量和页面量很大，但对本次要做的“单页站”来说，主要问题如下：

- 首页有 title、description、canonical、OG、WebSite、FAQPage 和 CollectionPage，结构基础不错，但面向的唯一关键词不聚焦。
- 大量游戏页的 title、description、H1 只有短游戏名，缺少独立长尾词。
- 部分游戏页 H1 与首页 H1 语义重叠，单页内容层级不严格。
- 抽样游戏页 `2048.html` 的 `robots` 为 `noindex, nofollow`，搜索引擎无法正常收录；这是普通页面也可能踩中的隐藏级问题。
- 没有自己的 `sitemap.xml`；`robots.txt` 中的 Sitemap 还指向其他域名的地址。
- 页面多但单页内容深度不足，容易被搜索引擎判定为“薄内容”站点。
- 游戏资源来自多个第三方来源，授权边界不清晰；本项目必须避免同类风险。

### 0.4 参考站最终取舍

保留参考站的三个优点：

1. 左侧游戏选项卡 + 右侧主游戏区的两栏体验。
2. 游戏区高 600px、圆角容器、页面内直接游玩。
3. 干净、低干扰、移动端可用的浅色内容区。

补上参考站的四个缺失：

1. 每页严格一个 H1，标题层级不得跳级。
2. title、description、canonical、OG、结构化数据全部按本规范补齐。
3. `robots.txt`、`sitemap.xml`、`404.html` 全部指向本站自己的资源。
4. 一期只强化一个核心词，避免首页同时抢多个关键词。

## 1. 项目定位与目标

### 1.1 一句话定位

**classroom-game.com 是一个轻量、快速、无下载的英文单页浏览器游戏站，让学生和老师在校园设备上直接打开一个页面就能玩，同时以“classroom games unblocked”这一唯一核心词建立可扩展的 SEO 内容层。**

### 1.2 目标用户画像

**学生**

| 维度 | 说明 |
| --- | --- |
| 搜索意图 | “我想现在就能玩一个不需要下载的浏览器游戏” |
| 使用场景 | 课间、自习、自由活动、Chromebook 或学校电脑 |
| 主要需求 | 秒开、操作简单、不注册、不下载、不安装 |
| 关注点 | 有没有想玩的游戏、能否直接打开、是否卡顿 |
| 页面任务 | 找到游戏、点击选项卡、立即进入游戏区 |

**老师**

| 维度 | 说明 |
| --- | --- |
| 搜索意图 | “有没有适合课堂使用、安全、免费的小游戏？” |
| 使用场景 | 课堂热身、奖励时间、自习管理、互动教学 |
| 主要需求 | 内容可信、玩法适合年龄、无需学生账号、启动快速 |
| 关注点 | 是否安全、是否适合课堂、是否会被网络限制 |
| 页面任务 | 快速判断游戏是否合适，然后让学生直接打开 |

### 1.3 竞争现状

“classroom games unblocked”和“unblocked games”类词的竞争者通常分为三类：

1. **高权重 Google Sites / 校园资源页**：域名信任度高，但页面通常只是链接列表，内容薄、体验差。
2. **大型 unblocked 聚合站**：页面多、流量大，但普遍存在授权不清晰、页面加载重、内容重复、无独立 SEO 文案等问题。
3. **GitHub Pages 静态小站**：数量多但质量参差，常见缺少 description、sitemap、canonical 或独立 H1。

本项目的竞争策略不是靠域名权重硬拼，而是靠以下四点：

- **单页体验**：一个页面内直接玩游戏，不在游戏和内容之间频繁跳转。
- **内容质量**：提供不复制参考站的原创英文介绍、FAQ、场景说明和清晰的操作路径。
- **可扩展性**：一期只用 JS 数组管理游戏选项卡，二期每加一个游戏就新增一个独立页面，形成“一个词一个页”的站群结构。
- **技术合规**：优先使用 MIT/开源/自研游戏，使用正规平台嵌入接口，避免直接 iframe 未授权整站，降低版权和平台封禁风险。

### 1.4 阶段规划

| 阶段 | 范围 | 目标关键词 | 页面数量 | 预期流量目标（非承诺） |
| --- | --- | --- | --- | --- |
| 第 1 阶段（本期） | 单页首页 + 一个占位主游戏 + 左侧游戏选项卡 + 完整 SEO 内容 | classroom games unblocked | 1 个主页面 | 收录后 0–500 次/月，3–6 个月逐步提升到 200–2,000 次/月 |
| 第 2 阶段 | 每新增一个游戏就新增一个独立游戏页 | minecraft unblocked、tetris unblocked、snake unblocked、2048 unblocked、wordle unblocked 等 | 6–15 个游戏页 | 收录后 1,000–10,000 次/月 |
| 第 3 阶段 | 增加场景页、分类页、列表页和更多长尾页 | unblocked games for school、math games unblocked、typing games unblocked、puzzle games unblocked、free classroom games for kids 等 | 30–100 个页面 | 收录后 10,000–100,000 次/月 |

流量数值只用于设定阶段性努力方向，不写进任何对外宣传内容，也不作为上线承诺。

## 2. 关键词体系表

所有页面遵循“一个页面一个核心词”。本期首页只优化 `classroom games unblocked`，其他词留给后续页面。

| 关键词 | 词类型（主词/长尾/变体） | 目标页面 URL（本期或未来） | 优先级（P0/P1/P2） | 备注 |
| --- | --- | --- | --- | --- |
| classroom games unblocked | 主词 | `/`（本期首页） | P0 | 唯一核心词；title、description、H1、正文首段自然出现 |
| minecraft unblocked | 长尾 | `/games/minecraft-unblocked.html`（未来） | P1 | 高热度、高竞争；必须验证授权后再上线 |
| tetris unblocked | 长尾 | `/games/tetris-unblocked.html`（未来） | P1 | 优先使用开源/授权实现，避免直接使用商标资产 |
| snake unblocked | 长尾 | `/games/snake-unblocked.html`（未来） | P1 | 适合自托管或正规平台嵌入，课堂适配度高 |
| 2048 unblocked | 长尾 | `/games/2048-unblocked.html`（未来） | P1 | 最推荐的第一个正式游戏；原版为 MIT 许可 |
| wordle unblocked | 长尾 | `/games/wordle-unblocked.html`（未来） | P1 | 建议自研原创玩法与原创 UI，避免使用 NYT 资产 |
| math games unblocked | 长尾 | `/games/math-games-unblocked.html`（未来） | P1 | 适合老师场景，内容可写课堂用途与练习建议 |
| typing games unblocked | 长尾 | `/games/typing-games-unblocked.html`（未来） | P1 | 适合学校设备和老师需求 |
| puzzle games unblocked | 长尾 | `/category/puzzle.html`（未来） | P1 | 后续可作为分类页 |
| unblocked games for school | 长尾/场景变体 | `/unblocked-games-for-school.html`（未来） | P1 | 更偏“可访问性”和“学校网络”语义 |
| free classroom games for kids | 长尾/场景变体 | `/free-classroom-games-for-kids.html`（未来） | P1 | 更偏儿童/课堂安全语义 |

规则说明：

- 长尾词不一定要包含主词 `classroom games unblocked`；Google 能进行语义理解，页面标题可以是 `Tetris Unblocked - Play Free Browser Games at School`。
- 如果一个同义变体词搜索量明显更大，可以单独做一页，但必须写独立 title、description、H1、正文和 FAQ，不能只复制首页内容。
- 本期不允许把剩余关键词堆进首页。首页正文可自然穿插 `free classroom games`、`unblocked games for school`、`play games at school` 等变体，但每个变体最多出现 1–2 次。

## 3. 单页布局与组件设计

### 3.1 完整区块图（文字版）

```text
+---------------------------------------------------------------------------------+
| HEADER（全宽）                                                                  |
| [Logo: ClassroomGames + 🎮]      [Home] [Play Now] [FAQ]                        |
+--------------------------------------+------------------------------------------+
| ASIDE（桌面 <1024px 隐藏）             | MAIN                                      |
| Games                                | ① Ad Slot: top banner                     |
| [Featured Game] <active>              | ② H1 Hero                                 |
| [Minecraft Unblocked] <coming soon>   |     Classroom Games Unblocked              |
| [Tetris Unblocked]    <coming soon>   |     Short intro paragraph                  |
| [Snake Unblocked]     <coming soon>   | ③ Game Area                                |
| [2048 Unblocked]      <coming soon>   |     iframe wrapper 960px, 600px            |
| [Wordle Unblocked]    <coming soon>   |     fullscreen button                      |
| [Math Games Unblocked]<coming soon>   | ④ Middle Banner Ad Slot                    |
|                                       | ⑤ Article / SEO Content                    |
| [More games soon]                     |     H2 Play Classroom Games ...            |
|                                       |     H2 What Are ... + H3/H3                |
|                                       |     H2 Best ... + H3/H3                    |
|                                       |     H2 How to Play ... + H3/H3             |
|                                       |     H2 FAQ + FAQ text                      |
|                                       | ⑥ Bottom Banner Ad Slot                    |
|                                       | ⑦ Footer                                   |
+--------------------------------------+------------------------------------------+
```

说明：

- 本期不实现分类页或完整游戏列表页；`aside` 只放 6 个以上游戏选项卡，其中第 1 个为主游戏，其余为占位项。
- 移动端 `<1024px` 隐藏左侧 `aside`，改为顶部横向滚动的“游戏选项卡条”，游戏区保持主视觉。
- 广告位只出现在游戏区之外，按注释规范保留占位容器。

### 3.2 各区块规格

| 区块 | 用途 | 语义标签建议 | 参考站对应风格 | 本版 SEO 改进点 |
| --- | --- | --- | --- | --- |
| 顶部导航 | 品牌识别 + 站内锚点导航 | `<header>` + `<nav>` | Logo、搜索框、分类菜单、移动端汉堡 | 导航只放 Home / Play Now / FAQ，不占 H1/H2；移动端减少入口 |
| 左栏游戏选项卡 | 当前游戏导航 + 未来游戏扩展入口 | `<aside>` + `<nav>` + `<ul>` | 深色 260px 固定侧栏，分类与 All Games 列表 | 用 `aria-current="page"` 标记当前游戏；占位项不产生 404 |
| 主游戏区 | 承载 iframe 和核心玩法 | `<main>` 内 `<section>` | 600px 高、圆角、全屏按钮、点击后加载 | 增加游戏名、alt、title 和结构化数据；游戏区不写 H2/H3 标题，避免挤占正文层级 |
| 游戏介绍区 | 解释玩法、开始体验 | `<article>` 内 `<h2>` + `<p>` | 内容长文卡片 | 围绕当前游戏写 2–3 段原创内容，不复制参考站 |
| SEO 内容区 | 覆盖核心词、长尾词、FAQ | `<section>` + `<h2>` + `<h3>` + `<p>` | 常见 FAQ、分类说明、相关游戏 | 全文 ≥600 英文词；FAQ 与 FAQPage 结构化数据一一对应 |
| 页脚 | 版权、免责声明、站内链接 | `<footer>` | 简单导航 + cookie 提示 | Phase 1 只放 Home / Play Now / FAQ 锚点；正式游戏页存在后再替换候选游戏链接，避免 404 |

本期因为只有一个主游戏，不实现参考站那种“首页方形卡片墙”；参考站的白色圆角卡片、悬停上移和图名叠加视觉保留给第 2 阶段的游戏列表页。

### 3.3 两栏比例与响应式断点

| 视口 | 布局 |
| --- | --- |
| ≥1024px | 左侧 `aside` 固定 `260px`，全高；右侧 `main` 左边距 `292px`，内容区自适应 |
| 768–1023px | 隐藏左侧 `aside`；顶部显示横向游戏选项卡条；主区 `max-width: 960px` 居中 |
| <768px | 顶部导航高度约 `56px`；游戏选项卡条横向滚动；游戏区全宽，左右留 `12px` 安全边距 |

桌面端建议数值：

- 左侧栏：`260px`。
- 右侧内容安全边距：`292px`（即 `260px sidebar + 32px gap`）。
- 主游戏容器：`max-width: 960px`，水平居中。
- 内容卡片：内边距 `24px–32px`，上下区块间距 `48px–64px`。

移动端要求：

- 顶部快速导航中的游戏选项卡条高度约 `56px`，支持横向滑动。
- 当前游戏项保持高亮，不遮挡 iframe。
- 游戏 iframe 全宽展示，不两端溢出。
- 广告容器、卡片、正文之间至少保持 `16px` 间距。

### 3.4 配色建议

参考站以浅灰内容区和深色侧栏为主，本版维持这一协调关系，但改为更清晰、更少半透明度的界面。

| 用途 | 色值 | 使用位置 |
| --- | --- | --- |
| 主色 / 强调色 | `#2563EB` | 链接、当前选项卡、按钮、focus ring |
| 页面背景 | `#F4F6F9` | `main`、页面主体 |
| 侧栏背景 | `#1A2B3C` | 桌面 `aside` |
| 卡片背景 | `#FFFFFF` | 游戏区容器、正文卡片、广告容器 |
| 主文字 | `#0F172A` | 正文、标题 |
| 次级文字 | `#475569` | 说明文字、FAQ 答案 |
| 边框 | `#E2E8F0` | 卡片、分隔线 |
| 悬停背景 | `#EFF6FF` | 选项卡悬停、链接悬停 |
| 占位广告背景 | `#FAFAFA` | 未接入 AdSense 时的空槽 |

字体使用系统字体栈，禁止加载外部字体：

```text
system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
```

### 3.5 性能与视觉约束

- 不引入大型图片、视频、动画库或外部字体。
- CSS 目标压缩后 `< 25KB`，JS 目标压缩后 `< 20KB`。
- iframe 使用 `loading="lazy"`，游戏资源只在进入游戏区附近时加载。
- 卡片不强制使用真实缩略图；本期游戏名可使用轻量 SVG 图标或纯文字。
- 所有动画仅为轻量 hover、focus 和淡入，遵守 `prefers-reduced-motion`。

## 4. head 区 SEO 细则

### 4.1 title

公式：

```text
<核心词> - <差异化后缀>
```

示例 1（推荐直接使用，60 字符）：

```text
Classroom Games Unblocked - Play Free Games Online at School
```

示例 2（57 字符）：

```text
Classroom Games Unblocked - Free Browser Games for School
```

示例 3（55 字符）：

```text
Classroom Games Unblocked - Play at School, No Download
```

规则：

- 长度控制在 50–60 字符。
- 核心词 `classroom games unblocked` 必须完整出现且位置靠前。
- 差异化后缀表达“免费、浏览器、学校、无需下载”中的任意一个价值点。
- 禁止为了策略而写重复词，例如 `Classroom Games Unblocked Unblocked Games`。

### 4.2 description

公式：

```text
<核心词> + free/no download + 场景（at school）+ 行动号召
```

示例 1（推荐直接使用，159 字符）：

```text
Play classroom games unblocked online for free. No download or sign-up needed. Enjoy fast browser games on a Chromebook, laptop, or phone at school. Start now.
```

示例 2（156 字符）：

```text
Play classroom games unblocked online for free. No download or sign-up needed. Try fun browser games on a Chromebook, laptop, or phone at school. Start now.
```

示例 3（160 字符）：

```text
Play classroom games unblocked online for free. No download or sign-up needed. Play simple browser games on a Chromebook, laptop, or phone at school. Start now.
```

规则：

- 长度控制在 150–160 字符；示例已经精确计算。
- 第一句必须包含核心词，并在句中自然表达“play ... online for free”。
- 第二条价值点写 `No download or sign-up needed`。
- 第三句写校园场景和适用设备。
- 最后写行动号召，如 `Start now.`。
- 禁止堆砌多个同义词，不要写两遍 `unblocked`。

### 4.3 canonical

本期首页规范：

```text
https://classroom-game.com/
```

规则：

- 每个页面只允许一个自引用 canonical。
- canonical 与 sitemap 中的 `<loc>` 必须完全一致，本方案统一使用 `https://classroom-game.com/`。
- 后续每个独立游戏页使用 `https://classroom-game.com/games/<slug>.html` 作为 canonical，不使用 `/index.html` 作为子页 canonical。
- 不允许 canonical 指向参考站、GitHub Pages 或第三方游戏平台。

### 4.4 Open Graph

本期必须包含：

```text
og:type = website
og:title = Classroom Games Unblocked - Play Free Games Online at School
og:description = Play classroom games unblocked online for free. No download or sign-up needed. Enjoy fast browser games on a Chromebook, laptop, or phone at school. Start now.
og:url = https://classroom-game.com/
og:site_name = ClassroomGames
og:locale = en_US
```

补充要求：

- `og:type` 使用 `website`，不要使用 `article`。
- `og:title` 与 `<title>` 一致，`og:description` 与 `<meta name="description">` 一致。
- 本期可以不放 `og:image`；如后续需要分享图，使用约 `1200x630` 的轻量 PNG，不使用大图。
- `twitter:card` 可设为 `summary`；没有社交分享图时不要伪造大图。

### 4.5 结构化数据要求

页面 `<head>` 中必须包含三个 JSON-LD 结构：

**4.5.1 WebSite**

必填字段：

```text
@type: WebSite
name: ClassroomGames
url: https://classroom-game.com/
description: 与 description 一致
inLanguage: en
```

**4.5.2 VideoGame**

用于“当前主游戏”。本期主游戏未确定，先使用以下占位值：

```text
@type: VideoGame
name: Featured Game
url: https://classroom-game.com/
description: 与当前游戏简介一致
gamePlatform: ["Web Browser"]
applicationCategory: Game
offers: @type Offer, price 0, priceCurrency USD, availability https://schema.org/InStock
aggregateRating: @type AggregateRating, ratingValue 4.5, reviewCount 120（占位值，上线前若没有真实评分必须删除）
```

规则：

- 主游戏确定后，只需替换 `name`、`description`、`image` 和 `url`，结构不变。
- `aggregateRating` 不得长期保留虚构数值；没有真实评分时直接删除该字段。
- 不允许把 `aggregateRating` 写在首页但页面没有任何评分展示，以免被判为误导数据。

**4.5.3 FAQPage**

必填字段：

```text
@type: FAQPage
mainEntity: 至少 4 个、最多 6 个 Question/AcceptedAnswer
```

规则：

- FAQPage 的问题与答案必须和页面可见的 FAQ 文案完全一致。
- 每个 `Question.name` 必须是完整英文问句。
- 每个 `AcceptedAnswer.text` 必须写完整英文段落，不能只写一句话。
- 本次使用 6 个 FAQ，见第 10 章。

### 4.6 H1/H2/H3 层级规范

硬性规则：

- 每个页面只能有 1 个 `H1`。
- `H1` 只用于页面主标题，不能用于 Logo、按钮、广告、导航。
- `H2` 用于一个内容主题；`H2` 下必须紧跟 `H3` 或正文。
- 不允许 `H2` 直接跳到 `H4`；本页不使用 `H4` 及以上标题。
- 游戏选项卡、导航、面包屑、广告占位、页脚版权文本不得使用标题标签。
- 页面正文中的“怎么玩”“控制方式”等内容使用 `H3` 或普通段落，不新增 `H4`。

### 4.7 关键词密度 3%–5% 的自然分布

关键词密度按“页面可见正文中，核心词精确短语 + 语义相关变体”的总词数占正文英文单词总数的比例计算，目标为 **3%–5%**。不建议把“精确短语单独出现次数”直接当作 3%–5%，否则容易变成堆砌。

| 位置 | 出现要求 |
| --- | --- |
| `<title>` | 1 次 |
| `description` | 1 次 |
| H1 | 1 次 |
| 正文首段 | 1 次 |
| H2 | 最多 2 次 |
| 正文中部 | 2–4 次 |
| FAQ | 1 次 |
| 图片 alt | 可有 1 次，不得为了填词而重复 |

当前示例正文约 1,042 英文词，`classroom games unblocked` 精确短语 7 次，再加入 `free classroom games`、`unblocked games for school`、`play games at school`、`browser games`、`no download` 等语义相关表达后，关键词相关词合计约 44 个，约占正文 4.2%，符合 3%–5% 的要求。实现时保持核心词精确短语出现 5–8 次，不要超过 10 次。

自然穿插以下变体，每个 1–2 次：

- `free classroom games`
- `unblocked games for school`
- `play games at school`
- `browser games`
- `no download`

## 5. 左侧游戏选项卡设计细则

### 5.1 功能定位

左栏是当前页面的“游戏导航列表”，不是分类导航，不是二级页面入口列表：

- 第 1 项是当前主游戏，必须高亮并标记 `aria-current="page"`。
- 其余项是占位/即将上线游戏，本期不得跳转到真实子页。
- 后续每新增一个游戏，只修改 JS 数组并新增一个独立页面，不重构整体布局。

### 5.2 数据结构

用一个简单 JS 数组维护：

```text
{
  name: string,
  url: string,
  status: "active" | "coming-soon" | "live"
}
```

字段要求：

- `name`：用户看到的英文游戏名。
- `url`：未来正式页面地址；本期 `status` 为 `coming-soon` 时不直接跳转。
- `status`：`active` 表示当前页面正在展示的主游戏；`coming-soon` 表示占位，暂不跳转；`live` 表示该游戏已有独立页面并可直接跳转。

JS 数组应放在独立文件 `assets/js/games.js` 中，方便后续新增游戏，不需要改页面主体 HTML。

### 5.3 本期选项卡清单

| 显示文案 | status | 本期点击行为 | 未来 URL 命名 | 说明 |
| --- | --- | --- | --- | --- |
| Featured Game | `active` | 停留当前页并跳转到 `#game-area` | `index.html`（或 `/`） | 当前主游戏；主游戏确认后替换为正式名称 |
| Minecraft Unblocked | `coming-soon` | 显示 `Coming Soon`，不跳转 | `/games/minecraft-unblocked.html` | 占位槽位 |
| Tetris Unblocked | `coming-soon` | 显示 `Coming Soon`，不跳转 | `/games/tetris-unblocked.html` | 占位槽位 |
| Snake Unblocked | `coming-soon` | 显示 `Coming Soon`，不跳转 | `/games/snake-unblocked.html` | 占位槽位 |
| 2048 Unblocked | `coming-soon` | 显示 `Coming Soon`，不跳转 | `/games/2048-unblocked.html` | 占位槽位 |
| Wordle Unblocked | `coming-soon` | 显示 `Coming Soon`，不跳转 | `/games/wordle-unblocked.html` | 占位槽位 |
| Math Games Unblocked | `coming-soon` | 显示 `Coming Soon`，不跳转 | `/games/math-games-unblocked.html` | 占位槽位 |

规则：

- 至少 6 个槽位，当前主游戏 + 6 个候选占位，合计 7 项；第 1 个固定为当前主游戏。
- `coming-soon` 使用 `href="#"`，并通过 JS `preventDefault()` 阻止页面顶部跳动，同时展示可见的 `Coming Soon` 提示。
- 只有在目标页面真实存在后，才允许把状态改为 `live`，并让选项卡跳转到对应 `/games/<slug>.html`。
- 占位项不允许产生 404；如果用户打开一个未来 URL 而页面不存在，由 `404.html` 承接。
- 选项文本必须与英文页面语言一致，禁止写中文游戏名。

### 5.4 桌面端设计

- 侧栏宽 `260px`，背景 `#1A2B3C`，全高纵向排列。
- 侧栏顶部显示站点名和一个 36px 的控制器 SVG 图标。
- 游戏列表使用 `<ul>`，每项高度约 `44px`，间距 `6px`。
- 当前项：背景 `#2563EB` 或左侧 3px 高亮条，文字白色，并显示 `This Page` 小标签。
- 占位项：文字 `rgba(255,255,255,0.72)`，右侧显示 `Soon` 标签；悬停背景变浅。
- 焦点使用明显 `outline: 2px solid #93C5FD`，鼠标按下和键盘操作都可识别。

### 5.5 移动端设计

推荐采用“顶部横向滚动选项卡条”，避免汉堡菜单遮住游戏区：

- 左栏完全隐藏。
- 游戏选项卡条显示在 Header 下方，高度约 `56px`。
- 使用 `overflow-x: auto`，当前项默认滚动到可视区。
- 每项最小宽度约 `150px`，不支持换行。
- 当前项使用白字和强调色背景，其余项使用灰底。
- 主体游戏区不被选项卡遮住；选项卡条与游戏区之间留 `12px–16px`。
- 平板和手机用户都能通过手指滑动浏览完整 7 项。

如果后续增加大量游戏，再考虑汉堡菜单；本期不允许因菜单导致游戏区被覆盖。

### 5.6 可访问性与未来扩展

- 使用 `<nav aria-label="Games">` 包裹游戏列表。
- 当前项使用 `aria-current="page"`。
- 占位项使用 `aria-disabled="true"` 或通过 JS 呈现为不可点击状态。
- 所有选项卡必须是 `<a>` 或 `<button>`，不能是 `<div>` 模拟。
- 后续新增正式页面时，只把对应 `status` 改为 `live`，并把 `url` 指向 `/games/<slug>.html`。

## 6. 主游戏区设计细则

### 6.1 iframe 统一格式

本期所有游戏 iframe 使用统一属性组合：

```html
<iframe
  src="https://example-game-platform.com/embed/your-game"
  title="Featured Game"
  width="100%"
  height="600"
  frameborder="0"
  allowfullscreen
  loading="lazy">
</iframe>
```

规则：

- `title` 必须填写，方便屏幕阅读器识别游戏区。
- `loading="lazy"` 必须保留，避免首屏加载外部游戏资源。
- `allowfullscreen` 保留，方便用户放大游戏。
- 不要使用无意义的 `title="play game"`。
- 不要在 iframe 内部投放本站广告。

### 6.2 尺寸与容器

| 环境 | 规格 |
| --- | --- |
| 桌面端 | 游戏区最大宽度 `960px`，水平居中；高度 `600px` |
| 平板端 | 最大宽度 `960px`，左右留 `16px` 间距 |
| 手机端 | 全宽，左右留 `12px` 间距；高度维持 `600px` |

外层容器：

- 使用 `border-radius: 12px–16px`，并设置 `overflow: hidden`，与参考站“圆角游戏框”一致。
- 背景 `#FFFFFF`，细边框 `#E2E8F0`，可加轻量阴影。
- iframe 必须占满容器，不允许内部滚动条横向溢出。
- 容器顶部可放 `Featured Game` 一行小字或工具栏，但不得使用 `H2`。
- 游戏未加载时，容器内显示用户可读的 `Featured Game` 占位提示；iframe 成功加载后隐藏该提示。

### 6.3 占位链接与替换流程

本期统一使用：

```text
https://example-game-platform.com/embed/your-game
```

替换时机：

1. 站长选定正式游戏。
2. 站长注册正规游戏平台并取得嵌入授权。
3. 将 `iframe src` 替换为平台官方提供的嵌入地址。
4. 更新选项卡第 1 项的游戏名。
5. 更新 VideoGame JSON-LD 的 `name` 和 `description`。
6. 更新正文中的当前游戏介绍（保留泛化介绍段落即可）。

### 6.4 版权与平台合规

硬性规则：

- 严禁直接 iframe 他人整站游戏页面。
- 严禁复制参考站或其他无许可证站的 HTML、CSS、图片、游戏代码。
- 优先选择 MIT/开源、可自托管、可合法嵌入的游戏。
- 使用 GameDistribution、Poki for Publishers 等正规平台时，必须先确认该平台的嵌入条款、账号审核和域名白名单。
- 如果无法确认授权，直接放弃该游戏，不冒险上线。
- 不宣传“绕过学校防火墙”“破解网络限制”等违法或违规行为；页面只说明“该游戏可在你的网络和浏览器中直接运行，若网络策略限制，则无法保证访问”。

项目背景提到的“2026 年已有百万流量游戏站因未授权嵌入被集中投诉、Cloudflare 账号被封”属于必须谨慎对待的真实行业风险，设计上通过“仅使用授权或自托管资源”来规避。

### 6.5 候选游戏推荐清单

推荐优先级以“版权风险低、课堂适配度高、前端工作量小”为准。

| 候选游戏 | 嵌入方式建议 | 来源平台建议 | 风险等级 | 课堂适配度 | 推荐理由 / 注意 |
| --- | --- | --- | --- | --- | --- |
| 2048 | 自托管 MIT 开源版本；或正规平台 iframe | gabrielecirulli/2048（MIT）；GameDistribution | 低 | ★★★★★ | 经典、规则清楚、无需注册；可保留版权声明后本地托管 |
| Snake | 自研或 MIT 开源贪吃蛇；或正规平台 iframe | 本地 `games/snake/`；GameDistribution | 低 | ★★★★☆ | 操作简单、每局短，适合课间；注意不要复制第三方品牌 |
| Tetris 类块状益智游戏 | 自研“Block Fall/Block Puzzle”玩法，或使用无商标风险的开源实现 | 本地实现；GameDistribution | 中 | ★★★★☆ | 玩法本身需注意商标和美术资产；建议改名为中性名称，不直接使用 Tetris 商标图片 |
| Wordle 类单词游戏 | 自研原创单词猜测玩法与 UI，或正规授权平台 | 本地实现 | 中 | ★★★★☆ | 玩法不受保护，但 NYT 词表、Logo、棋盘美术受保护；必须原创 |
| Tic Tac Toe | 本地 HTML/Canvas 自研 | 本地实现 | 低 | ★★★★★ | 规则无版权问题，适合低年级，开发成本极低 |
| Memory Match | 本地 HTML/CSS/JS 自研 | 本地实现 | 低 | ★★★★★ | 适合短期专注力训练；可配合数学、单词、配对内容扩展 |

补充建议：

- 如果站长想要“数学课堂”型游戏，第二期优先选择自研 `Math Facts Quiz` 或 `Number Match`，而不是直接嵌入未经审核的第三方版本。
- 如果站长想要“打字”型游戏，第二期优先选择可自托管的开源打字游戏，或正规平台的嵌入代码。
- 游戏名在页面、选项卡、结构化数据、alt 文本中必须保持一致。

## 7. SEO 内容区（单页版完整 H2/H3 树）

### 7.1 完整标题树

```text
H1: Classroom Games Unblocked

H2: Play Classroom Games Unblocked Online
  （至少 1 段引导语）

H2: What Are Classroom Games Unblocked?
  H3: Why Students Need Unblocked Games
  H3: Are Unblocked Games Safe to Play?

H2: Best Unblocked Games for Classroom
  H3: Popular Games You Can Play Unblocked
  H3: How to Find More Games

H2: How to Play Unblocked Games at School
  H3: Do Unblocked Games Require Download?
  H3: Can I Play Unblocked Games on a Chromebook?

H2: FAQ About Classroom Games Unblocked
  （6 个 FAQ 问答）
```

### 7.2 标题使用规则

- `H1` 只出现一次，使用 `Classroom Games Unblocked`。
- 每个 `H2` 都是一个独立主题，不能重复写同一个标题。
- 每个 `H3` 必须跟在所属 `H2` 之后，不能作为导航或卡片标题使用。
- `FAQ About Classroom Games Unblocked` 下的每个问题使用一个 `H3`，答案使用 `<p>`；禁止用 `H4` 表示 FAQ 问题。
- AI 生成或人工写作时必须保证 H2/H3 与正文内容一一对应，不能只有标题没有内容。

### 7.3 正文写作要求

- SEO 内容区总字数不少于 600 英文词。
- 围绕 `classroom games unblocked` 自然展开，禁止机械重复。
- 学生段落使用轻松、直接的第二人称；老师段落使用专业、可信的口吻。
- 穿插长尾变体：`free classroom games`、`unblocked games for school`、`play games at school`。
- 加入真实、具体的价值信息：无需下载、无需注册、浏览器直接运行、Chromebook 适配、学校网络可能限制访问。
- 不写虚假数据、不写绝对化承诺、不承诺绕过任何网络限制。
- 不复制参考站或其他网站整段文案。

## 8. 广告位规范

### 8.1 位置清单

本期单页固定 3 个广告位：

| 顺序 | 位置 | 必填注释 | 位置说明 |
| --- | --- | --- | --- |
| 1 | 顶部导航下 | `<!-- AdSense Ad Slot: top banner -->` | Header 下方、H1 Hero 上方或 Hero 与游戏区之间 |
| 2 | 游戏 iframe 下方 | `<!-- AdSense Ad Slot: middle banner -->` | 游戏容器之后、第一个 SEO 内容区之上 |
| 3 | SEO 内容区之后 | `<!-- AdSense Ad Slot: bottom banner -->` | FAQ/正文之后、Footer 上方 |

### 8.2 尺寸与响应式

| 广告位 | 桌面建议 | 移动端建议 | 未通过审核时 |
| --- | --- | --- | --- |
| top banner | 728x90 或自适应 | 320x50 / 300x250 / 自适应 | 显示空容器，不占大量空间 |
| middle banner | 728x90 或自适应 | 300x250 / 自适应 | 显示空容器 |
| bottom banner | 728x90 或自适应 | 320x50 / 300x250 / 自适应 | 显示空容器 |

规则：

- AdSense 未通过之前，广告容器仍保留注释和占位样式，但不得显示 `Advertisement` 假文字或假广告。
- 广告容器高度可以设成固定值；如果自适应广告未加载，优先使用 `min-height` 而不是永久占满内容。
- 广告与游戏 iframe 之间至少 `16px` 安全间距。
- 广告不得覆盖、遮挡、压住或紧贴游戏容器；游戏区始终是主视觉。
- 广告代码只在 AdSense 审核通过、域名列入白名单后加入，不预埋失效代码。

### 8.3 广告与游戏边界

- 本站不在 iframe 内投放自家广告。
- 第三方游戏自身可能带有平台广告，这是游戏来源平台的行为；接入前需要确认是否影响课堂体验。
- 如果第三方游戏广告过多、干扰学习，应更换授权版本或自托管版本。

## 9. 附加文件规范

### 9.1 robots.txt

完整内容：

```text
User-agent: *
Allow: /

Sitemap: https://classroom-game.com/sitemap.xml
```

规则：

- 允许所有爬虫抓取。
- Sitemap 必须指向本站自己的地址。
- 不使用 `Disallow` 屏蔽内容，除非后续有明确不需要收录的后台路径。

### 9.2 sitemap.xml

完整内容：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://classroom-game.com/</loc>
    <lastmod>2026-08-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

说明：

- `loc` 使用 `https://classroom-game.com/`，即首页 `index.html` 的规范 URL。
- 静态托管会把 `/` 自动映射到 `index.html`；不做站内跳转或重写。为了避免 `/` 与 `/index.html` 形成两个重复版本，canonical 和 sitemap 统一使用 `/`，不要一个用 `/`、另一个用 `/index.html`。
- `lastmod` 使用文档日期 `2026-08-27`。
- 后续新增独立游戏页时，每个页面追加一个 `<url>`，`changefreq` 使用 `weekly`，`priority` 使用 `0.8–0.9`。
- 不收录 `404.html`、临时广告测试页、内部开发页面。

### 9.3 favicon

推荐方案：

- 主文件：`/assets/icons/favicon.svg`，绘制一个游戏手柄轮廓。
- 建议尺寸：`32x32` 或 `48x48`，文件大小 `< 2KB`。
- 视觉：圆角方形背景 `#1A2B3C`，手柄主体白色，按钮使用 `#2563EB`。
- 可选 fallback：`favicon.ico` 或 32x32 PNG，只保留一个主方案。
- 不使用外部 favicon CDN。

如果不想制作 SVG，也可以使用 `🎮` emoji favicon 方案，但必须先在 Chrome、Edge、Firefox、Safari 中验证兼容性；如果某些设备不显示，仍应提供 SVG fallback。

### 9.4 404.html

页面必须包含：

- 友好标题。
- 返回首页链接。
- 4–6 个候选游戏链接。
- 明确说明游戏可能仍在准备中。

推荐文案：

```text
Title: 404 - Game Not Found | ClassroomGames

H1: Oops! That Game Is Not Here

Body: The page you are looking for may have moved, or the game may still be on its way. Go back to the classroom games hub and choose a game that is ready to play.
```

候选游戏链接（Phase 1 可使用 `#` 或首页锚点，避免未创建页面产生 404；Phase 2 替换为真实 URL）：

```text
2048 Unblocked
Snake Unblocked
Tetris Unblocked
Wordle Unblocked
Math Games Unblocked
Puzzle Games Unblocked
```

规则：

- 404 页 `robots` 使用 `noindex, follow`。
- 不把 404 页加入 sitemap。
- 返回首页链接必须可点击，并且是 `https://classroom-game.com/`。

## 10. 文案风格指南与示范

### 10.1 语气

- 面向学生：轻松、直接、友好，像同学推荐游戏，不居高临下。
- 面向老师：专业、可靠、克制，说明安全、便捷、适合课堂。
- 全站英文，禁止机翻腔、禁止生硬重复关键词。
- 多用 `you`、`your`，短句为主。
- 不写“best game ever”“guaranteed”等绝对化口号。

### 10.2 句式

- 每句尽量控制在 12–18 个英文词。
- 第一段直接回答用户核心问题。
- 第二段解释为什么值玩，第三段解释如何开始。
- FAQ 答案先给结论，再给 1–2 句解释。

### 10.3 首页正文示范文案（可直接使用）

**H2: Play Classroom Games Unblocked Online**

> Looking for a quick break between classes? You can play classroom games unblocked right here in your browser. These free classroom games run directly on the page. Choose a game tab, click Play, and enjoy a game without downloading software or creating an account. Whether you are on a school Chromebook, a shared classroom computer, or your own laptop, the game loads directly on this page. If your network allows the site, you can start playing in seconds.

**Featured Game Introduction (2–3 paragraphs)**

> The featured game is a browser-based challenge designed for short play sessions. It opens in the game area above, so you can start, pause, and return to your schoolwork without installing anything. The controls are simple enough for a first try, but the challenge grows as you learn the patterns and make better decisions.

> Because the game runs inside this page, the experience stays tidy and easy to manage. You can use the Games menu to explore other options, or ask a teacher if you want to use the game as part of a classroom activity. If you are using a touchscreen, follow the on-screen prompts and tap or swipe. If you are using a keyboard or mouse, the controls should be clear from the first move.

> Every game on this page is made to be easy to start and easy to pause when class begins again. If a title is marked Coming Soon, it means the game is being prepared for its own page. When it arrives, you will find controls, tips, and classroom-friendly details right here.

**H2: What Are Classroom Games Unblocked?**

> Classroom games unblocked are browser games you can open on a school computer or personal device when the site is permitted by your network. They run in a web browser, need no download, and usually take only a few minutes to play. Some people search for unblocked games for school when they want a simple title that opens without installers. The word unblocked simply means the game is available in your current browser environment. It does not mean a site bypasses filters, so availability can still depend on your school's network rules.

**H3: Why Students Need Unblocked Games**

> Short browser games fit naturally between lessons and give students a quick mental reset. A game that loads in the browser removes setup time, so the focus stays on the fun instead of installing software. Games like number puzzles, word challenges, and memory games can also help students practice focus and pattern recognition in a low-pressure setting.

**H3: Are Unblocked Games Safe to Play?**

> Most free browser games are safe when they come from a reviewed source and do not ask for personal details. This site uses games that run directly in the browser, without downloads or sign-up forms. Students should still follow school rules, and teachers should review any game before using it with a class. If a game asks for money, private information, or unusual permissions, close it and choose another game.

**H2: Best Unblocked Games for Classroom**

> The best classroom games unblocked are simple to explain, quick to load, and easy to end between periods. Puzzle games work well for quiet brain breaks, while word games and math challenges fit learning goals. The Games menu shows the featured game and a short list of titles that are planned for upcoming pages.

**H3: Popular Games You Can Play Unblocked**

> Popular choices include 2048, Snake, word games, and classroom-friendly puzzle games. They share the same pattern: short rounds, clear rules, and no download required. When a new game is added, it will get its own page with a longer description, controls, and tips.

**H3: How to Find More Games**

> Use the Games menu to find classroom games unblocked quickly. If a game shows Coming Soon, it means the page is planned but not live yet. You can also return to the top of the page and use the navigation links to get back to the featured game or jump to the FAQ.

**H2: How to Play Unblocked Games at School**

> To play games at school, pick a game from the Games menu, make sure the game area is visible, and click the play prompt inside the frame. If the game does not load, refresh the page and try again. Some school networks may limit certain sites, so a game that works at home may not open at school. This site does not bypass network policies and does not guarantee that every title will be available everywhere.

**H3: Do Unblocked Games Require Download?**

> No. These games run in the browser and do not require a download, installation, or account. This makes them easier to use on shared school devices and Chromebooks. If you see a download button or a request to install an app, you are not on the intended game experience and should return to this page.

**H3: Can I Play Unblocked Games on a Chromebook?**

> Yes, most browser games can run on a Chromebook. Type the address into Chrome, open the game page, and play in the browser. Compatibility still depends on the game title, browser version, device settings, and the network rules set by your school.

**H2: FAQ About Classroom Games Unblocked**

**Q1: What are classroom games unblocked?**

> These are free browser games that you can open on a compatible school or personal device without installing extra software. They are designed for quick play between classes, during a short break, or as part of a supervised classroom activity.

**Q2: Are these games free to play?**

> Yes. The games shown here are free to play in the browser. No purchase is required to start a game, and no account is needed for the current experience. Third-party game providers may show their own ads, so always check the source before pressing play.

**Q3: Do I need to download anything?**

> No. You do not need to download an app or install a game file. Everything loads in the browser, which makes the experience fast and easy on school laptops and Chromebooks.

**Q4: Can I play on a Chromebook or phone?**

> Yes. A Chromebook, laptop, tablet, or phone with a modern browser can usually open the game page. Touch controls and keyboard controls depend on the game title, so choose a game that matches your device.

**Q5: Are these games safe for school?**

> When a game comes from a reviewed source, avoids personal data requests, and runs without downloads, it is generally a safe browser experience. Teachers should still review the game and follow school internet rules. If a page asks for private details, payment, or unusual permissions, stop and choose another game.

**Q6: What if a game does not load at school?**

> Try refreshing the page, checking your connection, or choosing another game from the tabs. Some school networks apply their own filters, and this site does not bypass them. If the problem continues, ask your teacher or network administrator whether the site is allowed.

## 11. 上线检查清单

上线前按以下顺序逐项核对：

1. 域名 DNS 解析到 Cloudflare 或相应托管平台。
2. Cloudflare SSL/TLS 模式设为“完全（严格）”。
3. 使用 Vercel、Cloudflare Pages 或 GitHub Pages 完成纯静态部署，确认 `/` 可访问。
4. 确认 `index.html` 只有一个 H1。
5. 确认 title、description、canonical、OG、robots 全部正确。
6. 替换游戏 iframe 为选定游戏的正规嵌入代码，不保留占位链接。
7. 更新游戏选项卡第 1 项名称、VideoGame schema 名称和正文游戏介绍。
8. 确认移动端左栏收起效果，横向选项卡不遮挡游戏区。
9. 确认 iframe 不横向溢出，桌面端最大宽度 960px，移动端全宽。
10. 确认三个广告位注释存在，广告容器不遮挡游戏。
11. 提交 sitemap.xml 到 Google Search Console。
12. 检查 `robots.txt` 可访问且 Sitemap 指向本域名。
13. 使用 Rich Results Test 或 Search Console 验证 WebSite、VideoGame、FAQPage 无报错。
14. 核对 FAQPage 与页面可见 FAQ 一一对应，问题/答案完全一致。
15. 确认无隐藏文字、无关键词堆砌、无重复 H1。
16. 500px、768px、1024px、1440px 四个宽度下分别预览。
17. 检查页面加载性能：首屏不加载大图，不依赖外部字体，iframe 使用 lazyload。
18. 确认 404.html 可访问，返回首页链接和候选游戏链接正常。

## 12. 给建站 coding agent 的任务清单

请严格按照以下顺序实施；完成一个任务再进入下一个，不要提前加入未要求的功能。

### 第 1 步：创建站点目录与 `index.html` 骨架

- 创建 `/index.html`。
- 设置 `<html lang="en">`。
- 设置 `meta charset`、`viewport`、`robots`、`theme-color`。
- 建立 Header、Aside、Main、Article、Footer 五个语义区域。
- 保留三个广告位注释和空容器。

推荐目录：

```text
/index.html
/404.html
/robots.txt
/sitemap.xml
/assets/css/style.css
/assets/js/games.js
/assets/js/main.js
/assets/icons/favicon.svg
```

### 第 2 步：实现左侧游戏选项卡 JS 数组

- 创建 `/assets/js/games.js`。
- 创建 `/assets/js/main.js`，负责读取游戏数组、渲染选项卡、处理当前高亮和 Coming Soon 提示。
- 维护 `{name, url, status}` 数组。
- 数组包含 Featured Game + 6 个占位游戏。
- 占位项显示 Coming Soon 并阻止跳转。
- 当前项设置高亮和 `aria-current="page"`。

### 第 3 步：实现游戏区 iframe 占位

- 在主区放入占位 iframe。
- 使用 `title="Featured Game"`、`width="100%"`、`height="600"`、`frameborder="0"`、`allowfullscreen`、`loading="lazy"`。
- 外层容器最大宽度 960px、圆角、overflow hidden。
- 添加全屏按钮（如实现页面内全屏）或“在新窗口打开”提示。

### 第 4 步：补齐 SEO 内容区

- 写入唯一 H1：`Classroom Games Unblocked`。
- 按第 7 章 H2/H3 树写入全部标题。
- 加入第 10 章正文示范文案。
- 确保总英文词数 ≥ 600。
- 不新增 H4。

### 第 5 步：加入结构化数据

- 在 `<head>` 写入 WebSite、VideoGame、FAQPage 三个 JSON-LD。
- FAQPage 与页面 FAQ 使用完全相同的英文问题与答案。
- 主游戏未确定时，VideoGame 使用 `Featured Game` 占位名，并删除虚构 aggregateRating 或只保留开发期占位说明。

### 第 6 步：补齐 head 元数据

- 写入 title、description、canonical、OG。
- 使用第 4 章的示例 1，不要自行改写。
- 确保 title ≤ 60 字符，description 在 150–160 字符。

### 第 7 步：完成 `style.css` 响应式样式

- 桌面端：260px 固定左栏 + 292px 主区左边距。
- 768–1023px：隐藏左栏，显示横向选项卡条。
- <768px：主区全宽，iframe 高度 600px，容器不溢出。
- 遵循第 3.4 节配色，使用系统字体，不加载外部字体。

### 第 8 步：创建附带文件

- `/robots.txt`：`User-agent: *`、`Allow: /`、Sitemap 指向本站。
- `/sitemap.xml`：包含首页 `<loc>` 和 `lastmod=2026-08-27`。
- `/assets/icons/favicon.svg`：游戏手柄 SVG。
- `/404.html`：友好文案、返回首页链接、候选游戏链接。

### 第 9 步：本地预览检查

- 使用静态服务器打开首页。
- 确认只有一个 H1。
- 检查左栏、游戏区、广告注释、FAQ、Footer 顺序。
- 检查 4 个视口宽度。
- 检查 JS 数组、占位项和当前高亮。
- 检查 `robots.txt`、`sitemap.xml`、`404.html` 直接可访问。
- 检查 Rich Results Test 或 Search Console 对结构化数据的反馈。
- 确认页面没有加载外部字体、大图或未授权游戏资源。

### 交付前验收标准

1. coding agent 不再需要询问游戏名称；本期统一用 `Featured Game` 占位。
2. coding agent 不需要询问页面文件结构；严格按本文档第 12 章执行。
3. 页面可部署到 Vercel / Cloudflare Pages / GitHub Pages，纯静态、无构建步骤。
4. 页面在手机、平板、桌面上均可读、可玩、不遮挡。
5. 页面满足本章列出的 SEO、权限、性能和合规要求。

---

**本设计细则已经写入 `docs/superpowers/specs/2026-08-27-single-page-game-site-design.md`。请站长审阅后确认，再进行下一阶段的实施计划。**
