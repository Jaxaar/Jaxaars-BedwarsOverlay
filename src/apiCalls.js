const HY_API = 'https://api.hypixel.net/v2'
// const HY_HEADER = { 'API-Key': config.get('key', '1') };
const HY_HEADER = { 'api-key': '' };
let HyThrottle = false
let hypixelAPIdown = false
let goodkey = true

const MOJANG_API = 'https://api.mojang.com/users/profiles/minecraft/'






async function verifyKey(key) {
    header = {'api-key': key}

    const url = `${HY_API}/punishmentstats`
    const data   = await fetch(url, {
        method: 'GET',
        headers: header,
    })
    HY_HEADER['api-key'] = header['api-key']

    if (!data.ok) {
        document.dispatchEvent(new Event("badAPIKey"))
        goodkey = false;
        return false
    }
    goodkey = true;
    return key
    // config['api-key'] = HY_HEADER['api-key']
}



async function fetchPlayer(ign, options = {}) {
    // let cached_uuid = CACHE_UUID.get(ign);
    // if (cached_uuid) {
    //     if (!overlayBackendDown) {
    //         if (backendThrottle) {
    //             if (config.get('settings.useFallbackKey', true)) fetchPlayer_hypixel(cached_uuid, ign, options);
    //         }
    //         else fetchPlayer_backend(cached_uuid, ign, options);
    //     } else {
    //         fetchPlayer_hypixel(cached_uuid, ign, options);
    //     }
    //     return;
    // }
    console.log(`Fetching player: ${ign}`);


    const mcData = await fetchPlayerMinecraftData(ign)

    if (!goodkey || !mcData) {
        // if(!goodkey){
        //     document.dispatchEvent(new Event("badAPIKey"))
        // }
        return {
            name: ign,
            api: undefined,
            sortingScore: Number.MAX_VALUE
        }
    }

    const apiData =  await fetchPlayerHypixelData(mcData.id, mcData.name, options)

    if(!apiData.player){
        return {
            name: ign,
            api: undefined,
            sortingScore: Number.MAX_VALUE
        }
    }
    return {
        name: ign,
        api: apiData,
        sortingScore: scoreJSON(apiData)
    }
}

async function fetchPlayerMinecraftData(ign, options) {
    const url = MOJANG_API + ign
    
    const mojangData = await fetch(url)
    if(!mojangData.ok){
        return undefined
    }

    const dataJSON =  await mojangData.json()
    return dataJSON
}


async function fetchPlayerHypixelData(uuid, ign, options) {
    const url = `${HY_API}/player?uuid=${uuid}`
    
    const data  = await fetch(url, {
        method: 'GET',
        headers: HY_HEADER,
    })

    //TODO: Tighten up
    if(!data.ok){
        if (data.status === 0){
            hypixelAPIdown = true; 
        }
        else if (data.status === 403){ 
            goodkey = false;
        }
        else if (data.status === 429){ 
            HyThrottle = true;
        }
        else {
            hypixelAPIdown = true;
            // players.push({name: ign, namehtml: ign, api: null})
        };
    }
    const dataJSON = await data.json()

    // console.log(dataJSON)
    return dataJSON
}




function scoreJSON(data){

    const fkdr = Math.round(data.player.stats.Bedwars.final_kills_bedwars / data.player.stats.Bedwars.final_deaths_bedwars * 100) / 100
    const stars = data.player.achievements.bedwars_level
    return Math.round(stars * Math.pow(fkdr, 2))
}


module.exports = {
    fetchPlayerHypixelData, fetchPlayer, verifyKey
}











/**
 * Validate a response to ensure the HTTP status coe indicates success.
 * 
 * @param {Response} response HTTP Response to be checked
 * @returns {object} object encoded by JSON in the response
 */
function validateJSON(response){
    if(response.ok){
        return response.json()
    } else {
        return Promise.reject(response)
    }
}