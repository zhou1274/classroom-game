# classroom-game.com 添加游戏实现指南（2026-08-28）

> 本文说明当前项目如何从“数据定义”到“生成游戏页、菜单、sitemap”，再到部署上线的完整方法。  

## 1. 当前实现方式概览

站点是纯静态 HTML/CSS/JS 网站，没有框架、没有构建步骤。游戏有两种接入方式：

| 方式 | 数量 | 页面形态 | 维护方式 |
| --- | ---: | --- | --- |
| 本地 iframe | 6（首页 2048 + Snake、Cupcake 2048、Wordle、Minesweeper、Tic Tac Toe） | iframe 指向 `assets/games/<游戏名>/index.html` | 游戏文件放在仓库内 |
| 第三方 iframe | 417 | iframe 指向第三方 HTTPS 地址 | 由数据模块和生成器批量维护 |

当前菜单共 423 项：1 个首页 active + 422 个 live 游戏页。

### 1.1 页面整体流程

```text
index.html / games/<slug>-unblocked.html
  ├── SEO head（title/description/canonical/OG/JSON-LD）
  ├── Games 菜单（assets/js/games.js 渲染）
  ├── 游戏区域（.game-shell + iframe.game-frame）
  ├── 游戏下方广告位
  ├── 游戏介绍与 SEO 内容（article.content-card）
  ├── FAQ
  ├── 底部广告位
  └── footer
```

浏览器加载游戏页后，页面中的 iframe 再从 `src` 指定的地址加载游戏内容。  
如果是本地游戏，`src` 使用相对路径；如果是外部游戏，`src` 使用完整 `https://` 地址。

## 2. 数据文件在哪里

当前游戏定义分为三个模块：

| 数据文件 | 游戏范围 | 用途 |
| --- | --- | --- |
| `tools/game-pages-data.mjs` | 第一批 30 个游戏 | `GAME_PAGES` |
| `tools/catalog-game-pages-data.mjs` | 精选 68 个游戏 | `CATALOG_GAME_PAGES` |
| `tools/remaining-games-data.mjs` | 其余 319 个游戏 | `REMAINING_GAME_PAGES` |

`tools/generate_game_pages.mjs` 会把三份数据合并：

```js
const ALL_GAME_PAGES = [
  ...GAME_PAGES,
  ...CATALOG_GAME_PAGES,
  ...REMAINING_GAME_PAGES
];
```

## 3. 一个游戏数据对象包含哪些字段

当前生成器需要的字段：

```text
slug            页面 URL：/games/<slug>-unblocked.html
name            页面和菜单显示名称
shortName       description 中使用的短名称
category        描述和分类文本
titleTag        title 后缀素材
embedUrl        iframe src
source          来源记录
controls        桌面端控制说明
mobileControls  移动端控制说明
intro           游戏介绍段落
why             为什么适合课堂
howToPlay       玩法说明
students        学生视角段落
teachers        老师视角段落
tip             小技巧
safety          安全/来源说明
```

示例：

```js
{
  slug: "my-game",
  name: "My Game Unblocked",
  shortName: "My Game",
  category: "puzzle game",
  titleTag: "Fun Class Game",
  embedUrl: "https://example.com/game/",
  source: "https://example.com/game/",
  controls: "Use the arrow keys to move.",
  mobileControls: "Use the on-screen touch controls.",
  intro: "...",
  why: "...",
  howToPlay: "...",
  students: "...",
  teachers: "...",
  tip: "...",
  safety: "..."
}
```

## 4. 添加一个第三方 iframe 游戏

### 4.1 第一步：确定来源

推荐按下面的顺序检查：

```powershell
curl.exe -s -o NUL -w "%{http_code}" <游戏 URL>
```

要求：

- 返回 200
- 页面可以被 iframe（没有 `X-Frame-Options: DENY`，没有 `frame-ancestors 'none'`）
- 游戏不会在页面中要求登录、付费或提交个人信息
- 学校网络可能拦截第三方域名，需要在页面文案中说明

来源示例：

```text
https://jasongamesdev.github.io/chess/
https://ubg98.github.io/GeometryDash/
```

### 4.2 第二步：选择数据模块并新增记录

大部分新增游戏应写入以下三者之一：

- 手工精选：`tools/catalog-game-pages-data.mjs`
- 批量剩余：`tools/remaining-games-data.mjs`
- 基础游戏：`tools/game-pages-data.mjs`

新增一条 `{ ... }` 记录，必须填写第 3 节的全部字段。

### 4.3 第三步：重新生成页面、菜单和 sitemap

```powershell
node tools/generate_game_pages.mjs
```

该命令会：

1. 生成 `games/<slug>-unblocked.html`
2. 重新生成 `assets/js/games.js`
3. 重新生成 `sitemap.xml`
4. 检查 title、description、正文 600+ 词
5. 输出当前页面数量

生成器输出示例：

```text
Generated 417 game pages.
Menu entries: 423. Sitemap URLs: 423.
Lowest article word count: 652.
```

### 4.4 第四步：修改测试中的数量

如果新增/删除游戏，需要同步更新以下测试：

- `tests/verify.mjs`：菜单数量、sitemap 数量、JS 体积预算
- `tests/verify-iframe-pages.mjs`：自动读取所有数据模块，通常只需确认数据文件被包含
- `tests/visual_check*.py`：选项卡数量

### 4.5 第五步：运行验证

```powershell
node tests/verify.mjs
node tests/verify-iframe-pages.mjs
python tests/visual_check.py
python tests/visual_check_iframe_pages.py
```

当前基准数据：

```text
verify.mjs                    1077 checks
verify-iframe-pages.mjs       14178 checks / 417 iframe pages
visual_check.py               423 menu items
visual_check_iframe_pages.py  423 menu items
```

### 4.6 第六步：提交并推送

```powershell
git add .
git commit -m "feat: add <game> page"
git push origin main
```

## 5. 从 classroomgame.github.io 批量发现游戏

源仓库：

```text
https://github.com/classroomgame/classroomgame.github.io
```

游戏入口在 `master` 分支的 `embed/*.html`。当前完整来源映射已经生成：

```text
docs/embed-catalog-2026-08-28.tsv
docs/embed-remaining-2026-08-28.tsv
```

如果上游新增了游戏入口，先克隆到临时目录：

```powershell
git clone --depth 1 --branch master https://github.com/classroomgame/classroomgame.github.io.git <临时目录>
```

然后执行：

```powershell
python tools/crawl_embed_catalog.py --src <临时目录>
```

生成完整 TSV 后，再决定：

- 手动精选：`python tools/build_catalog_data.py`
- 全部剩余：`python tools/build_all_remaining_data.py`
- 生成站点：`node tools/generate_game_pages.mjs`

## 6. 生成器实际做了什么

`tools/generate_game_pages.mjs` 是当前唯一的页面生成入口。它做的事：

### 6.1 生成独立游戏页

每一页包含：

- 一个 H1
- 2–5 个 H2
- H2 下属 H3
- FAQ H3 + 答案
- WebSite、VideoGame、FAQPage 三个 JSON-LD
- canonical、OG、twitter:card
- 三个广告位 HTML 注释
- `iframe` 带 `loading="lazy"` 和 `allowfullscreen`
- 桌面 680px、移动端 520px

### 6.2 自动生成菜单

生成器会重写 `assets/js/games.js`，菜单每项格式：

```js
{ name: "Chess Unblocked", url: "/games/chess-unblocked.html", page: "chess", status: "live" }
```

### 6.3 自动生成 sitemap

生成器会重写 `sitemap.xml`，每个页面一条：

```xml
<url>
  <loc>https://classroom-game.com/games/<slug>-unblocked.html</loc>
  <lastmod>2026-08-28</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>
```

### 6.4 规范 title 和 description

生成器会从多种候选文案中选择合规长度：

- title：50–60 字符
- description：150–160 字符
- 正文：600+ 英文词
- 核心词自然出现，不堆砌

## 7. 页面模板关键组件

### 7.1 游戏区

```text
<section class="game-area">
  <div class="game-shell">
    <div class="game-toolbar">游戏名 + Fullscreen 按钮</div>
    <div class="game-placeholder">Loading 占位</div>
    <iframe class="game-frame" src="..."></iframe>
  </div>
  <p class="game-controls">控制说明</p>
</section>
```

### 7.2 全屏

`assets/js/main.js` 调用：

```js
shell.requestFullscreen();
```

CSS 在 `.game-shell:fullscreen` 时把 iframe 拉伸为 `flex: 1 1 auto`。

### 7.3 加载占位

iframe 的 `load` 事件触发后：

```js
placeholder.hidden = true;
```

如果第三方来源被拦截，占位不会消失，页面文案会提示刷新或更换游戏。

## 8. 如何删除一个游戏

不要手动只删除 HTML 文件，正确步骤：

1. 从对应数据模块删除该对象。
2. 运行 `node tools/generate_game_pages.mjs`。
3. 手动删除已生成的 `games/<slug>-unblocked.html`（当前生成器不会自动清理旧文件）。
4. 更新测试数量和菜单数量。
5. 运行验证。
6. 提交并推送。

## 9. 缓存和版本号

Cloudflare 会缓存 `assets/js/games.js` 和 `assets/js/main.js`，因此每次修改脚本内容都必须升级版本号。

当前生成器变量：

```js
const ASSET_VERSION = "20260828g";
```

所有页面引用：

```html
<script src="../assets/js/games.js?v=20260828g" defer></script>
<script src="../assets/js/main.js?v=20260828g" defer></script>
```

以后每次修改 `games.js` / `main.js`，把版本号改成新的日期或递增号，例如：

```text
20260828g -> 20260829a
```

不要复用旧版本号，否则线上仍可能显示旧菜单。

## 10. 本地游戏与外部游戏的区别

### 10.1 本地游戏

```html
<iframe src="../assets/games/snake/index.html"></iframe>
```

优点：

- 不依赖第三方
- 可控制加载、资源、字体
- 可离线开发和调试

维护成本：

- 游戏源码在仓库内
- 需要单独处理许可证
- 如果游戏体积大，会增加部署体积

### 10.2 外部游戏

```html
<iframe src="https://jasongamesdev.github.io/chess/"></iframe>
```

优点：

- 添加快
- 不复制第三方源码
- 适合批量扩充页面

缺点：

- 来源可能 404
- 可能被学校网络拦截
- 第三方可能修改页面或加防盗链
- 不能控制游戏内部资源

## 11. 部署链路

```text
GitHub main
  -> Railway Docker（Caddy 静态托管）
  -> Cloudflare DNS/SSL
  -> https://classroom-game.com/
```

代码推送后：

1. 等 Railway 构建完成。
2. 检查线上页面。
3. 检查 `assets/js/games.js?v=<version>`。
4. 检查 sitemap。
5. 检查新页面 URL。

Railway 构建有时需要 1–3 分钟；页面如果旧但新页面已 200，通常是 Cloudflare / 浏览器缓存问题。

## 12. 每次上线前检查清单

- [ ] 新增数据字段完整
- [ ] `node tools/generate_game_pages.mjs` 成功
- [ ] `assets/js/games.js` 菜单数量正确
- [ ] `sitemap.xml` 数量正确
- [ ] 新页面有唯一 H1，没有 H4
- [ ] title 50–60 字符
- [ ] description 150–160 字符
- [ ] 3 个 JSON-LD 可解析
- [ ] FAQ 与 FAQPage 一致
- [ ] 正文 ≥ 600 英文词
- [ ] 三个广告位注释保留
- [ ] iframe 使用 `loading="lazy"` / `allowfullscreen`
- [ ] iframe 包含 `allow="pointer-lock..."`，确保 Minecraft 类鼠标锁定游戏可操作
- [ ] noindex 处理正确（内嵌本地游戏页 `noindex`，独立 SEO 页 `index,follow`）
- [ ] `node tests/verify.mjs` 通过
- [ ] `node tests/verify-iframe-pages.mjs` 通过
- [ ] 视觉测试通过，无横向溢出
- [ ] 商品/赌博/明显侵权/广告弹窗类来源不做生产接入
- [ ] 推送后线上 URL 返回 200

## 13. 常见问题

### 13.1 添加了游戏，本地可见但线上没有

检查：

1. 是否运行了 `node tools/generate_game_pages.mjs`
2. 是否提交了生成后的文件
3. 是否等待 Railway 构建完成
4. 是否升级了 `ASSET_VERSION`

### 13.2 线上菜单还是旧数量

通常是 Cloudflare 缓存了旧 JS，而不是页面没更新。解决方式是升级脚本版本号并重新生成所有页面。

### 13.3 iframe 空白

可能原因：

- 上游 404
- 上游不允许 iframe
- 学校网络拦截
- 浏览器扩展拦截
- 上游需要登录或广告商跳转

处理方式：

- 检查 URL 返回 200
- 检查响应头 `X-Frame-Options` / CSP
- 换一个同玩法来源
- 在页面 FAQ 中保留“学校网络可能限制”的说明

