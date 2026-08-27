# Railway 静态托管部署说明（2026-08-27）

> 本仓库当前同时适用于 Vercel 与 Railway。站点本体仍是纯静态 HTML/CSS/JS，不需要构建步骤。

## 1. 选择 Railway 的原因

- Railway 支持从 GitHub 自动部署，推送即可更新。
- Railway 自动签发并续期 SSL 证书，支持自定义域名。
- 当前项目没有数据库、后台服务或常驻进程，只需一个轻量静态服务，使用 Caddy 即可。
- 你已在 Railway 上管理其他项目，把 classroom-game 放在同一平台可以统一查看账单、部署记录和自定义域名。

## 2. 新增的部署文件

| 文件 | 用途 |
| --- | --- |
| `Dockerfile` | 使用官方 Caddy 镜像直接提供静态文件，不执行前端构建 |
| `Caddyfile` | 监听 Railway 注入的 `$PORT`，开启 gzip、安全响应头和 404 页 |
| `.dockerignore` | 排除文档、测试、截图与游戏源码说明，减小构建上下文 |

不需要 `railway.json`：Railway 检测到 `Dockerfile` 后会按 Docker 方式部署。也可以删除这三个文件，让 Railway 自动识别为纯静态站；但显式 Caddy 配置可以确保自定义 404 和响应头行为稳定。

## 3. Railway 部署步骤

1. 打开 <https://railway.com/new>。
2. 选择 `Deploy from GitHub repo`。
3. 连接 GitHub，选择 `zhou1274/classroom-game`。
4. Railway 自动识别 `Dockerfile` 并创建服务；等待部署完成。
5. 打开服务 `Settings` → `Networking`，添加 `classroom-game.com` 与 `www.classroom-game.com`（可选）。
6. 按 Railway 给出的目标，在 Cloudflare 创建 CNAME：
   - `classroom-game.com` → Railway 提供的目标
   - `www.classroom-game.com` → 指向主域名或 Railway 目标
7. 如果通过 Cloudflare 代理，建议把 SSL/TLS 设为“完全（严格）”，并确认源站证书由 Railway 自动签发。
8. 部署完成后验证首页、`/games/snake-unblocked.html`、未知路径 404、`/robots.txt`、`/sitemap.xml` 和 iframe 游戏。

## 4. 域名与 SEO 注意

- `index.html` 的 canonical、OG 和结构化数据已经使用 `https://classroom-game.com/`。
- `sitemap.xml` 使用绝对地址，迁移托管平台无需修改站点内容。
- 如果暂时使用 Railway 提供的 `*.up.railway.app` 地址，请不要正式提交该地址；正式上线前应绑定并验证正式域名。
- Railway 的预览环境（PR Environments）会生成临时域名，不影响正式环境的 SEO。

## 5. Vercel 与 Railway 并存

当前不需要删除 Vercel 配置。Railway 使用 `Dockerfile`，Vercel 使用静态文件检测，二者互不冲突。迁移完成后，可以把 Vercel 项目暂停或删除，避免重复计费与重复站点。
