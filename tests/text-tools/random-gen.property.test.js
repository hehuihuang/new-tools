/**
 * 随机文本生成工具 - 属性测试
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Mock crypto.getRandomValues for testing
if (typeof crypto === 'undefined') {
  global.crypto = {
    getRandomValues: (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }
  };
}

// 被测函数
function generatePassword(options) {
  const { length = 16, uppercase = true, lowercase = true, numbers = true, symbols = false } = options;
  
  let charset = '';
  if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) charset += '0123456789';
  if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  if (charset.length === 0) {
    throw new Error('请至少选择一种字符类型');
  }
  
  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  
  return password;
}

function generateString(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }
  
  return result;
}

function generateUUID() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  // 设置版本号 (4) 和变体位
  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;
  
  const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function generateLorem(paragraphs) {
  const loremText = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
  ];
  
  const result = [];
  for (let i = 0; i < paragraphs; i++) {
    result.push(loremText[i % loremText.length]);
  }
  
  return result.join('\n\n');
}

describe('Random Generation Property Tests', () => {
  /**
   * Feature: text-tools-suite, Property 19: Password Generation Constraints
   * Validates: Requirements 8.1
   */
  describe('Property 19: Password Generation Constraints', () => {
    it('should generate password with correct length', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 6, max: 64 }),
          (length) => {
            const password = generatePassword({ length });
            return password.length === length;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should only contain characters from enabled character sets', () => {
      const password = generatePassword({
        length: 20,
        uppercase: true,
        lowercase: false,
        numbers: false,
        symbols: false
      });
      
      expect(/^[A-Z]+$/.test(password)).toBe(true);
    });

    it('should contain only lowercase when only lowercase is enabled', () => {
      const password = generatePassword({
        length: 20,
        uppercase: false,
        lowercase: true,
        numbers: false,
        symbols: false
      });
      
      expect(/^[a-z]+$/.test(password)).toBe(true);
    });

    it('should contain only numbers when only numbers is enabled', () => {
      const password = generatePassword({
        length: 20,
        uppercase: false,
        lowercase: false,
        numbers: true,
        symbols: false
      });
      
      expect(/^[0-9]+$/.test(password)).toBe(true);
    });

    it('should contain alphanumeric characters when uppercase, lowercase, and numbers are enabled', () => {
      const password = generatePassword({
        length: 50,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false
      });
      
      expect(/^[A-Za-z0-9]+$/.test(password)).toBe(true);
    });

    it('should throw error when no character types are selected', () => {
      expect(() => {
        generatePassword({
          length: 10,
          uppercase: false,
          lowercase: false,
          numbers: false,
          symbols: false
        });
      }).toThrow();
    });
  });

  /**
   * Feature: text-tools-suite, Property 20: UUID v4 Format Validity
   * Validates: Requirements 8.3
   */
  describe('Property 20: UUID v4 Format Validity', () => {
    it('should match UUID v4 format', () => {
      for (let i = 0; i < 20; i++) {
        const uuid = generateUUID();
        
        // UUID v4 格式: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(uuidPattern.test(uuid)).toBe(true);
      }
    });

    it('should have version digit as 4', () => {
      const uuid = generateUUID();
      const parts = uuid.split('-');
      
      // 第三部分的第一个字符应该是 '4'
      expect(parts[2][0]).toBe('4');
    });

    it('should have valid variant digit', () => {
      const uuid = generateUUID();
      const parts = uuid.split('-');
      
      // 第四部分的第一个字符应该是 8, 9, a, 或 b
      const variantChar = parts[3][0].toLowerCase();
      expect(['8', '9', 'a', 'b']).toContain(variantChar);
    });

    it('should have correct segment lengths', () => {
      const uuid = generateUUID();
      const parts = uuid.split('-');
      
      expect(parts.length).toBe(5);
      expect(parts[0].length).toBe(8);
      expect(parts[1].length).toBe(4);
      expect(parts[2].length).toBe(4);
      expect(parts[3].length).toBe(4);
      expect(parts[4].length).toBe(12);
    });
  });

  /**
   * Feature: text-tools-suite, Property 21: Lorem Ipsum Paragraph Count
   * Validates: Requirements 8.4
   */
  describe('Property 21: Lorem Ipsum Paragraph Count', () => {
    it('should generate exact number of paragraphs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (paragraphs) => {
            const result = generateLorem(paragraphs);
            const actualParagraphs = result.split('\n\n').length;
            
            return actualParagraphs === paragraphs;
          }
        ),
        { numRuns: 10 }
      );
    });

    it('should generate single paragraph correctly', () => {
      const result = generateLorem(1);
      const paragraphs = result.split('\n\n');
      
      expect(paragraphs.length).toBe(1);
      expect(paragraphs[0].length).toBeGreaterThan(0);
    });

    it('should generate multiple paragraphs correctly', () => {
      const result = generateLorem(5);
      const paragraphs = result.split('\n\n');
      
      expect(paragraphs.length).toBe(5);
      paragraphs.forEach(p => {
        expect(p.length).toBeGreaterThan(0);
      });
    });
  });

  /**
   * Feature: text-tools-suite, Property 22: Random Generation Variability
   * Validates: Requirements 8.5
   */
  describe('Property 22: Random Generation Variability', () => {
    it('should generate different passwords on multiple calls', () => {
      const passwords = new Set();
      const iterations = 20;
      
      for (let i = 0; i < iterations; i++) {
        passwords.add(generatePassword({ length: 16 }));
      }
      
      // 至少应该有 95% 的密码是唯一的
      expect(passwords.size).toBeGreaterThanOrEqual(iterations * 0.95);
    });

    it('should generate different strings on multiple calls', () => {
      const strings = new Set();
      const iterations = 20;
      
      for (let i = 0; i < iterations; i++) {
        strings.add(generateString(32));
      }
      
      // 至少应该有 95% 的字符串是唯一的
      expect(strings.size).toBeGreaterThanOrEqual(iterations * 0.95);
    });

    it('should generate different UUIDs on multiple calls', () => {
      const uuids = new Set();
      const iterations = 20;
      
      for (let i = 0; i < iterations; i++) {
        uuids.add(generateUUID());
      }
      
      // 所有UUID应该是唯一的
      expect(uuids.size).toBe(iterations);
    });
  });

  describe('Additional Random Generation Tests', () => {
    it('should generate string with correct length', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 8, max: 128 }),
          (length) => {
            const str = generateString(length);
            return str.length === length;
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should generate alphanumeric string', () => {
      const str = generateString(50);
      expect(/^[A-Za-z0-9]+$/.test(str)).toBe(true);
    });

    it('should handle edge case lengths', () => {
      expect(generatePassword({ length: 6 }).length).toBe(6);
      expect(generatePassword({ length: 64 }).length).toBe(64);
      expect(generateString(8).length).toBe(8);
      expect(generateString(128).length).toBe(128);
    });
  });
});
