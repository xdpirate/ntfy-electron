const { app, BrowserWindow, Tray, Menu, MenuItem } = require('electron');
const process = require('process');
const path = require('path');
const Store = require('./store.js');

console.log(process.argv);

let win, tray;
let winHidden = 0;
let appIconLoc = app.getAppPath() + "/ntfy.png";

const store = new Store({
    configName: 'prefs',
    defaults: {
      instanceURL: "https://ntfy.sh/app"
    }
});

const prompt = require("custom-electron-prompt");

Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
       label: 'Options',
       submenu: [
          {
             label: "Set ntfy instance URL",
             click: function() {
                 prompt({
                     title: "ntfy-electron",
                     label: 'ntfy instance URL:',
                     value: store.get("instanceURL"),
                     inputAttrs: {
                         type: 'url'
                     },
                     type: 'input'
                 })
                 .then((response) => {
                     if((response !== null)) {
                         store.set("instanceURL", response);
                         win.loadURL(response);
                     }
                 })
                 .catch(console.error);
             }
          }
       ]
    }
]));

function ready() {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: appIconLoc,
        title: "ntfy-electron"
    });
    
    win.loadURL(store.get("instanceURL"));
    
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
    
    for(i = 0; i < process.argv.length; i++) {
        if(process.argv[i] == "--hidden") {
            winHidden = 1;
            win.hide();
        }
    }
}

app.on('ready', ready);
