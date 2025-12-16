# 财税计算工具套件设计文档

## 概述

财税计算工具套件是一个纯前端的计算工具集合，提供6个核心财税计算器。每个计算器都是独立的HTML页面，使用现代化的UI设计，所有计算在浏览器端完成，确保用户数据隐私安全。

### 设计目标

1. **准确性**: 使用最新的税法规定和计算公式，确保计算结果准确可靠
2. **易用性**: 提供直观的用户界面，清晰的输入提示和详细的结果展示
3. **性能**: 实时计算和验证，响应时间小于100ms
4. **隐私**: 所有数据在本地处理，不上传到服务器
5. **一致性**: 与现有工具箱保持统一的设计风格和交互模式

### 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **样式**: 基于现有的共享样式系统，使用蓝色主题
- **存储**: localStorage API
- **测试**: Vitest + fast-check (property-based testing)

## 架构

### 整体架构

```
finance-tools/
├── shared/
│   ├── components.js      # 共享UI组件
│   ├── styles.css         # 共享样式
│   ├── utils.js           # 通用工具函数
│   └── calculators.js     # 计算引擎
├── bonus-tax.html         # 年终奖个税计算器
├── income-tax.html        # 综合所得汇算计算器
├── vat-calculator.html    # 增值税计算器
├── corp-tax.html          # 企业所得税计算器
├── mortgage.html          # 房贷还款计算器
└── salary-tax.html        # 工资个税计算器
```

### 分层设计

1. **表示层 (Presentation Layer)**
   - HTML页面结构
   - CSS样式和动画
   - 用户交互事件处理

2. **业务逻辑层 (Business Logic Layer)**
   - 计算引擎 (calculators.js)
   - 数据验证
   - 税率表和公式

3. **数据层 (Data Layer)**
   - localStorage封装
   - 历史记录管理
   - 配置数据

## 组件和接口

### 1. 共享组件 (components.js)

#### createFinanceHeader(title, description)
创建财税工具页面头部

**参数**:
- `title` (string): 工具标题
- `description` (string): 工具描述

**返回**: HTML字符串

#### createInputGroup(config)
创建输入表单组

**参数**:
- `config` (object): 配置对象
  - `label` (string): 标签文本
  - `id` (string): 输入框ID
  - `type` (string): 输入类型 (number, text, select)
  - `placeholder` (string): 占位符
  - `required` (boolean): 是否必填
  - `min` (number): 最小值
  - `max` (number): 最大值
  - `step` (number): 步进值
  - `unit` (string): 单位
  - `options` (array): 选项列表 (用于select)

**返回**: HTML字符串

#### createResultCard(title, data)
创建结果展示卡片

**参数**:
- `title` (string): 卡片标题
- `data` (object): 结果数据对象

**返回**: HTML字符串

#### createComparisonTable(headers, rows)
创建对比表格

**参数**:
- `headers` (array): 表头数组
- `rows` (array): 数据行数组

**返回**: HTML字符串

#### createDetailsList(items)
创建详细计算过程列表

**参数**:
- `items` (array): 计算步骤数组
  - `label` (string): 步骤标签
  - `value` (string|number): 计算值
  - `formula` (string): 计算公式

**返回**: HTML字符串

### 2. 计算引擎 (calculators.js)

#### TaxCalculator 类

基础税务计算器类，提供通用的税务计算方法。

**方法**:

##### calculateIndividualTax(income, deductions)
计算个人所得税

**参数**:
- `income` (number): 应纳税所得额
- `deductions` (object): 扣除项
  - `basic` (number): 基本减除费用 (5000)
  - `special` (number): 专项扣除 (五险一金)
  - `additional` (number): 专项附加扣除
  - `other` (number): 其他扣除

**返回**: 
```javascript
{
  taxableIncome: number,    // 应纳税所得额
  tax: number,              // 应纳税额
  afterTax: number,         // 税后收入
  rate: number,             // 适用税率
  quickDeduction: number,   // 速算扣除数
  steps: array             // 计算步骤
}
```

##### calculateBonusTax(bonus, method)
计算年终奖个税

**参数**:
- `bonus` (number): 年终奖金额
- `method` (string): 计税方式 ('separate' | 'combined')

**返回**: 税额计算结果对象

##### calculateVAT(amount, rate, isIncludeTax, inputTax)
计算增值税

**参数**:
- `amount` (number): 金额
- `rate` (number): 税率 (0.13, 0.09, 0.06, 0.03, 0.01)
- `isIncludeTax` (boolean): 是否含税
- `inputTax` (number): 进项税额 (可选)

**返回**:
```javascript
{
  amountWithoutTax: number,  // 不含税金额
  amountWithTax: number,     // 含税金额
  outputTax: number,         // 销项税额
  inputTax: number,          // 进项税额
  payableTax: number,        // 应纳税额
  steps: array              // 计算步骤
}
```

##### calculateCorporateTax(revenue, costs, adjustments, companyType)
计算企业所得税

**参数**:
- `revenue` (number): 营业收入
- `costs` (number): 营业成本
- `adjustments` (object): 纳税调整项
- `companyType` (string): 企业类型 ('normal' | 'small')

**返回**: 企业所得税计算结果对象

##### calculateMortgage(principal, rate, months, method)
计算房贷还款

**参数**:
- `principal` (number): 贷款本金
- `rate` (number): 年利率
- `months` (number): 贷款期限(月)
- `method` (string): 还款方式 ('equal-payment' | 'equal-principal')

**返回**:
```javascript
{
  monthlyPayment: number,      // 月供
  totalPayment: number,        // 还款总额
  totalInterest: number,       // 利息总额
  schedule: array,            // 还款计划表
  method: string              // 还款方式
}
```

### 3. 工具函数 (utils.js)

#### formatCurrency(amount, decimals)
格式化货币显示

**参数**:
- `amount` (number): 金额
- `decimals` (number): 小数位数，默认2

**返回**: 格式化后的字符串 (如: "12,345.67")

#### formatPercent(value, decimals)
格式化百分比显示

**参数**:
- `value` (number): 数值 (0-1)
- `decimals` (number): 小数位数，默认2

**返回**: 格式化后的字符串 (如: "12.34%")

#### validateNumber(value, min, max)
验证数字输入

**参数**:
- `value` (any): 输入值
- `min` (number): 最小值
- `max` (number): 最大值

**返回**: 
```javascript
{
  valid: boolean,
  error: string,
  value: number
}
```

#### saveToHistory(key, data)
保存计算历史

**参数**:
- `key` (string): 存储键名
- `data` (object): 计算数据

**返回**: void

#### loadHistory(key, limit)
加载计算历史

**参数**:
- `key` (string): 存储键名
- `limit` (number): 返回数量限制，默认10

**返回**: 历史记录数组

#### clearHistory(key)
清除计算历史

**参数**:
- `key` (string): 存储键名

**返回**: void

## 数据模型

### 个人所得税税率表

```javascript
const INDIVIDUAL_TAX_BRACKETS = [
  { min: 0, max: 36000, rate: 0.03, quickDeduction: 0 },
  { min: 36000, max: 144000, rate: 0.10, quickDeduction: 2520 },
  { min: 144000, max: 300000, rate: 0.20, quickDeduction: 16920 },
  { min: 300000, max: 420000, rate: 0.25, quickDeduction: 31920 },
  { min: 420000, max: 660000, rate: 0.30, quickDeduction: 52920 },
  { min: 660000, max: 960000, rate: 0.35, quickDeduction: 85920 },
  { min: 960000, max: Infinity, rate: 0.45, quickDeduction: 181920 }
];
```

### 增值税税率

```javascript
const VAT_RATES = {
  STANDARD: 0.13,      // 标准税率
  LOW_1: 0.09,         // 低税率1
  LOW_2: 0.06,         // 低税率2
  SMALL_SCALE: 0.03,   // 小规模纳税人
  SMALL_SCALE_REDUCED: 0.01  // 小规模纳税人优惠税率
};
```

### 企业所得税税率

```javascript
const CORPORATE_TAX_RATES = {
  NORMAL: 0.25,        // 一般企业
  SMALL_PROFIT_1: 0.05,  // 小微企业(100万以下)
  SMALL_PROFIT_2: 0.10,  // 小微企业(100-300万)
  HIGH_TECH: 0.15      // 高新技术企业
};
```

### 计算历史记录模型

```javascript
{
  id: string,           // 唯一标识
  timestamp: number,    // 时间戳
  calculator: string,   // 计算器类型
  inputs: object,       // 输入参数
  results: object,      // 计算结果
  note: string         // 备注
}
```

## 
正确性属性

*属性是系统在所有有效执行中应该保持为真的特征或行为——本质上是关于系统应该做什么的形式化陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### 税务计算属性

**属性 1: 年终奖单独计税计算正确性**
*对于任何*有效的年终奖金额，单独计税方式计算的应纳税额应该等于 (年终奖/12) 对应的税率 × 年终奖 - 速算扣除数
**验证需求: 1.1**

**属性 2: 年终奖并入综合所得计算正确性**
*对于任何*有效的年终奖金额和综合所得，并入方式计算的应纳税额应该等于按 (综合所得 + 年终奖) 计算的税额
**验证需求: 1.2**

**属性 3: 年终奖计税方式对比完整性**
*对于任何*年终奖计算结果，对比数据应该包含两种方式的税额、税后收入和推荐方案
**验证需求: 1.3**

**属性 4: 综合所得总额计算正确性**
*对于任何*工资薪金、劳务报酬、稿酬、特许权使用费收入，综合所得总额应该等于工资薪金 + 劳务报酬×80% + 稿酬×80%×70% + 特许权使用费×80%
**验证需求: 2.1**

**属性 5: 应纳税所得额计算正确性**
*对于任何*综合所得和扣除项，应纳税所得额应该等于 综合所得 - 60000 - 专项扣除 - 专项附加扣除 - 其他扣除
**验证需求: 2.2**

**属性 6: 个税税率表应用正确性**
*对于任何*应纳税所得额，应纳税额应该等于 应纳税所得额 × 适用税率 - 速算扣除数，其中税率和速算扣除数根据税率表确定
**验证需求: 2.3**

**属性 7: 补退税额计算正确性**
*对于任何*应纳税额和已预缴税额，应补退税额应该等于 应纳税额 - 已预缴税额
**验证需求: 2.4**

### 增值税计算属性

**属性 8: 含税转不含税计算正确性**
*对于任何*含税金额和税率，不含税金额应该等于 含税金额 / (1 + 税率)，税额应该等于 含税金额 - 不含税金额
**验证需求: 3.2**

**属性 9: 增值税往返一致性**
*对于任何*不含税金额和税率，先计算含税金额再转回不含税金额，应该得到原始值（允许浮点误差）
**验证需求: 3.2, 3.3**

**属性 10: 一般纳税人增值税计算正确性**
*对于任何*销项税额和进项税额，应纳增值税额应该等于 销项税额 - 进项税额
**验证需求: 3.4**

**属性 11: 增值税税率应用正确性**
*对于任何*纳税人类型，系统应该应用对应的税率（一般纳税人: 13%/9%/6%，小规模: 3%/1%）
**验证需求: 3.1, 3.5**

### 企业所得税计算属性

**属性 12: 利润总额计算正确性**
*对于任何*营业收入和营业成本，利润总额应该等于 营业收入 - 营业成本
**验证需求: 4.1**

**属性 13: 应纳税所得额调整正确性**
*对于任何*利润总额和纳税调整项，应纳税所得额应该等于 利润总额 + 调整增加额 - 调整减少额
**验证需求: 4.2**

**属性 14: 企业所得税税率应用正确性**
*对于任何*企业类型和应纳税所得额，系统应该应用对应的税率（一般企业25%，高新技术企业15%）
**验证需求: 4.3**

**属性 15: 小微企业优惠计算正确性**
*对于任何*符合小微企业条件的应纳税所得额，100万以下部分按5%计税，100-300万部分按10%计税
**验证需求: 4.4**

### 房贷计算属性

**属性 16: 等额本息月供计算正确性**
*对于任何*贷款本金、利率、期限，等额本息月供应该等于 本金 × 月利率 × (1+月利率)^期限 / ((1+月利率)^期限 - 1)
**验证需求: 5.1**

**属性 17: 等额本金月供计算正确性**
*对于任何*贷款本金、利率、期限，等额本金首月月供应该等于 本金/期限 + 本金×月利率，每月递减 本金/期限×月利率
**验证需求: 5.2**

**属性 18: 还款总额一致性**
*对于任何*还款方式，还款总额应该等于所有月供之和，总利息应该等于 还款总额 - 本金
**验证需求: 5.3**

**属性 19: 还款计划表完整性**
*对于任何*贷款参数，还款计划表的期数应该等于贷款期限，每期应包含期数、本金、利息、余额
**验证需求: 5.4**

### 工资个税计算属性

**属性 20: 五险一金计算正确性**
*对于任何*税前工资和缴纳比例，五险一金扣除额应该等于 min(工资, 缴费基数上限) × 各项比例之和
**验证需求: 6.1**

**属性 21: 工资应纳税所得额计算正确性**
*对于任何*税前工资、五险一金、专项附加扣除，应纳税所得额应该等于 工资 - 5000 - 五险一金 - 专项附加扣除
**验证需求: 6.3**

**属性 22: 税后工资计算正确性**
*对于任何*税前工资、五险一金、个税，税后工资应该等于 税前工资 - 五险一金 - 个税
**验证需求: 6.4**

### 数据验证属性

**属性 23: 无效输入拒绝**
*对于任何*负数或非数字输入，验证函数应该返回 valid=false 和相应的错误消息
**验证需求: 1.4, 8.1**

**属性 24: 范围验证正确性**
*对于任何*超出指定范围的数值，验证函数应该返回警告信息
**验证需求: 8.2**

**属性 25: 必填字段验证**
*对于任何*缺失必填字段的表单数据，验证函数应该返回缺失字段列表
**验证需求: 8.3**

### 数据持久化属性

**属性 26: 历史记录保存一致性**
*对于任何*计算结果，保存到localStorage后再加载，应该得到相同的参数和结果
**验证需求: 10.1, 10.4**

**属性 27: 历史记录数量限制**
*对于任何*历史记录查询，返回的记录数应该不超过指定的限制（默认10条）
**验证需求: 10.3**

**属性 28: 历史记录清除完整性**
*对于任何*历史记录键，清除操作后localStorage中不应该存在该键的数据
**验证需求: 10.5**

### 结果展示属性

**属性 29: 计算结果完整性**
*对于任何*计算操作，结果对象应该包含所有必要的字段（应纳税额、税后收入等）
**验证需求: 9.1**

**属性 30: 计算步骤可追溯性**
*对于任何*计算操作，结果对象应该包含steps数组，记录详细的计算过程
**验证需求: 2.5, 9.3**

## 错误处理

### 错误类型

1. **输入验证错误**
   - 非数字输入
   - 负数输入
   - 超出范围
   - 缺失必填字段

2. **计算错误**
   - 除零错误
   - 溢出错误
   - 精度损失

3. **存储错误**
   - localStorage不可用
   - 存储空间不足
   - 数据格式错误

### 错误处理策略

```javascript
class CalculationError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'CalculationError';
    this.code = code;
    this.details = details;
  }
}

// 错误码定义
const ERROR_CODES = {
  INVALID_INPUT: 'E001',
  OUT_OF_RANGE: 'E002',
  MISSING_REQUIRED: 'E003',
  CALCULATION_FAILED: 'E004',
  STORAGE_FAILED: 'E005'
};
```

### 错误处理流程

1. **输入层**: 实时验证用户输入，显示友好的错误提示
2. **业务层**: 捕获计算异常，返回结构化的错误对象
3. **展示层**: 根据错误类型显示相应的错误消息和建议

## 测试策略

### 单元测试

使用Vitest进行单元测试，覆盖以下方面：

1. **计算函数测试**
   - 测试各种税务计算函数的基本功能
   - 测试边界值和特殊情况
   - 测试错误处理

2. **工具函数测试**
   - 测试格式化函数
   - 测试验证函数
   - 测试存储函数

3. **组件函数测试**
   - 测试UI组件生成函数
   - 测试事件处理函数

### 基于属性的测试

使用fast-check进行基于属性的测试，验证上述30个正确性属性：

1. **配置要求**
   - 每个属性测试运行至少100次迭代
   - 使用合理的数据生成器（如：年终奖范围0-1000000）
   - 每个测试必须标注对应的属性编号

2. **测试标注格式**
   ```javascript
   /**
    * Feature: finance-tax-tools, Property 1: 年终奖单独计税计算正确性
    * Validates: Requirements 1.1
    */
   test('bonus tax calculation - separate method', () => {
     fc.assert(
       fc.property(
         fc.integer({ min: 0, max: 1000000 }),
         (bonus) => {
           // 测试逻辑
         }
       ),
       { numRuns: 100 }
     );
   });
   ```

3. **数据生成器**
   - 金额生成器: 0 - 10,000,000
   - 税率生成器: [0.01, 0.03, 0.06, 0.09, 0.13, 0.25]
   - 期限生成器: 1 - 360 (月)
   - 利率生成器: 0.01 - 0.10 (年利率)

### 集成测试

1. **端到端流程测试**
   - 测试完整的用户操作流程
   - 测试多个计算器之间的数据一致性

2. **浏览器兼容性测试**
   - 测试主流浏览器的兼容性
   - 测试移动端响应式布局

### 测试覆盖率目标

- 计算函数: 100%
- 工具函数: 95%
- UI组件: 80%
- 整体代码: 90%

## UI设计规范

### 配色方案

基于现有工具箱的蓝色主题：

```css
:root {
  --primary-color: #2c3e50;      /* 深蓝灰 */
  --secondary-color: #3498db;    /* 天蓝 */
  --accent-color: #2980b9;       /* 深天蓝 */
  --success-color: #27ae60;      /* 绿色 */
  --warning-color: #f39c12;      /* 橙色 */
  --danger-color: #e74c3c;       /* 红色 */
  --bg-color: #f5f7fa;           /* 浅灰背景 */
  --card-bg: #ffffff;            /* 白色卡片 */
}
```

### 布局结构

```
┌─────────────────────────────────────┐
│  Header (返回链接 + 标题 + 描述)      │
├─────────────────────────────────────┤
│  Input Card                         │
│  ┌───────────────────────────────┐  │
│  │ 输入表单                       │  │
│  │ - 输入框                       │  │
│  │ - 选择框                       │  │
│  │ - 按钮组                       │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  Result Card                        │
│  ┌───────────────────────────────┐  │
│  │ 关键结果摘要                   │  │
│  │ - 大数字显示                   │  │
│  │ - 对比表格                     │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  Details Card (可折叠)              │
│  ┌───────────────────────────────┐  │
│  │ 详细计算过程                   │  │
│  │ - 计算步骤列表                 │  │
│  │ - 还款计划表                   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 响应式设计

- **桌面端** (>768px): 双栏布局，输入和结果并排显示
- **移动端** (≤768px): 单栏布局，输入和结果上下排列

### 交互设计

1. **实时验证**: 输入框失焦时验证，显示错误提示
2. **实时计算**: 输入变化时自动计算（可选）
3. **结果动画**: 计算完成后结果卡片淡入显示
4. **加载状态**: 计算时显示加载指示器
5. **历史记录**: 侧边栏或下拉菜单显示历史记录

## 性能优化

### 计算性能

1. **防抖处理**: 实时计算时使用防抖，避免频繁计算
2. **缓存结果**: 相同输入参数缓存计算结果
3. **Web Worker**: 复杂计算（如生成完整还款计划表）使用Web Worker

### 存储优化

1. **数据压缩**: 历史记录超过限制时自动清理旧数据
2. **增量更新**: 只保存变化的数据
3. **定期清理**: 提供清理过期数据的功能

### 渲染优化

1. **虚拟滚动**: 长列表（如还款计划表）使用虚拟滚动
2. **懒加载**: 详细计算过程默认折叠，点击时才渲染
3. **CSS动画**: 使用CSS动画代替JavaScript动画

## 安全考虑

### 数据安全

1. **本地处理**: 所有计算在浏览器端完成，不上传到服务器
2. **数据隔离**: 使用localStorage的域隔离特性
3. **敏感数据**: 不保存敏感的个人信息（如身份证号）

### 输入安全

1. **XSS防护**: 所有用户输入进行HTML转义
2. **类型检查**: 严格的输入类型验证
3. **范围限制**: 限制输入值的合理范围

## 浏览器兼容性

### 目标浏览器

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 降级策略

1. **localStorage不可用**: 提示用户启用localStorage，禁用历史记录功能
2. **Clipboard API不可用**: 使用document.execCommand降级方案
3. **CSS Grid不支持**: 使用Flexbox降级布局

## 部署和维护

### 文件组织

```
finance-tools/
├── index.html              # 财税工具导航页（可选）
├── bonus-tax.html
├── income-tax.html
├── vat-calculator.html
├── corp-tax.html
├── mortgage.html
├── salary-tax.html
├── shared/
│   ├── components.js
│   ├── styles.css
│   ├── utils.js
│   └── calculators.js
└── tests/
    ├── calculators.test.js
    ├── calculators.property.test.js
    └── utils.test.js
```

### 更新维护

1. **税率更新**: 税率表集中定义在calculators.js中，便于更新
2. **版本控制**: 在页面底部显示版本号和更新日期
3. **用户反馈**: 提供反馈入口，收集用户意见

### 文档

1. **用户文档**: 每个计算器页面提供使用说明和计算公式说明
2. **开发文档**: 代码注释和API文档
3. **更新日志**: 记录每次更新的内容

## 未来扩展

### 第二阶段功能

1. 劳务报酬个税计算
2. 稿酬所得个税计算
3. 附加税费计算（城建税、教育费附加）
4. 契税计算
5. 二手房税费计算

### 第三阶段功能

1. 多城市个税对比
2. 公积金缴存/提取计算
3. 成本与利润分析工具
4. 投资回报率计算
5. 跨境税务计算

### 技术改进

1. 使用TypeScript重写，提高代码质量
2. 引入前端框架（Vue/React）提升开发效率
3. 添加数据可视化（图表展示）
4. 支持导出PDF报告
5. 添加税务知识库和常见问题解答
