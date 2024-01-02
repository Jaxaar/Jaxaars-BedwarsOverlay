
const { readJSONFile, saveJSONFile} = require("./jaxaarHelpers")
const fs = require('fs');


function createPlayerRecord(filePath, obj = {}){

    const playerRecord = {}
    playerRecord.file = filePath
    playerRecord.players = readJSONFile(filePath)
    if(playerRecord.players == null){
        console.log("resetting playerRecord file")
        console.log(playerRecord.players)
        playerRecord.players = obj
        saveJSONFile(playerRecord.file, playerRecord.players)
    }  

    playerRecord.set = function (key, value){
        this.players[key] = value
        console.log(this.players)
        return value
    }

    playerRecord.get = function (key, alt = null){
        const val = this.players[key]
        return val ? val : alt
        // return val || alt
    }

    playerRecord.save = function (obj){
        saveJSONFile(obj || this.file, this.players) 
    }
    return playerRecord
}

module.exports = {
    createPlayerRecord
}