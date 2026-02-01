(() => {
  const tg = window.Telegram?.WebApp;
  const logBox = document.getElementById("logBox");
  const clearBtn = document.getElementById("clearBtn");
  const themeBtn = document.getElementById("themeBtn");
  const statusText = document.getElementById("statusText");
  const statusDot = document.getElementById("statusDot");

  const now = () => new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});

  function log(line){
    if(!logBox) return;
    logBox.textContent += `[${now()}] ${line}\n`;
    logBox.scrollTop = logBox.scrollHeight;
  }

  function send(action, payload = {}){
    const data = { action, ...payload, ts: Date.now() };
    log(`Нажата кнопка: ${action}`);

    if(!tg){
      log("⚠️ Telegram.WebApp не найден (открой внутри Telegram).");
      return;
    }

    try{
      tg.sendData(JSON.stringify(data));
      tg.HapticFeedback?.impactOccurred("light");
    }catch(e){
      log("❌ sendData error: " + (e?.message || e));
    }
  }

  if(tg){
    tg.ready();
    tg.expand();
    tg.MainButton?.hide();
    log("Opened inside Telegram ✅");
  }else{
    log("Открой внутри Telegram 🙂");
  }

  document.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      send(action);

      // local UI status (demo)
      if(action === "status"){
        statusText.textContent = "Status requested";
        statusDot.style.background = "#28b7ff";
      }
      if(action === "start"){
        statusText.textContent = "Start requested";
        statusDot.style.background = "#2ee6a6";
      }
      if(action === "stop"){
        statusText.textContent = "Stop requested";
        statusDot.style.background = "#ff355a";
      }
      if(action === "restart"){
        statusText.textContent = "Restart requested";
        statusDot.style.background = "#2f6bff";
      }
      if(action === "copy_ip"){
        const ip = location.host || "";
        if(ip){
          navigator.clipboard?.writeText(ip).catch(()=>{});
          log(`Скопировано: ${ip}`);
        }else{
          log("IP не найден (нет host).");
        }
      }
    });
  });

  clearBtn?.addEventListener("click", () => {
    logBox.textContent = "";
    log("Логи очищены 🧹");
  });

  themeBtn?.addEventListener("click", () => {
    log("Theme toggled 🌙");
  });
})();
