const {getLocalizations} = require("../../../../tools/localization");
const {secToDuration} = require("../../../../tools/time");
const {formatNum} = require("../../../../tools/number");

/**
 *
 * @param {Building} data
 * @param {Locale} locale
 * @param {string} title
 * @param {string} description
 * @param {string} thumbnailUrl
 * @return {{title: string, description?: string, fields?: {name: string, value:string, inline?: boolean}[], thumbnailUrl?:string}}
 */
module.exports.getBuildingCostEmbedData = function (data, locale, title, description, thumbnailUrl) {
    const fields = [];

    let normalCostValues = "";
    let tmpServerCostValues = "";

    const _keys = Object.keys(data);
    for (let _i = 0; _i < _keys.length; _i++) {
        let _key = _keys[_i];
        let _keyLowCase = _key.toLowerCase();
        /** @type {string | number} */
        let _value = data[_key];
        if (_keyLowCase.startsWith("cost")) {
            normalCostValues += formatCostString(_key, _keyLowCase, _value, locale);
            continue;
        }
        if (_keyLowCase.endsWith("duration")) {
            if (_keyLowCase === "buildduration") {
                normalCostValues += `**${getLocalizations(["generic", "time_colon"])[locale]}** ${secToDuration(_value)}\n`;
            }
            continue;
        }
        if (_keyLowCase.startsWith("tempserver")) {
            _key = _key.substring(10);
            _keyLowCase = _key.toLowerCase();
            if (_keyLowCase.startsWith("cost")) {
                tmpServerCostValues += formatCostString(_key, _keyLowCase, _value, locale);
                continue;
            }
            if (_keyLowCase === "time") {
                tmpServerCostValues += `**${getLocalizations(["generic", "time_colon"])[locale]}** ${secToDuration(_value)}\n`;
            }
        }
    }
    if (normalCostValues !== "") {
        fields.push({
            name: `**${getLocalizations(["generic", "costs"])[locale]}**`, value: normalCostValues.trim(), inline: true
        });
    } else {
        fields.push({
            name: `**${getLocalizations(["generic", "costs"])[locale]}**`,
            value: getLocalizations(["dialogs", "forFree"])[locale],
            inline: true
        });
    }
    if (tmpServerCostValues !== "") {
        fields.push({
            name: `_${getLocalizations(["dialogs", "temp_server_name"])[locale]} ${getLocalizations(["generic", "costs"])[locale].toLowerCase()}_`,
            value: tmpServerCostValues.trim(),
            inline: true
        });
    }

    return {
        title: title, description: description, fields: fields, thumbnailUrl: thumbnailUrl
    };
}

/**
 *
 * @param {string} key
 * @param {string} keyLowCase
 * @param {number} value
 * @param {Locale} locale
 * @returns {string}
 */
function formatCostString(key, keyLowCase, value, locale) {
    let newKey = getLocalizations(["generic", keyLowCase.substring(4)])[locale]
    if (newKey == null) {
        if (key.length === 6) key = key.replace("costC", "costcurrency");
        newKey = getLocalizations(["dialogs", `currency_name_${key.substring(4)}`])[locale];
        if (newKey == null) {
            newKey = getLocalizations(["generic", `currency_name_${key.substring(4)}`])[locale];
        }
        if (newKey == null) {
            const keyFirstLowCase = key.substring(4,5).toLowerCase() + key.substring(5)
            newKey = getLocalizations(['generic', `currency_name_${keyFirstLowCase}`])[locale]
        }
    }
    return `**${newKey}**: ${formatNum(value, locale)}\n`;
}