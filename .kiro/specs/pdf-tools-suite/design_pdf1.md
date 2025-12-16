# PDF 工具套件设计文档

## 概述

PDF 工具套件是一个完全基于浏览器的 PDF 处理工具集合，包含8个独立的功能页面。所有处理都在客户端完成，确保用户数据隐私。该套件将集成到现有的导航网站中，提供统一的用户体验。

核心技术栈：
- **PDF.js**: Mozilla 的 PDF 渲染库，用于 PDF 解析和渲染
- **pdf-lib**: 用于 PDF 创建、修改和合并的纯 JavaScript 库
- **HTML5 Canvas**: 用于 PDF 到图片的转换和压缩
- **JSZip**: 用于多图片导出时的打包
- **原生 JavaScript**: 无框架依赖，保持轻量级

## 架构

### 整体架构

```
导航网站 (tooles/index.html)
    ↓
PDF 工具入口页面
    ↓
├── pdf-preview.html (在线预览)
├── pdf-merge.html (合并)
├── pdf-split.html (拆分)
├── pdf-reorder.html (删除与重排)
├── pdf-watermark.html (水印)
├── pdf-annotate.html (批注)
├── pdf-to-image.html (转图片)
└── pdf-compress.html (压缩)
```

### 技术架构层次

1. **表现层**: HTML + CSS（统一的 UI 组件和样式）
2. **业务逻辑层**: JavaScript 模块（每个工具的核心功能）
3. **PDF 处理层**: PDF.js + pdf-lib（底层 PDF 操作）
4. **存储层**: 浏览器内存 + IndexedDB（临时存储大文件）

## 组件和接口

### 1. 共享组件

#### 1.1 文件上传组件 (FileUploader)
```javascript
class FileUploader {
  constructor(options) {
    this.acceptTypes = options.acceptTypes || '.pdf';
    this.multiple = options.multiple || false;
    this.maxSize = options.maxSize || 50 * 1024 * 1024; // 50MB
  }
  
  // 触发文件选择
  selectFiles(): Promise<File[]>
  
  // 验证文件
  validateFile(file: File): boolean
  
  // 读取文件为 ArrayBuffer
  readAsArrayBuffer(file: File): Promise<ArrayBuffer>
}
```

#### 1.2 PDF 预览组件 (PDFViewer)
```javascript
class PDFViewer {
  constructor(container, options) {
    this.container = container;
    this.scale = options.scale || 1.0;
    this.currentPage = 1;
  }
  
  // 加载 PDF 文档
  loadDocument(arrayBuffer: ArrayBuffer): Promise<void>
  
  // 渲染指定页面
  renderPage(pageNum: number): Promise<void>
  
  // 缩放控制
  zoomIn(): void
  zoomOut(): void
  fitToPage(): void
  
  // 页面导航
  nextPage(): void
  previousPage(): void
  goToPage(pageNum: number): void
}
```

#### 1.3 进度指示器 (ProgressIndicator)
```javascript
class ProgressIndicator {
  // 显示进度
  show(message: string): void
  
  // 更新进度
  update(percent: number, message: string): void
  
  // 隐藏进度
  hide(): void
}
```

#### 1.4 通用工具函数 (Utils)
```javascript
const Utils = {
  // 下载文件
  downloadFile(blob: Blob, filename: string): void
  
  // 格式化文件大小
  formatFileSize(bytes: number): string
  
  // 解析页面范围字符串 "1-3, 5, 7-9"
  parsePageRange(rangeStr: string, totalPages: number): number[]
  
  // 显示错误消息
  showError(message: string): void
  
  // 显示成功消息
  showSuccess(message: string): void
}
```

### 2. 工具特定组件

#### 2.1 PDF 预览工具 (pdf-preview.html)
```javascript
class PDFPreviewTool {
  constructor() {
    this.viewer = new PDFViewer(container, options);
    this.uploader = new FileUploader({ multiple: false });
  }
  
  // 初始化工具
  init(): void
  
  // 处理文件上传
  handleFileUpload(file: File): Promise<void>
}
```

#### 2.2 PDF 合并工具 (pdf-merge.html)
```javascript
class PDFMergeTool {
  constructor() {
    this.uploader = new FileUploader({ multiple: true });
    this.fileList = [];
  }
  
  // 添加文件到列表
  addFiles(files: File[]): void
  
  // 移除文件
  removeFile(index: number): void
  
  // 重新排序文件
  reorderFiles(fromIndex: number, toIndex: number): void
  
  // 合并 PDF
  mergePDFs(): Promise<Blob>
}
```

#### 2.3 PDF 拆分工具 (pdf-split.html)
```javascript
class PDFSplitTool {
  constructor() {
    this.uploader = new FileUploader({ multiple: false });
    this.pdfDoc = null;
  }
  
  // 加载 PDF
  loadPDF(file: File): Promise<void>
  
  // 验证页面范围
  validatePageRange(rangeStr: string): boolean
  
  // 提取页面
  extractPages(pageNumbers: number[]): Promise<Blob>
}
```

#### 2.4 PDF 重排工具 (pdf-reorder.html)
```javascript
class PDFReorderTool {
  constructor() {
    this.uploader = new FileUploader({ multiple: false });
    this.pages = [];
  }
  
  // 加载并显示所有页面缩略图
  loadPages(file: File): Promise<void>
  
  // 删除页面
  deletePage(pageIndex: number): void
  
  // 重新排列页面
  reorderPages(fromIndex: number, toIndex: number): void
  
  // 生成新 PDF
  generatePDF(): Promise<Blob>
}
```

#### 2.5 PDF 水印工具 (pdf-watermark.html)
```javascript
class PDFWatermarkTool {
  constructor() {
    this.uploader = new FileUploader({ multiple: false });
    this.watermarkConfig = {
      text: '',
      fontSize: 48,
      color: '#000000',
      opacity: 0.3,
      position: 'center' // center, top-left, top-right, bottom-left, bottom-right
    };
  }
  
  // 加载 PDF
  loadPDF(file: File): Promise<void>
  
  // 更新水印配置
  updateConfig(config: object): void
  
  // 预览水印效果
  previewWatermark(): void
  
  // 应用水印
  applyWatermark(): Promise<Blob>
}
```

#### 2.6 PDF 批注工具 (pdf-annotate.html)
```javascript
class PDFAnnotateTool {
  constructor() {
    this.uploader = new FileUploader({ multiple: false });
    this.annotations = [];
    this.currentTool = null; // 'text', 'highlight', 'underline'
  }
  
  // 加载 PDF
  loadPDF(file: File): Promise<void>
  
  // 选择工具
  selectTool(toolType: string): void
  
  // 添加文字批注
  addTextAnnotation(x: number, y: number, text: string): void
  
  // 添加高亮
  addHighlight(x: number, y: number, width: number, height: number): void
  
  // 删除批注
  deleteAnnotation(annotationId: string): void
  
  // 保存带批注的 PDF
  savePDF(): Promise<Blob>
}
```

#### 2.7 PDF 转图片工具 (pdf-to-image.html)
```javascript
class PDFToImageTool {
  constructor() {
    this.uploader = new FileUploader({ multiple: false });
    this.format = 'png'; // 'png' or 'jpg'
    this.selectedPages = [];
  }
  
  // 加载 PDF
  loadPDF(file: File): Promise<void>
  
  // 选择输出格式
  setFormat(format: string): void
  
  // 选择页面
  togglePageSelection(pageIndex: number): void
  
  // 转换为图片
  convertToImages(): Promise<Blob[]>
  
  // 打包为 ZIP（多页时）
  packageAsZip(images: Blob[]): Promise<Blob>
}
```

#### 2.8 PDF 压缩工具 (pdf-compress.html)
```javascript
class PDFCompressTool {
  constructor() {
    this.uploader = new FileUploader({ multiple: false });
    this.quality = 0.7; // 0.3 (低), 0.7 (中), 0.9 (高)
  }
  
  // 加载 PDF
  loadPDF(file: File): Promise<void>
  
  // 设置压缩质量
  setQuality(quality: number): void
  
  // 估算压缩后大小
  estimateSize(): number
  
  // 压缩 PDF
  compressPDF(): Promise<Blob>
}
```

## 数据模型

### PDF 文档模型
```javascript
{
  file: File,              // 原始文件对象
  arrayBuffer: ArrayBuffer, // 文件内容
  pdfDoc: PDFDocument,     // pdf-lib 文档对象
  numPages: number,        // 总页数
  fileSize: number,        // 文件大小（字节）
  fileName: string         // 文件名
}
```

### 页面模型
```javascript
{
  pageNumber: number,      // 页码
  thumbnail: string,       // 缩略图 Data URL
  width: number,           // 页面宽度
  height: number,          // 页面高度
  selected: boolean        // 是否选中
}
```

### 批注模型
```javascript
{
  id: string,              // 唯一标识
  type: string,            // 'text', 'highlight', 'underline'
  pageNumber: number,      // 所在页码
  x: number,               // X 坐标
  y: number,               // Y 坐标
  width: number,           // 宽度（高亮/下划线）
  height: number,          // 高度（高亮/下划线）
  text: string,            // 文字内容（文字批注）
  color: string,           // 颜色
  fontSize: number         // 字体大小（文字批注）
}
```


## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的正式声明。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### 属性 1: PDF 渲染完整性
*对于任何*有效的 PDF 文件，上传后应该在 DOM 中成功渲染出 PDF 内容元素
**验证需求: 1.1**

### 属性 2: 多页导航控件存在性
*对于任何*包含多页的 PDF 文件，预览界面应该显示页面导航控件（上一页、下一页、跳转按钮）
**验证需求: 1.2**

### 属性 3: 缩放控件功能性
*对于任何*加载的 PDF 文件，预览界面应该提供可用的缩放控件，且缩放操作应该改变显示比例
**验证需求: 1.3**

### 属性 4: 文件切换状态清理
*对于任何*已加载的 PDF，当加载新文件时，之前的预览内容应该被完全清除
**验证需求: 1.5**

### 属性 5: 文件列表显示一致性
*对于任何*上传的 PDF 文件集合，显示的文件列表项数量应该等于上传的文件数量
**验证需求: 2.1**

### 属性 6: 文件顺序可重排性
*对于任何*文件列表，拖拽操作应该能够改变文件在列表中的顺序
**验证需求: 2.2**

### 属性 7: PDF 合并页面保持性
*对于任何*多个 PDF 文件的集合，合并后的 PDF 总页数应该等于所有输入 PDF 的页数之和
**验证需求: 2.3**

### 属性 8: 文件删除列表更新
*对于任何*文件列表，删除一个文件后，列表长度应该减少 1
**验证需求: 2.5**

### 属性 9: 页面信息准确性
*对于任何*上传的 PDF 文件，显示的总页数应该与 PDF 实际页数相等
**验证需求: 3.1**

### 属性 10: 页面范围解析正确性
*对于任何*有效的页面范围字符串（如 "1-3, 5, 7-9"），解析结果应该包含所有指定的页码且不重复
**验证需求: 3.2**

### 属性 11: 页面提取数量一致性
*对于任何*指定的页面范围，提取后的 PDF 页数应该等于范围中指定的页面数量
**验证需求: 3.4**

### 属性 12: 缩略图数量一致性
*对于任何*上传的 PDF 文件，生成的缩略图数量应该等于 PDF 的总页数
**验证需求: 4.1**

### 属性 13: 页面删除数量减少
*对于任何*包含 N 页的 PDF，删除 M 页后，剩余页面数应该为 N - M
**验证需求: 4.2**

### 属性 14: 页面顺序可重排性
*对于任何*页面缩略图列表，拖拽操作应该能够改变页面在列表中的顺序
**验证需求: 4.3**

### 属性 15: 重排后页面保持性
*对于任何*经过删除和重排的 PDF，生成的新 PDF 应该只包含未删除的页面，且顺序与重排后一致
**验证需求: 4.4**

### 属性 16: 水印配置界面可见性
*对于任何*上传的 PDF 文件，水印配置界面（文字、大小、颜色、透明度、位置选项）应该显示
**验证需求: 5.1**

### 属性 17: 水印预览实时性
*对于任何*水印配置的改变，预览应该立即更新以反映新的水印效果
**验证需求: 5.2, 5.3**

### 属性 18: 水印应用全局性
*对于任何*包含 N 页的 PDF，应用水印后，所有 N 页都应该包含配置的水印
**验证需求: 5.4**

### 属性 19: 批注工具栏可见性
*对于任何*上传的 PDF 文件，批注工具栏（文字批注、高亮、下划线工具）应该显示
**验证需求: 6.1**

### 属性 20: 批注创建响应性
*对于任何*批注工具的使用，应该在指定位置创建对应类型的批注元素
**验证需求: 6.2, 6.3**

### 属性 21: 批注删除数量减少
*对于任何*包含 N 个批注的文档，删除 1 个批注后，批注数量应该为 N - 1
**验证需求: 6.5**

### 属性 22: 格式选择界面可见性
*对于任何*上传的 PDF 文件，格式选择选项（JPG、PNG）应该显示
**验证需求: 7.1**

### 属性 23: 页面选择导出一致性
*对于任何*选中的页面集合，导出的图片数量应该等于选中的页面数量
**验证需求: 7.3**

### 属性 24: 图片格式转换正确性
*对于任何*选择的输出格式（JPG 或 PNG），生成的图片文件应该是对应的 MIME 类型
**验证需求: 7.4**

### 属性 25: 多页导出打包性
*对于任何*多于 1 页的导出操作，应该生成一个 ZIP 文件包含所有图片
**验证需求: 7.5**

### 属性 26: 压缩质量选项可见性
*对于任何*上传的 PDF 文件，应该显示原始文件大小和压缩质量选项（低、中、高）
**验证需求: 8.1**

### 属性 27: 压缩文件大小减少
*对于任何*PDF 文件和任何压缩质量设置，压缩后的文件大小应该小于或等于原始文件大小
**验证需求: 8.3**

### 属性 28: 返回链接存在性
*对于任何*工具页面，应该存在返回导航网站的链接元素
**验证需求: 9.2**

### 属性 29: 客户端处理隔离性
*对于任何*PDF 文件的上传和处理操作，不应该产生任何向外部服务器发送文件数据的网络请求
**验证需求: 10.1, 10.2, 10.5**

### 属性 30: 页面刷新数据清理
*对于任何*已加载的 PDF 数据，页面刷新后不应该在浏览器存储中残留文件数据
**验证需求: 10.3**

### 属性 31: 隐私说明可见性
*对于任何*工具页面，应该显示隐私保护说明文本
**验证需求: 10.4**

## 错误处理

### 1. 文件上传错误
- **无效文件类型**: 显示 "请上传有效的 PDF 文件" 错误消息
- **文件过大**: 显示 "文件大小超过限制（最大 50MB）" 错误消息
- **文件读取失败**: 显示 "文件读取失败，请重试" 错误消息

### 2. PDF 处理错误
- **PDF 解析失败**: 显示 "PDF 文件损坏或格式不支持" 错误消息
- **页面范围无效**: 显示 "页面范围格式错误，请使用格式：1-3, 5, 7-9" 错误消息
- **页面超出范围**: 显示 "指定的页码超出文档范围（1-N）" 错误消息
- **空文档操作**: 显示 "无法保存空文档，请至少保留一页" 警告消息

### 3. 内存和性能错误
- **内存不足**: 显示 "文件过大，浏览器内存不足" 错误消息，建议使用较小的文件
- **处理超时**: 显示 "处理时间过长，请尝试较小的文件或降低质量设置" 错误消息

### 4. 浏览器兼容性错误
- **API 不支持**: 检测浏览器是否支持必要的 API（FileReader, Canvas, Blob），不支持时显示升级提示
- **PDF.js 加载失败**: 显示 "PDF 库加载失败，请刷新页面重试" 错误消息

### 错误处理策略
1. **用户友好**: 所有错误消息使用简单明了的中文，避免技术术语
2. **可操作性**: 错误消息应该提供解决建议或替代方案
3. **非阻塞**: 错误不应该导致整个应用崩溃，应该允许用户重试或选择其他操作
4. **日志记录**: 在控制台记录详细的技术错误信息，便于调试

## 测试策略

### 单元测试

使用 **Vitest** 作为测试框架，对核心功能模块进行单元测试：

1. **工具函数测试**
   - `Utils.parsePageRange()`: 测试各种页面范围字符串的解析
   - `Utils.formatFileSize()`: 测试文件大小格式化
   - `Utils.downloadFile()`: 测试文件下载触发

2. **组件功能测试**
   - `FileUploader`: 测试文件验证逻辑
   - `PDFViewer`: 测试页面导航和缩放逻辑
   - 各工具类的核心方法

3. **边缘情况测试**
   - 空文件处理
   - 超大文件处理
   - 损坏的 PDF 文件
   - 无效的用户输入

### 基于属性的测试

使用 **fast-check** 库进行基于属性的测试，每个测试运行至少 100 次迭代：

1. **页面范围解析属性测试**
   - 生成随机的有效页面范围字符串
   - 验证解析结果的正确性和唯一性
   - **功能: pdf-tools-suite, 属性 10: 页面范围解析正确性**

2. **文件合并属性测试**
   - 生成随机数量和页数的 PDF 文件
   - 验证合并后总页数等于输入页数之和
   - **功能: pdf-tools-suite, 属性 7: PDF 合并页面保持性**

3. **页面删除属性测试**
   - 生成随机页数的 PDF，随机删除若干页
   - 验证剩余页数 = 原始页数 - 删除页数
   - **功能: pdf-tools-suite, 属性 13: 页面删除数量减少**

4. **压缩属性测试**
   - 生成随机的 PDF 文件和压缩质量
   - 验证压缩后文件大小 <= 原始文件大小
   - **功能: pdf-tools-suite, 属性 27: 压缩文件大小减少**

5. **网络隔离属性测试**
   - 监控所有 PDF 操作期间的网络请求
   - 验证没有文件数据被发送到外部服务器
   - **功能: pdf-tools-suite, 属性 29: 客户端处理隔离性**

### 集成测试

使用 **Playwright** 进行端到端测试：

1. **完整工作流测试**
   - 从导航网站点击进入工具页面
   - 上传 PDF 文件
   - 执行工具特定操作
   - 下载结果文件
   - 验证结果文件的正确性

2. **跨工具导航测试**
   - 测试从一个工具页面导航到另一个工具页面
   - 验证状态清理和页面加载

3. **响应式测试**
   - 在不同屏幕尺寸下测试工具页面
   - 验证移动端和桌面端的可用性

### 测试配置

**Vitest 配置** (vitest.config.js):
```javascript
export default {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js'
  }
}
```

**fast-check 配置**:
- 每个属性测试至少运行 100 次迭代
- 使用自定义生成器生成有效的 PDF 数据结构
- 失败时自动缩小反例以便调试

**测试覆盖率目标**:
- 核心功能代码覆盖率 > 80%
- 所有正确性属性都有对应的属性测试
- 所有边缘情况都有单元测试覆盖
