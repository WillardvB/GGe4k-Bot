const {languages: translations} = require("e4k-data");

/**
 *
 * @param {Title} data
 * @returns {[string, string]}
 */
module.exports.getTitleName = function (data) {
    const translationData = translations.en;
    const titleId = data.titleID;

    const translationSectors = Object.keys(translationData)
    for (let sector of translationSectors) {
        let _keys = Object.keys(translationData[sector])
        let _key = _keys.find(_item => {
            return currencyNameFinder(_item, titleId);
        })
        if (_key !== undefined) return [sector, _key];
    }

    return [];
}

/**
 *
 * @param {string} item
 * @param {number} titleId
 * @returns {boolean}
 */
function currencyNameFinder(item, titleId) {
    return item === `playerTitle_${titleId}`;
}