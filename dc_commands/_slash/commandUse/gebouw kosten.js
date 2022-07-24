const googleSheetsData = require('./../../../data/googleSpreadSheetData.js');
const formatNumber = require('./../../../tools/number.js');
const formatDuration = require('./../../../tools/time.js');
const { MessageEmbed, MessageActionRow, MessageButton, Interaction } = require('discord.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const kostenKol = [21, 22, 82, 81, 48, 49, 35, 36, 112, 42, 23];
const kostenSoort = ["Hout", "Steen", "Houtskool", "Olijfolie", "Glas", "IJzererts", "Bouwmunt", "Upgrademunt", "Aquamarijn", "Robijnen", "Tijd"];

module.exports = {
    name: 'gebouw kosten',
    /**
     * 
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        let level;
        let gebouwnaam;
        if (interaction.options) {
            level = interaction.options.getInteger('level');
            if (level == null) {
                level = 0;
            }
            gebouwnaam = interaction.options.getString('naam');
        }
        else if (interaction.customId) {
            var string = interaction.customId.split(' ');
            level = string[2];
            gebouwnaam = string[3];
            for (i = 4; i < string.length; i++) {
                gebouwnaam += " " + string[i];
            }
        }
        gebouwnaam = gebouwnaam.trim().toLowerCase();
        const data = await googleSheetsData.gebouwData();
        const rows = [...data];
        if (rows.length) {
            let gebouwGevonden = false;
            let levelGevonden = false;
            let hoogsteLevel = 1;
            let laagsteLevel = 550;
            let rijTotalen = [];
            let gebouwGeweest = false;
            let rij = [];
            rows.map(row => {
                if (row[1].toLowerCase() == gebouwnaam) {
                    gebouwGevonden = true;
                    gebouwGeweest = true;
                    laagsteLevel = Math.max(1, Math.min(laagsteLevel, row[12]));
                    hoogsteLevel = Math.max(hoogsteLevel, row[12]);
                    if (row[12] == level) {
                        levelGevonden = true;
                        rij = [...row];
                    }
                    else {
                        if (rijTotalen.length == 0) {
                            rijTotalen = [...row];
                        }
                        else {
                            for (var a = 0; a < row.length; a++) {
                                if (kostenKol.includes(a)) {
                                    if (row[a] != "" && row[a] != null)
                                        rijTotalen[a] = rijTotalen[a] * 1 + row[a] * 1;
                                }
                                else {
                                    rijTotalen[a] = row[a];
                                }
                            }
                        }
                    }
                }
                else {
                    if (levelGevonden && gebouwGeweest) {
                        levelGevonden = false;
                        gebouwGeweest = false;
                        return naarOutput(interaction, rij, level, laagsteLevel, hoogsteLevel);
                    }
                    else if ((level * 1 > hoogsteLevel || level * 1 < laagsteLevel) && gebouwGeweest) {
                        gebouwGeweest = false;
                        naarOutput(interaction, rijTotalen, level, laagsteLevel, hoogsteLevel);
                        rijTotalen = [];
                        return;
                    }
                }
            })
            if (!gebouwGevonden) {
                interaction.followUp({ content: "geef een geldige nederlandse gebouwnaam", ephemeral: true })
            }
        }
    },
};

function naarOutput(interaction, row, level, min, max) {
    kostenOverzicht = "";
    for (var i = 0; i < kostenKol.length; i++) {
        let waarde = row[kostenKol[i]] * 1;
        let soort = kostenSoort[i];
        if (soort == "Tijd") {
            waarde = formatDuration.secToDuration(waarde);
        } else {
            waarde = formatNumber.formatNum(waarde);
        }
        if (waarde != "" && waarde != null) {
            kostenOverzicht += soort + ": `\t\t" + waarde + '`\n';
        }
    }
    let levelString = "";
    if (level * 1 < min || level * 1 > max) {
        levelString = " (totaal van alle levels)";
    }
    else {
        levelString = " (level " + level + ")";
    }
    var embed = new MessageEmbed()
        .setColor('#996515')
        .setTimestamp()
        .setFooter(footerTekst, footerAfbeelding)
        .setTitle("**" + row[1] + "**" + levelString)
        .setDescription(row[156])
        .setThumbnail(row[0])
        .addField("**Kosten**", kostenOverzicht);
    const messRow = new MessageActionRow();
    if (level >= min && level <= max) {
        if (level > min && level <= max) {
            messRow.addComponents(
                new MessageButton()
                    .setLabel('lvl ' + (level * 1 - 1))
                    .setStyle('PRIMARY')
                    .setCustomId('gebouw kosten ' + (level * 1 - 1) + " " + row[1])
            )
        }
        if (level < max && level >= min) {
            messRow.addComponents(
                new MessageButton()
                    .setLabel('lvl ' + (level * 1 + 1))
                    .setStyle('PRIMARY')
                    .setCustomId('gebouw kosten ' + (level * 1 + 1) + " " + row[1])
            )
        }
        messRow.addComponents(
            new MessageButton()
                .setLabel('Totaal alle levels')
                .setStyle('PRIMARY')
                .setCustomId('gebouw kosten -1 ' + row[1])
        )
    }
    else {
        if (min != max) {
            messRow.addComponents(
                new MessageButton()
                    .setLabel('lvl ' + min)
                    .setStyle('PRIMARY')
                    .setCustomId('gebouw kosten ' + min + ' ' + row[1])
            )
        }
        messRow.addComponents(
            new MessageButton()
                .setLabel('lvl ' + max)
                .setStyle('PRIMARY')
                .setCustomId('gebouw kosten ' + max + ' ' + row[1])
        )
    }
    if (interaction.options) {
        interaction.followUp({ embeds: [embed], components: [messRow], ephemeral: true });
    } else {
        interaction.editReply({ embeds: [embed], components: [messRow], ephemeral: true });
    }
}