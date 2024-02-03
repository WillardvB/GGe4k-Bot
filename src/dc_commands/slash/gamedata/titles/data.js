const {getLocalizations} = require("../../../../tools/localization");
const {getTitleName} = require("./utils");

const titleData = require("e4k-data").data.titles;

/** @type {{"raw": string, "en-US": string, [p: string]: string}[]} */
const titleNames = titleData.map(t => {
    const _names = getTitleName(t);
    if (_names.length === 0) return {"raw": ""};
    let localizations = getLocalizations(_names)
    localizations["raw"] = t.titleID.toString()
    return localizations
}).filter(b => b["raw"] !== "")
titleNames.concat(titleData.map(t => {
    return {"en-US": t.titleID.toString(), raw: t.titleID.toString()}
}))

module.exports = {
    titleNames: titleNames
}