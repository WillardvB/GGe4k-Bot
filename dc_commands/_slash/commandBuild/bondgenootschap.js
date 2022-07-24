const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'bondgenootschap',
    description: 'Toont al je gewenste bondgenootschapdata!',
    data:
        new SlashCommandBuilder()
            .setName('bondgenootschap')
            .setDescription('Toont al je gewenste bondgenootschapdata!')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('info')
                    .setDescription('Geeft algemene gegevens van het bondgenootschap.')
                    .addStringOption(option =>
                        option
                            .setName('naam')
                            .setDescription('De naam van het bondgenootschap.')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('leden')
                    .setDescription('Toont een lijst met de leden van het bondgenootschap.')
                    .addStringOption(option =>
                        option
                            .setName('naam')
                            .setDescription('De naam van het bondgenootschap.')
                            .setRequired(true)
                    )
                    .addIntegerOption(option =>
                        option
                            .setName('rang')
                            .setDescription('Toont alleen de spelers die deze rang hebben in het bondgenootschap.')
                            .setRequired(false)
                            .addChoice("Alle", 0)
                            .addChoice("Leider", 1)
                            .addChoice("Substituut", 2)
                            .addChoice("Veldmaarschalk", 3)
                            .addChoice("Schatbewaarder", 4)
                            .addChoice("Diplomaat", 5)
                            .addChoice("Ronselaar", 6)
                            .addChoice("Generaal", 7)
                            .addChoice("Sergeant", 8)
                            .addChoice("Lid", 9)
                            .addChoice("Novice", 10)
                    )
            )
}