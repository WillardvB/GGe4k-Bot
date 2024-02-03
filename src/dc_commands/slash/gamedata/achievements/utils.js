const {languages: translations, imageBaseUrl, imageData} = require("e4k-data");

/**
 *
 * @param {Achievement} data
 * @returns {[string, string]}
 */
module.exports.getAchievementName = function (data) {
    const translationData = translations.en;
    let seriesID = data.achievementSeriesID;

    const translationSectors = Object.keys(translationData)
    for (let sector of translationSectors) {
        let _keys = Object.keys(translationData[sector])
        let _key = _keys.find(_item => {
            return achievementNameFinder(_item, seriesID);
        })
        if (_key !== undefined) return [sector, _key];
    }

    return [];
}

/**
 *
 * @param {Achievement} data
 * @returns {[string, string]}
 */
module.exports.getAchievementDescription = function (data) {
    const translationData = translations.en;
    let id = data.achievementID;
    let seriesID = data.achievementSeriesID;
    let stepId = data.achievementSeriesNumber;

    const translationSectors = Object.keys(translationData)
    for (let sector of translationSectors) {
        let _keys = Object.keys(translationData[sector])
        let _key = _keys.find(_item => {
            return achievementDescriptionFinder(_item, id, seriesID);
        })
        if (_key !== undefined) return [sector, _key];
    }

    return [];
}

/**
 *
 * @param {Achievement} data
 * @returns {string}
 */
module.exports.getAchievementImage = function (data) {
    return achievementImageFinder(data)
}

/**
 *
 * @param {string} item
 * @param {number} seriesId
 * @returns {boolean}
 */
function achievementNameFinder(item, seriesId) {
    return item === `achievementName_${seriesId}`;
}

/**
 *
 * @param {string} item
 * @param {number} id
 * @param {number} seriesId
 * @returns {boolean}
 */
function achievementDescriptionFinder(item, id, seriesId) {
    if(item === `achievementDesc_${seriesId}`) return true;
    return item === `achievementSeries_desc_${seriesId}_short`;
}

/**
 *
 * @param {Achievement} data
 * @returns {string}
 */
function achievementImageFinder(data) {
    let seriesId = data.achievementSeriesID;
    let imgData = imageData[`icon_achievement_${seriesId}`];
    if (imgData == null) return "";
    return imageBaseUrl + imgData.url;
}