               document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram.WebApp;
  tg.expand();

  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://kocmogift-v22.vercel.app/tonconnect-manifest.json"
  });

  window.tonConnectUI = tonConnectUI;

  window.walletAddress = null;

  tonConnectUI.onStatusChange((wallet) => {
    if (wallet) {
      window.walletAddress = wallet.account.address;

      document.getElementById("wallet").innerText =
        "Кошелёк: " +
        window.walletAddress.slice(0, 6) +
        "..." +
        window.walletAddress.slice(-4);

      document.getElementById("disconnect").style.display = "block";
    } else {
      window.walletAddress = null;
      document.getElementById("wallet").innerText = "Кошелёк не подключён";
      document.getElementById("disconnect").style.display = "none";
    }
  });

  window.connectWallet = function () {
    tonConnectUI.openModal();
  };

  window.disconnectWallet = function () {
    tonConnectUI.disconnect();
  };

  window.sendTon = async function () {

    if (!window.walletAddress) {
      alert("Сначала подключи кошелёк");
      return;
    }

    const amount = parseFloat(document.getElementById("amountInput").value);

    if (!amount || amount < 0.1) {
      alert("Введите сумму минимум 0.1 TON");
      return;
    }

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
      console.log(e);
    }
  };

});
