class StoryPreview {
  constructor(mediaElement, onPost, onSave) {
    this.mediaElement = mediaElement;
    this.onPost = onPost;
    this.onSave = onSave;
    this.initPreview();
  }

  initPreview() {
    this.previewContainer = document.createElement('div');
    this.previewContainer.className = 'preview-container';
    
    // Create preview element
    this.previewElement = this.mediaElement.cloneNode(true);
    this.previewElement.className = 'story-preview';
    
    // Create action buttons
    const postBtn = document.createElement('button');
    postBtn.className = 'preview-btn post-btn';
    postBtn.textContent = 'Post Story';
    postBtn.addEventListener('click', this.onPost);
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'preview-btn save-btn';
    saveBtn.textContent = 'Save Draft';
    saveBtn.addEventListener('click', this.onSave);
    
    const backBtn = document.createElement('button');
    backBtn.className = 'preview-btn back-btn';
    backBtn.textContent = 'Back';
    backBtn.addEventListener('click', () => {
      this.previewContainer.remove();
    });
    
    // Add all to container
    this.previewContainer.append(
      this.previewElement,
      postBtn,
      saveBtn,
      backBtn
    );
    
    document.body.appendChild(this.previewContainer);
  }

  static showFinalPreview(canvas, onPost) {
    const previewContainer = document.createElement('div');
    previewContainer.className = 'final-preview-container';
    
    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    img.className = 'final-preview';
    
    const postBtn = document.createElement('button');
    postBtn.className = 'preview-btn post-btn';
    postBtn.textContent = 'Confirm Post';
    postBtn.addEventListener('click', onPost);
    
    const editBtn = document.createElement('button');
    editBtn.className = 'preview-btn edit-btn';
    editBtn.textContent = 'Keep Editing';
    editBtn.addEventListener('click', () => {
      previewContainer.remove();
    });
    
    previewContainer.append(img, postBtn, editBtn);
    document.body.appendChild(previewContainer);
  }
}
