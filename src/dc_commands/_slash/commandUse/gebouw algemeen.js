const stringSimilarity = require("string-similarity");
const buildingData = require('./../../../ingame_data/buildings.json');
const translationData = require('./../../../ingame_translations/nl.json');
const imagesData = require('./../../../ingame_images/x768.json');
const formatNumber = require('./../../../tools/number.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Interaction, ButtonStyle } = require('discord.js');
const Logger = require("../../../tools/Logger.js");
const buildingTranslations = translationData.buildings_and_decorations;
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';

const _name = "gebouw algemeen";
module.exports = {
    name: _name,
    /**
     * 
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        try {
            let level;
            let gebouwnaam;
            if (interaction.options) {
                level = interaction.options.getInteger('level');
                gebouwnaam = interaction.options.getString('naam');
            }
            else if (interaction.customId) {
                var string = interaction.customId.split(' ');
                level = parseInt(string[2]);
                gebouwnaam = string[3];
                for (i = 4; i < string.length; i++) {
                    gebouwnaam += " " + string[i];
                }
            }
            gebouwnaam = gebouwnaam.trim().toLowerCase();
            let foundBuildingName = "<Not found>";
            let _mogelijkeGebouwnamen = [];
            if (foundBuildingName === "<Not found>") {
                for (let _intern_buildingName in buildingTranslations) {
                    if (_intern_buildingName.endsWith('_name') && buildingTranslations[_intern_buildingName].toLowerCase().trim() === gebouwnaam) {
                        foundBuildingName = _intern_buildingName;
                        break;
                    }
                    else if (_intern_buildingName.endsWith('_name') && !_intern_buildingName.startsWith('merchantItem_ci')) {
                        let _mogelijkGebouwNaam = buildingTranslations[_intern_buildingName];
                        if (!_mogelijkeGebouwnamen.includes(_mogelijkGebouwNaam) && _mogelijkGebouwNaam !== "village_name" && _mogelijkGebouwNaam !== "barrel_name" && _mogelijkeGebouwnamen !== "deco_thornskull_name")
                            _mogelijkeGebouwnamen.push(_mogelijkGebouwNaam);
                    }
                }
            }
            if (foundBuildingName === "<Not found>") {
                for (let _intern_dialog in translationData.dialogs) {
                    if (_intern_dialog.endsWith('_name') && translationData.dialogs[_intern_dialog].toLowerCase().trim() === gebouwnaam) {
                        foundBuildingName = _intern_dialog;
                        break;
                    }
                    else if (_intern_dialog.endsWith('_name') && (_intern_dialog.startsWith('deco_') || _intern_dialog === 'OfficersSchool_name' || _intern_dialog === 'TradeDistrict_name' || _intern_dialog === 'dialog_legendtemple_name')) {
                        let _mogelijkGebouwNaam = translationData.dialogs[_intern_dialog];
                        if (!_mogelijkeGebouwnamen.includes(_mogelijkGebouwNaam))
                            _mogelijkeGebouwnamen.push(_mogelijkGebouwNaam);
                    }
                }
            }
            if (foundBuildingName === "<Not found>") {
                for (let _intern_generic in translationData.generic) {
                    if (_intern_generic.endsWith('_name') && translationData.generic[_intern_generic].toLowerCase().trim() === gebouwnaam) {
                        foundBuildingName = _intern_generic;
                        break;
                    }
                    else if (_intern_generic.endsWith('_name') && (_intern_generic === 'MayaPalace_name' || _intern_generic === 'MilitaryDistrict_name')) {
                        let _mogelijkGebouwNaam = translationData.generic[_intern_generic];
                        if (!_mogelijkeGebouwnamen.includes(_mogelijkGebouwNaam))
                            _mogelijkeGebouwnamen.push(_mogelijkGebouwNaam);
                    }
                }
            }
            if (foundBuildingName === "<Not found>") {
                _mogelijkeGebouwnamen.sort();
                let matches = stringSimilarity.findBestMatch(gebouwnaam, _mogelijkeGebouwnamen).ratings;
                matches = matches.sort((a, b) => {
                    if (a.rating > b.rating) return -1;
                    if (a.rating < b.rating) return 1;
                    return 0;
                }).slice(0, 5);
                const _ActionRowBuilder = new ActionRowBuilder();
                for (let i = 0; i < matches.length; i++) {
                    _ActionRowBuilder.addComponents(
                        new ButtonBuilder().setCustomId(`${_name} ${level} ${matches[i].target}`)
                            .setLabel(matches[i].target).setStyle(ButtonStyle.Primary)
                    );
                }
                interaction.followUp({
                    embeds: [new EmbedBuilder().setDescription("Ik kan het gebouw met de opgegeven naam niet vinden!\n\nBedoelde je:")],
                    components: [_ActionRowBuilder]
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
        }
        catch (e) {
            Logger.logError(e);
        }
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

        let embed = new EmbedBuilder()
            .setColor('#996515')
            .setTimestamp()
            .setFooter({ text: footerTekst, iconURL: footerAfbeelding })
            .setTitle(title)
        if (image !== "") embed.setThumbnail(image);
        if (description !== "") embed.setDescription(description);

        let values = "";
        let constructionValues = "";
        let rewardValues = "";
        let storageValues = "";
        let productionValues = "";
        let protectionValues = "";
        let requirementsValues = "";
        let destructionValues = "";
        let sellValues = "";
        const _keys = Object.keys(data);
        for (let _i = 0; _i < _keys.length; _i++) {
            let _key = _keys[_i];
            let _keyLowCase = _key.toLowerCase();
            if (_keyLowCase === "name" || _keyLowCase === "level" || _keyLowCase === "type" || _keyLowCase === "group" ||
                _keyLowCase === "height" || (_keyLowCase.includes("cost") && _keyLowCase !== "buildingcostreduction") ||
                _keyLowCase === "rotatetype" || _keyLowCase === "foodratio" || _keyLowCase.endsWith("duration") ||
                _keyLowCase === "tempservertime" || _keyLowCase.startsWith("comment") || _keyLowCase === "shopcategory" ||
                _keyLowCase === "constructionitemgroupids" || _keyLowCase === "buildinggroundtype" ||
                _keyLowCase.endsWith("wodid") || _keyLowCase.endsWith("sortorder") || _keyLowCase === "effectlocked" ||
                _keyLowCase.startsWith("earlyunlock") || _keyLowCase === "eventIDs" || _keyLowCase === "slumlevelneeded" ||
                _keyLowCase === "requiredprivateoffer" || _keyLowCase === "canbeprimesaleoffer" ||
                _keyLowCase === "isdistrict" || _keyLowCase == "movable") continue;
            if (_keyLowCase.startsWith("tempserver")) _keyLowCase = _keyLowCase.replace("tempserver", `${translationData.dialogs.temp_server_name} `);
            /** @type string */
            let _value = data[_key];
            if (_keyLowCase === "width") {
                _value = `${data["width"]}x${data["height"]}`;
                constructionValues += `**${translationData.dialogs.gridSize}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "storeable") {
                _value = _value = data[_key] == "1" ? "Ja" : "Nee";
                constructionValues += `**Opslaanbaar**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase.startsWith("required")) {
                _keyLowCase = _keyLowCase.substring(8, 9) + _key.substring(9);
                requirementsValues += `**${translationData.generic[_keyLowCase]}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "sceatskilllocked") {
                _value = parseInt(_value) > 0 ? "Ja" : "Nee";
                requirementsValues += `**Zaal vaardigheid nodig**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase.startsWith("sell")) {
                if (_key.length === 6) _key = _key.replace("sellC", "sellcurrency");
                sellValues += `**${translationData.dialogs[`currency_name_${_key.substring(4)}`]}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "kids") {
                let _valueArray = _value.split(',');
                _value = "";
                for (let i = 0; i < _valueArray.length; i++) {
                    if (i > 0) _value += ", ";
                    switch (_valueArray[i].trim()) {
                        case "0": _value += translationData.generic.kingdomName_Classic; break;
                        case "1": _value += translationData.generic.kingdomName_Dessert; break;
                        case "2": _value += translationData.generic.kingdomName_Icecream; break;
                        case "3": _value += translationData.generic.kingdomName_Volcano; break;
                        case "4": _value += translationData.generic.kingdomName_Island; break;
                        case "10": _value += translationData.generic.kingdomName_Faction; break;
                        //case "ehm": _value += translationData.generic.kingdomName_Classic_Maya; break;
                        default: _value += "-";
                    }
                }
                constructionValues += `**Toegestane koninkrijken**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "onlyinareatypes") {
                let _valueArray = _value.split(',');
                _value = "";
                for (let i = 0; i < _valueArray.length; i++) {
                    if (i > 0) _value += ", ";
                    switch (_valueArray[i].trim()) {
                        case "1": _value += "Hoofdkasteel"; break;
                        case "3": _value += translationData.generic.capital; break;
                        case "4": _value += translationData.generic.outpost; break;
                        case "12": _value += translationData.generic.kingdomCastle_name; break;
                        case "22": _value += translationData.generic.metropol; break;
                        case "23": _value += translationData.generic.kingstower; break;
                        case "26": _value += translationData.generic.monument; break;
                        default: _value += _valueArray[i].trim();
                    }
                }
                constructionValues += `**Toegestane kastelen**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "mightvalue") {
                _keyLowCase = translationData.dialogs.mightPoints;
                rewardValues += `**${_keyLowCase}**: ${formatNumber.formatNum(_value)}\n`;
                continue;
            }
            if (_keyLowCase === "xp") {
                _keyLowCase = translationData.generic.xp;
                rewardValues += `**${_keyLowCase}**: ${formatNumber.formatNum(_value)}\n`;
                continue;
            }
            if (_keyLowCase === "moral") {
                _keyLowCase = translationData.generic.morality;
                rewardValues += `**${_keyLowCase}**: ${formatNumber.formatNum(_value)}\n`;
                continue;
            }
            if (_keyLowCase === "buildspeedboost") {
                _keyLowCase = "Bouwsnelheid";
                _value = `+${_value}%`;
                rewardValues += `**${_keyLowCase}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "kingdomfameboost") {
                _keyLowCase = translationData.dialogs.dialog_fame_title;
                _value = `+${_value}%`;
                rewardValues += `**${_keyLowCase}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "decopoints") {
                _keyLowCase = translationData.generic.publicOrder;
                rewardValues += `**${_keyLowCase}**: ${formatNumber.formatNum(_value)}\n`;
                continue;
            }
            if (_keyLowCase === "hunterratio") {
                _value = `${data[_key] / 100} ${translationData.generic.goods} geeft 1 ${translationData.generic.food}`;
                _keyLowCase = translationData.dialogs.dialog_hunter_exchangeRate;
                rewardValues += `**${_keyLowCase}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "honeyratio") {
                _value = `${data[_key]} ${translationData.generic.honey} en ${data["foodRatio"]} ${translationData.generic.food} geven samen 1 ${translationData.generic.mead}`;
                _keyLowCase = translationData.dialogs.dialog_hunter_exchangeRate;
                rewardValues += `**${_keyLowCase}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "unitwallcount") {
                _keyLowCase = translationData.dialogs.ci_effect_unitWallCount_tt.substring(0, translationData.dialogs.ci_effect_unitWallCount_tt.length - 1);
                _value = `+${_value}`;
                rewardValues += `**${_keyLowCase}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "skillpoints") {
                _keyLowCase = translationData.dialogs.dialog_legendTemple_SkillPointPlural;
                rewardValues += `**${_keyLowCase}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase.endsWith("storage")) {
                storageValues += `**${translationData.generic[_keyLowCase.substring(0, _keyLowCase.length - 7)]}**: ${formatNumber.formatNum(data[_key])}\n`;
                continue;
            }
            if (_keyLowCase.endsWith("boost")) {
                productionValues += `**${translationData.generic[_keyLowCase.substring(0, _keyLowCase.length - 5)]} boost**: ${formatNumber.formatNum(data[_key])}%\n`;
                continue;
            }
            if (_keyLowCase === "hideout") {
                storageValues += `**Beveiligde opslag**: ${formatNumber.formatNum(data[_key])}\n`;
                continue;
            }
            if (_keyLowCase.endsWith("production")) {
                productionValues += `**${translationData.generic[_keyLowCase.substring(0, _keyLowCase.length - 10)]}**: ${formatNumber.formatNum(data[_key])}\n`;
                continue;
            }
            if (_keyLowCase === "allifoodproductionbonus") {
                productionValues += `**${translationData.generic.food}**: ${formatNumber.formatNum(data[_key])}\n`;
                continue;
            }
            if (_keyLowCase.startsWith("wall") || _keyLowCase.startsWith("gate") || _keyLowCase.startsWith("moat")) {
                protectionValues += `**${translationData.generic[_keyLowCase.substring(0, 4)]}**: +${formatNumber.formatNum(data[_key])}%\n`;
                continue;
            }
            if (_keyLowCase.endsWith("burnable") || _keyLowCase.endsWith("destructable") || _keyLowCase.endsWith("smashable")) {
                _value = data[_key] == "1" ? "Ja" : "Nee";
                if (_keyLowCase.endsWith("burnable")) _keyLowCase = _keyLowCase.replace("burnable", "brandbaar");
                else if (_keyLowCase.endsWith("destructable")) _keyLowCase = _keyLowCase.replace("destructable", "afbreekbaar");
                else if (_keyLowCase.endsWith("smashable")) _keyLowCase = _keyLowCase.replace("smashable", "verwoestbaar");
                _keyLowCase = _keyLowCase.substring(0, 1).toUpperCase() + _keyLowCase.substring(1);
                destructionValues += `**${_keyLowCase}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "maximumcount") {
                _keyLowCase = "Maximum aantal";
            }
            if (_keyLowCase === "districttypeid") {
                _keyLowCase = "Kan in district";
                switch (_value) {
                    case "1": _value = translationData.generic.MilitaryDistrict_name; break;
                    case "3": _value = translationData.buildings_and_decorations.InnerDistrict_name; break;
                    case "4": _value = translationData.dialogs.TradeDistrict_name; break;
                    default: _value = "-";
                }
            }

            _keyLowCase = _keyLowCase.substring(0, 1).toUpperCase() + _keyLowCase.substring(1);
            if (_key.toLowerCase() !== _keyLowCase.toLowerCase()) _key = _keyLowCase;
            values += `**${_key}**: ${_value}\n`;
        }
        if (constructionValues !== "") {
            embed.addFields({
                name: `**Constructie**`,
                value: constructionValues.trim(),
                inline: true,
            })
        }
        if (requirementsValues !== "") {
            requirementsValues += `**${translationData.generic.costs}**: zie 'kosten knop' onderaan`;
            embed.addFields({ name: `**Benodigdheden**`, value: requirementsValues.trim(), inline: true });
        }
        if (rewardValues !== "") {
            embed.addFields({ name: `**Voordelen**`, value: rewardValues.trim(), inline: true });
        }
        if (storageValues !== "") {
            embed.addFields({ name: `**${translationData.buildings_and_decorations.storehouse_name}**`, value: storageValues.trim(), inline: true });
        }
        if (productionValues !== "") {
            embed.addFields({ name: `**${translationData.generic.produce}**`, value: productionValues.trim(), inline: true });
        }
        if (protectionValues !== "") {
            embed.addFields({ name: `**${translationData.generic.protection}**`, value: protectionValues.trim(), inline: true });
        }
        if (sellValues !== "") {
            embed.addFields({ name: `**${translationData.generic.sellPrice}**`, value: sellValues.trim(), inline: true });
        }
        if (destructionValues !== "") {
            embed.addFields({ name: `**Afbreekbaarheid**`, value: destructionValues.trim(), inline: true });
        }
        if (values.trim() !== "") {
            values = values.substring(0, 1000);
            embed.addFields({ name: "**Overige informatie**", value: values.trim(), inline: true });
        }

        let components = [];
        if (minLevel != maxLevel) {
            const _ActionRowBuilder = new ActionRowBuilder();
            if (level > minLevel) {
                _ActionRowBuilder.addComponents(
                    new ButtonBuilder()
                        .setLabel('lvl ' + (level * 1 - 1))
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`${_name} ${(level * 1 - 1)} ${gebouwNaam}`)
                )
            }
            if (level < maxLevel) {
                _ActionRowBuilder.addComponents(
                    new ButtonBuilder()
                        .setLabel('lvl ' + (level * 1 + 1))
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`${_name} ${(level * 1 + 1)} ${gebouwNaam}`)
                )
            }
            components = [_ActionRowBuilder];
            const _ActionRowBuilder2 = new ActionRowBuilder();
            _ActionRowBuilder2.addComponents(
                new ButtonBuilder()
                    .setLabel(translationData.generic.costs)
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`gebouw kosten ${level} ${gebouwNaam}`)
            );
            components.push(_ActionRowBuilder2);
        }
        if (interaction.options) {
            interaction.followUp({ embeds: [embed], components: components });
        }
        else {
            interaction.editReply({ embeds: [embed], components: components });
        }
        return;
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
            if (_item.toLowerCase() === `${dataGroup}_name`) return true;
            return false;
        })
        if (_key !== undefined) {
            return buildingTranslations[_key];
        }
        else {
            if (_key === undefined) {
                _keys = Object.keys(translationData.generic);
                _key = _keys.find(_item => {
                    if (_item.toLowerCase() === `${dataName}_name`) return true;
                    if (_item.toLowerCase() === `${dataName}_${dataType}_name`) return true;
                    if (_item.toLowerCase() === `${dataName}_${dataGroup}_name`) return true;
                    if (_item.toLowerCase() === `${dataGroup}_name`) return true;
                    return false;
                })
            }
        }
        if (_key !== undefined) {
            return translationData.generic[_key];
        }
        else {
            if (_key === undefined) {
                _keys = Object.keys(translationData.dialogs);
                _key = _keys.find(_item => {
                    if (_item.toLowerCase() === `${dataName}_name`) return true;
                    if (_item.toLowerCase() === `${dataName}_${dataType}_name`) return true;
                    if (_item.toLowerCase() === `${dataName}_${dataGroup}_name`) return true;
                    if (_item.toLowerCase() === `${dataGroup}_name`) return true;
                    if (_item.toLowerCase() === `dialog_${dataName}_name`) return true;
                    return false;
                })
            }
        }
        if (_key !== undefined) {
            return translationData.dialogs[_key];
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
        else {
            _keys = Object.keys(translationData.generic);
            _key = _keys.find(_item => {
                if (_item.toLowerCase() === `${dataName}_short_info`) return true;
                if (_item.toLowerCase() === `${dataName}_${dataType}_short_info`) return true;
                if (_item.toLowerCase() === `${dataName}_${dataGroup}_short_info`) return true;
                if (_item.toLowerCase() === `${dataGroup}_short_info`) return true;
                return false;
            })
        }
        if (_key !== undefined) {
            return translationData.generic[_key];
        }
        else {
            _keys = Object.keys(translationData.dialogs);
            _key = _keys.find(_item => {
                if (_item.toLowerCase() === `${dataName}_short_info`) return true;
                if (_item.toLowerCase() === `${dataName}_${dataType}_short_info`) return true;
                if (_item.toLowerCase() === `${dataName}_${dataGroup}_short_info`) return true;
                if (_item.toLowerCase() === `${dataGroup}_short_info`) return true;
                if (_item.toLowerCase() === `dialog_${dataName}_short_info`) return true;
                return false;
            })
        }
        if (_key !== undefined) {
            return translationData.dialogs[_key];
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
            else if (_dataGroup === buildingNameParts[0]) {
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
            else if (_dataGroup === buildingNameParts[0]) {
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
        if (_item.toLowerCase() === `${dataName}_${dataGroup}_${dataType}_full`) return true;
        return false;
    })
    if (_key !== undefined) {
        let imgData = imagesData[_key];
        return "https://github.com/WillardvB/GGe4k-Bot/raw/master/ingame_images/" + imgData.url;
    }
    return "";
}