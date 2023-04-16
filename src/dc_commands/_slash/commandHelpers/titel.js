const e4kData = require("e4k-data");
const translationData = e4kData.languages.nl;
const titleData = e4kData.data.titles;
const {isNum} = require("../../../tools/number");
const stringSimilarity = require("string-similarity");
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

/** @type {string[]} */
const translations = [];
for (let t of titleData) {
    translations.push(getTitleName(t));
}

module.exports = {
    getRawData: getTitleRawData,
    getName: getTitleName,
    getSuggestions: getTitleSuggestions,
    handleNotFound: handleTitleNotFound,
}

/**
 *
 * @param {Title} data
 * @returns {string}
 */
function getTitleName(data) {
    return translationData.playertitles[`playerTitle_${data.titleID}`] ?? translationData.generic[`playerTitle_${data.titleID}`];
}

/**
 *
 * @param {string | number} title
 */
function getTitleRawData(title) {
    if (isNum(title)) {
        return titleData.find(t => t.titleID === parseInt(title));
    } else {
        let bestMatch = getTitleSuggestions(title)[0];
        if (bestMatch.toLowerCase() !== title.toLowerCase()) return null;
        return titleData[translations.indexOf(bestMatch)];
    }
}

/**
 *
 * @param {string | number} title
 * @return {string[]}
 */
function getTitleSuggestions(title) {
    /** @type {{target:string, rating: number}[]} */
    let matches = stringSimilarity.findBestMatch(title, translations).ratings;
    matches = matches.sort((a, b) => {
        return b.rating - a.rating;
    }).slice(0, 5);
    const suggestions = [];
    matches.forEach(m => suggestions.push(m.target));
    return suggestions;
}

/**
 *
 * @param {CommandInteraction} interaction
 * @param {string} title
 * @param {string} commandName
 * @return {Promise<void>}
 */
async function handleTitleNotFound(interaction, title, commandName) {
    if (isNum(title)) {
        await interaction.followUp({
            embeds: [new EmbedBuilder().setDescription('Ik heb de gevraagde titel niet kunnen vinden. Zie `/titel namen` voor de mogelijkheden')]
        });
    } else {
        const titleNameSuggestions = getTitleSuggestions(title);
        const messRow = new ActionRowBuilder();
        for (let n of titleNameSuggestions) {
            messRow.addComponents(new ButtonBuilder()
                .setCustomId(`${commandName} ${n}`)
                .setLabel(n)
                .setStyle(ButtonStyle.Primary));
        }
        await interaction.followUp({
            embeds: [new EmbedBuilder().setDescription("Ik kan de title met de opgegeven naam niet vinden!\n\nBedoelde je:")],
            components: [messRow]
        });
    }
}