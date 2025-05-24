// story-feature.js - Complete Instagram-like Story Creation Feature

/***********************
 *  GLOBAL VARIABLES    *
 ***********************/
let currentMediaFiles = [];
let activeEditorInstance = null;

/***********************
 *  STORY UPLOADER      *
 ***********************/
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
    currentMediaFiles = this.mediaFiles;
    this.uploadContainer.remove();
    activeEditorInstance = new StoryEditor(currentMediaFiles);
  }
}

/***********************
 *  STORY EDITOR       *
 ***********************/
class StoryEditor {
  constructor(mediaFiles) {
    this.mediaFiles = mediaFiles;
    this.currentMediaIndex = 0;
    this.activeTool = null;
    this.initEditor();
  }

  initEditor() {
    this.editorContainer = document.createElement('div');
    this.editorContainer.className = 'story-editor-container';
    
    // Header with close button
    this.header = document.createElement('div');
    this.header.className = 'editor-header';
    
    this.closeBtn = document.createElement('button');
    this.closeBtn.className = 'editor-close-btn';
    this.closeBtn.innerHTML = '&times;';
    this.closeBtn.addEventListener('click', () => this.editorContainer.remove());
    
    this.header.appendChild(this.closeBtn);
    
    // Create media display area
    this.mediaDisplay = document.createElement('div');
    this.mediaDisplay.className = 'media-display';
    
    // Create toolbar
    this.toolbar = document.createElement('div');
    this.toolbar.className = 'editor-toolbar';
    
    // Tool buttons
    const tools = [
      { name: 'text', icon: 'T', label: 'Text' },
      { name: 'sticker', icon: '✿', label: 'Stickers' },
      { name: 'music', icon: '♫', label: 'Music' },
      { name: 'filter', icon: '🌈', label: 'Filters' },
      { name: 'draw', icon: '✎', label: 'Draw' }
    ];
    
    tools.forEach(tool => {
      const toolBtn = document.createElement('button');
      toolBtn.className = `tool-btn ${tool.name}-btn`;
      toolBtn.innerHTML = `
        <span class="tool-icon">${tool.icon}</span>
        <span class="tool-label">${tool.label}</span>
      `;
      toolBtn.addEventListener('click', () => this.activateTool(tool.name));
      this.toolbar.appendChild(toolBtn);
    });
    
    // Add post button
    this.postBtn = document.createElement('button');
    this.postBtn.className = 'story-btn post-btn';
    this.postBtn.textContent = 'Your Story';
    this.postBtn.addEventListener('click', this.postStory.bind(this));
    
    this.editorContainer.append(this.header, this.mediaDisplay, this.toolbar, this.postBtn);
    document.body.appendChild(this.editorContainer);
    
    this.loadCurrentMedia();
  }

  activateTool(tool) {
    this.activeTool = tool;
    
    // Remove any existing tool panels
    document.querySelectorAll('.music-panel, .filter-panel, .text-panel, .sticker-panel, .drawing-panel')
      .forEach(el => el.remove());
    
    // Remove canvas if not in drawing mode
    if (tool !== 'draw') {
      const canvas = this.mediaDisplay.querySelector('.drawing-canvas');
      if (canvas) canvas.remove();
    }
    
    switch(tool) {
      case 'music':
        new StoryMusic(this);
        break;
      case 'filter':
        new StoryFilterPresets(this);
        break;
      case 'text':
        new StoryTextTool(this);
        break;
      case 'sticker':
        new StoryStickers(this);
        break;
      case 'draw':
        new StoryDrawing(this);
        break;
    }
  }

  loadCurrentMedia() {
    this.mediaDisplay.innerHTML = '';
    
    const file = this.mediaFiles[this.currentMediaIndex];
    const mediaElement = file.type.startsWith('image') ? 
      document.createElement('img') : document.createElement('video');
    
    mediaElement.src = URL.createObjectURL(file);
    mediaElement.className = 'editor-media';
    
    if (file.type.startsWith('video')) {
      mediaElement.controls = true;
      mediaElement.autoplay = true;
      mediaElement.loop = true;
    }
    
    this.mediaDisplay.appendChild(mediaElement);
  }

  postStory() {
    // Create a canvas to capture the final story
    const canvas = document.createElement('canvas');
    const mediaElement = this.mediaDisplay.querySelector('img, video');
    canvas.width = mediaElement.videoWidth || mediaElement.naturalWidth;
    canvas.height = mediaElement.videoHeight || mediaElement.naturalHeight;
    const ctx = canvas.getContext('2d');
    
    // Draw media
    ctx.drawImage(mediaElement, 0, 0, canvas.width, canvas.height);
    
    // Draw overlays (text, stickers, drawings)
    const overlays = this.mediaDisplay.querySelectorAll('.story-text, .story-sticker');
    overlays.forEach(overlay => {
      const rect = overlay.getBoundingClientRect();
      const mediaRect = this.mediaDisplay.getBoundingClientRect();
      
      if (overlay.classList.contains('story-text')) {
        ctx.font = `${parseInt(window.getComputedStyle(overlay).fontSize)}px ${window.getComputedStyle(overlay).fontFamily}`;
        ctx.fillStyle = window.getComputedStyle(overlay).color;
        ctx.fillText(
          overlay.textContent,
          rect.left - mediaRect.left,
          rect.top - mediaRect.top + parseInt(window.getComputedStyle(overlay).fontSize)
        );
      } else if (overlay.classList.contains('story-sticker')) {
        ctx.font = '40px Arial';
        ctx.fillText(
          overlay.textContent,
          rect.left - mediaRect.left,
          rect.top - mediaRect.top + 40
        );
      }
    });
    
    // Handle drawing canvas if exists
    const drawingCanvas = this.mediaDisplay.querySelector('.drawing-canvas');
    if (drawingCanvas) {
      ctx.drawImage(drawingCanvas, 0, 0, canvas.width, canvas.height);
    }
    
    // Convert to blob and post (simulated)
    canvas.toBlob(blob => {
      alert('Story posted successfully!');
      this.editorContainer.remove();
    }, 'image/png');
  }
}

/***********************
 *  STORY TOOLS        *
 ***********************/

// Music Tool
class StoryMusic {
  constructor(editorInstance) {
    this.editor = editorInstance;
    this.musicTracks = this.loadMusicTracks();
    this.initMusicPanel();
  }

  loadMusicTracks() {
    return [
      { id: 1, name: "Trending Track 1", artist: "Artist 1", duration: "0:30", mood: "Happy" },
      { id: 2, name: "Popular Song 2", artist: "Artist 2", duration: "0:30", mood: "Romantic" },
      { id: 3, name: "Viral Sound 3", artist: "Artist 3", duration: "0:30", mood: "Energetic" }
    ];
  }

  initMusicPanel() {
    this.musicPanel = document.createElement('div');
    this.musicPanel.className = 'music-panel';
    
    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Search music...';
    searchBar.className = 'music-search';
    
    const tracksList = document.createElement('div');
    tracksList.className = 'tracks-list';
    
    this.musicTracks.forEach(track => {
      const trackElement = document.createElement('div');
      trackElement.className = 'music-track';
      trackElement.innerHTML = `
        <div class="track-info">
          <h4>${track.name}</h4>
          <p>${track.artist} • ${track.duration}</p>
        </div>
        <button class="add-track-btn" data-id="${track.id}">Add</button>
      `;
      tracksList.appendChild(trackElement);
    });
    
    this.musicPanel.append(searchBar, tracksList);
    this.editor.editorContainer.appendChild(this.musicPanel);
    
    this.bindMusicEvents();
  }

  bindMusicEvents() {
    document.querySelector('.music-search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = this.musicTracks.filter(track => 
        track.name.toLowerCase().includes(query) || 
        track.artist.toLowerCase().includes(query)
      );
      
      const tracksList = document.querySelector('.tracks-list');
      tracksList.innerHTML = '';
      
      filtered.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.className = 'music-track';
        trackElement.innerHTML = `
          <div class="track-info">
            <h4>${track.name}</h4>
            <p>${track.artist} • ${track.duration}</p>
          </div>
          <button class="add-track-btn" data-id="${track.id}">Add</button>
        `;
        tracksList.appendChild(trackElement);
      });
    });
    
    document.querySelectorAll('.add-track-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackId = parseInt(e.target.dataset.id);
        this.addTrackToStory(trackId);
      });
    });
  }

  addTrackToStory(trackId) {
    const selectedTrack = this.musicTracks.find(track => track.id === trackId);
    
    // Add visual indicator
    const musicBadge = document.createElement('div');
    musicBadge.className = 'music-badge';
    musicBadge.innerHTML = `♫ ${selectedTrack.name}`;
    
    this.editor.mediaDisplay.appendChild(musicBadge);
    this.musicPanel.remove();
  }
}

// Filter Tool
class StoryFilterPresets {
  constructor(editorInstance) {
    this.editor = editorInstance;
    this.filters = this.getFilterPresets();
    this.initFilterPanel();
  }

  getFilterPresets() {
    return [
      { name: "Normal", class: "filter-normal" },
      { name: "Clarendon", class: "filter-clarendon" },
      { name: "Gingham", class: "filter-gingham" },
      { name: "Moon", class: "filter-moon" },
      { name: "Lark", class: "filter-lark" }
    ];
  }

  initFilterPanel() {
    this.filterPanel = document.createElement('div');
    this.filterPanel.className = 'filter-panel';
    
    const filtersList = document.createElement('div');
    filtersList.className = 'filters-list';
    
    this.filters.forEach(filter => {
      const filterElement = document.createElement('div');
      filterElement.className = 'filter-item';
      
      const preview = document.createElement('div');
      preview.className = 'filter-preview';
      
      const label = document.createElement('span');
      label.className = 'filter-label';
      label.textContent = filter.name;
      
      filterElement.append(preview, label);
      filterElement.addEventListener('click', () => {
        this.applyFilter(filter.class);
      });
      
      filtersList.appendChild(filterElement);
    });
    
    this.filterPanel.appendChild(filtersList);
    this.editor.editorContainer.appendChild(this.filterPanel);
  }

  applyFilter(filterClass) {
    const mediaElement = this.editor.mediaDisplay.querySelector('img, video');
    if (!mediaElement) return;
    
    // Remove all filter classes first
    this.filters.forEach(f => {
      mediaElement.classList.remove(f.class);
    });
    
    // Apply selected filter
    mediaElement.classList.add(filterClass);
  }
}

// Text Tool
class StoryTextTool {
  constructor(editorInstance) {
    this.editor = editorInstance;
    this.activeTextElement = null;
    this.initTextPanel();
  }

  initTextPanel() {
    this.textPanel = document.createElement('div');
    this.textPanel.className = 'text-panel';
    
    // Text color selection
    const colors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'];
    const colorPalette = document.createElement('div');
    colorPalette.className = 'color-palette';
    
    colors.forEach(color => {
      const colorBtn = document.createElement('button');
      colorBtn.className = 'color-btn';
      colorBtn.style.backgroundColor = color;
      colorBtn.dataset.color = color;
      colorBtn.addEventListener('click', (e) => {
        if (this.activeTextElement) {
          this.activeTextElement.style.color = e.target.dataset.color;
        }
      });
      colorPalette.appendChild(colorBtn);
    });
    
    // Add text button
    const addTextBtn = document.createElement('button');
    addTextBtn.className = 'text-btn';
    addTextBtn.textContent = 'Add Text';
    addTextBtn.addEventListener('click', () => {
      this.addTextElement();
    });
    
    this.textPanel.append(colorPalette, addTextBtn);
    this.editor.editorContainer.appendChild(this.textPanel);
  }

  addTextElement() {
    const textElement = document.createElement('div');
    textElement.className = 'story-text';
    textElement.contentEditable = true;
    textElement.textContent = 'Tap to edit text';
    textElement.style.color = '#ffffff';
    textElement.style.fontFamily = 'Arial';
    
    // Make draggable
    let offsetX, offsetY;
    
    textElement.addEventListener('mousedown', (e) => {
      this.setActiveText(textElement);
      offsetX = e.clientX - textElement.getBoundingClientRect().left;
      offsetY = e.clientY - textElement.getBoundingClientRect().top;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (this.activeTextElement === textElement && e.buttons === 1) {
        textElement.style.left = (e.clientX - offsetX) + 'px';
        textElement.style.top = (e.clientY - offsetY) + 'px';
      }
    });
    
    textElement.addEventListener('click', () => {
      this.setActiveText(textElement);
    });
    
    this.editor.mediaDisplay.appendChild(textElement);
    this.setActiveText(textElement);
    textElement.focus();
  }

  setActiveText(element) {
    if (this.activeTextElement) {
      this.activeTextElement.style.border = 'none';
    }
    this.activeTextElement = element;
    element.style.border = '2px dashed #0095f6';
  }
}

// Sticker Tool
class StoryStickers {
  constructor(editorInstance) {
    this.editor = editorInstance;
    this.stickers = ['😀', '❤️', '⭐', '🎉', '🔥', '🌈', '👍', '🎈', '🍕', '⚽'];
    this.initStickerPanel();
  }

  initStickerPanel() {
    this.stickerPanel = document.createElement('div');
    this.stickerPanel.className = 'sticker-panel';
    
    const stickerGrid = document.createElement('div');
    stickerGrid.className = 'sticker-grid';
    
    this.stickers.forEach(sticker => {
      const stickerElement = document.createElement('div');
      stickerElement.className = 'sticker-item';
      stickerElement.textContent = sticker;
      stickerElement.addEventListener('click', () => {
        this.addStickerToStory(sticker);
      });
      stickerGrid.appendChild(stickerElement);
    });
    
    this.stickerPanel.appendChild(stickerGrid);
    this.editor.editorContainer.appendChild(this.stickerPanel);
  }

  addStickerToStory(sticker) {
    const stickerElement = document.createElement('div');
    stickerElement.className = 'story-sticker';
    stickerElement.textContent = sticker;
    stickerElement.style.fontSize = '40px';
    
    // Make draggable
    let offsetX, offsetY;
    stickerElement.addEventListener('mousedown', (e) => {
      offsetX = e.clientX - stickerElement.getBoundingClientRect().left;
      offsetY = e.clientY - stickerElement.getBoundingClientRect().top;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (e.buttons === 1 && stickerElement.parentNode) {
        stickerElement.style.left = (e.clientX - offsetX) + 'px';
        stickerElement.style.top = (e.clientY - offsetY) + 'px';
      }
    });
    
    this.editor.mediaDisplay.appendChild(stickerElement);
    
    // Position randomly but within view
    const rect = this.editor.mediaDisplay.getBoundingClientRect();
    stickerElement.style.left = (rect.width * 0.2 + Math.random() * rect.width * 0.6) + 'px';
    stickerElement.style.top = (rect.height * 0.2 + Math.random() * rect.height * 0.6) + 'px';
  }
}

// Drawing Tool
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
    const colors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'];
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
    
    // Clear button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'drawing-btn';
    clearBtn.textContent = 'Clear';
    clearBtn.addEventListener('click', () => {
      this.clearCanvas();
    });
    
    this.drawingPanel.append(colorPalette, clearBtn);
    this.editor.editorContainer.appendChild(this.drawingPanel);
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'drawing-canvas';
    
    const mediaDisplay = this.editor.mediaDisplay;
    const rect = mediaDisplay.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    
    mediaDisplay.appendChild(this.canvas);
    
    // Drawing event listeners
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
  }

  startDrawing(e) {
    this.isDrawing = true;
    [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
  }

  draw(e) {
    if (!this.isDrawing) return;
    
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.currentSize;
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(e.offsetX, e.offsetY);
    this.ctx.stroke();
    
    [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

/***********************
 *  INITIALIZATION     *
 ***********************/
document.addEventListener('DOMContentLoaded', function() {
  // Add story button if it doesn't exist
  if (!document.querySelector('.story-icon')) {
    const storyBtn = document.createElement('button');
    storyBtn.className = 'story-icon';
    storyBtn.textContent = 'Add Story';
    document.body.appendChild(storyBtn);
  }
  
  // Initialize when story icon is clicked
  document.querySelector('.story-icon').addEventListener('click', function() {
    if (activeEditorInstance) {
      activeEditorInstance.editorContainer.remove();
    }
    new StoryUploader();
  });
});

/***********************
 *  CSS (Inline)       *
 ***********************/
const style = document.createElement('style');
style.textContent = `
.story-upload-container, .story-editor-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
}

.story-btn {
  padding: 12px 24px;
  margin: 10px;
  border: none;
  border-radius: 24px;
  background: #0095f6;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.media-display {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.editor-media {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.editor-toolbar {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  background: rgba(0, 0, 0, 0.7);
}

.tool-btn {
  background: transparent;
  border: none;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

/* Add all other CSS rules from the previous CSS files here */
`;
document.head.appendChild(style);
