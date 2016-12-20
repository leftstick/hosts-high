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
    width: 800,
    height: 680,
    center: true,
    resizable: false,
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

var menus = [
    {
        label: 'Application',
        submenu: [
            {
                label: 'About Application',
                visible: process.platform === 'darwin',
                selector: 'orderFrontStandardAboutPanel:'
            },
            {
                type: 'separator',
                visible: process.platform === 'darwin'
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: function() {
                    electron.app.quit();
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                selector: 'undo:',
                role: 'undo'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+CmdOrCtrl+Z',
                selector: 'redo:',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                selector: 'cut:',
                role: 'cut'
            },
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                selector: 'copy:',
                role: 'copy'
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                selector: 'paste:',
                role: 'paste'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                selector: 'selectAll:',
                role: 'selectall'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click: function(item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.reload();
                    }
                }
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: (function() {
                    if (process.platform === 'darwin') {
                        return 'Alt+Command+I';
                    }
                    return 'Ctrl+Shift+I';
                }()),
                click: function(item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                }
            }
        ]
    }
];

app.on('ready', function() {

    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));

    mainWindow = new BrowserWindow(startupOpts);

    try {
        if (fs.statSync(__dirname + '/build/index.prod.js').isFile()) {
            mainWindow.loadURL('file://' + __dirname + '/build/index.html');
        }
    } catch (error) {
        mainWindow.loadURL('http://localhost:8080/index.html');
        BrowserWindow.addDevToolsExtension(__dirname + '/shells/chrome');
    }
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
    mainWindow.show();
});
