const {getLocalizations} = require("../../../../tools/localization");
const {getAchievementName, getAchievementDescription} = require("./utils");

const levelCountTranslations = getLocalizations(["generic", "levelcount"])
const achievementData = require("e4k-data").data.achievements;

/**
 *
 * @type {{"raw": string, "en-US": string, [p: string]: string}[]}
 */
const achievementNames = achievementData.map(t => {
    const _names = getAchievementName(t);
    if (_names.length === 0) return {"raw": ""};
    let localizations = getLocalizations(_names)
    localizations["raw"] = t.achievementID.toString()
    if (t.numberOfAchievementsInSeries !== 1) {
        for (let x in levelCountTranslations) {
            localizations[x] = `${localizations[x]} - ${levelCountTranslations[x].trim()} ${t.achievementSeriesNumber}`
        }
    }
    return localizations
}).filter(b => b["raw"] !== "")
achievementNames.concat(achievementData.map(t => {
    return {"en-US": t.achievementID.toString(), raw: t.achievementID.toString()}
}))

/** @type {{"raw": string, "en-US": string, [p: string]: string}[]} */
const achievementDescriptions = achievementData.map(t => {
    const _descriptions = getAchievementDescription(t);
    if (_descriptions.length === 0) return null;
    let localizations = getLocalizations(_descriptions)
    localizations["raw"] = t.achievementID.toString()
    return localizations
}).filter(d => d != null)

module.exports.achievementNames = achievementNames;
module.exports.achievementDescriptions = achievementDescriptions;