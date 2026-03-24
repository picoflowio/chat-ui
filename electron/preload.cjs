const { contextBridge } = require('electron')

// Expose a tiny, typed-safe surface for renderer <-> main later.
contextBridge.exposeInMainWorld('electronAPI', {})
