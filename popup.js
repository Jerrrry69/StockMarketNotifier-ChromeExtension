// Translations
const translations = {
  en: { 
    title: "Stock Market Notifier",
    selectLanguage: "Select Language",
    open: "Open",
    close: "Close",
    preMarket: "Pre-market",
    postMarket: "Post-market",
    currentTime: "Current Time",
    localTime: "Local Time",
    markets: {
      nyse: "New York Stock Exchange & NASDAQ",
      china: "Shanghai Stock Exchange & Shenzhen Stock Exchange",
      uk: "London Stock Exchange",
      japan: "Japan Exchange Group",
      hongkong: "Hong Kong Stock Exchange",
      germany: "Frankfurt Stock Exchange",
      australia: "Australian Securities Exchange"
    },
    countries: {
      usa: "USA",
      china: "China",
      uk: "UK",
      japan: "Japan",
      hongkong: "Hong Kong",
      germany: "Germany",
      australia: "Australia"
    }
  },
  zh: { 
    title: "股市时间通知",
    selectLanguage: "选择语言",
    open: "开盘",
    close: "收盘",
    preMarket: "盘前",
    postMarket: "盘后",
    currentTime: "当前时间",
    localTime: "本地时间",
    markets: {
      nyse: "纽约证券交易所 & 纳斯达克",
      china: "上海证券交易所 & 深圳证券交易所",
      uk: "伦敦证券交易所",
      japan: "日本交易所集团",
      hongkong: "香港证券交易所",
      germany: "法兰克福证券交易所",
      australia: "澳大利亚证券交易所"
    },
    countries: {
      usa: "美国",
      china: "中国",
      uk: "英国",
      japan: "日本",
      hongkong: "香港",
      germany: "德国",
      australia: "澳大利亚"
    }
  },
  ja: { 
    title: "株式市場通知",
    selectLanguage: "言語を選択",
    open: "開始",
    close: "終了",
    preMarket: "プレマーケット",
    postMarket: "ポストマーケット",
    currentTime: "現在の時間",
    localTime: "現地時間",
    markets: {
      nyse: "ニューヨーク証券取引所 & ナスダック",
      china: "上海証券取引所 & 深圳証券取引所",
      uk: "ロンドン証券取引所",
      japan: "日本取引所グループ",
      hongkong: "香港証券取引所",
      germany: "フランクフルト証券取引所",
      australia: "オーストラリア証券取引所"
    },
    countries: {
      usa: "アメリカ",
      china: "中国",
      uk: "イギリス",
      japan: "日本",
      hongkong: "香港",
      germany: "ドイツ",
      australia: "オーストラリア"
    }
  }
};

// Stock market data
const stockMarkets = [
  { 
    id: "nyse",
    countryId: "usa",
    open: "9:30 AM", 
    close: "4:00 PM", 
    preMarket: "7:00 AM", 
    postMarket: "8:00 PM",
    timeZone: "America/New_York"
  },
  { 
    id: "china",
    countryId: "china",
    open: "9:30 AM", 
    close: "3:00 PM", 
    preMarket: "N/A", 
    postMarket: "N/A",
    timeZone: "Asia/Shanghai"
  },
  { 
    id: "uk",
    countryId: "uk",
    open: "8:00 AM", 
    close: "4:30 PM", 
    preMarket: "N/A", 
    postMarket: "N/A",
    timeZone: "Europe/London"
  },
  { 
    id: "japan",
    countryId: "japan",
    open: "9:00 AM", 
    close: "3:00 PM", 
    preMarket: "N/A", 
    postMarket: "N/A",
    timeZone: "Asia/Tokyo"
  },
  { 
    id: "hongkong",
    countryId: "hongkong",
    open: "9:30 AM", 
    close: "4:00 PM", 
    preMarket: "N/A", 
    postMarket: "N/A",
    timeZone: "Asia/Hong_Kong"
  },
  { 
    id: "germany",
    countryId: "germany",
    open: "9:00 AM", 
    close: "5:30 PM", 
    preMarket: "N/A", 
    postMarket: "N/A",
    timeZone: "Europe/Berlin"
  },
  { 
    id: "australia",
    countryId: "australia",
    open: "10:00 AM", 
    close: "4:00 PM", 
    preMarket: "N/A", 
    postMarket: "N/A",
    timeZone: "Australia/Sydney"
  }
];

// 将时间转换为东八区时间
function convertToUserTimezone(time, timeZone) {
  const [timePart, period] = time.split(' ');
  const [hours, minutes] = timePart.split(':');
  
  // 创建日期对象
  const date = new Date();
  date.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  date.setUTCHours(period === 'PM' ? parseInt(hours) + 12 : parseInt(hours));
  date.setUTCMinutes(parseInt(minutes));
  
  // 转换为东八区时间
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'Asia/Shanghai'
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Update current time every second
function updateTime() {
  const now = new Date();
  const currentTime = now.toLocaleTimeString();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${year}/${month}/${day}`;
  const lang = document.getElementById("language-select").value;
  const t = translations[lang];
  document.getElementById("current-time").textContent = `${t.currentTime}: ${formattedDate} ${currentTime}`;
}
setInterval(updateTime, 1000);

// Language switching
function changeLanguage(lang) {
  const t = translations[lang];
  document.getElementById("title").textContent = t.title;
  document.getElementById("language-label").textContent = t.selectLanguage;
  renderStockMarkets();
  updateTime();
}

document.getElementById("language-select").addEventListener("change", (e) => {
  changeLanguage(e.target.value);
});

// Theme toggling
function toggleTheme() {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");

  // 更新按钮图标
  const themeToggleButton = document.getElementById("theme-toggle");
  themeToggleButton.textContent = isDarkMode ? "🌞" : "🌜";

  // 更新图标
  document.querySelectorAll('.alarm-clock-icon').forEach(icon => {
    icon.src = isDarkMode ? "icons/alarm-clock-white.svg" : "icons/alarm-clock.svg";
  });

  document.querySelectorAll('.menu-burger-icon').forEach(icon => {
    icon.src = isDarkMode ? "icons/menu-burger-white.svg" : "icons/menu-burger.svg";
  });
}

document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

// Initialize theme from localStorage
const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  document.getElementById("theme-toggle").textContent = "🌞";

  // 设置暗色模式图标
  document.querySelectorAll('.alarm-clock-icon').forEach(icon => {
    icon.src = "icons/alarm-clock-white.svg";
  });

  document.querySelectorAll('.menu-burger-icon').forEach(icon => {
    icon.src = "icons/menu-burger-white.svg";
  });
} else {
  document.getElementById("theme-toggle").textContent = "🌜";
}

// Render stock markets
function renderStockMarkets() {
  const container = document.getElementById("stock-list");
  container.innerHTML = "";
  const lang = document.getElementById("language-select").value;
  const t = translations[lang];

  stockMarkets.forEach((market, index) => {
    const marketDiv = document.createElement("div");
    marketDiv.className = "market-item";

    // 转换开盘和收盘时间到东八区
    const openTime = convertToUserTimezone(market.open, market.timeZone);
    const closeTime = convertToUserTimezone(market.close, market.timeZone);

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHours, openMinutes] = openTime.match(/(\d+):(\d+)/).slice(1).map(Number);
    const [closeHours, closeMinutes] = closeTime.match(/(\d+):(\d+)/).slice(1).map(Number);
    const openTimeMinutes = openHours * 60 + openMinutes;
    const closeTimeMinutes = closeHours * 60 + closeMinutes;

    const marketStatusIcon = currentTime >= openTimeMinutes && currentTime < closeTimeMinutes ? "🚀" : "😴";

    // 处理开盘和收盘时间的显示格式
    let marketHoursDisplay = `${openTime} - ${closeTime}`;
    if (market.id === "china") {
      marketHoursDisplay = `${openTime} - 11:30 AM<br/>1:00 PM - ${closeTime}`;
    } else if (market.id === "japan") {
      marketHoursDisplay = `${openTime} - 11:30 AM<br/>12:30 PM - ${closeTime}`;
    } else if (market.id === "germany") {
      marketHoursDisplay = `${openTime} - 11:30 AM<br/>12:30 PM - ${closeTime}`;
    }

    let marketInfo = `
      <div class="market-info">
        <span class="market-status-icon">${marketStatusIcon}</span>
        <div class="market-name">${t.markets[market.id]} (${t.countries[market.countryId]})</div>
        <div class="market-time">${marketHoursDisplay}</div>
        <div class="local-time">${t.localTime}: ${openTime} - ${closeTime}</div>
      </div>
      <div class="market-controls">
        <img src="icons/alarm-clock.svg" alt="Alarm Clock" class="alarm-clock-icon" data-index="${index}" />
        <img src="icons/menu-burger.svg" alt="Menu Burger" class="menu-burger-icon" data-index="${index}" />
      </div>
    `;

    marketDiv.innerHTML = marketInfo;
    container.appendChild(marketDiv);
  });

  // Add event listeners for alarm-clock and menu-burger
  document.querySelectorAll('.alarm-clock-icon').forEach(icon => {
    icon.addEventListener('click', handleAlarmClockClick);
  });

  document.querySelectorAll('.menu-burger-icon').forEach(icon => {
    icon.addEventListener('click', handleMenuBurgerClick);
  });
}

// ... [保留其余现有函数不变]

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateTime();
  renderStockMarkets();
  changeLanguage('zh'); // Default to Chinese

  // 设置初始图标状态
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("theme-toggle").textContent = "🌞";

    // 设置暗色模式图标
    document.querySelectorAll('.alarm-clock-icon').forEach(icon => {
      icon.src = "icons/alarm-clock-white.svg";
    });

    document.querySelectorAll('.menu-burger-icon').forEach(icon => {
      icon.src = "icons/menu-burger-white.svg";
    });
  } else {
    document.getElementById("theme-toggle").textContent = "🌜";
  }
});
