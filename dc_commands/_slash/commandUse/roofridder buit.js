const formatNumber = require('./../../../tools/number.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';

module.exports = {
    name: 'roofridder buit',
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
    let levelString = `**Roofridder level ${level}**`;
    let embed = new MessageEmbed()
        .setColor('#808080')
        .setTimestamp()
        .setFooter(footerTekst, footerAfbeelding)
        .setThumbnail(footerAfbeelding)
        .setTitle(levelString)
        .setDescription("*roofridder buit*")
        .addField("**Te behalen buit**", krijgBuit(level), true);
    const messRow = new MessageActionRow();
    if (level > 1) {
        messRow.addComponents(
            new MessageButton()
                .setLabel('lvl ' + (level - 1))
                .setStyle('PRIMARY')
                .setCustomId('roofridder buit ' + (level * 1 - 1))
        )
    }
    if (level < 81) {
        messRow.addComponents(
            new MessageButton()
                .setLabel('lvl ' + (level * 1 + 1))
                .setStyle('PRIMARY')
                .setCustomId('roofridder buit ' + (level * 1 + 1))
        )
    }
    if (interaction.options) {
        interaction.followUp({ embeds: [embed], components: [messRow], ephemeral: true });
    } else {
        interaction.editReply({ embeds: [embed], components: [messRow], ephemeral: true });
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
    const output = `BS: ${formatNumber.formatNum(bs)}\nMunten: ${formatNumber.formatNum(munt)}\nRobijnen: ${robs}`;
    return output;
}