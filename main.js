const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;

document.getElementById("username").innerText = user.username;
document.getElementById("avatar").src = user.photo_url;
document.getElementById("profileAvatar").src = user.photo_url;

/* Навигация */
btnHome.onclick = () => switchPage("home");
btnProfile.onclick = () => switchPage("profile");

function switchPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* TON CONNECT */
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://kocmogift-v22.vercel.app//tonconnect-manifest.json"
});

connectWallet.onclick = async () => {
  await tonConnectUI.connectWallet();
};

tonConnectUI.onStatusChange(wallet => {
  if (wallet) {
    connectWallet.style.display = "none";
    disconnectWallet.style.display = "block";
  }
});

disconnectWallet.onclick = async () => {
  await tonConnectUI.disconnect();
};

/* Пополнение */
deposit.onclick = () => modal.style.display = "block";

pay.onclick = async () => {
  const amount = document.getElementById("amount").value;
  if (amount < 0.1) return alert("Минимум 0.1 TON");

  await tonConnectUI.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [{
      address: "UQAFXBXzBzau6ZCWzruiVrlTg3HAc8MF6gKIntqTLDifuWOi",
      amount: (amount * 1e9).toString()
    }]
  });
};
