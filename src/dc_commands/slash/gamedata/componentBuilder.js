const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {getLocalizations} = require("../../../tools/localization");

/**
 * Creates an object containing a Discord Embed and content-string based on embed info
 * @param {string} commandAndSubcommand
 * @param {any} rawDataItem
 * @param {any} rawData
 * @param {Locale} locale
 * @returns {ActionRowBuilder<AnyComponentBuilder>[]}
 */
module.exports.getLevelChangeComponentRow = function (commandAndSubcommand, rawDataItem, rawData, locale) {
    const messRow = new ActionRowBuilder();
    const localizedLevelString = getLocalizations(["generic", "level"])[locale];
    if (rawDataItem.downgradeWodID) {
        const lowerLevel = rawData.find(b => b.wodID === rawDataItem.downgradeWodID);
        if (lowerLevel) {
            messRow.addComponents(/**@type {any}*/new ButtonBuilder()
                .setLabel(`${localizedLevelString} ${lowerLevel.level}`)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`${commandAndSubcommand} ${lowerLevel.wodID} 0`))
        }
    }
    if (rawDataItem.upgradeWodID) {
        const higherLevel = rawData.find(b => b.wodID === rawDataItem.upgradeWodID);
        if (higherLevel) {
            messRow.addComponents(/**@type {any}*/new ButtonBuilder()
                .setLabel(`${localizedLevelString} ${higherLevel.level}`)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`${commandAndSubcommand} ${higherLevel.wodID} 0`))
        }
    }
    if (rawDataItem.downgradeWodID || rawDataItem.upgradeWodID) {
        /*messRow.addComponents(
            new ButtonBuilder()
                .setLabel('Totaal alle levels')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`buildings ${rawData.wodID} 1`) // last '1' is 'is total overview'
        )*/

        return /**@type {any}*/[messRow];
    }
    return [];
}