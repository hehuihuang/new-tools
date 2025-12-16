# Requirements Document

## Introduction

本文档定义了代码格式转换工具套件的需求规格。该套件包含8个独立的前端工具页面，用于处理各种代码和文本格式的转换、编码、解析等操作。所有工具将集成到现有的在线工具箱导航系统中，采用与现有工具一致的UI风格（蓝色主题，非紫色渐变），每个工具都是独立的HTML页面。

## Glossary

- **Code_Tools_System**: 代码格式转换工具套件系统，包含8个独立的HTML工具页面
- **Markdown**: 一种轻量级标记语言，用于格式化纯文本
- **HTML**: 超文本标记语言，用于创建网页
- **JSON**: JavaScript对象表示法，一种轻量级数据交换格式
- **JWT**: JSON Web Token，一种用于身份验证的令牌格式
- **Base64**: 一种将二进制数据编码为ASCII字符串的编码方式
- **URL编码**: 将URL中的特殊字符转换为百分号编码格式
- **命名风格**: 编程中的变量命名约定，如camelCase、snake_case等
- **Diff**: 文本差异比较，显示两段文本之间的不同之处
- **CSV**: 逗号分隔值，一种简单的表格数据格式

## Requirements

### Requirement 1: Markdown / HTML 相互转换

**User Story:** 作为开发者，我希望能够在Markdown和HTML格式之间相互转换，以便处理文档和页面内容。

#### Acceptance Criteria

1. WHEN 用户输入Markdown文本并点击"转换为HTML"按钮 THEN Code_Tools_System SHALL 将Markdown解析并生成对应的HTML代码
2. WHEN 用户输入HTML代码并点击"转换为Markdown"按钮 THEN Code_Tools_System SHALL 将HTML解析并生成对应的Markdown文本
3. WHEN 转换完成 THEN Code_Tools_System SHALL 在输出区域显示转换结果并提供复制功能
4. WHEN 用户点击"实时预览"开关 THEN Code_Tools_System SHALL 在预览区域实时渲染转换后的内容
5. WHEN 用户输入空内容并尝试转换 THEN Code_Tools_System SHALL 显示提示信息并保持当前状态

### Requirement 2: JSON 格式化 / 压缩 / 校验

**User Story:** 作为开发者，我希望能够格式化、压缩和校验JSON数据，以便调试API响应和处理配置文件。

#### Acceptance Criteria

1. WHEN 用户输入JSON文本并点击"格式化"按钮 THEN Code_Tools_System SHALL 将JSON美化为带缩进的可读格式
2. WHEN 用户输入JSON文本并点击"压缩"按钮 THEN Code_Tools_System SHALL 移除所有空白字符生成单行JSON
3. WHEN 用户输入JSON文本 THEN Code_Tools_System SHALL 自动校验JSON语法并显示校验结果
4. IF JSON语法错误 THEN Code_Tools_System SHALL 显示错误位置和错误信息
5. WHEN 用户点击"复制"按钮 THEN Code_Tools_System SHALL 将输出内容复制到剪贴板并显示成功提示

### Requirement 3: URL 编码 / 解码

**User Story:** 作为开发者，我希望能够对URL进行编码和解码，以便处理包含特殊字符的URL参数。

#### Acceptance Criteria

1. WHEN 用户输入文本并点击"编码"按钮 THEN Code_Tools_System SHALL 将特殊字符转换为百分号编码格式
2. WHEN 用户输入已编码的URL并点击"解码"按钮 THEN Code_Tools_System SHALL 将百分号编码还原为可读字符
3. WHEN 用户选择"仅编码组件"选项 THEN Code_Tools_System SHALL 使用encodeURIComponent方式编码
4. WHEN 用户选择"完整URL编码"选项 THEN Code_Tools_System SHALL 使用encodeURI方式编码
5. WHEN 解码遇到无效的编码序列 THEN Code_Tools_System SHALL 显示错误提示并保留原始输入

### Requirement 4: JWT 解析 / 编码

**User Story:** 作为后端开发者，我希望能够解析和查看JWT令牌的内容，以便调试身份验证问题。

#### Acceptance Criteria

1. WHEN 用户输入JWT令牌并点击"解析"按钮 THEN Code_Tools_System SHALL 分别显示Header、Payload和Signature三部分内容
2. WHEN JWT解析成功 THEN Code_Tools_System SHALL 以格式化JSON形式显示Header和Payload
3. WHEN 用户输入Header和Payload并点击"生成JWT"按钮 THEN Code_Tools_System SHALL 生成未签名的JWT令牌
4. IF JWT格式无效 THEN Code_Tools_System SHALL 显示具体的格式错误信息
5. WHEN Payload包含exp字段 THEN Code_Tools_System SHALL 显示令牌过期时间并标注是否已过期

### Requirement 5: Diff 对比工具

**User Story:** 作为开发者，我希望能够比较两段文本或代码的差异，以便进行代码审查和版本对比。

#### Acceptance Criteria

1. WHEN 用户在左右两个输入框分别输入文本并点击"对比"按钮 THEN Code_Tools_System SHALL 高亮显示两段文本的差异
2. WHEN 显示差异结果 THEN Code_Tools_System SHALL 用绿色标记新增内容，用红色标记删除内容
3. WHEN 用户选择"逐行对比"模式 THEN Code_Tools_System SHALL 按行显示差异
4. WHEN 用户选择"逐字对比"模式 THEN Code_Tools_System SHALL 按字符显示差异
5. WHEN 两段文本完全相同 THEN Code_Tools_System SHALL 显示"内容完全一致"的提示信息

### Requirement 6: 字符串命名风格转换

**User Story:** 作为开发者，我希望能够在不同的命名风格之间转换字符串，以便在前后端代码之间同步命名约定。

#### Acceptance Criteria

1. WHEN 用户输入字符串并选择目标命名风格 THEN Code_Tools_System SHALL 将字符串转换为对应的命名格式
2. WHEN 用户选择"camelCase" THEN Code_Tools_System SHALL 生成小驼峰格式（如：myVariableName）
3. WHEN 用户选择"PascalCase" THEN Code_Tools_System SHALL 生成大驼峰格式（如：MyVariableName）
4. WHEN 用户选择"snake_case" THEN Code_Tools_System SHALL 生成下划线分隔格式（如：my_variable_name）
5. WHEN 用户选择"kebab-case" THEN Code_Tools_System SHALL 生成短横线分隔格式（如：my-variable-name）
6. WHEN 用户点击"批量转换"按钮 THEN Code_Tools_System SHALL 同时显示所有命名风格的转换结果

### Requirement 7: 图片 Base64 转换

**User Story:** 作为前端开发者，我希望能够将图片转换为Base64编码或将Base64还原为图片，以便在CSS/HTML中嵌入图片。

#### Acceptance Criteria

1. WHEN 用户上传图片文件 THEN Code_Tools_System SHALL 将图片转换为Base64编码字符串
2. WHEN 转换完成 THEN Code_Tools_System SHALL 显示完整的Data URL格式（包含MIME类型前缀）
3. WHEN 用户输入Base64字符串并点击"转换为图片"按钮 THEN Code_Tools_System SHALL 解码并显示图片预览
4. WHEN 用户点击"下载图片"按钮 THEN Code_Tools_System SHALL 将Base64解码后的图片保存为文件
5. IF Base64字符串格式无效 THEN Code_Tools_System SHALL 显示错误提示信息
6. WHEN 图片转换成功 THEN Code_Tools_System SHALL 显示图片大小和编码后的字符串长度

### Requirement 8: Markdown 表格生成 / CSV 转换

**User Story:** 作为技术文档编写者，我希望能够在CSV和Markdown表格格式之间转换，以便提高文档处理效率。

#### Acceptance Criteria

1. WHEN 用户输入CSV数据并点击"转换为Markdown表格"按钮 THEN Code_Tools_System SHALL 生成格式化的Markdown表格
2. WHEN 用户输入Markdown表格并点击"转换为CSV"按钮 THEN Code_Tools_System SHALL 生成CSV格式数据
3. WHEN 用户使用可视化表格编辑器 THEN Code_Tools_System SHALL 提供行列添加删除功能
4. WHEN 用户点击"生成Markdown"按钮 THEN Code_Tools_System SHALL 根据可视化表格生成Markdown代码
5. WHEN CSV数据包含逗号或引号 THEN Code_Tools_System SHALL 正确处理转义字符
6. WHEN 用户点击"复制"按钮 THEN Code_Tools_System SHALL 将生成的表格代码复制到剪贴板

### Requirement 9: 通用UI和导航集成

**User Story:** 作为用户，我希望所有工具具有一致的UI风格并能从导航页面访问，以便获得统一的使用体验。

#### Acceptance Criteria

1. WHEN 用户访问任意工具页面 THEN Code_Tools_System SHALL 显示与现有工具一致的蓝色主题UI风格
2. WHEN 用户点击导航页面的工具链接 THEN Code_Tools_System SHALL 在新标签页打开对应的工具页面
3. WHEN 工具页面加载完成 THEN Code_Tools_System SHALL 显示返回导航的链接
4. WHEN 用户在移动设备访问 THEN Code_Tools_System SHALL 提供响应式布局适配
5. WHEN 用户执行任何操作 THEN Code_Tools_System SHALL 在本地完成处理，不上传数据到服务器
