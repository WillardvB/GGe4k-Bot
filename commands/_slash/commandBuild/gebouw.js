const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'gebouw',
    description: 'Toont al je gewenste gebouwdata!',
    data: new SlashCommandBuilder()
        .setName('gebouw')
        .setDescription('Toont al je gewenste gebouwdata!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('algemeen')
                .setDescription('Geeft algemene gegevens van het gebouw')
                .addStringOption(option =>
                    option
                        .setName('naam')
                        .setDescription('De naam van het gebouw')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('level')
                        .setDescription('Het level van het gebouw')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('kosten')
                .setDescription('Geeft de kosten voor het gekozen level of van het gehele gebouw bij geen of ongeldig level')
                .addStringOption(option =>
                    option
                        .setName('naam')
                        .setDescription('De naam van het gebouw')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('level')
                        .setDescription('Het level van het gebouw')
                        .setRequired(false)
                )
        )
}