const stringSimilarity = require("string-similarity");
const {isNum} = require("../../../../tools/number");
const {unitNames} = require("./data")
const {getLocalizations} = require("../../../../tools/localization");
const {getUnitInfoEmbedData} = require("./info");
const {buildEmbeds} = require("../embedBuilder");
const {logError} = require("../../../../tools/Logger");
const {getRawDataUrl} = require("../constants");
const {ActionRowBuilder} = require("discord.js");
const {getLevelChangeComponentRow} = require("../componentBuilder");

const gameData = require("e4k-data").data.units;
const file_name = "units"
module.exports.name = file_name

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.execute = async function (interaction) {
    try {
        const identifier = interaction.options.getString('identifier');
        const output = await handleCommand(interaction, identifier);
        if (output == null) return;
        await interaction.followUp(output)
    } catch (e) {
        await logError(e);
        await interaction.followUp({content: e.toString(), ephemeral: true});
    }
}

/**
 *
 * @param {ButtonInteraction} interaction
 */
module.exports.button = async function (interaction) {
    try {
        const splitCustomId = interaction.customId.trim().split(' ');
        const identifier = splitCustomId[2];
        const isFollowUp = splitCustomId.length >= 4 ? splitCustomId[3] === '1' : false;
        const isPublic = splitCustomId.length >= 5 ? splitCustomId[4] === '1' : false;

        const output = await handleCommand(interaction, identifier);
        if (output == null) return;

        output.ephemeral = !isPublic;

        if (isFollowUp) await interaction.followUp(output); else await interaction.editReply(output);
    } catch (e) {
        await logError(e);
        await interaction.editReply({content: e.toString()});
    }
}

/**
 *
 * @param {AutocompleteInteraction} interaction
 */
module.exports.autocomplete = async function (interaction) {
    let locale = interaction.locale;
    /** @type {AutocompleteFocusedOption} */
    const focusedOption = interaction.options.getFocused(true);
    let choices;
    switch (focusedOption.name) {
        case 'identifier':
            choices = locale === "en-US" || focusedOption.value.trim().length <= 1 ? [...new Set(unitNames.map(x => x[locale]))] : [...new Set(unitNames.map(x => x[locale])), ...new Set(unitNames.map(x => x["en-US"]))]
            break;
        default:
            focusedOption.value = "";
            choices = []
            break;
    }
    if (focusedOption.value.trim().length <= 1) {
        await interaction.respond(choices.filter(c => !isNum(c)).sort().slice(0, 25).map(choice => {
            const nameTranslations = unitNames.find(x => x[locale] === choice);
            return {name: nameTranslations[locale], value: nameTranslations["raw"]}
        }));
        return;
    }
    /** @type {{target:string, rating: number}[]} */
    const matches = stringSimilarity.findBestMatch(focusedOption.value, choices).ratings;
    const names = matches.sort((a, b) => {
        return b.rating - a.rating;
    }).slice(0, 50).map(x => x.target);
    const wodIds = [...new Set(names.map(n => {
        let nameTranslations = unitNames.find(x => x[locale] === n);
        if (nameTranslations == null && locale !== "en-US") nameTranslations = unitNames.find(x => x["en-US"] === n)
        if (nameTranslations == null) nameTranslations = unitNames.find(x => x.raw === n);
        return nameTranslations;
    }).filter(n => n != null).map(v => v.raw))].slice(0, 25)
    await interaction.respond(wodIds.map(wodId => {
        return {name: unitNames.find(n => n.raw === wodId)[locale], value: wodId}
    }));
}

/**
 *
 * @param {ButtonInteraction | ChatInputCommandInteraction} interaction
 * @param {string} identifier
 * @returns {Promise<{embeds: EmbedBuilder[], ephemeral: boolean, components: ActionRowBuilder<AnyComponentBuilder>[]} | null>}
 */
async function handleCommand(interaction, identifier) {
    const locale = interaction.locale;
    if (identifier == null) {
        await interaction.followUp({
            content: getRawDataUrl(file_name), ephemeral: true
        });
        return null;
    }
    const rawData = gameData.find(b => b.wodID === parseInt(identifier));
    if (rawData == null) {
        await interaction.followUp({
            content: getLocalizations(["alerts_and_errors", "alert_accountdeleted_title"])[locale], ephemeral: true
        });
        return;
    }
    const infoData = getUnitInfoEmbedData(rawData, locale);
    const embeds = buildEmbeds(file_name, "#ffc083", infoData).embeds;
    return {embeds: embeds, ephemeral: true, components: getComponents(rawData, locale)}
}

/**
 *
 * @param {Unit} rawData
 * @param {Locale} locale
 * @returns {ActionRowBuilder<AnyComponentBuilder>[]}
 */
function getComponents(rawData, locale) {
    return getLevelChangeComponentRow(`gamedata ${file_name}`, rawData, gameData, locale);
}