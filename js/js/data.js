// 直播流数据管理 + Firebase Firestore 集成
// 本地存储相关已移除
import { collection, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { db } from "./firebase.js";

// Firebase 就绪状态检查
async function checkFirebaseReady() {
  try {
    if (!db) {
      console.error('Firebase db 对象未初始化');
      return false;
    }
    // 尝试访问 Firestore 来验证连接
    console.log('Firebase db 对象已存在，检查连接...');
    return true;
  } catch (error) {
    console.error('Firebase 连接检查失败:', error);
    return false;
  }
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
  
  // 检查 Firebase 就绪状态
  const firebaseReady = await checkFirebaseReady();
  console.log('Firebase状态:', firebaseReady);
  
  if (firebaseReady) {
    try {
      console.log('开始上传到Firebase...');
      console.log('使用的 db 对象:', db);
      console.log('collection 函数:', collection);
      console.log('addDoc 函数:', addDoc);
      
      const collectionRef = collection(db, "lives");
      console.log('集合引用:', collectionRef);
      
      const docRef = await addDoc(collectionRef, live);
      console.log('上传成功! 文档ID:', docRef.id);
      return docRef;
    } catch (e) {
      console.error("Firebase上传失败:", e);
      console.error("错误详情:", e.message, e.code);
      throw e;
    }
  } else {
    const error = new Error('Firebase未就绪！请检查网络连接和Firebase配置');
    console.error(error.message);
    throw error;
  }
}

// 拉取云端所有直播流
async function fetchLivesFromFirebase() {
  const firebaseReady = await checkFirebaseReady();
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
async function listenLivesFromFirebase(renderLives) {
  const firebaseReady = await checkFirebaseReady();
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

export { getLives, saveLives, addLive, searchLives, getAllTags, fetchLivesFromFirebase, listenLivesFromFirebase }; 