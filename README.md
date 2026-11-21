# kazumi-rules

[Kazumi](https://github.com/Predidit/Kazumi) 的第三方规则托管仓库，一个规则文件对应一个站点。

## 怎么用

在 Kazumi 的「规则管理 / 导入规则」里添加本仓库的 raw 地址：

```
https://raw.githubusercontent.com/violetACER/kazumirules/main/index.json
```

Kazumi 读取 `index.json` 拿到规则清单，再按条目里的 `name` 下载同名 `*.json`。

## Contributing Guidelines 贡献指南

- 只提交或更新规则文件（`*.json`）
- **不要**手动改 `index.json` 和 `README.md`，它们由 CI 自动生成
- 文件名必须与规则里的 `name` 字段一致（一个站点一个文件）
- 必需字段：`name`、`version`、`useNativePlayer`（布尔）
- 规则废弃时在文件里加 `"deprecated": true`，CI 会把它从索引里剔除（文件保留，已有用户不受影响）

提交后 GitHub Actions 会自动跑 `script/update_index.mjs`，生成 `index.json` 与下面的规则表。

本地也可以先自查，不需要任何额外依赖：

```bash
node script/update_index.mjs
```

规则怎么写、怎么校验、怎么探测，见 [kazumi-rules-skill](https://github.com/ChouChiu/kazumi-rules-skill)；社区规则可以参考 [Predidit/KazumiRules](https://github.com/Predidit/KazumiRules)。

## API Level

| API Level | Kazumi Version | Post Support* | Referer Support | Legacy Parser Support† | HLS Ad Filtering |
|-----------|----------------|---------------|-----------------|------------------------|------------------|
| 1 | >= 1.0.0 | ❌ | ❌ | ❌ | ❌ |
| 2 | >= 1.3.0 | ✅ | ❌ | ❌ | ❌ |
| 3 | >= 1.3.6 | ✅ | ✅ | ✅ | ❌ |
| 4 | >= 1.6.8 | ✅ | ✅ | ✅ | ❌ |
| 5 | >= 1.9.3 | ✅ | ✅ | ✅ | ✅ |

**Post Support\***：从 API Level 2 起可用，用 POST 代替 GET 查询搜索结果。
**Legacy Parser Support†**：从 API Level 3 起可用，基于 iframe src 的旧式解析器，某些站点比 JS hook 更可靠。
**HLS Ad Filtering**：从 API Level 5 起可用，播放前过滤 HLS 清单里的广告分片。

## Available Rules

<!-- RULES:START -->
| Name | Version | Last Update |
|------|---------|-------------|
| 7sefun | 2.0 | 2026-11-19 |
| aafun | 1.2 | 2026-11-18 |
| AGE | 1.6 | 2026-11-18 |
| akianime | 1.0 | 2026-11-18 |
| anime1 | 1.0 | 2026-11-19 |
| animoe | 1.0 | 2026-11-19 |
| avbebe | 1.0 | 2026-11-19 |
| baimao | 1.0 | 2026-11-18 |
| dalvdm | 1.2 | 2026-11-18 |
| DM84 | 1.4 | 2026-11-18 |
| ezdmw | 1.2 | 2026-11-18 |
| FQDM | 2.1 | 2026-11-19 |
| giriGiriLove | 2.7 | 2026-11-18 |
| LMM | 2.4 | 2026-11-18 |
| mgnacg | 1.2 | 2026-11-18 |
| moonci | 1.1 | 2026-11-18 |
| mutefun | 1.6 | 2026-11-18 |
| MXdm | 2.4 | 2026-11-18 |
| omofuns | 1.0 | 2026-11-18 |
| sorani | 1.0 | 2026-11-18 |
| TvTFun | 1.3 | 2026-11-18 |
| xfdmneo | 1.1 | 2026-11-18 |
| xfdmnext | 1.1 | 2026-11-18 |
| xifan | 1.0 | 2026-11-18 |
| yhdmat | 1.0 | 2026-11-18 |
| yinghuadm | 1.0 | 2026-11-18 |
<!-- RULES:END -->

## 规则来源

仓库里的规则分两类：

- **本仓库自行维护并实测**：`yinghuadm`、`omofuns`、`akianime`（含选择器与反爬配置的完整验证记录，见各自站点目录下的说明）。
- **同步自社区仓库**：[Predidit/KazumiRules](https://github.com/Predidit/KazumiRules)，MIT 许可，Copyright (c) 2024 Predidit。同步时跳过 `index.json` 与同名文件，保留上游规则文件原样。

署名与许可见 [NOTICE](NOTICE)。若上游规则与本站维护版本同名（目前是 `akianime`），以本站版本为准。

## 已废弃规则

文件保留，但已加 `"deprecated": true`，不会出现在上面的规则表与 `index.json` 里：

- ~~`hciyuan`（H次元，v1.0）~~ — 站点在 Cloudflare Bot Management 后面，按 TLS 指纹与请求头组合拦截非浏览器客户端。实测：纯 Python / curl_cffi 能拿到结果，node fetch 与 Kazumi 的 dio 客户端被挡（403 挑战页或连接重置），而 XPath 规则无法给搜索请求自定义请求头，因此 **在 Kazumi 里任何关键词都会检索失败**。页面结构本身没变（`?s=` + `gridview-grid-post-details` 卡片 + canonical 作单集锚点），若日后站点放开可直接恢复。

## License

[MIT](LICENSE)
