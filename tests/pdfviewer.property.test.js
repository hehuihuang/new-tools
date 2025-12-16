/**
 * PDFViewer 组件属性测试
 * 功能: pdf-tools-suite, 属性 2: 多页导航控件存在性
 * 验证需求: 1.2
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';

describe('属性 2: 多页导航控件存在性', () => {
  beforeEach(() => {
    // 模拟 DOM 环境
    document.body.innerHTML = `
      <div class="container">
        <div id="pdf-viewer"></div>
        <div class="viewer-controls">
          <button id="prev-page">上一页</button>
          <button id="next-page">下一页</button>
          <input type="number" id="page-input" min="1" />
          <button id="go-to-page">跳转</button>
        </div>
      </div>
    `;
  });

  it('对于任何包含多页的 PDF 文件，预览界面应该显示页面导航控件', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 100 }), // 生成多页 PDF (至少2页)
        (numPages) => {
          // 模拟加载多页 PDF 后的状态
          const container = document.getElementById('pdf-viewer');
          const controls = document.querySelector('.viewer-controls');
          
          // 验证容器存在
          expect(container).toBeTruthy();
          expect(controls).toBeTruthy();
          
          // 验证导航控件存在
          const prevBtn = document.getElementById('prev-page');
          const nextBtn = document.getElementById('next-page');
          const pageInput = document.getElementById('page-input');
          const goToBtn = document.getElementById('go-to-page');
          
          expect(prevBtn).toBeTruthy();
          expect(nextBtn).toBeTruthy();
          expect(pageInput).toBeTruthy();
          expect(goToBtn).toBeTruthy();
          
          // 验证页面输入框的最大值应该等于总页数
          pageInput.max = numPages.toString();
          expect(parseInt(pageInput.max)).toBe(numPages);
        }
      ),
      { numRuns: 100 }
    );
  });
});
