/**
 * 文本统计工具 - 属性测试
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// 被测函数
function calculateStats(text) {
  if (!text) {
    return {
      charCount: 0,
      charCountNoSpace: 0,
      wordCount: 0,
      sentenceCount: 0,
      lineCount: 0,
      charFrequency: new Map()
    };
  }

  // 字符数
  const charCount = text.length;
  const charCountNoSpace = text.replace(/\s/g, '').length;

  // 单词数
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // 句子数（基于句号、问号、感叹号）
  const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // 行数
  const lines = text.split(/\r?\n/);
  const lineCount = lines.length;

  // 字符频率
  const charFrequency = getCharFrequency(text);

  return {
    charCount,
    charCountNoSpace,
    wordCount,
    sentenceCount,
    lineCount,
    charFrequency
  };
}

function getCharFrequency(text) {
  const frequency = new Map();
  
  for (const char of text) {
    frequency.set(char, (frequency.get(char) || 0) + 1);
  }
  
  return frequency;
}

describe('Text Statistics Property Tests', () => {
  /**
   * Feature: text-tools-suite, Property 15: Character Frequency Sum
   * Validates: Requirements 6.1, 6.5
   */
  describe('Property 15: Character Frequency Sum', () => {
    it('should have frequency sum equal to total character count', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 100 }),
          (text) => {
            const stats = calculateStats(text);
            
            // 计算频率总和
            let frequencySum = 0;
            for (const count of stats.charFrequency.values()) {
              frequencySum += count;
            }
            
            return frequencySum === stats.charCount;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should count each character correctly', () => {
      const text = 'aabbcc';
      const stats = calculateStats(text);
      
      expect(stats.charFrequency.get('a')).toBe(2);
      expect(stats.charFrequency.get('b')).toBe(2);
      expect(stats.charFrequency.get('c')).toBe(2);
    });

    it('should handle empty string', () => {
      const stats = calculateStats('');
      
      expect(stats.charCount).toBe(0);
      expect(stats.charFrequency.size).toBe(0);
    });
  });

  /**
   * Feature: text-tools-suite, Property 16: Word Count Consistency
   * Validates: Requirements 6.2
   */
  describe('Property 16: Word Count Consistency', () => {
    it('should count words separated by whitespace', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 20 }),
          (words) => {
            const text = words.join(' ');
            const stats = calculateStats(text);
            
            // 手动计数验证
            const manualCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
            
            return stats.wordCount === manualCount;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should count words correctly in simple text', () => {
      const text = 'hello world test';
      const stats = calculateStats(text);
      
      expect(stats.wordCount).toBe(3);
    });

    it('should handle multiple spaces between words', () => {
      const text = 'hello    world     test';
      const stats = calculateStats(text);
      
      expect(stats.wordCount).toBe(3);
    });

    it('should handle leading and trailing spaces', () => {
      const text = '   hello world   ';
      const stats = calculateStats(text);
      
      expect(stats.wordCount).toBe(2);
    });

    it('should return zero for empty or whitespace-only text', () => {
      expect(calculateStats('').wordCount).toBe(0);
      expect(calculateStats('   ').wordCount).toBe(0);
      expect(calculateStats('\n\n').wordCount).toBe(0);
    });
  });

  /**
   * Feature: text-tools-suite, Property 17: Line Count Accuracy
   * Validates: Requirements 6.4
   */
  describe('Property 17: Line Count Accuracy', () => {
    it('should count lines correctly', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 0, maxLength: 20 }), { minLength: 1, maxLength: 20 }),
          (lines) => {
            const text = lines.join('\n');
            const stats = calculateStats(text);
            
            return stats.lineCount === lines.length;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should count single line correctly', () => {
      const text = 'single line';
      const stats = calculateStats(text);
      
      expect(stats.lineCount).toBe(1);
    });

    it('should count multiple lines correctly', () => {
      const text = 'line1\nline2\nline3';
      const stats = calculateStats(text);
      
      expect(stats.lineCount).toBe(3);
    });

    it('should count empty lines', () => {
      const text = 'line1\n\nline3';
      const stats = calculateStats(text);
      
      expect(stats.lineCount).toBe(3);
    });

    it('should handle text ending with newline', () => {
      const text = 'line1\nline2\n';
      const stats = calculateStats(text);
      
      // split会在末尾换行符后产生一个空字符串
      expect(stats.lineCount).toBe(3);
    });
  });

  describe('Additional Statistics Tests', () => {
    it('should count characters with and without spaces correctly', () => {
      const text = 'hello world';
      const stats = calculateStats(text);
      
      expect(stats.charCount).toBe(11); // 包含空格
      expect(stats.charCountNoSpace).toBe(10); // 不包含空格
    });

    it('should count sentences correctly', () => {
      const text = 'First sentence. Second sentence! Third sentence?';
      const stats = calculateStats(text);
      
      expect(stats.sentenceCount).toBe(3);
    });

    it('should handle Chinese punctuation', () => {
      const text = '第一句。第二句！第三句？';
      const stats = calculateStats(text);
      
      expect(stats.sentenceCount).toBe(3);
    });

    it('should handle mixed punctuation', () => {
      const text = 'English. 中文。Mixed!';
      const stats = calculateStats(text);
      
      expect(stats.sentenceCount).toBe(3);
    });

    it('should return all zero stats for empty input', () => {
      const stats = calculateStats('');
      
      expect(stats.charCount).toBe(0);
      expect(stats.charCountNoSpace).toBe(0);
      expect(stats.wordCount).toBe(0);
      expect(stats.sentenceCount).toBe(0);
      expect(stats.lineCount).toBe(0);
      expect(stats.charFrequency.size).toBe(0);
    });
  });
});
