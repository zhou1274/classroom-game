# classroom-game.com 流量监控接入与运维指南

日期：2026-08-31
适用站点：https://classroom-game.com
技术栈：纯静态站点（HTML/CSS/JS，无框架）、部署于 Railway、域名托管于 Cloudflare
核心关键词：classroom games unblocked

---

## 一、为什么需要流量监控

classroom-game.com 是纯静态小游戏站，流量主要来自搜索引擎。要判断“网站有没有起量、哪个词有戏、外链有没有效果”，必须同时监控两件事：

| 监控目标 | 用什么 | 回答的问题 |
| --- | --- | --- |
| 谁来了、从哪来、看了什么 | Google Analytics 4（GA4） | 全站真实访问、实时在线用户、来源渠道 |
| Google 收录与搜索表现 | Google Search Console（GSC） | 哪些词被收录、曝光多少、点击多少、排名如何 |

两者**互补、不可互相替代**：GSC 只反映 Google 搜索渠道的表现，不是全站流量；因此即使装了 GSC，也必须装 GA4 才能看到完整访问数据。

---

## 二、监控技术栈总览（当前已生效）

| 组件 | 状态 | 说明 |
| --- | --- | --- |
| Google Analytics 4 | 已接入 | Measurement ID：`G-RM24028WLP` |
| Google Search Console | 已接入 | 域名所有权已验证 |
| sitemap.xml | 已配置 | 含全站可索引 URL， robots.txt 已声明 |
| robots.txt | 已配置 | `User-agent: *  Allow: /` + Sitemap 声明 |
| 站点规模 | 约 439 个 HTML 页面 | 首页 / 合规页 / 博客页 / 游戏页 |

---

## 三、GA4 接入操作流程（已执行，供复现/交接用）

### 3.1 创建 GA4 媒体资源
1. 打开 `https://analytics.google.com`，登录谷歌账号。
2. 点击「开始衡量」，填写**媒体资源名称**（如 classroom-game.com）与**网址**。
3. 数据流 → 选择「网站」，填写站点 URL。
4. 创建后，在「数据流 → 网站」里拿到 **Measurement ID**，形如 `G-XXXXXXXXXX`。

### 3.2 标准埋点代码
在页面 `head` 中，紧跟 `<title>` 之后插入：

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-RM24028WLP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-RM24028WLP');
</script>
```

### 3.3 加载方案说明（为何用 async）
- 官方推荐用 `async` 加载 gtag.js，不阻塞 HTML 解析与渲染。
- 内联初始化脚本很小，放在 head 中立即执行，用于页面加载前建立 `dataLayer`。
- `async` 已满足需求，无需再叠加 `defer`（两者叠加没有额外收益）。
- 该方案不等待统计脚本执行完才渲染，因此**不影响游戏 iframe 加载与广告位布局**。

### 3.4 当前实际状态
- 全站约 439 个可访问 HTML 页面均已加入 `G-RM24028WLP`。
- 首页 `index.html` 埋点在 `head` 第 10–16 行，紧随 `<title>`。
- 覆盖：首页、404、隐私政策/条款/关于/联系、5 篇博客、411+ 游戏页。
- **不含**：游戏资源 iframe 内部页面（不属于本站页面，不加入统计）。

### 3.5 重新生成游戏页后如何补埋点
游戏页由脚本生成。若新增/重新生成游戏页，执行：

```bash
node tools/generate_game_pages.mjs
```

生成脚本已包含 GA4 占位代码，重新生成即可自动带上。

---

## 四、GSC 接入操作流程（已执行，供复现/交接用）

### 4.1 添加并验证资源
推荐用「**域名**」方式验证（覆盖根域名与所有子域）：
1. `https://search.google.com/search-console`，登录。
2. 「添加资源」→ 选「域名」→ 输入 `classroom-game.com`。
3. 按提示在 DNS 添加一条 **TXT 记录**（在 Cloudflare DNS 里加）。
4. 回到 GSC 点「验证」，确认通过。

### 4.2 提交 sitemap
1. GSC 左侧菜单「站点地图」。
2. 输入 `https://classroom-game.com/sitemap.xml`。
3. 提交后，状态应为「成功」，无报错。

`robots.txt` 已提前声明：

```text
User-agent: *
Allow: /
Sitemap: https://classroom-game.com/sitemap.xml
```

### 4.3 请求收录（网址检查）
1. 顶部搜索框输入要收录的 URL（如首页、某篇博客）。
2. 「网址检查」→ 若无「已编制索引」，点「**请求编入索引**」。
3. 检查「页面编入索引」结果；常见提示「网址已提交但尚未抓取」或「已抓取，当前未编入索引」，可耐心等待或再次请求。

### 4.4 监控核心报告
- **效果**：曝光、点击、平均排名（判断外链与内容有没有起量，核心看这个）。
- **覆盖**：哪些页面被收录、哪些被排除。
- **链接**：指向本站的外部链接（外链建设后可在这里核对）。
- **所有页面**：配合 sitemap 检查是否全面收录。

---

## 五、验证与自检清单

**GA4**
1. 打开 `https://classroom-game.com/`，浏览器 Network 面板（F12 → Network），确认存在：
   - `googletagmanager.com/gtag/js?id=G-RM24028WLP`
   - `google-analytics.com` 的 `collect` 请求
2. 登录 GA4，打开「**实时**」报告，刷新站点，应能看到当前在线人数与实时事件。
3. 用手机（或手机模拟）访问首页，确认同样能出现在实时报告。
4. 随机访问任一个 `/games/*.html`，Network 中确认同样有一条 gtag 请求。

**GSC**
5. 资源已验证生效（能进入「效果」报告）。
6. sitemap 提交状态为「成功」，无「无法抓取」报错。
7. `https://classroom-game.com/robots.txt` 能直接访问，且 `Sitemap` 字段指向完整 URL。

---

## 六、常见问题排查

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| Network 里没有 gtag/collect | 埋点代码未插入，或页面被 Cloudflare 缓存了旧版本 | 确认代码在 head；清除 Cloudflare 缓存 |
| GA4 实时报告为空 | 缓存 / 代码位置错误 / 统计被广告拦截插件拦 | 用无痕+关闭拦截插件重试；核对 Measurement ID |
| 实时能看到自己，但看不到别人 | 正常，实时只抽样 | 看「报告→获取→流量获取」累计数据 |
| GSC 报 sitemap 无法抓取 | URL 返回 HTML 或状态码异常 | 确认 sitemap 是纯 XML、200 状态、无 HTML |
| GSC 报 robots.txt 阻止 | robots.txt 语法或路径错误 | 核对 robots.txt 内容与域名前缀 |
| 页面出现两次 collect | 同一页面重复插入了 gtag | 检查 head 是否只有一段 GA4 代码 |

---

## 七、日常监控节奏（上线后）

**每周一次（建议固定一天）**
- GA4「获取 → 流量获取」：看用户数、会话数、来源渠道。
- GSC「效果」：看曝光、点击、平均排名变化，特别关注目标词 `classroom games unblocked`。
- GSC「链接」：核对新增外链是否被记录。

**页面变更后**
- 新增/修改页面 → 用生成脚本重新生成 → 更新 sitemap.xml → 在 GSC「站点地图」重新提交 → 对新增关键页「请求收录」。

**外链建设后**
- 看 GSC「效果」的曝光与排名是否上升；对低竞争长尾词，几个外链就可能见效。
- 关注外链存活率；评论外链被删属正常，不要追着补。

---

## 八、GA4 与 GSC 的边界提醒

- GSC **只反映 Google 搜索渠道**，不是全站流量；页面访问主要靠 GA4 统计。
- GA4 与 GSC 相互独立：GA4 不会阻止收录，也不影响 SEO。
- GA4 与 AdSense 相互独立：不要为了适配统计去改广告位或 ads.txt。
- 统计脚本不阻塞渲染，不影响游戏 iframe 与广告布局。

---

## 九、附：各页面类型是否接入统计

| 页面类型 | 是否加入 GA4 | 说明 |
| --- | --- | --- |
| 首页 index.html | 是 | 核心着陆页 |
| 404.html | 是 | 异常页也需统计跳出 |
| privacy/terms/about/contact | 是 | 合规页 |
| 博客文章页 | 是 | 内容页 |
| 游戏页 /games/*.html | 是 | 由生成脚本自动注入 |
| iframe 内部（assets/games/**） | 否 | 不属于本站页面 |

---

## 十、交接备注

1. 全站已使用真实 Measurement ID：`G-RM24028WLP`。
2. 如更换 GA4 账号/资源，仅需全局替换 `G-RM24028WLP` 为新的 ID，再重新生成游戏页。
3. 清除 Cloudflare 缓存后再验证，避免加载旧 HTML。
4. 本指南可与 `docs/ga4-integration-report-2026-08-31.md`、`docs/seo-audit-2026-08-28.md` 配合使用。
