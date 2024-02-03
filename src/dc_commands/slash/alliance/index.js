const {SlashCommandBuilder} = require("@discordjs/builders");
const info = require('./info/index');
const members = require('./members/index');
const {getLocalizations} = require("../../../tools/localization");

module.exports.name = "alliance"

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

/** @param {SelectMenuInteraction} interaction */
module.exports.selectMenu = async function (interaction){
    const subcommand = interaction.customId.trim().split(' ')[1];
    const file = require(`./${subcommand}`)
    await file.selectMenu(interaction);
}

const nameLocalizations = getLocalizations(["generic", "alliance"], true, true)
module.exports.data = new SlashCommandBuilder()
    .setName(nameLocalizations["en-US"])
    .setNameLocalizations(nameLocalizations)
    .setDescription('Displays all your desired alliance data!')
    .setDescriptionLocalizations({
        nl: 'Toont al je gewenste bondgenootschap-gegevens!',
    })
    .addSubcommand(members.data)
    .addSubcommand(info.data)