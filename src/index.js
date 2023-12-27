const { shell, clipboard, ipcRenderer } = require('electron');
const Tail = require('tail').Tail;
const fs = require('fs');

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
    
        for(let s of gameChatJSON.chat){
            s = "[22:01:15] [Client thread/INFO]: [CHAT]" + s 
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

    const logPath = config.data.logPath

    // console.log(logPath)
    // console.log("C:/Users/jax16/curseforge/minecraft/Instances/1.8.9 QOL/logs")
    // console.log(fs.existsSync("C:/Users/jax16/curseforge/minecraft/Instances/1.8.9 QOL/logs"))


    if (fs.existsSync(logPath)) {
        monitorLogFile(`${logPath}/latest.log`)
    }
    else{
        console.log("LogPath DNE")
    }
}



function displayPlayer(playerJSON){
    const displayEl = document.getElementById("statsRows")
    const playerRowEl = createStatsRowElement(playerJSON, {})

    for(const row of displayEl.children){
        if(row.getAttribute("data-score") < playerJSON.sortingScore){
            displayEl.insertBefore(playerRowEl, row)
            return
        }
    }
    displayEl.append(playerRowEl)

}

function removePlayerDisplay(playerJSON){
    const playerRowEl = document.getElementById(`${playerJSON.name}-row`)
    playerRowEl.remove()
}


function clearDisplay(playerJSON){
    const displayEl = document.getElementById("statsRows")
    displayEl.innerHTML = ""
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
    console.log("Monitoring...")
    tail.on('line', (data) => {
        handleLogLine(data, state)
    })
}


function handleLogLine(data, state){
    if(!data.includes('[CHAT]')){
        return
    }
    const k = data.indexOf('[CHAT]');
    const msg = data.substring(k+7).replace(/(§|�)([0-9]|a|b|e|d|f|k|l|m|n|o|r|c)/gm, '');

    // const msg = data

    // console.log(msg)
    if (msg.includes('ONLINE:') && msg.includes(',')){
        let playersInLobby = msg.substring(8).split(', ');
        const copyOfPlayers = players
        players = {}
        clearDisplay()
        for (p of playersInLobby){
            addPlayer(p, copyOfPlayers[p])
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
        addPlayer(msg.split(' ')[0])
    }
    else if (msg.includes('has quit') && !msg.includes(':')){
        removePlayer(msg.split(' ')[0])
    }
    else if (msg.includes('Sending you') && !msg.includes(':')){
        // console.log("Entering game lobby")
        players = {}
        clearDisplay()
    } 
    else if ((msg.includes('joined the lobby!') || msg.includes('rewards!') || msg.includes('slid into the lobby!')) && !msg.includes(':')) {
        // console.log('In Main Lobby')
        players = {}
        clearDisplay()
    }
    else if ((msg.includes('FINAL KILL') || msg.includes('disconnected')) && !msg.includes(':')){
        removePlayer(msg.split(' ')[0])
    }

    // if(msg.includes("Testing1234") && msg.includes("Testing1234")){
    //     console.log("Testing" + msg)
    //     testing()
    // }


    // else if(msg.includes("The game starts in 1 second!") && !msg.includes(":")){
    //     // Update state vars
    //     this.bools.gameStarting = true
    // }
    // // Verify it actual started
    // else if(this.bools.gameStarting && msg.includes("??????????????????????????????????????????????????????????????") && !msg.includes(":")){
    //     // Update state vars
    //     this.bools.gameStarting = false
    //     this.bools.gameStarted = true
    // }
    // // Verify it's bedwars starting
    // else if(this.bools.gameStarted && msg.replaceAll(" ", "").includes("BedWars") && !msg.includes(":")){
    //     // Update state vars
    //     this.bools.gameStarted = false
    //     this.bools.gameRunning = true
    //     // Determine gamemode
    //     // if(msg.replace(" ", "") === "BedWars"){
    //     //     this.bools.normalMode = true
    //     // }
    //     // else{
    //     //     this.bools.dreamMode = true
    //     // }
    //     this.bools.normalMode = true

    //     // Log the players who are in the game
    //     this.logPlayers(players)

    // } 
    
    // // Catch mid game events
    // else if (this.flags.finals && msg.includes('FINAL KILL') && !msg.includes(":")){
    //     this.handleFinals(msg)
    // }
    // else if (msg.includes("BED DESTRUCTION") && msg.includes("Your Bed") && !msg.includes(":")){
    //     this.handleBedsBroken(msg)
    // }

    // // Detect Game end (Assuming still in lobby)
    // else if(this.bools.gameRunning && msg.includes("??????????????????????????????????????????????????????????????") && !msg.includes(":")){
    //     // Update state vars
    //     this.bools.gameEnding = true
    // }
    // // Verify Game end
    // else if (this.bools.gameEnding && msg.replaceAll(" ", "").includes("BedWars") && !msg.includes(":")){
    //     this.bools.gameEnding = false
    //     this.bools.gameRunning = false
    //     this.bools.gameEnded = true
    // }

    // // Game end WIP
    // else if (this.bools.gameEnded && msg.toLowerCase().includes(this.userTeamColor) && this.userTeamColor != ""){
    //     this.bools.gameEnded = false
    // }
    // else if (this.bools.gameEnded && msg.includes("Slumber Tickets! (Win)")){
    //     this.bools.gameEnded = false
    // }
}

async function testing(){
    const data = await fetchPlayer("Jaxaar")
    console.log("Data: ")
    console.log(data)
}

async function addPlayer(playerName, data){
    if(players[playerName]){
        return
    }
    if(!data){
        data = await fetchPlayer(playerName)
    }
    console.log(`Adding ${playerName}`)
    players[playerName] = data
    displayPlayer(players[playerName])
}

async function removePlayer(playerName){
    console.log(`Removing ${playerName}`)
    if(!players[playerName]){
        return false
    }
    removePlayerDisplay(players[playerName])
    // console.log("Before")
    // console.log(players)
    delete players[playerName]
    // console.log(players)

}


module.exports = {
    handleLogLine
}