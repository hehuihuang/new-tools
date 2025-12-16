/**
 * JSON 工具函数单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest';

// 模拟 Utils 对象
const Utils = {
  formatJSON(jsonString, indent = 2) {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj, null, indent);
  },

  compressJSON(jsonString) {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj);
  },

  validateJSON(jsonString) {
    try {
      const obj = JSON.parse(jsonString);
      const stats = this.getJSONStats(obj);
      return { valid: true, stats };
    } catch (error) {
      const match = error.message.match(/position (\d+)/);
      const position = match ? parseInt(match[1]) : 0;
      const lines = jsonString.substring(0, position).split('\n');
      return {
        valid: false,
        error: {
          message: error.message,
          line: lines.length,
          column: lines[lines.length - 1].length + 1
        }
      };
    }
  },

  getJSONStats(obj) {
    const stats = { keys: 0, depth: 0, size: JSON.stringify(obj).length };
    const countKeys = (o, depth = 0) => {
      if (typeof o === 'object' && o !== null) {
        if (depth > stats.depth) stats.depth = depth;
        if (Array.isArray(o)) {
          o.forEach(item => countKeys(item, depth + 1));
        } else {
          stats.keys += Object.keys(o).length;
          Object.values(o).forEach(value => countKeys(value, depth + 1));
        }
      }
    };
    countKeys(obj);
    return stats;
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};

describe('JSON Utils - formatJSON', () => {
  it('should format valid JSON with default indentation', () => {
    const input = '{"name":"test","value":123}';
    const output = Utils.formatJSON(input);
    expect(output).toContain('\n');
    expect(JSON.parse(output)).toEqual({ name: 'test', value: 123 });
  });

  it('should format valid JSON with custom indentation', () => {
    const input = '{"a":1}';
    const output = Utils.formatJSON(input, 4);
    expect(output).toContain('    '); // 4 spaces
  });

  it('should throw error for invalid JSON', () => {
    const input = '{invalid}';
    expect(() => Utils.formatJSON(input)).toThrow();
  });

  it('should handle nested objects', () => {
    const input = '{"outer":{"inner":"value"}}';
    const output = Utils.formatJSON(input);
    const parsed = JSON.parse(output);
    expect(parsed.outer.inner).toBe('value');
  });

  it('should handle arrays', () => {
    const input = '[1,2,3]';
    const output = Utils.formatJSON(input);
    expect(JSON.parse(output)).toEqual([1, 2, 3]);
  });
});

describe('JSON Utils - compressJSON', () => {
  it('should compress formatted JSON', () => {
    const input = '{\n  "name": "test",\n  "value": 123\n}';
    const output = Utils.compressJSON(input);
    expect(output).not.toContain('\n');
    expect(output).not.toContain('  ');
    expect(JSON.parse(output)).toEqual({ name: 'test', value: 123 });
  });

  it('should handle already compressed JSON', () => {
    const input = '{"name":"test"}';
    const output = Utils.compressJSON(input);
    expect(JSON.parse(output)).toEqual({ name: 'test' });
  });

  it('should throw error for invalid JSON', () => {
    const input = '{invalid}';
    expect(() => Utils.compressJSON(input)).toThrow();
  });
});

describe('JSON Utils - validateJSON', () => {
  it('should validate correct JSON', () => {
    const input = '{"name":"test","value":123}';
    const result = Utils.validateJSON(input);
    expect(result.valid).toBe(true);
    expect(result.stats).toBeDefined();
  });

  it('should detect invalid JSON', () => {
    const input = '{invalid}';
    const result = Utils.validateJSON(input);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should provide error location for invalid JSON', () => {
    const input = '{"name": invalid}';
    const result = Utils.validateJSON(input);
    expect(result.valid).toBe(false);
    expect(result.error.line).toBeGreaterThan(0);
    expect(result.error.column).toBeGreaterThan(0);
  });

  it('should return stats for valid JSON', () => {
    const input = '{"a":1,"b":2}';
    const result = Utils.validateJSON(input);
    expect(result.valid).toBe(true);
    expect(result.stats.keys).toBe(2);
  });
});

describe('JSON Utils - getJSONStats', () => {
  it('should count keys in flat object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const stats = Utils.getJSONStats(obj);
    expect(stats.keys).toBe(3);
    expect(stats.depth).toBe(0); // 扁平对象深度为 0
  });

  it('should calculate depth for nested objects', () => {
    const obj = { a: { b: { c: 1 } } };
    const stats = Utils.getJSONStats(obj);
    expect(stats.depth).toBe(2); // 嵌套 3 层，深度为 2
  });

  it('should handle arrays', () => {
    const obj = { items: [1, 2, 3] };
    const stats = Utils.getJSONStats(obj);
    expect(stats.keys).toBe(1);
  });

  it('should calculate size', () => {
    const obj = { name: 'test' };
    const stats = Utils.getJSONStats(obj);
    expect(stats.size).toBe(JSON.stringify(obj).length);
  });

  it('should handle empty object', () => {
    const obj = {};
    const stats = Utils.getJSONStats(obj);
    expect(stats.keys).toBe(0);
    expect(stats.depth).toBe(0);
  });
});

describe('JSON Utils - formatFileSize', () => {
  it('should format bytes', () => {
    expect(Utils.formatFileSize(0)).toBe('0 B');
    expect(Utils.formatFileSize(100)).toBe('100 B');
  });

  it('should format kilobytes', () => {
    expect(Utils.formatFileSize(1024)).toBe('1 KB');
    expect(Utils.formatFileSize(2048)).toBe('2 KB');
  });

  it('should format megabytes', () => {
    expect(Utils.formatFileSize(1024 * 1024)).toBe('1 MB');
    expect(Utils.formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
  });

  it('should round to 2 decimal places', () => {
    const result = Utils.formatFileSize(1536); // 1.5 KB
    expect(result).toBe('1.5 KB');
  });
});

describe('JSON Utils - deepClone', () => {
  it('should clone simple object', () => {
    const obj = { a: 1, b: 2 };
    const cloned = Utils.deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
  });

  it('should clone nested object', () => {
    const obj = { a: { b: { c: 1 } } };
    const cloned = Utils.deepClone(obj);
    expect(cloned).toEqual(obj);
    cloned.a.b.c = 2;
    expect(obj.a.b.c).toBe(1);
  });

  it('should clone arrays', () => {
    const obj = { items: [1, 2, 3] };
    const cloned = Utils.deepClone(obj);
    expect(cloned).toEqual(obj);
    cloned.items.push(4);
    expect(obj.items.length).toBe(3);
  });
});
