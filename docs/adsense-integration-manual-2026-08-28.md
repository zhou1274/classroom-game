# AdSense 接入操作手册

适用站点：https://classroom-game.com/  
建议使用 Google 账号：daliangzhou681@gmail.com  
站点联系邮箱：623837699@qq.com

## 一、上线前已准备事项

| 项目 | 状态 |
| --- | --- |
| Google Search Console 域名验证 | 已完成 |
| 首页已收录 | 已完成 |
| sitemap.xml | 已提交，427 个 URL，状态成功 |
| robots.txt | 已上传，包含 Sitemap 声明 |
| Privacy Policy | 已包含 Cookie、AdSense、Google Ads Settings、第三方广告商说明 |
| Terms of Service | 已上线 |
| About Us | 已上线 |
| Contact Us | 已上线 |
| Top Banner 广告位 | 已存在 |
| Middle Banner 广告位 | 已存在 |
| Bottom Banner 广告位 | 已存在 |
| 无 AdSense 代码时布局 | 不占空间，不影响阅读 |

广告位注释：

```html
<!-- AdSense Ad Slot: top banner -->
<!-- AdSense Ad Slot: middle banner -->
<!-- AdSense Ad Slot: bottom banner -->
```

## 二、第一步：申请 AdSense

1. 打开：

```text
https://adsense.google.com/start/
```

2. 使用 `daliangzhou681@gmail.com` 登录。

3. 如果该账号已有 AdSense，使用已有账户，不要重复创建。

4. 填写网站：

```text
https://classroom-game.com/
```

5. 按 AdSense 要求填写国家/地区、账户类型、联系电话、付款和税务信息。

6. 提交后等待审核。

## 三、第二步：拿到 AdSense 广告代码

审核通过后，进入 AdSense 后台：

```text
AdSense → 广告 → 按网站 → classroom-game.com
```

创建广告单元：

1. Top Banner 建议尺寸：728×90
2. Middle Banner 建议尺寸：响应式或 728×90
3. Bottom Banner 建议尺寸：响应式或 728×90

AdSense 会提供两部分代码：

- 网站级 `<script>` 代码
- 每个广告单元对应的 `<ins>` 代码

不要使用手动复制的旧代码，不要修改 `client`、`slot` 或 `data-ad-format` 中的正式参数。

## 四、第三步：将广告代码放入页面

### 1. 网站级脚本

在每个需要展示广告的页面 `<head>` 中，放入从 AdSense 后台复制的 `<script>` 代码。

当前适合插入的位置：

```html
<head>
  ...
  <!-- PASTE_AD_SENSE_SCRIPT_HERE -->
  ...
</head>
```

如果页面已经通过生成器生成，建议将脚本加入：

```text
tools/generate_game_pages.mjs
```

重新运行：

```bash
node tools/generate_game_pages.mjs
```

### 2. 广告单元

在对应的广告位内部，用 AdSense 后台复制到的 `<ins>` 替换注释位置：

```html
<div class="ad-slot">
  <!-- TOP BANNER: PASTE_ADSENSE_INS_HERE -->
</div>
```

插入位置说明：

| 位置 | 页面位置 |
| --- | --- |
| Top Banner | 顶部导航下方、H1 上方 |
| Middle Banner | 游戏 iframe 下方、SEO 内容区上方 |
| Bottom Banner | SEO 内容区后方、页脚上方 |

必须遵守：

- 不要将本站广告代码放入游戏 iframe 内部
- 不要用广告覆盖游戏区域
- 广告与游戏区域保持至少 16px 安全间距
- 广告代码失败时，页面布局不会被破坏

## 五、第四步：提交审核

广告代码接入并部署后，回到 AdSense 后台提交审核。

审核期间：

- 不要频繁修改 Privacy、Terms、About、Contact
- 不要删除 Contact 或隐私政策
- 不要让站点出现 404、空白页或大量重复页面
- 不要使用任何外部采集的广告代码
- 不要将广告覆盖在游戏 iframe 上

## 六、第五步：审核通过后开启广告

1. AdSense 后台显示“已批准”后，检查代码是否已部署。
2. 在“网站”页面确认 classroom-game.com 状态正常。
3. 开启展示广告。
4. 确认页面实际能看到广告。
5. 打开移动端测试，确认广告没有覆盖游戏区。

审核通过后还需要创建：

```text
ads.txt
```

内容必须从 AdSense 后台复制，不要使用网上示例或伪造的 `pub-` 编号。

## 七、第六步：地址核验 PIN

当账户收入达到 `$10` 左右，AdSense 会寄送 PIN 码信件进行地址核验。

处理方式：

1. 确认后台填写的地址正确。
2. 保留填写地址时的姓名和收件地址。
3. 收到信件后，登录 AdSense 填写 PIN。
4. 如果前三次未收到，可按 AdSense 后台提示申请重新寄送。
5. 地址核验完成前，广告收入可能无法最终结算。

## 八、第七步：填写收款信息

收入累计达到 `$100` 后，填写付款信息。

国内收款常用方式：

```text
国内银行卡
国际电汇 / SWIFT
```

需要准备：

- 银行账户名
- 开户银行
- 银行账号
- SWIFT/BIC 代码
- 银行地址

注意：

- 账户名必须与 AdSense 后台填写的一致
- 银行信息变更后，下一付款周期才生效
- 保持税务信息正确，避免付款被冻结

## 九、后续维护

每次增加游戏页后：

```bash
node tools/generate_game_pages.mjs
node tools/audit_seo.mjs
node tests/verify.mjs
node tests/verify-iframe-pages.mjs
```

升级 CSS/JS 后，同步修改：

```text
tools/generate_game_pages.mjs 中的 ASSET_VERSION
```

避免 Cloudflare 缓存旧资源。

## 十、回滚方法

如果广告异常：

1. 删除页面 `<head>` 中的 AdSense `<script>`。
2. 删除广告位中的 `<ins>`，保留 HTML 注释。
3. 重新生成并部署。

空广告位不会占空间，因此不会影响页面布局。

## 十一、Cloudflare 缓存与版本化文件

当前 CSS 暂时使用 `assets/css/style.css?v=20260828p`。

Cloudflare 可能忽略查询参数并继续返回旧文件，因此修改样式后：

1. 在 `tools/generate_game_pages.mjs` 中递增 `ASSET_VERSION`。
2. 确认 Railway 完成部署。
3. 检查线上 CSS 是否返回新规则。
4. 如果 Cloudflare 仍返回旧文件，清除该文件的缓存，或再使用独立的版本化文件名。
