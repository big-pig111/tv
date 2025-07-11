// 这里假设 main.js 需要用到 data.js 的导出
import { addLive } from './data.js';

// 等待页面加载完成
document.addEventListener('DOMContentLoaded', () => {
  console.log('页面加载完成，开始初始化表单事件');
  
  const form = document.getElementById('liveForm');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  if (form) {
    console.log('找到表单，添加事件监听器');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // 阻止表单默认提交
      console.log('表单提交事件触发');
      
      // 禁用提交按钮，防止重复提交
      submitBtn.disabled = true;
      submitBtn.textContent = '提交中...';
      
      try {
        // 收集表单数据
        const liveData = {
          token: document.getElementById('tokenAddress').value.trim(),
          url: document.getElementById('streamUrl').value.trim(),
          title: document.getElementById('streamTitle').value.trim(),
          desc: document.getElementById('streamDesc').value.trim(),
          tags: document.getElementById('streamTags').value.trim(),
          createdAt: new Date().toISOString(),
          status: 'active'
        };
        
        console.log('收集到的表单数据:', liveData);
        
        // 简单验证
        if (!liveData.token || !liveData.url || !liveData.title) {
          throw new Error('请填写必填字段：Token地址、流URL、标题');
        }
        
        // 调用 addLive 上传到 Firebase
        console.log('开始调用 addLive...');
        const result = await addLive(liveData);
        console.log('addLive 返回结果:', result);
        
        // 成功提示
        alert('直播流提交成功！');
        form.reset(); // 清空表单
        
      } catch (error) {
        console.error('提交失败:', error);
        alert(`提交失败: ${error.message}`);
      } finally {
        // 恢复提交按钮
        submitBtn.disabled = false;
        submitBtn.textContent = '提交';
      }
    });
    
    console.log('表单事件监听器添加完成');
  } else {
    console.error('未找到表单元素 #liveForm');
  }
});

// 测试 Firebase 连接
import { db } from './firebase.js';
console.log('Firebase db 对象:', db); 