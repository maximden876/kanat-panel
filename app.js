const tg = window.Telegram?.WebApp;

function logLine(text) {
  const box = document.getElementById("logBox");
  if (!box) return;
  const t = new Date().toLocaleTimeString("ru-RU", { hour12: false });
  box.textContent += `\n[${t}] ${text}`;
  box.scrollTop = box.scrollHeight;
}

function sendAction(action) {
  if (!tg) {
    logLine(`❌ Открой панель внутри Telegram (нет WebApp API). action=${action}`);
    alert("Открой панель внутри Telegram 🙂");
    return;
  }
  tg.sendData(action); // отправляем просто строку: start/stop/restart/status
  logLine(`✅ Отправлено: ${action}`);
  tg.showAlert(`✅ Команда отправлена: ${action}`);
}

window.addEventListener("load", () => {
  if (tg) {
    tg.ready();
    tg.expand();
    logLine("Opened inside Telegram ✅");
  } else {
    logLine("Opened in browser (demo) ⚠️");
  }

  document.getElementById("btnStart")?.addEventListener("click", () => sendAction("start"));
  document.getElementById("btnStop")?.addEventListener("click", () => sendAction("stop"));
  document.getElementById("btnRestart")?.addEventListener("click", () => sendAction("restart"));
  document.getElementById("btnStatus")?.addEventListener("click", () => sendAction("status"));

  document.getElementById("btnClear")?.addEventListener("click", () => {
    const box = document.getElementById("logBox");
    if (box) box.textContent = "";
  });
});
