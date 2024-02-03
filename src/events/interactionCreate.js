module.exports.name = 'interactionCreate';
/**
 *
 * @param client
 * @param {ChatInputCommandInteraction | ModalSubmitInteraction | ButtonInteraction | AnySelectMenuInteraction | AutocompleteInteraction} interaction
 * @returns {Promise<void>}
 */
module.exports.execute = async function (client, interaction) {
    if (interaction.isChatInputCommand()) {
        await interaction.deferReply({ephemeral: true});
        const command = interaction.commandName;
        client.slashCommands.get(command)?.execute(interaction);
    } else if(interaction.isModalSubmit()){
        const command = interaction.customId.trim().split(' ')[0];
        client.slashCommands.get(command)?.modal(interaction);
    } else if (interaction.isButton()) {
        if (!interaction.customId.trim().toLowerCase().endsWith('to-modal')) await interaction.deferUpdate();
        client.slashCommands.get(interaction.customId.split(' ')[0])?.button(interaction)
    } else if (interaction.isAnySelectMenu()) {
        await interaction.deferUpdate();
        client.slashCommands.get(interaction.customId.split(' ')[0])?.selectMenu(interaction)
    } else if (interaction.isAutocomplete()) {
        const command = interaction.commandName;
        client.slashCommands.get(command)?.autocomplete(interaction);
    }
}