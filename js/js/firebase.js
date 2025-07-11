import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

console.log('开始初始化 Firebase...');

const firebaseConfig = {
  apiKey: "AIzaSyA5Z5ieEbAcfQX0kxGSn9ldGXhzvAwx_8M",
  authDomain: "chat-294cc.firebaseapp.com",
  databaseURL: "https://chat-294cc-default-rtdb.firebaseio.com",
  projectId: "chat-294cc",
  storageBucket: "chat-294cc.firebasestorage.app",
  messagingSenderId: "913615304269",
  appId: "1:913615304269:web:0274ffaccb8e6b678e4e04",
  measurementId: "G-SJR9NDW86B"
};

console.log('Firebase 配置:', firebaseConfig);

try {
  const app = initializeApp(firebaseConfig);
  console.log('Firebase app 初始化成功:', app);
  
  const db = getFirestore(app);
  console.log('Firestore 初始化成功:', db);
  
  // 导出 db
  export { db };
} catch (error) {
  console.error('Firebase 初始化失败:', error);
  throw error;
} 