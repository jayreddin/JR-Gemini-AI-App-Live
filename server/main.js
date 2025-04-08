const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron')
const path = require('path')

// Global error handlers
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
function createWindow () {
    // Create the browser window
    const mainWindow = new BrowserWindow({
        width: 500,
        height: 450,
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Load the index.html file from the client folder with error handling
    try {
        mainWindow.loadFile(path.join(__dirname, '../client/index.html'))
    } catch (error) {
        console.error('Error loading index.html:', error);
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// Handle get sources request
ipcMain.handle('GET_SOURCES', async (event) => {
    // IPC security validation: allow only trusted sender(s)
    const senderURL = event.sender.getURL();
    if (!senderURL.startsWith('file://') && !senderURL.includes('client/index.html')) {
        console.warn('Blocked GET_SOURCES request from untrusted sender:', senderURL);
        throw new Error('Unauthorized IPC request');
    }

    try {
        const sources = await desktopCapturer.getSources({
            types: ['screen', 'window'],
            thumbnailSize: { width: 0, height: 0 }, // No thumbnails for better performance
            fetchWindowIcons: true
        });
        return sources;
    } catch (error) {
        console.error('Error getting sources:', error);
        throw error;
    }
})