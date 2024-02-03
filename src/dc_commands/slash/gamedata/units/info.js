const {getLocalizations} = require("../../../../tools/localization");
const {getUnitImage} = require("./utils");
const {unitNames, unitDescriptions} = require("./data");

/**
 *
 * @param {Unit} data
 * @param {Locale} locale
 * @return {{title: string, description?: string, fields?: {name: string, value:string, inline?: boolean}[], thumbnailUrl?:string}}
 */
module.exports.getUnitInfoEmbedData = function (data, locale) {
    const stringWod = data.wodID.toString();
    const fields = [];

    fields.push({
        name: `**Data**`,
        value: `\`\`\`json\n${JSON.stringify(data, null, 2)}\`\`\``,
        inline: true
    });

    return {
        title: unitNames.find(n => n.raw === stringWod)[locale],
        description: unitDescriptions.find(n => n.raw === stringWod)[locale],
        fields: fields,
        thumbnailUrl: getUnitImage(data),
    };
}