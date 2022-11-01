const formatNumber = require('./../../../tools/number.js');
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const translationData = require('./../../../ingame_translations/nl.json');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';

const _name = "roofridder buit";
module.exports = {
    name: _name,
    execute: async function (interaction) {
        let level;
        if (interaction.options) {
            level = interaction.options.getInteger('level');
        } else if (interaction.customId) {
            level = parseInt(interaction.customId.split(' ')[2]);
        }
        await naarOutput(interaction, level);
    },
};

/**
 *
 * @param {CommandInteraction | ButtonInteraction} interaction
 * @param {number} level
 */
async function naarOutput(interaction, level) {
    let levelString = `**${translationData.generic.dungeon_playerName} ${translationData.generic.level.toLowerCase()} ${level}**`;
    let embed = new EmbedBuilder()
        .setColor('#808080')
        .setTimestamp()
        .setFooter({text: footerTekst, iconURL: footerAfbeelding})
        .setThumbnail(footerAfbeelding)
        .setTitle(levelString)
        .setDescription(`*${translationData.dialogs.dialog_battleLog_loot}*`)
        .addFields({name: "**Te behalen buit**", value: getLoot(level), inline: true});
    const messRow = new ActionRowBuilder();
    if (level > 1) {
        messRow.addComponents(
            new ButtonBuilder()
                .setLabel(`${translationData.generic.level} ${level - 1}`)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`${_name} ${(level - 1)}`)
        )
    }
    if (level < 81) {
        messRow.addComponents(
            new ButtonBuilder()
                .setLabel(`${translationData.generic.level} ${level + 1}`)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`${_name} ${(level + 1)}`)
        )
    }
    if (interaction.options) {
        await interaction.followUp({embeds: [embed], components: [messRow]});
    } else {
        await interaction.editReply({embeds: [embed], components: [messRow]});
    }
}

/**
 *
 * @param {number} lvl
 * @returns {string}
 */
function getLoot(lvl) {
    if (!formatNumber.isNum(lvl)) {
        return "~";
    }
    const bs = Math.floor(Math.pow(lvl, 2.2) * 1.2 + 90);
    let munt;
    if (lvl >= 61) {
        munt = Math.floor(Math.pow(lvl, 1.1) * 210);
    } else {
        munt = Math.floor(Math.pow(lvl, 2.1) * 3.5 + 25);
    }
    const robsMin = lvl >= 3 ? Math.floor(Math.max(0, (-5 + lvl * 0.5 + 0.7) * 0.5)) : 0;
    const robsMax = lvl >= 3 ? Math.floor(Math.max(0, (11 - 5 + lvl * 0.5 + 0.7) * 0.5)) : 0;
    let robs;
    if (robsMin === robsMax) {
        robs = robsMax;
    } else {
        robs = robsMin + '-' + robsMax;
    }
    return `${translationData.generic.goods}: ${formatNumber.formatNum(bs)}\n${translationData.generic.cash}: ${formatNumber.formatNum(munt)}\n${translationData.generic.gold}: ${robs}`;
}