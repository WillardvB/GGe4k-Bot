const {SlashCommandBuilder} = require("@discordjs/builders");
const info = require('./info/index');
const {getLocalizations} = require("../../../tools/localization");
const {
    StringSelectMenuInteraction,
    ChatInputCommandInteraction,
    ButtonInteraction
} = require("discord.js");

module.exports.name = "player"

/** @param {ChatInputCommandInteraction} interaction */
module.exports.execute = async function (interaction){
    const subcommand = interaction.options.getSubcommand(true);
    const file = require(`./${subcommand}`)
    await file.execute(interaction);
}

/** @param {ButtonInteraction} interaction */
module.exports.button = async function (interaction){
    const subcommand = interaction.customId.trim().split(' ')[1];
    const file = require(`./${subcommand}`)
    await file.button(interaction);
}

/** @param {StringSelectMenuInteraction} interaction */
module.exports.selectMenu = async function (interaction){
    const subcommand = interaction.customId.trim().split(' ')[1];
    const file = require(`./${subcommand}`)
    await file.selectMenu(interaction);
}

const nameLocalizations = getLocalizations(["generic", "player"], true, true)
module.exports.data = new SlashCommandBuilder()
    .setName(nameLocalizations["en-US"])
    .setNameLocalizations(nameLocalizations)
    .setDescription('Displays all your desired player data!')
    .setDescriptionLocalizations({
        nl: 'Toont al jouw gewenste spelerdata!',
    })
    .addSubcommand(info.data)