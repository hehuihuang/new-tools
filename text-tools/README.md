# 文本工具套件 (Text Tools Suite)

文本内容处理工具套件，包含8个独立的前端HTML工具页面，用于处理各种文本操作任务。

## 功能特点

- ✅ 纯前端实现，无需后端服务
- ✅ 所有数据处理在浏览器本地完成，保护隐私
- ✅ 蓝色主题配色，界面简洁美观
- ✅ 响应式设计，支持移动端
- ✅ 100个属性测试全部通过，确保代码质量

## 工具列表

### 1. 文本去重工具 (text-dedup.html)
- 行去重：移除重复行，保留首次出现
- 去空行：移除空行和仅含空白字符的行
- 去重复词：移除每行中的重复单词

### 2. 文本排序工具 (text-sort.html)
- 字典序排序：按字母顺序排序
- 数字排序：按数值大小排序
- 长度排序：按字符数量排序
- 支持升序/降序

### 3. 文本查找替换工具 (text-replace.html)
- 查找匹配：高亮显示所有匹配项
- 批量替换：一键替换所有匹配内容
- 正则表达式支持
- 大小写敏感选项

### 4. 文本分割/合并工具 (text-split.html)
- 分割文本：使用指定分隔符分割文本
- 合并文本：使用指定分隔符合并行
- 预定义分隔符：逗号、空格、换行、制表符、竖线
- 自定义分隔符支持

### 5. 文本清理工具 (text-clean.html)
- 去除首尾空格
- 合并多余空格
- 去除特殊字符
- 去除HTML标签

### 6. 文本统计工具 (text-stats.html)
- 字符数统计（含/不含空格）
- 单词数统计
- 句子数统计
- 行数统计
- 字符频率分析

### 7. Emoji/Unicode转换工具 (emoji-convert.html)
- 字符转Unicode：将emoji和特殊字符转换为U+XXXX格式
- Unicode转字符：将Unicode编码转换回字符
- 支持批量转换

### 8. 随机文本生成工具 (random-gen.html)
- 随机密码生成（可自定义长度和字符类型）
- 随机字符串生成
- UUID v4生成
- Lorem Ipsum生成

## 技术栈

- HTML5 + CSS3 + Vanilla JavaScript
- 无外部依赖
- ES6模块化
- 属性测试框架：Vitest + fast-check

## 项目结构

```
text-tools/
├── shared/
│   ├── styles.css          # 共享样式
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
└── README.md               # 项目说明文档
```

## 测试覆盖

所有工具都经过严格的属性测试，确保功能正确性：

- ✅ 文本去重：7个测试
- ✅ 文本排序：8个测试
- ✅ 文本替换：7个测试
- ✅ 文本分割：10个测试
- ✅ 文本清理：17个测试
- ✅ 文本统计：18个测试
- ✅ Emoji转换：14个测试
- ✅ 随机生成：19个测试

**总计：100个属性测试全部通过 ✓**

## 使用方法

1. 直接在浏览器中打开任意HTML文件即可使用
2. 或通过导航门户 (tooles/index.html) 访问所有工具
3. 所有工具均支持本地运行，无需网络连接

## 隐私保护

所有文本处理均在浏览器本地完成，数据不会上传到任何服务器，完全保护您的隐私安全。

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 其他现代浏览器

## 开发与测试

```bash
# 运行所有文本工具测试
npm test -- tests/text-tools --run

# 运行特定工具测试
npm test -- tests/text-tools/text-dedup.property.test.js --run
```

## 许可证

本项目采用 MIT 许可证。

---

**在线工具箱** - 一站式在线工具集合平台
