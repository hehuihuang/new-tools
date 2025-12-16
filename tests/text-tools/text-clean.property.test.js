/**
 * 文本清理工具 - 属性测试
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// 被测函数
function trimLines(text) {
  return text.split(/\r?\n/).map(line => line.trim()).join('\n');
}

function collapseSpaces(text) {
  return text.replace(/ {2,}/g, ' ');
}

function removeSpecialChars(text) {
  // 保留字母、数字、中文、常用标点和空白字符
  return text.replace(/[^\w\s\u4e00-\u9fa5.,!?;:'"()\-]/g, '');
}

function stripHtmlTags(text) {
  return text.replace(/<[^>]+>/g, '');
}

describe('Text Cleaning Property Tests', () => {
  /**
   * Feature: text-tools-suite, Property 12: Trim Completeness
   * Validates: Requirements 5.1
   */
  describe('Property 12: Trim Completeness', () => {
    it('should have no leading whitespace on any line', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 0, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
          (lines) => {
            const input = lines.join('\n');
            const result = trimLines(input);
            const resultLines = result.split('\n');
            
            // 检查每行开头没有空白字符
            return resultLines.every(line => {
              if (line.length === 0) return true;
              return !/^\s/.test(line);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have no trailing whitespace on any line', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 0, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
          (lines) => {
            const input = lines.join('\n');
            const result = trimLines(input);
            const resultLines = result.split('\n');
            
            // 检查每行结尾没有空白字符
            return resultLines.every(line => {
              if (line.length === 0) return true;
              return !/\s$/.test(line);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should trim leading spaces correctly', () => {
      const input = '   hello\n  world\n test';
      const result = trimLines(input);
      const lines = result.split('\n');
      
      expect(lines[0]).toBe('hello');
      expect(lines[1]).toBe('world');
      expect(lines[2]).toBe('test');
    });

    it('should trim trailing spaces correctly', () => {
      const input = 'hello   \nworld  \ntest ';
      const result = trimLines(input);
      const lines = result.split('\n');
      
      expect(lines[0]).toBe('hello');
      expect(lines[1]).toBe('world');
      expect(lines[2]).toBe('test');
    });
  });

  /**
   * Feature: text-tools-suite, Property 13: Space Collapse Correctness
   * Validates: Requirements 5.2
   */
  describe('Property 13: Space Collapse Correctness', () => {
    it('should have no consecutive spaces in output', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 100 }),
          (text) => {
            const result = collapseSpaces(text);
            
            // 检查结果中没有连续的空格
            return !/ {2,}/.test(result);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should collapse multiple spaces to single space', () => {
      const input = 'hello    world  test   end';
      const result = collapseSpaces(input);
      
      expect(result).toBe('hello world test end');
    });

    it('should preserve single spaces', () => {
      const input = 'hello world test';
      const result = collapseSpaces(input);
      
      expect(result).toBe(input);
    });

    it('should handle text with many consecutive spaces', () => {
      const input = 'a     b          c';
      const result = collapseSpaces(input);
      
      expect(result).toBe('a b c');
      expect(result.split(' ').length).toBe(3);
    });
  });

  /**
   * Feature: text-tools-suite, Property 14: HTML Tag Removal
   * Validates: Requirements 5.4
   */
  describe('Property 14: HTML Tag Removal', () => {
    it('should have no HTML tags in output', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 100 }),
          (text) => {
            const result = stripHtmlTags(text);
            
            // 检查结果中没有HTML标签
            return !/<[^>]+>/.test(result);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should remove simple HTML tags', () => {
      const input = '<div>Hello</div><p>World</p>';
      const result = stripHtmlTags(input);
      
      expect(result).toBe('HelloWorld');
    });

    it('should preserve text content between tags', () => {
      const input = '<h1>Title</h1><p>Content here</p>';
      const result = stripHtmlTags(input);
      
      expect(result).toBe('TitleContent here');
      expect(result).toContain('Title');
      expect(result).toContain('Content here');
    });

    it('should remove tags with attributes', () => {
      const input = '<div class="test" id="main">Content</div>';
      const result = stripHtmlTags(input);
      
      expect(result).toBe('Content');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should remove self-closing tags', () => {
      const input = 'Text<br/>More<img src="test.jpg"/>End';
      const result = stripHtmlTags(input);
      
      expect(result).toBe('TextMoreEnd');
    });

    it('should handle nested tags', () => {
      const input = '<div><span><b>Bold</b> text</span></div>';
      const result = stripHtmlTags(input);
      
      expect(result).toBe('Bold text');
    });

    it('should handle text without tags', () => {
      const input = 'Plain text without any tags';
      const result = stripHtmlTags(input);
      
      expect(result).toBe(input);
    });
  });

  describe('Additional Edge Cases', () => {
    it('should handle empty input', () => {
      expect(trimLines('')).toBe('');
      expect(collapseSpaces('')).toBe('');
      expect(stripHtmlTags('')).toBe('');
    });

    it('should handle whitespace-only input', () => {
      expect(trimLines('   \n   \n   ').split('\n').every(l => l === '')).toBe(true);
      expect(collapseSpaces('     ')).toBe(' ');
    });
  });
});
