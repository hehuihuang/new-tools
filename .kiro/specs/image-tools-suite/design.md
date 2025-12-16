# Design Document - Image Tools Suite

## Overview

Image Tools Suite 是一套完整的浏览器端图片处理工具集，包含 10 个独立的 HTML 页面，每个页面实现一个特定的图片处理功能。所有处理操作完全在客户端完成，使用 HTML5 Canvas API 和 File API，无需服务器支持，保护用户隐私。

该工具集通过导航网站（tooles/index.html）的"图片处理工具"卡片进行访问，采用与现有 PDF 工具套件一致的 UI 设计风格和代码架构。

### Key Features

- **10 个独立工具**: 压缩、格式转换、尺寸调整、裁剪、旋转翻转、水印、滤镜、拼接、EXIF 清理、圆角头像
- **本地处理**: 所有操作在浏览器中完成，不上传服务器
- **统一 UI**: 与现有工具保持一致的设计语言
- **响应式设计**: 支持桌面和移动设备
- **即时预览**: 实时显示处理效果

## Architecture

### System Architecture

```
image-tools/
├── shared/
│   ├── styles.css          # 共享样式（基于 PDF 工具样式）
│   ├── components.js       # 共享组件（ImageUploader, ImageViewer, ProgressIndicator）
│   └── utils.js            # 工具函数（文件处理、Canvas 操作、下载）
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

### Technology Stack

- **HTML5 Canvas API**: 图片渲染和处理
- **File API**: 文件读取和下载
- **Blob API**: 生成下载文件
- **EXIF.js**: EXIF 信息读取（CDN: https://cdn.jsdelivr.net/npm/exif-js）
- **Vanilla JavaScript**: 无框架依赖，纯 JS 实现

### Design Principles

1. **本地优先**: 所有处理在客户端完成
2. **组件复用**: 共享组件库减少代码重复
3. **渐进增强**: 基础功能优先，高级功能可选
4. **用户友好**: 清晰的视觉反馈和错误提示
5. **性能优化**: 大文件处理使用 Web Worker（可选）

## Components and Interfaces

### 1. Shared Components (shared/components.js)

#### ImageUploader Class

负责图片文件的选择、验证和读取。

```javascript
class ImageUploader {
  constructor(options = {})
  
  // 方法
  selectFiles(): Promise<File[]>           // 触发文件选择对话框
  validateFile(file): boolean              // 验证文件类型和大小
  readAsDataURL(file): Promise<string>     // 读取为 Data URL
  readAsArrayBuffer(file): Promise<ArrayBuffer>  // 读取为 ArrayBuffer
  setupDropZone(element, callback)         // 设置拖拽上传区域
}
```

**配置选项**:
- `acceptTypes`: 接受的文件类型（默认: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', 'image/*']）
- `multiple`: 是否允许多选（默认: false）
- `maxSize`: 最大文件大小（默认: 20MB）
- `onFilesSelected`: 文件选择回调

#### ImageViewer Class

负责图片的显示和基础交互。

```javascript
class ImageViewer {
  constructor(container, options = {})
  
  // 方法
  loadImage(src): Promise<void>            // 加载图片
  clear()                                  // 清除显示
  getCanvas(): HTMLCanvasElement           // 获取 Canvas 元素
  getContext(): CanvasRenderingContext2D   // 获取 Canvas 上下文
  toBlob(type, quality): Promise<Blob>     // 导出为 Blob
  toDataURL(type, quality): string         // 导出为 Data URL
}
```

#### ProgressIndicator Class

显示处理进度和加载状态（复用 PDF 工具的实现）。

```javascript
class ProgressIndicator {
  show(message)                // 显示进度遮罩
  update(percent, message)     // 更新进度
  hide()                       // 隐藏进度遮罩
}
```

### 2. Shared Utilities (shared/utils.js)

#### File Utilities

```javascript
Utils.validateFileType(file, acceptTypes): boolean
Utils.validateFileSize(file, maxSize): boolean
Utils.formatFileSize(bytes): string
Utils.downloadFile(blob, filename): void
```

#### Canvas Utilities

```javascript
Utils.loadImageToCanvas(src, canvas): Promise<void>
Utils.resizeCanvas(canvas, width, height, maintainRatio): void
Utils.applyFilter(canvas, filterType, intensity): void
Utils.rotateCanvas(canvas, degrees): HTMLCanvasElement
Utils.flipCanvas(canvas, horizontal, vertical): HTMLCanvasElement
```

#### Message Utilities

```javascript
Utils.showSuccess(message): void
Utils.showError(message): void
Utils.hideMessage(): void
```

### 3. Individual Tool Pages

每个工具页面遵循统一的结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>工具名称 - 图片工具套件</title>
    <link rel="stylesheet" href="./shared/styles.css">
    <script src="./shared/utils.js"></script>
    <script src="./shared/components.js"></script>
    <!-- 特定工具的 CDN 依赖 -->
</head>
<body>
    <div class="container">
        <!-- 头部 -->
        <div class="header">
            <a href="../tooles/index.html" class="back-link">← 返回工具箱</a>
            <h1>工具名称</h1>
            <div class="privacy-notice">🔒 所有处理均在本地完成，不上传到服务器</div>
        </div>

        <!-- 上传区域 -->
        <div class="card" id="upload-section">
            <div class="upload-area" id="upload-area">
                <div class="upload-icon">🖼️</div>
                <h3>点击或拖拽上传图片</h3>
            </div>
        </div>

        <!-- 处理区域 -->
        <div class="card" id="process-section" style="display: none;">
            <!-- 工具特定的 UI -->
        </div>
    </div>

    <script>
        class ToolName {
            constructor() {
                this.uploader = new ImageUploader();
                this.viewer = new ImageViewer(container);
                this.progress = new ProgressIndicator();
                this._initElements();
                this._bindEvents();
            }
            
            // 工具特定的方法
        }

        document.addEventListener('DOMContentLoaded', () => {
            new ToolName();
        });
    </script>
</body>
</html>
```

## Data Models

### ImageFile Model

```javascript
{
  file: File,              // 原始文件对象
  name: string,            // 文件名
  size: number,            // 文件大小（字节）
  type: string,            // MIME 类型
  width: number,           // 图片宽度
  height: number,          // 图片高度
  dataURL: string,         // Data URL 表示
  canvas: HTMLCanvasElement  // Canvas 元素
}
```

### ProcessingOptions Model

不同工具有不同的处理选项：

**Compress Options**:
```javascript
{
  quality: number,         // 压缩质量 0.0-1.0
  format: string,          // 输出格式 'jpeg' | 'png' | 'webp'
  maxWidth: number,        // 最大宽度（可选）
  maxHeight: number        // 最大高度（可选）
}
```

**Resize Options**:
```javascript
{
  width: number,           // 目标宽度
  height: number,          // 目标高度
  maintainRatio: boolean,  // 保持宽高比
  scalePercent: number     // 缩放百分比（可选）
}
```

**Crop Options**:
```javascript
{
  x: number,               // 裁剪起始 X 坐标
  y: number,               // 裁剪起始 Y 坐标
  width: number,           // 裁剪宽度
  height: number,          // 裁剪高度
  aspectRatio: string      // 宽高比 '1:1' | '4:3' | '16:9' | 'free'
}
```

**Watermark Options**:
```javascript
{
  type: 'text' | 'image',
  // 文字水印
  text: string,
  fontSize: number,
  fontColor: string,
  opacity: number,
  // 图片水印
  watermarkImage: HTMLImageElement,
  scale: number,
  // 通用
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
  offsetX: number,
  offsetY: number
}
```

**Filter Options**:
```javascript
{
  type: 'grayscale' | 'sepia' | 'invert' | 'blur' | 'brightness' | 'contrast' | 'saturate',
  intensity: number        // 强度 0-100
}
```

**Merge Options**:
```javascript
{
  images: ImageFile[],     // 图片数组
  direction: 'horizontal' | 'vertical',
  spacing: number,         // 间距（像素）
  backgroundColor: string  // 背景色
}
```

**Avatar Options**:
```javascript
{
  mode: 'rounded' | 'circle',
  borderRadius: number,    // 圆角半径百分比 0-50
  size: number,            // 输出尺寸（圆形模式）
  x: number,               // 裁剪中心 X
  y: number                // 裁剪中心 Y
}
```

## 
Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Aspect ratio preservation in compression

*For any* image, when compressed with the maintain ratio option, the output image width divided by height should equal the original image width divided by height (within floating point tolerance).
**Validates: Requirements 1.3**

### Property 2: Format conversion correctness

*For any* image and target format (JPG/PNG/WEBP/BMP), converting the image should produce an output with the correct MIME type matching the target format.
**Validates: Requirements 2.4**

### Property 3: Aspect ratio calculation in resize

*For any* image with original dimensions (w, h), when user inputs new width w', the calculated height h' should satisfy: h' / w' = h / w (within rounding tolerance).
**Validates: Requirements 3.2**

### Property 4: Percentage scaling correctness

*For any* image with dimensions (w, h) and scale percentage p, the output dimensions should be (w * p/100, h * p/100) rounded to nearest integer.
**Validates: Requirements 3.4**

### Property 5: Resize output dimensions match specification

*For any* target dimensions (w, h), the resized image canvas should have width w and height h.
**Validates: Requirements 3.5**

### Property 6: Crop aspect ratio constraint

*For any* crop selection with aspect ratio constraint r (e.g., "4:3"), the crop box width divided by height should equal r (within tolerance).
**Validates: Requirements 4.4**

### Property 7: Crop output matches selection

*For any* crop selection with coordinates (x, y, w, h), the output image should have dimensions (w, h) and contain pixels from the specified region.
**Validates: Requirements 4.5**

### Property 8: Rotation is cumulative and cyclic

*For any* image, applying left rotation 4 times should return to the original orientation (rotation is cyclic with period 4).
**Validates: Requirements 5.2**

### Property 9: Horizontal flip is idempotent

*For any* image, applying horizontal flip twice should return the image to its original state.
**Validates: Requirements 5.4**

### Property 10: Vertical flip is idempotent

*For any* image, applying vertical flip twice should return the image to its original state.
**Validates: Requirements 5.5**

### Property 11: Watermark presence in output

*For any* image with watermark applied, the output canvas should contain pixels different from the original image in the watermark region.
**Validates: Requirements 6.5**

### Property 12: Filter application changes pixels

*For any* image and filter type (except identity), applying the filter should result in at least some pixels being different from the original.
**Validates: Requirements 7.3, 7.5**

### Property 13: Merge output dimensions

*For any* array of images with dimensions [(w1,h1), (w2,h2), ...] and spacing s, when merged horizontally, the output width should equal sum(wi) + s*(n-1) where n is the number of images.
**Validates: Requirements 8.5**

### Property 14: Image order preservation in merge

*For any* ordered array of images, the merged output should contain the images in the same order (left-to-right for horizontal, top-to-bottom for vertical).
**Validates: Requirements 8.2, 8.3**

### Property 15: EXIF removal round trip

*For any* image with EXIF data, after cleaning EXIF and reading the output, the EXIF data should be empty or null.
**Validates: Requirements 9.4**

### Property 16: Avatar output format

*For any* image processed in avatar mode, the output should be in PNG format with an alpha channel (transparency support).
**Validates: Requirements 10.5**

### Property 17: No network requests for image data

*For any* image processing operation, monitoring network activity should show zero HTTP requests containing image data.
**Validates: Requirements 13.3**

## Error Handling

### File Upload Errors

1. **Invalid File Type**
   - Detection: Check file MIME type and extension
   - Response: Display error message "不支持的文件格式，请上传 JPG、PNG、WEBP 或 BMP 图片"
   - Recovery: Allow user to select another file

2. **File Too Large**
   - Detection: Check file.size against maxSize (default 20MB)
   - Response: Display error message "文件过大，最大支持 {maxSize}"
   - Recovery: Suggest compression or selecting smaller file

3. **File Read Error**
   - Detection: FileReader onerror event
   - Response: Display error message "文件读取失败，请重试"
   - Recovery: Allow user to retry upload

### Processing Errors

1. **Invalid Image Data**
   - Detection: Image load error or Canvas drawImage failure
   - Response: Display error message "图片数据损坏或格式不支持"
   - Recovery: Return to upload state

2. **Canvas Size Limit Exceeded**
   - Detection: Canvas dimensions > browser limit (typically 32767px)
   - Response: Display error message "图片尺寸超出浏览器限制"
   - Recovery: Suggest reducing dimensions

3. **Memory Limit**
   - Detection: Out of memory exception during processing
   - Response: Display error message "图片过大导致内存不足，请尝试较小的图片"
   - Recovery: Clear canvas and return to upload state

4. **EXIF Read Error**
   - Detection: EXIF.js parsing failure
   - Response: Display warning "无法读取 EXIF 信息，但可以继续处理"
   - Recovery: Continue with processing, skip EXIF display

### User Input Errors

1. **Invalid Dimensions**
   - Detection: Width or height <= 0 or non-numeric
   - Response: Display inline error "请输入有效的尺寸（正整数）"
   - Recovery: Disable process button until valid input

2. **Invalid Quality Value**
   - Detection: Quality < 0 or > 100
   - Response: Clamp value to valid range [0, 100]
   - Recovery: Auto-correct and display corrected value

3. **Empty Watermark Text**
   - Detection: Text watermark with empty string
   - Response: Display error "请输入水印文字"
   - Recovery: Disable apply button until text entered

### Download Errors

1. **Blob Creation Failure**
   - Detection: toBlob callback with null
   - Response: Display error "生成文件失败，请重试"
   - Recovery: Allow user to retry download

2. **Browser Download Blocked**
   - Detection: Download link click with no response
   - Response: Display message "如果下载未开始，请检查浏览器下载设置"
   - Recovery: Provide alternative download method

## Testing Strategy

### Unit Testing

使用 Vitest 作为测试框架，测试核心工具函数和组件方法。

**Test Files Structure**:
```
tests/
├── utils.test.js              # 工具函数测试
├── image-uploader.test.js     # ImageUploader 组件测试
├── image-viewer.test.js       # ImageViewer 组件测试
├── canvas-operations.test.js  # Canvas 操作测试
└── *.property.test.js         # 属性测试文件
```

**Unit Test Coverage**:

1. **File Validation** (utils.test.js)
   - Test validateFileType with various MIME types
   - Test validateFileSize with boundary values
   - Test formatFileSize with different byte values

2. **Canvas Operations** (canvas-operations.test.js)
   - Test resizeCanvas with various dimensions
   - Test rotateCanvas with 90, 180, 270 degrees
   - Test flipCanvas horizontal and vertical
   - Test filter application functions

3. **Component Methods** (image-uploader.test.js, image-viewer.test.js)
   - Test ImageUploader.validateFile
   - Test ImageViewer.loadImage
   - Test ImageViewer.toBlob

### Property-Based Testing

使用 fast-check 库进行属性测试，验证通用属性在随机输入下的正确性。

**Configuration**:
- Minimum iterations per property: 100
- Use custom generators for image dimensions, colors, percentages
- Tag each test with corresponding design property number

**Property Test Examples**:

```javascript
// Property 1: Aspect ratio preservation
test('Property 1: Aspect ratio preservation in compression', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 100, max: 2000 }), // width
      fc.integer({ min: 100, max: 2000 }), // height
      fc.double({ min: 0.1, max: 1.0 }),   // quality
      async (width, height, quality) => {
        const canvas = createTestCanvas(width, height);
        const compressed = await compressImage(canvas, quality, true);
        const originalRatio = width / height;
        const compressedRatio = compressed.width / compressed.height;
        expect(Math.abs(originalRatio - compressedRatio)).toBeLessThan(0.01);
      }
    ),
    { numRuns: 100 }
  );
});
```

**Property Test Files**:
- `aspect-ratio.property.test.js` - Properties 1, 3, 6
- `dimensions.property.test.js` - Properties 4, 5, 13
- `transformations.property.test.js` - Properties 8, 9, 10
- `format-conversion.property.test.js` - Property 2, 16
- `merge-order.property.test.js` - Property 14
- `exif-removal.property.test.js` - Property 15
- `privacy.property.test.js` - Property 17

### Integration Testing

测试完整的用户工作流程：

1. **Upload → Process → Download Flow**
   - Upload image file
   - Apply processing operation
   - Verify output file is downloadable

2. **Multi-step Operations**
   - Upload → Resize → Crop → Download
   - Upload → Filter → Watermark → Download

3. **Error Recovery**
   - Upload invalid file → See error → Upload valid file
   - Process with invalid params → See error → Correct params → Success

### Browser Compatibility Testing

手动测试主要浏览器：
- Chrome/Edge (Chromium)
- Firefox
- Safari

测试重点：
- Canvas API support
- File API support
- Blob download functionality
- EXIF.js compatibility

### Performance Testing

测试大文件处理性能：
- 10MB+ images
- 4K resolution images
- Multiple image merge (10+ images)

性能目标：
- Compression: < 5 seconds for 5MB image
- Resize: < 2 seconds for 4K image
- Merge: < 10 seconds for 10 images

## Implementation Notes

### Canvas Size Limits

不同浏览器对 Canvas 尺寸有限制：
- Chrome: 32767 x 32767 pixels
- Firefox: 32767 x 32767 pixels
- Safari: 4096 x 4096 pixels (iOS), 16384 x 16384 (macOS)

实现时需要检测并处理超限情况。

### Memory Management

大图片处理可能导致内存问题：
- 及时释放不用的 Canvas 引用
- 使用 `canvas.width = 0` 清理 Canvas 内存
- 考虑使用 OffscreenCanvas (Web Worker) 处理大文件

### EXIF Orientation

JPEG 图片可能包含 EXIF Orientation 标签，需要：
1. 读取 Orientation 值
2. 在 Canvas 上应用相应的旋转/翻转
3. 确保显示方向正确

### Cross-Origin Images

如果未来支持 URL 加载图片，需要注意：
- 使用 `crossOrigin = "anonymous"` 属性
- 处理 CORS 错误
- Canvas 会被污染（tainted），无法 toDataURL

### File Naming

下载文件时的命名规则：
- 保留原文件名（去除扩展名）
- 添加操作后缀：`-compressed`, `-resized`, `-cropped` 等
- 添加正确的扩展名：`.jpg`, `.png`, `.webp`

示例：`photo.jpg` → `photo-compressed.jpg`

### Progressive Enhancement

基础功能优先，高级功能可选：
- 必需：基本处理功能
- 可选：实时预览（性能较差时可禁用）
- 可选：批量处理
- 可选：Web Worker 加速

## UI/UX Specifications

### Color Scheme

基于现有 PDF 工具的配色：

```css
:root {
  --primary-color: #4a90e2;      /* 主色调 - 蓝色 */
  --secondary-color: #50c878;    /* 次要色 - 绿色 */
  --danger-color: #e74c3c;       /* 危险色 - 红色 */
  --text-color: #333;            /* 文字颜色 */
  --bg-color: #f5f5f5;           /* 背景色 */
  --card-bg: #ffffff;            /* 卡片背景 */
  --border-color: #ddd;          /* 边框颜色 */
}
```

**避免使用**：紫色渐变背景（如 `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`）

### Typography

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
```

- 标题 (h1): 28px, bold
- 副标题 (h3): 18px, medium
- 正文: 16px, normal
- 小字: 14px, normal

### Spacing

- 容器内边距: 20px
- 卡片间距: 20px
- 按钮内边距: 10px 20px
- 元素间距: 10-15px

### Interactive Elements

**按钮**:
- 圆角: 4px
- 阴影: `0 2px 8px rgba(0, 0, 0, 0.1)`
- 悬停阴影: `0 4px 12px rgba(0, 0, 0, 0.15)`
- 过渡: `all 0.3s ease`

**上传区域**:
- 虚线边框: `2px dashed #ddd`
- 悬停边框: `2px dashed #4a90e2`
- 悬停背景: `#f0f8ff`
- 拖拽时背景: `#e3f2fd`

**输入框**:
- 边框: `1px solid #ddd`
- 聚焦边框: `1px solid #4a90e2`
- 圆角: 4px
- 内边距: 8px 12px

### Responsive Breakpoints

```css
/* 移动端 */
@media (max-width: 768px) {
  .container { padding: 10px; }
  h1 { font-size: 24px; }
  .btn { padding: 8px 16px; font-size: 14px; }
}

/* 平板 */
@media (min-width: 769px) and (max-width: 1024px) {
  .container { padding: 15px; }
}

/* 桌面 */
@media (min-width: 1025px) {
  .container { max-width: 1200px; }
}
```

### Loading States

**进度指示器**:
- 全屏遮罩: `rgba(0, 0, 0, 0.7)`
- 白色卡片: 圆角 8px, 内边距 30px
- 旋转动画: 1s linear infinite
- 进度条: 高度 20px, 圆角 10px

**按钮加载状态**:
- 禁用状态: `opacity: 0.5`, `cursor: not-allowed`
- 可选：添加旋转图标

### Accessibility

- 所有交互元素支持键盘导航
- 图片添加 alt 属性
- 按钮使用语义化标签
- 错误消息使用 ARIA live regions
- 颜色对比度符合 WCAG AA 标准

## Deployment

### File Structure

```
image-tools/
├── shared/
│   ├── styles.css
│   ├── components.js
│   └── utils.js
├── image-compress.html
├── image-convert.html
├── image-resize.html
├── image-crop.html
├── image-rotate.html
├── image-watermark.html
├── image-filter.html
├── image-merge.html
├── image-exif.html
└── image-avatar.html
```

### CDN Dependencies

所有工具页面需要引入：

```html
<!-- EXIF.js for EXIF reading -->
<script src="https://cdn.jsdelivr.net/npm/exif-js"></script>
```

### Browser Requirements

- 现代浏览器（支持 ES6+）
- Canvas API 支持
- File API 支持
- Blob API 支持

不支持 IE11 及更早版本。

### Local Development

使用简单的 HTTP 服务器：

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# 或使用现有的 start-server.bat
```

访问 `http://localhost:8000/tooles/index.html` 查看导航页面。

### Production Deployment

- 可部署到任何静态文件托管服务
- 无需服务器端处理
- 无需数据库
- 建议启用 HTTPS（虽然不是必需）
- 建议启用 Gzip 压缩

## Future Enhancements

### Phase 2 Features

1. **批量处理**: 一次处理多张图片
2. **历史记录**: 保存最近处理的图片
3. **预设模板**: 常用尺寸和设置的快捷方式
4. **高级滤镜**: 更多艺术滤镜效果
5. **图片对比**: 处理前后的滑动对比视图

### Performance Optimizations

1. **Web Worker**: 将图片处理移到后台线程
2. **OffscreenCanvas**: 提升大图片处理性能
3. **Progressive Loading**: 大文件分块加载
4. **Lazy Loading**: 按需加载工具页面资源

### Advanced Features

1. **AI 功能**: 智能裁剪、背景移除
2. **批注工具**: 在图片上绘制和标注
3. **GIF 支持**: 动图处理
4. **SVG 支持**: 矢量图处理
5. **云端同步**: 可选的云端保存功能

## Conclusion

本设计文档定义了 Image Tools Suite 的完整架构、组件接口、数据模型、正确性属性和测试策略。实现时应遵循本文档的规范，确保所有 10 个工具具有一致的用户体验和代码质量。

关键设计决策：
- 完全客户端处理，保护隐私
- 组件化架构，便于维护
- 属性测试驱动，确保正确性
- 响应式设计，支持多设备
- 与现有工具一致的 UI 风格
