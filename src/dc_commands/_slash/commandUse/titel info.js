const {
    getName: getTitleName, getRawData: getTitleRawData, handleNotFound: handleTitleNotFound
} = require('../commandHelpers/titel');
const e4kData = require('e4k-data');
const titleData = e4kData.data.titles;
const translationData = e4kData.languages.nl;
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const {formatNum} = require("../../../tools/number");
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const afbeelding = "https://i.pinimg.com/originals/a4/99/32/a49932ed0a33b50f3f2c25f38ba10572.jpg";

const commandName = 'titel info';
module.exports = {
    name: commandName, /**
     *
     * @param {CommandInteraction | ButtonInteraction} interaction
     */
    async execute(interaction) {
        try {
            /** @type {string} */
            let titel;
            if (interaction.options) {
                titel = interaction.options.getString('titel');
            } else if (interaction.customId) {
                const string = interaction.customId.split(' ');
                titel = string[2];
                for (let i = 3; i < string.length; i++) {
                    titel += " " + string[i];
                }
            }
            titel = titel.trim().toLowerCase();

            let thisTitleData = getTitleRawData(titel);
            if (thisTitleData == null) {
                await handleTitleNotFound(interaction, titel, commandName)
                return;
            }
            await naarOutput(interaction, thisTitleData);
        } catch (e) {
            console.log(e);
            await interaction.followUp({content: e.toString()});
        }
    }, /**
     *
     * @param {CommandInteraction | ButtonInteraction} interaction
     * @param {Title} data
     * @return {Promise<void>}
     */
    async output(interaction, data) {
        await naarOutput(interaction, data);
    }
};

/**
 *
 * @param {CommandInteraction | ButtonInteraction} interaction
 * @param {Title} data
 */
async function naarOutput(interaction, data) {
    try {
        let requirements = getRequirements(data);
        let mightPoints = formatNum(data.mightValue);
        let displayType = translationData.dialogs[`dialog_titles_${data.displayType}`];
        let decay = data.decay ?? 0;
        let embedData = `- **${translationData.dialogs.mightPoints}:** ${mightPoints}\n${requirements}\n- **Afname per dag:** ${decay}%\n- **Weergave-info:** ${displayType}`;
        let embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTimestamp()
            .setFooter({text: footerTekst, iconURL: footerAfbeelding})
            .setTitle(`**${getTitleName(data)}**`)
            .setDescription(`*${translationData.generic.ringmenu_info}*`)
            .setThumbnail(afbeelding)
            .addFields({name: "**Data**", value: embedData});
        if (data.rewardID) embed.addFields({
            name: `**${translationData.generic.reward}**`, value: '*rewardId: ' + data.rewardID + '*'
        });
        if (data.effects) embed.addFields({
            name: `**${translationData.generic.reward}**`, value: '*effects: ' + data.effects + '*'
        });
        if (interaction.options) {
            await interaction.followUp({embeds: [embed], components: getComponents(data)});
        } else {
            await interaction.editReply({embeds: [embed], components: getComponents(data)});
        }
    } catch (e) {
        console.log(e);
        await interaction.followUp({content: e.toString()});
    }
}

/**
 *
 * @param {Title} data
 * @return {string}
 */
function getRequirements(data) {
    let type = data.type;
    let val = "";
    if (data.topX) {
        type = type === 'ISLE' ? 'rank in het storm top1 BG' : type === 'FACTION' ? 'rank in berimondklassement' : type === 'FAME' ? 'rank in roemklassement' : type;
        val = translationData.generic.ranking_topX.replace('{0}', data.topX.toString());
    } else {
        type = type === 'FACTION' ? translationData.generic.factionHighscore_points : type === 'FAME' ? translationData.dialogs.dialog_fame_fame : type;
        val = data.threshold ? formatNum(data.threshold) : 0;
    }
    return `- **Benodigde ${type}:** ${val}`;
}

/**
 *
 * @param {Title} data
 * @return {ActionRowBuilder<AnyComponentBuilder>[]}
 */
function getComponents(data) {
    const messRow = new ActionRowBuilder();
    if (data.previousTitleID) {
        messRow.addComponents(new ButtonBuilder()
            .setLabel(getTitleName(getTitleRawData(data.previousTitleID)))
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`${commandName} ${data.previousTitleID}`))
    }
    const nextTitle = titleData.find(t => t.previousTitleID === data.titleID);
    if (nextTitle) {
        messRow.addComponents(new ButtonBuilder()
            .setLabel(getTitleName(nextTitle))
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`${commandName} ${nextTitle.titleID}`))
    }
    return [messRow];
}