# v2.1.0 - The "Clean Build" Release

## 🐛 Critical Fixes

**UUID Generation & Validation**:
- **Completely rebuilt** the UUID generator to guarantee 36-character standard UUIDs.
- Fixed an issue where stale frontend code was causing truncated IDs (e.g. 19-char strings).
- Added strict length validation in the interface.

**Build Process**:
- Fixed the release pipeline to ensure new frontend code is *actually* included in the backend binary.

## 🔄 Upgrade

```bash
bash <(curl -Ls https://raw.githubusercontent.com/undead-undead/x-ui-lite-v2/main/install.sh)
```
