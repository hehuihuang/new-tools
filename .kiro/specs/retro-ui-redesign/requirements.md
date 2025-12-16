# Requirements Document

## Introduction

本项目旨在将在线工具箱中所有工具页面的UI样式统一改造为复古风格（Retro Style）。参考 `tooles/index.html` 的设计风格，将图片工具、PDF工具、JSON工具、程序员工具、文本数字工具和财税工具共6个工具套件的所有HTML页面进行视觉风格统一。

复古风格的核心特征包括：
- 暖色调配色方案（棕色、米色、红褐色）
- 衬线字体（Playfair Display、Noto Serif SC）
- 纸张质感背景
- 经典边框和阴影效果
- 优雅的装饰元素

## Glossary

- **Retro Style（复古风格）**: 一种设计风格，采用暖色调、衬线字体、纸张质感等元素，营造经典、优雅的视觉效果
- **Tool Suite（工具套件）**: 一组相关功能的工具集合，如图片工具套件包含压缩、转换、裁剪等功能
- **Shared Styles（共享样式）**: 位于各工具套件 `shared/styles.css` 中的公共CSS样式文件
- **Color Palette（配色方案）**: 定义UI中使用的颜色变量集合
- **Typography（字体排版）**: 字体选择、大小、行高等文字样式设置

## Requirements

### Requirement 1

**User Story:** As a user, I want all tool pages to have a consistent retro visual style, so that I can enjoy a cohesive and aesthetically pleasing experience across all tools.

#### Acceptance Criteria

1. WHEN a user visits any tool page THEN the system SHALL display the page using the retro color palette (primary: #2b1810, secondary: #4a3428, accent: #b8453d, background: #f4ebe1)
2. WHEN a user views any tool page THEN the system SHALL render text using serif fonts (Playfair Display for headings, Noto Serif SC for body text)
3. WHEN a user views the page background THEN the system SHALL display a subtle paper texture effect using repeating linear gradients
4. WHEN a user views any card or container element THEN the system SHALL display it with warm-toned backgrounds (#fdfaf6) and classic border styling (#d4c4b0)

### Requirement 2

**User Story:** As a user, I want the navigation and header elements to match the retro style, so that the page feels cohesive from top to bottom.

#### Acceptance Criteria

1. WHEN a user views the page header THEN the system SHALL display it with a cream background, dark brown text, and a bottom border in the retro style
2. WHEN a user hovers over navigation links THEN the system SHALL display an underline animation effect with the accent color (#b8453d)
3. WHEN a user views the back link THEN the system SHALL style it with the accent color and appropriate hover effects

### Requirement 3

**User Story:** As a user, I want buttons and interactive elements to have a retro appearance, so that interactions feel consistent with the overall design.

#### Acceptance Criteria

1. WHEN a user views primary action buttons THEN the system SHALL display them with the accent color (#b8453d) background and appropriate hover states
2. WHEN a user views secondary buttons THEN the system SHALL display them with warm background colors and dark borders
3. WHEN a user hovers over buttons THEN the system SHALL provide visual feedback through color changes and subtle shadow effects
4. WHEN a user views disabled buttons THEN the system SHALL display them with reduced opacity while maintaining the retro color scheme

### Requirement 4

**User Story:** As a user, I want form inputs and controls to match the retro aesthetic, so that data entry feels integrated with the design.

#### Acceptance Criteria

1. WHEN a user views input fields THEN the system SHALL display them with warm-toned borders (#d4c4b0) and cream backgrounds
2. WHEN a user focuses on an input field THEN the system SHALL highlight it with the accent color border
3. WHEN a user views select dropdowns THEN the system SHALL style them consistently with the retro theme
4. WHEN a user views checkboxes and radio buttons THEN the system SHALL display them with accent color styling when selected

### Requirement 5

**User Story:** As a user, I want upload areas and file handling interfaces to have the retro style, so that file operations feel consistent with the design.

#### Acceptance Criteria

1. WHEN a user views a file upload area THEN the system SHALL display it with dashed borders in warm colors and cream background
2. WHEN a user drags a file over the upload area THEN the system SHALL provide visual feedback using the accent color
3. WHEN a user views file lists THEN the system SHALL display them with retro-styled item cards and warm color accents

### Requirement 6

**User Story:** As a user, I want result displays and data tables to match the retro theme, so that output information is presented consistently.

#### Acceptance Criteria

1. WHEN a user views calculation results THEN the system SHALL display them in cards with warm backgrounds and classic typography
2. WHEN a user views data tables THEN the system SHALL style them with warm-toned headers and subtle row hover effects
3. WHEN a user views progress indicators THEN the system SHALL display them using the accent color scheme

### Requirement 7

**User Story:** As a user, I want the footer to complete the retro design, so that the page feels finished and cohesive.

#### Acceptance Criteria

1. WHEN a user views the page footer THEN the system SHALL display it with the primary dark color (#2b1810) background and light text

### Requirement 8

**User Story:** As a developer, I want the retro styles to be implemented in shared CSS files, so that maintenance is simplified and consistency is ensured.

#### Acceptance Criteria

1. WHEN styles are updated THEN the system SHALL apply changes through the shared styles.css files in each tool suite's shared folder
2. WHEN a new tool page is added THEN the system SHALL inherit the retro styles automatically by including the shared stylesheet
3. WHEN CSS variables are defined THEN the system SHALL use consistent naming conventions matching the reference design
