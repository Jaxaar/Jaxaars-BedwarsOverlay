const fs = require('fs');
const {readJSONFile, saveJSONFile} = require("./jaxaarHelpers")


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
        console.log(this.data)
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


module.exports = {
    // Config,
    createConfig
}