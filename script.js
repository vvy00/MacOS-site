const loginOverlay = document.getElementById("loginOverlay");
const enterButton = document.getElementById("enterButton");
const appShell = document.getElementById("appShell");
const searchInput = document.getElementById("searchInput");
const themeLabel = document.getElementById("themeLabel");
const spotifyFrame = document.getElementById("spotifyFrame");
const openSpotifyPanel = document.getElementById("openSpotifyPanel");
const appWindow = document.getElementById("appWindow");
const closeWindowButton = document.getElementById("closeWindowButton");
const minimizeWindowButton = document.getElementById("minimizeWindowButton");
const expandWindowButton = document.getElementById("expandWindowButton");
const restoreWindowButton = document.getElementById("restoreWindowButton");

const panelTargets = document.querySelectorAll("[data-panel-target]");
const panels = document.querySelectorAll(".panel");
const promptButtons = document.querySelectorAll(".prompt-chip");
const themeButtons = document.querySelectorAll(".theme-card");

const DEFAULT_SPOTIFY =
  "https://open.spotify.com/embed/playlist/37i9dQZEVXbNG2KDcFcKOF?utm_source=generator";

function openPanel(panelId) {
  restoreWindow();

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

function loadSavedSpotify() {
  const savedSpotify = localStorage.getItem("macos-site-spotify-embed");
  spotifyFrame.src = savedSpotify || DEFAULT_SPOTIFY;
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
    searchInput.value = button.dataset.query;
    searchInput.focus();
  });
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.body.dataset.theme = button.dataset.theme;
    themeLabel.textContent = button.dataset.themeName;
    themeButtons.forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
  });
});

openSpotifyPanel.addEventListener("click", () => {
  openPanel("music");
});

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

loadSavedSpotify();
