class StoryFilterPresets {
  constructor(editorInstance) {
    this.editor = editorInstance;
    this.filters = this.getFilterPresets();
    this.initFilterPanel();
  }

  getFilterPresets() {
    return [
      { name: "Normal", class: "filter-normal", preview: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0))" },
      { name: "Clarendon", class: "filter-clarendon", preview: "linear-gradient(rgba(127,187,227,0.2), rgba(127,187,227,0.2))" },
      { name: "Gingham", class: "filter-gingham", preview: "linear-gradient(rgba(220,220,220,0.3), rgba(220,220,220,0.3))" },
      { name: "Moon", class: "filter-moon", preview: "linear-gradient(rgba(150,150,150,0.3), rgba(150,150,150,0.3))" },
      { name: "Lark", class: "filter-lark", preview: "linear-gradient(rgba(242,242,242,0.3), rgba(242,242,242,0.3))" },
      { name: "Reyes", class: "filter-reyes", preview: "linear-gradient(rgba(239,205,173,0.3), rgba(239,205,173,0.3))" },
      { name: "Juno", class: "filter-juno", preview: "linear-gradient(rgba(216,134,135,0.2), rgba(216,134,135,0.2))" },
      { name: "Slumber", class: "filter-slumber", preview: "linear-gradient(rgba(125,140,178,0.3), rgba(125,140,178,0.3))" },
      { name: "Crema", class: "filter-crema", preview: "linear-gradient(rgba(227,208,185,0.3), rgba(227,208,185,0.3))" },
      { name: "Ludwig", class: "filter-ludwig", preview: "linear-gradient(rgba(228,205,183,0.3), rgba(228,205,183,0.3))" },
      { name: "Aden", class: "filter-aden", preview: "linear-gradient(rgba(125,160,180,0.2), rgba(125,160,180,0.2))" },
      { name: "Perpetua", class: "filter-perpetua", preview: "linear-gradient(rgba(80,110,120,0.2), rgba(80,110,120,0.2))" }
    ];
  }

  initFilterPanel() {
    this.filterPanel = document.createElement('div');
    this.filterPanel.className = 'filter-panel';
    
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'filters-container';
    
    // Intensity slider
    this.intensitySlider = document.createElement('input');
    this.intensitySlider.type = 'range';
    this.intensitySlider.min = '0';
    this.intensitySlider.max = '100';
    this.intensitySlider.value = '100';
    this.intensitySlider.className = 'intensity-slider';
    
    filtersContainer.appendChild(this.intensitySlider);
    
    // Filters list
    const filtersList = document.createElement('div');
    filtersList.className = 'filters-list';
    
    this.filters.forEach(filter => {
      const filterElement = document.createElement('div');
      filterElement.className = 'filter-item';
      
      const preview = document.createElement('div');
      preview.className = 'filter-preview';
      preview.style.background = filter.preview;
      
      const label = document.createElement('span');
      label.className = 'filter-label';
      label.textContent = filter.name;
      
      filterElement.append(preview, label);
      filterElement.addEventListener('click', () => {
        this.applyFilter(filter.class);
      });
      
      filtersList.appendChild(filterElement);
    });
    
    filtersContainer.appendChild(filtersList);
    this.filterPanel.appendChild(filtersContainer);
    this.editor.editorContainer.appendChild(this.filterPanel);
    
    // Intensity slider event
    this.intensitySlider.addEventListener('input', () => {
      this.updateFilterIntensity();
    });
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
    this.currentFilter = filterClass;
    this.updateFilterIntensity();
  }

  updateFilterIntensity() {
    const mediaElement = this.editor.mediaDisplay.querySelector('img, video');
    if (!mediaElement || !this.currentFilter) return;
    
    const intensity = this.intensitySlider.value / 100;
    mediaElement.style.filter = `opacity(${intensity})`;
  }
}
