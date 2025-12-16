/**
 * 财税计算工具套件 - 共享工具函数
 */

/**
 * 格式化货币显示
 * @param {number} amount - 金额
 * @param {number} [decimals=2] - 小数位数
 * @returns {string} 格式化后的字符串 (如: "12,345.67")
 */
function formatCurrency(amount, decimals = 2) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.00';
  }
  
  const fixed = Number(amount).toFixed(decimals);
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * 格式化百分比显示
 * @param {number} value - 数值 (0-1)
 * @param {number} [decimals=2] - 小数位数
 * @returns {string} 格式化后的字符串 (如: "12.34%")
 */
function formatPercent(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  
  return (Number(value) * 100).toFixed(decimals) + '%';
}

/**
 * 验证数字输入
 * @param {any} value - 输入值
 * @param {number} [min] - 最小值
 * @param {number} [max] - 最大值
 * @returns {Object} 验证结果 {valid: boolean, error: string, value: number}
 */
function validateNumber(value, min, max) {
  // 检查是否为空
  if (value === '' || value === null || value === undefined) {
    return {
      valid: false,
      error: '请输入数值',
      value: 0
    };
  }
  
  // 转换为数字
  const num = Number(value);
  
  // 检查是否为有效数字
  if (isNaN(num)) {
    return {
      valid: false,
      error: '请输入有效的数字',
      value: 0
    };
  }
  
  // 检查是否为负数
  if (num < 0) {
    return {
      valid: false,
      error: '数值不能为负数',
      value: num
    };
  }
  
  // 检查最小值
  if (min !== undefined && num < min) {
    return {
      valid: false,
      error: `数值不能小于 ${min}`,
      value: num
    };
  }
  
  // 检查最大值
  if (max !== undefined && num > max) {
    return {
      valid: false,
      error: `数值不能大于 ${max}`,
      value: num
    };
  }
  
  return {
    valid: true,
    error: '',
    value: num
  };
}

/**
 * 验证必填字段
 * @param {Object} data - 数据对象
 * @param {Array<string>} requiredFields - 必填字段数组
 * @returns {Object} 验证结果 {valid: boolean, missingFields: Array<string>}
 */
function validateRequired(data, requiredFields) {
  const missingFields = [];
  
  for (const field of requiredFields) {
    const value = data[field];
    if (value === '' || value === null || value === undefined) {
      missingFields.push(field);
    }
  }
  
  return {
    valid: missingFields.length === 0,
    missingFields
  };
}

/**
 * 保存计算历史
 * @param {string} key - 存储键名
 * @param {Object} data - 计算数据
 * @returns {void}
 */
function saveToHistory(key, data) {
  try {
    // 获取现有历史记录
    const history = loadHistory(key, 100);
    
    // 添加新记录
    const record = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...data
    };
    
    history.unshift(record);
    
    // 限制历史记录数量（最多保存100条）
    if (history.length > 100) {
      history.splice(100);
    }
    
    // 保存到localStorage
    localStorage.setItem(key, JSON.stringify(history));
  } catch (error) {
    console.error('保存历史记录失败:', error);
  }
}

/**
 * 加载计算历史
 * @param {string} key - 存储键名
 * @param {number} [limit=10] - 返回数量限制
 * @returns {Array} 历史记录数组
 */
function loadHistory(key, limit = 10) {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      return [];
    }
    
    const history = JSON.parse(data);
    return history.slice(0, limit);
  } catch (error) {
    console.error('加载历史记录失败:', error);
    return [];
  }
}

/**
 * 清除计算历史
 * @param {string} key - 存储键名
 * @returns {void}
 */
function clearHistory(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('清除历史记录失败:', error);
  }
}

/**
 * 保存最后一次输入
 * @param {string} key - 存储键名
 * @param {Object} data - 输入数据
 * @returns {void}
 */
function saveLastInput(key, data) {
  try {
    localStorage.setItem(`${key}_last`, JSON.stringify(data));
  } catch (error) {
    console.error('保存输入失败:', error);
  }
}

/**
 * 加载最后一次输入
 * @param {string} key - 存储键名
 * @returns {Object|null} 输入数据
 */
function loadLastInput(key) {
  try {
    const data = localStorage.getItem(`${key}_last`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('加载输入失败:', error);
    return null;
  }
}

/**
 * 四舍五入到指定小数位
 * @param {number} value - 数值
 * @param {number} [decimals=2] - 小数位数
 * @returns {number} 四舍五入后的数值
 */
function round(value, decimals = 2) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * 检查localStorage是否可用
 * @returns {boolean} 是否可用
 */
function isLocalStorageAvailable() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 显示输入错误
 * @param {string} inputId - 输入框ID
 * @param {string} errorMessage - 错误消息
 * @returns {void}
 */
function showInputError(inputId, errorMessage) {
  const input = document.getElementById(inputId);
  const errorElement = document.getElementById(`${inputId}-error`);
  
  if (input) {
    input.classList.add('error');
  }
  
  if (errorElement) {
    errorElement.textContent = errorMessage;
  }
}

/**
 * 清除输入错误
 * @param {string} inputId - 输入框ID
 * @returns {void}
 */
function clearInputError(inputId) {
  const input = document.getElementById(inputId);
  const errorElement = document.getElementById(`${inputId}-error`);
  
  if (input) {
    input.classList.remove('error');
  }
  
  if (errorElement) {
    errorElement.textContent = '';
  }
}

/**
 * 清除所有输入错误
 * @returns {void}
 */
function clearAllInputErrors() {
  const inputs = document.querySelectorAll('.input.error');
  inputs.forEach(input => {
    input.classList.remove('error');
  });
  
  const errors = document.querySelectorAll('.input-error');
  errors.forEach(error => {
    error.textContent = '';
  });
}

/**
 * 获取表单数据
 * @param {string} formId - 表单ID
 * @returns {Object} 表单数据对象
 */
function getFormData(formId) {
  const form = document.getElementById(formId);
  if (!form) {
    return {};
  }
  
  const data = {};
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    const id = input.id;
    const type = input.type;
    
    if (type === 'radio') {
      if (input.checked) {
        data[id] = input.value;
      }
    } else if (type === 'checkbox') {
      data[id] = input.checked;
    } else {
      data[id] = input.value;
    }
  });
  
  return data;
}

/**
 * 设置表单数据
 * @param {string} formId - 表单ID
 * @param {Object} data - 数据对象
 * @returns {void}
 */
function setFormData(formId, data) {
  const form = document.getElementById(formId);
  if (!form) {
    return;
  }
  
  Object.entries(data).forEach(([key, value]) => {
    const input = document.getElementById(key);
    if (!input) {
      return;
    }
    
    const type = input.type;
    
    if (type === 'radio') {
      if (input.value === value) {
        input.checked = true;
      }
    } else if (type === 'checkbox') {
      input.checked = value;
    } else {
      input.value = value;
    }
  });
}

// 导出供测试使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatCurrency,
    formatPercent,
    validateNumber,
    validateRequired,
    saveToHistory,
    loadHistory,
    clearHistory,
    saveLastInput,
    loadLastInput,
    round,
    isLocalStorageAvailable,
    showInputError,
    clearInputError,
    clearAllInputErrors,
    getFormData,
    setFormData
  };
}
