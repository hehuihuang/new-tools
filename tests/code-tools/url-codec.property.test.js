/**
 * Feature: code-tools-suite, Property 4: URL Encode/Decode Round-Trip
 * Feature: code-tools-suite, Property 5: URL Encoding Mode Correctness
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// URL 编码/解码函数
const encodeURL = (text, mode = 'component') => {
  if (mode === 'full') {
    return encodeURI(text);
  }
  return encodeURIComponent(text);
};

const decodeURL = (encoded) => {
  try {
    return decodeURIComponent(encoded);
  } catch (e) {
    return decodeURI(encoded);
  }
};

describe('URL Encode/Decode Round-Trip', () => {
  /**
   * Property 4: URL Encode/Decode Round-Trip
   * For any string, encoding then decoding should return the original string.
   */
  it('should return original string after encode then decode (component mode)', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const encoded = encodeURL(str, 'component');
        const decoded = decodeURL(encoded);
        return decoded === str;
      }),
      { numRuns: 100 }
    );
  });

  it('should return original string after encode then decode (full mode)', () => {
    // 对于 full 模式，只测试不包含特殊 URI 字符的字符串
    const safeStringArbitrary = fc.string().filter(s => {
      try {
        const encoded = encodeURI(s);
        const decoded = decodeURI(encoded);
        return decoded === s;
      } catch {
        return false;
      }
    });

    fc.assert(
      fc.property(safeStringArbitrary, (str) => {
        const encoded = encodeURL(str, 'full');
        const decoded = decodeURL(encoded);
        return decoded === str;
      }),
      { numRuns: 100 }
    );
  });

  it('encoded string should only contain safe characters', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const encoded = encodeURL(str, 'component');
        // 编码后的字符串应该只包含安全字符
        return /^[A-Za-z0-9_.~!*'()-]*(%[0-9A-Fa-f]{2})*[A-Za-z0-9_.~!*'()-]*$/.test(encoded) || 
               encoded === '' ||
               /^[A-Za-z0-9_.~!*'()%-]*$/.test(encoded);
      }),
      { numRuns: 100 }
    );
  });
});

describe('URL Encoding Mode Correctness', () => {
  /**
   * Property 5: URL Encoding Mode Correctness
   * For any string containing reserved URL characters, encodeURIComponent mode 
   * should encode more characters than encodeURI mode.
   */
  it('component mode should encode reserved characters that full mode preserves', () => {
    const reservedChars = ['/', '?', '&', '=', '#', ':'];
    
    reservedChars.forEach(char => {
      const componentEncoded = encodeURL(char, 'component');
      const fullEncoded = encodeURL(char, 'full');
      
      // encodeURIComponent 应该编码这些字符
      expect(componentEncoded).not.toBe(char);
      // encodeURI 应该保留这些字符（除了 # 和 ?）
      if (char !== '#' && char !== '?') {
        expect(fullEncoded).toBe(char);
      }
    });
  });

  it('component mode should produce longer or equal output for strings with reserved chars', () => {
    const stringWithReservedChars = fc.string().filter(s => 
      s.includes('/') || s.includes('?') || s.includes('&') || s.includes('=')
    );

    fc.assert(
      fc.property(stringWithReservedChars, (str) => {
        const componentEncoded = encodeURL(str, 'component');
        const fullEncoded = encodeURL(str, 'full');
        // component 模式编码更多字符，所以结果应该更长或相等
        return componentEncoded.length >= fullEncoded.length;
      }),
      { numRuns: 100 }
    );
  });
});
