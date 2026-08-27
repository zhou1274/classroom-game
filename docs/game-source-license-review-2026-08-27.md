# 游戏来源验证与风险分级表（classroom-game.com）

验证时间：2026-08-27  
目的：为 classroom-game.com 扩展游戏库提供来源验证、授权判断与嵌入建议。  
结论纪律：有官方文档引用官方文档；没有官方证据的写“待人工确认”，不把“能访问”当成“已授权”。

## 一、候选来源验证与风险分级表

| 来源/游戏 | 类别(A/B/C) | 嵌入方式 | 注册/白名单要求 | 授权状态 | 技术可行性 | 风险等级 | 能否直接 iframe | 说明 |
|---|---|---|---|---|---|---|---|---|
| GameDistribution | A | 官方标准 iframe：`https://embed.gamedistribution.com/?url=https://html5.gamedistribution.com/{GAME_ID}/...&gd_sdk_referrer_url=...`；另有公开示例仓库 GameDistribution/gd-embed-game | 必须注册发布商并接受《Publisher Game License Agreement》；协议要求 active account。未发现公开 API key 要求；“域名登记/发布商审核”机制在公开页面中未写明，待人工确认 | 平台官方发布商授权：游戏仅向“active account”发布商开放；Publisher Properties 明确允许以 iframe 或链接形式展示游戏；33% 发布商分成；仓库 MIT 只是示例代码许可证，不是游戏内容授权 | 官方提供完整 iframe 模板和 `allowfullscreen`；是否强制域名白名单未公开确认 | 低（走正式发布商通道）；跳过注册直接拼 URL：高 | 需注册后嵌入 | 官方提供嵌入代码，但必须先注册发布商、接受协议、按技术规范加 Tags；只取游戏 URL 不等于拿到发布授权 |
| Poki | A | 未发现面向第三方站点的通用官方 iframe 授权；Poki 自己使用游戏托管和 SDK | 开发者需与 Poki 签合作协议；Web Exclusive 默认通常 5 年，也可能采用一次性授权费 | 有平台开发/交易协议，未发现“第三方可直接 iframe 任意 Poki 游戏”的公开授权 | 官方 SDK/平台页存在，但未提供第三方站点通用嵌入模板；未确认是否限制跨域来源 | 中到高 | 不建议 | 官方开发者页面 sdk.poki.com 与 Deals 页面只说明开发者合作和独家/非独家交易；要从 Poki 拿游戏，必须先由开发者或 Poki 书面确认，不能把 Poki 游戏页 URL 当授权 |
| CrazyGames | A | 无第三方站点通用 iframe 授权；CrazyGames 主要是把外部游戏以 iframe 方式放进自家平台，而非向任意网站开放嵌入权 | 开发者在 CrazyGames 提交；第三方站点没有公开“发布商/白名单”流程 | 开发协议涵盖平台发行；文档明确要求游戏自行用 `frame-ancestors` 和 Sitelock 防止被未授权站点嵌入，官方 Terms 只给个人非商业访问许可 | 有 Sitelock 与 CSP `frame-ancestors` 机制，可主动拦截第三方嵌入 | 高 | 不建议 | CrazyGames 文档标题即“防止游戏被复制、托管到未授权网站”；官方 Terms 将使用许可限定为 personal, non-commercial，并明确第三方游戏可能有自己的条款 |
| GameMonetize | A | 官方游戏页提供 iframe：`https://html5.gamemonetize.co/{HASH}/`，另有 `https://play.gamemonetize.co/{HASH}/`；支持 Open/Copy | 官方站明确有 Developers/Publishers 两种身份、45% 分成；“Free Arcade CMS”下载链接要求注册；完整 Publisher Agreement 未取得 | 平台自称面向开发商与发布商做分发和收益分成，但没有公开完整条款；二手信息称注册后按域名申请，不能作为正式授权依据 | 官方页面提供 iframe 和全屏参数；未找到完整反盗链文档 | 中 | 需注册后嵌入 | 官方确实提供 iframe 代码，但“提供代码”不等于允许无协议嵌入；必须注册发布商、确认账期与域名规则后再接入，“待人工确认”正式协议 |
| Y8 | A | 历史上有 `games_for_your_website` 目录，用于把游戏放到自己的网站；未确认当前仍提供可直接 iframe 的官方代码 | 若走官方目录，需按其站内流程操作；当前页面抓取超时，注册/域名要求待人工确认 | 条款限制商业牟利，上传列为 non-commercial；旧论坛 2016 年回复称“无需特殊许可”，但该信息已过时，不能替代现行条款 | 未取得当前官方 embed 页面和技术说明；游戏页可以访问不等于可任意嵌套 | 中到高 | 需注册后嵌入 | 有“供你的网站”历史入口，但没有当前可靠授权证据；先向 Y8 官方确认，不能直接 iframe 任意游戏页 |
| Azgame | A | 未发现官方 iframe 嵌入代码 | 未发现发布商/白名单机制 | 用户提供的群友测试结果：明确回复“不授权”；未发现任何官方开放授权声明 | 未完成独立验证；即使技术可访问，法律授权缺失 | 高 | 不建议 | 已确认不授权（按用户实测信息），应视为明确拒绝；不要以“能播放”代替书面授权 |
| 1games.io | B | 无公开官方 iframe 代码；站点内有嵌入式第三方游戏 | 无公开白名单机制；未注册站点不能获得同意 | Terms 明确禁止未经 express written consent 的 frame/mirror，并禁止复制、分发、商业使用；有 DMCA 政策和重复侵权条款 | securityheaders 扫描显示存在 CSP/X-Frame-Options 相关字段，具体值未完整取得；技术上能否被 iframe 待人工确认 | 高 | 不建议 | 有嵌入 URL 不等于授权；条款直接要求书面同意，DMCA 政策只是通知机制，不是内容授权 |
| 2games.io | B | 无公开官方 iframe 代码；站内第三方游戏多为 GameDistribution/GameMonetize 等来源 | 无公开白名单机制 | Terms、Privacy 明确游戏来自第三方平台，未发现本站给出再分发授权；明确禁止未经 express prior written consent 的 frame/mirror | 未确认 X-Frame-Options/CSP 具体值 | 高 | 不建议 | 与 1games 同理；即使第三方游戏本身在 GD/GM 有分发通道，也必须从原始平台或开发者处取得授权 |
| 2048-rogue.1games.io | B | 无独立官方 embed 文档；属于 1Games.IO 生态 | 与 1games.io 相同；无独立白名单信息 | 未发布独立授权声明；搜索结果标注为 1Games.IO 开发，版权归属待官方确认 | 直接访问失败/未完成验证，待人工确认 | 高 | 不建议 | 不能因它是 2048 玩法就误以为低风险；受 1games 禁止未同意 framing 的约束，且无法确认美术、音频、代码来源 |
| 2v2.io | B | 无公开独立 embed 文档；CrazyGames 将其列为 externally hosted (iframe) | 无公开白名单；需 LEGION GAMES 或 CrazyGames 授权 | 未找到 2v2.io 自身 TOS、开发者直接嵌入授权或联系邮箱；CrazyGames“外部 iframe 游戏”只说明托管形态 | 直接站点需要 JavaScript；securityheaders 显示相关 header 字段，具体值待人工确认 | 高 | 不建议 | “在 CrazyGames 是 iframe 游戏”不等于你也能直接 iframe；应由 LEGION GAMES 或 CrazyGames 书面确认 |
| outred.github.io | B | GitHub Pages 当前重定向到 outred.org；无官方 embed | 无官方白名单 | 是 unblocked games/unblocker 生态，仓库说明允许 fork 部署但禁止闭源、商业和修改；该说明只覆盖站点代码，不能证明其中游戏文件均有第三方授权 | GitHub Pages 返回 `access-control-allow-origin: *`，未看到 X-Frame-Options/CSP 限制，技术上可被 iframe | 高 | 不建议 | 技术上可行不代表版权可行；unblocked 镜像的著作权归属往往不透明，容易混入未经授权搬运内容 |
| asmall-worldcup.github.io | B | 页面标题实为 “A Small World Cup Unblocked TopVAZ”，并聚合 FNF、DMCA 等入口；无官方 embed | 无官方白名单 | 属于 unblocked 聚合/镜像页，未发现开发者直接授权声明 | GitHub Pages 返回 `access-control-allow-origin: *`，未看到 X-Frame-Options/CSP 限制，技术上可被 iframe | 高 | 不建议 | 存在热门游戏聚合与镜像特征，可能包含未授权内容；先溯源到原作者，再讨论嵌入 |
| g.vseigru.net | B | 当前跳转至 ng.vseigru.net，页面显示“content is to be added”，不是可用游戏内容；无官方 embed | 无白名单信息 | 未发现作者、版权或授权声明 | 当前内容不可用；securityheaders 未见 HSTS/CSP/X-Frame-Options，技术状态不能评价 | 高 | 不建议 | 来源未知且内容不可用；不能作为生产环境游戏源，“待人工确认” |
| st.8games.net | B | 跳转到 8games.net；无公开官方 embed | 无白名单信息 | 8games.net 首页宣传 SpongeBob、FNF、Freddy Bear 等大量知名 IP 内容；未发现逐游戏授权 | 未显示 CSP/X-Frame-Options 限制；Cloudflare + PHP 环境，技术可访问 | 高 | 不建议 | 存在大量知名角色/IP 游戏；即使不拦截 iframe，内容授权风险也很高 |
| html5-games.io | B | 当前 HTTP 404，`x-robots-tag: noindex, nofollow`；无官方 embed | 无白名单信息 | 未发现官方条款、版权声明或开发者信息；GitHub 项目 Nitrojade/Zatoga-Lite 把该域名列为游戏来源 | 当前抓取为 404，无 CSP/X-Frame-Options 信息；不可用作游戏源 | 高 | 不建议 | 来源不透明且当前不可用；“待人工确认”后再考虑是否自托管或将版权风险清零 |
| TurboWarp | B | 官方文档提供 `https://turbowarp.org/{PROJECT_ID}/embed`，建议 `allowfullscreen`；也支持 Packager 产物本机嵌入 | 无需注册即可嵌入已分享 Scratch 项目；未分享项目不能 embed | TurboWarp 播放器为 GPLv3.0；官方文档明确 iframe 在 GPL 下通常视为 aggregate work，但这不是法律意见。播放器许可证不等于项目内容的授权 | 官方提供 iframe 模板、全屏支持和 URL 参数 | 中到高 | 可直接嵌入（仅限作者明确授权或自创项目） | TurboWarp 是播放器/编译器，不拥有项目版权；必须逐项目确认素材、音乐、角色和代码来源，不能默认所有 Scratch 项目都能商用/再分发 |
| fnf.kdata1.com | B | 无官方 embed；securityheaders 扫描时跳转至 KBH Games 的 FNF 标签页，疑似第三方/镜像托管 | 无公开白名单 | FNF 代码仓库主要采用 Apache 2.0，但官方 Compiling 文档明确下载的 assets 受版权/商标法保护，属于 proprietary；未发现该镜像站获得官方授权 | 页面可访问，但原域名跳转、具体 X-Frame-Options/CSP 值未取得 | 高 | 不建议 | 代码可用于研究和衍生，但美术、音乐、角色、LOGO 与 “Friday Night Funkin'” 商标均需单独确认；第三方镜像更不构成官方授权 |
| buckshotroulettee.github.io | B | 无官方 embed；扫描时 GitHub Pages 返回 404 | 无公开白名单 | Buckshot Roulette 是 Mike Klubnika 的付费商业游戏；官方页面明确版权归 Mike Klubnika；未发现该 GitHub Pages 页面获得授权 | GitHub Pages 404 页有 CSP，但实际游戏页不可见；未能验证 | 高 | 不建议 | 商业游戏镜像/仿制页不能直接用于教室站；即使页面复刻玩法，也不能使用原游戏名称、美术、音频、UI 或角色 |
| cocrea.world | C | 官方教程：发布后点 Share → Embed，选择 mini card（入口）或 stage card（运行游戏）；典型 URL 为 `https://cocrea.world/embed/{ID}?type=player&showCreator=true&showOperating=false`，支持全屏 | 需先发布作品；本站使用他人作品仍需作者授权 | 官方提供 embed 按钮和可下载 HTML，但平台曾处理 Incredibox/Sprunki 等内容删除问题；素材 Marketplace 免费使用不代表可商业再包装/转售 | 官方 iframe 与 allowFullScreen 已提供；逐项目版权仍需确认 | 中 | 可直接嵌入（仅限自创或作者明确授权的作品） | 平台提供“嵌入按钮”不等于“作品可商用”；必须确认作者拥有所有素材权利 |
| scratch.mit.edu/explore/projects/games/ | C | 官方帮助页提供 `https://scratch.mit.edu/projects/PROJECT_ID/embed?autostart=false`；项目页有 Copy Link | 无需注册即可嵌入已分享项目；使用他人项目仍须遵守作者与素材授权 | 作者拥有自己的项目；Scratch 官方说明作者必须拥有素材、音乐、角色等权利；Scratch Cat、Scratch Logo 等品牌不得商业化；2026 年 ToS 更新后项目许可细节“待人工确认” | 官方 embed 链接稳定、支持 allowfullscreen；公开机制可访问 | 低到中 | 可直接嵌入（仅限自创或明确授权项目） | 官方 embed 是公开技术机制，但对商业/大流量站，最稳妥的是只嵌入自己原创项目或取得作者书面确认 |
| itch.io/games/last-7-days | C | 官方 API 文档说明 Widget 是 iframe；项目页有 Embed 链接；只能为“你控制的项目”生成 | 需项目所有者控制权限；第三方项目需开发者授权 | 没有发现“任意 itch 新游戏可被第三方网站 iframe”的授权；官方明确指出不能使用直接 CDN 链接，必须用官方 embed code；Sitelock 会把盗链用户重定向回 itch 页面 | 官方 Widget 可用于自有项目；未授权项目的直接 CDN 可能被 Sitelock 拦截，也可能随时失效 | 高（未授权项目）；低（仅自有项目官方 Widget） | 不建议（作为发现源）；自有/已授权项目可用官方 Widget | 用户引用的“You're seeing this because the site you loaded the game on tried to steal or hotlink it from itch”与官方 Sitelock 机制吻合；该原文措辞待人工确认，但防盗链机制已证实 |
| gamejolt.com/games/hot | C | 官方帮助文档提供 Package Widget，用于把自己的游戏放到自己的网站；没有发现第三方游戏通用 embed 授权 | 需自己拥有该游戏 package，或获得开发者书面授权 | 官方 Widget 强调“for your own site”，未发现任意热门游戏可被第三方 iframe 的开放政策 | 官方 Widget 可嵌入自有游戏；第三方游戏权限不确定 | 高（未授权项目）；低（自有项目） | 不建议（作为发现源）；自有/已授权项目可用官方 Widget | 只用于发现游戏，之后回原开发者处取得授权；直接 iframe 热门游戏页不等于获得内容授权 |
| 其他 HTML5 游戏聚合站 | C | 没有统一 iframe 协议；不同站点授权条款差异很大 | 绝大多数没有公开第三方白名单流程 | 很多站点 TOS 只写“游戏版权归各自所有者”，没有授予下游站点再分发权 | 完全取决于具体站点；常出现 CSP、X-Frame-Options、Sitelock 或防盗链 | 高 | 不建议 | 只作为发现渠道和选题参考；一旦确定游戏，回到原开发者、原发布商或官方许可证路径 |

## 二、扩展游戏库的优先级建议

### 第一优先：GameDistribution 官方发布商游戏

推荐理由：有正式发布商协议、官方 iframe、明确的收益分成与内容审核机制，是清单中唯一具备“完整平台级授权链路”的 A 类来源。

推荐动作：
1. 注册 GameDistribution Publisher，接受最新《Publisher Game License Agreement》。
2. 在发布商后台选择游戏，按官方模板生成 `https://embed.gamedistribution.com/?url=https://html5.gamedistribution.com/{GAME_ID}/...`。
3. 必须保留 `gd_sdk_referrer_url`，按协议加入 Tags，并确认广告与 IGP 合规。
4. 上线前让负责人确认已接受协议、域名已在后台登记，并保留协议版本与后台截图。

课堂场景建议：优先选益智、单词、数学、反应、节奏、拼图类；不要选暴力、赌博暗示、武器、色情、政治或高风险广告内容的游戏。

### 第二优先：自研或明确 MIT 开源、可自托管的游戏

推荐理由：现有 2048 已是这一路线；自托管后不依赖第三方站点、不赌平台授权，也最容易控制全屏、加载和内容安全。

推荐动作：
1. 只使用许可证明确为 MIT、Apache-2.0 或含商用授权说明的项目。
2. 自托管前逐项检查：代码许可证、美术/音频/字体许可证、角色与商标、第三方依赖。
3. 在页面附许可证、作者和修改说明；不要在页面标题或域名中直接使用可能注册商标的游戏名。

适合先做的品类：2048、贪吃蛇、扫雷、井字棋、单词拼写、记忆配对、时钟/数学小游戏。

### 第三优先：Scratch / Cocrea 中“自己原创或作者明确授权”的项目

推荐理由：官方 embed 机制成熟、全屏支持好、对学生课堂互动友好；风险点只在项目内容版权，不在嵌入技术。

推荐动作：
1. 优先嵌入教师或学生自己创作、未使用第三方受限素材的项目。
2. 若嵌入他人项目，必须取得作者明确同意，并保留聊天/邮件记录。
3. 不使用 Scratch Cat、Scratch 标志或其他品牌素材做商业化页面；商业站点用途控制在非商业、教育展示前提下。

### 第四优先：经开发者书面授权的 itch.io / GameJolt 项目

推荐理由：这两个平台有官方 Widget，适合“官方嵌入工具 + 开发者直接授权”的组合。

推荐动作：
1. 从发现页找到作者，发邮件取得“允许 classroom-game.com 嵌入、非独占、非商业/教育用途”的书面授权。
2. 使用官方 Widget/Embed 代码，不要用 CDN 直链。
3. 截图保存授权邮件和平台页面。

### 不建议纳入范围

1Games.io、2Games.io、2048-rogue.1games.io、2v2.io、outred.github.io、asmall-worldcup.github.io、g.vseigru.net、st.8games.net、html5-games.io、fnf.kdata1.com、buckshotroulettee.github.io、Poki 任意游戏、CrazyGames 任意游戏、Y8 任意游戏、Azgame：当前证据要么明确禁止未同意嵌入，要么属于 unblocked/镜像/仿制生态，或者涉及知名商业 IP 与商标，不建议做生产环境游戏源。

## 三、每个来源的使用指引（一句话）

- GameDistribution：先注册发布商、接受协议，再从后台取单游戏官方 embed 代码，不要只复制游戏 CDN URL。
- Poki：仅用于发现或开发合作；要使用必须先与 Poki 和开发者确认协议，不建议直接 iframe。
- CrazyGames：仅用于参考游戏选择；不要嵌入其游戏文件或页面，除非取得开发者/平台明确书面许可。
- GameMonetize：以 Publisher 身份注册，确认域名与分成规则后再使用官方 iframe；完整协议“待人工确认”。
- Y8：只能走其官方“供网站”流程并向官方确认当前规则，不能直接把任意游戏页 iframe。
- Azgame：已确认不授权，不纳入来源。
- 1games.io / 2games.io / 2048-rogue.1games.io：条款明确禁止未经书面同意 framing，先停止嵌入，再联系运营方取得书面授权。
- 2v2.io：联系 LEGION GAMES 或 CrazyGames 取得官方授权，单独确认嵌入条款。
- outred.github.io / asmall-worldcup.github.io：unblocked 镜像生态，不建议作为生产源；如一定要用，先追踪每个游戏的原作者与授权。
- g.vseigru.net：当前内容不可用且来源不明，跳过。
- st.8games.net：涉及大量知名 IP 内容，不建议嵌入；只用于了解游戏流行趋势。
- html5-games.io：当前 404 且来源不明，跳过。
- TurboWarp：只嵌入自创或作者明确授权的 Scratch 项目，使用官方 `/embed` URL，并保留作者信息。
- fnf.kdata1.com：不要直接 iframe；若要做 FNF 玩法，应使用 Apache 2.0 代码自行开发新资产或取得官方资产授权，并单独处理商标。
- buckshotroulettee.github.io：不要使用；Mikes Klubnika 的版权与发行协议未开放给第三方。
- cocrea.world：官方 Share → Embed 可用；只嵌入自己或作者明确授权的作品，商用前先确认素材协议。
- scratch.mit.edu/explore/projects/games/：官方 embed 可用；优先“自创项目”，他人项目必须作者同意，且不把 Scratch 品牌素材用于商业化。
- itch.io/games/last-7-days：只作为发现渠道；使用前必须用官方 Widget 并取得作者授权，不能直接用 CDN 链接。
- gamejolt.com/games/hot：只作为发现渠道；使用官方 Package Widget 前必须确认自己是项目所有者或已获开发者授权。
- 其他 HTML5 聚合站：只做发现；定位到原开发者/原授权方后再决定嵌入、自托管或自研。

## 四、硬性红线

1. **未经授权的游戏不得直接 iframe 嵌入。** 用户方风险提示：2026 年已有上百万流量的游戏站被版权方集中投诉端掉，Cloudflare 账号也出现过因重复侵权被封的案例。该案例应作为运营警示，但未独立核实，上线前应由法务/人工复核并保留证据。
2. **有嵌入链接 ≠ 有授权。** 用户实测 Azgame 曾明确回复“不授权”；1Games/2Games 也明确要求书面同意。任何 URL、iframe、页面可访问都不能替代授权。
3. **游戏玩法不受法律保护，但 UI、美术资源、代码受保护。** 模仿玩法并自研是合规路径之一；如果沿用原名称、角色、音乐、关卡素材或代码，需要逐项确认权利。
4. **用游戏名做域名或页面时，先查该名称是否已注册商标。** 例如 “Friday Night Funkin'”、知名角色名或商业游戏名；商标查询不能只依赖搜索引擎，应使用目标市场的商标数据库并保留查询记录。

## 五、免责声明

本文件基于 2026-08-27 可获得的公开页面、官方文档、GitHub 仓库和公开响应头扫描结果整理，仅用于内部合规评估，不构成法律意见。以各平台最新条款、协议、隐私政策、实际后台流程为准；涉及商业授权、商标查询、内容再分发或跨国部署的最终确认，需由合格律师或人工法务复核完成。
