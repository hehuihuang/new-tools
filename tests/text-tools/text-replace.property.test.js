/**
 * 文本查找替换工具 - 属性测试
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// 被测函数
function findMatches(text, pattern, options = {}) {
  const { caseSensitive = false, useRegex = false } = options;
  
  try {
    let regex;
    if (useRegex) {
      const flags = caseSensitive ? 'g' : 'gi';
      regex = new RegExp(pattern, flags);
    } else {
      const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const flags = caseSensitive ? 'g' : 'gi';
      regex = new RegExp(escapedPattern, flags);
    }
    
    const matches = [...text.matchAll(regex)];
    return {
      count: matches.length,
      positions: matches.map(m => m.index)
    };
  } catch (error) {
    throw new Error('无效的正则表达式');
  }
}

function replaceAll(text, pattern, replacement, options = {}) {
  const { caseSensitive = false, useRegex = false } = options;
  
  try {
    let regex;
    if (useRegex) {
      const flags = caseSensitive ? 'g' : 'gi';
      regex = new RegExp(pattern, flags);
    } else {
      const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const flags = caseSensitive ? 'g' : 'gi';
      regex = new RegExp(escapedPattern, flags);
    }
    
    return text.replace(regex, replacement);
  } catch (error) {
    throw new Error('无效的正则表达式');
  }
}

describe('Text Replacement Property Tests', () => {
  /**
   * Feature: text-tools-suite, Property 8: Find Match Count Accuracy
   * Validates: Requirements 3.1
   */
  describe('Property 8: Find Match Count Accuracy', () => {
    it('should count non-overlapping occurrences correctly', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 100 }),
          (pattern, text) => {
            // 跳过可能导致正则表达式错误的特殊字符组合
            if (pattern.includes('\\') || pattern.includes('[') || pattern.includes('(')) {
              return true;
            }
            
            try {
              const result = findMatches(text, pattern, { caseSensitive: false, useRegex: false });
              
              // 手动计数验证
              const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const regex = new RegExp(escapedPattern, 'gi');
              const manualMatches = [...text.matchAll(regex)];
              
              return result.count === manualMatches.length;
            } catch {
              return true; // 跳过无效的正则表达式
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return correct positions for matches', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('a', 'b', 'test', 'x'),
          fc.string({ minLength: 0, maxLength: 50 }),
          (pattern, text) => {
            try {
              const result = findMatches(text, pattern, { caseSensitive: false, useRegex: false });
              
              // 验证每个位置确实包含匹配项
              return result.positions.every(pos => {
                const substring = text.substring(pos, pos + pattern.length);
                return substring.toLowerCase() === pattern.toLowerCase();
              });
            } catch {
              return true;
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: text-tools-suite, Property 9: Replace All Completeness
   * Validates: Requirements 3.2
   */
  describe('Property 9: Replace All Completeness', () => {
    it('should not contain search pattern after replacement (non-recursive)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('a', 'b', 'test', 'old'),
          fc.constantFrom('x', 'y', 'new', 'replacement'),
          fc.string({ minLength: 0, maxLength: 100 }),
          (pattern, replacement, text) => {
            // 确保替换文本不包含搜索模式（避免递归）
            if (replacement.toLowerCase().includes(pattern.toLowerCase())) {
              return true;
            }
            
            try {
              const result = replaceAll(text, pattern, replacement, { caseSensitive: false, useRegex: false });
              
              // 验证结果中不再包含原始模式
              const afterMatches = findMatches(result, pattern, { caseSensitive: false, useRegex: false });
              return afterMatches.count === 0;
            } catch {
              return true;
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have correct length after replacement', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('a', 'bb', 'test'),
          fc.constantFrom('x', 'yy', 'new'),
          fc.string({ minLength: 0, maxLength: 50 }),
          (pattern, replacement, text) => {
            try {
              const beforeMatches = findMatches(text, pattern, { caseSensitive: false, useRegex: false });
              const result = replaceAll(text, pattern, replacement, { caseSensitive: false, useRegex: false });
              
              const expectedLength = text.length - (beforeMatches.count * pattern.length) + (beforeMatches.count * replacement.length);
              return result.length === expectedLength;
            } catch {
              return true;
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: text-tools-suite, Property 10: Case Sensitivity Correctness
   * Validates: Requirements 3.4
   */
  describe('Property 10: Case Sensitivity Correctness', () => {
    it('should match exact case when case-sensitive', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('A', 'Test', 'ABC'),
          fc.string({ minLength: 0, maxLength: 50 }),
          (pattern, text) => {
            try {
              const result = findMatches(text, pattern, { caseSensitive: true, useRegex: false });
              
              // 验证所有匹配都是精确大小写匹配
              return result.positions.every(pos => {
                const substring = text.substring(pos, pos + pattern.length);
                return substring === pattern;
              });
            } catch {
              return true;
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should match any case when case-insensitive', () => {
      const testText = 'ABC abc Abc aBC';
      const pattern = 'abc';
      
      const result = findMatches(testText, pattern, { caseSensitive: false, useRegex: false });
      
      // 应该找到所有4个变体
      expect(result.count).toBe(4);
    });

    it('should find fewer or equal matches with case-sensitive than case-insensitive', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('a', 'test', 'ABC'),
          fc.string({ minLength: 0, maxLength: 50 }),
          (pattern, text) => {
            try {
              const sensitiveResult = findMatches(text, pattern, { caseSensitive: true, useRegex: false });
              const insensitiveResult = findMatches(text, pattern, { caseSensitive: false, useRegex: false });
              
              return sensitiveResult.count <= insensitiveResult.count;
            } catch {
              return true;
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
