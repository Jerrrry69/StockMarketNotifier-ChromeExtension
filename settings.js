// 从popup.js导入共享数据
const { stockMarkets, translations, userSettings } = window;

// 初始化
document.addEventListener("DOMContentLoaded", async () => {
  await loadSettings();
  renderMarketOrder();
  renderNotificationSettings();
  setupEventListeners();
  
  // 应用主题
  if (userSettings.theme === "dark") {
    document.body.classList.add("dark-mode");
  }
});

// 加载设置
function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['settings'], (result) => {
      if (result.settings) {
        Object.assign(userSettings, result.settings);
      }
      resolve();
    });
  });
}

// 渲染股市顺序
function renderMarketOrder() {
  const container = document.getElementById("market-order-list");
  container.innerHTML = "";
  
  stockMarkets.forEach((market, index) => {
    const marketDiv = document.createElement("div");
    marketDiv.className = "market-item";
    
    const t = translations[userSettings.language];
    marketDiv.innerHTML = `
      <div>
        <strong>${t.markets[market.id]} (${t.countries[market.countryId]})</strong>
      </div>
      <div class="market-controls">
        <button onclick="moveMarketUp(${index})">上移</button>
        <button onclick="moveMarketDown(${index})">下移</button>
        <button onclick="moveMarketToTop(${index})">置顶</button>
        <button onclick="moveMarketToBottom(${index})">置底</button>
      </div>
    `;
    
    container.appendChild(marketDiv);
  });
}

// 渲染通知设置
function renderNotificationSettings() {
  const container = document.getElementById("notification-settings");
  container.innerHTML = "";
  
  stockMarkets.forEach((market, index) => {
    const notificationDiv = document.createElement("div");
    notificationDiv.className = "notification-item";
    
    const t = translations[userSettings.language];
    const settings = userSettings.notifications[market.id] || {};
    
    notificationDiv.innerHTML = `
      <div>
        <strong>${t.markets[market.id]}</strong>
      </div>
      <div>
        开盘前提醒: <input type="number" id="open-${index}" value="${settings.beforeOpen || 30}" min="0"> 分钟
      </div>
      <div>
        收盘前提醒: <input type="number" id="close-${index}" value="${settings.beforeClose || 30}" min="0"> 分钟
      </div>
      <button onclick="saveNotificationSettings(${index})">保存</button>
    `;
    
    container.appendChild(notificationDiv);
  });
}

// 保存通知设置
function saveNotificationSettings(index) {
  const market = stockMarkets[index];
  const beforeOpen = parseInt(document.getElementById(`open-${index}`).value, 10);
  const beforeClose = parseInt(document.getElementById(`close-${index}`).value, 10);
  
  userSettings.notifications[market.id] = {
    beforeOpen,
    beforeClose
  };
  
  saveSettings();
  scheduleNotifications(market.id, beforeOpen, beforeClose);
}

// 安排通知
function scheduleNotifications(marketId, beforeOpen, beforeClose) {
  const market = stockMarkets.find(m => m.id === marketId);
  if (!market) return;

  if (beforeOpen) {
    const notificationTime = calculateNotificationTime(market.open, -beforeOpen);
    scheduleNotification(marketId, notificationTime);
  }
  
  if (beforeClose) {
    const notificationTime = calculateNotificationTime(market.close, -beforeClose);
    scheduleNotification(marketId, notificationTime);
  }
}

// 计算通知时间
function calculateNotificationTime(time, offsetMinutes) {
  const [hours, minutes, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
  let date = new Date();
  date.setHours(period === "PM" ? parseInt(hours, 10) + 12 : parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10) + parseInt(offsetMinutes, 10));
  return date;
}

// 保存设置
function saveSettings() {
  chrome.storage.local.set({ settings: userSettings });
}

// 设置事件监听器
function setupEventListeners() {
  document.getElementById("back-button").addEventListener("click", () => {
    window.location.href = "popup.html";
  });
}

// 股市顺序操作函数
function moveMarketUp(index) {
  if (index > 0) {
    [stockMarkets[index - 1], stockMarkets[index]] = [stockMarkets[index], stockMarkets[index - 1]];
    updateMarketOrder();
    renderMarketOrder();
  }
}

function moveMarketDown(index) {
  if (index < stockMarkets.length - 1) {
    [stockMarkets[index + 1], stockMarkets[index]] = [stockMarkets[index], stockMarkets[index + 1]];
    updateMarketOrder();
    renderMarketOrder();
  }
}

function moveMarketToTop(index) {
  const market = stockMarkets.splice(index, 1)[0];
  stockMarkets.unshift(market);
  updateMarketOrder();
  renderMarketOrder();
}

function moveMarketToBottom(index) {
  const market = stockMarkets.splice(index, 1)[0];
  stockMarkets.push(market);
  updateMarketOrder();
  renderMarketOrder();
}

function updateMarketOrder() {
  userSettings.marketOrder = stockMarkets.map((_, i) => i);
  saveSettings();
}
