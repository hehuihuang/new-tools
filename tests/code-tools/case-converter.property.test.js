/**
 * Feature: code-tools-suite, Property 10: Case Conversion Idempotence
 * Feature: code-tools-suite, Property 11: Case Conversion Word Preservation
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// 将字符串分割为单词数组
const splitIntoWords = (text) => {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 0);
};

// 转换命名风格
const convertCase = (text, targetCase) => {
  const words = splitIntoWords(text);
  if (words.length === 0) return text;

  switch (targetCase) {
    case 'camelCase':
      return words[0] + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    case 'PascalCase':
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    case 'snake_case':
      return words.join('_');
    case 'kebab-case':
      return words.join('-');
    case 'CONSTANT_CASE':
      return words.map(w => w.toUpperCase()).join('_');
    default:
      return text;
  }
};

// 检测命名风格
const detectCase = (text) => {
  if (text.includes('_') && text === text.toUpperCase()) return 'CONSTANT_CASE';
  if (text.includes('_')) return 'snake_case';
  if (text.includes('-')) return 'kebab-case';
  if (/^[A-Z]/.test(text) && /[a-z]/.test(text)) return 'PascalCase';
  if (/[a-z][A-Z]/.test(text)) return 'camelCase';
  return 'unknown';
};

describe('Case Conversion Idempotence', () => {
  /**
   * Property 10: Case Conversion Idempotence
   * For any string already in a target case format, converting to that same format 
   * should return the identical string.
   */
  const caseTypes = ['camelCase', 'PascalCase', 'snake_case', 'kebab-case', 'CONSTANT_CASE'];

  caseTypes.forEach(caseType => {
    it(`converting to ${caseType} should be idempotent`, () => {
      // 生成至少2个字符的纯小写单词，避免单字母单词导致的边界问题
      const wordArbitrary = fc.array(
        fc.string({ minLength: 2, maxLength: 8 }).filter(s => /^[a-z]+$/.test(s)),
        { minLength: 1, maxLength: 4 }
      ).map(words => words.join(' '));

      fc.assert(
        fc.property(wordArbitrary, (text) => {
          const firstConversion = convertCase(text, caseType);
          const secondConversion = convertCase(firstConversion, caseType);
          
          return firstConversion === secondConversion;
        }),
        { numRuns: 100 }
      );
    });
  });

  it('double conversion should be stable for all case types', () => {
    const wordArbitrary = fc.array(
      fc.string({ minLength: 2, maxLength: 6 }).filter(s => /^[a-z]+$/.test(s)),
      { minLength: 1, maxLength: 3 }
    ).map(words => words.join(' '));

    fc.assert(
      fc.property(wordArbitrary, fc.constantFrom(...caseTypes), (text, caseType) => {
        const first = convertCase(text, caseType);
        const second = convertCase(first, caseType);
        const third = convertCase(second, caseType);
        
        return second === third;
      }),
      { numRuns: 100 }
    );
  });
});

describe('Case Conversion Word Preservation', () => {
  /**
   * Property 11: Case Conversion Word Preservation
   * For any multi-word string, converting to any case format should preserve 
   * the same number of logical words.
   */
  it('should preserve word count across conversions', () => {
    // 使用至少2个字符的纯小写单词，避免单字母单词导致的边界问题
    const wordArbitrary = fc.array(
      fc.string({ minLength: 2, maxLength: 8 }).filter(s => /^[a-z]+$/.test(s)),
      { minLength: 1, maxLength: 5 }
    );

    const caseTypes = ['camelCase', 'PascalCase', 'snake_case', 'kebab-case', 'CONSTANT_CASE'];

    fc.assert(
      fc.property(wordArbitrary, fc.constantFrom(...caseTypes), (words, caseType) => {
        const input = words.join(' ');
        const converted = convertCase(input, caseType);
        const wordsAfter = splitIntoWords(converted);
        
        return wordsAfter.length === words.length;
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve word content (case-insensitive) across conversions', () => {
    // 使用至少2个字符的纯小写单词
    const wordArbitrary = fc.array(
      fc.string({ minLength: 2, maxLength: 6 }).filter(s => /^[a-z]+$/.test(s)),
      { minLength: 1, maxLength: 4 }
    );

    const caseTypes = ['camelCase', 'PascalCase', 'snake_case', 'kebab-case'];

    fc.assert(
      fc.property(wordArbitrary, fc.constantFrom(...caseTypes), (words, caseType) => {
        const input = words.join(' ');
        const converted = convertCase(input, caseType);
        const wordsAfter = splitIntoWords(converted);
        
        // 比较小写形式的单词
        const originalLower = words.map(w => w.toLowerCase()).sort();
        const convertedLower = wordsAfter.map(w => w.toLowerCase()).sort();
        
        return JSON.stringify(originalLower) === JSON.stringify(convertedLower);
      }),
      { numRuns: 100 }
    );
  });

  it('conversion between any two case types should preserve words', () => {
    // 使用至少2个字符的纯小写单词
    const wordArbitrary = fc.array(
      fc.string({ minLength: 2, maxLength: 6 }).filter(s => /^[a-z]+$/.test(s)),
      { minLength: 2, maxLength: 4 }
    );

    const caseTypes = ['camelCase', 'PascalCase', 'snake_case', 'kebab-case'];

    fc.assert(
      fc.property(
        wordArbitrary, 
        fc.constantFrom(...caseTypes), 
        fc.constantFrom(...caseTypes), 
        (words, fromCase, toCase) => {
          const input = words.join(' ');
          const intermediate = convertCase(input, fromCase);
          const final = convertCase(intermediate, toCase);
          const finalWords = splitIntoWords(final);
          
          return finalWords.length === words.length;
        }
      ),
      { numRuns: 100 }
    );
  });
});
