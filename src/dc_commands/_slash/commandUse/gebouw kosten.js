const translationData = require('e4k-data').languages.nl;
const {formatNum} = require('./../../../tools/number.js');
const formatDuration = require('./../../../tools/time.js');
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const buildingCommandHelper = require('./../commandHelpers/gebouw');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';

const _name = "gebouw kosten";
module.exports = {
    name: _name,
    /**
     *
     * @param {CommandInteraction | ButtonInteraction} interaction
     */
    async execute(interaction) {
        try {
            let level = 0;
            let gebouwnaam;
            if (interaction.options) {
                level = interaction.options.getInteger('level');
                if (level === null) level = 0;
                gebouwnaam = interaction.options.getString('naam');
            } else if (interaction.customId) {
                let string = interaction.customId.split(' ');
                level = parseInt(string[2]);
                gebouwnaam = string[3];
                for (let i = 4; i < string.length; i++) {
                    gebouwnaam += " " + string[i];
                }
            }
            let foundBuildingName = await buildingCommandHelper.getSuggestions(gebouwnaam, interaction, _name, level);
            if (foundBuildingName === "<Not found>") return;
            let buildingNameParts = foundBuildingName.split('_');
            let _rawData = buildingCommandHelper.getRawData(buildingNameParts, level);
            let data = _rawData.data;
            if (data === null) return;
            await naarOutput(interaction, data, _rawData.minLevel, _rawData.maxLevel);
        } catch (e) {
            await interaction.followUp({content: e.toString()});
        }
    },
};

/**
 *
 * @param {CommandInteraction | ButtonInteraction} interaction
 * @param {Building} data
 * @param {number} minLevel
 * @param {number} maxLevel
 * @return {Promise<void>}
 */
async function naarOutput(interaction, data, minLevel, maxLevel) {
    try {
        let level = data.level;
        let gebouwNaam = buildingCommandHelper.getName(level === 0 ? data[0] : data);
        let description = buildingCommandHelper.getDescription(level === 0 ? data[0] : data);
        let title = `**${gebouwNaam}**${minLevel === maxLevel ? "" : level === 0 ? " (totaal alle levels)" : ` (${translationData.generic.level} ${level})`}`;
        let image = buildingCommandHelper.getImage(level === 0 ? data[0] : data);

        let embed = new EmbedBuilder()
            .setColor('#996515')
            .setTimestamp()
            .setFooter({text: footerTekst, iconURL: footerAfbeelding})
            .setTitle(title)
        if (image !== "") embed.setThumbnail(image);
        if (description !== "") embed.setDescription(description);
        let normalCostValues = "";
        let tmpServerCostValues = "";
        if (level === 0) {
            let _data = {};
            for (let i in data) {
                _data = await sumDataCostObjects(interaction, _data, data[i]);
            }
            data = _data;
        }
        const _keys = Object.keys(data);
        for (let _i = 0; _i < _keys.length; _i++) {
            let _key = _keys[_i];
            let _keyLowCase = _key.toLowerCase();
            /** @type string */
            let _value = data[_key];
            if (_keyLowCase.startsWith("cost")) {
                normalCostValues += formatCostString(_key, _keyLowCase, _value);
                continue;
            }
            if (_keyLowCase.endsWith("duration")) {
                if (_keyLowCase === "buildduration") {
                    normalCostValues += `**Tijd**: ${formatDuration.secToDuration(_value)}\n`;
                }
                continue;
            }
            if (_keyLowCase.startsWith("tempserver")) {
                _key = _key.substring(10);
                _keyLowCase = _key.toLowerCase();
                if (_keyLowCase.startsWith("cost")) {
                    tmpServerCostValues += formatCostString(_key, _keyLowCase, _value);
                    continue;
                }
                if (_keyLowCase === "time") {
                    tmpServerCostValues += `**Tijd**: ${formatDuration.secToDuration(_value)}\n`;
                }
            }
        }
        if (normalCostValues !== "") {
            embed.addFields({
                name: `**${translationData.generic.costs}**`,
                value: normalCostValues.trim(),
                inline: true
            });
        } else {
            embed.addFields({name: `**${translationData.generic.costs}**`, value: "Geen", inline: true});
        }
        if (tmpServerCostValues !== "") {
            embed.addFields({
                name: `_${translationData.dialogs.temp_server_name} ${translationData.generic.costs.toLowerCase()}_`,
                value: tmpServerCostValues.trim(),
                inline: true
            });
        }
        let components = [];
        const messRow = new ActionRowBuilder();
        if (level !== 0 && minLevel !== maxLevel) {
            if (level > minLevel && level <= maxLevel) {
                messRow.addComponents(
                    new ButtonBuilder()
                        .setLabel(`${translationData.generic.level} ${level - 1}`)
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`${_name} ${(level - 1)} ${gebouwNaam}`)
                )
            }
            if (level < maxLevel && level >= minLevel) {
                messRow.addComponents(
                    new ButtonBuilder()
                        .setLabel(`${translationData.generic.level} ${level + 1}`)
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`${_name} ${(level + 1)} ${gebouwNaam}`)
                )
            }
            messRow.addComponents(
                new ButtonBuilder()
                    .setLabel('Totaal alle levels')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`${_name} 0 ${gebouwNaam}`)
            )
            components = [messRow];
        } else if (minLevel !== maxLevel) {
            messRow.addComponents(
                new ButtonBuilder()
                    .setLabel(`${translationData.generic.level} ${minLevel}`)
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`${_name} ${minLevel} ${gebouwNaam}`)
            )
            messRow.addComponents(
                new ButtonBuilder()
                    .setLabel(`${translationData.generic.level} ${maxLevel}`)
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`${_name} ${maxLevel} ${gebouwNaam}`)
            )
            components = [messRow];
        }
        const _ActionRowBuilder2 = new ActionRowBuilder();
        _ActionRowBuilder2.addComponents(
            new ButtonBuilder()
                .setLabel("Algemene informatie")
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`gebouw algemeen ${level === 0 ? maxLevel : level} ${gebouwNaam}`)
        );
        components.push(_ActionRowBuilder2);
        if (interaction.options) {
            await interaction.followUp({embeds: [embed], components: components});
        } else {
            await interaction.editReply({embeds: [embed], components: components});
        }
    } catch (e) {
        await interaction.followUp({content: e.toString()});
    }
}

/**
 *
 * @param {string} key
 * @param {string} keyLowCase
 * @param {string} value
 * @returns {string}
 */
function formatCostString(key, keyLowCase, value) {
    let _tmpKey = translationData.generic[keyLowCase.substring(4)];
    if (_tmpKey === null || _tmpKey === undefined) {
        if (key.length === 6) key = key.replace("costC", "costcurrency");
        _tmpKey = translationData.dialogs[`currency_name_${key.substring(4)}`];
        if (_tmpKey === null || _tmpKey === undefined) {
            _tmpKey = translationData.generic[`currency_name_${key.substring(4)}`];
        }
    }
    return `**${_tmpKey}**: ${formatNum(value)}\n`;
}

/**
 * @param {CommandInteraction | ButtonInteraction} interaction
 * @param {object} dataOutput
 * @param {object} dataInput
 * @returns {Promise<object>}
 */
async function sumDataCostObjects(interaction, dataOutput, dataInput) {
    try {
        if (dataOutput === null) return JSON.parse(JSON.stringify(dataInput));
        const _keys = Object.keys(dataInput);
        for (let _i = 0; _i < _keys.length; _i++) {
            let _key = _keys[_i];
            let _keyLowCase = _key.toLowerCase();
            if (_keyLowCase.startsWith("cost")) {
                if (dataOutput[_key] === undefined) dataOutput[_key] = dataInput[_key];
                else dataOutput[_key] = (parseInt(dataOutput[_key]) + parseInt(dataInput[_key])).toString();
                continue;
            }
            if (_keyLowCase.endsWith("duration")) {
                if (_keyLowCase === "buildduration") {
                    if (dataOutput[_key] === undefined) dataOutput[_key] = dataInput[_key];
                    else dataOutput[_key] = (parseInt(dataOutput[_key]) + parseInt(dataInput[_key])).toString();
                    continue;
                }
            }
            if (_keyLowCase.startsWith("tempserver")) {
                _keyLowCase = _key.substring(10).toLowerCase();
                if (_keyLowCase.startsWith("cost") || _keyLowCase === "time") {
                    if (dataOutput[_key] === undefined) dataOutput[_key] = dataInput[_key];
                    else dataOutput[_key] = (parseInt(dataOutput[_key]) + parseInt(dataInput[_key])).toString();
                }
            }
        }
        if (parseInt(dataInput.level) > parseInt(dataOutput.level)) {
            dataOutput.name = dataInput.name;
            dataOutput.type = dataInput.type;
            dataOutput.group = dataInput.group;
            dataOutput.level = dataInput.level;
        }
        return dataOutput;
    } catch (e) {
        await interaction.followUp({content: e.toString()});
    }
}