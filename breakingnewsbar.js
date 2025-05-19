const initBreakingNewsBar = () => {
  const slot = document.getElementById('next-section-slot');
  if (!slot) return;

  const news = [
    { text: 'CBSE releases new syllabus 📚', url: 'https://news.example.com/cbse' },
    { text: 'UPSC prelims date announced 🗓️', url: 'https://news.example.com/upsc' },
    { text: '50% off on UPSC PDFs 🔥', url: 'https://shivexa.com/deals' },
    { text: 'ShivExa mobile app coming soon 🚀', url: 'https://blog.shivexa.com/app' },
    { text: 'New IIT admissions Greta Thunberg', url: 'https://news.example.com/iit' },
    { text: 'CAT 2025 pattern changes revealed', url: 'https://news.example.com/cat' },
    { text: 'SSC CGL result declared 🎉', url: 'https://news.example.com/ssc' },
    { text: 'NET registration extended', url: 'https://news.example.com/net' },
    { text: 'Scholarships worth ₹10 Cr announced', url: 'https://news.example.com/scholar' },
    { text: 'IGNOU launches AI program 🤖', url: 'https://news.example.com/ignou' },
    { text: 'GATE 2025 syllabus released', url: 'https://news.example.com/gate' },
    { text: 'RBI Grade-B vacancies increased', url: 'https://news.example.com/rbi' },
    { text: 'NTA issues JEE guidelines', url: 'https://news.example.com/jee' },
    { text: 'KV admissions open online', url: 'https://news.example.com/kv' },
    { text: 'ISRO internship portal live 🌌', url: 'https://news.example.com/isro' },
    { text: 'Python outranks Java in survey', url: 'https://news.example.com/python' },
    { text: 'Edu-Tech funding hits $2 Bn', url: 'https://news.example.com/edtech' },
    { text: 'AI-based exam proctoring gains steam', url: 'https://news.example.com/proctor' },
    { text: 'Global MBA rankings 2025 released', url: 'https://news.example.com/mba' },
    { text: 'ShivExa partners with Flipkart Plus', url: 'https://news.example.com/flipkart' }
  ];

  slot.innerHTML = `
    <div style="
      background: white;
      padding: 60px 70px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 16px 20px;
    ">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="
          background: #EF4444;
          color: white;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-weight: 600;
        ">Breaking News</span>
        <div style="
          flex: 1;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 16px;
        " class="ticker">
          ${news.map((item, index) => `
            <a href="${item.url}" style="
              color: #1F2937;
              text-decoration: none;
              font-size: 0.95rem;
              cursor: pointer;
            ">${item.text}</a>
            ${index < news.length - 1 ? '<span style="color: #6B7280;">•</span>' : ''}
          `).join('')}
        </div>
      </div>
    </div>
    <div id="below-breaking-slot"></div>
    <style>
      #next-section-slot::-webkit-scrollbar {
        display: none;
      }
      .ticker {
        animation: scroll 30s linear infinite;
      }
      .ticker:hover {
        animation-play-state: paused;
      }
      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    </style>
  `;

  const ticker = slot.querySelector('.ticker');
  ticker.innerHTML += ticker.innerHTML; // Duplicate for seamless scroll
};

initBreakingNewsBar();
