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
                            .addChoices(
                                { name: "Alle", value: 0 },
                                { name: "Leider", value: 1 },
                                { name: "Substituut", value: 2 },
                                { name: "Veldmaarschalk", value: 3 },
                                { name: "Schatbewaarder", value: 4 },
                                { name: "Diplomaat", value: 5 },
                                { name: "Ronselaar", value: 6 },
                                { name: "Generaal", value: 7 },
                                { name: "Sergeant", value: 8 },
                                { name: "Lid", value: 9 },
                                { name: "Novice", value: 10 },
                            )
                    )
            )
}