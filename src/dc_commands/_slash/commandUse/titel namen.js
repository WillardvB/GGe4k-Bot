const {
    getName: getTitleName
} = require('../commandHelpers/titel');
const e4kData = require('e4k-data');
const titleData = e4kData.data.titles;
const {EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder} = require('discord.js');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const afbeelding = "https://i.pinimg.com/originals/a4/99/32/a49932ed0a33b50f3f2c25f38ba10572.jpg";
const titleTypes = ['FAME', 'FACTION', 'ISLE'];

module.exports = {
    name: 'titel namen', /**
     *
     * @param {CommandInteraction | SelectMenuInteraction } interaction
     */
    async execute(interaction) {
        try {
            let type;
            if (interaction.options) type = interaction.options.getString('type'); else if (interaction.customId) type = interaction.values[0];
            let titles = type != null ? titleData.filter(t => t.type === type) : [...titleData];
            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTimestamp()
                .setFooter({text: footerTekst, iconURL: footerAfbeelding})
                .setDescription("*De titelnamen en -nummers*")
                .setThumbnail(afbeelding)
                .setTitle(getEmbedTitle(type))
                .setFields(...getEmbedFields(type, titles))

            const messRow = new ActionRowBuilder()
                .addComponents(new StringSelectMenuBuilder()
                    .setCustomId('titel namen')
                    .setPlaceholder('Nothing selected')
                    .addOptions({
                        label: 'Roem', value: 'FAME',
                    }, {
                        label: 'Berimond', value: 'FACTION',
                    }, {
                        label: 'Storm', value: 'ISLE',
                    }, {
                        label: 'Alle', value: '*',
                    }));
            if (interaction.options) {
                await interaction.followUp({embeds: [embed], components: [messRow]});
            } else {
                await interaction.editReply({embeds: [embed], components: [messRow]});
            }
        } catch (e) {
            console.log(e);
            await interaction.followUp({content: e.toString()});
        }
    },
};

/**
 *
 * @param {string} type
 * @param {Title[]} titles
 * @return {{name: string, value: string, inline?: boolean}[]}
 */
function getEmbedFields(type, titles) {
    let titleNames = "";
    if (titleTypes.includes(type)) {
        for (let t of titles) {
            titleNames += `- ${getTitleName(t)} (${t.titleID})\n`;
        }
        const fieldName = type === 'FAME' ? '**Roemtitels**: ' : type === 'FACTION' ? '**Berimondtitels**: ' : type === 'ISLE' ? '**Stormtitels**: ' : type;
        return [{name: fieldName, value: titleNames.trim()}];
    } else {
        let fields = [];
        for (let i of titleTypes) {
            titleNames = "";
            const _titles = titles.filter(t => t.type === i);
            for (let t of _titles) {
                titleNames += `- ${getTitleName(t)} (${t.titleID})\n`;
            }
            const fieldName = i === 'FAME' ? '**Roemtitels**: ' : i === 'FACTION' ? '**Berimondtitels**: ' : i === 'ISLE' ? '**Stormtitels**: ' : i;
            fields.push({name: fieldName, value: titleNames.trim(), inline: true});
        }
        return fields;
    }
}

/**
 *
 * @param {string} type
 * @return {string}
 */
function getEmbedTitle(type) {
    switch (type) {
        case "FAME":
            return '**Alle roemtitels**'
        case 'FACTION':
            return '**Alle berimondtitels**'
        case 'ISLE':
            return '**Alle stormtitels**'
        default:
            return '**Alle titels**'
    }
}