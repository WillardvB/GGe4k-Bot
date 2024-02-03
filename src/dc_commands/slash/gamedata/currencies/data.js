const {getLocalizations} = require("../../../../tools/localization");
const {getCurrencyName, getCurrencyDescription} = require("./utils");

const currencyData = require("e4k-data").data.currencies;

/**
 *
 * @type {{"raw": string, "en-US": string, [p: string]: string}[]}
 */
const currencyNames = currencyData.map(t => {
    const _names = getCurrencyName(t);
    if (_names.length === 0) return {"raw": ""};
    let localizations = getLocalizations(_names)
    localizations["raw"] = t.currencyID.toString()
    return localizations
}).filter(b => b["raw"] !== "")
currencyNames.concat(currencyData.map(t => {
    return {"en-US": t.currencyID.toString(), raw: t.currencyID.toString()}
}))

/** @type {{"raw": string, "en-US": string, [p: string]: string}[]} */
const currencyDescriptions = currencyData.map(t => {
    const _descriptions = getCurrencyDescription(t);
    if (_descriptions.length === 0) return null;
    let localizations = getLocalizations(_descriptions)
    localizations["raw"] = t.currencyID.toString()
    return localizations
}).filter(d => d != null)

module.exports = {
    currencyNames: currencyNames, currencyDescriptions: currencyDescriptions
}