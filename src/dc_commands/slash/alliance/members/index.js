const {SlashCommandSubcommandBuilder} = require("@discordjs/builders");
const {getLocalizations} = require("../../../../tools/localization");
const empire = require("../../../../e4kClient");
const {
    EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction
} = require("discord.js");
const {logError, log} = require("../../../../tools/Logger");

//#region Data
const nameLocalizations = getLocalizations(["dialogs", "dialog_alliance_member"], true, true)
const descriptionLocalizations = getLocalizations(["help", "help_allianceMemberlist"])
const stringOptionName = "name";
const intOptionName = "rank";

const _choice = getLocalizations(["dialogs", "filter_gridSize_all"])
const choices = [{
    name: _choice["en-US"], name_localizations: _choice, value: 0
}];
for (let i = 0; i < 10; i++) {
    const _loc = getLocalizations(["dialogs", `dialog_alliance_rank${i}`]);
    choices.push({
        name: _loc["en-US"], name_localizations: _loc, value: i + 1
    })
}

module.exports.data = new SlashCommandSubcommandBuilder()
    .setName(nameLocalizations["en-US"])
    .setNameLocalizations(nameLocalizations)
    .setDescription(descriptionLocalizations["en-US"])
    .setDescriptionLocalizations(descriptionLocalizations)
    .addStringOption(option => {
        const descLoc = getLocalizations(["dialogs", "dialog_alliance_name"])
        return option
            .setName(stringOptionName)
            .setNameLocalizations({nl: "naam"})
            .setDescription(descLoc["en-US"])
            .setDescriptionLocalizations(descLoc)
            .setRequired(true)
    })
    .addIntegerOption(option => {
        return option
            .setName(intOptionName)
            .setNameLocalizations({nl: 'rang'})
            .setDescription('Displays only the players who have this rank in the alliance.')
            .setDescriptionLocalizations({nl: 'Toont alleen de spelers die deze rang hebben in het bondgenootschap.'})
            .setRequired(false)
            .addChoices(...choices)
    })
//#endregion

/** @param {ChatInputCommandInteraction} interaction */
module.exports.execute = async function (interaction) {
    try {
        const locale = interaction.locale;
        const allianceName = interaction.options.getString(stringOptionName, true).toLowerCase().trim();
        await log(`Searching info about alliance: ${allianceName} by ${interaction.user.displayName}`)
        let rank = interaction.options.getInteger(intOptionName);
        if (rank == null) rank = -1; else rank -= 1;
        const alliance = await empire.client.alliances.find(allianceName);
        /** @type {any} */
        const message = buildEmbed(alliance, rank, locale)
        await interaction.followUp(message);
    } catch (e) {
        await logError(e);
        await interaction.followUp({content: e.toString(), ephemeral: true});
    }
}

/** @param {ButtonInteraction} interaction */
module.exports.button = async function (interaction) {
    const locale = interaction.locale;
    try {
        let allianceId = parseInt(interaction.customId.toLowerCase().trim().split(' ')[2]);
        await log(`Searching members in alliance with id: ${allianceId} by ${interaction.user.displayName}`);
        const alliance = await empire.client.alliances.getById(allianceId);
        let rank = -1;
        /**@type {any}*/
        const message = buildEmbed(alliance, rank, locale);
        await interaction.editReply(message);
    } catch (e) {
        await logError(e);
        await interaction.followUp({content: e.toString(), ephemeral: true});
    }
}

/** @param {StringSelectMenuInteraction} interaction */
module.exports.selectMenu = async function (interaction) {
    const locale = interaction.locale;
    try {
        const allianceId = parseInt(interaction.customId.toLowerCase().trim().split(' ')[2]);
        await log(`Searching members in alliance: ${allianceId} by ${interaction.user.displayName}`)
        const alliance = await empire.client.alliances.getById(allianceId);
        let rank = parseInt(interaction.values[0])
        /**@type {any}*/
        const message = buildEmbed(alliance, rank, locale);
        await interaction.editReply(message);
    } catch (e) {
        await logError(e);
        await interaction.followUp({content: e.toString(), ephemeral: true});
    }
}

/**
 * Creates an object containing a Discord Embed and content-string based on embed info
 * @param {Alliance} alliance
 * @param {number} rank
 * @param {Locale} locale
 * @returns {InteractionReplyOptions}
 */
function buildEmbed(alliance, rank, locale) {
    let descAll = {"en-US": 'All members', 'nl': 'Alle leden'}
    descAll = descAll[locale] ?? descAll["en-US"]
    let descOne = {"en-US": 'Members with rank: ', 'nl': 'Leden met rang: '}
    descOne = (descOne[locale] ?? descOne["en-US"]) + getLocalizations(["dialogs", `dialog_alliance_rank${rank}`])[locale]
    let embed = new EmbedBuilder()
        .setDescription(rank === -1 ? descAll : descOne)
        .setTimestamp()
        .setColor("#000000")
        .setTitle(`**${alliance.allianceName}**`)
    let _allianceRank = getLocalizations(["dialogs", `dialog_alliance_rank${0}`])[locale];
    let memberList = "";
    let isSecondField = false;
    for (let i in alliance.memberList) {
        let member = alliance.memberList[i];
        let _rank = member.allianceRank;
        const localizedRank = getLocalizations(["dialogs", `dialog_alliance_rank${_rank}`])[locale]
        if (rank === -1 || rank === _rank) {
            if (memberList !== "" && _allianceRank !== localizedRank) {
                let __allianceRank = _allianceRank
                if (isSecondField) __allianceRank += " 2";
                embed.addFields(/**@type {any}*/{
                    name: __allianceRank, value: memberList, inline: true
                });
                memberList = "";
                isSecondField = false;
            }
            _allianceRank = localizedRank;
            if ((memberList + `__${fixNameString(member.playerName)}__, level: ${member.playerLevel}\n`).length > 1020) {
                embed.addFields(/**@type {any}*/{
                    name: _allianceRank, value: memberList, inline: true
                });
                memberList = "";
                isSecondField = true;
            }
            memberList += `__${fixNameString(member.playerName)}__, level: ${member.playerLevel}\n`;
        }
        if (memberList !== "" && (_allianceRank !== localizedRank || i === alliance.memberList.length - 1)) {
            let __allianceRank = _allianceRank
            if (isSecondField) __allianceRank += " 2";
            embed.addFields(/**@type {any}*/{
                name: __allianceRank, value: memberList, inline: true
            });
            memberList = "";
            _allianceRank = localizedRank;
            isSecondField = false;
        }
    }
    if (memberList.trim() !== "") {
        let __allianceRank = _allianceRank
        if (isSecondField) __allianceRank += " 2";
        if (memberList !== "") embed.addFields(/**@type {any}*/{
            name: __allianceRank, value: memberList, inline: true
        });
    }
    const messRow = new ActionRowBuilder();
    /** @type {any} */
    let _options = [];
    if (rank !== -1) _options.push({
        label: getLocalizations(["dialogs", "filter_gridSize_all"])[locale], description: descAll, value: '-1'
    });
    for (let i = 0; i <= 9; i++) {
        if (rank === i) continue;
        let ___description = getLocalizations(["dialogs", `dialog_alliance_rankinfo${i}`])[locale].split('.')[0] + ".";
        if (___description.length > 100) ___description = ___description.substring(0, 97).trim() + "...";
        _options.push({
            label: getLocalizations(["dialogs", `dialog_alliance_rank${i}`])[locale],
            description: ___description,
            value: i.toString()
        })
    }
    messRow.addComponents(/**@type {any}*/new StringSelectMenuBuilder()
        .setOptions(_options)
        .setMaxValues(1)
        .setPlaceholder('Filter')
        .setCustomId(`alliance members ${alliance.allianceId}`))
    const messRow2 = new ActionRowBuilder();
    messRow2.addComponents(/**@type {any}*/new ButtonBuilder()
        .setLabel(getLocalizations(["dialogs", "dialog_alliance_info"])[locale])
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`alliance info ${alliance.allianceId}`),
        /*new ButtonBuilder()
        .setLabel(translations[locale].generic.worldMap)
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`worldmap alliance ${alliance.allianceId} 0 1 1 0 0`)*/)
    return {embeds: [embed], components: [messRow, messRow2], ephemeral: true}
}

/**
 *
 * @param {string} _string
 */
function fixNameString(_string) {
    return _string.replace('_', '\_').replace('*', '\*').replace('~', '\~');
}