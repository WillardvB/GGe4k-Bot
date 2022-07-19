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
        console.log("allianceName: " + allianceName);
        let _alliances = require("./../../../e4kserver/data").alliances;
        console.log("alliances Count: " + Object.keys(_alliances).length);
        let alliance = null;
        for (let allianceId in _alliances) {
            console.log("allianceId: " + allianceId);
            let _alliance = _alliances[allianceId];
            console.log(_alliance.allianceName + " is " + (_alliance.allianceName.toLowerCase() == allianceName ? "wel" : "niet") + " hetzelfde");
            if (_alliance.allianceName.toLowerCase() == allianceName) {
                alliance = _alliance;
                break;
            }
        }
        console.log("found alliance:" + alliance);
        if (alliance == null) {
            await interaction.followUp({ content: "Sorry, ik heb het bg niet gevonden!", ephemeral: true });
            return;
        }
        interaction.followUp({
            content: "Naam: " + alliance.allianceName + "\nOmschrijving: " + alliance.allianceDescription + "\nLeden aantal: " + alliance.memberList.length
        })
    }
}