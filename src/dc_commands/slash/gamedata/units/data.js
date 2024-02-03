const {getLocalizations} = require("../../../../tools/localization");
const {getUnitName, getUnitDescription} = require("./utils");

const levelCountTranslations = getLocalizations(["generic", "levelcount"])
const unitData = require("e4k-data").data.units;

/**
 *
 * @type {{"raw": string, "en-US": string, [p: string]: string}[]}
 */
const unitNames = unitData.map(t => {
    const _names = getUnitName(t);
    if (_names.length === 0) return {"raw": ""};
    let localizations = getLocalizations(_names)
    localizations["raw"] = t.wodID.toString()
    if (t.upgradeWodID != null || t.downgradeWodID != null || t.level >= 2) {
        for (let x in levelCountTranslations) {
            localizations[x] = `${localizations[x]} - ${levelCountTranslations[x].trim()} ${t.level}`
        }
    }
    return localizations
}).filter(b => b["raw"] !== "")
unitNames.concat(unitData.map(t => {
    return {"en-US": t.wodID.toString(), raw: t.wodID.toString()}
}))

/**
 *
 * @type {{"raw": string, "en-US": string, [p: string]: string}[]}
 */
const unitDescriptions = unitData.map(t => {
    const _descriptions = getUnitDescription(t);
    if (_descriptions.length === 0) return null;
    let localizations = getLocalizations(_descriptions)
    localizations["raw"] = t.wodID.toString()
    return localizations
}).filter(d => d != null)

module.exports.unitNames = unitNames;
module.exports.unitDescriptions = unitDescriptions;