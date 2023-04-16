const empire = require('./../../../empireClient');
const worldmapHelper = require('./../commandHelpers/worldmap');
const {AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const translationData = require('e4k-data').languages.nl;

const _name = 'worldmap alliance';
module.exports = {
    name: _name,
    description: 'Creates a worldmap image of the alliance!',
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    execute: async function (interaction) {
        try {
            let customIdData = interaction.customId.split(' ');
            let alliance_id = parseInt(customIdData[2]);
            let kingdomId = parseInt(customIdData[3])
            let castleZoom = parseFloat(customIdData[4]);
            let mapZoom = parseFloat(customIdData[5]);
            let offsetBlocksX = parseFloat(customIdData[6]);
            let offsetBlocksY = parseFloat(customIdData[7]);
            let alliance = await empire.client.alliances.getById(alliance_id);
            const allianceWorldmap = await worldmapHelper.getAllianceMap(alliance, kingdomId, castleZoom, mapZoom, offsetBlocksX, offsetBlocksY);
            const image = new AttachmentBuilder(allianceWorldmap, {
                name: "Wereldkaart.png",
                description: `Wereldkaart van ${alliance.allianceName}`
            });
            const components = [];
            const messRowMapZoom = new ActionRowBuilder();
            if (mapZoom < 40) {
                messRowMapZoom.addComponents(
                    new ButtonBuilder()
                        .setLabel(translationData.generic.panel_option_zoomIn)
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`${_name} ${alliance.allianceId} ${kingdomId} ${Math.min(castleZoom, mapZoom + 1)} ${mapZoom + 1} ${mapZoom === 1 ? 0.5 : offsetBlocksX / (mapZoom - 1) * mapZoom} ${mapZoom === 1 ? 0.5 : offsetBlocksY / (mapZoom - 1) * mapZoom}`)
                );
            }
            if (mapZoom > 1) {
                messRowMapZoom.addComponents(
                    new ButtonBuilder()
                        .setLabel(translationData.generic.panel_option_zoomOut)
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`${_name} ${alliance.allianceId} ${kingdomId} ${Math.min(castleZoom, mapZoom - 1)} ${mapZoom - 1} ${offsetBlocksX * (mapZoom - 2) / (mapZoom - 1)} ${offsetBlocksY * (mapZoom - 2) / (mapZoom - 1)}`)
                );
            }
            if (mapZoom < 10 || mapZoom > 1) components.push(messRowMapZoom);
            const messRowObjectZoom = new ActionRowBuilder();
            if (castleZoom < mapZoom) {
                messRowObjectZoom.addComponents(
                    new ButtonBuilder()
                        .setLabel("Objecten vergroten")
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`${_name} ${alliance.allianceId} ${kingdomId} ${castleZoom + 1} ${mapZoom} ${offsetBlocksX} ${offsetBlocksY}`)
                );
            }
            if (castleZoom > 1) {
                messRowObjectZoom.addComponents(
                    new ButtonBuilder()
                        .setLabel("Objecten verkleinen")
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`${_name} ${alliance.allianceId} ${kingdomId} ${castleZoom - 1} ${mapZoom} ${offsetBlocksX} ${offsetBlocksY}`)
                );
            }
            if (castleZoom < mapZoom || castleZoom > 1) components.push(messRowObjectZoom);
            const messRowMoveUp = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setEmoji('⚫')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`empty1`)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setEmoji('⬆')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`${_name} ${alliance.allianceId} ${kingdomId} ${castleZoom} ${mapZoom} ${offsetBlocksX} ${offsetBlocksY - 1/3}`)
                    .setDisabled(offsetBlocksY <= 0),
                new ButtonBuilder()
                    .setEmoji('⚫')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`empty2`)
                    .setDisabled(true)
            );
            const messRowMoveMiddle = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setEmoji('⬅')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`${_name} ${alliance.allianceId} ${kingdomId} ${castleZoom} ${mapZoom} ${offsetBlocksX - 1/3} ${offsetBlocksY}`)
                    .setDisabled(offsetBlocksX <= 0),
                new ButtonBuilder()
                    .setEmoji('⚫')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`empty3`)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setEmoji('➡')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`${_name} ${alliance.allianceId} ${kingdomId} ${castleZoom} ${mapZoom} ${offsetBlocksX + 1/3} ${offsetBlocksY}`)
                    .setDisabled(offsetBlocksX >= mapZoom - 1)
            );
            const messRowMoveDown = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setEmoji('⚫')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`empty4`)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setEmoji('⬇')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`${_name} ${alliance.allianceId} ${kingdomId} ${castleZoom} ${mapZoom} ${offsetBlocksX} ${offsetBlocksY + 1/3}`)
                    .setDisabled(offsetBlocksY >= mapZoom - 1),
                new ButtonBuilder()
                    .setEmoji('⚫')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`empty5`)
                    .setDisabled(true)
            );
            components.push(messRowMoveUp, messRowMoveMiddle, messRowMoveDown);
            if (interaction.message.embeds.length === 0) {
                await interaction.editReply({embeds: [], files: [image], components: components});
            } else {
                await interaction.followUp({embeds: [], files: [image], components: components, ephemeral: true});
            }
        } catch (e) {
            console.log(e);
            await interaction.followUp({content: e.toString()});
        }
    }
}