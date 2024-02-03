const {getLocalizations} = require("../../../../tools/localization");
const {getBuildingName, getBuildingDescription} = require("./utils");

const levelCountTranslations = getLocalizations(["generic", "levelcount"])
const buildingData = require("e4k-data").data.buildings;

/** @type {{"raw": string, "en-US": string, [p: string]: string}[]} */
const buildingNames = buildingData.map(t => {
    const _names = getBuildingName(t);
    if (_names.length === 0) return {"raw": ""};
    let localizations = getLocalizations(_names)
    localizations["raw"] = t.wodID.toString()
    for (let l in localizations) {
        if (Array.isArray(localizations[l])) localizations[l] = localizations[l][localizations[l].length - 1]
    }
    if (t.upgradeWodID != null || t.downgradeWodID != null || t.level >= 2) {
        for (let x in levelCountTranslations) {
            localizations[x] = `${localizations[x]} - ${levelCountTranslations[x].trim()} ${t.level}`
        }
    }
    return localizations
}).filter(b => b["raw"] !== "")
buildingNames.concat(buildingData.map(t => {
    return {"en-US": t.wodID.toString(), raw: t.wodID.toString()}
}))

/**
 *
 * @type {{"raw": string, "en-US": string, [p: string]: string}[]}
 */
const buildingDescriptions = buildingData.map(t => {
    const _descriptions = getBuildingDescription(t);
    if (_descriptions.length === 0) return null;
    let localizations = getLocalizations(_descriptions)
    localizations["raw"] = t.wodID.toString()
    for (let l in localizations) {
        if (Array.isArray(localizations[l])) localizations[l] = localizations[l][localizations[l].length - 1]
    }
    return localizations
}).filter(d => d != null)

module.exports.buildingNames = buildingNames;
module.exports.buildingDescriptions = buildingDescriptions;