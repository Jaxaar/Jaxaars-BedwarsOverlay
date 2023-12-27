

const HY_API = 'https://api.hypixel.net/v2'
// const HY_HEADER = { 'API-Key': config.get('key', '1') };
const HY_HEADER = { 'api-key': '' };
let HyThrottle = false
let hypixelAPIdown = false
let goodkey = true

const MOJANG_API = 'https://api.mojang.com/users/profiles/minecraft/'


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



    // $.ajax({type: 'GET', async: true, url: `${HY_API}/player?uuid=${uuid}`, headers: HY_HEADER, success: (data) => {
    //     HyThrottle = false; hypixelAPIdown = false; ModalWindow.HyThrottle = false; ModalWindow.APIdown = false;
    //     if (data.success === true && data.player !== null) {
    //         if (data.player.displayname === ign) {
    //             // con.log('got from hypixel: ' + ign)
    //             api = data.player;
    //             api.uuid = uuid; api.guild = guild;
    //             CACHE_STATS.set(ign, api);
    //             appendPlayer(ign, api, options, guild);
    //         }
    //         else{
    //             players.push({name: ign, namehtml: ign, api: null});
    //             updateArray();
    //         }
    //     }
    //     else if (api.player == null){players.push({name: ign, namehtml: ign, api: null}); updateArray();}
    // }, error: (jqXHR) => {
    //     if (jqXHR.status === 0) hypixelAPIdown = true; 
    //     else if (jqXHR.status === 403) goodkey = false;
    //     else if (jqXHR.status === 429) HyThrottle = true;
    //     else {hypixelAPIdown = true; players.push({name: ign, namehtml: ign, api: null})};
    //     updateArray();
    // }});
}


async function verifyKey(key) {
    header = {'api-key': key}

    const url = `${HY_API}/punishmentstats`
    const data   = await fetch(url, {
        method: 'GET',
        headers: header,
    })
    HY_HEADER['api-key'] = header['api-key']

    if (!data.ok) {
        goodkey = false;
    }
    goodkey = true;
    // config['api-key'] = HY_HEADER['api-key']
}
//         if ($apiElement) {
//             $apiElement.val(HY_HEADER['API-Key']);
//             ModalWindow.open({ title: 'API Key Accepted', type: 1, content: "You're good to go!" });
//             $apiElement.css( { 'border-color': '#b9b9b9', 'text-shadow': '0 0 8px white', 'color': 'transparent'} );
//             if (useruuid) initialStats(useruuid);
//         }
//     }, error: (jqXHR) => {
//         if (jqXHR.status === 0) hypixelAPIdown = true;
//         else if (jqXHR.status == 403) {
//             goodkey = false;
//             if ($apiElement) {
//                 $apiElement.val('');
//                 $apiElement.css({ 'border-color': '#8f0000', 'text-shadow': 'none', 'color': 'white' });
//                 if (jqXHR.status !== 0) ModalWindow.open({ title: 'Invalid API Key', content: 'The entered API key is either invalid or it likely expired! Generate a new one on the Hypixel Developer Dashboard website and paste it here.', type: -1 });
//             }
//         }
//         updateArray();
//     }});
// }




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

    const url = MOJANG_API + ign
    
    const mojangData = await fetch(url)
    const dataJSON =  await mojangData.json()
    // console.log("MC Data")
    // console.log(dataJSON)

    if (!goodkey) {
        return {
            name: ign,
            api: null,
            sortingScore: Number.MAX_VALUE
        }
    }

    const apiData =  await fetchPlayerHypixelData(dataJSON.id, dataJSON.name, options)

    return {
        name: ign,
        api: apiData,
        sortingScore: scoreJSON(apiData)
    }

    // $.ajax({type: 'GET', async: true, url: mojang + ign, success: (data, status) => {
    //     if (status === 'success') {
    //         ModalWindow.mojangThrottle = false;
    //         CACHE_UUID.set(data.name, data.id, false);
    //         if (!overlayBackendDown) {
    //             if (backendThrottle) {
    //                 if (config.get('settings.useFallbackKey', true)) fetchPlayer_hypixel(data.id, data.name, options);
    //             }
    //             else fetchPlayer_backend(data.id, data.name, options);
    //         } else {
    //             fetchPlayer_hypixel(data.id, data.name, options);
    //         }
    //     } else {
    //         players.push({name: ign, namehtml: ign, api: null});
    //         updateArray();
    //     }
    // }, error: (jqXHR) => {
    //     if (jqXHR.status === 404) CACHE_STATS.set(ign, null);
    //     else if (jqXHR.status === 429) {
    //         ModalWindow.open({ title: 'Mojang API Ratelimit', type: -1, class: -6,
    //             content: 'You are being ratelimited by Mojang! Try not to look up so many players in such a short amount of time. Your ratelimit will be lifted in around 1 minute.'
    //         });
    //     }
    //     players.push({name: ign, namehtml: ign, api: null});
    //     updateArray();
    //     console.error('error with mojang api GET uuid ' + ign);
    // }});
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