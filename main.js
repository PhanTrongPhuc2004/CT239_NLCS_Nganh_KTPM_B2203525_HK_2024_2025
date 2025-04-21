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
            // Bật nodeIntegration để sử dụng các module của Node.js trong renderer process
            nodeIntegration: true, 
            // Tắt contextIsolation để sử dụng nodeIntegration
            contextIsolation: false, 
            // Bật enableRemoteModule để sử dụng @electron/remote
            enableRemoteModule: true, 
        },
    });

    // Bật remote cho cửa sổ này
    remoteMain.enable(mainWindow.webContents);

    // tải trang index.html vào cửa sổ
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'src', 'index.html'),
            protocol: 'file:',
            slashes: true,
        })
    );

    // mở devTools nếu cần thiết
    mainWindow.webContents.openDevTools();
};

// Gọi hàm createWindow khi ứng dụng đã sẵn sàng
app.on('ready', createWindow);

// Thoát ứng dụng khi tất cả cửa sổ đã đóng
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Tạo cửa sổ mới khi ứng dụng được kích hoạt
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});