const e4kData = require('e4k-data');
const dungeons = e4kData.data.dungeons;
const imgBaseUrl = e4kData.imageBaseUrl;
const imgData = e4kData.imageData
const {Constants, Unit} = require('ggejs');
const klingThumb = imgBaseUrl + imgData.icon_events_seaqueen_enter.url;
const klingImg = imgBaseUrl + imgData.teaser_seaqueen_splash.url;
const klingKleur = "#00008B";
const groenThumb = imgBaseUrl + imgData.icon_kingdom_empire_enter.url;
const groenImg = imgBaseUrl + imgData.teaser_questbook_kingdom_green.url;
const groenKleur = "#64bb00";
const ijsThumb = imgBaseUrl + imgData.icon_kingdom_snow_enter.url;
const ijsImg = imgBaseUrl + imgData.teaser_questbook_kingdom_winter.url;
const ijsKleur = "#00b3ff";
const zandThumb = imgBaseUrl + imgData.icon_kingdom_desert_enter.url;
const zandImg = imgBaseUrl + imgData.teaser_questbook_kingdom_desert.url;
const zandKleur = "#ffff00";
const vuurThumb = imgBaseUrl + imgData.icon_kingdom_volcano_enter.url;
const vuurImg = imgBaseUrl + imgData.teaser_questbook_kingdom_fire.url;
const vuurKleur = "#FD3A2D";
const stormThumb = imgBaseUrl + imgData.icon_island_xl_ds.url;
const stormImg = imgBaseUrl + imgData.teaser_island_introduction.url;
const stormKleur = "#82d2e5";
const beriThumb = imgBaseUrl + imgData.icon_events_berimond_enter.url;
const beriImg = imgBaseUrl + imgData.teaser_berimond_splash.url;
const beriKleur = "#FF00FF";
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const translationData = require('e4k-data').languages.nl;
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';

const _name = "roofridder info"
module.exports = {
    name: _name,
    /**
     *
     * @param {ChatInputCommandInteraction | ButtonInteraction} interaction
     */
    async execute(interaction) {
        let kID;
        let level;
        let winsTotUp;
        if (interaction.options) {
            kID = interaction.options.getInteger('wereld');
            level = interaction.options.getInteger('level');
            winsTotUp = interaction.options.getInteger('totlvlup');
        } else if (interaction.customId) {
            let string = interaction.customId.split(' ');
            kID = parseInt(string[2]);
            level = parseInt(string[3]);
            winsTotUp = parseInt(string[4]);
        }
        let minLvlRRvanRijk = krijgMinimumVanRijk(kID);
        let maxLvlRRvanRijk = krijgMaximumVanRijk(kID);
        level = Math.max(Math.min(level, maxLvlRRvanRijk), minLvlRRvanRijk);
        if (level === maxLvlRRvanRijk) {
            winsTotUp = 0;
        } else {
            const vict = krijgVictories(kID, level, winsTotUp);
            level = victToLvlArray(vict, kID)[0];
            winsTotUp = victToLvlArray(vict, kID)[1];
        }
        if (level <= minLvlRRvanRijk) {
            level = minLvlRRvanRijk;
            winsTotUp = 1;
        }
        const victories = krijgVictories(kID, level, winsTotUp);
        for (let item in dungeons) {
            let dungeon = dungeons[item];
            if (dungeon.countVictories === victories) {
                if (dungeon.kID === kID) {
                    await naarOutput(interaction, dungeon, kID, level, winsTotUp, victories);
                }
            }
        }
    },
};

module.exports.button = module.exports.execute;

async function naarOutput(interaction, dungeon, kID, level, winsTotUp, victories) {
    let afbeelding = "";
    let thumbnail = "";
    let kleur = "#000000";
    switch (kID) {
        case -1:
            afbeelding = klingImg;
            thumbnail = klingThumb;
            kleur = klingKleur;
            break;
        case Constants.Kingdom.Classic:
            afbeelding = groenImg;
            thumbnail = groenThumb;
            kleur = groenKleur;
            break;
        case Constants.Kingdom.Desert:
            afbeelding = zandImg;
            thumbnail = zandThumb;
            kleur = zandKleur;
            break;
        case Constants.Kingdom.Icecream:
            afbeelding = ijsImg;
            thumbnail = ijsThumb;
            kleur = ijsKleur;
            break;
        case Constants.Kingdom.Volcano:
            afbeelding = vuurImg;
            thumbnail = vuurThumb;
            kleur = vuurKleur;
            break;
        case Constants.Kingdom.Island:
            afbeelding = stormImg;
            thumbnail = stormThumb;
            kleur = stormKleur;
            break;
        case Constants.Kingdom.Faction:
            afbeelding = beriImg;
            thumbnail = beriThumb;
            kleur = beriKleur;
            break;
        default:
            break;
    }

    let dungeonDef = parseDefence(dungeon);

    let soldiersLeft = "";
    for (let i in dungeonDef.troops.left) {
        let troop_count = dungeonDef.troops.left[i];
        soldiersLeft += `${troop_count.unit.type}: ${troop_count.count}\n`
    }
    let soldiersMiddle = "";
    for (let i in dungeonDef.troops.middle) {
        let troop_count = dungeonDef.troops.middle[i];
        soldiersMiddle += `${troop_count.unit.type}: ${troop_count.count}\n`
    }
    let soldiersRight = "";
    for (let i in dungeonDef.troops.right) {
        let troop_count = dungeonDef.troops.right[i];
        soldiersRight += `${troop_count.unit.type}: ${troop_count.count}\n`
    }
    let soldiersKeep = "";
    for (let i in dungeonDef.troops.center) {
        let troop_count = dungeonDef.troops.center[i];
        soldiersKeep += `${troop_count.unit.type}: ${troop_count.count}\n`
    }
    let toolsLeft = "";
    for (let i in dungeonDef.tools.left) {
        let troop_count = dungeonDef.tools.left[i];
        toolsLeft += `${troop_count.unit.type}: ${troop_count.count}\n`
    }
    let toolsMiddle = "";
    for (let i in dungeonDef.tools.middle) {
        let troop_count = dungeonDef.tools.middle[i];
        toolsMiddle += `${troop_count.unit.type}: ${troop_count.count}\n`
    }
    let toolsRight = "";
    for (let i in dungeonDef.tools.right) {
        let troop_count = dungeonDef.tools.right[i];
        toolsRight += `${troop_count.unit.type}: ${troop_count.count}\n`
    }
    if (soldiersLeft === "") soldiersLeft = "-\n";
    if (soldiersMiddle === "") soldiersMiddle = "-\n";
    if (soldiersRight === "") soldiersRight = "-\n";
    if (soldiersKeep === "") soldiersKeep = "-\n";
    let levelString = "Roofridder level "
    let winsTotUpString = ` (nog ${winsTotUp}x voor volgend level)`
    if (dungeon[0] === "-1") {
        levelString = "";
        winsTotUpString = "";
    }
    let embed = new EmbedBuilder()
        .setColor(kleur)
        .setTimestamp()
        .setFooter({text: footerTekst, iconURL: footerAfbeelding})
        .setTitle("**" + levelString + level + winsTotUpString + "**")
        .setDescription("*Roofridder data*")
        .setThumbnail(thumbnail)
        .setImage(afbeelding)
        .addFields({
            name: `**${translationData.dialogs.dialog_defence_leftFlank}**`,
            value: soldiersLeft + toolsLeft,
            inline: true
        })
        .addFields({
            name: `**${translationData.dialogs.dialog_defence_middleFlank}**`,
            value: soldiersMiddle + toolsMiddle,
            inline: true
        })
        .addFields({
            name: `**${translationData.dialogs.dialog_defence_rightFlank}**`,
            value: soldiersRight + toolsRight,
            inline: true
        })
        .addFields({
            name: `**${translationData.dialogs.dialog_battleLogDetail_courtyard}**`,
            value: soldiersKeep,
            inline: true
        })
    if (kID >= 0 && kID <= 3) {
        embed.addFields({
            name: "**Te halen buit**",
            value: `Zie '${translationData.dialogs.dialog_battleLog_loot}'-knop`,
            inline: true
        });
    }
    const messRow = new ActionRowBuilder();
    if (level > krijgMinimumVanRijk(kID)) {
        let tempLvlArray = victToLvlArray(victories - 1, kID);
        messRow.addComponents(
            new ButtonBuilder()
                .setLabel(`${translationData.generic.level} ${tempLvlArray[0]}.${tempLvlArray[1]}`)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`${_name} ${kID} ${tempLvlArray[0]} ${tempLvlArray[1]}`)
        )
    }
    if (level < krijgMaximumVanRijk(kID)) {
        let tempLvlArray = victToLvlArray(victories + 1, kID);
        messRow.addComponents(
            new ButtonBuilder()
                .setLabel(`${translationData.generic.level} ${tempLvlArray[0]}.${tempLvlArray[1]}`)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`${_name} ${kID} ${tempLvlArray[0]} ${tempLvlArray[1]}`)
        )
    }
    if (interaction.options) {
        await interaction.followUp({embeds: [embed], components: [messRow], ephemeral: true});
    } else {
        await interaction.editReply({embeds: [embed], components: [messRow], ephemeral: true});
    }

}

/**
 *
 * @param {number} kID
 * @param {string | number} level
 * @param {number} winsTotUp
 * @returns {number}
 */
function krijgVictories(kID, level, winsTotUp) {
    let minLvlvanRijk = krijgMinimumVanRijk(kID);
    let maxLvlvanRijk = krijgMaximumVanRijk(kID);
    if (kID === -999) {
        return -999;
    }
    if (level === "draak" || level === "d" || level === "woestijnfort" || level === "wf" || level === "barbarenfort" || level === "bf") {
        return -1;
    }
    if (kID === 4) {
        return level - winsTotUp + 2;
    } else if (level === minLvlvanRijk) {
        return 0;
    } else {
        return Math.max(Math.min(
            Math.floor(Math.pow((maxLvlvanRijk - minLvlvanRijk) / 1.9, 1 / 0.555) + 1),
            Math.floor(Math.pow((level - minLvlvanRijk + 1) / 1.9, 1 / 0.555) + 1 - winsTotUp)
        ), 0);
    }
}

/**
 *
 * @param {number} victories
 * @param {number} kID
 * @returns {number[]}
 */
function victToLvlArray(victories, kID) {
    const minimumLevel = krijgMinimumVanRijk(kID);
    const level = Math.floor(1.9 * Math.pow(Math.abs(victories), 0.555)) + minimumLevel;
    const victLvl = krijgVictories(kID, level, 0);
    let totLvlUp = victLvl - victories;
    if (level === minimumLevel) {
        totLvlUp = 1;
    }
    return [level, totLvlUp];
}

/**
 *
 * @param {number} kID
 * @returns {number}
 */
function krijgMinimumVanRijk(kID) {
    let minLvlRRvanRijk = 0;
    switch (kID) {
        case Constants.Kingdom.Classic:
            minLvlRRvanRijk = 1;
            break;
        case Constants.Kingdom.Icecream:
            minLvlRRvanRijk = 20;
            break;
        case Constants.Kingdom.Desert:
            minLvlRRvanRijk = 35;
            break;
        case Constants.Kingdom.Volcano:
            minLvlRRvanRijk = 45;
            break;
        default:
            break;
    }
    return minLvlRRvanRijk;
}

/**
 *
 * @param {number} kID
 * @returns {number}
 */
function krijgMaximumVanRijk(kID) {
    let maxLvlRRvanRijk = 100;
    switch (kID) {
        case Constants.Kingdom.Classic:
            maxLvlRRvanRijk = 81;
            break;
        case Constants.Kingdom.Icecream:
            maxLvlRRvanRijk = 51;
            break;
        case Constants.Kingdom.Desert:
            maxLvlRRvanRijk = 61;
            break;
        case Constants.Kingdom.Volcano:
            maxLvlRRvanRijk = 71;
            break;
        default:
            break;
    }
    return maxLvlRRvanRijk;
}

/**
 *
 * @param {object} dungeonData
 * @returns {{troops: {left: {unit: Unit, count: number}[], middle: {unit: Unit, count: number}[], right: {unit: Unit, count: number}[], center: {unit: Unit, count: number}[]}, tools: {left: {unit: Unit, count: number}[], middle: {unit: Unit, count: number}[], right: {unit: Unit, count: number}[], center: {unit: Unit, count: number}[]}}}
 */
function parseDefence(dungeonData) {
    /** @type {{ troops: { left: { unit: Unit, count: number }[], middle: { unit: Unit, count: number }[], right: { unit: Unit, count: number }[], center: { unit: Unit, count: number }[] }, tools: { left: { unit: Unit, count: number }[], middle: { unit: Unit, count: number }[], right: { unit: Unit, count: number }[], center: { unit: Unit, count: number }[] } }} */
    this._defence = {
        troops: {
            left: parseUnits(null, dungeonData.unitsL),
            middle: parseUnits(null, dungeonData.unitsM),
            right: parseUnits(null, dungeonData.unitsR),
            center: parseUnits(null, dungeonData.unitsK),
        },
        tools: {
            left: parseUnits(null, dungeonData.toolL),
            middle: parseUnits(null, dungeonData.toolM),
            right: parseUnits(null, dungeonData.toolR),
        }
    }
    return this._defence;
}

/**
 *
 * @param {Client} client
 * @param {string} _data
 * @returns {{ unit: Unit, count: number }[]}
 */
function parseUnits(client, _data) {
    /** @type {{ unit: Unit, count: number }[]} */
    let units = [];
    if (!_data) return units;
    let data = _data.split("#");
    for (let i in data) {
        let splitData = data[i].split("+");
        let wodId = parseInt(splitData[0]);
        let count = parseInt(splitData[1]);
        units.push({
            unit: new Unit(client, wodId),
            count: count
        })
    }
    return units;
}