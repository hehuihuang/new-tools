/**
 * Feature: code-tools-suite, Property 2: JSON Format/Compress Preserves Data
 * Feature: code-tools-suite, Property 3: JSON Validation Correctness
 * Validates: Requirements 2.1, 2.2, 2.3
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// JSON 工具函数
const formatJSON = (jsonString, indent = 2) => {
  const obj = JSON.parse(jsonString);
  return JSON.stringify(obj, null, indent);
};

const compressJSON = (jsonString) => {
  const obj = JSON.parse(jsonString);
  return JSON.stringify(obj);
};

const validateJSON = (jsonString) => {
  try {
    JSON.parse(jsonString);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

describe('JSON Format/Compress Preserves Data', () => {
  /**
   * Property 2: JSON Format/Compress Preserves Data
   * For any valid JSON string, formatting then compressing (or vice versa) 
   * should produce a JSON that parses to an equivalent object.
   */
  it('should preserve data after format then compress', () => {
    const jsonArbitrary = fc.json();

    fc.assert(
      fc.property(jsonArbitrary, (jsonStr) => {
        const original = JSON.parse(jsonStr);
        const formatted = formatJSON(jsonStr, 2);
        const compressed = compressJSON(formatted);
        const result = JSON.parse(compressed);
        
        return JSON.stringify(original) === JSON.stringify(result);
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve data after compress then format', () => {
    const jsonArbitrary = fc.json();

    fc.assert(
      fc.property(jsonArbitrary, (jsonStr) => {
        const original = JSON.parse(jsonStr);
        const compressed = compressJSON(jsonStr);
        const formatted = formatJSON(compressed, 2);
        const result = JSON.parse(formatted);
        
        return JSON.stringify(original) === JSON.stringify(result);
      }),
      { numRuns: 100 }
    );
  });

  it('compressed JSON should have no unnecessary whitespace', () => {
    const jsonArbitrary = fc.json();

    fc.assert(
      fc.property(jsonArbitrary, (jsonStr) => {
        const compressed = compressJSON(jsonStr);
        // 压缩后的 JSON 不应该有换行符或多余空格
        return !compressed.includes('\n') && !compressed.includes('  ');
      }),
      { numRuns: 100 }
    );
  });
});

describe('JSON Validation Correctness', () => {
  /**
   * Property 3: JSON Validation Correctness
   * For any string input, the JSON validator should return valid=true 
   * if and only if JSON.parse succeeds on that input.
   */
  it('should return valid=true for valid JSON', () => {
    const jsonArbitrary = fc.json();

    fc.assert(
      fc.property(jsonArbitrary, (jsonStr) => {
        const result = validateJSON(jsonStr);
        return result.valid === true;
      }),
      { numRuns: 100 }
    );
  });

  it('should return valid=false for invalid JSON', () => {
    const invalidJsonArbitrary = fc.oneof(
      fc.constant('{invalid}'),
      fc.constant('{"key": }'),
      fc.constant('[1, 2, ]'),
      fc.constant('undefined'),
      fc.constant("{'key': 'value'}"), // 单引号
      fc.string().filter(s => {
        try {
          JSON.parse(s);
          return false;
        } catch {
          return true;
        }
      })
    );

    fc.assert(
      fc.property(invalidJsonArbitrary, (str) => {
        const result = validateJSON(str);
        return result.valid === false;
      }),
      { numRuns: 100 }
    );
  });
});
