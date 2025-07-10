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