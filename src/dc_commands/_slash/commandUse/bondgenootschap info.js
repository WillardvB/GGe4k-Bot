const { CommandInteraction, MessageEmbed } = require("discord.js");
const num = require("../../../tools/number");
const translationData = require('./../../../ingame_translations/nl.json');
const { empireClient } = require('./../../../empireClient');

module.exports = {
    name: 'bondgenootschap info',
    description: 'Toont informatie over het bondgenootschap!',
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            let allianceName = interaction.options.getString('naam').toLowerCase().trim();
            let alliance = await empireClient.alliances.find(allianceName);
            let info = "Leden aantal: " + alliance.memberList.length + "\n" +
                "Roempunten: " + num.formatNum(alliance.allianceFamePoints) + "\n" +
                "Level: " + alliance.memberLevel + "\n" +
                "Macht: " + num.formatNum(alliance.might) + "\n" +
                "Taal: " + translationData.generic_flash.languages["generic_language_" + alliance.languageId] + "\n" +
                "Is open BG: " + alliance.isOpenAlliance + "\n" +
                "*id: " + alliance.allianceId + "*";
            let embed = new MessageEmbed()
                .setTimestamp()
                .setColor("#000000")
                .setTitle(`**${alliance.allianceName}**`)
                .setDescription("```\n" + alliance.allianceDescription + "```")
                embed.addFields({
                    name: translationData.generic.ringmenu_info, value: info
                });
            await interaction.followUp({ embeds: [embed] });
        }
        catch (e) {
            await interaction.followUp({ content: e });
            return;
        }
    }
}