/**
 * Feature: code-tools-suite, Property 12: Base64 Image Round-Trip
 * Feature: code-tools-suite, Property 13: Base64 Data URL Format
 * Validates: Requirements 7.1, 7.2, 7.3
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// Base64 编码/解码函数
const base64Encode = (data) => {
  if (typeof btoa !== 'undefined') {
    return btoa(data);
  }
  return Buffer.from(data, 'binary').toString('base64');
};

const base64Decode = (base64) => {
  if (typeof atob !== 'undefined') {
    return atob(base64);
  }
  return Buffer.from(base64, 'base64').toString('binary');
};

// 创建 Data URL
const createDataURL = (data, mimeType = 'image/png') => {
  const base64 = base64Encode(data);
  return `data:${mimeType};base64,${base64}`;
};

// 解析 Data URL
const parseDataURL = (dataURL) => {
  const match = dataURL.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid Data URL format');
  }
  return {
    mimeType: match[1],
    base64: match[2],
    data: base64Decode(match[2])
  };
};

// 验证 Base64 图片格式
const isValidBase64Image = (str) => {
  return /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/.test(str);
};

describe('Base64 Image Round-Trip', () => {
  /**
   * Property 12: Base64 Image Round-Trip
   * For any valid image data, converting to Base64 then back to image 
   * should produce identical binary data.
   */
  it('should preserve data after encode then decode', () => {
    // 生成随机二进制数据（模拟图片数据）
    const binaryDataArbitrary = fc.array(
      fc.integer({ min: 0, max: 255 }),
      { minLength: 10, maxLength: 100 }
    ).map(bytes => String.fromCharCode(...bytes));

    fc.assert(
      fc.property(binaryDataArbitrary, (data) => {
        const encoded = base64Encode(data);
        const decoded = base64Decode(encoded);
        return decoded === data;
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve data through Data URL round-trip', () => {
    const binaryDataArbitrary = fc.array(
      fc.integer({ min: 0, max: 255 }),
      { minLength: 10, maxLength: 100 }
    ).map(bytes => String.fromCharCode(...bytes));

    const mimeTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

    fc.assert(
      fc.property(binaryDataArbitrary, fc.constantFrom(...mimeTypes), (data, mimeType) => {
        const dataURL = createDataURL(data, mimeType);
        const parsed = parseDataURL(dataURL);
        return parsed.data === data && parsed.mimeType === mimeType;
      }),
      { numRuns: 100 }
    );
  });

  it('Base64 encoding should be deterministic', () => {
    const binaryDataArbitrary = fc.array(
      fc.integer({ min: 0, max: 255 }),
      { minLength: 5, maxLength: 50 }
    ).map(bytes => String.fromCharCode(...bytes));

    fc.assert(
      fc.property(binaryDataArbitrary, (data) => {
        const encoded1 = base64Encode(data);
        const encoded2 = base64Encode(data);
        return encoded1 === encoded2;
      }),
      { numRuns: 100 }
    );
  });
});

describe('Base64 Data URL Format', () => {
  /**
   * Property 13: Base64 Data URL Format
   * For any image converted to Base64, the output should match the pattern 
   * `data:<mime-type>;base64,<encoded-data>`.
   */
  it('Data URL should match expected format', () => {
    const binaryDataArbitrary = fc.array(
      fc.integer({ min: 0, max: 255 }),
      { minLength: 10, maxLength: 100 }
    ).map(bytes => String.fromCharCode(...bytes));

    const mimeTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

    fc.assert(
      fc.property(binaryDataArbitrary, fc.constantFrom(...mimeTypes), (data, mimeType) => {
        const dataURL = createDataURL(data, mimeType);
        
        // 验证格式
        const formatRegex = /^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/]+=*$/;
        return formatRegex.test(dataURL);
      }),
      { numRuns: 100 }
    );
  });

  it('Data URL should contain correct MIME type', () => {
    const mimeTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

    fc.assert(
      fc.property(fc.constantFrom(...mimeTypes), (mimeType) => {
        const data = 'test data';
        const dataURL = createDataURL(data, mimeType);
        
        return dataURL.startsWith(`data:${mimeType};base64,`);
      }),
      { numRuns: 100 }
    );
  });

  it('isValidBase64Image should correctly validate Data URLs', () => {
    const validDataURLs = [
      'data:image/png;base64,iVBORw0KGgo=',
      'data:image/jpeg;base64,/9j/4AAQ=',
      'data:image/gif;base64,R0lGODlh',
      'data:image/webp;base64,UklGRg=='
    ];

    const invalidDataURLs = [
      'data:text/plain;base64,SGVsbG8=',
      'data:image/png,notbase64',
      'not a data url',
      'data:image/bmp;base64,Qk0='
    ];

    validDataURLs.forEach(url => {
      expect(isValidBase64Image(url)).toBe(true);
    });

    invalidDataURLs.forEach(url => {
      expect(isValidBase64Image(url)).toBe(false);
    });
  });

  it('Base64 output should only contain valid characters', () => {
    const binaryDataArbitrary = fc.array(
      fc.integer({ min: 0, max: 255 }),
      { minLength: 1, maxLength: 100 }
    ).map(bytes => String.fromCharCode(...bytes));

    fc.assert(
      fc.property(binaryDataArbitrary, (data) => {
        const encoded = base64Encode(data);
        // Base64 只包含 A-Z, a-z, 0-9, +, /, =
        return /^[A-Za-z0-9+/]*=*$/.test(encoded);
      }),
      { numRuns: 100 }
    );
  });
});
