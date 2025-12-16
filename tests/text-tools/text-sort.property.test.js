/**
 * 文本排序工具 - 属性测试
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// 被测函数
function sortAlpha(lines, desc = false) {
  return [...lines].sort((a, b) => {
    const cmp = a.localeCompare(b, 'zh-CN');
    return desc ? -cmp : cmp;
  });
}

function sortNumeric(lines, desc = false) {
  return [...lines].sort((a, b) => {
    const numA = parseFloat(a) || 0;
    const numB = parseFloat(b) || 0;
    return desc ? numB - numA : numA - numB;
  });
}

function sortByLength(lines, desc = false) {
  return [...lines].sort((a, b) => {
    return desc ? b.length - a.length : a.length - b.length;
  });
}

describe('Text Sorting Property Tests', () => {
  /**
   * Feature: text-tools-suite, Property 4: Alphabetical Sort Ordering
   * Validates: Requirements 2.1
   */
  describe('Property 4: Alphabetical Sort Ordering', () => {
    it('should have adjacent pairs in correct order (ascending)', () => {
      fc.assert(
        fc.property(fc.array(fc.string({ maxLength: 10 }), { minLength: 0, maxLength: 10 }), (lines) => {
          const sorted = sortAlpha(lines, false);
          
          for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i].localeCompare(sorted[i + 1], 'zh-CN') > 0) {
              return false;
            }
          }
          return true;
        })
      );
    });

    it('should have adjacent pairs in correct order (descending)', () => {
      fc.assert(
        fc.property(fc.array(fc.string({ maxLength: 10 }), { minLength: 0, maxLength: 10 }), (lines) => {
          const sorted = sortAlpha(lines, true);
          
          for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i].localeCompare(sorted[i + 1], 'zh-CN') < 0) {
              return false;
            }
          }
          return true;
        })
      );
    });
  });

  /**
   * Feature: text-tools-suite, Property 5: Numeric Sort Ordering
   * Validates: Requirements 2.2
   */
  describe('Property 5: Numeric Sort Ordering', () => {
    it('should have adjacent pairs in numeric order (ascending)', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -1000, max: 1000 }).map(String), { minLength: 0, maxLength: 10 }),
          (lines) => {
            const sorted = sortNumeric(lines, false);
            
            for (let i = 0; i < sorted.length - 1; i++) {
              const numA = parseFloat(sorted[i]) || 0;
              const numB = parseFloat(sorted[i + 1]) || 0;
              if (numA > numB) {
                return false;
              }
            }
            return true;
          }
        )
      );
    });

    it('should have adjacent pairs in numeric order (descending)', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -1000, max: 1000 }).map(String), { minLength: 0, maxLength: 10 }),
          (lines) => {
            const sorted = sortNumeric(lines, true);
            
            for (let i = 0; i < sorted.length - 1; i++) {
              const numA = parseFloat(sorted[i]) || 0;
              const numB = parseFloat(sorted[i + 1]) || 0;
              if (numA < numB) {
                return false;
              }
            }
            return true;
          }
        )
      );
    });
  });

  /**
   * Feature: text-tools-suite, Property 6: Length Sort Ordering
   * Validates: Requirements 2.3
   */
  describe('Property 6: Length Sort Ordering', () => {
    it('should have adjacent pairs in length order (ascending)', () => {
      fc.assert(
        fc.property(fc.array(fc.string({ maxLength: 10 }), { minLength: 0, maxLength: 10 }), (lines) => {
          const sorted = sortByLength(lines, false);
          
          for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i].length > sorted[i + 1].length) {
              return false;
            }
          }
          return true;
        })
      );
    });

    it('should have adjacent pairs in length order (descending)', () => {
      fc.assert(
        fc.property(fc.array(fc.string({ maxLength: 10 }), { minLength: 0, maxLength: 10 }), (lines) => {
          const sorted = sortByLength(lines, true);
          
          for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i].length < sorted[i + 1].length) {
              return false;
            }
          }
          return true;
        })
      );
    });
  });

  /**
   * Feature: text-tools-suite, Property 7: Sort Direction Reversal
   * Validates: Requirements 2.4
   */
  describe('Property 7: Sort Direction Reversal', () => {
    it('descending should be reverse of ascending for alpha sort', () => {
      fc.assert(
        fc.property(fc.array(fc.string({ maxLength: 10 }), { minLength: 0, maxLength: 10 }), (lines) => {
          const asc = sortAlpha(lines, false);
          const desc = sortAlpha(lines, true);
          
          return JSON.stringify(asc) === JSON.stringify([...desc].reverse());
        })
      );
    });

    it('descending should be reverse of ascending for length sort', () => {
      fc.assert(
        fc.property(fc.array(fc.string({ maxLength: 10 }), { minLength: 0, maxLength: 10 }), (lines) => {
          const asc = sortByLength(lines, false);
          const desc = sortByLength(lines, true);
          
          // 对于长度排序，由于稳定性问题，只检查长度顺序是否相反
          const ascLengths = asc.map(s => s.length);
          const descLengths = desc.map(s => s.length);
          
          return JSON.stringify(ascLengths) === JSON.stringify([...descLengths].reverse());
        })
      );
    });
  });
});
