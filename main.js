const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  nativeImage,
  dialog,
} = require("electron");
const path = require("node:path");
const ua = require("random-useragent");
const positioner = require("electron-traywindow-positioner");

const userAgent = ua.getRandomData((a) => a.browserName === "Edge");
const loginURL =
  "https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=16&wreply=https://www.bing.com/secure/Passport.aspx?edge_suppress_profile_switch=1&requrl=https%3a%2f%2fwww.bing.com%2fsearch%3fq%3dBing%2bAI%26showconv%3d1%26FORM%3dhpcodx%26wlexpsignin%3d1&nopa=2&aadredir=1&nopa=2";

let tray, mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 900,
    frame: false,
    type: "panel",
    modal: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  await mainWindow.loadURL(loginURL, {
    userAgent,
  });

  // Hide dock icon
  app.dock.hide();
  // Set tray icon
  tray = setTray();
  // Set menu
  setMenu();

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    positioner.position(mainWindow, tray.getBounds(), { x: "center", y: "up" });
  });

  mainWindow.on("blur", () => {
    mainWindow.hide();
  });
}

function setTray() {
  const tray = new Tray(path.join(__dirname, "resources/tray.png"));
  tray.setToolTip("BingX");
  tray.on("click", () => {
    if (mainWindow.isVisible()) mainWindow.hide();
    else mainWindow.show();
  });

  tray.on("right-click", async () => {
    const result = await dialog.showMessageBox({
      type: "info",
      title: "Close BingX",
      message: "Are you sure you want to close BingX?",
      detail: "BingX will be closed.",
      buttons: ["OK", "Cancel"],
    });

    if (result.response === 0) app.quit();
  });

  return tray;
}

function setMenu() {
  const template = [];

  return Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
  });
});
