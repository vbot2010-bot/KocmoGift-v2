document.addEventListener("DOMContentLoaded", () => {

  // Telegram WebApp
  const tg = window.Telegram.WebApp;
  tg.expand(); // Разворачиваем окно

  // TonConnect
  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://kocmogift-v22.vercel.app/tonconnect-manifest.json"
  });

  window.tonConnectUI = tonConnectUI;

  let walletAddress = null;

  tonConnectUI.onStatusChange((wallet) => {
    if (wallet) {
      walletAddress = wallet.account.address;

      document.getElementById("wallet").innerText =
        "Кошелёк: " +
        walletAddress.slice(0, 6) +
        "..." +
        walletAddress.slice(-4);

      document.getElementById("disconnect").style.display = "block";
      document.getElementById("connect").style.display = "none";
      document.getElementById("sendTon").style.display = "block";
    } else {
      walletAddress = null;
      document.getElementById("wallet").innerText = "Кошелёк не подключён";
      document.getElementById("disconnect").style.display = "none";
      document.getElementById("connect").style.display = "block";
      document.getElementById("sendTon").style.display = "none";
    }
  });

  // Подключить кошелек
  window.connectWallet = function () {
    tonConnectUI.openModal();
  };

  // Отключить кошелек
  window.disconnectWallet = function () {
    tonConnectUI.disconnect();
  };

  // Пополнение баланса (отправка TON)
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
          amount: "1000000000"
        }
      ]
    };

    try {
      await tonConnectUI.sendTransaction(transaction);
      alert("Транзакция отправлена");
    } catch (e) {
      alert("Транзакция отменена");
    }
  };

});
