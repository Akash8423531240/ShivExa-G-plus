class StoryStickers {
  constructor(editorInstance) {
    this.editor = editorInstance;
    this.stickerCategories = this.loadStickerCategories();
    this.currentCategory = 'emoji';
    this.initStickerPanel();
  }

  loadStickerCategories() {
    return {
      'emoji': ['😀', '❤️', '⭐', '🎉', '🔥', '🌈', '👍', '🎈', '🍕', '⚽'],
      'symbols': ['✿', '♫', '☀', '☁', '★', '☎', '⚓', '✈', '⌛', '☕'],
      'holiday': ['🎄', '🎁', '🎃', '💝', '🎆', '🎇', '🍀', '🐇', '🦃', '🎅'],
      'nature': ['🌹', '🌲', '🌊', '🐦', '🐱', '🐶', '🦋', '🌙', '☘', '🌻'],
      'food': ['🍎', '🍕', '🍔', '🍟', '🍩', '🍦', '🍇', '🍉', '🍋', '🍒']
    };
  }

  initStickerPanel() {
    this.stickerPanel = document.createElement('div');
    this.stickerPanel.className = 'sticker-panel';
    
    // Category tabs
    const categoryTabs = document.createElement('div');
    categoryTabs.className = 'sticker-categories';
    
    Object.keys(this.stickerCategories).forEach(cat => {
      const tab = document.createElement('button');
      tab.className = `category-tab ${cat === this.currentCategory ? 'active' : ''}`;
      tab.textContent = this.capitalizeFirstLetter(cat);
      tab.dataset.category = cat;
      tab.addEventListener('click', (e) => {
        this.setActiveCategory(e.target.dataset.category);
      });
      categoryTabs.appendChild(tab);
    });
    
    // Sticker grid
    this.stickerGrid = document.createElement('div');
    this.stickerGrid.className = 'sticker-grid';
    this.renderStickers(this.currentCategory);
    
    this.stickerPanel.append(categoryTabs, this.stickerGrid);
    this.editor.editorContainer.appendChild(this.stickerPanel);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  setActiveCategory(category) {
    this.currentCategory = category;
    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === category);
    });
    this.renderStickers(category);
  }

  renderStickers(category) {
    this.stickerGrid.innerHTML = '';
    
    this.stickerCategories[category].forEach(sticker => {
      const stickerElement = document.createElement('div');
      stickerElement.className = 'sticker-item';
      stickerElement.textContent = sticker;
      stickerElement.addEventListener('click', () => {
        this.addStickerToStory(sticker);
      });
      this.stickerGrid.appendChild(stickerElement);
    });
  }

  addStickerToStory(sticker) {
    const stickerElement = document.createElement('div');
    stickerElement.className = 'story-sticker';
    stickerElement.textContent = sticker;
    
    // Make draggable and resizable
    this.makeStickerInteractive(stickerElement);
    
    this.editor.mediaDisplay.appendChild(stickerElement);
    
    // Position randomly but within view
    const mediaRect = this.editor.mediaDisplay.getBoundingClientRect();
    stickerElement.style.left = (mediaRect.width * 0.2 + Math.random() * mediaRect.width * 0.6) + 'px';
    stickerElement.style.top = (mediaRect.height * 0.2 + Math.random() * mediaRect.height * 0.6) + 'px';
  }

  makeStickerInteractive(stickerElement) {
    let isDragging = false;
    let offsetX, offsetY;
    let startSize, startX, startY;
    
    // Drag to move
    stickerElement.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only left click
      
      isDragging = true;
      offsetX = e.clientX - stickerElement.getBoundingClientRect().left;
      offsetY = e.clientY - stickerElement.getBoundingClientRect().top;
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const mediaRect = this.editor.mediaDisplay.getBoundingClientRect();
      const newX = e.clientX - mediaRect.left - offsetX;
      const newY = e.clientY - mediaRect.top - offsetY;
      
      // Constrain to media display area
      const constrainedX = Math.max(0, Math.min(newX, mediaRect.width - stickerElement.offsetWidth));
      const constrainedY = Math.max(0, Math.min(newY, mediaRect.height - stickerElement.offsetHeight));
      
      stickerElement.style.left = constrainedX + 'px';
      stickerElement.style.top = constrainedY + 'px';
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    // Pinch to resize (simplified)
    stickerElement.addEventListener('dblclick', () => {
      const currentSize = parseInt(window.getComputedStyle(stickerElement).fontSize) || 40;
      stickerElement.style.fontSize = (currentSize + 10) + 'px';
    });
  }
}
