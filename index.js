const { app, BrowserWindow, Menu } = require('electron');

let win

function createWindow() {
    win = new BrowserWindow({
        width: 720,
        height: 720,
        minWidth: 670,
        minHeight: 720,
        icon: 'build/icon.png'
    });

    win.loadFile('index.html');

    // win.webContents.openDevTools();

    win.on('closed', () => {
        win = null
    })

    Menu.setApplicationMenu(null)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})