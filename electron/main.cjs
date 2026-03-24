const { app, BrowserWindow, nativeImage } = require('electron')
const path = require('path')

const isDev =
  process.env.ELECTRON_DEV === '1' ||
  (!app.isPackaged && process.env.ELECTRON_DEV !== '0')
const preloadPath = path.join(__dirname, 'preload.cjs')
const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'
const distIndex = path.join(__dirname, '../dist/index.html')
const iconPath = path.join(__dirname, 'resources', 'icon.png')
const appIcon = nativeImage.createFromPath(iconPath)

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    icon: appIcon.isEmpty() ? undefined : appIcon,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      sandbox: false,
      nodeIntegration: false
    }
  })

  if (isDev && devServerUrl) {
    mainWindow.loadURL(devServerUrl)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(distIndex)
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
