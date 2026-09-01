# Notion 公开页外链（内容外链）

日期：2026-09-01
目标页面：https://classroom-game.com
说明：不是“提交收录”，而是你自己发布一个公开 Notion 页面，写真实内容并自然链回站点。

---

## 一、你要的地址（很重要）

- ❌ `app.notion.com/p/...` 是**工作区内部页**，别人/谷歌看不到，不能当外链。
- ✅ 必须**发布成公开页**，地址形如：`你的工作区名.notion.site/xxx` 或 `notion.site/xxx`。

## 二、发布步骤

1. Notion 里建一个页面。
2. 右上 **Share → Publish** → 打开「Publish to web」。
3. 复制公开链接（`.notion.site` 开头那段）。
4. 正文里自然插入指向 `https://classroom-game.com` 的链接。
5. 发布后把该公开页 URL 丢到 Google Search Console「网址检查 → 请求收录」，让它被索引、被爬到（这不会改变 dofollow，但让 Google 能发现这条链接）。

## 三、怎么检查是不是 dofollow

发布后打开公开页 → F12（开发者工具）→ 找到指向 `https://classroom-game.com` 的 `<a>` 标签 → 看 `rel` 属性：

- 若 `rel` 里含 `nofollow` → nofollow（不传权重）
- 若 `rel` 只有 `noreferrer` / `noopener` / `external`，**没有** `nofollow` → **dofollow**（大概率）

> 来源：Notion 渲染外面链接通常加 `rel="noreferrer"` 而非 `rel="nofollow"`，因此大概率 dofollow。**以你发布后实测为准。**`
`
**✅ 实测确认（2026-09-01）**：公开页指向 `https://classroom-game.com/` 的链接为：`
“\`<a href="https://classroom-game.com/" rel="noopener noreferrer" ...>Classroom Games Unblocked</a>\`”`
`rel` 只含 `noopener noreferrer`，**无 `nofollow`** → **dofollow，传权重**。

## 四、正文内容（英文，可直接用）

**标题**：`Free Classroom Games for School: 10 Quick Browser Games Teachers Can Use`

**正文**：

```
Looking for a quick way to give students a mental reset without a worksheet? Free browser games can work well for a five-minute brain break, indoor recess, or a low-pressure class challenge. The trick is to pick games that load fast, explain themselves in one sentence, and stop easily when class starts again.

Classroom Games Unblocked is a free browser game hub built for this. It has 400+ lightweight games that run right in the browser — no download, no signup, no account. Students open the site, pick a game, and play. Teachers can find a ready-made classroom game in under a minute. It works on Chromebooks and school laptops, and it doesn't collect personal data from kids.

Here are a few types that work well in class:
- Number puzzles like 2048 — quiet, easy to stop, good for focus.
- Classic arcade picks like Snake — simple controls, short rounds.
- Word games — nice for a quick vocabulary check or a short discussion.
- Logic and board games like Chess or Checkers — calm, thinking-friendly.
- Memory and matching games — great for a quiet reset.

A couple of tips: set a visible timer before the round starts, and ask students to close the page when time is up. Keep the game in the browser, avoid anything that asks for a download or an account, and review a title once before using it with a class.

If you want to explore more, head over to Classroom Games Unblocked — it's free and ready to play at school.
```

> 记得把最后一句「Classroom Games Unblocked」做成链接，指向 `https://classroom-game.com`。

## 五、注意事项

- 别做成“纯外链垃圾页”：Notion 是**自产内容外链**，谷歌信任度低于编辑/目录外链，内容必须真实有用。
- 优先级：**中低**，归入「内容外链/分发」档，与 dev.to / Tumblr / 博客评论同类。
- 主力仍是 Product Hunt + PromoteProject + 博客评论那批。

