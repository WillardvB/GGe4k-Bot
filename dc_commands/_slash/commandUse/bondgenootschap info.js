const { CommandInteraction } = require("discord.js")

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
        interaction.followUp({
            content:
                "Naam: " + allianceInfoVO.allianceName + "\n" +
                "Omschrijving:```\n" + allianceInfoVO.allianceDescription + "```" +
                "Leden aantal: " + allianceInfoVO.memberList.length + "\n" +
                "Roempunten: " + allianceInfoVO.allianceFamePoints + "\n" +
                "Level: " + allianceInfoVO.memberLevel + "\n" +
                "Macht: " + allianceInfoVO.might + "\n" +
                "Taal: " + allianceInfoVO.languageId + "\n" +
                "Is open BG: " + allianceInfoVO.isOpenAlliance + "\n" +
                "*id: " + allianceInfoVO.allianceId + "*"
        })
    }
}