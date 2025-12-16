/**
 * 财税计算工具套件 - 工具函数单元测试
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  formatCurrency,
  formatPercent,
  validateNumber,
  validateRequired,
  saveToHistory,
  loadHistory,
  clearHistory,
  saveLastInput,
  loadLastInput,
  round,
  isLocalStorageAvailable
} from './utils.js';

describe('formatCurrency', () => {
  it('should format positive numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('1,234.56');
    expect(formatCurrency(1000000)).toBe('1,000,000.00');
    expect(formatCurrency(0.99)).toBe('0.99');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('0.00');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-1234.56)).toBe('-1,234.56');
  });

  it('should handle custom decimal places', () => {
    expect(formatCurrency(1234.5678, 0)).toBe('1,235');
    expect(formatCurrency(1234.5678, 3)).toBe('1,234.568');
  });

  it('should handle invalid inputs', () => {
    expect(formatCurrency(null)).toBe('0.00');
    expect(formatCurrency(undefined)).toBe('0.00');
    expect(formatCurrency(NaN)).toBe('0.00');
  });
});

describe('formatPercent', () => {
  it('should format percentages correctly', () => {
    expect(formatPercent(0.1234)).toBe('12.34%');
    expect(formatPercent(0.5)).toBe('50.00%');
    expect(formatPercent(1)).toBe('100.00%');
  });

  it('should handle zero', () => {
    expect(formatPercent(0)).toBe('0.00%');
  });

  it('should handle custom decimal places', () => {
    expect(formatPercent(0.12345, 0)).toBe('12%');
    expect(formatPercent(0.12345, 3)).toBe('12.345%');
  });

  it('should handle invalid inputs', () => {
    expect(formatPercent(null)).toBe('0.00%');
    expect(formatPercent(undefined)).toBe('0.00%');
    expect(formatPercent(NaN)).toBe('0.00%');
  });
});

describe('validateNumber', () => {
  it('should validate valid numbers', () => {
    const result = validateNumber(100);
    expect(result.valid).toBe(true);
    expect(result.value).toBe(100);
    expect(result.error).toBe('');
  });

  it('should reject empty values', () => {
    expect(validateNumber('').valid).toBe(false);
    expect(validateNumber(null).valid).toBe(false);
    expect(validateNumber(undefined).valid).toBe(false);
  });

  it('should reject non-numeric values', () => {
    const result = validateNumber('abc');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('请输入有效的数字');
  });

  it('should reject negative numbers', () => {
    const result = validateNumber(-100);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('数值不能为负数');
  });

  it('should validate minimum value', () => {
    const result = validateNumber(5, 10);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('不能小于');
  });

  it('should validate maximum value', () => {
    const result = validateNumber(150, 0, 100);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('不能大于');
  });

  it('should accept values within range', () => {
    const result = validateNumber(50, 0, 100);
    expect(result.valid).toBe(true);
    expect(result.value).toBe(50);
  });
});

describe('validateRequired', () => {
  it('should validate all required fields are present', () => {
    const data = { name: 'John', age: 30, email: 'john@example.com' };
    const result = validateRequired(data, ['name', 'age', 'email']);
    expect(result.valid).toBe(true);
    expect(result.missingFields).toEqual([]);
  });

  it('should detect missing fields', () => {
    const data = { name: 'John', age: '' };
    const result = validateRequired(data, ['name', 'age', 'email']);
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('age');
    expect(result.missingFields).toContain('email');
  });

  it('should handle null and undefined values', () => {
    const data = { name: 'John', age: null, email: undefined };
    const result = validateRequired(data, ['name', 'age', 'email']);
    expect(result.valid).toBe(false);
    expect(result.missingFields).toEqual(['age', 'email']);
  });
});

describe('round', () => {
  it('should round to 2 decimal places by default', () => {
    expect(round(1.234)).toBe(1.23);
    expect(round(1.235)).toBe(1.24);
    expect(round(1.999)).toBe(2.00);
  });

  it('should round to custom decimal places', () => {
    expect(round(1.2345, 0)).toBe(1);
    expect(round(1.2345, 1)).toBe(1.2);
    expect(round(1.2345, 3)).toBe(1.235);
  });

  it('should handle negative numbers', () => {
    expect(round(-1.235, 2)).toBe(-1.24);
  });
});

describe('localStorage functions', () => {
  const testKey = 'test_history';
  
  beforeEach(() => {
    // 清除测试数据
    localStorage.clear();
  });

  afterEach(() => {
    // 清理
    localStorage.clear();
  });

  describe('isLocalStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });
  });

  describe('saveToHistory and loadHistory', () => {
    it('should save and load history correctly', () => {
      const data = { amount: 1000, result: 100 };
      saveToHistory(testKey, data);
      
      const history = loadHistory(testKey);
      expect(history).toHaveLength(1);
      expect(history[0].amount).toBe(1000);
      expect(history[0].result).toBe(100);
      expect(history[0].id).toBeDefined();
      expect(history[0].timestamp).toBeDefined();
    });

    it('should maintain history order (newest first)', () => {
      saveToHistory(testKey, { value: 1 });
      saveToHistory(testKey, { value: 2 });
      saveToHistory(testKey, { value: 3 });
      
      const history = loadHistory(testKey);
      expect(history[0].value).toBe(3);
      expect(history[1].value).toBe(2);
      expect(history[2].value).toBe(1);
    });

    it('should respect limit parameter', () => {
      for (let i = 0; i < 20; i++) {
        saveToHistory(testKey, { value: i });
      }
      
      const history = loadHistory(testKey, 5);
      expect(history).toHaveLength(5);
    });

    it('should limit history to 100 records', () => {
      for (let i = 0; i < 150; i++) {
        saveToHistory(testKey, { value: i });
      }
      
      const allHistory = loadHistory(testKey, 200);
      expect(allHistory.length).toBeLessThanOrEqual(100);
    });

    it('should return empty array for non-existent key', () => {
      const history = loadHistory('non_existent_key');
      expect(history).toEqual([]);
    });
  });

  describe('clearHistory', () => {
    it('should clear history', () => {
      saveToHistory(testKey, { value: 1 });
      saveToHistory(testKey, { value: 2 });
      
      clearHistory(testKey);
      
      const history = loadHistory(testKey);
      expect(history).toEqual([]);
    });
  });

  describe('saveLastInput and loadLastInput', () => {
    it('should save and load last input', () => {
      const input = { amount: 5000, rate: 0.05 };
      saveLastInput(testKey, input);
      
      const loaded = loadLastInput(testKey);
      expect(loaded).toEqual(input);
    });

    it('should return null for non-existent key', () => {
      const loaded = loadLastInput('non_existent_key');
      expect(loaded).toBeNull();
    });

    it('should overwrite previous input', () => {
      saveLastInput(testKey, { value: 1 });
      saveLastInput(testKey, { value: 2 });
      
      const loaded = loadLastInput(testKey);
      expect(loaded.value).toBe(2);
    });
  });
});
