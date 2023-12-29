







function createStatsRowElement(playerJSON, colData){
    if(!colData){
        return null
    }
    // return initialHardCoded(playerJSON)

    const rowEl = document.createElement('tr')
    rowEl.id = `${playerJSON.name}-row`
    rowEl.setAttribute("data-score", playerJSON.sortingScore)

    for(col of colData){
        if(col.activated == "false"){
            continue
        }
        if(col.unique == "true"){
            rowEl.append(handleUniqueColumn(playerJSON, col))
            continue
        }

        if(playerJSON.api == undefined){
            const el = document.createElement('td')
            el.innerText = "-"
            el.classList.add("t0color")
            rowEl.append(el)
        
        }
        else if(col.ratio){
            const el = document.createElement('td')
            const val = Math.round(navigateJSONforData(playerJSON, col.ratio.topPath) / navigateJSONforData(playerJSON, col.ratio.botPath) * 100)/100
            el.innerText = val ? val : "-"
            el.classList.add(getColorClass(val, col))
            rowEl.append(el)
        }
        else{
            const el = document.createElement('td')
            const val = navigateJSONforData(playerJSON, col.path)
            el.innerText = val ? val : "-"
            el.classList.add(getColorClass(val, col))
            rowEl.append(el)
        }
    }
    return rowEl
}


function getColorClass(val, col){
    if(!col.colorScale){
        return ""
    }
    let i = 0
    while (val >= col.colorScale[i]){
        i = i + 1
    }
    return `t${i}Color`
}



function handleUniqueColumn(playerJSON, col){
    if(col.tag == "playerName"){
        // avatar = 'https://crafatar.com/avatars/ec561538f3fd461daff5086b22154bce?size=48&default=MHF_Steve&overlay'
        // avatar = `https://crafatar.com/avatars/${players[i].api.uuid}?size=48&default=MHF_Steve&overlay`
        const playerEl = document.createElement('td')
        const playerPortrait = document.createElement('span')
        if(!playerJSON.api){
            playerPortrait.setAttribute("data-avatar",  "nickQuestionMark")
        }
        else{
            playerPortrait.setAttribute("data-avatar", "notNick")
            playerPortrait.style.backgroundImage = `url(https://crafatar.com/avatars/${playerJSON.api.player.uuid}?size=48&default=MHF_Steve&overlay)`
        }


        const playerStars = document.createElement('span')
        playerStars.innerHTML = playerJSON.api ? starColor(playerJSON.api.player.achievements.bedwars_level) : ""
        playerStars.classList.add("starsDisplay")

        const playerName = document.createElement('span')
        playerName.innerHTML =  playerJSON.api ? nameColor(playerJSON.api.player) : playerJSON.name
        playerName.style.overflowX = "hidden"

        playerEl.append(playerPortrait)
        playerEl.append(playerStars)
        playerEl.append(playerName)
        return playerEl
    }
    else if(col.tag == "tag"){
        const tagEl = document.createElement('td')
        tagEl.innerHTML = getTag(playerJSON.api.player)
        return tagEl
    }
    else{
        return "NotHandled"
    }
}



function navigateJSONforData(playerJSON, searchString){

    const steps = searchString.split(".")
    let piece = playerJSON
    for(const step of steps){
        piece = piece[step]
    }
    // console.log(`Piece: ${piece} - searching for ${searchString}`)
    return piece
}




const HypixelColors = {
    "AQUA": "#55FFFF",
    "BLACK": "#000000",
    "BLUE": "#5555FF",
    "DARK_AQUA": "#00AAAA",
    "DARK_BLUE": "#0000AA",
    "DARK_GRAY": "#555555",
    "DARK_GREEN": "#00AA00",
    "DARK_PURPLE": "#AA00AA",
    "DARK_RED": "#AA0000",
    "GOLD": "#FFAA00",
    "GRAY": "#AAAAAA",
    "GREEN": "#55FF55",
    "LIGHT_PURPLE": "#FF55FF",
    "RED": "#FF5555",
    "WHITE": "#FFFFFF",
    "YELLOW": "#FFFF55"
};

function formatStars(level, star, ...colors){
    let span = (color, string) => `<span style="color: ${color}">${string}</span>`;
    let template = ``;
    let levelString = level.toString();

    if (colors.length === levelString.length + 3) {
        let digits = levelString.split('');
        
        template += span(colors[0], "[");
        for (let i = 0; i < digits.length; i++) {
            template += span(colors[i + 1], digits[i]);
        }
        template += span(colors[colors.length - 2], star);
        template += span(colors[colors.length - 1], "]");
    } else {
        template += span(colors.length == 1 ? colors[0] : "#AAAAAA", `[${level}${star}]`);
    }

    return template;
}

function starColor(stars){
    let { AQUA, BLACK, BLUE, DARK_AQUA, DARK_BLUE, DARK_GRAY, DARK_GREEN, DARK_PURPLE, DARK_RED, GOLD, GRAY, GREEN, LIGHT_PURPLE, RED, WHITE, YELLOW } = HypixelColors;

    if (stars < 100) return formatStars(stars, '✫', GRAY);
    else if (stars < 200) return formatStars(stars, '✫', WHITE);
    else if (stars < 300) return formatStars(stars, '✫', GOLD);
    else if (stars < 400) return formatStars(stars, '✫', AQUA);
    else if (stars < 500) return formatStars(stars, '✫', DARK_GREEN);
    else if (stars < 600) return formatStars(stars, '✫', DARK_AQUA);
    else if (stars < 700) return formatStars(stars, '✫', DARK_RED);
    else if (stars < 800) return formatStars(stars, '✫', LIGHT_PURPLE);
    else if (stars < 900) return formatStars(stars, '✫', BLUE);
    else if (stars < 1000) return formatStars(stars, '✫', DARK_PURPLE);
    else if (stars < 1100) return formatStars(stars, '✫', RED, GOLD, YELLOW, GREEN, AQUA, LIGHT_PURPLE, DARK_PURPLE);
    else if (stars < 1200) return formatStars(stars, '✪', GRAY, WHITE, WHITE, WHITE, WHITE, GRAY, GRAY);
    else if (stars < 1300) return formatStars(stars, '✪', GRAY, YELLOW, YELLOW, YELLOW, YELLOW, GOLD, GRAY);
    else if (stars < 1400) return formatStars(stars, '✪', GRAY, AQUA, AQUA, AQUA, AQUA, DARK_AQUA, GRAY);
    else if (stars < 1500) return formatStars(stars, '✪', GRAY, GREEN, GREEN, GREEN, GREEN, DARK_GREEN, GRAY);
    else if (stars < 1600) return formatStars(stars, '✪', GRAY, DARK_AQUA, DARK_AQUA, DARK_AQUA, DARK_AQUA, BLUE, GRAY);
    else if (stars < 1700) return formatStars(stars, '✪', GRAY, RED, RED, RED, RED, DARK_RED, GRAY);
    else if (stars < 1800) return formatStars(stars, '✪', GRAY, LIGHT_PURPLE, LIGHT_PURPLE, LIGHT_PURPLE, LIGHT_PURPLE, DARK_PURPLE, GRAY);
    else if (stars < 1900) return formatStars(stars, '✪', GRAY, BLUE, BLUE, BLUE, BLUE, DARK_BLUE, GRAY);
    else if (stars < 2000) return formatStars(stars, '✪', GRAY, DARK_PURPLE, DARK_PURPLE, DARK_PURPLE, DARK_PURPLE, DARK_GRAY, GRAY);
    else if (stars < 2100) return formatStars(stars, '✪', DARK_GRAY, GRAY, WHITE, WHITE, GRAY, GRAY, DARK_GRAY);
    else if (stars < 2200) return formatStars(stars, '⚝', WHITE, WHITE, YELLOW, YELLOW, GOLD, GOLD, GOLD);
    else if (stars < 2300) return formatStars(stars, '⚝', GOLD, GOLD, WHITE, WHITE, AQUA, DARK_AQUA, DARK_AQUA);
    else if (stars < 2400) return formatStars(stars, '⚝', DARK_PURPLE, DARK_PURPLE, LIGHT_PURPLE, LIGHT_PURPLE, GOLD, YELLOW, YELLOW);
    else if (stars < 2500) return formatStars(stars, '⚝', AQUA, AQUA, WHITE, WHITE, GRAY, GRAY, DARK_GRAY);
    else if (stars < 2600) return formatStars(stars, '⚝', WHITE, WHITE, GREEN, GREEN, DARK_GRAY, DARK_GRAY, DARK_GRAY);
    else if (stars < 2700) return formatStars(stars, '⚝', DARK_RED, DARK_RED, RED, RED, LIGHT_PURPLE, LIGHT_PURPLE, DARK_PURPLE);
    else if (stars < 2800) return formatStars(stars, '⚝', YELLOW, YELLOW, WHITE, WHITE, DARK_GRAY, DARK_GRAY, DARK_GRAY);
    else if (stars < 2900) return formatStars(stars, '⚝', GREEN, GREEN, DARK_GREEN, DARK_GREEN, GOLD, GOLD, YELLOW);
    else if (stars < 3000) return formatStars(stars, '⚝', AQUA, AQUA, DARK_AQUA, DARK_AQUA, BLUE, BLUE, DARK_BLUE);
    else if (stars < 3100) return formatStars(stars, '⚝', YELLOW, YELLOW, GOLD, GOLD, RED, RED, DARK_RED);
    else if (stars < 3200) return formatStars(stars, '✥', BLUE, BLUE, AQUA, AQUA, GOLD, GOLD, YELLOW);
    else if (stars < 3300) return formatStars(stars, '✥', RED, DARK_RED, GRAY, GRAY, DARK_RED, RED, RED);
    else if (stars < 3400) return formatStars(stars, '✥', BLUE, BLUE, BLUE, LIGHT_PURPLE, RED, RED, DARK_RED);
    else if (stars < 3500) return formatStars(stars, '✥', DARK_GREEN, GREEN, LIGHT_PURPLE, LIGHT_PURPLE, DARK_PURPLE, DARK_PURPLE, DARK_GREEN);
    else if (stars < 3600) return formatStars(stars, '✥', RED, RED, DARK_RED, DARK_RED, DARK_GREEN, GREEN, GREEN);
    else if (stars < 3700) return formatStars(stars, '✥', GREEN, GREEN, GREEN, AQUA, BLUE, BLUE, DARK_BLUE);
    else if (stars < 3800) return formatStars(stars, '✥', DARK_RED, DARK_RED, RED, RED, AQUA, DARK_AQUA, DARK_AQUA);
    else if (stars < 3900) return formatStars(stars, '✥', DARK_BLUE, DARK_BLUE, BLUE, DARK_PURPLE, DARK_PURPLE, LIGHT_PURPLE, DARK_BLUE);
    else if (stars < 4000) return formatStars(stars, '✥', RED, RED, GREEN, GREEN, AQUA, BLUE, BLUE);
    else if (stars < 4100) return formatStars(stars, '✥', DARK_PURPLE, DARK_PURPLE, RED, RED, GOLD, GOLD, YELLOW);
    else if (stars < 4200) return formatStars(stars, '✥', YELLOW, YELLOW, GOLD, RED, LIGHT_PURPLE, LIGHT_PURPLE, DARK_PURPLE);
    else if (stars < 4300) return formatStars(stars, '✥', DARK_BLUE, BLUE, DARK_AQUA, AQUA, WHITE, GRAY, GRAY);
    else if (stars < 4400) return formatStars(stars, '✥', BLACK, DARK_PURPLE, DARK_GRAY, DARK_GRAY, DARK_PURPLE, DARK_PURPLE, BLACK);
    else if (stars < 4500) return formatStars(stars, '✥', DARK_GREEN, DARK_GREEN, GREEN, YELLOW, GOLD, DARK_PURPLE, LIGHT_PURPLE);
    else if (stars < 4600) return formatStars(stars, '✥', WHITE, WHITE, AQUA, AQUA, DARK_AQUA, DARK_AQUA, DARK_AQUA);
    else if (stars < 4700) return formatStars(stars, '✥', DARK_AQUA, AQUA, YELLOW, YELLOW, GOLD, LIGHT_PURPLE, DARK_PURPLE);
    else if (stars < 4800) return formatStars(stars, '✥', WHITE, DARK_RED, RED, RED, BLUE, DARK_BLUE, BLUE);
    else if (stars < 4900) return formatStars(stars, '✥', DARK_PURPLE, DARK_PURPLE, RED, GOLD, YELLOW, AQUA, DARK_AQUA);
    else if (stars < 5000) return formatStars(stars, '✥', DARK_GREEN, GREEN, WHITE, WHITE, GREEN, GREEN, DARK_GREEN);
    else return formatStars(stars, '✥', DARK_RED, DARK_RED, DARK_PURPLE, BLUE, BLUE, DARK_BLUE, BLACK);
}

function nameColor(api){
    let rank = api.newPackageRank;
    let plus = api.rankPlusColor;
    if (plus !== undefined){
        plus = HypixelColors[plus];
    }
    else plus = '#FF5555';
    if (api.rank !== undefined){
        if (api.rank === 'YOUTUBER') return `<span style="color: #FF5555;">[</span><span style="color: #FFFFFF;">YT</span><span style="color: #FF5555;">] ${api.displayname}</span>`;
        else if (api.rank === 'ADMIN') return `<span style="color: #AA0000">[ADMIN] ${api.displayname}</span>`;
        else if (api.rank === 'MODERATOR') return `<span style="color: #00AA00">[MOD] ${api.displayname}</span>`;
        else if (api.rank === 'GAME_MASTER') return `<span style="color: #00AA00">[GM] ${api.displayname}</span>`;
    }
    if (rank === 'MVP_PLUS'){
        if (api.monthlyPackageRank === 'NONE' || !api.hasOwnProperty('monthlyPackageRank')) return `<span style="color: #55FFFF;">[MVP</span><span style="color: ${plus}">+</span><span style="color: #55FFFF;">] ${api.displayname}</span>`;
        else return `<span style="color: #FFAA00;">[MVP</span><span style="color: ${plus}">++</span><span style="color: #FFAA00;">] ${api.displayname}</span>`;
    }
    else if (rank === 'MVP') return `<span style="color: #55FFFF;">[MVP] ${api.displayname}</span>`;
    else if (rank === 'VIP_PLUS') return `<span style="color: #55FF55;">[VIP</span><span style="color: #FFAA00;">+</span><span style="color: #55FF55;">] ${api.displayname}</span>`;
    else if (rank === 'VIP') return `<span style="color: #55FF55;">[VIP] ${api.displayname}</span>`;
    else return `<span style="color: #AAAAAA;">${api.displayname}</span>`;
}

function getTag(api, tagslist = []){

    try{
        if (api.inParty) return '<span style="color: #03C800">P</span>';
        else if (api.call) return '<span style="color: #00C2A2">CALL</span>';
        else if (api.partyReq) return '<span style="color: #37B836">PREQ</span>';
        else if (api.friendReq) return '<span style="color: #D6D600">FREQ</span>';
        else if (api.guildList) return '<span style="color: #36C700">GLD</span>';
        else if (api.achievements.bedwars_level < 150 && api.stats.Bedwars.final_deaths_bedwars/api.stats.Bedwars.losses_bedwars < 0.75 && api.stats.Bedwars.final_kills_bedwars/api.stats.Bedwars.final_deaths_bedwars < 1.5) return '<span style="color: #FF5555">SNPR</span>';
        else if ((api.achievements.bedwars_level < 15 && api.stats.Bedwars.final_kills_bedwars/api.stats.Bedwars.final_deaths_bedwars > 5) || (api.achievements.bedwars_level > 15 && api.achievements.bedwars_level < 100 && api.achievements.bedwars_level/(api.stats.Bedwars.final_kills_bedwars/api.stats.Bedwars.final_deaths_bedwars) <= 5)) return '<span style="color: #5555FF">ALT</span>';
        else if (api.channel === 'PARTY') return '<span style="color: #FFB900">PRTY</span>';
        else return '<span style="color: #AAAAAA">-</span>';
    }
    catch{return '<span style="color: #AAAAAA">-</span>';}
}


module.exports = {
    createStatsRowElement
}









// {
//     "name": "Jaxaar",
//     "api": {
//         "success": true,
//         "player": {
//             "_id": "566d6e3bde314c0f04155f52",
//             "uuid": "2589ea184df34ff099613d3a8616168f",
//             "firstLogin": 1450012219000,
//             "playername": "jaxaar",
//             "lastLogin": 1703390672668,
//             "displayname": "Jaxaar",
//             "achievementsOneTime": [
//                 "general_first_join",
//                 "general_use_portal",
//                 "general_first_game",
//                 "tntgames_wizards_first_win",
//                 "truecombat_strategist",
//                 "truecombat_destiny_calls",
//                 "vampirez_vampire_shop",
//                 "vampirez_purchase_sword",
//                 "walls3_find_chest",
//                 "walls3_win_with_living_wither",
//                 "walls3_win_before_deathmatch",
//                 "walls3_advanced_strategies",
//                 "general_first_chat",
//                 "blitz_first_game",
//                 "paintball_no_killstreaks",
//                 "paintball_last_kill",
//                 "paintball_first_kill",
//                 "arcade_dragon_killer",
//                 "skywars_gapple",
//                 "general_youtuber",
//                 "skywars_mob_spawner",
//                 "skywars_now_im_enchanted",
//                 "skywars_gotcha",
//                 "skywars_touch_of_death",
//                 "skywars_shiny_stuff",
//                 "quake_bogof",
//                 "walls3_first_skill_upgrade",
//                 "walls3_first_gathering_skill_upgrade",
//                 "truecombat_redstone_dealer",
//                 "vampirez_purchase_armor",
//                 "quake_my_way",
//                 "quake_first_kill",
//                 "quake_simple_things",
//                 "quake_team_player",
//                 "walls_get_diamond_sword",
//                 "blitz_first_blood",
//                 "walls3_mine_diamond",
//                 "supersmash_botmon_challenge",
//                 "skywars_well_well",
//                 "warlords_first_of_many",
//                 "warlords_medium_rare",
//                 "warlords_legendary",
//                 "warlords_makin_some_room",
//                 "warlords_eagle_eyed",
//                 "warlords_chain_kill",
//                 "warlords_giddy_up",
//                 "warlords_capture_the_win",
//                 "truecombat_cross_fingers",
//                 "quake_good_guy_gamer",
//                 "paintball_combo",
//                 "vampirez_purchase_gold",
//                 "vampirez_purchase_food",
//                 "uhc_shiny_rock",
//                 "warlords_purple_power",
//                 "warlords_juiced_up",
//                 "speeduhc_golden_apple",
//                 "skyclash_my_playstyle",
//                 "skyclash_powerspike",
//                 "tntgames_bow_spleef_first_double_jump",
//                 "speeduhc_melon_smasher",
//                 "supersmash_botmon_vs_spooderman",
//                 "truecombat_lightning_fast",
//                 "skywars_open_chest",
//                 "walls_first_kit",
//                 "walls3_attack_wither",
//                 "copsandcrims_homing_bullets",
//                 "copsandcrims_samurai_warrior",
//                 "copsandcrims_late_to_the_party",
//                 "copsandcrims_hunting_season",
//                 "copsandcrims_flawless",
//                 "quake_perfection",
//                 "uhc_crafting_revolution",
//                 "general_first_friend",
//                 "skyclash_no_alchemy",
//                 "gingerbread_new_style",
//                 "gingerbread_taste_my_banana",
//                 "gingerbread_getting_good",
//                 "gingerbread_get_hit_by_me",
//                 "bedwars_team_player",
//                 "bedwars_strategist",
//                 "skywars_peacemaker",
//                 "tntgames_wizards_lead",
//                 "tntgames_wizards_leaderboard",
//                 "skywars_legendary",
//                 "bedwars_builder",
//                 "bedwars_geared_up",
//                 "bedwars_diamond_hoarder",
//                 "murdermystery_be_the_hero",
//                 "murdermystery_kill_murderer_after_kill",
//                 "murdermystery_pickup_gold",
//                 "murdermystery_sword_kill_long_range",
//                 "bedwars_first",
//                 "general_a_long_journey_begins",
//                 "bridge_on_fire",
//                 "bridge_hat_trick",
//                 "bridge_ninja",
//                 "bridge_carried",
//                 "bridge_heart_hoarder",
//                 "bridge_community_oriented",
//                 "bridge_got_ya",
//                 "duels_on_fire",
//                 "duels_community_oriented",
//                 "duels_ninja",
//                 "duels_carried",
//                 "duels_hat_trick",
//                 "duels_got_ya",
//                 "duels_heart_hoarder",
//                 "duels_untouchable",
//                 "skywars_max_perk",
//                 "arcade_zombies_feels_good",
//                 "arcade_zombies_ultimate",
//                 "general_first_party",
//                 "bedwars_its_dark_down_there",
//                 "tntgames_wizards_jumper",
//                 "skyblock_lost_soul",
//                 "skyblock_quest_complete",
//                 "skyblock_production_expanded",
//                 "skyblock_your_adventure_begins",
//                 "skyblock_into_the_deep",
//                 "bedwars_shear_luck",
//                 "skyblock_your_big_break",
//                 "bedwars_buggy_beds",
//                 "bedwars_emerald_hoarder",
//                 "halloween2017_tricked",
//                 "bedwars_ultimate_defense",
//                 "bedwars_minefield",
//                 "bedwars_super_looter",
//                 "bedwars_thats_a_first",
//                 "bedwars_bed_trap",
//                 "bedwars_survivor",
//                 "bedwars_revenge",
//                 "halloween2017_fear_the_pumpkinator",
//                 "bedwars_distraction",
//                 "bedwars_first_blood",
//                 "bedwars_the_last_of_us",
//                 "bedwars_merciless",
//                 "bedwars_mission_control",
//                 "bedwars_out_of_stock",
//                 "bedwars_dont_need_bed",
//                 "bedwars_destroy_beds",
//                 "bedwars_already_over",
//                 "bedwars_getting_the_job_done_better",
//                 "duels_speed_duel",
//                 "arcade_ctw_comeback",
//                 "arcade_ctw_no_need",
//                 "duels_trial_by_combat",
//                 "bedwars_katniss_everdeen_style",
//                 "buildbattle_every_second_counts",
//                 "buildbattle_stenographer",
//                 "buildbattle_artist",
//                 "buildbattle_braniac",
//                 "bedwars_slayer",
//                 "bedwars_you_cant_do_that",
//                 "bedwars_alchemist",
//                 "bedwars_rejoining_the_dream",
//                 "buildbattle_professional_builder",
//                 "walls_revenge",
//                 "walls_robin_hood",
//                 "vampirez_upgraded",
//                 "duels_one_v_one_me",
//                 "bedwars_iron_punch",
//                 "bedwars_stay_away_from_me",
//                 "bedwars_fireballs",
//                 "bedwars_pickaxe_challenge",
//                 "arcade_creeper_attack_waves",
//                 "housing_join_youtube",
//                 "bedwars_cutting_it_close",
//                 "bedwars_sneaky_rusher",
//                 "bedwars_savvy_shopper",
//                 "arcade_ctw_hey_there",
//                 "duels_rematch",
//                 "arcade_pig_fishing_super_bacon",
//                 "arcade_professional_mower",
//                 "murdermystery_shoot_thrown_knife",
//                 "bedwars_ninja",
//                 "murdermystery_last_survivor",
//                 "murdermystery_soldiers_eliminated",
//                 "murdermystery_win_murderer_fell_in_trap",
//                 "murdermystery_five_curses",
//                 "halloween2017_spooky_chest",
//                 "arcade_woops_didnt_mean_to",
//                 "christmas2017_friendly_fire",
//                 "halloween2017_spooky_looks",
//                 "halloween2017_pumpkin_death",
//                 "christmas2017_legendary",
//                 "christmas2017_big_bag_o_gifts",
//                 "quake_think_fast",
//                 "christmas2017_hunt_begins_2021",
//                 "quake_fly",
//                 "quake_not_today",
//                 "quake_doubling_up",
//                 "quake_one_shot",
//                 "quake_how_did_that_happen",
//                 "quake_billy_talent",
//                 "quake_untouchable",
//                 "quake_heart_stopper",
//                 "quake_humiliation",
//                 "christmas2017_holidays_ruined",
//                 "christmas2017_holiday_miracle",
//                 "murdermystery_top_zombie",
//                 "christmas2017_christmas_quest",
//                 "buildbattle_ooo_shiny",
//                 "murdermystery_uncalculated",
//                 "arcade_avalance_waves",
//                 "arcade_party_in_sync",
//                 "general_vip",
//                 "woolgames_its_dark_down_there",
//                 "woolgames_keystone",
//                 "woolgames_survivor",
//                 "woolgames_top_killer",
//                 "arcade_hypixel_says_tnt_dodger",
//                 "arcade_football_potm",
//                 "arcade_bounty_hunter_target_killer",
//                 "halloween2017_haunted_maps",
//                 "christmas2017_hunt_begins_2022",
//                 "easter_bw_jump_boost",
//                 "easter_midspring_nights_dream",
//                 "easter_you_didnt_see_that_coming",
//                 "easter_pep_in_your_step",
//                 "bedwars_sniper",
//                 "bedwars_golem",
//                 "easter_easter_egg",
//                 "easter_first_egg_2023",
//                 "bedwars_bomber",
//                 "housing_join_guild",
//                 "summer_punch_out",
//                 "summer_lightning_rod",
//                 "murdermystery_disinfectant",
//                 "arcade_party_parkour",
//                 "duels_my_preference",
//                 "bedwars_slumber_your_journey_starts_here",
//                 "bedwars_slumber_you_did_it",
//                 "christmas2017_hunt_begins_2023",
//                 "bedwars_slumber_forged_in_fire",
//                 "bedwars_slumber_hotel_regular",
//                 "bedwars_slumber_millionaires_club",
//                 "bedwars_slumber_hotel_vip",
//                 "bedwars_slumber_sold_the_dreamscape",
//                 "general_creeperbook"
//             ],
//             "achievements": {
//                 "skywars_wins_solo": 20,
//                 "skywars_kills_solo": 156,
//                 "skywars_kills_team": 41,
//                 "skywars_cages": 10,
//                 "skywars_kits_solo": 7,
//                 "skywars_wins_team": 1,
//                 "skywars_kits_team": 7,
//                 "warlords_mage_level": 14,
//                 "warlords_shaman_level": 0,
//                 "warlords_warrior_level": 0,
//                 "warlords_paladin_level": 0,
//                 "tntgames_wizards_wins": 12,
//                 "general_wins": 1038,
//                 "truecombat_kit_hoarder_solo": 0,
//                 "truecombat_kit_hoarder_team": 0,
//                 "paintball_wins": 11,
//                 "paintball_kills": 214,
//                 "paintball_coins": 6841,
//                 "general_coins": 91992,
//                 "vampirez_coins": 3610,
//                 "vampirez_kill_vampires": 18,
//                 "walls3_coins": 1039,
//                 "walls3_guardian": 20,
//                 "walls3_wins": 1,
//                 "uhc_moving_up": 0,
//                 "uhc_hunter": 0,
//                 "uhc_champion": 0,
//                 "warlords_coins": 10606,
//                 "warlords_assist": 170,
//                 "walls_coins": 1184,
//                 "quake_wins": 21,
//                 "quake_kills": 1430,
//                 "quake_killing_sprees": 52,
//                 "vampirez_kill_survivors": 12,
//                 "blitz_kills": 7,
//                 "blitz_coins": 405,
//                 "arena_gotta_wear_em_all": 0,
//                 "arena_bossed": 0,
//                 "arena_climb_the_ranks": 2000,
//                 "arena_gladiator": 0,
//                 "walls_kills": 10,
//                 "uhc_bounty": 2095,
//                 "supersmash_hero_slayer": 21,
//                 "supersmash_smash_winner": 2,
//                 "walls3_kills": 3,
//                 "skywars_wins_mega": 1,
//                 "skywars_kills_mega": 16,
//                 "skywars_kits_mega": 0,
//                 "warlords_kills": 69,
//                 "warlords_ctf_wins": 7,
//                 "warlords_repair_weapons": 84,
//                 "warlords_tdm_wins": 1,
//                 "truecombat_solo_killer": 1,
//                 "warlords_dom_wins": 2,
//                 "general_quest_master": 731,
//                 "speeduhc_hunter": 2,
//                 "general_challenger": 1044,
//                 "speeduhc_uhc_master": 1,
//                 "skyclash_cards_unlocked": 16,
//                 "skyclash_packs_opened": 5,
//                 "supersmash_smash_champion": 3,
//                 "skyclash_wins": 6,
//                 "skyclash_kills": 7,
//                 "walls3_rusher": 208,
//                 "copsandcrims_bomb_specialist": 0,
//                 "copsandcrims_serial_killer": 27,
//                 "copsandcrims_hero_terrorist": 5,
//                 "copsandcrims_cac_banker": 390,
//                 "skyclash_treasure_hunter": 1,
//                 "arcade_team_work": 40,
//                 "arcade_zombie_killer": 150,
//                 "arcade_football_pro": 33,
//                 "arcade_arcade_winner": 18,
//                 "arcade_bounty_hunter": 21,
//                 "arcade_miniwalls_winner": 2,
//                 "arcade_arcade_banker": 39948,
//                 "quake_coins": 27150,
//                 "quake_headshots": 212,
//                 "tntgames_bow_spleef_wins": 0,
//                 "tntgames_tnt_tag_wins": 0,
//                 "tntgames_pvp_run_killer": 0,
//                 "tntgames_pvp_run_wins": 0,
//                 "tntgames_tnt_run_wins": 0,
//                 "tntgames_tnt_wizards_kills": 116,
//                 "vampirez_zombie_killer": 171,
//                 "bedwars_level": 349,
//                 "bedwars_loot_box": 369,
//                 "bedwars_wins": 1905,
//                 "tntgames_tnt_wizards_caps": 6,
//                 "tntgames_tnt_triathlon": 31,
//                 "tntgames_tnt_banker": 1162,
//                 "bedwars_beds": 1376,
//                 "murdermystery_wins_as_survivor": 11,
//                 "bridge_goals": 22,
//                 "bridge_four_teams_wins": 4,
//                 "bridge_wins": 4,
//                 "bridge_unique_map_wins": 4,
//                 "bridge_win_streak": 2,
//                 "duels_unique_map_wins": 3,
//                 "duels_bridge_win_streak": 1,
//                 "duels_goals": 23,
//                 "duels_bridge_wins": 6,
//                 "duels_bridge_four_teams_wins": 4,
//                 "duels_duels_winner": 7,
//                 "duels_duels_win_streak": 2,
//                 "duels_bridge_duels_wins": 2,
//                 "duels_duels_traveller": 4,
//                 "arcade_zombies_round_progression": 17,
//                 "bedwars_bedwars_killer": 6287,
//                 "duels_bridge_teams_wins": 0,
//                 "skywars_wins_lab": 2,
//                 "skyblock_combat": 6,
//                 "skyblock_excavator": 11,
//                 "skyblock_gatherer": 4,
//                 "skyblock_harvester": 4,
//                 "skyblock_augmentation": 1,
//                 "skyblock_treasury": 27,
//                 "skyblock_minion_lover": 28,
//                 "buildbattle_build_battle_voter": 155,
//                 "buildbattle_build_battle_points": 87,
//                 "buildbattle_build_battle_score": 420,
//                 "halloween2017_pumpkinator": 1724,
//                 "murdermystery_hoarder": 706,
//                 "arcade_zombies_high_round": 17,
//                 "arcade_zombies_nice_shot": 98,
//                 "arcade_ctw_oh_sheep": 1,
//                 "arcade_ctw_slayer": 70,
//                 "bedwars_collectors_edition": 8331,
//                 "christmas2017_present_collector": 3583,
//                 "skywars_you_re_a_star": 5,
//                 "pit_gold": 141,
//                 "pit_kills": 6,
//                 "buildbattle_guess_the_build_guesses": 49,
//                 "buildbattle_guess_the_build_winner": 1,
//                 "walls_wins": 1,
//                 "gingerbread_banker": 1774,
//                 "gingerbread_mystery": 105,
//                 "gingerbread_racer": 6,
//                 "gingerbread_winner": 2,
//                 "paintball_kill_streaks": 13,
//                 "easter_throw_eggs": 90,
//                 "summer_shopaholic": 62716,
//                 "warlords_ctf_objective": 5,
//                 "murdermystery_brainiac": 68,
//                 "murdermystery_survival_skills": 64,
//                 "murdermystery_countermeasures": 8,
//                 "murdermystery_hitman": 61,
//                 "skywars_heads": 1,
//                 "bedwars_bedwars_challenger": 24,
//                 "christmas2017_advent_2021": 11,
//                 "murdermystery_kills_as_murderer": 11,
//                 "murdermystery_wins_as_murderer": 1,
//                 "arcade_party_super_star": 43,
//                 "arcade_dw_slayer": 44,
//                 "arcade_galaxy_wars_kills": 203,
//                 "arcade_throw_out_kills": 2,
//                 "woolgames_wool_kills": 19,
//                 "woolgames_wool_contest": 223,
//                 "woolgames_wool_wins": 14,
//                 "arcade_pixel_party_color_coordinated": 1,
//                 "christmas2017_advent_2022": 12,
//                 "tntgames_clinic": 3,
//                 "skyblock_sb_levels": 4,
//                 "skyblock_concoctor": 3,
//                 "christmas2017_advent_2023": 21,
//                 "bedwars_slumber_ticket_master": 10782,
//                 "christmas2017_no_christmas": 1141,
//                 "christmas2017_best_presents": 0
//             },
//             "stats": {
//                 "SkyWars": {
//                     "packages": [
//                         "legacyachievement",
//                         "legacyachievement3",
//                         "cage_nether-cage",
//                         "cage_void-cage",
//                         "kit_attacking_team_scout",
//                         "cage_cloud-cage",
//                         "cage_sky-cage",
//                         "kit_advanced_solo_hunter",
//                         "cage_orange-cage",
//                         "cage_farm-hunt-cage",
//                         "kit_supporting_team_healer",
//                         "kit_attacking_team_knight",
//                         "cage_toffee-cage",
//                         "kit_basic_solo_ecologist",
//                         "cage_bubblegum-cage",
//                         "cage_mist-cage",
//                         "kit_supporting_team_armorsmith",
//                         "cage_lime-cage",
//                         "kit_basic_solo_armorsmith",
//                         "legacyachievement4",
//                         "fix_achievements2",
//                         "kit_basic_solo_troll",
//                         "kit_supporting_team_troll",
//                         "update_solo_team_kits2",
//                         "kit_attacking_team_hunter",
//                         "update_solo_team_perk_levels",
//                         "convertedstatstoexp",
//                         "update_solo_team_kits_and_perks",
//                         "kit_advanced_solo_knight",
//                         "kit_basic_solo_healer",
//                         "kit_basic_solo_scout",
//                         "kit_supporting_team_ecologist",
//                         "update_opals_prestige",
//                         "update_shard_removal",
//                         "angels_descent_tree_2022",
//                         "update_shard_removal_bedrock",
//                         "victorydance_snow_bomber",
//                         "killeffect_frozen_in_time",
//                         "victorydance_winter_twister",
//                         "killeffect_crackling_ice",
//                         "killeffect_blood_bats",
//                         "projectiletrail_howling_wind",
//                         "killeffect_skeletalremains",
//                         "killeffect_after_life",
//                         "projectiletrail_spiders_silk",
//                         "projectiletrail_cursedflame",
//                         "projectiletrail_wisp_whirlwind",
//                         "victorydance_graveyardrave"
//                     ],
//                     "activeKit_TEAM": "kit_attacking_team_scout",
//                     "win_streak": 0,
//                     "losses_kit_mining_team_default": 5,
//                     "games_team": 6,
//                     "blocks_broken": 840,
//                     "losses_team_normal": 16,
//                     "losses": 327,
//                     "survived_players_kit_mining_team_default": 43,
//                     "survived_players_team": 651,
//                     "losses_team": 59,
//                     "deaths_team_normal": 16,
//                     "survived_players": 3287,
//                     "games": 70,
//                     "deaths_team": 60,
//                     "deaths_kit_mining_team_default": 5,
//                     "games_kit_mining_team_default": 1,
//                     "deaths": 329,
//                     "quits": 284,
//                     "survived_players_solo": 1307,
//                     "losses_solo": 209,
//                     "deaths_solo_normal": 46,
//                     "survived_players_kit_basic_solo_default": 277,
//                     "losses_kit_basic_solo_default": 40,
//                     "deaths_kit_basic_solo_default": 40,
//                     "losses_solo_normal": 46,
//                     "deaths_solo": 209,
//                     "blocks_placed": 4123,
//                     "games_solo": 56,
//                     "coins": 49414,
//                     "kills_solo_normal": 37,
//                     "kills": 224,
//                     "kills_kit_basic_solo_default": 36,
//                     "wins_solo_normal": 5,
//                     "souls_gathered": 241,
//                     "wins": 26,
//                     "wins_kit_basic_solo_default": 7,
//                     "wins_solo": 20,
//                     "souls": 37,
//                     "kills_solo": 156,
//                     "games_kit_basic_solo_default": 12,
//                     "soul_well": 67,
//                     "usedSoulWell": true,
//                     "arrows_hit": 376,
//                     "items_enchanted": 77,
//                     "arrows_shot": 835,
//                     "activeKit_MEGA": "kit_mega_mega_default",
//                     "egg_thrown": 129,
//                     "deaths_solo_insane": 163,
//                     "losses_solo_insane": 163,
//                     "kills_solo_insane": 119,
//                     "activeKit_SOLO": "kit_basic_solo_scout",
//                     "losses_mega_normal": 28,
//                     "deaths_mega": 29,
//                     "deaths_kit_mega_mega_default": 29,
//                     "survived_players_kit_mega_mega_default": 1293,
//                     "deaths_mega_normal": 29,
//                     "losses_kit_mega_mega_default": 28,
//                     "survived_players_mega": 1293,
//                     "losses_mega": 28,
//                     "enderpearls_thrown": 35,
//                     "kills_team_normal": 7,
//                     "kills_team": 41,
//                     "kills_kit_mining_team_default": 3,
//                     "deaths_team_insane": 44,
//                     "kills_team_insane": 34,
//                     "losses_team_insane": 43,
//                     "solo_mining_expertise": 0,
//                     "wins_solo_insane": 15,
//                     "refill_chest_destroy": 1,
//                     "activeCage": "cage_cloud-cage",
//                     "soul_well_rares": 10,
//                     "paid_souls": 425,
//                     "survived_players_kit_attacking_team_scout": 531,
//                     "losses_kit_attacking_team_scout": 54,
//                     "deaths_kit_attacking_team_scout": 55,
//                     "assists_team": 5,
//                     "assists": 24,
//                     "assists_kit_attacking_team_scout": 3,
//                     "kills_kit_attacking_team_scout": 33,
//                     "games_kit_attacking_team_scout": 10,
//                     "assists_kit_basic_solo_default": 1,
//                     "assists_solo": 11,
//                     "kills_monthly_b": 150,
//                     "survived_players_kit_advanced_solo_hunter": 980,
//                     "deaths_kit_advanced_solo_hunter": 151,
//                     "losses_kit_advanced_solo_hunter": 151,
//                     "assists_kit_advanced_solo_hunter": 10,
//                     "kills_kit_advanced_solo_hunter": 116,
//                     "games_kit_advanced_solo_hunter": 35,
//                     "kills_weekly_b": 109,
//                     "mega_ender_mastery": 0,
//                     "extra_wheels": 4,
//                     "games_mega": 1,
//                     "kills_kit_mega_mega_default": 16,
//                     "kills_mega": 16,
//                     "games_kit_mega_mega_default": 1,
//                     "kills_mega_normal": 16,
//                     "wins_mega_normal": 1,
//                     "wins_kit_mega_mega_default": 1,
//                     "wins_mega": 1,
//                     "kills_weekly_a": 102,
//                     "team_instant_smelting": 0,
//                     "wins_kit_advanced_solo_hunter": 13,
//                     "team_resistance_boost": 0,
//                     "mega_mining_expertise": 0,
//                     "soul_well_legendaries": 3,
//                     "survived_players_kit_attacking_team_knight": 34,
//                     "deaths_kit_attacking_team_knight": 2,
//                     "losses_kit_attacking_team_knight": 2,
//                     "losses_kit_basic_solo_ecologist": 1,
//                     "survived_players_kit_basic_solo_ecologist": 3,
//                     "deaths_kit_basic_solo_ecologist": 1,
//                     "assists_kit_basic_solo_ecologist": 1,
//                     "solo_arrow_recovery": 0,
//                     "assists_mega": 4,
//                     "assists_kit_mega_mega_default": 4,
//                     "wins_kit_attacking_team_scout": 1,
//                     "wins_team_insane": 1,
//                     "wins_team": 1,
//                     "solo_instant_smelting": 0,
//                     "xezbeth_luck": 2,
//                     "team_ender_mastery": 0,
//                     "deaths_kit_basic_solo_armorsmith": 1,
//                     "losses_kit_basic_solo_armorsmith": 1,
//                     "survived_players_kit_basic_solo_armorsmith": 3,
//                     "kills_monthly_a": 68,
//                     "activeKit_RANKED": "kit_ranked_ranked_default",
//                     "highestKillstreak": 2,
//                     "killstreak": 3,
//                     "deaths_kit_ranked_ranked_default": 31,
//                     "losses_ranked": 31,
//                     "deaths_ranked_normal": 31,
//                     "losses_kit_ranked_ranked_default": 31,
//                     "losses_ranked_normal": 31,
//                     "deaths_ranked": 31,
//                     "survived_players_kit_ranked_ranked_default": 36,
//                     "survived_players_ranked": 36,
//                     "assists_ranked": 4,
//                     "games_ranked": 7,
//                     "wins_ranked_normal": 4,
//                     "kills_kit_ranked_ranked_default": 11,
//                     "kills_ranked_normal": 11,
//                     "killstreak_ranked": 6,
//                     "games_kit_ranked_ranked_default": 7,
//                     "kills_ranked": 11,
//                     "killstreak_kit_ranked_ranked_default": 6,
//                     "assists_kit_ranked_ranked_default": 4,
//                     "wins_kit_ranked_ranked_default": 4,
//                     "wins_ranked": 4,
//                     "longest_bow_shot_team": 33,
//                     "longest_bow_shot": 25,
//                     "longest_bow_shot_kit_attacking_team_scout": 33,
//                     "arrows_shot_team": 41,
//                     "chests_opened_kit_attacking_team_scout": 31,
//                     "melee_kills_team": 5,
//                     "arrows_shot_kit_attacking_team_scout": 46,
//                     "chests_opened": 138,
//                     "melee_kills": 16,
//                     "melee_kills_kit_attacking_team_scout": 1,
//                     "arrows_hit_team": 17,
//                     "time_played_kit_attacking_team_scout": 653,
//                     "most_kills_game_team": 2,
//                     "chests_opened_team": 22,
//                     "time_played_team": 932,
//                     "arrows_hit_kit_attacking_team_scout": 16,
//                     "time_played": 4418,
//                     "most_kills_game": 1,
//                     "most_kills_game_kit_attacking_team_scout": 1,
//                     "time_played_kit_advanced_solo_hunter": 1709,
//                     "chests_opened_solo": 86,
//                     "chests_opened_kit_advanced_solo_hunter": 39,
//                     "time_played_solo": 2448,
//                     "longest_bow_shot_solo": 25,
//                     "longest_bow_shot_kit_advanced_solo_hunter": 37,
//                     "arrows_hit_kit_advanced_solo_hunter": 47,
//                     "arrows_hit_solo": 53,
//                     "arrows_shot_kit_advanced_solo_hunter": 111,
//                     "arrows_shot_solo": 146,
//                     "void_kills_kit_advanced_solo_hunter": 7,
//                     "void_kills": 11,
//                     "most_kills_game_solo": 1,
//                     "most_kills_game_kit_advanced_solo_hunter": 3,
//                     "void_kills_solo": 9,
//                     "fastest_win": 186,
//                     "fastest_win_kit_advanced_solo_hunter": 186,
//                     "fastest_win_solo": 186,
//                     "melee_kills_solo": 8,
//                     "melee_kills_kit_advanced_solo_hunter": 7,
//                     "killstreak_solo": 5,
//                     "killstreak_kit_advanced_solo_hunter": 5,
//                     "time_played_ranked": 367,
//                     "time_played_kit_ranked_ranked_default": 367,
//                     "longest_bow_shot_kit_ranked_ranked_default": 5,
//                     "longest_bow_shot_ranked": 5,
//                     "chests_opened_ranked": 22,
//                     "arrows_hit_ranked": 2,
//                     "chests_opened_kit_ranked_ranked_default": 22,
//                     "arrows_shot_kit_ranked_ranked_default": 3,
//                     "arrows_hit_kit_ranked_ranked_default": 2,
//                     "arrows_shot_ranked": 3,
//                     "chests_opened_mega": 8,
//                     "most_kills_game_mega": 3,
//                     "most_kills_game_kit_mega_mega_default": 3,
//                     "void_kills_mega": 1,
//                     "time_played_kit_mega_mega_default": 671,
//                     "chests_opened_kit_mega_mega_default": 8,
//                     "time_played_mega": 671,
//                     "void_kills_kit_mega_mega_default": 1,
//                     "games_played_skywars": 105,
//                     "lastMode": "SOLO",
//                     "time_played_kit_attacking_team_knight": 130,
//                     "chests_opened_kit_attacking_team_knight": 2,
//                     "mega_instant_smelting": 0,
//                     "solo_knowledge": 0,
//                     "team_savior": 0,
//                     "longest_bow_shot_kit_mega_mega_default": 29,
//                     "longest_bow_shot_mega": 29,
//                     "melee_kills_mega": 3,
//                     "melee_kills_kit_mega_mega_default": 3,
//                     "arrows_shot_mega": 14,
//                     "arrows_hit_mega": 7,
//                     "arrows_hit_kit_mega_mega_default": 7,
//                     "arrows_shot_kit_mega_mega_default": 14,
//                     "activeKit_TEAMS": "kit_attacking_team_hunter",
//                     "tnt_madness_explained": 8,
//                     "tnt_madness_explained_last": 1561063199436,
//                     "win_streak_lab": 0,
//                     "survived_players_lab_solo": 445,
//                     "chests_opened_lab_solo": 222,
//                     "chests_opened_lab_kit_advanced_solo_hunter": 196,
//                     "deaths_lab": 57,
//                     "deaths_lab_solo": 57,
//                     "time_played_lab_solo": 6698,
//                     "blocks_broken_lab": 217,
//                     "deaths_lab_kit_advanced_solo_hunter": 51,
//                     "time_played_lab": 6698,
//                     "losses_lab_kit_advanced_solo_hunter": 51,
//                     "survived_players_lab": 445,
//                     "coins_gained_lab": 8345,
//                     "losses_lab_solo": 57,
//                     "chests_opened_lab": 222,
//                     "losses_lab": 57,
//                     "survived_players_lab_kit_advanced_solo_hunter": 409,
//                     "time_played_lab_kit_advanced_solo_hunter": 6243,
//                     "blocks_placed_lab": 255,
//                     "quits_lab": 48,
//                     "arrows_shot_lab_solo": 20,
//                     "arrows_shot_lab_kit_advanced_solo_hunter": 16,
//                     "arrows_shot_lab": 20,
//                     "longest_bow_shot_lab": 22,
//                     "fastest_win_lab_solo": 140,
//                     "fastest_win_lab_kit_advanced_solo_hunter": 138,
//                     "fastest_win_lab": 140,
//                     "longest_bow_shot_lab_kit_advanced_solo_hunter": 22,
//                     "longest_bow_shot_lab_solo": 22,
//                     "wins_lab": 8,
//                     "killstreak_lab": 13,
//                     "souls_gathered_lab": 59,
//                     "games_lab": 17,
//                     "arrows_hit_lab_kit_advanced_solo_hunter": 7,
//                     "kills_lab": 41,
//                     "games_lab_solo": 17,
//                     "melee_kills_lab_kit_advanced_solo_hunter": 13,
//                     "melee_kills_lab_solo": 13,
//                     "kills_lab_kit_advanced_solo_hunter": 39,
//                     "kills_lab_solo": 41,
//                     "killstreak_lab_kit_advanced_solo_hunter": 11,
//                     "items_enchanted_lab": 30,
//                     "killstreak_lab_solo": 13,
//                     "games_lab_kit_advanced_solo_hunter": 15,
//                     "wins_lab_kit_advanced_solo_hunter": 6,
//                     "wins_lab_solo": 8,
//                     "melee_kills_lab": 13,
//                     "arrows_hit_lab": 7,
//                     "arrows_hit_lab_solo": 7,
//                     "souls_lab": 49,
//                     "blizzard_explained": 9,
//                     "blizzard_explained_last": 1501981525660,
//                     "floor_is_lava_explained": 1,
//                     "floor_is_lava_explained_last": 1501955593220,
//                     "void_kills_lab": 22,
//                     "void_kills_lab_kit_advanced_solo_hunter": 20,
//                     "void_kills_lab_solo": 22,
//                     "rush_explained": 14,
//                     "rush_explained_last": 1501980288189,
//                     "enderpearls_thrown_lab": 77,
//                     "kill_by_color_explained": 4,
//                     "kill_by_color_explained_last": 1501981003227,
//                     "assists_lab_solo": 1,
//                     "assists_lab_kit_advanced_solo_hunter": 1,
//                     "assists_lab": 1,
//                     "mob_kills_lab_solo": 2,
//                     "mob_kills_lab_kit_advanced_solo_hunter": 2,
//                     "mob_kills_lab": 2,
//                     "egg_thrown_lab": 10,
//                     "team_knowledge": 0,
//                     "solo_lucky_charm": 0,
//                     "mega_bridger": 0,
//                     "kit_basic_solo_troll_inventory": {
//                         "WEB:0": "6",
//                         "LEATHER_CHESTPLATE:0": "38",
//                         "FIREWORK:0": "7",
//                         "LEATHER_LEGGINGS:0": "37",
//                         "LEATHER_BOOTS:0": "36",
//                         "LEATHER_HELMET:0": "39"
//                     },
//                     "slime_explained": 2,
//                     "slime_explained_last": 1505081876748,
//                     "solo_resistance_boost": 0,
//                     "team_mining_expertise": 0,
//                     "team_lucky_charm": 0,
//                     "levelFormatted": "§f5⋆",
//                     "team_arrow_recovery": 0,
//                     "skywars_experience": 493,
//                     "skywars_chests": 1,
//                     "solo_ender_mastery": 0,
//                     "activeKit_TEAMS_random": false,
//                     "fastest_win_lab_kit_attacking_team_knight": 140,
//                     "most_kills_game_lab_solo": 1,
//                     "most_kills_game_lab_kit_attacking_team_knight": 1,
//                     "most_kills_game_lab": 1,
//                     "killstreak_lab_kit_attacking_team_knight": 2,
//                     "deaths_lab_kit_attacking_team_knight": 6,
//                     "games_lab_kit_attacking_team_knight": 2,
//                     "survived_players_lab_kit_attacking_team_knight": 36,
//                     "lab_win_tnt_madness_lab_kit_attacking_team_knight": 2,
//                     "losses_lab_kit_attacking_team_knight": 6,
//                     "arrows_shot_lab_kit_attacking_team_knight": 4,
//                     "time_played_lab_kit_attacking_team_knight": 455,
//                     "lab_win_tnt_madness_lab_solo": 2,
//                     "void_kills_lab_kit_attacking_team_knight": 2,
//                     "wins_lab_kit_attacking_team_knight": 2,
//                     "lab_win_tnt_madness_lab": 2,
//                     "kills_lab_kit_attacking_team_knight": 2,
//                     "chests_opened_lab_kit_attacking_team_knight": 26,
//                     "activeKit_SOLO_random": false,
//                     "void_kills_team": 1,
//                     "chests_opened_kit_basic_solo_scout": 14,
//                     "deaths_kit_basic_solo_scout": 6,
//                     "losses_kit_basic_solo_scout": 6,
//                     "survived_players_kit_basic_solo_scout": 48,
//                     "time_played_kit_basic_solo_scout": 301,
//                     "assists_kit_advanced_solo_knight": 1,
//                     "chests_opened_kit_advanced_solo_knight": 10,
//                     "deaths_kit_advanced_solo_knight": 3,
//                     "kills_kit_advanced_solo_knight": 5,
//                     "losses_kit_advanced_solo_knight": 3,
//                     "most_kills_game_kit_advanced_solo_knight": 4,
//                     "survived_players_kit_advanced_solo_knight": 18,
//                     "time_played_kit_advanced_solo_knight": 336,
//                     "arrows_hit_kit_advanced_solo_knight": 2,
//                     "arrows_shot_kit_advanced_solo_knight": 9,
//                     "games_kit_advanced_solo_knight": 1,
//                     "longest_bow_kill": 2,
//                     "longest_bow_kill_kit_advanced_solo_knight": 3,
//                     "longest_bow_kill_solo": 3,
//                     "longest_bow_shot_kit_advanced_solo_knight": 2,
//                     "melee_kills_kit_advanced_solo_knight": 2,
//                     "void_kills_kit_advanced_solo_knight": 2,
//                     "chests_opened_kit_attacking_team_hunter": 11,
//                     "deaths_kit_attacking_team_hunter": 4,
//                     "games_kit_attacking_team_hunter": 2,
//                     "losses_kit_attacking_team_hunter": 4,
//                     "survived_players_kit_attacking_team_hunter": 21,
//                     "time_played_kit_attacking_team_hunter": 238,
//                     "free_event_key_skywars_easter_boxes_2021_2": true,
//                     "skywars_easter_boxes": 1,
//                     "chests_opened_kit_supporting_team_ecologist": 1,
//                     "deaths_kit_supporting_team_ecologist": 1,
//                     "games_kit_supporting_team_ecologist": 1,
//                     "losses_kit_supporting_team_ecologist": 1,
//                     "time_played_kit_supporting_team_ecologist": 13,
//                     "arrows_hit_kit_attacking_team_hunter": 5,
//                     "arrows_shot_kit_attacking_team_hunter": 21,
//                     "longest_bow_shot_kit_attacking_team_hunter": 25,
//                     "heads": 1,
//                     "heads_kit_basic_solo_scout": 1,
//                     "heads_team": 1,
//                     "heads_yucky": 1,
//                     "heads_yucky_kit_basic_solo_scout": 1,
//                     "heads_yucky_team": 1,
//                     "kills_kit_basic_solo_scout": 3,
//                     "longest_bow_kill_kit_basic_solo_scout": 2,
//                     "longest_bow_kill_team": 2,
//                     "melee_kills_kit_basic_solo_scout": 3,
//                     "most_kills_game_kit_basic_solo_scout": 2,
//                     "head_collection": {
//                         "recent": [
//                             {
//                                 "uuid": "69b871a7-5cb8-4bbe-bf93-27dcbbda7804",
//                                 "timestamp": 1631934222973,
//                                 "mode": "teams_normal",
//                                 "sacrifice": "YUCKY"
//                             }
//                         ],
//                         "prestigious": []
//                     },
//                     "longest_bow_kill_kit_advanced_solo_hunter": 2,
//                     "lastTourneyAd": 1634325045345,
//                     "skywars_christmas_boxes": 10,
//                     "perkslot": {
//                         "normal": {
//                             "3": "solo_resistance_boost",
//                             "4": "solo_savior",
//                             "5": "solo_fat"
//                         },
//                         "insane": {
//                             "3": "team_resistance_boost",
//                             "4": "team_savior",
//                             "5": "team_fat"
//                         }
//                     },
//                     "toggle_solo_lucky_charm": false,
//                     "toggle_solo_environmental_expert": false,
//                     "toggle_solo_robbery": false,
//                     "toggle_solo_barbarian": false,
//                     "toggle_mega_nourishment": false,
//                     "toggle_solo_necromancer": false,
//                     "toggle_mega_juggernaut": false,
//                     "toggle_mega_tank": false,
//                     "toggle_mega_mining_expertise": false,
//                     "toggle_solo_frost": false,
//                     "toggle_mega_bridger": false,
//                     "toggle_mega_environmental_expert": false,
//                     "toggle_mega_lucky_charm": false,
//                     "toggle_team_arrow_recovery": false,
//                     "team_bulldozer": 0,
//                     "toggle_mega_black_magic": false,
//                     "toggle_mega_marksmanship": false,
//                     "toggle_team_bulldozer": true,
//                     "toggle_team_mining_expertise": false,
//                     "toggle_team_resistance_boost": true,
//                     "toggle_team_juggernaut": true,
//                     "team_juggernaut": 0,
//                     "toggle_team_knowledge": false,
//                     "toggle_mega_rusher": false,
//                     "toggle_team_fat": true,
//                     "toggle_team_lucky_charm": false,
//                     "toggle_mega_notoriety": false,
//                     "toggle_team_marksmanship": false,
//                     "team_fat": 0,
//                     "toggle_team_environmental_expert": false,
//                     "toggle_team_speed_boost": false,
//                     "toggle_team_annoy-o-mite": false,
//                     "toggle_mega_blazing_arrows": false,
//                     "toggle_team_diamondpiercer": false,
//                     "toggle_team_nourishment": false,
//                     "toggle_team_barbarian": false,
//                     "toggle_ranked_bowman_perk": false,
//                     "toggle_mega_necromancer": false,
//                     "toggle_ranked_athlete_perk": false,
//                     "toggle_ranked_healer_perk": false,
//                     "toggle_ranked_blacksmith_perk": false,
//                     "toggle_ranked_pyromancer_perk": false,
//                     "toggle_ranked_paladin_perk": false,
//                     "toggle_ranked_hound_perk": false,
//                     "toggle_team_bridger": false,
//                     "toggle_team_blazing_arrows": false,
//                     "toggle_team_savior": true,
//                     "toggle_ranked_mining_expertise": false,
//                     "toggle_mega_arrow_recovery": false,
//                     "toggle_ranked_magician_perk": false,
//                     "toggle_ranked_bridger": false,
//                     "toggle_ranked_armorer_perk": false,
//                     "toggle_ranked_blazing_arrows": false,
//                     "toggle_solo_blazing_arrows": false,
//                     "solo_bulldozer": 0,
//                     "toggle_solo_arrow_recovery": false,
//                     "toggle_team_necromancer": false,
//                     "toggle_solo_juggernaut": true,
//                     "toggle_solo_marksmanship": false,
//                     "toggle_solo_mining_expertise": false,
//                     "toggle_team_robbery": false,
//                     "solo_juggernaut": 0,
//                     "toggle_solo_resistance_boost": true,
//                     "toggle_solo_annoy-o-mite": false,
//                     "solo_savior": 0,
//                     "toggle_solo_knowledge": false,
//                     "toggle_ranked_tough_skin": false,
//                     "toggle_ranked_rusher": false,
//                     "toggle_ranked_champion_perk": false,
//                     "toggle_solo_savior": true,
//                     "toggle_solo_bulldozer": true,
//                     "toggle_solo_revenge": false,
//                     "toggle_ranked_arrow_recovery": false,
//                     "toggle_ranked_scout_perk": false,
//                     "toggle_solo_speed_boost": false,
//                     "toggle_team_frost": false,
//                     "toggle_solo_black_magic": false,
//                     "solo_fat": 0,
//                     "toggle_ranked_juggernaut": false,
//                     "toggle_solo_fat": true,
//                     "toggle_solo_nourishment": false,
//                     "toggle_team_black_magic": false,
//                     "toggle_solo_bridger": false,
//                     "toggle_ranked_last_stand": false,
//                     "toggle_ranked_environmental_expert": false,
//                     "mobs_killed": 1,
//                     "mobs_killed_kit_basic_solo_scout": 1,
//                     "mobs_killed_solo": 1,
//                     "kills_kit_attacking_team_hunter": 1,
//                     "most_kills_game_kit_attacking_team_hunter": 1,
//                     "void_kills_kit_attacking_team_hunter": 1
//                 },
//                 "Battleground": {
//                     "mage_spec": "aquamancer",
//                     "paladin_spec": "avenger",
//                     "shaman_spec": "earthwarden",
//                     "warrior_spec": "berserker",
//                     "packages": [
//                         "legacyachievement2",
//                         "legacyachievement3",
//                         "legacyachievement8",
//                         "mage_spec_aquamancer",
//                         "mount_corpse_mare",
//                         "mount_undying_mare",
//                         "legacyachievement9",
//                         "legacyachievement10"
//                     ],
//                     "selected_mount": "undying_mare",
//                     "chosen_class": "mage",
//                     "play_streak": 5,
//                     "damage_prevented_thunderlord": 1697,
//                     "heal_shaman": 800,
//                     "deaths": 153,
//                     "heal_thunderlord": 800,
//                     "damage": 665329,
//                     "damage_prevented": 178626,
//                     "heal": 357499,
//                     "thunderlord_plays": 1,
//                     "damage_shaman": 2726,
//                     "damage_thunderlord": 2726,
//                     "damage_prevented_shaman": 1697,
//                     "shaman_plays": 1,
//                     "damage_taken": 1041764,
//                     "damage_pyromancer": 403593,
//                     "heal_mage": 354457,
//                     "damage_mage": 619677,
//                     "heal_pyromancer": 9511,
//                     "pyromancer_plays": 11,
//                     "damage_prevented_pyromancer": 80603,
//                     "assists": 170,
//                     "mage_plays": 21,
//                     "damage_prevented_mage": 175551,
//                     "coins": 16286,
//                     "win_streak": 1,
//                     "wins_capturetheflag": 7,
//                     "flag_conquer_team": 20,
//                     "wins_capturetheflag_b": 4,
//                     "wins_pyromancer": 3,
//                     "wins_mage": 10,
//                     "wins_red": 7,
//                     "wins": 10,
//                     "kills": 69,
//                     "wins_capturetheflag_red": 6,
//                     "broken_inventory": 5,
//                     "mage_skill4": 1,
//                     "mage_skill1": 1,
//                     "mage_health": 3,
//                     "mage_energy": 3,
//                     "mage_cooldown": 3,
//                     "mage_critchance": 1,
//                     "mage_critmultiplier": 1,
//                     "repaired": 84,
//                     "repaired_common": 55,
//                     "weapon_inventory": [
//                         {
//                             "spec": {
//                                 "spec": 2,
//                                 "playerClass": 0
//                             },
//                             "ability": 1,
//                             "abilityBoost": 14,
//                             "damage": 120,
//                             "energy": 25,
//                             "chance": 25,
//                             "multiplier": 189,
//                             "health": 278,
//                             "cooldown": 9,
//                             "movement": 8,
//                             "material": "POISONOUS_POTATO",
//                             "id": 1460658493055,
//                             "category": "LEGENDARY",
//                             "crafted": false,
//                             "upgradeMax": 2,
//                             "upgradeTimes": 0
//                         },
//                         {
//                             "spec": {
//                                 "spec": 0,
//                                 "playerClass": 3
//                             },
//                             "ability": 1,
//                             "abilityBoost": 7,
//                             "damage": 108,
//                             "energy": 20,
//                             "chance": 15,
//                             "multiplier": 183,
//                             "health": 157,
//                             "cooldown": 4,
//                             "movement": 0,
//                             "material": "STRING",
//                             "id": 1470438296569,
//                             "category": "EPIC",
//                             "crafted": false,
//                             "upgradeMax": 1,
//                             "upgradeTimes": 0
//                         },
//                         {
//                             "spec": {
//                                 "spec": 1,
//                                 "playerClass": 1
//                             },
//                             "ability": 0,
//                             "abilityBoost": 6,
//                             "damage": 92,
//                             "energy": 14,
//                             "chance": 14,
//                             "multiplier": 175,
//                             "health": 196,
//                             "cooldown": 0,
//                             "movement": 0,
//                             "material": "IRON_PICKAXE",
//                             "id": 1470438301215,
//                             "category": "RARE",
//                             "crafted": false,
//                             "upgradeMax": 2,
//                             "upgradeTimes": 0
//                         },
//                         {
//                             "spec": {
//                                 "spec": 0,
//                                 "playerClass": 1
//                             },
//                             "ability": 2,
//                             "abilityBoost": 4,
//                             "damage": 98,
//                             "energy": 15,
//                             "chance": 14,
//                             "multiplier": 172,
//                             "health": 190,
//                             "cooldown": 0,
//                             "movement": 0,
//                             "material": "IRON_AXE",
//                             "id": 1470439308080,
//                             "category": "RARE",
//                             "crafted": false,
//                             "upgradeMax": 2,
//                             "upgradeTimes": 0
//                         },
//                         {
//                             "spec": {
//                                 "spec": 1,
//                                 "playerClass": 2
//                             },
//                             "ability": 1,
//                             "abilityBoost": 6,
//                             "damage": 90,
//                             "energy": 15,
//                             "chance": 12,
//                             "multiplier": 166,
//                             "health": 181,
//                             "cooldown": 0,
//                             "movement": 0,
//                             "material": "IRON_AXE",
//                             "id": 1460805233708,
//                             "category": "RARE",
//                             "crafted": false,
//                             "upgradeMax": 2,
//                             "upgradeTimes": 0
//                         },
//                         {
//                             "spec": {
//                                 "spec": 1,
//                                 "playerClass": 3
//                             },
//                             "ability": 1,
//                             "abilityBoost": 5,
//                             "damage": 95,
//                             "energy": 14,
//                             "chance": 12,
//                             "multiplier": 170,
//                             "health": 171,
//                             "cooldown": 0,
//                             "movement": 0,
//                             "material": "GOLD_AXE",
//                             "id": 1460805308027,
//                             "category": "RARE",
//                             "crafted": false,
//                             "upgradeMax": 2,
//                             "upgradeTimes": 0
//                         },
//                         {
//                             "spec": {
//                                 "spec": 2,
//                                 "playerClass": 2
//                             },
//                             "ability": 3,
//                             "abilityBoost": 5,
//                             "damage": 94,
//                             "energy": 14,
//                             "chance": 20,
//                             "multiplier": 152,
//                             "health": 177,
//                             "cooldown": 0,
//                             "movement": 0,
//                             "material": "IRON_PICKAXE",
//                             "id": 1460755627431,
//                             "category": "RARE",
//                             "crafted": false,
//                             "upgradeMax": 2,
//                             "upgradeTimes": 0
//                         },
//                         {
//                             "spec": {
//                                 "spec": 0,
//                                 "playerClass": 2
//                             },
//                             "ability": 0,
//                             "abilityBoost": 6,
//                             "damage": 100,
//                             "energy": 8,
//                             "chance": 20,
//                             "multiplier": 176,
//                             "health": 131,
//                             "cooldown": 0,
//                             "movement": 0,
//                             "material": "IRON_AXE",
//                             "id": 1470438297317,
//                             "category": "RARE",
//                             "crafted": false,
//                             "upgradeMax": 2,
//                             "upgradeTimes": 0
//                         }
//                     ],
//                     "repaired_rare": 27,
//                     "repaired_legendary": 1,
//                     "salvaged_shards_reward": 3,
//                     "salvaged_weapons": 76,
//                     "salvaged_weapons_common": 55,
//                     "magic_dust": 160,
//                     "salvaged_dust_reward": 172,
//                     "current_weapon": 1460658493055,
//                     "hints": false,
//                     "losses": 9,
//                     "losses_pyromancer": 6,
//                     "losses_mage": 8,
//                     "flag_conquer_self": 5,
//                     "salvaged_weapons_rare": 21,
//                     "wins_capturetheflag_a": 3,
//                     "damage_aquamancer": 216084,
//                     "heal_aquamancer": 344946,
//                     "aquamancer_plays": 10,
//                     "damage_prevented_aquamancer": 94948,
//                     "wins_aquamancer": 7,
//                     "wins_capturetheflag_blu": 1,
//                     "wins_blu": 3,
//                     "wins_teamdeathmatch_a": 1,
//                     "wins_teamdeathmatch": 1,
//                     "wins_teamdeathmatch_blu": 1,
//                     "losses_aquamancer": 2,
//                     "wins_domination_blu": 1,
//                     "wins_domination": 2,
//                     "wins_domination_a": 1,
//                     "wins_domination_red": 1,
//                     "wins_domination_b": 1,
//                     "repaired_epic": 1,
//                     "void_shards": 3,
//                     "losses_warrior": 1,
//                     "damage_berserker": 42926,
//                     "berserker_plays": 1,
//                     "damage_warrior": 42926,
//                     "losses_berserker": 1,
//                     "heal_warrior": 2242,
//                     "heal_berserker": 2242,
//                     "life_leeched_warrior": 2242,
//                     "warrior_plays": 1,
//                     "life_leeched": 2242,
//                     "damage_prevented_warrior": 1378,
//                     "damage_prevented_berserker": 1378,
//                     "life_leeched_berserker": 2242,
//                     "reward_inventory": 1
//                 },
//                 "Arcade": {
//                     "coins": 2863454,
//                     "sw_shots_fired": 5932,
//                     "sw_kills": 203,
//                     "sw_weekly_kills_a": 160,
//                     "sw_deaths": 200,
//                     "sw_monthly_kills_a": 156,
//                     "sw_rebel_kills": 66,
//                     "sw_empire_kills": 137,
//                     "sw_game_wins": 12,
//                     "headshots_dayone": 35,
//                     "kills_dayone": 150,
//                     "max_wave": 40,
//                     "bounty_kills_oneinthequiver": 6,
//                     "deaths_oneinthequiver": 31,
//                     "kills_oneinthequiver": 33,
//                     "kills_dragonwars2": 44,
//                     "stamp_level": 0,
//                     "time_stamp": 1496404292556,
//                     "sw_weekly_kills_b": 15,
//                     "hitw_record_q": 40,
//                     "rounds_hole_in_the_wall": 7,
//                     "kills_throw_out": 2,
//                     "deaths_throw_out": 3,
//                     "monthly_coins_a": 6472,
//                     "weekly_coins_a": 2495,
//                     "powerkicks_soccer": 106,
//                     "goals_soccer": 33,
//                     "weekly_coins_b": 3977,
//                     "wins_soccer": 1,
//                     "miniwalls_activeKit": "soldier",
//                     "arrows_hit_mini_walls": 42,
//                     "kills_mini_walls": 18,
//                     "deaths_mini_walls": 15,
//                     "arrows_shot_mini_walls": 159,
//                     "wither_kills_mini_walls": 2,
//                     "wither_damage_mini_walls": 44,
//                     "poop_collected": 1,
//                     "final_kills_mini_walls": 3,
//                     "wins_mini_walls": 2,
//                     "dec2016_achievements": true,
//                     "dec2016_achievements2": true,
//                     "sw_monthly_kills_b": 19,
//                     "best_round_zombies_alienarcadium": 17,
//                     "best_round_zombies_alienarcadium_normal": 17,
//                     "best_round_zombies": 17,
//                     "fastest_time_10_zombies_alienarcadium_normal": 411,
//                     "fastest_time_10_zombies": 411,
//                     "rainbow_zombie_kills_zombies": 8,
//                     "space_blaster_zombie_kills_zombies": 6,
//                     "times_knocked_down_zombies_alienarcadium": 6,
//                     "windows_repaired_zombies_alienarcadium": 13,
//                     "times_knocked_down_zombies": 6,
//                     "zombie_kills_zombies_alienarcadium_normal": 98,
//                     "zombie_kills_zombies": 98,
//                     "ghast_zombie_kills_zombies": 1,
//                     "worm_small_zombie_kills_zombies": 17,
//                     "deaths_zombies_alienarcadium": 2,
//                     "bullets_shot_zombies": 389,
//                     "basic_zombie_kills_zombies": 27,
//                     "windows_repaired_zombies_alienarcadium_normal": 13,
//                     "worm_zombie_kills_zombies": 14,
//                     "bullets_hit_zombies": 269,
//                     "headshots_zombies": 81,
//                     "total_rounds_survived_zombies_alienarcadium_normal": 17,
//                     "times_knocked_down_zombies_alienarcadium_normal": 6,
//                     "deaths_zombies": 2,
//                     "total_rounds_survived_zombies_alienarcadium": 17,
//                     "total_rounds_survived_zombies": 17,
//                     "windows_repaired_zombies": 13,
//                     "sentinel_zombie_kills_zombies": 3,
//                     "zombie_kills_zombies_alienarcadium": 98,
//                     "pig_zombie_zombie_kills_zombies": 10,
//                     "deaths_zombies_alienarcadium_normal": 2,
//                     "skeleton_zombie_kills_zombies": 2,
//                     "space_grunt_zombie_kills_zombies": 6,
//                     "blob_zombie_kills_zombies": 3,
//                     "clown_zombie_kills_zombies": 1,
//                     "gifts_grinch_simulator_v2": 13,
//                     "wins_party": 1,
//                     "rounds_simon_says": 94,
//                     "dive_best_score_party": 13,
//                     "dive_total_score_party": 20,
//                     "jigsaw_rush_best_time_party": 11202,
//                     "lawn_moower_mowed_best_score_party": 320,
//                     "lawn_moower_mowed_total_score_party": 929,
//                     "total_stars_party": 43,
//                     "anvil_spleef_best_time_party": 72878,
//                     "chicken_rings_best_time_party": 56314,
//                     "fire_leapers_round_wins_party": 2,
//                     "pig_jousting_round_wins_party": 1,
//                     "round_wins_party": 7,
//                     "the_floor_is_lava_best_time_party": 13454,
//                     "animal_slaughter_best_score_party": 52,
//                     "animal_slaughter_kills_party": 85,
//                     "avalanche_round_wins_party": 1,
//                     "rpg_16_kills_best_score_party": 4,
//                     "rpg_16_kills_party": 4,
//                     "rpg_16_round_wins_party": 1,
//                     "round_wins_simon_says": 63,
//                     "top_score_simon_says": 19,
//                     "kicks_soccer": 12,
//                     "bow_kills_oneinthequiver": 10,
//                     "sword_kills_oneinthequiver": 10,
//                     "lastTourneyAd": 1702831370430,
//                     "pixel_party": {
//                         "games_played": 1,
//                         "games_played_normal": 1,
//                         "highest_round": 1,
//                         "rounds_completed": 1,
//                         "rounds_completed_normal": 1
//                     },
//                     "spider_maze_best_time_party": 23767,
//                     "volcano_round_wins_party": 1,
//                     "packages": [
//                         "victory_dance_snow_bomber",
//                         "victory_dance_winter_twister",
//                         "projectile_trail_howling_wind",
//                         "projectile_trail_spiders_silk",
//                         "projectile_trail_cursedflame",
//                         "projectile_trail_wisp_whirlwind",
//                         "victory_dance_graveyardrave"
//                     ],
//                     "high_ground_best_score_party": 36,
//                     "high_ground_total_score_party": 36,
//                     "jungle_jump_best_time_party": 14707,
//                     "jungle_jump_round_wins_party": 1,
//                     "lab_escape_best_time_party": 60837,
//                     "option_show_tutorial_book": "off",
//                     "woolhunt_assists": 20,
//                     "woolhunt_deaths": 66,
//                     "woolhunt_deaths_to_woolholder": 7,
//                     "woolhunt_deaths_with_wool": 2,
//                     "woolhunt_experienced_losses": 6,
//                     "woolhunt_experienced_wins": 9,
//                     "woolhunt_fastest_win": 318,
//                     "woolhunt_gold_earned": 1940,
//                     "woolhunt_gold_spent": -495,
//                     "woolhunt_kills": 50,
//                     "woolhunt_kills_with_wool": 3,
//                     "woolhunt_longest_game": 409,
//                     "woolhunt_most_gold_earned": 160,
//                     "woolhunt_most_kills_and_assists": 8,
//                     "woolhunt_participated_losses": 6,
//                     "woolhunt_participated_wins": 9,
//                     "woolhunt_wools_captured": 1,
//                     "woolhunt_wools_stolen": 4,
//                     "dropper": {
//                         "fastest_game": 50756,
//                         "games_played": 18,
//                         "map_stats": {
//                             "atlantis": {
//                                 "best_time": 11066
//                             },
//                             "balloons": {
//                                 "best_time": 10299
//                             },
//                             "bbq": {
//                                 "best_time": 10378
//                             },
//                             "cabin": {
//                                 "best_time": 15790
//                             },
//                             "castle": {
//                                 "best_time": 19030
//                             },
//                             "city": {
//                                 "best_time": 11326
//                             },
//                             "distance": {
//                                 "best_time": 9553
//                             },
//                             "distortion": {
//                                 "best_time": 12764
//                             },
//                             "floatingislands": {
//                                 "best_time": 19944
//                             },
//                             "gears": {
//                                 "best_time": 21028
//                             },
//                             "geometry": {
//                                 "best_time": 12829
//                             },
//                             "iris": {
//                                 "best_time": 103138
//                             },
//                             "mineshaft": {
//                                 "best_time": 11760
//                             },
//                             "plughole": {
//                                 "best_time": 18974
//                             },
//                             "ravine": {
//                                 "best_time": 9800
//                             },
//                             "retro": {
//                                 "best_time": 14238
//                             },
//                             "sandworm": {
//                                 "best_time": 18184
//                             },
//                             "sewer": {
//                                 "best_time": 7072
//                             },
//                             "space": {
//                                 "best_time": 6684
//                             },
//                             "tangle": {
//                                 "best_time": 11062
//                             },
//                             "time": {
//                                 "best_time": 10002
//                             },
//                             "toilet": {
//                                 "best_time": 9054
//                             },
//                             "upsidedown": {
//                                 "best_time": 11635
//                             },
//                             "well": {
//                                 "best_time": 6864
//                             },
//                             "western": {
//                                 "best_time": 16812
//                             }
//                         },
//                         "maps_completed": 78,
//                         "fails": 356,
//                         "games_finished": 7
//                     },
//                     "gifts_grinch_simulator_v2_tourney_grinch_simulator_1": 1140,
//                     "losses_grinch_simulator_v2_tourney_grinch_simulator_1": 52,
//                     "wins_grinch_simulator_v2_tourney_grinch_simulator_1": 8
//                 },
//                 "GingerBread": {
//                     "helmet_active": "HELMET_1_3",
//                     "shoes_active": "GOLD_SHOES",
//                     "frame_active": "{GingerbreadPart:{PartType:FRAME,PartRarity:SUPER,Attributes:[{KartAttributeType:HANDLING,Level:5},{KartAttributeType:TRACTION,Level:2}]}}",
//                     "packages": [
//                         "helmet_1_3_unlocked",
//                         "white_kart_alt_2_unlocked",
//                         "achievementsupdatedd",
//                         "achievementsupdatedc"
//                     ],
//                     "jacket_active": "GOLD_JACKET",
//                     "booster_active": "{GingerbreadPart:{PartType:TURBOCHARGER,PartRarity:AWESOME,Attributes:[{KartAttributeType:BRAKES,Level:3},{KartAttributeType:BOOSTER_SPEED,Level:2},{KartAttributeType:DRIFTING_EFFICIENCY,Level:1}]}}",
//                     "engine_active": "{GingerbreadPart:{PartType:ENGINE,PartRarity:SUPER,Attributes:[{KartAttributeType:TOP_SPEED,Level:1},{KartAttributeType:ACCELERATION,Level:2}]}}",
//                     "pants_active": "GOLD_PANTS",
//                     "skin_active": "WHITE_KART;ALT_2",
//                     "horn": "DEFAULT",
//                     "box_pickups_monthly_a": 41,
//                     "banana_hits_sent": 29,
//                     "box_pickups_junglerush": 58,
//                     "banana_hits_received": 18,
//                     "junglerush_plays": 3,
//                     "box_pickups": 105,
//                     "coins_picked_up": 324,
//                     "box_pickups_weekly_a": 75,
//                     "laps_completed": 18,
//                     "parts": "{GingerbreadPart:{PartType:FRAME,PartRarity:SUPER,Attributes:[{KartAttributeType:HANDLING,Level:5},{KartAttributeType:TRACTION,Level:2}]}};{GingerbreadPart:{PartType:TURBOCHARGER,PartRarity:AWESOME,Attributes:[{KartAttributeType:BRAKES,Level:3},{KartAttributeType:BOOSTER_SPEED,Level:2},{KartAttributeType:DRIFTING_EFFICIENCY,Level:1}]}};{GingerbreadPart:{PartType:ENGINE,PartRarity:SUPER,Attributes:[{KartAttributeType:TOP_SPEED,Level:1},{KartAttributeType:ACCELERATION,Level:2}]}}",
//                     "coins": 1774,
//                     "blue_torpedo_hit": 4,
//                     "gold_trophy": 1,
//                     "wins": 2,
//                     "gold_trophy_junglerush": 1,
//                     "box_pickups_monthly_b": 64,
//                     "box_pickups_canyon": 10,
//                     "canyon_plays": 1,
//                     "box_pickups_weekly_b": 30,
//                     "box_pickups_retro": 37,
//                     "silver_trophy_weekly_b": 1,
//                     "silver_trophy_retro": 1,
//                     "retro_plays": 2,
//                     "silver_trophy": 1,
//                     "silver_trophy_monthly_b": 1,
//                     "lastTourneyAd": 1667016179289
//                 },
//                 "TNTGames": {
//                     "deaths_bowspleef": 6,
//                     "coins": 1881,
//                     "tags_bowspleef": 169,
//                     "kills_capture": 116,
//                     "deaths_capture": 64,
//                     "assists_capture": 53,
//                     "wins_capture": 12,
//                     "record_tntrun": 83,
//                     "capture_class": "Fire Wizard",
//                     "doublejump_tntrun": 0,
//                     "witherwizard_explode": 1,
//                     "kills_tntag": 1,
//                     "witherwizard_regen": 1,
//                     "spleef_doublejump": 0,
//                     "spleef_triple": 0,
//                     "spleef_repulse": 0,
//                     "firewizard_explode": 0,
//                     "packages": [
//                         "tiered_achievement_flag_1",
//                         "clicked_wizards_npc",
//                         "shop_2018",
//                         "tiered_achievement_flag_3",
//                         "clicked_bow_spleef_npc",
//                         "clicked_tnt_tag_npc"
//                     ],
//                     "new_pvprun_double_jumps": 1,
//                     "new_spleef_repulsor": 1,
//                     "new_witherwizard_regen": 1,
//                     "new_icewizard_explode": 1,
//                     "new_spleef_double_jumps": 1,
//                     "new_tntrun_double_jumps": 1,
//                     "new_icewizard_regen": 1,
//                     "new_witherwizard_explode": 1,
//                     "new_tntag_speedy": 1,
//                     "new_firewizard_regen": 1,
//                     "new_kineticwizard_regen": 1,
//                     "new_spleef_tripleshot": 1,
//                     "new_kineticwizard_explode": 1,
//                     "new_bloodwizard_regen": 1,
//                     "new_bloodwizard_explode": 1,
//                     "new_firewizard_explode": 1,
//                     "wizards_selected_class": "new_hydrowizard",
//                     "new_witherwizard_kills": 14,
//                     "new_witherwizard_deaths": 4,
//                     "wins": 12,
//                     "new_witherwizard_assists": 1,
//                     "points_capture": 5,
//                     "flags": {
//                         "show_tip_holograms": true,
//                         "show_wizards_actionbar_info": true,
//                         "show_wizards_cooldown_notifications": true,
//                         "enable_explosive_dash": false
//                     },
//                     "new_hydrowizard_regen": 1,
//                     "new_hydrowizard_explode": 1,
//                     "new_hydrowizard_deaths": 2,
//                     "new_firewizard_deaths": 2,
//                     "new_witherwizard_healing": 33,
//                     "new_firewizard_assists": 1,
//                     "new_firewizard_damage_taken": 80,
//                     "new_hydrowizard_damage_taken": 49,
//                     "kinetic_healing_capture": 0,
//                     "new_witherwizard_damage_taken": 75,
//                     "new_firewizard_healing": 32,
//                     "new_hydrowizard_healing": 44,
//                     "air_time_capture": 4187,
//                     "deaths_tntag": 1
//                 },
//                 "TrueCombat": {
//                     "packages": [
//                         "cw_ach_flag2",
//                         "cw_ach_flag1",
//                         "cw_ach_flag3"
//                     ],
//                     "win_streak": 0,
//                     "games": 10,
//                     "crazywalls_losses_solo": 4,
//                     "deaths": 10,
//                     "crazywalls_deaths_solo": 2,
//                     "losses": 17,
//                     "crazywalls_games_solo": 2,
//                     "survived_players": 79,
//                     "crazywalls_deaths_team": 1,
//                     "crazywalls_losses_team": 2,
//                     "crazywalls_games_team": 1,
//                     "items_enchanted": 17,
//                     "arrows_shot": 50,
//                     "coins": 295,
//                     "crazywalls_deaths_team_chaos": 3,
//                     "crazywalls_games_team_chaos": 3,
//                     "crazywalls_losses_team_chaos": 6,
//                     "arrows_hit": 5,
//                     "crazywalls_losses_solo_chaos": 5,
//                     "crazywalls_games_solo_chaos": 4,
//                     "crazywalls_deaths_solo_chaos": 4,
//                     "kills_weekly_a": 1,
//                     "kills": 1,
//                     "crazywalls_kills_solo_chaos": 1,
//                     "crazywalls_kills_monthly_a_solo_chaos": 1,
//                     "crazywalls_kills_weekly_a_solo_chaos": 1,
//                     "kills_monthly_a": 1,
//                     "show_noob_holograms": true,
//                     "live_combat": true
//                 },
//                 "Paintball": {
//                     "packages": [
//                         "achievement_flag_1",
//                         "tripleshot",
//                         "achievement_flag_2"
//                     ],
//                     "kills": 214,
//                     "wins": 11,
//                     "coins": 1801,
//                     "shots_fired": 4128,
//                     "deaths": 192,
//                     "killstreaks": 13,
//                     "superluck": 1,
//                     "transfusion": 2,
//                     "fortune": 0,
//                     "monthly_kills_b": 9,
//                     "weekly_kills_b": 6,
//                     "weekly_kills_a": 65,
//                     "monthly_kills_a": 65
//                 },
//                 "VampireZ": {
//                     "vampire_kills": 18,
//                     "zombie_kills": 171,
//                     "vampire_deaths": 84,
//                     "coins": 990,
//                     "human_deaths": 26,
//                     "human_kills": 12,
//                     "zombie_doubler": 1,
//                     "weekly_vampire_wins_a": 2,
//                     "monthly_vampire_wins_a": 2,
//                     "gold_starter": 2,
//                     "gold_booster": 2,
//                     "vampire_doubler": 1,
//                     "loot_drops": 0,
//                     "constitution": 0,
//                     "updated_stats": true
//                 },
//                 "Walls3": {
//                     "packages": [
//                         "legacy_achievement_a"
//                     ],
//                     "chosen_class": "Werewolf",
//                     "wins_Skeleton": 1,
//                     "wins": 3,
//                     "wins_face_off_Skeleton": 1,
//                     "deaths_Skeleton": 40,
//                     "weeklyDeaths_Skeleton": 40,
//                     "coins": 3083,
//                     "weeklyDeaths": 44,
//                     "wins_face_off": 2,
//                     "assists_Skeleton": 26,
//                     "weeklyWins_face_off_Skeleton": 1,
//                     "weeklyWins_face_off": 1,
//                     "assists": 58,
//                     "plays_face_off": 2,
//                     "deaths": 63,
//                     "weeklyWins": 1,
//                     "weeklyWins_Skeleton": 1,
//                     "weeklyLosses": 8,
//                     "plays_standard": 4,
//                     "deaths_Enderman": 2,
//                     "losses_Enderman": 1,
//                     "weeklyLosses_Enderman": 1,
//                     "weeklyDeaths_Enderman": 2,
//                     "losses": 10,
//                     "colorblind": false,
//                     "creeperInventory": {
//                         "0": "268,0",
//                         "1": "257,0",
//                         "2": "58,0",
//                         "6": "373,5",
//                         "8": "364,0",
//                         "9": "345,0"
//                     },
//                     "skeleton_g": 3,
//                     "weeklyLosses_practice": 0,
//                     "losses_practice_Skeleton": 0,
//                     "weeklyLosses_Skeleton": 5,
//                     "losses_practice": 0,
//                     "weeklyLosses_practice_Skeleton": 0,
//                     "losses_Skeleton": 5,
//                     "plays_practice": 3,
//                     "losses_Creeper": 2,
//                     "finalDeaths": 5,
//                     "deaths_Creeper": 2,
//                     "assists_Creeper": 5,
//                     "weeklyLosses_Creeper": 2,
//                     "weeklyDeaths_Creeper": 2,
//                     "finalKills": 1,
//                     "monthly_finalKills_b": 1,
//                     "weeklyLosses_practice_Creeper": 0,
//                     "finalKills_Creeper": 1,
//                     "losses_practice_Creeper": 0,
//                     "monthly_finalKills_Creeper_b": 1,
//                     "weekly_finalKills_Creeper_a": 1,
//                     "toggle_hints": true,
//                     "weeklyKills": 3,
//                     "weeklyKills_Skeleton": 3,
//                     "kills": 4,
//                     "kills_Skeleton": 3,
//                     "skeleton_b": 3,
//                     "skeleton_a": 2,
//                     "skeleton_d": 3,
//                     "skeleton_c": 3,
//                     "losses_face_off": 1,
//                     "deaths_new": 1,
//                     "kills_new_Skeleton": 1,
//                     "deaths_new_Skeleton": 1,
//                     "weeklyLosses_face_off": 0,
//                     "losses_face_off_Skeleton": 0,
//                     "kills_new": 1,
//                     "weeklyLosses_face_off_Skeleton": 0,
//                     "enderman_deaths": 2,
//                     "skeleton_deaths": 40,
//                     "creeper_total_final_kills": 1,
//                     "skeleton_losses": 5,
//                     "total_final_kills_standard": 1,
//                     "skeleton_wins": 1,
//                     "skeleton_wins_standard": 1,
//                     "creeper_final_kills": 1,
//                     "enderman_losses": 1,
//                     "skeleton_kills": 3,
//                     "creeper_total_final_kills_standard": 1,
//                     "total_final_kills": 1,
//                     "final_kills_standard": 1,
//                     "creeper_final_kills_standard": 1,
//                     "final_kills": 1,
//                     "creeper_losses": 2,
//                     "creeper_deaths": 2,
//                     "blood": "BLACK_SMOKE",
//                     "phoenixInventory": {
//                         "0": "267,0",
//                         "1": "261,0",
//                         "2": "257,0",
//                         "3": "373,1",
//                         "4": "130,0",
//                         "5": "58,0",
//                         "7": "350,1",
//                         "8": "345,0",
//                         "35": "262,0"
//                     },
//                     "phoenix_b": 3,
//                     "phoenix_g": 3,
//                     "phoenix_d": 3,
//                     "phoenix_a": 3,
//                     "phoenix_c": 3,
//                     "phoenix_blocks_placed_preparation": 32,
//                     "phoenix_b_allies_healed_face_off": 67,
//                     "phoenix_arrows_hit_face_off": 39,
//                     "arrows_hit_face_off": 39,
//                     "self_healed_face_off": 15,
//                     "food_eaten_face_off": 3,
//                     "phoenix_allies_healed": 67,
//                     "phoenix_c_total_kills_face_off": 1,
//                     "phoenix_games_played": 2,
//                     "phoenix_iron_ore_broken": 97,
//                     "phoenix_self_healed_face_off": 15,
//                     "total_deaths": 23,
//                     "phoenix_c_assists_face_off": 1,
//                     "allies_healed": 67,
//                     "blocks_broken_face_off": 143,
//                     "games_played_face_off": 2,
//                     "steaks_eaten_face_off": 1,
//                     "phoenix_defender_assists_face_off": 11,
//                     "phoenix_defender_assists": 13,
//                     "total_kills": 28,
//                     "treasures_found": 7,
//                     "wood_chopped": 1,
//                     "self_healed": 34,
//                     "phoenix_deaths": 10,
//                     "phoenix_potions_drunk": 4,
//                     "phoenix_wood_chopped": 1,
//                     "phoenix_food_eaten_face_off": 3,
//                     "phoenix_blocks_broken_face_off": 142,
//                     "blocks_placed_face_off": 33,
//                     "phoenix_meters_fallen": 2215,
//                     "time_played": 68,
//                     "phoenix_iron_ore_broken_face_off": 85,
//                     "phoenix_activations_face_off": 6,
//                     "phoenix_blocks_broken": 187,
//                     "phoenix_allies_healed_face_off": 67,
//                     "phoenix_self_healed": 34,
//                     "phoenix_a_activations_face_off": 1,
//                     "phoenix_amount_healed_face_off": 82,
//                     "phoenix_c_assists": 1,
//                     "games_played": 4,
//                     "phoenix_b_allies_healed": 67,
//                     "blocks_placed_preparation": 38,
//                     "wood_chopped_face_off": 1,
//                     "phoenix_b_self_healed": 34,
//                     "phoenix_activations": 16,
//                     "phoenix_potions_drunk_face_off": 2,
//                     "phoenix_deaths_face_off": 3,
//                     "phoenix_amount_healed": 101,
//                     "phoenix_b_amount_healed": 101,
//                     "phoenix_games_played_face_off": 1,
//                     "treasures_found_face_off": 3,
//                     "activations_face_off": 6,
//                     "phoenix_total_deaths_face_off": 3,
//                     "phoenix_fish_eaten_face_off": 2,
//                     "phoenix_a_activations": 4,
//                     "meters_fallen_face_off": 1125,
//                     "phoenix_b_activations": 9,
//                     "assists_face_off": 12,
//                     "phoenix_b_activations_face_off": 5,
//                     "phoenix_fish_eaten": 2,
//                     "phoenix_meters_walked": 7756,
//                     "defender_assists_face_off": 11,
//                     "food_eaten": 5,
//                     "time_played_face_off": 26,
//                     "phoenix_blocks_placed_preparation_face_off": 9,
//                     "phoenix_arrows_hit": 88,
//                     "blocks_placed_preparation_face_off": 9,
//                     "phoenix_arrows_fired_face_off": 187,
//                     "total_kills_face_off": 12,
//                     "phoenix_total_deaths": 13,
//                     "phoenix_arrows_fired": 344,
//                     "phoenix_steaks_eaten_face_off": 1,
//                     "phoenix_steaks_eaten": 1,
//                     "meters_walked": 11329,
//                     "phoenix_treasures_found": 3,
//                     "phoenix_meters_walked_face_off": 3695,
//                     "potions_drunk": 5,
//                     "blocks_broken": 329,
//                     "activations": 20,
//                     "blocks_placed": 78,
//                     "phoenix_food_eaten": 3,
//                     "phoenix_b_amount_healed_face_off": 82,
//                     "phoenix_time_played": 47,
//                     "meters_walked_face_off": 3875,
//                     "phoenix_blocks_placed": 61,
//                     "arrows_fired": 347,
//                     "arrows_fired_face_off": 187,
//                     "phoenix_b_self_healed_face_off": 15,
//                     "iron_ore_broken": 189,
//                     "phoenix_treasures_found_face_off": 3,
//                     "steaks_eaten": 3,
//                     "phoenix_c_defender_assists": 1,
//                     "amount_healed": 101,
//                     "phoenix_total_kills_face_off": 12,
//                     "phoenix_wins_face_off": 1,
//                     "allies_healed_face_off": 67,
//                     "amount_healed_face_off": 82,
//                     "fish_eaten_face_off": 2,
//                     "phoenix_assists_face_off": 12,
//                     "defender_assists": 18,
//                     "phoenix_time_played_face_off": 26,
//                     "phoenix_assists": 21,
//                     "phoenix_c_defender_assists_face_off": 1,
//                     "phoenix_total_kills": 21,
//                     "meters_fallen": 3328,
//                     "phoenix_wood_chopped_face_off": 1,
//                     "iron_ore_broken_face_off": 85,
//                     "fish_eaten": 2,
//                     "arrows_hit": 88,
//                     "phoenix_blocks_placed_face_off": 33,
//                     "phoenix_c_total_kills": 1,
//                     "total_deaths_face_off": 4,
//                     "potions_drunk_face_off": 2,
//                     "phoenix_meters_fallen_face_off": 1070,
//                     "deaths_face_off": 4,
//                     "phoenix_wins": 1,
//                     "phoenix_wins_standard": 1,
//                     "phoenix_meters_walked_standard": 4061,
//                     "phoenix_arrows_fired_standard": 157,
//                     "defender_assists_standard": 7,
//                     "phoenix_blocks_placed_preparation_standard": 23,
//                     "phoenix_b_self_healed_standard": 19,
//                     "losses_standard": 1,
//                     "phoenix_deaths_standard": 7,
//                     "activations_standard": 14,
//                     "phoenix_time_played_standard": 21,
//                     "arrows_fired_standard": 160,
//                     "phoenix_final_deaths_standard": 3,
//                     "phoenix_amount_healed_standard": 19,
//                     "phoenix_losses_standard": 1,
//                     "phoenix_assists_standard": 9,
//                     "phoenix_iron_ore_broken_standard": 12,
//                     "final_deaths": 4,
//                     "blocks_placed_standard": 45,
//                     "phoenix_final_deaths": 3,
//                     "phoenix_games_played_standard": 1,
//                     "blocks_placed_preparation_standard": 29,
//                     "phoenix_arrows_hit_standard": 49,
//                     "phoenix_b_amount_healed_standard": 19,
//                     "phoenix_c_activations_standard": 3,
//                     "phoenix_c_activations": 3,
//                     "total_kills_standard": 16,
//                     "time_played_standard": 42,
//                     "phoenix_activations_standard": 10,
//                     "phoenix_total_deaths_standard": 10,
//                     "phoenix_b_activations_standard": 4,
//                     "iron_ore_broken_standard": 104,
//                     "self_healed_standard": 19,
//                     "blocks_broken_standard": 186,
//                     "potions_drunk_standard": 3,
//                     "phoenix_a_activations_standard": 3,
//                     "phoenix_a_total_kills_standard": 2,
//                     "final_deaths_standard": 4,
//                     "meters_fallen_standard": 2203,
//                     "phoenix_total_kills_standard": 9,
//                     "phoenix_potions_drunk_standard": 2,
//                     "assists_standard": 15,
//                     "phoenix_meters_fallen_standard": 1145,
//                     "deaths_standard": 15,
//                     "total_deaths_standard": 19,
//                     "phoenix_a_assists": 2,
//                     "phoenix_defender_assists_standard": 2,
//                     "phoenix_blocks_placed_standard": 28,
//                     "arrows_hit_standard": 49,
//                     "phoenix_self_healed_standard": 19,
//                     "amount_healed_standard": 19,
//                     "phoenix_blocks_broken_standard": 45,
//                     "phoenix_a_assists_standard": 2,
//                     "meters_walked_standard": 7454,
//                     "phoenix_losses": 1,
//                     "phoenix_a_total_kills": 2,
//                     "games_played_standard": 2,
//                     "werewolf_a": 3,
//                     "werewolf_b": 3,
//                     "werewolf_c": 3,
//                     "werewolf_d": 3,
//                     "werewolf_g": 3,
//                     "werewolfInventory": {
//                         "0": "267,0",
//                         "1": "257,0",
//                         "4": "130,0",
//                         "5": "58,0",
//                         "6": "373,5",
//                         "7": "364,0",
//                         "8": "345,0"
//                     },
//                     "pickaxeLevel": 1,
//                     "werewolf_blocks_placed_preparation_standard": 6,
//                     "werewolf_total_deaths_standard": 9,
//                     "werewolf_treasures_found": 4,
//                     "werewolf_meters_fallen_standard": 1058,
//                     "werewolf_steaks_eaten": 2,
//                     "werewolf_arrows_fired": 3,
//                     "werewolf_total_deaths": 10,
//                     "werewolf_kills": 1,
//                     "werewolf_meters_walked": 3573,
//                     "werewolf_defender_assists_standard": 5,
//                     "werewolf_food_eaten_standard": 2,
//                     "werewolf_blocks_placed": 17,
//                     "werewolf_meters_walked_speed": 140,
//                     "werewolf_a_activations_standard": 4,
//                     "wither_damage_standard": 104,
//                     "werewolf_assists": 6,
//                     "food_eaten_standard": 2,
//                     "werewolf_deaths_standard": 8,
//                     "werewolf_treasures_found_standard": 4,
//                     "werewolf_blocks_broken_standard": 141,
//                     "werewolf_meters_walked_speed_standard": 140,
//                     "werewolf_defender_assists": 5,
//                     "werewolf_wither_damage_standard": 104,
//                     "werewolf_total_kills": 7,
//                     "werewolf_final_deaths": 1,
//                     "kills_melee_standard": 1,
//                     "werewolf_arrows_fired_standard": 3,
//                     "kills_standard": 1,
//                     "treasures_found_standard": 4,
//                     "werewolf_games_played": 2,
//                     "werewolf_blocks_placed_standard": 17,
//                     "meters_walked_speed_standard": 140,
//                     "werewolf_food_eaten": 2,
//                     "werewolf_kills_melee_standard": 1,
//                     "werewolf_wins_standard": 1,
//                     "werewolf_potions_drunk": 1,
//                     "kills_melee": 1,
//                     "werewolf_deaths": 9,
//                     "werewolf_kills_standard": 1,
//                     "werewolf_blocks_broken": 142,
//                     "werewolf_assists_standard": 6,
//                     "werewolf_blocks_placed_preparation": 6,
//                     "meters_walked_speed": 140,
//                     "werewolf_potions_drunk_standard": 1,
//                     "steaks_eaten_standard": 2,
//                     "werewolf_final_deaths_standard": 1,
//                     "werewolf_meters_walked_standard": 3393,
//                     "werewolf_time_played": 21,
//                     "wins_standard": 1,
//                     "werewolf_activations_standard": 4,
//                     "werewolf_iron_ore_broken_standard": 92,
//                     "wither_damage": 104,
//                     "werewolf_steaks_eaten_standard": 2,
//                     "werewolf_time_played_standard": 21,
//                     "werewolf_games_played_standard": 1,
//                     "werewolf_wither_damage": 104,
//                     "werewolf_total_kills_standard": 7,
//                     "werewolf_meters_fallen": 1113,
//                     "werewolf_kills_melee": 1,
//                     "werewolf_wins": 1,
//                     "werewolf_a_activations": 4,
//                     "werewolf_iron_ore_broken": 92,
//                     "werewolf_activations": 4,
//                     "werewolf_meters_walked_face_off": 180,
//                     "werewolf_meters_fallen_face_off": 55,
//                     "werewolf_losses": 1,
//                     "werewolf_deaths_face_off": 1,
//                     "werewolf_losses_face_off": 1,
//                     "werewolf_total_deaths_face_off": 1,
//                     "werewolf_blocks_broken_face_off": 1,
//                     "werewolf_games_played_face_off": 1
//                 },
//                 "Walls": {
//                     "Inventory": {
//                         "35": "345,0"
//                     },
//                     "losses": 5,
//                     "deaths": 6,
//                     "coins": 3484,
//                     "kills": 6,
//                     "monthly_kills_b": 3,
//                     "weekly_kills_b": 2,
//                     "hunter": 0,
//                     "packages": [
//                         "hunter"
//                     ],
//                     "wins": 1,
//                     "monthly_assists_a": 1,
//                     "weekly_wins_a": 1,
//                     "assists": 1,
//                     "weekly_assists_a": 1,
//                     "monthly_wins_a": 1,
//                     "weekly_kills_a": 3,
//                     "monthly_kills_a": 3
//                 },
//                 "HungerGames": {
//                     "kit_permutations_archer": "628745130",
//                     "defaultkit": "Archer",
//                     "kit_permutations_knight": "182345670",
//                     "deaths": 21,
//                     "coins": 2178,
//                     "monthly_kills_b": 5,
//                     "weekly_kills_a": 7,
//                     "kills": 7,
//                     "archer": 3,
//                     "knight": 1,
//                     "autoarmor": true,
//                     "monthly_kills_a": 2,
//                     "lastTourneyAd": 1679713271878
//                 },
//                 "MCGO": {
//                     "kills": 14,
//                     "game_wins": 4,
//                     "headshot_kills": 19,
//                     "cop_kills": 6,
//                     "coins": 121,
//                     "shots_fired": 683,
//                     "round_wins": 21,
//                     "deaths": 23,
//                     "criminal_kills": 8,
//                     "packages": [
//                         "legacyachievementnewnewnew",
//                         "achievement_flag_3"
//                     ],
//                     "mcgo": {
//                         "points": 0
//                     },
//                     "smg_cost_reduction": 1,
//                     "sniper_cost_reduction": 1,
//                     "deaths_deathmatch": 18,
//                     "game_wins_deathmatch": 1,
//                     "criminal_kills_deathmatch": 9,
//                     "game_wins_temple": 1,
//                     "weekly_kills_a": 20,
//                     "kills_deathmatch": 13,
//                     "monthly_kills_b": 20,
//                     "cop_kills_deathmatch": 4,
//                     "sniper_charge_bonus": 2,
//                     "rifle_cost_reduction": 1,
//                     "game_wins_overgrown": 1,
//                     "bombs_planted": 0,
//                     "bombs_defused": 0,
//                     "lastTourneyAd": 1615054953211
//                 },
//                 "Quake": {
//                     "packages": [
//                         "achievement_flag_1",
//                         "sight.yellow",
//                         "case.wood_hoe",
//                         "barrel.small_ball",
//                         "trigger.one_point_five",
//                         "muzzle.none",
//                         "cold_war",
//                         "achievement_flag_3",
//                         "dashcooldown.dash_cooldown"
//                     ],
//                     "sight": "YELLOW",
//                     "case": "WOOD_HOE",
//                     "barrel": "SMALL_BALL",
//                     "trigger": "ONE_POINT_FIVE",
//                     "muzzle": "NONE",
//                     "kills": 46,
//                     "coins": 42118,
//                     "deaths": 50,
//                     "kills_teams": 151,
//                     "killstreaks_teams": 8,
//                     "deaths_teams": 91,
//                     "null": "compass",
//                     "monthly_kills_b": 74,
//                     "wins_teams": 6,
//                     "weekly_kills_b": 18,
//                     "instantRespawn": true,
//                     "monthly_kills_a": 43,
//                     "weekly_kills_a": 55,
//                     "alternative_gun_cooldown_indicator": true,
//                     "compass_selected": true,
//                     "enable_sound": true,
//                     "highest_killstreak": 21,
//                     "lastTourneyAd": 1639948486787,
//                     "messageOthers' Kills/deaths": true,
//                     "messageYour Kills": true,
//                     "messageCoin": true,
//                     "messageYour Deaths": true,
//                     "showDashCooldown": true,
//                     "messageMulti-kills": true,
//                     "messageKillstreaks": true,
//                     "messagePowerup Collections": true,
//                     "headshots": 2,
//                     "distance_travelled": 1779,
//                     "shots_fired": 65,
//                     "kills_since_update_feb_2017": 21,
//                     "killstreaks": 1,
//                     "showKillPrefix": true,
//                     "kills_timeattack": 0,
//                     "kills_dm_teams": 0,
//                     "kills_dm": 0,
//                     "kills_tourney_unknown": 0,
//                     "kills_tourney_quake_solo2_1": 1230,
//                     "distance_travelled_tourney_quake_solo2_1": 44396,
//                     "kills_since_update_feb_2017_tourney_quake_solo2_1": 1230,
//                     "deaths_tourney_quake_solo2_1": 1041,
//                     "shots_fired_tourney_quake_solo2_1": 3559,
//                     "wins_tourney_quake_solo2_1": 15,
//                     "killstreaks_tourney_quake_solo2_1": 42,
//                     "headshots_tourney_quake_solo2_1": 209,
//                     "dash_cooldown": "0",
//                     "kills_solo_tourney": 0
//                 },
//                 "Arena": {
//                     "rating": 1000,
//                     "win_streaks_4v4": 0,
//                     "losses_4v4": 1,
//                     "coins": 345,
//                     "healed_4v4": 200,
//                     "damage_4v4": 335,
//                     "deaths_4v4": 1,
//                     "games_4v4": 1
//                 },
//                 "UHC": {
//                     "coins": 1254,
//                     "deaths": 4,
//                     "equippedKit": "WORKING_TOOLS",
//                     "cache3": true,
//                     "packages": [
//                         "arrows_economy",
//                         "iron_ingots",
//                         "vorpal_sword",
//                         "forge"
//                     ],
//                     "clearup_achievement": true,
//                     "deaths_solo": 3,
//                     "perk_toolsmithing_line_a": 0,
//                     "saved_stats": true,
//                     "perk_engineering_line_a": 0
//                 },
//                 "SuperSmash": {
//                     "lastLevel_THE_BULK": 0,
//                     "active_class": "THE_BULK",
//                     "lastLevel_BOTMUN": 2,
//                     "win_streak": 0,
//                     "class_stats": {
//                         "BOTMUN": {
//                             "batarang": {
//                                 "kills": 13,
//                                 "damage_dealt_normal": 237,
//                                 "smasher_normal": 2,
//                                 "damage_dealt": 1228,
//                                 "smasher": 8,
//                                 "kills_normal": 4,
//                                 "kills_teams": 9,
//                                 "damage_dealt_teams": 991,
//                                 "smasher_teams": 6
//                             },
//                             "melee": {
//                                 "smashed": 4,
//                                 "smashed_normal": 1,
//                                 "smashed_teams": 3,
//                                 "damage_dealt_teams": 8,
//                                 "damage_dealt": 8
//                             },
//                             "deaths": 20,
//                             "smashed_normal": 4,
//                             "games_normal": 2,
//                             "games": 7,
//                             "kills": 16,
//                             "botmubile": {
//                                 "damage_dealt_normal": 48,
//                                 "damage_dealt": 138,
//                                 "damage_dealt_teams": 90,
//                                 "kills_teams": 2,
//                                 "kills": 2
//                             },
//                             "damage_dealt_normal": 285,
//                             "smasher": 8,
//                             "kills_normal": 4,
//                             "smasher_normal": 2,
//                             "smashed": 9,
//                             "damage_dealt": 1388,
//                             "deaths_normal": 6,
//                             "losses": 6,
//                             "losses_normal": 2,
//                             "kills_teams": 12,
//                             "grappling_hook": {
//                                 "kills": 1,
//                                 "kills_teams": 1,
//                                 "damage_dealt": 14,
//                                 "damage_dealt_teams": 14
//                             },
//                             "damage_dealt_teams": 1103,
//                             "deaths_teams": 14,
//                             "games_teams": 5,
//                             "losses_teams": 4,
//                             "smasher_teams": 6,
//                             "wins_teams": 1,
//                             "win_streak": 1,
//                             "win_streak_teams": 1,
//                             "frostbolt": {
//                                 "smashed": 1,
//                                 "smashed_teams": 1
//                             },
//                             "smashed_teams": 5,
//                             "wins": 1,
//                             "homing_missiles": {
//                                 "smashed": 1,
//                                 "smashed_teams": 1
//                             },
//                             "spider_kick": {
//                                 "smashed": 1,
//                                 "smashed_normal": 1
//                             },
//                             "web_shot": {
//                                 "smashed": 1,
//                                 "smashed_normal": 1
//                             },
//                             "spooder_buddies": {
//                                 "smashed": 1,
//                                 "smashed_normal": 1
//                             }
//                         },
//                         "GENERAL_CLUCK": {
//                             "bazooka": {
//                                 "kills": 2,
//                                 "damage_dealt_teams": 482,
//                                 "damage_dealt": 572,
//                                 "smasher_teams": 1,
//                                 "kills_teams": 1,
//                                 "smasher": 1,
//                                 "kills_2v2": 1,
//                                 "damage_dealt_2v2": 90,
//                                 "smashed": 1,
//                                 "smashed_teams": 1
//                             },
//                             "win_streak_teams": 1,
//                             "damage_dealt_teams": 632,
//                             "reinforcements": {
//                                 "damage_dealt": 94,
//                                 "damage_dealt_teams": 94
//                             },
//                             "games": 4,
//                             "deaths": 12,
//                             "wins_teams": 1,
//                             "smashed": 5,
//                             "smashed_teams": 5,
//                             "deaths_teams": 9,
//                             "games_teams": 3,
//                             "win_streak": 1,
//                             "melee": {
//                                 "smashed_teams": 1,
//                                 "smashed": 1
//                             },
//                             "kills_teams": 1,
//                             "damage_dealt": 722,
//                             "wins": 1,
//                             "smasher": 1,
//                             "smasher_teams": 1,
//                             "kills": 2,
//                             "homing_missiles": {
//                                 "smashed": 2,
//                                 "smashed_teams": 2
//                             },
//                             "losses": 3,
//                             "losses_teams": 2,
//                             "damage_dealt_2v2": 90,
//                             "deaths_2v2": 3,
//                             "losses_2v2": 1,
//                             "games_2v2": 1,
//                             "kills_2v2": 1,
//                             "shield_bash": {
//                                 "smashed": 1,
//                                 "smashed_teams": 1
//                             },
//                             "egg_bazooka": {
//                                 "damage_dealt": 56,
//                                 "damage_dealt_teams": 56
//                             }
//                         },
//                         "THE_BULK": {
//                             "seismic_slam": {
//                                 "damage_dealt": 7,
//                                 "damage_dealt_normal": 7
//                             },
//                             "melee": {
//                                 "kills": 1,
//                                 "smasher_normal": 1,
//                                 "smashed_normal": 2,
//                                 "damage_dealt": 122,
//                                 "kills_normal": 1,
//                                 "smasher": 1,
//                                 "damage_dealt_normal": 72,
//                                 "smashed": 2,
//                                 "damage_dealt_teams": 50
//                             },
//                             "monster_charge": {
//                                 "damage_dealt": 30,
//                                 "damage_dealt_normal": 23,
//                                 "damage_dealt_teams": 7
//                             },
//                             "games": 2,
//                             "deaths_normal": 3,
//                             "smasher_normal": 1,
//                             "losses_normal": 1,
//                             "shield_bash": {
//                                 "smashed_normal": 1,
//                                 "smashed": 1
//                             },
//                             "deaths": 5,
//                             "damage_dealt_normal": 193,
//                             "smasher": 1,
//                             "kills": 3,
//                             "boulder": {
//                                 "damage_dealt": 127,
//                                 "damage_dealt_normal": 67,
//                                 "kills_teams": 1,
//                                 "damage_dealt_teams": 60,
//                                 "kills": 1
//                             },
//                             "monster_mash": {
//                                 "damage_dealt": 71,
//                                 "damage_dealt_normal": 24,
//                                 "damage_dealt_teams": 47,
//                                 "kills_teams": 1,
//                                 "kills": 1
//                             },
//                             "smashed": 5,
//                             "smashed_normal": 3,
//                             "damage_dealt": 357,
//                             "kills_normal": 1,
//                             "losses": 2,
//                             "games_normal": 1,
//                             "smashed_teams": 2,
//                             "damage_dealt_teams": 164,
//                             "deaths_teams": 2,
//                             "games_teams": 1,
//                             "laser_cannon": {
//                                 "smashed_teams": 2,
//                                 "smashed": 2
//                             },
//                             "losses_teams": 1,
//                             "kills_teams": 2
//                         }
//                     },
//                     "damage_dealt": 2467,
//                     "smasher": 10,
//                     "coins": 1802,
//                     "losses_weekly_a": 11,
//                     "games_weekly_a": 13,
//                     "losses": 11,
//                     "smashed_normal": 7,
//                     "smasher_normal": 3,
//                     "quits": 6,
//                     "games_monthly_a": 13,
//                     "deaths_normal": 9,
//                     "kills_monthly_a": 21,
//                     "games_normal": 3,
//                     "kills": 21,
//                     "losses_normal": 3,
//                     "smashed": 19,
//                     "kills_normal": 5,
//                     "losses_monthly_a": 11,
//                     "deaths": 37,
//                     "kills_weekly_a": 21,
//                     "games": 13,
//                     "damage_dealt_normal": 478,
//                     "damage_dealt_teams": 1899,
//                     "losses_teams": 7,
//                     "kills_teams": 15,
//                     "smasher_teams": 7,
//                     "deaths_teams": 25,
//                     "games_teams": 9,
//                     "smashed_teams": 12,
//                     "wins": 2,
//                     "wins_weekly_a": 2,
//                     "wins_monthly_a": 2,
//                     "wins_teams": 2,
//                     "xp_GENERAL_CLUCK": 115,
//                     "lastLevel_GENERAL_CLUCK": 1,
//                     "deaths_2v2": 3,
//                     "losses_2v2": 1,
//                     "kills_2v2": 1,
//                     "games_2v2": 1,
//                     "damage_dealt_2v2": 90,
//                     "xp_BOTMUN": 206,
//                     "smash_level_total": 3,
//                     "smashLevel": 3
//                 },
//                 "SpeedUHC": {
//                     "firstJoinLobbyInt": 5,
//                     "killstreak": 0,
//                     "win_streak": 0,
//                     "survived_players_normal": 42,
//                     "deaths_solo_normal": 5,
//                     "deaths": 21,
//                     "deaths_kit_basic_normal_default": 7,
//                     "coins": 1377,
//                     "deaths_mastery_wild_specialist": 21,
//                     "losses": 21,
//                     "deaths_solo": 14,
//                     "losses_mastery_wild_specialist": 21,
//                     "blocks_broken": 6599,
//                     "losses_kit_basic_normal_default": 7,
//                     "survived_players_kit_basic_normal_default": 42,
//                     "deaths_normal": 7,
//                     "losses_normal": 7,
//                     "losses_solo": 14,
//                     "losses_solo_normal": 5,
//                     "survived_players": 123,
//                     "quits": 19,
//                     "blocks_placed": 60,
//                     "survived_players_solo": 72,
//                     "activeKit_NORMAL": "kit_basic_normal_default",
//                     "highestKillstreak": 1,
//                     "activeKit_INSANE": "kit_basic_insane_default",
//                     "arrows_shot": 86,
//                     "kills_monthly_a": 2,
//                     "kills_solo_normal": 1,
//                     "kills_mastery_wild_specialist": 2,
//                     "kills_weekly_b": 1,
//                     "kills": 2,
//                     "tears_gathered": 8,
//                     "items_enchanted": 8,
//                     "kills_solo": 2,
//                     "tears": 8,
//                     "arrows_hit": 25,
//                     "kills_normal": 1,
//                     "kills_kit_basic_normal_default": 1,
//                     "deaths_solo_insane": 9,
//                     "losses_insane": 14,
//                     "losses_solo_insane": 9,
//                     "deaths_insane": 14,
//                     "deaths_kit_basic_insane_default": 14,
//                     "losses_kit_basic_insane_default": 14,
//                     "survived_players_insane": 81,
//                     "survived_players_kit_basic_insane_default": 81,
//                     "deaths_team": 7,
//                     "deaths_team_normal": 2,
//                     "losses_team": 7,
//                     "losses_team_normal": 2,
//                     "survived_players_team": 51,
//                     "losses_team_insane": 5,
//                     "deaths_team_insane": 5,
//                     "assists_insane": 1,
//                     "assists_kit_basic_insane_default": 1,
//                     "assists_solo": 1,
//                     "assists": 1,
//                     "wins": 1,
//                     "games_solo": 1,
//                     "wins_mastery_wild_specialist": 1,
//                     "killstreak_insane": 1,
//                     "wins_insane": 1,
//                     "kills_weekly_a": 1,
//                     "killstreak_solo": 1,
//                     "killstreak_kit_basic_insane_default": 1,
//                     "wins_kit_basic_insane_default": 1,
//                     "kills_insane": 1,
//                     "wins_solo": 1,
//                     "games": 3,
//                     "kills_solo_insane": 1,
//                     "wins_solo_insane": 1,
//                     "games_insane": 3,
//                     "games_kit_basic_insane_default": 3,
//                     "kills_kit_basic_insane_default": 1,
//                     "games_team": 2,
//                     "score": 12,
//                     "movedOver": true
//                 },
//                 "SkyClash": {
//                     "card_packs": 1,
//                     "packages": [
//                         "tip_edit_class",
//                         "tip_open_card_pack",
//                         "tip_play_game",
//                         "auto_card_upgrade",
//                         "kit_assassin",
//                         "tip_buy_kit",
//                         "kit_necromancer",
//                         "tip_upgrade_card"
//                     ],
//                     "class_0": "assassin;RESISTANT;SUPPLY_DROP;RAMPAGE",
//                     "perk_honed_bow_new": false,
//                     "perk_blazing_arrows": 0,
//                     "perk_honed_bow": 0,
//                     "perk_hearty_start_duplicates": 1,
//                     "perk_blazing_arrows_new": false,
//                     "archer_inventory": {
//                         "ARROW:0": "1",
//                         "BOW:0": "0",
//                         "CHAINMAIL_CHESTPLATE:0": "38",
//                         "SKULL_ITEM:3": "4",
//                         "SKULL_ITEM:2": "3",
//                         "SKULL_ITEM:1": "2",
//                         "COMPASS:0": "8"
//                     },
//                     "archer_inventory_auto_equip_armor": true,
//                     "active_class": 0,
//                     "class_1": "necromancer;ENDLESS_QUIVER;SUPPLY_DROP;RAMPAGE",
//                     "killstreak": 0,
//                     "playstreak": 0,
//                     "play_streak": 10,
//                     "longest_bow_shot_kit_archer": 68,
//                     "longest_bow_shot": 68,
//                     "win_streak": 0,
//                     "games_played_kit_archer": 18,
//                     "losses": 25,
//                     "bow_hits_kit_archer": 41,
//                     "losses_team_war": 15,
//                     "bow_hits": 57,
//                     "games_played": 32,
//                     "quits": 30,
//                     "bow_shots": 119,
//                     "deaths": 30,
//                     "coins": 3923,
//                     "bow_shots_kit_archer": 87,
//                     "deaths_team_war": 20,
//                     "deaths_kit_archer": 16,
//                     "deaths_solo": 10,
//                     "losses_solo": 10,
//                     "mobs_killed": 7,
//                     "enderchests_opened": 21,
//                     "mobs_killed_kit_archer": 5,
//                     "enderchests_opened_kit_archer": 13,
//                     "class_2": "archer;ENDLESS_QUIVER;SUPPLY_DROP;TRIPLESHOT",
//                     "spawn_at_witch": 1,
//                     "fastest_win_team_war_kit_archer": 43,
//                     "fastest_win_team_war": 43,
//                     "games": 2,
//                     "team_war_wins": 6,
//                     "wins": 6,
//                     "team_war_wins_kit_archer": 4,
//                     "wins_team_war": 6,
//                     "perk_tripleshot": 0,
//                     "perk_damage_potion": 0,
//                     "perk_tripleshot_new": false,
//                     "perk_damage_potion_new": false,
//                     "perk_regeneration_duplicates": 1,
//                     "highestKillstreak": 2,
//                     "longest_bow_kill_kit_archer": 8,
//                     "longest_bow_kill": 8,
//                     "bow_kills": 1,
//                     "kills": 7,
//                     "kills_kit_archer": 3,
//                     "melee_kills_kit_archer": 2,
//                     "bow_kills_kit_archer": 1,
//                     "most_kills_game": 3,
//                     "melee_kills": 3,
//                     "kills_monthly_a": 6,
//                     "most_kills_game_kit_archer": 2,
//                     "kills_team_war": 6,
//                     "kills_weekly_a": 7,
//                     "assassin_inventory": {
//                         "POTION:14": "3",
//                         "POTION:12": "2",
//                         "ENDER_PEARL:0": "1",
//                         "SKULL_ITEM:3": "6",
//                         "SKULL_ITEM:2": "5",
//                         "SKULL_ITEM:1": "4",
//                         "COMPASS:0": "8",
//                         "STONE_SWORD:0": "0"
//                     },
//                     "fastest_win_team_war_kit_assassin": 78,
//                     "void_kills": 3,
//                     "games_played_kit_assassin": 13,
//                     "team_war_wins_kit_assassin": 2,
//                     "deaths_kit_assassin": 13,
//                     "most_kills_game_kit_assassin": 1,
//                     "void_kills_kit_assassin": 3,
//                     "kills_kit_assassin": 4,
//                     "assists": 1,
//                     "assists_kit_assassin": 1,
//                     "mobs_killed_kit_assassin": 2,
//                     "melee_kills_kit_assassin": 1,
//                     "enderchests_opened_kit_assassin": 4,
//                     "longest_bow_shot_kit_assassin": 6,
//                     "bow_shots_kit_assassin": 18,
//                     "bow_hits_kit_assassin": 8,
//                     "kit_archer_minor": 1,
//                     "perk_alchemy": 0,
//                     "perk_creeper": 0,
//                     "perk_hit_and_run_duplicates": 0,
//                     "perk_alchemy_new": true,
//                     "perk_creeper_new": false,
//                     "perk_pacify": 0,
//                     "perk_damage_potion_duplicates": 1,
//                     "perk_pacify_new": true,
//                     "perk_supply_drop_new": false,
//                     "perk_supply_drop": 0,
//                     "kills_solo": 1,
//                     "perk_endless_quiver": 0,
//                     "perk_sugar_rush": 0,
//                     "perk_endless_quiver_new": false,
//                     "perk_hit_and_run": 1,
//                     "perk_sugar_rush_new": true,
//                     "necromancer_inventory": {
//                         "CHAINMAIL_LEGGINGS:0": "37",
//                         "POTION:12": "1",
//                         "ARROW:0": "3",
//                         "BOW:0": "2",
//                         "MONSTER_EGG:51": "0",
//                         "SKULL_ITEM:3": "6",
//                         "SKULL_ITEM:2": "5",
//                         "SKULL_ITEM:1": "4",
//                         "COMPASS:0": "8"
//                     },
//                     "longest_bow_shot_kit_necromancer": 3,
//                     "deaths_kit_necromancer": 1,
//                     "enderchests_opened_kit_necromancer": 4,
//                     "bow_hits_kit_necromancer": 8,
//                     "games_played_kit_necromancer": 1,
//                     "bow_shots_kit_necromancer": 14,
//                     "deaths_perk_supply_drop": 4,
//                     "kills_perk_supply_drop": 1,
//                     "deaths_perk_tripleshot": 3,
//                     "losses_perk_tripleshot": 2,
//                     "kills_perk_endless_quiver": 1,
//                     "deaths_perk_endless_quiver": 3,
//                     "losses_perk_supply_drop": 3,
//                     "losses_perk_endless_quiver": 2,
//                     "kills_monthly_b": 1,
//                     "kills_perk_tripleshot": 1,
//                     "wins_perk_tripleshot": 1,
//                     "wins_perk_endless_quiver": 1,
//                     "wins_perk_supply_drop": 1,
//                     "losses_perk_rampage": 1,
//                     "deaths_perk_rampage": 1,
//                     "losses_perk_resistant": 1,
//                     "deaths_perk_resistant": 1
//                 },
//                 "Bedwars": {
//                     "packages": [
//                         "tiered_achievement_flag_1",
//                         "glyph_storm",
//                         "killeffect_squid_missile",
//                         "killmessages_bbq",
//                         "tiered_achievement_flag_2",
//                         "capture_book_0",
//                         "leaderboards_resync_mar_2021",
//                         "victorydance_anvil_rain",
//                         "projectiletrail_water",
//                         "killeffect_fire_breath",
//                         "killeffect_lighting_strike",
//                         "victorydance_wither_rider",
//                         "victorydance_special_fireworks",
//                         "islandtopper_chocolate_egg",
//                         "glyph_dog",
//                         "glyph_quack",
//                         "glyph_big_smile",
//                         "islandtopper_basket",
//                         "npcskin_cute_puppy",
//                         "beddestroy_eggsplosion",
//                         "sprays_easter_eggs",
//                         "deathcry_doused_lantern",
//                         "npcskin_blue_rabbit",
//                         "deathcry_enderman",
//                         "islandtopper_carrot",
//                         "islandtopper_bunny",
//                         "sprays_easter_creeper",
//                         "npcskin_bed_salesman",
//                         "npcskin_skeleton",
//                         "glyph_chinese_firecracker",
//                         "killmessages_western",
//                         "deathcry_grumble",
//                         "sprays_grudge",
//                         "beddestroy_firework",
//                         "islandtopper_monocle",
//                         "islandtopper_ghost",
//                         "sprays_year_of_the_ox",
//                         "glyph_thumbs_down",
//                         "beddestroy_pumpkin_explosion",
//                         "killmessages_honourable",
//                         "sprays_disco_pumpkin",
//                         "glyph_moon",
//                         "projectiletrail_lava",
//                         "npcskin_li",
//                         "killeffect_tnt",
//                         "deathcry_howl",
//                         "deathcry_fireball",
//                         "islandtopper_tnt",
//                         "islandtopper_lantern",
//                         "sprays_year_of_the_rat",
//                         "islandtopper_gong",
//                         "glyph_celebration_popper",
//                         "sprays_found_u",
//                         "deathcry_dry_bones",
//                         "killeffect_firework",
//                         "killeffect_campfire",
//                         "deathcry_plop",
//                         "islandtopper_firework_rocket",
//                         "sprays_thanks",
//                         "victorydance_meteor_shower",
//                         "islandtopper_yin_and_yang",
//                         "victorydance_cold_snap",
//                         "glyph_emerald",
//                         "npcskin_zhao",
//                         "islandtopper_temple",
//                         "glyph_blossom",
//                         "projectiletrail_rocket",
//                         "deathcry_bazinga",
//                         "glyph_no",
//                         "sprays_gg_wp",
//                         "deathcry_firework",
//                         "deathcry_robot_mouse",
//                         "projectiletrail_slime",
//                         "deathcry_sad_puppy",
//                         "glyph_squeak",
//                         "deathcry_splash",
//                         "victorydance_yeehaw",
//                         "glyph_bronze_shield",
//                         "projectiletrail_potion",
//                         "sprays_diamond",
//                         "killmessages_squeak",
//                         "projectiletrail_ender",
//                         "sprays_bed_shield",
//                         "islandtopper_bomb",
//                         "sprays_leaping_potion",
//                         "sprays_year_of_the_dog",
//                         "glyph_iron",
//                         "npcskin_bed_researcher",
//                         "projectiletrail_white_smoke",
//                         "glyph_pig",
//                         "islandtopper_pig",
//                         "glyph_sparkle",
//                         "islandtopper_flame",
//                         "deathcry_monster_burp",
//                         "npcskin_holiday_bartender",
//                         "glyph_smiley_face",
//                         "killmessages_fire",
//                         "npcskin_wither_skeleton",
//                         "islandtopper_smiley_face",
//                         "npcskin_zombie",
//                         "projectiletrail_black_smoke",
//                         "victorydance_dragon_rider",
//                         "projectiletrail_blue_dust",
//                         "sprays_bye_bye",
//                         "beddestroy_lighting_strike",
//                         "npcskin_stellar",
//                         "sprays_cat_graffiti",
//                         "sprays_year_of_the_pig",
//                         "npcskin_lucky_cat",
//                         "bw_challenge_no_team_upgrades_collected",
//                         "deathcry_cat_hit",
//                         "npcskin_warrior",
//                         "bw_challenge_no_utilities_collected",
//                         "projectiletrail_bite",
//                         "bw_challenge_selfish_collected",
//                         "bw_challenge_slow_generator_collected",
//                         "killeffect_raining_gold",
//                         "bw_challenge_assassin_collected",
//                         "islandtopper_assassin",
//                         "islandtopper_shopping_cart",
//                         "bw_challenge_reset_armor_collected",
//                         "islandtopper_invisible_villager",
//                         "bw_challenge_invisible_shop_collected",
//                         "bw_challenge_collector_collected",
//                         "islandtopper_collector",
//                         "npcskin_magic_vendor",
//                         "islandtopper_spooky_lantern",
//                         "deathcry_pig",
//                         "glyph_daisy",
//                         "islandtopper_red_envelope",
//                         "npcskin_wei",
//                         "npcskin_king_of_beds",
//                         "victorydance_toy_stick",
//                         "glyph_christmas_tree",
//                         "glyph_gold_shield",
//                         "deathcry_deflated_toy",
//                         "victorydance_twerk_apocalypse",
//                         "npcskin_present_man",
//                         "killeffect_candle",
//                         "glyph_wreath",
//                         "killeffect_snow_globe",
//                         "killmessages_glorious",
//                         "islandtopper_nutcracker",
//                         "deathcry_grumpy_villager",
//                         "projectiletrail_lunar_dust",
//                         "npcskin_witch",
//                         "victorydance_chinese_dragon",
//                         "5_percent_multiplier_tournament",
//                         "glyph_menorah",
//                         "glyph_gift",
//                         "sprays_snowball_fight",
//                         "sprays_santa",
//                         "glyph_snowman",
//                         "deathcry_miracle",
//                         "sprays_peaceful",
//                         "sprays_christmas_tree",
//                         "sprays_angry_turkey",
//                         "islandtopper_dreidel",
//                         "npcskin_chen",
//                         "sprays_dragon",
//                         "islandtopper_christmas_hat",
//                         "islandtopper_reindeer",
//                         "deathcry_gone",
//                         "glyph_candy_cane",
//                         "npcskin_villager_zombie",
//                         "glyph_holly",
//                         "sprays_angry_cow",
//                         "projectiletrail_red_dust",
//                         "killeffect_xp_orb",
//                         "glyph_spectrum",
//                         "npcskin_xiu",
//                         "npcskin_bao",
//                         "glyph_burn",
//                         "islandtopper_candles",
//                         "glyph_earth",
//                         "islandtopper_ox",
//                         "killmessages_woof_woof",
//                         "npcskin_zombie_pigman",
//                         "sprays_lion_dancer",
//                         "glyph_thumbs_up",
//                         "sprays_year_of_the_tiger",
//                         "projectiletrail_notes",
//                         "islandtopper_mark_of_the_paw",
//                         "sprays_pig_peace",
//                         "islandtopper_sword",
//                         "projectiletrail_magic",
//                         "islandtopper_sheep",
//                         "killmessages_primal",
//                         "glyph_gold_lunar",
//                         "beddestroy_ghosts",
//                         "glyph_hi",
//                         "projectiletrail_purple_dust",
//                         "npcskin_mouse",
//                         "sprays_pumpkin",
//                         "deathcry_dinosaur",
//                         "killmessages_buzz",
//                         "islandtopper_temple_hut",
//                         "sprays_pumpkinz",
//                         "islandtopper_dead_tree",
//                         "killeffect_cookie_fountain",
//                         "sprays_invisibility_potion",
//                         "npcskin_enderman",
//                         "npcskin_blaze",
//                         "killeffect_head_rocket",
//                         "victorydance_pumpkin_patch",
//                         "victorydance_night_shift",
//                         "victorydance_terror",
//                         "killeffect_kill_counter_holo",
//                         "glyph_spider",
//                         "projectiletrail_hanukkah",
//                         "sprays_good_fortune",
//                         "beddestroy_glyph",
//                         "beddestroy_lava_explosion",
//                         "islandtopper_tree",
//                         "islandtopper_fish_bowl",
//                         "deathcry_scurry",
//                         "victorydance_floating_lanterns",
//                         "islandtopper_rainbow_sheep",
//                         "killmessages_to_the_moon",
//                         "killmessages_eggy",
//                         "glyph_lion_dancer",
//                         "victorydance_snow_bomber",
//                         "beddestroy_shattering_ice_bed",
//                         "killeffect_frozen_in_time",
//                         "victorydance_winter_twister",
//                         "sprays_tnt_drop",
//                         "sprays_sorry",
//                         "islandtopper_bell",
//                         "sprays_lantern",
//                         "killmessages_oxed",
//                         "killmessages_pirate",
//                         "sprays_surprise_snowball",
//                         "killeffect_crackling_ice",
//                         "islandtopper_chicken",
//                         "glyph_lol",
//                         "npcskin_snowman",
//                         "islandtopper_candy_cane",
//                         "glyph_diamond",
//                         "sprays_ox_costume",
//                         "glyph_gg",
//                         "glyph_star",
//                         "islandtopper_note",
//                         "killeffect_burning_shoes",
//                         "glyph_orange",
//                         "beddestroy_squid_missile",
//                         "killeffect_lit",
//                         "sprays_curled_ox",
//                         "glyph_silver_shield",
//                         "glyph_creeper_scream",
//                         "killmessages_oink",
//                         "sprays_golem_riding",
//                         "islandtopper_slime",
//                         "islandtopper_witchs_potion",
//                         "npcskin_green_cow_pajamas",
//                         "killeffect_raining_eggs",
//                         "sprays_easter_basket",
//                         "victorydance_puppy_party",
//                         "bw_challenge_defuser_collected",
//                         "npcskin_defuser",
//                         "sprays_great_egg_hunt",
//                         "npcskin_red_frog_pajamas",
//                         "glyph_hot_cross_bun",
//                         "sprays_bunny_gg",
//                         "victorydance_rainbow_dolly",
//                         "sprays_rabbit_costume",
//                         "islandtopper_hatching_egg",
//                         "victorydance_flower_bed",
//                         "glyph_lantern",
//                         "islandtopper_bleeding_heart",
//                         "bw_challenge_no_healing_collected",
//                         "bw_challenge_mining_fatigue_collected",
//                         "islandtopper_lazy_miner",
//                         "bw_challenge_hotbar_collected",
//                         "islandtopper_bunny_in_hat",
//                         "killeffect_anvil_smash",
//                         "bw_challenge_weighted_items_collected",
//                         "npcskin_lumberjack",
//                         "bw_challenge_woodworker_collected",
//                         "projectiletrail_the_end_trail",
//                         "bw_challenge_no_swords_collected",
//                         "killmessages_bridging_for_dummies",
//                         "bw_challenge_sponge_collected",
//                         "bw_challenge_knockback_stick_only_collected",
//                         "killmessages_social_distancing",
//                         "sprays_fireworks",
//                         "glyph_easter_flower",
//                         "sprays_year_of_the_rabbit",
//                         "islandtopper_dragon_head",
//                         "sprays_hypixel_logo_default",
//                         "npcskin_patriot_eagle",
//                         "bw_challenge_patriot_collected",
//                         "islandtopper_stoplight",
//                         "bw_challenge_stop_light_collected",
//                         "npcskin_merchant",
//                         "bw_challenge_capped_resources_collected",
//                         "islandtopper_fountain_firework",
//                         "glyph_yes",
//                         "islandtopper_toxic_rain",
//                         "bw_challenge_toxic_rain_collected",
//                         "bw_challenge_archer_only_collected",
//                         "islandtopper_ballista",
//                         "npcskin_marksman",
//                         "bw_challenge_protect_the_president_collected",
//                         "npcskin_president_sloth",
//                         "islandtopper_president_goons",
//                         "glyph_sword",
//                         "beddestroy_thief",
//                         "glyph_dragon",
//                         "islandtopper_top_hat",
//                         "projectiletrail_cheese",
//                         "islandtopper_assassin_sword",
//                         "bw_challenge_master_assassin_collected",
//                         "glyph_rose",
//                         "islandtopper_small_rabbit",
//                         "killeffect_smiley",
//                         "sprays_creeper",
//                         "glyph_gold",
//                         "killeffect_pigsmash",
//                         "killeffect_rekt",
//                         "islandtopper_fancy_helmet",
//                         "islandtopper_treasure_chest",
//                         "killeffect_piñata",
//                         "killeffect_cow_rocket",
//                         "sprays_i_love_you",
//                         "killmessages_love",
//                         "glyph_bed",
//                         "deathcry_ding",
//                         "islandtopper_large_rabbit",
//                         "glyph_cute_pumpkin",
//                         "sprays_boo",
//                         "glyph_halloween",
//                         "sprays_perfect_sword_throw",
//                         "killeffect_blood_bats",
//                         "projectiletrail_howling_wind",
//                         "killeffect_skeletalremains",
//                         "killeffect_after_life",
//                         "islandtopper_spooky_hypixel",
//                         "projectiletrail_spiders_silk",
//                         "projectiletrail_cursedflame",
//                         "projectiletrail_wisp_whirlwind",
//                         "victorydance_graveyardrave",
//                         "islandtopper_new_ghost",
//                         "glyph_tiger",
//                         "npcskin_killer",
//                         "woodskin_acacia_log",
//                         "woodskin_oak_log",
//                         "woodskin_spruce_log",
//                         "woodskin_birch_log",
//                         "woodskin_jungle_log",
//                         "woodskin_dark_oak_log",
//                         "victorydance_pumpkin_laser",
//                         "killeffect_haunted",
//                         "deathcry_dark_portal",
//                         "killeffect_batcrux",
//                         "sprays_faboolous",
//                         "victorydance_raining_pigs",
//                         "islandtopper_pot",
//                         "sprays_sleeps_and_treats",
//                         "glyph_eyeball",
//                         "glyph_tnt",
//                         "npcskin_skeletor",
//                         "killeffect_black_mark",
//                         "glyph_cry_face",
//                         "sprays_carried",
//                         "sprays_witch_please",
//                         "islandtopper_frankenstein",
//                         "glyph_player_face",
//                         "killmessages_roar",
//                         "projectileTrail_magic_wind",
//                         "sprays_reveillon",
//                         "islandtopper_sun_glasses",
//                         "killmessages_festive",
//                         "islandtopper_angel",
//                         "islandtopper_robin",
//                         "projectileTrail_let_there_be_leather",
//                         "sprays_santa_slips",
//                         "islandtopper_lunar_dragon",
//                         "glyph_reindeer",
//                         "killmessages_limbo",
//                         "npcskin_santa",
//                         "figurine_don_espresso",
//                         "figurine_hammer_vs_heatwave",
//                         "figurine_kart_racing",
//                         "figurine_ratman",
//                         "npcskin_ratman",
//                         "killeffect_team_destroy",
//                         "figurine_blitz_star",
//                         "figurine_executives_meeting",
//                         "victorydance_kartaway",
//                         "killeffect_pedestal",
//                         "sprays_snow_angel",
//                         "victorydance_festive_music",
//                         "sprays_sweet_dreams",
//                         "killmessages_santa_workshop",
//                         "sprays_festive_harbinger",
//                         "sprays_snowball_spammer",
//                         "islandtopper_presents",
//                         "killmessages_celebratory",
//                         "victorydance_snowed_in",
//                         "npcskin_penguin",
//                         "glyph_shock_face",
//                         "sprays_lucky_rabbit",
//                         "projectileTrail_snowball_rain",
//                         "islandtopper_heart",
//                         "figurine_enderman",
//                         "figurine_ender_pearl",
//                         "killeffect_balloons",
//                         "figurine_alchemy",
//                         "islandtopper_tall_carrot",
//                         "npcskin_grinch",
//                         "killeffect_holiday_fireworks",
//                         "sprays_smug_pig",
//                         "islandtopper_gold_present",
//                         "sprays_decorative_island",
//                         "glyph_heart",
//                         "victorydance_to_build_a_snowman",
//                         "sprays_mistletoe",
//                         "figurine_iron_punch",
//                         "figurine_emeralds",
//                         "islandtopper_tiger",
//                         "figurine_golden_apple",
//                         "figurine_creeper",
//                         "figurine_sniper",
//                         "figurine_sky_island",
//                         "figurine_crossed_swords",
//                         "figurine_shears",
//                         "beddestroy_pigsplosion",
//                         "sprays_menorah",
//                         "victorydance_abominable_snowman",
//                         "victorydance_hurricanehell",
//                         "beddestroy_pig_missile",
//                         "beddestroy_tornado",
//                         "beddestroy_blizzard",
//                         "killmessages_wrapped_up",
//                         "killmessages_snow_storm",
//                         "killmessages_memed",
//                         "figurine_alex",
//                         "figurine_zombie",
//                         "figurine_hot_air_balloon",
//                         "figurine_guardian",
//                         "figurine_diamond_hoe",
//                         "glyph_red_envelope",
//                         "figurine_defended_bed",
//                         "projectileTrail_green_star",
//                         "npcskin_upside_down_snowman",
//                         "figurine_regular_sandman",
//                         "victorydance_dreamscape",
//                         "figurine_golden_sandman",
//                         "victorydance_figurine_rain",
//                         "killmessages_multiverse",
//                         "npcskin_you",
//                         "npcskin_wither_tower",
//                         "projectileTrail_slumber",
//                         "projectileTrail_meteorblaze",
//                         "npcskin_man_wearing_suit",
//                         "npcskin_spaceman",
//                         "killeffect_heartbeat",
//                         "npcskin_slumber_receptionist",
//                         "killeffect_golemyeet",
//                         "npcskin_lester_brody",
//                         "npcskin_john_indigos",
//                         "npcskin_oasis_spirit",
//                         "npcskin_heatwave",
//                         "npcskin_hammer",
//                         "islandtopper_brick_house",
//                         "npcskin_cluck_stack",
//                         "figurine_missing_bed",
//                         "figurine_the_pit",
//                         "figurine_dante"
//                     ],
//                     "first_join_7": true,
//                     "bedwars_boxes": 0,
//                     "Experience": 1696511,
//                     "bedwars_box_commons": 2,
//                     "chest_history_new": [
//                         "islandtopper_brick_house",
//                         "killmessages_fire",
//                         "sprays_year_of_the_dog",
//                         "sprays_leaping_potion",
//                         "sprays_reveillon"
//                     ],
//                     "bedwars_box": 2,
//                     "bedwars_box_rares": 1,
//                     "activeKillEffect": "killeffect_frozen_in_time",
//                     "spray_glyph_field": "NONE,NONE,STORM,STORM,NONE,NONE",
//                     "games_played_bedwars_1": 2864,
//                     "gold_resources_collected_bedwars": 88228,
//                     "void_deaths_bedwars": 4473,
//                     "four_four__items_purchased_bedwars": 32792,
//                     "void_kills_bedwars": 2211,
//                     "diamond_resources_collected_bedwars": 21464,
//                     "deaths_bedwars": 9839,
//                     "emerald_resources_collected_bedwars": 8651,
//                     "resources_collected_bedwars": 782470,
//                     "four_four_permanent _items_purchased_bedwars": 7,
//                     "four_four_void_kills_bedwars": 1067,
//                     "four_four_kills_bedwars": 2494,
//                     "coins": 726281,
//                     "games_played_bedwars": 2505,
//                     "permanent _items_purchased_bedwars": 16,
//                     "fall_kills_bedwars": 181,
//                     "four_four_deaths_bedwars": 4773,
//                     "four_four_gold_resources_collected_bedwars": 38884,
//                     "four_four_diamond_resources_collected_bedwars": 8148,
//                     "four_four_entity_attack_deaths_bedwars": 2507,
//                     "four_four_iron_resources_collected_bedwars": 353789,
//                     "kills_bedwars": 5301,
//                     "entity_attack_kills_bedwars": 2851,
//                     "four_four_games_played_bedwars": 1242,
//                     "four_four_wins_bedwars": 1026,
//                     "four_four_fall_kills_bedwars": 84,
//                     "entity_attack_deaths_bedwars": 4957,
//                     "items_purchased_bedwars": 70092,
//                     "wins_bedwars": 1900,
//                     "four_four_resources_collected_bedwars": 403984,
//                     "four_four_void_deaths_bedwars": 2050,
//                     "four_four_items_purchased_bedwars": 36195,
//                     "iron_resources_collected_bedwars": 664127,
//                     "_items_purchased_bedwars": 63280,
//                     "four_four_entity_attack_kills_bedwars": 1309,
//                     "four_four_emerald_resources_collected_bedwars": 3163,
//                     "final_deaths_bedwars": 676,
//                     "entity_attack_final_deaths_bedwars": 428,
//                     "four_four_final_deaths_bedwars": 255,
//                     "four_four_beds_lost_bedwars": 328,
//                     "four_four_losses_bedwars": 214,
//                     "beds_lost_bedwars": 818,
//                     "four_four_entity_attack_final_deaths_bedwars": 155,
//                     "losses_bedwars": 594,
//                     "eight_one_beds_lost_bedwars": 7,
//                     "eight_one_items_purchased_bedwars": 263,
//                     "eight_one_diamond_resources_collected_bedwars": 131,
//                     "eight_one_final_deaths_bedwars": 8,
//                     "eight_one_games_played_bedwars": 14,
//                     "eight_one_entity_attack_final_deaths_bedwars": 6,
//                     "eight_one_losses_bedwars": 9,
//                     "eight_one_iron_resources_collected_bedwars": 2290,
//                     "eight_one_resources_collected_bedwars": 2996,
//                     "eight_one__items_purchased_bedwars": 246,
//                     "eight_one_gold_resources_collected_bedwars": 534,
//                     "eight_one_entity_attack_final_kills_bedwars": 23,
//                     "eight_one_deaths_bedwars": 29,
//                     "eight_one_void_deaths_bedwars": 16,
//                     "eight_one_entity_attack_deaths_bedwars": 12,
//                     "eight_one_final_kills_bedwars": 25,
//                     "eight_one_beds_broken_bedwars": 28,
//                     "entity_attack_final_kills_bedwars": 2759,
//                     "eight_one_emerald_resources_collected_bedwars": 41,
//                     "eight_one_permanent _items_purchased_bedwars": 8,
//                     "eight_one_entity_attack_kills_bedwars": 22,
//                     "eight_one_kills_bedwars": 26,
//                     "final_kills_bedwars": 4332,
//                     "beds_broken_bedwars": 1366,
//                     "understands_resource_bank": true,
//                     "favourites_2": "wool,stone_sword,stick_(knockback_i),wooden_pickaxe,fireball,null,invisibility_potion_(30_seconds),oak_wood_planks,iron_sword,iron_boots,shears,golden_apple,ender_pearl,jump_v_potion_(45_seconds),end_stone,diamond_sword,compact_pop-up_tower,wooden_axe,arrow,tnt,magic_milk",
//                     "castle_beds_lost_bedwars": 23,
//                     "castle_permanent _items_purchased_bedwars": 11,
//                     "castle_deaths_bedwars": 45,
//                     "castle_entity_attack_final_deaths_bedwars": 3,
//                     "castle__items_purchased_bedwars": 445,
//                     "castle_final_deaths_bedwars": 6,
//                     "castle_items_purchased_bedwars": 485,
//                     "castle_gold_resources_collected_bedwars": 1108,
//                     "castle_resources_collected_bedwars": 6693,
//                     "castle_losses_bedwars": 7,
//                     "castle_void_deaths_bedwars": 24,
//                     "castle_iron_resources_collected_bedwars": 5218,
//                     "castle_games_played_bedwars": 11,
//                     "castle_void_final_deaths_bedwars": 3,
//                     "castle_fall_kills_bedwars": 3,
//                     "castle_entity_attack_kills_bedwars": 9,
//                     "castle_diamond_resources_collected_bedwars": 344,
//                     "castle_entity_attack_deaths_bedwars": 13,
//                     "castle_emerald_resources_collected_bedwars": 23,
//                     "castle_void_kills_bedwars": 12,
//                     "castle_kills_bedwars": 27,
//                     "favorite_slots": "Melee,Blocks,Tools,Tools,Tools,Ranged,Utility,Potions,Potions",
//                     "eight_one_wins_bedwars": 4,
//                     "understands_streaks": true,
//                     "castle_projectile_deaths_bedwars": 1,
//                     "castle_wins_bedwars": 5,
//                     "castle_projectile_kills_bedwars": 2,
//                     "castle_fall_deaths_bedwars": 5,
//                     "castle_entity_attack_final_kills_bedwars": 6,
//                     "castle_final_kills_bedwars": 8,
//                     "eight_two_rush_items_purchased_bedwars": 17,
//                     "eight_two_rush_losses_bedwars": 5,
//                     "eight_two_rush__items_purchased_bedwars": 17,
//                     "eight_two_rush_resources_collected_bedwars": 185,
//                     "eight_two_rush_emerald_resources_collected_bedwars": 6,
//                     "eight_two_rush_diamond_resources_collected_bedwars": 4,
//                     "eight_two_rush_entity_attack_final_deaths_bedwars": 3,
//                     "eight_two_rush_gold_resources_collected_bedwars": 24,
//                     "eight_two_rush_games_played_bedwars": 5,
//                     "eight_two_rush_beds_lost_bedwars": 4,
//                     "eight_two_rush_final_deaths_bedwars": 4,
//                     "eight_two_rush_iron_resources_collected_bedwars": 151,
//                     "eight_two_rush_void_deaths_bedwars": 1,
//                     "eight_two_rush_deaths_bedwars": 3,
//                     "eight_two_rush_entity_attack_deaths_bedwars": 2,
//                     "eight_two_rush_void_final_deaths_bedwars": 1,
//                     "four_four_rush_kills_bedwars": 84,
//                     "four_four_rush_losses_bedwars": 26,
//                     "four_four_rush_items_purchased_bedwars": 1224,
//                     "four_four_rush_games_played_bedwars": 50,
//                     "four_four_rush_deaths_bedwars": 123,
//                     "four_four_rush_entity_attack_final_deaths_bedwars": 19,
//                     "four_four_rush_beds_lost_bedwars": 32,
//                     "four_four_rush_entity_attack_deaths_bedwars": 61,
//                     "four_four_rush_gold_resources_collected_bedwars": 1171,
//                     "four_four_rush_resources_collected_bedwars": 13381,
//                     "four_four_rush_void_kills_bedwars": 24,
//                     "four_four_rush_diamond_resources_collected_bedwars": 484,
//                     "four_four_rush_final_deaths_bedwars": 28,
//                     "four_four_rush__items_purchased_bedwars": 1093,
//                     "four_four_rush_iron_resources_collected_bedwars": 11215,
//                     "four_four_rush_void_deaths_bedwars": 58,
//                     "eight_two_rush_beds_broken_bedwars": 1,
//                     "eight_two_resources_collected_bedwars": 98989,
//                     "eight_two_diamond_resources_collected_bedwars": 3113,
//                     "eight_two_entity_attack_final_kills_bedwars": 261,
//                     "eight_two_iron_resources_collected_bedwars": 83276,
//                     "eight_two_final_deaths_bedwars": 173,
//                     "eight_two__items_purchased_bedwars": 7161,
//                     "eight_two_entity_attack_final_deaths_bedwars": 111,
//                     "eight_two_games_played_bedwars": 293,
//                     "eight_two_items_purchased_bedwars": 7852,
//                     "eight_two_beds_lost_bedwars": 189,
//                     "eight_two_gold_resources_collected_bedwars": 10727,
//                     "eight_two_losses_bedwars": 166,
//                     "eight_two_final_kills_bedwars": 425,
//                     "eight_one_rush_final_deaths_bedwars": 1,
//                     "eight_one_rush_void_final_deaths_bedwars": 1,
//                     "eight_one_rush_items_purchased_bedwars": 1,
//                     "eight_one_rush_gold_resources_collected_bedwars": 2,
//                     "eight_one_rush_resources_collected_bedwars": 8,
//                     "eight_one_rush_beds_lost_bedwars": 1,
//                     "eight_one_rush__items_purchased_bedwars": 1,
//                     "eight_one_rush_games_played_bedwars": 1,
//                     "eight_one_rush_emerald_resources_collected_bedwars": 1,
//                     "eight_one_rush_losses_bedwars": 1,
//                     "eight_one_rush_iron_resources_collected_bedwars": 5,
//                     "four_four_rush_emerald_resources_collected_bedwars": 511,
//                     "four_four_rush_entity_attack_final_kills_bedwars": 47,
//                     "four_four_rush_entity_attack_kills_bedwars": 57,
//                     "four_four_rush_final_kills_bedwars": 75,
//                     "four_four_rush_permanent _items_purchased_bedwars": 10,
//                     "four_four_rush_wins_bedwars": 24,
//                     "four_four_rush_void_final_kills_bedwars": 23,
//                     "bedwars_halloween_boxes": 0,
//                     "four_three__items_purchased_bedwars": 23048,
//                     "four_three_beds_lost_bedwars": 293,
//                     "four_three_deaths_bedwars": 3925,
//                     "four_three_diamond_resources_collected_bedwars": 10072,
//                     "four_three_emerald_resources_collected_bedwars": 3564,
//                     "four_three_entity_attack_deaths_bedwars": 1919,
//                     "four_three_entity_attack_final_deaths_bedwars": 156,
//                     "four_three_entity_attack_kills_bedwars": 1195,
//                     "four_three_final_deaths_bedwars": 239,
//                     "four_three_games_played_bedwars": 953,
//                     "four_three_gold_resources_collected_bedwars": 38050,
//                     "four_three_iron_resources_collected_bedwars": 224317,
//                     "four_three_items_purchased_bedwars": 25744,
//                     "four_three_kills_bedwars": 2162,
//                     "four_three_losses_bedwars": 204,
//                     "four_three_resources_collected_bedwars": 276003,
//                     "four_three_void_deaths_bedwars": 1844,
//                     "four_three_permanent _items_purchased_bedwars": 1,
//                     "four_three_void_kills_bedwars": 868,
//                     "four_four_voidless__items_purchased_bedwars": 81,
//                     "four_four_voidless_deaths_bedwars": 13,
//                     "four_four_voidless_diamond_resources_collected_bedwars": 16,
//                     "four_four_voidless_entity_attack_deaths_bedwars": 10,
//                     "four_four_voidless_entity_attack_kills_bedwars": 3,
//                     "four_four_voidless_games_played_bedwars": 6,
//                     "four_four_voidless_gold_resources_collected_bedwars": 103,
//                     "four_four_voidless_iron_resources_collected_bedwars": 930,
//                     "four_four_voidless_items_purchased_bedwars": 94,
//                     "four_four_voidless_kills_bedwars": 4,
//                     "four_four_voidless_permanent _items_purchased_bedwars": 2,
//                     "four_four_voidless_resources_collected_bedwars": 1052,
//                     "four_four_voidless_void_deaths_bedwars": 1,
//                     "four_four_voidless_wins_bedwars": 4,
//                     "eight_two_void_final_deaths_bedwars": 60,
//                     "void_final_deaths_bedwars": 226,
//                     "eight_two_deaths_bedwars": 1106,
//                     "eight_two_emerald_resources_collected_bedwars": 1873,
//                     "eight_two_entity_attack_deaths_bedwars": 514,
//                     "eight_two_entity_attack_kills_bedwars": 323,
//                     "eight_two_kills_bedwars": 616,
//                     "eight_two_permanent_items_purchased_bedwars": 691,
//                     "eight_two_void_final_kills_bedwars": 134,
//                     "eight_two_void_kills_bedwars": 271,
//                     "permanent_items_purchased_bedwars": 6796,
//                     "void_final_kills_bedwars": 1265,
//                     "eight_two_void_deaths_bedwars": 562,
//                     "eight_two_beds_broken_bedwars": 232,
//                     "eight_two_entity_explosion_deaths_bedwars": 4,
//                     "eight_two_fall_kills_bedwars": 17,
//                     "eight_two_wins_bedwars": 125,
//                     "entity_explosion_deaths_bedwars": 32,
//                     "eight_two_magic_final_kills_bedwars": 18,
//                     "magic_final_kills_bedwars": 163,
//                     "eight_two_armed__items_purchased_bedwars": 20,
//                     "eight_two_armed_deaths_bedwars": 15,
//                     "eight_two_armed_diamond_resources_collected_bedwars": 20,
//                     "eight_two_armed_entity_attack_deaths_bedwars": 2,
//                     "eight_two_armed_final_kills_bedwars": 2,
//                     "eight_two_armed_games_played_bedwars": 2,
//                     "eight_two_armed_gold_resources_collected_bedwars": 38,
//                     "eight_two_armed_iron_resources_collected_bedwars": 477,
//                     "eight_two_armed_items_purchased_bedwars": 23,
//                     "eight_two_armed_kills_bedwars": 6,
//                     "eight_two_armed_permanent_items_purchased_bedwars": 3,
//                     "eight_two_armed_projectile_deaths_bedwars": 10,
//                     "eight_two_armed_projectile_final_kills_bedwars": 1,
//                     "eight_two_armed_projectile_kills_bedwars": 5,
//                     "eight_two_armed_resources_collected_bedwars": 535,
//                     "eight_two_armed_void_deaths_bedwars": 3,
//                     "eight_two_armed_void_kills_bedwars": 1,
//                     "eight_two_armed_wins_bedwars": 1,
//                     "eight_two_armed_beds_lost_bedwars": 1,
//                     "eight_two_armed_entity_attack_final_kills_bedwars": 1,
//                     "eight_two_armed_final_deaths_bedwars": 1,
//                     "eight_two_armed_losses_bedwars": 1,
//                     "eight_two_armed_projectile_final_deaths_bedwars": 1,
//                     "eight_two_fall_deaths_bedwars": 21,
//                     "fall_deaths_bedwars": 296,
//                     "eight_two_entity_explosion_kills_bedwars": 1,
//                     "entity_explosion_kills_bedwars": 15,
//                     "eight_two_fall_final_kills_bedwars": 11,
//                     "fall_final_kills_bedwars": 117,
//                     "eight_one_permanent_items_purchased_bedwars": 9,
//                     "eight_one_void_kills_bedwars": 4,
//                     "bedwars_christmas_boxes": 6,
//                     "eight_one_void_final_kills_bedwars": 1,
//                     "eight_one_magic_deaths_bedwars": 1,
//                     "magic_deaths_bedwars": 33,
//                     "four_four_permanent_items_purchased_bedwars": 3396,
//                     "four_four_fall_final_kills_bedwars": 76,
//                     "four_four_final_kills_bedwars": 2403,
//                     "four_four_beds_broken_bedwars": 603,
//                     "four_four_entity_attack_final_kills_bedwars": 1538,
//                     "four_three_beds_broken_bedwars": 502,
//                     "four_three_permanent_items_purchased_bedwars": 2695,
//                     "entity_explosion_final_deaths_bedwars": 5,
//                     "four_four_entity_explosion_final_deaths_bedwars": 4,
//                     "four_four_void_final_kills_bedwars": 681,
//                     "four_four_fall_deaths_bedwars": 145,
//                     "four_four_void_final_deaths_bedwars": 89,
//                     "four_three_final_kills_bedwars": 1478,
//                     "four_three_void_final_kills_bedwars": 449,
//                     "four_three_wins_bedwars": 743,
//                     "four_three_entity_attack_final_kills_bedwars": 936,
//                     "four_three_projectile_deaths_bedwars": 6,
//                     "four_three_projectile_kills_bedwars": 8,
//                     "projectile_deaths_bedwars": 20,
//                     "projectile_kills_bedwars": 21,
//                     "four_four_magic_final_kills_bedwars": 88,
//                     "activeBedDestroy": "beddestroy_lighting_strike",
//                     "activeVictoryDance": "victorydance_kartaway",
//                     "four_four_magic_final_deaths_bedwars": 1,
//                     "magic_final_deaths_bedwars": 5,
//                     "four_four_entity_explosion_deaths_bedwars": 22,
//                     "four_four_entity_explosion_kills_bedwars": 9,
//                     "castle_permanent_items_purchased_bedwars": 29,
//                     "four_three_magic_final_kills_bedwars": 56,
//                     "four_three_magic_final_deaths_bedwars": 3,
//                     "four_three_fall_deaths_bedwars": 130,
//                     "four_three_fall_kills_bedwars": 80,
//                     "practice": {
//                         "records": {
//                             "bridging_distance_30:elevation_NONE:angle_STRAIGHT:": 14934
//                         },
//                         "bridging": {
//                             "failed_attempts": 226,
//                             "blocks_placed": 1877,
//                             "successful_attempts": 9
//                         },
//                         "selected": "BRIDGING",
//                         "fireball_jumping": {
//                             "successful_attempts": 261,
//                             "failed_attempts": 98,
//                             "blocks_placed": 6
//                         }
//                     },
//                     "four_three_void_final_deaths_bedwars": 74,
//                     "four_three_magic_deaths_bedwars": 9,
//                     "activeProjectileTrail": "projectileTrail_none",
//                     "activeNPCSkin": "npcskin_cluck_stack",
//                     "four_four_voidless_beds_broken_bedwars": 3,
//                     "four_four_voidless_beds_lost_bedwars": 3,
//                     "four_four_voidless_entity_attack_final_deaths_bedwars": 2,
//                     "four_four_voidless_entity_attack_final_kills_bedwars": 12,
//                     "four_four_voidless_final_deaths_bedwars": 2,
//                     "four_four_voidless_final_kills_bedwars": 13,
//                     "four_four_voidless_losses_bedwars": 2,
//                     "four_four_voidless_permanent_items_purchased_bedwars": 11,
//                     "fall_final_deaths_bedwars": 8,
//                     "four_four_fall_final_deaths_bedwars": 4,
//                     "fire_tick_deaths_bedwars": 22,
//                     "four_four_fire_tick_deaths_bedwars": 13,
//                     "eight_one_magic_final_kills_bedwars": 1,
//                     "eight_one_void_final_deaths_bedwars": 2,
//                     "four_four_lucky__items_purchased_bedwars": 2166,
//                     "four_four_lucky_deaths_bedwars": 180,
//                     "four_four_lucky_diamond_resources_collected_bedwars": 447,
//                     "four_four_lucky_entity_attack_deaths_bedwars": 85,
//                     "four_four_lucky_entity_attack_final_kills_bedwars": 37,
//                     "four_four_lucky_final_kills_bedwars": 57,
//                     "four_four_lucky_games_played_bedwars": 45,
//                     "four_four_lucky_gold_resources_collected_bedwars": 1926,
//                     "four_four_lucky_iron_resources_collected_bedwars": 17644,
//                     "four_four_lucky_items_purchased_bedwars": 2283,
//                     "four_four_lucky_permanent_items_purchased_bedwars": 117,
//                     "four_four_lucky_resources_collected_bedwars": 20209,
//                     "four_four_lucky_void_deaths_bedwars": 77,
//                     "four_four_lucky_wins_bedwars": 26,
//                     "four_four_lucky_beds_lost_bedwars": 28,
//                     "four_four_lucky_emerald_resources_collected_bedwars": 189,
//                     "four_four_lucky_fall_deaths_bedwars": 6,
//                     "four_four_lucky_fire_tick_deaths_bedwars": 3,
//                     "four_four_lucky_kills_bedwars": 106,
//                     "four_four_lucky_void_kills_bedwars": 49,
//                     "four_four_lucky_final_deaths_bedwars": 24,
//                     "four_four_lucky_void_final_deaths_bedwars": 7,
//                     "four_four_lucky_projectile_deaths_bedwars": 3,
//                     "four_four_lucky_beds_broken_bedwars": 17,
//                     "four_four_lucky_entity_attack_final_deaths_bedwars": 14,
//                     "four_four_lucky_entity_attack_kills_bedwars": 50,
//                     "four_four_lucky_losses_bedwars": 19,
//                     "four_four_lucky_bed_resources_collected_bedwars": 3,
//                     "four_three_fall_final_kills_bedwars": 30,
//                     "four_four_lucky_magic_kills_bedwars": 2,
//                     "four_four_lucky_entity_explosion_deaths_bedwars": 1,
//                     "four_four_lucky_magic_deaths_bedwars": 5,
//                     "four_four_lucky_void_final_kills_bedwars": 12,
//                     "four_three_entity_explosion_deaths_bedwars": 6,
//                     "eight_two_magic_deaths_bedwars": 2,
//                     "four_four_magic_deaths_bedwars": 21,
//                     "bedwars_easter_boxes": 0,
//                     "eight_two_projectile_deaths_bedwars": 1,
//                     "castle_magic_deaths_bedwars": 2,
//                     "free_event_key_bedwars_easter_boxes_2021": true,
//                     "Bedwars_openedChests": 1104,
//                     "Bedwars_openedCommons": 607,
//                     "Bedwars_openedRares": 321,
//                     "eight_two_fire_tick_deaths_bedwars": 2,
//                     "activeSprays": "random_cosmetic",
//                     "eight_two_magic_kills_bedwars": 2,
//                     "magic_kills_bedwars": 17,
//                     "four_four_lucky_fall_kills_bedwars": 3,
//                     "four_four_lucky_fire_tick_kills_bedwars": 1,
//                     "four_four_rush_beds_broken_bedwars": 16,
//                     "four_four_rush_fall_final_kills_bedwars": 3,
//                     "four_four_rush_permanent_items_purchased_bedwars": 121,
//                     "four_four_rush_fall_final_deaths_bedwars": 3,
//                     "entity_explosion_final_kills_bedwars": 13,
//                     "four_four_entity_explosion_final_kills_bedwars": 9,
//                     "eight_two_entity_explosion_final_kills_bedwars": 1,
//                     "activeGlyph": "glyph_NONE",
//                     "selected_ultimate": "GATHERER",
//                     "eight_two_ultimate__items_purchased_bedwars": 35,
//                     "eight_two_ultimate_beds_lost_bedwars": 1,
//                     "eight_two_ultimate_entity_attack_kills_bedwars": 3,
//                     "eight_two_ultimate_final_deaths_bedwars": 1,
//                     "eight_two_ultimate_games_played_bedwars": 2,
//                     "eight_two_ultimate_gold_resources_collected_bedwars": 23,
//                     "eight_two_ultimate_iron_resources_collected_bedwars": 327,
//                     "eight_two_ultimate_items_purchased_bedwars": 38,
//                     "eight_two_ultimate_kills_bedwars": 4,
//                     "eight_two_ultimate_losses_bedwars": 1,
//                     "eight_two_ultimate_resources_collected_bedwars": 367,
//                     "eight_two_ultimate_void_final_deaths_bedwars": 1,
//                     "four_four_ultimate__items_purchased_bedwars": 1969,
//                     "four_four_ultimate_beds_lost_bedwars": 38,
//                     "four_four_ultimate_deaths_bedwars": 191,
//                     "four_four_ultimate_diamond_resources_collected_bedwars": 718,
//                     "four_four_ultimate_entity_attack_deaths_bedwars": 73,
//                     "four_four_ultimate_entity_attack_kills_bedwars": 70,
//                     "four_four_ultimate_final_deaths_bedwars": 36,
//                     "four_four_ultimate_games_played_bedwars": 80,
//                     "four_four_ultimate_gold_resources_collected_bedwars": 2116,
//                     "four_four_ultimate_iron_resources_collected_bedwars": 19223,
//                     "four_four_ultimate_items_purchased_bedwars": 2213,
//                     "four_four_ultimate_kills_bedwars": 137,
//                     "four_four_ultimate_losses_bedwars": 32,
//                     "four_four_ultimate_permanent_items_purchased_bedwars": 244,
//                     "four_four_ultimate_resources_collected_bedwars": 22376,
//                     "four_four_ultimate_void_deaths_bedwars": 115,
//                     "four_four_ultimate_void_final_deaths_bedwars": 12,
//                     "four_four_ultimate_void_kills_bedwars": 66,
//                     "four_three_magic_kills_bedwars": 5,
//                     "four_four_ultimate_beds_broken_bedwars": 21,
//                     "four_four_ultimate_entity_attack_final_kills_bedwars": 46,
//                     "four_four_ultimate_final_kills_bedwars": 80,
//                     "four_four_ultimate_wins_bedwars": 48,
//                     "four_four_ultimate_entity_attack_final_deaths_bedwars": 22,
//                     "four_four_ultimate_void_final_kills_bedwars": 28,
//                     "four_four_ultimate_emerald_resources_collected_bedwars": 319,
//                     "Bedwars_openedEpics": 136,
//                     "Bedwars_openedLegendaries": 40,
//                     "shop_sort": "rarity_descending",
//                     "activeKillMessages": "killmessages_limbo",
//                     "activeIslandTopper": "islandtopper_none",
//                     "activeDeathCry": "deathcry_firework",
//                     "two_four__items_purchased_bedwars": 33,
//                     "two_four_deaths_bedwars": 6,
//                     "two_four_entity_attack_deaths_bedwars": 5,
//                     "two_four_games_played_bedwars": 3,
//                     "two_four_gold_resources_collected_bedwars": 33,
//                     "two_four_iron_resources_collected_bedwars": 455,
//                     "two_four_items_purchased_bedwars": 38,
//                     "two_four_permanent_items_purchased_bedwars": 5,
//                     "two_four_resources_collected_bedwars": 498,
//                     "two_four_wins_bedwars": 2,
//                     "two_four_beds_lost_bedwars": 1,
//                     "two_four_emerald_resources_collected_bedwars": 10,
//                     "two_four_entity_attack_kills_bedwars": 2,
//                     "two_four_final_deaths_bedwars": 1,
//                     "two_four_kills_bedwars": 3,
//                     "two_four_losses_bedwars": 1,
//                     "two_four_void_deaths_bedwars": 1,
//                     "two_four_void_final_deaths_bedwars": 1,
//                     "two_four_void_kills_bedwars": 1,
//                     "castle_void_final_kills_bedwars": 2,
//                     "castle_entity_explosion_kills_bedwars": 1,
//                     "four_three_fire_tick_deaths_bedwars": 7,
//                     "eight_two_magic_final_deaths_bedwars": 1,
//                     "four_three_fall_final_deaths_bedwars": 4,
//                     "four_four_voidless_fall_kills_bedwars": 1,
//                     "four_four_voidless_emerald_resources_collected_bedwars": 3,
//                     "four_four_voidless_fall_deaths_bedwars": 2,
//                     "four_four_voidless_fall_final_kills_bedwars": 1,
//                     "four_four_underworld__items_purchased_bedwars": 544,
//                     "four_four_underworld_beds_lost_bedwars": 9,
//                     "four_four_underworld_diamond_resources_collected_bedwars": 210,
//                     "four_four_underworld_emerald_resources_collected_bedwars": 84,
//                     "four_four_underworld_entity_attack_final_deaths_bedwars": 5,
//                     "four_four_underworld_entity_attack_final_kills_bedwars": 24,
//                     "four_four_underworld_final_deaths_bedwars": 7,
//                     "four_four_underworld_final_kills_bedwars": 39,
//                     "four_four_underworld_games_played_bedwars": 23,
//                     "four_four_underworld_gold_resources_collected_bedwars": 659,
//                     "four_four_underworld_iron_resources_collected_bedwars": 6297,
//                     "four_four_underworld_items_purchased_bedwars": 607,
//                     "four_four_underworld_losses_bedwars": 6,
//                     "four_four_underworld_permanent_items_purchased_bedwars": 63,
//                     "four_four_underworld_resources_collected_bedwars": 7250,
//                     "four_four_underworld_void_final_kills_bedwars": 11,
//                     "four_four_underworld_deaths_bedwars": 73,
//                     "four_four_underworld_entity_attack_kills_bedwars": 31,
//                     "four_four_underworld_kills_bedwars": 50,
//                     "four_four_underworld_void_deaths_bedwars": 35,
//                     "four_four_underworld_void_kills_bedwars": 16,
//                     "four_four_underworld_entity_attack_deaths_bedwars": 35,
//                     "four_four_underworld_wins_bedwars": 17,
//                     "four_four_underworld_fall_deaths_bedwars": 3,
//                     "four_four_underworld_fall_kills_bedwars": 3,
//                     "four_four_underworld_void_final_deaths_bedwars": 2,
//                     "selected_challenge_type": "COLLECTOR",
//                     "free_event_key_bedwars_halloween_boxes_2021": true,
//                     "total_challenges_completed": 119,
//                     "bw_challenge_no_team_upgrades": 30,
//                     "bw_unique_challenges_completed": 24,
//                     "bw_challenge_no_utilities": 1,
//                     "bw_challenge_selfish": 1,
//                     "bw_challenge_slow_generator": 2,
//                     "bw_challenge_assassin": 5,
//                     "bw_challenge_reset_armor": 1,
//                     "bw_challenge_invisible_shop": 1,
//                     "bw_challenge_collector": 59,
//                     "four_four_magic_kills_bedwars": 10,
//                     "four_four_swap__items_purchased_bedwars": 1976,
//                     "four_four_swap_deaths_bedwars": 183,
//                     "four_four_swap_diamond_resources_collected_bedwars": 387,
//                     "four_four_swap_emerald_resources_collected_bedwars": 181,
//                     "four_four_swap_entity_attack_deaths_bedwars": 75,
//                     "four_four_swap_entity_attack_final_kills_bedwars": 50,
//                     "four_four_swap_entity_attack_kills_bedwars": 73,
//                     "four_four_swap_fall_deaths_bedwars": 8,
//                     "four_four_swap_final_kills_bedwars": 86,
//                     "four_four_swap_games_played_bedwars": 73,
//                     "four_four_swap_gold_resources_collected_bedwars": 3485,
//                     "four_four_swap_iron_resources_collected_bedwars": 28732,
//                     "four_four_swap_items_purchased_bedwars": 2174,
//                     "four_four_swap_kills_bedwars": 119,
//                     "four_four_swap_permanent_items_purchased_bedwars": 198,
//                     "four_four_swap_resources_collected_bedwars": 32785,
//                     "four_four_swap_void_deaths_bedwars": 96,
//                     "four_four_swap_wins_bedwars": 49,
//                     "eight_two_projectile_kills_bedwars": 1,
//                     "eight_two_swap__items_purchased_bedwars": 488,
//                     "eight_two_swap_deaths_bedwars": 45,
//                     "eight_two_swap_diamond_resources_collected_bedwars": 58,
//                     "eight_two_swap_emerald_resources_collected_bedwars": 62,
//                     "eight_two_swap_entity_attack_deaths_bedwars": 9,
//                     "eight_two_swap_entity_attack_kills_bedwars": 11,
//                     "eight_two_swap_games_played_bedwars": 14,
//                     "eight_two_swap_gold_resources_collected_bedwars": 995,
//                     "eight_two_swap_iron_resources_collected_bedwars": 9059,
//                     "eight_two_swap_items_purchased_bedwars": 526,
//                     "eight_two_swap_kills_bedwars": 28,
//                     "eight_two_swap_permanent_items_purchased_bedwars": 38,
//                     "eight_two_swap_resources_collected_bedwars": 10174,
//                     "eight_two_swap_void_deaths_bedwars": 32,
//                     "eight_two_swap_void_kills_bedwars": 17,
//                     "eight_two_swap_wins_bedwars": 6,
//                     "eight_two_swap_beds_broken_bedwars": 6,
//                     "eight_two_swap_beds_lost_bedwars": 8,
//                     "eight_two_swap_entity_attack_final_deaths_bedwars": 5,
//                     "eight_two_swap_final_deaths_bedwars": 8,
//                     "eight_two_swap_final_kills_bedwars": 5,
//                     "eight_two_swap_void_final_kills_bedwars": 5,
//                     "four_four_swap_beds_lost_bedwars": 37,
//                     "four_four_swap_void_final_kills_bedwars": 25,
//                     "four_four_swap_void_kills_bedwars": 42,
//                     "four_four_swap_fall_final_kills_bedwars": 6,
//                     "four_four_swap_final_deaths_bedwars": 28,
//                     "four_four_swap_losses_bedwars": 23,
//                     "four_four_swap_void_final_deaths_bedwars": 8,
//                     "four_four_swap_beds_broken_bedwars": 23,
//                     "four_four_swap_entity_attack_final_deaths_bedwars": 16,
//                     "eight_two_swap_losses_bedwars": 8,
//                     "four_four_swap_magic_final_deaths_bedwars": 2,
//                     "four_four_projectile_deaths_bedwars": 13,
//                     "free_event_key_bedwars_christmas_boxes_2021": true,
//                     "challenges": {
//                         "bw_challenge_protect_the_president_best_time": 249743,
//                         "bw_challenge_cant_touch_this_best_time": 130670,
//                         "bw_challenge_defuser_best_time": 708908,
//                         "bw_challenge_mining_fatigue_best_time": 318214,
//                         "bw_challenge_no_healing_best_time": 461048,
//                         "bw_challenge_woodworker_best_time": 696764,
//                         "bw_challenge_hotbar_best_time": 198709,
//                         "bw_challenge_weighted_items_best_time": 230654,
//                         "bw_challenge_no_swords_best_time": 296666,
//                         "bw_challenge_sponge_best_time": 354577,
//                         "bw_challenge_knockback_stick_only_best_time": 1940188,
//                         "bw_challenge_assassin_best_time": 179545,
//                         "bw_challenge_collector_best_time": 215757,
//                         "bw_challenge_patriot_best_time": 488742,
//                         "bw_challenge_capped_resources_best_time": 443611,
//                         "bw_challenge_stop_light_best_time": 347297,
//                         "bw_challenge_no_team_upgrades_best_time": 160544,
//                         "bw_challenge_toxic_rain_best_time": 428792,
//                         "bw_challenge_archer_only_best_time": 853004,
//                         "bw_challenge_master_assassin_best_time": 192576
//                     },
//                     "bw_challenge_protect_the_president": 3,
//                     "four_three_entity_explosion_kills_bedwars": 5,
//                     "four_four_swap_magic_deaths_bedwars": 2,
//                     "four_four_projectile_kills_bedwars": 12,
//                     "lastTourneyAd": 1698004417626,
//                     "four_three_projectile_final_kills_bedwars": 2,
//                     "projectile_final_kills_bedwars": 11,
//                     "four_four_swap_entity_explosion_deaths_bedwars": 2,
//                     "four_four_swap_magic_final_kills_bedwars": 5,
//                     "free_event_key_bedwars_halloween_boxes_2022": true,
//                     "eight_two_underworld__items_purchased_bedwars": 193,
//                     "eight_two_underworld_beds_broken_bedwars": 7,
//                     "eight_two_underworld_deaths_bedwars": 21,
//                     "eight_two_underworld_diamond_resources_collected_bedwars": 74,
//                     "eight_two_underworld_entity_attack_deaths_bedwars": 14,
//                     "eight_two_underworld_entity_attack_final_kills_bedwars": 8,
//                     "eight_two_underworld_entity_attack_kills_bedwars": 10,
//                     "eight_two_underworld_final_kills_bedwars": 15,
//                     "eight_two_underworld_games_played_bedwars": 8,
//                     "eight_two_underworld_gold_resources_collected_bedwars": 255,
//                     "eight_two_underworld_iron_resources_collected_bedwars": 2410,
//                     "eight_two_underworld_items_purchased_bedwars": 215,
//                     "eight_two_underworld_kills_bedwars": 12,
//                     "eight_two_underworld_permanent_items_purchased_bedwars": 22,
//                     "eight_two_underworld_resources_collected_bedwars": 2778,
//                     "eight_two_underworld_void_deaths_bedwars": 7,
//                     "eight_two_underworld_wins_bedwars": 4,
//                     "four_four_underworld_beds_broken_bedwars": 5,
//                     "four_four_underworld_fall_final_kills_bedwars": 2,
//                     "four_four_underworld_entity_explosion_final_kills_bedwars": 1,
//                     "four_four_underworld_magic_final_kills_bedwars": 1,
//                     "eight_two_underworld_emerald_resources_collected_bedwars": 39,
//                     "eight_two_underworld_magic_final_kills_bedwars": 2,
//                     "eight_two_underworld_void_final_kills_bedwars": 4,
//                     "eight_two_underworld_beds_lost_bedwars": 5,
//                     "eight_two_underworld_final_deaths_bedwars": 4,
//                     "eight_two_underworld_losses_bedwars": 4,
//                     "eight_two_underworld_void_final_deaths_bedwars": 2,
//                     "eight_two_underworld_entity_attack_final_deaths_bedwars": 2,
//                     "eight_two_underworld_void_kills_bedwars": 2,
//                     "eight_two_underworld_fall_final_kills_bedwars": 1,
//                     "four_four_ultimate_magic_final_kills_bedwars": 4,
//                     "four_four_ultimate_projectile_kills_bedwars": 1,
//                     "four_four_ultimate_entity_explosion_deaths_bedwars": 1,
//                     "free_event_key_bedwars_christmas_boxes_2022": true,
//                     "four_four_projectile_final_kills_bedwars": 9,
//                     "fire_tick_final_kills_bedwars": 3,
//                     "four_four_fire_tick_final_kills_bedwars": 2,
//                     "four_four_swap_entity_explosion_final_deaths_bedwars": 1,
//                     "bw_challenge_defuser": 2,
//                     "four_three_suffocation_deaths_bedwars": 2,
//                     "suffocation_deaths_bedwars": 2,
//                     "four_four_lucky_magic_final_kills_bedwars": 5,
//                     "activeWoodType": "woodSkin_spruce",
//                     "fire_deaths_bedwars": 4,
//                     "four_four_fire_deaths_bedwars": 2,
//                     "free_event_key_bedwars_easter_boxes_2023": true,
//                     "bw_challenge_mining_fatigue": 1,
//                     "bw_challenge_no_healing": 1,
//                     "bw_challenge_woodworker": 1,
//                     "fire_tick_kills_bedwars": 5,
//                     "four_four_fire_tick_kills_bedwars": 3,
//                     "four_three_fire_tick_final_kills_bedwars": 1,
//                     "four_three_fire_deaths_bedwars": 2,
//                     "bw_challenge_hotbar": 1,
//                     "bw_challenge_weighted_items": 1,
//                     "bw_challenge_no_swords": 1,
//                     "bw_challenge_sponge": 1,
//                     "bw_challenge_knockback_stick_only": 1,
//                     "quickbuy_privacy": "HIGH",
//                     "bw_challenge_patriot": 1,
//                     "bw_challenge_capped_resources": 1,
//                     "bw_challenge_stop_light": 1,
//                     "four_four_lucky_projectile_final_deaths_bedwars": 1,
//                     "four_three_entity_explosion_final_kills_bedwars": 3,
//                     "bw_challenge_toxic_rain": 1,
//                     "eight_two_entity_explosion_final_deaths_bedwars": 1,
//                     "bw_challenge_archer_only": 1,
//                     "bw_challenge_master_assassin": 1,
//                     "eight_two_ultimate_deaths_bedwars": 5,
//                     "eight_two_ultimate_diamond_resources_collected_bedwars": 8,
//                     "eight_two_ultimate_emerald_resources_collected_bedwars": 9,
//                     "eight_two_ultimate_entity_attack_deaths_bedwars": 2,
//                     "eight_two_ultimate_entity_attack_final_kills_bedwars": 3,
//                     "eight_two_ultimate_final_kills_bedwars": 4,
//                     "eight_two_ultimate_permanent_items_purchased_bedwars": 3,
//                     "eight_two_ultimate_void_deaths_bedwars": 3,
//                     "eight_two_ultimate_void_final_kills_bedwars": 1,
//                     "eight_two_ultimate_void_kills_bedwars": 1,
//                     "eight_two_ultimate_wins_bedwars": 1,
//                     "leaderboardSettings": {
//                         "resetType": "NEVER"
//                     },
//                     "four_three_fire_tick_kills_bedwars": 1,
//                     "four_four_ultimate_magic_final_deaths_bedwars": 1,
//                     "four_four_ultimate_magic_deaths_bedwars": 2,
//                     "eight_two_fire_tick_kills_bedwars": 1,
//                     "four_four_armed__items_purchased_bedwars": 195,
//                     "four_four_armed_beds_broken_bedwars": 3,
//                     "four_four_armed_deaths_bedwars": 34,
//                     "four_four_armed_entity_attack_deaths_bedwars": 7,
//                     "four_four_armed_entity_attack_final_kills_bedwars": 1,
//                     "four_four_armed_final_kills_bedwars": 7,
//                     "four_four_armed_games_played_bedwars": 6,
//                     "four_four_armed_gold_resources_collected_bedwars": 156,
//                     "four_four_armed_iron_resources_collected_bedwars": 1632,
//                     "four_four_armed_items_purchased_bedwars": 207,
//                     "four_four_armed_kills_bedwars": 15,
//                     "four_four_armed_permanent_items_purchased_bedwars": 12,
//                     "four_four_armed_projectile_deaths_bedwars": 19,
//                     "four_four_armed_projectile_kills_bedwars": 10,
//                     "four_four_armed_resources_collected_bedwars": 1803,
//                     "four_four_armed_wins_bedwars": 4,
//                     "four_four_armed_magic_kills_bedwars": 1,
//                     "four_four_armed_void_deaths_bedwars": 5,
//                     "four_four_armed_emerald_resources_collected_bedwars": 15,
//                     "four_four_armed_entity_attack_kills_bedwars": 3,
//                     "four_four_armed_entity_explosion_deaths_bedwars": 1,
//                     "four_four_armed_fall_deaths_bedwars": 2,
//                     "four_four_armed_fire_tick_final_kills_bedwars": 1,
//                     "four_four_armed_beds_lost_bedwars": 2,
//                     "four_four_armed_final_deaths_bedwars": 2,
//                     "four_four_armed_losses_bedwars": 2,
//                     "four_four_armed_void_final_deaths_bedwars": 2,
//                     "four_four_armed_magic_final_kills_bedwars": 1,
//                     "four_four_armed_void_final_kills_bedwars": 3,
//                     "four_four_armed_void_kills_bedwars": 1,
//                     "four_four_armed_projectile_final_kills_bedwars": 1,
//                     "two_four_beds_broken_bedwars": 1,
//                     "two_four_entity_attack_final_kills_bedwars": 1,
//                     "two_four_final_kills_bedwars": 1,
//                     "four_four_lucky_projectile_kills_bedwars": 1,
//                     "four_four_lucky_magic_final_deaths_bedwars": 1,
//                     "four_four_lucky_fall_final_deaths_bedwars": 1,
//                     "free_event_key_bedwars_halloween_boxes_2023": true,
//                     "eight_two_swap_void_final_deaths_bedwars": 3,
//                     "tourney_bedwars_eight_two_1__items_purchased_bedwars": 659,
//                     "tourney_bedwars_eight_two_1_beds_broken_bedwars": 10,
//                     "tourney_bedwars_eight_two_1_deaths_bedwars": 68,
//                     "tourney_bedwars_eight_two_1_diamond_resources_collected_bedwars": 81,
//                     "tourney_bedwars_eight_two_1_emerald_resources_collected_bedwars": 108,
//                     "tourney_bedwars_eight_two_1_entity_attack_deaths_bedwars": 36,
//                     "tourney_bedwars_eight_two_1_entity_attack_kills_bedwars": 31,
//                     "tourney_bedwars_eight_two_1_final_kills_bedwars": 18,
//                     "tourney_bedwars_eight_two_1_games_played_bedwars": 19,
//                     "tourney_bedwars_eight_two_1_gold_resources_collected_bedwars": 681,
//                     "tourney_bedwars_eight_two_1_iron_resources_collected_bedwars": 8169,
//                     "tourney_bedwars_eight_two_1_items_purchased_bedwars": 702,
//                     "tourney_bedwars_eight_two_1_kills_bedwars": 51,
//                     "tourney_bedwars_eight_two_1_permanent_items_purchased_bedwars": 43,
//                     "tourney_bedwars_eight_two_1_resources_collected_bedwars": 9039,
//                     "tourney_bedwars_eight_two_1_void_deaths_bedwars": 30,
//                     "tourney_bedwars_eight_two_1_void_final_kills_bedwars": 6,
//                     "tourney_bedwars_eight_two_1_void_kills_bedwars": 19,
//                     "tourney_bedwars_eight_two_1_wins_bedwars": 5,
//                     "tourney_bedwars_eight_two_1_beds_lost_bedwars": 17,
//                     "tourney_bedwars_eight_two_1_entity_attack_final_deaths_bedwars": 12,
//                     "tourney_bedwars_eight_two_1_final_deaths_bedwars": 15,
//                     "tourney_bedwars_eight_two_1_losses_bedwars": 14,
//                     "tourney_bedwars_eight_two_1_void_final_deaths_bedwars": 1,
//                     "tourney_bedwars_eight_two_1_magic_final_deaths_bedwars": 2,
//                     "tourney_bedwars_eight_two_1_entity_attack_final_kills_bedwars": 9,
//                     "tourney_bedwars_eight_two_1_fall_final_kills_bedwars": 1,
//                     "tourney_bedwars_eight_two_1_fall_deaths_bedwars": 2,
//                     "tourney_bedwars_eight_two_1_fall_kills_bedwars": 1,
//                     "tourney_bedwars_eight_two_1_entity_explosion_final_kills_bedwars": 1,
//                     "tourney_bedwars_eight_two_1_magic_final_kills_bedwars": 1,
//                     "four_four_rush_magic_final_deaths_bedwars": 1,
//                     "four_four_rush_magic_deaths_bedwars": 3,
//                     "four_four_rush_void_final_deaths_bedwars": 5,
//                     "four_four_rush_fall_kills_bedwars": 3,
//                     "slumber": {
//                         "bag_type": "PLATINUM_MEMBERSHIP_WALLET",
//                         "quest": {
//                             "npc": {
//                                 "talk": {
//                                     "DoorManNpc": true,
//                                     "HotelReceptionistNpc": true,
//                                     "HostessKatrinaNpc": true,
//                                     "FredericFerntonNpc": true,
//                                     "TicketMachineNpc": true,
//                                     "LadySaichiNpc": true,
//                                     "GeneralDakuNpc": true,
//                                     "JohnIndigosNpc": true,
//                                     "JohnIndigosPhaseTwoNpc": true,
//                                     "BlackSmithNpc": true,
//                                     "BlackSmithRobertoNpc": true,
//                                     "LaundryGuyNpc": true,
//                                     "ChefGarryJamseyNpc": true,
//                                     "ChefBuckyNpc": true,
//                                     "KingFlutNpc": true,
//                                     "HammerNpc": true,
//                                     "OasisSpiritNpc": true,
//                                     "HermesNpc": true,
//                                     "QuizShowHostNpc": true,
//                                     "JimmyNpc": true,
//                                     "BimmyNpc": true,
//                                     "DonEspressoNpc": true,
//                                     "SkyBlockPlayerNpc": true,
//                                     "CEONpc": true,
//                                     "RatmanNpc": true,
//                                     "ArcadePlayerNpc": true,
//                                     "SpaceManNpc": true,
//                                     "JetsMcTurboNpc": true,
//                                     "HammerPartTwoNpc": true,
//                                     "GamblerGeorgeNpc": true,
//                                     "JeremyJaggerNpc": true,
//                                     "BillStarrNpc": true,
//                                     "PeterNpc": true,
//                                     "WallyNpc": true,
//                                     "InspectorMyaSterlingNpc": true,
//                                     "LaundryGalNpc": true,
//                                     "CombatArtistSallyNpc": true,
//                                     "MasterMeyerNpc": true,
//                                     "LesterBrodyNpc": true,
//                                     "GizzyMoonpowderNpc": true,
//                                     "ElectricianRusselNpc": true,
//                                     "SlumberVillagerNpc": true,
//                                     "JohnIndigosPhaseThreeNpc": true,
//                                     "SandmanNpc": true
//                                 }
//                             },
//                             "started": {
//                                 "npc_reception_start": true,
//                                 "npc_lady_saichi": true,
//                                 "npc_general_daku": true,
//                                 "npc_john_pireso": true,
//                                 "phase_two_asc": true,
//                                 "phase_three_asc": true,
//                                 "npc_blacksmith": true,
//                                 "npc_blacksmith_apprentice": true,
//                                 "npc_laundry": true,
//                                 "npc_bucky": true,
//                                 "npc_king_flut": true,
//                                 "npc_hammer": true,
//                                 "npc_oasis": true,
//                                 "npc_hermes": true,
//                                 "npc_quiz_show_host": true,
//                                 "npc_jimmy_bimmy": true,
//                                 "npc_don_espresso": true,
//                                 "npc_skyblock_player": true,
//                                 "npc_executives": true,
//                                 "npc_the_ratman": true,
//                                 "npc_arcade_player": true,
//                                 "npc_spaceman": true,
//                                 "npc_jets_mcturbo": true,
//                                 "npc_hammer_part_two": true,
//                                 "npc_gambler_george": true,
//                                 "npc_jeremy_jagger": true,
//                                 "npc_bill_starr": true,
//                                 "npc_peter": true,
//                                 "npc_wally": true,
//                                 "npc_inspector": true,
//                                 "npc_laundry_gal": true,
//                                 "npc_combat_artist_sally": true,
//                                 "staff_wallet_upgrade": true,
//                                 "npc_master_meyer": true,
//                                 "npc_lester_brody": true,
//                                 "npc_gizzy_moonpowder": true,
//                                 "npc_electrician_russel": true,
//                                 "phase_four_ascension_q1": true,
//                                 "phase_four_ascension_q2": true,
//                                 "phase_four_ascension_q3": true,
//                                 "phase_four_ascension_q4": true,
//                                 "phase_four_ascension_q5": true,
//                                 "phase_four_ascension_wallet_q": true,
//                                 "npc_meet_the_sandman": true
//                             },
//                             "lastStarted": {
//                                 "npc_reception_start": 1701830154033,
//                                 "npc_lady_saichi": 1701830350505,
//                                 "npc_general_daku": 1701830375535,
//                                 "npc_john_pireso": 1701830414438,
//                                 "phase_two_asc": 1701832278344,
//                                 "phase_three_asc": 1701832384942,
//                                 "npc_blacksmith": 1701832424240,
//                                 "npc_blacksmith_apprentice": 1701832512705,
//                                 "npc_laundry": 1701832604544,
//                                 "npc_bucky": 1701832664181,
//                                 "npc_king_flut": 1701833605012,
//                                 "npc_hammer": 1701835535964,
//                                 "npc_oasis": 1701835560021,
//                                 "npc_hermes": 1701842376657,
//                                 "npc_quiz_show_host": 1701913168267,
//                                 "npc_jimmy_bimmy": 1702014704414,
//                                 "npc_don_espresso": 1702014802611,
//                                 "npc_skyblock_player": 1702014831379,
//                                 "npc_executives": 1702014944486,
//                                 "npc_the_ratman": 1702015023424,
//                                 "npc_arcade_player": 1702015097810,
//                                 "npc_spaceman": 1702015199897,
//                                 "npc_jets_mcturbo": 1702015277599,
//                                 "npc_hammer_part_two": 1702068107610,
//                                 "npc_gambler_george": 1702068643090,
//                                 "npc_jeremy_jagger": 1702075391480,
//                                 "npc_bill_starr": 1702076072888,
//                                 "npc_peter": 1702089475128,
//                                 "npc_wally": 1702089489677,
//                                 "npc_inspector": 1702089641835,
//                                 "npc_laundry_gal": 1702095473374,
//                                 "npc_combat_artist_sally": 1702158684454,
//                                 "staff_wallet_upgrade": 1702158710775,
//                                 "npc_master_meyer": 1702158759485,
//                                 "npc_lester_brody": 1702158784971,
//                                 "npc_gizzy_moonpowder": 1702158813137,
//                                 "npc_electrician_russel": 1702158847880,
//                                 "phase_four_ascension_q1": 1702610016720,
//                                 "phase_four_ascension_q2": 1702610070970,
//                                 "phase_four_ascension_q3": 1702610107067,
//                                 "phase_four_ascension_q4": 1702610145172,
//                                 "phase_four_ascension_q5": 1702686165589,
//                                 "phase_four_ascension_wallet_q": 1702686204169,
//                                 "npc_meet_the_sandman": 1702686290809
//                             },
//                             "completed": {
//                                 "npc_reception_start": true,
//                                 "npc_lady_saichi": true,
//                                 "npc_general_daku": true,
//                                 "npc_john_pireso": true,
//                                 "phase_two_asc": true,
//                                 "npc_blacksmith_apprentice": true,
//                                 "npc_quiz_show_host": true,
//                                 "npc_oasis": true,
//                                 "npc_hammer": true,
//                                 "npc_king_flut": true,
//                                 "npc_laundry": true,
//                                 "npc_blacksmith": true,
//                                 "phase_three_asc": true,
//                                 "npc_hermes": true,
//                                 "npc_skyblock_player": true,
//                                 "npc_arcade_player": true,
//                                 "npc_don_espresso": true,
//                                 "npc_hammer_part_two": true,
//                                 "npc_gambler_george": true,
//                                 "npc_jets_mcturbo": true,
//                                 "npc_jimmy_bimmy": true,
//                                 "npc_the_ratman": true,
//                                 "npc_bucky": true,
//                                 "npc_bill_starr": true,
//                                 "npc_jeremy_jagger": true,
//                                 "npc_peter": true,
//                                 "npc_executives": true,
//                                 "npc_spaceman": true,
//                                 "npc_laundry_gal": true,
//                                 "npc_combat_artist_sally": true,
//                                 "staff_wallet_upgrade": true,
//                                 "npc_master_meyer": true,
//                                 "npc_lester_brody": true,
//                                 "npc_gizzy_moonpowder": true,
//                                 "npc_electrician_russel": true,
//                                 "npc_wally": true,
//                                 "phase_four_ascension_q1": true,
//                                 "phase_four_ascension_q2": true,
//                                 "phase_four_ascension_q3": true,
//                                 "npc_inspector": true,
//                                 "phase_four_ascension_q4": true,
//                                 "phase_four_ascension_q5": true,
//                                 "phase_four_ascension_wallet_q": true,
//                                 "npc_meet_the_sandman": true
//                             },
//                             "lastCompleted": {
//                                 "npc_reception_start": 1701830188019,
//                                 "npc_lady_saichi": 1701831135415,
//                                 "npc_general_daku": 1701832247065,
//                                 "npc_john_pireso": 1701832274326,
//                                 "phase_two_asc": 1701832302074,
//                                 "npc_blacksmith_apprentice": 1701833535164,
//                                 "npc_quiz_show_host": 1701929361918,
//                                 "npc_oasis": 1702014391371,
//                                 "npc_hammer": 1702014482250,
//                                 "npc_king_flut": 1702014545789,
//                                 "npc_laundry": 1702014615334,
//                                 "npc_blacksmith": 1702014642903,
//                                 "phase_three_asc": 1702014654773,
//                                 "npc_hermes": 1702014766868,
//                                 "npc_skyblock_player": 1702014856524,
//                                 "npc_arcade_player": 1702015136208,
//                                 "npc_don_espresso": 1702068083770,
//                                 "npc_hammer_part_two": 1702068620348,
//                                 "npc_gambler_george": 1702075324480,
//                                 "npc_jets_mcturbo": 1702075370030,
//                                 "npc_jimmy_bimmy": 1702076053114,
//                                 "npc_the_ratman": 1702076113492,
//                                 "npc_bucky": 1702076158813,
//                                 "npc_bill_starr": 1702089382344,
//                                 "npc_jeremy_jagger": 1702089424715,
//                                 "npc_peter": 1702089631618,
//                                 "npc_executives": 1702092100479,
//                                 "npc_spaceman": 1702097517313,
//                                 "npc_laundry_gal": 1702158671279,
//                                 "npc_combat_artist_sally": 1702158706744,
//                                 "staff_wallet_upgrade": 1702158721215,
//                                 "npc_master_meyer": 1702158770953,
//                                 "npc_lester_brody": 1702158798369,
//                                 "npc_gizzy_moonpowder": 1702158818526,
//                                 "npc_electrician_russel": 1702158864399,
//                                 "npc_wally": 1702605271376,
//                                 "phase_four_ascension_q1": 1702610043372,
//                                 "phase_four_ascension_q2": 1702610089417,
//                                 "phase_four_ascension_q3": 1702610116529,
//                                 "npc_inspector": 1702686049659,
//                                 "phase_four_ascension_q4": 1702686152837,
//                                 "phase_four_ascension_q5": 1702686187211,
//                                 "phase_four_ascension_wallet_q": 1702686237437,
//                                 "npc_meet_the_sandman": 1702686290809
//                             },
//                             "objective": {
//                                 "receptionist_introduction": true,
//                                 "lady_saichi_mattress": true,
//                                 "general_daku_tea": true,
//                                 "john_pireso_map": true,
//                                 "phase_two_recp": true,
//                                 "blacksmith_apprentice_iron": true,
//                                 "blacksmith_apprentice_coins": true,
//                                 "blacksmith_apprentice_iron_repeat": false,
//                                 "blacksmith_apprentice_coins_repeat": true,
//                                 "king_flut_amulet": true,
//                                 "oasis_souls": true,
//                                 "hammer_coins": true,
//                                 "king_flut_pillow": true,
//                                 "blacksmith_iron_bars": true,
//                                 "blacksmith_water": true,
//                                 "blacksmith_mold": true,
//                                 "blacksmith_amulet": true,
//                                 "laundry_manager_sheets": true,
//                                 "blacksmith_golden_ticket": true,
//                                 "phase_three_recp": true,
//                                 "hermes_mystery_boxes": true,
//                                 "skyblock_player_leaves": true,
//                                 "arcade_quarters": true,
//                                 "arcade_quarters_repeat": false,
//                                 "don_espresso_gold": true,
//                                 "hammer_part_two_silver_blade": true,
//                                 "gambler_george_win": true,
//                                 "jets_iron_bars": true,
//                                 "jets_emeralds": true,
//                                 "jets_cables": true,
//                                 "jets_nether_stars": true,
//                                 "chess_tickets": true,
//                                 "chess_wool_cables": true,
//                                 "chess_tokens_of_ferocity": true,
//                                 "ratman_pillow": true,
//                                 "ratman_bedsheets": true,
//                                 "ratman_iron_bars": true,
//                                 "ratman_spark_plug": true,
//                                 "bucky_sky_tea_leaves": true,
//                                 "bucky_fragments": true,
//                                 "bill_starr_blitz": true,
//                                 "jagger_wool": true,
//                                 "jagger_iron": true,
//                                 "jagger_gold": true,
//                                 "jagger_diamond": true,
//                                 "jagger_emerald": true,
//                                 "peter_escape": true,
//                                 "executives_meeting_numbers": true,
//                                 "spaceman_nether_stars": true,
//                                 "laundry_gal_pillows": true,
//                                 "combat_artist_sally": true,
//                                 "master_meyer": true,
//                                 "lester_brody": true,
//                                 "gizzy_moonpowder": true,
//                                 "electrician_russel": true,
//                                 "electrician_russel_repeat": false,
//                                 "bucky_sky_tea_leaves_repeat": false,
//                                 "bucky_fragments_repeat": true,
//                                 "combat_artist_sally_repeat": true,
//                                 "wally_nether_stars": true,
//                                 "wally_bed_sheets": true,
//                                 "phase_four_ascension_o1": true,
//                                 "phase_four_ascension_o2": true,
//                                 "phase_four_ascension_o3": true,
//                                 "inspector_clue_weapon": true,
//                                 "inspector_work_boots": true,
//                                 "inspector_gloves": true,
//                                 "inspector_photo": true,
//                                 "inspector_air_freshener": true,
//                                 "phase_four_ascension_o4": true,
//                                 "phase_four_ascension_o5": true,
//                                 "meet_the_sandman": true
//                             },
//                             "item": {
//                                 "slumber_item_bed_sheets": 24,
//                                 "slumber_item_perfume": 1,
//                                 "slumber_item_ender_dust": 4453,
//                                 "slumber_item_indigos_map": 0,
//                                 "slumber_item_imperial_leather": 1,
//                                 "slumber_item_trusty_rope": 1,
//                                 "slumber_item_iron_nugget": 8977,
//                                 "slumber_item_silver_coins": 6635,
//                                 "slumber_item_soul": 288,
//                                 "slumber_item_comfy_pillow": 10,
//                                 "slumber_item_missing_amulet": 0,
//                                 "slumber_item_timeworn_mystery_box": 181,
//                                 "slumber_item_limbo_dust": 0,
//                                 "slumber_item_oasis_water": 0,
//                                 "slumber_item_weapon_mold": 0,
//                                 "slumber_item_amulet": 0,
//                                 "slumber_item_golden_ticket": 0,
//                                 "slumber_item_enchanted_hammer": 0,
//                                 "slumber_item_ratman_mask": 0,
//                                 "slumber_item_token_of_ferocity": 917,
//                                 "slumber_item_emerald_shard": 197,
//                                 "slumber_item_cable": 597,
//                                 "slumber_item_gold_bar": 884,
//                                 "slumber_item_nether_star": 122,
//                                 "slumber_item_proof_of_success": 142,
//                                 "slumber_item_dwarven_mithril": 1,
//                                 "slumber_item_silver_blade_replay": 0,
//                                 "slumber_item_spark_plug": 0,
//                                 "slumber_item_discarded_kart_wheel": 1,
//                                 "slumber_item_diamond_fragment": 317,
//                                 "slumber_item_blitz_star": 0,
//                                 "slumber_item_faded_blitz_star": 1,
//                                 "slumber_item_unused_bomb_materials": 0,
//                                 "slumber_item_air_freshener": 0,
//                                 "slumber_item_gloves": 32,
//                                 "slumber_item_moon_stone_nugget": 1,
//                                 "slumber_item_murder_weapon": 1,
//                                 "slumber_item_boots": 0,
//                                 "slumber_item_glowing_sand_paper": 1,
//                                 "slumber_item_block_of_mega_walls_obsidian": 1,
//                                 "slumber_item_victim_photo": 0,
//                                 "slumber_item_cleaned_up_murder_knife": 0
//                             },
//                             "gambler_george": {
//                                 "lost_bet_time": 1702096578017,
//                                 "won_last_game": true,
//                                 "gamble_games_won": 58,
//                                 "should_reward": true
//                             }
//                         },
//                         "fredgie": {
//                             "should_update_index": false,
//                             "dialogue_index": 28
//                         },
//                         "tickets": 1513,
//                         "tickets_given_doorman": 25,
//                         "tickets_requirement_met": true,
//                         "total_tickets_earned": 93845,
//                         "phase": {
//                             "current": 2
//                         },
//                         "room": {
//                             "room_1": true,
//                             "room_2": true,
//                             "room_3": true,
//                             "room_4": true,
//                             "room_5": true,
//                             "room_6": true,
//                             "room_7": true,
//                             "room_8": true,
//                             "room_10": true,
//                             "room_11": true,
//                             "room_12": true,
//                             "owners_office": true,
//                             "room_9": true
//                         },
//                         "boon_multiplier": 0.5,
//                         "minion": {
//                             "ender_dust": 300,
//                             "games": 205,
//                             "tickets": 50,
//                             "tickets_collected": 52,
//                             "ender_dust_collected": 3900
//                         },
//                         "phasethree": {
//                             "completed_quests": 16
//                         },
//                         "sandman": {
//                             "exp_multiplier": 0.05,
//                             "ticket_multiplier": 0.2
//                         }
//                     },
//                     "four_four_lucky_fall_final_kills_bedwars": 1,
//                     "eight_two_lucky__items_purchased_bedwars": 1361,
//                     "eight_two_lucky_beds_lost_bedwars": 5,
//                     "eight_two_lucky_deaths_bedwars": 172,
//                     "eight_two_lucky_diamond_resources_collected_bedwars": 213,
//                     "eight_two_lucky_emerald_resources_collected_bedwars": 153,
//                     "eight_two_lucky_entity_attack_deaths_bedwars": 32,
//                     "eight_two_lucky_entity_attack_final_kills_bedwars": 11,
//                     "eight_two_lucky_entity_attack_kills_bedwars": 11,
//                     "eight_two_lucky_final_deaths_bedwars": 8,
//                     "eight_two_lucky_final_kills_bedwars": 14,
//                     "eight_two_lucky_games_played_bedwars": 14,
//                     "eight_two_lucky_gold_resources_collected_bedwars": 974,
//                     "eight_two_lucky_iron_resources_collected_bedwars": 9122,
//                     "eight_two_lucky_items_purchased_bedwars": 1393,
//                     "eight_two_lucky_kills_bedwars": 188,
//                     "eight_two_lucky_losses_bedwars": 8,
//                     "eight_two_lucky_magic_deaths_bedwars": 6,
//                     "eight_two_lucky_permanent_items_purchased_bedwars": 32,
//                     "eight_two_lucky_projectile_final_deaths_bedwars": 1,
//                     "eight_two_lucky_resources_collected_bedwars": 10462,
//                     "eight_two_lucky_void_deaths_bedwars": 131,
//                     "eight_two_lucky_void_kills_bedwars": 177,
//                     "eight_two_lucky_fire_tick_deaths_bedwars": 1,
//                     "eight_two_lucky_wins_bedwars": 6,
//                     "eight_two_lucky_beds_broken_bedwars": 7,
//                     "eight_two_lucky_fall_deaths_bedwars": 2,
//                     "eight_two_lucky_void_final_kills_bedwars": 2,
//                     "four_four_lucky_entity_explosion_final_kills_bedwars": 1,
//                     "four_four_lucky_fire_tick_final_kills_bedwars": 1,
//                     "free_event_key_bedwars_christmas_boxes_2023": true,
//                     "eight_two_lucky_entity_attack_final_deaths_bedwars": 4,
//                     "eight_two_lucky_fall_final_kills_bedwars": 1,
//                     "eight_two_lucky_void_final_deaths_bedwars": 2,
//                     "four_four_swap_projectile_final_deaths_bedwars": 1,
//                     "eight_two_swap_fall_deaths_bedwars": 2,
//                     "eight_two_swap_magic_deaths_bedwars": 2,
//                     "four_four_swap_fall_kills_bedwars": 1,
//                     "four_four_swap_projectile_kills_bedwars": 3,
//                     "four_four_rush_magic_final_kills_bedwars": 1,
//                     "four_four_rush_projectile_deaths_bedwars": 1,
//                     "four_four_rush_entity_explosion_final_kills_bedwars": 1,
//                     "figurines": {
//                         "featured": {
//                             "COMMON": [
//                                 "figurine_golden_sandman",
//                                 "figurine_sky_island",
//                                 "figurine_golden_apple"
//                             ],
//                             "RARE": [
//                                 "figurine_emeralds",
//                                 "figurine_defended_bed",
//                                 "figurine_iron_punch"
//                             ],
//                             "LEGENDARY": [
//                                 "figurine_kart_racing",
//                                 "figurine_executives_meeting"
//                             ]
//                         }
//                     },
//                     "four_four_ultimate_entity_explosion_final_kills_bedwars": 2
//                 },
//                 "MurderMystery": {
//                     "detective_chance": 8,
//                     "murdermystery_books": [
//                         "detective",
//                         "innocent",
//                         "murderer"
//                     ],
//                     "wins": 120,
//                     "wins_MURDER_HARDCORE": 1,
//                     "bow_kills_headquarters_MURDER_HARDCORE": 1,
//                     "games_headquarters_MURDER_HARDCORE": 1,
//                     "kills_MURDER_HARDCORE": 1,
//                     "kills_headquarters": 1,
//                     "coins": 72291,
//                     "was_hero_headquarters": 1,
//                     "detective_wins_headquarters_MURDER_HARDCORE": 1,
//                     "kills_headquarters_MURDER_HARDCORE": 1,
//                     "was_hero_headquarters_MURDER_HARDCORE": 1,
//                     "was_hero": 4,
//                     "games": 143,
//                     "bow_kills_MURDER_HARDCORE": 1,
//                     "coins_pickedup_MURDER_HARDCORE": 1,
//                     "wins_headquarters_MURDER_HARDCORE": 1,
//                     "detective_wins_headquarters": 1,
//                     "bow_kills": 34,
//                     "games_MURDER_HARDCORE": 1,
//                     "coins_pickedup_headquarters": 8,
//                     "wins_headquarters": 2,
//                     "detective_wins": 5,
//                     "coins_pickedup_headquarters_MURDER_HARDCORE": 1,
//                     "games_headquarters": 2,
//                     "detective_wins_MURDER_HARDCORE": 1,
//                     "kills": 104,
//                     "bow_kills_headquarters": 1,
//                     "coins_pickedup": 824,
//                     "was_hero_MURDER_HARDCORE": 1,
//                     "granted_chests": 1,
//                     "mm_chests": 2,
//                     "coins_pickedup_MURDER_CLASSIC": 85,
//                     "games_hypixel_world_MURDER_CLASSIC": 2,
//                     "wins_hypixel_world_MURDER_CLASSIC": 2,
//                     "games_hypixel_world": 8,
//                     "coins_pickedup_hypixel_world_MURDER_CLASSIC": 16,
//                     "coins_pickedup_hypixel_world": 39,
//                     "games_MURDER_CLASSIC": 15,
//                     "wins_hypixel_world": 5,
//                     "wins_MURDER_CLASSIC": 12,
//                     "packages": [
//                         "last_words_glutton",
//                         "kill_note_rose",
//                         "knife_skin_blaze_stick",
//                         "kill_note_year_of_the_ox",
//                         "kill_note_master_sword",
//                         "last_words_condescending",
//                         "sep2021AchievementSync",
//                         "victory_dance_snow_bomber",
//                         "victory_dance_winter_twister",
//                         "projectile_trail_howling_wind",
//                         "projectile_trail_spiders_silk",
//                         "projectile_trail_cursedflame",
//                         "projectile_trail_wisp_whirlwind",
//                         "victory_dance_graveyardrave"
//                     ],
//                     "MurderMystery_openedCommons": 4,
//                     "MurderMystery_openedChests": 5,
//                     "mm_chest_history": [
//                         "kill_note_rose"
//                     ],
//                     "MurderMystery_openedRares": 2,
//                     "active_knife_skin": "knife_skin_blaze_stick",
//                     "active_kill_note": "kill_note_rose",
//                     "active_last_words": "last_words_none",
//                     "thrown_knife_kills_archives": 6,
//                     "coins_pickedup_archives": 31,
//                     "knife_kills_archives": 6,
//                     "thrown_knife_kills": 27,
//                     "kills_archives": 12,
//                     "coins_pickedup_archives_MURDER_ASSASSINS": 30,
//                     "thrown_knife_kills_MURDER_ASSASSINS": 27,
//                     "knife_kills_MURDER_ASSASSINS": 32,
//                     "kills_MURDER_ASSASSINS": 61,
//                     "wins_archives": 4,
//                     "games_MURDER_ASSASSINS": 25,
//                     "thrown_knife_kills_archives_MURDER_ASSASSINS": 6,
//                     "knife_kills_archives_MURDER_ASSASSINS": 6,
//                     "knife_kills": 43,
//                     "kills_archives_MURDER_ASSASSINS": 12,
//                     "games_archives_MURDER_ASSASSINS": 4,
//                     "coins_pickedup_MURDER_ASSASSINS": 147,
//                     "games_archives": 5,
//                     "wins_MURDER_ASSASSINS": 15,
//                     "wins_archives_MURDER_ASSASSINS": 3,
//                     "wins_hollywood": 7,
//                     "knife_kills_hollywood": 13,
//                     "kills_hollywood": 21,
//                     "thrown_knife_kills_hollywood": 6,
//                     "games_hollywood": 11,
//                     "wins_hollywood_MURDER_ASSASSINS": 6,
//                     "games_hollywood_MURDER_ASSASSINS": 8,
//                     "coins_pickedup_hollywood_MURDER_ASSASSINS": 40,
//                     "coins_pickedup_hollywood": 76,
//                     "kills_hollywood_MURDER_ASSASSINS": 21,
//                     "knife_kills_hollywood_MURDER_ASSASSINS": 13,
//                     "thrown_knife_kills_hollywood_MURDER_ASSASSINS": 6,
//                     "deaths_archives_MURDER_ASSASSINS": 1,
//                     "deaths": 24,
//                     "deaths_MURDER_ASSASSINS": 10,
//                     "deaths_archives": 1,
//                     "games_ancient_tomb": 7,
//                     "games_ancient_tomb_MURDER_ASSASSINS": 2,
//                     "kills_ancient_tomb": 5,
//                     "kills_ancient_tomb_MURDER_ASSASSINS": 5,
//                     "coins_pickedup_ancient_tomb_MURDER_ASSASSINS": 21,
//                     "coins_pickedup_ancient_tomb": 47,
//                     "wins_ancient_tomb": 5,
//                     "wins_ancient_tomb_MURDER_ASSASSINS": 1,
//                     "knife_kills_ancient_tomb": 2,
//                     "knife_kills_ancient_tomb_MURDER_ASSASSINS": 2,
//                     "thrown_knife_kills_ancient_tomb": 3,
//                     "thrown_knife_kills_ancient_tomb_MURDER_ASSASSINS": 3,
//                     "knife_kills_library": 2,
//                     "deaths_library_MURDER_ASSASSINS": 1,
//                     "knife_kills_library_MURDER_ASSASSINS": 2,
//                     "kills_library_MURDER_ASSASSINS": 4,
//                     "deaths_library": 1,
//                     "games_library_MURDER_ASSASSINS": 2,
//                     "coins_pickedup_library": 70,
//                     "games_library": 14,
//                     "kills_library": 6,
//                     "coins_pickedup_library_MURDER_ASSASSINS": 15,
//                     "knife_kills_hypixel_world": 3,
//                     "thrown_knife_kills_hypixel_world_MURDER_ASSASSINS": 1,
//                     "thrown_knife_kills_hypixel_world": 1,
//                     "coins_pickedup_hypixel_world_MURDER_ASSASSINS": 5,
//                     "kills_hypixel_world_MURDER_ASSASSINS": 4,
//                     "kills_hypixel_world": 8,
//                     "deaths_hypixel_world": 4,
//                     "knife_kills_hypixel_world_MURDER_ASSASSINS": 3,
//                     "deaths_hypixel_world_MURDER_ASSASSINS": 1,
//                     "games_hypixel_world_MURDER_ASSASSINS": 1,
//                     "thrown_knife_kills_gold_rush_MURDER_ASSASSINS": 8,
//                     "kills_gold_rush_MURDER_ASSASSINS": 13,
//                     "games_gold_rush": 13,
//                     "thrown_knife_kills_gold_rush": 8,
//                     "knife_kills_gold_rush_MURDER_ASSASSINS": 5,
//                     "kills_gold_rush": 14,
//                     "knife_kills_gold_rush": 5,
//                     "games_gold_rush_MURDER_ASSASSINS": 4,
//                     "coins_pickedup_gold_rush_MURDER_ASSASSINS": 15,
//                     "wins_gold_rush": 10,
//                     "coins_pickedup_gold_rush": 65,
//                     "wins_gold_rush_MURDER_ASSASSINS": 2,
//                     "deaths_hollywood_MURDER_ASSASSINS": 2,
//                     "deaths_hollywood": 2,
//                     "wins_library": 12,
//                     "thrown_knife_kills_library_MURDER_ASSASSINS": 2,
//                     "thrown_knife_kills_library": 2,
//                     "wins_library_MURDER_ASSASSINS": 1,
//                     "deaths_ancient_tomb_MURDER_ASSASSINS": 1,
//                     "deaths_ancient_tomb": 3,
//                     "deaths_gold_rush": 3,
//                     "deaths_gold_rush_MURDER_ASSASSINS": 2,
//                     "wins_transport": 5,
//                     "coins_pickedup_transport_MURDER_ASSASSINS": 9,
//                     "games_transport_MURDER_ASSASSINS": 1,
//                     "coins_pickedup_transport": 34,
//                     "kills_transport_MURDER_ASSASSINS": 1,
//                     "thrown_knife_kills_transport": 1,
//                     "wins_transport_MURDER_ASSASSINS": 1,
//                     "games_transport": 5,
//                     "thrown_knife_kills_transport_MURDER_ASSASSINS": 1,
//                     "kills_transport": 1,
//                     "games_towerfall_MURDER_ASSASSINS": 1,
//                     "coins_pickedup_towerfall_MURDER_ASSASSINS": 6,
//                     "coins_pickedup_towerfall": 35,
//                     "knife_kills_towerfall": 1,
//                     "games_towerfall": 8,
//                     "kills_towerfall": 2,
//                     "knife_kills_towerfall_MURDER_ASSASSINS": 1,
//                     "wins_towerfall_MURDER_ASSASSINS": 1,
//                     "wins_towerfall": 8,
//                     "kills_towerfall_MURDER_ASSASSINS": 1,
//                     "murderer_chance": 4,
//                     "bow_kills_MURDER_CLASSIC": 3,
//                     "bow_kills_towerfall": 1,
//                     "bow_kills_towerfall_MURDER_CLASSIC": 1,
//                     "coins_pickedup_towerfall_MURDER_CLASSIC": 9,
//                     "detective_wins_MURDER_CLASSIC": 4,
//                     "detective_wins_towerfall": 2,
//                     "detective_wins_towerfall_MURDER_CLASSIC": 2,
//                     "games_towerfall_MURDER_CLASSIC": 2,
//                     "kills_MURDER_CLASSIC": 14,
//                     "kills_towerfall_MURDER_CLASSIC": 1,
//                     "quickest_detective_win_time_seconds": 60,
//                     "quickest_detective_win_time_seconds_MURDER_CLASSIC": 60,
//                     "quickest_detective_win_time_seconds_towerfall": 60,
//                     "quickest_detective_win_time_seconds_towerfall_MURDER_CLASSIC": 60,
//                     "was_hero_MURDER_CLASSIC": 3,
//                     "was_hero_towerfall": 1,
//                     "was_hero_towerfall_MURDER_CLASSIC": 1,
//                     "wins_towerfall_MURDER_CLASSIC": 2,
//                     "coins_pickedup_MURDER_INFECTION": 591,
//                     "coins_pickedup_archives_top_floor": 77,
//                     "coins_pickedup_archives_top_floor_MURDER_INFECTION": 70,
//                     "games_MURDER_INFECTION": 102,
//                     "games_archives_top_floor": 13,
//                     "games_archives_top_floor_MURDER_INFECTION": 12,
//                     "longest_time_as_survivor_seconds": 255,
//                     "longest_time_as_survivor_seconds_MURDER_INFECTION": 255,
//                     "longest_time_as_survivor_seconds_archives_top_floor": 255,
//                     "longest_time_as_survivor_seconds_archives_top_floor_MURDER_INFECTION": 255,
//                     "survivor_wins": 85,
//                     "survivor_wins_MURDER_INFECTION": 85,
//                     "survivor_wins_archives_top_floor": 12,
//                     "survivor_wins_archives_top_floor_MURDER_INFECTION": 12,
//                     "total_time_survived_seconds": 10635,
//                     "total_time_survived_seconds_MURDER_INFECTION": 10635,
//                     "total_time_survived_seconds_archives_top_floor": 8941,
//                     "total_time_survived_seconds_archives_top_floor_MURDER_INFECTION": 8941,
//                     "wins_MURDER_INFECTION": 92,
//                     "wins_archives_top_floor": 13,
//                     "wins_archives_top_floor_MURDER_INFECTION": 12,
//                     "coins_pickedup_san_peratico_v2": 73,
//                     "coins_pickedup_san_peratico_v2_MURDER_INFECTION": 73,
//                     "deaths_MURDER_INFECTION": 11,
//                     "deaths_san_peratico_v2": 3,
//                     "deaths_san_peratico_v2_MURDER_INFECTION": 3,
//                     "games_san_peratico_v2": 16,
//                     "games_san_peratico_v2_MURDER_INFECTION": 16,
//                     "longest_time_as_survivor_seconds_san_peratico_v2": 169,
//                     "longest_time_as_survivor_seconds_san_peratico_v2_MURDER_INFECTION": 169,
//                     "survivor_wins_san_peratico_v2": 13,
//                     "survivor_wins_san_peratico_v2_MURDER_INFECTION": 13,
//                     "total_time_survived_seconds_san_peratico_v2": 10007,
//                     "total_time_survived_seconds_san_peratico_v2_MURDER_INFECTION": 10007,
//                     "wins_san_peratico_v2": 15,
//                     "wins_san_peratico_v2_MURDER_INFECTION": 15,
//                     "bow_kills_MURDER_INFECTION": 28,
//                     "bow_kills_archives_top_floor": 14,
//                     "bow_kills_archives_top_floor_MURDER_INFECTION": 14,
//                     "kills_MURDER_INFECTION": 28,
//                     "kills_archives_top_floor": 25,
//                     "kills_archives_top_floor_MURDER_INFECTION": 14,
//                     "kills_as_survivor": 98,
//                     "kills_as_survivor_MURDER_INFECTION": 98,
//                     "kills_as_survivor_archives_top_floor": 21,
//                     "kills_as_survivor_archives_top_floor_MURDER_INFECTION": 21,
//                     "coins_pickedup_library_MURDER_INFECTION": 55,
//                     "games_library_MURDER_INFECTION": 12,
//                     "survivor_wins_library": 9,
//                     "survivor_wins_library_MURDER_INFECTION": 9,
//                     "total_time_survived_seconds_library": 10483,
//                     "total_time_survived_seconds_library_MURDER_INFECTION": 10483,
//                     "wins_library_MURDER_INFECTION": 11,
//                     "coins_pickedup_widow's_den": 9,
//                     "coins_pickedup_widow's_den_MURDER_INFECTION": 7,
//                     "games_widow's_den": 3,
//                     "games_widow's_den_MURDER_INFECTION": 2,
//                     "kills_as_survivor_widow's_den": 2,
//                     "kills_as_survivor_widow's_den_MURDER_INFECTION": 2,
//                     "survivor_wins_widow's_den": 2,
//                     "survivor_wins_widow's_den_MURDER_INFECTION": 2,
//                     "total_time_survived_seconds_widow's_den": 7374,
//                     "total_time_survived_seconds_widow's_den_MURDER_INFECTION": 7374,
//                     "wins_widow's_den": 3,
//                     "wins_widow's_den_MURDER_INFECTION": 2,
//                     "kills_as_infected": 44,
//                     "kills_as_infected_MURDER_INFECTION": 44,
//                     "kills_as_infected_library": 8,
//                     "kills_as_infected_library_MURDER_INFECTION": 8,
//                     "coins_pickedup_transport_MURDER_INFECTION": 25,
//                     "games_transport_MURDER_INFECTION": 4,
//                     "kills_as_survivor_transport": 1,
//                     "kills_as_survivor_transport_MURDER_INFECTION": 1,
//                     "survivor_wins_transport": 4,
//                     "survivor_wins_transport_MURDER_INFECTION": 4,
//                     "total_time_survived_seconds_transport": 2621,
//                     "total_time_survived_seconds_transport_MURDER_INFECTION": 2621,
//                     "wins_transport_MURDER_INFECTION": 4,
//                     "coins_pickedup_spooky_mansion": 58,
//                     "coins_pickedup_spooky_mansion_MURDER_INFECTION": 46,
//                     "games_spooky_mansion": 6,
//                     "games_spooky_mansion_MURDER_INFECTION": 3,
//                     "kills_as_survivor_spooky_mansion": 5,
//                     "kills_as_survivor_spooky_mansion_MURDER_INFECTION": 5,
//                     "survivor_wins_spooky_mansion": 3,
//                     "survivor_wins_spooky_mansion_MURDER_INFECTION": 3,
//                     "total_time_survived_seconds_spooky_mansion": 6376,
//                     "total_time_survived_seconds_spooky_mansion_MURDER_INFECTION": 6376,
//                     "wins_spooky_mansion": 3,
//                     "wins_spooky_mansion_MURDER_INFECTION": 3,
//                     "coins_pickedup_aquarium": 92,
//                     "coins_pickedup_aquarium_MURDER_INFECTION": 92,
//                     "games_aquarium": 11,
//                     "games_aquarium_MURDER_INFECTION": 11,
//                     "kills_as_survivor_aquarium": 12,
//                     "kills_as_survivor_aquarium_MURDER_INFECTION": 12,
//                     "survivor_wins_aquarium": 10,
//                     "survivor_wins_aquarium_MURDER_INFECTION": 10,
//                     "total_time_survived_seconds_aquarium": 7947,
//                     "total_time_survived_seconds_aquarium_MURDER_INFECTION": 7947,
//                     "wins_aquarium": 10,
//                     "wins_aquarium_MURDER_INFECTION": 10,
//                     "bow_kills_spooky_mansion": 2,
//                     "bow_kills_spooky_mansion_MURDER_INFECTION": 2,
//                     "kills_spooky_mansion": 2,
//                     "kills_spooky_mansion_MURDER_INFECTION": 2,
//                     "last_one_alive": 10,
//                     "last_one_alive_MURDER_INFECTION": 10,
//                     "last_one_alive_aquarium": 2,
//                     "last_one_alive_aquarium_MURDER_INFECTION": 2,
//                     "bow_kills_snowglobe": 4,
//                     "bow_kills_snowglobe_MURDER_CLASSIC": 1,
//                     "coins_pickedup_snowglobe": 34,
//                     "coins_pickedup_snowglobe_MURDER_CLASSIC": 19,
//                     "detective_wins_snowglobe": 1,
//                     "detective_wins_snowglobe_MURDER_CLASSIC": 1,
//                     "games_snowglobe": 4,
//                     "games_snowglobe_MURDER_CLASSIC": 2,
//                     "kills_snowglobe": 4,
//                     "kills_snowglobe_MURDER_CLASSIC": 1,
//                     "was_hero_snowglobe": 1,
//                     "was_hero_snowglobe_MURDER_CLASSIC": 1,
//                     "wins_snowglobe": 4,
//                     "wins_snowglobe_MURDER_CLASSIC": 2,
//                     "coins_pickedup_ancient_tomb_MURDER_CLASSIC": 14,
//                     "deaths_MURDER_CLASSIC": 3,
//                     "deaths_ancient_tomb_MURDER_CLASSIC": 1,
//                     "games_ancient_tomb_MURDER_CLASSIC": 2,
//                     "wins_ancient_tomb_MURDER_CLASSIC": 2,
//                     "coins_pickedup_spooky_mansion_MURDER_CLASSIC": 6,
//                     "deaths_spooky_mansion": 3,
//                     "deaths_spooky_mansion_MURDER_CLASSIC": 1,
//                     "games_spooky_mansion_MURDER_CLASSIC": 1,
//                     "bow_kills_cruise_ship": 1,
//                     "bow_kills_cruise_ship_MURDER_CLASSIC": 1,
//                     "coins_pickedup_cruise_ship": 26,
//                     "coins_pickedup_cruise_ship_MURDER_CLASSIC": 8,
//                     "detective_wins_cruise_ship": 1,
//                     "detective_wins_cruise_ship_MURDER_CLASSIC": 1,
//                     "games_cruise_ship": 5,
//                     "games_cruise_ship_MURDER_CLASSIC": 1,
//                     "kills_cruise_ship": 1,
//                     "kills_cruise_ship_MURDER_CLASSIC": 1,
//                     "was_hero_cruise_ship": 1,
//                     "was_hero_cruise_ship_MURDER_CLASSIC": 1,
//                     "wins_cruise_ship": 4,
//                     "wins_cruise_ship_MURDER_CLASSIC": 1,
//                     "coins_pickedup_hollywood_MURDER_CLASSIC": 3,
//                     "games_hollywood_MURDER_CLASSIC": 1,
//                     "coins_pickedup_widow's_den_MURDER_CLASSIC": 2,
//                     "games_widow's_den_MURDER_CLASSIC": 1,
//                     "wins_widow's_den_MURDER_CLASSIC": 1,
//                     "chest_history_new": [
//                         "last_words_condescending",
//                         "kill_note_master_sword",
//                         "kill_note_year_of_the_ox"
//                     ],
//                     "kills_as_survivor_library": 21,
//                     "kills_as_survivor_library_MURDER_INFECTION": 21,
//                     "coins_pickedup_gold_rush_MURDER_INFECTION": 50,
//                     "deaths_gold_rush_MURDER_INFECTION": 1,
//                     "games_gold_rush_MURDER_INFECTION": 9,
//                     "total_time_survived_seconds_gold_rush": 6866,
//                     "total_time_survived_seconds_gold_rush_MURDER_INFECTION": 6866,
//                     "kills_as_infected_san_peratico_v2": 9,
//                     "kills_as_infected_san_peratico_v2_MURDER_INFECTION": 9,
//                     "survivor_wins_gold_rush": 7,
//                     "survivor_wins_gold_rush_MURDER_INFECTION": 7,
//                     "wins_gold_rush_MURDER_INFECTION": 8,
//                     "kills_as_infected_gold_rush": 7,
//                     "kills_as_infected_gold_rush_MURDER_INFECTION": 7,
//                     "bow_kills_gold_rush": 1,
//                     "bow_kills_gold_rush_MURDER_INFECTION": 1,
//                     "kills_as_survivor_gold_rush": 5,
//                     "kills_as_survivor_gold_rush_MURDER_INFECTION": 5,
//                     "kills_gold_rush_MURDER_INFECTION": 1,
//                     "bow_kills_san_peratico_v2": 2,
//                     "bow_kills_san_peratico_v2_MURDER_INFECTION": 2,
//                     "kills_as_survivor_san_peratico_v2": 10,
//                     "kills_as_survivor_san_peratico_v2_MURDER_INFECTION": 10,
//                     "kills_san_peratico_v2": 2,
//                     "kills_san_peratico_v2_MURDER_INFECTION": 2,
//                     "coins_pickedup_hypixel_world_MURDER_INFECTION": 18,
//                     "deaths_hypixel_world_MURDER_INFECTION": 3,
//                     "games_hypixel_world_MURDER_INFECTION": 5,
//                     "survivor_wins_hypixel_world": 3,
//                     "survivor_wins_hypixel_world_MURDER_INFECTION": 3,
//                     "total_time_survived_seconds_hypixel_world": 10635,
//                     "total_time_survived_seconds_hypixel_world_MURDER_INFECTION": 10635,
//                     "wins_hypixel_world_MURDER_INFECTION": 3,
//                     "deaths_archives_top_floor": 1,
//                     "deaths_archives_top_floor_MURDER_INFECTION": 1,
//                     "bow_kills_hypixel_world": 4,
//                     "bow_kills_hypixel_world_MURDER_INFECTION": 4,
//                     "kills_as_survivor_hypixel_world": 4,
//                     "kills_as_survivor_hypixel_world_MURDER_INFECTION": 4,
//                     "kills_hypixel_world_MURDER_INFECTION": 4,
//                     "coins_pickedup_cruise_ship_MURDER_INFECTION": 18,
//                     "games_cruise_ship_MURDER_INFECTION": 4,
//                     "survivor_wins_cruise_ship": 2,
//                     "survivor_wins_cruise_ship_MURDER_INFECTION": 2,
//                     "total_time_survived_seconds_cruise_ship": 10576,
//                     "total_time_survived_seconds_cruise_ship_MURDER_INFECTION": 10576,
//                     "wins_cruise_ship_MURDER_INFECTION": 3,
//                     "kills_as_infected_archives_top_floor": 4,
//                     "kills_as_infected_archives_top_floor_MURDER_INFECTION": 4,
//                     "coins_pickedup_archives_MURDER_INFECTION": 1,
//                     "games_archives_MURDER_INFECTION": 1,
//                     "kills_as_survivor_archives": 1,
//                     "kills_as_survivor_archives_MURDER_INFECTION": 1,
//                     "survivor_wins_archives": 1,
//                     "survivor_wins_archives_MURDER_INFECTION": 1,
//                     "total_time_survived_seconds_archives": 4422,
//                     "total_time_survived_seconds_archives_MURDER_INFECTION": 4422,
//                     "wins_archives_MURDER_INFECTION": 1,
//                     "kills_as_infected_aquarium": 3,
//                     "kills_as_infected_aquarium_MURDER_INFECTION": 3,
//                     "coins_pickedup_towerfall_MURDER_INFECTION": 20,
//                     "games_towerfall_MURDER_INFECTION": 5,
//                     "kills_as_survivor_towerfall": 2,
//                     "kills_as_survivor_towerfall_MURDER_INFECTION": 2,
//                     "last_one_alive_towerfall": 2,
//                     "last_one_alive_towerfall_MURDER_INFECTION": 2,
//                     "survivor_wins_towerfall": 4,
//                     "survivor_wins_towerfall_MURDER_INFECTION": 4,
//                     "total_time_survived_seconds_towerfall": 10064,
//                     "total_time_survived_seconds_towerfall_MURDER_INFECTION": 10064,
//                     "wins_towerfall_MURDER_INFECTION": 5,
//                     "coins_pickedup_hollywood_MURDER_INFECTION": 33,
//                     "games_hollywood_MURDER_INFECTION": 2,
//                     "kills_as_survivor_hollywood": 4,
//                     "kills_as_survivor_hollywood_MURDER_INFECTION": 4,
//                     "total_time_survived_seconds_hollywood": 5603,
//                     "total_time_survived_seconds_hollywood_MURDER_INFECTION": 5603,
//                     "kills_as_infected_hollywood": 1,
//                     "kills_as_infected_hollywood_MURDER_INFECTION": 1,
//                     "survivor_wins_hollywood": 1,
//                     "survivor_wins_hollywood_MURDER_INFECTION": 1,
//                     "wins_hollywood_MURDER_INFECTION": 1,
//                     "coins_pickedup_mountain": 21,
//                     "coins_pickedup_mountain_MURDER_INFECTION": 20,
//                     "games_mountain": 5,
//                     "games_mountain_MURDER_INFECTION": 4,
//                     "survivor_wins_mountain": 4,
//                     "survivor_wins_mountain_MURDER_INFECTION": 4,
//                     "total_time_survived_seconds_mountain": 9045,
//                     "total_time_survived_seconds_mountain_MURDER_INFECTION": 9045,
//                     "wins_mountain": 5,
//                     "wins_mountain_MURDER_INFECTION": 4,
//                     "coins_pickedup_snowglobe_MURDER_INFECTION": 15,
//                     "games_snowglobe_MURDER_INFECTION": 2,
//                     "kills_as_infected_snowglobe": 1,
//                     "kills_as_infected_snowglobe_MURDER_INFECTION": 1,
//                     "survivor_wins_snowglobe": 2,
//                     "survivor_wins_snowglobe_MURDER_INFECTION": 2,
//                     "total_time_survived_seconds_snowglobe": 7007,
//                     "total_time_survived_seconds_snowglobe_MURDER_INFECTION": 7007,
//                     "wins_snowglobe_MURDER_INFECTION": 2,
//                     "alpha_chance": 2,
//                     "last_one_alive_gold_rush": 1,
//                     "last_one_alive_gold_rush_MURDER_INFECTION": 1,
//                     "coins_pickedup_subway": 24,
//                     "coins_pickedup_subway_MURDER_INFECTION": 24,
//                     "games_subway": 3,
//                     "games_subway_MURDER_INFECTION": 3,
//                     "kills_as_infected_subway": 2,
//                     "kills_as_infected_subway_MURDER_INFECTION": 2,
//                     "survivor_wins_subway": 3,
//                     "survivor_wins_subway_MURDER_INFECTION": 3,
//                     "total_time_survived_seconds_subway": 8141,
//                     "total_time_survived_seconds_subway_MURDER_INFECTION": 8141,
//                     "wins_subway": 3,
//                     "wins_subway_MURDER_INFECTION": 3,
//                     "bow_kills_snowglobe_MURDER_INFECTION": 3,
//                     "kills_as_survivor_snowglobe": 4,
//                     "kills_as_survivor_snowglobe_MURDER_INFECTION": 4,
//                     "kills_snowglobe_MURDER_INFECTION": 3,
//                     "last_one_alive_snowglobe": 1,
//                     "last_one_alive_snowglobe_MURDER_INFECTION": 1,
//                     "coins_pickedup_skyway_pier": 2,
//                     "coins_pickedup_skyway_pier_MURDER_INFECTION": 2,
//                     "games_skyway_pier": 3,
//                     "games_skyway_pier_MURDER_INFECTION": 2,
//                     "survivor_wins_skyway_pier": 1,
//                     "survivor_wins_skyway_pier_MURDER_INFECTION": 1,
//                     "total_time_survived_seconds_skyway_pier": 10606,
//                     "total_time_survived_seconds_skyway_pier_MURDER_INFECTION": 10606,
//                     "wins_skyway_pier": 1,
//                     "wins_skyway_pier_MURDER_INFECTION": 1,
//                     "coins_pickedup_ancient_tomb_MURDER_INFECTION": 12,
//                     "games_ancient_tomb_MURDER_INFECTION": 3,
//                     "last_one_alive_ancient_tomb": 1,
//                     "last_one_alive_ancient_tomb_MURDER_INFECTION": 1,
//                     "survivor_wins_ancient_tomb": 2,
//                     "survivor_wins_ancient_tomb_MURDER_INFECTION": 2,
//                     "total_time_survived_seconds_ancient_tomb": 8178,
//                     "total_time_survived_seconds_ancient_tomb_MURDER_INFECTION": 8178,
//                     "wins_ancient_tomb_MURDER_INFECTION": 2,
//                     "kills_as_infected_ancient_tomb": 1,
//                     "kills_as_infected_ancient_tomb_MURDER_INFECTION": 1,
//                     "kills_as_survivor_ancient_tomb": 2,
//                     "kills_as_survivor_ancient_tomb_MURDER_INFECTION": 2,
//                     "kills_as_survivor_subway": 1,
//                     "kills_as_survivor_subway_MURDER_INFECTION": 1,
//                     "deaths_ancient_tomb_MURDER_INFECTION": 1,
//                     "mm_christmas_chests": 8,
//                     "coins_pickedup_headquarters_MURDER_INFECTION": 7,
//                     "games_headquarters_MURDER_INFECTION": 1,
//                     "kills_as_infected_headquarters": 6,
//                     "kills_as_infected_headquarters_MURDER_INFECTION": 6,
//                     "survivor_wins_headquarters": 1,
//                     "survivor_wins_headquarters_MURDER_INFECTION": 1,
//                     "total_time_survived_seconds_headquarters": 8282,
//                     "total_time_survived_seconds_headquarters_MURDER_INFECTION": 8282,
//                     "wins_headquarters_MURDER_INFECTION": 1,
//                     "coins_pickedup_snowfall": 3,
//                     "coins_pickedup_snowfall_MURDER_INFECTION": 3,
//                     "games_snowfall": 1,
//                     "games_snowfall_MURDER_INFECTION": 1,
//                     "kills_as_survivor_snowfall": 2,
//                     "kills_as_survivor_snowfall_MURDER_INFECTION": 2,
//                     "survivor_wins_snowfall": 1,
//                     "survivor_wins_snowfall_MURDER_INFECTION": 1,
//                     "total_time_survived_seconds_snowfall": 8420,
//                     "total_time_survived_seconds_snowfall_MURDER_INFECTION": 8420,
//                     "wins_snowfall": 1,
//                     "wins_snowfall_MURDER_INFECTION": 1,
//                     "coins_pickedup_archives_top_floor_MURDER_CLASSIC": 7,
//                     "games_archives_top_floor_MURDER_CLASSIC": 1,
//                     "kills_archives_top_floor_MURDER_CLASSIC": 11,
//                     "kills_as_murderer": 11,
//                     "kills_as_murderer_MURDER_CLASSIC": 11,
//                     "kills_as_murderer_archives_top_floor": 11,
//                     "kills_as_murderer_archives_top_floor_MURDER_CLASSIC": 11,
//                     "knife_kills_MURDER_CLASSIC": 11,
//                     "knife_kills_archives_top_floor": 11,
//                     "knife_kills_archives_top_floor_MURDER_CLASSIC": 11,
//                     "murderer_wins": 1,
//                     "murderer_wins_MURDER_CLASSIC": 1,
//                     "murderer_wins_archives_top_floor": 1,
//                     "murderer_wins_archives_top_floor_MURDER_CLASSIC": 1,
//                     "quickest_murderer_win_time_seconds": 147,
//                     "quickest_murderer_win_time_seconds_MURDER_CLASSIC": 147,
//                     "quickest_murderer_win_time_seconds_archives_top_floor": 147,
//                     "quickest_murderer_win_time_seconds_archives_top_floor_MURDER_CLASSIC": 147,
//                     "wins_archives_top_floor_MURDER_CLASSIC": 1,
//                     "games_skyway_pier_MURDER_CLASSIC": 1,
//                     "last_one_alive_archives_top_floor": 1,
//                     "last_one_alive_archives_top_floor_MURDER_INFECTION": 1,
//                     "kills_as_infected_hypixel_world": 2,
//                     "kills_as_infected_hypixel_world_MURDER_INFECTION": 2,
//                     "deaths_cruise_ship": 1,
//                     "deaths_cruise_ship_MURDER_INFECTION": 1,
//                     "last_one_alive_san_peratico_v2": 1,
//                     "last_one_alive_san_peratico_v2_MURDER_INFECTION": 1,
//                     "bow_kills_library": 2,
//                     "bow_kills_library_MURDER_INFECTION": 2,
//                     "kills_library_MURDER_INFECTION": 2,
//                     "last_one_alive_library": 1,
//                     "last_one_alive_library_MURDER_INFECTION": 1,
//                     "kills_as_survivor_cruise_ship": 1,
//                     "kills_as_survivor_cruise_ship_MURDER_INFECTION": 1,
//                     "deaths_skyway_pier": 1,
//                     "deaths_skyway_pier_MURDER_INFECTION": 1,
//                     "coins_pickedup_mountain_MURDER_CLASSIC": 1,
//                     "deaths_mountain": 1,
//                     "deaths_mountain_MURDER_CLASSIC": 1,
//                     "games_mountain_MURDER_CLASSIC": 1,
//                     "wins_mountain_MURDER_CLASSIC": 1,
//                     "bow_kills_MURDER_ASSASSINS": 2,
//                     "bow_kills_hollywood": 2,
//                     "bow_kills_hollywood_MURDER_ASSASSINS": 2,
//                     "coins_pickedup_spooky_mansion_MURDER_ASSASSINS": 6,
//                     "deaths_spooky_mansion_MURDER_ASSASSINS": 2,
//                     "games_spooky_mansion_MURDER_ASSASSINS": 2
//                 },
//                 "Duels": {
//                     "deaths": 88,
//                     "bridge_3v3v3v3_deaths": 69,
//                     "bridge_3v3v3v3_losses": 14,
//                     "bridge_3v3v3v3_rounds_played": 18,
//                     "bridge_3v3v3v3_wins": 4,
//                     "goals": 23,
//                     "bridge_3v3v3v3_kills": 51,
//                     "losses": 29,
//                     "bridge_3v3v3v3_goals": 22,
//                     "wins": 7,
//                     "rounds_played": 81,
//                     "packages": [
//                         "fixedachievementsoct2018",
//                         "victory_dance_snow_bomber",
//                         "kill_effect_frozen_in_time",
//                         "victory_dance_winter_twister",
//                         "kill_effect_crackling_ice",
//                         "kill_effect_blood_bats",
//                         "projectile_trail_howling_wind",
//                         "kill_effect_skeletalremains",
//                         "kill_effect_after_life",
//                         "projectile_trail_spiders_silk",
//                         "projectile_trail_cursedflame",
//                         "projectile_trail_wisp_whirlwind",
//                         "victory_dance_graveyardrave"
//                     ],
//                     "classic_rookie_title_prestige": 1,
//                     "all_modes_rookie_title_prestige": 1,
//                     "mega_walls_rookie_title_prestige": 1,
//                     "skywars_rookie_title_prestige": 1,
//                     "sumo_rookie_title_prestige": 1,
//                     "blitz_rookie_title_prestige": 1,
//                     "uhc_rookie_title_prestige": 1,
//                     "tournament_rookie_title_prestige": 1,
//                     "bridge_rookie_title_prestige": 1,
//                     "tnt_games_rookie_title_prestige": 1,
//                     "bow_rookie_title_prestige": 1,
//                     "op_rookie_title_prestige": 1,
//                     "no_debuff_rookie_title_prestige": 1,
//                     "combo_rookie_title_prestige": 1,
//                     "duels_recently_played": "BRIDGE_FOUR#BRIDGE_DUEL#",
//                     "selected_2_new": "blitz",
//                     "selected_1_new": "sumo",
//                     "show_lb_option": "on",
//                     "games_played_duels": 64,
//                     "chat_enabled": "on",
//                     "bridgeMapWins": [
//                         "Tundra",
//                         "Lighthouse",
//                         "Flora"
//                     ],
//                     "maps_won_on": [
//                         "Tundra",
//                         "Lighthouse",
//                         "Flora",
//                         "Space Mine"
//                     ],
//                     "bridge_duel_health_regenerated": 86,
//                     "melee_swings": 2207,
//                     "blocks_placed": 909,
//                     "melee_hits": 682,
//                     "bridge_duel_goals": 1,
//                     "bridge_duel_bridge_deaths": 31,
//                     "bridge_duel_damage_dealt": 1880,
//                     "bow_shots": 350,
//                     "bridge_duel_bridge_kills": 19,
//                     "coins": 641,
//                     "bridge_duel_melee_hits": 380,
//                     "bridge_duel_blocks_placed": 801,
//                     "bridge_duel_melee_swings": 1362,
//                     "health_regenerated": 240,
//                     "bridge_kills": 20,
//                     "bridge_duel_rounds_played": 13,
//                     "damage_dealt": 2669,
//                     "bridge_duel_wins": 2,
//                     "bridge_deaths": 34,
//                     "bridge_duel_bow_shots": 91,
//                     "bridge_duel_losses": 2,
//                     "bow_hits": 82,
//                     "bridge_duel_bow_hits": 32,
//                     "bridge_four_rounds_played": 1,
//                     "bridge_four_bridge_deaths": 3,
//                     "bridge_four_damage_dealt": 24,
//                     "bridge_four_bridge_kills": 1,
//                     "bridge_four_bow_hits": 2,
//                     "bridge_four_blocks_placed": 14,
//                     "bridge_four_bow_shots": 5,
//                     "bridge_four_losses": 1,
//                     "bridge_four_melee_swings": 41,
//                     "bridge_four_health_regenerated": 5,
//                     "bridge_four_melee_hits": 8,
//                     "duels_recently_played2": "PARKOUR_EIGHT#BRIDGE_DUEL#SUMO_DUEL#BRIDGE_DUEL#",
//                     "kills": 1,
//                     "sumo_duel_kills": 1,
//                     "sumo_duel_melee_hits": 94,
//                     "sumo_duel_melee_swings": 244,
//                     "sumo_duel_rounds_played": 15,
//                     "sumo_duel_wins": 1,
//                     "sumo_duel_deaths": 6,
//                     "sumo_duel_losses": 6,
//                     "classic_duel_bow_hits": 5,
//                     "classic_duel_bow_shots": 18,
//                     "classic_duel_damage_dealt": 134,
//                     "classic_duel_health_regenerated": 15,
//                     "classic_duel_melee_hits": 66,
//                     "classic_duel_melee_swings": 147,
//                     "classic_duel_rounds_played": 8,
//                     "sw_duels_kit_new3": "kit_ranked_ranked_scout",
//                     "sw_duel_rounds_played": 2,
//                     "sw_duel_blocks_placed": 12,
//                     "sw_duel_bow_hits": 3,
//                     "sw_duel_bow_shots": 4,
//                     "sw_duel_damage_dealt": 9,
//                     "golden_apples_eaten": 13,
//                     "uhc_duel_blocks_placed": 4,
//                     "uhc_duel_bow_hits": 9,
//                     "uhc_duel_bow_shots": 20,
//                     "uhc_duel_damage_dealt": 40,
//                     "uhc_duel_golden_apples_eaten": 4,
//                     "uhc_duel_health_regenerated": 90,
//                     "uhc_duel_melee_hits": 24,
//                     "uhc_duel_melee_swings": 76,
//                     "uhc_duel_rounds_played": 2,
//                     "op_doubles_damage_dealt": 13,
//                     "op_doubles_health_regenerated": 5,
//                     "op_doubles_melee_hits": 10,
//                     "op_doubles_melee_swings": 40,
//                     "op_doubles_rounds_played": 1,
//                     "sw_doubles_bow_shots": 4,
//                     "sw_doubles_health_regenerated": 1,
//                     "sw_doubles_rounds_played": 1,
//                     "bridge_doubles_blocks_placed": 78,
//                     "bridge_doubles_bow_hits": 2,
//                     "bridge_doubles_bow_shots": 4,
//                     "bridge_doubles_damage_dealt": 476,
//                     "bridge_doubles_health_regenerated": 38,
//                     "bridge_doubles_melee_hits": 100,
//                     "bridge_doubles_melee_swings": 297,
//                     "bridge_doubles_rounds_played": 4,
//                     "bowspleef_duel_bow_shots": 125,
//                     "bowspleef_duel_rounds_played": 4,
//                     "moved_to_redis_2": true,
//                     "boxing_rookie_title_prestige": 1,
//                     "parkour_rookie_title_prestige": 1,
//                     "kit_menu_option": "on",
//                     "parkour_eight_deaths": 13,
//                     "parkour_eight_losses": 6,
//                     "parkour_eight_rounds_played": 7,
//                     "moved_to_redis_3": true,
//                     "rematch_option_1": "default",
//                     "bow_duel_bow_hits": 29,
//                     "bow_duel_bow_shots": 79,
//                     "bow_duel_damage_dealt": 93,
//                     "bow_duel_rounds_played": 5,
//                     "bridge_duel_golden_apples_eaten": 9,
//                     "layout_bridge_duel_layout": {
//                         "0": "iron_sword",
//                         "1": "stained_clay_1",
//                         "2": "diamond_pickaxe",
//                         "3": "bow",
//                         "4": "stained_clay_2",
//                         "5": "golden_apple",
//                         "7": "glyph_menu",
//                         "8": "arrow"
//                     }
//                 },
//                 "SkyBlock": {
//                     "profiles": {
//                         "2589ea184df34ff099613d3a8616168f": {
//                             "profile_id": "2589ea18-4df3-4ff0-9961-3d3a8616168f",
//                             "cute_name": "Banana"
//                         }
//                     }
//                 },
//                 "Pit": {
//                     "profile": {
//                         "moved_achievements_1": true,
//                         "outgoing_offers": [],
//                         "moved_achievements_2": true,
//                         "items_last_buy": {},
//                         "leaderboard_stats": {},
//                         "last_save": 1613358374487,
//                         "king_quest": {
//                             "kills": 6
//                         },
//                         "inv_armor": {
//                             "type": 0,
//                             "data": [
//                                 31,
//                                 -117,
//                                 8,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 -29,
//                                 98,
//                                 96,
//                                 -32,
//                                 100,
//                                 96,
//                                 -52,
//                                 -28,
//                                 98,
//                                 96,
//                                 96,
//                                 96,
//                                 97,
//                                 98,
//                                 96,
//                                 -54,
//                                 76,
//                                 97,
//                                 52,
//                                 101,
//                                 100,
//                                 96,
//                                 117,
//                                 -50,
//                                 47,
//                                 -51,
//                                 43,
//                                 97,
//                                 -28,
//                                 98,
//                                 96,
//                                 46,
//                                 73,
//                                 76,
//                                 103,
//                                 100,
//                                 -32,
//                                 14,
//                                 -51,
//                                 75,
//                                 42,
//                                 74,
//                                 77,
//                                 -52,
//                                 78,
//                                 76,
//                                 -54,
//                                 73,
//                                 101,
//                                 100,
//                                 96,
//                                 98,
//                                 96,
//                                 115,
//                                 73,
//                                 -52,
//                                 77,
//                                 76,
//                                 79,
//                                 5,
//                                 106,
//                                 -127,
//                                 -24,
//                                 48,
//                                 32,
//                                 89,
//                                 -121,
//                                 62,
//                                 9,
//                                 58,
//                                 24,
//                                 24,
//                                 0,
//                                 -84,
//                                 32,
//                                 -32,
//                                 30,
//                                 -92,
//                                 0,
//                                 0,
//                                 0
//                             ]
//                         },
//                         "login_messages": [],
//                         "spire_stash_inv": {
//                             "type": 0,
//                             "data": [
//                                 31,
//                                 -117,
//                                 8,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 -29,
//                                 98,
//                                 96,
//                                 -32,
//                                 100,
//                                 96,
//                                 -52,
//                                 100,
//                                 0,
//                                 3,
//                                 0,
//                                 -58,
//                                 2,
//                                 -70,
//                                 27,
//                                 13,
//                                 0,
//                                 0,
//                                 0
//                             ]
//                         },
//                         "xp": 1579,
//                         "inv_contents": {
//                             "type": 0,
//                             "data": [
//                                 31,
//                                 -117,
//                                 8,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 -29,
//                                 98,
//                                 96,
//                                 -32,
//                                 100,
//                                 96,
//                                 -52,
//                                 -28,
//                                 98,
//                                 96,
//                                 96,
//                                 80,
//                                 97,
//                                 98,
//                                 96,
//                                 -54,
//                                 76,
//                                 97,
//                                 -28,
//                                 102,
//                                 100,
//                                 96,
//                                 117,
//                                 -50,
//                                 47,
//                                 -51,
//                                 43,
//                                 97,
//                                 -28,
//                                 98,
//                                 96,
//                                 46,
//                                 73,
//                                 76,
//                                 103,
//                                 100,
//                                 -32,
//                                 14,
//                                 -51,
//                                 75,
//                                 42,
//                                 74,
//                                 77,
//                                 -52,
//                                 78,
//                                 76,
//                                 -54,
//                                 73,
//                                 101,
//                                 100,
//                                 96,
//                                 98,
//                                 96,
//                                 115,
//                                 73,
//                                 -52,
//                                 77,
//                                 76,
//                                 79,
//                                 5,
//                                 106,
//                                 -127,
//                                 -24,
//                                 96,
//                                 37,
//                                 65,
//                                 7,
//                                 4,
//                                 64,
//                                 -12,
//                                 -79,
//                                 -63,
//                                 -12,
//                                 41,
//                                 96,
//                                 -86,
//                                 -64,
//                                 14,
//                                 0,
//                                 -127,
//                                 123,
//                                 -123,
//                                 -107,
//                                 -82,
//                                 0,
//                                 0,
//                                 0
//                             ]
//                         },
//                         "zero_point_three_gold_transfer": true,
//                         "inv_enderchest": {
//                             "type": 0,
//                             "data": [
//                                 31,
//                                 -117,
//                                 8,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 -29,
//                                 98,
//                                 96,
//                                 -32,
//                                 100,
//                                 96,
//                                 -52,
//                                 -28,
//                                 98,
//                                 96,
//                                 96,
//                                 -112,
//                                 102,
//                                 -64,
//                                 3,
//                                 0,
//                                 -47,
//                                 59,
//                                 -26,
//                                 15,
//                                 40,
//                                 0,
//                                 0,
//                                 0
//                             ]
//                         },
//                         "bounties": [],
//                         "unlocks": [
//                             {
//                                 "tier": 0,
//                                 "acquireDate": 1529795764292,
//                                 "key": "xp_boost"
//                             },
//                             {
//                                 "tier": 0,
//                                 "acquireDate": 1529795863622,
//                                 "key": "cash_boost"
//                             },
//                             {
//                                 "tier": 0,
//                                 "acquireDate": 1529796253970,
//                                 "key": "melee_damage"
//                             },
//                             {
//                                 "tier": 0,
//                                 "acquireDate": 1529796513128,
//                                 "key": "damage_reduction"
//                             }
//                         ],
//                         "spire_stash_armor": {
//                             "type": 0,
//                             "data": [
//                                 31,
//                                 -117,
//                                 8,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 0,
//                                 -29,
//                                 98,
//                                 96,
//                                 -32,
//                                 100,
//                                 96,
//                                 -52,
//                                 100,
//                                 0,
//                                 3,
//                                 0,
//                                 -58,
//                                 2,
//                                 -70,
//                                 27,
//                                 13,
//                                 0,
//                                 0,
//                                 0
//                             ]
//                         },
//                         "cash": 702.1779999999998,
//                         "cash_during_prestige_0": 3102.178000000001
//                     },
//                     "pit_stats_ptl": {
//                         "joins": 4,
//                         "deaths": 8,
//                         "enderchest_opened": 1,
//                         "melee_damage_dealt": 166,
//                         "sword_hits": 54,
//                         "cash_earned": 141,
//                         "launched_by_launchers": 2,
//                         "arrows_fired": 27,
//                         "bow_damage_dealt": 55,
//                         "playtime_minutes": 5,
//                         "bow_damage_received": 11,
//                         "kills": 6,
//                         "damage_received": 195,
//                         "jumped_into_pit": 6,
//                         "melee_damage_received": 182,
//                         "left_clicks": 145,
//                         "arrow_hits": 17,
//                         "damage_dealt": 221,
//                         "assists": 10,
//                         "gapple_eaten": 1,
//                         "max_streak": 1
//                     }
//                 },
//                 "BuildBattle": {
//                     "coins": 5978,
//                     "games_played": 26,
//                     "monthly_coins_a": 3676,
//                     "score": 420,
//                     "teams_most_points": 42,
//                     "total_votes": 155,
//                     "weekly_coins_b": 2837,
//                     "correct_guesses": 49,
//                     "wins": 1,
//                     "wins_guess_the_build": 1,
//                     "solo_most_points": 87,
//                     "weekly_coins_a": 3141,
//                     "monthly_coins_b": 2302,
//                     "packages": [
//                         "victory_dance_snow_bomber",
//                         "victory_dance_winter_twister",
//                         "victory_dance_graveyardrave"
//                     ]
//                 },
//                 "Legacy": {
//                     "tokens": 67,
//                     "total_tokens": 67,
//                     "walls_tokens": 8,
//                     "next_tokens_seconds": 36,
//                     "quakecraft_tokens": 59
//                 },
//                 "Housing": {
//                     "packages": [
//                         "skull_pack_holiday"
//                     ]
//                 },
//                 "WoolGames": {
//                     "progression": {
//                         "available_layers": 27,
//                         "experience": 2027.0833333333333
//                     },
//                     "coins": 50,
//                     "wool_wars": {
//                         "layouts": {
//                             "assault": {
//                                 "0": "WOOD_SWORD",
//                                 "1": "IRON_PICKAXE",
//                                 "2": "STONE_SPADE",
//                                 "3": "SHEARS",
//                                 "4": "WOOL",
//                                 "5": "POTION_16421",
//                                 "6": "POTION_16396",
//                                 "8": "KEYSTONE"
//                             },
//                             "engineer": {
//                                 "0": "WOOD_SWORD",
//                                 "1": "STONE_PICKAXE",
//                                 "2": "SHEARS",
//                                 "3": "BOW",
//                                 "4": "WOOL",
//                                 "5": "POTION_16387",
//                                 "7": "ARROW",
//                                 "8": "KEYSTONE"
//                             },
//                             "golem": {
//                                 "0": "STONE_SWORD",
//                                 "1": "WOOL",
//                                 "8": "KEYSTONE"
//                             },
//                             "archer": {
//                                 "0": "WOOD_AXE",
//                                 "1": "WOOD_PICKAXE",
//                                 "2": "SHEARS",
//                                 "3": "BOW",
//                                 "4": "WOOL",
//                                 "7": "ARROW",
//                                 "8": "KEYSTONE"
//                             }
//                         },
//                         "selected_class": "ARCHER",
//                         "stats": {
//                             "assists": 43,
//                             "blocks_broken": 135,
//                             "classes": {
//                                 "archer": {
//                                     "assists": 22,
//                                     "blocks_broken": 37,
//                                     "deaths": 17,
//                                     "kills": 7,
//                                     "wool_placed": 27,
//                                     "powerups_gotten": 7
//                                 },
//                                 "assault": {
//                                     "deaths": 6,
//                                     "assists": 7,
//                                     "blocks_broken": 47,
//                                     "kills": 3,
//                                     "wool_placed": 19,
//                                     "powerups_gotten": 1
//                                 },
//                                 "swordsman": {
//                                     "assists": 7,
//                                     "deaths": 9,
//                                     "kills": 9,
//                                     "powerups_gotten": 5,
//                                     "blocks_broken": 17,
//                                     "wool_placed": 13
//                                 },
//                                 "engineer": {
//                                     "assists": 7,
//                                     "blocks_broken": 34,
//                                     "deaths": 7,
//                                     "powerups_gotten": 2,
//                                     "wool_placed": 29
//                                 },
//                                 "golem": {
//                                     "deaths": 1
//                                 }
//                             },
//                             "deaths": 40,
//                             "games_played": 19,
//                             "kills": 19,
//                             "wins": 14,
//                             "wool_placed": 88,
//                             "powerups_gotten": 15
//                         }
//                     },
//                     "lastTourneyAd": 1693792137266,
//                     "packages": [
//                         "projectiletrail_howling_wind",
//                         "projectiletrail_spiders_silk",
//                         "projectiletrail_cursedflame",
//                         "projectiletrail_wisp_whirlwind"
//                     ]
//                 },
//                 "MainLobby": {
//                     "fishing": {
//                         "ice": {
//                             "spokenToNereid": true
//                         }
//                     }
//                 }
//             },
//             "spec_auto_teleport": true,
//             "networkExp": 10147262,
//             "eugene": {
//                 "dailyTwoKExp": 1703394818854
//             },
//             "petConsumables": {
//                 "MUSHROOM_SOUP": 354,
//                 "CARROT_ITEM": 313,
//                 "BAKED_POTATO": 341,
//                 "FEATHER": 969,
//                 "HAY_BLOCK": 326,
//                 "ROTTEN_FLESH": 321,
//                 "SLIME_BALL": 951,
//                 "COOKED_BEEF": 322,
//                 "CAKE": 315,
//                 "WATER_BUCKET": 1852,
//                 "STICK": 975,
//                 "WOOD_SWORD": 992,
//                 "MILK_BUCKET": 1956,
//                 "GOLD_RECORD": 1053,
//                 "LEASH": 950,
//                 "LAVA_BUCKET": 1984,
//                 "MAGMA_CREAM": 327,
//                 "WHEAT": 328,
//                 "COOKIE": 342,
//                 "BREAD": 323,
//                 "RAW_FISH": 330,
//                 "PORK": 347,
//                 "APPLE": 327,
//                 "RED_ROSE": 296,
//                 "MELON": 305,
//                 "BONE": 328,
//                 "PUMPKIN_PIE": 316
//             },
//             "housingMeta": {
//                 "packages": [
//                     "future_tech_theme",
//                     "basic_theme",
//                     "gifts_theme",
//                     "housing_item_flag_1",
//                     "warlords_blue_theme",
//                     "housing_item_flag_3",
//                     "flowers_theme",
//                     "northern_lights_theme",
//                     "lollipop_theme",
//                     "easter_egg_village_theme",
//                     "jungle_theme",
//                     "mushrooms_theme",
//                     "goldmine_theme",
//                     "sci_fi_theme",
//                     "fruit_salad_theme",
//                     "vanilla_theme",
//                     "nether_theme",
//                     "painter_studio_theme",
//                     "end_theme",
//                     "synced_cookies_v1",
//                     "space_dock_theme"
//                 ],
//                 "allowedBlocks": [
//                     "155:0",
//                     "3:0",
//                     "1:0",
//                     "5:0",
//                     "50:0",
//                     "98:0",
//                     "4:0",
//                     "18:0",
//                     "35:0",
//                     "20:0",
//                     "324:0",
//                     "13:0",
//                     "85:0",
//                     "2:0",
//                     "31:1",
//                     "3:1",
//                     "38:0",
//                     "37:0",
//                     "53:0",
//                     "109:0",
//                     "44:0",
//                     "171:0",
//                     "139:0",
//                     "17:1",
//                     "5:2",
//                     "45:0",
//                     "5:1",
//                     "18:1",
//                     "126:0",
//                     "44:5",
//                     "80:0",
//                     "78:0",
//                     "1:3",
//                     "12:1",
//                     "172:0",
//                     "48:0",
//                     "12:0",
//                     "24:0",
//                     "32:0",
//                     "65:0",
//                     "323:0",
//                     "188:0",
//                     "77:0",
//                     "126:2",
//                     "6:3",
//                     "6:4",
//                     "35:4",
//                     "31:0",
//                     "164:0",
//                     "184:0",
//                     "325:0",
//                     "82:0",
//                     "1:1",
//                     "58:0",
//                     "182:0",
//                     "126:3",
//                     "171:2",
//                     "110:0",
//                     "1:5",
//                     "1:6",
//                     "159:3",
//                     "87:0",
//                     "88:0",
//                     "112:0",
//                     "121:0"
//                 ],
//                 "tutorialStep": "FINISH_FINISHED",
//                 "firstHouseJoinMs": 1568851350373,
//                 "plotSize": "SMALL"
//             },
//             "vanityMeta": {
//                 "packages": [
//                     "cloak_icy_wings",
//                     "hat_letter_o",
//                     "hat_sloth",
//                     "gadget_explosive_bow",
//                     "hat_doge",
//                     "suit_toy_leggings",
//                     "gadget_exploding_sheep",
//                     "gadget_paintball_gun",
//                     "gadget_fire_trail",
//                     "hat_ferret",
//                     "pet_wolf",
//                     "hat_astronaut",
//                     "suit_frog_chestplate",
//                     "suit_frog_boots",
//                     "pet_pig_zombie_baby",
//                     "hat_beach_ball",
//                     "hat_number_2",
//                     "pet_sheep_yellow",
//                     "emote_wink",
//                     "pet_cat_black",
//                     "suit_wolf_chestplate",
//                     "hat_cactus",
//                     "suit_costume_boots",
//                     "pet_zombie",
//                     "hat_monk",
//                     "pet_sheep_white",
//                     "hat_letter_v",
//                     "taunt_wave_dance",
//                     "hat_snowglobe",
//                     "pet_chicken",
//                     "hat_letter_w",
//                     "emote_smile",
//                     "gadget_fortune_cookie",
//                     "suit_baker_leggings",
//                     "morph_blaze",
//                     "emote_sad",
//                     "suit_ghost_boots",
//                     "hat_number_8",
//                     "hat_letter_a",
//                     "taunt_cool_dance",
//                     "gadget_wizardwand",
//                     "pet_mooshroom_baby",
//                     "pet_silverfish",
//                     "pet_cat_red",
//                     "emote_sleepy",
//                     "hat_letter_e",
//                     "hat_orc",
//                     "gadget_paint_trail",
//                     "hat_letter_k",
//                     "pet_pig",
//                     "pet_sheep_blue",
//                     "emote_cheeky",
//                     "hat_letter_m",
//                     "pet_sheep_cyan",
//                     "hat_letter_b",
//                     "suit_plumber_boots",
//                     "pet_sheep_red",
//                     "suit_disco_boots",
//                     "pet_sheep_brown",
//                     "pet_cow",
//                     "emote_grin",
//                     "pet_cave_spider",
//                     "emote_surprised",
//                     "hat_letter_u",
//                     "emote_cool",
//                     "pet_cat_black_baby",
//                     "suit_death_angel_boots",
//                     "hat_number_7",
//                     "suit_baker_boots",
//                     "suit_chicken_chestplate",
//                     "suit_mermaid_boots",
//                     "hat_lady_bug",
//                     "hat_letter_plus",
//                     "hat_wood_elf",
//                     "suit_spiderman_boots",
//                     "hat_letter_q",
//                     "particlepack_spring",
//                     "suit_arctic_boots",
//                     "gadget_ghosts",
//                     "hat_letter_question",
//                     "hat_letter_d",
//                     "pet_creeper",
//                     "hat_vintage",
//                     "emote_cry",
//                     "pet_horse_brown",
//                     "morph_enderman",
//                     "hat_polar_bear",
//                     "suit_bumblebee_boots",
//                     "pet_bat",
//                     "morph_pig",
//                     "suit_disco_leggings",
//                     "pet_villager_priest",
//                     "suit_fireman_boots",
//                     "suit_thor_leggings",
//                     "rankcolor_gold",
//                     "hat_letter_j",
//                     "suit_death_angel_leggings",
//                     "morph_sheep",
//                     "hat_burger",
//                     "pet_sheep_orange",
//                     "pet_burning_zombie",
//                     "suit_ninja_boots",
//                     "suit_bumblebee_leggings",
//                     "hat_cauldron",
//                     "suit_baker_chestplate",
//                     "pet_horse_creamy",
//                     "hat_horse",
//                     "pet_sheep_gray",
//                     "hat_pug_white",
//                     "suit_thor_boots",
//                     "suit_warrior_boots",
//                     "suit_spiderman_helmet",
//                     "hat_festive_zombie",
//                     "suit_santa_boots",
//                     "suit_flash_boots",
//                     "hat_festive_herobrine",
//                     "hat_elfboy",
//                     "hat_rainbow_present",
//                     "gadget_advent_proof",
//                     "hat_monitor",
//                     "hat_penguin",
//                     "hat_letter_s",
//                     "pet_sheep_silver",
//                     "rankcolor_green",
//                     "hat_sandwich",
//                     "hat_ghost",
//                     "hat_magic_dog",
//                     "gadget_grappling_hook",
//                     "pet_cat_siamese",
//                     "morph_creeper",
//                     "hat_football_star",
//                     "taunt_clapping",
//                     "hat_number_1",
//                     "hat_letter_t",
//                     "hat_letter_g",
//                     "pet_white_rabbit",
//                     "hat_scavenger",
//                     "pet_horse_black",
//                     "hat_elephant",
//                     "hat_number_5",
//                     "pet_sheep_black_baby",
//                     "hat_toaster",
//                     "hat_minotaur",
//                     "hat_number_3",
//                     "suit_flash_leggings",
//                     "suit_warrior_chestplate",
//                     "hat_golden_knight",
//                     "rankcolor_yellow",
//                     "gadget_jetpack",
//                     "hat_number_4",
//                     "suit_arctic_leggings",
//                     "suit_necromancer_boots",
//                     "suit_frog_leggings",
//                     "suit_fireman_chestplate",
//                     "hat_letter_p",
//                     "hat_dinosaur",
//                     "suit_disco_helmet",
//                     "hat_walrus",
//                     "hat_cheese",
//                     "hat_otter",
//                     "taunt_hype_dance",
//                     "hat_letter_n",
//                     "hat_present_hat",
//                     "morph_spider",
//                     "suit_ninja_leggings",
//                     "hat_bell",
//                     "suit_plumber_leggings",
//                     "hat_festive_squid",
//                     "cloak_comets",
//                     "pet_snowman",
//                     "hat_panda",
//                     "hat_letter_l",
//                     "suit_ghost_chestplate",
//                     "pet_sheep_white_baby",
//                     "hat_letter_exclaimation",
//                     "cloak_rose",
//                     "gadget_magic_carpet",
//                     "hat_letter_z",
//                     "hat_letter_r",
//                     "rankcolor_light_purple",
//                     "pet_totem",
//                     "pet_villager_librarian",
//                     "hat_letter_h",
//                     "cloak_clover",
//                     "pet_sheep_light_blue",
//                     "suit_mermaid_leggings",
//                     "hat_number_6",
//                     "suit_necromancer_leggings",
//                     "hat_fox",
//                     "hat_mars",
//                     "taunt_victory",
//                     "hat_monkey",
//                     "taunt_goodbye",
//                     "hat_letter_i",
//                     "pet_mooshroom",
//                     "suit_plumber_chestplate",
//                     "hat_pug_black",
//                     "hat_letter_y",
//                     "suit_spiderman_chestplate",
//                     "pet_villager_blacksmith",
//                     "rankcolor_white",
//                     "hat_lucky_dragon",
//                     "hat_bird",
//                     "hat_squid",
//                     "pet_magma_cube_small",
//                     "morph_chicken",
//                     "hat_number_9",
//                     "suit_baker_helmet",
//                     "pet_slime_big",
//                     "pet_villager_priest_baby",
//                     "hat_koala",
//                     "pet_villager_librarian_baby",
//                     "pet_sheep_orange_baby",
//                     "suit_arctic_helmet",
//                     "pet_sheep_light_blue_baby",
//                     "suit_frog_helmet",
//                     "morph_cow",
//                     "hat_festive_skeleton",
//                     "hat_festive_villager",
//                     "rankcolor_blue"
//                 ]
//             },
//             "karma": 30245,
//             "quests": {
//                 "skywars_solo_win": {
//                     "completions": [
//                         {
//                             "time": 1453144237710
//                         },
//                         {
//                             "time": 1453414406007
//                         },
//                         {
//                             "time": 1502216503841
//                         }
//                     ],
//                     "active": {
//                         "objectives": {},
//                         "started": 1618025456982
//                     }
//                 },
//                 "skywars_solo_kills": {
//                     "completions": [
//                         {
//                             "time": 1453731931533
//                         }
//                     ],
//                     "active": {
//                         "started": 1501907786675,
//                         "objectives": {
//                             "skywars_solo_kills": 14
//                         }
//                     }
//                 },
//                 "skywars_weekly_kills": {
//                     "completions": [
//                         {
//                             "time": 1453841717570
//                         },
//                         {
//                             "time": 1453841828555
//                         }
//                     ],
//                     "active": {
//                         "started": 1501907788876,
//                         "objectives": {
//                             "skywars_weekly_kills": 57
//                         }
//                     }
//                 },
//                 "skywars_team_win": {
//                     "completions": [
//                         {
//                             "time": 1453430302175
//                         }
//                     ],
//                     "active": {
//                         "started": 1501907787775,
//                         "objectives": {}
//                     }
//                 },
//                 "skywars_team_kills": {
//                     "completions": [
//                         {
//                             "time": 1453431667827
//                         }
//                     ],
//                     "active": {
//                         "started": 1501907787275,
//                         "objectives": {
//                             "skywars_team_kills": 5
//                         }
//                     }
//                 },
//                 "quake_daily_play": {
//                     "completions": [
//                         {
//                             "time": 1460897576036
//                         }
//                     ]
//                 },
//                 "quake_daily_kill": {
//                     "completions": [
//                         {
//                             "time": 1460898088116
//                         }
//                     ]
//                 },
//                 "quake_weekly_play": {
//                     "completions": [
//                         {
//                             "time": 1639788381289
//                         }
//                     ]
//                 },
//                 "walls_daily_play": {
//                     "completions": [
//                         {
//                             "time": 1454770613178
//                         },
//                         {
//                             "time": 1460908991387
//                         }
//                     ]
//                 },
//                 "walls_daily_kill": {
//                     "completions": [
//                         {
//                             "time": 1614403352394
//                         }
//                     ]
//                 },
//                 "walls_daily_win": {
//                     "completions": [
//                         {
//                             "time": 1614403352394
//                         }
//                     ]
//                 },
//                 "walls_weekly": {
//                     "active": {
//                         "started": 1451659511093,
//                         "objectives": {
//                             "walls_weekly_play": 5,
//                             "walls_weekly_kills": 5
//                         }
//                     }
//                 },
//                 "blitz_game_of_the_day": {},
//                 "blitz_win": {
//                     "active": {
//                         "started": 1451661144521,
//                         "objectives": {}
//                     }
//                 },
//                 "blitz_kills": {
//                     "completions": [
//                         {
//                             "time": 1480647287177
//                         }
//                     ]
//                 },
//                 "blitz_weekly_master": {
//                     "active": {
//                         "started": 1451661147526,
//                         "objectives": {
//                             "killblitz10": 5,
//                             "blitz_games_played": 3
//                         }
//                     }
//                 },
//                 "uhc_daily": {
//                     "active": {
//                         "started": 1454767593448,
//                         "objectives": {
//                             "uhc_games": 1
//                         }
//                     }
//                 },
//                 "uhc_weekly": {
//                     "active": {
//                         "started": 1454767599648,
//                         "objectives": {}
//                     }
//                 },
//                 "warlords_ctf": {
//                     "completions": [
//                         {
//                             "time": 1460658316694
//                         },
//                         {
//                             "time": 1460758609329
//                         },
//                         {
//                             "time": 1460806496696
//                         }
//                     ],
//                     "active": {
//                         "started": 1462066675802,
//                         "objectives": {}
//                     }
//                 },
//                 "warlords_win": {
//                     "completions": [
//                         {
//                             "time": 1460658316695
//                         },
//                         {
//                             "time": 1460761213951
//                         },
//                         {
//                             "time": 1460807162547
//                         },
//                         {
//                             "time": 1462067630486
//                         },
//                         {
//                             "time": 1470438225822
//                         }
//                     ]
//                 },
//                 "warlords_tdm": {
//                     "completions": [
//                         {
//                             "time": 1460808428524
//                         },
//                         {
//                             "time": 1470439286107
//                         }
//                     ]
//                 },
//                 "warlords_domination": {
//                     "completions": [
//                         {
//                             "time": 1460759695515
//                         },
//                         {
//                             "time": 1460809363248
//                         },
//                         {
//                             "time": 1470438225770
//                         }
//                     ]
//                 },
//                 "warlords_dedication": {
//                     "active": {
//                         "started": 1460657113315,
//                         "objectives": {
//                             "warlords_weekly_dedi": 13
//                         }
//                     }
//                 },
//                 "warriors_journey": {
//                     "active": {
//                         "started": 1460756601639,
//                         "objectives": {
//                             "quake25kill": 25,
//                             "paintballwin": 2,
//                             "vampirezkillvamps": 3,
//                             "vampirezkillhuman": 1,
//                             "blitzkill": 2
//                         }
//                     }
//                 },
//                 "blitzerk": {
//                     "active": {
//                         "started": 1460756606040,
//                         "objectives": {
//                             "killblitz10": 2
//                         }
//                     }
//                 },
//                 "megawaller": {
//                     "active": {
//                         "started": 1460756607890,
//                         "objectives": {
//                             "kill": 1
//                         }
//                     }
//                 },
//                 "waller": {
//                     "active": {
//                         "started": 1460756615540,
//                         "objectives": {}
//                     }
//                 },
//                 "space_mission": {
//                     "completions": [
//                         {
//                             "time": 1460897765700
//                         }
//                     ]
//                 },
//                 "paintball_expert": {
//                     "completions": [
//                         {
//                             "time": 1460898744900
//                         }
//                     ]
//                 },
//                 "tnt_addict": {
//                     "active": {
//                         "started": 1460756632741,
//                         "objectives": {}
//                     }
//                 },
//                 "serial_killer": {
//                     "active": {
//                         "started": 1460756636541,
//                         "objectives": {
//                             "quake": 57,
//                             "paintball": 55,
//                             "megawalls": 1,
//                             "blitz": 2
//                         }
//                     }
//                 },
//                 "explosive_games": {
//                     "active": {
//                         "started": 1460756641491,
//                         "objectives": {}
//                     }
//                 },
//                 "crazy_walls_daily_play": {
//                     "active": {
//                         "started": 1460852732900,
//                         "objectives": {}
//                     }
//                 },
//                 "crazy_walls_daily_kill": {
//                     "active": {
//                         "started": 1460852734000,
//                         "objectives": {}
//                     }
//                 },
//                 "crazy_walls_daily_win": {
//                     "active": {
//                         "started": 1460852735750,
//                         "objectives": {}
//                     }
//                 },
//                 "crazy_walls_weekly": {
//                     "active": {
//                         "started": 1460852736900,
//                         "objectives": {
//                             "crazy_walls_weekly_play": 2
//                         }
//                     }
//                 },
//                 "vampirez_daily_play": {
//                     "completions": [
//                         {
//                             "time": 1460901160052
//                         }
//                     ]
//                 },
//                 "vampirez_daily_kill": {
//                     "completions": [
//                         {
//                             "time": 1480644009304
//                         }
//                     ]
//                 },
//                 "vampirez_daily_win": {
//                     "active": {
//                         "started": 1460900355140,
//                         "objectives": {}
//                     }
//                 },
//                 "vampirez_weekly_win": {
//                     "active": {
//                         "started": 1460900356490,
//                         "objectives": {}
//                     }
//                 },
//                 "vampirez_weekly_kill": {
//                     "active": {
//                         "started": 1460900363594,
//                         "objectives": {
//                             "vampirez_weekly_kill_zombie": 127,
//                             "vampirez_weekly_kill_vampire": 12
//                         }
//                     }
//                 },
//                 "arcade_winner": {
//                     "completions": [
//                         {
//                             "time": 1477013256446
//                         },
//                         {
//                             "time": 1702703114418
//                         }
//                     ]
//                 },
//                 "arcade_gamer": {
//                     "completions": [
//                         {
//                             "time": 1489151556411
//                         },
//                         {
//                             "time": 1621828284205
//                         },
//                         {
//                             "time": 1653616128775
//                         },
//                         {
//                             "time": 1691811095056
//                         }
//                     ]
//                 },
//                 "arcade_specialist": {
//                     "completions": [
//                         {
//                             "time": 1621826955694
//                         },
//                         {
//                             "time": 1702748663309
//                         }
//                     ]
//                 },
//                 "skyclash_play_games": {
//                     "completions": [
//                         {
//                             "time": 1480636802519
//                         }
//                     ]
//                 },
//                 "skyclash_kills": {
//                     "active": {
//                         "started": 1480636052235,
//                         "objectives": {
//                             "kill": 3
//                         }
//                     }
//                 },
//                 "skyclash_play_points": {
//                     "completions": [
//                         {
//                             "time": 1489151188108
//                         }
//                     ]
//                 },
//                 "skyclash_void": {
//                     "active": {
//                         "started": 1480636052885,
//                         "objectives": {
//                             "skyclash_void_kills": 2,
//                             "skyclash_enderchests": 3
//                         }
//                     }
//                 },
//                 "skyclash_weekly_kills": {
//                     "active": {
//                         "started": 1480636053185,
//                         "objectives": {
//                             "kill": 3
//                         }
//                     }
//                 },
//                 "mega_walls_play": {
//                     "completions": [
//                         {
//                             "time": 1484102287561
//                         },
//                         {
//                             "time": 1485023242676
//                         }
//                     ]
//                 },
//                 "mega_walls_win": {
//                     "completions": [
//                         {
//                             "time": 1484102287562
//                         }
//                     ],
//                     "active": {
//                         "started": 1485021641056,
//                         "objectives": {}
//                     }
//                 },
//                 "mega_walls_kill": {
//                     "active": {
//                         "started": 1484100620761,
//                         "objectives": {
//                             "mega_walls_kill_daily": 1
//                         }
//                     }
//                 },
//                 "mega_walls_weekly": {
//                     "active": {
//                         "started": 1484100621117,
//                         "objectives": {
//                             "mega_walls_play_weekly": 4,
//                             "mega_walls_kill_weekly": 1
//                         }
//                     }
//                 },
//                 "skywars_arcade_win": {
//                     "completions": [
//                         {
//                             "time": 1501955403305
//                         }
//                     ],
//                     "active": {
//                         "objectives": {},
//                         "started": 1618025458843
//                     }
//                 },
//                 "skywars_weekly_arcade_win_all": {
//                     "active": {
//                         "started": 1501907789376,
//                         "objectives": {
//                             "skywars_arcade_weekly_win": 8
//                         }
//                     }
//                 },
//                 "bedwars_weekly_bed_elims": {
//                     "completions": [
//                         {
//                             "time": 1610646924097
//                         },
//                         {
//                             "time": 1615418370565
//                         },
//                         {
//                             "time": 1617834155859
//                         },
//                         {
//                             "time": 1620176841942
//                         },
//                         {
//                             "time": 1621654306389
//                         },
//                         {
//                             "time": 1631496738971
//                         },
//                         {
//                             "time": 1633573734346
//                         },
//                         {
//                             "time": 1639014091961
//                         },
//                         {
//                             "time": 1639957294306
//                         },
//                         {
//                             "time": 1641268318160
//                         },
//                         {
//                             "time": 1641961484986
//                         },
//                         {
//                             "time": 1651786541970
//                         },
//                         {
//                             "time": 1663983846390
//                         },
//                         {
//                             "time": 1664937401290
//                         },
//                         {
//                             "time": 1666495398799
//                         },
//                         {
//                             "time": 1668046425848
//                         },
//                         {
//                             "time": 1669266160074
//                         },
//                         {
//                             "time": 1670385870448
//                         },
//                         {
//                             "time": 1673728155925
//                         },
//                         {
//                             "time": 1675572690505
//                         },
//                         {
//                             "time": 1677299020327
//                         },
//                         {
//                             "time": 1679194208402
//                         },
//                         {
//                             "time": 1680317845093
//                         },
//                         {
//                             "time": 1682133978869
//                         },
//                         {
//                             "time": 1683253744324
//                         },
//                         {
//                             "time": 1684027229873
//                         },
//                         {
//                             "time": 1687405591202
//                         },
//                         {
//                             "time": 1688784654636
//                         },
//                         {
//                             "time": 1691277409644
//                         },
//                         {
//                             "time": 1692249261703
//                         },
//                         {
//                             "time": 1695442001776
//                         },
//                         {
//                             "time": 1696991401518
//                         },
//                         {
//                             "time": 1697857671950
//                         },
//                         {
//                             "time": 1698723766103
//                         },
//                         {
//                             "time": 1701230376719
//                         },
//                         {
//                             "time": 1702158019388
//                         }
//                     ],
//                     "active": {
//                         "objectives": {
//                             "bedwars_bed_elims": 15
//                         },
//                         "started": 1702685673943
//                     }
//                 },
//                 "bedwars_weekly_dream_win": {
//                     "completions": [
//                         {
//                             "time": 1616640678878
//                         },
//                         {
//                             "time": 1621474081013
//                         },
//                         {
//                             "time": 1636511574424
//                         },
//                         {
//                             "time": 1662351637853
//                         },
//                         {
//                             "time": 1665715137933
//                         },
//                         {
//                             "time": 1671425098195
//                         },
//                         {
//                             "time": 1675570607234
//                         },
//                         {
//                             "time": 1677032406755
//                         },
//                         {
//                             "time": 1685676526037
//                         },
//                         {
//                             "time": 1689475582481
//                         },
//                         {
//                             "time": 1696047419889
//                         },
//                         {
//                             "time": 1698378771299
//                         },
//                         {
//                             "time": 1701910969627
//                         },
//                         {
//                             "time": 1702871935671
//                         }
//                     ],
//                     "active": {
//                         "objectives": {
//                             "bedwars_dream_wins": 3
//                         },
//                         "started": 1703303207451
//                     }
//                 },
//                 "bedwars_daily_one_more": {
//                     "completions": [
//                         {
//                             "time": 1604811539016
//                         },
//                         {
//                             "time": 1613797001909
//                         },
//                         {
//                             "time": 1616636855944
//                         },
//                         {
//                             "time": 1617763875290
//                         },
//                         {
//                             "time": 1617836486262
//                         },
//                         {
//                             "time": 1618282778035
//                         },
//                         {
//                             "time": 1619129183672
//                         },
//                         {
//                             "time": 1619755538335
//                         },
//                         {
//                             "time": 1620174810251
//                         },
//                         {
//                             "time": 1620353078429
//                         },
//                         {
//                             "time": 1620605495171
//                         },
//                         {
//                             "time": 1620939993003
//                         },
//                         {
//                             "time": 1621304508162
//                         },
//                         {
//                             "time": 1621478339957
//                         },
//                         {
//                             "time": 1621567505840
//                         },
//                         {
//                             "time": 1621644606157
//                         },
//                         {
//                             "time": 1621823077280
//                         },
//                         {
//                             "time": 1622087014543
//                         },
//                         {
//                             "time": 1623084597561
//                         },
//                         {
//                             "time": 1623290963298
//                         },
//                         {
//                             "time": 1630378293173
//                         },
//                         {
//                             "time": 1630548719235
//                         },
//                         {
//                             "time": 1630642241239
//                         },
//                         {
//                             "time": 1631494884519
//                         },
//                         {
//                             "time": 1631938302262
//                         },
//                         {
//                             "time": 1632369790073
//                         },
//                         {
//                             "time": 1632705107516
//                         },
//                         {
//                             "time": 1632799370443
//                         },
//                         {
//                             "time": 1633573092166
//                         },
//                         {
//                             "time": 1634325501685
//                         },
//                         {
//                             "time": 1634693042280
//                         },
//                         {
//                             "time": 1635387188531
//                         },
//                         {
//                             "time": 1636509348464
//                         },
//                         {
//                             "time": 1637463037691
//                         },
//                         {
//                             "time": 1637636288634
//                         },
//                         {
//                             "time": 1638935682712
//                         },
//                         {
//                             "time": 1639184243568
//                         },
//                         {
//                             "time": 1639774247488
//                         },
//                         {
//                             "time": 1640031733364
//                         },
//                         {
//                             "time": 1640122793369
//                         },
//                         {
//                             "time": 1640892443746
//                         },
//                         {
//                             "time": 1641015353172
//                         },
//                         {
//                             "time": 1641178991952
//                         },
//                         {
//                             "time": 1641343492106
//                         },
//                         {
//                             "time": 1641417975032
//                         },
//                         {
//                             "time": 1641525304760
//                         },
//                         {
//                             "time": 1641616233866
//                         },
//                         {
//                             "time": 1641704814821
//                         },
//                         {
//                             "time": 1641958861369
//                         },
//                         {
//                             "time": 1642132864295
//                         },
//                         {
//                             "time": 1642985654203
//                         },
//                         {
//                             "time": 1643418919611
//                         },
//                         {
//                             "time": 1643850397704
//                         },
//                         {
//                             "time": 1646106755049
//                         },
//                         {
//                             "time": 1649037642349
//                         },
//                         {
//                             "time": 1659729546821
//                         },
//                         {
//                             "time": 1661217371724
//                         },
//                         {
//                             "time": 1662604458178
//                         },
//                         {
//                             "time": 1663198611502
//                         },
//                         {
//                             "time": 1663981588591
//                         },
//                         {
//                             "time": 1664129897383
//                         },
//                         {
//                             "time": 1664421505081
//                         },
//                         {
//                             "time": 1664590540997
//                         },
//                         {
//                             "time": 1664681194211
//                         },
//                         {
//                             "time": 1664850843274
//                         },
//                         {
//                             "time": 1664937292730
//                         },
//                         {
//                             "time": 1665024184096
//                         },
//                         {
//                             "time": 1665110192467
//                         },
//                         {
//                             "time": 1665284568181
//                         },
//                         {
//                             "time": 1665366523409
//                         },
//                         {
//                             "time": 1665455729262
//                         },
//                         {
//                             "time": 1665630359814
//                         },
//                         {
//                             "time": 1665716472351
//                         },
//                         {
//                             "time": 1665808801784
//                         },
//                         {
//                             "time": 1665975315731
//                         },
//                         {
//                             "time": 1666493779014
//                         },
//                         {
//                             "time": 1666577105496
//                         },
//                         {
//                             "time": 1666665434457
//                         },
//                         {
//                             "time": 1666838106521
//                         },
//                         {
//                             "time": 1666923299722
//                         },
//                         {
//                             "time": 1667017435993
//                         },
//                         {
//                             "time": 1667266418526
//                         },
//                         {
//                             "time": 1667529403967
//                         },
//                         {
//                             "time": 1667616170136
//                         },
//                         {
//                             "time": 1667685340930
//                         },
//                         {
//                             "time": 1667788353132
//                         },
//                         {
//                             "time": 1668047134232
//                         },
//                         {
//                             "time": 1668138256755
//                         },
//                         {
//                             "time": 1668385088883
//                         },
//                         {
//                             "time": 1668570457702
//                         },
//                         {
//                             "time": 1669240089119
//                         },
//                         {
//                             "time": 1669408441336
//                         },
//                         {
//                             "time": 1669774973479
//                         },
//                         {
//                             "time": 1669866119500
//                         },
//                         {
//                             "time": 1669951471224
//                         },
//                         {
//                             "time": 1670039008430
//                         },
//                         {
//                             "time": 1670202166117
//                         },
//                         {
//                             "time": 1670382935170
//                         },
//                         {
//                             "time": 1670469327863
//                         },
//                         {
//                             "time": 1670557582405
//                         },
//                         {
//                             "time": 1670729257183
//                         },
//                         {
//                             "time": 1670985743421
//                         },
//                         {
//                             "time": 1671250490185
//                         },
//                         {
//                             "time": 1671430044058
//                         },
//                         {
//                             "time": 1671595441825
//                         },
//                         {
//                             "time": 1673150805335
//                         },
//                         {
//                             "time": 1673726695293
//                         },
//                         {
//                             "time": 1674008961088
//                         },
//                         {
//                             "time": 1674960809753
//                         },
//                         {
//                             "time": 1675043835599
//                         },
//                         {
//                             "time": 1675393381700
//                         },
//                         {
//                             "time": 1675571780256
//                         },
//                         {
//                             "time": 1676427057795
//                         },
//                         {
//                             "time": 1676519064337
//                         },
//                         {
//                             "time": 1677032797842
//                         },
//                         {
//                             "time": 1677118235224
//                         },
//                         {
//                             "time": 1677297896176
//                         },
//                         {
//                             "time": 1678759266967
//                         },
//                         {
//                             "time": 1678845173258
//                         },
//                         {
//                             "time": 1678932997060
//                         },
//                         {
//                             "time": 1679112406096
//                         },
//                         {
//                             "time": 1679277244098
//                         },
//                         {
//                             "time": 1679365577260
//                         },
//                         {
//                             "time": 1679452455856
//                         },
//                         {
//                             "time": 1679534279965
//                         },
//                         {
//                             "time": 1679623909372
//                         },
//                         {
//                             "time": 1679707743843
//                         },
//                         {
//                             "time": 1679970507816
//                         },
//                         {
//                             "time": 1680056661980
//                         },
//                         {
//                             "time": 1680138410593
//                         },
//                         {
//                             "time": 1680315462173
//                         },
//                         {
//                             "time": 1680573586490
//                         },
//                         {
//                             "time": 1680746336926
//                         },
//                         {
//                             "time": 1680794117198
//                         },
//                         {
//                             "time": 1681680496148
//                         },
//                         {
//                             "time": 1681954073855
//                         },
//                         {
//                             "time": 1682131320160
//                         },
//                         {
//                             "time": 1682302128310
//                         },
//                         {
//                             "time": 1682650053372
//                         },
//                         {
//                             "time": 1682740026756
//                         },
//                         {
//                             "time": 1682820695394
//                         },
//                         {
//                             "time": 1682987561537
//                         },
//                         {
//                             "time": 1683166773169
//                         },
//                         {
//                             "time": 1683253552547
//                         },
//                         {
//                             "time": 1683345146344
//                         },
//                         {
//                             "time": 1683426900552
//                         },
//                         {
//                             "time": 1683510895836
//                         },
//                         {
//                             "time": 1684024783389
//                         },
//                         {
//                             "time": 1684203764317
//                         },
//                         {
//                             "time": 1685245589297
//                         },
//                         {
//                             "time": 1685677631973
//                         },
//                         {
//                             "time": 1685852585544
//                         },
//                         {
//                             "time": 1686275868063
//                         },
//                         {
//                             "time": 1686620060017
//                         },
//                         {
//                             "time": 1687142473111
//                         },
//                         {
//                             "time": 1687396013388
//                         },
//                         {
//                             "time": 1687659643130
//                         },
//                         {
//                             "time": 1688349197407
//                         },
//                         {
//                             "time": 1688784073378
//                         },
//                         {
//                             "time": 1688952972233
//                         },
//                         {
//                             "time": 1689044872782
//                         },
//                         {
//                             "time": 1689387605605
//                         },
//                         {
//                             "time": 1689478404139
//                         },
//                         {
//                             "time": 1689649763439
//                         },
//                         {
//                             "time": 1689819649066
//                         },
//                         {
//                             "time": 1690080563201
//                         },
//                         {
//                             "time": 1691277098120
//                         },
//                         {
//                             "time": 1691459348795
//                         },
//                         {
//                             "time": 1691891932799
//                         },
//                         {
//                             "time": 1692240583005
//                         },
//                         {
//                             "time": 1692248029708
//                         },
//                         {
//                             "time": 1692844786567
//                         },
//                         {
//                             "time": 1693701466913
//                         },
//                         {
//                             "time": 1693793877986
//                         },
//                         {
//                             "time": 1694746056291
//                         },
//                         {
//                             "time": 1695093656879
//                         },
//                         {
//                             "time": 1695441271739
//                         },
//                         {
//                             "time": 1695868980013
//                         },
//                         {
//                             "time": 1696300155481
//                         },
//                         {
//                             "time": 1696560118112
//                         },
//                         {
//                             "time": 1696649538726
//                         },
//                         {
//                             "time": 1696991140357
//                         },
//                         {
//                             "time": 1697511302518
//                         },
//                         {
//                             "time": 1697682249372
//                         },
//                         {
//                             "time": 1697770173973
//                         },
//                         {
//                             "time": 1697775495511
//                         },
//                         {
//                             "time": 1698029042960
//                         },
//                         {
//                             "time": 1698110591111
//                         },
//                         {
//                             "time": 1698199926829
//                         },
//                         {
//                             "time": 1698542095908
//                         },
//                         {
//                             "time": 1698626963203
//                         },
//                         {
//                             "time": 1698722968387
//                         },
//                         {
//                             "time": 1698890238891
//                         },
//                         {
//                             "time": 1699062975093
//                         },
//                         {
//                             "time": 1699072656999
//                         },
//                         {
//                             "time": 1699498819662
//                         },
//                         {
//                             "time": 1700017099026
//                         },
//                         {
//                             "time": 1700194649998
//                         },
//                         {
//                             "time": 1700278466152
//                         },
//                         {
//                             "time": 1700887070546
//                         },
//                         {
//                             "time": 1701144191976
//                         },
//                         {
//                             "time": 1701228358008
//                         },
//                         {
//                             "time": 1701489302192
//                         },
//                         {
//                             "time": 1701665308201
//                         },
//                         {
//                             "time": 1701835468539
//                         },
//                         {
//                             "time": 1701927260317
//                         },
//                         {
//                             "time": 1702076005503
//                         },
//                         {
//                             "time": 1702176592671
//                         },
//                         {
//                             "time": 1702248570780
//                         },
//                         {
//                             "time": 1702414268740
//                         },
//                         {
//                             "time": 1702527373158
//                         },
//                         {
//                             "time": 1702585052567
//                         },
//                         {
//                             "time": 1702689250630
//                         },
//                         {
//                             "time": 1702866822634
//                         },
//                         {
//                             "time": 1703038074856
//                         },
//                         {
//                             "time": 1703393326728
//                         }
//                     ],
//                     "active": {
//                         "objectives": {},
//                         "started": 1703394824253
//                     }
//                 },
//                 "bedwars_daily_win": {
//                     "completions": [
//                         {
//                             "time": 1604811539017
//                         },
//                         {
//                             "time": 1613797001911
//                         },
//                         {
//                             "time": 1616550296780
//                         },
//                         {
//                             "time": 1616636855944
//                         },
//                         {
//                             "time": 1617763459793
//                         },
//                         {
//                             "time": 1617836946593
//                         },
//                         {
//                             "time": 1618282204999
//                         },
//                         {
//                             "time": 1619129183688
//                         },
//                         {
//                             "time": 1619753309860
//                         },
//                         {
//                             "time": 1620174810251
//                         },
//                         {
//                             "time": 1620352579159
//                         },
//                         {
//                             "time": 1620605729037
//                         },
//                         {
//                             "time": 1620872443225
//                         },
//                         {
//                             "time": 1621303876554
//                         },
//                         {
//                             "time": 1621477832588
//                         },
//                         {
//                             "time": 1621567505841
//                         },
//                         {
//                             "time": 1621643969794
//                         },
//                         {
//                             "time": 1621823077283
//                         },
//                         {
//                             "time": 1622085540722
//                         },
//                         {
//                             "time": 1623084152784
//                         },
//                         {
//                             "time": 1623290237143
//                         },
//                         {
//                             "time": 1630377972699
//                         },
//                         {
//                             "time": 1630548454931
//                         },
//                         {
//                             "time": 1630641747676
//                         },
//                         {
//                             "time": 1631494354842
//                         },
//                         {
//                             "time": 1631934107665
//                         },
//                         {
//                             "time": 1631939363558
//                         },
//                         {
//                             "time": 1632369147068
//                         },
//                         {
//                             "time": 1632629063051
//                         },
//                         {
//                             "time": 1632798414710
//                         },
//                         {
//                             "time": 1633572356487
//                         },
//                         {
//                             "time": 1634268422935
//                         },
//                         {
//                             "time": 1634329047797
//                         },
//                         {
//                             "time": 1634692031345
//                         },
//                         {
//                             "time": 1635386454959
//                         },
//                         {
//                             "time": 1636509654764
//                         },
//                         {
//                             "time": 1637462374072
//                         },
//                         {
//                             "time": 1637635561167
//                         },
//                         {
//                             "time": 1638934554649
//                         },
//                         {
//                             "time": 1639183372952
//                         },
//                         {
//                             "time": 1639773525817
//                         },
//                         {
//                             "time": 1640031302940
//                         },
//                         {
//                             "time": 1640122793385
//                         },
//                         {
//                             "time": 1640891503015
//                         },
//                         {
//                             "time": 1641014440354
//                         },
//                         {
//                             "time": 1641178659962
//                         },
//                         {
//                             "time": 1641343258398
//                         },
//                         {
//                             "time": 1641417282505
//                         },
//                         {
//                             "time": 1641525007704
//                         },
//                         {
//                             "time": 1641615619548
//                         },
//                         {
//                             "time": 1641704375108
//                         },
//                         {
//                             "time": 1641765218527
//                         },
//                         {
//                             "time": 1641958497507
//                         },
//                         {
//                             "time": 1642131856128
//                         },
//                         {
//                             "time": 1642985020978
//                         },
//                         {
//                             "time": 1643418520486
//                         },
//                         {
//                             "time": 1643850397714
//                         },
//                         {
//                             "time": 1646106407509
//                         },
//                         {
//                             "time": 1649036629588
//                         },
//                         {
//                             "time": 1656966744002
//                         },
//                         {
//                             "time": 1659729546817
//                         },
//                         {
//                             "time": 1661216944120
//                         },
//                         {
//                             "time": 1662352506601
//                         },
//                         {
//                             "time": 1662604458129
//                         },
//                         {
//                             "time": 1663198153461
//                         },
//                         {
//                             "time": 1663981157995
//                         },
//                         {
//                             "time": 1664129467006
//                         },
//                         {
//                             "time": 1664421051660
//                         },
//                         {
//                             "time": 1664590092094
//                         },
//                         {
//                             "time": 1664680718770
//                         },
//                         {
//                             "time": 1664850152449
//                         },
//                         {
//                             "time": 1664936755224
//                         },
//                         {
//                             "time": 1665023369839
//                         },
//                         {
//                             "time": 1665109949950
//                         },
//                         {
//                             "time": 1665286914069
//                         },
//                         {
//                             "time": 1665366047825
//                         },
//                         {
//                             "time": 1665455290457
//                         },
//                         {
//                             "time": 1665629117259
//                         },
//                         {
//                             "time": 1665806661260
//                         },
//                         {
//                             "time": 1665974522655
//                         },
//                         {
//                             "time": 1666493472777
//                         },
//                         {
//                             "time": 1666574853837
//                         },
//                         {
//                             "time": 1666665115018
//                         },
//                         {
//                             "time": 1666837616714
//                         },
//                         {
//                             "time": 1666922649554
//                         },
//                         {
//                             "time": 1667017108070
//                         },
//                         {
//                             "time": 1667265967480
//                         },
//                         {
//                             "time": 1667528998441
//                         },
//                         {
//                             "time": 1667615752382
//                         },
//                         {
//                             "time": 1667685071943
//                         },
//                         {
//                             "time": 1667787795407
//                         },
//                         {
//                             "time": 1668046724018
//                         },
//                         {
//                             "time": 1668137875754
//                         },
//                         {
//                             "time": 1668384592240
//                         },
//                         {
//                             "time": 1668569821168
//                         },
//                         {
//                             "time": 1669239528725
//                         },
//                         {
//                             "time": 1669407447045
//                         },
//                         {
//                             "time": 1669774613295
//                         },
//                         {
//                             "time": 1669865856440
//                         },
//                         {
//                             "time": 1669950983717
//                         },
//                         {
//                             "time": 1670038392455
//                         },
//                         {
//                             "time": 1670201765295
//                         },
//                         {
//                             "time": 1670382649580
//                         },
//                         {
//                             "time": 1670468729066
//                         },
//                         {
//                             "time": 1670557117083
//                         },
//                         {
//                             "time": 1670728579734
//                         },
//                         {
//                             "time": 1670985249206
//                         },
//                         {
//                             "time": 1671249716855
//                         },
//                         {
//                             "time": 1671429216801
//                         },
//                         {
//                             "time": 1671595115312
//                         },
//                         {
//                             "time": 1673150291456
//                         },
//                         {
//                             "time": 1673726046013
//                         },
//                         {
//                             "time": 1674008685718
//                         },
//                         {
//                             "time": 1674959507244
//                         },
//                         {
//                             "time": 1675043026791
//                         },
//                         {
//                             "time": 1675392928710
//                         },
//                         {
//                             "time": 1675571242378
//                         },
//                         {
//                             "time": 1676426702168
//                         },
//                         {
//                             "time": 1677032079313
//                         },
//                         {
//                             "time": 1677117829374
//                         },
//                         {
//                             "time": 1677297896177
//                         },
//                         {
//                             "time": 1678844473987
//                         },
//                         {
//                             "time": 1678932432429
//                         },
//                         {
//                             "time": 1679111256657
//                         },
//                         {
//                             "time": 1679192655276
//                         },
//                         {
//                             "time": 1679276962130
//                         },
//                         {
//                             "time": 1679365262725
//                         },
//                         {
//                             "time": 1679451816214
//                         },
//                         {
//                             "time": 1679533836495
//                         },
//                         {
//                             "time": 1679623460926
//                         },
//                         {
//                             "time": 1679706017506
//                         },
//                         {
//                             "time": 1679718368466
//                         },
//                         {
//                             "time": 1679970507819
//                         },
//                         {
//                             "time": 1680056272477
//                         },
//                         {
//                             "time": 1680137909468
//                         },
//                         {
//                             "time": 1680314816260
//                         },
//                         {
//                             "time": 1680573283160
//                         },
//                         {
//                             "time": 1680745669784
//                         },
//                         {
//                             "time": 1680793327209
//                         },
//                         {
//                             "time": 1681953537326
//                         },
//                         {
//                             "time": 1682130908538
//                         },
//                         {
//                             "time": 1682385282713
//                         },
//                         {
//                             "time": 1682649596560
//                         },
//                         {
//                             "time": 1682737410926
//                         },
//                         {
//                             "time": 1682820085074
//                         },
//                         {
//                             "time": 1682987159936
//                         },
//                         {
//                             "time": 1683165640237
//                         },
//                         {
//                             "time": 1683343215405
//                         },
//                         {
//                             "time": 1683426193698
//                         },
//                         {
//                             "time": 1683509904714
//                         },
//                         {
//                             "time": 1684024783389
//                         },
//                         {
//                             "time": 1684201676847
//                         },
//                         {
//                             "time": 1685244251237
//                         },
//                         {
//                             "time": 1685676910150
//                         },
//                         {
//                             "time": 1685851729417
//                         },
//                         {
//                             "time": 1686275145303
//                         },
//                         {
//                             "time": 1686618985194
//                         },
//                         {
//                             "time": 1687140909350
//                         },
//                         {
//                             "time": 1687396013392
//                         },
//                         {
//                             "time": 1687659089642
//                         },
//                         {
//                             "time": 1688096216869
//                         },
//                         {
//                             "time": 1688348996593
//                         },
//                         {
//                             "time": 1688783208761
//                         },
//                         {
//                             "time": 1688951467412
//                         },
//                         {
//                             "time": 1689043430695
//                         },
//                         {
//                             "time": 1689386854602
//                         },
//                         {
//                             "time": 1689477022034
//                         },
//                         {
//                             "time": 1689562981697
//                         },
//                         {
//                             "time": 1689648931882
//                         },
//                         {
//                             "time": 1689998524175
//                         },
//                         {
//                             "time": 1691276240266
//                         },
//                         {
//                             "time": 1691458417352
//                         },
//                         {
//                             "time": 1691890667311
//                         },
//                         {
//                             "time": 1692240171855
//                         },
//                         {
//                             "time": 1692245262390
//                         },
//                         {
//                             "time": 1692844133262
//                         },
//                         {
//                             "time": 1693700077867
//                         },
//                         {
//                             "time": 1693792934205
//                         },
//                         {
//                             "time": 1694746056322
//                         },
//                         {
//                             "time": 1695092986783
//                         },
//                         {
//                             "time": 1695437687652
//                         },
//                         {
//                             "time": 1695868289084
//                         },
//                         {
//                             "time": 1696217595933
//                         },
//                         {
//                             "time": 1696300155543
//                         },
//                         {
//                             "time": 1696559049809
//                         },
//                         {
//                             "time": 1696647997290
//                         },
//                         {
//                             "time": 1696990177565
//                         },
//                         {
//                             "time": 1697510660922
//                         },
//                         {
//                             "time": 1697769307025
//                         },
//                         {
//                             "time": 1697774822305
//                         },
//                         {
//                             "time": 1698005876861
//                         },
//                         {
//                             "time": 1698109810044
//                         },
//                         {
//                             "time": 1698198362926
//                         },
//                         {
//                             "time": 1698541332462
//                         },
//                         {
//                             "time": 1698625895704
//                         },
//                         {
//                             "time": 1698889370151
//                         },
//                         {
//                             "time": 1699061961976
//                         },
//                         {
//                             "time": 1699071875887
//                         },
//                         {
//                             "time": 1699497443344
//                         },
//                         {
//                             "time": 1700015213554
//                         },
//                         {
//                             "time": 1700194244373
//                         },
//                         {
//                             "time": 1700277790307
//                         },
//                         {
//                             "time": 1700884921361
//                         },
//                         {
//                             "time": 1701143088898
//                         },
//                         {
//                             "time": 1701227351286
//                         },
//                         {
//                             "time": 1701487609074
//                         },
//                         {
//                             "time": 1701663663047
//                         },
//                         {
//                             "time": 1701831092519
//                         },
//                         {
//                             "time": 1701925740663
//                         },
//                         {
//                             "time": 1702074644789
//                         },
//                         {
//                             "time": 1702175675373
//                         },
//                         {
//                             "time": 1702246629209
//                         },
//                         {
//                             "time": 1702412547204
//                         },
//                         {
//                             "time": 1702526472946
//                         },
//                         {
//                             "time": 1702583341600
//                         },
//                         {
//                             "time": 1702687777580
//                         },
//                         {
//                             "time": 1702865747620
//                         },
//                         {
//                             "time": 1703037381941
//                         },
//                         {
//                             "time": 1703392112547
//                         }
//                     ],
//                     "active": {
//                         "objectives": {},
//                         "started": 1703394824503
//                     }
//                 },
//                 "prototype_pit_daily_kills": {
//                     "completions": [
//                         {
//                             "time": 1529795837596
//                         }
//                     ]
//                 },
//                 "bedwars_daily_nightmares": {
//                     "completions": [
//                         {
//                             "time": 1604815627138
//                         },
//                         {
//                             "time": 1634326419194
//                         },
//                         {
//                             "time": 1634699196372
//                         },
//                         {
//                             "time": 1665025229368
//                         },
//                         {
//                             "time": 1665112087323
//                         },
//                         {
//                             "time": 1665455575247
//                         },
//                         {
//                             "time": 1665805753219
//                         },
//                         {
//                             "time": 1665809679386
//                         },
//                         {
//                             "time": 1666493446910
//                         },
//                         {
//                             "time": 1666578783778
//                         },
//                         {
//                             "time": 1666666561462
//                         },
//                         {
//                             "time": 1666838300100
//                         },
//                         {
//                             "time": 1666925896135
//                         },
//                         {
//                             "time": 1667268694163
//                         },
//                         {
//                             "time": 1696561411832
//                         },
//                         {
//                             "time": 1696651051814
//                         },
//                         {
//                             "time": 1697510420990
//                         },
//                         {
//                             "time": 1697683598720
//                         },
//                         {
//                             "time": 1697774737264
//                         },
//                         {
//                             "time": 1698023843523
//                         },
//                         {
//                             "time": 1698198511882
//                         },
//                         {
//                             "time": 1698543710953
//                         },
//                         {
//                             "time": 1698627496017
//                         },
//                         {
//                             "time": 1698723990861
//                         },
//                         {
//                             "time": 1698892844991
//                         },
//                         {
//                             "time": 1699065625050
//                         }
//                     ],
//                     "active": {
//                         "objectives": {
//                             "bedwars_daily_nightmare_wins": 2,
//                             "bedwars_daily_nightmare_beds": 2
//                         },
//                         "started": 1699070529889
//                     }
//                 },
//                 "bedwars_weekly_pumpkinator": {
//                     "completions": [
//                         {
//                             "time": 1604870255187
//                         },
//                         {
//                             "time": 1665110116715
//                         },
//                         {
//                             "time": 1665716686378
//                         },
//                         {
//                             "time": 1666495216342
//                         },
//                         {
//                             "time": 1667271888617
//                         },
//                         {
//                             "time": 1696649880485
//                         },
//                         {
//                             "time": 1697774980896
//                         },
//                         {
//                             "time": 1698627623015
//                         },
//                         {
//                             "time": 1699072131081
//                         }
//                     ]
//                 },
//                 "skywars_corrupt_win": {
//                     "active": {
//                         "objectives": {},
//                         "started": 1618025458293
//                     }
//                 },
//                 "skywars_daily_tokens": {
//                     "active": {
//                         "objectives": {
//                             "skywars_daily_tokens_wins": 5
//                         },
//                         "started": 1618113119287
//                     }
//                 },
//                 "skywars_weekly_free_loot_chest": {
//                     "active": {
//                         "objectives": {},
//                         "started": 1618113119938
//                     }
//                 },
//                 "mm_daily_power_play": {
//                     "completions": [
//                         {
//                             "time": 1619837564756
//                         },
//                         {
//                             "time": 1641614271103
//                         }
//                     ]
//                 },
//                 "mm_daily_win": {
//                     "completions": [
//                         {
//                             "time": 1618284808285
//                         },
//                         {
//                             "time": 1631846754579
//                         },
//                         {
//                             "time": 1637469532889
//                         },
//                         {
//                             "time": 1641269946195
//                         },
//                         {
//                             "time": 1641614271103
//                         }
//                     ]
//                 },
//                 "mm_daily_target_kill": {
//                     "active": {
//                         "objectives": {
//                             "mm_target_kills": 1
//                         },
//                         "started": 1618284572533
//                     }
//                 },
//                 "mm_weekly_murderer_kills": {
//                     "completions": [
//                         {
//                             "time": 1641614271101
//                         }
//                     ]
//                 },
//                 "mm_weekly_wins": {
//                     "completions": [
//                         {
//                             "time": 1619838370248
//                         },
//                         {
//                             "time": 1637469532889
//                         }
//                     ]
//                 },
//                 "duels_player": {
//                     "completions": [
//                         {
//                             "time": 1638936950337
//                         }
//                     ],
//                     "active": {
//                         "objectives": {},
//                         "started": 1639011386612
//                     }
//                 },
//                 "duels_killer": {
//                     "active": {
//                         "objectives": {
//                             "kill": 0
//                         },
//                         "started": 1623289461170
//                     }
//                 },
//                 "duels_winner": {
//                     "active": {
//                         "objectives": {},
//                         "started": 1623289461520
//                     }
//                 },
//                 "duels_weekly_kills": {
//                     "active": {
//                         "objectives": {
//                             "kill": 0
//                         },
//                         "started": 1623289461870
//                     }
//                 },
//                 "duels_weekly_wins": {
//                     "active": {
//                         "objectives": {},
//                         "started": 1623289462320
//                     }
//                 },
//                 "mm_daily_infector": {
//                     "completions": [
//                         {
//                             "time": 1641269924937
//                         }
//                     ]
//                 },
//                 "bedwars_weekly_challenges": {
//                     "completions": [
//                         {
//                             "time": 1641765218530
//                         },
//                         {
//                             "time": 1664134513428
//                         },
//                         {
//                             "time": 1665808141544
//                         },
//                         {
//                             "time": 1666923299722
//                         },
//                         {
//                             "time": 1667617115343
//                         },
//                         {
//                             "time": 1668653749477
//                         },
//                         {
//                             "time": 1669951471256
//                         },
//                         {
//                             "time": 1670043406255
//                         },
//                         {
//                             "time": 1670733260418
//                         },
//                         {
//                             "time": 1675394002289
//                         },
//                         {
//                             "time": 1676427470562
//                         },
//                         {
//                             "time": 1677121951873
//                         },
//                         {
//                             "time": 1677301138813
//                         },
//                         {
//                             "time": 1679193642170
//                         },
//                         {
//                             "time": 1679713745582
//                         },
//                         {
//                             "time": 1680574148785
//                         },
//                         {
//                             "time": 1681954412798
//                         },
//                         {
//                             "time": 1682135223589
//                         },
//                         {
//                             "time": 1682988870982
//                         }
//                     ]
//                 },
//                 "bedwars_daily_gifts": {
//                     "completions": [
//                         {
//                             "time": 1639183028393
//                         },
//                         {
//                             "time": 1639775803771
//                         },
//                         {
//                             "time": 1641014962703
//                         },
//                         {
//                             "time": 1641180181492
//                         },
//                         {
//                             "time": 1641344393071
//                         },
//                         {
//                             "time": 1641417054275
//                         },
//                         {
//                             "time": 1641525733169
//                         },
//                         {
//                             "time": 1641618878517
//                         },
//                         {
//                             "time": 1641766398533
//                         },
//                         {
//                             "time": 1641958839557
//                         },
//                         {
//                             "time": 1642132525751
//                         },
//                         {
//                             "time": 1642985475824
//                         },
//                         {
//                             "time": 1669954255425
//                         },
//                         {
//                             "time": 1670037916212
//                         },
//                         {
//                             "time": 1670202046463
//                         },
//                         {
//                             "time": 1670384422360
//                         },
//                         {
//                             "time": 1670469152844
//                         },
//                         {
//                             "time": 1670557853790
//                         },
//                         {
//                             "time": 1670728801787
//                         },
//                         {
//                             "time": 1670985152833
//                         },
//                         {
//                             "time": 1671252365322
//                         },
//                         {
//                             "time": 1671431572409
//                         },
//                         {
//                             "time": 1671596216841
//                         },
//                         {
//                             "time": 1673150145590
//                         },
//                         {
//                             "time": 1701487956351
//                         },
//                         {
//                             "time": 1701663930899
//                         },
//                         {
//                             "time": 1701831893627
//                         },
//                         {
//                             "time": 1701925249793
//                         },
//                         {
//                             "time": 1702075926043
//                         },
//                         {
//                             "time": 1702247768489
//                         },
//                         {
//                             "time": 1702417603863
//                         },
//                         {
//                             "time": 1702527552312
//                         },
//                         {
//                             "time": 1702583234577
//                         },
//                         {
//                             "time": 1702690199686
//                         },
//                         {
//                             "time": 1703037043834
//                         },
//                         {
//                             "time": 1703393785005
//                         }
//                     ],
//                     "active": {
//                         "objectives": {},
//                         "started": 1703394824953
//                     }
//                 },
//                 "wool_wars_daily_play": {
//                     "completions": [
//                         {
//                             "time": 1652500850820
//                         }
//                     ]
//                 },
//                 "wool_wars_daily_wins": {
//                     "completions": [
//                         {
//                             "time": 1652501073949
//                         }
//                     ]
//                 },
//                 "wool_wars_daily_kills": {
//                     "active": {
//                         "objectives": {
//                             "kill": 11
//                         },
//                         "started": 1652500681171
//                     }
//                 },
//                 "wool_weekly_play": {
//                     "active": {
//                         "objectives": {
//                             "kill": 11,
//                             "win": 4
//                         },
//                         "started": 1652500681921
//                     }
//                 },
//                 "wool_wars_weekly_shears": {
//                     "active": {
//                         "objectives": {
//                             "wool_weekly_shears": 1
//                         },
//                         "started": 1652500682221
//                     }
//                 },
//                 "bedwars_daily_bed_breaker": {
//                     "completions": [
//                         {
//                             "time": 1683168273673
//                         },
//                         {
//                             "time": 1683253831475
//                         },
//                         {
//                             "time": 1683345999961
//                         },
//                         {
//                             "time": 1683513238559
//                         },
//                         {
//                             "time": 1684027229873
//                         },
//                         {
//                             "time": 1685241575825
//                         },
//                         {
//                             "time": 1685677938955
//                         },
//                         {
//                             "time": 1686276852645
//                         },
//                         {
//                             "time": 1686620584412
//                         },
//                         {
//                             "time": 1687395234759
//                         },
//                         {
//                             "time": 1687921335408
//                         },
//                         {
//                             "time": 1688349849917
//                         },
//                         {
//                             "time": 1688784654622
//                         },
//                         {
//                             "time": 1689045968512
//                         },
//                         {
//                             "time": 1689389838539
//                         },
//                         {
//                             "time": 1689649568182
//                         },
//                         {
//                             "time": 1690078321905
//                         },
//                         {
//                             "time": 1691276641883
//                         },
//                         {
//                             "time": 1691459328572
//                         },
//                         {
//                             "time": 1691891321345
//                         },
//                         {
//                             "time": 1692239752787
//                         },
//                         {
//                             "time": 1692248273529
//                         },
//                         {
//                             "time": 1692846747251
//                         },
//                         {
//                             "time": 1693700406854
//                         },
//                         {
//                             "time": 1694744819463
//                         },
//                         {
//                             "time": 1695093496389
//                         },
//                         {
//                             "time": 1695441933410
//                         },
//                         {
//                             "time": 1696559249552
//                         },
//                         {
//                             "time": 1696650991126
//                         },
//                         {
//                             "time": 1697507186196
//                         },
//                         {
//                             "time": 1697773814667
//                         },
//                         {
//                             "time": 1697850826431
//                         },
//                         {
//                             "time": 1698023114911
//                         },
//                         {
//                             "time": 1698115100289
//                         },
//                         {
//                             "time": 1698203590253
//                         },
//                         {
//                             "time": 1698542663928
//                         },
//                         {
//                             "time": 1698723766079
//                         },
//                         {
//                             "time": 1698892175592
//                         },
//                         {
//                             "time": 1699064482671
//                         },
//                         {
//                             "time": 1700015034684
//                         },
//                         {
//                             "time": 1700195459431
//                         },
//                         {
//                             "time": 1700890260602
//                         },
//                         {
//                             "time": 1701145777162
//                         },
//                         {
//                             "time": 1701489692066
//                         },
//                         {
//                             "time": 1701665782250
//                         },
//                         {
//                             "time": 1701899516899
//                         },
//                         {
//                             "time": 1702075047931
//                         },
//                         {
//                             "time": 1702175447133
//                         },
//                         {
//                             "time": 1702260149763
//                         },
//                         {
//                             "time": 1702412794310
//                         },
//                         {
//                             "time": 1702529529190
//                         },
//                         {
//                             "time": 1702584546037
//                         },
//                         {
//                             "time": 1702688089213
//                         },
//                         {
//                             "time": 1702869045734
//                         },
//                         {
//                             "time": 1703038273913
//                         }
//                     ],
//                     "active": {
//                         "objectives": {
//                             "bedwars_weekly_final_killer": 1
//                         },
//                         "started": 1703391428980
//                     }
//                 },
//                 "bedwars_daily_final_killer": {
//                     "completions": [
//                         {
//                             "time": 1683253508772
//                         },
//                         {
//                             "time": 1683346023314
//                         },
//                         {
//                             "time": 1683512749426
//                         },
//                         {
//                             "time": 1684027379138
//                         },
//                         {
//                             "time": 1684290067727
//                         },
//                         {
//                             "time": 1685677228866
//                         },
//                         {
//                             "time": 1686278237068
//                         },
//                         {
//                             "time": 1686621079303
//                         },
//                         {
//                             "time": 1687485097521
//                         },
//                         {
//                             "time": 1687921970945
//                         },
//                         {
//                             "time": 1688350136037
//                         },
//                         {
//                             "time": 1688785399305
//                         },
//                         {
//                             "time": 1689386660616
//                         },
//                         {
//                             "time": 1689817075407
//                         },
//                         {
//                             "time": 1690082139676
//                         },
//                         {
//                             "time": 1691458384232
//                         },
//                         {
//                             "time": 1691895555601
//                         },
//                         {
//                             "time": 1692244115700
//                         },
//                         {
//                             "time": 1692844218477
//                         },
//                         {
//                             "time": 1693793677140
//                         },
//                         {
//                             "time": 1694750082619
//                         },
//                         {
//                             "time": 1695443757795
//                         },
//                         {
//                             "time": 1696558991656
//                         },
//                         {
//                             "time": 1696651058503
//                         },
//                         {
//                             "time": 1696992029830
//                         },
//                         {
//                             "time": 1697687338826
//                         },
//                         {
//                             "time": 1697772728625
//                         },
//                         {
//                             "time": 1697852655682
//                         },
//                         {
//                             "time": 1698027509787
//                         },
//                         {
//                             "time": 1698115058633
//                         },
//                         {
//                             "time": 1698202319434
//                         },
//                         {
//                             "time": 1698542669727
//                         },
//                         {
//                             "time": 1698627880244
//                         },
//                         {
//                             "time": 1698725245427
//                         },
//                         {
//                             "time": 1698893498232
//                         },
//                         {
//                             "time": 1699064366967
//                         },
//                         {
//                             "time": 1699497681088
//                         },
//                         {
//                             "time": 1700018311865
//                         },
//                         {
//                             "time": 1700279900639
//                         },
//                         {
//                             "time": 1700890328274
//                         },
//                         {
//                             "time": 1701144658618
//                         },
//                         {
//                             "time": 1701230380060
//                         },
//                         {
//                             "time": 1701490047803
//                         },
//                         {
//                             "time": 1701830830664
//                         },
//                         {
//                             "time": 1702010127440
//                         },
//                         {
//                             "time": 1702091858884
//                         },
//                         {
//                             "time": 1702177549142
//                         },
//                         {
//                             "time": 1702260312812
//                         },
//                         {
//                             "time": 1702436112116
//                         },
//                         {
//                             "time": 1702532028008
//                         },
//                         {
//                             "time": 1702786334575
//                         },
//                         {
//                             "time": 1702869059297
//                         },
//                         {
//                             "time": 1703305655801
//                         }
//                     ],
//                     "active": {
//                         "objectives": {
//                             "bedwars_daily_final_killer": 5
//                         },
//                         "started": 1703391426758
//                     }
//                 },
//                 "bedwars_weekly_challenges_win": {
//                     "completions": [
//                         {
//                             "time": 1683168915184
//                         },
//                         {
//                             "time": 1683427271717
//                         },
//                         {
//                             "time": 1685243251372
//                         },
//                         {
//                             "time": 1688350304058
//                         },
//                         {
//                             "time": 1688785254037
//                         },
//                         {
//                             "time": 1689389587246
//                         },
//                         {
//                             "time": 1691460340982
//                         },
//                         {
//                             "time": 1692243244502
//                         },
//                         {
//                             "time": 1692847002553
//                         },
//                         {
//                             "time": 1696561292724
//                         },
//                         {
//                             "time": 1698115385017
//                         },
//                         {
//                             "time": 1699062975114
//                         },
//                         {
//                             "time": 1700021269447
//                         },
//                         {
//                             "time": 1700888518501
//                         },
//                         {
//                             "time": 1701832213091
//                         },
//                         {
//                             "time": 1702093537906
//                         }
//                     ],
//                     "active": {
//                         "objectives": {
//                             "bedwars_weekly_challenge_wins": 3
//                         },
//                         "started": 1702685674643
//                     }
//                 },
//                 "bedwars_weekly_final_killer": {
//                     "completions": [
//                         {
//                             "time": 1685246650639
//                         },
//                         {
//                             "time": 1688786334312
//                         },
//                         {
//                             "time": 1692244594334
//                         },
//                         {
//                             "time": 1696900978541
//                         },
//                         {
//                             "time": 1698201928332
//                         },
//                         {
//                             "time": 1699065636297
//                         },
//                         {
//                             "time": 1701665091338
//                         },
//                         {
//                             "time": 1702413373425
//                         }
//                     ],
//                     "active": {
//                         "objectives": {
//                             "bedwars_weekly_final_killer": 70
//                         },
//                         "started": 1702685674893
//                     }
//                 }
//             },
//             "petStats": {
//                 "WOLF": {
//                     "HUNGER": {
//                         "timestamp": 1453428482065,
//                         "value": 100
//                     },
//                     "THIRST": {
//                         "timestamp": 1453428498466,
//                         "value": 100
//                     },
//                     "EXERCISE": {
//                         "value": 100,
//                         "timestamp": 1453428517816
//                     }
//                 },
//                 "ZOMBIE": {
//                     "EXERCISE": {
//                         "timestamp": 1480634857318,
//                         "value": 100
//                     },
//                     "THIRST": {
//                         "value": 100,
//                         "timestamp": 1480634869501
//                     },
//                     "HUNGER": {
//                         "value": 100,
//                         "timestamp": 1480634879661
//                     }
//                 }
//             },
//             "spec_always_flying": true,
//             "lastAdsenseGenerateTime": 1477013318800,
//             "channel": "ALL",
//             "lastLogout": 1703394884627,
//             "network_update_book": "v0.62",
//             "challenges": {
//                 "all_time": {
//                     "BEDWARS__support": 702,
//                     "BEDWARS__offensive": 219,
//                     "DUELS__feed_the_void_challenge": 10,
//                     "ARCADE__zombies_challenge": 1,
//                     "UHC__threat_challenge": 1,
//                     "ARCADE__galaxy_wars_challenge": 3,
//                     "MURDER_MYSTERY__hero": 3,
//                     "MURDER_MYSTERY__sherlock": 1,
//                     "BUILD_BATTLE__guesser_challenge": 3,
//                     "BUILD_BATTLE__top_3_challenge": 3,
//                     "WALLS__looting_challenge": 1,
//                     "SKYWARS__feeding_the_void_challenge": 1,
//                     "SKYWARS__rush_challenge": 2,
//                     "ARCADE__party_games_challenge": 1,
//                     "QUAKECRAFT__combo_challenge": 15,
//                     "QUAKECRAFT__killing_streak_challenge": 2,
//                     "QUAKECRAFT__don't_blink_challenge": 6,
//                     "MURDER_MYSTERY__murder_spree": 1,
//                     "WOOL_GAMES__merciless_killer_challenge": 3,
//                     "WOOL_GAMES__builder_challenge": 3,
//                     "ARCADE__football_challenge": 1,
//                     "BEDWARS__defensive": 3,
//                     "MURDER_MYSTERY__serial_killer": 1
//                 },
//                 "day_d": {
//                     "BEDWARS__support": 1
//                 },
//                 "day_h": {
//                     "BEDWARS__offensive": 1
//                 },
//                 "day_i": {
//                     "BEDWARS__support": 1
//                 }
//             },
//             "achievementTracking": [],
//             "achievementRewardsNew": {
//                 "for_points_200": 1529780692693,
//                 "for_points_300": 1529780700693,
//                 "for_points_400": 1529780731796,
//                 "for_points_500": 1529780733695,
//                 "for_points_600": 1529780736195,
//                 "for_points_700": 1529780739695,
//                 "for_points_800": 1529780742296,
//                 "for_points_900": 1541820258182,
//                 "for_points_1000": 1570570701400,
//                 "for_points_1100": 1570570702704,
//                 "for_points_1200": 1604867147714,
//                 "for_points_1300": 1613793596605,
//                 "for_points_1400": 1613793599352,
//                 "for_points_1500": 1613882806536,
//                 "for_points_1600": 1614400966182,
//                 "for_points_1700": 1615054966032,
//                 "for_points_1800": 1615520727020,
//                 "for_points_1900": 1619838388739,
//                 "for_points_2000": 1621644647166,
//                 "for_points_2100": 1630556511449,
//                 "for_points_2200": 1634693738880,
//                 "for_points_2300": 1639182684019,
//                 "for_points_2400": 1639951433358,
//                 "for_points_2500": 1640894724325,
//                 "for_points_2600": 1641620473142,
//                 "for_points_2700": 1659749824706,
//                 "for_points_2800": 1662602027417,
//                 "for_points_2900": 1667019305332,
//                 "for_points_3000": 1678514152624,
//                 "for_points_3100": 1683252018354,
//                 "for_points_3200": 1699500752437,
//                 "for_points_3300": 1702100412571,
//                 "for_points_3400": 1702745901055,
//                 "for_points_3500": 1702777131391
//             },
//             "achievementPoints": 3385,
//             "monthlycrates": {
//                 "1-2017": {
//                     "REGULAR": true
//                 },
//                 "10-2016": {
//                     "REGULAR": true
//                 },
//                 "11-2016": {
//                     "REGULAR": true
//                 },
//                 "12-2016": {
//                     "REGULAR": true
//                 },
//                 "3-2017": {
//                     "REGULAR": true
//                 },
//                 "5-2017": {
//                     "REGULAR": true
//                 },
//                 "6-2017": {
//                     "REGULAR": true
//                 },
//                 "6-2018": {
//                     "REGULAR": true
//                 },
//                 "8-2016": {
//                     "REGULAR": true
//                 },
//                 "8-2017": {
//                     "REGULAR": true
//                 },
//                 "2-2021": {
//                     "REGULAR": true
//                 },
//                 "3-2021": {
//                     "REGULAR": true
//                 },
//                 "4-2021": {
//                     "REGULAR": true
//                 },
//                 "5-2021": {
//                     "REGULAR": true
//                 },
//                 "6-2021": {
//                     "REGULAR": true
//                 },
//                 "9-2021": {
//                     "REGULAR": true
//                 },
//                 "10-2021": {
//                     "REGULAR": true
//                 },
//                 "11-2021": {
//                     "REGULAR": true
//                 },
//                 "12-2021": {
//                     "REGULAR": true
//                 },
//                 "1-2022": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "2-2022": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "6-2022": {
//                     "VIP": true,
//                     "REGULAR": true
//                 },
//                 "7-2022": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "8-2022": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "9-2022": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "10-2022": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "11-2022": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "12-2022": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "1-2023": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "2-2023": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "3-2023": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "4-2023": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "5-2023": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "6-2023": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "7-2023": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "8-2023": {
//                     "VIP": true,
//                     "REGULAR": true
//                 },
//                 "9-2023": {
//                     "VIP": true,
//                     "REGULAR": true
//                 },
//                 "10-2023": {
//                     "VIP": true,
//                     "REGULAR": true
//                 },
//                 "11-2023": {
//                     "REGULAR": true,
//                     "VIP": true
//                 },
//                 "12-2023": {
//                     "NORMAL": true,
//                     "VIP": true
//                 }
//             },
//             "userLanguage": "ENGLISH",
//             "parkourCheckpointBests": {
//                 "Bedwars": {
//                     "0": 10113,
//                     "1": 7801,
//                     "2": 10163,
//                     "3": 18302
//                 },
//                 "BuildBattle": {
//                     "0": 22311
//                 },
//                 "Housing": {
//                     "0": 9196,
//                     "1": 28534,
//                     "2": 18797,
//                     "3": 9753,
//                     "4": 23156
//                 },
//                 "SkywarsAug2017": {
//                     "0": 13406
//                 },
//                 "MurderMystery": {
//                     "0": 13550,
//                     "1": 9451,
//                     "2": 15201,
//                     "3": 22552
//                 },
//                 "Duels": {
//                     "0": 15753,
//                     "1": 14400,
//                     "2": 15501,
//                     "3": 12951
//                 },
//                 "mainLobby2022": {
//                     "0": 18366
//                 },
//                 "BedwarsSpring2023": {
//                     "0": 32502,
//                     "1": 28326,
//                     "2": 21735
//                 },
//                 "Tourney": {
//                     "0": 27155,
//                     "1": 40699
//                 }
//             },
//             "achievementSync": {
//                 "quake_tiered": 1
//             },
//             "parkourCompletions": {
//                 "Bedwars": [
//                     {
//                         "timeStart": 1632367698085,
//                         "timeTook": 47164
//                     }
//                 ],
//                 "MurderMystery": [
//                     {
//                         "timeStart": 1637634863794,
//                         "timeTook": 60754
//                     }
//                 ],
//                 "Duels": [
//                     {
//                         "timeStart": 1639011295906,
//                         "timeTook": 58605
//                     }
//                 ]
//             },
//             "easter2021Cooldowns2": {
//                 "NORMAL0": true,
//                 "NORMAL1": true,
//                 "NORMAL2": true,
//                 "NORMAL3": true
//             },
//             "halloween2021Cooldowns": {
//                 "NORMAL0": true,
//                 "NORMAL1": true,
//                 "NORMAL2": true,
//                 "NORMAL3": true
//             },
//             "seasonal": {
//                 "christmas": {
//                     "2021": {
//                         "presents": {
//                             "BEDWARS_1": true,
//                             "BEDWARS_2": true,
//                             "BEDWARS_4": true,
//                             "BEDWARS_5": true,
//                             "BEDWARS_3": true,
//                             "MAIN_LOBBY_1": true,
//                             "SKYWARS_2": true
//                         },
//                         "adventRewards": {
//                             "day10": 1639179351911,
//                             "day13": 1639450999349,
//                             "day1": 1639768555480,
//                             "day2": 1639768558779,
//                             "day17": 1639768564502,
//                             "day18": 1639869729251,
//                             "day19": 1639890187639,
//                             "day20": 1640027062921,
//                             "day21": 1640119522256,
//                             "day23": 1640318303515,
//                             "day24": 1640322069014
//                         }
//                     },
//                     "2022": {
//                         "adventRewards": {
//                             "day1": 1669950342168,
//                             "day2": 1670036459873,
//                             "day4": 1670201454002,
//                             "day6": 1670381997427,
//                             "day8": 1670477781795,
//                             "day10": 1670721037220,
//                             "day11": 1670735254930,
//                             "day13": 1670984302962,
//                             "day16": 1671252926229,
//                             "day18": 1671423250987,
//                             "day19": 1671432527406,
//                             "day20": 1671594777565
//                         },
//                         "levelling": {
//                             "experience": 329179
//                         },
//                         "presents": {
//                             "BEDWARS_1": true,
//                             "BEDWARS_2": true,
//                             "BEDWARS_4": true,
//                             "BEDWARS_5": true,
//                             "BEDWARS_3": true,
//                             "MURDER_1": true,
//                             "MURDER_2": true,
//                             "MURDER_3": true,
//                             "SKYWARS_1": true,
//                             "MAIN_LOBBY_38": true
//                         }
//                     },
//                     "2023": {
//                         "adventRewards": {
//                             "day1": 1701487239675,
//                             "day3": 1701662526903,
//                             "day2": 1701662529604,
//                             "day4": 1701668057177,
//                             "day5": 1701829511614,
//                             "day6": 1701842269502,
//                             "day7": 1701925947676,
//                             "day8": 1702014326630,
//                             "day9": 1702161195530,
//                             "day10": 1702246158489,
//                             "day12": 1702407418140,
//                             "day13": 1702525971878,
//                             "day14": 1702533331877,
//                             "day15": 1702687462133,
//                             "day16": 1702745905919,
//                             "day17": 1702790821524,
//                             "day18": 1702935505866,
//                             "day19": 1703035287031,
//                             "day22": 1703304550643,
//                             "day23": 1703307631908,
//                             "day24": 1703394821161
//                         },
//                         "levelling": {
//                             "experience": 680021
//                         },
//                         "bingo": {
//                             "easy": {
//                                 "objectives": {
//                                     "Bedwarsdiamond": 4,
//                                     "Bedwarsholidaybedbug": 1,
//                                     "Arcadegrinchrookie": 10
//                                 }
//                             }
//                         },
//                         "presents": {
//                             "BEDWARS_2": true,
//                             "BEDWARS_1": true,
//                             "BEDWARS_4": true,
//                             "BEDWARS_5": true,
//                             "BEDWARS_3": true
//                         }
//                     }
//                 },
//                 "summer": {
//                     "2022": {
//                         "levelling": {
//                             "experience": 85727
//                         }
//                     },
//                     "2023": {
//                         "levelling": {
//                             "experience": 587685
//                         }
//                     }
//                 },
//                 "silver": 1785,
//                 "halloween": {
//                     "2022": {
//                         "levelling": {
//                             "experience": 289807
//                         }
//                     },
//                     "2023": {
//                         "bingo": {
//                             "easy": {
//                                 "objectives": {
//                                     "Bedwarsdiamond": 1,
//                                     "Bedwarsshopoftraps": 1
//                                 }
//                             }
//                         },
//                         "levelling": {
//                             "experience": 594567
//                         }
//                     }
//                 },
//                 "anniversary": {
//                     " 2023": {
//                         "bingo": {
//                             "easy": {
//                                 "objectives": {
//                                     "Bedwarsdiamond": 1,
//                                     "Tnttagplayer": 1,
//                                     "Skywarsvoidkill": 1,
//                                     "Quakedash": 1
//                                 }
//                             }
//                         }
//                     }
//                 },
//                 "easter": {
//                     "2023": {
//                         "bedWarsWinsAchievement": 2,
//                         "levelling": {
//                             "experience": 210328
//                         },
//                         "mainlobby_egghunt_-108_78_86": true,
//                         "mainlobby_egghunt_29_67_-27": true,
//                         "mainlobby_egghunt_128_72_-134": true
//                     }
//                 }
//             },
//             "completed_christmas_quests_2021": 2,
//             "adsense_tokens": 11,
//             "tourney": {
//                 "first_join_lobby": 1639768615987,
//                 "quake_solo2_1": {
//                     "games_played": 72,
//                     "playtime": 113,
//                     "tributes_earned": 100,
//                     "first_game": 1639786968060,
//                     "claimed_ranking_reward": 1640318231858
//                 },
//                 "total_tributes": 1,
//                 "bedwars_eight_two_1": {
//                     "games_played": 19,
//                     "playtime": 183,
//                     "tributes_earned": 81,
//                     "first_win": 1697851466172
//                 },
//                 "grinch_simulator_1": {
//                     "games_played": 60,
//                     "playtime": 236,
//                     "tributes_earned": 100,
//                     "first_win": 1702703114326,
//                     "claimed_ranking_reward": 1703224794520
//                 }
//             },
//             "completed_christmas_quests_2022": 21,
//             "newPackageRank": "VIP",
//             "levelUp_VIP": 1642991957183,
//             "leveling": {
//                 "claimedRewards": [
//                     0,
//                     1,
//                     2,
//                     3,
//                     4,
//                     5,
//                     6,
//                     7,
//                     8,
//                     9,
//                     10,
//                     11,
//                     12,
//                     13,
//                     14,
//                     15,
//                     16,
//                     17,
//                     18,
//                     19,
//                     20,
//                     21,
//                     22,
//                     23,
//                     24,
//                     25,
//                     26,
//                     27,
//                     28,
//                     29,
//                     30,
//                     31,
//                     32,
//                     33,
//                     34,
//                     35,
//                     36,
//                     37,
//                     38,
//                     39,
//                     40,
//                     41,
//                     42,
//                     43,
//                     44,
//                     46,
//                     45,
//                     47,
//                     48,
//                     49,
//                     50,
//                     51,
//                     52,
//                     53,
//                     54,
//                     55,
//                     56,
//                     57,
//                     58,
//                     59,
//                     60,
//                     61,
//                     62,
//                     63,
//                     64,
//                     65,
//                     66,
//                     67,
//                     68,
//                     69,
//                     70,
//                     71,
//                     72,
//                     73,
//                     74,
//                     75,
//                     76,
//                     77,
//                     78,
//                     79,
//                     80,
//                     81,
//                     82,
//                     83,
//                     84
//                 ]
//             },
//             "main2017Tutorial": true,
//             "completed_christmas_quests_2023": 13,
//             "achievementTotem": {
//                 "canCustomize": true,
//                 "allowed_max_height": 1,
//                 "unlockedParts": [
//                     "birdy",
//                     "happy"
//                 ],
//                 "selectedParts": {},
//                 "unlockedColors": [
//                     "blue"
//                 ],
//                 "selectedColors": {}
//             },
//             "onetime_achievement_menu_sort": "least_earned",
//             "currentGadget": "GRAPPLING_HOOK",
//             "mostRecentGameType": "BEDWARS"
//         }
//     }
// }