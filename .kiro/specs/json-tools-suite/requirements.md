# Requirements Document

## Introduction

本文档定义了 JSON 数据处理工具套件的需求规范。该套件包含 6 个独立的前端 HTML 工具页面，用于处理 JSON 数据的各种常见操作，包括格式化、验证、格式转换、比较和 Schema 生成与校验。所有工具均在浏览器端运行，无需后端服务器，确保用户数据隐私安全。

## Glossary

- **JSON Tool Suite（JSON 工具套件）**: 包含 6 个独立 JSON 处理工具的 Web 应用集合
- **Browser（浏览器）**: 运行工具的客户端环境
- **User（用户）**: 使用 JSON 工具的人员
- **Navigation Site（导航网站）**: tooles/index.html 中的工具导航页面
- **Tool Page（工具页面）**: 每个独立的 JSON 处理工具 HTML 页面
- **JSON Data（JSON 数据）**: 用户输入或处理的 JSON 格式数据
- **Validation（验证）**: 检查 JSON 语法是否正确的过程
- **Formatting（格式化）**: 美化或压缩 JSON 的过程
- **Schema（模式）**: 描述 JSON 数据结构的规范

## Requirements

### Requirement 1

**User Story:** 作为用户，我想要格式化和压缩 JSON 数据，以便提高可读性或减小数据大小。

#### Acceptance Criteria

1. WHEN 用户输入有效的 JSON 数据并点击格式化按钮 THEN JSON Tool Suite SHALL 显示美化后的 JSON，包含适当的缩进和换行
2. WHEN 用户输入有效的 JSON 数据并点击压缩按钮 THEN JSON Tool Suite SHALL 显示压缩后的 JSON，移除所有不必要的空白字符
3. WHEN 用户输入无效的 JSON 数据 THEN JSON Tool Suite SHALL 显示错误提示信息，指出语法错误的位置
4. WHEN 格式化或压缩完成 THEN JSON Tool Suite SHALL 提供一键复制功能，允许用户快速复制结果
5. WHEN 用户清空输入区域 THEN JSON Tool Suite SHALL 同时清空输出区域和错误提示

### Requirement 2

**User Story:** 作为用户，我想要验证 JSON 数据的语法正确性，以便快速发现和修复错误。

#### Acceptance Criteria

1. WHEN 用户输入 JSON 数据并触发验证 THEN JSON Tool Suite SHALL 检查 JSON 语法并显示验证结果
2. WHEN JSON 数据语法正确 THEN JSON Tool Suite SHALL 显示成功提示，包含数据的基本统计信息（如键数量、嵌套层级）
3. WHEN JSON 数据语法错误 THEN JSON Tool Suite SHALL 显示错误信息，包含错误类型、行号和列号
4. WHEN 验证过程中 THEN JSON Tool Suite SHALL 高亮显示错误位置，帮助用户快速定位问题
5. WHEN 用户修改输入内容 THEN JSON Tool Suite SHALL 提供实时验证选项，自动更新验证结果

### Requirement 3

**User Story:** 作为用户，我想要在 JSON 和 XML 格式之间互相转换，以便适配不同系统的数据格式需求。

#### Acceptance Criteria

1. WHEN 用户输入有效的 JSON 数据并选择转换为 XML THEN JSON Tool Suite SHALL 生成格式正确的 XML 输出
2. WHEN 用户输入有效的 XML 数据并选择转换为 JSON THEN JSON Tool Suite SHALL 生成格式正确的 JSON 输出
3. WHEN 转换过程中遇到无法映射的数据结构 THEN JSON Tool Suite SHALL 使用合理的默认规则进行转换，并提示用户
4. WHEN 转换完成 THEN JSON Tool Suite SHALL 保持数据的层级结构和值的完整性
5. WHEN 输入数据格式无效 THEN JSON Tool Suite SHALL 显示明确的错误信息，说明哪种格式验证失败

### Requirement 4

**User Story:** 作为用户，我想要在 JSON 和 CSV 格式之间互相转换，以便进行数据分析和表格处理。

#### Acceptance Criteria

1. WHEN 用户输入 JSON 数组数据并选择转换为 CSV THEN JSON Tool Suite SHALL 生成包含表头和数据行的 CSV 格式输出
2. WHEN 用户输入 CSV 数据并选择转换为 JSON THEN JSON Tool Suite SHALL 生成 JSON 数组格式输出，每行数据作为一个对象
3. WHEN JSON 数据包含嵌套对象或数组 THEN JSON Tool Suite SHALL 将嵌套结构扁平化或转换为字符串表示
4. WHEN CSV 数据包含特殊字符（如逗号、引号、换行） THEN JSON Tool Suite SHALL 正确解析并转换为 JSON
5. WHEN 转换完成 THEN JSON Tool Suite SHALL 提供下载功能，允许用户保存为 .csv 或 .json 文件

### Requirement 5

**User Story:** 作为用户，我想要比较两个 JSON 数据的差异，以便快速识别数据变化。

#### Acceptance Criteria

1. WHEN 用户输入两个有效的 JSON 数据并点击比较按钮 THEN JSON Tool Suite SHALL 分析并显示两者之间的差异
2. WHEN 存在新增的键或值 THEN JSON Tool Suite SHALL 使用绿色高亮显示新增内容
3. WHEN 存在删除的键或值 THEN JSON Tool Suite SHALL 使用红色高亮显示删除内容
4. WHEN 存在修改的值 THEN JSON Tool Suite SHALL 使用黄色高亮显示修改内容，并同时显示旧值和新值
5. WHEN 两个 JSON 完全相同 THEN JSON Tool Suite SHALL 显示"无差异"提示信息
6. WHEN 输入的任一 JSON 数据无效 THEN JSON Tool Suite SHALL 显示错误提示，指出哪个输入框的数据有问题

### Requirement 6

**User Story:** 作为用户，我想要生成和校验 JSON Schema，以便定义和验证 JSON 数据结构的规范。

#### Acceptance Criteria

1. WHEN 用户输入有效的 JSON 数据并选择生成 Schema THEN JSON Tool Suite SHALL 自动生成符合 JSON Schema 规范的 Schema 定义
2. WHEN 用户输入 JSON Schema 和待校验的 JSON 数据 THEN JSON Tool Suite SHALL 验证 JSON 是否符合 Schema 定义
3. WHEN JSON 数据符合 Schema THEN JSON Tool Suite SHALL 显示验证成功提示
4. WHEN JSON 数据不符合 Schema THEN JSON Tool Suite SHALL 显示详细的验证错误信息，包含不符合的字段路径和原因
5. WHEN 生成的 Schema THEN JSON Tool Suite SHALL 包含数据类型、必填字段、格式约束等基本信息

### Requirement 7

**User Story:** 作为用户，我想要所有工具页面具有统一且美观的 UI 设计，以便获得一致的使用体验。

#### Acceptance Criteria

1. WHEN 用户访问任一工具页面 THEN JSON Tool Suite SHALL 显示清晰的页面标题和功能说明
2. WHEN 页面加载完成 THEN JSON Tool Suite SHALL 使用现代化的 UI 设计，避免使用紫色渐变配色
3. WHEN 用户在不同工具页面之间切换 THEN JSON Tool Suite SHALL 保持一致的布局结构和交互模式
4. WHEN 用户在移动设备上访问 THEN JSON Tool Suite SHALL 提供响应式设计，适配不同屏幕尺寸
5. WHEN 用户进行操作 THEN JSON Tool Suite SHALL 提供清晰的视觉反馈，如按钮状态变化、加载动画等

### Requirement 8

**User Story:** 作为用户，我想要从导航网站快速访问各个 JSON 工具，以便高效地完成不同的数据处理任务。

#### Acceptance Criteria

1. WHEN 用户在导航网站点击 JSON 工具链接 THEN Browser SHALL 在新标签页中打开对应的工具页面
2. WHEN 导航网站加载完成 THEN Navigation Site SHALL 在 JSON 工具卡片中显示所有 6 个工具的链接
3. WHEN 用户查看 JSON 工具卡片 THEN Navigation Site SHALL 显示清晰的工具名称和简短描述
4. WHEN 工具链接被点击 THEN Navigation Site SHALL 正确导航到 json-tools 文件夹下的对应 HTML 文件
5. WHEN 用户悬停在工具链接上 THEN Navigation Site SHALL 提供视觉反馈，如颜色变化或下划线

### Requirement 9

**User Story:** 作为用户，我想要所有数据处理在本地浏览器中完成，以便保护我的数据隐私和安全。

#### Acceptance Criteria

1. WHEN 用户使用任一工具处理数据 THEN JSON Tool Suite SHALL 在浏览器端完成所有计算，不向服务器发送数据
2. WHEN 页面加载完成 THEN JSON Tool Suite SHALL 显示隐私保护说明，告知用户数据不会上传
3. WHEN 用户关闭或刷新页面 THEN Browser SHALL 清除所有输入和输出数据，不保留任何痕迹
4. WHEN 工具需要使用第三方库 THEN JSON Tool Suite SHALL 使用 CDN 加载或本地打包，确保功能完整性
5. WHEN 用户离线使用工具 THEN JSON Tool Suite SHALL 在已加载的情况下正常工作（除非需要 CDN 资源）

### Requirement 10

**User Story:** 作为用户，我想要便捷的数据输入和输出方式，以便快速完成工作流程。

#### Acceptance Criteria

1. WHEN 用户需要输入数据 THEN JSON Tool Suite SHALL 提供文本框输入和文件上传两种方式
2. WHEN 用户上传 JSON 文件 THEN JSON Tool Suite SHALL 读取文件内容并自动填充到输入区域
3. WHEN 用户需要保存结果 THEN JSON Tool Suite SHALL 提供复制到剪贴板和下载文件两种方式
4. WHEN 用户点击复制按钮 THEN JSON Tool Suite SHALL 复制结果到剪贴板并显示成功提示
5. WHEN 用户点击下载按钮 THEN JSON Tool Suite SHALL 生成文件并触发浏览器下载，文件名包含工具名称和时间戳
