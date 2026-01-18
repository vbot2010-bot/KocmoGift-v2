const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;

/* ===== DOM элементы ===== */
const btnHome = document.getElementById("btn-home");
const btnProfile = document.getElementById("btn-profile");

const avatar = document.getElementById("avatar");
const profileAvatar = document.getElementById("profileAvatar");
const username = document.getElementById("username");

const connectWallet = document.getElementById("connectWallet");
const disconnectWallet = document.getElementById("disconnectWallet");

const deposit = document.getElementById("deposit");
const modal = document.getElementById("modal");
const pay = document.getElementById("pay");

/* ===== User ===== */
username.innerText = user.username || "No username";
avatar.src = user.photo_url || "";
profileAvatar.src = user.photo_url || "";

/* ===== Навигация ===== */
btnHome.onclick = () => switchPage("home");
btnProfile.onclick = () => switchPage("profile");

function switchPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ===== TON CONNECT ===== */
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://kocmogift-v22.vercel.app/tonconnect-manifest.json"
});

connectWallet.onclick = async () => {
  await tonConnectUI.connectWallet();
};

disconnectWallet.onclick = async () => {
  await tonConnectUI.disconnect();
};

tonConnectUI.onStatusChange(wallet => {
  if (wallet) {
    connectWallet.style.display = "none";
    disconnectWallet.style.display = "block";
  } else {
    connectWallet.style.display = "block";
    disconnectWallet.style.display = "none";
  }
});

/* ===== Пополнение ===== */
deposit.onclick = () => {
  modal.style.display = "block";
};

modal.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

pay.onclick = async () => {
  const amount = parseFloat(document.getElementById("amount").value);

  if (!amount || amount < 0.1) {
    alert("Минимум 0.1 TON");
    return;
  }

  await tonConnectUI.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [
      {
        address: "UQAFXBXzBzau6ZCWzruiVrlTg3HAc8MF6gKIntqTLDifuWOi",
        amount: (amount * 1e9).toString()
      }
    ]
  });

  modal.style.display = "none";
};
