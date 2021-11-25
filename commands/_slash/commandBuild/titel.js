const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'titel',
	description: 'Toont al je gewenste titeldata!',
  data: new SlashCommandBuilder()
	  .setName('titel')
	  .setDescription('Toont al je gewenste titeldata!')
	  .addSubcommand(subcommand =>
		  subcommand
			  .setName('houden')
			  .setDescription('Geeft benodigde punten om titel x dagen te behouden')
			  .addIntegerOption(option =>
          option
            .setName('dagen')
            .setDescription('De dagen dat je de titel wil houden')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('titel')
            .setDescription('De naam of het nummer van de titel')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
		  subcommand
			  .setName('info')
			  .setDescription('Geeft info over de titel')
        .addStringOption(option =>
          option
            .setName('titel')
            .setDescription('De naam of het nummer van de titel')
            .setRequired(true)
        )
    )
  .addSubcommand(subcommand =>
		  subcommand
			  .setName('namen')
			  .setDescription('Geeft mogelijke titelnamen')
        .addStringOption(option =>
          option
            .setName('soort')
            .setDescription('De titelsoort')
            .setRequired(false)
            .addChoice('Roem', 'roem')
            .addChoice('Berimond', 'beri')
            .addChoice('Storm', 'storm')
        )
    )
}