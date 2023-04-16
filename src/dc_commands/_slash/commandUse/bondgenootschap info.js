const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const num = require("../../../tools/number");
const translationData = require('e4k-data').languages.nl;
const empire = require('./../../../empireClient');

const _name = 'bondgenootschap info';
module.exports = {
    name: _name,
    description: 'Toont informatie over het bondgenootschap!',
    /**
     *
     * @param {CommandInteraction | ButtonInteraction} interaction
     */
    async execute(interaction) {
        try {
            let allianceName = "";
            if (interaction.options) {
                allianceName = interaction.options.getString('naam').toLowerCase().trim();
            } else if (interaction.customId) {
                allianceName = interaction.customId.toLowerCase().trim().split(' ').slice(2).join(" ");
            }
            const alliance = await empire.client.alliances.find(allianceName);
            let info =
                `${translationData.dialogs.dialog_alliance_member}: ${alliance.memberList.length}\n` +
                `${translationData.dialogs.dialog_fame_fame}: ${num.formatNum(alliance.allianceFamePoints)}\n` +
                `${translationData.generic.level}: ${alliance.memberLevel}\n` +
                `${translationData.dialogs.mightPoints}: ${num.formatNum(alliance.might)}\n` +
                `${translationData.dialogs.dialog_language_name}: ${translationData.generic_flash.languages["generic_language_" + alliance.languageId]}\n` +
                `${translationData.dialogs.dialog_alliance_toggle_openAlliance}: ${alliance.isOpenAlliance ? translationData.generic_flash.button.generic_btn_yes : translationData.generic_flash.button.generic_btn_no}\n` +
                `*id: ${alliance.allianceId}*`;
            let embed = new EmbedBuilder()
                .setTimestamp()
                .setColor("#000000")
                .setTitle(`**${alliance.allianceName}**`)
                .setDescription("```\n" + alliance.allianceDescription + "```")
            embed.addFields({
                name: translationData.generic.ringmenu_info, value: info
            });
            const messRow = new ActionRowBuilder();
            messRow.addComponents(
                new ButtonBuilder()
                    .setLabel(translationData.dialogs.dialog_alliance_memberlist)
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`bondgenootschap leden ${allianceName}`),
                new ButtonBuilder()
                    .setLabel(translationData.generic.worldMap)
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`worldmap alliance ${alliance.allianceId} 0 1 1 0 0`)
            )
            if (interaction.options) {
                await interaction.followUp({embeds: [embed], components: [messRow]});
            } else if (interaction.customId) {
                await interaction.editReply({embeds: [embed], components: [messRow]});
            }

        } catch (e) {
            await interaction.followUp({content: e.toString()});
        }
    }
}