const stringSimilarity = require("string-similarity");
const googleSheetsData = require('./../../../data/googleSpreadSheetData.js');
const buildingData = require('./../../../ingame_data/buildings.json');
const translationData = require('./../../../ingame_translations/nl.json');
const imagesData = require('./../../../ingame_images/x768.json')
const buildingTranslations = translationData.buildings_and_decorations;
const formatNumber = require('./../../../tools/number.js');
const { MessageEmbed, MessageActionRow, MessageButton, Interaction } = require('discord.js');
const Logger = require("../../../tools/Logger.js");
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const kostenKol = [7, 13, 33, 20, 15, 17, 25, 26, 27, 43, 47, 51, 52, 14, 1, 57, 1, 66, 70, 72, 76, 77, 78, 80, 83, 84, 85, 86, 88, 91, 92, 93, 94, 95, 96, 97, 98, 103, 109, 110, 111, 113, 115, 116, 118, 120, 121, 122, 123, 127, 128, 129, 130, 136, 137, 138, 139, 142, 144, 145, 146, 149];
const kostenSoort = ["Oppervlakte", "Benodigd level", "Benodigd legendarisch level", "Maximum aantal", "Sloopbaar", "Brandbaar", "XP", "Macht", "Decoratiepunten", "Groter zichtveld", "Grachtbonus", "Muurbonus", "Poortbonus", "Man op muur", "Productie", "Veilige opslag", "Opslag", "Bouwsnelheidsboost", "Troepen per vak te trainen", "Troepen train boost", "Plekken in het district", "Bevolking", "Marktkarren", "Spionnen", "Burchtvoogden", "Commandanten", "Stadswachten", "Brandweerbonus", "Getoonde reistijdbonus", "Verlaging bouwkosten", "% overlevingsbonus", "Hospitaalgrootte", "Hospitaalvakken", "Ratio", "Max % jachtbonus", "Extra bouwvakken", "Onderzoeksnelheidbonus", "BG voedselbonus", "Max aantal soldaten", "Moraalpunten", "Max aantal beri-soldaten", "Vrachtpunten", "Veilige aqua opslag", "Relikwieschervenbonus", "Extra uitrustingopslag", "Vaardighedenpunten", "Roembonus", "% XP bonus", "Tuigencreatieboost", "Houtproductiebonus", "Steenproductiebonus", "Voedselproductiebonus", "Consumptie reductie", "IJzerertsproductiebonus", "Houtskoolproductiebonus", "Olijfolieproductiebonus", "Glasproductiebonus", "Honingwijnratio", "Verlaging honingwijnconsumptie", "Honingwijnproductieboost", "Honingproductiebonus", "Munten opbrengst bij verkoop"];
const opslagKol = [58, 59, 60, 61, 62, 63, 64, 65, 67, 68];
const opslagSoort = ["Houtopslag", "Steenopslag", "Voedselopslag", "Houtskoolopslag", "Olijfolieopslag", "Glasopslag", "Aquamarijnopslag", "IJzerertsopslag", "Honingopslag", "Honingwijnopslag"];
const productieKol = [54, 55, 56, 131, 133, 134, 135, 140, 141];
const productieSoort = ["Houtproductie", "Steenproductie", "Voedselproductie", "Houtskoolproductie", "Olijfolieproductie", "Glasproductie", "IJzerertsproductie", "Honingproductie", "Honingwijnproductie"];

const _name = "gebouw algemeen";
module.exports = {
    name: _name,
    /**
     * 
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        let level;
        let gebouwnaam;
        if (interaction.options) {
            level = interaction.options.getInteger('level');
            gebouwnaam = interaction.options.getString('naam');
        }
        else if (interaction.customId) {
            var string = interaction.customId.split(' ');
            level = string[2];
            gebouwnaam = string[3];
            for (i = 4; i < string.length; i++) {
                gebouwnaam += " " + string[i];
            }
        }
        gebouwnaam = gebouwnaam.trim().toLowerCase();
        let _mogelijkeGebouwnamen = ["Zaal der legenden"];
        let foundBuildingName = "<Not found>";
        for (let _intern_buildingName in buildingTranslations) {
            if (buildingTranslations[_intern_buildingName].toLowerCase().trim() === gebouwnaam) {
                foundBuildingName = _intern_buildingName;
                break;
            }
            else if (_intern_buildingName.endsWith('_name')){
                let _mogelijkGebouwNaam = buildingTranslations[_intern_buildingName];
                if (!_mogelijkeGebouwnamen.includes(_mogelijkGebouwNaam) && _mogelijkGebouwNaam !== "village_name" && _mogelijkGebouwNaam !== "barrel_name")
                    _mogelijkeGebouwnamen.push(_mogelijkGebouwNaam);
            }
        }
        if (foundBuildingName === "<Not found>") {
            if (gebouwnaam === "zaal der legenden") foundBuildingName = "dialog_legendtemple_name";
        }
        if (foundBuildingName === "<Not found>") {
            let matches = stringSimilarity.findBestMatch(gebouwnaam, _mogelijkeGebouwnamen).ratings;
            matches = matches.sort((a, b) => {
                if (a.rating > b.rating) return -1;
                if (a.rating < b.rating) return 1;
                return 0;
            }).slice(0, 5);
            const _messageActionRow = new MessageActionRow();
            for (let i = 0; i < matches.length; i++) {
                _messageActionRow.addComponents(
                    new MessageButton().setCustomId(`${_name} ${level} ${matches[i].target}`)
                        .setLabel(matches[i].target).setStyle('PRIMARY')
                );
            }
            interaction.followUp({
                embeds: [new MessageEmbed().setDescription("Ik kan het gebouw met de opgegeven naam niet vinden!\n\nBedoelde je:")],
                components: [_messageActionRow]
            });
            return;
        }
        foundBuildingName = foundBuildingName.split('_name')[0].toLowerCase();
        if (foundBuildingName.startsWith('dialog_')) foundBuildingName = foundBuildingName.substring(7);
        let buildingNameParts = foundBuildingName.split('_');
        let minMaxLevel = getLevelMinMax(buildingNameParts);
        let minLevel = minMaxLevel[0];
        let maxLevel = minMaxLevel[1];
        level = Math.min(Math.max(level, minLevel), maxLevel);
        let data = getBuildingLevelData(buildingNameParts, level);
        if (data === null) return;
        naarOutput(interaction, data, minLevel, maxLevel);
    },
};

/**
 * 
 * @param {Interaction} interaction
 * @param {object} data
 * @param {number} minLevel
 * @param {number} maxLevel
 */
function naarOutput(interaction, data, minLevel, maxLevel) {
    try {
        let level = data.level;
        let gebouwNaam = getBuildingName(data);
        let description = getBuildingDescription(data);
        let title = `**${gebouwNaam}**${minLevel === maxLevel ? "" : ` (level ${level})`}`;
        let image = getBuildingImage(data);

        let embed = new MessageEmbed()
            .setColor('#996515')
            .setTimestamp()
            .setFooter(footerTekst, footerAfbeelding)
            .setTitle(title)
        if (image !== "") embed.setThumbnail(image);
        if (description !== "") embed.setDescription(description);

        let values = "";
        const _keys = Object.keys(data);
        let storageValues = "";
        let productionValues = "";
        for (let _i = 0; _i < _keys.length; _i++) {
            let _key = _keys[_i];
            if (_key.startsWith("cost") || _key === "height" || _key === "foodRatio" || _key === "buildDuration") continue;
            let _value = data[_key];
            if (_key == "burnable" || _key == "tempServerBurnable" || _key == "destructable" || _key == "tempServerDestructable") {
                _value = data[_key] == "1" ? "Ja" : "Nee";
                if (_key.endsWith("burnable")) _key.replace("burnable", "brandbaar");
                if (_key.endsWith("destructable")) _key.replace("destructable", "verwoestbaar");
            }
            if (_key == "width") {
                _key = "Oppervlakte";
                _value = `${data[_key]}x${data["height"]}`;
            }
            if (_key == "hunterRatio") {
                _value = `${data[_key] / 100} bs geeft 1 brood`;
            }
            if (_key == "honeyRatio") {
                _value = `${data[_key]} honing en ${data["foodRatio"]} brood geven samen 1 honingwijn`;
            }
            if (_key.toLowerCase().endsWith("storage"))
            {
                storageValues += `**${translationData.generic[_key.substring(0, _key.length - 7)]}**: ${formatNumber.formatNum(data[_key])}\n`;
                continue;
            }
            if (_key.toLowerCase().endsWith("production")) {
                productionValues += `**${translationData.generic[_key.substring(0, _key.length - 10).toLowerCase()]}**: ${formatNumber.formatNum(data[_key])}\n`;
                continue;
            }
            if (_key.startsWith("tempServer")) _key.replace("tempServer", "buitenrijken ");
            _key = _key.toLowerCase();
            values += `**${_key}**: ${_value}\n`;
        }
        if (storageValues !== "") {
            embed.addField(`**${translationData.buildings_and_decorations.storehouse_name}**`, storageValues.trim());
        }
        if (productionValues !== "") {
            embed.addField(`**${translationData.generic.produce}**`, productionValues.trim());
        }
        values = values.substring(0, 1000);
        embed.addField("**Overige informatie**", values);
        
        let components = [];
        if (minLevel != maxLevel) {
            const _messageActionRow = new MessageActionRow();
            if (level > minLevel) {
                _messageActionRow.addComponents(
                    new MessageButton()
                        .setLabel('lvl ' + (level * 1 - 1))
                        .setStyle('PRIMARY')
                        .setCustomId(`${_name} ${(level * 1 - 1)} ${gebouwNaam}`)
                )
            }
            if (level < maxLevel) {
                _messageActionRow.addComponents(
                    new MessageButton()
                        .setLabel('lvl ' + (level * 1 + 1))
                        .setStyle('PRIMARY')
                        .setCustomId(`${_name} ${(level * 1 + 1)} ${gebouwNaam}`)
                )
            }
            components = [_messageActionRow];
        }
        if (interaction.options) {
            interaction.followUp({ embeds: [embed], components: components });
        } else {
            interaction.editReply({ embeds: [embed], components: components });
        }
        return;
        //#region old code
        for (var i = 0; i < kostenKol.length; i++) {
            let waarde = row[kostenKol[i]];
            let soort = kostenSoort[i];
            if (waarde != null && waarde != "" && soort != null && soort != "") {
                embed.addField("**" + soort + "**", waarde, true);
            }
        }
        //#endregion
    } catch (e) {
        Logger.logError(e);
    }
}

/**
 * 
 * @param {object} data
 */
function getBuildingName(data) {
    let dataName = data.name.toLowerCase();
    let dataType = data.type?.toLowerCase();
    let dataGroup = data.group?.toLowerCase();
    if (dataName === "legendtemple") {
        return translationData.dialogs.dialog_legendtemple_name;
    }
    else {
        let _keys = Object.keys(buildingTranslations);
        let _key = _keys.find(_item => {
            if (_item.toLowerCase() === `${dataName}_name`) return true;
            if (_item.toLowerCase() === `${dataName}_${dataType}_name`) return true;
            if (_item.toLowerCase() === `${dataName}_${dataGroup}_name`) return true;
            return false;
        })
        if (_key !== undefined) {
            return buildingTranslations[_key];
        }
    }
    return data.name;
}

/**
 * 
 * @param {object} data
 */
function getBuildingDescription(data) {
    let dataName = data.name.toLowerCase();
    let dataType = data.type?.toLowerCase();
    let dataGroup = data.group?.toLowerCase();
    if (dataName === "legendtemple") {
        return translationData.dialogs.dialog_legendtemple_shortInfo;
    }
    else {
        let _keys = Object.keys(buildingTranslations);
        let _key = _keys.find(_item => {
            if (_item.toLowerCase() === `${dataName}_short_info`) return true;
            if (_item.toLowerCase() === `${dataName}_${dataType}_short_info`) return true;
            if (_item.toLowerCase() === `${dataName}_${dataGroup}_short_info`) return true;
            return false;
        })
        if (_key !== undefined) {
            return buildingTranslations[_key];
        }
    }
    return "";
}

/**
 * 
 * @param {Array} buildingNameParts
 */
function getLevelMinMax(buildingNameParts) {
    let minLevel = 1000;
    let maxLevel = 0;
    for (let _building in buildingData) {
        let _data = buildingData[_building];
        let _dataName = _data.name.toLowerCase();
        let _dataType = _data.type.toLowerCase();
        let _dataGroup = _data.group.toLowerCase();
        let _dataLevel = parseInt(_data.level);
        if (buildingNameParts.length === 1) {
            if (_dataName === buildingNameParts[0]) {
                if (_dataLevel < minLevel) minLevel = _dataLevel;
                if (_dataLevel > maxLevel) maxLevel = _dataLevel;
            }
        }
        else if (buildingNameParts.length === 2) {
            if (_dataName === buildingNameParts[0] &&
                _dataType === buildingNameParts[1]) {
                if (_dataLevel < minLevel) minLevel = _dataLevel;
                if (_dataLevel > maxLevel) maxLevel = _dataLevel;
            }
            else if (_dataName === buildingNameParts[0] &&
                _dataGroup === buildingNameParts[1]) {
                if (_dataLevel < minLevel) minLevel = _dataLevel;
                if (_dataLevel > maxLevel) maxLevel = _dataLevel;
            }
        }
    }
    return [minLevel, maxLevel];
}

/**
 * 
 * @param {Array} buildingNameParts
 * @param {number} level
 */
function getBuildingLevelData(buildingNameParts, level) {
    let data = null;
    for (let _building in buildingData) {
        let _data = buildingData[_building];
        let _dataName = _data.name.toLowerCase();
        let _dataType = _data.type.toLowerCase();
        let _dataGroup = _data.group.toLowerCase();
        let _dataLevel = parseInt(_data.level);
        if (buildingNameParts.length == 1) {
            if (_dataName === buildingNameParts[0]) {
                if (_dataLevel === level) data = _data;
            }
        }
        else if (buildingNameParts.length == 2) {
            if (_dataName === buildingNameParts[0] &&
                _dataType === buildingNameParts[1]) {
                if (_dataLevel === level) data = _data;
            }
            else if (_dataName === buildingNameParts[0] &&
                _dataGroup === buildingNameParts[1]) {
                if (_dataLevel === level) data = _data;
            }
        }
    }
    return data;
}

/**
 * 
 * @param {object} data
 */
function getBuildingImage(data) {
    let dataName = data.name.toLowerCase();
    let dataType = data.type?.toLowerCase();
    let dataGroup = data.group?.toLowerCase();

    let _keys = Object.keys(imagesData);
    let _key = _keys.find(_item => {
        if (_item.toLowerCase() === `${dataName}_${dataGroup}_${dataType}`) return true;
        return false;
    })
    if (_key !== undefined) {
        let imgData = imagesData[_key];
        return "https://github.com/WillardvB/GGe4k-Bot/raw/master/ingame_images/" + imgData.url;
    }
    return "";
}