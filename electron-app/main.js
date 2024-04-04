const { app, BrowserWindow } = require("electron/main");
const path = require("node:path");

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    // Use dynamic import for electron-is-dev
    import("electron-is-dev")
        .then((isDev) => {
            if (isDev.default) {
                // Development URL
                mainWindow.loadURL("http://localhost:3000"); // Assuming your frontend is running at this URL
            } else {
                // Production build path
                mainWindow.loadFile(path.join(__dirname, "builder/index.html"));
            }
        })
        .catch((error) => {
            console.error("Error importing electron-is-dev:", error);
            // Fallback to development URL in case of error
            mainWindow.loadURL("http://localhost:3000");
        });

    //  Open DevTools
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
