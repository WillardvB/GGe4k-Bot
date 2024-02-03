const unitData = require("e4k-data").data.units;
const {languages: translations, imageBaseUrl, imageData} = require("e4k-data");
let _keys = Object.keys(imageData);

/**
 *
 * @param {Unit} data
 * @returns {[string, string]}
 */
module.exports.getUnitName = function (data) {
    const translationData = translations.en;
    let dataType = data.type.toString().toLowerCase();

    const translationSectors = Object.keys(translationData)
    for (let sector of translationSectors) {
        let _keys = Object.keys(translationData[sector])
        let _key = _keys.find(_item => {
            return unitNameFinder(_item, dataType);
        })
        if (_key !== undefined) return [sector, _key];
    }

    return [];
}

/**
 *
 * @param {Unit} data
 * @returns {[string, string]}
 */
module.exports.getUnitDescription = function (data) {
    const translationData = translations.en;
    let dataType = data.type.toString().toLowerCase();

    const translationSectors = Object.keys(translationData)
    for (let sector of translationSectors) {
        let _keys = Object.keys(translationData[sector])
        let _key = _keys.find(_item => {
            return unitDescriptionFinder(_item, dataType);
        })
        if (_key !== undefined) return [sector, _key];
    }

    return [];
}

/**
 *
 * @param {Unit} data
 * @returns {string}
 */
module.exports.getUnitImage = function (data) {
    return unitImageFinder(data)
}

/**
 *
 * @param {string} item
 * @param {string} type
 * @returns {boolean}
 */
function unitNameFinder(item, type) {
    let _item = item.toLowerCase();
    return _item === `${type}_name`;
}

/**
 *
 * @param {string} item
 * @param {string} type
 * @returns {boolean}
 */
function unitDescriptionFinder(item, type) {
    let _item = item.toLowerCase();
    return _item === `${type}_short_info`;
}

/**
 *
 * @param {Unit} data
 * @returns {string}
 */
function unitImageFinder(data) {
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
        _data = unitData.find(d => d.wodID === _data.downgradeWodID);
    }
    return "";
}