const { shell, ipcRenderer, dialog } = require('electron');
const Tail = require('tail').Tail;
const fs = require('fs');

const { fetchPlayerHypixelData, fetchPlayer, verifyKey} = require('./apiCalls')
const { createStatsRowElement } = require("./playerRowFactory")

const { readJSONFile, delay } = require('./Test/jaxaarHelpers')
const { activateModal } = require('./modalController')

const displayConfig = require("./displayConfig.json");
let players = {}
let config = {}
let playerRecord = {}
let goodHypixelKey = true
// let goodLogFile = true

const flags = {
    "finals": true,
    "usersBedBroken": true,
    "testingMode": false,
}

// async function versionCompare() {
//     try {
//         await fetch('https://raw.githubusercontent.com/Chit132/abyss-overlay/master/package.json')
//             .then(r => r.json())
//             .then(remotePackage => {
//                 if (remotePackage.version !== packageJSON.version) {
//                     $('#update').css('display', 'inline-block');
//                     const updatenotif = new Notification({
//                         title: 'UPDATE AVAILABLE!',
//                         body: 'To update, join the Discord, click on the update button, or click on this notification!',
//                         icon: path.join(__dirname, '../assets/logo.ico')
//                     });
//                     updatenotif.on('click', () => {shell.openExternal('https://discord.gg/7dexcJTyCJ'); shell.openExternal('https://github.com/Chit132/abyss-overlay/releases/latest');});
//                     if (app.isPackaged) updatenotif.show();
//                 }
//             });
//     } catch {console.error('Cannot read remote version');}
// }
// versionCompare();



async function main(){

    config = JSON.parse(await ipcRenderer.invoke('getConfigObj'))
    playerRecord = JSON.parse(await ipcRenderer.invoke('getPlayerRecordObj'))


    // config = JSON.parse(await ipcRenderer.invoke('setConfigField', "test123", 123456))
    // console.log(config)
    verifyKey(config.data.HYkey)

    // if(!config.data.logPath){
    //     activateLogSelectorModal()
    // }

    setDisplayTitles()

    // TODO: move listeners to their own methods to clean up main

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
        toggleShow()
    });

    // document.getElementById('session').addEventListener('click', () => {

    // });
    // document.getElementById('info').addEventListener('click', () => {

    // });
    document.getElementById('settings').addEventListener('click', () => {
        toggleSettings()
    });

    // TODO: Move settings listeners to their own method
    document.getElementById('open-log-window').addEventListener('click', () => {
        openLogPathWindow()
    });

    document.getElementById('api-key-modal-trigger').addEventListener('click', () => {
        activateModal("apiKey")
    });

    const usernameField = document.getElementById('usernameInput')
    usernameField.placeholder = config.data.ign ? config.data.ign : "Enter your username"

    usernameField.addEventListener('click', () => {
        ipcRenderer.invoke("focus", true)
    });

    usernameField.addEventListener('keyup', (event) => {
        if(event.key == "Enter"){
            usernameField.blur()
        }
    });

    usernameField.addEventListener('focusout', () => {
        ipcRenderer.invoke("focus", false)
        console.log(usernameField.value)
        if(usernameField.value !== ""){
            usernameField.placeholder = usernameField.value.toLowerCase()
            ipcRenderer.invoke("setConfigField", "ign", usernameField.value.toLowerCase())
            usernameField.value = ""
        }
    });

    document.addEventListener("badAPIKey", () => {
        if(goodHypixelKey){
            goodHypixelKey = false
            activateModal("apiKey")
        }
    })


    ipcRenderer.on('test', async (event, ...arg) => {
        flags.testingMode = true
        playerRecord = JSON.parse(await ipcRenderer.invoke('setTestRecordObj', 'playerRecordTEST'))
        // console.log("settingTest")
        // console.log(playerRecord)

        verifyKey(config.data.HYkey)
        // console.log('test');
        // console.log(config)

        // let igns = ['OhChit', 'Brains', 'Manhal_IQ_', 'Cryptizism', 'zryp', '_Creation', 'hypixel', 'Acceqted', 'FunnyNick', 'Dadzies', 'Rexisflying', 'Divinah', '86tops', 'ip_man', 'xDank', 'WarOG'];
        let igns = ['Angeeeel', 'Jaxaar', 'Pypeapple', 'Xav_i', 'Protfire', 'Malizma', 'Keeper_of_gates', 'hypixel', 'WarOG', 'TheLuckiestBunny', 'MinaUFG1010'];
        // fetchPlayer('Jaxaar')
        for (const player of igns) {
            const pjson = await fetchPlayer(player)
            players[player] = pjson
            console.log(pjson)
            displayPlayer(pjson)
        }

        console.log("Running test file...")
        // console.log("3")
        // console.log(playerRecord)

        // const gameChatJSON = readJSONFile(`${__dirname}/Test/jaxaarTestingData.json`)

        if (!gameChatJSON) return
        // console.log(gameChatJSON)
        for(let s of gameChatJSON.chat){
            
            const state = {
                inGameLobby: false,
                gameStarting: false,
                gameStarted: false,
                gameRunning: false,
                gameEnding: false,
                gameEnded: false,
            }
            for(let line of s){
                line = "[22:01:15] [Client thread/INFO]: [CHAT] " + line 
                if(state.gameStarting){
                    await delay(2000)
                    handleLogLine(line, state)
                }
                else{
                    handleLogLine(line, state)
                }
            }
            // console.log("4")
            // console.log(playerRecord)
        }
        // console.log("Setting obj")
        // console.log(playerRecord)
        playerRecord = JSON.parse(await ipcRenderer.invoke('setTestRecordObj', 'playerRecord'))
        flags.testingMode = false
    });

    ipcRenderer.on('clear', async (event, ...arg) => {
        players = {}
        clearDisplay()

    })

    
    const logPath = config.data.logPath
    // console.log(logPath)

    if (fs.existsSync(logPath)) {
        monitorLogFile(`${logPath}`)
    }
    else{
        goodLogFile = false
        console.log("LogPath DNE")
        if(goodHypixelKey){
            activateModal("logFile")
        }
    }
}

function toggleShow(){
    const showButton = document.getElementById('show')
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
}

function activateWindow(){
    const showButton = document.getElementById('show')
    if (showButton.style.transform === 'rotate(90deg)'){
        toggleShow()
    }
    ipcRenderer.invoke('unminimizeApp')
    return true
}

function toggleSettings(){

    const sdEl = document.getElementById('settings')
    const settingsContainerEl = document.getElementById("settingsContainer")
    if(settingsContainerEl.classList.contains("hidden")){
        sdEl.classList.add("settingsActive")
        settingsContainerEl.classList.remove("hidden")
    }
    else{
        sdEl.classList.remove("settingsActive")
        settingsContainerEl.classList.add("hidden")
    }
}

// Potentially move displaying to another file
function displayPlayer(playerJSON){
    // console.log(displayConfig)
    const displayEl = document.getElementById("statsRows")
    const playerRowEl = createStatsRowElement(playerJSON, playerRecord, displayConfig)

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

function setDisplayTitles(){
    const displayHeaderEl = document.getElementById("statsHeaders")
    displayHeaderEl.innerHTML = ""
    for(const t of displayConfig){
        if(t.activated == "false"){
            continue
        }

        const el = document.createElement("th")
        el.className = "titleitems"
        el.style.width = `${t.colWidth}`
        el.innerText = t.title
        if(t.tag == "playerName"){
            el.style.textAlign = "center"
        }
        displayHeaderEl.append(el)
    }
}

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


document.addEventListener("DOMContentLoaded", () =>{
    main()
})


function handleLogLine(data, state){
    if(!data.includes('[CHAT]')){
        return
    }
    const k = data.indexOf('[CHAT]');
    const msg = data.substring(k+7).replace(/(§|�)([0-9]|a|b|e|d|f|k|l|m|n|o|r|c)/gm, '');

    // console.log(msg)

    if (msg.includes('ONLINE:') && msg.includes(',')){
        activateWindow()
        let playersInLobby = msg.substring(8).split(', ');
        const copyOfPlayers = players
        players = {}
        clearDisplay()
        for (p of playersInLobby){
            addPlayer(p, copyOfPlayers[p])
        }
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
    // else if ((msg.includes('FINAL KILL') || msg.includes('disconnected')) && !msg.includes(':')){
    //     removePlayer(msg.split(' ')[0])
    // }

    // Detecting Game start
    else if(msg.includes("The game starts in 1 second!") && !msg.includes(":")){
        // Update state vars
        state.gameStarting = true
    }
    // Verify it actual started
    else if(state.gameStarting && msg.includes("??????????????????????????????????????????????????????????????") && !msg.includes(":")){
        // Update state vars
        state.gameStarting = false
        state.gameStarted = true
    }
    // Verify it's bedwars starting
    else if(state.gameStarted && msg.replaceAll(" ", "").includes("BedWars") && !msg.includes(":")){
        // Update state vars
        state.gameStarted = false
        state.gameRunning = true
        // Determine gamemode
        // if(msg.replace(" ", "") === "BedWars"){
        //     this.bools.normalMode = true
        // }
        // else{
        //     this.bools.dreamMode = true
        // }
        state.normalMode = true

        // Log the players who are in the game
        // console.log("Logging")
        logPlayers(players)
    } 
    
    // Catch mid game events
    else if (flags.finals && msg.includes('FINAL KILL') && !msg.includes(":")){
        // console.log("final" + msg)
        handleFinals(msg)
    }
    else if (msg.includes("BED DESTRUCTION") && msg.includes("Your Bed") && !msg.includes(":")){
        // console.log("bed" + msg)
        handleBedsBroken(msg)
    }

    // Shouldn't work
    // Detect Game end (Assuming still in lobby)
    else if(state.gameRunning && msg.includes("??????????????????????????????????????????????????????????????") && !msg.includes(":")){
        // Update state vars
        state.gameEnding = true
        // console.log("Game Ending")

    }
    // Verify Game end
    else if (state.gameEnding && msg.replaceAll(" ", "").includes("BedWars") && !msg.includes(":")){
        state.gameEnding = false
        state.gameRunning = false
        state.gameEnded = true
        // console.log("Game Ended")
    }

    // Potentially fails with language changes?
    else if (state.gameEnded && (msg.includes("Blue -") || msg.includes("Red -") || msg.includes("Yellow -") || msg.includes("Green -") || msg.includes("Aqua -")  || msg.includes("Gray -")  || msg.includes("Pink -") || msg.includes("White -") ) && !msg.includes(":")){
        // console.log("Game Ended - Color")
        handleWinningPlayers(msg)
        // console.log(playerRecord.players)

    }
    // Win
    else if (state.gameEnded && msg.includes("Slumber Tickets! (Win)")){
        state.gameEnded = false
        // console.log("Record")
        // console.log(playerRecord)
        ipcRenderer.invoke('savePlayerRecordObj', JSON.stringify(playerRecord))
    }
    // Loss
    else if (state.gameEnded && msg.includes("Slumber Tickets! (Win)")){
        state.gameEnded = false
        // console.log("Record")
        // console.log(playerRecord)
        ipcRenderer.invoke('savePlayerRecordObj', JSON.stringify(playerRecord))
    }
}

// async function testing(){
//     const data = await fetchPlayer("Jaxaar")
//     console.log("Data: ")
//     console.log(data)
// }

async function addPlayer(playerName, data){
    if(players[playerName]){
        return
    }
    if(!data){
        data = await fetchPlayer(playerName)
    }
    console.log(`Adding ${playerName}`)
    players[playerName] = data
    if(document.getElementById(`${players[playerName].name}-row`)){
        return
    }

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

// Remove function, replace contents, Change invoke method name 
async function openLogPathWindow(){
    ipcRenderer.invoke('setLogPath')
}

// Potentially move all logging functionality to a seperate file/ make it a class?
function logPlayers(){
    for(const p in players){
        // console.log(p)
        const player = p.toLowerCase()
        // this.currentPlayers.push(player)

        if(this.verifyPlayer(player)){
            playerRecord.players[player].gamesPlayed = playerRecord.players[player].gamesPlayed ? playerRecord.players[player].gamesPlayed + 1 : 1
        }
    }
}

function handleFinals(msg){
    const died = msg.split(' ')[0].toLowerCase();
    const killer = msg.split(' ')[msg.split(' ').length-3].replace(".", "").replace("?", "").replace("!", "").toLowerCase(); //Find a better replace method

    if(died == this.user){
        verifyPlayer(killer)
        playerRecord.players[killer].FinaledYou = playerRecord.players[killer].FinaledYou ? 1 + playerRecord.players[killer].FinaledYou : 1
    }
    else if(killer == this.user){
        verifyPlayer(died)
        playerRecord.players[died].YouFinaled = playerRecord.players[died].YouFinaled ? 1 + playerRecord.players[died].YouFinaled : 1
    }
}

function handleBedsBroken(msg){
    if(flags.usersBedBroken){
        const breaker = msg.split(' ')[msg.split(' ').length-1].replace(".", "").replace("?", "").replace("!", "").toLowerCase(); //Find a better replace method
        verifyPlayer(breaker)
        playerRecord.players[breaker].brokeYourBed = playerRecord.players[breaker].brokeYourBed ? 1 + playerRecord.players[breaker].brokeYourBed : 1
    }
}

function handleWinningPlayers(msg){
    const split = msg.replaceAll(" ", "").split("-")
    const color = split[0]
    const playerList = split[1].toLowerCase().split(",")

    for(let i = 0; i < playerList.length; i++){
        // Remove rank tag
        if(playerList[i].includes("]")){
            playerList[i] = playerList[i].split("]")[1]
        }
    }

    const playerWon =  playerList.includes(config.data.ign)

    for(let p of playerList){
        // Remove rank tag

        verifyPlayer(p)
        playerRecord.players[p].gamesWon = playerRecord.players[p].gamesWon ? playerRecord.players[p].gamesWon + 1 : 1

        if(playerWon){
            playerRecord.players[p].winsWith = playerRecord.players[p].winsWith ? playerRecord.players[p].winsWith + 1 : 1
        }
    }
}

/**
 * Verifies that the player is in the record. Forces all player names to lowercase
 * @param {String} playerName 
 * @returns boolean if player is in the record
 */
function verifyPlayer(playerName){
    playerName = playerName.toLowerCase()
    if(playerRecord.players[playerName]){
        return true
    }
    else{
        playerRecord.players[playerName] = {
            "name": playerName,
            "gamesPlayed": 1,
        }
        return false
    }
}

module.exports = {
    handleLogLine
}