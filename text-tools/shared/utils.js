/**
 * 文本工具套件 - 共享工具函数
 */

/**
 * 按行分割文本
 * @param {string} text - 输入文本
 * @returns {string[]} 行数组
 */
function splitLines(text) {
  if (!text) return [];
  return text.split(/\r?\n/);
}

/**
 * 合并行为文本
 * @param {string[]} lines - 行数组
 * @param {string} separator - 分隔符，默认换行
 * @returns {string} 合并后的文本
 */
function joinLines(lines, separator = '\n') {
  return lines.join(separator);
}

/**
 * 统计字符数
 * @param {string} text - 输入文本
 * @param {boolean} includeSpaces - 是否包含空格
 * @returns {number} 字符数
 */
function countChars(text, includeSpaces = true) {
  if (!text) return 0;
  if (includeSpaces) return text.length;
  return text.replace(/\s/g, '').length;
}

/**
 * 统计单词数
 * @param {string} text - 输入文本
 * @returns {number} 单词数
 */
function countWords(text) {
  if (!text || !text.trim()) return 0;
  // 支持中英文混合
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

/**
 * HTML转义
 * @param {string} text - 输入文本
 * @returns {string} 转义后的文本
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * HTML反转义
 * @param {string} text - 输入文本
 * @returns {string} 反转义后的文本
 */
function unescapeHtml(text) {
  const map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'"
  };
  return text.replace(/&(amp|lt|gt|quot|#039);/g, m => map[m]);
}

// 导出供测试使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { splitLines, joinLines, countChars, countWords, escapeHtml, unescapeHtml };
}

// ES模块导出
export { splitLines, joinLines, countChars, countWords, escapeHtml, unescapeHtml };
