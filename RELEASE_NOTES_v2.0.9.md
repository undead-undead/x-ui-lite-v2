# v2.0.9 - Fix Truncated UUIDs

## 🐛 Critical Fix

**Frontend UUID Generator**:
- Completely rewrote the UUID generation logic.
- Fixed an issue where the "Generate" button produced truncated/invalid UUIDs (e.g., `xxxx-xx-xx-xx-xxxxxx`).
- Added strict length validation: You can no longer save an inbound with an invalid UUID.

**Why this matters**:
Users reported that the generator was creating 16-char IDs instead of 36-char UUIDs, causing `xray-lite` to crash. This update ensures all generated IDs are compliant.

## 🔄 Upgrade

```bash
bash <(curl -Ls https://raw.githubusercontent.com/undead-undead/x-ui-lite-v2/main/install.sh)
```
