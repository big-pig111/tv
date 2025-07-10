// 直播流数据管理
const STORAGE_KEY = 'letsbonk_lives';

function getLives() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLives(lives) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lives));
}

function addLive(live) {
  const lives = getLives();
  lives.unshift(live);
  saveLives(lives);
}

// 添加示例直播流（仅首次加载时）
(function addExampleLive() {
  if (!getLives().length) {
    addLive({
      token: '',
      url: 'https://youtu.be/gCNeDWCI0vo',
      title: '24/7 Lofi Hip Hop Radio',
      desc: '',
      tags: '音乐, Lofi, 直播'
    });
  }
})();

(function addFixedLive() {
  const lives = getLives();
  const exist = lives.some(l => l.url === 'https://youtu.be/wt6SIE7BXS8');
  if (!exist) {
    addLive({
      token: 'soon',
      url: 'https://youtu.be/wt6SIE7BXS8',
      title: 'Watch FOX Weather Channel Live Stream: Tracking Breaking Weather News, Local and National Forecasts',
      desc: '',
      tags: '天气, 新闻, 直播'
    });
  }
})();

function searchLives(keyword, tag) {
  let lives = getLives();
  if (keyword) {
    lives = lives.filter(l => l.title.includes(keyword) || l.desc.includes(keyword));
  }
  if (tag) {
    lives = lives.filter(l => l.tags && l.tags.split(',').map(t => t.trim()).includes(tag));
  }
  return lives;
}

function getAllTags() {
  const lives = getLives();
  const tags = new Set();
  lives.forEach(l => {
    if (l.tags) l.tags.split(',').forEach(t => tags.add(t.trim()));
  });
  return Array.from(tags);
}

window.LetsBonkData = { getLives, saveLives, addLive, searchLives, getAllTags }; 