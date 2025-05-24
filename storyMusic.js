class StoryMusic {
  constructor(editorInstance) {
    this.editor = editorInstance;
    this.musicTracks = this.loadMusicTracks();
    this.initMusicPanel();
  }

  loadMusicTracks() {
    // In a real app, these would come from your server
    return [
      { id: 1, name: "Trending Track 1", artist: "Artist 1", duration: "0:30", mood: "Happy" },
      { id: 2, name: "Popular Song 2", artist: "Artist 2", duration: "0:30", mood: "Romantic" },
      { id: 3, name: "Viral Sound 3", artist: "Artist 3", duration: "0:30", mood: "Energetic" },
      { id: 4, name: "Chill Vibes", artist: "Artist 4", duration: "0:30", mood: "Relaxed" },
      { id: 5, name: "Party Anthem", artist: "Artist 5", duration: "0:30", mood: "Exciting" }
    ];
  }

  initMusicPanel() {
    this.musicPanel = document.createElement('div');
    this.musicPanel.className = 'music-panel';
    
    // Search and categories
    const searchContainer = document.createElement('div');
    searchContainer.className = 'music-search-container';
    
    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Search music...';
    searchBar.className = 'music-search';
    
    const categories = document.createElement('div');
    categories.className = 'music-categories';
    ['All', 'Trending', 'Mood', 'Genre', 'Artist'].forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'category-btn';
      btn.textContent = cat;
      categories.appendChild(btn);
    });
    
    searchContainer.append(searchBar, categories);
    
    // Tracks list
    this.tracksList = document.createElement('div');
    this.tracksList.className = 'tracks-list';
    this.renderTracks(this.musicTracks);
    
    this.musicPanel.append(searchContainer, this.tracksList);
    this.editor.editorContainer.appendChild(this.musicPanel);
    
    this.bindMusicEvents();
  }

  renderTracks(tracks) {
    this.tracksList.innerHTML = '';
    
    tracks.forEach(track => {
      const trackElement = document.createElement('div');
      trackElement.className = 'music-track';
      trackElement.innerHTML = `
        <div class="track-info">
          <h4>${track.name}</h4>
          <p>${track.artist} • ${track.duration} • ${track.mood}</p>
        </div>
        <button class="add-track-btn" data-id="${track.id}">Add</button>
        <button class="preview-track-btn" data-id="${track.id}">▶</button>
      `;
      this.tracksList.appendChild(trackElement);
    });
  }

  bindMusicEvents() {
    // Search functionality
    document.querySelector('.music-search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = this.musicTracks.filter(track => 
        track.name.toLowerCase().includes(query) || 
        track.artist.toLowerCase().includes(query) ||
        track.mood.toLowerCase().includes(query)
      );
      this.renderTracks(filtered);
    });
    
    // Add track to story
    this.tracksList.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-track-btn')) {
        const trackId = parseInt(e.target.dataset.id);
        this.addTrackToStory(trackId);
      }
      
      if (e.target.classList.contains('preview-track-btn')) {
        const trackId = parseInt(e.target.dataset.id);
        this.previewTrack(trackId);
      }
    });
  }

  addTrackToStory(trackId) {
    const selectedTrack = this.musicTracks.find(track => track.id === trackId);
    
    // Remove any existing music badge
    const existingBadge = this.editor.mediaDisplay.querySelector('.music-badge');
    if (existingBadge) existingBadge.remove();
    
    // Add visual indicator
    const musicBadge = document.createElement('div');
    musicBadge.className = 'music-badge';
    musicBadge.innerHTML = `
      <span class="music-icon">♫</span>
      <span class="music-name">${selectedTrack.name}</span>
    `;
    
    this.editor.mediaDisplay.appendChild(musicBadge);
    this.musicPanel.remove();
    
    // In a real app, you would attach the audio track to the story here
    console.log(`Added track: ${selectedTrack.name}`);
  }

  previewTrack(trackId) {
    const track = this.musicTracks.find(t => t.id === trackId);
    console.log(`Previewing track: ${track.name}`);
    // In a real app, you would play a preview of the track
  }
        }
