const {SlashCommandBuilder} = require("@discordjs/builders");
const {getLocalizations} = require("../../../tools/localization");
const stringSimilarity = require("string-similarity");
const {data: e4kData} = require("e4k-data");
const {getRawDataUrl} = require("./constants");
const {log} = require("../../../tools/Logger");

const dataTypeOptions = Object.keys(e4kData).map(t => {
    /** @type {{"en-US": string, [p: string]: string}} */
    let option = {}
    switch (t) {
        case "buildings":
            option = getLocalizations(["generic", "buildings"]);
            break;
        case "units":
            option = {"en-US": "Units and tools", "nl": "Eenheden en tuigen"};
            break;
        case "dungeons":
            option = {"en-US": "Dungeons", "nl": "Roofridders"};
            break;
        case "titles":
            option = {"en-US": "Titles", "nl": "Titels"};
            break;
    }
    option["raw"] = t;
    if (option["en-US"] == null) option["en-US"] = t;
    return option;
});

(async () => {
    (await (require('fs/promises').readdir)(__dirname)).forEach(f => require(`./${f}`))
})();

module.exports.name = "gamedata"

module.exports.data = new SlashCommandBuilder()
    .setName(module.exports.name)
    .setNameLocalizations({nl: "gegevens"})
    .setDescription('Displays all desired in-game data!')
    .setDescriptionLocalizations({
        nl: 'Toont al je gewenste game gegevens!',
    })
    .addStringOption(option => {
        return option
            .setName("datatype")
            .setNameLocalizations({nl: "gegevenstype"})
            .setDescription("Type you want data about")
            .setDescriptionLocalizations({nl: "Type waarvan je gegevens wil"})
            .setRequired(true)
            .setAutocomplete(true)
    })
    .addStringOption(option => {
        return option
            .setName("identifier")
            .setNameLocalizations({nl: "identificator"})
            .setDescription("ID or name of specific item in data to filter on")
            .setDescriptionLocalizations({nl: "ID of naam van specifiek item in data waarop gefilterd moet worden"})
            .setRequired(false)
            .setAutocomplete(true)
    })

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.execute = async function (interaction) {
    const dataType = interaction.options.getString('datatype');
    try {
        const file = require(`./${dataType}`)
        await file.execute(interaction);
        await log(`Searching info about gamedata: ${dataType} by ${interaction.user.displayName}`)
    } catch (e) {
        const dataType = interaction.options.getString('datatype');

        if (e4kData[dataType] == null) {
            await interaction.followUp({
                content: `Something went wrong! Please try again and select a dataType from the list!`, ephemeral: true
            })
            return;
        }

        const identifier = interaction.options.getString('identifier');

        await log(`Searching info about gamedata: ${dataType} by ${interaction.user.displayName}`)

        let stringData = "";
        if (identifier != null) {
            try {
                const jsonString = JSON.stringify(e4kData[dataType].find(d => d[Object.keys(d)[0]].toString() === identifier), null, 2);
                stringData = `\`\`\`json\n${jsonString}\`\`\``
            } catch (e) {
            }
        }

        const url = getRawDataUrl(dataType)
        const body = stringData === "" ? url : stringData;
        await interaction.followUp({content: `${body}`, ephemeral: true})
    }
}

/**
 *
 * @param {ModalSubmitInteraction} interaction
 * @return {Promise<void>}
 */
module.exports.modal = async function (interaction) {
    try {
        const subcommand = interaction.customId.trim().split(' ')[1];
        const file = require(`./${subcommand}`)
        await file.modal(interaction);
    } catch (e) {
        console.log(e)
    }
}

/**
 *
 * @param {ButtonInteraction} interaction
 * @return {Promise<void>}
 */
module.exports.button = async function (interaction) {
    try {
        const subcommand = interaction.customId.trim().split(' ')[1];
        await log(`Searching info about gamedata with button: ${subcommand} by ${interaction.user.displayName}`)
        const file = require(`./${subcommand}`)
        await file.button(interaction);
    } catch (e) {
        console.log(e)
    }
}

/**
 *
 * @param {StringSelectMenuInteraction} interaction
 * @return {Promise<void>}
 */
module.exports.selectMenu = async function (interaction) {
    try {
        const subcommand = interaction.customId.trim().split(' ')[1];
        const file = require(`./${subcommand}`)
        await file.selectMenu(interaction);
    } catch (e) {
        console.log(e)
    }
}

/**
 *
 * @param {AutocompleteInteraction} interaction
 * @return {Promise<void>}
 */
module.exports.autocomplete = async function (interaction) {
    try {
        let locale = interaction.locale;
        /** @type {string | AutocompleteFocusedOption} */
        const focusedOption = interaction.options.getFocused(true);
        /** @type {string[]}*/
        let choices = [];
        switch (focusedOption.name) {
            case 'datatype':
                choices = locale === "en-US" ? [...new Set(dataTypeOptions.map(x => x[locale]))] : [...new Set(dataTypeOptions.map(x => x[locale])), ...new Set(dataTypeOptions.map(x => x["en-US"]))]
                choices = choices.filter(x => x != null).map(x => x.toLowerCase())
                break;
            case 'identifier':
                const type = interaction.options.getString('datatype');
                if (type === "" || type == null) {
                    await interaction.respond([]);
                } else {
                    try {
                        const file = require(`./${type}`)
                        await file.autocomplete(interaction)
                    } catch (e) {
                        try {
                            const data_type = e4kData[type]
                            if (data_type) {
                                choices = Array.isArray(data_type) ? data_type.map(dt => dt[Object.keys(dt)[0]].toString()) : [{
                                    name: getLocalizations(["dialogs", "dialog_ci_category_ci_all"])[locale], value: "-"
                                }]
                                /** @type {{target:string, rating: number}[]} */
                                let matches = stringSimilarity.findBestMatch(focusedOption.value, choices).ratings;
                                matches = matches.sort((a, b) => {
                                    return b.rating - a.rating;
                                }).slice(0, 25);
                                await interaction.respond(matches.map(choice => {
                                    return {name: choice.target, value: choice.target}
                                }));
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    }
                }
                return;
            default:
                focusedOption.value = "";
                break;
        }
        if (focusedOption.value.trim().length <= 1) {
            const rawArr = [...new Set(choices.sort().map(n => {
                let typeTranslations = dataTypeOptions.find(x => x[locale]?.toLowerCase() === n);
                if (typeTranslations == null && locale !== "en-US") typeTranslations = dataTypeOptions.find(x => x["en-US"]?.toLowerCase() === n)
                if (typeTranslations == null) typeTranslations = dataTypeOptions.find(x => x.raw?.toLowerCase() === n);
                return typeTranslations;
            }).filter(n => n != null).map(v => v.raw))].slice(0, 25)
            await interaction.respond(rawArr.map(raw => {
                const translations = dataTypeOptions.find(n => n.raw === raw)
                return {name: translations[locale] ?? translations["en-US"], value: raw}
            }));
            return;
        }
        /** @type {{target:string, rating: number}[]} */
        const matches = stringSimilarity.findBestMatch(focusedOption.value, choices).ratings;
        const names = matches.sort((a, b) => {
            return b.rating - a.rating;
        }).slice(0, 50).map(x => x.target);
        const rawArr = [...new Set(names.map(n => {
            let typeTranslations = dataTypeOptions.find(x => x[locale]?.toLowerCase() === n);
            if (typeTranslations == null && locale !== "en-US") typeTranslations = dataTypeOptions.find(x => x["en-US"]?.toLowerCase() === n)
            if (typeTranslations == null) typeTranslations = dataTypeOptions.find(x => x.raw?.toLowerCase() === n);
            return typeTranslations;
        }).filter(n => n != null).map(v => v.raw))].slice(0, 25)
        await interaction.respond(rawArr.map(raw => {
            const translations = dataTypeOptions.find(n => n.raw === raw)
            return {name: translations[locale] ?? translations["en-US"], value: raw}
        }));
    } catch (e) {
        console.log(e)
    }
}