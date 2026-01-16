const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://YOUR_DOMAIN/tonconnect-manifest.json"
});

let walletAddress = null;

// подключение кошелька
async function connectWallet() {
  await tonConnectUI.connectWallet();
}

tonConnectUI.onStatusChange(wallet => {
  if (wallet) {
    walletAddress = wallet.account.address;
    document.getElementById("wallet").innerText =
      "Кошелёк: " + walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
  }
});

// отправка TON (РЕАЛЬНАЯ)
async function sendTon() {
  if (!walletAddress) {
    alert("Сначала подключи кошелёк");
    return;
  }

  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 300,
    messages: [
      {
        address: "ТВОЙ_TON_КОШЕЛЕК", // ← сюда твой адрес
        amount: "1000000000" // 1 TON (в nanoTON)
      }
    ]
  };

  await tonConnectUI.sendTransaction(transaction);

  // ⚠️ ПОКА ЧТО: начисляем визуально
  addBalance(1);
}
