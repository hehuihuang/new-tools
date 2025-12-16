/**
 * PDF 工具套件 - 共享工具函数库
 */

const Utils = {
  /**
   * 下载文件到用户设备
   * @param {Blob} blob - 文件 Blob 对象
   * @param {string} filename - 文件名
   */
  downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * 格式化文件大小为人类可读格式
   * @param {number} bytes - 文件大小（字节）
   * @returns {string} 格式化后的文件大小
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * 解析页面范围字符串（如 "1-3, 5, 7-9"）
   * @param {string} rangeStr - 页面范围字符串
   * @param {number} totalPages - PDF 总页数
   * @returns {number[]} 页码数组（去重并排序）
   * @throws {Error} 如果格式无效或页码超出范围
   */
  parsePageRange(rangeStr, totalPages) {
    if (!rangeStr || typeof rangeStr !== 'string') {
      throw new Error('页面范围不能为空');
    }

    const pages = new Set();
    const parts = rangeStr.split(',').map(s => s.trim()).filter(s => s);

    for (const part of parts) {
      if (part.includes('-')) {
        // 处理范围 "1-3"
        const [start, end] = part.split('-').map(s => s.trim());
        const startNum = parseInt(start, 10);
        const endNum = parseInt(end, 10);

        if (isNaN(startNum) || isNaN(endNum)) {
          throw new Error(`无效的页面范围: ${part}`);
        }

        if (startNum < 1 || endNum > totalPages || startNum > endNum) {
          throw new Error(`页面范围超出文档范围 (1-${totalPages}): ${part}`);
        }

        for (let i = startNum; i <= endNum; i++) {
          pages.add(i);
        }
      } else {
        // 处理单个页码 "5"
        const pageNum = parseInt(part, 10);

        if (isNaN(pageNum)) {
          throw new Error(`无效的页码: ${part}`);
        }

        if (pageNum < 1 || pageNum > totalPages) {
          throw new Error(`页码超出文档范围 (1-${totalPages}): ${pageNum}`);
        }

        pages.add(pageNum);
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  },

  /**
   * 显示错误消息
   * @param {string} message - 错误消息内容
   * @param {number} duration - 显示时长（毫秒），默认 5000
   */
  showError(message, duration = 5000) {
    this._showMessage(message, 'error', duration);
  },

  /**
   * 显示成功消息
   * @param {string} message - 成功消息内容
   * @param {number} duration - 显示时长（毫秒），默认 3000
   */
  showSuccess(message, duration = 3000) {
    this._showMessage(message, 'success', duration);
  },

  /**
   * 内部方法：显示消息
   * @private
   */
  _showMessage(message, type, duration) {
    // 查找或创建消息容器
    let messageEl = document.querySelector('.message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.className = 'message';
      const container = document.querySelector('.container');
      if (container) {
        container.insertBefore(messageEl, container.firstChild);
      } else {
        document.body.insertBefore(messageEl, document.body.firstChild);
      }
    }

    // 设置消息内容和类型
    messageEl.textContent = message;
    messageEl.className = `message ${type} show`;

    // 自动隐藏
    setTimeout(() => {
      messageEl.classList.remove('show');
    }, duration);
  },

  /**
   * 验证文件类型
   * @param {File} file - 文件对象
   * @param {string[]} acceptTypes - 接受的文件类型数组
   * @returns {boolean} 是否为有效类型
   */
  validateFileType(file, acceptTypes = ['.pdf', 'application/pdf']) {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    return acceptTypes.some(type => {
      if (type.startsWith('.')) {
        return fileName.endsWith(type);
      }
      return fileType === type;
    });
  },

  /**
   * 验证文件大小
   * @param {File} file - 文件对象
   * @param {number} maxSize - 最大文件大小（字节）
   * @returns {boolean} 是否在大小限制内
   */
  validateFileSize(file, maxSize) {
    return file.size <= maxSize;
  }
};

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
