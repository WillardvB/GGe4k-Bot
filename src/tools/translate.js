const {getTK} = require('./translate_tk');
const translateBaseUrl = 'https://translate.googleapis.com/translate_a/t?anno=3&client=te&format=html&v=1.0&key&logld=vTE_20230816&tc=0';

/**
 * Translates val from sourceLanguage to targetLanguage using Google Translate API.
 * @param {string | string[]} val Value to translate
 * @param {string} sl Source language
 * @param {string} tl Target language
 * @return {Promise<string | string[]>}
 */
module.exports.translate = async function (val, sl, tl) {
    if (typeof val === 'string') val = [val];
    const urlPart = val.map((v) => `&q=${encodeURIComponent(v)}`).join('');
    const response = await fetch(`${translateBaseUrl}&sl=${sl}&tl=${tl}&tk=${getTK(val)}${urlPart}`);
    /** @type {string[]} */
    const json = await response.json();
    if (val.length === 1) {
        if (!json[0].includes('<b>') || !json[0].includes('</b>') || !json[0].includes('<i>') || !json[0].includes('</i>')) return json[0];
        return json[0].match(/((?<=(<b>))(?:(?!<\/?[bi]>).)*(?=<\/b>))|(<br ?\/?>)/g).map(t => t.trim()).join(' ');
    }
    return json.map(v => {
        if (!v.includes('<b>') || !v.includes('</b>') || !v.includes('<i>') || !v.includes('</i>')) return v;
        return v.match(/((?<=(<b>))(?:(?!<\/?[bi]>).)*(?=<\/b>))|(<br ?\/?>)/g).map(t => t.trim()).join(' ')
    })
}

;
return;