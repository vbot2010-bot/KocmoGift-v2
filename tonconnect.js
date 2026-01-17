          document.addEventListener("DOMContentLoaded", async () => {

  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://kocmogift-v22.vercel.app//tonconnect-manifest.json"
  });

  window.tonConnectUI = tonConnectUI;

  let walletAddress = null;

  const walletText = document.getElementById("wallet");
  const disconnectBtn = document.getElementById("disconnect");

  function showConnected(address) {
    walletText.innerText =
      "Кошелёк: " +
      address.slice(0, 6) +
      "..." +
      address.slice(-4);

    disconnectBtn.style.display = "block";
  }

  function showDisconnected() {
    walletText.innerText = "Кошелёк не подключён";
    disconnectBtn.style.display = "none";
  }

  // 🔴 КЛЮЧЕВОЕ МЕСТО
  function syncWalletState() {
    const wallet = tonConnectUI.wallet;
    if (wallet && wallet.account && wallet.account.address) {
      walletAddress = wallet.account.address;
      showConnected(walletAddress);
    } else {
      walletAddress = null;
      showDisconnected();
    }
  }

  // 1️⃣ синхронизация при загрузке
  syncWalletState();

  // 2️⃣ синхронизация при любом изменении
  tonConnectUI.onStatusChange(() => {
    // ⏱ небольшая задержка — КЛЮЧ
    setTimeout(syncWalletState, 300);
  });

  // 3️⃣ глобальные функции
  window.connectWallet = () => {
    tonConnectUI.openModal();

    // 🔁 повторная проверка после выбора кошелька
    setTimeout(syncWalletState, 1000);
  };

  window.disconnectWallet = async () => {
    await tonConnectUI.disconnect();
    walletAddress = null;
    showDisconnected();
  };

  window.sendTon = async () => {
    if (!walletAddress) {
      alert("Сначала подключи кошелёк");
      return;
    }

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: "UQAFXBXzBzau6ZCWzruiVrlTg3HAc8MF6gKIntqTLDifuWOi",
          amount: "1000000000"
        }
      ]
    };

    try {
      await tonConnectUI.sendTransaction(transaction);
      addBalance(1);
      alert("TON отправлены");
    } catch {
      alert("Отменено");
    }
  };

});
