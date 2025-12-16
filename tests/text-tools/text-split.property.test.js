/**
 * 文本分割/合并工具 - 属性测试
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// 被测函数
function splitText(text, delimiter) {
  if (!text) return [];
  
  // 处理特殊分隔符
  let actualDelimiter = delimiter;
  if (delimiter === '\\n') {
    actualDelimiter = '\n';
  } else if (delimiter === '\\t') {
    actualDelimiter = '\t';
  }
  
  return text.split(actualDelimiter);
}

function joinText(text, delimiter) {
  // 按行分割输入
  const lines = text.split(/\r?\n/).filter(line => line.length > 0);
  
  // 处理特殊分隔符
  let actualDelimiter = delimiter;
  if (delimiter === '\\n') {
    actualDelimiter = '\n';
  } else if (delimiter === '\\t') {
    actualDelimiter = '\t';
  }
  
  return lines.join(actualDelimiter);
}

describe('Text Split/Join Property Tests', () => {
  /**
   * Feature: text-tools-suite, Property 11: Split/Join Round Trip
   * Validates: Requirements 4.1, 4.2
   */
  describe('Property 11: Split/Join Round Trip', () => {
    it('should preserve text through split then join with same delimiter', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(',', '|', ';', '-', '_'),
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
          (delimiter, parts) => {
            // 确保parts不包含分隔符
            const cleanParts = parts.filter(p => !p.includes(delimiter));
            if (cleanParts.length === 0) return true;
            
            const original = cleanParts.join(delimiter);
            const split = splitText(original, delimiter);
            const rejoined = split.join(delimiter);
            
            return rejoined === original;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should split then join correctly with comma delimiter', () => {
      const text = 'apple,banana,cherry';
      const delimiter = ',';
      
      const parts = splitText(text, delimiter);
      const rejoined = parts.join(delimiter);
      
      expect(rejoined).toBe(text);
      expect(parts).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should split then join correctly with pipe delimiter', () => {
      const text = 'one|two|three|four';
      const delimiter = '|';
      
      const parts = splitText(text, delimiter);
      const rejoined = parts.join(delimiter);
      
      expect(rejoined).toBe(text);
      expect(parts).toEqual(['one', 'two', 'three', 'four']);
    });

    it('should handle empty parts correctly', () => {
      const text = 'a,,b,,,c';
      const delimiter = ',';
      
      const parts = splitText(text, delimiter);
      
      // 应该保留空字符串
      expect(parts).toEqual(['a', '', 'b', '', '', 'c']);
      expect(parts.length).toBe(6);
    });

    it('should split by newline correctly', () => {
      const text = 'line1\nline2\nline3';
      const delimiter = '\n';
      
      const parts = splitText(text, delimiter);
      
      expect(parts).toEqual(['line1', 'line2', 'line3']);
    });

    it('should split by tab correctly', () => {
      const text = 'col1\tcol2\tcol3';
      const delimiter = '\t';
      
      const parts = splitText(text, delimiter);
      
      expect(parts).toEqual(['col1', 'col2', 'col3']);
    });

    it('should handle text without delimiter', () => {
      const text = 'no delimiter here';
      const delimiter = ',';
      
      const parts = splitText(text, delimiter);
      
      // 应该返回整个文本作为单个元素
      expect(parts).toEqual([text]);
      expect(parts.length).toBe(1);
    });

    it('should join lines with specified delimiter', () => {
      const text = 'line1\nline2\nline3';
      const delimiter = ',';
      
      const result = joinText(text, delimiter);
      
      expect(result).toBe('line1,line2,line3');
    });

    it('should filter empty lines when joining', () => {
      const text = 'line1\n\nline2\n\nline3';
      const delimiter = ',';
      
      const result = joinText(text, delimiter);
      
      // 空行应该被过滤掉
      expect(result).toBe('line1,line2,line3');
    });

    it('should preserve split count through operations', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(',', '|', ';'),
          fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 10 }),
          (delimiter, parts) => {
            // 确保parts不包含分隔符
            const cleanParts = parts.filter(p => !p.includes(delimiter) && p.length > 0);
            if (cleanParts.length === 0) return true;
            
            const text = cleanParts.join(delimiter);
            const split = splitText(text, delimiter);
            
            return split.length === cleanParts.length;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
