<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@600&display=swap" rel="stylesheet">
const initTopHeader = () => {
  const slot = document.getElementById('top-header-slot');
  if (!slot) return;

  // TODO: Replace with dynamic logo src from admin panel
  const logoSrc = 'https://via.placeholder.com/64';
  const stories = [
    { img: 'https://via.placeholdercom/56', username: 'friend1' },
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
    ">
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="${logoSrc}" alt="Brand Logo" style="
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
        ">
        <div>
          <h1 style="
          font-family: 'Playfair Display', serif; 
            font-size: 1.25rem;
            font-weight: bold;
            color: #075E37;
            margin: 0;
          ">ShivExa Global Pro</h1>
          <p style="
            font-size: 0.8rem;
            color: #7B3F00;
            margin: 0;
          ">ShivExa Global</p>
        </div>
      </div>
      <div style="display: flex; gap: 16px;">
        <button onclick="window.location='/cart'" style="background: none; border: none; cursor: pointer;">
          <span style="font-size: 32px;">🛒</span>
        </button>
        <button onclick="window.location='/activity'" style="background: none; border: none; cursor: pointer;">
          <span style="font-size: 32px;">❤️</span>
        </button>
        <button onclick="window.location='/messages'" style="background: none; border: none; cursor: pointer;">
          <span style="font-size: 32px;">📩</span>
        </button>
        <button onclick="window.location='/settings'" style="background: none; border: none; cursor: pointer;">
          <span style="font-size: 32px;">☰</span>
        </button>
      </div>
    </div>
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 0;">
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
              ">
              <div style="
                position: absolute;
                inset: 0;
                border-radius: 50%;
                border: 2px solid transparent;
                background: linear-gradient(45deg, #FF512F, #F09819);
                -webkit-mask: linear-gradient(#fff 0 0);
                mask: linear-gradient(#fff 0 0);
              "></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <div id="next-section-slot"></div>
    <style>
      #top-header-slot::-webkit-scrollbar {
        display: none;
      }
    </style>
  `;
};

initTopHeader();
