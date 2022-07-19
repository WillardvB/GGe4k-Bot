const googleSheetsData = require('./../../../data/googleSpreadSheetData.js');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, Interaction } = require('discord.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const afbeelding = "https://i.pinimg.com/originals/a4/99/32/a49932ed0a33b50f3f2c25f38ba10572.jpg";

module.exports = {
    name: 'titel namen',
    /**
     * 
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        let soort;
        if (interaction.options) {
            soort = interaction.options.getString('soort');
        }
        else if (interaction.customId) {
            soort = interaction.values[0];
        }
        const rows = await googleSheetsData.titelData(interaction.client);
        if (rows.length) {
            var roemTitels = '';
            var beriTitels = '';
            var stormTitels = '';
            rows.map(row => {
                if (row[2] == 'FAME') {
                    roemTitels = roemTitels + '`' + row[1] + "`. " + row[0] + '\n';
                } else if (row[2] == 'FACTION') {
                    beriTitels = beriTitels + '`' + row[1] + "`. " + row[0] + '\n';
                } else if (row[2] == 'ISLE') {
                    stormTitels = stormTitels + '`' + row[1] + "`. " + row[0] + '\n';
                }
            });
            var embed = new MessageEmbed()
                .setColor('#FFD700')
                .setTimestamp()
                .setFooter(footerTekst, footerAfbeelding)
                .setDescription("*De titelnummers en -namen*")
                .setThumbnail(afbeelding)
            embed = voegVeldenToe(embed, soort, roemTitels, beriTitels, stormTitels);
            const messRow = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('titel namen')
                        .setPlaceholder('Nothing selected')
                        .addOptions([
                            {
                                label: 'Roem',
                                value: 'roem',
                            },
                            {
                                label: 'Berimond',
                                value: 'beri',
                            },
                            {
                                label: 'Storm',
                                value: 'storm',
                            },
                            {
                                label: 'Alle',
                                value: '*',
                            }
                        ]),
                );
            if (interaction.options) {
                interaction.followUp({ embeds: [embed], components: [messRow], ephemeral: true });
            } else {
                interaction.editReply({ embeds: [embed], components: [messRow], ephemeral: true });
            }
        }
    },
};

function voegVeldenToe(embed, soort, roemTitels, beriTitels, stormTitels) {
    if (soort == "roem") {
        embed
            .setTitle('**Alle roemtitels**')
            .addField('**Roemtitels**: ', roemTitels);
    }
    else if (soort == "beri") {
        embed
            .setTitle('**Alle berimondtitels**')
            .addField('**Berimondtitels**: ', beriTitels);
    }
    else if (soort == "storm") {
        embed
            .setTitle('**Alle stormtitels**')
            .addField('**Stormtitels**: ', stormTitels);
    }
    else {
        embed
            .setTitle('**Alle titels**')
            .addField('**Roemtitels**: ', roemTitels, true)
            .addField('**Berimondtitels**: ', beriTitels, true)
            .addField('**Stormtitels**: ', stormTitels, true);
    }
    return embed;
}