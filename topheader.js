const initTopHeader = () => {
  const slot = document.getElementById('top-header-slot');
  if (!slot) return;

  // TODO: Replace with dynamic logo src from admin panel
  const logoSrc = 'https://via.placeholder.com/64';
  // TODO: Replace with dynamic story data of followed users from API
  const followedStories = [
    { img: 'https://via.placeholder.com/56', id: 'user1' },
    { img: 'https://via.placeholder.com/56', id: 'user2' },
    { img: 'https://via.placeholder.com/56', id: 'user3' },
    { img: 'https://via.placeholder.com/56', id: 'user4' },
  ];

  slot.innerHTML = `
    <div style="
      background: white;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="${logoSrc}" alt="Brand Logo" style="
          width: 45px;
          height: 45px;
          border-radius: 50%;
          object-fit: cover;
        ">
        <h1 style="
  font-family: 'Playfair Display', serif;  /* add the Google Font link in <head> */
  font-size: 1.5rem;
  font-weight: 700;
  color: #06380a;
  margin: 0;
">ShivExa</h1>
  <p style="
    font-family: 'Montserrat', sans-serif;   /* add the Google Font link in <head> */
    font-size: 0.9rem;
    font-weight: 600;
    color: #747171;
    margin: 0;
  ">Global Plus</p>
</div>
      </div>
      <div style="display: flex; gap: 16px;">
        <button onclick="window.location='/cart'" style="background: none; border: none; cursor: pointer;">
          <span style="font-size:   26px;">🛒</span>
        </button>
        <button onclick="window.location='/activity'" style="background: none; border: none; cursor: pointer;">
          <span style="font-size:   26px;">♡</span>
        </button>
        <button onclick="window.location='/post'" style="background: none; border: none; cursor: pointer;">
          <span style="font-size:   26px;">➕</span>
        </button>
      </div>
    </div>
    <div style="padding: 12px 20px;">
      <div style="
        display: flex;
        gap: 12px;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      ">
        <div style="flex: 0 0 auto;">
          <button onclick="window.location='/add-story'" style="background: none; border: none; cursor: pointer;">
            <div style="
              position: relative;
              width: 56px;
              height: 56px;
            ">
              <img src="https://via.placeholder.com/56" alt="Your Story" style="
                width: 56px;
                height: 56px;
                border-radius: 50%;
                object-fit: cover;
              ">
              <div style="
                position: absolute;
                bottom: 0;
                right: 0;
                width: 24px;
                height: 24px;
                background: #000;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
              ">+</div>
            </div>
            <p style="text-align: center; font-size: 0.8rem; color: #000; margin: 4px 0 0;">Your Story</p>
          </button>
        </div>
        ${followedStories.map(story => `
          <div style="flex: 0 0 auto;">
            <div style="
              position: relative;
              width: 56px;
              height: 56px;
            ">
              <img src="${story.img}" alt="Story" style="
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
            <p style="text-align: center; font-size: 0.8rem; color: #000; margin: 4px 0 0;">${story.id}</p>
          </div>
        `).join('')}
      </div>
    </div>
    <style>
      #top-header-slot::-webkit-scrollbar {
        display: none;
      }
    </style>
  `;
};

initTopHeader();
