class MediaCropper {
  constructor(mediaElement, callback) {
    this.mediaElement = mediaElement;
    this.callback = callback;
    this.initCropper();
  }

  initCropper() {
    this.cropperContainer = document.createElement('div');
    this.cropperContainer.className = 'cropper-container';
    
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'cropper-overlay';
    
    // Create crop area
    this.cropArea = document.createElement('div');
    this.cropArea.className = 'crop-area';
    
    // Create handles
    const createHandle = (className) => {
      const handle = document.createElement('div');
      handle.className = `crop-handle ${className}`;
      return handle;
    };
    
    this.handles = {
      topLeft: createHandle('top-left'),
      topRight: createHandle('top-right'),
      bottomLeft: createHandle('bottom-left'),
      bottomRight: createHandle('bottom-right')
    };
    
    // Add all elements to crop area
    this.cropArea.append(
      this.handles.topLeft,
      this.handles.topRight,
      this.handles.bottomLeft,
      this.handles.bottomRight
    );
    
    // Create action buttons
    this.cropBtn = document.createElement('button');
    this.cropBtn.className = 'crop-btn';
    this.cropBtn.textContent = 'Crop';
    this.cropBtn.addEventListener('click', this.applyCrop.bind(this));
    
    this.cancelBtn = document.createElement('button');
    this.cancelBtn.className = 'cancel-btn';
    this.cancelBtn.textContent = 'Cancel';
    this.cancelBtn.addEventListener('click', this.cancelCrop.bind(this));
    
    // Add all to container
    this.cropperContainer.append(
      this.mediaElement.cloneNode(),
      this.overlay,
      this.cropArea,
      this.cropBtn,
      this.cancelBtn
    );
    
    document.body.appendChild(this.cropperContainer);
    
    // Initialize crop area dimensions
    this.initCropArea();
    this.setupDragHandlers();
  }

  initCropArea() {
    const mediaRect = this.mediaElement.getBoundingClientRect();
    const size = Math.min(mediaRect.width, mediaRect.height) * 0.7;
    
    this.cropArea.style.width = `${size}px`;
    this.cropArea.style.height = `${size}px`;
    this.cropArea.style.left = `${(mediaRect.width - size) / 2}px`;
    this.cropArea.style.top = `${(mediaRect.height - size) / 2}px`;
    
    this.updateOverlay();
  }

  updateOverlay() {
    const cropRect = this.cropArea.getBoundingClientRect();
    const mediaRect = this.cropperContainer.getBoundingClientRect();
    
    // Create clipping path for overlay
    const clipPath = `
      polygon(
        0 0, 
        0 ${mediaRect.height}px, 
        ${cropRect.left - mediaRect.left}px ${mediaRect.height}px,
        ${cropRect.left - mediaRect.left}px ${cropRect.top - mediaRect.top}px,
        ${cropRect.right - mediaRect.left}px ${cropRect.top - mediaRect.top}px,
        ${cropRect.right - mediaRect.left}px ${cropRect.bottom - mediaRect.top}px,
        ${cropRect.left - mediaRect.left}px ${cropRect.bottom - mediaRect.top}px,
        ${cropRect.left - mediaRect.left}px ${mediaRect.height}px,
        ${mediaRect.width}px ${mediaRect.height}px,
        ${mediaRect.width}px 0
      )
    `;
    
    this.overlay.style.clipPath = clipPath;
  }

  setupDragHandlers() {
    let activeHandle = null;
    let startX, startY, startWidth, startHeight, startLeft, startTop;
    
    const handleMouseDown = (e, handle) => {
      activeHandle = handle;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(this.cropArea.style.width);
      startHeight = parseInt(this.cropArea.style.height);
      startLeft = parseInt(this.cropArea.style.left);
      startTop = parseInt(this.cropArea.style.top);
      e.preventDefault();
    };
    
    Object.values(this.handles).forEach(handle => {
      handle.addEventListener('mousedown', (e) => {
        handleMouseDown(e, handle);
      });
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!activeHandle) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      const mediaRect = this.cropperContainer.getBoundingClientRect();
      const minSize = 50;
      
      if (activeHandle === this.handles.topLeft) {
        const newWidth = Math.max(minSize, startWidth - dx);
        const newHeight = Math.max(minSize, startHeight - dy);
        this.cropArea.style.width = `${newWidth}px`;
        this.cropArea.style.height = `${newHeight}px`;
        this.cropArea.style.left = `${startLeft + dx}px`;
        this.cropArea.style.top = `${startTop + dy}px`;
      } else if (activeHandle === this.handles.topRight) {
        const newWidth = Math.max(minSize, startWidth + dx);
        const newHeight = Math.max(minSize, startHeight - dy);
        this.cropArea.style.width = `${newWidth}px`;
        this.cropArea.style.height = `${newHeight}px`;
        this.cropArea.style.top = `${startTop + dy}px`;
      } else if (activeHandle === this.handles.bottomLeft) {
        const newWidth = Math.max(minSize, startWidth - dx);
        const newHeight = Math.max(minSize, startHeight + dy);
        this.cropArea.style.width = `${newWidth}px`;
        this.cropArea.style.height = `${newHeight}px`;
        this.cropArea.style.left = `${startLeft + dx}px`;
      } else if (activeHandle === this.handles.bottomRight) {
        const newWidth = Math.max(minSize, startWidth + dx);
        const newHeight = Math.max(minSize, startHeight + dy);
        this.cropArea.style.width = `${newWidth}px`;
        this.cropArea.style.height = `${newHeight}px`;
      }
      
      this.updateOverlay();
    });
    
    document.addEventListener('mouseup', () => {
      activeHandle = null;
    });
  }

  applyCrop() {
    const cropRect = this.cropArea.getBoundingClientRect();
    const mediaRect = this.cropperContainer.getBoundingClientRect();
    
    const cropData = {
      x: cropRect.left - mediaRect.left,
      y: cropRect.top - mediaRect.top,
      width: cropRect.width,
      height: cropRect.height
    };
    
    this.callback(cropData);
    this.cropperContainer.remove();
  }

  cancelCrop() {
    this.cropperContainer.remove();
  }
}
