# Design Document - JSON 数据处理工具套件

## Overview

JSON 数据处理工具套件是一个纯前端的 Web 应用集合，包含 6 个独立的 HTML 工具页面，用于处理 JSON 数据的各种常见操作。所有工具均在浏览器端运行，无需后端服务器，确保用户数据隐私安全。

该套件将集成到现有的工具导航网站（tooles/index.html）中，与现有的图片工具和 PDF 工具保持一致的设计风格和用户体验。

### 核心功能

1. **JSON 格式化与压缩** - 美化或压缩 JSON 数据
2. **JSON 验证** - 检查 JSON 语法正确性
3. **JSON ↔ XML 转换** - JSON 和 XML 格式互转
4. **JSON ↔ CSV 转换** - JSON 和 CSV 格式互转
5. **JSON 差异比较** - 比较两个 JSON 的差异
6. **JSON Schema 生成与校验** - 生成和验证 JSON Schema

## Architecture

### 技术栈

- **前端框架**: 纯 HTML + CSS + JavaScript（无框架依赖）
- **JSON 处理**: 原生 JavaScript JSON API
- **XML 处理**: DOMParser 和 XMLSerializer API
- **CSV 处理**: 自定义解析器
- **JSON Schema**: Ajv 库（通过 CDN 引入）
- **代码高亮**: Prism.js 或自定义高亮方案
- **差异比较**: jsondiffpatch 库（通过 CDN 引入）

### 目录结构

```
json-tools/
├── index.html                    # 工具集导航页（可选）
├── json-formatter.html           # JSON 格式化工具
├── json-validator.html           # JSON 验证工具
├── json-xml-converter.html       # JSON/XML 转换工具
├── json-csv-converter.html       # JSON/CSV 转换工具
├── json-diff.html                # JSON 差异比较工具
├── json-schema.html              # JSON Schema 工具
├── shared/
│   ├── styles.css                # 共享样式
│   ├── utils.js                  # 工具函数库
│   └── components.js             # 共享组件
└── README.md                     # 说明文档
```

### 设计原则

1. **一致性**: 与现有图片工具和 PDF 工具保持一致的 UI 风格
2. **隐私优先**: 所有处理在本地完成，不上传数据
3. **响应式设计**: 适配桌面和移动设备
4. **无依赖**: 尽量使用原生 API，减少外部依赖
5. **用户友好**: 清晰的错误提示和操作反馈

## Components and Interfaces

### 1. 共享组件库 (shared/components.js)

#### JSONEditor 组件
```javascript
class JSONEditor {
  constructor(container, options = {})
  setValue(value)                    // 设置编辑器内容
  getValue()                         // 获取编辑器内容
  format()                           // 格式化 JSON
  validate()                         // 验证 JSON
  clear()                            // 清空编辑器
  enableLineNumbers()                // 启用行号
  highlightError(line, column)       // 高亮错误位置
}
```

#### FileHandler 组件
```javascript
class FileHandler {
  uploadFile(acceptTypes)            // 上传文件
  readAsText(file)                   // 读取文件为文本
  downloadFile(content, filename)    // 下载文件
  copyToClipboard(text)              // 复制到剪贴板
}
```

#### DiffViewer 组件
```javascript
class DiffViewer {
  constructor(container)
  compare(json1, json2)              // 比较两个 JSON
  render(diff)                       // 渲染差异结果
  highlightChanges()                 // 高亮变化
}
```

### 2. 工具函数库 (shared/utils.js)

#### JSON 处理函数
```javascript
// JSON 格式化
function formatJSON(jsonString, indent = 2)

// JSON 压缩
function compressJSON(jsonString)

// JSON 验证
function validateJSON(jsonString)

// 获取 JSON 统计信息
function getJSONStats(jsonObject)
```

#### 转换函数
```javascript
// JSON 转 XML
function jsonToXML(jsonObject, rootName = 'root')

// XML 转 JSON
function xmlToJSON(xmlString)

// JSON 转 CSV
function jsonToCSV(jsonArray, options = {})

// CSV 转 JSON
function csvToJSON(csvString, options = {})
```

#### Schema 函数
```javascript
// 生成 JSON Schema
function generateSchema(jsonObject)

// 验证 JSON Schema
function validateWithSchema(jsonObject, schema)
```

#### 工具函数
```javascript
// 显示成功消息
function showSuccess(message)

// 显示错误消息
function showError(message)

// 显示加载状态
function showLoading(message)

// 隐藏加载状态
function hideLoading()

// 格式化文件大小
function formatFileSize(bytes)

// 深度克隆对象
function deepClone(obj)
```

## Data Models

### JSON 数据模型

```javascript
// JSON 验证结果
interface ValidationResult {
  valid: boolean;           // 是否有效
  error?: {
    message: string;        // 错误消息
    line: number;           // 错误行号
    column: number;         // 错误列号
  };
  stats?: {
    keys: number;           // 键数量
    depth: number;          // 嵌套层级
    size: number;           // 字符数
  };
}

// JSON 差异结果
interface DiffResult {
  added: Array<{
    path: string;           // 路径
    value: any;             // 值
  }>;
  deleted: Array<{
    path: string;
    value: any;
  }>;
  modified: Array<{
    path: string;
    oldValue: any;
    newValue: any;
  }>;
}

// Schema 验证结果
interface SchemaValidationResult {
  valid: boolean;
  errors?: Array<{
    path: string;           // 字段路径
    message: string;        // 错误消息
    keyword: string;        // 违反的关键字
  }>;
}
```

### 转换选项模型

```javascript
// CSV 转换选项
interface CSVOptions {
  delimiter: string;        // 分隔符（默认逗号）
  quote: string;            // 引号字符（默认双引号）
  header: boolean;          // 是否包含表头
  flatten: boolean;         // 是否扁平化嵌套对象
}

// XML 转换选项
interface XMLOptions {
  rootName: string;         // 根元素名称
  arrayName: string;        // 数组元素名称
  declaration: boolean;     // 是否包含 XML 声明
  indent: number;           // 缩进空格数
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

在分析了所有验收标准后，我们识别出以下可以合并或优化的属性：

- 属性 1.1 和 1.2（格式化和压缩）都是关于 JSON 往返转换的，可以合并为一个往返属性
- 属性 3.1 和 3.2（JSON/XML 互转）可以合并为往返属性
- 属性 4.1 和 4.2（JSON/CSV 互转）可以合并为往返属性
- 多个 UI 相关的示例测试（如 5.2, 5.3, 5.4）可以合并为一个综合的差异渲染测试

### 核心正确性属性

Property 1: JSON 格式化往返一致性
*For any* 有效的 JSON 对象，格式化后再解析应该得到等价的对象
**Validates: Requirements 1.1**

Property 2: JSON 压缩往返一致性
*For any* 有效的 JSON 对象，压缩后再解析应该得到等价的对象
**Validates: Requirements 1.2**

Property 3: 无效 JSON 错误检测
*For any* 无效的 JSON 字符串，验证函数应该返回错误信息，包含错误位置
**Validates: Requirements 1.3, 2.3**

Property 4: JSON 验证准确性
*For any* JSON 字符串，验证结果应该与原生 JSON.parse 的结果一致
**Validates: Requirements 2.1**

Property 5: JSON 统计信息准确性
*For any* 有效的 JSON 对象，统计的键数量和嵌套层级应该与实际结构匹配
**Validates: Requirements 2.2**

Property 6: JSON-XML 往返一致性
*For any* 可表示为 XML 的 JSON 对象，转换为 XML 再转回 JSON 应该保持数据结构和值的完整性
**Validates: Requirements 3.1, 3.2, 3.4**

Property 7: XML 格式有效性
*For any* 有效的 JSON 对象，转换后的 XML 应该能被 DOMParser 成功解析
**Validates: Requirements 3.1**

Property 8: 无效格式错误提示
*For any* 无效的 JSON 或 XML 输入，系统应该明确指出哪种格式验证失败
**Validates: Requirements 3.5**

Property 9: JSON-CSV 往返一致性
*For any* JSON 数组（对象数组），转换为 CSV 再转回 JSON 应该保持数据完整性（考虑扁平化规则）
**Validates: Requirements 4.1, 4.2**

Property 10: CSV 特殊字符处理
*For any* 包含特殊字符（逗号、引号、换行）的 CSV 数据，解析后应该正确保留这些字符
**Validates: Requirements 4.4**

Property 11: 嵌套结构扁平化一致性
*For any* 包含嵌套对象或数组的 JSON，扁平化后的 CSV 应该能够重建原始数据的语义
**Validates: Requirements 4.3**

Property 12: JSON 差异检测完整性
*For any* 两个不同的 JSON 对象，差异检测应该识别所有新增、删除和修改的路径
**Validates: Requirements 5.1**

Property 13: 相同 JSON 无差异
*For any* JSON 对象，与自身比较应该返回无差异结果
**Validates: Requirements 5.5**

Property 14: 差异检测错误处理
*For any* 包含无效 JSON 的输入对，系统应该指出哪个输入有问题
**Validates: Requirements 5.6**

Property 15: Schema 生成有效性
*For any* 有效的 JSON 对象，生成的 Schema 应该符合 JSON Schema 规范，并且该 JSON 应该能通过自己生成的 Schema 验证
**Validates: Requirements 6.1, 6.5**

Property 16: Schema 验证准确性
*For any* JSON 对象和 Schema 对，验证结果应该与 Ajv 库的验证结果一致
**Validates: Requirements 6.2**

Property 17: Schema 验证错误详情
*For any* 不符合 Schema 的 JSON 对象，验证错误应该包含字段路径和违反的约束
**Validates: Requirements 6.4**

Property 18: 本地处理无网络请求
*For any* 工具操作，不应该向服务器发送任何包含用户数据的网络请求
**Validates: Requirements 9.1**

Property 19: 无持久化存储
*For any* 工具操作，不应该使用 localStorage 或 sessionStorage 存储用户数据
**Validates: Requirements 9.3**

Property 20: 文件上传内容填充
*For any* 上传的文本文件，文件内容应该正确填充到输入区域
**Validates: Requirements 10.2**

Property 21: 下载文件名格式
*For any* 下载操作，生成的文件名应该包含工具名称和时间戳
**Validates: Requirements 10.5**

## Error Handling

### 错误类型

1. **语法错误 (Syntax Errors)**
   - JSON 解析错误
   - XML 解析错误
   - CSV 格式错误
   - 处理方式：显示错误消息，高亮错误位置，提供修复建议

2. **验证错误 (Validation Errors)**
   - Schema 验证失败
   - 数据类型不匹配
   - 必填字段缺失
   - 处理方式：显示详细的验证错误列表，包含字段路径和原因

3. **转换错误 (Conversion Errors)**
   - 无法映射的数据结构
   - 数据丢失风险
   - 格式不兼容
   - 处理方式：使用默认规则转换，显示警告信息

4. **文件错误 (File Errors)**
   - 文件读取失败
   - 文件格式不支持
   - 文件过大
   - 处理方式：显示错误消息，提供文件要求说明

5. **系统错误 (System Errors)**
   - 浏览器 API 不支持
   - 内存不足
   - 剪贴板访问被拒绝
   - 处理方式：显示友好的错误消息，提供替代方案

### 错误处理策略

```javascript
// 统一错误处理函数
function handleError(error, context) {
  // 记录错误（仅在开发模式）
  if (isDevelopment()) {
    console.error(`[${context}]`, error);
  }
  
  // 根据错误类型显示不同的消息
  if (error instanceof SyntaxError) {
    showError(`语法错误: ${error.message}`);
  } else if (error instanceof ValidationError) {
    showValidationErrors(error.errors);
  } else if (error instanceof ConversionError) {
    showWarning(`转换警告: ${error.message}`);
  } else {
    showError(`操作失败: ${error.message || '未知错误'}`);
  }
}

// 自定义错误类
class ValidationError extends Error {
  constructor(errors) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

class ConversionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConversionError';
  }
}
```

### 用户反馈机制

1. **即时反馈**: 输入时实时验证（可选）
2. **错误高亮**: 在编辑器中高亮错误位置
3. **详细说明**: 提供错误原因和修复建议
4. **操作撤销**: 允许用户撤销操作（通过重新上传或清空）
5. **状态保持**: 错误发生后保持用户输入，不清空数据

## Testing Strategy

### 单元测试

使用 Vitest 作为测试框架，测试核心功能函数：

**JSON 处理函数测试**:
- 测试 `formatJSON()` 对各种 JSON 结构的格式化
- 测试 `compressJSON()` 的压缩效果
- 测试 `validateJSON()` 对有效和无效 JSON 的验证
- 测试 `getJSONStats()` 的统计准确性

**转换函数测试**:
- 测试 `jsonToXML()` 和 `xmlToJSON()` 的基本转换
- 测试 `jsonToCSV()` 和 `csvToJSON()` 的基本转换
- 测试特殊字符和边缘情况的处理

**Schema 函数测试**:
- 测试 `generateSchema()` 生成的 Schema 格式
- 测试 `validateWithSchema()` 的验证逻辑

**工具函数测试**:
- 测试文件大小格式化
- 测试深度克隆功能
- 测试错误消息显示

### 属性测试 (Property-Based Testing)

使用 fast-check 库进行属性测试，每个测试运行至少 100 次迭代：

**测试配置**:
```javascript
import fc from 'fast-check';

// 配置测试参数
const testConfig = {
  numRuns: 100,  // 运行 100 次
  verbose: true
};
```

**JSON 生成器**:
```javascript
// 生成任意 JSON 值
const jsonValueArb = fc.letrec(tie => ({
  value: fc.oneof(
    fc.constant(null),
    fc.boolean(),
    fc.integer(),
    fc.double(),
    fc.string(),
    fc.array(tie('value')),
    fc.dictionary(fc.string(), tie('value'))
  )
})).value;

// 生成 JSON 对象
const jsonObjectArb = fc.dictionary(fc.string(), jsonValueArb);

// 生成 JSON 数组
const jsonArrayArb = fc.array(jsonObjectArb);
```

**属性测试用例**:

每个属性测试必须使用注释标记对应的设计文档属性：

```javascript
// **Feature: json-tools-suite, Property 1: JSON 格式化往返一致性**
test('Property 1: JSON format round-trip consistency', () => {
  fc.assert(
    fc.property(jsonObjectArb, (obj) => {
      const formatted = formatJSON(JSON.stringify(obj));
      const parsed = JSON.parse(formatted);
      expect(parsed).toEqual(obj);
    }),
    testConfig
  );
});

// **Feature: json-tools-suite, Property 2: JSON 压缩往返一致性**
test('Property 2: JSON compress round-trip consistency', () => {
  fc.assert(
    fc.property(jsonObjectArb, (obj) => {
      const compressed = compressJSON(JSON.stringify(obj));
      const parsed = JSON.parse(compressed);
      expect(parsed).toEqual(obj);
    }),
    testConfig
  );
});

// **Feature: json-tools-suite, Property 6: JSON-XML 往返一致性**
test('Property 6: JSON-XML round-trip consistency', () => {
  fc.assert(
    fc.property(jsonObjectArb, (obj) => {
      const xml = jsonToXML(obj);
      const backToJson = xmlToJSON(xml);
      // 验证数据结构和值的完整性
      expect(normalizeJSON(backToJson)).toEqual(normalizeJSON(obj));
    }),
    testConfig
  );
});

// **Feature: json-tools-suite, Property 9: JSON-CSV 往返一致性**
test('Property 9: JSON-CSV round-trip consistency', () => {
  fc.assert(
    fc.property(jsonArrayArb, (arr) => {
      // 只测试扁平对象数组
      const flatArr = arr.map(obj => flattenObject(obj));
      const csv = jsonToCSV(flatArr);
      const backToJson = csvToJSON(csv);
      expect(backToJson).toEqual(flatArr);
    }),
    testConfig
  );
});

// **Feature: json-tools-suite, Property 15: Schema 生成有效性**
test('Property 15: Schema generation validity', () => {
  fc.assert(
    fc.property(jsonObjectArb, (obj) => {
      const schema = generateSchema(obj);
      // 验证 Schema 格式
      expect(schema).toHaveProperty('type');
      // 验证原始对象能通过自己的 Schema
      const result = validateWithSchema(obj, schema);
      expect(result.valid).toBe(true);
    }),
    testConfig
  );
});
```

### 集成测试

测试完整的用户工作流：

1. **格式化工具流程**: 上传文件 → 格式化 → 复制/下载
2. **转换工具流程**: 输入数据 → 选择格式 → 转换 → 下载
3. **比较工具流程**: 输入两个 JSON → 比较 → 查看差异
4. **Schema 工具流程**: 输入 JSON → 生成 Schema → 验证

### 浏览器兼容性测试

测试目标浏览器：
- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)

测试内容：
- JSON API 支持
- DOMParser/XMLSerializer 支持
- Clipboard API 支持
- File API 支持
- 响应式布局

## UI Design Specifications

### 配色方案

避免使用紫色渐变，采用现代化的蓝绿配色：

```css
:root {
  /* 主色调 - 蓝色系 */
  --primary-color: #2196F3;      /* 主蓝色 */
  --primary-light: #64B5F6;      /* 浅蓝色 */
  --primary-dark: #1976D2;       /* 深蓝色 */
  
  /* 辅助色 - 绿色系 */
  --success-color: #4CAF50;      /* 成功绿 */
  --success-light: #81C784;      /* 浅绿色 */
  
  /* 警告和错误色 */
  --warning-color: #FF9800;      /* 警告橙 */
  --error-color: #F44336;        /* 错误红 */
  
  /* 中性色 */
  --text-primary: #212121;       /* 主文本 */
  --text-secondary: #757575;     /* 次要文本 */
  --bg-primary: #FFFFFF;         /* 主背景 */
  --bg-secondary: #F5F5F5;       /* 次要背景 */
  --border-color: #E0E0E0;       /* 边框色 */
  
  /* 代码编辑器配色 */
  --code-bg: #263238;            /* 代码背景 */
  --code-text: #ECEFF1;          /* 代码文本 */
  --code-keyword: #C792EA;       /* 关键字 */
  --code-string: #C3E88D;        /* 字符串 */
  --code-number: #F78C6C;        /* 数字 */
  --code-comment: #546E7A;       /* 注释 */
}
```

### 布局结构

每个工具页面采用统一的布局：

```
┌─────────────────────────────────────┐
│ Header (返回链接 + 标题 + 隐私提示)  │
├─────────────────────────────────────┤
│ Input Section (输入区域)             │
│  ├─ Textarea / Editor                │
│  ├─ File Upload Button               │
│  └─ Options (可选配置)               │
├─────────────────────────────────────┤
│ Action Buttons (操作按钮)            │
│  ├─ Primary Action                   │
│  ├─ Secondary Actions                │
│  └─ Clear Button                     │
├─────────────────────────────────────┤
│ Output Section (输出区域)            │
│  ├─ Result Display                   │
│  ├─ Copy Button                      │
│  └─ Download Button                  │
└─────────────────────────────────────┘
```

### 响应式断点

```css
/* 移动设备 */
@media (max-width: 768px) {
  .container { padding: 10px; }
  .editor { min-height: 200px; }
  .button-group { flex-direction: column; }
}

/* 平板设备 */
@media (min-width: 769px) and (max-width: 1024px) {
  .container { padding: 20px; }
  .editor { min-height: 300px; }
}

/* 桌面设备 */
@media (min-width: 1025px) {
  .container { max-width: 1200px; }
  .editor { min-height: 400px; }
  .split-view { display: grid; grid-template-columns: 1fr 1fr; }
}
```

### 交互动画

```css
/* 按钮悬停效果 */
.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 加载动画 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

/* 淡入效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease;
}
```

## Implementation Notes

### 第三方库选择

1. **Ajv** (JSON Schema 验证)
   - CDN: `https://cdn.jsdelivr.net/npm/ajv@8/dist/ajv7.min.js`
   - 用途: Schema 验证
   - 大小: ~50KB (minified)

2. **jsondiffpatch** (JSON 差异比较)
   - CDN: `https://cdn.jsdelivr.net/npm/jsondiffpatch/dist/jsondiffpatch.umd.min.js`
   - 用途: JSON 差异检测和可视化
   - 大小: ~100KB (minified)

3. **Prism.js** (代码高亮 - 可选)
   - CDN: `https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js`
   - 用途: JSON/XML 语法高亮
   - 大小: ~20KB (minified)

### 性能优化

1. **大文件处理**:
   - 对超过 1MB 的文件显示警告
   - 使用 Web Worker 处理大型 JSON（可选）
   - 实现虚拟滚动显示大型结果

2. **实时验证**:
   - 使用防抖 (debounce) 减少验证频率
   - 默认延迟 500ms

3. **内存管理**:
   - 及时释放 Blob URL
   - 清理不再使用的 DOM 元素
   - 避免内存泄漏

### 浏览器兼容性处理

```javascript
// 检查 Clipboard API 支持
function checkClipboardSupport() {
  return navigator.clipboard && navigator.clipboard.writeText;
}

// 降级方案：使用 execCommand
function copyToClipboardFallback(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

// 检查 File API 支持
function checkFileAPISupport() {
  return window.File && window.FileReader && window.FileList && window.Blob;
}
```

### 可访问性 (Accessibility)

1. **键盘导航**: 所有功能可通过键盘访问
2. **ARIA 标签**: 为交互元素添加适当的 ARIA 属性
3. **焦点管理**: 清晰的焦点指示器
4. **屏幕阅读器**: 为重要操作提供文本说明
5. **颜色对比**: 确保文本和背景的对比度符合 WCAG 标准

```html
<!-- 示例：可访问的按钮 -->
<button 
  class="btn btn-primary" 
  aria-label="格式化 JSON 数据"
  role="button"
  tabindex="0">
  格式化
</button>

<!-- 示例：可访问的输入区域 -->
<textarea 
  id="json-input"
  aria-label="JSON 输入区域"
  aria-describedby="input-help"
  placeholder="在此输入或粘贴 JSON 数据">
</textarea>
<p id="input-help" class="sr-only">
  输入有效的 JSON 数据，或点击上传按钮选择文件
</p>
```

## Security Considerations

1. **XSS 防护**: 
   - 对用户输入进行适当的转义
   - 使用 `textContent` 而非 `innerHTML` 显示用户数据

2. **文件大小限制**:
   - 限制上传文件大小（建议 10MB）
   - 防止内存溢出攻击

3. **数据隐私**:
   - 不使用 Google Analytics 等跟踪工具
   - 不向任何服务器发送用户数据
   - 明确告知用户数据处理方式

4. **Content Security Policy**:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; 
               style-src 'self' 'unsafe-inline';">
```

## Future Enhancements

1. **更多格式支持**:
   - YAML 转换
   - TOML 转换
   - Protocol Buffers

2. **高级功能**:
   - JSON Path 查询
   - JMESPath 支持
   - JSON Patch 操作

3. **协作功能**:
   - 分享链接（通过 URL 参数）
   - 导出为 Markdown 表格

4. **性能提升**:
   - Web Worker 支持
   - 增量解析大文件
   - 虚拟滚动

5. **用户体验**:
   - 深色模式
   - 自定义主题
   - 快捷键支持
   - 历史记录（可选）
