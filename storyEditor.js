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
      const storyData = new FormData();
      storyData.append('story', blob, 'story.png');
      
      // Simulate posting
      console.log('Story posted:', storyData);
      alert('Story posted successfully!');
      this.editorContainer.remove();
      
      // In a real app, you would upload to server here
      // fetch('/api/stories', { method: 'POST', body: storyData })
      //   .then(response => response.json())
      //   .then(data => {
      //     console.log('Success:', data);
      //     this.editorContainer.remove();
      //   });
    }, 'image/png');
  }
}
