const telegramWA = window.Telegram && window.Telegram.WebApp;
console.log("window.Telegram ", window.Telegram)
console.log("window.Telegram.WebApp ", window.Telegram.WebApp)
if (telegramWA) {
  telegramWA.ready();
}
console.log("window.Telegram after ready ", window.Telegram)
console.log("window.Telegram.WebApp after ready ", window.Telegram.WebApp)


const localAppConfig = {
  enableLogs: true,
  base_url: "http://127.0.0.1:5001",
  hasRealTgWebApp: false,
  telegramWebApp: {
    initData: null,
    initDataUnsafe: {
      start_param: null
    }
  }
}

const debugAppConfig = {
  enableLogs: true,
  base_url: "https://myphrilldemo.pythonanywhere.com",
  hasRealTgWebApp: true,
  telegramWebApp: telegramWA
}

const prodAppConfig = {
  enableLogs: true, // todo disable
  base_url: "https://mphrl.com",
  hasRealTgWebApp: true,
  telegramWebApp: telegramWA
}

const appConfig = prodAppConfig;

if (!appConfig.enableLogs) {
  console.log = function () { };
  console.error = function () { };
}

console.log(`core.js init. appConfig=${JSON.stringify(appConfig)}`)

function versionCompare(v1, v2) {
    if (typeof v1 !== 'string') v1 = '';
    if (typeof v2 !== 'string') v2 = '';
    v1 = v1.replace(/^\s+|\s+$/g, '').split('.');
    v2 = v2.replace(/^\s+|\s+$/g, '').split('.');
    var a = Math.max(v1.length, v2.length), i, p1, p2;
    for (i = 0; i < a; i++) {
      p1 = parseInt(v1[i]) || 0;
      p2 = parseInt(v2[i]) || 0;
      if (p1 == p2) continue;
      if (p1 > p2) return 1;
      return -1;
    }
    return 0;
  }
  
function versionAtLeast(webAppVersion, ver) {
    return versionCompare(webAppVersion, ver) >= 0;
  }
  
  function playHapticNavigation() {
    if (appConfig.hasRealTgWebApp && versionAtLeast(appConfig.telegramWebApp.version, '6.1')) {
      appConfig.telegramWebApp.HapticFeedback.impactOccurred('soft')
    }
  }
  
  function playHapticSuccess() {
    if (appConfig.hasRealTgWebApp && versionAtLeast(appConfig.telegramWebApp.version, '6.1')) {
      appConfig.telegramWebApp.HapticFeedback.notificationOccurred('success')
    }
  }

  function playHapticWarning() {
    if (appConfig.hasRealTgWebApp && versionAtLeast(appConfig.telegramWebApp.version, '6.1')) {
      appConfig.telegramWebApp.HapticFeedback.notificationOccurred('warning')
    }
  }
  
  function playHapticError() {
    if (appConfig.hasRealTgWebApp && versionAtLeast(appConfig.telegramWebApp.version, '6.1')) {
      appConfig.telegramWebApp.HapticFeedback.notificationOccurred('error')
    }
  }

let currentSnackbar = null;

function showSnackbar(message, iconSrc = null, duration = 3000) {
  if (currentSnackbar) {
    currentSnackbar.classList.remove('show');
    currentSnackbar.remove();
    currentSnackbar = null;
  }

  const snackbar = document.createElement('div');
  snackbar.className = 'snackbar';

  if (iconSrc) {
    const img = document.createElement('img');
    img.src = iconSrc;
    img.alt = 'icon';
    img.style.width = '24px';
    img.style.height = '24px';
    snackbar.appendChild(img);
  }

  const text = document.createElement('span');
  text.textContent = message;
  snackbar.appendChild(text);

  document.body.appendChild(snackbar);
  currentSnackbar = snackbar;

  requestAnimationFrame(() => {
    snackbar.classList.add('show');
  });

  setTimeout(() => {
    snackbar.classList.remove('show');
    setTimeout(() => {
      snackbar.remove();
      if (currentSnackbar === snackbar) currentSnackbar = null;
    }, 400);
  }, duration);
}

window.showSnackbar = showSnackbar;
window.appConfig = appConfig;
window.versionAtLeast = versionAtLeast;
window.playHapticNavigation = playHapticNavigation;
window.playHapticSuccess = playHapticSuccess;
window.playHapticWarning = playHapticWarning;
window.playHapticError = playHapticError;
