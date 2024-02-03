const buildingData = require("e4k-data").data.buildings;
const {languages: translations, imageBaseUrl, imageData} = require("e4k-data");
let _keys = Object.keys(imageData);

/**
 *
 * @param {Building} data
 * @returns {[string, string]}
 */
module.exports.getBuildingName = function (data) {
    const translationData = translations.en;
    let dataName = data.name.toLowerCase();
    let dataType = data.type.toString().toLowerCase();
    let dataGroup = data.group.toLowerCase();

    const translationSectors = Object.keys(translationData)
    for (let sector of translationSectors) {
        let _keys = Object.keys(translationData[sector])
        let _key = _keys.find(_item => {
            return buildingNameFinder(_item, dataName, dataType, dataGroup);
        })
        if (_key !== undefined) return [sector, _key];
    }

    return [];
}

/**
 *
 * @param {Building} data
 * @returns {[string, string]}
 */
module.exports.getBuildingDescription = function (data) {
    const translationData = translations.en;
    let dataName = data.name.toLowerCase();
    let dataType = data.type.toString().toLowerCase();
    let dataGroup = data.group.toLowerCase();

    const translationSectors = Object.keys(translationData)
    for (let sector of translationSectors) {
        let _keys = Object.keys(translationData[sector])
        let _key = _keys.find(_item => {
            return buildingDescriptionFinder(_item, dataName, dataType, dataGroup);
        })
        if (_key !== undefined) return [sector, _key];
    }

    return [];
}

/**
 *
 * @param {Building} data
 * @returns {string}
 */
module.exports.getBuildingImage = function (data) {
    return buildingImageFinder(data)
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
    if (_item === `dialog_${name}_short_info`) return true;
    return _item === `dialog_${name}_shortinfo`;
}

/**
 *
 * @param {Building} data
 * @returns {string}
 */
function buildingImageFinder(data) {
    let _data = data;
    while (_data.downgradeWodID != null) {
        const dataName = _data.name.toLowerCase();
        const dataType = _data.type.toLowerCase();
        const dataGroup = _data.group.toLowerCase();
        let _key = _keys.find(_item => {
            if (_item.toLowerCase() === `${dataName}_${dataGroup}_${dataType}`) return true;
            return _item.toLowerCase() === `${dataName}_${dataGroup}_${dataType}_full`;
        })
        if (_key !== undefined) {
            let imgData = imageData[_key];
            return imageBaseUrl + imgData.url;
        }
        _data = buildingData.find(d => d.wodID === _data.downgradeWodID);
    }
    return "";
}