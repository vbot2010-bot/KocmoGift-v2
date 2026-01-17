     document.addEventListener("DOMContentLoaded", () => {

  // Telegram WebApp
  const tg = window.Telegram.WebApp;
  tg.expand();

  // TonConnect UI
  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://kocmogift-v22.vercel.app//tonconnect-manifest.json"
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
    } else {
      walletAddress = null;
      document.getElementById("wallet").innerText = "Кошелёк не подключён";
      document.getElementById("disconnect").style.display = "none";
    }
  });

  // Подключить кошелек
  window.connectWallet = function () {
    tonConnectUI.openModal(); // TonConnect сам предложит Tonkeeper или Telegram Wallet
  };

  // Отключить кошелек
  window.disconnectWallet = function () {
    tonConnectUI.disconnect();
  };

  // Пополнение баланса
  window.sendTon = async function () {
    if (!walletAddress) {
      alert("Сначала подключи кошелёк");
      return;
    }

    // Получаем сумму из input
    const amount = parseFloat(document.getElementById("amountInput").value);

    if (!amount || amount < 0.1) {
      alert("Введите сумму минимум 0.1 TON");
      return;
    }

    // Переводим TON в nanotons (1 TON = 10^9 nanotons)
    const nanotons = Math.floor(amount * 1_000_000_000);

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: "UQAFXBXzBzau6ZCWzruiVrlTg3HAc8MF6gKIntqTLDifuWOi",
          amount: nanotons.toString()
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
