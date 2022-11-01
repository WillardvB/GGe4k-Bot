const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'speler',
    description: 'Toont al je gewenste spelerdata!',
    data:
        new SlashCommandBuilder()
            .setName('speler')
            .setDescription('Toont al je gewenste spelerdata!')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('info')
                    .setDescription('Geeft algemene gegevens van de speler.')
                    .addStringOption(option =>
                        option
                            .setName('naam')
                            .setDescription('De naam van de speler.')
                            .setRequired(true)
                    )
            )
}