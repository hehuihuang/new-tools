/**
 * 图片工具套件 - 共享工具函数
 */

const Utils = {
  /**
   * 验证文件类型
   * @param {File} file - 文件对象
   * @param {Array<string>} acceptTypes - 接受的类型数组
   * @returns {boolean} 是否有效
   */
  validateFileType(file, acceptTypes) {
    if (!file || !file.type) return false;
    
    // 检查 MIME 类型
    const mimeType = file.type.toLowerCase();
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp'];
    
    if (validMimes.includes(mimeType)) {
      return true;
    }
    
    // 检查文件扩展名
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.bmp'];
    
    return validExtensions.some(ext => fileName.endsWith(ext));
  },

  /**
   * 验证文件大小
   * @param {File} file - 文件对象
   * @param {number} maxSize - 最大大小（字节）
   * @returns {boolean} 是否有效
   */
  validateFileSize(file, maxSize) {
    return file && file.size <= maxSize;
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
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * 下载文件
   * @param {Blob} blob - Blob 对象
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
    
    // 延迟释放 URL 对象
    setTimeout(() => URL.revokeObjectURL(url), 100);
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
   * 显示消息
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型 ('success' | 'error')
   */
  showMessage(message, type) {
    // 移除现有消息
    const existing = document.querySelector('.message');
    if (existing) {
      existing.remove();
    }

    // 创建新消息
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type} show`;
    messageEl.textContent = message;
    
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
   * 隐藏消息
   */
  hideMessage() {
    const message = document.querySelector('.message');
    if (message) {
      message.classList.remove('show');
      setTimeout(() => message.remove(), 300);
    }
  },

  /**
   * 加载图片到 Canvas
   * @param {string} src - 图片源（Data URL 或 URL）
   * @param {HTMLCanvasElement} canvas - Canvas 元素
   * @returns {Promise<HTMLImageElement>} 加载的图片对象
   */
  loadImageToCanvas(src, canvas) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        resolve(img);
      };
      
      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };
      
      img.src = src;
    });
  },

  /**
   * 调整 Canvas 尺寸
   * @param {HTMLCanvasElement} sourceCanvas - 源 Canvas
   * @param {number} width - 目标宽度
   * @param {number} height - 目标高度
   * @returns {HTMLCanvasElement} 新的 Canvas
   */
  resizeCanvas(sourceCanvas, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sourceCanvas, 0, 0, width, height);
    
    return canvas;
  },

  /**
   * 旋转 Canvas
   * @param {HTMLCanvasElement} sourceCanvas - 源 Canvas
   * @param {number} degrees - 旋转角度（90, 180, 270）
   * @returns {HTMLCanvasElement} 新的 Canvas
   */
  rotateCanvas(sourceCanvas, degrees) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 90度或270度旋转需要交换宽高
    if (degrees === 90 || degrees === 270) {
      canvas.width = sourceCanvas.height;
      canvas.height = sourceCanvas.width;
    } else {
      canvas.width = sourceCanvas.width;
      canvas.height = sourceCanvas.height;
    }
    
    ctx.save();
    
    // 移动到中心点
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // 旋转
    ctx.rotate((degrees * Math.PI) / 180);
    
    // 绘制图片
    ctx.drawImage(sourceCanvas, -sourceCanvas.width / 2, -sourceCanvas.height / 2);
    
    ctx.restore();
    
    return canvas;
  },

  /**
   * 翻转 Canvas
   * @param {HTMLCanvasElement} sourceCanvas - 源 Canvas
   * @param {boolean} horizontal - 是否水平翻转
   * @param {boolean} vertical - 是否垂直翻转
   * @returns {HTMLCanvasElement} 新的 Canvas
   */
  flipCanvas(sourceCanvas, horizontal, vertical) {
    const canvas = document.createElement('canvas');
    canvas.width = sourceCanvas.width;
    canvas.height = sourceCanvas.height;
    
    const ctx = canvas.getContext('2d');
    ctx.save();
    
    // 设置缩放
    const scaleX = horizontal ? -1 : 1;
    const scaleY = vertical ? -1 : 1;
    
    // 设置变换
    ctx.translate(horizontal ? canvas.width : 0, vertical ? canvas.height : 0);
    ctx.scale(scaleX, scaleY);
    
    // 绘制图片
    ctx.drawImage(sourceCanvas, 0, 0);
    
    ctx.restore();
    
    return canvas;
  },

  /**
   * 应用滤镜
   * @param {HTMLCanvasElement} canvas - Canvas 元素
   * @param {string} filterType - 滤镜类型
   * @param {number} intensity - 强度 (0-100)
   */
  applyFilter(canvas, filterType, intensity = 100) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const factor = intensity / 100;
    
    switch (filterType) {
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          data[i] = data[i] + (gray - data[i]) * factor;
          data[i + 1] = data[i + 1] + (gray - data[i + 1]) * factor;
          data[i + 2] = data[i + 2] + (gray - data[i + 2]) * factor;
        }
        break;
        
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          const tr = 0.393 * r + 0.769 * g + 0.189 * b;
          const tg = 0.349 * r + 0.686 * g + 0.168 * b;
          const tb = 0.272 * r + 0.534 * g + 0.131 * b;
          
          data[i] = Math.min(255, r + (tr - r) * factor);
          data[i + 1] = Math.min(255, g + (tg - g) * factor);
          data[i + 2] = Math.min(255, b + (tb - b) * factor);
        }
        break;
        
      case 'invert':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = data[i] + (255 - data[i] - data[i]) * factor;
          data[i + 1] = data[i + 1] + (255 - data[i + 1] - data[i + 1]) * factor;
          data[i + 2] = data[i + 2] + (255 - data[i + 2] - data[i + 2]) * factor;
        }
        break;
        
      case 'brightness':
        const brightness = (factor - 0.5) * 100;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.max(0, Math.min(255, data[i] + brightness));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness));
        }
        break;
        
      case 'contrast':
        const contrast = factor * 2;
        const intercept = 128 * (1 - contrast);
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.max(0, Math.min(255, data[i] * contrast + intercept));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * contrast + intercept));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * contrast + intercept));
        }
        break;
    }
    
    ctx.putImageData(imageData, 0, 0);
  },

  /**
   * 获取图片格式
   * @param {File} file - 文件对象
   * @returns {string} 格式名称
   */
  getImageFormat(file) {
    const type = file.type.toLowerCase();
    if (type.includes('jpeg') || type.includes('jpg')) return 'JPEG';
    if (type.includes('png')) return 'PNG';
    if (type.includes('webp')) return 'WEBP';
    if (type.includes('bmp')) return 'BMP';
    return 'Unknown';
  },

  /**
   * 获取 MIME 类型
   * @param {string} format - 格式名称
   * @returns {string} MIME 类型
   */
  getMimeType(format) {
    const mimeTypes = {
      'JPEG': 'image/jpeg',
      'JPG': 'image/jpeg',
      'PNG': 'image/png',
      'WEBP': 'image/webp',
      'BMP': 'image/bmp'
    };
    return mimeTypes[format.toUpperCase()] || 'image/png';
  },

  /**
   * Canvas 转 Blob
   * @param {HTMLCanvasElement} canvas - Canvas 元素
   * @param {string} type - MIME 类型
   * @param {number} quality - 质量 (0-1)
   * @returns {Promise<Blob>} Blob 对象
   */
  canvasToBlob(canvas, type = 'image/png', quality = 0.92) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('生成 Blob 失败'));
          }
        },
        type,
        quality
      );
    });
  },

  /**
   * 计算保持宽高比的尺寸
   * @param {number} originalWidth - 原始宽度
   * @param {number} originalHeight - 原始高度
   * @param {number} targetWidth - 目标宽度（可选）
   * @param {number} targetHeight - 目标高度（可选）
   * @returns {Object} {width, height}
   */
  calculateAspectRatio(originalWidth, originalHeight, targetWidth, targetHeight) {
    const aspectRatio = originalWidth / originalHeight;
    
    if (targetWidth && !targetHeight) {
      return {
        width: targetWidth,
        height: Math.round(targetWidth / aspectRatio)
      };
    }
    
    if (targetHeight && !targetWidth) {
      return {
        width: Math.round(targetHeight * aspectRatio),
        height: targetHeight
      };
    }
    
    return {
      width: targetWidth || originalWidth,
      height: targetHeight || originalHeight
    };
  }
};

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
