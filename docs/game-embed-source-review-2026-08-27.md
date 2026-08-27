# 可自托管游戏源码核查（2026-08-27）

> 核查范围：下一批候选 HTML5 小游戏的具体源码仓库、许可证文件、运行时外部请求、文件规模与 iframe 适配度。  
> 平台级授权（GameDistribution、Poki、Scratch、Cocrea 等）另见 `docs/game-source-license-review-2026-08-27.md`。  
> 结论纪律：许可证以仓库内的 LICENSE 文件为准；README 只写“MIT”但没有 LICENSE 文件的一律降级；未完成下载或出现外部资产来源不明的一律写“待人工确认”。

## 结论

第二期建议优先走“MIT 源码 + 本地自托管”路线，第一批只做 4 类：

1. **Snake**：优先 `sen-ltd/snake`，已本地验证无运行时外部请求、34 个测试全部通过。
2. **Tic Tac Toe**：优先 Codeberg `FrankenBit/tic-tac-toe`（单文件、零依赖、MIT）；若无法及时下载，用 `addiebart/tictactoe` 作基础并做逻辑与可访问性重构。
3. **Memory Match**：优先 `mmenavas/memory-game`，MIT、无 CDN、逻辑简单；上线前把交互元素改成真正的 button/可访问控件。
4. **Math Facts Quiz**：优先 `JitenRajpurohit/Math-Quiz-Game`，MIT、布局本身移动端友好；必须移除或本地化 SweetAlert2 CDN。

不建议把 `sausi-7/games` 的目录整包复制进站；仓库 MIT 是仓库级许可，不代表每个游戏目录里的字体、音频、美术和第三方嵌入页都已清理。

## 一、绿色候选（可直接自托管或仅需小改）

### 1. Snake：sen-ltd/snake

| 项目 | 结论 |
| --- | --- |
| 来源 | <https://github.com/sen-ltd/snake> |
| 核对版本 | `ced458e`，2026-05-02 |
| 许可证 | MIT，LICENSE 文件存在；Copyright (c) 2026 SEN LLC |
| 运行时外部请求 | 无；`index.html` 只引用本地 `style.css` 和本地 ES module |
| 体积 | 核心运行时 5 个文件约 23 KB；Safari/README 等文档不进入站内 |
| 测试 | `node --test tests/snake.test.js`：34/34 通过 |
| 输入 | 键盘（方向键/WASD、空格/Enter、P 暂停）+ 触屏滑动 |
| iframe 适配 | canvas 自动取容器宽高的较小值，上限 560px；可放进桌面 680px 和移动端 520px iframe |
| 本地状态 | 仅使用同源 `localStorage` 保存最高分 |

**接入前应做的小改：**

- 只复制 `index.html`、`style.css`、`src/` 和 `LICENSE`；删除 screenshot、tests、README、package 文件。
- 在内嵌页 `<head>` 加 `noindex`，把 title 改为适合本站的内嵌页标题。
- 保留 LICENSE 与作者信息；如需改名，请在页面说明“基于 MIT 项目 SEN LLC Snake 修改”。
- 可选：移除 EN/JA 切换、自动演示和主题选择，减少 iframe 内控件；保留核心游玩、暂停、重开和最高分即可。

### 2. Tic Tac Toe：FrankenBit/tic-tac-toe（首选）或 addiebart/tictactoe（次选）

#### FrankenBit/tic-tac-toe

| 项目 | 结论 |
| --- | --- |
| 来源 | <https://codeberg.org/FrankenBit/tic-tac-toe> |
| 许可证 | MIT；README 描述中存在 MIT LICENSE |
| 技术形态 | 单文件 HTML、无构建系统、无运行时依赖 |
| 说明 | 2026-07 发布，适合直接裁成低复杂度嵌入页 |
| 核查状态 | 本地 `git clone` 在核查窗口内遇到 Codeberg 429/连接超时，源代码尚未逐行验证 |

接入前必须先重新下载并核对：单文件是否确实自包含、LICENSE 是否与 README 一致、是否有第三方链接或外部资源、棋盘是否可在 520px 高度内完整显示。

#### addiebart/tictactoe

| 项目 | 结论 |
| --- | --- |
| 来源 | <https://github.com/addiebart/tictactoe> |
| 核对版本 | `fa1d06e`，2021-12-05 |
| 许可证 | MIT，LICENSE 文件存在；Copyright (c) 2021 Addie |
| 运行时外部请求 | 无 CDN / 无网络字体；只有 GitHub 角标、source 链接和 `og:url` 元数据是外部线索 |
| 代码规模 | 5 个文件约 13 KB |
| iframe 适配 | 棋盘 512px、`max-height: 60%`，可在 520px 移动 iframe 内自适应；但小屏下棋格偏小 |
| 主要问题 | 允许重复落子、胜利后仍可继续点击、胜负判断与重开逻辑需要重构；`.button`、`div` 不是原生 button，键盘可访问性不足 |

若采用这个仓库，务必重写为：不可重复落子、胜利/平局后锁定棋盘、用原生 `<button>`、移除 GitHub 角标和外链、保留 LICENSE。

### 3. Memory Match：mmenavas/memory-game

| 项目 | 结论 |
| --- | --- |
| 来源 | <https://github.com/mmenavas/memory-game> |
| 核对版本 | `7da33da`，2019-03-07 |
| 许可证 | MIT，`LICENSE.txt` 存在；Copyright (c) 2017 Maximo Mena |
| 运行时外部请求 | 无 CDN、无网络字体；所有图片为仓库内本地文件 |
| 代码规模 | HTML/CSS/JS/两张界面图约 31 KB；15 张水果图约 520 KB |
| 逻辑 | 纯 JS 的 2×3、3×4、4×5、5×6 难度；已通过 `node --check` |
| iframe 适配 | 卡片按容器尺寸重排，默认 90% 高度 + 10% 菜单；可压进 520px iframe |
| 主要问题 | 用的是 `<a href="#">`/`<li>` 模拟按钮，无 `lang`、无 `aria-label`、无焦点样式；部分图片 alt 为空 |

**接入前应做的小改：**

- 使用原生 button/正确语义，补键盘焦点与屏幕阅读器状态。
- 删除 `console.log`、外部作者信息和未使用文件。
- 保留 `LICENSE.txt`；若担心水果图片来源，可在发布前用自绘 SVG/emoji 替换，或在仓库外保留图片来源记录。

### 4. Math Facts Quiz：JitenRajpurohit/Math-Quiz-Game

| 项目 | 结论 |
| --- | --- |
| 来源 | <https://github.com/JitenRajpurohit/Math-Quiz-Game> |
| 核对版本 | `d429749`，2026-01-09 |
| 许可证 | MIT，LICENSE 文件存在；Copyright (c) 2025 Vector Static |
| 核心代码 | 3 个文件约 18.6 KB；已通过 `node --check` |
| 模式 | 5 档难度、计时、分数、键盘/触屏易用的数字键盘 |
| 运行时外部请求 | `<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>` |
| iframe 适配 | 单列卡片最大宽 400px，菜单/答题屏幕均适合竖屏移动 iframe |

**接入前应做的小改：**

- 把 SweetAlert2 替换为本站自己的原生 `<dialog>`/提示条；不要依赖 jsDelivr。
- 保留 MIT LICENSE、作者与修改说明。
- 页面名称建议叫 `Math Facts` 或 `Math Quiz`，不要暗示是某个商业品牌。

## 二、黄色候选（需额外授权或改造，不直接复制）

### sausi-7/games

- 仓库整体是 MIT（Copyright 2026 Saurabh Singh），但其 README 明确说明游戏主要是 Phaser/Three.js。
- 抽查 `games/arcade/snake`、`games/board/tic-tac-toe`、`games/puzzle/memory`、`games/word-quiz/math-quest`：
  - 每个游戏页都从 `cdn.jsdelivr.net/npm/phaser@3.60.0` 加载引擎；
  - `math-quest` 的 mechanics 还调用 Google WebFont；
  - 4 个目录共 104 个文件、约 14.9 MB；
  - `games/puzzle/memory/hdjdkd.html` 是第三方 Next.js 嵌入页，包含 Google Analytics、Firebase、`games.chaoswale.in` iframe 和外部字体。
- 结论：仓库 MIT 不代表每个子目录里的音频、TTF、PNG、第三方页面都适合直接再分发。
- 如果使用，必须：只提取确认过的游戏目录；把 Phaser 3.60 下载到本地并保留 MIT 声明；删除 `hdjdkd.html`；逐个确认美术/音频来源；控制体积。

### tirthajyoti-ghosh/tic-tac-toe-js

- README 写 MIT，但仓库没有 LICENSE 文件。
- `style.css` 从 Google Fonts 导入 Nunito。
- 有逻辑测试，但运行依赖外部字体，授权文件不完整。
- 结论：可以作为编写/测试参考，不建议直接作为生产来源；若使用，先补 MIT 文本、作者声明，并把字体本地化。

### abhas9/escape-run

- MIT、零运行时依赖、多组单元测试，代码结构完整。
- 但仓库包含约 1.5 MB 音频，README 明确说明语音由 ElevenLabs 生成；tools 里有 ElevenLabs API 生成脚本。
- ElevenLabs 生成的音频在商用/再分发前需要按平台条款单独确认；且该游戏是完整 PWA，包含服务工作者、成就、任务、家长区等，改造为 iframe 单页成本较高。
- 结论：先确认音频授权；若只需基础数学问答，优先用更小的 Math-Quiz 改造版或原创版本。

### CorentinTh/mini-snake

- MIT、单 HTML 文件约 402 字节，无外部请求。
- 只有键盘方向键，可通过边界、无分数/暂停/重开，适合代码参考，不适合课堂生产环境。

## 三、不建议直接使用的候选

### jsdevspace/snake-js

- README 声明 MIT，但仓库没有 LICENSE 文件。
- `js/game.js` 把所有图片和 WAV 都写成 `https://jsdevspace.github.io/snake-js/...` 绝对地址。
- 音频约 3.1 MB；没有测试。
- 若不先修改为相对路径、补正式 LICENSE 并核实音频与图片来源，不建议上线。

### Shivam010/TicTacToe

- 仓库有 LICENSE，但使用 Spider-Man 壁纸、Google Fonts 和本地 jQuery。
- 壁纸/游戏角色属于明显第三方 IP 风险；不建议使用。

### Kashish-tech2077/Memory-Game

- 仓库有 MIT LICENSE。
- 运行时依赖 Font Awesome CDN 和 Google Fonts；README 头图/图片来源未逐项说明。
- 如果使用，必须去掉 CDN、替换图片并确认素材授权；不如 mmenavas/memory-game 干净。

### UdayVaidya/Tic-Tac-Toe、s-faisal/tic-tac-toe

- 两个仓库都是轻量 HTML/CSS/JS，但都未发现 LICENSE 文件。
- 不做生产来源；可在自研时参考结构。

## 四、接入清单（任意候选用）

1. 只复制生产运行时文件 + LICENSE；不要复制 `node_modules`、`package-lock`、`reference/`、screenshot 或 CI 文件。
2. 用 `rg -n "https?://|src=|href=|fetch\\("` 检查每个内嵌目录；只允许同源相对路径。
3. 内嵌页必须添加 `noindex`，保持与 `index.html` 的 iframe title、页面名称一致。
4. 删除外链、社交媒体元数据、分析脚本、广告脚本和不必要的品牌内容。
5. 保留原 LICENSE、copyright 和修改说明；MIT 复制不能删除版权行。
6. 页面标签优先用中性名称：`Snake`、`Tic Tac Toe`、`Memory Match`、`Math Facts`；不要在页面/alt/schema 中冒充商业游戏品牌。
7. 内嵌页应适配 680px 桌面和 520px 移动 iframe，无内部横向滚动，键盘/触屏均可操作。
8. 对每个页面执行：`node --check`、候选自带测试、`rg` 外部请求检查、iframe 目测/截图检查。
9. 游戏页底部或 LICENSE README 中记录来源仓库、commit hash、接入日期和改动内容。
10. 首页选项卡、iframe title、VideoGame/FAQ 结构化数据、正文文案必须使用同一个中文翻译一致的游戏名。

## 五、本次核查方法

所有候选在 2026-08-27 下载到临时目录，使用 `git clone --depth 1` 获取；通过文件列表、`rg`、`node --check`、自带测试和本地源码阅读完成核查。核心验证结果：

- `sen-ltd/snake`：34 个测试通过；`node --check` 3 个模块通过；运行时无外部 URL。
- `mmenavas/memory-game`：3 个 JS 文件 `node --check` 通过；运行时无外部 URL。
- `JitenRajpurohit/Math-Quiz-Game`：script.js `node --check` 通过；唯一运行时外部请求是 SweetAlert2 CDN。
- `sausi-7/games`：抽查 4 个目录共 104 个文件、约 14.9 MB；全部使用 Phaser CDN，其中 memory 目录包含第三方 Next.js 嵌入页。
- `jsdevspace/snake-js`：无 LICENSE 文件；源码中 10 处以上 GitHub Pages 绝对资源地址。

> 本文只做技术来源与许可证证据整理，不构成法律意见。正式上线前仍需由站点负责人确认实际商标搜索、美术/音频来源和 MIT 版权通知是否完整保留。

## 补充核查：剩余候选（2026-08-27 二次核对）

### SK8-infi/OpenCade

- 仓库有 MIT LICENSE（Copyright 2025 Games for Beginners Contributors），最近提交 `b690204`，2026-02-05。
- 采用“社区贡献 + 槽位”模式，仓库内大量目录仍为 `Game-06`、`Game-08` 等占位名；没有逐游戏作者/素材来源清单。
- 首页、游戏大厅和多个子游戏加载 Google Fonts（Inter/Orbitron/Poppins），并带共享站点头部、IEEE logo、外链和分享按钮。
- 每个游戏页通常还引用 `../../css/main.css` 或本站目录，无法原样作为独立 iframe。
- 结论：只能提取单个游戏脚本后重写独立页面，并逐个确认贡献者和素材来源；不能因仓库 MIT 就整包复制。

### ellisonleao/clumsy-bird

- 最后提交 `fae3d48`（2017-06-16），提交信息明确为 `Change LICENSE to GPLv3`；仓库 `LICENSE.md` 是 GPL-3.0 全文。
- 此前 `github-similar-game-sites.md` 把它列为 MIT 的结论需要更正。
- 运行时把 melonJS 与游戏脚本本地打包，无 CDN；但包含大量本地图片、字体、MP3/OGG/WAV，以及社交分享、部署和公开信息。
- 若采用，必须遵守 GPL-3.0 的源码提供和许可保留义务；游戏仍是 Flappy Bird 类克隆定位，不应直接使用品牌名和原素材。
- 结论：不建议作为第二期 MIT 自托管来源。

### Hextris/hextris

- README 与 `LICENSE.md` 均为 GPL-3.0；作者为 Logan Engstrom、Garrett Finucane、Noah Moroze、Michael Yang。
- 最近提交 `3f4847d`，2022-02-08。
- 页面源码包含 Google Analytics、AdSense、Google Fonts、jQuery、Hammer.js、SweetAlert、Font Awesome、分享按钮、App Store / Google Play 链接。
- 若要生产使用，需要彻底删除广告/分析和社交代码，确认字体与图标许可，并处理 GPL 合规；不适合第一批量产。
- 结论：只作为“块状益智”技术参考，或后续在确认 GPL 义务后单独处理。
