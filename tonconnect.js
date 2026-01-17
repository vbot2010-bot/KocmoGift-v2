// ЖДЁМ, ПОКА СТРАНИЦА ЗАГРУЗИТСЯ
document.addEventListener("DOMContentLoaded", () => {

  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://kocmogift-v22.vercel.app//tonconnect-manifest.json"
  });

  window.tonConnectUI = tonConnectUI; // 👈 ВАЖНО

  let walletAddress = null;

  // статус кошелька
  tonConnectUI.onStatusChange(wallet => {
    if (wallet) {
      walletAddress = wallet.account.address;

      document.getElementById("wallet").innerText =
        "Кошелёк: " +
        walletAddress.slice(0, 6) +
        "..." +
        walletAddress.slice(-4);

      document.getElementById("disconnect").style.display = "block";
    } else {
      walletAddress = null;
      document.getElementById("wallet").innerText = "Кошелёк не подключён";
      document.getElementById("disconnect").style.display = "none";
    }
  });

  // 👇 ДЕЛАЕМ ФУНКЦИИ ГЛОБАЛЬНЫМИ
  window.connectWallet = function () {
    tonConnectUI.openModal();
  };

  window.disconnectWallet = function () {
    tonConnectUI.disconnect();
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
          address: "ТВОЙ_TON_КОШЕЛЕК", // ← твой адрес
          amount: "1000000000" // 1 TON
        }
      ]
    };

    try {
      await tonConnectUI.sendTransaction(transaction);
      addBalance(1); // визуально
      alert("Транзакция отправлена");
    } catch (e) {
      alert("Транзакция отменена");
    }
  };

});
