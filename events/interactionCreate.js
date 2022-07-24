module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            await interaction.deferReply({ ephemeral: true });
            const command = interaction.commandName;
            const subCommand = interaction.options.getSubcommand();
            client.slashCommands.get(command + " " + subCommand).execute(interaction);
            console.log(command + " " + subCommand);
        }
        else if (interaction.isButton() || interaction.isSelectMenu()) {
            await interaction.deferUpdate();
            const bCommand = interaction.customId.split(' ');
            client.slashCommands.get(bCommand[0] + ' ' + bCommand[1]).execute(interaction);
            console.log(bCommand[0] + " " + bCommand[1] + " (knop)");
        }
    }
}