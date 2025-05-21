const initBreakingNewsBar = () => {
  const slot = document.getElementById('next-section-slot');
  if (!slot) return;

  // Channel database with mock news items and logos
  const CHANNELS = {
    'Aaj Tak': {
      logo: 'https://i.imgur.com/xyz123.png',
      news: [
        { 
          text: 'दिल्ली में तापमान 45°C पहुंचा, लाल अलर्ट जारी | आजतक के अनुसार यह मई में अब तक का सबसे ज्यादा तापमान है', 
          url: 'https://aajtak.com/weather',
          video: 'https://example.com/videos/weather.mp4'
        }
      ]
    },
    'Zee News': {
      logo: 'https://i.imgur.com/abc456.png',
      news: [
        {
          text: 'चुनाव नतीजों से शेयर बाजार में भारी गिरावट | सेंसेक्स 1500 अंक लुढ़का, निवेशकों को भारी नुकसान',
          url: 'https://zeenews.com/market',
          video: 'https://example.com/videos/market.mp4'
        }
      ]
    }
    // Add more channels as needed
  };

  // Get user's selected channels
  const getSelectedChannels = () => {
    const saved = localStorage.getItem('breakingNewsChannels');
    return saved ? JSON.parse(saved) : Object.keys(CHANNELS).slice(0, 3);
  };

  // Settings Modal
  const renderSettingsModal = () => {
    const modal = document.createElement('div');
    modal.id = 'news-settings-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;

    modal.innerHTML = `
      <div style="
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="margin: 0; font-size: 18px;">न्यूज चैनल चुनें (अधिकतम 6)</h3>
          <button onclick="this.closest('#news-settings-modal').remove()" style="
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
          ">×</button>
        </div>
        
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px;
          margin-bottom: 20px;
          max-height: 50vh;
          overflow-y: auto;
        ">
          ${Object.entries(CHANNELS).map(([channel, data]) => `
            <label style="
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 10px;
              border-radius: 4px;
              border: 1px solid #e0e0e0;
              cursor: pointer;
              background: ${getSelectedChannels().includes(channel) ? '#f0f7ff' : 'white'};
            ">
              <input 
                type="checkbox" 
                value="${channel}" 
                ${getSelectedChannels().includes(channel) ? 'checked' : ''}
                style="cursor: pointer;"
                onchange="handleChannelSelection(this)"
              >
              <img src="${data.logo}" alt="${channel}" style="width: 20px; height: 20px; object-fit: contain;">
              ${channel}
            </label>
          `).join('')}
        </div>
        
        <button onclick="saveChannelPreferences()" style="
          background: #ef4444;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          width: 100%;
          font-weight: bold;
          cursor: pointer;
        ">
          सेव सेटिंग्स
        </button>
      </div>
    `;

    document.body.appendChild(modal);
  };

  // Handle channel selection
  window.handleChannelSelection = (checkbox) => {
    const selected = getSelectedChannels();
    
    if (checkbox.checked) {
      if (selected.length >= 6) {
        checkbox.checked = false;
        alert('आप अधिकतम 6 चैनल ही चुन सकते हैं');
        return;
      }
      selected.push(checkbox.value);
    } else {
      const index = selected.indexOf(checkbox.value);
      if (index > -1) selected.splice(index, 1);
    }
  };

  // Save preferences
  window.saveChannelPreferences = () => {
    const checkboxes = document.querySelectorAll('#news-settings-modal input[type="checkbox"]:checked');
    const selected = Array.from(checkboxes).map(cb => cb.value);
    
    localStorage.setItem('breakingNewsChannels', JSON.stringify(selected));
    document.getElementById('news-settings-modal').remove();
    initBreakingNewsBar(); // Refresh news bar
  };

  // Generate news items
  const generateNewsItems = () => {
    const selectedChannels = getSelectedChannels();
    let allNews = [];
    
    selectedChannels.forEach(channel => {
      if (CHANNELS[channel]) {
        CHANNELS[channel].news.forEach(item => {
          allNews.push({
            ...item,
            channel: channel,
            logo: CHANNELS[channel].logo
          });
        });
      }
    });
    
    return allNews;
  };

  // Render breaking news bar
  const newsItems = generateNewsItems();
  const currentNewsIndex = Math.floor(Math.random() * newsItems.length);
  const currentNews = newsItems[currentNewsIndex] || { text: '', url: '#', channel: '', logo: '' };

  slot.innerHTML = `
    <div style="
      background: white;
      padding: 0;
      width: 100%;
      height: 1.8in;
      border-radius: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
    ">
      <!-- Breaking News Label -->
      <div style="
        position: absolute;
        top: 5px;
        left: 5px;
        z-index: 2;
      ">
        <span style="
          background: #EF4444;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: bold;
          display: inline-block;
        ">BREAKING NEWS</span>
      </div>
      
      <!-- Settings Button -->
      <button onclick="renderSettingsModal()" style="
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        z-index: 2;
        cursor: pointer;
        padding: 2px;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#666">
          <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
        </svg>
      </button>
      
      <!-- News Content -->
      <div style="
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 10px 0 60px;
        position: relative;
      ">
        <!-- Channel Logo -->
        <div style="
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid #eee;
        ">
          <img src="${currentNews.logo}" alt="${currentNews.channel}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        
        <!-- News Text -->
        <a href="${currentNews.url}" style="
          color: #333;
          text-decoration: none;
          font-size: 14px;
          font-weight: bold;
          line-height: 1.3;
          display: block;
          width: 100%;
          padding-right: 20px;
        ">
          ${currentNews.text}
        </a>
        
        <!-- Video Icon (if available) -->
        ${currentNews.video ? `
          <div style="
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #ef4444;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444">
              <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Auto-change news every 6 seconds
  let newsInterval = setInterval(() => {
    initBreakingNewsBar();
  }, 6000);

  // Cleanup on slot removal
  slot.addEventListener('DOMNodeRemoved', () => {
    clearInterval(newsInterval);
  });
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBreakingNewsBar);
} else {
  initBreakingNewsBar();
}
      alert('Maximum 6 channels allowed');
      return;
    }
    
    if (checkbox.checked) {
      selected.push(checkbox.value);
    } else {
      const index = selected.indexOf(checkbox.value);
      if (index > -1) selected.splice(index, 1);
    }
    
    localStorage.setItem('breakingNewsChannels', JSON.stringify(selected));
  };

  // Generate news items from selected channels
  const generateNewsItems = () => {
    const selectedChannels = getSelectedChannels();
    let allNews = [];
    
    selectedChannels.forEach(channel => {
      if (CHANNELS[channel]) {
        allNews = [...allNews, ...CHANNELS[channel].news];
      }
    });
    
    // Shuffle and limit to 20 items for performance
    return allNews.sort(() => 0.5 - Math.random()).slice(0, 20);
  };

  // Render the breaking news bar
  const newsItems = generateNewsItems();
  
  slot.innerHTML = `
    <div style="
      background: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 16px 0;
      position: relative;
    ">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="
          background: #EF4444;
          color: white;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-weight: 600;
          flex-shrink: 0;
        ">Breaking News</span>
        
        <div style="
          flex: 1;
          overflow: hidden;
          position: relative;
          height: 24px;
        ">
          <div style="
            position: absolute;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            gap: 16px;
            animation: scroll 60s linear infinite;
          " class="ticker">
            ${newsItems.map(item => `
              <a href="${item.url}" style="
                color: #1F2937;
                text-decoration: none;
                font-size: 0.95rem;
                cursor: pointer;
                display: inline-block;
                max-width: 300px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              " title="${item.text}">${item.text}</a>
            `).join('')}
          </div>
        </div>
        
        <button onclick="document.body.insertAdjacentHTML('beforeend', \`${renderSettingsModal()}\`)" style="
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          margin-left: 8px;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="#6B7280"/>
            <path d="M19.4 15C19.2669 15.3016 19.227 15.6362 19.2851 15.9606C19.3432 16.2849 19.4968 16.5843 19.725 16.82L19.8 16.9C19.9339 17.0339 20.0282 17.2024 20.0731 17.3867C20.118 17.571 20.1118 17.764 20.0552 17.9449C19.9986 18.1259 19.8937 18.2878 19.7523 18.4126C19.6108 18.5374 19.4384 18.6201 19.2545 18.6516C18.9384 18.7058 18.6376 18.8428 18.3839 19.05C18.1301 19.2572 17.9323 19.5275 17.81 19.835L17.745 20C17.6773 20.1837 17.5559 20.3423 17.397 20.4537C17.2381 20.5651 17.0495 20.6241 16.8561 20.6229C16.6627 20.6217 16.4747 20.5603 16.3173 20.4471C16.1599 20.3339 16.0409 20.1741 15.9762 19.99C15.8903 19.7423 15.7355 19.5236 15.5297 19.3601C15.3239 19.1966 15.0758 19.0954 14.8149 19.0684C14.554 19.0414 14.2919 19.0897 14.0616 19.2073C13.8313 19.3249 13.6432 19.5066 13.5216 19.7291C13.4 19.9516 13.3503 20.2048 13.3789 20.4554C13.4075 20.706 13.5129 20.9425 13.6815 21.1339C13.8501 21.3253 14.0739 21.4629 14.3235 21.5294C14.5731 21.5959 14.8367 21.5883 15.082 21.5074C15.3273 21.4265 15.5429 21.2761 15.7 21.075L15.8 21C16.0357 20.7718 16.3351 20.6182 16.6594 20.5601C16.9838 20.502 17.3184 20.5419 17.62 20.675" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    
    <style>
      .ticker:hover {
        animation-play-state: paused;
      }
      @keyframes scroll {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    </style>
  `;
  
  // Duplicate items for seamless scrolling
  const ticker = slot.querySelector('.ticker');
  ticker.innerHTML += ticker.innerHTML;
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initBreakingNewsBar);
st slot = document.getElementById('next-section-slot');
  if (!slot) return;

  // Channel database with mock news items
  const CHANNELS = {
    'Aaj Tak': {
      logo: 'https://example.com/aajtak.png',
      news: [
        { text: 'Delhi temperature hits 45°C, red alert issued', url: 'https://aajtak.com/weather' },
        { text: 'Rahul Gandhi to address rally in Mumbai today', url: 'https://aajtak.com/politics' }
      ]
    },
    'Zee News': {
      logo: 'https://example.com/zeenews.png',
      news: [
        { text: 'Stock market crashes as election results surprise investors', url: 'https://zeenews.com/market' },
        { text: 'New education policy to be implemented from June', url: 'https://zeenews.com/education' }
      ]
    },
    // ... (other channels with their news items)
  };

  // Get user's selected channels from localStorage or set default
  const getSelectedChannels = () => {
    const saved = localStorage.getItem('breakingNewsChannels');
    return saved ? JSON.parse(saved) : ['Aaj Tak', 'Zee News', 'NDTV'];
  };

  // Settings Modal
  const renderSettingsModal = () => {
    return `
      <div id="news-settings-modal" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      ">
        <div style="
          background: white;
          padding: 24px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
        ">
          <h3 style="margin-top: 0;">Select News Channels (Max 6)</h3>
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 12px;
            margin-bottom: 20px;
          ">
            ${Object.keys(CHANNELS).map(channel => `
              <label style="
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                padding: 8px;
                border-radius: 4px;
                background: ${getSelectedChannels().includes(channel) ? '#f0f7ff' : '#f5f5f5'};
              ">
                <input 
                  type="checkbox" 
                  value="${channel}" 
                  ${getSelectedChannels().includes(channel) ? 'checked' : ''}
                  onchange="handleChannelSelection(this)"
                  style="cursor: pointer;"
                >
                <img src="${CHANNELS[channel].logo}" alt="${channel}" style="width: 20px; height: 20px; object-fit: contain;">
                ${channel}
              </label>
            `).join('')}
          </div>
          <button onclick="document.getElementById('news-settings-modal').remove()" style="
            background: #ef4444;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          ">
            Save Preferences
          </button>
        </div>
      </div>
    `;
  };

  // Handle channel selection with max 6 limit
  window.handleChannelSelection = (checkbox) => {
    const selected = getSelectedChannels();
    if (checkbox.checked && selected.length >= 6) {
      checkbox.checked = false;
      alert('Maximum 6 channels allowed');
      return;
    }
    
    if (checkbox.checked) {
      selected.push(checkbox.value);
    } else {
      const index = selected.indexOf(checkbox.value);
      if (index > -1) selected.splice(index, 1);
    }
    
    localStorage.setItem('breakingNewsChannels', JSON.stringify(selected));
  };

  // Generate news items from selected channels
  const generateNewsItems = () => {
    const selectedChannels = getSelectedChannels();
    let allNews = [];
    
    selectedChannels.forEach(channel => {
      if (CHANNELS[channel]) {
        allNews = [...allNews, ...CHANNELS[channel].news];
      }
    });
    
    // Shuffle and limit to 20 items for performance
    return allNews.sort(() => 0.5 - Math.random()).slice(0, 20);
  };

  // Render the breaking news bar
  const newsItems = generateNewsItems();
  
  slot.innerHTML = `
    <div style="
      background: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 16px 0;
      position: relative;
    ">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="
          background: #EF4444;
          color: white;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-weight: 600;
          flex-shrink: 0;
        ">Breaking News</span>
        
        <div style="
          flex: 1;
          overflow: hidden;
          position: relative;
          height: 24px;
        ">
          <div style="
            position: absolute;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            gap: 16px;
            animation: scroll 60s linear infinite;
          " class="ticker">
            ${newsItems.map(item => `
              <a href="${item.url}" style="
                color: #1F2937;
                text-decoration: none;
                font-size: 0.95rem;
                cursor: pointer;
                display: inline-block;
                max-width: 300px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              " title="${item.text}">${item.text}</a>
            `).join('')}
          </div>
        </div>
        
        <button onclick="document.body.insertAdjacentHTML('beforeend', \`${renderSettingsModal()}\`)" style="
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          margin-left: 8px;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="#6B7280"/>
            <path d="M19.4 15C19.2669 15.3016 19.227 15.6362 19.2851 15.9606C19.3432 16.2849 19.4968 16.5843 19.725 16.82L19.8 16.9C19.9339 17.0339 20.0282 17.2024 20.0731 17.3867C20.118 17.571 20.1118 17.764 20.0552 17.9449C19.9986 18.1259 19.8937 18.2878 19.7523 18.4126C19.6108 18.5374 19.4384 18.6201 19.2545 18.6516C18.9384 18.7058 18.6376 18.8428 18.3839 19.05C18.1301 19.2572 17.9323 19.5275 17.81 19.835L17.745 20C17.6773 20.1837 17.5559 20.3423 17.397 20.4537C17.2381 20.5651 17.0495 20.6241 16.8561 20.6229C16.6627 20.6217 16.4747 20.5603 16.3173 20.4471C16.1599 20.3339 16.0409 20.1741 15.9762 19.99C15.8903 19.7423 15.7355 19.5236 15.5297 19.3601C15.3239 19.1966 15.0758 19.0954 14.8149 19.0684C14.554 19.0414 14.2919 19.0897 14.0616 19.2073C13.8313 19.3249 13.6432 19.5066 13.5216 19.7291C13.4 19.9516 13.3503 20.2048 13.3789 20.4554C13.4075 20.706 13.5129 20.9425 13.6815 21.1339C13.8501 21.3253 14.0739 21.4629 14.3235 21.5294C14.5731 21.5959 14.8367 21.5883 15.082 21.5074C15.3273 21.4265 15.5429 21.2761 15.7 21.075L15.8 21C16.0357 20.7718 16.3351 20.6182 16.6594 20.5601C16.9838 20.502 17.3184 20.5419 17.62 20.675" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    
    <style>
      .ticker:hover {
        animation-play-state: paused;
      }
      @keyframes scroll {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    </style>
  `;
  
  // Duplicate items for seamless scrolling
  const ticker = slot.querySelector('.ticker');
  ticker.innerHTML += ticker.innerHTML;
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initBreakingNewsBar);
st initBreakingNewsBar = () => {
  const slot = document.getElementById('next-section-slot');
  if (!slot) return;

  // Channel database with mock news items
  const CHANNELS = {
    'Aaj Tak': {
      logo: 'https://example.com/aajtak.png',
      news: [
        { text: 'Delhi temperature hits 45°C, red alert issued', url: 'https://aajtak.com/weather' },
        { text: 'Rahul Gandhi to address rally in Mumbai today', url: 'https://aajtak.com/politics' }
      ]
    },
    'Zee News': {
      logo: 'https://example.com/zeenews.png',
      news: [
        { text: 'Stock market crashes as election results surprise investors', url: 'https://zeenews.com/market' },
        { text: 'New education policy to be implemented from June', url: 'https://zeenews.com/education' }
      ]
    },
    // ... (other channels with their news items)
  };

  // Get user's selected channels from localStorage or set default
  const getSelectedChannels = () => {
    const saved = localStorage.getItem('breakingNewsChannels');
    return saved ? JSON.parse(saved) : ['Aaj Tak', 'Zee News', 'NDTV'];
  };

  // Settings Modal
  const renderSettingsModal = () => {
    return `
      <div id="news-settings-modal" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      ">
        <div style="
          background: white;
          padding: 24px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
        ">
          <h3 style="margin-top: 0;">Select News Channels (Max 6)</h3>
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 12px;
            margin-bottom: 20px;
          ">
            ${Object.keys(CHANNELS).map(channel => `
              <label style="
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                padding: 8px;
                border-radius: 4px;
                background: ${getSelectedChannels().includes(channel) ? '#f0f7ff' : '#f5f5f5'};
              ">
                <input 
                  type="checkbox" 
                  value="${channel}" 
                  ${getSelectedChannels().includes(channel) ? 'checked' : ''}
                  onchange="handleChannelSelection(this)"
                  style="cursor: pointer;"
                >
                <img src="${CHANNELS[channel].logo}" alt="${channel}" style="width: 20px; height: 20px; object-fit: contain;">
                ${channel}
              </label>
            `).join('')}
          </div>
          <button onclick="document.getElementById('news-settings-modal').remove()" style="
            background: #ef4444;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          ">
            Save Preferences
          </button>
        </div>
      </div>
    `;
  };

  // Handle channel selection with max 6 limit
  window.handleChannelSelection = (checkbox) => {
    const selected = getSelectedChannels();
    if (checkbox.checked && selected.length >= 6) {
      checkbox.checked = false;
      alert('Maximum 6 channels allowed');
      return;
    }
    
    if (checkbox.checked) {
      selected.push(checkbox.value);
    } else {
      const index = selected.indexOf(checkbox.value);
      if (index > -1) selected.splice(index, 1);
    }
    
    localStorage.setItem('breakingNewsChannels', JSON.stringify(selected));
  };

  // Generate news items from selected channels
  const generateNewsItems = () => {
    const selectedChannels = getSelectedChannels();
    let allNews = [];
    
    selectedChannels.forEach(channel => {
      if (CHANNELS[channel]) {
        allNews = [...allNews, ...CHANNELS[channel].news];
      }
    });
    
    // Shuffle and limit to 20 items for performance
    return allNews.sort(() => 0.5 - Math.random()).slice(0, 20);
  };

  // Render the breaking news bar
  const newsItems = generateNewsItems();
  
  slot.innerHTML = `
    <div style="
      background: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 16px 0;
      position: relative;
    ">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="
          background: #EF4444;
          color: white;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-weight: 600;
          flex-shrink: 0;
        ">Breaking News</span>
        
        <div style="
          flex: 1;
          overflow: hidden;
          position: relative;
          height: 24px;
        ">
          <div style="
            position: absolute;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            gap: 16px;
            animation: scroll 60s linear infinite;
          " class="ticker">
            ${newsItems.map(item => `
              <a href="${item.url}" style="
                color: #1F2937;
                text-decoration: none;
                font-size: 0.95rem;
                cursor: pointer;
                display: inline-block;
                max-width: 300px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              " title="${item.text}">${item.text}</a>
            `).join('')}
          </div>
        </div>
        
        <button onclick="document.body.insertAdjacentHTML('beforeend', \`${renderSettingsModal()}\`)" style="
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          margin-left: 8px;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="#6B7280"/>
            <path d="M19.4 15C19.2669 15.3016 19.227 15.6362 19.2851 15.9606C19.3432 16.2849 19.4968 16.5843 19.725 16.82L19.8 16.9C19.9339 17.0339 20.0282 17.2024 20.0731 17.3867C20.118 17.571 20.1118 17.764 20.0552 17.9449C19.9986 18.1259 19.8937 18.2878 19.7523 18.4126C19.6108 18.5374 19.4384 18.6201 19.2545 18.6516C18.9384 18.7058 18.6376 18.8428 18.3839 19.05C18.1301 19.2572 17.9323 19.5275 17.81 19.835L17.745 20C17.6773 20.1837 17.5559 20.3423 17.397 20.4537C17.2381 20.5651 17.0495 20.6241 16.8561 20.6229C16.6627 20.6217 16.4747 20.5603 16.3173 20.4471C16.1599 20.3339 16.0409 20.1741 15.9762 19.99C15.8903 19.7423 15.7355 19.5236 15.5297 19.3601C15.3239 19.1966 15.0758 19.0954 14.8149 19.0684C14.554 19.0414 14.2919 19.0897 14.0616 19.2073C13.8313 19.3249 13.6432 19.5066 13.5216 19.7291C13.4 19.9516 13.3503 20.2048 13.3789 20.4554C13.4075 20.706 13.5129 20.9425 13.6815 21.1339C13.8501 21.3253 14.0739 21.4629 14.3235 21.5294C14.5731 21.5959 14.8367 21.5883 15.082 21.5074C15.3273 21.4265 15.5429 21.2761 15.7 21.075L15.8 21C16.0357 20.7718 16.3351 20.6182 16.6594 20.5601C16.9838 20.502 17.3184 20.5419 17.62 20.675" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    
    <style>
      .ticker:hover {
        animation-play-state: paused;
      }
      @keyframes scroll {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    </style>
  `;
  
  // Duplicate items for seamless scrolling
  const ticker = slot.querySelector('.ticker');
  ticker.innerHTML += ticker.innerHTML;
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initBreakingNewsBar);
