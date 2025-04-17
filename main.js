const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const remoteMain = require('@electron/remote/main'); // Khởi tạo @electron/remote

// Khởi tạo remoteMain
remoteMain.initialize();

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window
    const mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        center: true,
        webPreferences: {
            nodeIntegration: true, // Bật nodeIntegration để renderer process truy cập Node.js
            contextIsolation: false, // Tắt contextIsolation
            enableRemoteModule: true, // Bật enableRemoteModule để renderer process sử dụng remote
        },
    });

    // Bật remote cho cửa sổ này
    remoteMain.enable(mainWindow.webContents);

    // Load the index.html of the app
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'src', 'index.html'),
            protocol: 'file:',
            slashes: true,
        })
    );

    // Open the DevTools (optional)
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished initialization
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});