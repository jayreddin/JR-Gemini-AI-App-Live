const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
        // Add desktop capturer method
        getScreenSources: async () => {
            try {
                return await ipcRenderer.invoke('GET_SOURCES');
            } catch (error) {
                throw new Error(`Failed to get screen sources: ${error.message}`);
            }
        }
        // Add more methods from main.js here as needed
    }
) 