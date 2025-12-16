# Design Document - Retro UI Redesign

## Overview

本设计文档描述了将在线工具箱所有工具页面改造为复古风格（Retro Style）的技术方案。通过修改各工具套件的共享CSS样式文件，实现统一的视觉风格转换。

设计目标：
- 保持功能完整性，仅改变视觉呈现
- 通过共享样式文件实现一次修改、全局生效
- 确保响应式设计在新风格下正常工作
- 保持良好的可访问性和可读性

## Architecture

### 样式架构

```
工具箱项目
├── tooles/style.css          # 参考设计（复古风格源）
├── image-tools/
│   └── shared/styles.css     # 图片工具共享样式 → 改造目标
├── pdf-tools/
│   └── shared/styles.css     # PDF工具共享样式 → 改造目标
├── json-tools/
│   └── shared/styles.css     # JSON工具共享样式 → 改造目标
├── code-tools/
│   └── shared/styles.css     # 程序员工具共享样式 → 改造目标
├── text-tools/
│   └── shared/styles.css     # 文本工具共享样式 → 改造目标
└── finance-tools/
    └── shared/styles.css     # 财税工具共享样式 → 改造目标
```

### 改造策略

采用"样式覆盖"策略：
1. 保留现有CSS结构和类名
2. 替换CSS变量值为复古风格配色
3. 更新字体、边框、阴影等视觉属性
4. 添加复古风格特有的装饰效果

## Components and Interfaces

### CSS变量映射

| 原变量 | 复古风格值 | 用途 |
|--------|-----------|------|
| --primary-color | #2b1810 | 主色调（深棕色） |
| --secondary-color | #4a3428 | 次要色（中棕色） |
| --accent-color | #b8453d | 强调色（红褐色） |
| --accent-warm | #c17d3f | 暖强调色（橙褐色） |
| --text-color | #3a2920 | 主文字颜色 |
| --text-light | #6b5a51 | 次要文字颜色 |
| --bg-color | #f4ebe1 | 页面背景色（米色） |
| --card-bg | #fdfaf6 | 卡片背景色（奶白色） |
| --border-color | #d4c4b0 | 边框颜色（浅棕色） |
| --border-dark | #8b7355 | 深边框颜色 |

### 字体配置

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Noto+Serif+SC:wght@400;600;700&display=swap');

body {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Noto Serif SC', serif, sans-serif;
}

h1, h2, h3, .card-title {
  font-family: 'Playfair Display', 'Noto Serif SC', serif;
}
```

### 背景纹理

```css
body {
  background-image: repeating-linear-gradient(
    0deg, 
    transparent, 
    transparent 2px, 
    rgba(0,0,0,.02) 2px, 
    rgba(0,0,0,.02) 4px
  );
}
```

### 组件样式规范

#### 1. 卡片组件
- 背景色：#fdfaf6
- 边框：2px solid #8b7355
- 圆角：4px（减少现代感）
- 阴影：0 2px 8px rgba(43, 24, 16, 0.08)

#### 2. 按钮组件
- 主按钮背景：#b8453d
- 主按钮悬停：#9a3830
- 次要按钮背景：#f4ebe1
- 次要按钮边框：#8b7355
- 圆角：4px

#### 3. 输入框组件
- 边框：1px solid #d4c4b0
- 聚焦边框：#b8453d
- 背景：#fdfaf6
- 圆角：4px

#### 4. 上传区域
- 边框：2px dashed #8b7355
- 悬停边框：#b8453d
- 背景：#fdfaf6

#### 5. 表格组件
- 表头背景：#f4ebe1
- 表头文字：#2b1810
- 边框：1px solid #d4c4b0
- 悬停行背景：#fdfaf6

## Data Models

本项目不涉及数据模型变更，仅修改CSS样式。



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Analysis

本项目是纯CSS样式改造，所有需求都是关于视觉呈现的。经过分析：

- 所有验收标准都涉及视觉样式（颜色、字体、边框、阴影等）
- 视觉样式的正确性无法通过属性测试（Property-Based Testing）验证
- CSS样式的应用依赖于浏览器渲染，不是可计算的属性

**结论：本项目没有可通过属性测试验证的正确性属性。**

验证方式建议：
1. **人工视觉检查** - 在浏览器中打开各工具页面，对比参考设计
2. **CSS代码审查** - 确认CSS变量和样式规则正确定义
3. **跨浏览器测试** - 在Chrome、Firefox、Safari等浏览器中验证一致性

## Error Handling

### CSS加载失败

如果Google Fonts加载失败，系统将回退到系统字体：
```css
font-family: 'PingFang SC', 'Microsoft YaHei', 'Noto Serif SC', serif, sans-serif;
```

### 浏览器兼容性

- CSS变量：支持所有现代浏览器（Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+）
- CSS Grid：用于响应式布局，支持所有现代浏览器
- 对于不支持CSS变量的旧浏览器，样式可能无法正确显示

## Testing Strategy

### 测试方法

由于本项目是纯CSS样式改造，采用以下测试策略：

#### 1. 视觉验证清单

每个工具套件完成后，检查以下项目：
- [ ] 页面背景为米色(#f4ebe1)带纸张纹理
- [ ] 卡片背景为奶白色(#fdfaf6)
- [ ] 标题使用衬线字体
- [ ] 按钮使用红褐色(#b8453d)
- [ ] 输入框边框为浅棕色(#d4c4b0)
- [ ] 悬停效果正常工作
- [ ] 响应式布局正常

#### 2. 跨浏览器测试

在以下浏览器中验证：
- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

#### 3. 响应式测试

在以下断点验证：
- 桌面端 (>1024px)
- 平板端 (768px-1024px)
- 移动端 (<768px)

### 不使用属性测试的原因

1. CSS样式是声明式的，不涉及数据转换或业务逻辑
2. 视觉正确性需要人眼判断，无法用代码验证
3. 样式应用依赖浏览器渲染引擎，不是确定性计算

## Implementation Notes

### 修改顺序

建议按以下顺序修改各工具套件的共享样式：

1. **image-tools/shared/styles.css** - 图片工具（最复杂，包含上传、预览等）
2. **pdf-tools/shared/styles.css** - PDF工具（类似图片工具）
3. **json-tools/shared/styles.css** - JSON工具
4. **code-tools/shared/styles.css** - 程序员工具
5. **text-tools/shared/styles.css** - 文本工具
6. **finance-tools/shared/styles.css** - 财税工具

### 关键修改点

每个样式文件需要修改：

1. **添加字体导入**
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Noto+Serif+SC:wght@400;600;700&display=swap');
```

2. **更新CSS变量**
```css
:root {
  --primary-color: #2b1810;
  --secondary-color: #4a3428;
  --accent-color: #b8453d;
  --accent-warm: #c17d3f;
  --text-color: #3a2920;
  --text-light: #6b5a51;
  --bg-color: #f4ebe1;
  --card-bg: #fdfaf6;
  --border-color: #d4c4b0;
  --border-dark: #8b7355;
}
```

3. **更新body样式**
```css
body {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Noto Serif SC', serif, sans-serif;
  background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.02) 2px, rgba(0,0,0,.02) 4px);
}
```

4. **更新标题字体**
```css
h1, h2, h3, .card-title, .header h1 {
  font-family: 'Playfair Display', 'Noto Serif SC', serif;
}
```

5. **调整边框圆角**（从8px减少到4px以减少现代感）

6. **更新按钮样式**（使用新的强调色和悬停效果）

7. **更新表格样式**（使用暖色调表头和边框）
