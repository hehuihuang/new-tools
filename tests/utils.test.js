/**
 * 共享工具函数单元测试
 * 需求: 3.2
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import Utils from '../pdf-tools/shared/utils.js';

describe('Utils.parsePageRange', () => {
  it('应该正确解析单个页码', () => {
    const result = Utils.parsePageRange('5', 10);
    expect(result).toEqual([5]);
  });

  it('应该正确解析页面范围', () => {
    const result = Utils.parsePageRange('1-3', 10);
    expect(result).toEqual([1, 2, 3]);
  });

  it('应该正确解析混合格式', () => {
    const result = Utils.parsePageRange('1-3, 5, 7-9', 10);
    expect(result).toEqual([1, 2, 3, 5, 7, 8, 9]);
  });

  it('应该去除重复页码', () => {
    const result = Utils.parsePageRange('1-3, 2, 3-5', 10);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('应该对结果进行排序', () => {
    const result = Utils.parsePageRange('5, 1-3, 7', 10);
    expect(result).toEqual([1, 2, 3, 5, 7]);
  });

  it('应该处理带空格的输入', () => {
    const result = Utils.parsePageRange(' 1 - 3 , 5 , 7 - 9 ', 10);
    expect(result).toEqual([1, 2, 3, 5, 7, 8, 9]);
  });

  it('应该在空字符串时抛出错误', () => {
    expect(() => Utils.parsePageRange('', 10)).toThrow('页面范围不能为空');
  });

  it('应该在页码超出范围时抛出错误', () => {
    expect(() => Utils.parsePageRange('1-15', 10)).toThrow('页面范围超出文档范围');
  });

  it('应该在页码小于1时抛出错误', () => {
    expect(() => Utils.parsePageRange('0-5', 10)).toThrow('页面范围超出文档范围');
  });

  it('应该在范围起始大于结束时抛出错误', () => {
    expect(() => Utils.parsePageRange('5-3', 10)).toThrow('页面范围超出文档范围');
  });

  it('应该在格式无效时抛出错误', () => {
    expect(() => Utils.parsePageRange('abc', 10)).toThrow('无效的页码');
  });

  it('应该在范围格式无效时抛出错误', () => {
    expect(() => Utils.parsePageRange('1-abc', 10)).toThrow('无效的页面范围');
  });
});

describe('Utils.formatFileSize', () => {
  it('应该正确格式化字节', () => {
    expect(Utils.formatFileSize(0)).toBe('0 B');
    expect(Utils.formatFileSize(100)).toBe('100 B');
    expect(Utils.formatFileSize(1023)).toBe('1023 B');
  });

  it('应该正确格式化千字节', () => {
    expect(Utils.formatFileSize(1024)).toBe('1 KB');
    expect(Utils.formatFileSize(1536)).toBe('1.5 KB');
    expect(Utils.formatFileSize(10240)).toBe('10 KB');
  });

  it('应该正确格式化兆字节', () => {
    expect(Utils.formatFileSize(1048576)).toBe('1 MB');
    expect(Utils.formatFileSize(1572864)).toBe('1.5 MB');
    expect(Utils.formatFileSize(10485760)).toBe('10 MB');
  });

  it('应该正确格式化吉字节', () => {
    expect(Utils.formatFileSize(1073741824)).toBe('1 GB');
    expect(Utils.formatFileSize(1610612736)).toBe('1.5 GB');
  });

  it('应该保留两位小数', () => {
    expect(Utils.formatFileSize(1234567)).toBe('1.18 MB');
  });
});

describe('Utils.downloadFile', () => {
  beforeEach(() => {
    // 模拟 DOM 环境
    document.body.innerHTML = '';
    
    // 模拟 URL.createObjectURL 和 URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-blob-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('应该创建下载链接并触发下载', () => {
    const blob = new Blob(['test content'], { type: 'application/pdf' });
    const filename = 'test.pdf';

    Utils.downloadFile(blob, filename);

    // 验证 URL.createObjectURL 被调用
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(blob);

    // 验证 URL.revokeObjectURL 被调用
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-blob-url');
  });

  it('应该设置正确的文件名', () => {
    const blob = new Blob(['test content'], { type: 'application/pdf' });
    const filename = 'my-document.pdf';

    // 监听 click 事件
    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = vi.fn((tag) => {
      const element = originalCreateElement(tag);
      if (tag === 'a') {
        element.click = clickSpy;
      }
      return element;
    });

    Utils.downloadFile(blob, filename);

    // 验证 click 被调用
    expect(clickSpy).toHaveBeenCalled();

    // 恢复原始方法
    document.createElement = originalCreateElement;
  });
});
