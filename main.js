const { app, BrowserWindow, globalShortcut, ipcMain, dialog } = require('electron')
// const homedir = app.getPath('home').replaceAll('\\', '/');
const {path} = require('path')
const { createConfig } = require("./src/configHandler")


const isDev = require('electron-is-dev');
const config =  createConfig(`${app.getPath('userData')}/config.json`, {'ign': null, 'HYkey': ''})
let win
let keybinds = {}
let through = false






// modify your existing createWindow() function
const createWindow = () => {
    win = new BrowserWindow({
        width: 650,
        height: 600,
        minWidth: 450,
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

    if(isDev){
        win.setFocusable(true)
    }
  }


app.whenReady().then(() => {
    createWindow()
    // setKeybind('peak', null ?? 'CommandOrControl+Shift+A')
    // setKeybind('clear', null ?? 'CommandOrControl+Shift+Z')
    // setKeybind('through', null ?? 'CommandOrControl+Shift+T')
    setKeybind('peak', config.get('settings.keybinds.peak') ?? 'CommandOrControl+Shift+A')
    setKeybind('clear', config.get('settings.keybinds.clear') ?? 'CommandOrControl+Shift+Z')
    setKeybind('through', config.get('settings.keybinds.through') ?? 'CommandOrControl+Shift+T')
  
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


ipcMain.handle('getConfigObj', (event) => {
    return JSON.stringify(config)
})

ipcMain.handle('setConfigField', (event, fieldName, value) => {
    config.set(fieldName, value)
    return JSON.stringify(config)
})

ipcMain.handle('setTempPath', (event) => {
    let path = dialog.showOpenDialogSync({title: 'Select latest.log file', buttonLabel: 'Select log file', filters: [{name: 'Latest log', extensions: ['log']}]});
    if(path){
        config.set("logPath", path[0])
    }
    app.relaunch(); app.exit(0); app.quit();
    // return JSON.stringify(config)
})
