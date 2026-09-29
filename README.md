# 四则运算题库生成器

纯静态网页，无需后端、数据库或构建工具，适合直接部署到 GitHub Pages。

## 本地使用

直接双击 `index.html` 即可使用。若浏览器限制 ES Module 的本地加载，可在当前目录运行任意静态文件服务器，例如：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 部署到 GitHub Pages

1. 将本目录内容推送到 GitHub 仓库的 `main` 分支。
2. 打开仓库 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**，分支选择 `main`，目录选择 `/ (root)`。
4. 保存后等待 GitHub Pages 发布，生成的地址即可分享。

页面支持设置题量、数字位数、运算符数量和运算类型；打印时在系统打印窗口选择“另存为 PDF”。
