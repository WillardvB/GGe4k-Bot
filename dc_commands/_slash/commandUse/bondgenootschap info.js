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
        console.log("allianceName: " + allianceName);
        let _alliances = require("../../e4kserver/data").alliances;
        console.log("alliances Count: " + Object.keys(_alliances).length);
        let alliance = null;
        for (let allianceId in _alliances) {
            let _alliance = _alliances[allianceId];
            console.log(_alliance.name + " is " + (_alliance.name == allianceName ? "wel" : "niet") + "hetzelfde ");
            if (_alliance.name == allianceName) {
                alliance = _alliance;
            }
        }
        console.log("found alliance:" + alliance);
        if (alliance == null) {
            await interaction.reply({ content: "Sorry, ik heb het bg niet gevonden!", ephemeral: true });
            return;
        }
        interaction.reply({ content: "membercount: " + alliance.members.length, ephemeral: true })
    }
}