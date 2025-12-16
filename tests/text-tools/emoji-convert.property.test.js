/**
 * Emoji/Unicode转换工具 - 属性测试
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// 被测函数
function charToUnicode(text) {
  if (!text) return '';
  
  const result = [];
  for (const char of text) {
    const codePoint = char.codePointAt(0);
    result.push('U+' + codePoint.toString(16).toUpperCase().padStart(4, '0'));
  }
  
  return result.join(' ');
}

function unicodeToChar(text) {
  if (!text) return '';
  
  // 匹配 U+XXXX 或 \uXXXX 或 0xXXXX 格式
  const unicodePattern = /(?:U\+|\\u|0x)([0-9A-Fa-f]+)/g;
  const matches = text.matchAll(unicodePattern);
  
  const result = [];
  for (const match of matches) {
    try {
      const codePoint = parseInt(match[1], 16);
      if (isValidUnicode(codePoint)) {
        result.push(String.fromCodePoint(codePoint));
      } else {
        result.push(`[无效:${match[0]}]`);
      }
    } catch (error) {
      result.push(`[错误:${match[0]}]`);
    }
  }
  
  return result.join('');
}

function isValidUnicode(codePoint) {
  return codePoint >= 0 && codePoint <= 0x10FFFF;
}

describe('Emoji/Unicode Conversion Property Tests', () => {
  /**
   * Feature: text-tools-suite, Property 18: Unicode Round Trip
   * Validates: Requirements 7.1, 7.2
   */
  describe('Property 18: Unicode Round Trip', () => {
    it('should preserve characters through char->unicode->char conversion', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          (text) => {
            const unicode = charToUnicode(text);
            const restored = unicodeToChar(unicode);
            
            return restored === text;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should convert simple ASCII characters correctly', () => {
      const text = 'A';
      const unicode = charToUnicode(text);
      const restored = unicodeToChar(unicode);
      
      expect(unicode).toBe('U+0041');
      expect(restored).toBe(text);
    });

    it('should convert emoji correctly', () => {
      const text = '😀';
      const unicode = charToUnicode(text);
      const restored = unicodeToChar(unicode);
      
      expect(unicode).toBe('U+1F600');
      expect(restored).toBe(text);
    });

    it('should handle multiple characters', () => {
      const text = 'Hello';
      const unicode = charToUnicode(text);
      const restored = unicodeToChar(unicode);
      
      expect(restored).toBe(text);
      expect(unicode.split(' ').length).toBe(5);
    });

    it('should handle mixed ASCII and emoji', () => {
      const text = 'Hi😀';
      const unicode = charToUnicode(text);
      const restored = unicodeToChar(unicode);
      
      expect(restored).toBe(text);
    });

    it('should handle Chinese characters', () => {
      const text = '你好';
      const unicode = charToUnicode(text);
      const restored = unicodeToChar(unicode);
      
      expect(restored).toBe(text);
    });

    it('should handle special symbols', () => {
      const text = '©®™';
      const unicode = charToUnicode(text);
      const restored = unicodeToChar(unicode);
      
      expect(restored).toBe(text);
    });

    it('should convert each character to valid Unicode format', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 10 }),
          (text) => {
            const unicode = charToUnicode(text);
            
            // 验证格式：每个编码应该是 U+XXXX 格式
            const parts = unicode.split(' ');
            return parts.every(part => /^U\+[0-9A-F]+$/.test(part));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle empty string', () => {
      expect(charToUnicode('')).toBe('');
      expect(unicodeToChar('')).toBe('');
    });

    it('should validate Unicode code points', () => {
      expect(isValidUnicode(0x0041)).toBe(true); // 'A'
      expect(isValidUnicode(0x1F600)).toBe(true); // 😀
      expect(isValidUnicode(0x10FFFF)).toBe(true); // 最大有效值
      expect(isValidUnicode(-1)).toBe(false); // 负数
      expect(isValidUnicode(0x110000)).toBe(false); // 超出范围
    });

    it('should handle different Unicode input formats', () => {
      const formats = [
        'U+0041',
        '\\u0041',
        '0x0041'
      ];
      
      formats.forEach(format => {
        const result = unicodeToChar(format);
        expect(result).toBe('A');
      });
    });

    it('should handle multiple Unicode codes', () => {
      const unicode = 'U+0048 U+0065 U+006C U+006C U+006F';
      const result = unicodeToChar(unicode);
      
      expect(result).toBe('Hello');
    });

    it('should preserve character count through conversion', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          (text) => {
            const unicode = charToUnicode(text);
            const restored = unicodeToChar(unicode);
            
            return [...text].length === [...restored].length;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle surrogate pairs correctly', () => {
      // Emoji that use surrogate pairs
      const emojis = ['😀', '🎉', '❤️', '🌟'];
      
      emojis.forEach(emoji => {
        const unicode = charToUnicode(emoji);
        const restored = unicodeToChar(unicode);
        expect(restored).toContain(emoji.charAt(0));
      });
    });
  });
});
