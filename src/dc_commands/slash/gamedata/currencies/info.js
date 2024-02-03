const {getCurrencyImage} = require("./utils");
const {currencyNames, currencyDescriptions} = require("./data");

/**
 *
 * @param {Currency} data
 * @param {Locale} locale
 * @return {{title: string, description?: string, fields?: {name: string, value:string, inline?: boolean}[], thumbnailUrl?:string}}
 */
module.exports.getCurrencyInfoEmbedData = function (data, locale) {
    const stringId = data.currencyID.toString();
    const fields = [];

    fields.push({
        name: `**Data**`,
        value: `\`\`\`json\n${JSON.stringify(data, null, 2)}\`\`\``,
        inline: true
    });

    return {
        title: currencyNames.find(n => n.raw === stringId)[locale],
        description: currencyDescriptions.find(n => n.raw === stringId)[locale],
        fields: fields,
        thumbnailUrl: getCurrencyImage(data),
    };
}