class StoryUploader {
  constructor() {
    this.mediaFiles = [];
    this.currentMediaIndex = 0;
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.uploadContainer = document.createElement('div');
    this.uploadContainer.className = 'story-upload-container';
    
    this.galleryBtn = document.createElement('button');
    this.galleryBtn.className = 'story-btn gallery-btn';
    this.galleryBtn.textContent = 'Gallery';
    
    this.cameraBtn = document.createElement('button');
    this.cameraBtn.className = 'story-btn camera-btn';
    this.cameraBtn.textContent = 'Camera';
    
    this.closeBtn = document.createElement('button');
    this.closeBtn.className = 'story-close-btn';
    this.closeBtn.innerHTML = '&times;';
    
    this.uploadContainer.append(this.closeBtn, this.galleryBtn, this.cameraBtn);
    document.body.appendChild(this.uploadContainer);
  }

  bindEvents() {
    this.galleryBtn.addEventListener('click', this.openGallery.bind(this));
    this.cameraBtn.addEventListener('click', this.openCamera.bind(this));
    this.closeBtn.addEventListener('click', () => this.uploadContainer.remove());
  }

  openGallery() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*, video/*';
    input.multiple = true;
    input.click();
    
    input.onchange = (e) => {
      this.mediaFiles = Array.from(e.target.files);
      if (this.mediaFiles.length > 0) {
        this.showMediaPreview();
      }
    };
  }

  async openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      this.showCameraInterface(stream);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera");
    }
  }

  showCameraInterface(stream) {
    this.uploadContainer.innerHTML = '';
    
    this.cameraPreview = document.createElement('video');
    this.cameraPreview.className = 'camera-preview';
    this.cameraPreview.srcObject = stream;
    this.cameraPreview.play();
    
    this.captureBtn = document.createElement('button');
    this.captureBtn.className = 'capture-btn';
    this.captureBtn.innerHTML = '●';
    
    this.flipBtn = document.createElement('button');
    this.flipBtn.className = 'flip-btn';
    this.flipBtn.textContent = '🔄';
    
    this.uploadContainer.append(this.cameraPreview, this.captureBtn, this.flipBtn);
    
    this.captureBtn.addEventListener('click', this.capturePhoto.bind(this));
    this.flipBtn.addEventListener('click', this.flipCamera.bind(this));
  }

  capturePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = this.cameraPreview.videoWidth;
    canvas.height = this.cameraPreview.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.cameraPreview, 0, 0);
    
    canvas.toBlob(blob => {
      this.mediaFiles = [new File([blob], 'camera-capture.png', { type: 'image/png' })];
      this.cameraPreview.srcObject.getTracks().forEach(track => track.stop());
      this.showMediaPreview();
    }, 'image/png');
  }

  flipCamera() {
    const stream = this.cameraPreview.srcObject;
    const videoTrack = stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    
    videoTrack.applyConstraints({
      facingMode: settings.facingMode === 'user' ? 'environment' : 'user'
    });
  }

  showMediaPreview() {
    this.uploadContainer.innerHTML = '';
    
    const previewContainer = document.createElement('div');
    previewContainer.className = 'media-preview-container';
    
    this.mediaFiles.forEach((file, index) => {
      const mediaElement = file.type.startsWith('image') ? 
        document.createElement('img') : document.createElement('video');
      
      mediaElement.src = URL.createObjectURL(file);
      mediaElement.className = 'media-preview';
      mediaElement.dataset.index = index;
      
      if (file.type.startsWith('video')) {
        mediaElement.controls = true;
      }
      
      previewContainer.appendChild(mediaElement);
    });
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'story-btn next-btn';
    nextBtn.textContent = 'Next';
    nextBtn.addEventListener('click', () => {
      this.proceedToEditor();
    });
    
    const backBtn = document.createElement('button');
    backBtn.className = 'story-btn back-btn';
    backBtn.textContent = 'Back';
    backBtn.addEventListener('click', () => {
      this.uploadContainer.innerHTML = '';
      this.initElements();
      this.bindEvents();
    });
    
    this.uploadContainer.append(previewContainer, backBtn, nextBtn);
  }

  proceedToEditor() {
    this.uploadContainer.remove();
    new StoryEditor(this.mediaFiles);
  }
}

// Initialize when story icon is clicked
document.querySelector('.story-icon').addEventListener('click', () => {
  new StoryUploader();
});
