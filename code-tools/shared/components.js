/**
 * 代码工具套件 - 共享组件库
 */

/**
 * 代码编辑器组件
 */
class CodeEditor {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    this.options = {
      placeholder: '在此输入内容...',
      readOnly: false,
      minHeight: '200px',
      ...options
    };
    this.textarea = null;
    this._init();
  }

  _init() {
    this.textarea = document.createElement('textarea');
    this.textarea.className = 'editor';
    this.textarea.placeholder = this.options.placeholder;
    this.textarea.style.minHeight = this.options.minHeight;
    
    if (this.options.readOnly) {
      this.textarea.readOnly = true;
    }

    if (this.options.id) {
      this.textarea.id = this.options.id;
    }

    this.container.appendChild(this.textarea);

    // 支持 Tab 键缩进
    this.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const value = this.textarea.value;
        this.textarea.value = value.substring(0, start) + '  ' + value.substring(end);
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;
      }
    });
  }

  setValue(value) {
    this.textarea.value = value;
    return this;
  }

  getValue() {
    return this.textarea.value;
  }

  clear() {
    this.textarea.value = '';
    this.textarea.classList.remove('error');
    return this;
  }

  focus() {
    this.textarea.focus();
    return this;
  }

  setReadOnly(readOnly) {
    this.textarea.readOnly = readOnly;
    return this;
  }

  setError(hasError) {
    if (hasError) {
      this.textarea.classList.add('error');
    } else {
      this.textarea.classList.remove('error');
    }
    return this;
  }

  onChange(callback) {
    this.textarea.addEventListener('input', callback);
    return this;
  }
}

/**
 * 文件处理组件
 */
class FileHandler {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB
  }

  /**
   * 上传文件
   */
  uploadFile(acceptTypes = ['.txt', '.json']) {
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
          reject(new Error(`文件过大，最大支持 ${CodeUtils.formatFileSize(this.maxSize)}`));
          return;
        }

        resolve(file);
      };

      input.click();
    });
  }

  /**
   * 读取文件为文本
   */
  readAsText(file) {
    return CodeUtils.readFileAsText(file);
  }

  /**
   * 读取文件为 DataURL
   */
  readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * 下载文件
   */
  downloadFile(content, filename, mimeType) {
    CodeUtils.downloadFile(content, filename, mimeType);
  }

  /**
   * 复制到剪贴板
   */
  copyToClipboard(text) {
    return CodeUtils.copyToClipboard(text);
  }
}

/**
 * 标签页组件
 */
class TabPanel {
  constructor(container, tabs = []) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    this.tabs = tabs;
    this.activeTab = tabs.length > 0 ? tabs[0].id : null;
    this.callbacks = [];
    this._init();
  }

  _init() {
    // 创建标签栏
    const tabBar = document.createElement('div');
    tabBar.className = 'tabs';

    this.tabs.forEach(tab => {
      const tabBtn = document.createElement('button');
      tabBtn.className = 'tab' + (tab.id === this.activeTab ? ' active' : '');
      tabBtn.textContent = tab.label;
      tabBtn.dataset.tabId = tab.id;
      
      tabBtn.addEventListener('click', () => this.switchTab(tab.id));
      tabBar.appendChild(tabBtn);
    });

    this.container.insertBefore(tabBar, this.container.firstChild);

    // 初始化内容显示
    this._updateContent();
  }

  _updateContent() {
    this.tabs.forEach(tab => {
      const content = document.getElementById(tab.id);
      if (content) {
        content.classList.toggle('active', tab.id === this.activeTab);
      }
    });

    // 更新标签按钮状态
    const tabBtns = this.container.querySelectorAll('.tab');
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tabId === this.activeTab);
    });
  }

  switchTab(tabId) {
    if (this.activeTab === tabId) return;
    
    this.activeTab = tabId;
    this._updateContent();
    
    // 触发回调
    this.callbacks.forEach(cb => cb(tabId));
  }

  getActiveTab() {
    return this.activeTab;
  }

  onChange(callback) {
    this.callbacks.push(callback);
    return this;
  }
}

/**
 * 拖拽上传区域组件
 */
class DropZone {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    this.options = {
      accept: ['image/*'],
      maxSize: 10 * 1024 * 1024,
      onFile: null,
      ...options
    };
    this._init();
  }

  _init() {
    this.container.classList.add('upload-area');
    this.container.innerHTML = `
      <div class="upload-icon">📁</div>
      <div class="upload-text">点击或拖拽文件到此处</div>
      <div class="upload-hint">支持的格式: ${this.options.accept.join(', ')}</div>
    `;

    // 点击上传
    this.container.addEventListener('click', () => this._selectFile());

    // 拖拽事件
    this.container.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.container.classList.add('dragover');
    });

    this.container.addEventListener('dragleave', () => {
      this.container.classList.remove('dragover');
    });

    this.container.addEventListener('drop', (e) => {
      e.preventDefault();
      this.container.classList.remove('dragover');
      
      const file = e.dataTransfer.files[0];
      if (file) this._handleFile(file);
    });
  }

  _selectFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = this.options.accept.join(',');
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) this._handleFile(file);
    };
    
    input.click();
  }

  _handleFile(file) {
    if (file.size > this.options.maxSize) {
      CodeUtils.showError(`文件过大，最大支持 ${CodeUtils.formatFileSize(this.options.maxSize)}`);
      return;
    }

    if (this.options.onFile) {
      this.options.onFile(file);
    }
  }
}

/**
 * 差异查看器组件
 */
class DiffViewer {
  constructor(container) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
  }

  render(diffs) {
    this.container.innerHTML = '';

    if (!diffs || diffs.length === 0) {
      this.container.innerHTML = '<p style="text-align: center; color: #27ae60; padding: 20px;">✓ 内容完全一致，无差异</p>';
      return;
    }

    // 检查是否有实际差异
    const hasDiff = diffs.some(d => d.type !== 'unchanged');
    if (!hasDiff) {
      this.container.innerHTML = '<p style="text-align: center; color: #27ae60; padding: 20px;">✓ 内容完全一致，无差异</p>';
      return;
    }

    const diffView = document.createElement('div');
    diffView.className = 'diff-view';

    diffs.forEach(diff => {
      const line = document.createElement('span');
      line.className = `diff-${diff.type}`;
      line.textContent = diff.content;
      diffView.appendChild(line);
    });

    this.container.appendChild(diffView);

    // 添加统计信息
    const stats = this._calculateStats(diffs);
    const statsEl = document.createElement('div');
    statsEl.className = 'stats';
    statsEl.innerHTML = `
      <div class="stat-item">
        <div class="stat-value" style="color: #27ae60;">${stats.added}</div>
        <div class="stat-label">新增</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" style="color: #e74c3c;">${stats.deleted}</div>
        <div class="stat-label">删除</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.unchanged}</div>
        <div class="stat-label">未变</div>
      </div>
    `;
    this.container.appendChild(statsEl);
  }

  _calculateStats(diffs) {
    return diffs.reduce((acc, diff) => {
      acc[diff.type] = (acc[diff.type] || 0) + diff.content.length;
      return acc;
    }, { added: 0, deleted: 0, unchanged: 0 });
  }
}

/**
 * 可编辑表格组件
 */
class EditableTable {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    this.options = {
      rows: 3,
      cols: 3,
      headers: [],
      data: [],
      ...options
    };
    this.data = this.options.data.length > 0 
      ? this.options.data 
      : this._createEmptyData();
    this._init();
  }

  _createEmptyData() {
    const data = [];
    for (let i = 0; i < this.options.rows; i++) {
      data.push(new Array(this.options.cols).fill(''));
    }
    return data;
  }

  _init() {
    this.render();
  }

  render() {
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-container';

    const table = document.createElement('table');
    table.className = 'data-table';

    // 渲染表头
    if (this.data.length > 0) {
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      
      this.data[0].forEach((_, colIndex) => {
        const th = document.createElement('th');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = this.data[0][colIndex] || '';
        input.placeholder = `列 ${colIndex + 1}`;
        input.addEventListener('input', (e) => {
          this.data[0][colIndex] = e.target.value;
        });
        th.appendChild(input);
        headerRow.appendChild(th);
      });

      // 添加操作列
      const actionTh = document.createElement('th');
      actionTh.style.width = '60px';
      actionTh.textContent = '操作';
      headerRow.appendChild(actionTh);

      thead.appendChild(headerRow);
      table.appendChild(thead);
    }

    // 渲染数据行
    const tbody = document.createElement('tbody');
    for (let i = 1; i < this.data.length; i++) {
      const tr = document.createElement('tr');
      
      this.data[i].forEach((cell, colIndex) => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = cell || '';
        input.addEventListener('input', (e) => {
          this.data[i][colIndex] = e.target.value;
        });
        td.appendChild(input);
        tr.appendChild(td);
      });

      // 删除行按钮
      const actionTd = document.createElement('td');
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger';
      deleteBtn.style.padding = '4px 8px';
      deleteBtn.style.fontSize = '12px';
      deleteBtn.textContent = '删除';
      deleteBtn.addEventListener('click', () => this.deleteRow(i));
      actionTd.appendChild(deleteBtn);
      tr.appendChild(actionTd);

      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    tableContainer.appendChild(table);

    // 添加操作按钮
    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';
    btnGroup.style.marginTop = '10px';

    const addRowBtn = document.createElement('button');
    addRowBtn.className = 'btn btn-secondary';
    addRowBtn.textContent = '+ 添加行';
    addRowBtn.addEventListener('click', () => this.addRow());

    const addColBtn = document.createElement('button');
    addColBtn.className = 'btn btn-secondary';
    addColBtn.textContent = '+ 添加列';
    addColBtn.addEventListener('click', () => this.addColumn());

    btnGroup.appendChild(addRowBtn);
    btnGroup.appendChild(addColBtn);

    this.container.innerHTML = '';
    this.container.appendChild(tableContainer);
    this.container.appendChild(btnGroup);
  }

  addRow() {
    const cols = this.data[0] ? this.data[0].length : this.options.cols;
    this.data.push(new Array(cols).fill(''));
    this.render();
  }

  addColumn() {
    this.data.forEach(row => row.push(''));
    this.render();
  }

  deleteRow(index) {
    if (this.data.length > 2) { // 保留表头和至少一行数据
      this.data.splice(index, 1);
      this.render();
    }
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
    this.render();
  }

  toCSV() {
    return this.data.map(row => 
      row.map(cell => {
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          return '"' + cell.replace(/"/g, '""') + '"';
        }
        return cell;
      }).join(',')
    ).join('\n');
  }

  toMarkdown() {
    if (this.data.length === 0) return '';
    
    const formatRow = row => '| ' + row.join(' | ') + ' |';
    const separator = this.data[0].map(() => '---');
    
    return [
      formatRow(this.data[0]),
      formatRow(separator),
      ...this.data.slice(1).map(formatRow)
    ].join('\n');
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CodeEditor, FileHandler, TabPanel, DropZone, DiffViewer, EditableTable };
}
