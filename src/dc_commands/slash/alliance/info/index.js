const {SlashCommandSubcommandBuilder} = require("@discordjs/builders");
const {getLocalizations} = require("../../../../tools/localization");
const empire = require("../../../../e4kClient");
const num = require("../../../../tools/number");
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {logError, log} = require("../../../../tools/Logger");

//#region Data
const stringOptionName = "name";

module.exports.data = new SlashCommandSubcommandBuilder()
    .setName('info')
    .setDescription('Displays general data of the alliance.')
    .setDescriptionLocalizations({
        'nl': 'Toont algemene gegevens van het bondgenootschap.'
    })
    .addStringOption(option => {
        const descLoc = getLocalizations(["dialogs", "dialog_alliance_name"])
        return option
            .setName(stringOptionName)
            .setNameLocalizations({nl: "naam"})
            .setDescription(descLoc["en-US"])
            .setDescriptionLocalizations(descLoc)
            .setRequired(true)
    })
//#endregion

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.execute = async function (interaction) {
    const locale = interaction.locale;
    try {
        let allianceName = interaction.options.getString(stringOptionName, true).toLowerCase().trim();
        await log(`Searching info about alliance: ${allianceName} by ${interaction.user.displayName}`)
        const alliance = await empire.client.alliances.find(allianceName);
        /**@type {any}*/
        const message = buildEmbed(alliance, locale);
        await interaction.followUp(message);
    } catch (e) {
        await logError(e);
        await interaction.followUp({content: e.toString(), ephemeral: true});
    }
}

/**
 *
 * @param {ButtonInteraction} interaction
 */
module.exports.button = async function (interaction) {
    const locale = interaction.locale;
    try {
        let allianceId = parseInt(interaction.customId.toLowerCase().trim().split(' ')[2]);
        await log(`Searching info about alliance with id: ${allianceId} by ${interaction.user.displayName}`)
        const alliance = await empire.client.alliances.getById(allianceId);
        /**@type {any}*/
        const message = buildEmbed(alliance, locale);
        await interaction.editReply(message);
    } catch (e) {
        await logError(e);
        await interaction.followUp({content: e.toString(), ephemeral: true});
    }
}

/**
 * Creates an object containing a Discord Embed and content-string based on embed info
 * @param {Alliance} alliance
 * @param {Locale} locale
 * @returns {InteractionReplyOptions}
 */
function buildEmbed(alliance, locale) {
    let info =
        `${getLocalizations(["dialogs", "dialog_alliance_member"])[locale]}: ${alliance.memberList.length}\n` +
        `${getLocalizations(["dialogs", "dialog_fame_fame"])[locale]}: ${num.formatNum(alliance.allianceFamePoints, locale)}\n` +
        `${getLocalizations(["generic", "level"])[locale]}: ${alliance.memberLevel}\n` +
        `${getLocalizations(["dialogs", "mightPoints"])[locale]}: ${num.formatNum(alliance.might, locale)}\n` +
        `${getLocalizations(["dialogs", "dialog_language_name"])[locale]}: ${getLocalizations(["generic_flash", "languages", "generic_language_" + alliance.languageId])[locale]}\n` +
        `${getLocalizations(["dialogs", "dialog_alliance_toggle_openAlliance"])[locale]}: ${getLocalizations(["generic_flash", "button", alliance.isOpenAlliance ? "generic_btn_yes" : "generic_btn_no"])[locale]}\n` +
        `*id: ${alliance.allianceId}*`;
    let embed = new EmbedBuilder()
        .setTimestamp()
        .setColor("#000000")
        .setTitle(`**${alliance.allianceName}**`)
        .setDescription("```\n" + alliance.allianceDescription + "```")
    embed.addFields(/**@type {any}*/{
        name: getLocalizations(["generic", "ringmenu_info"])[locale], value: info
    });
    const messRow = new ActionRowBuilder();
    messRow.addComponents(/**@type {any}*/
        new ButtonBuilder()
            .setLabel(getLocalizations(["dialogs", "dialog_alliance_memberlist"])[locale])
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`alliance members ${alliance.allianceId}`), //new ButtonBuilder()
        //    .setLabel(translationData.generic.worldMap)
        //    .setStyle(ButtonStyle.Primary)
        //    .setCustomId(`worldmap alliance ${alliance.allianceId} 0 1 1 0 0`)
    )
    return {embeds: [embed], components: [messRow], ephemeral: true}
}