// 钱包连接逻辑
const walletBtn = document.getElementById('walletBtn');
let currentAccount = null;

function updateWalletBtn() {
  if (currentAccount) {
    walletBtn.textContent = currentAccount.slice(0, 6) + '...' + currentAccount.slice(-4);
  } else {
    walletBtn.textContent = (window.lang === 'en') ? 'Connect Wallet' : '选择 Wallet';
  }
}

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      currentAccount = accounts[0];
      updateWalletBtn();
    } catch (err) {
      alert((window.lang === 'en') ? 'Wallet connection failed' : '钱包连接失败');
    }
  } else {
    alert((window.lang === 'en') ? 'Please install MetaMask' : '请安装 MetaMask');
  }
}

walletBtn && walletBtn.addEventListener('click', connectWallet);
window.addEventListener('DOMContentLoaded', updateWalletBtn);
window.updateWalletBtn = updateWalletBtn; 