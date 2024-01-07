const fs = require('fs');
const {clipboard} = require('electron')
const {verifyKey} = require('./apiCalls')


/**
 * Tries to read the file at the location as a JSON
 * @param {String} FilePath a valid file location
 * @returns A JSON from the file or null if the file does not exist
 */
function readJSONFile(FilePath){
    try{
        let rawdata = fs.readFileSync(FilePath);
        let jsonObj = JSON.parse(rawdata);
        return jsonObj
    }
    catch{
        console.log("No valid file")
        return null
    }
}

/**
 * Saves the obj as a JSON and writes it to the file at FilePath
 * @param {String} FilePath a valid file location
 * @param {Object} obj The JSON to be saved to the file
 */
function saveJSONFile(FilePath, obj){
    let data = JSON.stringify(obj);
    fs.writeFileSync(FilePath, data);
    console.log(`${FilePath} File Saved`)
}

// Move to helper and verify afterwards? Or remove function entirely (Put it in the code straight)??

/**
 * Gets the current clipboard value and formats it like a Hypixel API Key, then verifies it with the Hypixel API
 * @returns The API Key or undefined if invalid
 */
async function getKeyFromClipboard() {
    let copied = clipboard.readText()
    if (copied){ 
        copied = copied.replace(/\s/g, '')
    }
    if (copied.length !== 36) {
        return false //TODO: Change to return undefined instead of false, for verifyKey too
    }
    return await verifyKey(copied)
    // Set key in config
}


module.exports = {
    saveJSONFile, readJSONFile, getKeyFromClipboard
}
