document.addEventListener("DOMContentLoaded", () => {

  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://kocmogift-v22.vercel.app/tonconnect-manifest.json"
  });

  window.tonConnectUI = tonConnectUI;

  window.connectWallet = function () {
    tonConnectUI.openModal();
  };

  window.disconnectWallet = function () {
    tonConnectUI.disconnect();
  };

  tonConnectUI.onStatusChange(wallet => {
    console.log("STATUS CHANGE:", wallet);
    if (wallet) {
      document.getElementById("wallet").innerText =
        "Кошелёк: " + wallet.account.address.slice(0, 6) + "..." + wallet.account.address.slice(-4);
      document.getElementById("disconnect").style.display = "block";
    } else {
      document.getElementById("wallet").innerText = "Кошелёк не подключён";
      document.getElementById("disconnect").style.display = "none";
    }
  });

  console.log("TonConnect loaded");

});
