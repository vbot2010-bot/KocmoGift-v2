console.log("MAIN.JS LOADED");

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const user = tg.initDataUnsafe.user;

// вкладки
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

// профиль
document.getElementById("username").innerText =
  user.username || user.first_name;

document.getElementById("avatar").src =
  user.photo_url || "https://via.placeholder.com/90";

// виртуальный баланс (пока local)
let balance = localStorage.getItem("balance") || 0;
document.getElementById("balance").innerText = balance;

// функция начисления (после TON)
function addBalance(amount) {
  balance = parseFloat(balance) + amount;
  localStorage.setItem("balance", balance);
  document.getElementById("balance").innerText = balance;
}

// ЖДЁМ, ПОКА СТРАНИЦА ЗАГРУЗИТСЯ
document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM loaded");

  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://kocmogift-v22.vercel.app/tonconnect-manifest.json"
  });

  window.tonConnectUI = tonConnectUI;

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

  window.connectWallet = function () {
    console.log("connectWallet clicked");
    tonConnectUI.openModal();
  };

  window.disconnectWallet = function () {
    console.log("disconnectWallet clicked");
    tonConnectUI.disconnect();
  };

  window.sendTon = async function () {
    console.log("sendTon clicked");

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
      alert("Транзакция отправлена");
    } catch (e) {
      alert("Транзакция отменена");
    }
  };

});
