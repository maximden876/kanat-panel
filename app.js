(() => {
  const tg = window.Telegram?.WebApp;
  const logBox = document.getElementById("logBox");
  const clearBtn = document.getElementById("clearBtn");
  const themeBtn = document.getElementById("themeBtn");
  const statusText = document.getElementById("statusText");
  const statusDot = document.getElementById("statusDot");

  const THEME_KEY = "kanat_theme";
  const STATUS_COLORS = {
    status: "#2b7cff",
    start: "#2ac78d",
    stop: "#ff4b5f",
    restart: "#ef7a3c",
  };

  const now = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  function log(line) {
    if (!logBox) return;
    logBox.textContent += `[${now()}] ${line}\n`;
    logBox.scrollTop = logBox.scrollHeight;
  }

  function setTheme(theme) {
    // Меняем тему и сохраняем выбор пользователя.
    document.documentElement.dataset.theme = theme;
    if (themeBtn) {
      themeBtn.textContent = theme === "night" ? "☀️ Light" : "🌙 Night";
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }

  function initTheme() {
    const saved = (() => {
      try {
        return localStorage.getItem(THEME_KEY);
      } catch (e) {
        return null;
      }
    })();
    if (saved) {
      setTheme(saved);
      return;
    }
    const tgScheme = tg?.colorScheme;
    setTheme(tgScheme === "dark" ? "night" : "sunrise");
  }

  function updateStatus(action) {
    if (!statusText || !statusDot) return;
    if (action === "status") {
      statusText.textContent = "Status requested";
      statusDot.style.background = STATUS_COLORS.status;
    }
    if (action === "start") {
      statusText.textContent = "Start requested";
      statusDot.style.background = STATUS_COLORS.start;
    }
    if (action === "stop") {
      statusText.textContent = "Stop requested";
      statusDot.style.background = STATUS_COLORS.stop;
    }
    if (action === "restart") {
      statusText.textContent = "Restart requested";
      statusDot.style.background = STATUS_COLORS.restart;
    }
  }

  function send(action, payload = {}) {
    // Отправка команды в Telegram WebApp.
    const data = { action, ...payload, ts: Date.now() };
    log(`Нажата кнопка: ${action}`);

    if (!tg) {
      log("⚠️ Telegram.WebApp не найден (открой внутри Telegram).");
      return;
    }

    try {
      tg.sendData(JSON.stringify(data));
      tg.HapticFeedback?.impactOccurred("light");
    } catch (e) {
      log("❌ sendData error: " + (e?.message || e));
    }
  }

  function handleAction(action) {
    if (!action) return;

    send(action);
    updateStatus(action);

    if (action === "about") {
      log("Канат-Панель: управление Discord-ботом через Telegram WebApp.");
      tg?.showPopup?.({
        title: "О боте",
        message:
          "Канат-Панель управляет Discord-ботом через Telegram. Кнопки отправляют команды в TG-бот.",
        buttons: [{ type: "ok" }],
      });
    }

    if (action === "copy_ip") {
      const ip = location.host || "";
      if (ip) {
        navigator.clipboard?.writeText(ip).catch(() => {});
        log(`Скопировано: ${ip}`);
      } else {
        log("IP не найден (нет host).");
      }
    }
  }

  // Init
  initTheme();
  if (tg) {
    tg.ready();
    tg.expand();
    tg.MainButton?.hide();
    tg.onEvent?.("themeChanged", () => {
      setTheme(tg.colorScheme === "dark" ? "night" : "sunrise");
    });
    log("Opened inside Telegram ✅");
  } else {
    log("Открой внутри Telegram 🙂");
  }

  document.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      handleAction(action);
    });
  });

  clearBtn?.addEventListener("click", () => {
    logBox.textContent = "";
    log("Логи очищены 🧹");
  });

  themeBtn?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "night" ? "sunrise" : "night";
    setTheme(next);
    log(`Тема: ${next}`);
  });
})();
