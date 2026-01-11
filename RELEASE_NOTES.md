# X-UI-Lite v2.5.1 - Dual-Stack Traffic & Accuracy Fix

This release addresses the issues found in v2.5.0, specifically improving traffic tracking accuracy for IPv6 and system-wide speed display.

### 🌟 Fixes & Improvements

#### 🌐 Dual-Stack Traffic Tracking
Added full `ip6tables` support. Previously, IPv6 traffic was not counted in the node list, leading to "0 upload/download" for some users. 

#### 🚀 Accurate System Speed
Filtered out loopback and virtual interfaces (docker, veth, br-) from the dashboard speed display. This ensures that internal traffic no longer inflates the reported network speed or causes "upload = download" confusion.

#### 🛡️ Priority Rule Enforcement
The traffic counting rules are now forcefully moved to the **top** of the Linux kernel chains (INPUT/OUTPUT 1). This prevents other firewall rules or "Established Connection" optimizations from bypassing our counters.

### 🛠 Installation & Upgrade

To install or upgrade to v2.5.1, run:

```bash
bash <(curl -Ls https://raw.githubusercontent.com/undead-undead/x-ui-lite/main/install.sh)
```

### ⚠️ Note for Users
The new traffic tracking requires `iptables` support in the kernel. Most Linux distributions (Ubuntu, Debian, CentOS) support this out of the box.

---

**Full Changelog**: [CHANGELOG.md](https://github.com/undead-undead/x-ui-lite/blob/v2.5.1/CHANGELOG.md)
