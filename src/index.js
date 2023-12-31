const { shell, clipboard, ipcRenderer, dialog } = require('electron');
const Tail = require('tail').Tail;
const fs = require('fs');

const { fetchPlayerHypixelData, fetchPlayer, verifyKey} = require('./apiCalls')
const { createStatsRowElement } = require("./playerRowFactory")

const { readJSONFile } = require('./Test/jaxaarHelpers')

const displayConfig = require("./displayConfig.json");
let players = {}
let config = {}
let goodHypixelKey = true


const flags = {
    finals: true
}


async function main(){

    config = JSON.parse(await ipcRenderer.invoke('getConfigObj'))

    // config = JSON.parse(await ipcRenderer.invoke('setConfigField', "test123", 123456))
    console.log(config)
    verifyKey(config.data.HYkey)

    // if(!config.data.logPath){
    //     activateLogSelectorModal()
    // }

    setDisplayTitles()

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

    // });
    // document.getElementById('info').addEventListener('click', () => {

    // });
    document.getElementById('settings').addEventListener('click', () => {
        toggleSettings()
    });

    document.getElementById('open-log-window').addEventListener('click', () => {
        openLogPathWindow()
    });

    document.getElementById('api-key-modal-trigger').addEventListener('click', () => {
        activateAPIKeyModal()
    });

    document.addEventListener("badAPIKey", () => {
        if(goodHypixelKey){
            goodHypixelKey = false
            activateAPIKeyModal()
        }
    })


    ipcRenderer.on('test', async (event, ...arg) => {
        verifyKey(config.data.HYkey)
        console.log('test');
        console.log(config)

        // let igns = ['OhChit', 'Brains', 'Manhal_IQ_', 'Cryptizism', 'zryp', '_Creation', 'hypixel', 'Acceqted', 'FunnyNick', 'Dadzies', 'Rexisflying', 'Divinah', '86tops', 'ip_man', 'xDank', 'WarOG'];
        let igns = ['Jaxaar', 'Pypeapple', 'Xav_i', 'Protfire', 'Malizma', 'Keeper_of_gates', 'hypixel', 'WarOG', 'TheLuckiestBunny', 'MinaUFG1010'];
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
            }
        }
    });

    ipcRenderer.on('clear', async (event, ...arg) => {
        players = {}
        clearDisplay()

    })

    const logPath = config.data.logPath
    console.log(logPath)


    if (fs.existsSync(logPath)) {
        monitorLogFile(`${logPath}`)
    }
    else{
        console.log("LogPath DNE")
    }
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


function displayPlayer(playerJSON){
    console.log(displayConfig)
    const displayEl = document.getElementById("statsRows")
    const playerRowEl = createStatsRowElement(playerJSON, displayConfig)

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
        logPlayers(players)
    } 
    
    // Catch mid game events
    else if (flags.finals && msg.includes('FINAL KILL') && !msg.includes(":")){
        handleFinals(msg)
    }
    else if (msg.includes("BED DESTRUCTION") && msg.includes("Your Bed") && !msg.includes(":")){
        handleBedsBroken(msg)
    }

    // Detect Game end (Assuming still in lobby)
    else if(state.gameRunning && msg.includes("??????????????????????????????????????????????????????????????") && !msg.includes(":")){
        // Update state vars
        state.gameEnding = true
    }
    // Verify Game end
    else if (state.gameEnding && msg.replaceAll(" ", "").includes("BedWars") && !msg.includes(":")){
        state.gameEnding = false
        state.gameRunning = false
        state.gameEnded = true
    }

    // Game end WIP
    else if (state.gameEnded && msg.toLowerCase().includes(this.userTeamColor) && this.userTeamColor != ""){
        state.gameEnded = false
    }
    else if (state.gameEnded && msg.includes("Slumber Tickets! (Win)")){
        state.gameEnded = false
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

function activateAPIKeyModal(){
    console.log("Activating and Loading modal...")
    console.log(document.getElementById("modal"))
    setModal(`
        <p>BARS Overlay requires using a developer hypixel api key, and yours is currently invalid.</p>
        <ul>
            <li style="height: auto">Generate a new API key <a id="hy-dev-portal" href="">here</a> and paste it below.</li>
            <li style="height: auto">For more information, follow <a id="api-key-guide" href="">this</a> guide. (Thx Abyss Overlay)</li>
        </ul>
        <div id="modal-error" class="modal-error hidden">Invalid Key</div>
        <input type="text" class="api_key__input" id="modal_api_key" name="Hypixel API Key" maxlength="36" size="36" placeholder="Click to paste API key">               
        <button id="modal-close" class="modal-close">Handle Later</button>
    `)
    console.log(document.getElementById("modal"))
    openModal()

    console.log(document.getElementById("modal"))
    document.getElementById("modal-close").addEventListener("click", () =>{ closeModal()})
    document.getElementById('hy-dev-portal').addEventListener("click", ()=> { shell.openExternal('https://developer.hypixel.net/dashboard')})
    document.getElementById('api-key-guide').addEventListener("click", ()=> { shell.openExternal('https://github.com/Chit132/abyss-overlay/wiki/Hypixel-API-Keys-Guide')})
    document.getElementById('modal_api_key').addEventListener("click", async ()=> {
        const validKey = await clipboardKey() 
        if(!validKey){
            document.getElementById('modal-error').classList.remove("hidden")
         }
         else{
            closeModal()
            config = JSON.parse(await ipcRenderer.invoke('setConfigField', "HYkey", validKey))
        }
    })

}

async function clipboardKey() {
    let copied = clipboard.readText()
    if (copied){ 
        copied = copied.replace(/\s/g, '')
    }
    if (copied.length !== 36) {
        return false
    }
    return await verifyKey(copied)
    // Set key in config
}

async function openLogPathWindow(){
    ipcRenderer.invoke('setLogPath')
}


function closeModal(){
    const modalPiece = document.getElementsByClassName("modal-part")
    for(const el of modalPiece){
        el.classList.add("hidden")
    }
}

function openModal(){
    console.log("Open")
    const modalPiece = document.getElementsByClassName("modal-part")
    for(const el of modalPiece){
        el.classList.remove("hidden")
    }
}

function setModal(contents){
    console.log("set")
    const modal = document.getElementById("modal")
    modal.innerHTML = contents
}


function logPlayers(){

}

function handleFinals(){

}

function handleBedsBroken(){

}

module.exports = {
    handleLogLine
}