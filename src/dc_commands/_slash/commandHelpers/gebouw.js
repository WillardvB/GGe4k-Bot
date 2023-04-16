const e4kData = require('e4k-data');
const imagesData = e4kData.imageData;
const translationData = e4kData.languages.nl;
const buildingData = e4kData.data.buildings;
const stringSimilarity = require("string-similarity");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require("discord.js");
const buildingTranslations = translationData.buildings_and_decorations;

module.exports = {
    getRawData: getBuildingRawData,
    getName: getBuildingName,
    getDescription: getBuildingDescription,
    getImage: getBuildingImage,
    getSuggestions: getBuildingSuggestions,
}

/**
 *
 * @param {string[]} buildingNameParts
 * @param {number} level
 * @returns {{data:(object | object[]), minLevel: number, maxLevel: number}}
 */
function getBuildingRawData(buildingNameParts, level) {
    let data = null;
    let minLevel = 1000;
    let maxLevel = -1;
    /** @type {Building[]} */
    let correctBuildingData = [];
    for (let _building in buildingData) {
        let _data = buildingData[_building];
        let _dataName = _data.name.toLowerCase();
        let _dataType = typeof _data.type === "number" ? _data.type.toString() : _data.type.toLowerCase();
        let _dataGroup = _data.group.toLowerCase();
        let _dataLevel = _data.level;
        if (buildingNameParts.length === 1) {
            if (_dataName === buildingNameParts[0]) {
                correctBuildingData.push(_data);
                if (_dataLevel < minLevel) minLevel = _dataLevel;
                if (_dataLevel > maxLevel) maxLevel = _dataLevel;
                if (_dataLevel === level) data = _data;
            } else if (_dataGroup === buildingNameParts[0]) {
                correctBuildingData.push(_data);
                if (_dataLevel < minLevel) minLevel = _dataLevel;
                if (_dataLevel > maxLevel) maxLevel = _dataLevel;
                if (_dataLevel === level) data = _data;
            }
        } else if (buildingNameParts.length === 2) {
            if (_dataName === buildingNameParts[0] && _dataType === buildingNameParts[1]) {
                correctBuildingData.push(_data);
                if (_dataLevel < minLevel) minLevel = _dataLevel;
                if (_dataLevel > maxLevel) maxLevel = _dataLevel;
                if (_dataLevel === level) data = _data;
            } else if (_dataName === buildingNameParts[0] && _dataGroup === buildingNameParts[1]) {
                correctBuildingData.push(_data);
                if (_dataLevel < minLevel) minLevel = _dataLevel;
                if (_dataLevel > maxLevel) maxLevel = _dataLevel;
                if (_dataLevel === level) data = _data;
            }
        }
    }
    if (data === null && correctBuildingData.length !== 0) {
        if (level === 0) {
            data = correctBuildingData;
            data["level"] = 0;
        } else {
            level = Math.max(Math.min(level, maxLevel), minLevel);
            data = correctBuildingData.find(x => x.level === level);
        }
    }
    return {data, minLevel, maxLevel};
}

/**
 *
 * @param {Building} data
 * @returns {string}
 */
function getBuildingName(data) {
    let dataName = data.name.toLowerCase();
    let dataType = data.type.toLowerCase();
    let dataGroup = data.group.toLowerCase();
    let _keys = Object.keys(buildingTranslations);
    let _key = _keys.find(_item => {
        return buildingNameFinder(_item, dataName, dataType, dataGroup);
    })
    if (_key !== undefined) return buildingTranslations[_key];
    _keys = Object.keys(translationData.generic);
    _key = _keys.find(_item => {
        return buildingNameFinder(_item, dataName, dataType, dataGroup);
    })
    if (_key !== undefined) return translationData.generic[_key];
    _keys = Object.keys(translationData.dialogs);
    _key = _keys.find(_item => {
        return buildingNameFinder(_item, dataName, dataType, dataGroup);
    })

    if (_key !== undefined) return translationData.dialogs[_key];
    return data.name;
}

/**
 *
 * @param {string} item
 * @param {string} name
 * @param {string} type
 * @param {string} group
 * @returns {boolean}
 */
function buildingNameFinder(item, name, type, group) {
    let _item = item.toLowerCase();
    if (_item === `${name}_name`) return true;
    if (_item === `${name}_${type}_name`) return true;
    if (_item === `${name}_${group}_name`) return true;
    if (_item === `${group}_name`) return true;
    return _item === `dialog_${name}_name`;
}

/**
 *
 * @param {Building} data
 * @returns {string}
 */
function getBuildingDescription(data) {
    let dataName = data.name.toLowerCase();
    let dataType = data.type.toLowerCase();
    let dataGroup = data.group.toLowerCase();
    let _keys = Object.keys(buildingTranslations);
    let _key = _keys.find(_item => {
        return buildingDescriptionFinder(_item, dataName, dataType, dataGroup);
    })
    if (_key !== undefined) {
        return buildingTranslations[_key];
    } else {
        _keys = Object.keys(translationData.generic);
        _key = _keys.find(_item => {
            return buildingDescriptionFinder(_item, dataName, dataType, dataGroup);
        })
    }
    if (_key !== undefined) {
        return translationData.generic[_key];
    } else {
        _keys = Object.keys(translationData.dialogs);
        _key = _keys.find(_item => {
            return buildingDescriptionFinder(_item, dataName, dataType, dataGroup);
        })
    }
    if (_key !== undefined) {
        return translationData.dialogs[_key];
    }
    return "";
}

/**
 *
 * @param {string} item
 * @param {string} name
 * @param {string} type
 * @param {string} group
 * @returns {boolean}
 */
function buildingDescriptionFinder(item, name, type, group) {
    let _item = item.toLowerCase();
    if (_item === `${name}_short_info`) return true;
    if (_item === `${name}_${type}_short_info`) return true;
    if (_item === `${name}_${group}_short_info`) return true;
    if (_item === `${group}_short_info`) return true;
    return _item === `dialog_${name}_short_info`;
}

/**
 *
 * @param {Building} data
 * @returns {string}
 */
function getBuildingImage(data) {
    let dataName = data.name.toLowerCase();
    let dataType = data.type.toLowerCase();
    let dataGroup = data.group.toLowerCase();

    let _keys = Object.keys(imagesData);
    let _key = _keys.find(_item => {
        if (_item.toLowerCase() === `${dataName}_${dataGroup}_${dataType}`) return true;
        return _item.toLowerCase() === `${dataName}_${dataGroup}_${dataType}_full`;
    })
    if (_key !== undefined) {
        let imgData = imagesData[_key];
        return e4kData.imageBaseUrl + imgData.url;
    }
    return "";
}

/**
 *
 * @param {string} buildingName
 * @param {CommandInteraction | ButtonInteraction} interaction
 * @param {string} commandName
 * @param {number} buildingLevel
 * @returns {Promise<string>}
 */
async function getBuildingSuggestions(buildingName, interaction, commandName, buildingLevel) {
    buildingName = buildingName.trim().toLowerCase();
    let foundBuildingName = "<Not found>";
    /** @type {string[]} */
    let buildingNameSuggestions = [];
    for (let _intern_buildingName in buildingTranslations) {
        if (_intern_buildingName.endsWith('_name') && buildingTranslations[_intern_buildingName].toLowerCase().trim() === buildingName) {
            foundBuildingName = _intern_buildingName;
            break;
        } else if (_intern_buildingName.endsWith('_name') && !_intern_buildingName.startsWith('merchantItem_ci')) {
            let possibleBuildingName = buildingTranslations[_intern_buildingName];
            if (!buildingNameSuggestions.includes(possibleBuildingName) && possibleBuildingName !== "village_name" && possibleBuildingName !== "barrel_name" && possibleBuildingName !== "deco_thornskull_name")
                buildingNameSuggestions.push(possibleBuildingName);
        }
    }
    if (foundBuildingName === "<Not found>") {
        for (let _intern_dialog in translationData.dialogs) {
            if (_intern_dialog.endsWith('_name') && translationData.dialogs[_intern_dialog].toLowerCase().trim() === buildingName) {
                foundBuildingName = _intern_dialog;
                break;
            } else if (_intern_dialog.endsWith('_name') && (_intern_dialog.startsWith('deco_') || _intern_dialog === 'OfficersSchool_name' || _intern_dialog === 'TradeDistrict_name' || _intern_dialog === 'dialog_legendtemple_name')) {
                let possibleBuildingName = translationData.dialogs[_intern_dialog];
                if (!buildingNameSuggestions.includes(possibleBuildingName))
                    buildingNameSuggestions.push(possibleBuildingName);
            }
        }
    }
    if (foundBuildingName === "<Not found>") {
        for (let _intern_generic in translationData.generic) {
            if (_intern_generic.endsWith('_name') && translationData.generic[_intern_generic].toLowerCase().trim() === buildingName) {
                foundBuildingName = _intern_generic;
                break;
            } else if (_intern_generic.endsWith('_name') && (_intern_generic === 'MayaPalace_name' || _intern_generic === 'MilitaryDistrict_name')) {
                let possibleBuildingName = translationData.generic[_intern_generic];
                if (!buildingNameSuggestions.includes(possibleBuildingName))
                    buildingNameSuggestions.push(possibleBuildingName);
            }
        }
    }
    if (foundBuildingName === "<Not found>") {
        buildingNameSuggestions.sort();
        let matches = stringSimilarity.findBestMatch(buildingName, buildingNameSuggestions).ratings;
        matches = matches.sort((a, b) => {
            return b.rating - a.rating;
        }).slice(0, 5);
        buildingNameSuggestions = [];
        for (let i in matches) {
            buildingNameSuggestions.push(matches[i].target);
        }
        const messRow = new ActionRowBuilder();
        for (let i = 0; i < buildingNameSuggestions.length; i++) {
            messRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`${commandName} ${buildingLevel} ${buildingNameSuggestions[i]}`)
                    .setLabel(buildingNameSuggestions[i])
                    .setStyle(ButtonStyle.Primary)
            );
        }
        await interaction.followUp({
            content: "",
            embeds: [new EmbedBuilder().setDescription("Ik kan het gebouw met de opgegeven naam niet vinden!\n\nBedoelde je:")],
            components: [messRow]
        });
    } else {
        foundBuildingName = foundBuildingName.split('_name')[0].toLowerCase();
        if (foundBuildingName.startsWith('dialog_')) foundBuildingName = foundBuildingName.substring(7);
    }
    return foundBuildingName;
}