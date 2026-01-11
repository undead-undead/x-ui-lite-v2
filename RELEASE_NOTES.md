# X-UI-Lite v2.5.7 - Universal Static Release

This version provides the stability of v2.5.2 with the added benefit of **Universal Static Binaries**.

### 🌟 What's New?
- **Fixed "GLIBC not found"**: We have switched to a full Musl static build for the Panel, Xray, and Keygen. This fixes the issue where the software would fail to start on older VPS systems (like Debian 10).
- **v2.5.2 Logic Core**: We have returned to the stable connection logic you preferred, maintaining the matching behavior between the panel and the `keygen` tool.
- **Portability**: One package now works perfectly across different VPS providers and OS versions.

### 🛠 Installation & Upgrade

```bash
bash <(curl -Ls https://raw.githubusercontent.com/undead-undead/x-ui-lite/main/install.sh)
```

**Full Changelog**: [CHANGELOG.md](https://github.com/undead-undead/x-ui-lite/blob/v2.5.7/CHANGELOG.md)
