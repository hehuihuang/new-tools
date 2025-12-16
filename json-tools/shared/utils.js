/**
 * JSON 工具套件 - 共享工具函数库
 */

const Utils = {
  /**
   * 格式化 JSON
   * @param {string} jsonString - JSON 字符串
   * @param {number} indent - 缩进空格数
   * @returns {string} 格式化后的 JSON
   */
  formatJSON(jsonString, indent = 2) {
    try {
      const obj = JSON.parse(jsonString);
      return JSON.stringify(obj, null, indent);
    } catch (error) {
      throw new Error('JSON 格式化失败: ' + error.message);
    }
  },

  /**
   * 压缩 JSON
   * @param {string} jsonString - JSON 字符串
   * @returns {string} 压缩后的 JSON
   */
  compressJSON(jsonString) {
    try {
      const obj = JSON.parse(jsonString);
      return JSON.stringify(obj);
    } catch (error) {
      throw new Error('JSON 压缩失败: ' + error.message);
    }
  },

  /**
   * 验证 JSON
   * @param {string} jsonString - JSON 字符串
   * @returns {Object} 验证结果
   */
  validateJSON(jsonString) {
    try {
      const obj = JSON.parse(jsonString);
      const stats = this.getJSONStats(obj);
      return {
        valid: true,
        stats: stats
      };
    } catch (error) {
      // 尝试提取错误位置
      const match = error.message.match(/position (\d+)/);
      const position = match ? parseInt(match[1]) : 0;
      
      // 计算行号和列号
      const lines = jsonString.substring(0, position).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      
      return {
        valid: false,
        error: {
          message: error.message,
          line: line,
          column: column
        }
      };
    }
  },

  /**
   * 获取 JSON 统计信息
   * @param {Object} obj - JSON 对象
   * @returns {Object} 统计信息
   */
  getJSONStats(obj) {
    const stats = {
      keys: 0,
      depth: 0,
      size: JSON.stringify(obj).length
    };

    const countKeys = (o, depth = 0) => {
      if (typeof o === 'object' && o !== null) {
        if (depth > stats.depth) {
          stats.depth = depth;
        }

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

  /**
   * JSON 转 XML
   * @param {Object} obj - JSON 对象
   * @param {string} rootName - 根元素名称
   * @returns {string} XML 字符串
   */
  jsonToXML(obj, rootName = 'root') {
    const escapeXML = (str) => {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const convert = (o, name) => {
      if (o === null || o === undefined) {
        return `<${name}/>`;
      }

      if (typeof o !== 'object') {
        return `<${name}>${escapeXML(o)}</${name}>`;
      }

      if (Array.isArray(o)) {
        return o.map(item => convert(item, 'item')).join('');
      }

      const children = Object.keys(o)
        .map(key => convert(o[key], key))
        .join('');

      return `<${name}>${children}</${name}>`;
    };

    const xml = convert(obj, rootName);
    return `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
  },

  /**
   * XML 转 JSON
   * @param {string} xmlString - XML 字符串
   * @returns {Object} JSON 对象
   */
  xmlToJSON(xmlString) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

      // 检查解析错误
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('XML 解析失败');
      }

      const convert = (node) => {
        // 文本节点
        if (node.nodeType === 3) {
          return node.nodeValue.trim();
        }

        // 元素节点
        if (node.nodeType === 1) {
          const obj = {};
          
          // 处理属性
          if (node.attributes.length > 0) {
            obj['@attributes'] = {};
            for (let i = 0; i < node.attributes.length; i++) {
              const attr = node.attributes[i];
              obj['@attributes'][attr.name] = attr.value;
            }
          }

          // 处理子节点
          if (node.childNodes.length > 0) {
            for (let i = 0; i < node.childNodes.length; i++) {
              const child = node.childNodes[i];
              const childName = child.nodeName;

              if (child.nodeType === 3) {
                const text = child.nodeValue.trim();
                if (text) {
                  return text;
                }
              } else if (child.nodeType === 1) {
                const childValue = convert(child);

                if (obj[childName]) {
                  if (!Array.isArray(obj[childName])) {
                    obj[childName] = [obj[childName]];
                  }
                  obj[childName].push(childValue);
                } else {
                  obj[childName] = childValue;
                }
              }
            }
          }

          return obj;
        }

        return null;
      };

      return convert(xmlDoc.documentElement);
    } catch (error) {
      throw new Error('XML 转换失败: ' + error.message);
    }
  },

  /**
   * JSON 转 CSV
   * @param {Array} jsonArray - JSON 数组
   * @param {Object} options - 转换选项
   * @returns {string} CSV 字符串
   */
  jsonToCSV(jsonArray, options = {}) {
    if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
      throw new Error('输入必须是非空数组');
    }

    const delimiter = options.delimiter || ',';
    const quote = options.quote || '"';
    const flatten = options.flatten !== false;

    // 扁平化对象
    const flattenObject = (obj, prefix = '') => {
      const flattened = {};
      for (const key in obj) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (flatten && typeof value === 'object' && value !== null && !Array.isArray(value)) {
          Object.assign(flattened, flattenObject(value, newKey));
        } else if (Array.isArray(value)) {
          flattened[newKey] = JSON.stringify(value);
        } else {
          flattened[newKey] = value;
        }
      }
      return flattened;
    };

    // 扁平化所有对象
    const flatData = jsonArray.map(item => flattenObject(item));

    // 获取所有列名
    const columns = [...new Set(flatData.flatMap(obj => Object.keys(obj)))];

    // 转义 CSV 值
    const escapeCSV = (value) => {
      if (value === null || value === undefined) {
        return '';
      }
      const str = String(value);
      if (str.includes(delimiter) || str.includes(quote) || str.includes('\n')) {
        return quote + str.replace(new RegExp(quote, 'g'), quote + quote) + quote;
      }
      return str;
    };

    // 生成 CSV
    const header = columns.map(col => escapeCSV(col)).join(delimiter);
    const rows = flatData.map(obj => 
      columns.map(col => escapeCSV(obj[col])).join(delimiter)
    );

    return [header, ...rows].join('\n');
  },

  /**
   * CSV 转 JSON
   * @param {string} csvString - CSV 字符串
   * @param {Object} options - 转换选项
   * @returns {Array} JSON 数组
   */
  csvToJSON(csvString, options = {}) {
    const delimiter = options.delimiter || ',';
    const quote = options.quote || '"';

    const lines = csvString.trim().split('\n');
    if (lines.length === 0) {
      return [];
    }

    // 解析 CSV 行
    const parseCSVLine = (line) => {
      const values = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === quote) {
          if (inQuotes && nextChar === quote) {
            current += quote;
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === delimiter && !inQuotes) {
          values.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current);

      return values;
    };

    // 解析表头
    const headers = parseCSVLine(lines[0]);

    // 解析数据行
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = parseCSVLine(lines[i]);
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        data.push(obj);
      }
    }

    return data;
  },

  /**
   * 生成 JSON Schema
   * @param {Object} obj - JSON 对象
   * @returns {Object} JSON Schema
   */
  generateSchema(obj) {
    const getType = (value) => {
      if (value === null) return 'null';
      if (Array.isArray(value)) return 'array';
      return typeof value;
    };

    const generate = (value) => {
      const type = getType(value);

      if (type === 'object') {
        const properties = {};
        const required = [];

        for (const key in value) {
          properties[key] = generate(value[key]);
          required.push(key);
        }

        return {
          type: 'object',
          properties: properties,
          required: required
        };
      }

      if (type === 'array') {
        if (value.length > 0) {
          return {
            type: 'array',
            items: generate(value[0])
          };
        }
        return { type: 'array' };
      }

      return { type: type };
    };

    return {
      $schema: 'http://json-schema.org/draft-07/schema#',
      ...generate(obj)
    };
  },

  /**
   * 显示成功消息
   * @param {string} message - 消息内容
   */
  showSuccess(message) {
    this.showMessage(message, 'success');
  },

  /**
   * 显示错误消息
   * @param {string} message - 消息内容
   */
  showError(message) {
    this.showMessage(message, 'error');
  },

  /**
   * 显示警告消息
   * @param {string} message - 消息内容
   */
  showWarning(message) {
    this.showMessage(message, 'warning');
  },

  /**
   * 显示消息
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型
   */
  showMessage(message, type = 'success') {
    // 移除现有消息
    const existing = document.querySelector('.message');
    if (existing) {
      existing.remove();
    }

    // 创建新消息
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type} show`;
    messageEl.textContent = message;

    // 插入到容器顶部
    const container = document.querySelector('.container');
    if (container) {
      container.insertBefore(messageEl, container.firstChild);

      // 3秒后自动隐藏
      setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => messageEl.remove(), 300);
      }, 3000);
    }
  },

  /**
   * 显示加载状态
   * @param {string} message - 加载消息
   */
  showLoading(message = '处理中...') {
    let overlay = document.querySelector('.loading-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.innerHTML = `
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p class="loading-message">${message}</p>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const messageEl = overlay.querySelector('.loading-message');
    if (messageEl) {
      messageEl.textContent = message;
    }

    overlay.classList.add('show');
  },

  /**
   * 隐藏加载状态
   */
  hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      overlay.classList.remove('show');
    }
  },

  /**
   * 格式化文件大小
   * @param {number} bytes - 字节数
   * @returns {string} 格式化后的大小
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * 深度克隆对象
   * @param {*} obj - 要克隆的对象
   * @returns {*} 克隆后的对象
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * 复制到剪贴板
   * @param {string} text - 要复制的文本
   * @returns {Promise<void>}
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      this.showSuccess('已复制到剪贴板');
    } catch (error) {
      this.showError('复制失败: ' + error.message);
      throw error;
    }
  },

  /**
   * 下载文件
   * @param {string} content - 文件内容
   * @param {string} filename - 文件名
   * @param {string} mimeType - MIME 类型
   */
  downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
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
   * 读取文件内容
   * @param {File} file - 文件对象
   * @returns {Promise<string>} 文件内容
   */
  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsText(file);
    });
  },

  /**
   * 生成带时间戳的文件名
   * @param {string} baseName - 基础文件名
   * @param {string} extension - 文件扩展名
   * @returns {string} 完整文件名
   */
  generateFilename(baseName, extension) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    return `${baseName}-${timestamp}.${extension}`;
  }
};

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
