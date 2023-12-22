const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron')
const {path} = require('path')

const isDev = require('electron-is-dev');



require("@electron/remote/main").enable(BrowserWindow, app)




let win
let keybinds = {}






// modify your existing createWindow() function
const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 400,
        x:0,
        y:0,
        show: true,
        transparent: true,
        frame: false,
        resizable: true,
        hasShadow: true,
        useContentSize: true,
        maximizable: false,
        focusable: false,
        icon: __dirname+'/assets/logo.ico',
        alwaysOnTop: true,
        title: 'Jax Overlay',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true, 
            contextIsolation: false
            // preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('./src/index.html')
    win.setAlwaysOnTop(true);
    win.setSkipTaskbar(false)

    // win.setVisibleOnAllWorkspaces(true);
    win.setMenu(null);
  }


app.whenReady().then(() => {
    createWindow()
    setKeybind('peak', null ?? 'CommandOrControl+Shift+A')
    setKeybind('clear', null ?? 'CommandOrControl+Shift+Z')
    setKeybind('through', null ?? 'CommandOrControl+Shift+T')
    // setKeybind('peak', config.get('settings.keybinds.peak', null) ?? 'CommandOrControl+Shift+A')
    // setKeybind('clear', config.get('settings.keybinds.clear', null) ?? 'CommandOrControl+Shift+Z')
    // setKeybind('through', config.get('settings.keybinds.through', null) ?? 'CommandOrControl+Shift+T')
  
    if (isDev) {
        globalShortcut.register('CommandOrControl+f', () => {
            win.webContents.openDevTools();
        });
        globalShortcut.register('Ctrl+Alt+A', () => {
            win.webContents.send('test', 'hi testing');
        });
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'){
        app.quit()
    }
})






function setKeybind(bind, keybind) {
    //unbind key
    if(!keybind){
        if(keybinds[bind]){ globalShortcut.unregister(keybinds[bind]); }
        keybinds[bind] = keybind;
        return;
    }

    //bind key
    switch (bind) {
      case 'peak':
            try {
                globalShortcut.register(keybind, () => {
                    if (win.isVisible()) win.hide();
                    else if (!win.isVisible()) { win.showInactive(); win.moveTop(); }
                }); 
            } catch (error) {
                console.log(`Error whilst setting "${bind}" to "${keybind}"` , error)
                break;
            }
         case 'clear':
            try {
                globalShortcut.register(keybind, () => {
                    win.webContents.send('clear')
                });
            } catch(error) {
                console.log(`Error whilst setting "${bind}" to "${keybind}"` , error)
                break;
            }
        case 'through':
            try {
                globalShortcut.register(keybind, () => {
                    through = !through;
                    if(through) win.setIgnoreMouseEvents(true);
                    else if(!through) win.setIgnoreMouseEvents(false);
                }); 
            } catch (error) {
                console.log(`Error whilst setting "${bind}" to "${keybind}"` , error)      
                break;
            }
      default:
        if(keybinds[bind]){ globalShortcut.unregister(keybinds[bind]); }
        keybinds[bind] = keybind;
        break;
    }
}









ipcMain.handle("closeApp", (event) => {
    win.setSkipTaskbar(true);
    win.close();
    app.quit();
})


ipcMain.handle("minimizeApp", (event) => {
    win.minimize()
})

ipcMain.handle('toggleShow', (event, height) => {
    win.setSize(win.webContents.getOwnerBrowserWindow().getBounds().width, height, true);
})