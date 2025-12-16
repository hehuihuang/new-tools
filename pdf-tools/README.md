# PDF 工具套件

完全基于浏览器的 PDF 处理工具集合，包含8个独立的功能页面。

## 🚀 快速开始

**重要**: 由于浏览器安全限制，请使用以下方法之一启动项目：

### 方法 1: 使用启动脚本（最简单）
双击项目根目录的 `start-server.bat` 文件，然后访问 http://localhost:8000

### 方法 2: 使用 Python
```bash
python -m http.server 8000
```
然后访问 http://localhost:8000/tooles/index.html

### 方法 3: 使用 VS Code Live Server
1. 安装 "Live Server" 扩展
2. 右键点击 `tooles/index.html`
3. 选择 "Open with Live Server"

### 诊断工具
如果遇到链接问题，打开 `diagnose.html` 进行诊断。

## 项目结构

```
pdf-tools/
├── shared/                    # 共享资源
│   ├── styles.css            # 统一视觉风格样式
│   ├── utils.js              # 共享工具函数库
│   └── cdn-links.html        # CDN 库引用模板
├── pdf-preview.html          # PDF 在线预览工具
├── pdf-merge.html            # PDF 合并工具
├── pdf-split.html            # PDF 拆分工具
├── pdf-reorder.html          # PDF 页面删除与重排工具
├── pdf-watermark.html        # PDF 文字水印工具
├── pdf-annotate.html         # PDF 批注工具
├── pdf-to-image.html         # PDF 转图片工具
└── pdf-compress.html         # PDF 压缩工具
```

## 技术栈

- **PDF.js** (v3.11.174): Mozilla 的 PDF 渲染库
- **pdf-lib** (v1.17.1): PDF 创建和修改库
- **JSZip** (v3.10.1): ZIP 文件打包库
- **原生 JavaScript**: 无框架依赖

## 共享工具函数

### Utils.downloadFile(blob, filename)
下载文件到用户设备

### Utils.formatFileSize(bytes)
格式化文件大小为人类可读格式（B, KB, MB, GB）

### Utils.parsePageRange(rangeStr, totalPages)
解析页面范围字符串（如 "1-3, 5, 7-9"）为页码数组

### Utils.showError(message, duration)
显示错误消息提示

### Utils.showSuccess(message, duration)
显示成功消息提示

### Utils.validateFileType(file, acceptTypes)
验证文件类型

### Utils.validateFileSize(file, maxSize)
验证文件大小

## 隐私保护

所有 PDF 处理都在浏览器本地完成，不上传到任何服务器，确保用户数据隐私和安全。

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
