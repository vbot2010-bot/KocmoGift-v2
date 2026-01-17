document.addEventListener("DOMContentLoaded", async () => {

  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://kocmogift-v22.vercel.app//tonconnect-manifest.json"
  });

  window.tonConnectUI = tonConnectUI;

  let walletAddress = null;

  function updateUI(address) {
    if (address) {
      document.getElementById("wallet").innerText =
        "Кошелёк: " +
        address.slice(0, 6) +
        "..." +
        address.slice(-4);

      document.getElementById("disconnect").style.display = "block";
    } else {
      document.getElementById("wallet").innerText = "Кошелёк не подключён";
      document.getElementById("disconnect").style.display = "none";
    }
  }

  // 🔹 1. Проверяем существующее подключение (КЛЮЧЕВО!)
  const currentWallet = tonConnectUI.wallet;
  if (currentWallet) {
    walletAddress = currentWallet.account.address;
    updateUI(walletAddress);
  }

  // 🔹 2. Подписка на изменения
  tonConnectUI.onStatusChange(wallet => {
    if (wallet?.account?.address) {
      walletAddress = wallet.account.address;
      updateUI(walletAddress);
    } else {
      walletAddress = null;
      updateUI(null);
    }
  });

  // 🔹 3. Глобальные функции
  window.connectWallet = () => {
    tonConnectUI.openModal();
  };

  window.disconnectWallet = async () => {
    await tonConnectUI.disconnect();
    walletAddress = null;
    updateUI(null);
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
