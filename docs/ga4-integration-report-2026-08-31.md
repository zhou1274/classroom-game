# GA4 接入报告（classroom-game.com）

日期：2026-08-31  
用途：为 classroom-game.com 接入 Google Analytics（GA4）流量统计  
Measurement ID：`G-RM24028WLP`（已使用站长提供的真实 ID）

## 一、修改范围

| 页面类型 | 页面数 | 是否加入 GA4 |
| --- | --- | --- |
| 首页 index.html | 1 | 已加入 |
| 404.html | 1 | 已加入 |
| Privacy / Terms / About / Contact | 4 | 已加入 |
| 本地游戏页（Snake、Wordle 等） | 5 | 已加入 |
| 生成游戏页 | 417 | 已加入 |
| 游戏资源的 iframe 内部页面 | 0 | 不加入（不属于本站页面） |

当前全站共 428 个可访问 HTML 页面均已接入 GA4 占位代码。

## 二、接入代码

在 head 中紧跟 `<title>` 之后插入：

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

### 修改前

```html
<title>Classroom Games Unblocked - Play Free Games Online at School</title>
<meta name="description" content="Play classroom games unblocked online for free. ...">
```

### 修改后

```html
<title>Classroom Games Unblocked - Play Free Games Online at School</title>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-RM24028WLP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-RM24028WLP');
</script>
<meta name="description" content="Play classroom games unblocked online for free. ...">
```

## 三、加载方案说明

当前采用：

```html
<script async ...></script>
```

理由：

- Google 官方推荐使用 `async` 加载 gtag.js。
- `async` 不会阻塞 HTML 解析和渲染。
- 内联 `gtag` 初始化脚本很小，放在 head 中立即执行，用于在页面加载前建立 dataLayer。
- 不再额外加 `defer`，因为 `async` 已充分满足需求；两者叠加会造成冗余，没有额外收益。
- 该方案不会等待统计脚本执行完才渲染页面，因此不影响游戏 iframe 加载和广告位布局。

## 四、重复与冲突检查

- 每个页面只出现一次 `gtag/js`。
- 每个页面只在 head 中出现一次 GA4 代码。
- 游戏资源内部 iframe（`assets/games/**`）没有插入 GA4。
- 合规页、404、游戏页使用同一段代码，行为一致。

## 五、自检清单

1. 打开 `https://classroom-game.com/`，打开浏览器 Network 面板，确认存在：
   - `googletagmanager.com/gtag/js?id=G-RM24028WLP`
   - `google-analytics.com` 的 collect 请求

2. 登录 GA4 后台，打开“实时”报告，刷新站点后能看到：
   - 当前在线人数
   - 实时事件

3. 用手机（或手机模拟）访问首页，确认同样能看到实时访问。

4. 检查所有游戏页：
   - 直接访问任意 `/games/*.html`
   - Network 中确认同样有一条 gtag 请求

## 六、上线注意

1. 全站已使用真实 Measurement ID：`G-RM24028WLP`。
2. 如需继续调整页面，重新生成全站页面：
   ```bash
   node tools/generate_game_pages.mjs
   ```
3. 删除 Cloudflare 对应缓存，否则可能继续加载旧 HTML。
4. 不要修改 ads.txt 或广告位来适配统计；GA4 与 AdSense 相互独立。
5. 统计代码不会阻止 Google 收录，也不影响现有 SEO。
