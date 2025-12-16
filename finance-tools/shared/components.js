/**
 * 财税计算工具套件 - 共享UI组件
 */

/**
 * 创建财税工具页面头部
 * @param {string} title - 工具标题
 * @param {string} description - 工具描述
 * @returns {string} HTML字符串
 */
function createFinanceHeader(title, description) {
  return `
    <header class="header">
      <a href="../tooles/index.html" class="back-link">← 返回工具箱</a>
      <h1>${title}</h1>
      <p>${description}</p>
      <div class="privacy-notice">🔒 所有计算均在本地完成，数据不会上传</div>
    </header>
  `;
}

/**
 * 创建输入表单组
 * @param {Object} config - 配置对象
 * @param {string} config.label - 标签文本
 * @param {string} config.id - 输入框ID
 * @param {string} config.type - 输入类型 (number, text, select)
 * @param {string} [config.placeholder] - 占位符
 * @param {boolean} [config.required] - 是否必填
 * @param {number} [config.min] - 最小值
 * @param {number} [config.max] - 最大值
 * @param {number} [config.step] - 步进值
 * @param {string} [config.unit] - 单位
 * @param {Array} [config.options] - 选项列表 (用于select)
 * @param {string} [config.value] - 默认值
 * @param {string} [config.hint] - 提示文本
 * @returns {string} HTML字符串
 */
function createInputGroup(config) {
  const {
    label,
    id,
    type = 'number',
    placeholder = '',
    required = false,
    min,
    max,
    step = '0.01',
    unit = '',
    options = [],
    value = '',
    hint = ''
  } = config;

  const requiredMark = required ? '<span class="required">*</span>' : '';
  
  let inputHTML = '';
  
  if (type === 'select') {
    inputHTML = `
      <select id="${id}" class="select" ${required ? 'required' : ''}>
        <option value="">请选择</option>
        ${options.map(opt => {
          const optValue = typeof opt === 'object' ? opt.value : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          return `<option value="${optValue}" ${value === optValue ? 'selected' : ''}>${optLabel}</option>`;
        }).join('')}
      </select>
    `;
  } else {
    const attrs = [];
    if (min !== undefined) attrs.push(`min="${min}"`);
    if (max !== undefined) attrs.push(`max="${max}"`);
    if (step !== undefined) attrs.push(`step="${step}"`);
    if (required) attrs.push('required');
    if (placeholder) attrs.push(`placeholder="${placeholder}"`);
    if (value) attrs.push(`value="${value}"`);
    
    inputHTML = `
      <div class="input-wrapper">
        <input 
          type="${type}" 
          id="${id}" 
          class="input" 
          ${attrs.join(' ')}
        />
        ${unit ? `<span class="input-unit">${unit}</span>` : ''}
      </div>
    `;
  }
  
  return `
    <div class="input-group">
      <label class="input-label" for="${id}">
        ${label}${requiredMark}
      </label>
      ${inputHTML}
      ${hint ? `<span class="input-hint">${hint}</span>` : ''}
      <span class="input-error" id="${id}-error"></span>
    </div>
  `;
}

/**
 * 创建结果展示卡片
 * @param {string} title - 卡片标题
 * @param {Object} data - 结果数据对象
 * @returns {string} HTML字符串
 */
function createResultCard(title, data) {
  const items = Object.entries(data).map(([key, item]) => {
    const highlight = item.highlight ? 'highlight' : '';
    const sub = item.sub ? `<div class="result-sub">${item.sub}</div>` : '';
    
    return `
      <div class="result-item ${highlight}">
        <div class="result-label">${item.label || key}</div>
        <div class="result-value">${item.value}</div>
        ${sub}
      </div>
    `;
  }).join('');
  
  return `
    <div class="card">
      <h3 class="card-title">${title}</h3>
      <div class="result-summary">
        ${items}
      </div>
    </div>
  `;
}

/**
 * 创建对比表格
 * @param {Array<string>} headers - 表头数组
 * @param {Array<Array>} rows - 数据行数组
 * @returns {string} HTML字符串
 */
function createComparisonTable(headers, rows) {
  const headerHTML = headers.map(h => `<th>${h}</th>`).join('');
  
  const rowsHTML = rows.map(row => {
    const isRecommended = row.recommended;
    const rowClass = isRecommended ? 'recommended' : '';
    const cells = row.cells.map(cell => `<td>${cell}</td>`).join('');
    return `<tr class="${rowClass}">${cells}</tr>`;
  }).join('');
  
  return `
    <table class="comparison-table">
      <thead>
        <tr>${headerHTML}</tr>
      </thead>
      <tbody>
        ${rowsHTML}
      </tbody>
    </table>
  `;
}

/**
 * 创建详细计算过程列表
 * @param {Array<Object>} items - 计算步骤数组
 * @returns {string} HTML字符串
 */
function createDetailsList(items) {
  const itemsHTML = items.map(item => {
    const formula = item.formula ? `<div class="details-formula">${item.formula}</div>` : '';
    
    return `
      <li class="details-item">
        <div>
          <div class="details-label">${item.label}</div>
          ${formula}
        </div>
        <div class="details-value">${item.value}</div>
      </li>
    `;
  }).join('');
  
  return `
    <ul class="details-list">
      ${itemsHTML}
    </ul>
  `;
}

/**
 * 创建可折叠区域
 * @param {string} title - 标题
 * @param {string} content - 内容HTML
 * @param {boolean} [open] - 是否默认展开
 * @returns {string} HTML字符串
 */
function createCollapsible(title, content, open = false) {
  const openClass = open ? 'open' : '';
  
  return `
    <div class="collapsible ${openClass}">
      <div class="collapsible-header" onclick="toggleCollapsible(this)">
        <span class="collapsible-title">${title}</span>
        <span class="collapsible-icon">▼</span>
      </div>
      <div class="collapsible-content">
        ${content}
      </div>
    </div>
  `;
}

/**
 * 切换可折叠区域
 * @param {HTMLElement} header - 头部元素
 */
function toggleCollapsible(header) {
  const collapsible = header.parentElement;
  collapsible.classList.toggle('open');
}

/**
 * 显示消息提示
 * @param {string} type - 消息类型: 'success' | 'error' | 'warning'
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
 * 创建还款计划表
 * @param {Array<Object>} schedule - 还款计划数组
 * @returns {string} HTML字符串
 */
function createScheduleTable(schedule) {
  const rowsHTML = schedule.map(item => `
    <tr>
      <td>${item.period}</td>
      <td>${item.payment}</td>
      <td>${item.principal}</td>
      <td>${item.interest}</td>
      <td>${item.balance}</td>
    </tr>
  `).join('');
  
  return `
    <table class="schedule-table">
      <thead>
        <tr>
          <th>期数</th>
          <th>月供(元)</th>
          <th>本金(元)</th>
          <th>利息(元)</th>
          <th>剩余本金(元)</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHTML}
      </tbody>
    </table>
  `;
}

// 导出供测试使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createFinanceHeader,
    createInputGroup,
    createResultCard,
    createComparisonTable,
    createDetailsList,
    createCollapsible,
    toggleCollapsible,
    showMessage,
    copyToClipboard,
    createScheduleTable
  };
}
