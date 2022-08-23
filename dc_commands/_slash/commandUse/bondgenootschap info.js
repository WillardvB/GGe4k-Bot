const { CommandInteraction, MessageEmbed } = require("discord.js");
const Logger = require("../../../tools/Logger");
const num = require("../../../tools/number");
const translationData = require('./../../../ingame_translations/nl.json');

let allianceInfoVO = {
    allianceId: "",
    allianceName: "",
    allianceDescription: "",
    languageId: "",
    memberLevel: 0,
    memberList: [],
    allianceStatusToOwnAlliance: null,
    allianceFamePoints: 0,
    allianceFamePointsHighestReached: -1,
    canInvitedForHardPact: false,
    canInvitedForSoftPact: false,
    isSearchingMembers: null,
    landmarks: [],
    isOpenAlliance: false,
    freeRenames: 0,
    might: 0,
}

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
            let _alliances = require("./../../../e4kserver/data").alliances;
            allianceInfoVO = null;
            for (let allianceId in _alliances) {
                let _alliance = _alliances[allianceId];
                if (_alliance.allianceName.toLowerCase() == allianceName) {
                    allianceInfoVO = _alliance;
                    break;
                }
            }
            if (allianceInfoVO == null) {
                await interaction.followUp({ content: "Sorry, ik heb het bg niet gevonden!" });
                return;
            }
            let info = "Leden aantal: " + allianceInfoVO.memberList.length + "\n" +
                "Roempunten: " + num.formatNum(allianceInfoVO.allianceFamePoints) + "\n" +
                "Level: " + allianceInfoVO.memberLevel + "\n" +
                "Macht: " + num.formatNum(allianceInfoVO.might) + "\n" +
                "Taal: " + translationData.generic_flash.languages["generic_language_" + allianceInfoVO.languageId] + "\n" +
                "Is open BG: " + allianceInfoVO.isOpenAlliance + "\n" +
                "*id: " + allianceInfoVO.allianceId + "*";
            let embed = new MessageEmbed()
                .setTimestamp()
                .setColor("#000000")
                .setTitle(`**${allianceInfoVO.allianceName}**`)
                .setDescription("```\n" + allianceInfoVO.allianceDescription + "```")
                .addField(translationData.generic.ringmenu_info, info);
            await interaction.followUp({ embeds: [embed] });
        }
        catch (e) {
            Logger.logError(e);
        }
    }
}