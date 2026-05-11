const loginOverlay = document.getElementById("loginOverlay");
const enterButton = document.getElementById("enterButton");
const appShell = document.getElementById("appShell");
const searchInput = document.getElementById("searchInput");
const themeLabel = document.getElementById("themeLabel");
const customWallpaper = document.getElementById("customWallpaper");
const backgroundUploadInput = document.getElementById("backgroundUploadInput");
const uploadBackgroundButton = document.getElementById("uploadBackgroundButton");
const clearBackgroundButton = document.getElementById("clearBackgroundButton");
const spotifyFrame = document.getElementById("spotifyFrame");
const openSpotifyPanel = document.getElementById("openSpotifyPanel");
const appWindow = document.getElementById("appWindow");
const windowToolbar = document.querySelector(".window__toolbar");
const closeWindowButton = document.getElementById("closeWindowButton");
const minimizeWindowButton = document.getElementById("minimizeWindowButton");
const expandWindowButton = document.getElementById("expandWindowButton");
const restoreWindowButton = document.getElementById("restoreWindowButton");
const spotlightButton = document.getElementById("spotlightButton");
const spotlightOverlay = document.getElementById("spotlightOverlay");
const spotlightInput = document.getElementById("spotlightInput");
const clockDisplay = document.getElementById("clockDisplay");
const lockTime = document.getElementById("lockTime");
const lockDate = document.getElementById("lockDate");
const calendarGrid = document.getElementById("calendarGrid");
const calendarTitle = document.getElementById("calendarTitle");
const prevMonthButton = document.getElementById("prevMonthButton");
const nextMonthButton = document.getElementById("nextMonthButton");

const panelTargets = document.querySelectorAll("[data-panel-target]");
const panels = document.querySelectorAll(".panel");
const promptButtons = document.querySelectorAll(".prompt-chip");
const themeButtons = document.querySelectorAll(".theme-card");
const spotlightTargets = document.querySelectorAll("[data-spotlight-target]");

const DEFAULT_SPOTIFY =
  "https://open.spotify.com/embed/playlist/37i9dQZEVXbNG2KDcFcKOF?utm_source=generator";
const CUSTOM_BACKGROUND_STORAGE_KEY = "macos-site-custom-background";

let dragState = null;
let currentCalendarDate = new Date();

function openPanel(panelId) {
  if (panelId !== "calendar") {
    restoreWindow();
  }

  panels.forEach((panel) => {
    panel.classList.toggle("is-visible", panel.id === panelId);
  });

  panelTargets.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.panelTarget === panelId);
  });
}

function restoreWindow() {
  appWindow.classList.remove("is-hidden-window");
  appWindow.classList.remove("is-minimized");
}

function updateClock() {
  const now = new Date();
  const timeText = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
  const dateText = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  clockDisplay.textContent = timeText;
  lockTime.textContent = timeText;
  lockDate.textContent = dateText;
}

function openSpotlight() {
  spotlightOverlay.classList.add("is-visible");
  spotlightOverlay.setAttribute("aria-hidden", "false");
  spotlightInput.focus();
}

function closeSpotlight() {
  spotlightOverlay.classList.remove("is-visible");
  spotlightOverlay.setAttribute("aria-hidden", "true");
}

function loadSavedSpotify() {
  const savedSpotify = localStorage.getItem("macos-site-spotify-embed");
  spotifyFrame.src = savedSpotify || DEFAULT_SPOTIFY;
}

function setCustomBackground(imageData) {
  customWallpaper.style.backgroundImage = `url("${imageData}")`;
  document.body.classList.add("has-custom-background");
  themeLabel.textContent = "Custom Wallpaper";
}

function clearCustomBackground() {
  customWallpaper.style.backgroundImage = "";
  document.body.classList.remove("has-custom-background");
  localStorage.removeItem(CUSTOM_BACKGROUND_STORAGE_KEY);
  const selectedTheme = document.querySelector(".theme-card.is-selected");
  themeLabel.textContent = selectedTheme?.dataset.themeName || "Sunrise Blend";
}

function loadSavedCustomBackground() {
  const savedBackground = localStorage.getItem(CUSTOM_BACKGROUND_STORAGE_KEY);

  if (savedBackground) {
    setCustomBackground(savedBackground);
  }
}

function startDrag(event) {
  if (window.innerWidth <= 980) return;
  if (event.target.closest("button")) return;
  if (appWindow.classList.contains("is-expanded")) return;

  const rect = appWindow.getBoundingClientRect();
  dragState = {
    startX: event.clientX,
    startY: event.clientY,
    left: rect.left,
    top: rect.top
  };

  appWindow.style.position = "fixed";
  appWindow.style.margin = "0";
  appWindow.style.left = `${rect.left}px`;
  appWindow.style.top = `${rect.top}px`;
  appWindow.style.width = `${rect.width}px`;
  windowToolbar.classList.add("is-dragging");
}

function moveDrag(event) {
  if (!dragState) return;

  const nextLeft = dragState.left + (event.clientX - dragState.startX);
  const nextTop = dragState.top + (event.clientY - dragState.startY);
  appWindow.style.left = `${Math.max(12, nextLeft)}px`;
  appWindow.style.top = `${Math.max(72, nextTop)}px`;
}

function stopDrag() {
  dragState = null;
  windowToolbar.classList.remove("is-dragging");
}

function generateCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  calendarTitle.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });
  
  calendarGrid.innerHTML = "";
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  // Previous month's days
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day other-month";
    dayDiv.textContent = daysInPrevMonth - i;
    calendarGrid.appendChild(dayDiv);
  }
  
  // Current month's days
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.textContent = i;
    
    if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === i) {
      dayDiv.classList.add("today");
    }
    
    calendarGrid.appendChild(dayDiv);
  }
  
  // Next month's days
  const totalCells = calendarGrid.children.length;
  const remainingCells = 42 - totalCells;
  for (let i = 1; i <= remainingCells; i++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day other-month";
    dayDiv.textContent = i;
    calendarGrid.appendChild(dayDiv);
  }
}

function previousMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  generateCalendar(currentCalendarDate);
}

function nextMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  generateCalendar(currentCalendarDate);
}

function stopDrag() {
  dragState = null;
  windowToolbar.classList.remove("is-dragging");
}

enterButton.addEventListener("click", () => {
  loginOverlay.classList.add("is-hidden");
  loginOverlay.setAttribute("aria-hidden", "true");
  appShell.setAttribute("aria-hidden", "false");
  restoreWindow();
  searchInput.focus();
});

panelTargets.forEach((button) => {
  button.addEventListener("click", () => {
    openPanel(button.dataset.panelTarget);
  });
});

promptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openPanel("search");
    searchInput.value = button.dataset.query || "";
    searchInput.focus();
  });
});

spotlightButton.addEventListener("click", openSpotlight);

spotlightOverlay.addEventListener("click", (event) => {
  if (event.target === spotlightOverlay) {
    closeSpotlight();
  }
});

spotlightTargets.forEach((button) => {
  button.addEventListener("click", () => {
    openPanel(button.dataset.spotlightTarget);
    closeSpotlight();
  });
});

spotlightInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const value = spotlightInput.value.trim().toLowerCase();

    if (value === "spotify" || value === "music") {
      openPanel("music");
      closeSpotlight();
      return;
    }

    if (value === "calendar" || value === "dates") {
      openPanel("calendar");
      closeSpotlight();
      return;
    }

    if (value === "backgrounds" || value === "wallpapers") {
      openPanel("themes");
      closeSpotlight();
      return;
    }

    if (value) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(value)}`, "_blank");
      closeSpotlight();
    }
  }

  if (event.key === "Escape") {
    closeSpotlight();
  }
});

document.addEventListener("keydown", (event) => {
  const isSpotlightShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
  if (isSpotlightShortcut) {
    event.preventDefault();
    openSpotlight();
  }

  if (event.key === "Escape") {
    closeSpotlight();
  }
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    clearCustomBackground();
    document.body.dataset.theme = button.dataset.theme;
    themeLabel.textContent = button.dataset.themeName;
    themeButtons.forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
  });
});

uploadBackgroundButton.addEventListener("click", () => {
  backgroundUploadInput.click();
});

backgroundUploadInput.addEventListener("change", () => {
  const [file] = backgroundUploadInput.files || [];

  if (!file || !file.type.startsWith("image/")) {
    backgroundUploadInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const result = reader.result;

    if (typeof result === "string") {
      localStorage.setItem(CUSTOM_BACKGROUND_STORAGE_KEY, result);
      setCustomBackground(result);
    }
  });

  reader.readAsDataURL(file);
});

clearBackgroundButton.addEventListener("click", () => {
  clearCustomBackground();
  backgroundUploadInput.value = "";
});

openSpotifyPanel.addEventListener("click", () => {
  openPanel("music");
});

prevMonthButton.addEventListener("click", previousMonth);
nextMonthButton.addEventListener("click", nextMonth);

closeWindowButton.addEventListener("click", () => {
  appWindow.classList.add("is-hidden-window");
  appWindow.classList.remove("is-expanded");
});

minimizeWindowButton.addEventListener("click", () => {
  appWindow.classList.remove("is-hidden-window");
  appWindow.classList.toggle("is-minimized");
});

expandWindowButton.addEventListener("click", () => {
  restoreWindow();
  appWindow.classList.toggle("is-expanded");
});

restoreWindowButton.addEventListener("click", () => {
  restoreWindow();
  openPanel("search");
});

windowToolbar.addEventListener("mousedown", startDrag);
document.addEventListener("mousemove", moveDrag);
document.addEventListener("mouseup", stopDrag);

updateClock();
loadSavedSpotify();
loadSavedCustomBackground();
generateCalendar(currentCalendarDate);
setInterval(updateClock, 30000);