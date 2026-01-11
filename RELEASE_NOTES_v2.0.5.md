# v2.0.5 - Fix XHTTP Network Configuration

## 🐛 Bug Fixes

### 1. Fix "unknown variant xhttp" Crash
**Issue**: Xray-lite failed to start with `Error: unknown variant xhttp`.
**Cause**: The panel sets `network: "xhttp"` which is not a valid enum in xray-lite. Xray-lite expects `network: "tcp"` combined with `xhttpSettings`.
**Fix**: Backend now automatically maps `network: "xhttp"` to `network: "tcp"` when generating configuration.

### 2. Fix "missing field clients" Crash
**Issue**: Creating an inbound without clients (or initial state) caused xray-lite to crash.
**Fix**: Backend now ensures `clients` array is always present in the settings.

## 🎯 Verification

After upgrading:
1. **XHTTP**: You can now select "XHTTP" in the panel. The generated config will correctly use `network: "tcp"` + `xhttpSettings`.
2. **Connectivity**: This should resolve the startup crash.

## 🔄 Upgrade

```bash
bash <(curl -Ls https://raw.githubusercontent.com/undead-undead/x-ui-lite-v2/main/install.sh)
```
