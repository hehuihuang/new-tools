/**
 * 财税计算工具套件 - 属性测试
 * 使用fast-check进行基于属性的测试
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateIndividualTax,
  calculateBonusTax,
  calculateVAT,
  calculateCorporateTax,
  calculateMortgage,
  calculateSocialInsurance,
  calculateSalaryTax,
  INDIVIDUAL_TAX_BRACKETS,
  MONTHLY_TAX_BRACKETS,
  BASIC_DEDUCTION,
  ANNUAL_BASIC_DEDUCTION
} from './calculators.js';

// 数据生成器
const amountGen = fc.integer({ min: 0, max: 10000000 });
const smallAmountGen = fc.integer({ min: 0, max: 1000000 });
const rateGen = fc.constantFrom(0.01, 0.03, 0.06, 0.09, 0.13, 0.25);
const vatRateGen = fc.constantFrom(0.01, 0.03, 0.06, 0.09, 0.13);
const interestRateGen = fc.double({ min: 0.01, max: 0.10 });
const monthsGen = fc.integer({ min: 1, max: 360 });
const percentGen = fc.double({ min: 0, max: 0.3 });

describe('个税计算属性测试', () => {
  /**
   * Feature: finance-tax-tools, Property 6: 个税税率表应用正确性
   * Validates: Requirements 2.3
   */
  it('属性 6: 个税税率表应用正确性', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 5000000 }),
        (taxableIncome) => {
          const result = calculateIndividualTax(taxableIncome + ANNUAL_BASIC_DEDUCTION, {
            basic: ANNUAL_BASIC_DEDUCTION
          }, true);
          
          // 验证税额计算公式: 税额 = 应纳税所得额 × 税率 - 速算扣除数
          const expectedTax = Math.max(0, Math.round((result.taxableIncome * result.rate - result.quickDeduction) * 100) / 100);
          expect(Math.abs(result.tax - expectedTax)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: finance-tax-tools, Property 5: 应纳税所得额计算正确性
   * Validates: Requirements 2.2
   */
  it('属性 5: 应纳税所得额计算正确性', () => {
    fc.assert(
      fc.property(
        amountGen,
        smallAmountGen,
        smallAmountGen,
        smallAmountGen,
        (income, special, additional, other) => {
          const result = calculateIndividualTax(income, {
            basic: ANNUAL_BASIC_DEDUCTION,
            special,
            additional,
            other
          }, true);
          
          // 验证: 应纳税所得额 = 收入 - 60000 - 专项扣除 - 专项附加扣除 - 其他扣除
          const expected = Math.max(0, income - ANNUAL_BASIC_DEDUCTION - special - additional - other);
          expect(Math.abs(result.taxableIncome - expected)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: finance-tax-tools, Property 21: 工资应纳税所得额计算正确性
   * Validates: Requirements 6.3
   */
  it('属性 21: 工资应纳税所得额计算正确性', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 5000, max: 100000 }),
        fc.integer({ min: 0, max: 5000 }),
        fc.integer({ min: 0, max: 3000 }),
        (salary, socialInsurance, additional) => {
          const result = calculateIndividualTax(salary, {
            basic: BASIC_DEDUCTION,
            special: socialInsurance,
            additional,
            other: 0
          }, false);
          
          // 验证: 应纳税所得额 = 工资 - 5000 - 五险一金 - 专项附加扣除
          const expected = Math.max(0, salary - BASIC_DEDUCTION - socialInsurance - additional);
          expect(Math.abs(result.taxableIncome - expected)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('年终奖计算属性测试', () => {
  /**
   * Feature: finance-tax-tools, Property 1: 年终奖单独计税计算正确性
   * Validates: Requirements 1.1
   */
  it('属性 1: 年终奖单独计税计算正确性', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000000 }),
        (bonus) => {
          const result = calculateBonusTax(bonus, 'separate');
          
          // 验证单独计税方式: 月均金额 = 年终奖 / 12
          const monthlyBonus = bonus / 12;
          
          // 查找适用税率
          let bracket = MONTHLY_TAX_BRACKETS[0];
          for (const b of MONTHLY_TAX_BRACKETS) {
            if (monthlyBonus > b.min && monthlyBonus <= b.max) {
              bracket = b;
              break;
            }
          }
          
          // 验证税额 = 年终奖 × 税率 - 速算扣除数
          const expectedTax = Math.max(0, Math.round((bonus * bracket.rate - bracket.quickDeduction) * 100) / 100);
          expect(Math.abs(result.tax - expectedTax)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: finance-tax-tools, Property 2: 年终奖并入综合所得计算正确性
   * Validates: Requirements 1.2
   */
  it('属性 2: 年终奖并入综合所得计算正确性', () => {
    fc.assert(
      fc.property(
        smallAmountGen,
        smallAmountGen,
        (bonus, annualIncome) => {
          const result = calculateBonusTax(bonus, 'combined', annualIncome);
          
          // 验证并入方式: 总收入 = 年度综合所得 + 年终奖
          expect(result.totalIncome).toBe(annualIncome + bonus);
          
          // 验证税额应该基于总收入计算
          const directResult = calculateIndividualTax(annualIncome + bonus, {
            basic: ANNUAL_BASIC_DEDUCTION
          }, true);
          expect(Math.abs(result.tax - directResult.tax)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: finance-tax-tools, Property 3: 年终奖计税方式对比完整性
   * Validates: Requirements 1.3
   */
  it('属性 3: 年终奖计税方式对比完整性', () => {
    fc.assert(
      fc.property(
        smallAmountGen,
        (bonus) => {
          const separateResult = calculateBonusTax(bonus, 'separate');
          const combinedResult = calculateBonusTax(bonus, 'combined', 0);
          
          // 验证两种方式都返回必要的字段
          expect(separateResult).toHaveProperty('tax');
          expect(separateResult).toHaveProperty('afterTax');
          expect(separateResult).toHaveProperty('method');
          
          expect(combinedResult).toHaveProperty('tax');
          expect(combinedResult).toHaveProperty('afterTax');
          expect(combinedResult).toHaveProperty('method');
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('增值税计算属性测试', () => {
  /**
   * Feature: finance-tax-tools, Property 8: 含税转不含税计算正确性
   * Validates: Requirements 3.2
   */
  it('属性 8: 含税转不含税计算正确性', () => {
    fc.assert(
      fc.property(
        amountGen,
        vatRateGen,
        (amount, rate) => {
          if (amount === 0) return true;
          
          const result = calculateVAT(amount, rate, true, 0);
          
          // 验证: 不含税金额 = 含税金额 / (1 + 税率)
          const expected = Math.round((amount / (1 + rate)) * 100) / 100;
          expect(Math.abs(result.amountWithoutTax - expected)).toBeLessThan(0.01);
          
          // 验证: 税额 = 不含税金额 × 税率
          const expectedTax = Math.round((result.amountWithoutTax * rate) * 100) / 100;
          expect(Math.abs(result.outputTax - expectedTax)).toBeLessThan(0.02);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: finance-tax-tools, Property 9: 增值税往返一致性
   * Validates: Requirements 3.2, 3.3
   */
  it('属性 9: 增值税往返一致性', () => {
    fc.assert(
      fc.property(
        amountGen,
        vatRateGen,
        (amount, rate) => {
          if (amount === 0) return true;
          
          // 不含税 -> 含税 -> 不含税
          const step1 = calculateVAT(amount, rate, false, 0);
          const step2 = calculateVAT(step1.amountWithTax, rate, true, 0);
          
          // 验证往返后应该得到原始值（允许浮点误差）
          expect(Math.abs(step2.amountWithoutTax - amount)).toBeLessThan(0.02);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: finance-tax-tools, Property 10: 一般纳税人增值税计算正确性
   * Validates: Requirements 3.4
   */
  it('属性 10: 一般纳税人增值税计算正确性', () => {
    fc.assert(
      fc.property(
        amountGen,
        vatRateGen,
        fc.integer({ min: 0, max: 100000 }),
        (amount, rate, inputTax) => {
          const result = calculateVAT(amount, rate, false, inputTax);
          
          // 验证: 应纳税额 = 销项税额 - 进项税额
          const expected = Math.round((result.outputTax - inputTax) * 100) / 100;
          expect(Math.abs(result.payableTax - expected)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: finance-tax-tools, Property 11: 增值税税率应用正确性
   * Validates: Requirements 3.1, 3.5
   */
  it('属性 11: 增值税税率应用正确性', () => {
    fc.assert(
      fc.property(
        amountGen,
        vatRateGen,
        (amount, rate) => {
          const result = calculateVAT(amount, rate, false, 0);
          
          // 验证使用的税率正确
          expect(result.rate).toBe(rate);
          
          // 验证税额计算使用了正确的税率
          const expectedTax = Math.round((amount * rate) * 100) / 100;
          expect(Math.abs(result.outputTax - expectedTax)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('企业所得税计算属性测试', () => {
  /**
   * Feature: finance-tax-tools, Property 12: 利润总额计算正确性
   * Validates: Requirements 4.1
   */
  it('属性 12: 利润总额计算正确性', () => {
    fc.assert(
      fc.property(
        amountGen,
        amountGen,
        (revenue, costs) => {
          const result = calculateCorporateTax(revenue, costs, { increase: 0, decrease: 0 }, 'normal');
          
          // 验证: 利润总额 = 营业收入 - 营业成本
          const expected = Math.round((revenue - costs) * 100) / 100;
          expect(Math.abs(result.profit - expected)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: finance-tax-tools, Property 13: 应纳税所得额调整正确性
   * Validates: Requirements 4.2
   */
  it('属性 13: 应纳税所得额调整正确性', () => {
    fc.assert(
      fc.property(
        amountGen,
        amountGen,
        smallAmountGen,
        smallAmountGen,
        (revenue, costs, increase, decrease) => {
          const result = calculateCorporateTax(revenue, costs, { increase, decrease }, 'normal');
          
          // 验证: 应纳税所得额 = 利润总额 + 调增 - 调减
          const expected = Math.round((result.profit + increase - decrease) * 100) / 100;
          expect(Math.abs(result.taxableIncome - expected)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: finance-tax-tools, Property 14: 企业所得税税率应用正确性
   * Validates: Requirements 4.3
   */
  it('属性 14: 企业所得税税率应用正确性', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000000, max: 10000000 }),
        fc.integer({ min: 0, max: 5000000 }),
        (revenue, costs) => {
          const normalResult = calculateCorporateTax(revenue, costs, { increase: 0, decrease: 0 }, 'normal');
          const hightechResult = calculateCorporateTax(revenue, costs, { increase: 0, decrease: 0 }, 'hightech');
          
          // 验证一般企业使用25%税率
          expect(normalResult.effectiveRate).toBe(0.25);
          
          // 验证高新技术企业使用15%税率
          expect(hightechResult.effectiveRate).toBe(0.15);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: finance-tax-tools, Property 15: 小微企业优惠计算正确性
   * Validates: Requirements 4.4
   */
  it('属性 15: 小微企业优惠计算正确性', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100000, max: 3000000 }),
        fc.integer({ min: 0, max: 500000 }),
        (revenue, costs) => {
          const result = calculateCorporateTax(revenue, costs, { increase: 0, decrease: 0 }, 'small');
          
          const taxableIncome = result.taxableIncome;
          
          if (taxableIncome <= 1000000) {
            // 100万以下部分按2.5%计税（2024年政策）
            const expectedTax = Math.round((taxableIncome * 0.025) * 100) / 100;
            expect(Math.abs(result.tax - expectedTax)).toBeLessThan(0.01);
          } else if (taxableIncome <= 3000000) {
            // 100万以下2.5%，100-300万5%（2024年政策）
            const part1 = 1000000 * 0.025;
            const part2 = (taxableIncome - 1000000) * 0.05;
            const expectedTax = Math.round((part1 + part2) * 100) / 100;
            expect(Math.abs(result.tax - expectedTax)).toBeLessThan(0.01);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('房贷计算属性测试', () => {
  /**
   * Feature: finance-tax-tools, Property 16: 等额本息月供计算正确性
   * Validates: Requirements 5.1
   */
  it('属性 16: 等额本息月供计算正确性', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100000, max: 5000000 }),
        fc.double({ min: 0.02, max: 0.08, noNaN: true }),
        fc.integer({ min: 12, max: 360 }),
        (principal, rate, months) => {
          // 跳过无效的利率
          if (isNaN(rate) || rate <= 0) return true;
          
          const result = calculateMortgage(principal, rate, months, 'equal-payment');
          
          // 验证等额本息公式: 月供 = 本金 × 月利率 × (1+月利率)^期数 / ((1+月利率)^期数 - 1)
          const monthlyRate = rate / 12;
          const temp = Math.pow(1 + monthlyRate, months);
          const expected = Math.round((principal * monthlyRate * temp / (temp - 1)) * 100) / 100;
          
          expect(Math.abs(result.monthlyPayment - expected)).toBeLessThan(0.02);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: finance-tax-tools, Property 17: 等额本金月供计算正确性
   * Validates: Requirements 5.2
   */
  it('属性 17: 等额本金月供计算正确性', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100000, max: 5000000 }),
        fc.double({ min: 0.02, max: 0.08, noNaN: true }),
        fc.integer({ min: 12, max: 360 }),
        (principal, rate, months) => {
          // 跳过无效的利率
          if (isNaN(rate) || rate <= 0) return true;
          
          const result = calculateMortgage(principal, rate, months, 'equal-principal');
          
          // 验证等额本金首月月供
          const monthlyRate = rate / 12;
          const principalPerMonth = principal / months;
          const expected = Math.round((principalPerMonth + principal * monthlyRate) * 100) / 100;
          
          expect(Math.abs(result.monthlyPayment - expected)).toBeLessThan(0.02);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: finance-tax-tools, Property 18: 还款总额一致性
   * Validates: Requirements 5.3
   */
  it('属性 18: 还款总额一致性', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100000, max: 2000000 }),
        fc.double({ min: 0.02, max: 0.08, noNaN: true }),
        fc.integer({ min: 12, max: 120 }),
        fc.constantFrom('equal-payment', 'equal-principal'),
        (principal, rate, months, method) => {
          // 跳过无效的利率
          if (isNaN(rate) || rate <= 0) return true;
          
          const result = calculateMortgage(principal, rate, months, method);
          
          // 验证: 还款总额 = 本金 + 利息总额
          const expected = Math.round((principal + result.totalInterest) * 100) / 100;
          expect(Math.abs(result.totalPayment - expected)).toBeLessThan(0.02);
          
          // 验证: 还款总额 = 所有月供之和（允许更大的浮点误差）
          const sumOfPayments = result.schedule.reduce((sum, item) => sum + item.payment, 0);
          expect(Math.abs(result.totalPayment - sumOfPayments)).toBeLessThan(1.0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: finance-tax-tools, Property 19: 还款计划表完整性
   * Validates: Requirements 5.4
   */
  it('属性 19: 还款计划表完整性', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100000, max: 2000000 }),
        fc.double({ min: 0.02, max: 0.08 }),
        fc.integer({ min: 12, max: 120 }),
        fc.constantFrom('equal-payment', 'equal-principal'),
        (principal, rate, months, method) => {
          const result = calculateMortgage(principal, rate, months, method);
          
          // 验证计划表长度等于贷款期限
          expect(result.schedule.length).toBe(months);
          
          // 验证每期数据完整性
          result.schedule.forEach(item => {
            expect(item).toHaveProperty('period');
            expect(item).toHaveProperty('payment');
            expect(item).toHaveProperty('principal');
            expect(item).toHaveProperty('interest');
            expect(item).toHaveProperty('balance');
          });
          
          // 验证最后一期余额为0
          expect(result.schedule[months - 1].balance).toBeLessThan(1);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('工资个税计算属性测试', () => {
  /**
   * Feature: finance-tax-tools, Property 20: 五险一金计算正确性
   * Validates: Requirements 6.1
   */
  it('属性 20: 五险一金计算正确性', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 5000, max: 50000 }),
        (salary) => {
          const rates = {
            pension: 0.08,
            medical: 0.02,
            unemployment: 0.005,
            housingFund: 0.12
          };
          
          const result = calculateSocialInsurance(salary, rates);
          
          // 验证总额 = 各项之和
          const expected = Math.round((result.pension + result.medical + result.unemployment + result.housingFund) * 100) / 100;
          expect(Math.abs(result.total - expected)).toBeLessThan(0.01);
          
          // 验证各项计算正确
          expect(Math.abs(result.pension - salary * 0.08)).toBeLessThan(0.01);
          expect(Math.abs(result.medical - salary * 0.02)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: finance-tax-tools, Property 22: 税后工资计算正确性
   * Validates: Requirements 6.4
   */
  it('属性 22: 税后工资计算正确性', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 5000, max: 50000 }),
        fc.integer({ min: 0, max: 5000 }),
        fc.integer({ min: 0, max: 3000 }),
        (salary, socialInsurance, additional) => {
          const si = { total: socialInsurance };
          const result = calculateSalaryTax(salary, si, additional);
          
          // 验证: 税后工资 = 税前工资 - 五险一金 - 个税
          const expected = Math.round((salary - socialInsurance - result.tax) * 100) / 100;
          expect(Math.abs(result.afterTax - expected)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });
});

