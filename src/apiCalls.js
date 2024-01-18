const HY_API = 'https://api.hypixel.net/v2'
// const HY_HEADER = { 'API-Key': config.get('key', '1') };
const HY_HEADER = { 'api-key': '' };
let HyThrottle = false
let hypixelAPIdown = false
let goodkey = true

const MOJANG_API = 'https://api.mojang.com/users/profiles/minecraft/'



/**
 * Sets the API caller's API Key after first verifying it is valid
 * @param {String} key 
 * @returns The key as a string or undefined if the key is invalid
 */
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


/**
 * Fetches the uuid from mojang's servers and then the api data from hypixel
 * @param {String} ign the player's in-game name
 * @returns {PlayerJSON} an object {name: ign, api: hypixelAPIData, sortingScore: the relative ranking of the player based on stats}
 */
async function fetchPlayer(ign) {
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

    const apiData =  await fetchPlayerHypixelData(mcData.id, mcData.name)

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

/**
 * Fetches the uuid from mojang's servers with the player's name
 * @param {String} ign The player's in-game name
 * @returns an object with the data from the mojang api
 */

async function fetchPlayerMinecraftData(ign) {
    const url = MOJANG_API + ign
    
    const mojangData = await fetch(url)
    if(!mojangData.ok){
        return undefined
    }

    const dataJSON =  await mojangData.json()
    return dataJSON
}

/**
 * Fetches the api data from hypixel's servers with the player's name
 * @param {String} uuid The player user ID - from mojang
 * @param {String} ign The player's in-game name
 * @returns an object with the data from the hypixel api
 */
async function fetchPlayerHypixelData(uuid, ign) {
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



/**
 * Calculates the score to determine the sorting order for the display
 * @param {HypixelAPI} data 
 * @returns an int value for the sorting order
 */
function scoreJSON(data){

    const fkdr = Math.round(data.player.stats.Bedwars.final_kills_bedwars / data.player.stats.Bedwars.final_deaths_bedwars * 100) / 100
    const stars = data.player.achievements.bedwars_level
    return Math.round(stars * Math.pow(fkdr, 2))
}


module.exports = {
    fetchPlayerHypixelData, fetchPlayer, verifyKey
}