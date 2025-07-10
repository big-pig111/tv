// 直播流数据管理 + Firebase Firestore 集成
// 本地存储相关已移除

// Firebase Firestore helpers
let firebaseReady = false;
let db, collection, addDoc, getDocs, onSnapshot;

if (window.firebaseDB) {
  firebaseReady = true;
  db = window.firebaseDB;
  collection = window.firebaseCollection;
  addDoc = window.firebaseAddDoc;
  getDocs = window.firebaseGetDocs;
  onSnapshot = window.firebaseOnSnapshot;
}

// 仅从云端获取
function getLives() {
  // 返回空数组，实际页面应调用fetchLivesFromFirebase
  return [];
}

function saveLives(lives) {
  // 空实现
}

async function addLive(live) {
  live.id = live.id || (Date.now() + Math.random().toString(16).slice(2));
  console.log('准备上传直播流:', live);
  console.log('Firebase状态:', firebaseReady);
  
  if (firebaseReady) {
    try {
      console.log('开始上传到Firebase...');
      const docRef = await addDoc(collection(db, "lives"), live);
      console.log('上传成功! 文档ID:', docRef.id);
      return docRef;
    } catch (e) {
      console.error("Firebase上传失败:", e);
      throw e;
    }
  } else {
    console.error('Firebase未就绪！请检查Firebase初始化');
  }
}

// 拉取云端所有直播流
async function fetchLivesFromFirebase() {
  if (firebaseReady) {
    const querySnapshot = await getDocs(collection(db, "lives"));
    const lives = [];
    querySnapshot.forEach((doc) => {
      lives.push(doc.data());
    });
    return lives;
  }
  return [];
}

// 实时同步（可选）
function listenLivesFromFirebase(renderLives) {
  if (firebaseReady) {
    onSnapshot(collection(db, "lives"), (snapshot) => {
      const lives = [];
      snapshot.forEach(doc => lives.push(doc.data()));
      renderLives(lives);
    });
  }
}

function searchLives(keyword, tag, lives) {
  // 传入lives数组进行搜索
  let result = lives || [];
  if (keyword) {
    result = result.filter(l => l.title.includes(keyword) || l.desc.includes(keyword));
  }
  if (tag) {
    result = result.filter(l => l.tags && l.tags.split(',').map(t => t.trim()).includes(tag));
  }
  return result;
}

function getAllTags(lives) {
  // 传入lives数组获取所有标签
  const tags = new Set();
  (lives || []).forEach(l => {
    if (l.tags) l.tags.split(',').forEach(t => tags.add(t.trim()));
  });
  return Array.from(tags);
}

window.LetsBonkData = { getLives, saveLives, addLive, searchLives, getAllTags, fetchLivesFromFirebase, listenLivesFromFirebase }; 