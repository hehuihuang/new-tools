# PDF 工具套件 - 启动指南

## 🚀 快速开始

### 方法 1: 使用本地 Web 服务器（推荐）

由于浏览器的安全限制，建议使用本地 Web 服务器来运行项目。

#### 使用 Python（如果已安装）
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

然后在浏览器中访问：
- 主页: http://localhost:8000/test-links.html
- 导航网站: http://localhost:8000/tooles/index.html

#### 使用 Node.js（如果已安装）
```bash
# 安装 http-server
npm install -g http-server

# 启动服务器
http-server -p 8000
```

#### 使用 VS Code Live Server 扩展
1. 安装 "Live Server" 扩展
2. 右键点击 `test-links.html` 或 `tooles/index.html`
3. 选择 "Open with Live Server"

### 方法 2: 直接打开文件

如果你想直接在浏览器中打开文件：

1. 打开 `test-links.html` 测试所有链接
2. 或者打开 `tooles/index.html` 访问导航网站

**注意**: 某些浏览器（如 Chrome）可能会阻止跨文件夹的文件访问。如果遇到问题，请使用方法 1。

## 📁 项目结构

```
项目根目录/
├── tooles/                    # 导航网站
│   └── index.html            # 主导航页面
├── pdf-tools/                # PDF 工具
│   ├── pdf-preview.html      # PDF 预览
│   ├── pdf-merge.html        # PDF 合并
│   ├── pdf-split.html        # PDF 拆分
│   ├── pdf-reorder.html      # PDF 重排
│   ├── pdf-watermark.html    # PDF 水印
│   ├── pdf-annotate.html     # PDF 批注
│   ├── pdf-to-image.html     # PDF 转图片
│   ├── pdf-compress.html     # PDF 压缩
│   └── shared/               # 共享资源
│       ├── styles.css
│       ├── utils.js
│       └── components.js
└── test-links.html           # 链接测试页面
```

## 🔗 访问路径说明

### 从项目根目录访问
- 测试页面: `test-links.html`
- 导航网站: `tooles/index.html`
- PDF 工具: `pdf-tools/pdf-preview.html` 等

### 从 tooles/index.html 访问 PDF 工具
使用相对路径: `../pdf-tools/pdf-preview.html`

## ⚠️ 常见问题

### 问题 1: 点击链接没有反应
**原因**: 浏览器安全限制阻止了跨文件夹访问
**解决**: 使用本地 Web 服务器（见方法 1）

### 问题 2: 页面显示但样式丢失
**原因**: CSS 文件路径不正确
**解决**: 确保从正确的目录打开文件，或使用 Web 服务器

### 问题 3: PDF 工具无法加载 PDF.js
**原因**: CDN 链接被阻止或网络问题
**解决**: 检查网络连接，确保可以访问 CDN

## 🧪 测试

运行单元测试和属性测试：
```bash
npm test
```

## 📝 功能列表

✅ PDF 在线预览 - 支持页面导航和缩放
✅ PDF 合并 - 合并多个 PDF 文件
✅ PDF 拆分 - 按页面范围提取
✅ PDF 重排 - 删除和重新排列页面
✅ PDF 水印 - 添加文字水印
✅ PDF 批注 - 添加文字批注和高亮
✅ PDF 转图片 - 转换为 PNG/JPEG
✅ PDF 压缩 - 减小文件大小

## 🔒 隐私保护

所有 PDF 处理都在浏览器本地完成，不会上传到任何服务器。

## 💡 提示

1. 建议使用现代浏览器（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）
2. 支持的最大文件大小: 50MB
3. 所有工具都支持拖拽上传
4. 处理大文件时请耐心等待

---

如有问题，请查看 `pdf-tools/PROJECT_SUMMARY.md` 了解更多详情。
