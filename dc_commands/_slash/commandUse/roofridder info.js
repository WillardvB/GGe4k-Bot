const dungeons = require('./../../../ingame_data/dungeons.json');
const formatNumber = require('./../../../tools/number.js');
const klingThumb = "https://media.discordapp.net/attachments/884049583313928202/886594500972126298/icon_events_seaqueen_enter.png";
const klingImg = "https://media.discordapp.net/attachments/884049583313928202/886598611713015828/teaser_seaqueen_splash.png";
const klingKleur = "#00008B";
const groenThumb = "https://media.discordapp.net/attachments/884049583313928202/886594501274132510/icon_kingdom_empire_enter.png";
const groenImg = "https://media.discordapp.net/attachments/884049583313928202/886597206537289728/teaser_questbook_kingdom_green.png";
const groenKleur = "#76BA1B";
const ijsThumb = "https://media.discordapp.net/attachments/884049583313928202/886590766510645258/icon_kingdom_snow_enter.png";
const ijsImg = "https://media.discordapp.net/attachments/884049583313928202/886590766791667742/teaser_questbook_kingdom_winter.png";
const ijsKleur = "#35BAF6";
const zandThumb = "https://media.discordapp.net/attachments/882701028078801002/886553341230989312/icon_kingdom_desert_enter.png";
const zandImg = "https://media.discordapp.net/attachments/882701028078801002/886553341478436894/teaser_questbook_kingdom_desert.png";
const zandKleur = "#EFDD6F";
const vuurThumb = "https://media.discordapp.net/attachments/884049583313928202/886594501550952488/icon_kingdom_volcano_enter.png";
const vuurImg = "https://media.discordapp.net/attachments/884049583313928202/886597206277238784/teaser_questbook_kingdom_fire.png";
const vuurKleur = "#FD3A2D";
const stormThumb = "https://media.discordapp.net/attachments/884049583313928202/886596077170610236/icon_island_xl_ds.png";
const stormImg = "https://media.discordapp.net/attachments/884049583313928202/886596077405474857/teaser_island_introduction.png";
const stormKleur = "#ADD8E6";
const beriThumb = "https://media.discordapp.net/attachments/884049583313928202/886594500762423329/icon_events_berimond_enter.png";
const beriImg = "https://media.discordapp.net/attachments/884049583313928202/886598084958752808/teaser_berimond_splash.png";
const beriKleur = "#FF00FF";
const { MessageEmbed, MessageActionRow, MessageButton, Interaction } = require('discord.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';

const _name = "roofridder info "
module.exports = {
    name: _name,
    /**
     * 
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        let wereld;
        let level;
        let winsTotUp;
        if (interaction.options) {
            wereld = interaction.options.getString('wereld');
            level = interaction.options.getInteger('level');
            winsTotUp = interaction.options.getInteger('totlvlup');
        }
        else if (interaction.customId) {
            var string = interaction.customId.split(' ');
            wereld = string[2];
            level = string[3];
            winsTotUp = string[4];
        }
        const kID = parseInt(wereld);
        let minLvlRRvanRijk = krijgMinimumVanRijk(kID);
        let maxLvlRRvanRijk = krijgMaximumVanRijk(kID);
        level = Math.max(Math.min(level, maxLvlRRvanRijk), minLvlRRvanRijk);
        if (level == maxLvlRRvanRijk) {
            winsTotUp = 0;
        }
        else {
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
            if (parseInt(dungeon.countVictories) === victories) {
                if (dungeon.kID === kID) {
                    naarOutput(interaction, dungeon, kID, level, winsTotUp, victories);
                }
            }
        }
    },
};

async function naarOutput(interaction, dungeon, kID, level, winsTotUp, victories) {
    console.log(dungeon);
    //
    //
    await interaction.followUp({ content: "Sorry, dit command werkt nog niet!" });
    return;


    let afbeelding = "";
    let thumbnail = "";
    let kleur = "";
    switch (kID + "") {
        case "-1": afbeelding = klingImg; thumbnail = klingThumb; kleur = klingKleur; break;
        case "0": afbeelding = groenImg; thumbnail = groenThumb; kleur = groenKleur; break;
        case "1": afbeelding = zandImg; thumbnail = zandThumb; kleur = zandKleur; break;
        case "2": afbeelding = ijsImg; thumbnail = ijsThumb; kleur = ijsKleur; break;
        case "3": afbeelding = vuurImg; thumbnail = vuurThumb; kleur = vuurKleur; break;
        case "4": afbeelding = stormImg; thumbnail = stormThumb; kleur = stormKleur; break;
        case "10": afbeelding = beriImg; thumbnail = beriThumb; kleur = beriKleur; break;
        default: break;
    }
    let soldatenLinks = krijgSolsEnTools(dungeon, 85, 11);
    let soldatenMidden = krijgSolsEnTools(dungeon, 74, 11);
    let soldatenRechts = krijgSolsEnTools(dungeon, 96, 11);
    let toolsLinks = krijgSolsEnTools(dungeon, 107, 6);
    let toolsMidden = krijgSolsEnTools(dungeon, 113, 6);
    let toolsRechts = krijgSolsEnTools(dungeon, 119, 6);
    let soldatenBP = krijgSolsEnTools(dungeon, 125, 11);
    let levelString = "Roofridder level "
    let winsTotUpString = " (nog " + winsTotUp + "x voor volgend level)"
    if (dungeon[0] == "-1") {
        levelString = "";
        winsTotUpString = "";
    }
    krijgAttTactiek(kID, victories).then(attTactiek => {
        let embed = new MessageEmbed()
            .setColor(kleur)
            .setTimestamp()
            .setFooter(footerTekst, footerAfbeelding)
            .setTitle("**" + levelString + level + winsTotUpString + "**")
            .setDescription("*roofridder data*")
            .setThumbnail(thumbnail)
            .setImage(afbeelding)
            .addField("**Links**", soldatenLinks + "\n" + toolsLinks, true)
            .addField("**Midden**", soldatenMidden + "\n" + toolsMidden, true)
            .addField("**Rechts**", soldatenRechts + "\n" + toolsRechts, true)
            .addField("**Binnenplaats**", soldatenBP, true)
        if (kID >= 0 && kID <= 3) {
            embed.addField("**Te halen buit**", krijgBuit(level), true);
        }
        const messRow = new MessageActionRow();
        if (level > krijgMinimumVanRijk(kID)) {
            var tempLvlArray = victToLvlArray(victories - 1, kID);
            messRow.addComponents(
                new MessageButton()
                    .setLabel('lvl ' + tempLvlArray[0] + '.' + tempLvlArray[1])
                    .setStyle('PRIMARY')
                    .setCustomId(_name + ' ' + kID + " " + tempLvlArray[0] + ' ' + tempLvlArray[1])
            )
        }
        if (level < krijgMaximumVanRijk(kID)) {
            var tempLvlArray = victToLvlArray(victories + 1, kID);
            messRow.addComponents(
                new MessageButton()
                    .setLabel('lvl ' + tempLvlArray[0] + '.' + tempLvlArray[1])
                    .setStyle('PRIMARY')
                    .setCustomId(_name + ' ' + kID + " " + tempLvlArray[0] + ' ' + tempLvlArray[1])
            )
        }
        if (interaction.options) {
            interaction.followUp({ embeds: [embed], components: [messRow] });
        } else {
            interaction.editReply({ embeds: [embed], components: [messRow] });
        }
    })
}

function krijgVictories(kID, level, winsTotUp) {
    let minLvlvanRijk = krijgMinimumVanRijk(kID);
    let maxLvlvanRijk = krijgMaximumVanRijk(kID);
    if (kID == -999) {
        return -999;
    }
    if (level == "draak" || level == "d" || level == "woestijnfort" || level == "wf" || level == "barbarenfort" || level == "bf") {
        return "-1";
    }
    if (kID == 4) {
        return level - winsTotUp + 2;
    }
    else if (level == minLvlvanRijk) {
        return 0;
    }
    else {
        return Math.max(Math.min(
            Math.floor(Math.pow((maxLvlvanRijk - minLvlvanRijk) / 1.9, 1 / 0.555) + 1),
            Math.floor(Math.pow((level - minLvlvanRijk + 1) / 1.9, 1 / 0.555) + 1 - winsTotUp)
        ), 0);
    }
}

function victToLvlArray(victories, kID) {
    const minimumLevel = krijgMinimumVanRijk(kID);
    const level = Math.floor(1.9 * Math.pow(Math.abs(victories), 0.555)) + minimumLevel;
    const victLvl = krijgVictories(kID, level, 0);
    let totLvlUp = victLvl - victories;
    if (level == minimumLevel) {
        totLvlUp = 1;
    }
    return [level, totLvlUp];
}

function krijgMinimumVanRijk(kID) {
    let minLvlRRvanRijk = 0;
    switch (kID + "") {
        case "0": minLvlRRvanRijk = 1; break;
        case "2": minLvlRRvanRijk = 20; break;
        case "1": minLvlRRvanRijk = 35; break;
        case "3": minLvlRRvanRijk = 45; break;
        default: break;
    }
    return minLvlRRvanRijk;
}

function krijgMaximumVanRijk(kID) {
    let maxLvlRRvanRijk = 100;
    switch (kID + "") {
        case "0": maxLvlRRvanRijk = 81; break;
        case "2": maxLvlRRvanRijk = 51; break;
        case "1": maxLvlRRvanRijk = 61; break;
        case "3": maxLvlRRvanRijk = 71; break;
        default: break;
    }
    return maxLvlRRvanRijk;
}

function krijgBuit(lvl) {
    const bs = Math.floor(Math.pow(lvl, 2.2) * 1.2 + 90);
    let munt = 0;
    if (lvl >= 61) {
        munt = Math.floor(Math.pow(lvl, 1.1) * 210);
    }
    else {
        munt = Math.floor(Math.pow(lvl, 2.1) * 3.5 + 25);
    }
    const robsMin = lvl >= 3 ? Math.floor(Math.max(0, (0 * 11 - 5 + lvl * 0.5 + 0.7) * 0.5)) : 0;
    const robsMax = lvl >= 3 ? Math.floor(Math.max(0, (1 * 11 - 5 + lvl * 0.5 + 0.7) * 0.5)) : 0;
    let robs;
    if (robsMin == robsMax) {
        robs = robsMax;
    } else {
        robs = robsMin + '-' + robsMax;
    }
    const output = `BS: ${formatNumber.formatNum(bs)}\nMunten: ${formatNumber.formatNum(munt)}\nRobijnen: ${robs}`;
    return output;
}

function krijgSolsEnTools(row, startWaarde, waardes) {
    let tekst = "";
    for (let s = 0; s < waardes; s++) {
        let waarde = row[startWaarde + s]
        if (waarde != null && waarde != "") {
            tekst += waarde + "\n";
        }
    }
    if ((tekst == "" || tekst == null) && waardes != 6) {
        tekst = "~";
    }
    return tekst;
}