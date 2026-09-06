# 安全策略

> [English version →](../docs/SECURITY_EN.md)

## 受支持的版本

仅最新正式版接受安全修复。

## 受支持的平台

正式发布与安全修复覆盖 **Windows 11 桌面端** 和 **Web Preview**。

`Cargo.lock` 里包含 Tauri 上游为 macOS/Linux 引入的依赖。这些依赖照常纳入扫描；若告警只影响尚未发布的平台，会记录评估依据并跟踪上游。

## 报告漏洞

请不要通过公开 Issue 报告安全漏洞，改用以下任一私下渠道：

- **GitHub 安全通告**（推荐）：在 [Security Advisories](https://github.com/MrBaoboer/PayDance/security/advisories/new) 提交
- **电子邮件**：使用[作者 GitHub 首页](https://github.com/MrBaoboer)公示的邮箱，主题注明 `[SECURITY]`

报告中请包含漏洞描述、复现步骤、受影响版本，以及你已发现的缓解措施。

### 预期流程

- **确认**：72 小时内
- **评估**：5 个工作日内
- **修复**：取决于严重程度，高危优先
- **披露**：修复版本发布并给用户留出更新时间后

## 本地数据与敏感信息

薪资、工作时间与偏好设置只保存在本机应用数据目录的 `salary-settings.json`，不会发送到远程服务器。该文件含有个人信息，不要对外分享。

任何公开渠道都不要粘贴薪资数据、配置文件、日志，以及私钥、签名密钥等凭据。
