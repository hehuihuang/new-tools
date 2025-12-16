/**
 * 文本去重工具 - 属性测试
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// 模拟工具函数
function splitLines(text) {
  if (!text) return [];
  return text.split(/\r?\n/);
}

function joinLines(lines, separator = '\n') {
  return lines.join(separator);
}

// 被测函数
function dedupLines(text) {
  const lines = splitLines(text);
  const seen = new Set();
  const result = [];
  
  for (const line of lines) {
    if (!seen.has(line)) {
      seen.add(line);
      result.push(line);
    }
  }
  
  return {
    result: joinLines(result),
    original: lines.length,
    removed: lines.length - result.length
  };
}

function removeEmptyLines(text) {
  const lines = splitLines(text);
  const result = lines.filter(line => line.trim().length > 0);
  
  return {
    result: joinLines(result),
    original: lines.length,
    removed: lines.length - result.length
  };
}

function dedupWords(text) {
  const lines = splitLines(text);
  let totalOriginal = 0;
  let totalRemoved = 0;
  
  const result = lines.map(line => {
    const words = line.split(/\s+/).filter(w => w.length > 0);
    totalOriginal += words.length;
    
    const seen = new Set();
    const uniqueWords = [];
    
    for (const word of words) {
      if (!seen.has(word)) {
        seen.add(word);
        uniqueWords.push(word);
      }
    }
    
    totalRemoved += words.length - uniqueWords.length;
    return uniqueWords.join(' ');
  });
  
  return {
    result: joinLines(result),
    original: totalOriginal,
    removed: totalRemoved
  };
}

describe('Text Deduplication Property Tests', () => {
  /**
   * Feature: text-tools-suite, Property 1: Line Deduplication Preserves Order and Uniqueness
   * Validates: Requirements 1.1
   */
  describe('Property 1: Line Deduplication Preserves Order and Uniqueness', () => {
    it('should have no duplicate lines in output', () => {
      fc.assert(
        fc.property(fc.array(fc.string(), { minLength: 0, maxLength: 20 }), (lines) => {
          const input = lines.join('\n');
          const { result } = dedupLines(input);
          const outputLines = splitLines(result);
          
          // 检查输出中没有重复行
          const uniqueOutput = new Set(outputLines);
          return uniqueOutput.size === outputLines.length;
        })
      );
    });

    it('should preserve first occurrence order', () => {
      fc.assert(
        fc.property(fc.array(fc.string(), { minLength: 1, maxLength: 20 }), (lines) => {
          const input = lines.join('\n');
          const { result } = dedupLines(input);
          const outputLines = result ? splitLines(result) : [];
          
          // 检查输出顺序与首次出现顺序一致
          const firstOccurrences = [];
          const seen = new Set();
          for (const line of lines) {
            if (!seen.has(line)) {
              seen.add(line);
              firstOccurrences.push(line);
            }
          }
          
          // 处理空输入情况
          if (input === '' && result === '') return true;
          
          return JSON.stringify(outputLines) === JSON.stringify(firstOccurrences);
        })
      );
    });

    it('should only contain lines from input', () => {
      fc.assert(
        fc.property(fc.array(fc.string(), { minLength: 0, maxLength: 20 }), (lines) => {
          const input = lines.join('\n');
          const { result } = dedupLines(input);
          const outputLines = splitLines(result);
          const inputSet = new Set(lines);
          
          // 检查输出中的每一行都来自输入
          return outputLines.every(line => inputSet.has(line));
        })
      );
    });
  });

  /**
   * Feature: text-tools-suite, Property 2: Empty Line Removal Completeness
   * Validates: Requirements 1.2
   */
  describe('Property 2: Empty Line Removal Completeness', () => {
    it('should have no empty or whitespace-only lines in output', () => {
      fc.assert(
        fc.property(fc.array(fc.string(), { minLength: 0, maxLength: 20 }), (lines) => {
          const input = lines.join('\n');
          const { result } = removeEmptyLines(input);
          const outputLines = splitLines(result);
          
          // 检查输出中没有空行或仅含空白的行
          return outputLines.every(line => line.trim().length > 0);
        })
      );
    });

    it('should preserve all non-empty lines from input', () => {
      fc.assert(
        fc.property(fc.array(fc.string(), { minLength: 0, maxLength: 20 }), (lines) => {
          const input = lines.join('\n');
          const { result } = removeEmptyLines(input);
          const outputLines = splitLines(result);
          
          // 获取输入中的非空行
          const nonEmptyInput = lines.filter(line => line.trim().length > 0);
          
          // 检查输出包含所有非空输入行
          return JSON.stringify(outputLines) === JSON.stringify(nonEmptyInput);
        })
      );
    });
  });

  /**
   * Feature: text-tools-suite, Property 3: Word Deduplication Within Lines
   * Validates: Requirements 1.3
   */
  describe('Property 3: Word Deduplication Within Lines', () => {
    it('should have no duplicate words within each line', () => {
      fc.assert(
        fc.property(
          fc.array(fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 0, maxLength: 10 }), { minLength: 1, maxLength: 5 }),
          (wordArrays) => {
            const lines = wordArrays.map(words => words.join(' '));
            const input = lines.join('\n');
            const { result } = dedupWords(input);
            const outputLines = splitLines(result);
            
            // 检查每行中没有重复词
            return outputLines.every(line => {
              const words = line.split(/\s+/).filter(w => w.length > 0);
              const uniqueWords = new Set(words);
              return uniqueWords.size === words.length;
            });
          }
        )
      );
    });

    it('should preserve first occurrence order of words', () => {
      // 生成不含空白字符的单词
      const wordArb = fc.stringOf(fc.char().filter(c => !/\s/.test(c)), { minLength: 1, maxLength: 10 });
      
      fc.assert(
        fc.property(
          fc.array(wordArb, { minLength: 1, maxLength: 10 }),
          (words) => {
            const input = words.join(' ');
            const { result } = dedupWords(input);
            const outputWords = result.split(/\s+/).filter(w => w.length > 0);
            
            // 计算预期的首次出现顺序
            const seen = new Set();
            const expected = [];
            for (const word of words) {
              if (!seen.has(word)) {
                seen.add(word);
                expected.push(word);
              }
            }
            
            return JSON.stringify(outputWords) === JSON.stringify(expected);
          }
        )
      );
    });
  });
});
