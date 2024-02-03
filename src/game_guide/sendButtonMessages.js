const {ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const guideGuildId = "1161026424422027305";

module.exports.sendGameGuideButtonMessages = async function () {
    /** @type {Guild}*/
    let guild = require('../index').dcClient.guilds.cache.find(guild => guild.id === guideGuildId);

    return;

    const castleGuideChannel = await guild.channels.fetch('1161026425764184100');

    const messRow = new ActionRowBuilder();

    /** @type {Message} */
    let message = await castleGuideChannel.messages.fetch('1167442968932790372');
    messRow.setComponents(new ButtonBuilder()
        .setLabel('Kazerne')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`gamedata buildings 1939 1`))
    await message.edit({content: '', components: [messRow]})

    message = await castleGuideChannel.messages.fetch('1167443059642990592');
    messRow.setComponents(new ButtonBuilder()
        .setLabel('Oefenterrein')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`gamedata buildings 63 1`))
    await message.edit({content: '', components: [messRow]})

    message = await castleGuideChannel.messages.fetch('1167443624301178941');
    messRow.setComponents(new ButtonBuilder()
        .setLabel('Belegeringswerkplaats')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`gamedata buildings 256 1`))
    await message.edit({content: '', components: [messRow]})
}