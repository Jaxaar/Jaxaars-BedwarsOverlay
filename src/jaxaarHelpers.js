const fs = require('fs');

function readJSONFile(fileName){
    try{
        let rawdata = fs.readFileSync(fileName);
        let jsonObj = JSON.parse(rawdata);
        return jsonObj
    }
    catch{
        console.log("No valid file")
        return null
    }
}

function saveJSONFile(str, obj){
    let data = JSON.stringify(obj);
    fs.writeFileSync(str, data);
    console.log(`${str} File Saved`)
}


module.exports = {
    saveJSONFile, readJSONFile
}
