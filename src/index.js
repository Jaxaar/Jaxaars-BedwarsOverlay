const { shell, clipboard, ipcRenderer } = require('electron');
const Tail = require('tail').Tail;

const { fetchPlayerHypixelData, fetchPlayer, verifyKey} = require('./apiCalls')
const { createStatsRowElement } = require("./playerRowFactory")

const { readJSONFile } = require('./Test/jaxaarHelpers')

let players = {}




async function main(){

    const config = await ipcRenderer.invoke('getConfigObj')
    console.log(config)
    console.log(config.data.HYkey)
    verifyKey(config.data.HYkey)


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
        if (showButton.style.transform === 'rotate(90deg)'){
            ipcRenderer.invoke('toggleShow', 600)
            // currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, Math.round(zoom*35), true);
            showButton.style.transform =  'rotate(0deg)'
            // $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none');
        }
        else{
            ipcRenderer.invoke('toggleShow', Math.round(35))
            showButton.style.transform =  'rotate(90deg)'
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


    ipcRenderer.on('test', async (event, ...arg) => {
        verifyKey(config.data.HYkey)
        console.log('test');
        console.log(config)

        // let igns = ['OhChit', 'Brains', 'Manhal_IQ_', 'Cryptizism', 'zryp', '_Creation', 'hypixel', 'Acceqted', 'FunnyNick', 'Dadzies', 'Rexisflying', 'Divinah', '86tops', 'ip_man', 'xDank', 'WarOG'];
        let igns = ['Jaxaar', 'Pypeapple', 'Xav_i', 'Protfire', 'Malizma', 'Keeper_of_gates'];
        // fetchPlayer('Jaxaar')
        for (const player of igns) {
            const pjson = await fetchPlayer(player)
            players[player] = pjson
            console.log(pjson)
            displayPlayer(pjson)
        }

        console.log("Running test file...")

        const gameChatJSON = readJSONFile(`${__dirname}/Test/jaxaarTestingData.json`)

        if (!gameChatJSON) return
    
        for(const s of gameChatJSON.chat){
            const state = {
                inGameLobby: false,
                gameStarting: false,
                gameStarted: false,
                gameRunning: false,
                gameEnding: false,
                gameEnded: false,
            }
            for(const line of s){
                handleLogLine(line, state)
                // console.log(state)
            }
        }

        //ipcRenderer.send('autowho');

        // MODAL WINDOW USAGE
        // ModalWindow.open({
        //     title: 'Hello modal window',
        //     content: 'Please tell me this modal window actually worked dude. I tried something new with JS and am hoping this works first try', // optional
        //     type: 1 // 1 for success, -1 for error, -2 for warning, leave blank for general info
        // });
    });

    ipcRenderer.on('runIndexTest', async (event, ...arg) => {
        testIndex()
    })

    // monitorLogFile(file)
}



function displayPlayer(playerJSON){
    const displayEl = document.getElementById("statsRows")
    const playerRowEl = createStatsRowElement(playerJSON, {})
    displayEl.append(playerRowEl)
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



function monitorLogFile(filePath){
    let tail
    try{
        tail = new Tail(filePath, {useWatchFile: true, nLines: 1, fsWatchOptions: {interval: 100}});
    } catch {
        console.log("Log file missing")
        return
    }
    const state = {
        inGameLobby: false,
        gameStarting: false,
        gameStarted: false,
        gameRunning: false,
        gameEnding: false,
        gameEnded: false,
    }
    tail.on('line', (data) => {
        handleLogLine(data, state)
    })
}


function handleLogLine(data, state){
    // if(!data.includes('[CHAT]')){
    //     return
    // }

    // const msg = data.substring(k+7).replace(/(§|�)([0-9]|a|b|e|d|f|k|l|m|n|o|r|c)/gm, '');

    const msg = data

    // console.log(msg)
    if (msg.includes('ONLINE:') && msg.includes(',')){
        let playersInLobby = msg.substring(8).split(', ');
        const copyOfPlayers = players
        players = {}
        for (p of playersInLobby){
            addPlayerData(p, copyOfPlayers[p])
        }

            // if (w.indexOf('[') !== -1) w = w = w.substring(0, w.indexOf('[')-1);
            // for (let j = 0; j < players.length; j++){
            //     if (players[j].name === who[i]) contains = true;
            // }
        //     if(!players[w]){
        //         addPlayer(w)
        //     }
        // }
        // for (let i = 0; i < players.length; i++){
        //     if (!who.includes(players[i].name)){players.splice(i, 1); changed = true; updateArray();}
    }
    else if (msg.includes('has joined') && !msg.includes(':')){
    }
    else if (msg.includes('has quit') && !msg.includes(':')){
    }
    else if (msg.includes('Sending you') && !msg.indexOf(':')){

    } 
    else if ((msg.includes('joined the lobby!') || msg.includes('rewards!')) && !msg.includes(':')) {
    }
    else if ((msg.includes('FINAL KILL') || msg.includes('disconnected')) && !msg.includes(':')){
    }
}


async function addPlayerData(playerName, data){
    if(!data){
        data = await fetchPlayer(playerName)
    }
    players[playerName] = data
    displayPlayer(players[playerName])
}


module.exports = {
    handleLogLine
}