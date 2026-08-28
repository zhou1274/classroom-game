# classroomgame.github.io 与同类站小游戏来源追踪（2026-08-28）

> 本文记录的是“这些游戏到底从哪里加载”，目标是判断哪些来源可以合法复用，哪些只能作为现象参考。  
> 方法：抓取公开仓库、逐层检查 iframe / data-embed、查询 GitHub/GitLab 仓库与 LICENSE，不对二手描述做推断。

## 1. 总结论

`classroomgame.github.io` 不是一个“自托管游戏源码”的游戏站，而是一个 **game aggregator / 包装站**：

- 公开仓库：<https://github.com/classroomgame/classroomgame.github.io>
- `main` 分支只有 README；线上文件在 `master` 分支。
- `master` 共 1149 个文件，其中 420 个是 `embed/*.html`。
- 仓库没有 LICENSE 文件，GitHub API 返回 `license: null`。
- 游戏代码本体不在该仓库中；游戏页面 is iframe 到第三方 GitHub Pages / GitLab Pages / 独立域名。
- 上游大多数是无 LICENSE 的转载或克隆版本，不能视为可合法再分发的开源代码。

## 2. classroomgame.github.io 的 420 个 embed 来源分布

对 `embed/*.html` 批量提取 `data-embed` 或 iframe `src` 后，主机分布如下：

| 来源域名 | embed 数量 | 占比 | 说明 |
| --- | ---: | ---: | --- |
| `jasongamesdev.github.io` | 229 | 54.5% | 静态文件公开；账号 `public_repos = 0`，无公开源码仓库 |
| `ubg98.github.io` | 102 | 24.3% | 205 个公开仓库；抽查的 1010ColorMatch 等无 LICENSE |
| `ubgwtf.gitlab.io` | 37 | 8.8% | 多为 Ruffle/SWF Flash 游戏；未找到可核对的 LICENSE |
| `cmug.gitlab.io` | 7 | 1.7% | 含 `cloner-v3-2.js`，canonical 指向 `freezenova.ubg235.com` |
| `fireboyandwatergirlunblocked.github.io` | 5 | 1.2% | 公开静态文件，未发现 LICENSE |
| `htmlxm.github.io` | 4 | 1.0% | Ruffle Flash 包装页，无 LICENSE |
| `script.google.com` | 4 | 1.0% | Google Apps Script 端点，不应视为游戏源码 |
| `fnafunblocked.github.io` | 3 | 0.7% | 公开静态文件，未发现 LICENSE |
| 其他 29 个单游戏域名 | 29 | 6.9% | 每个 1 个，基本都是同类 GitHub/GitLab 克隆 |

其余单游戏来源示例：`1v1lolunblocked.com`、`ageofwarunblocked.github.io`、`baconmay-die.github.io`、`majesticwafer.github.io`、`freecellsolitaire.github.io`、`motox3munblocked.github.io`、`toydefense.github.io`、`trucktrials.github.io` 等。

## 3. 逐层追查示例

### 3.1 2048

```text
https://classroomgame.github.io/2048.html
  -> https://classroomgame.github.io/embed/2048.html
    -> https://jasongamesdev.github.io/2048/
      -> games/2048-master/js/*.js
```

来源特征：这是原版 Gabriele Cirulli 2048 的文件结构，但托管方没有公开 Git 仓库，也没有 LICENSE 文件。  
结论：代码在浏览器可见，但不构成可复用授权。

### 3.2 1010 Color Match

```text
embed/1010-color-match.html
  -> https://ubg98.github.io/1010ColorMatch/
```

来源特征：

- 页面标题含 `ubg235 Poki`
- 页面引用 `patch/js/poki-sdk.js`
- 页面引用 `js/ubg235_client_v1_1.js`
- 仓库 `ubg98/1010ColorMatch` 公开，但 GitHub API 显示无 LICENSE
- 是 Defold/HTML5 构建产物，不是可维护的项目源码

结论：可以认为它是 Poki/UBG235 生态的再分发版本，但仓库没有授权证明，不适合直接复用。

### 3.3 Bloons Tower Defense 3

```text
embed/bloons-tower-defense-3.html
  -> https://ubgwtf.gitlab.io/bloons-tower-defense-3/
```

来源特征：页面使用 `js/embed.js`、`js/flash_detect.js`，`GAME.extension = 'SWF'`，是 Flash + Ruffle 的旧游戏包装。  
结论：Flash 资产来源和版权不明确，不纳入生产候选。

### 3.4 Infinite Craft

```text
embed/infinite-craft.html
  -> https://cmug.gitlab.io/infinite-craft/
```

来源特征：

- 页面加载 `cloner-v3-2.js`
- canonical 指向 `https://freezenova.ubg235.com/?nova-craft.html`
- 是 FreezeNova / UBG235 系列的克隆包装

结论：不能作为原始源码使用。

### 3.5 Fleeing the Complex

```text
embed/fleeing-the-complex.html
  -> https://htmlxm.github.io/h7/fleeing-the-complex
```

来源特征：`ruffle.js` + RufflePlayer，加载 Flash 游戏。  
结论：是 Flash 重打包，无许可证，不能复制。

### 3.6 Blumgi Rocket

```text
embed/blumgi-rocket.html
  -> https://majesticwafer.github.io/BlumgiRocket/
```

来源特征：

- Construct 3 构建产物
- 引用 `poki-sdk.js`、`ubg235_client_v1_1.js`
- `majesticwafer` 有 69 个公开仓库，抽查仓库无 LICENSE

结论：源码文件可下载，但来自商业/第三方游戏生态，缺少授权证明。

### 3.7 1v1 LOL

```text
embed/1v1lol.html
  -> https://1v1lolunblocked.com/games/1v1-lol/index.html
    -> https://1v1lolreloaded.com/index.html
```

结论：最终 iframe 到无关第三方站点，未发现官方授权链，禁止作为生产来源。

### 3.8 Mob City

```text
embed/mob-city.html
  -> https://iframe.unblocked-76-games.org/mob-city-main
```

来源特征：Unity `Build/*.json` + `UnityLoader.js`。  
结论：Unity 构建产物公开可下载，但无 LICENSE 和原作者授权证明。

## 4. 同类站的来源模式

### 4.1 classrooms6xunblocked.github.io

- 仓库：<https://github.com/classrooms6xunblocked/classrooms6xunblocked.github.io>
- 站点：<https://classrooms6xunblocked.github.io/>
- 仓库无 LICENSE。
- `2048-unblocked.html` 实际加载：
  - <https://0x0800.github.io/2048-CUPCAKES/>
- `0x0800/2048-CUPCAKES` 是公开仓库，GitHub API 显示 **MIT LICENSE**
- `slope-unblocked.html` 实际加载：
  - <https://staticquasar931.github.io/slope/>
- `StaticQuasar931` 有 359 个公开仓库，大多数没有 LICENSE；Slope 页面调用 `UnityLoader.js`，属于静态构建产物

结论：这个站混合了“真正 MIT 的 2048 变体”和“无 LICENSE 的第三方克隆”。

### 4.2 ubghyper.github.io

- 站点：<https://ubghyper.github.io/>
- 所有者：<https://github.com/UBGHyper>
- 站点仓库 `UBGHyper/GameList.github.io` 公开，但无 LICENSE。
- `play-new.js` 通过 `gamePlayUrl(g)` 加载：

```text
https://ubghyper.github.io/{shard}/{slug}/
```

- `SHARD_CDN` 固定使用这些 jsDelivr 镜像：

| shard | 仓库 | 许可证 |
| --- | --- | --- |
| GameList.github.io | `UBGHyper/GameList.github.io` | 无 |
| gamelist2.github.io | `freeonlinewebtools/gamelist2.github.io` | 无 |
| gamelist3.github.io | `freeonlinewebtools/gamelist3.github.io` | 无 |
| gamelist4.github.io | `freeonlinewebtools/gamelist4.github.io` | 无 |
| gamelist5.github.io | `freeonlinewebtools/gamelist5.github.io` | 无 |
| gamelist6.github.io | `freeonlinewebtools/gamelist6.github.io` | 无 |
| gamelist7.github.io | `freeonlinewebtools/gamelist7.github.io` | 无 |
| gamelist8.github.io | `freeonlinewebtools/gamelist8.github.io` | 无 |
| gamelist9.github.io | `freeonlinewebtools/gamelist9.github.io` | 无 |

结论：UBGHyper 是“仓库大量公开、但游戏本身无许可证”的典型；适合看 SEO/工程实现，不适合复制游戏资源。

## 5. 来源分类与合规建议

### A 类：许可证明确、可本地自托管

适合本站继续使用的路径：

- `gabrielecirulli/2048`：MIT，已接入。
- `0x0800/2048-CUPCAKES`：MIT，可作为 2048 变体候选。
- 文档中已核实的 `sen-ltd/snake`：MIT，34 个测试通过。
- 文档中已核实的 Tic Tac Toe / Memory / Math 候选：MIT。
- `Radon-Games`：AGPL-3.0，但要确认子游戏与素材来源。
- `lunaar.org`：GPL-3.0，同样需要逐游戏检查。
- `dotgui-dev/DotGUI`：Apache-2.0。
- `sausi-7/games`：MIT，但仓库级许可证不能覆盖所有子游戏素材，需逐目录检查。

### B 类：官方平台授权嵌入

如果走“正规平台接入”：

- GameDistribution：需要注册开发者、注册游戏、获得 Game ID，再使用官方 SDK/嵌入代码。<https://developer.gamedistribution.com/>
- Poki：需要成为 Poki 合作伙伴并获得 SDK/嵌入许可。
- CrazyGames：需要开发者/发布商账号。
- Y8、Friv 等也有各自的合作与嵌入规则。

官方平台的共同点是：**必须申请账号、审核游戏、遵守广告与 SDK 要求**。不存在“从别人站点复制 iframe 就合法”的捷径。

### C 类：公开但无 LICENSE

典型：

- `jasongamesdev.github.io`
- `ubg98.github.io`
- `majesticwafer.github.io`
- `ubgwtf.gitlab.io`
- `cmug.gitlab.io`
- `htmlxm.github.io`
- `StaticQuasar931` 的大多数游戏仓库
- `UBGHyper/GameList.github.io`
- `freeonlinewebtools/gamelist2-9.github.io`

这些文件因 GitHub Pages / GitLab Pages 可以被浏览器下载，但**可下载不等于可公开复制**。GitHub 没有 LICENSE 时，默认只保留版权，不授予再分发权。

### D 类：直接 iframe 第三方商业/未知站点

例如 1v1 LOL、各种 `*.com` 游戏页。  
本站禁止作为生产来源；即使能播放，也不代表有权在自己的站点上继续嵌入。

## 6. 对 classroom-game.com 的执行建议

1. 不复制 `classroomgame.github.io` 的 embed 页面、文案、结构或资源链接。
2. 主游戏继续使用本地 MIT 2048。
3. 下一批游戏只从“许可证明确 + 运行时无外部请求 + 已通过本地检查”的仓库选择。
4. 需要用大量第三方游戏时，先注册 GameDistribution / Poki / CrazyGames 等官方发布商，使用官方嵌入方式。
5. 每次添加游戏都记录：上游仓库、commit、LICENSE、接入日期、改动内容、外部请求检查结果。

## 7. 主要证据链接

- <https://github.com/classroomgame/classroomgame.github.io>
- <https://api.github.com/users/classroomgame>
- <https://classroomgame.github.io/embed/2048.html>
- <https://jasongamesdev.github.io/>
- <https://github.com/jasongamesdev>
- <https://github.com/ubg98>
- <https://github.com/majesticwafer>
- <https://github.com/StaticQuasar931>
- <https://github.com/0x0800/2048-CUPCAKES>
- <https://github.com/UBGHyper>
- <https://github.com/freeonlinewebtools>
- <https://ubghyper.github.io/assets/js/utils.js>
- <https://ubghyper.github.io/assets/games.json>
- <https://developer.gamedistribution.com/>
- <https://github.com/GameDistribution/gd-defold>


## 8. 第一批实际迁移记录（2026-08-28）

| 本地目录 | 上游页面 | 运行时处理 |
| --- | --- | --- |
| `assets/games/cupcake-2048` | `https://jasongamesdev.github.io/cupcake-2048/` | 已移除 Google Fonts 外链 |
| `assets/games/wordle` | `https://jasongamesdev.github.io/wordle/` | 已移除 `./js` Google Analytics 脚本 |
| `assets/games/minesweeper` | `https://jasongamesdev.github.io/minesweeper/` | 全本地，无外部依赖 |
| `assets/games/snake` | `https://jasongamesdev.github.io/snake.io/` | Unity 本地 Build；Poki SDK 替换为无网络 stub |
| `assets/games/tic-tac-toe` | `https://jasongamesdev.github.io/Tic-Tac-Toe/` | CreateJS 本地资源；Poki SDK 替换为无网络 stub |

- 迁移使用 `tools/asset_mirror.py`：Playwright 捕获同源请求后写回 `assets/games/<slug>/`。
- 所有内嵌页已加 `noindex, follow`，不参与独立索引。
- Snake 的 Unity data/wasm 已手动从上游补齐；本地运行不再请求外部域名。
