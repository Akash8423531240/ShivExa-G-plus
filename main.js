/***********************
 *  STORY UPLOADER INITIALIZATION
 ***********************/
class StoryUploader {
  constructor() {
    this.initUI();
    this.setupEventListeners();
  }

  initUI() {
    // Create uploader modal
    this.modal = document.createElement('div');
    this.modal.className = 'story-uploader-modal';
    this.modal.innerHTML = `
      <div class="modal-content">
        <span class="close-btn">&times;</span>
        <h3>Upload Your Story</h3>
        <input type="file" id="storyFileInput" accept="image/*, video/*">
        <button id="uploadBtn">Upload</button>
      </div>
    `;
    document.body.appendChild(this.modal);
  }

  setupEventListeners() {
    // Close modal
    this.modal.querySelector('.close-btn').addEventListener('click', () => {
      this.modal.remove();
    });

    // File upload handler
    document.getElementById('storyFileInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.previewMedia(file);
      }
    });
  }

  previewMedia(file) {
    console.log('Selected file:', file.name);
    // Add your preview logic here
  }
}

/***********************
 *  MAIN INITIALIZATION
 ***********************/
document.addEventListener('DOMContentLoaded', () => {
  // Story button functionality
  const storyBtn = document.querySelector('.story-icon');
  if (storyBtn) {
    storyBtn.addEventListener('click', () => {
      new StoryUploader();
    });
  }

  // Dynamic CSS loader (optional)
  const loadCSS = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };
  loadCSS('story-uploader.css');
  loadCSS('story-editor.css');
});
