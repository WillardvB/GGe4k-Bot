module.exports = {
	name: 'interactionCreate',
	description: 'Regelt interactionCreate event',
	async execute(client, interaction) {
    if (interaction.isCommand()){
      await interaction.deferReply({ephemeral: true});
      const command = interaction.commandName;
      const subCommand = interaction.options.getSubcommand();
      client.slashCommands.get(command + " " + subCommand).execute(client, interaction);
    }
    else if (interaction.isButton() || interaction.isSelectMenu())
    {
      await interaction.deferUpdate();
      const bCommand = interaction.customId.split(' ');
      client.slashCommands.get(bCommand[0] + ' ' + bCommand[1]).execute(client, interaction);
    }
  }
}