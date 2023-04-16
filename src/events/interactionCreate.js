module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            await interaction.deferReply({ephemeral: true});
            const command = interaction.commandName;
            const subCommand = interaction.options.getSubcommand();
            client.slashCommands.get(command + " " + subCommand).execute(interaction);
        } else if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {
            if (!interaction.customId.trim().toLowerCase().endsWith('to-modal') && !interaction.isModalSubmit())
                await interaction.deferUpdate();
            const bCommand = interaction.customId.split(' ');
            client.slashCommands.get(bCommand[0] + ' ' + bCommand[1])?.execute(interaction);
        }
    }
}