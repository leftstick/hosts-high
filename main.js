process.env.ELECTRON_HIDE_INTERNAL_MODULES = 'true';

const electron = require('electron');
const fs = require('fs');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', app.quit);

const startupOpts = {
    useContentSize: true,
    width: 1000,
    minWidth: 750,
    height: 700,
    minHeight: 600,
    center: true,
    resizable: true,
    alwaysOnTop: false,
    fullscreen: false,
    skipTaskbar: false,
    icon: __dirname + '/hosts.png',
    kiosk: false,
    title: '',
    show: false,
    frame: true,
    disableAutoHideCursor: false,
    autoHideMenuBar: false,
    titleBarStyle: 'default'
};

app.on('ready', function() {

    Menu.setApplicationMenu(Menu.buildFromTemplate(require('./system/menus')));

    mainWindow = new BrowserWindow(startupOpts);

    fs.stat(__dirname + '/build/index.prod.js', function(e, stat) {
        if (e || !stat.isFile()) {
            mainWindow.loadURL('http://localhost:8080/index.html');
            return BrowserWindow.addDevToolsExtension(__dirname + '/system/shells/chrome');
        }
        mainWindow.loadURL('file://' + __dirname + '/build/index.html');
    });

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    mainWindow.show();
});
