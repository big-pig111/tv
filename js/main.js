// 语言包
const i18n = {
  zh: {
    home: '首页', start: '开始直播', discover: '发现', headline: 'LetsBonk 电视', discover_headline: '发现 Live Streams', start_headline: '使用您的代币上线', token_address: 'Token 地址', stream_url: '流 URL', title: '流标题', desc: '流描述', tags: '标签', submit: '提交', search_placeholder: '搜索/标签...'
  },
  en: {
    home: 'Home', start: 'Start Live', discover: 'Discover', headline: 'LetsBonk TV', discover_headline: 'Discover Live Streams', start_headline: 'Go Live with Your Token', token_address: 'Token Address', stream_url: 'Stream URL', title: 'Title', desc: 'Description', tags: 'Tags', submit: 'Submit', search_placeholder: 'Search/Tag...'
  }
};
window.lang = localStorage.getItem('letsbonk_lang') || 'zh';

function setLang(lang) {
  window.lang = lang;
  localStorage.setItem('letsbonk_lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang][key]) el.textContent = i18n[lang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (i18n[lang][key]) el.placeholder = i18n[lang][key];
  });
  window.updateWalletBtn && window.updateWalletBtn();
}

// 主题切换
const themeToggle = document.getElementById('themeToggle');
themeToggle && themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// 语言切换
const langSelect = document.getElementById('langSelect');
langSelect && langSelect.addEventListener('change', e => setLang(e.target.value));
window.addEventListener('DOMContentLoaded', () => {
  langSelect && (langSelect.value = window.lang);
  setLang(window.lang);
});

// 直播流卡片渲染
function renderLives(lives) {
  const liveList = document.getElementById('liveList');
  if (!liveList) return;
  liveList.innerHTML = '';
  if (!lives.length) {
    liveList.innerHTML = '<div style="text-align:center;margin:2em;">' + (window.lang === 'en' ? 'No live streams yet.' : '暂无直播流') + '</div>';
    return;
  }
  lives.forEach(live => {
    const videoId = getYoutubeId(live.url);
    const card = document.createElement('div');
    card.className = 'live-card';
    card.setAttribute('data-id', live.id);
    card.innerHTML = `
      <div class="live-thumb">
        ${videoId ? `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>` : '<div class="no-thumb">No Preview</div>'}
      </div>
      <div class="live-info">
        <div class="live-title">${live.title}</div>
        <div class="live-desc">${live.desc || ''}</div>
        <div class="live-tags">${live.tags ? live.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('') : ''}</div>
        ${live.host ? `<div class="live-host">@${live.host}</div>` : ''}
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `live.html?id=${live.id}`;
    });
    liveList.appendChild(card);
  });
}

function getYoutubeId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : '';
}

// 首页/发现页渲染
if (document.getElementById('liveList')) {
  let lives = window.LetsBonkData.getLives();
  if (location.pathname.endsWith('discover.html')) {
    // 搜索和标签筛选
    const searchInput = document.getElementById('searchInput');
    const tagFilter = document.getElementById('tagFilter');
    // 填充标签
    const tags = window.LetsBonkData.getAllTags();
    tags.forEach(tag => {
      const opt = document.createElement('option');
      opt.value = tag;
      opt.textContent = tag;
      tagFilter.appendChild(opt);
    });
    function filter() {
      const kw = searchInput.value.trim();
      const tag = tagFilter.value;
      renderLives(window.LetsBonkData.searchLives(kw, tag));
    }
    searchInput && searchInput.addEventListener('input', filter);
    tagFilter && tagFilter.addEventListener('change', filter);
    filter();
  } else {
    renderLives(lives);
  }
}

// 开始直播页表单
const liveForm = document.getElementById('liveForm');
liveForm && liveForm.addEventListener('submit', e => {
  e.preventDefault();
  const live = {
    token: document.getElementById('tokenAddress').value.trim(),
    url: document.getElementById('streamUrl').value.trim(),
    title: document.getElementById('streamTitle').value.trim(),
    desc: document.getElementById('streamDesc').value.trim(),
    tags: document.getElementById('streamTags').value.trim()
  };
  if (!live.url || !live.title) return alert(window.lang === 'en' ? 'Please fill in required fields.' : '请填写必填项');
  window.LetsBonkData.addLive(live);
  alert(window.lang === 'en' ? 'Live stream added!' : '直播流已添加！');
  location.href = 'index.html';
});

// 详情页渲染
if (location.pathname.endsWith('live.html')) {
  window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const idx = parseInt(params.get('i'), 10);
    const lives = window.LetsBonkData.getLives();
    const live = lives[idx];
    if (!live) {
      document.body.innerHTML = '<div style="text-align:center;margin:4em;font-size:1.5em;">直播流不存在</div>';
      return;
    }
    const videoId = getYoutubeId(live.url);
    document.body.innerHTML = `
      <nav class="navbar">
        <div class="logo"><img src="assets/logo.png" alt="LetsBonk"/> LetsBonk</div>
        <ul class="nav-links">
          <li><a href="index.html" data-i18n="home">首页</a></li>
          <li><a href="start.html" data-i18n="start">开始直播</a></li>
          <li><a href="discover.html" data-i18n="discover">发现</a></li>
        </ul>
        <div class="nav-actions">
          <button id="walletBtn"></button>
          <button id="themeToggle">🌙</button>
          <select id="langSelect">
            <option value="zh">中文</option>
            <option value="en">EN</option>
          </select>
        </div>
      </nav>
      <main style="max-width:1200px;margin:2em auto;display:flex;gap:2em;align-items:flex-start;">
        <div style="flex:2;">
          <h1 style="font-size:2em;font-weight:700;margin-bottom:0.5em;">${live.title}</h1>
          <div style="margin-bottom:1em;display:flex;align-items:center;gap:1em;">
            <span style="background:#ff6a00;color:#fff;padding:0.3em 1em;border-radius:12px;font-weight:600;">LIVE</span>
            <div class="live-tags">${live.tags ? live.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('') : ''}</div>
          </div>
          <div style="background:#f7f7f7;padding:1em;border-radius:12px;margin-bottom:1.5em;">
            <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="width:100%;height:400px;border-radius:12px;"></iframe>
          </div>
          <div style="font-size:1.1em;color:#666;">${live.desc || ''}</div>
        </div>
        <aside style="flex:1;min-width:280px;max-width:340px;display:flex;flex-direction:column;gap:1.5em;">
          <div style="background:#fff;padding:1.2em 1em;border-radius:12px;box-shadow:0 2px 8px #0001;">
            <div style="font-weight:600;margin-bottom:0.5em;">Token 信息</div>
            <div style="font-size:0.98em;">Token: <span style="color:#ff6a00;">${live.token || '-'}</span></div>
          </div>
        </aside>
      </main>
    `;
    window.updateWalletBtn && window.updateWalletBtn();
  });
} 