# X-UI-Lite v2.5.10 - Native Key Generation 🦀

This release introduces **Native Rust Key Generation**, removing the dependency on external binaries for Reality keys.

### 🌟 Key Features
- **Native Implementation**: Uses `x25519-dalek` directly within the backend, guaranteeing 100% compatibility with the xray-lite core (which uses the same library).
- **Fix for Old Systems**: Solves the "Failed to generate keys" error on older Linux distributions (CentOS 7, etc.) where GLIBC versions caused binary incompatibility.
- **Performance**: Instant key generation with zero process overhead.

### 📦 Upgrade Now

```bash
bash <(curl -Ls https://raw.githubusercontent.com/undead-undead/x-ui-lite/main/install.sh)
```

**Full Changelog**: [CHANGELOG.md](https://github.com/undead-undead/x-ui-lite/blob/v2.5.10/CHANGELOG.md)
