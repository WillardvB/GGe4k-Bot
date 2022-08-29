const formatNumber = require('./../../../tools/number.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const translationData = require('./../../../ingame_translations/nl.json');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';

const _name = "roofridder buit";
module.exports = {
    name: _name,
    async execute(interaction) {
        let level;
        if (interaction.options) {
            level = interaction.options.getInteger('level');
        }
        else if (interaction.customId) {
            var string = interaction.customId.split(' ');
            level = string[2];
        }
        naarOutput(interaction, level);
    },
};

function naarOutput(interaction, level) {
    let levelString = `**${translationData.generic.dungeon_playerName} ${translationData.generic.level.toLowerCase()} ${level}**`;
    let embed = new EmbedBuilder()
        .setColor('#808080')
        .setTimestamp()
        .setFooter({ text: footerTekst, iconURL: footerAfbeelding })
        .setThumbnail(footerAfbeelding)
        .setTitle(levelString)
        .setDescription(`*${translationData.dialogs.dialog_battleLog_loot}*`)
        .addFields({ name: "**Te behalen buit**", value: krijgBuit(level), inline: true });
    const messRow = new ActionRowBuilder();
    if (level > 1) {
        messRow.addComponents(
            new ButtonBuilder()
                .setLabel('lvl ' + (level - 1))
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`${_name} ${(level * 1 - 1)}`)
        )
    }
    if (level < 81) {
        messRow.addComponents(
            new ButtonBuilder()
                .setLabel('lvl ' + (level * 1 + 1))
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`${_name} ${(level * 1 + 1)}`)
        )
    }
    if (interaction.options) {
        interaction.followUp({ embeds: [embed], components: [messRow] });
    } else {
        interaction.editReply({ embeds: [embed], components: [messRow] });
    }
}

function krijgBuit(lvl) {
    if (!formatNumber.isNum(lvl)) {
        return "~";
    }
    const bs = Math.floor(Math.pow(lvl, 2.2) * 1.2 + 90);
    let munt = 0;
    if (lvl >= 61) {
        munt = Math.floor(Math.pow(lvl, 1.1) * 210);
    }
    else {
        munt = Math.floor(Math.pow(lvl, 2.1) * 3.5 + 25);
    }
    const robsMin = lvl >= 3 ? Math.floor(Math.max(0, (0 * 11 - 5 + lvl * 0.5 + 0.7) * 0.5)) : 0;
    const robsMax = lvl >= 3 ? Math.floor(Math.max(0, (1 * 11 - 5 + lvl * 0.5 + 0.7) * 0.5)) : 0;
    let robs;
    if (robsMin == robsMax) {
        robs = robsMax;
    } else {
        robs = robsMin + '-' + robsMax;
    }
    const output = `${translationData.generic.goods}: ${formatNumber.formatNum(bs)}\n${translationData.generic.cash}: ${formatNumber.formatNum(munt)}\n${translationData.generic.gold}: ${robs}`;
    return output;
}