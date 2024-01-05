const { app, BrowserWindow, globalShortcut, ipcMain, dialog } = require('electron')
// const homedir = app.getPath('home').replaceAll('\\', '/');
const {path} = require('path')
const { createConfig } = require("./src/configHandler")
const { createPlayerRecord } = require("./src/playerData")
// const { autoUpdater } = require('electron-updater');



const isDev = require('electron-is-dev');
const config =  createConfig(`${app.getPath('userData')}/config.json`, {'ign': null, 'HYkey': ''})
let win
let keybinds = {}
let through = false
let playerRecord =  createPlayerRecord(`${app.getPath('userData')}/playerRecord.json`)






// modify your existing createWindow() function
const createWindow = () => {

    // splash = new BrowserWindow({
    //     width: 400,
    //     height: 400
    //     , transparent: true,
    //     frame: false, 
    //     alwaysOnTop: true, 
    //     skipTaskbar: true, 
    //     show: false, 
    //     webPreferences: {
    //         nodeIntegration: true,
    //         contextIsolation: false
    //     }});
    // splash.loadFile('src/splash.html');
    
    win = new BrowserWindow({
        width: 650,
        height: 600,
        minWidth: 450,
        x: config.get('win-x-pos',0),
        y: config.get('win-y-pos',0),
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

    // checkForUpdate();

    // splash.once('ready-to-show', () => {
    //     splash.show();
    // });
    // win.once('ready-to-show', () => {
    //     splash.destroy();
    //     win.show();
    // });

    win.setAlwaysOnTop(true);
    win.setSkipTaskbar(false)
    // win.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true});
    // win.setVisibleOnAllWorkspaces(true);
    win.setMenu(null);
    // win.removeMenu()
    // win.setMenuBarVisibility(false)
    // win.setAutoHideMenuBar(false)
    if(isDev){
        // win.setFocusable(true)
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


app.on('before-quit', () => {
    console.log("Quitting...")
    playerRecord.save()
    const winPos = win.getPosition()

    config.set("win-x-pos", winPos[0] >= 0 ? winPos[0] : 0)
    config.set("win-y-pos", winPos[1] >= 0 ? winPos[1] : 0)

    config.save()
    // console.log()

});



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
                    if (win.isVisible()) win.minimize();
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




// function checkForUpdate() {
//     if (isDev) return;
//     if (process.platform === 'win32') autoUpdater.checkForUpdates();
// }

// autoUpdater.on('update-downloaded', info => {
//     const options = {
//         type: 'info',
//         title: `Abyss Overlay Update v${info.version} downloaded`,
//         message: 'A new update has been downloaded. Updating is strongly recommended! Automatically restart overlay now and install?',
//         detail: 'Overlay will automatically restart after update is installed',
//         buttons: ['Yes', 'No'],
//         icon: path.join(__dirname, 'assets', 'logo.ico'),
//         defaultId: 0,
//         checkboxLabel: 'Show update notes in browser'
//     }
//     dialog.showMessageBox(win, options).then(returned => {
//         if (returned.checkboxChecked === true) shell.openExternal('https://github.com/Chit132/abyss-overlay/releases/latest');
//         if (returned.response === 0) autoUpdater.quitAndInstall(true, true);
//     });
//     //console.log(info);
// });

// autoUpdater.on('error', (err) => {
//     console.log(err);
//     dialog.showMessageBox(win, {
//         type: 'error',
//         title: 'Auto-update error',
//         message: 'There was an error auto-updating the overlay! Please install the new update manually ASAP',
//         detail: 'Click "Take me there" to take you to the download page for the new version',
//         buttons: ['Take me there', 'Later'],
//         defaultId: 0
//     }).then(returned => {
//         if (returned.response === 0) shell.openExternal('https://github.com/Chit132/abyss-overlay/releases/latest');
//     });
// });




ipcMain.handle("closeApp", (event) => {
    win.setSkipTaskbar(true);
    win.close();
    app.quit();
})


ipcMain.handle("minimizeApp", (event) => {
    win.minimize()
})

ipcMain.handle("unminimizeApp", (event) => {
    win.showInactive()
    win.moveTop()
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

ipcMain.handle('setLogPath', (event) => {
    let path = dialog.showOpenDialogSync({title: 'Select latest.log file', buttonLabel: 'Select log file', filters: [{name: 'Latest log', extensions: ['log']}]});
    if(path){
        config.set("logPath", path[0])
        app.relaunch(); app.exit(0); app.quit();
    }
    // return JSON.stringify(config)
})

ipcMain.handle('getPlayerRecordObj', (event) => {
    return JSON.stringify(playerRecord)
})

ipcMain.handle('savePlayerRecordObj', (event, json) => {
    // console.log("saving")
    // console.log(playerRecord)
    // console.log("json")
    // console.log(json)
    playerRecord.players = JSON.parse(json).players
    // console.log(playerRecord)
    playerRecord.save()
    // const obj = JSON.parse(json)
    // playerRecord.save(obj)
})


ipcMain.handle('setTestRecordObj', (event, fileName) =>{
    playerRecord = createPlayerRecord(`${app.getPath('userData')}/${fileName}.json`)
    // console.log(playerRecord)
    return JSON.stringify(playerRecord)
})