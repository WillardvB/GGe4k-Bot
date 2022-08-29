const formatNumber = require('./../../../tools/number.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Interaction, ButtonStyle } = require('discord.js');
const titelInfo = require('./titel info.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const afbeelding = "https://i.pinimg.com/originals/a4/99/32/a49932ed0a33b50f3f2c25f38ba10572.jpg";
let fameTresholds = [];
let beriTresholds = [];

module.exports = {
    name: 'titel houden',
    /**
     * 
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        await interaction.followUp({ content: "Sorry, dit command werkt nog niet!" });
        return;
        let titel;
        let dagen;
        if (interaction.options) {
            titel = interaction.options.getString('titel');
            dagen = interaction.options.getInteger('dagen');
        }
        else if (interaction.customId) {
            var string = interaction.customId.split(' ');
            dagen = string[2];
            titel = string[3];
            for (i = 4; i < string.length; i++) {
                titel += " " + string[i];
            }
        }
        titel = titel.trim().toLowerCase();
        const data = await googleSheetsData.titelData();
        const rows = [...data];
        if (rows.length) {
            if (fameTresholds.length == 0) {
                setTresholds(rows);
            }
            let titelGevonden = false;
            let soort;
            rows.map(row => {
                if (row[0].toLowerCase() == titel || row[1] == titel && formatNumber.isNum(titel)) {
                    titelGevonden = true;
                    soort = row[2];
                    if (row[3]) {
                        if (soort == "FAME") {
                            soort = "roempunten";
                        }
                        else if (soort == "FACTION") {
                            soort = "berimondscore";
                        }
                        naarOutput(interaction, row, dagen, soort);
                    }
                    else {
                        titelInfo.output(interaction, row);
                    }
                }
            });
            if (!titelGevonden) {
                return interaction.followUp({
                    content:
                        'ik heb de gevraagde titel niet kunnen vinden. Zie `gge titel namen` voor de mogelijkheden'
                });
            }
        }
    },
};

function naarOutput(interaction, row, dagen, soort) {
    benodigdeWaarde = bereken(row[3], dagen, soort);
    var meervoudEN = '';
    if (dagen > 1) {
        meervoudEN = 'en';
    }
    dagen = formatNumber.formatNum(dagen);
    benodigdeWaarde = formatNumber.formatNum(benodigdeWaarde);
    var embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTimestamp()
        .setFooter({ text: footerTekst, iconURL: footerAfbeelding })
        .setTitle("**" + row[0] + "**")
        .setDescription("*Titel behouden*")
        .setThumbnail(afbeelding)
        .addFields({ name: "Aantal dagen", value: dagen.toString() })
        .addFields({ name: "Benodigde " + soort, value: benodigdeWaarde.toString() });
    const messRow = new ActionRowBuilder();
    if (dagen > 1) {
        messRow.addComponents(
            new ButtonBuilder()
                .setLabel((dagen - 1) + ' dagen houden')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('titel houden ' + (dagen - 1) + " " + row[0])
        )
    }
    messRow.addComponents(
        new ButtonBuilder()
            .setLabel('Titel info')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('titel info ' + row[0])
    )
    messRow.addComponents(
        new ButtonBuilder()
            .setLabel((dagen + 1) + ' dagen houden')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('titel houden ' + (dagen + 1) + " " + row[0])
    )
    if (interaction.options) {
        interaction.followUp({ embeds: [embed], components: [messRow] });
    } else {
        interaction.editReply({ embeds: [embed], components: [messRow] });
    }
}

function bereken(benodigdVoorTitel, dagen, soort) {
    let uitkomst = benodigdVoorTitel;
    for (var i = 0; i < dagen; i++) {
        let tempPerc = 0;
        if (soort == 'roempunten') {
            for (var j = fameTresholds.length; j > 0; j--) {
                if (fameTresholds[j - 1] <= uitkomst) {
                    tempPerc = (j - 1) / 100;
                    j = 0;
                }
            }
        } else if (soort == 'berimondscore') {
            for (var j = beriTresholds.length; j > 0; j--) {
                if (beriTresholds[j - 1] <= uitkomst) {
                    tempPerc = (j - 1) / 100;
                    j = 0;
                }
            }
        }
        let deling = 1 - tempPerc;
        uitkomst /= deling;
        uitkomst = Math.ceil(uitkomst);
    }
    return uitkomst;
}

function setTresholds(rows) {
    let decayInLoop = -1;
    rows.map(row => {
        if (row[2] == 'FAME') {
            if (parseInt(row[4]) > decayInLoop) {
                if (parseInt(row[4]) > decayInLoop + 1) {
                    fameTresholds.push(parseInt(row[3]) - 1);
                }
                fameTresholds.push(parseInt(row[3]));
                decayInLoop = parseInt(row[4]);
            }
        }
        else if (row[2] == 'ISLE') {
            decayInLoop = -1;
            //storm titels staan in midden -> huidige decay resetten
        }
        else if (row[2] == 'FACTION') {
            if (parseInt(row[4]) > decayInLoop) {
                if (parseInt(row[4]) > decayInLoop + 1) {
                    beriTresholds.push(parseInt(row[3]) - 1);
                }
                beriTresholds.push(parseInt(row[3]));
                decayInLoop = parseInt(row[4]);
            }
        }
    })
}