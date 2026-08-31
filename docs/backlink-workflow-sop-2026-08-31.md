# classroom-game.com 外链建设操作流程（SOP）

日期：2026-08-31
适用站点：https://classroom-game.com
核心关键词：`classroom games unblocked`
目标：用一套可重复、可跟踪的操作流程，持续为站点获取外链与曝光
配套文档：
- `docs/link-building-checklist-v2-2026-08-31.md`（策略版：竞品清单 / 博客评论 / 付费外链）
- `docs/launch-directory-submission-2026-08-31.md`（发布素材包：各平台文案 + 实测 rel 属性）
- `docs/devto-build-story-2026-08-31.md`（dev.to 技术文 + canonical）

---

## 一、文档定位

这是一份**执行 SOP**，不是分析报告。它告诉你：今天、明天、每周该做什么，怎么做，怎么记录，怎么验证。所有外链动作按此流程重复执行。

## 二、外链目标

- 主词：`classroom games unblocked`
- 目标：让 Google 把 classroom-game.com 视为该词的可靠站点；用外链 + 内容把收录和排名做起来。
- 原则：**宁缺毋滥**。低权重但真实的博客评论外链可放量；垃圾外链、链接农场、站群互推坚决不做。

## 三、外链渠道总览（含实测 rel 属性）

> `rel` 属性为 2026-08-31 抓取真实 HTML 确认。未实测的标「待核实」。

| 渠道 | 类型 | 费用 | rel | 适合 | 优先级 |
| --- | --- | --- | --- | --- | --- |
| Product Hunt | 发布平台 | 免费 | nofollow | 上线冲刺/曝光 | P0（主） |
| SaaSHub | 目录 | 免费 | **nofollow（实测）** | 权重高的产品页曝光 | P1 |
| Indie Hackers | 社区+产品页 | 免费 | **nofollow（实测）** | 独立开发者曝光 | P1 |
| Promoteproject | 发布板 | 免费 | **dofollow（实测）** | 免费 dofollow 外链 + 冲刺 | P1 |
| AlternativeTo | 目录 | 免费 | 待核实 | 替换关系引流 | P1 |
| TIPITY Labs | 目录 | 免费 | 待核实 | 游戏站收录 | P2 |
| dev.to | 内容分发 | 免费 | nofollow | build-in-public 引流 | P2 |
| Reddit (r/SideProject 等) | 社区 | 免费 | nofollow | 曝光/讨论 | P2 |
| 博客评论（老博客） | 评论外链 | 免费 | 多为 nofollow，部分 dofollow | **数量主力** | P0（量） |
| 付费外链 | 采购 | 付费 | 需逐条评估 | 第二阶段 | 见第五节 |

结论：**传权重（dofollow）的外链主要靠 PromoteProject + 博客评论里少数 dofollow**；nofollow 渠道主要提供曝光与引流。

## 四、核心操作流程

### A. 竞品分析与外链导出（每 1–2 周做一次）

1. 用 Ahrefs（Site Explorer → Backlinks）或 Semrush（Backlink Analytics → Backlinks）导出竞品反链。
2. 导出字段：
   `来源域名 / 来源 URL / 目标 URL / 锚文本 / DR / 是否 nofollow`
3. 至少分析 3–5 个同类小游戏站（参考 B1 清单，如 classroom6x.school、hoodamath.com）。
4. 合并去重：
   - 按来源域名去重
   - 删掉指向竞品单个游戏页的链接
   - 删掉竞品站内链接
   - **删掉链接农场、站群互推、自动群发站**
   - **保留低权重但真实的博客评论外链**（严格算 SPAM 但对低竞争词有效）
5. 按「被多少竞品共同拥有」排序，优先做多家都有的来源。
6. 产出：一批候选来源域名 + URL，供 B/C 步使用。

### B. 博客评论外链（数量主力，每天 10–20 条）

一条评论的完整动作流：

1. **筛可评论博客**：从导出数据里找博客文章 URL（形如 `/2025/08/xxx`、`/blog/xxx`），打开后滚到底，有「Leave a Reply / 评论区输入框」就能发。
2. **读文章 2–3 段**，写 1–3 句**针对内容本身**的评论（同意补充 / 提问 / 温和纠正）。**禁止同一模板群发**，禁止塞整段广告。
3. **填表单**：Name 用真实感昵称（做锚文本），Email 用邮箱，**Website 填 `https://classroom-game.com`（这才是外链）**，Comment 填评论。
4. **提交并验证**：回文章页 `Ctrl+F` 搜昵称，确认链接是活的、指向 classroom-game.com。
5. **记录**到跟踪表（见第六节）。
6. **自动发现循环**（越滚越多）：
   - 打开你发过评论的博客 → 看评论区别人 Website 字段填的站
   - 把这些站丢进 Ahrefs → 导出它们的反链 → 再找博客文章
   - 重复，滚动出几千几万个可评论博客。

红线：不短时间用完全相同的模板猛发；不伪装成用户灌同一条评论。

### C. 目录 / 发布平台提交（每天 1–3 条，走 P0/P1 渠道）

每个渠道按入口、字段、rel 执行。可直接复用 `docs/launch-directory-submission-2026-08-31.md` 里的英文文案。

| 渠道 | 入口 | 提交要点 |
| --- | --- | --- |
| Product Hunt | producthunt.com/launch | 个人账号需满 7 天；个人号 + Maker；选 Games/Education 分类；周二–周四 00:01–00:30 PST 发布；禁买赞刷票 |
| SaaSHub | saashub.com/services/submit | 定位「free browser game platform for classrooms」；填 Competitors（hoodamath.com、classroom6x.school）；可能要求挂 badge（提交前确认） |
| PromoteProject | promoteproject.com 的 Submit | 名称/URL/一句话简介；发布后请社区 upvote；**实测 dofollow** |
| Indie Hackers | indiehackers.com → Add product | 名称/URL/简介；Founders Code、Solo Founder、No Employees、Advertising、Self Funded、Side Project、Web、Tags: Gaming/Education/Kids/B2C |
| AlternativeTo | alternativeto.net 提交 | 指定「作为哪个站点的替代品」（如 classroom6x.school / hoodamath.com），选 Games 分类 |
| TIPITY Labs | tipitylabs 提交 | 粘贴 URL 自动抓取，选 Games/Websites，加标签 |

### D. 内容分发（build-in-public）

1. 在站内发一篇技术文（已建：`/how-i-built-400-plus-game-static-site.html`）。
2. 同步到 dev.to，**canonical 指向站内原文**，正文含指向 classroom-game.com 的真实链接。
3. 可在 r/SideProject / r/indiehackers 发文字帖（求反馈，不直接甩链接）；先评论攒 karma，别发 r/Teachers / r/gaming 这类管控严的板块。
4. 用「一个内容，多平台分发」减少重复劳动。

### E. 付费外链（第二阶段，先别做）

**触发条件**：GSC「效果」报告出现**有曝光、有点击、有看起来有戏的排名**，再开始投。

**高质量外链 5 条标准**：DR 不低；来源仍有自然流量；在词下能排前面；出站域名不多；入站域名多。

**购买策略**：多买几个稍便宜的比买一个贵的更值（100 个 $30 > 10 个 $300）；`$0.9 / $4.9 / $9.9 / $19.9` 这类低价基本没用；数量太小（2 个 $50 / 10 个 $10）不如不花。

**提醒**：付费外链是第二阶段，先把免费外链做起来。

## 五、外链跟踪表

字段（用 Excel/Google Sheet）：
```text
日期 | 来源网站 | 目标链接 | 锚文本 | 添加方式 | 状态 | rel(dofollow?) | 备注
```
状态取值：`养号中 / 已提交 / 通过 / 被拒 / 被删 / 跳过`。
rel 取值：`dofollow / nofollow / 未知`。
每周核对一次存活率与 rel。

## 六、节奏与排期

| 周期 | 动作 |
| --- | --- |
| 每天 | 博客评论 10–20 条；其他渠道 1–3 条 |
| 每周 | 导出 1–2 个竞品反链；回访已发链接；查 GSC 效果（曝光/点击/平均排名） |
| 每 2 周 | 深度复盘：外链数量、来源分布、存活率、排名变化 |
| 复盘日 | 检查封号/风险信号：外链存活率骤降、GSC 手动操作/安全警告、大量 nofollow、排名异常波动 |

## 七、风险红线（坚决不做）

- 链接农场、PBN（私有博客网络）、站群互推
- 购买垃圾外链（$0.9–$19.9 批量链接）
- 短时间用完全相同模板批量群发/灌评论
- 伪装成用户/客户刷赞、刷 upvote、伪造多条评论
- 在 Reddit 等社区一上来直接甩链接（会被删）

## 八、验证与监控

1. **确认链接是否 dofollow**：浏览器打开来源页 → F12 → 找到指向你站的 `<a>`，看是否含 `rel="nofollow"`。不带 nofollow 即 dofollow。
   - 也可抓 HTML 检查：`<a href="https://classroom-game.com" ...>` 且无 `rel="nofollow"` → dofollow。
2. **确认收录/引荐流量**：GSC「链接」报告看指向你站的外部链接；GA4「获取」看引荐来源。
3. **看 SEO 是否起量**：GSC「效果」报告，观察 `classroom games unblocked` 的曝光、点击、平均排名。
4. **外链存活率**：隔段时间回访，被删属正常，不要追着补。

## 九、工具清单

| 用途 | 工具 |
| --- | --- |
| 竞品反链导出 | Ahrefs（付费）/ Semrush（付费） |
| dofollow 检查 | 浏览器 DevTools / 抓 HTML 看 rel |
| 搜索表现 | Google Search Console |
| 全站流量 | GA4（G-RM24028WLP） |
| 跟踪表 | Excel / Google Sheets |
| 内容分发 | dev.to / Reddit / Indie Hackers |

## 十、何时进入第二阶段

当你看到 GSC 数据证明 `classroom games unblocked` 有曝光、有点击、排名有起色，再按第五节开启付费外链。在此之前，只做免费外链。

## 十一、执行清单（可勾选）

**第 1 周**
- [ ] 确定一个外链工具（Ahrefs / Semrush），建好跟踪表
- [ ] 导出 3–5 个竞品反链，合并去重
- [ ] 每天博客评论 10–20 条 + 其他渠道 1–3 条
- [ ] 提交 Product Hunt（养号满 7 天）＋ SaaSHub ＋ PromoteProject
- [ ] 发布 dev.to 技术文（设 canonical 指向站内原文）

**每 2 周**
- [ ] 导出 1–2 个新竞品，继续滚博客
- [ ] 回访已发链接，核对存活率与 rel
- [ ] 查 GSC 效果，更新跟踪表

**第二阶段（数据证明有戏后）**
- [ ] 用 5 条标准评估付费外链，先小额试，别一上来大额
- [ ] 只采购真实有流量、出站域名少、入站域名多的链接
