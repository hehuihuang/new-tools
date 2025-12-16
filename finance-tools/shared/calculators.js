/**
 * 财税计算工具套件 - 核心计算引擎
 */

// ==================== 税率表常量 ====================

/**
 * 个人所得税税率表（综合所得年度税率）
 */
const INDIVIDUAL_TAX_BRACKETS = [
  { min: 0, max: 36000, rate: 0.03, quickDeduction: 0 },
  { min: 36000, max: 144000, rate: 0.10, quickDeduction: 2520 },
  { min: 144000, max: 300000, rate: 0.20, quickDeduction: 16920 },
  { min: 300000, max: 420000, rate: 0.25, quickDeduction: 31920 },
  { min: 420000, max: 660000, rate: 0.30, quickDeduction: 52920 },
  { min: 660000, max: 960000, rate: 0.35, quickDeduction: 85920 },
  { min: 960000, max: Infinity, rate: 0.45, quickDeduction: 181920 }
];

/**
 * 个人所得税税率表（月度税率，用于工资薪金）
 */
const MONTHLY_TAX_BRACKETS = [
  { min: 0, max: 3000, rate: 0.03, quickDeduction: 0 },
  { min: 3000, max: 12000, rate: 0.10, quickDeduction: 210 },
  { min: 12000, max: 25000, rate: 0.20, quickDeduction: 1410 },
  { min: 25000, max: 35000, rate: 0.25, quickDeduction: 2660 },
  { min: 35000, max: 55000, rate: 0.30, quickDeduction: 4410 },
  { min: 55000, max: 80000, rate: 0.35, quickDeduction: 7160 },
  { min: 80000, max: Infinity, rate: 0.45, quickDeduction: 15160 }
];

/**
 * 增值税税率
 */
const VAT_RATES = {
  STANDARD: 0.13,           // 标准税率
  LOW_1: 0.09,              // 低税率1
  LOW_2: 0.06,              // 低税率2
  SMALL_SCALE: 0.03,        // 小规模纳税人
  SMALL_SCALE_REDUCED: 0.01 // 小规模纳税人优惠税率
};

/**
 * 企业所得税税率
 * 2024年最新政策：小微企业减按25%计入应纳税所得额
 */
const CORPORATE_TAX_RATES = {
  NORMAL: 0.25,             // 一般企业
  SMALL_PROFIT_1: 0.025,    // 小微企业(100万以下) 实际税率2.5% = 25% × 10%
  SMALL_PROFIT_2: 0.05,     // 小微企业(100-300万) 实际税率5% = 25% × 20%
  HIGH_TECH: 0.15           // 高新技术企业
};

/**
 * 基本减除费用（个税起征点）
 */
const BASIC_DEDUCTION = 5000; // 月度
const ANNUAL_BASIC_DEDUCTION = 60000; // 年度

// ==================== 工具函数 ====================

/**
 * 查找适用的税率档次
 * @param {number} taxableIncome - 应纳税所得额
 * @param {Array} brackets - 税率表
 * @returns {Object} 税率档次
 */
function findTaxBracket(taxableIncome, brackets) {
  for (const bracket of brackets) {
    if (taxableIncome > bracket.min && taxableIncome <= bracket.max) {
      return bracket;
    }
  }
  return brackets[brackets.length - 1];
}

/**
 * 四舍五入到2位小数
 * @param {number} value - 数值
 * @returns {number} 四舍五入后的数值
 */
function round2(value) {
  return Math.round(value * 100) / 100;
}

// ==================== TaxCalculator 基类 ====================

/**
 * 税务计算器基类
 */
class TaxCalculator {
  constructor() {
    this.steps = [];
  }

  /**
   * 添加计算步骤
   * @param {string} label - 步骤标签
   * @param {number} value - 计算值
   * @param {string} [formula] - 计算公式
   */
  addStep(label, value, formula = '') {
    this.steps.push({ label, value, formula });
  }

  /**
   * 清除计算步骤
   */
  clearSteps() {
    this.steps = [];
  }

  /**
   * 获取计算步骤
   * @returns {Array} 计算步骤数组
   */
  getSteps() {
    return this.steps;
  }
}

// ==================== 个人所得税计算 ====================

/**
 * 计算个人所得税
 * @param {number} income - 收入
 * @param {Object} deductions - 扣除项
 * @param {number} deductions.basic - 基本减除费用
 * @param {number} deductions.special - 专项扣除（五险一金）
 * @param {number} deductions.additional - 专项附加扣除
 * @param {number} deductions.other - 其他扣除
 * @param {boolean} [isAnnual=true] - 是否为年度计算
 * @returns {Object} 计算结果
 */
function calculateIndividualTax(income, deductions, isAnnual = true) {
  const calculator = new TaxCalculator();
  
  // 计算应纳税所得额
  const basicDeduction = deductions.basic || (isAnnual ? ANNUAL_BASIC_DEDUCTION : BASIC_DEDUCTION);
  const specialDeduction = deductions.special || 0;
  const additionalDeduction = deductions.additional || 0;
  const otherDeduction = deductions.other || 0;
  
  const taxableIncome = Math.max(0, income - basicDeduction - specialDeduction - additionalDeduction - otherDeduction);
  
  calculator.addStep('收入', round2(income), '');
  calculator.addStep('基本减除费用', round2(basicDeduction), '');
  calculator.addStep('专项扣除（五险一金）', round2(specialDeduction), '');
  calculator.addStep('专项附加扣除', round2(additionalDeduction), '');
  calculator.addStep('其他扣除', round2(otherDeduction), '');
  calculator.addStep('应纳税所得额', round2(taxableIncome), 
    `${round2(income)} - ${round2(basicDeduction)} - ${round2(specialDeduction)} - ${round2(additionalDeduction)} - ${round2(otherDeduction)}`);
  
  // 查找适用税率
  const brackets = isAnnual ? INDIVIDUAL_TAX_BRACKETS : MONTHLY_TAX_BRACKETS;
  const bracket = findTaxBracket(taxableIncome, brackets);
  
  // 计算应纳税额
  const tax = Math.max(0, round2(taxableIncome * bracket.rate - bracket.quickDeduction));
  
  calculator.addStep('适用税率', `${(bracket.rate * 100).toFixed(0)}%`, '');
  calculator.addStep('速算扣除数', round2(bracket.quickDeduction), '');
  calculator.addStep('应纳税额', round2(tax), 
    `${round2(taxableIncome)} × ${(bracket.rate * 100).toFixed(0)}% - ${round2(bracket.quickDeduction)}`);
  
  // 计算税后收入
  const afterTax = round2(income - specialDeduction - tax);
  calculator.addStep('税后收入', round2(afterTax), 
    `${round2(income)} - ${round2(specialDeduction)} - ${round2(tax)}`);
  
  return {
    taxableIncome: round2(taxableIncome),
    tax: round2(tax),
    afterTax: round2(afterTax),
    rate: bracket.rate,
    quickDeduction: round2(bracket.quickDeduction),
    steps: calculator.getSteps()
  };
}

/**
 * 计算年终奖个税
 * @param {number} bonus - 年终奖金额
 * @param {string} method - 计税方式 ('separate' | 'combined')
 * @param {number} [annualIncome=0] - 年度综合所得（并入方式需要）
 * @returns {Object} 计算结果
 */
function calculateBonusTax(bonus, method = 'separate', annualIncome = 0) {
  const calculator = new TaxCalculator();
  
  if (method === 'separate') {
    // 单独计税方式
    const monthlyBonus = bonus / 12;
    const bracket = findTaxBracket(monthlyBonus, MONTHLY_TAX_BRACKETS);
    const tax = round2(bonus * bracket.rate - bracket.quickDeduction);
    const afterTax = round2(bonus - tax);
    
    calculator.addStep('年终奖金额', round2(bonus), '');
    calculator.addStep('月均金额', round2(monthlyBonus), `${round2(bonus)} ÷ 12`);
    calculator.addStep('适用税率', `${(bracket.rate * 100).toFixed(0)}%`, '');
    calculator.addStep('速算扣除数', round2(bracket.quickDeduction), '');
    calculator.addStep('应纳税额', round2(tax), 
      `${round2(bonus)} × ${(bracket.rate * 100).toFixed(0)}% - ${round2(bracket.quickDeduction)}`);
    calculator.addStep('税后收入', round2(afterTax), `${round2(bonus)} - ${round2(tax)}`);
    
    return {
      method: 'separate',
      bonus: round2(bonus),
      tax: round2(tax),
      afterTax: round2(afterTax),
      rate: bracket.rate,
      steps: calculator.getSteps()
    };
  } else {
    // 并入综合所得方式
    const totalIncome = annualIncome + bonus;
    const result = calculateIndividualTax(totalIncome, { basic: ANNUAL_BASIC_DEDUCTION }, true);
    
    calculator.addStep('年度综合所得', round2(annualIncome), '');
    calculator.addStep('年终奖金额', round2(bonus), '');
    calculator.addStep('合计收入', round2(totalIncome), `${round2(annualIncome)} + ${round2(bonus)}`);
    calculator.addStep('应纳税所得额', round2(result.taxableIncome), '');
    calculator.addStep('应纳税额', round2(result.tax), '');
    calculator.addStep('税后收入', round2(result.afterTax), '');
    
    return {
      method: 'combined',
      bonus: round2(bonus),
      annualIncome: round2(annualIncome),
      totalIncome: round2(totalIncome),
      tax: round2(result.tax),
      afterTax: round2(result.afterTax),
      rate: result.rate,
      steps: calculator.getSteps()
    };
  }
}

// ==================== 增值税计算 ====================

/**
 * 计算增值税
 * @param {number} amount - 金额
 * @param {number} rate - 税率
 * @param {boolean} isIncludeTax - 是否含税
 * @param {number} [inputTax=0] - 进项税额（一般纳税人）
 * @returns {Object} 计算结果
 */
function calculateVAT(amount, rate, isIncludeTax, inputTax = 0) {
  const calculator = new TaxCalculator();
  
  let amountWithoutTax, amountWithTax, outputTax;
  
  if (isIncludeTax) {
    // 含税金额转不含税
    amountWithTax = amount;
    amountWithoutTax = round2(amount / (1 + rate));
    outputTax = round2(amountWithoutTax * rate);
    
    calculator.addStep('含税金额', round2(amountWithTax), '');
    calculator.addStep('税率', `${(rate * 100).toFixed(0)}%`, '');
    calculator.addStep('不含税金额', round2(amountWithoutTax), 
      `${round2(amountWithTax)} ÷ (1 + ${(rate * 100).toFixed(0)}%)`);
    calculator.addStep('销项税额', round2(outputTax), 
      `${round2(amountWithoutTax)} × ${(rate * 100).toFixed(0)}%`);
  } else {
    // 不含税金额转含税
    amountWithoutTax = amount;
    outputTax = round2(amount * rate);
    amountWithTax = round2(amount + outputTax);
    
    calculator.addStep('不含税金额', round2(amountWithoutTax), '');
    calculator.addStep('税率', `${(rate * 100).toFixed(0)}%`, '');
    calculator.addStep('销项税额', round2(outputTax), 
      `${round2(amountWithoutTax)} × ${(rate * 100).toFixed(0)}%`);
    calculator.addStep('含税金额', round2(amountWithTax), 
      `${round2(amountWithoutTax)} + ${round2(outputTax)}`);
  }
  
  // 计算应纳税额
  const payableTax = round2(outputTax - inputTax);
  
  if (inputTax > 0) {
    calculator.addStep('进项税额', round2(inputTax), '');
    calculator.addStep('应纳税额', round2(payableTax), 
      `${round2(outputTax)} - ${round2(inputTax)}`);
  } else {
    calculator.addStep('应纳税额', round2(payableTax), '');
  }
  
  return {
    amountWithoutTax: round2(amountWithoutTax),
    amountWithTax: round2(amountWithTax),
    outputTax: round2(outputTax),
    inputTax: round2(inputTax),
    payableTax: round2(payableTax),
    rate,
    steps: calculator.getSteps()
  };
}

// ==================== 企业所得税计算 ====================

/**
 * 计算企业所得税
 * @param {number} revenue - 营业收入
 * @param {number} costs - 营业成本
 * @param {Object} adjustments - 纳税调整项
 * @param {number} adjustments.increase - 调增项
 * @param {number} adjustments.decrease - 调减项
 * @param {string} companyType - 企业类型 ('normal' | 'small' | 'hightech')
 * @returns {Object} 计算结果
 */
function calculateCorporateTax(revenue, costs, adjustments, companyType = 'normal') {
  const calculator = new TaxCalculator();
  
  // 计算利润总额
  const profit = round2(revenue - costs);
  
  calculator.addStep('营业收入', round2(revenue), '');
  calculator.addStep('营业成本', round2(costs), '');
  calculator.addStep('利润总额', round2(profit), `${round2(revenue)} - ${round2(costs)}`);
  
  // 纳税调整
  const increase = adjustments.increase || 0;
  const decrease = adjustments.decrease || 0;
  const taxableIncome = round2(profit + increase - decrease);
  
  if (increase > 0 || decrease > 0) {
    calculator.addStep('纳税调增', round2(increase), '');
    calculator.addStep('纳税调减', round2(decrease), '');
    calculator.addStep('应纳税所得额', round2(taxableIncome), 
      `${round2(profit)} + ${round2(increase)} - ${round2(decrease)}`);
  } else {
    calculator.addStep('应纳税所得额', round2(taxableIncome), '');
  }
  
  // 计算应纳税额
  let tax = 0;
  let effectiveRate = 0;
  
  if (companyType === 'small') {
    // 小微企业优惠税率（2024年政策：减按25%计入应纳税所得额）
    if (taxableIncome <= 1000000) {
      tax = round2(taxableIncome * CORPORATE_TAX_RATES.SMALL_PROFIT_1);
      effectiveRate = CORPORATE_TAX_RATES.SMALL_PROFIT_1;
      calculator.addStep('适用税率', '2.5%（小微企业优惠）', '减按25%计入×10%');
    } else if (taxableIncome <= 3000000) {
      const part1 = round2(1000000 * CORPORATE_TAX_RATES.SMALL_PROFIT_1);
      const part2 = round2((taxableIncome - 1000000) * CORPORATE_TAX_RATES.SMALL_PROFIT_2);
      tax = round2(part1 + part2);
      effectiveRate = tax / taxableIncome;
      calculator.addStep('100万以下部分', round2(part1), '1,000,000 × 2.5%');
      calculator.addStep('100-300万部分', round2(part2), `${round2(taxableIncome - 1000000)} × 5%`);
    } else {
      tax = round2(taxableIncome * CORPORATE_TAX_RATES.NORMAL);
      effectiveRate = CORPORATE_TAX_RATES.NORMAL;
      calculator.addStep('适用税率', '25%（超过小微标准）', '');
    }
  } else if (companyType === 'hightech') {
    tax = round2(taxableIncome * CORPORATE_TAX_RATES.HIGH_TECH);
    effectiveRate = CORPORATE_TAX_RATES.HIGH_TECH;
    calculator.addStep('适用税率', '15%（高新技术企业）', '');
  } else {
    tax = round2(taxableIncome * CORPORATE_TAX_RATES.NORMAL);
    effectiveRate = CORPORATE_TAX_RATES.NORMAL;
    calculator.addStep('适用税率', '25%（一般企业）', '');
  }
  
  calculator.addStep('应纳税额', round2(tax), '');
  
  // 计算税负率
  const taxBurdenRate = revenue > 0 ? round2(tax / revenue) : 0;
  calculator.addStep('税负率', `${(taxBurdenRate * 100).toFixed(2)}%`, 
    `${round2(tax)} ÷ ${round2(revenue)}`);
  
  return {
    revenue: round2(revenue),
    costs: round2(costs),
    profit: round2(profit),
    taxableIncome: round2(taxableIncome),
    tax: round2(tax),
    effectiveRate: round2(effectiveRate),
    taxBurdenRate: round2(taxBurdenRate),
    steps: calculator.getSteps()
  };
}

// ==================== 房贷计算 ====================

/**
 * 计算房贷还款
 * @param {number} principal - 贷款本金
 * @param {number} rate - 年利率
 * @param {number} months - 贷款期限(月)
 * @param {string} method - 还款方式 ('equal-payment' | 'equal-principal')
 * @returns {Object} 计算结果
 */
function calculateMortgage(principal, rate, months, method = 'equal-payment') {
  const calculator = new TaxCalculator();
  const monthlyRate = rate / 12;
  
  calculator.addStep('贷款本金', round2(principal), '');
  calculator.addStep('年利率', `${(rate * 100).toFixed(2)}%`, '');
  calculator.addStep('月利率', `${(monthlyRate * 100).toFixed(4)}%`, '');
  calculator.addStep('贷款期限', `${months}个月`, '');
  
  let monthlyPayment, totalPayment, totalInterest, schedule;
  
  if (method === 'equal-payment') {
    // 等额本息
    const temp = Math.pow(1 + monthlyRate, months);
    monthlyPayment = round2(principal * monthlyRate * temp / (temp - 1));
    totalPayment = round2(monthlyPayment * months);
    totalInterest = round2(totalPayment - principal);
    
    calculator.addStep('还款方式', '等额本息', '');
    calculator.addStep('月供', round2(monthlyPayment), 
      `本金 × 月利率 × (1+月利率)^期数 ÷ ((1+月利率)^期数 - 1)`);
    calculator.addStep('还款总额', round2(totalPayment), `${round2(monthlyPayment)} × ${months}`);
    calculator.addStep('利息总额', round2(totalInterest), `${round2(totalPayment)} - ${round2(principal)}`);
    
    // 生成还款计划表
    schedule = [];
    let balance = principal;
    for (let i = 1; i <= months; i++) {
      const interest = round2(balance * monthlyRate);
      const principalPart = round2(monthlyPayment - interest);
      balance = round2(balance - principalPart);
      
      schedule.push({
        period: i,
        payment: round2(monthlyPayment),
        principal: principalPart,
        interest: interest,
        balance: Math.max(0, balance)
      });
    }
  } else {
    // 等额本金
    const principalPerMonth = round2(principal / months);
    const firstPayment = round2(principalPerMonth + principal * monthlyRate);
    const monthlyDecrease = round2(principalPerMonth * monthlyRate);
    
    totalInterest = 0;
    schedule = [];
    let balance = principal;
    
    for (let i = 1; i <= months; i++) {
      const interest = round2(balance * monthlyRate);
      const payment = round2(principalPerMonth + interest);
      balance = round2(balance - principalPerMonth);
      totalInterest += interest;
      
      schedule.push({
        period: i,
        payment: payment,
        principal: principalPerMonth,
        interest: interest,
        balance: Math.max(0, balance)
      });
    }
    
    totalInterest = round2(totalInterest);
    totalPayment = round2(principal + totalInterest);
    monthlyPayment = firstPayment; // 首月月供
    
    calculator.addStep('还款方式', '等额本金', '');
    calculator.addStep('首月月供', round2(firstPayment), '');
    calculator.addStep('月递减额', round2(monthlyDecrease), '');
    calculator.addStep('还款总额', round2(totalPayment), '');
    calculator.addStep('利息总额', round2(totalInterest), '');
  }
  
  return {
    principal: round2(principal),
    rate,
    months,
    method,
    monthlyPayment: round2(monthlyPayment),
    totalPayment: round2(totalPayment),
    totalInterest: round2(totalInterest),
    schedule,
    steps: calculator.getSteps()
  };
}

// ==================== 工资个税计算 ====================

/**
 * 计算五险一金
 * @param {number} salary - 税前工资
 * @param {Object} rates - 缴纳比例
 * @param {number} [baseLimit] - 缴费基数上限
 * @returns {Object} 计算结果
 */
function calculateSocialInsurance(salary, rates, baseLimit) {
  const base = baseLimit ? Math.min(salary, baseLimit) : salary;
  
  const pension = round2(base * (rates.pension || 0.08));
  const medical = round2(base * (rates.medical || 0.02));
  const unemployment = round2(base * (rates.unemployment || 0.005));
  const housingFund = round2(base * (rates.housingFund || 0.12));
  
  const total = round2(pension + medical + unemployment + housingFund);
  
  return {
    base: round2(base),
    pension,
    medical,
    unemployment,
    housingFund,
    total
  };
}

/**
 * 计算工资个税和税后工资
 * @param {number} salary - 税前工资
 * @param {Object} socialInsurance - 五险一金
 * @param {number} [additionalDeduction=0] - 专项附加扣除
 * @returns {Object} 计算结果
 */
function calculateSalaryTax(salary, socialInsurance, additionalDeduction = 0) {
  const deductions = {
    basic: BASIC_DEDUCTION,
    special: socialInsurance.total,
    additional: additionalDeduction,
    other: 0
  };
  
  const result = calculateIndividualTax(salary, deductions, false);
  
  return {
    salary: round2(salary),
    socialInsurance: round2(socialInsurance.total),
    additionalDeduction: round2(additionalDeduction),
    taxableIncome: result.taxableIncome,
    tax: result.tax,
    afterTax: result.afterTax,
    rate: result.rate,
    steps: result.steps
  };
}

// ==================== 导出 ====================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // 常量
    INDIVIDUAL_TAX_BRACKETS,
    MONTHLY_TAX_BRACKETS,
    VAT_RATES,
    CORPORATE_TAX_RATES,
    BASIC_DEDUCTION,
    ANNUAL_BASIC_DEDUCTION,
    // 类
    TaxCalculator,
    // 函数
    calculateIndividualTax,
    calculateBonusTax,
    calculateVAT,
    calculateCorporateTax,
    calculateMortgage,
    calculateSocialInsurance,
    calculateSalaryTax,
    findTaxBracket,
    round2
  };
}
