/**
 * JSON 工具套件 - 共享组件库
 */

/**
 * JSON 编辑器组件
 */
class JSONEditor {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.textarea = null;
    this._init();
  }

  _init() {
    this.textarea = document.createElement('textarea');
    this.textarea.className = 'editor';
    this.textarea.placeholder = this.options.placeholder || '在此输入或粘贴 JSON 数据...';
    
    if (this.options.readOnly) {
      this.textarea.readOnly = true;
    }

    this.container.appendChild(this.textarea);
  }

  setValue(value) {
    this.textarea.value = value;
  }

  getValue() {
    return this.textarea.value;
  }

  format() {
    try {
      const formatted = Utils.formatJSON(this.getValue());
      this.setValue(formatted);
      this.textarea.classList.remove('error');
      return true;
    } catch (error) {
      this.textarea.classList.add('error');
      Utils.showError(error.message);
      return false;
    }
  }

  validate() {
    const result = Utils.validateJSON(this.getValue());
    if (result.valid) {
      this.textarea.classList.remove('error');
    } else {
      this.textarea.classList.add('error');
    }
    return result;
  }

  clear() {
    this.setValue('');
    this.textarea.classList.remove('error');
  }

  focus() {
    this.textarea.focus();
  }

  highlightError(line, column) {
    // 简单的错误高亮实现
    this.textarea.classList.add('error');
    this.textarea.focus();
  }
}

/**
 * 文件处理组件
 */
class FileHandler {
  constructor() {
    this.maxSize = 10 * 1024 * 1024; // 10MB
  }

  /**
   * 上传文件
   * @param {Array<string>} acceptTypes - 接受的文件类型
   * @returns {Promise<File>}
   */
  uploadFile(acceptTypes = ['.json', '.txt']) {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = acceptTypes.join(',');

      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) {
          reject(new Error('未选择文件'));
          return;
        }

        if (file.size > this.maxSize) {
          reject(new Error(`文件过大，最大支持 ${Utils.formatFileSize(this.maxSize)}`));
          return;
        }

        resolve(file);
      };

      input.click();
    });
  }

  /**
   * 读取文件为文本
   * @param {File} file - 文件对象
   * @returns {Promise<string>}
   */
  readAsText(file) {
    return Utils.readFileAsText(file);
  }

  /**
   * 下载文件
   * @param {string} content - 文件内容
   * @param {string} filename - 文件名
   */
  downloadFile(content, filename) {
    Utils.downloadFile(content, filename);
  }

  /**
   * 复制到剪贴板
   * @param {string} text - 要复制的文本
   * @returns {Promise<void>}
   */
  copyToClipboard(text) {
    return Utils.copyToClipboard(text);
  }
}

/**
 * 差异查看器组件
 */
class DiffViewer {
  constructor(container) {
    this.container = container;
  }

  /**
   * 比较两个 JSON
   * @param {string} json1 - 第一个 JSON 字符串
   * @param {string} json2 - 第二个 JSON 字符串
   * @returns {Object} 差异结果
   */
  compare(json1, json2) {
    try {
      const obj1 = JSON.parse(json1);
      const obj2 = JSON.parse(json2);

      const diff = {
        added: [],
        deleted: [],
        modified: []
      };

      this._compareObjects(obj1, obj2, '', diff);

      return diff;
    } catch (error) {
      throw new Error('JSON 解析失败: ' + error.message);
    }
  }

  /**
   * 递归比较对象
   * @private
   */
  _compareObjects(obj1, obj2, path, diff) {
    const keys1 = obj1 && typeof obj1 === 'object' ? Object.keys(obj1) : [];
    const keys2 = obj2 && typeof obj2 === 'object' ? Object.keys(obj2) : [];
    const allKeys = new Set([...keys1, ...keys2]);

    for (const key of allKeys) {
      const newPath = path ? `${path}.${key}` : key;
      const val1 = obj1 ? obj1[key] : undefined;
      const val2 = obj2 ? obj2[key] : undefined;

      if (val1 === undefined && val2 !== undefined) {
        diff.added.push({ path: newPath, value: val2 });
      } else if (val1 !== undefined && val2 === undefined) {
        diff.deleted.push({ path: newPath, value: val1 });
      } else if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
        this._compareObjects(val1, val2, newPath, diff);
      } else if (val1 !== val2) {
        diff.modified.push({ path: newPath, oldValue: val1, newValue: val2 });
      }
    }
  }

  /**
   * 渲染差异结果
   * @param {Object} diff - 差异结果
   */
  render(diff) {
    this.container.innerHTML = '';

    if (diff.added.length === 0 && diff.deleted.length === 0 && diff.modified.length === 0) {
      this.container.innerHTML = '<p style="text-align: center; color: #4CAF50; padding: 20px;">✓ 两个 JSON 完全相同，无差异</p>';
      return;
    }

    const diffHTML = [];

    if (diff.added.length > 0) {
      diffHTML.push('<h4 style="color: #4CAF50;">新增 (' + diff.added.length + ')</h4>');
      diffHTML.push('<div class="diff-view">');
      diff.added.forEach(item => {
        diffHTML.push(`<div class="diff-added">+ ${item.path}: ${JSON.stringify(item.value)}</div>`);
      });
      diffHTML.push('</div>');
    }

    if (diff.deleted.length > 0) {
      diffHTML.push('<h4 style="color: #F44336;">删除 (' + diff.deleted.length + ')</h4>');
      diffHTML.push('<div class="diff-view">');
      diff.deleted.forEach(item => {
        diffHTML.push(`<div class="diff-deleted">- ${item.path}: ${JSON.stringify(item.value)}</div>`);
      });
      diffHTML.push('</div>');
    }

    if (diff.modified.length > 0) {
      diffHTML.push('<h4 style="color: #FF9800;">修改 (' + diff.modified.length + ')</h4>');
      diffHTML.push('<div class="diff-view">');
      diff.modified.forEach(item => {
        diffHTML.push(`<div class="diff-modified">~ ${item.path}:</div>`);
        diffHTML.push(`<div class="diff-deleted">  - ${JSON.stringify(item.oldValue)}</div>`);
        diffHTML.push(`<div class="diff-added">  + ${JSON.stringify(item.newValue)}</div>`);
      });
      diffHTML.push('</div>');
    }

    this.container.innerHTML = diffHTML.join('');
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { JSONEditor, FileHandler, DiffViewer };
}
