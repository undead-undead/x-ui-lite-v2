# Changelog

All notable changes to this project will be documented in this file.

## [1.1.88] - 2026-01-07

### 🔒 Security Fixes

#### Critical Fixes
- **Fixed Mutex Poisoning Vulnerability** - Replaced `unwrap()` with proper error handling in monitor lock operations to prevent service crashes
- **Optimized Regex Compilation** - Username validation regex now compiles only once using `LazyLock`, improving performance by 48-100x
- **Added Log Rotation** - Implemented daily log rotation with `tracing-appender` to prevent disk space exhaustion

#### Details
- `backend/src/handlers/system.rs`: Proper error handling for monitor locks
- `backend/src/services/system_service.rs`: Mutex lock error handling in stop/start Xray functions
- `backend/src/utils/validation.rs`: Static regex compilation using `LazyLock`
- `backend/src/main.rs`: Daily log rotation with 7-day retention
- `backend/Cargo.toml`: Added `tracing-appender` dependency
- `scripts/cleanup-logs.sh`: Log cleanup script for automated maintenance

### 📚 Documentation

- **Added LICENSE** - MIT License with additional terms protecting sponsor links
- **Updated README** - Added fork policy and license terms
- **Added Security Fixes Report** - Detailed documentation of all security improvements

### 🎨 UI Improvements

- **Increased Table Header Font Size** - Improved readability of inbound table headers (12px → 13px)
- **Fixed Traffic Stats Layout** - Changed traffic stats from vertical to horizontal layout
- **Reverted Button Heights** - Restored padding-based button heights for better visual consistency

### 🐛 Bug Fixes

- **Fixed System Uptime** - Changed from system uptime to application uptime for accurate runtime display
- **Fixed Memory Stats** - Now uses `free -b` command for accurate memory and swap statistics matching system output

### 🔧 Backend Improvements

- Added proper error messages for Mutex poisoning scenarios
- Improved performance for username validation (48-100x faster)
- Implemented automatic log file rotation
- Enhanced memory and swap statistics accuracy

### 📦 Dependencies

- Added: `tracing-appender@0.2` for log rotation

---

## [1.1.87] - 2026-01-06

### Previous releases...

