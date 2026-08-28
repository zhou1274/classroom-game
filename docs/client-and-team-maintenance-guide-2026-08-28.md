# classroom-game.com 讲解与维护指南

> 适用对象：甲方 / 非技术负责人 / 新接手维护者  
> 更新日期：2026-08-28

---

## 第一部分：给甲方 / 非技术负责人（5 分钟版）

### 1. 这个站是什么

classroom-game.com 是一个英文浏览器游戏站，面向学生和老师。  
核心卖点是：

- 不需要下载
- 不需要注册
- Chromebook、笔记本、手机都能玩
- 页面直接游玩
- 每个游戏有独立 SEO 页面和玩法介绍
- 静态网站，部署简单，不需要服务器运维

当前规模：

- 菜单共 423 项
- 1 个首页 active
- 422 个 live 游戏页
- 5 个来源已失效，未上线
- sitemap 也包含 423 个 URL

### 2. 甲方需要决定什么

甲方不需要写代码，但需要决定：

- 要不要加某个游戏
- 游戏名称和分类叫什么
- 游戏是否适合学校场景
- 哪些内容需要改成中文/英文
- 是否接受第三方 iframe 来源
- 是否继续接入更多游戏
- 是否接入广告

### 3. 怎么请求新增/修改游戏

把下面这句话发给维护者即可：

> “请新增游戏 `游戏名`，来源网站或页面是 `URL`，分类是 `益智/体育/赛车/反应等`。”

如果只是修改：

> “请把 `游戏名` 的标题、简介或 FAQ 改成 `内容`。”

维护者会：

1. 检查来源是否可访问
2. 确认能否 iframe
3. 创建或修改页面
4. 生成 SEO 元数据和内容
5. 本地测试
6. 提交并部署

### 4. 看到新游戏没有出现怎么办

先刷新页面。

- 电脑：`Ctrl+Shift+R`
- 手机：清除站点缓存或关闭页面重新打开

如果仍没有出现，检查：

- 来源页面是否返回 200
- Railway 是否部署完成
- Cloudflare 是否缓存了旧脚本（维护者会在版本号上处理）
- 菜单数量是否从旧版本变成了 423

### 5. 甲方最常问的问题

**Q：为什么页面只有几十个游戏？**

因为每个游戏都有独立 SEO 页面，之前按批次接入；当前 423 个菜单项已上线。

**Q：为什么有些游戏点进去是空的？**

第三方来源可能被学校网络、浏览器或上游平台限制，也可能来源下线了。维护者会检查并替换或移除。

**Q：能不能放广告？**

可以，但广告只能放在游戏区之外，比如顶部、游戏下方、SEO 内容之后。不要在游戏 iframe 内再放大站广告。

**Q：能不能自己改 design？**

可以提需求，但建议不要直接改代码；由维护者按设计规范改，避免标题层级、SEO 或响应式被破坏。

---

## 第二部分：给维护者 / 开发者（运行手册）

### 1. 站点技术结构

- 纯静态 HTML/CSS/JS
- 无框架、无构建步骤
- 部署：GitHub `main` → Railway Docker/Caddy → Cloudflare DNS/SSL
- 域名：`https://classroom-game.com/`

主要文件：

| 文件 | 作用 |
| --- | --- |
| `index.html` | 首页和主游戏 2048 |
| `games/*.html` | 每个游戏的独立 SEO 页面 |
| `assets/css/style.css` | 全局样式和响应式 |
| `assets/js/games.js` | 菜单数据（由生成器生成） |
| `assets/js/main.js` | 渲染菜单、高亮、全屏、Coming Soon 提示 |
| `tools/generate_game_pages.mjs` | 批量生成游戏页、菜单、sitemap |
| `tools/game-pages-data.mjs` | 第一批 30 个游戏数据 |
| `tools/catalog-game-pages-data.mjs` | 第二批精选 68 个游戏数据 |
| `tools/remaining-games-data.mjs` | 其余 319 个游戏数据 |
| `sitemap.xml` | 站点地图，由生成器生成 |

### 2. 新增一个游戏

步骤：

1. 找到稳定的 iframe 来源，确认能返回 200。
2. 在对应的数据模块加入一条记录：

```text
slug, name, shortName, category, titleTag, embedUrl, source, controls, mobileControls, intro, why, howToPlay, students, teachers, tip, safety
```

3. 运行：

```powershell
node tools/generate_game_pages.mjs
```

4. 运行测试：

```powershell
node tests/verify.mjs
node tests/verify-iframe-pages.mjs
```

5. 提交并推送：

```powershell
git add .
git commit -m "feat: add <game> page"
git push origin main
```

6. 等待 Railway 部署，再检查线上页面。

### 3. 从哪里找新的游戏资源

#### 3.1 classroomgame.github.io 来源

- 仓库：<https://github.com/classroomgame/classroomgame.github.io>
- 游戏入口：`master` 分支 `embed/*.html`
- 当前 420 个入口已全部分析，可用项已接入
- 工具：`tools/crawl_embed_catalog.py`
- 清单：`docs/embed-catalog-2026-08-28.tsv`
- 剩余已接入：`docs/embed-remaining-2026-08-28.tsv`

如果上游新增 embed 文件：

```powershell
git clone --depth 1 --branch master https://github.com/classroomgame/classroomgame.github.io.git <临时目录>
python tools/crawl_embed_catalog.py --src <临时目录>
```

然后根据新的 `embed-catalog` 更新数据模块。

#### 3.2 其他可参考来源

- `github-similar-game-sites.md`：同类站点
- `docs/game-embed-source-review-2026-08-27.md`：第三方平台授权与 iframe 可行性
- `docs/game-source-license-review-2026-08-27.md`：开源游戏和许可证核查
- 推荐优先使用 GameDistribution、TurboWarp、Scratch/Cocrea 官方嵌入
- 其次使用明确 MIT/Apache/GPL 的开源项目并保留许可信息

### 4. 每个新页面必须通过的质量检查

- 一个 H1
- 无 H4
- title 50–60 字符
- description 150–160 字符
- canonical 指向自己页面
- OG：`og:type=website`、`og:title`、`og:description`、`og:url`
- 3 个 JSON-LD：WebSite、VideoGame、FAQPage
- FAQ 页面对应 FAQPage
- 正文 600+ 英文词
- 3 个广告位注释
- 无外部字体
- 无 raster 大图
- 无 `adsbygoogle` 前置代码
- iframe 使用 `loading="lazy"`、`allowfullscreen`
- 菜单、sitemap、404 同步更新

### 5. 缓存处理规范

每次修改 `games.js` 或 `main.js` 时，必须升级资源版本号：

```text
assets/js/games.js?v=20260828k
assets/js/main.js?v=20260828k
```

原因：Cloudflare 会缓存旧 JS，导致页面结构已更新但菜单仍显示旧数量。

### 6. 来源风险红线

- 有 iframe 链接 ≠ 可以嵌入未授权游戏
- 不要复制无许可证站的 HTML、图片、音乐或角色素材
- 不要嵌入赌博、色情、暴力或明显侵权内容
- 使用同名商业 IP 前应查商标和版权
- 如使用第三方平台，以官方 Embed/Publisher 流程为准

---

## 第三部分：一句话总结

**对甲方说：这个站已经是 423 个游戏页的完整静态游戏站，新增游戏只需要告诉我名称和来源，其余由维护者完成；你负责审核内容、决定方向和验收效果。**
