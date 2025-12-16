/**
 * 页面范围解析属性测试
 * 功能: pdf-tools-suite, 属性 10: 页面范围解析正确性
 * 验证需求: 3.2
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import Utils from '../pdf-tools/shared/utils.js';

describe('属性 10: 页面范围解析正确性', () => {
  it('对于任何有效的页面范围字符串，解析结果应该包含所有指定的页码且不重复', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 100 }), // 总页数
        fc.array(
          fc.oneof(
            // 单个页码
            fc.integer({ min: 1, max: 100 }),
            // 页面范围
            fc.tuple(
              fc.integer({ min: 1, max: 100 }),
              fc.integer({ min: 1, max: 100 })
            ).map(([a, b]) => [Math.min(a, b), Math.max(a, b)])
          ),
          { minLength: 1, maxLength: 10 }
        ),
        (totalPages, ranges) => {
          // 过滤掉超出范围的页码
          const validRanges = ranges.filter(r => {
            if (Array.isArray(r)) {
              return r[0] <= totalPages && r[1] <= totalPages;
            }
            return r <= totalPages;
          });

          if (validRanges.length === 0) {
            return; // 跳过无效的测试用例
          }

          // 构建页面范围字符串
          const rangeStr = validRanges
            .map(r => Array.isArray(r) ? `${r[0]}-${r[1]}` : r.toString())
            .join(', ');

          // 解析页面范围
          const result = Utils.parsePageRange(rangeStr, totalPages);

          // 计算期望的页码集合
          const expected = new Set();
          for (const r of validRanges) {
            if (Array.isArray(r)) {
              for (let i = r[0]; i <= r[1]; i++) {
                expected.add(i);
              }
            } else {
              expected.add(r);
            }
          }

          // 验证结果
          expect(result.length).toBe(expected.size); // 无重复
          expect(new Set(result).size).toBe(result.length); // 确认无重复
          
          // 验证所有页码都在结果中
          for (const page of expected) {
            expect(result).toContain(page);
          }

          // 验证结果已排序
          for (let i = 1; i < result.length; i++) {
            expect(result[i]).toBeGreaterThan(result[i - 1]);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('对于任何包含重复页码的范围字符串，解析结果应该去重', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 50 }),
        fc.integer({ min: 1, max: 10 }),
        (totalPages, page) => {
          if (page > totalPages) return;

          // 创建包含重复的范围字符串
          const rangeStr = `${page}, ${page}, ${page}`;
          const result = Utils.parsePageRange(rangeStr, totalPages);

          // 验证只出现一次
          expect(result.filter(p => p === page).length).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });
});
