# 图片工具套件

一套完整的浏览器端图片处理工具集，包含 10 个独立的图片处理功能。所有处理操作完全在客户端完成，保护用户隐私。

## 功能列表

### 1. 图片压缩 (image-compress.html)
- 调整图片质量进行压缩
- 保持原始宽高比
- 显示压缩前后对比
- 支持 JPG/PNG/WEBP/BMP 格式

### 2. 格式转换 (image-convert.html)
- 支持 JPG、PNG、WEBP 格式互转
- 可调节输出质量
- 显示转换前后文件大小对比

### 3. 尺寸调整 (image-resize.html)
- 按像素或百分比调整图片尺寸
- 自动保持宽高比
- 支持自由调整模式

### 4. 图片裁剪 (image-crop.html)
- 鼠标拖动选择裁剪区域
- 支持多种比例约束（1:1, 4:3, 16:9, 自由）
- 实时显示裁剪区域尺寸

### 5. 旋转翻转 (image-rotate.html)
- 左旋转/右旋转 90 度
- 水平翻转/垂直翻转
- 实时预览效果

### 6. 添加水印 (image-watermark.html)
- 支持文字水印
- 可调节字体大小、颜色、透明度
- 多种位置选择
- 实时预览水印效果

### 7. 滤镜效果 (image-filter.html)
- 灰度、复古、反色、亮度、对比度等滤镜
- 可调节滤镜强度
- 实时预览效果

### 8. 图片拼接 (image-merge.html)
- 支持多张图片拼接
- 水平或垂直方向
- 可设置图片间距

### 9. EXIF 清理 (image-exif.html)
- 读取并显示 EXIF 元数据
- 一键清理所有 EXIF 信息
- 保护隐私安全

### 10. 圆角头像 (image-avatar.html)
- 圆角矩形模式（可调节圆角半径）
- 圆形头像模式（可设置输出尺寸）
- 生成带透明背景的 PNG 图片

## 技术特点

- **完全本地处理**: 所有操作在浏览器中完成，不上传服务器
- **无需安装**: 直接在浏览器中使用
- **隐私保护**: 图片数据不离开本地设备
- **响应式设计**: 支持桌面和移动设备
- **统一 UI**: 与现有工具保持一致的设计风格

## 使用方法

### 本地运行

1. 启动本地服务器：
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 或使用 Node.js
   npx http-server
   
   # 或使用现有的批处理文件
   start-server.bat
   ```

2. 在浏览器中访问：
   - 导航页面: `http://localhost:8000/tooles/index.html`
   - 或直接访问工具: `http://localhost:8000/image-tools/image-compress.html`

### 通过导航网站访问

1. 打开 `tooles/index.html`
2. 找到"图片处理工具"卡片
3. 点击任意工具链接即可使用

## 文件结构

```
image-tools/
├── shared/
│   ├── styles.css          # 共享样式
│   ├── components.js       # 共享组件（ImageUploader, ImageViewer, ProgressIndicator）
│   └── utils.js            # 工具函数
├── image-compress.html     # 图片压缩
├── image-convert.html      # 格式转换
├── image-resize.html       # 尺寸调整
├── image-crop.html         # 图片裁剪
├── image-rotate.html       # 旋转翻转
├── image-watermark.html    # 添加水印
├── image-filter.html       # 滤镜效果
├── image-merge.html        # 图片拼接
├── image-exif.html         # EXIF 清理
└── image-avatar.html       # 圆角头像
```

## 浏览器兼容性

- Chrome/Edge (推荐)
- Firefox
- Safari
- 不支持 IE11 及更早版本

## 技术栈

- HTML5 Canvas API
- File API
- Blob API
- EXIF.js (用于 EXIF 信息读取)
- 纯 JavaScript (无框架依赖)

## 注意事项

1. **文件大小限制**: 默认最大支持 20MB 的图片文件
2. **Canvas 尺寸限制**: 不同浏览器对 Canvas 尺寸有限制（通常为 32767x32767 像素）
3. **内存使用**: 处理大图片时可能占用较多内存
4. **EXIF 信息**: 只有 JPEG 格式的图片可能包含 EXIF 信息

## 开发说明

### 添加新工具

1. 在 `image-tools/` 目录下创建新的 HTML 文件
2. 引入共享样式和组件：
   ```html
   <link rel="stylesheet" href="./shared/styles.css">
   <script src="./shared/utils.js"></script>
   <script src="./shared/components.js"></script>
   ```
3. 使用共享组件：
   - `ImageUploader`: 文件上传
   - `ImageViewer`: 图片预览
   - `ProgressIndicator`: 进度显示
   - `Utils`: 工具函数

### 共享组件 API

**ImageUploader**:
```javascript
const uploader = new ImageUploader({ 
  multiple: false,  // 是否允许多选
  maxSize: 20 * 1024 * 1024  // 最大文件大小
});

// 选择文件
const files = await uploader.selectFiles();

// 读取为 Data URL
const dataURL = await uploader.readAsDataURL(file);

// 设置拖拽区域
uploader.setupDropZone(element, callback);
```

**ImageViewer**:
```javascript
const viewer = new ImageViewer(container);

// 加载图片
await viewer.loadImage(dataURL);

// 导出为 Blob
const blob = await viewer.toBlob('image/png', 0.92);

// 获取 Canvas
const canvas = viewer.getCanvas();
```

**Utils**:
```javascript
// 文件验证
Utils.validateFileType(file, acceptTypes);
Utils.validateFileSize(file, maxSize);

// Canvas 操作
Utils.resizeCanvas(canvas, width, height);
Utils.rotateCanvas(canvas, degrees);
Utils.flipCanvas(canvas, horizontal, vertical);
Utils.applyFilter(canvas, filterType, intensity);

// 文件下载
Utils.downloadFile(blob, filename);

// 消息提示
Utils.showSuccess(message);
Utils.showError(message);
```

## 许可证

本项目仅供学习和个人使用。

## 更新日志

### v1.0.0 (2025-01-10)
- 初始版本
- 实现 10 个基础图片处理工具
- 完全本地处理，保护隐私
- 统一的 UI 设计
