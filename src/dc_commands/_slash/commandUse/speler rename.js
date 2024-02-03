const empire = require('../../../e4kClient');
const {logError} = require("../../../tools/Logger");

module.exports = {
    name: 'speler rename',
    description: 'Renames Discord player username!',
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        try {
            let player_id = parseInt(interaction.customId.split(' ')[2]);
            let _player = await empire.client.players.getById(player_id);
            if (interaction.customId.split(' ')[3] === "n") {
                await interaction.member.setNickname(_player.playerName.substring(0, 64));
            } else if (interaction.customId.split(' ')[3] === "n-bg") {
                await interaction.member.setNickname((_player.playerName + " - " + _player.allianceName).substring(0, 64));
            }
        } catch (e) {
            await logError(e);
            await interaction.followUp({content: e.toString(), ephemeral: true});
        }
    }
}