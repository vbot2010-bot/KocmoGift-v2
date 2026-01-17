const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://kocmogift-v22.vercel.app//tonconnect-manifest.json",
  buttonRootId: "ton-connect"
});

let walletAddress = null;

// подписка на статус
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

// подключение
function connectWallet() {
  tonConnectUI.openModal();
}

// отключение
function disconnectWallet() {
  tonConnectUI.disconnect();
}
