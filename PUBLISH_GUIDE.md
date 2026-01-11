# 📦 发布到 GitHub 指南 / GitHub Publishing Guide

## 🎯 快速发布 / Quick Publish

按照以下步骤将 x-ui-lite v2.0 发布到新的 GitHub 仓库：

Follow these steps to publish x-ui-lite v2.0 to a new GitHub repository:

---

## 步骤 1: 创建新的 GitHub 仓库 / Step 1: Create New GitHub Repository

1. 访问 / Visit: https://github.com/new
2. 填写仓库信息 / Fill in repository details:
   - **Repository name**: `x-ui-lite-v2` (推荐名称 / recommended)
   - **Description**: `X-UI-Lite v2.0 - High-performance X-UI panel powered by xray-lite (Pure Rust)`
   - **Visibility**: Public (公开) 或 Private (私有)
   - **⚠️ 重要 / IMPORTANT**: 
     - ❌ **不要** 勾选 "Add a README file"
     - ❌ **不要** 勾选 "Add .gitignore"
     - ❌ **不要** 勾选 "Choose a license"
     - 保持完全空白！/ Keep it completely empty!

3. 点击 "Create repository"

---

## 步骤 2: 推送代码到 GitHub / Step 2: Push Code to GitHub

在您的终端中运行以下命令：

Run the following commands in your terminal:

```bash
cd /home/biubiuboy/x-ui-lite

# 添加远程仓库 / Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/x-ui-lite-v2.git

# 推送代码 / Push code
git push -u origin main
```

**替换 `YOUR_USERNAME`** 为您的 GitHub 用户名！

**Replace `YOUR_USERNAME`** with your GitHub username!

### 如果需要身份验证 / If authentication is required:

GitHub 现在需要使用 Personal Access Token (PAT) 而不是密码。

GitHub now requires Personal Access Token (PAT) instead of password.

**创建 PAT / Create PAT:**
1. 访问 / Visit: https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 选择权限 / Select scopes:
   - ✅ `repo` (完整仓库访问 / Full repository access)
4. 点击 "Generate token"
5. **复制** token (只会显示一次！/ Only shown once!)

**使用 PAT 推送 / Push with PAT:**
```bash
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/x-ui-lite-v2.git
git push -u origin main
```

或者使用 SSH / Or use SSH:
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/x-ui-lite-v2.git
git push -u origin main
```

---

## 步骤 3: 更新 README 中的链接 / Step 3: Update Links in README

在推送后，更新 README.md 中的安装命令：

After pushing, update the installation command in README.md:

```bash
# 编辑 README / Edit README
nano /home/biubiuboy/x-ui-lite/README.md
```

将安装命令改为：

Change the installation command to:

```bash
bash <(curl -Ls https://raw.githubusercontent.com/YOUR_USERNAME/x-ui-lite-v2/main/install.sh)
```

然后提交并推送：

Then commit and push:

```bash
git add README.md
git commit -m "docs: Update installation URL"
git push
```

---

## 步骤 4: 创建第一个 Release / Step 4: Create First Release

1. 访问仓库 / Visit: `https://github.com/YOUR_USERNAME/x-ui-lite-v2`
2. 点击 "Releases" → "Create a new release"
3. 填写信息 / Fill in details:
   - **Tag**: `v2.0.0`
   - **Release title**: `v2.0.0 - Powered by xray-lite`
   - **Description**: 复制以下内容 / Copy the following:

```markdown
# 🚀 X-UI-Lite v2.0.0 - Powered by xray-lite

## ⚡ Major Changes

This version replaces the official Go-based Xray-Core with **pure Rust xray-lite** implementation.

### Key Highlights

- 🪶 **60% Memory Reduction**: ~60MB total (Backend 50MB + xray-lite 10MB)
- 🚀 **Pure Rust**: Zero GC overhead, faster startup
- 🔒 **Built-in Anti-Probing**: Strict SNI validation
- ⚡ **Better Performance**: Raw VLESS over H2 for minimum latency

### Breaking Changes

- ⚠️ Traffic statistics disabled (xray-lite doesn't provide gRPC API)
- ⚠️ Only VLESS protocol supported (other protocols may be added later)

### Installation

```bash
bash <(curl -Ls https://raw.githubusercontent.com/YOUR_USERNAME/x-ui-lite-v2/main/install.sh)
```

### Documentation

- [CHANGELOG](./CHANGELOG.md)
- [MIGRATION_GUIDE](./MIGRATION_GUIDE.md)

### Credits

- [xray-lite](https://github.com/undead-undead/xray-lite) - Pure Rust VLESS+Reality
- [Xray-core](https://github.com/XTLS/Xray-core) - Original Reality protocol design
```

4. 点击 "Publish release"

---

## 步骤 5: 构建和上传二进制文件 / Step 5: Build and Upload Binaries

### 构建后端 / Build Backend

```bash
cd /home/biubiuboy/x-ui-lite/backend

# 构建 x86_64 版本 / Build x86_64 version
cargo build --release

# 打包 / Package
cd ..
mkdir -p release
tar -czf release/x-ui-linux-amd64.tar.gz \
    -C backend/target/release x-ui-backend \
    -C ../../web dist \
    --transform 's|^|bin/|'
```

### 使用 GitHub Actions 自动构建 / Auto-build with GitHub Actions

查看 `.github/workflows/release.yml` 文件，它应该会自动构建。

Check `.github/workflows/release.yml` file, it should auto-build.

如果没有，创建一个：

If not, create one:

```bash
mkdir -p .github/workflows
```

然后添加工作流配置（见下一节）。

Then add workflow configuration (see next section).

---

## 步骤 6: 配置 CI/CD (可选) / Step 6: Setup CI/CD (Optional)

如果您希望自动构建和发布，确保 `.github/workflows/release.yml` 存在并配置正确。

If you want auto-build and release, ensure `.github/workflows/release.yml` exists and is configured correctly.

---

## 步骤 7: 更新安装脚本中的 URL / Step 7: Update URLs in install.sh

编辑 `install.sh`，将所有旧仓库的引用改为新仓库：

Edit `install.sh`, change all old repository references to new repository:

```bash
# 查找并替换 / Find and replace
sed -i 's|undead-undead/x-ui-rs|YOUR_USERNAME/x-ui-lite-v2|g' install.sh

# 提交 / Commit
git add install.sh
git commit -m "chore: Update repository URLs"
git push
```

---

## ✅ 验证发布 / Verify Publication

检查以下内容是否正常：

Check if the following are working:

1. ✅ 仓库可以访问 / Repository is accessible
2. ✅ README 显示正确 / README displays correctly
3. ✅ Release 已创建 / Release is created
4. ✅ 安装脚本可以下载 / Install script can be downloaded

测试安装 / Test installation:

```bash
# 在新的服务器上测试 / Test on a new server
bash <(curl -Ls https://raw.githubusercontent.com/YOUR_USERNAME/x-ui-lite-v2/main/install.sh)
```

---

## 🎉 完成！/ Done!

您的 X-UI-Lite v2.0 现在已经发布到 GitHub！

Your X-UI-Lite v2.0 is now published on GitHub!

### 下一步 / Next Steps

1. 在 README 中添加 badges (构建状态、版本等)
2. 添加更多文档 (API 文档、贡献指南等)
3. 设置 GitHub Discussions 或 Issues 模板
4. 考虑添加 Docker 支持

---

## 🆘 遇到问题？/ Having Issues?

### 推送失败 / Push Failed

```bash
# 检查远程仓库 / Check remote
git remote -v

# 重新设置远程 / Reset remote
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/x-ui-lite-v2.git
git push -u origin main
```

### 身份验证失败 / Authentication Failed

使用 SSH 而不是 HTTPS：

Use SSH instead of HTTPS:

```bash
# 生成 SSH 密钥 / Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加到 GitHub / Add to GitHub
cat ~/.ssh/id_ed25519.pub
# 复制输出并添加到 https://github.com/settings/keys

# 使用 SSH URL / Use SSH URL
git remote set-url origin git@github.com:YOUR_USERNAME/x-ui-lite-v2.git
git push -u origin main
```

---

**记住 / Remember:** 将所有 `YOUR_USERNAME` 替换为您的实际 GitHub 用户名！

**Remember:** Replace all `YOUR_USERNAME` with your actual GitHub username!
