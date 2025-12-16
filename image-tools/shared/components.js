/**
 * 图片工具套件 - 共享组件库
 */

/**
 * 文件上传组件
 * 需求: 1.1, 13.1
 */
class ImageUploader {
  constructor(options = {}) {
    this.acceptTypes = options.acceptTypes || ['.jpg', '.jpeg', '.png', '.webp', '.bmp', 'image/*'];
    this.multiple = options.multiple || false;
    this.maxSize = options.maxSize || 20 * 1024 * 1024; // 20MB
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
      Utils.showError(`文件 "${file.name}" 不是有效的图片文件`);
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
   * 读取文件为 Data URL
   * @param {File} file - 文件对象
   * @returns {Promise<string>} Data URL
   */
  readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = () => {
        reject(new Error('文件读取失败，请重试'));
      };
      
      reader.readAsDataURL(file);
    });
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
 * 图片预览组件
 * 需求: 1.1, 13.2
 */
class ImageViewer {
  constructor(container, options = {}) {
    this.container = container;
    this.canvas = null;
    this.context = null;
    this.currentImage = null;
    
    this._initCanvas();
  }

  /**
   * 初始化 Canvas
   * @private
   */
  _initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'image-canvas';
    this.context = this.canvas.getContext('2d');
  }

  /**
   * 加载图片
   * @param {string} src - 图片源（Data URL 或 URL）
   * @returns {Promise<HTMLImageElement>} 加载的图片对象
   */
  async loadImage(src) {
    try {
      const img = await Utils.loadImageToCanvas(src, this.canvas);
      this.currentImage = img;
      
      // 将 canvas 添加到容器
      if (!this.canvas.parentElement) {
        this.container.appendChild(this.canvas);
      }
      
      return img;
    } catch (error) {
      throw new Error('图片加载失败: ' + error.message);
    }
  }

  /**
   * 清除显示
   */
  clear() {
    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
    this._initCanvas();
    this.currentImage = null;
  }

  /**
   * 获取 Canvas 元素
   * @returns {HTMLCanvasElement} Canvas 元素
   */
  getCanvas() {
    return this.canvas;
  }

  /**
   * 获取 Canvas 上下文
   * @returns {CanvasRenderingContext2D} Canvas 上下文
   */
  getContext() {
    return this.context;
  }

  /**
   * 导出为 Blob
   * @param {string} type - MIME 类型
   * @param {number} quality - 质量 (0-1)
   * @returns {Promise<Blob>} Blob 对象
   */
  toBlob(type = 'image/png', quality = 0.92) {
    return Utils.canvasToBlob(this.canvas, type, quality);
  }

  /**
   * 导出为 Data URL
   * @param {string} type - MIME 类型
   * @param {number} quality - 质量 (0-1)
   * @returns {string} Data URL
   */
  toDataURL(type = 'image/png', quality = 0.92) {
    return this.canvas.toDataURL(type, quality);
  }

  /**
   * 更新 Canvas 内容
   * @param {HTMLCanvasElement} newCanvas - 新的 Canvas
   */
  updateCanvas(newCanvas) {
    this.canvas.width = newCanvas.width;
    this.canvas.height = newCanvas.height;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(newCanvas, 0, 0);
  }
}

/**
 * 进度指示器组件
 * 需求: 12.5
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
  module.exports = { ImageUploader, ImageViewer, ProgressIndicator };
}
