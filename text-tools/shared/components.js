/**
 * 文本工具套件 - 共享UI组件
 */

/**
 * 创建页面头部
 * @param {string} title - 工具标题
 * @param {string} description - 工具描述
 * @returns {string} HTML字符串
 */
function createHeader(title, description) {
  return `
    <header class="header">
      <a href="../tooles/index.html" class="back-link">← 返回工具箱</a>
      <h1>${title}</h1>
      <p>${description}</p>
      <div class="privacy-notice">🔒 所有处理均在本地完成，数据不会上传</div>
    </header>
  `;
}

/**
 * 显示消息提示
 * @param {string} type - 消息类型: 'success' | 'error'
 * @param {string} text - 消息内容
 */
function showMessage(type, text) {
  // 移除已存在的消息
  const existing = document.querySelector('.message');
  if (existing) {
    existing.remove();
  }

  const message = document.createElement('div');
  message.className = `message ${type}`;
  message.textContent = text;
  document.body.appendChild(message);

  // 触发动画
  requestAnimationFrame(() => {
    message.classList.add('show');
  });

  // 3秒后自动消失
  setTimeout(() => {
    message.classList.remove('show');
    setTimeout(() => message.remove(), 300);
  }, 3000);
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否成功
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showMessage('success', '已复制到剪贴板');
    return true;
  } catch (err) {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showMessage('success', '已复制到剪贴板');
      return true;
    } catch (e) {
      showMessage('error', '复制失败，请手动复制');
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

/**
 * 更新统计显示
 * @param {Object} stats - 统计数据对象
 * @param {HTMLElement} container - 统计容器元素
 */
function updateStats(stats, container) {
  container.innerHTML = Object.entries(stats)
    .map(([label, value]) => `
      <div class="stat-item">
        <div class="stat-value">${value}</div>
        <div class="stat-label">${label}</div>
      </div>
    `).join('');
}

// 导出供测试使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createHeader, showMessage, copyToClipboard, updateStats };
}
