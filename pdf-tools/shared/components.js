/**
 * PDF 工具套件 - 共享组件库
 */

/**
 * 文件上传组件
 * 需求: 1.1, 10.1
 */
class FileUploader {
  constructor(options = {}) {
    this.acceptTypes = options.acceptTypes || ['.pdf', 'application/pdf'];
    this.multiple = options.multiple || false;
    this.maxSize = options.maxSize || 50 * 1024 * 1024; // 50MB
    this.onFilesSelected = options.onFilesSelected || null;
  }

  /**
   * 触发文件选择
   * @returns {Promise<File[]>} 选中的文件数组
   */
  selectFiles() {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = this.acceptTypes.join(',');
      input.multiple = this.multiple;

      input.onchange = (e) => {
        const files = Array.from(e.target.files);
        
        // 验证所有文件
        const validFiles = [];
        for (const file of files) {
          if (!this.validateFile(file)) {
            continue;
          }
          validFiles.push(file);
        }

        if (validFiles.length === 0) {
          reject(new Error('没有有效的文件'));
          return;
        }

        if (this.onFilesSelected) {
          this.onFilesSelected(validFiles);
        }

        resolve(validFiles);
      };

      input.click();
    });
  }

  /**
   * 验证文件
   * @param {File} file - 文件对象
   * @returns {boolean} 是否有效
   */
  validateFile(file) {
    // 验证文件类型
    if (!Utils.validateFileType(file, this.acceptTypes)) {
      Utils.showError(`文件 "${file.name}" 不是有效的 PDF 文件`);
      return false;
    }

    // 验证文件大小
    if (!Utils.validateFileSize(file, this.maxSize)) {
      Utils.showError(`文件 "${file.name}" 超过大小限制（最大 ${Utils.formatFileSize(this.maxSize)}）`);
      return false;
    }

    return true;
  }

  /**
   * 读取文件为 ArrayBuffer
   * @param {File} file - 文件对象
   * @returns {Promise<ArrayBuffer>} 文件内容
   */
  readAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = () => {
        reject(new Error('文件读取失败，请重试'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 设置拖拽上传区域
   * @param {HTMLElement} element - 拖拽区域元素
   * @param {Function} callback - 文件选择回调
   */
  setupDropZone(element, callback) {
    element.addEventListener('dragover', (e) => {
      e.preventDefault();
      element.classList.add('dragover');
    });

    element.addEventListener('dragleave', () => {
      element.classList.remove('dragover');
    });

    element.addEventListener('drop', async (e) => {
      e.preventDefault();
      element.classList.remove('dragover');

      const files = Array.from(e.dataTransfer.files);
      const validFiles = [];

      for (const file of files) {
        if (this.validateFile(file)) {
          validFiles.push(file);
        }
      }

      if (validFiles.length > 0) {
        if (callback) {
          callback(validFiles);
        }
        if (this.onFilesSelected) {
          this.onFilesSelected(validFiles);
        }
      }
    });
  }
}

/**
 * PDF 预览组件
 * 需求: 1.1, 1.2, 1.3, 1.5
 */
class PDFViewer {
  constructor(container, options = {}) {
    this.container = container;
    this.scale = options.scale || 1.0;
    this.currentPage = 1;
    this.pdfDoc = null;
    this.canvas = null;
    this.context = null;
    
    this._initCanvas();
  }

  /**
   * 初始化 Canvas
   * @private
   */
  _initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'pdf-canvas';
    this.context = this.canvas.getContext('2d');
  }

  /**
   * 加载 PDF 文档
   * @param {ArrayBuffer} arrayBuffer - PDF 文件内容
   * @returns {Promise<void>}
   */
  async loadDocument(arrayBuffer) {
    try {
      // 清除之前的内容
      this.clear();

      // 配置 PDF.js worker
      if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }

      // 加载 PDF - 禁用存储以避免 file:// 协议错误
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        disableAutoFetch: true,
        disableStream: true
      });
      this.pdfDoc = await loadingTask.promise;
      
      // 渲染第一页
      this.currentPage = 1;
      await this.renderPage(1);

      return this.pdfDoc;
    } catch (error) {
      throw new Error('PDF 文件损坏或格式不支持');
    }
  }

  /**
   * 渲染指定页面
   * @param {number} pageNum - 页码
   * @returns {Promise<void>}
   */
  async renderPage(pageNum) {
    if (!this.pdfDoc) {
      throw new Error('未加载 PDF 文档');
    }

    if (pageNum < 1 || pageNum > this.pdfDoc.numPages) {
      throw new Error(`页码超出范围 (1-${this.pdfDoc.numPages})`);
    }

    const page = await this.pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: this.scale });

    // 设置 canvas 尺寸
    this.canvas.width = viewport.width;
    this.canvas.height = viewport.height;

    // 渲染页面
    const renderContext = {
      canvasContext: this.context,
      viewport: viewport
    };

    await page.render(renderContext).promise;
    
    // 将 canvas 添加到容器
    if (!this.canvas.parentElement) {
      this.container.appendChild(this.canvas);
    }

    this.currentPage = pageNum;
  }

  /**
   * 放大
   */
  zoomIn() {
    this.scale += 0.25;
    this.renderPage(this.currentPage);
  }

  /**
   * 缩小
   */
  zoomOut() {
    if (this.scale > 0.5) {
      this.scale -= 0.25;
      this.renderPage(this.currentPage);
    }
  }

  /**
   * 适应页面
   */
  fitToPage() {
    const containerWidth = this.container.clientWidth - 40;
    this.scale = containerWidth / this.canvas.width * this.scale;
    this.renderPage(this.currentPage);
  }

  /**
   * 下一页
   */
  nextPage() {
    if (this.currentPage < this.pdfDoc.numPages) {
      this.renderPage(this.currentPage + 1);
    }
  }

  /**
   * 上一页
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.renderPage(this.currentPage - 1);
    }
  }

  /**
   * 跳转到指定页
   * @param {number} pageNum - 页码
   */
  goToPage(pageNum) {
    this.renderPage(pageNum);
  }

  /**
   * 获取总页数
   * @returns {number} 总页数
   */
  getPageCount() {
    return this.pdfDoc ? this.pdfDoc.numPages : 0;
  }

  /**
   * 清除预览内容
   */
  clear() {
    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
    this._initCanvas();
    this.pdfDoc = null;
    this.currentPage = 1;
  }
}

/**
 * 进度指示器组件
 * 需求: 2.3, 3.4, 5.4
 */
class ProgressIndicator {
  constructor() {
    this.overlay = null;
    this._createOverlay();
  }

  /**
   * 创建进度遮罩层
   * @private
   */
  _createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'progress-overlay';
    this.overlay.innerHTML = `
      <div class="progress-content">
        <div class="progress-spinner"></div>
        <p class="progress-message">处理中...</p>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: 0%"></div>
        </div>
        <p class="progress-percent">0%</p>
      </div>
    `;
    document.body.appendChild(this.overlay);
  }

  /**
   * 显示进度
   * @param {string} message - 进度消息
   */
  show(message = '处理中...') {
    const messageEl = this.overlay.querySelector('.progress-message');
    messageEl.textContent = message;
    this.overlay.classList.add('show');
  }

  /**
   * 更新进度
   * @param {number} percent - 进度百分比 (0-100)
   * @param {string} message - 进度消息
   */
  update(percent, message = '') {
    const fillEl = this.overlay.querySelector('.progress-bar-fill');
    const percentEl = this.overlay.querySelector('.progress-percent');
    const messageEl = this.overlay.querySelector('.progress-message');

    fillEl.style.width = `${percent}%`;
    percentEl.textContent = `${Math.round(percent)}%`;
    
    if (message) {
      messageEl.textContent = message;
    }
  }

  /**
   * 隐藏进度
   */
  hide() {
    this.overlay.classList.remove('show');
    // 重置进度
    setTimeout(() => {
      this.update(0, '处理中...');
    }, 300);
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FileUploader, PDFViewer, ProgressIndicator };
}
