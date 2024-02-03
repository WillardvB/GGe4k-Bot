const {getAchievementImage} = require("./utils");
const {achievementNames, achievementDescriptions} = require("./data");

/**
 *
 * @param {Achievement} data
 * @param {Locale} locale
 * @return {{title: string, description?: string, fields?: {name: string, value:string, inline?: boolean}[], thumbnailUrl?:string}}
 */
module.exports.getAchievementInfoEmbedData = function (data, locale) {
    const stringId = data.achievementID.toString();
    const fields = [];

    fields.push({
        name: `**Data**`,
        value: `\`\`\`json\n${JSON.stringify(data, null, 2)}\`\`\``,
        inline: true
    });
    //Vereiste:
    //if(item === `achievementStep_desc_${seriesId}`) return true;
    //in geval dit {x} bevat dan gegevens halen uit 'data.conditions'

    return {
        title: achievementNames.find(n => n.raw === stringId)[locale],
        description: achievementDescriptions.find(n => n.raw === stringId)[locale],
        fields: fields,
        thumbnailUrl: getAchievementImage(data),
    };
}