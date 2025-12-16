# Design Document: Code Tools Suite

## Overview

代码格式转换工具套件是一组8个独立的前端工具页面，用于处理各种代码和文本格式的转换、编码、解析等操作。所有工具将集成到现有的在线工具箱导航系统中，采用与现有JSON工具一致的架构模式和蓝色主题UI风格。

### 设计目标

1. **一致性**: 与现有工具（JSON工具、PDF工具、图片工具）保持一致的UI风格和代码架构
2. **独立性**: 每个工具都是独立的HTML页面，可单独使用
3. **本地处理**: 所有数据处理在浏览器本地完成，保护用户隐私
4. **响应式**: 支持桌面和移动设备访问
5. **可复用**: 共享工具函数和样式，减少代码重复

## Architecture

```
code-tools/
├── index.html                    # 工具套件首页（可选）
├── shared/
│   ├── styles.css               # 共享样式（蓝色主题）
│   ├── utils.js                 # 共享工具函数
│   └── components.js            # 共享UI组件
├── markdown-html.html           # Markdown/HTML转换
├── json-tools.html              # JSON格式化/压缩/校验
├── url-codec.html               # URL编码/解码
├── jwt-parser.html              # JWT解析/编码
├── text-diff.html               # Diff对比工具
├── case-converter.html          # 命名风格转换
├── base64-image.html            # 图片Base64转换
└── table-converter.html         # Markdown表格/CSV转换
```

### 技术栈

- **HTML5**: 页面结构
- **CSS3**: 样式（蓝色主题，响应式布局）
- **Vanilla JavaScript**: 核心逻辑，无框架依赖
- **第三方库**:
  - `marked.js`: Markdown解析
  - `turndown.js`: HTML转Markdown
  - `diff-match-patch`: 文本差异比较

## Components and Interfaces

### 共享工具函数 (utils.js)

```javascript
const CodeUtils = {
  // Markdown/HTML 转换
  markdownToHTML(markdown: string): string
  htmlToMarkdown(html: string): string
  
  // JSON 处理
  formatJSON(json: string, indent?: number): string
  compressJSON(json: string): string
  validateJSON(json: string): ValidationResult
  
  // URL 编码/解码
  encodeURL(text: string, mode: 'component' | 'full'): string
  decodeURL(encoded: string): string
  
  // JWT 处理
  parseJWT(token: string): JWTResult
  generateJWT(header: object, payload: object): string
  
  // 文本差异
  diffText(text1: string, text2: string, mode: 'line' | 'word'): DiffResult[]
  
  // 命名风格转换
  convertCase(text: string, targetCase: CaseType): string
  detectCase(text: string): CaseType
  
  // Base64 处理
  imageToBase64(file: File): Promise<string>
  base64ToImage(base64: string): Blob
  
  // 表格转换
  csvToMarkdownTable(csv: string): string
  markdownTableToCSV(markdown: string): string
  
  // 通用工具
  copyToClipboard(text: string): Promise<void>
  downloadFile(content: string, filename: string, mimeType: string): void
  showMessage(message: string, type: 'success' | 'error' | 'warning'): void
}
```

### 类型定义

```typescript
type CaseType = 'camelCase' | 'PascalCase' | 'snake_case' | 'kebab-case' | 'CONSTANT_CASE'

interface ValidationResult {
  valid: boolean
  error?: { message: string, line: number, column: number }
  stats?: { keys: number, depth: number, size: number }
}

interface JWTResult {
  header: object
  payload: object
  signature: string
  isExpired?: boolean
  expiresAt?: Date
}

interface DiffResult {
  type: 'added' | 'deleted' | 'unchanged'
  content: string
  lineNumber?: number
}
```

### UI组件 (components.js)

```javascript
class CodeEditor {
  constructor(container, options)
  setValue(value: string): void
  getValue(): string
  clear(): void
  setReadOnly(readOnly: boolean): void
  highlightError(line: number, column: number): void
}

class FileHandler {
  uploadFile(acceptTypes: string[]): Promise<File>
  readAsText(file: File): Promise<string>
  readAsDataURL(file: File): Promise<string>
  downloadFile(content: string, filename: string): void
}

class TabPanel {
  constructor(container, tabs: TabConfig[])
  switchTab(tabId: string): void
  getActiveTab(): string
}
```

## Data Models

### Markdown/HTML 转换数据流

```
Input (Markdown/HTML string)
    ↓
Parser (marked.js / turndown.js)
    ↓
Output (HTML/Markdown string)
    ↓
Preview (rendered HTML)
```

### JWT 数据结构

```
JWT Token: header.payload.signature
    ↓
Split by '.'
    ↓
Base64 Decode each part
    ↓
{
  header: { alg, typ, ... },
  payload: { sub, exp, iat, ... },
  signature: "..."
}
```

### Diff 结果数据结构

```javascript
{
  changes: [
    { type: 'unchanged', content: 'line 1', lineNumber: 1 },
    { type: 'deleted', content: 'old line 2', lineNumber: 2 },
    { type: 'added', content: 'new line 2', lineNumber: 2 },
    { type: 'unchanged', content: 'line 3', lineNumber: 3 }
  ],
  stats: {
    additions: 1,
    deletions: 1,
    unchanged: 2
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Markdown/HTML Round-Trip Consistency
*For any* valid Markdown text, converting to HTML and then back to Markdown should preserve the semantic content (headings, lists, links, emphasis remain intact).
**Validates: Requirements 1.1, 1.2**

### Property 2: JSON Format/Compress Preserves Data
*For any* valid JSON string, formatting then compressing (or vice versa) should produce a JSON that parses to an equivalent object.
**Validates: Requirements 2.1, 2.2**

### Property 3: JSON Validation Correctness
*For any* string input, the JSON validator should return valid=true if and only if JSON.parse succeeds on that input.
**Validates: Requirements 2.3**

### Property 4: URL Encode/Decode Round-Trip
*For any* string, encoding then decoding should return the original string. Similarly, for any validly encoded string, decoding then encoding should return an equivalent encoded string.
**Validates: Requirements 3.1, 3.2**

### Property 5: URL Encoding Mode Correctness
*For any* string containing reserved URL characters, encodeURIComponent mode should encode more characters than encodeURI mode.
**Validates: Requirements 3.3, 3.4**

### Property 6: JWT Parse/Generate Round-Trip
*For any* valid header and payload objects, generating a JWT then parsing it should return the original header and payload.
**Validates: Requirements 4.1, 4.2, 4.3**

### Property 7: JWT Expiration Detection
*For any* JWT with an exp claim, the parser should correctly identify whether the token is expired based on the current time.
**Validates: Requirements 4.5**

### Property 8: Diff Symmetry
*For any* two texts A and B, the diff from A to B should have additions that match the deletions from B to A.
**Validates: Requirements 5.1**

### Property 9: Diff Mode Granularity
*For any* two texts with differences, word-level diff should produce equal or more change segments than line-level diff.
**Validates: Requirements 5.3, 5.4**

### Property 10: Case Conversion Idempotence
*For any* string already in a target case format, converting to that same format should return the identical string.
**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

### Property 11: Case Conversion Word Preservation
*For any* multi-word string, converting to any case format should preserve the same number of logical words.
**Validates: Requirements 6.1**

### Property 12: Base64 Image Round-Trip
*For any* valid image file, converting to Base64 then back to image should produce identical binary data.
**Validates: Requirements 7.1, 7.3**

### Property 13: Base64 Data URL Format
*For any* image converted to Base64, the output should match the pattern `data:<mime-type>;base64,<encoded-data>`.
**Validates: Requirements 7.2**

### Property 14: CSV/Markdown Table Round-Trip
*For any* simple CSV data (without nested quotes), converting to Markdown table then back to CSV should preserve all cell values.
**Validates: Requirements 8.1, 8.2**

### Property 15: CSV Escape Handling
*For any* CSV data containing commas or quotes within cells, the parser should correctly identify cell boundaries.
**Validates: Requirements 8.5**

## Error Handling

### 输入验证错误

| 错误类型 | 处理方式 |
|---------|---------|
| 空输入 | 显示提示信息，不执行转换 |
| 无效JSON | 显示错误位置和错误信息 |
| 无效JWT格式 | 显示具体格式错误 |
| 无效Base64 | 显示解码失败提示 |
| 无效URL编码 | 显示错误提示，保留原始输入 |

### 文件处理错误

| 错误类型 | 处理方式 |
|---------|---------|
| 文件过大 | 显示大小限制提示（建议10MB） |
| 不支持的文件类型 | 显示支持的类型列表 |
| 文件读取失败 | 显示读取错误信息 |

### 用户反馈

- 成功操作：绿色提示消息，3秒后自动消失
- 错误操作：红色提示消息，需手动关闭或3秒后消失
- 警告信息：黄色提示消息

## Testing Strategy

### 双重测试方法

本项目采用单元测试和属性测试相结合的方式：

1. **单元测试**: 验证特定示例和边界情况
2. **属性测试**: 验证在所有有效输入上应该成立的通用属性

### 属性测试框架

使用 **fast-check** 作为属性测试库，配置每个属性测试运行至少100次迭代。

### 测试文件结构

```
tests/
├── code-utils.test.js           # 单元测试
├── markdown-html.property.test.js    # Property 1
├── json-tools.property.test.js       # Property 2, 3
├── url-codec.property.test.js        # Property 4, 5
├── jwt-parser.property.test.js       # Property 6, 7
├── text-diff.property.test.js        # Property 8, 9
├── case-converter.property.test.js   # Property 10, 11
├── base64-image.property.test.js     # Property 12, 13
└── table-converter.property.test.js  # Property 14, 15
```

### 属性测试标注格式

每个属性测试必须使用以下格式标注：
```javascript
/**
 * Feature: code-tools-suite, Property 1: Markdown/HTML Round-Trip Consistency
 * Validates: Requirements 1.1, 1.2
 */
```

### 测试覆盖重点

| 工具 | 单元测试重点 | 属性测试重点 |
|-----|------------|------------|
| Markdown/HTML | 特殊字符处理、嵌套结构 | Round-trip一致性 |
| JSON工具 | 错误位置检测、深层嵌套 | 格式化/压缩数据完整性 |
| URL编码 | 特殊字符、Unicode | Round-trip、编码模式 |
| JWT解析 | 过期检测、无效格式 | Round-trip、过期判断 |
| Diff工具 | 空输入、相同文本 | 对称性、粒度 |
| 命名转换 | 边界情况、数字处理 | 幂等性、词数保持 |
| Base64 | 不同图片格式 | Round-trip、格式验证 |
| 表格转换 | 转义字符、空单元格 | Round-trip、转义处理 |
