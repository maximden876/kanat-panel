(function () {
  const tg = window.Telegram?.WebApp;

  const logBox = document.getElementById("logBox");
  const clearBtn = document.getElementById("clearBtn");
  const themeBtn = document.getElementById("themeBtn");
  const aboutBtn = document.getElementById("aboutBtn");
  const copyBtn = document.getElementById("copyBtn");
  const hint = document.getElementById("hint");

  const statusDot = document.getElementById("statusDot");
  const statusValue = document.getElementById("statusValue");

  function log(line) {
    const t = new Date().toLocaleTimeString("ru-RU", { hour12: false });
    logBox.textContent += `[${t}] ${line}\n`;
    logBox.scrollTop = logBox.scrollHeight;
  }

  function toast(text) {
    hint.textContent = text;
    hint.classList.add("show");
    setTimeout(() => hint.classList.remove("show"), 1200);
  }

  function send(cmd) {
    if (!tg) {
      log("Telegram WebApp API не найден (открой внутри Telegram)");
      toast("Открой внутри Telegram");
      return;
    }
    tg.sendData(cmd);
    log(`Нажата кнопка: ${cmd}`);
    toast(`Отправлено: ${cmd}`);
  }

  document.querySelectorAll("[data-cmd]").forEach((btn) => {
    btn.addEventListener("click", () => send(btn.dataset.cmd));
  });

  clearBtn.addEventListener("click", () => {
    logBox.textContent = "";
    log("[demo] cleared");
  });

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    toast("Theme переключена");
  });

  aboutBtn.addEventListener("click", () => {
    toast("KanatnyiRoker 3.0 — Discord→TG");
    log("Открыто: О боте");
  });

  copyBtn.addEventListener("click", async () => {
    const ip = "192.168.0.105"; // можно поменять
    try {
      await navigator.clipboard.writeText(ip);
      toast("IP скопирован");
      log("Скопирован IP");
    } catch {
      toast("Не могу скопировать");
      log("Clipboard недоступен");
    }
  });

  // Telegram cosmetics
  if (tg) {
    tg.expand();
    tg.ready();
    log("Opened inside Telegram ✅");
  } else {
    log("Opened in browser (demo mode)");
  }

  // Demo status
  statusDot.classList.add("green");
  statusValue.textContent = "Online (demo)";
})();
