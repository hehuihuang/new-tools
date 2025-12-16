# Implementation Plan - Image Tools Suite

- [-] 1. 创建共享基础设施

  - 创建 image-tools 文件夹和 shared 子文件夹
  - 实现共享样式文件（基于 PDF 工具样式，避免紫色渐变）
  - 实现共享工具函数（文件验证、Canvas 操作、下载等）
  - _Requirements: 12.1, 12.2, 13.1, 13.2, 13.4_

- [x] 1.1 实现 ImageUploader 组件


  - 实现文件选择、验证和读取功能
  - 实现拖拽上传区域设置
  - 支持单文件和多文件上传
  - _Requirements: 1.1, 13.1_

- [ ] 1.2 为 ImageUploader 编写属性测试
  - **Property: File validation correctness**
  - **Validates: Requirements 1.1**


- [ ] 1.3 实现 ImageViewer 组件
  - 实现图片加载和显示功能
  - 实现 Canvas 导出功能（Blob 和 DataURL）
  - _Requirements: 1.1, 13.2_

- [ ] 1.4 为 ImageViewer 编写属性测试
  - **Property: Image load and export consistency**
  - **Validates: Requirements 1.1**


- [ ] 1.5 实现 ProgressIndicator 组件
  - 复用 PDF 工具的进度指示器实现
  - 支持进度更新和消息显示
  - _Requirements: 12.5_

- [x] 2. 更新导航网站


  - 在 tooles/index.html 的图片处理工具卡片中添加 10 个工具链接
  - 设置链接指向 image-tools 文件夹中的各个工具页面
  - 确保链接在新标签页打开（target="_blank"）
  - _Requirements: 11.1, 11.2_

- [ ] 3. 实现图片压缩工具（image-compress.html）
  - [x] 3.1 创建页面结构和 UI


    - 实现上传区域和处理区域
    - 添加质量滑块和文件信息显示
    - _Requirements: 1.1, 1.2_


  - [ ] 3.2 实现压缩功能
    - 使用 Canvas API 压缩图片
    - 保持原始宽高比例
    - 显示压缩前后对比
    - _Requirements: 1.3, 1.4_

  - [ ] 3.3 编写属性测试
    - **Property 1: Aspect ratio preservation in compression**
    - **Validates: Requirements 1.3**


  - [ ] 3.4 实现下载功能
    - 使用 Blob API 生成下载文件
    - _Requirements: 1.5, 13.4_

- [ ] 4. 实现格式转换工具（image-convert.html）
  - [x] 4.1 创建页面结构和 UI


    - 显示当前格式和目标格式选择
    - 添加质量调节选项（JPG 格式）
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 4.2 实现格式转换功能

    - 支持 JPG/PNG/WEBP/BMP 互转
    - 使用 Canvas toBlob 方法转换格式
    - _Requirements: 2.4_

  - [ ] 4.3 编写属性测试
    - **Property 2: Format conversion correctness**
    - **Validates: Requirements 2.4**

  - [x] 4.4 实现下载功能

    - _Requirements: 2.5_

- [ ] 5. 实现尺寸调整工具（image-resize.html）
  - [x] 5.1 创建页面结构和 UI


    - 显示原始尺寸
    - 添加宽度、高度输入框
    - 添加保持比例开关和百分比缩放输入
    - _Requirements: 3.1, 3.3_


  - [ ] 5.2 实现宽高比自动计算
    - 当输入宽度时自动计算高度
    - 当输入高度时自动计算宽度
    - _Requirements: 3.2_

  - [ ] 5.3 编写属性测试
    - **Property 3: Aspect ratio calculation in resize**
    - **Validates: Requirements 3.2**


  - [ ] 5.4 实现百分比缩放功能
    - 根据百分比计算目标尺寸
    - _Requirements: 3.4_

  - [ ] 5.5 编写属性测试
    - **Property 4: Percentage scaling correctness**
    - **Validates: Requirements 3.4**

  - [x] 5.6 实现尺寸调整和下载

    - 使用 Canvas API 调整图片尺寸
    - _Requirements: 3.5_

  - [ ] 5.7 编写属性测试
    - **Property 5: Resize output dimensions match specification**
    - **Validates: Requirements 3.5**

- [ ] 6. 实现图片裁剪工具（image-crop.html）
  - [x] 6.1 创建页面结构和 UI

    - 在 Canvas 上显示图片
    - 添加比例选择器（1:1, 4:3, 16:9, 自由）
    - _Requirements: 4.1_


  - [ ] 6.2 实现可拖动裁剪框
    - 监听鼠标拖动事件创建裁剪框
    - 显示裁剪框边缘和角落的调整手柄
    - 实时显示裁剪区域尺寸
    - _Requirements: 4.2, 4.3_


  - [ ] 6.3 实现比例约束
    - 根据选择的比例约束裁剪框调整
    - _Requirements: 4.4_

  - [ ] 6.4 编写属性测试
    - **Property 6: Crop aspect ratio constraint**
    - **Validates: Requirements 4.4**


  - [ ] 6.5 实现裁剪和下载
    - 提取选定区域的像素数据
    - _Requirements: 4.5_

  - [ ] 6.6 编写属性测试
    - **Property 7: Crop output matches selection**
    - **Validates: Requirements 4.5**

- [x] 7. 实现旋转翻转工具（image-rotate.html）

  - [ ] 7.1 创建页面结构和 UI
    - 显示图片预览
    - 添加左旋转、右旋转、水平翻转、垂直翻转按钮
    - _Requirements: 5.1_


  - [ ] 7.2 实现旋转功能
    - 实现逆时针旋转 90 度
    - 实现顺时针旋转 90 度
    - _Requirements: 5.2, 5.3_

  - [ ] 7.3 编写属性测试
    - **Property 8: Rotation is cumulative and cyclic**
    - **Validates: Requirements 5.2**


  - [ ] 7.4 实现翻转功能
    - 实现水平翻转（沿垂直轴镜像）
    - 实现垂直翻转（沿水平轴镜像）
    - _Requirements: 5.4, 5.5_

  - [ ] 7.5 编写属性测试
    - **Property 9: Horizontal flip is idempotent**
    - **Validates: Requirements 5.4**

  - [ ] 7.6 编写属性测试
    - **Property 10: Vertical flip is idempotent**
    - **Validates: Requirements 5.5**


  - [ ] 7.7 实现下载功能
    - _Requirements: 5.6_

- [x] 8. 实现水印工具（image-watermark.html）

  - [ ] 8.1 创建页面结构和 UI
    - 显示图片预览
    - 添加水印类型选择（文字/图片）
    - 添加水印配置面板
    - _Requirements: 6.1, 6.2, 6.3_


  - [ ] 8.2 实现文字水印功能
    - 添加文字输入、字体大小、颜色、透明度、位置控件
    - 在 Canvas 上绘制文字水印
    - 实时预览水印效果
    - _Requirements: 6.2, 6.4_


  - [ ] 8.3 实现图片水印功能
    - 允许上传水印图片
    - 添加缩放、透明度、位置控件
    - 在 Canvas 上绘制图片水印
    - 实时预览水印效果
    - _Requirements: 6.3, 6.4_


  - [ ] 8.4 实现水印应用和下载
    - 将水印合成到图片上
    - _Requirements: 6.5_

  - [ ] 8.5 编写属性测试
    - **Property 11: Watermark presence in output**
    - **Validates: Requirements 6.5**


- [ ] 9. 实现滤镜工具（image-filter.html）
  - [ ] 9.1 创建页面结构和 UI
    - 显示图片预览
    - 添加滤镜选项列表（灰度、复古、黑白、反色、模糊、锐化、亮度、对比度）
    - 添加强度滑块

    - _Requirements: 7.1, 7.2, 7.4_

  - [ ] 9.2 实现滤镜效果
    - 实现各种滤镜算法（使用 Canvas ImageData 操作像素）
    - 实时预览滤镜效果
    - _Requirements: 7.3_

  - [x] 9.3 编写属性测试

    - **Property 12: Filter application changes pixels**
    - **Validates: Requirements 7.3, 7.5**

  - [ ] 9.4 实现滤镜应用和下载
    - _Requirements: 7.5_

- [x] 10. 实现图片拼接工具（image-merge.html）

  - [ ] 10.1 创建页面结构和 UI
    - 支持多文件上传
    - 显示缩略图列表
    - 添加方向选择（垂直/水平）和间距输入
    - _Requirements: 8.1, 8.3_


  - [ ] 10.2 实现拖拽排序功能
    - 允许拖动缩略图调整顺序
    - _Requirements: 8.2_

  - [ ] 10.3 编写属性测试
    - **Property 14: Image order preservation in merge**
    - **Validates: Requirements 8.2, 8.3**


  - [ ] 10.4 实现图片拼接功能
    - 根据方向和间距计算总尺寸
    - 在 Canvas 上按顺序绘制所有图片
    - _Requirements: 8.4, 8.5_

  - [ ] 10.5 编写属性测试
    - **Property 13: Merge output dimensions**
    - **Validates: Requirements 8.5**


  - [ ] 10.6 实现下载功能
    - _Requirements: 8.5_


- [ ] 11. 实现 EXIF 清理工具（image-exif.html）
  - [ ] 11.1 创建页面结构和 UI
    - 显示图片预览
    - 添加 EXIF 信息显示区域
    - 引入 EXIF.js CDN 库
    - _Requirements: 9.1, 9.2_


  - [ ] 11.2 实现 EXIF 读取功能
    - 使用 EXIF.js 读取元数据
    - 显示拍摄时间、设备型号、GPS、分辨率等信息
    - 处理无 EXIF 信息的情况
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 11.3 实现 EXIF 清理功能

    - 使用 Canvas 重绘图片（自动移除 EXIF）
    - _Requirements: 9.4_

  - [ ] 11.4 编写属性测试
    - **Property 15: EXIF removal round trip**
    - **Validates: Requirements 9.4**


  - [ ] 11.5 实现下载功能
    - _Requirements: 9.5_


- [ ] 12. 实现圆角头像工具（image-avatar.html）
  - [ ] 12.1 创建页面结构和 UI
    - 显示图片预览
    - 添加模式选择（圆角/圆形）
    - 添加圆角半径滑块和尺寸输入

    - _Requirements: 10.1, 10.2, 10.3_

  - [ ] 12.2 实现圆角模式
    - 使用 Canvas clip 方法创建圆角路径
    - 实时预览圆角效果
    - _Requirements: 10.2, 10.4_


  - [ ] 12.3 实现圆形头像模式
    - 显示圆形裁剪框
    - 允许调整位置和大小
    - 实时预览圆形裁剪效果
    - _Requirements: 10.3, 10.4_

  - [x] 12.4 实现生成和下载

    - 生成带透明背景的 PNG 图片
    - _Requirements: 10.5_

  - [ ] 12.5 编写属性测试
    - **Property 16: Avatar output format**
    - **Validates: Requirements 10.5**

- [ ] 13. 实现隐私保护验证
  - [ ] 13.1 编写属性测试
    - **Property 17: No network requests for image data**
    - **Validates: Requirements 13.3**


  - [ ] 13.2 添加内存清理逻辑
    - 在页面卸载时清理 Canvas 和图片数据
    - _Requirements: 13.5_

  - [ ] 13.3 编写属性测试
    - **Property: Memory cleanup on page unload**
    - **Validates: Requirements 13.5**


- [x] 14. 最终检查点 - 确保所有测试通过

  - 确保所有测试通过，如有问题请询问用户
