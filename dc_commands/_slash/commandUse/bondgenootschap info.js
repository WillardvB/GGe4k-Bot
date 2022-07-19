const { CommandInteraction } = require("discord.js")

let allianceInfoVO = {
    allianceId: paramObject.AID,
    allianceName: paramObject.N,
    allianceDescription: parseChatJSONMessage(paramObject.D),
    languageId: paramObject["ALL"],
    memberLevel: paramObject.ML,
    memberList: [],
    allianceStatusToOwnAlliance: paramObject.DOA,
    allianceFamePoints: paramObject.CF,
    allianceFamePointsHighestReached: -1,
    canInvitedForHardPact: paramObject.HP == 1,
    canInvitedForSoftPact: paramObject.SP == 1,
    isSearchingMembers: paramObject.IS,
    landmarks: [],
    isOpenAlliance: paramObject.IA != 0,
    freeRenames: paramObject.FR,
    might: parseInt(paramObject.MP),
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
            await interaction.followUp({ content: "Sorry, ik heb het bg niet gevonden!", ephemeral: false });
            return;
        }
        interaction.followUp({
            content:
                "Naam: " + allianceInfoVO.allianceName + "\n" +
                "Omschrijving:```\n" + allianceInfoVO.allianceDescription + "```" + "\n" +
                "Leden aantal: " + allianceInfoVO.memberList.length + "\n" +
                "Roempunten: " + allianceInfoVO.allianceFamePoints + "\n" +
                "Level: " + allianceInfoVO.memberLevel + "\n" +
                "Macht: " + allianceInfoVO.might + "\n" +
                "Taal: " + allianceInfoVO.languageId + "\n" +
                "*id: " + allianceInfoVO.allianceId + "*"
        })
    }
}