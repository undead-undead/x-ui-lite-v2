# 🚀 X-UI-Lite v2.0.0 - Powered by xray-lite

## ⚡ Major Changes

This version replaces the official Go-based **Xray-Core** with **pure Rust xray-lite** implementation, delivering significant performance improvements and reduced resource usage.

---

## 🎯 Key Highlights

### Performance Improvements
- 🪶 **60% Memory Reduction**: Total system footprint reduced from ~150MB to ~60MB
  - Backend: 50MB (Rust/Axum)
  - Core: 10MB (xray-lite, down from 100MB)
- ⚡ **4-6x Faster Startup**: Pure Rust eliminates Go runtime overhead
- 🚀 **Lower Latency**: Raw VLESS over H2 transport for minimum latency
- 🔋 **Zero GC Overhead**: No garbage collection pauses

### Security Enhancements
- 🔒 **Built-in Anti-Probing**: Strict SNI validation prevents active server detection
- 🛡️ **Memory Safety**: Pure Rust implementation reduces vulnerabilities
- 🔐 **Reality Protocol**: Enhanced TLS fingerprinting with dynamic certificates

### Code Simplification
- 📦 **Simplified Configuration**: Removed unnecessary API, Stats, and Policy sections
- 🧹 **Cleaner Codebase**: Easier to maintain and audit
- 📝 **Better Documentation**: Comprehensive migration guide and installation docs

---

## 🔄 Breaking Changes

### ⚠️ Traffic Statistics Disabled
- xray-lite doesn't provide gRPC API for statistics
- Traffic quota limits still work, but counters won't update
- **Workaround**: Use system tools like `vnstat` or `iftop` for traffic monitoring

### ⚠️ Protocol Support
- Currently only supports **VLESS** protocol
- Other protocols (VMess, Trojan, Shadowsocks) not available
- **Note**: If you need other protocols, please continue using v1.x

### ⚠️ Configuration Format
- Simplified configuration (no `api`, `stats`, `policy` sections)
- xray-lite will automatically ignore unsupported config items

---

## 📦 Installation

### Fresh Install

```bash
bash <(curl -Ls https://raw.githubusercontent.com/undead-undead/x-ui-lite-v2/main/install.sh)
```

### Upgrade from v1.x

**⚠️ Important**: Please read [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) before upgrading

```bash
# Backup your configuration first
sudo x-ui-lite
# Select backup option

# Run upgrade
bash <(curl -Ls https://raw.githubusercontent.com/undead-undead/x-ui-lite-v2/main/install.sh)
```

---

## 📚 Documentation

- [**CHANGELOG**](./CHANGELOG.md) - Complete version history
- [**MIGRATION_GUIDE**](./MIGRATION_GUIDE.md) - Detailed migration instructions (双语)
- [**README**](./README.md) - Project overview and features

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│  X-UI-Lite Backend (Rust)  ~50MB   │
├─────────────────────────────────────┤
│  xray-lite (Rust)          ~10MB    │
└─────────────────────────────────────┘
Total: ~60MB RAM
```

**vs v1.x**:
```
┌─────────────────────────────────────┐
│  X-UI-Lite Backend (Rust)  ~50MB   │
├─────────────────────────────────────┤
│  Xray-Core (Go)            ~100MB   │
└─────────────────────────────────────┘
Total: ~150MB RAM
```

---

## 🔍 What's Changed

### Core Changes
- Replaced Xray-Core with xray-lite
- Simplified configuration generation
- Disabled traffic statistics (API limitation)
- Updated version detection for xray-lite

### Script Improvements
- Automatic fallback to v1.1.88 backend if v2.0.0 not available
- Better error handling and download verification
- Support for building xray-lite from source if binary download fails

---

## 🙏 Credits

This project wouldn't be possible without:

- [**xray-lite**](https://github.com/undead-undead/xray-lite) - Pure Rust VLESS+Reality implementation
- [**Xray-core**](https://github.com/XTLS/Xray-core) - Original Reality protocol design and inspiration
- [**Tokio**](https://tokio.rs/) - Async runtime for both backend and core
- [**rustls**](https://github.com/rustls/rustls) - TLS implementation with Reality support

---

## 🐛 Known Issues

1. **Traffic statistics not updating**: This is expected behavior due to API limitations
2. **Only VLESS supported**: Other protocols will be added in future releases

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/undead-undead/x-ui-lite-v2/issues)
- **Discussions**: [GitHub Discussions](https://github.com/undead-undead/x-ui-lite-v2/discussions)
- **xray-lite Issues**: [xray-lite Issues](https://github.com/undead-undead/xray-lite/issues)

---

## ☕ Support This Project

If you find this project helpful, please consider supporting:

[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://buymeacoffee.com/undeadundead)

---

**Full Changelog**: https://github.com/undead-undead/x-ui-lite-v2/compare/v1.1.88...v2.0.0
