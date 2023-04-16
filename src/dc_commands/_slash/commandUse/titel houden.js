const {formatNum} = require('./../../../tools/number.js');
const {
    EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction
} = require('discord.js');
const {
    getName: getTitleName, getRawData: getTitleRawData, handleNotFound: handleTitleNotFound
} = require('../commandHelpers/titel');
const titelInfo = require('./titel info.js');
const e4kData = require("e4k-data");
const titleData = e4kData.data.titles;
const translationData = e4kData.languages.nl;
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';
const afbeelding = "https://i.pinimg.com/originals/a4/99/32/a49932ed0a33b50f3f2c25f38ba10572.jpg";
let fameThresholds = [];
let factionThresholds = [];

const commandName = 'titel houden'
module.exports = {
    name: commandName, /**
     *
     * @param {CommandInteraction|ButtonInteraction} interaction
     */
    async execute(interaction) {
        try {
            /** @type {string} */
            let titel;
            /** @type {number} */
            let days;
            if (interaction.options) {
                titel = interaction.options.getString('titel');
                days = interaction.options.getInteger('dagen');
            } else if (interaction.customId) {
                let string = interaction.customId.split(' ');
                days = parseInt(string[2]);
                titel = string[3];
                for (let i = 4; i < string.length; i++) {
                    titel += " " + string[i];
                }
            }
            titel = titel.trim().toLowerCase();
            let thisTitleData = getTitleRawData(titel);
            if (thisTitleData == null) {
                await handleTitleNotFound(interaction, titel, `${commandName} ${days}`)
                return;
            }
            if (thisTitleData.threshold !== undefined) await naarOutput(interaction, thisTitleData, days); else await titelInfo.output(interaction, thisTitleData);
        } catch (e) {
            console.log(e);
            await interaction.followUp({content: e.toString()});
        }
    },
};

/**
 *
 * @param {CommandInteraction} interaction
 * @param {Title} data
 * @param {number} days
 * @returns {Promise<void>}
 */
async function naarOutput(interaction, data, days) {
    let neededPoints = calculate(data.threshold, days, data.type);
    neededPoints = formatNum(neededPoints);
    const typeString = data.type === 'FAME' ? translationData.dialogs.dialog_fame_title : data.type === 'FACTION' ? translationData.dialogs.dialog_BerimondPointsEvent_points : data.type;
    let embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTimestamp()
        .setFooter({text: footerTekst, iconURL: footerAfbeelding})
        .setTitle(`**${getTitleName(data)}**`)
        .setDescription("*Titel behouden*")
        .setThumbnail(afbeelding)
        .addFields({name: "Aantal dagen", value: formatNum(days)}, {
            name: "Benodigde " + typeString, value: neededPoints.toString()
        });

    if (interaction.options) {
        await interaction.followUp({embeds: [embed], components: getComponents(data, days)});
    } else {
        await interaction.editReply({embeds: [embed], components: getComponents(data, days)});
    }
}

/**
 *
 * @param {number} thresholdForLevel
 * @param {number} days
 * @param {string} type
 * @return {number}
 */
function calculate(thresholdForLevel, days, type) {
    let solution = thresholdForLevel;
    for (let i = 0; i < days; i++) {
        let tempPercentage = 0;
        if (type === 'FAME') {
            for (let j = fameThresholds.length; j > 0; j--) {
                if (fameThresholds[j - 1] <= solution) {
                    tempPercentage = (j - 1) / 100;
                    j = 0;
                }
            }
        } else if (type === 'FACTION') {
            for (let j = factionThresholds.length; j > 0; j--) {
                if (factionThresholds[j - 1] <= solution) {
                    tempPercentage = (j - 1) / 100;
                    j = 0;
                }
            }
        }
        let deling = 1 - tempPercentage;
        solution /= deling;
        solution = Math.ceil(solution);
    }
    return solution;
}

/**
 *
 * @param {Title} data
 * @param {number} days
 * @return {ActionRowBuilder<AnyComponentBuilder>[]}
 */
function getComponents(data, days) {
    const messRow = new ActionRowBuilder();
    if (days > 1) {
        messRow.addComponents(new ButtonBuilder()
            .setLabel(`${formatNum(days - 1)} dag${days - 1 === 1 ? '' : 'en'} houden`)
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`${commandName} ${(days - 1)} ${data.titleID}`))
    }
    messRow.addComponents(new ButtonBuilder()
        .setLabel(`${formatNum(days + 1)} dag${days + 1 === 1 ? '' : 'en'} houden`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`${commandName} ${(days + 1)} ${data.titleID}`))
    const messRow2 = new ActionRowBuilder().addComponents(new ButtonBuilder()
        .setLabel('Titel info')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`${titelInfo.name} ${data.titleID}`))
    return [messRow, messRow2];
}

function setThresholds() {
    let factionDecay = -1;
    let fameDecay = -1;
    for (let t of titleData) {
        if (t.type === 'FAME') {
            if (t.decay > fameDecay) {
                if (t.decay > fameDecay + 1) {
                    fameThresholds.push(t.threshold - 1);
                }
                fameThresholds.push(t.threshold);
                fameDecay = t.decay;
            }
        } else if (t.type === 'FACTION') {
            if (t.decay > factionDecay) {
                if (t.decay > factionDecay + 1) {
                    factionThresholds.push(t.threshold - 1);
                }
                factionThresholds.push(t.threshold);
                factionDecay = t.decay;
            }
        }
    }
}

setThresholds();