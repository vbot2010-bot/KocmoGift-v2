document.addEventListener("DOMContentLoaded", () => {

  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://kocmogift-v22.vercel.app/tonconnect-manifest.json"
  });

  window.tonConnectUI = tonConnectUI;

  let walletAddress = null;

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

    let amountTon = prompt("Введите сумму пополнения (минимум 0.1 TON):");
    if (!amountTon) return;

    amountTon = parseFloat(amountTon);

    if (isNaN(amountTon) || amountTon < 0.1) {
      alert("Минимум 0.1 TON");
      return;
    }

    const amountNano = Math.floor(amountTon * 1e9).toString();

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: "UQAFXBXzBzau6ZCWzruiVrlTg3HAc8MF6gKIntqTLDifuWOi",
          amount: amountNano
        }
      ]
    };

    try {
      const result = await tonConnectUI.sendTransaction(transaction);

      // Транзакция прошла — теперь отправляем на backend
      const txHash = result.transactionId;

      const response = await fetch("https://kocmogift-v22.vercel.app/api/check-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Telegram.WebApp.initDataUnsafe.user.id,
          txHash: txHash,
          amount: amountTon
        })
      });

      const data = await response.json();

      if (data.balance) {
        document.getElementById("balance").innerText = data.balance;
        alert("Баланс обновлён: " + data.balance);
      } else {
        alert("Ошибка: " + (data.error || "Неизвестная ошибка"));
      }

    } catch (e) {
      alert("Платёж отменён");
    }
  };

});
