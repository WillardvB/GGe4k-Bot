const translations = require('e4k-data').languages;
const acceptedLocalesDC = ["id", "da", "de", "en-GB", "en-US", "es-ES", "fr", "hr", "it", "lt", "hu", "nl", "no", "pl", "pt-BR", "ro", "fi", "sv-SE", "vi", /*"tr", */"cs", "el", "bg", "ru", "uk", "hi", "th", "zh-CN", "ja", "zh-TW", "ko"];

/**
 *
 * @param {string} locale
 * @return {string}
 */
module.exports.dcLocaleToGgsLocale = function (locale){
    if(!translations[locale]) locale = locale.split('-')[0];
    if(!translations[locale]) return "";
    return locale;
}

/**
 *
 * @param {string[]} translationsPath
 * @param {boolean} forceLowerCase
 * @param {boolean} removeSpaces
 * @return {{'en-US':string|string[], [locale:string]: string|string[]}}
 */
module.exports.getLocalizations = function (translationsPath, forceLowerCase = false, removeSpaces = false){
    const output = {}
    for(const locale of acceptedLocalesDC){
        let language = module.exports.dcLocaleToGgsLocale(locale)
        if(output[locale]) continue;
        let val = translations[language];
        if(val == null) continue;
        for(const p of translationsPath){
            val = val[p]
            if(val == null) break;
        }
        if(val == null) continue;
        if(forceLowerCase) val = val.toLowerCase()
        if(removeSpaces) val = val.split(' ').map(s=>s.trim()).join('_').trim()
        output[locale] = val
    }
    return output;
}