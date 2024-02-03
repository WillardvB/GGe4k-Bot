const versionData = require("e4k-data").data.versionInfo
const {logError} = require("../../../../tools/Logger");
const {getLocalizations} = require("../../../../tools/localization");

module.exports.name = "versionInfo"

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.execute = async function (interaction) {
    //const locale = interaction.locale;
    try {
        await interaction.followUp({
            content: `\`\`\`json\n${JSON.stringify(versionData, null, 2)}\`\`\``, ephemeral: true
        });
    } catch (e) {
        await logError(e);
        await interaction.followUp({content: e.toString(), ephemeral: true});
    }
}

/**
 *
 * @param {AutocompleteInteraction} interaction
 */
module.exports.autocomplete = async function (interaction) {
    let locale = interaction.locale;
    await interaction.respond([{name: getLocalizations(["dialogs", "dialog_ci_category_ci_all"])[locale], value: "-"}]);
}