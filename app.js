const logBox = document.getElementById("logBox");
const statusText = document.getElementById("statusText");
const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");
const copyBtn = document.getElementById("copyBtn");
const aboutBtn = document.getElementById("aboutBtn");

function log(line){
  const t = new Date().toLocaleTimeString();
  logBox.textContent += `\n[${t}] ${line}`;
  logBox.scrollTop = logBox.scrollHeight;
}

function setStatus(text, ok=false){
  statusText.textContent = text;
  const dot = document.querySelector(".dot");
  dot.style.background = ok ? "#22c55e" : "#6b7280";
  dot.style.boxShadow = ok ? "0 0 0 4px rgba(34,197,94,.18)" : "0 0 0 4px rgba(107,114,128,.15)";
}

document.querySelectorAll("[data-action]").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const action = btn.dataset.action;
    // пока демо — просто логируем
    log(`Нажата кнопка: ${action}`);
    if(action === "start") setStatus("Online (demo)", true);
    if(action === "stop") setStatus("Offline (demo)", false);
  });
});

clearBtn.addEventListener("click", ()=>{
  logBox.textContent = "[demo] log cleared…";
});

themeBtn.addEventListener("click", ()=>{
  // демо: просто меняем заголовок. Позже можно реально менять тему.
  log("Theme toggled (demo)");
});

copyBtn.addEventListener("click", async ()=>{
  const ip = "192.168.0.105"; // позже подтянем автоматически
  try{
    await navigator.clipboard.writeText(ip);
    log(`IP скопирован: ${ip}`);
  }catch(e){
    log("Не смог скопировать IP (браузер/Telegram ограничения).");
  }
});

aboutBtn.addEventListener("click", ()=>{
  log("KanatnyiRoker • TG Era UI (demo). Подключение будет позже.");
});

// Telegram WebApp (если открыто внутри TG)
try{
  if(window.Telegram && Telegram.WebApp){
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    log("Opened inside Telegram ✅");
  } else {
    log("Opened in browser (not Telegram).");
  }
}catch(e){}
