const initTopHeader = () => {
  const slot = document.getElementById('top-header-slot');
  if (!slot) return;

  const logoSrc = 'https://via.placeholder.com/64'; // एडमिन से डायनामिक कर सकते हैं
  const stories = [
    { img: 'https://via.placeholder.com/56', username: 'friend1' },
    { img: 'https://via.placeholder.com/56', username: 'friend2' },
    { img: 'https://via.placeholder.com/56', username: 'friend3' },
    { img: 'https://via.placeholder.com/56', username: 'friend4' },
  ];

  slot.innerHTML = `
    <div style="
      background: white;
      max-height: 80px;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      border-radius: 8px;
      font-family: Arial, sans-serif;
    ">
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="${logoSrc}" alt="Brand Logo" style="
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
        ">
        <div style="display: flex; align-items: baseline; gap: 6px;">
          <h1 style="
            font-size: 1.5rem;
            font-weight: bold;
            color: #064e3b; /* Dark Green */
            margin: 0;
            font-family: Arial, sans-serif;
          ">ShivExa</h1>
          <span style="
            font-size: 1.3rem;
            color: #4b2e05; /* Dark Brown */
            font-family: 'Brush Script MT', cursive;
            margin-left: 4px;
          ">Global Plus</span>
        </div>
      </div>
      <div style="display: flex; gap: 16px; align-items: center;">
        <button onclick="window.location='/cart'" style="background: none; border: none; cursor: pointer;">
          <span style="font-size: 32px;">🛒</span>
        </button>
        <button onclick="window.location='/activity'" class="like-button" style="
          border: 2px solid #555;
          background: transparent;
          padding: 6px 14px;
          font-size: 20px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
          ">
          ❤️
        </button>
        <button onclick="window.location='/messages'" style="background: none; border: none; cursor: pointer;">
          <svg class="sms-icon" xmlns="http://www.w3.org/2000/svg" fill="#555" viewBox="0 0 24 24" width="28px" height="28px" style="cursor:pointer; transition: fill 0.3s ease;">
            <path d="M2 2h20v16H6l-4 4V2z"/>
          </svg>
        </button>
        <button onclick="window.location='/settings'" style="background: none; border: none; cursor: pointer;">
          <span style="font-size: 32px;">☰</span>
        </button>
      </div>
    </div>
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 8px 0;">
    <div style="padding: 12px 20px;">
      <h2 style="font-size: 1.1rem; font-weight: 600; margin: 0 0 8px;">My Story</h2>
      <div style="
        display: flex;
        gap: 12px;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      ">
        ${stories.map(story => `
          <div style="flex: 0 0 auto;">
            <div style="
              position: relative;
              width: 56px;
              height: 56px;
            ">
              <img src="${story.img}" alt="${story.username}" style="
                width: 56px;
                height: 56px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #FF512F; /* Instagram style border */
              ">
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <style>
      #top-header-slot::-webkit-scrollbar {
        display: none;
      }
      .like-button:hover {
        background-color: #064e3b;
        color: white;
      }
      .sms-icon:hover {
        fill: #064e3b;
      }
    </style>
  `;
};

initTopHeader();
