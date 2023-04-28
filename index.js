const { app, BrowserWindow, Tray } = require('electron');

let win, tray;
let winHidden = 0;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: "./ntfy.png",
    title: "ntfy-electron"
  });
  
  win.menuBarVisible = false;
  win.loadURL("https://ntfy.sh/app");
  
  win.on('closed', () => {
    win = null;
  });
  
  win.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    win.loadURL(url);
  });
  
  tray = new Tray("./ntfy.png");
  tray.setToolTip("ntfy-electron | click to hide/show main window");
  
  tray.on("click", function() {
    if(winHidden) {
      winHidden = 0;
      win.show();
    } else {
      winHidden = 1;
      win.hide();
    }
  });

  win.on("page-title-updated", (event) => {
    event.preventDefault();
  });
}

app.on('ready', createWindow);
