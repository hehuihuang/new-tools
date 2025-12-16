# Implementation Plan

## Phase 1: 项目基础设施

- [x] 1. 创建项目结构和共享资源


  - [x] 1.1 创建 code-tools 目录结构


    - 创建 `code-tools/` 文件夹
    - 创建 `code-tools/shared/` 子文件夹
    - _Requirements: 9.1_

  - [x] 1.2 创建共享样式文件 (styles.css)

    - 实现蓝色主题配色方案
    - 实现响应式布局
    - 实现通用组件样式（按钮、输入框、卡片等）
    - _Requirements: 9.1, 9.4_

  - [x] 1.3 创建共享工具函数库 (utils.js)

    - 实现 copyToClipboard 函数
    - 实现 downloadFile 函数
    - 实现 showMessage 函数
    - 实现 formatFileSize 函数
    - _Requirements: 1.3, 2.5, 8.6_

  - [x] 1.4 创建共享组件库 (components.js)

    - 实现 CodeEditor 类
    - 实现 FileHandler 类
    - 实现 TabPanel 类
    - _Requirements: 9.1_

## Phase 2: Markdown/HTML 转换工具

- [-] 2. 实现 Markdown/HTML 转换工具


  - [x] 2.1 创建 markdown-html.html 页面结构

    - 实现双栏编辑器布局
    - 添加转换方向切换
    - 添加实时预览区域
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 2.2 实现 Markdown 到 HTML 转换逻辑

    - 集成 marked.js 库
    - 实现 markdownToHTML 函数

    - _Requirements: 1.1_

  - [ ] 2.3 实现 HTML 到 Markdown 转换逻辑
    - 集成 turndown.js 库
    - 实现 htmlToMarkdown 函数
    - _Requirements: 1.2_
  - [x] 2.4 编写 Markdown/HTML 转换属性测试


    - **Property 1: Markdown/HTML Round-Trip Consistency**
    - **Validates: Requirements 1.1, 1.2**

## Phase 3: JSON 工具

- [-] 3. 实现 JSON 格式化/压缩/校验工具

  - [x] 3.1 创建 json-tools.html 页面结构

    - 实现输入/输出编辑器
    - 添加格式化、压缩、校验按钮
    - 添加错误信息显示区域
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ] 3.2 实现 JSON 格式化和压缩逻辑
    - 实现 formatJSON 函数（带缩进）
    - 实现 compressJSON 函数（移除空白）

    - _Requirements: 2.1, 2.2_
  - [ ] 3.3 实现 JSON 校验逻辑
    - 实现 validateJSON 函数
    - 实现错误位置检测
    - _Requirements: 2.3, 2.4_
  - [x] 3.4 编写 JSON 工具属性测试

    - **Property 2: JSON Format/Compress Preserves Data**
    - **Property 3: JSON Validation Correctness**
    - **Validates: Requirements 2.1, 2.2, 2.3**

## Phase 4: URL 编码/解码工具


- [ ] 4. 实现 URL 编码/解码工具
  - [ ] 4.1 创建 url-codec.html 页面结构
    - 实现输入/输出区域

    - 添加编码模式选择（组件/完整URL）
    - 添加编码/解码按钮
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ] 4.2 实现 URL 编码/解码逻辑
    - 实现 encodeURL 函数（支持两种模式）
    - 实现 decodeURL 函数
    - 实现错误处理
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 4.3 编写 URL 编码/解码属性测试
    - **Property 4: URL Encode/Decode Round-Trip**
    - **Property 5: URL Encoding Mode Correctness**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [x] 5. Checkpoint - 确保所有测试通过

  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: JWT 解析/编码工具

- [ ] 6. 实现 JWT 解析/编码工具
  - [x] 6.1 创建 jwt-parser.html 页面结构

    - 实现 JWT 输入区域
    - 添加 Header/Payload/Signature 显示区域
    - 添加过期时间显示
    - _Requirements: 4.1, 4.2, 4.5_

  - [ ] 6.2 实现 JWT 解析逻辑
    - 实现 parseJWT 函数
    - 实现 Base64URL 解码
    - 实现过期时间检测

    - _Requirements: 4.1, 4.2, 4.5_
  - [ ] 6.3 实现 JWT 生成逻辑
    - 实现 generateJWT 函数（未签名）
    - 实现 Base64URL 编码
    - _Requirements: 4.3_

  - [ ] 6.4 编写 JWT 解析属性测试
    - **Property 6: JWT Parse/Generate Round-Trip**
    - **Property 7: JWT Expiration Detection**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.5**

## Phase 6: Diff 对比工具


- [ ] 7. 实现 Diff 对比工具
  - [ ] 7.1 创建 text-diff.html 页面结构
    - 实现左右双栏输入
    - 添加对比模式选择（逐行/逐字）
    - 添加差异结果显示区域

    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [ ] 7.2 实现文本差异比较逻辑
    - 集成 diff-match-patch 库
    - 实现 diffText 函数
    - 实现逐行和逐字两种模式
    - _Requirements: 5.1, 5.3, 5.4_

  - [ ] 7.3 实现差异结果渲染
    - 实现颜色高亮（绿色新增、红色删除）
    - 实现相同内容提示

    - _Requirements: 5.2, 5.5_
  - [ ] 7.4 编写 Diff 对比属性测试
    - **Property 8: Diff Symmetry**
    - **Property 9: Diff Mode Granularity**
    - **Validates: Requirements 5.1, 5.3, 5.4**

## Phase 7: 命名风格转换工具

- [ ] 8. 实现命名风格转换工具
  - [x] 8.1 创建 case-converter.html 页面结构

    - 实现输入区域
    - 添加目标格式选择
    - 添加批量转换结果显示
    - _Requirements: 6.1, 6.6_

  - [ ] 8.2 实现命名风格转换逻辑
    - 实现 convertCase 函数
    - 支持 camelCase、PascalCase、snake_case、kebab-case

    - 实现 detectCase 函数（自动检测输入格式）
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [ ] 8.3 编写命名风格转换属性测试
    - **Property 10: Case Conversion Idempotence**
    - **Property 11: Case Conversion Word Preservation**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [x] 9. Checkpoint - 确保所有测试通过

  - Ensure all tests pass, ask the user if questions arise.

## Phase 8: 图片 Base64 转换工具


- [ ] 10. 实现图片 Base64 转换工具
  - [ ] 10.1 创建 base64-image.html 页面结构
    - 实现图片上传区域（拖拽支持）
    - 添加 Base64 输入/输出区域

    - 添加图片预览区域
    - _Requirements: 7.1, 7.3, 7.6_
  - [ ] 10.2 实现图片到 Base64 转换逻辑
    - 实现 imageToBase64 函数
    - 生成完整 Data URL 格式
    - 显示图片大小和编码长度

    - _Requirements: 7.1, 7.2, 7.6_
  - [ ] 10.3 实现 Base64 到图片转换逻辑
    - 实现 base64ToImage 函数
    - 实现图片预览
    - 实现图片下载

    - _Requirements: 7.3, 7.4_
  - [ ] 10.4 编写 Base64 图片转换属性测试
    - **Property 12: Base64 Image Round-Trip**
    - **Property 13: Base64 Data URL Format**
    - **Validates: Requirements 7.1, 7.2, 7.3**

## Phase 9: Markdown 表格/CSV 转换工具

- [x] 11. 实现 Markdown 表格/CSV 转换工具

  - [ ] 11.1 创建 table-converter.html 页面结构
    - 实现 CSV 输入区域
    - 实现 Markdown 表格输出区域
    - 添加可视化表格编辑器

    - _Requirements: 8.1, 8.2, 8.3_
  - [ ] 11.2 实现 CSV 到 Markdown 表格转换逻辑
    - 实现 csvToMarkdownTable 函数

    - 正确处理转义字符
    - _Requirements: 8.1, 8.5_
  - [x] 11.3 实现 Markdown 表格到 CSV 转换逻辑

    - 实现 markdownTableToCSV 函数
    - 实现表格解析
    - _Requirements: 8.2_
  - [ ] 11.4 实现可视化表格编辑器
    - 实现行列添加/删除功能

    - 实现从表格生成 Markdown
    - _Requirements: 8.3, 8.4_
  - [ ] 11.5 编写表格转换属性测试
    - **Property 14: CSV/Markdown Table Round-Trip**
    - **Property 15: CSV Escape Handling**
    - **Validates: Requirements 8.1, 8.2, 8.5**

## Phase 10: 导航集成

- [x] 12. 更新导航页面集成所有工具

  - [x] 12.1 更新 tooles/index.html


    - 更新"代码格式转换工具"卡片的链接
    - 添加所有8个工具的链接
    - _Requirements: 9.2, 9.3_


- [x] 13. Final Checkpoint - 确保所有测试通过

  - Ensure all tests pass, ask the user if questions arise.
