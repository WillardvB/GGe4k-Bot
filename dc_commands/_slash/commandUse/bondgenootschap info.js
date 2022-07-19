const { CommandInteraction } = require("discord.js")

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
        let alliance = null;
        for (let allianceId in _alliances) {
            let _alliance = _alliances[allianceId];
            if (_alliance.allianceName.toLowerCase() == allianceName) {
                alliance = _alliance;
                break;
            }
        }
        if (alliance == null) {
            await interaction.followUp({ content: "Sorry, ik heb het bg niet gevonden!", ephemeral: false });
            return;
        }
        interaction.followUp({
            content: "Naam: " + alliance.allianceName + "\nOmschrijving: " + alliance.allianceDescription + "\nLeden aantal: " + alliance.memberList.length,
            ephemeral: false
        })
    }
}