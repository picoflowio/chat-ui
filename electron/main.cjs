const { app, BrowserWindow, nativeImage, session } = require('electron')
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
  // Electron renders from file:// which gives the request an Origin: null header.
  // Some backends (including the PicoFlow API) don't allow that origin, so
  // network calls would fail only in the packaged app. We relax CORS headers
  // in the Electron session so the renderer can talk to the backend just like
  // the web build.
  const defaultSession = session.defaultSession
  defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = {
      ...details.responseHeaders,
      'Access-Control-Allow-Origin': ['*'],
      'Access-Control-Allow-Headers': ['*'],
      'Access-Control-Allow-Methods': ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    }
    callback({ responseHeaders })
  })

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
