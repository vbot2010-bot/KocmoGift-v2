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
