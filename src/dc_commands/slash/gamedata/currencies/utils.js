const {languages: translations, imageBaseUrl, imageData} = require("e4k-data");
let _keys = Object.keys(imageData);

/**
 *
 * @param {Currency} data
 * @returns {[string, string]}
 */
module.exports.getCurrencyName = function (data) {
    const translationData = translations.en;
    const currencyName = data.Name.toLowerCase();

    const translationSectors = Object.keys(translationData)
    for (let sector of translationSectors) {
        let _keys = Object.keys(translationData[sector])
        let _key = _keys.find(_item => {
            return currencyNameFinder(_item, currencyName);
        })
        if (_key !== undefined) return [sector, _key];
    }

    return [];
}

/**
 *
 * @param {Currency} data
 * @returns {[string, string]}
 */
module.exports.getCurrencyDescription = function (data) {
    const translationData = translations.en;
    const currencyName = data.Name.toLowerCase();

    const translationSectors = Object.keys(translationData)
    for (let sector of translationSectors) {
        let _keys = Object.keys(translationData[sector])
        let _key = _keys.find(_item => {
            return currencyDescriptionFinder(_item, currencyName);
        })
        if (_key !== undefined) return [sector, _key];
    }

    return [];
}

/**
 *
 * @param {Currency} data
 * @returns {string}
 */
module.exports.getCurrencyImage = function (data) {
    return currencyImageFinder(data)
}

/**
 *
 * @param {string} item
 * @param {string} name
 * @returns {boolean}
 */
function currencyNameFinder(item, name) {
    return item.toLowerCase() === `currency_name_${name}`;
}

/**
 *
 * @param {string} item
 * @param {string} name
 * @returns {boolean}
 */
function currencyDescriptionFinder(item, name) {
    return item.toLowerCase() === `currency_description_${name}`;
}

/**
 *
 * @param {Currency} data
 * @returns {string}
 */
function currencyImageFinder(data) {
    const currencyName = data.Name.toLowerCase();
    let _key = _keys.find(_item => {
        return _item.toLowerCase() === `icon_currency_${currencyName}`;
    })
    let imgData = imageData[_key];
    if (imgData == null) return "";
    return imageBaseUrl + imgData.url;
}