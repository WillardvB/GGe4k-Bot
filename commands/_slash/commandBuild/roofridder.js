const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'roofridder',
	description: 'Toont al je gewenste roofridderdata!',
  data: new SlashCommandBuilder()
	  .setName('roofridder')
	  .setDescription('Toont al je gewenste roofridderdata!')
	  .addSubcommand(subcommand =>
		  subcommand
			  .setName('info')
			  .setDescription('Geeft alle info over de roofridder')
			  .addStringOption(option =>
          option
            .setName('wereld')
            .setDescription('De wereld van de roofridder')
            .setRequired(true)
            .addChoice('Grote rijk', '0')
            .addChoice('IJs', '2')
            .addChoice('Zand', '1')
            .addChoice('Vuur', '3')
            .addChoice('Storm', '4')
            .addChoice('Berimond', '10')
            .addChoice('Klingkust', '-1')
        )
        .addIntegerOption(option =>
          option
            .setName('level')
            .setDescription('Het level van de roofridder')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName('totlvlup')
            .setDescription('Hoeveel x verslaan tot volgend level?')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
		  subcommand
			  .setName('buit')
			  .setDescription('Geeft de te verkrijgen buit van de roofridder')
        .addIntegerOption(option =>
          option
            .setName('level')
            .setDescription('Het level van de roofridder')
            .setRequired(true)
        )
    )
}