const fs = require('fs');


function createConfig(filePath, obj = {}){

    const config = {}
    config.file = filePath
    config.data = readJSONFile(filePath)
    if(config.data == null){
        console.log("reseting config file")
        console.log(config.data)
        config.data = obj
        saveJSONFile(config.file, config.data)
    }  

    config.set = function (key, value){
        this.data[key] = value
        saveJSONFile(this.file, this.data)
        return value
    }

    config.get = function (key, alt = null){
        const val = this.data[key]
        return val ? val : alt
        // return val || alt
    }

    config.save = function (){
        saveJSONFile(this.file, this.data) 
    }
    return config
}


// class Config {

//     constructor(filePath, obj = {}){
//         this.file = filePath
//         this.data = readJSONFile(filePath)
//         if(this.data == null){
//             console.log("reseting config file")
//             console.log(this.data)
//             this.data = obj
//             saveJSONFile(this.file, this.data)
//         }    
//     }

//     set = (key, value){
//         this.data[key] = this.value
//         saveJSONFile(this.file, this.data)
//         return value
//     }

//     get(key, alt = null){
//         const val = this.data[key]
//         if(val == null){
//             return alt
//         }
//         return val
//     }

//     save(){
//         saveJSONFile(this.file, this.data) 
//     }
// }

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
    // Config,
    createConfig
}