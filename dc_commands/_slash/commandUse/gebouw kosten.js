const stringSimilarity = require("string-similarity");
const buildingData = require('./../../../ingame_data/buildings.json');
const translationData = require('./../../../ingame_translations/nl.json');
const imagesData = require('./../../../ingame_images/x768.json');
const formatNumber = require('./../../../tools/number.js');
const formatDuration = require('./../../../tools/time.js');
const { MessageEmbed, MessageActionRow, MessageButton, Interaction } = require('discord.js');
const Logger = require('../../../tools/Logger.js');
const buildingTranslations = translationData.buildings_and_decorations;
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';

const _name = "gebouw kosten";
module.exports = {
    name: _name,
    /**
     * 
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        try {
            let level = 0;
            let gebouwnaam;
            if (interaction.options) {
                level = interaction.options.getInteger('level');
                if (level === null) level = 0;
                gebouwnaam = interaction.options.getString('naam');
            }
            else if (interaction.customId) {
                var string = interaction.customId.split(' ');
                level = parseInt(string[2]);
                Logger.log(level);
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
            if (level !== 0) {
                level = Math.min(Math.max(level, minLevel), maxLevel);
            }
            let data = getBuildingLevelData(buildingNameParts, level);
            if (data === null) return;
            naarOutput(interaction, data, minLevel, maxLevel);
        }
        catch (e) {
            Logger.logError(e);
        }
    },
};

function naarOutput(interaction, data, minLevel, maxLevel) {
    try {
        let level = data.level;
        Logger.log(`level: ${level}`);
        let gebouwNaam = getBuildingName(data);
        let description = getBuildingDescription(data);
        let title = `**${gebouwNaam}**${minLevel === maxLevel ? "" : level == 0 ? " (totaal alle levels)" : ` (level ${level})`}`;
        let image = getBuildingImage(data);

        let embed = new MessageEmbed()
            .setColor('#996515')
            .setTimestamp()
            .setFooter(footerTekst, footerAfbeelding)
            .setTitle(title)
        if (image !== "") embed.setThumbnail(image);
        if (description !== "") embed.setDescription(description);

        let normalCostValues = "";
        let tmpServerCostValues = "";
        const _keys = Object.keys(data);
        for (let _i = 0; _i < _keys.length; _i++) {
            let _key = _keys[_i];
            let _keyLowCase = _key.toLowerCase();
            /** @type string */
            let _value = data[_key];
            if (_keyLowCase.startsWith("cost")) {
                let _tmpKey = translationData.generic[_keyLowCase.substring(4)];
                if (_tmpKey === null || _tmpKey === undefined || _tmpKey === NaN) {
                    if (_key.length === 6) _key = _key.replace("costC", "costcurrency");
                    _tmpKey = translationData.dialogs[`currency_name_${_key.substring(4)}`];
                    if (_tmpKey === null || _tmpKey === undefined || _tmpKey === NaN) {
                        _tmpKey = translationData.generic[`currency_name_${_key.substring(4)}`];
                    }
                }
                normalCostValues += `**${_tmpKey}**: ${formatNumber.formatNum(_value)}\n`;
                continue;
            }
            if (_keyLowCase.endsWith("duration")) {
                if (_keyLowCase === "buildduration") {
                    normalCostValues += `**Tijd**: ${formatDuration.secToDuration(_value)}\n`;
                }
                continue;
            }
            if (_keyLowCase.startsWith("tempserver")) {
                _key = _key.substring(10);
                _keyLowCase = _key.toLowerCase();
                if (_keyLowCase.startsWith("cost")) {
                    let _tmpKey = translationData.generic[_keyLowCase.substring(4)];
                    if (_tmpKey === null || _tmpKey === undefined || _tmpKey === NaN) {
                        if (_key.length === 6) _key = _key.replace("costC", "costcurrency");
                        _tmpKey = translationData.dialogs[`currency_name_${_key.substring(4)}`];
                        if (_tmpKey === null || _tmpKey === undefined || _tmpKey === NaN) {
                            _tmpKey = translationData.generic[`currency_name_${_key.substring(4)}`];
                        }
                    }
                    normalCostValues += `**${_tmpKey}**: ${formatNumber.formatNum(_value)}\n`;
                    continue;
                }
                if (_keyLowCase === "time") {
                    tmpServerCostValues += `**Tijd**: ${formatDuration.secToDuration(_value)}\n`;
                    continue;
                }
            }
        }
        if (normalCostValues !== "") {
            embed.addField(`**${translationData.generic.costs}**`, normalCostValues.trim(), true);
        } else {
            embed.addField(`**${translationData.generic.costs}**`, "Geen", true);
        }
        if (tmpServerCostValues !== "") {
            embed.addField("_" + translationData.dialogs.temp_server_name + " " + translationData.generic.costs.toLowerCase() + "_", tmpServerCostValues.trim(), true);
        }
        let components = [];
        const messRow = new MessageActionRow();
        if (level !== 0 && minLevel !== maxLevel) {
            if (level > minLevel && level <= maxLevel) {
                messRow.addComponents(
                    new MessageButton()
                        .setLabel('lvl ' + (level * 1 - 1))
                        .setStyle('PRIMARY')
                        .setCustomId(`${_name} ${(level * 1 - 1)} ${gebouwNaam}`)
                )
            }
            if (level < maxLevel && level >= minLevel) {
                messRow.addComponents(
                    new MessageButton()
                        .setLabel('lvl ' + (level * 1 + 1))
                        .setStyle('PRIMARY')
                        .setCustomId(`${_name} ${(level * 1 + 1)} ${gebouwNaam}`)
                )
            }
            messRow.addComponents(
                new MessageButton()
                    .setLabel('Totaal alle levels')
                    .setStyle('PRIMARY')
                    .setCustomId(`${_name} 0 ${gebouwNaam}`)
            )
            components = [messRow];
        }
        else if (minLevel !== maxLevel) {
            messRow.addComponents(
                new MessageButton()
                    .setLabel('lvl ' + minLevel)
                    .setStyle('PRIMARY')
                    .setCustomId(`${_name} ${minLevel} ${gebouwNaam}`)
            )
            messRow.addComponents(
                new MessageButton()
                    .setLabel('lvl ' + maxLevel)
                    .setStyle('PRIMARY')
                    .setCustomId(`${_name} ${maxLevel} ${gebouwNaam}`)
            )
            components = [messRow];
        }
        if (interaction.options) {
            interaction.followUp({ embeds: [embed], components: components });
        }
        else {
            interaction.editReply({ embeds: [embed], components: components });
        }
        return;
    }
    catch (e) {
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
                Logger.log(`_data.level: ${_data.level}`);
                if (level === 0) data = sumDataCostObjects(data, _data);
                else if (_dataLevel === level) { data = _data; break; }
            }
            else if (_dataGroup === buildingNameParts[0]) {
                if (level === 0) data = sumDataCostObjects(data, _data);
                else if (_dataLevel === level) { data = _data; break; }
            }
        }
        else if (buildingNameParts.length == 2) {
            if (_dataName === buildingNameParts[0] &&
                _dataType === buildingNameParts[1]) {
                if (level === 0) data = sumDataCostObjects(data, _data);
                else if (_dataLevel === level) { data = _data; break; }
            }
            else if (_dataName === buildingNameParts[0] &&
                _dataGroup === buildingNameParts[1]) {
                if (level === 0) data = sumDataCostObjects(data, _data);
                else if (_dataLevel === level) { data = _data; break; }
            }
        }
    }
    if (level === 0) data.level = 0;
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

/**
 * 
 * @param {object} dataOutput
 * @param {object} dataInput
 */
function sumDataCostObjects(dataOutput, dataInput) {
    try {
        if (dataOutput === null) return dataInput;
        const _keys = Object.keys(dataInput);
        for (let _i = 0; _i < _keys.length; _i++) {
            let _key = _keys[_i];
            let _keyLowCase = _key.toLowerCase();
            if (_keyLowCase.startsWith("cost")) {
                if (dataOutput[_key] === undefined) dataOutput[_key] = dataInput[_key];
                else dataOutput[_key] = (parseInt(dataOutput[_key]) + parseInt(dataInput[_key])).toString()
                continue;
            }
            if (_keyLowCase.endsWith("duration")) {
                if (_keyLowCase === "buildduration") {
                    if (dataOutput[_key] === undefined) dataOutput[_key] = dataInput[_key];
                    else dataOutput[_key] = (parseInt(dataOutput[_key]) + parseInt(dataInput[_key])).toString()
                    continue;
                }
            }
            if (_keyLowCase.startsWith("tempserver")) {
                _keyLowCase = _key.substring(10).toLowerCase();
                if (_keyLowCase.startsWith("cost") || _keyLowCase === "time") {
                    if (dataOutput[_key] === undefined) dataOutput[_key] = dataInput[_key];
                    else dataOutput[_key] = (parseInt(dataOutput[_key]) + parseInt(dataInput[_key])).toString()
                    continue;
                }
            }
        }
        if (dataInput.level * 1 >= dataOutput.level * 1) {
            dataOutput.name = dataInput.name;
            dataOutput.type = dataInput.type;
            dataOutput.group = dataInput.group;
        }
        return dataOutput;
    }
    catch (e) {
        Logger.logError(e);
    }
}