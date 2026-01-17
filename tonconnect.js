                // ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let tonConnectUI = null;
let walletAddress = null;

// ===== UI =====
function showConnected(address) {
  document.getElementById("wallet").innerText =
    "Кошелёк: " + address.slice(0, 6) + "..." + address.slice(-4);
  document.getElementById("disconnect").style.display = "block";
}

function showDisconnected() {
  document.getElementById("wallet").innerText = "Кошелёк не подключён";
  document.getElementById("disconnect").style.display = "none";
}

// ===== СИНХРОНИЗАЦИЯ =====
function syncWalletState() {
  const wallet = tonConnectUI.wallet;
  if (wallet && wallet.account?.address) {
    walletAddress = wallet.account.address;
    showConnected(walletAddress);
  } else {
    walletAddress = null;
    showDisconnected();
  }
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener("DOMContentLoaded", () => {

  tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://kocmogift-v22.vercel.app//tonconnect-manifest.json"
  });

  // при загрузке
  setTimeout(syncWalletState, 300);

  // при изменениях
  tonConnectUI.onStatusChange(() => {
    setTimeout(syncWalletState, 300);
  });
});

// ====== ГЛОБАЛЬНЫЕ ФУНКЦИИ (КЛЮЧ!) ======
window.connectWallet = function () {
  tonConnectUI.openModal();
};

window.disconnectWallet = async function () {
  await tonConnectUI.disconnect();
  walletAddress = null;
  showDisconnected();
};

window.sendTon = async function () {
  if (!walletAddress) {
    alert("Сначала подключи кошелёк");
    return;
  }

  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 300,
    messages: [
      {
        address: "UQAFXBXzBzau6ZCWzruiVrlTg3HAc8MF6gKIntqTLDifuWOi",
        amount: "1000000000" // 1 TON
      }
    ]
  };

  try {
    await tonConnectUI.sendTransaction(transaction);
    addBalance(1);
    alert("TON отправлены");
  } catch {
    alert("Транзакция отменена");
  }
};
