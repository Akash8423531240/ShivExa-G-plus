class StoryTextTool {
  constructor(editorInstance) {
    this.editor = editorInstance;
    this.activeTextElement = null;
    this.textColors = [
      '#ffffff', '#000000', '#ff0000', '#00ff00', 
      '#0000ff', '#ffff00', '#ff00ff', '#00ffff'
    ];
    this.backgroundColor = 'transparent';
    this.initTextPanel();
  }

  initTextPanel() {
    this.textPanel = document.createElement('div');
    this.textPanel.className = 'text-panel';
    
    // Text color selection
    const colorPalette = document.createElement('div');
    colorPalette.className = 'color-palette';
    
    this.textColors.forEach(color => {
      const colorBtn = document.createElement('button');
      colorBtn.className = 'color-btn';
      colorBtn.style.backgroundColor = color;
      colorBtn.dataset.color = color;
      colorBtn.title = color;
      colorBtn.addEventListener('click', (e) => {
        if (this.activeTextElement) {
          this.activeTextElement.style.color = e.target.dataset.color;
        }
      });
      colorPalette.appendChild(colorBtn);
    });
    
    // Background color toggle
    const bgToggle = document.createElement('button');
    bgToggle.className = 'bg-toggle-btn';
    bgToggle.textContent = 'BG';
    bgToggle.addEventListener('click', () => {
      this.toggleTextBackground();
    });
    
    // Font style selection
    const fontSelect = document.createElement('select');
    fontSelect.className = 'font-select';
    [
      {name: 'Classic', value: 'Arial'},
      {name: 'Modern', value: 'Helvetica'},
      {name: 'Elegant', value: 'Times New Roman'},
      {name: 'Fun', value: 'Comic Sans MS'},
      {name: 'Stylish', value: 'Georgia'},
      {name: 'Handwritten', value: 'cursive'}
    ].forEach(font => {
      const option = document.createElement('option');
      option.value = font.value;
      option.textContent = font.name;
      fontSelect.appendChild(option);
    });
    fontSelect.addEventListener('change', (e) => {
      if (this.activeTextElement) {
        this.activeTextElement.style.fontFamily = e.target.value;
      }
    });
    
    // Alignment buttons
    const alignLeft = this.createAlignButton('left', '⬅');
    const alignCenter = this.createAlignButton('center', '➡⬅');
    const alignRight = this.createAlignButton('right', '➡');
    
    // Add text button
    const addTextBtn = document.createElement('button');
    addTextBtn.className = 'text-btn';
    addTextBtn.textContent = 'Add Text';
    addTextBtn.addEventListener('click', () => {
      this.addTextElement();
    });
    
    this.textPanel.append(
      colorPalette, 
      bgToggle,
      fontSelect, 
      alignLeft, alignCenter, alignRight,
      addTextBtn
    );
    this.editor.editorContainer.appendChild(this.textPanel);
  }

  createAlignButton(alignValue, symbol) {
    const btn = document.createElement('button');
    btn.className = 'align-btn';
    btn.textContent = symbol;
    btn.addEventListener('click', () => {
      if (this.activeTextElement) {
        this.activeTextElement.style.textAlign = alignValue;
      }
    });
    return btn;
  }

  toggleTextBackground() {
    if (!this.activeTextElement) return;
    
    this.backgroundColor = this.backgroundColor === 'transparent' ? 'rgba(0,0,0,0.7)' : 'transparent';
    this.activeTextElement.style.backgroundColor = this.backgroundColor;
  }

  addTextElement() {
    const textElement = document.createElement('div');
    textElement.className = 'story-text';
    textElement.contentEditable = true;
    textElement.textContent = 'Tap to edit text';
    textElement.style.color = '#ffffff';
    textElement.style.fontFamily = 'Arial';
    textElement.style.fontSize = '24px';
    
    // Make draggable and resizable
    this.makeTextInteractive(textElement);
    
    this.editor.mediaDisplay.appendChild(textElement);
    this.setActiveText(textElement);
    textElement.focus();
  }

  makeTextInteractive(textElement) {
    let offsetX, offsetY;
    let isDragging = false;
    
    textElement.addEventListener('mousedown', (e) => {
      if (e.target === textElement) {
        this.setActiveText(textElement);
        offsetX = e.clientX - textElement.getBoundingClientRect().left;
        offsetY = e.clientY - textElement.getBoundingClientRect().top;
        isDragging = true;
        e.preventDefault(); // Prevent text selection
      }
    });
    
    document.addEventListener('mousemove', (e) => {
      if (isDragging && this.activeTextElement === textElement) {
        const mediaRect = this.editor.mediaDisplay.getBoundingClientRect();
        const newX = e.clientX - mediaRect.left - offsetX;
        const newY = e.clientY - mediaRect.top - offsetY;
        
        // Constrain to media display area
        const constrainedX = Math.max(0, Math.min(newX, mediaRect.width - textElement.offsetWidth));
        const constrainedY = Math.max(0, Math.min(newY, mediaRect.height - textElement.offsetHeight));
        
        textElement.style.left = constrainedX + 'px';
        textElement.style.top = constrainedY + 'px';
      }
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    textElement.addEventListener('click', (e) => {
      if (!isDragging) {
        this.setActiveText(textElement);
      }
    });
    
    // Double click to edit
    textElement.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      const range = document.createRange();
      range.selectNodeContents(textElement);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });
    
    // Initial position
    const mediaRect = this.editor.mediaDisplay.getBoundingClientRect();
    textElement.style.left = (mediaRect.width/2 - 50) + 'px';
    textElement.style.top = (mediaRect.height/2 - 15) + 'px';
  }

  setActiveText(element) {
    if (this.activeTextElement) {
      this.activeTextElement.style.border = 'none';
    }
    this.activeTextElement = element;
    element.style.border = '2px dashed #0095f6';
  }
}
