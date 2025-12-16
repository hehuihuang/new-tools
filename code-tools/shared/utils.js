/**
 * 代码工具套件 - 共享工具函数库
 */

const CodeUtils = {
  // ==================== Markdown/HTML 转换 ====================
  
  /**
   * Markdown 转 HTML
   * @param {string} markdown - Markdown 文本
   * @returns {string} HTML 字符串
   */
  markdownToHTML(markdown) {
    if (typeof marked !== 'undefined') {
      return marked.parse(markdown);
    }
    // 简单的 Markdown 解析（备用）
    let html = markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>');
    return html;
  },

  /**
   * HTML 转 Markdown
   * @param {string} html - HTML 字符串
   * @returns {string} Markdown 文本
   */
  htmlToMarkdown(html) {
    if (typeof TurndownService !== 'undefined') {
      const turndownService = new TurndownService();
      return turndownService.turndown(html);
    }
    // 简单的 HTML 转 Markdown（备用）
    let markdown = html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '');
    return markdown;
  },

  // ==================== JSON 处理 ====================
  
  /**
   * 格式化 JSON
   * @param {string} jsonString - JSON 字符串
   * @param {number} indent - 缩进空格数
   * @returns {string} 格式化后的 JSON
   */
  formatJSON(jsonString, indent = 2) {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj, null, indent);
  },

  /**
   * 压缩 JSON
   * @param {string} jsonString - JSON 字符串
   * @returns {string} 压缩后的 JSON
   */
  compressJSON(jsonString) {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj);
  },

  /**
   * 验证 JSON
   * @param {string} jsonString - JSON 字符串
   * @returns {Object} 验证结果
   */
  validateJSON(jsonString) {
    try {
      const obj = JSON.parse(jsonString);
      return {
        valid: true,
        data: obj,
        stats: this.getJSONStats(obj)
      };
    } catch (error) {
      const match = error.message.match(/position (\d+)/);
      const position = match ? parseInt(match[1]) : 0;
      const lines = jsonString.substring(0, position).split('\n');
      
      return {
        valid: false,
        error: {
          message: error.message,
          line: lines.length,
          column: lines[lines.length - 1].length + 1,
          position: position
        }
      };
    }
  },

  /**
   * 获取 JSON 统计信息
   */
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

  // ==================== URL 编码/解码 ====================
  
  /**
   * URL 编码
   * @param {string} text - 要编码的文本
   * @param {string} mode - 编码模式: 'component' | 'full'
   * @returns {string} 编码后的字符串
   */
  encodeURL(text, mode = 'component') {
    if (mode === 'full') {
      return encodeURI(text);
    }
    return encodeURIComponent(text);
  },

  /**
   * URL 解码
   * @param {string} encoded - 已编码的字符串
   * @returns {string} 解码后的文本
   */
  decodeURL(encoded) {
    try {
      return decodeURIComponent(encoded);
    } catch (e) {
      // 尝试使用 decodeURI
      try {
        return decodeURI(encoded);
      } catch (e2) {
        throw new Error('无效的 URL 编码序列');
      }
    }
  },

  // ==================== JWT 处理 ====================
  
  /**
   * Base64URL 解码
   */
  base64UrlDecode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) {
      base64 += '='.repeat(4 - pad);
    }
    return decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
  },

  /**
   * Base64URL 编码
   */
  base64UrlEncode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => 
      String.fromCharCode('0x' + p1)
    )).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },

  /**
   * 解析 JWT
   * @param {string} token - JWT 令牌
   * @returns {Object} 解析结果
   */
  parseJWT(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('无效的 JWT 格式：应包含三个部分');
    }

    try {
      const header = JSON.parse(this.base64UrlDecode(parts[0]));
      const payload = JSON.parse(this.base64UrlDecode(parts[1]));
      const signature = parts[2];

      const result = { header, payload, signature };

      // 检查过期时间
      if (payload.exp) {
        const expiresAt = new Date(payload.exp * 1000);
        result.expiresAt = expiresAt;
        result.isExpired = Date.now() > expiresAt.getTime();
      }

      // 检查签发时间
      if (payload.iat) {
        result.issuedAt = new Date(payload.iat * 1000);
      }

      return result;
    } catch (error) {
      throw new Error('JWT 解析失败: ' + error.message);
    }
  },

  /**
   * 生成 JWT（未签名）
   * @param {Object} header - Header 对象
   * @param {Object} payload - Payload 对象
   * @returns {string} JWT 令牌
   */
  generateJWT(header, payload) {
    const headerStr = this.base64UrlEncode(JSON.stringify(header));
    const payloadStr = this.base64UrlEncode(JSON.stringify(payload));
    return `${headerStr}.${payloadStr}.`;
  },

  // ==================== 文本差异比较 ====================
  
  /**
   * 比较两段文本的差异
   * @param {string} text1 - 第一段文本
   * @param {string} text2 - 第二段文本
   * @param {string} mode - 比较模式: 'line' | 'word'
   * @returns {Array} 差异结果
   */
  diffText(text1, text2, mode = 'line') {
    if (typeof diff_match_patch !== 'undefined') {
      const dmp = new diff_match_patch();
      const diffs = dmp.diff_main(text1, text2);
      dmp.diff_cleanupSemantic(diffs);
      return diffs.map(([type, text]) => ({
        type: type === 1 ? 'added' : type === -1 ? 'deleted' : 'unchanged',
        content: text
      }));
    }
    
    // 简单的行级差异比较（备用）
    if (mode === 'line') {
      return this._diffLines(text1, text2);
    }
    return this._diffWords(text1, text2);
  },

  _diffLines(text1, text2) {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const result = [];
    
    let i = 0, j = 0;
    while (i < lines1.length || j < lines2.length) {
      if (i >= lines1.length) {
        result.push({ type: 'added', content: lines2[j++] });
      } else if (j >= lines2.length) {
        result.push({ type: 'deleted', content: lines1[i++] });
      } else if (lines1[i] === lines2[j]) {
        result.push({ type: 'unchanged', content: lines1[i] });
        i++; j++;
      } else {
        result.push({ type: 'deleted', content: lines1[i++] });
        result.push({ type: 'added', content: lines2[j++] });
      }
    }
    return result;
  },

  _diffWords(text1, text2) {
    const words1 = text1.split(/(\s+)/);
    const words2 = text2.split(/(\s+)/);
    const result = [];
    
    let i = 0, j = 0;
    while (i < words1.length || j < words2.length) {
      if (i >= words1.length) {
        result.push({ type: 'added', content: words2[j++] });
      } else if (j >= words2.length) {
        result.push({ type: 'deleted', content: words1[i++] });
      } else if (words1[i] === words2[j]) {
        result.push({ type: 'unchanged', content: words1[i] });
        i++; j++;
      } else {
        result.push({ type: 'deleted', content: words1[i++] });
        result.push({ type: 'added', content: words2[j++] });
      }
    }
    return result;
  },

  // ==================== 命名风格转换 ====================
  
  /**
   * 将字符串分割为单词数组
   */
  splitIntoWords(text) {
    // 处理各种命名格式
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2')  // camelCase -> camel Case
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')  // XMLParser -> XML Parser
      .replace(/[-_]/g, ' ')  // snake_case, kebab-case -> spaces
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 0);
  },

  /**
   * 转换命名风格
   * @param {string} text - 输入文本
   * @param {string} targetCase - 目标格式
   * @returns {string} 转换后的文本
   */
  convertCase(text, targetCase) {
    const words = this.splitIntoWords(text);
    if (words.length === 0) return text;

    switch (targetCase) {
      case 'camelCase':
        return words[0] + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
      case 'PascalCase':
        return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
      case 'snake_case':
        return words.join('_');
      case 'kebab-case':
        return words.join('-');
      case 'CONSTANT_CASE':
        return words.map(w => w.toUpperCase()).join('_');
      default:
        return text;
    }
  },

  /**
   * 检测命名风格
   */
  detectCase(text) {
    if (text.includes('_') && text === text.toUpperCase()) return 'CONSTANT_CASE';
    if (text.includes('_')) return 'snake_case';
    if (text.includes('-')) return 'kebab-case';
    if (/^[A-Z]/.test(text)) return 'PascalCase';
    if (/[a-z][A-Z]/.test(text)) return 'camelCase';
    return 'unknown';
  },

  // ==================== Base64 图片处理 ====================
  
  /**
   * 图片文件转 Base64
   * @param {File} file - 图片文件
   * @returns {Promise<string>} Base64 Data URL
   */
  imageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('图片读取失败'));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Base64 转 Blob
   * @param {string} base64 - Base64 字符串
   * @returns {Blob} Blob 对象
   */
  base64ToBlob(base64) {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1] || 'image/png';
    const raw = atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
  },

  /**
   * 验证 Base64 图片格式
   */
  isValidBase64Image(str) {
    return /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/.test(str);
  },

  // ==================== CSV/Markdown 表格转换 ====================
  
  /**
   * CSV 转 Markdown 表格
   * @param {string} csv - CSV 字符串
   * @returns {string} Markdown 表格
   */
  csvToMarkdownTable(csv) {
    const rows = this.parseCSV(csv);
    if (rows.length === 0) return '';

    const header = rows[0];
    const separator = header.map(() => '---');
    const dataRows = rows.slice(1);

    const formatRow = row => '| ' + row.join(' | ') + ' |';
    
    return [
      formatRow(header),
      formatRow(separator),
      ...dataRows.map(formatRow)
    ].join('\n');
  },

  /**
   * Markdown 表格转 CSV
   * @param {string} markdown - Markdown 表格
   * @returns {string} CSV 字符串
   */
  markdownTableToCSV(markdown) {
    const lines = markdown.trim().split('\n').filter(line => line.trim());
    const rows = [];

    for (const line of lines) {
      // 跳过分隔行
      if (/^\|[\s-:|]+\|$/.test(line)) continue;
      
      const cells = line
        .replace(/^\||\|$/g, '')
        .split('|')
        .map(cell => cell.trim());
      
      rows.push(cells);
    }

    return rows.map(row => 
      row.map(cell => {
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          return '"' + cell.replace(/"/g, '""') + '"';
        }
        return cell;
      }).join(',')
    ).join('\n');
  },

  /**
   * 解析 CSV
   */
  parseCSV(csv, delimiter = ',') {
    const rows = [];
    const lines = csv.trim().split('\n');
    
    for (const line of lines) {
      const row = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === delimiter && !inQuotes) {
          row.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      row.push(current.trim());
      rows.push(row);
    }
    
    return rows;
  },

  // ==================== 通用工具函数 ====================
  
  /**
   * 复制到剪贴板
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
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
   * 下载 Blob
   */
  downloadBlob(blob, filename) {
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
   * 读取文件为文本
   */
  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsText(file);
    });
  },

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * 生成带时间戳的文件名
   */
  generateFilename(baseName, extension) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    return `${baseName}-${timestamp}.${extension}`;
  },

  // ==================== 消息提示 ====================
  
  showSuccess(message) {
    this.showMessage(message, 'success');
  },

  showError(message) {
    this.showMessage(message, 'error');
  },

  showWarning(message) {
    this.showMessage(message, 'warning');
  },

  showMessage(message, type = 'success') {
    const existing = document.querySelector('.message');
    if (existing) existing.remove();

    const messageEl = document.createElement('div');
    messageEl.className = `message ${type} show`;
    messageEl.textContent = message;
    document.body.appendChild(messageEl);

    setTimeout(() => {
      messageEl.classList.remove('show');
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  },

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
    overlay.querySelector('.loading-message').textContent = message;
    overlay.classList.add('show');
  },

  hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) overlay.classList.remove('show');
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CodeUtils;
}
