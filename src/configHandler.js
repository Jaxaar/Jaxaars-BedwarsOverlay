const fs = require('fs');





class Config {

    constructor(filePath, obj = {}){
        this.file = filePath
        this.data = readJSONFile(filePath)
        if(this.data == null){
            console.log("reseting config file")
            console.log(this.data)
            this.data = obj
            saveJSONFile(this.file, this.data)
        }    
    }

    set(key, value){
        this.data[key] = this.value
        saveJSONFile(this.file, this.data)
        return value
    }

    get(key, alt = null){
        const val = this.data[key]
        if(val == null){
            return alt
        }
        return val
    }

    save(){
        saveJSONFile(this.file, this.data) 
    }
}

function readJSONFile(fileName){
    try{
        let rawdata = fs.readFileSync(fileName);
        let jsonObj = JSON.parse(rawdata);
        return jsonObj
    }
    catch{
        // console.log("No valid file")
        return null
    }
}

function saveJSONFile(str, obj = {}){
    let data = JSON.stringify(obj);
    fs.writeFileSync(str, data);
    // console.log(`${str} File Saved`)
}

module.exports = {
    Config
}