# Design Document: Text Tools Suite

## Overview

文本内容处理工具套件是一组8个独立的前端HTML工具页面，用于处理各种文本操作任务。所有工具采用纯前端JavaScript实现，无需后端服务，所有数据处理在用户浏览器本地完成，确保用户隐私安全。

工具套件将创建在 `text-tools/` 目录下，与现有的 `code-tools/`、`image-tools/`、`json-tools/`、`pdf-tools/` 目录结构保持一致。采用蓝色主题配色方案，与现有工具风格统一。

## Architecture

### 目录结构

```
text-tools/
├── shared/
│   ├── styles.css          # 共享样式（复用code-tools样式）
│   ├── components.js       # 共享UI组件
│   └── utils.js            # 共享工具函数
├── text-dedup.html         # 文本去重工具
├── text-sort.html          # 文本排序工具
├── text-replace.html       # 文本查找替换工具
├── text-split.html         # 文本分割合并工具
├── text-clean.html         # 文本清理工具
├── text-stats.html         # 文本统计工具
├── emoji-convert.html      # Emoji/Unicode转换工具
├── random-gen.html         # 随机文本生成工具
└── README.md               # 工具说明文档
```

### 技术栈

- HTML5 + CSS3 + Vanilla JavaScript
- 无外部依赖，纯前端实现
- 响应式设计，支持移动端

## Components and Interfaces

### 共享组件 (shared/components.js)

```javascript
// 页面头部组件
function createHeader(title, description)

// 隐私提示组件
function createPrivacyNotice()

// 消息提示组件
function showMessage(type, text)

// 复制到剪贴板
function copyToClipboard(text)

// 加载状态组件
function showLoading(show, message)
```

### 共享工具函数 (shared/utils.js)

```javascript
// 文本处理基础函数
function splitLines(text)           // 按行分割
function joinLines(lines, sep)      // 合并行
function countChars(text)           // 字符计数
function countWords(text)           // 单词计数
function escapeHtml(text)           // HTML转义
function unescapeHtml(text)         // HTML反转义
```

### 各工具页面接口

#### 1. Text_Deduplicator (text-dedup.html)

```javascript
// 去重模式枚举
const DEDUP_MODE = {
  LINES: 'lines',           // 行去重
  EMPTY_LINES: 'empty',     // 去空行
  WORDS: 'words'            // 去重复词
}

// 核心函数
function dedupLines(text)           // 行去重
function removeEmptyLines(text)     // 去空行
function dedupWords(text)           // 去重复词
function processDedup(text, mode)   // 统一处理入口
```

#### 2. Text_Sorter (text-sort.html)

```javascript
// 排序模式枚举
const SORT_MODE = {
  ALPHA: 'alpha',           // 字典序
  NUMERIC: 'numeric',       // 数字
  LENGTH: 'length'          // 长度
}

// 核心函数
function sortAlpha(lines, desc)     // 字典序排序
function sortNumeric(lines, desc)   // 数字排序
function sortByLength(lines, desc)  // 长度排序
function processSort(text, mode, desc)  // 统一处理入口
```

#### 3. Text_Replacer (text-replace.html)

```javascript
// 核心函数
function findMatches(text, pattern, options)    // 查找匹配
function replaceAll(text, pattern, replacement, options)  // 批量替换
function highlightMatches(text, pattern, options)  // 高亮显示

// options: { caseSensitive: boolean, useRegex: boolean }
```

#### 4. Text_Splitter (text-split.html)

```javascript
// 预定义分隔符
const DELIMITERS = {
  COMMA: ',',
  SPACE: ' ',
  NEWLINE: '\n',
  TAB: '\t',
  PIPE: '|'
}

// 核心函数
function splitText(text, delimiter)     // 分割文本
function joinText(text, delimiter)      // 合并文本
```

#### 5. Text_Cleaner (text-clean.html)

```javascript
// 清理选项
const CLEAN_OPTIONS = {
  TRIM: 'trim',                 // 去首尾空格
  COLLAPSE_SPACES: 'collapse',  // 合并多余空格
  REMOVE_SPECIAL: 'special',    // 去特殊字符
  STRIP_HTML: 'html'            // 去HTML标签
}

// 核心函数
function trimLines(text)                // 去首尾空格
function collapseSpaces(text)           // 合并空格
function removeSpecialChars(text)       // 去特殊字符
function stripHtmlTags(text)            // 去HTML标签
function cleanText(text, options)       // 统一处理入口
```

#### 6. Text_Statistics (text-stats.html)

```javascript
// 统计结果接口
interface TextStats {
  charCount: number,            // 字符数（含空格）
  charCountNoSpace: number,     // 字符数（不含空格）
  wordCount: number,            // 单词数
  sentenceCount: number,        // 句子数
  lineCount: number,            // 行数
  charFrequency: Map<string, number>  // 字符频率
}

// 核心函数
function calculateStats(text)           // 计算所有统计
function getCharFrequency(text)         // 字符频率分析
```

#### 7. Emoji_Converter (emoji-convert.html)

```javascript
// 转换模式
const CONVERT_MODE = {
  CHAR_TO_UNICODE: 'toUnicode',     // 字符转Unicode
  UNICODE_TO_CHAR: 'toChar'         // Unicode转字符
}

// 核心函数
function charToUnicode(text)            // 字符转Unicode
function unicodeToChar(text)            // Unicode转字符
function isValidUnicode(code)           // 验证Unicode
```

#### 8. Random_Generator (random-gen.html)

```javascript
// 生成模式
const GEN_MODE = {
  PASSWORD: 'password',         // 随机密码
  STRING: 'string',             // 随机字符串
  UUID: 'uuid',                 // UUID
  LOREM: 'lorem'                // Lorem Ipsum
}

// 密码选项
interface PasswordOptions {
  length: number,
  uppercase: boolean,
  lowercase: boolean,
  numbers: boolean,
  symbols: boolean
}

// 核心函数
function generatePassword(options)      // 生成密码
function generateString(length)         // 生成随机字符串
function generateUUID()                 // 生成UUID v4
function generateLorem(paragraphs)      // 生成Lorem Ipsum
```

## Data Models

### 输入/输出模型

所有工具采用统一的输入输出模式：

```javascript
// 通用处理结果
interface ProcessResult {
  success: boolean,
  output: string,
  stats?: {
    original: number,
    processed: number,
    changed: number
  },
  error?: string
}
```

### UI状态模型

```javascript
// 页面状态
interface PageState {
  inputText: string,
  outputText: string,
  options: object,
  isProcessing: boolean
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Line Deduplication Preserves Order and Uniqueness

*For any* multi-line text input, after line deduplication:
- No two lines in the output should be identical
- The relative order of first occurrences should be preserved
- Every line in the output should have appeared in the input

**Validates: Requirements 1.1**

### Property 2: Empty Line Removal Completeness

*For any* text input, after empty line removal:
- No line in the output should be empty or contain only whitespace characters
- All non-empty lines from the input should be present in the output

**Validates: Requirements 1.2**

### Property 3: Word Deduplication Within Lines

*For any* line of text, after word deduplication:
- No word should appear more than once in the output line
- The first occurrence order of words should be preserved

**Validates: Requirements 1.3**

### Property 4: Alphabetical Sort Ordering

*For any* multi-line text input sorted alphabetically:
- Each adjacent pair of lines (line[i], line[i+1]) should satisfy: line[i].localeCompare(line[i+1]) <= 0 for ascending order
- For descending order, the comparison should be >= 0

**Validates: Requirements 2.1**

### Property 5: Numeric Sort Ordering

*For any* multi-line text input sorted numerically:
- Each adjacent pair of lines should satisfy: parseFloat(line[i]) <= parseFloat(line[i+1]) for ascending order
- Non-numeric lines should be treated as 0

**Validates: Requirements 2.2**

### Property 6: Length Sort Ordering

*For any* multi-line text input sorted by length:
- Each adjacent pair of lines should satisfy: line[i].length <= line[i+1].length for ascending order

**Validates: Requirements 2.3**

### Property 7: Sort Direction Reversal

*For any* text input and sort mode, sorting in descending order should produce the reverse of ascending order.

**Validates: Requirements 2.4**

### Property 8: Find Match Count Accuracy

*For any* text and search pattern, the reported match count should equal the actual number of non-overlapping occurrences of the pattern in the text.

**Validates: Requirements 3.1**

### Property 9: Replace All Completeness

*For any* text, search pattern, and replacement string, after replace all operation:
- The search pattern should not appear in the output (for non-overlapping, non-recursive patterns)
- The output length should equal: original length - (match count × pattern length) + (match count × replacement length)

**Validates: Requirements 3.2**

### Property 10: Case Sensitivity Correctness

*For any* text and search pattern with case-sensitive mode enabled:
- Matches should only occur where the case exactly matches
- With case-insensitive mode, "ABC" should match "abc", "Abc", etc.

**Validates: Requirements 3.4**

### Property 11: Split/Join Round Trip

*For any* text and delimiter:
- Splitting text by delimiter then joining with the same delimiter should return the original text
- join(split(text, delim), delim) === text

**Validates: Requirements 4.1, 4.2**

### Property 12: Trim Completeness

*For any* text input after trimming:
- No line should start with whitespace
- No line should end with whitespace

**Validates: Requirements 5.1**

### Property 13: Space Collapse Correctness

*For any* text input after collapsing spaces:
- No two consecutive space characters should exist in the output

**Validates: Requirements 5.2**

### Property 14: HTML Tag Removal

*For any* text containing HTML tags:
- After stripping, no HTML tags (matching `<[^>]+>` pattern) should remain
- Text content between tags should be preserved

**Validates: Requirements 5.4**

### Property 15: Character Frequency Sum

*For any* text input, the sum of all character frequencies should equal the total character count of the input.

**Validates: Requirements 6.1, 6.5**

### Property 16: Word Count Consistency

*For any* text input, the word count should equal the number of whitespace-separated non-empty tokens.

**Validates: Requirements 6.2**

### Property 17: Line Count Accuracy

*For any* text input, the line count should equal the number of newline characters plus one (or zero for empty input).

**Validates: Requirements 6.4**

### Property 18: Unicode Round Trip

*For any* valid Unicode character (including emoji):
- Converting to Unicode code point representation and back should return the original character
- unicodeToChar(charToUnicode(char)) === char

**Validates: Requirements 7.1, 7.2**

### Property 19: Password Generation Constraints

*For any* password generation with specified options:
- The output length should equal the specified length
- The output should only contain characters from the enabled character sets
- If uppercase is enabled, at least one uppercase letter should be present (when length permits)

**Validates: Requirements 8.1**

### Property 20: UUID v4 Format Validity

*For any* generated UUID:
- The output should match the UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
- The version digit should be '4'
- The variant digit should be '8', '9', 'a', or 'b'

**Validates: Requirements 8.3**

### Property 21: Lorem Ipsum Paragraph Count

*For any* Lorem Ipsum generation with specified paragraph count:
- The output should contain exactly the specified number of paragraphs (separated by double newlines)

**Validates: Requirements 8.4**

### Property 22: Random Generation Variability

*For any* random generation mode, generating multiple times should produce different results with high probability (> 99% for reasonable output sizes).

**Validates: Requirements 8.5**

## Error Handling

### 输入验证

- 空输入：显示友好提示，不执行处理
- 超大文本：限制输入大小（建议10MB），超出时提示用户
- 无效正则表达式：捕获异常，显示错误信息

### 错误消息

```javascript
const ERROR_MESSAGES = {
  EMPTY_INPUT: '请输入要处理的文本',
  INVALID_REGEX: '正则表达式格式无效',
  INVALID_UNICODE: '无效的Unicode编码',
  INPUT_TOO_LARGE: '输入文本过大，请减少内容后重试'
}
```

### 异常处理策略

- 所有核心处理函数使用 try-catch 包装
- 错误通过统一的消息组件显示
- 不中断用户操作流程

## Testing Strategy

### 测试框架

- 使用 Vitest 作为测试框架（与项目现有配置一致）
- 使用 fast-check 作为属性测试库

### 单元测试

单元测试覆盖以下场景：
- 各工具核心函数的基本功能
- 边界条件（空输入、单行输入、特殊字符）
- 错误处理路径

### 属性测试

属性测试实现上述22个正确性属性：
- 每个属性测试运行默认迭代次数（fast-check默认约10次）
- 使用 fast-check 生成随机测试数据
- 测试注释明确引用对应的正确性属性

测试文件结构：
```
tests/
└── text-tools/
    ├── text-dedup.property.test.js
    ├── text-sort.property.test.js
    ├── text-replace.property.test.js
    ├── text-split.property.test.js
    ├── text-clean.property.test.js
    ├── text-stats.property.test.js
    ├── emoji-convert.property.test.js
    └── random-gen.property.test.js
```

### 测试标注格式

每个属性测试必须包含以下注释：
```javascript
/**
 * Feature: text-tools-suite, Property 1: Line Deduplication Preserves Order and Uniqueness
 * Validates: Requirements 1.1
 */
```
