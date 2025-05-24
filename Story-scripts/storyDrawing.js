class StoryDrawing {
  constructor(editorInstance) {
    this.editor = editorInstance;
    this.isDrawing = false;
    this.currentColor = '#ffffff';
    this.currentSize = 5;
    this.initDrawingPanel();
    this.setupCanvas();
  }

  initDrawingPanel() {
    this.drawingPanel = document.createElement('div');
    this.drawingPanel.className = 'drawing-panel';
    
    // Color selection
    const colors = [
      '#ffffff', '#000000', '#ff0000', '#00ff00', 
      '#0000ff', '#ffff00', '#ff00ff', '#00ffff'
    ];
    const colorPalette = document.createElement('div');
    colorPalette.className = 'color-palette';
    
    colors.forEach(color => {
      const colorBtn = document.createElement('button');
      colorBtn.className = 'color-btn';
      colorBtn.style.backgroundColor = color;
      colorBtn.addEventListener('click', () => {
        this.currentColor = color;
      });
      colorPalette.appendChild(colorBtn);
    });
    
    // Brush size
    const sizeContainer = document.createElement('div');
    sizeContainer.className = 'size-container';
    
    const sizeLabel = document.createElement('span');
    sizeLabel.textContent = 'Size: ';
    
    this.sizeInput = document.createElement('input');
    this.sizeInput.type = 'range';
    this.sizeInput.min = '1';
    this.sizeInput.max = '30';
    this.sizeInput.value = this.currentSize;
    this.sizeInput.addEventListener('input', (e) => {
      this.currentSize = e.target.value;
    });
    
    // Brush preview
    this.brushPreview = document.createElement('div');
    this.brushPreview.className = 'brush-preview';
    this.updateBrushPreview();
    
    sizeContainer.append(sizeLabel, this.sizeInput, this.brushPreview);
    
    // Clear button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'drawing-btn';
    clearBtn.textContent = 'Clear';
    clearBtn.addEventListener('click', () => {
      this.clearCanvas();
    });
    
    // Undo button
    const undoBtn = document.createElement('button');
    undoBtn.className = 'drawing-btn';
    undoBtn.textContent = 'Undo';
    undoBtn.addEventListener('click', () => {
      this.undoLastStroke();
    });
    
    this.drawingPanel.append(colorPalette, sizeContainer, clearBtn, undoBtn);
    this.editor.editorContainer.appendChild(this.drawingPanel);
    
    // Update brush preview when size changes
    this.sizeInput.addEventListener('input', () => {
      this.updateBrushPreview();
    });
  }

  updateBrushPreview() {
    this.brushPreview.style.width = `${this.currentSize}px`;
    this.brushPreview.style.height = `${this.currentSize}px`;
    this.brushPreview.style.backgroundColor = this.currentColor;
    this.brushPreview.style.borderRadius = `${this.currentSize/2}px`;
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'drawing-canvas';
    
    const mediaDisplay = this.editor.mediaDisplay;
    const mediaElement = mediaDisplay.querySelector('img, video');
    
    if (mediaElement) {
      const width = mediaElement.videoWidth || mediaElement.naturalWidth;
      const height = mediaElement.videoHeight || mediaElement.naturalHeight;
      
      this.canvas.width = width;
      this.canvas.height = height;
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
    } else {
      const rect = mediaDisplay.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    
    mediaDisplay.appendChild(this.canvas);
    
    // Drawing event listeners
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
    
    // Touch support
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
    
    // Store drawing data for undo
    this.drawingHistory = [];
    this.saveDrawingState();
  }

  startDrawing(e) {
    this.isDrawing = true;
    this.lastX = e.offsetX || e.layerX;
    this.lastY = e.offsetY || e.layerY;
    
    // Begin new path
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    
    // Draw initial dot
    this.ctx.arc(this.lastX, this.lastY, this.currentSize/2, 0, Math.PI*2);
    this.ctx.fillStyle = this.currentColor;
    this.ctx.fill();
    
    // Begin new path for the line
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
  }

  draw(e) {
    if (!this.isDrawing) return;
    
    const x = e.offsetX || e.layerX;
    const y = e.offsetY || e.layerY;
    
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.currentSize;
    
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    
    this.lastX = x;
    this.lastY = y;
  }

  handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    this.canvas.dispatchEvent(mouseEvent);
  }

  handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    this.canvas.dispatchEvent(mouseEvent);
  }

  stopDrawing() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.saveDrawingState();
    }
  }

  saveDrawingState() {
    // Save current canvas state to history
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.drawingHistory.push(imageData);
    
    // Limit history size
    if (this.drawingHistory.length > 20) {
      this.drawingHistory.shift();
    }
  }

  undoLastStroke() {
    if (this.drawingHistory.length > 1) {
      this.drawingHistory.pop(); // Remove current state
      const prevState = this.drawingHistory[this.drawingHistory.length - 1];
      this.ctx.putImageData(prevState, 0, 0);
    } else if (this.drawingHistory.length === 1) {
      this.clearCanvas();
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawingHistory = [];
    this.saveDrawingState();
  }
}
