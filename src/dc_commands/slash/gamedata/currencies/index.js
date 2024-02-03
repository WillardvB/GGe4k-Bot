const stringSimilarity = require("string-similarity");
const currencyData = require("e4k-data").data.currencies;
const {isNum} = require("../../../../tools/number");
const {currencyNames} = require("./data")
const {getLocalizations} = require("../../../../tools/localization");
const {getCurrencyInfoEmbedData} = require("./info");
const {buildEmbeds} = require("../embedBuilder");
const {logError} = require("../../../../tools/Logger");
const {getRawDataUrl} = require("../constants");

const file_name = "currencies"
module.exports.name = file_name

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.execute = async function (interaction) {
    const locale = interaction.locale;

    try {
        const identifier = interaction.options.getString('identifier');
        if (identifier == null) {
            await interaction.followUp({
                content: `${getRawDataUrl(file_name)}`,
                ephemeral: true
            });
            return;
        }

        const rawData = currencyData.find(b => b.currencyID === parseInt(identifier));
        if (rawData == null) {
            await interaction.followUp({
                content: getLocalizations(["alerts_and_errors", "alert_accountdeleted_title"])[locale], ephemeral: true
            });
            return;
        }
        const infoData = getCurrencyInfoEmbedData(rawData, locale);
        const embeds = buildEmbeds(file_name, "#ffc083", infoData).embeds;
        await interaction.followUp({embeds: embeds, ephemeral: true})
    } catch (e) {
        await logError(e);
        await interaction.followUp({content: e.toString(), ephemeral: true});
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
            choices = locale === "en-US" || focusedOption.value.trim().length <= 1 ? [...new Set(currencyNames.map(x => x[locale]))] : [...new Set(currencyNames.map(x => x[locale])), ...new Set(currencyNames.map(x => x["en-US"]))]
            break;
        default:
            focusedOption.value = "";
            choices = []
            break;
    }
    if (focusedOption.value.trim().length <= 1) {
        await interaction.respond(choices.filter(c => !isNum(c)).sort().slice(0, 25).map(choice => {
            const nameTranslations = currencyNames.find(x => x[locale] === choice);
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
        let nameTranslations = currencyNames.find(x => x[locale] === n);
        if (nameTranslations == null && locale !== "en-US") nameTranslations = currencyNames.find(x => x["en-US"] === n)
        if (nameTranslations == null) nameTranslations = currencyNames.find(x => x.raw === n);
        return nameTranslations;
    }).filter(n => n != null).map(v => v.raw))].slice(0, 25)
    await interaction.respond(wodIds.map(wodId => {
        return {name: currencyNames.find(n => n.raw === wodId)[locale], value: wodId}
    }));
}