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
| omofuns | 1.0 | 2026-11-18 |
| yinghuadm | 1.0 | 2026-11-18 |
<!-- RULES:END -->

## License

[MIT](LICENSE)
