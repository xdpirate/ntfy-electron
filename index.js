const { app, BrowserWindow, Tray } = require('electron');
const process = require('process');

console.log(process.argv);

let win, tray;
let winHidden = 0;
let appIconLoc = app.getAppPath() + "/ntfy.png";

function ready() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: appIconLoc,
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
  
  tray = new Tray(appIconLoc);
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

  console.log("process.argv[0] == " + process.argv[0]);
  console.log("process.argv[1] == " + process.argv[1]);
  console.log("process.argv[2] == " + process.argv[2]);

  for(i = 0; i < process.argv.length; i++) {
    if(process.argv[i] == "--hidden") {
      winHidden = 1;
      win.hide();
    }
  }
}

app.on('ready', ready);
