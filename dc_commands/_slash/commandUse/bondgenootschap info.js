const { CommandInteraction } = require("discord.js")

module.exports = {
    name: 'bondgenootschap info',
    description: 'Toont informatie over het bondgenootschap!',
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        let allianceName = interaction.options.getString('naam');
        let _alliances = require("../../e4kserver/data").alliances;
        let alliance = null;
        for (let allianceId in _alliances) {
            let _alliance = _alliances[allianceId];
            if (_alliance.name == allianceName) {
                alliance = _alliance;
            }
        }
        if (alliance == null) return;
        interaction.reply({content: "membercount: " + alliance.members.length})
    }
}