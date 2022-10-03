const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, Interaction } = require('discord.js');
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
        await interaction.followUp({ content: "Sorry, dit command werkt nog niet!" });
        return;
        let soort;
        if (interaction.options) {
            soort = interaction.options.getString('soort');
        }
        else if (interaction.customId) {
            soort = interaction.values[0];
        }
        const rows = await googleSheetsData.titelData();
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
            var embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTimestamp()
                .setFooter({ text: footerTekst, iconURL: footerAfbeelding })
                .setDescription("*De titelnummers en -namen*")
                .setThumbnail(afbeelding)
            embed = voegVeldenToe(embed, soort, roemTitels, beriTitels, stormTitels);
            const messRow = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
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
                interaction.followUp({ embeds: [embed], components: [messRow] });
            } else {
                interaction.editReply({ embeds: [embed], components: [messRow] });
            }
        }
    },
};

function voegVeldenToe(embed, soort, roemTitels, beriTitels, stormTitels) {
    if (soort == "roem") {
        embed
            .setTitle('**Alle roemtitels**')
            .addFields({ name: '**Roemtitels**: ', value: roemTitels });
    }
    else if (soort == "beri") {
        embed
            .setTitle('**Alle berimondtitels**')
            .addFields({ name: '**Berimondtitels**: ', value: beriTitels });
    }
    else if (soort == "storm") {
        embed
            .setTitle('**Alle stormtitels**')
            .addFields({ name: '**Stormtitels**: ', value: stormTitels });
    }
    else {
        embed
            .setTitle('**Alle titels**')
            .addFields({ name: '**Roemtitels**: ', value: roemTitels, inline: true })
            .addFields({ name: '**Berimondtitels**: ', value: beriTitels, inline: true })
            .addFields({ name: '**Stormtitels**: ', value: stormTitels, inline: true });
    }
    return embed;
}