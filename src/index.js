const { shell, clipboard, ipcRenderer } = require('electron');

// const config = require('electron-json-config');




function main(){
    
    // Handle Control Buttons

    document.getElementById('quit').addEventListener('click', () => {
        // config.delete('players');
        // config.set('settings.pos', currentWindow.getPosition()); 
        // config.set('settings.size', [currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, currentWindow.webContents.getOwnerBrowserWindow().getBounds().height]);
        ipcRenderer.invoke('closeApp')
    });
    document.getElementById('minimize').addEventListener('click', () => {
        ipcRenderer.invoke('minimizeApp')
    });

    const showButton = document.getElementById('show')
    showButton.addEventListener('click', () => {
        //con.log(showRotation($('#show').css('transform')));
        if (showButton.style.transform === 'rotate(0deg)'){
            ipcRenderer.invoke('toggleShow', Math.round(35))
            // currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, Math.round(zoom*35), true);
            showButton.style.transform =  'rotate(90deg)'
            // $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none');
        }
        else{
            ipcRenderer.invoke('toggleShow', 600)
            showButton.style.transform =  'rotate(0deg)'
            // if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
        }
    });

    // document.getElementById('session').addEventListener('click', () => {
    //     // if ($('#sessiondiv').css('display') === 'none'){
    //     //     updateSession(startapi);
    //     //     $('#session').css('background-image', 'url(../assets/session2.png)'); $('#info').css('background-image', 'url(../assets/info1.png)'); $('#music').css('background-image', 'url(../assets/music1.png)'); $('#settings').css('background-image', 'url(../assets/settings1.png)'); $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none'); $('#infodiv').css('display', 'none'); $('#sessiondiv').css('display', 'inline-block'); $('#settingsdiv').css('display', 'none');
    //     //     if (!useruuid) {
    //     //         ModalWindow.open({ title: 'Missing username', type: -2, content: 'The session stats feature is <b>NOT available</b> without your Minecraft username! <ul><li style="height: auto">Enter your IGN in overlay settings</li></ul>' });
    //     //     }
    //     // }
    //     // else{
    //     //     $('#session').css('background-image', 'url(../assets/session1.png)'); $('#info').css('background-image', 'url(../assets/info1.png)'); $('#music').css('background-image', 'url(../assets/music1.png)'); $('#settings').css('background-image', 'url(../assets/settings1.png)'); $('#infodiv').css('display', 'none'); $('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block'); $('#sessiondiv').css('display', 'none'); $('#settingsdiv').css('display', 'none');
    //     // }
    // });

}




// // Highlight context buttons
// document.getElementById('settings').addEventListener('mouseenter', () => {
//     if ($('#settingsdiv').css('display') === 'none'){
//         $('#settings').css('background-image', 'url(../assets/settings2.png)');
//     }
// }).addEventListener('mouseleave', () => {
//     if ($('#settingsdiv').css('display') === 'none'){
//         $('#settings').css('background-image', 'url(../assets/settings1.png)');
//     }
// });





document.addEventListener("DOMContentLoaded", () =>{
    main()
})