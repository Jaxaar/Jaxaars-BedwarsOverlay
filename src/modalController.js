
const {getKeyFromClipboard} = require('./jaxaarHelpers')

let modalQueue = []
let modalActive = false
/**
 * Activates the modal with of the given type, takes an argument which adds that modal to the queue
 * @param {String} modalID modal to add to the queue to be shown
 * @returns false if modalID is not a valid id
 */
function activateModal(modalID=""){
    // console.log("Activate")
    if(modalID !== ""){
        // Possible modal values
        const possibleModalIDs = ["apiKey", "logFile"]
        // console.log(modalID)
        if(!possibleModalIDs.includes(modalID)){
            return false
        }
        modalQueue.push(modalID)
    }

    if(modalQueue.length > 0 && !modalActive){
        const modalVal = modalQueue.splice(0,1)[0]
        if(modalVal == "apiKey"){
            activateAPIKeyModal()
        }
        else if(modalVal == "logFile"){
            activateLogModal()
        }
    }
}

/**
 * Loads, activates and sets listeners for the API Key setting modal
 */
function activateAPIKeyModal(){
    console.log("Activating and Loading API modal...")
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
    openModal()

    document.getElementById("modal-close").addEventListener("click", () =>{ closeModal()})
    document.getElementById('hy-dev-portal').addEventListener("click", ()=> { shell.openExternal('https://developer.hypixel.net/dashboard')})
    document.getElementById('api-key-guide').addEventListener("click", ()=> { shell.openExternal('https://github.com/Chit132/abyss-overlay/wiki/Hypixel-API-Keys-Guide')})
    document.getElementById('modal_api_key').addEventListener("click", async ()=> {
        const validKey = await getKeyFromClipboard() 
        if(!validKey){
            document.getElementById('modal-error').classList.remove("hidden")
         }
         else{
            closeModal()
            config = JSON.parse(await ipcRenderer.invoke('setConfigField', "HYkey", validKey))
        }
    })

}


/**
 * Loads, activates and sets listeners for the Log file setting modal
 */
function activateLogModal(){
    console.log("Activating and Loading Log modal...")
    console.log(document.getElementById("modal"))
    setModal(`
        <p>BARS Overlay requires a log file to operate. Contact Jaxaar if confused.</p>
        <div id="modal-error" class="modal-error hidden">Invalid File</div>
        <button class="open-log-window-button" id="open-log-window-modal-button">Select Log File</button>            
        <button id="modal-close" class="modal-close">Handle Later</button>
    `)
    console.log(document.getElementById("modal"))
    openModal()

    console.log(document.getElementById("modal"))
    document.getElementById("modal-close").addEventListener("click", () =>{ closeModal()})
    document.getElementById('open-log-window-modal-button').addEventListener("click", async ()=> {
        ipcRenderer.invoke('setLogPath')
    })

}

/**
 * Shows the modal by removing the hidden class from the modal and the background shadow
 */
function openModal(){
    // console.log("Open")
    modalActive = true
    const modalPiece = document.getElementsByClassName("modal-part")
    for(const el of modalPiece){
        el.classList.remove("hidden")
    }
}

/**
 * Adds the hidden class from the modal and the background shadow
 * Activates another modal once when this modal is closed 
 */
function closeModal(){
    const modalPiece = document.getElementsByClassName("modal-part")
    for(const el of modalPiece){
        el.classList.add("hidden")
    }
    modalActive = false
    activateModal()

}

/**
 * Sets the modal's interior to contents
 * @param {String} contents is a valid HTML to set inside the modal
 */
function setModal(contents){
    // console.log("set")
    const modal = document.getElementById("modal")
    modal.innerHTML = contents
}

module.exports = {
    activateModal
}