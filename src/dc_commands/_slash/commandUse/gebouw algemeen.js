const translationData = require('e4k-data').languages.nl;
const {Constants} = require('ggejs');
const {formatNum} = require('./../../../tools/number.js');
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const buildingCommandHelper = require('./../commandHelpers/gebouw');
const footerTekst = '© E4K NL server';
const footerAfbeelding = 'https://i.gyazo.com/1723d277b770cd77fa2680ce6cf32216.jpg';

const _name = "gebouw algemeen";
module.exports = {
    name: _name,
    /**
     *
     * @param {CommandInteraction | ButtonInteraction} interaction
     */
    async execute(interaction) {
        try {
            let level;
            let gebouwnaam;
            if (interaction.options) {
                level = interaction.options.getInteger('level');
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
        if(level === 0) data = data[0];
        let gebouwNaam = buildingCommandHelper.getName(data);
        let title = `**${gebouwNaam}**${minLevel === maxLevel ? "" : ` (${translationData.generic.level} ${level})`}`;
        let embed = new EmbedBuilder()
            .setColor('#996515')
            .setTimestamp()
            .setFooter({text: footerTekst, iconURL: footerAfbeelding})
            .setTitle(title);
        let description = buildingCommandHelper.getDescription(data);
        if (description !== "") embed.setDescription(description);
        let image = buildingCommandHelper.getImage(data);
        if (image !== "") embed.setThumbnail(image);

        let values = "";
        let constructionValues = "";
        let rewardValues = "";
        let storageValues = "";
        let productionValues = "";
        let protectionValues = "";
        let requirementsValues = "";
        let destructionValues = "";
        let sellValues = "";
        const _keys = Object.keys(data);
        for (let _key of _keys) {
            let _keyLowCase = _key.toLowerCase();
            if (_keyLowCase === "name" || _keyLowCase === "level" || _keyLowCase === "type" || _keyLowCase === "group" ||
                _keyLowCase === "height" || (_keyLowCase.includes("cost") && _keyLowCase !== "buildingcostreduction") ||
                _keyLowCase === "rotatetype" || _keyLowCase === "foodratio" || _keyLowCase.endsWith("duration") ||
                _keyLowCase === "tempservertime" || _keyLowCase.startsWith("comment") || _keyLowCase === "shopcategory" ||
                _keyLowCase === "constructionitemgroupids" || _keyLowCase === "buildinggroundtype" ||
                _keyLowCase.endsWith("wodid") || _keyLowCase.endsWith("sortorder") || _keyLowCase === "effectlocked" ||
                _keyLowCase.startsWith("earlyunlock") || _keyLowCase === "eventIDs" || _keyLowCase === "slumlevelneeded" ||
                _keyLowCase === "requiredprivateoffer" || _keyLowCase === "canbeprimesaleoffer" ||
                _keyLowCase === "isdistrict" || _keyLowCase === "movable") continue;
            if (_keyLowCase.startsWith("tempserver")) _keyLowCase = _keyLowCase.replace("tempserver", `${translationData.dialogs.temp_server_name} `);
            /** @type {string | number} */
            let _value = data[_key];
            if (_keyLowCase === "width") {
                _value = `${data["width"]}x${data["height"]}`;
                constructionValues += `**${translationData.dialogs.gridSize}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "storeable") {
                _value = _value = data[_key] === "1" ? "Ja" : "Nee";
                constructionValues += `**Opslaanbaar**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase.startsWith("required")) {
                _keyLowCase = _keyLowCase.substring(8, 9) + _key.substring(9);
                requirementsValues += `**${translationData.generic[_keyLowCase]}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "sceatskilllocked") {
                _value = parseInt(_value) > 0 ? "Ja" : "Nee";
                requirementsValues += `**Zaal vaardigheid nodig**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase.startsWith("sell")) {
                if (_key.length === 6) _key = _key.replace("sellC", "sellcurrency");
                sellValues += `**${translationData.dialogs[`currency_name_${_key.substring(4)}`]}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "kids") {
                let _valueArray = _value.split(',');
                _value = "";
                for (let i = 0; i < _valueArray.length; i++) {
                    if (i > 0) _value += ", ";
                    switch (parseInt(_valueArray[i].trim())) {
                        case Constants.Kingdom.Classic:
                            _value += translationData.generic.kingdomName_Classic;
                            break;
                        case Constants.Kingdom.Desert:
                            _value += translationData.generic.kingdomName_Dessert;
                            break;
                        case Constants.Kingdom.Icecream:
                            _value += translationData.generic.kingdomName_Icecream;
                            break;
                        case Constants.Kingdom.Volcano:
                            _value += translationData.generic.kingdomName_Volcano;
                            break;
                        case Constants.Kingdom.Island:
                            _value += translationData.generic.kingdomName_Island;
                            break;
                        case Constants.Kingdom.Faction:
                            _value += translationData.generic.kingdomName_Faction;
                            break;
                        ///case "..": _value += translationData.generic.kingdomName_Classic_Maya; break;
                        default:
                            _value += "-";
                            break;
                    }
                }
                constructionValues += `**Toegestane koninkrijken**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "onlyinareatypes") {
                let _valueArray = _value.split(',');
                _value = "";
                for (let i = 0; i < _valueArray.length; i++) {
                    if (i > 0) _value += ", ";
                    switch (parseInt(_valueArray[i].trim())) {
                        case Constants.WorldmapArea.MainCastle:
                            _value += "Hoofdkasteel";
                            break;
                        case Constants.WorldmapArea.Capital:
                            _value += translationData.generic.capital;
                            break;
                        case Constants.WorldmapArea.Outpost:
                            _value += translationData.generic.outpost;
                            break;
                        case Constants.WorldmapArea.KingdomCastle:
                            _value += translationData.generic.kingdomCastle_name;
                            break;
                        case Constants.WorldmapArea.Metropol:
                            _value += translationData.generic.metropol;
                            break;
                        case Constants.WorldmapArea.Kingstower:
                            _value += translationData.generic.kingstower;
                            break;
                        case Constants.WorldmapArea.Monument:
                            _value += translationData.generic.monument;
                            break;
                        default:
                            _value += _valueArray[i].trim();
                            break;
                    }
                }
                constructionValues += `**Toegestane kastelen**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "mightvalue") {
                _keyLowCase = translationData.dialogs.mightPoints;
                rewardValues += `**${_keyLowCase}**: ${formatNum(_value)}\n`;
                continue;
            }
            if (_keyLowCase === "xp") {
                _keyLowCase = translationData.generic.xp;
                rewardValues += `**${_keyLowCase}**: ${formatNum(_value)}\n`;
                continue;
            }
            if (_keyLowCase === "moral") {
                _keyLowCase = translationData.generic.morality;
                rewardValues += `**${_keyLowCase}**: ${formatNum(_value)}\n`;
                continue;
            }
            if (_keyLowCase === "buildspeedboost") {
                _keyLowCase = "Bouwsnelheid";
                _value = `+${_value}%`;
                rewardValues += `**${_keyLowCase}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "kingdomfameboost") {
                _keyLowCase = translationData.dialogs.dialog_fame_title;
                _value = `+${_value}%`;
                rewardValues += `**${_keyLowCase}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "decopoints") {
                _keyLowCase = translationData.generic.publicOrder;
                rewardValues += `**${_keyLowCase}**: ${formatNum(_value)}\n`;
                continue;
            }
            if (_keyLowCase === "hunterratio") {
                _value = `${data[_key] / 100} ${translationData.generic.goods} geeft 1 ${translationData.generic.food}`;
                _keyLowCase = translationData.dialogs.dialog_hunter_exchangeRate;
                rewardValues += `**${_keyLowCase}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "honeyratio") {
                _value = `${data[_key]} ${translationData.generic.honey} en ${data["foodRatio"]} ${translationData.generic.food} geven samen 1 ${translationData.generic.mead}`;
                _keyLowCase = translationData.dialogs.dialog_hunter_exchangeRate;
                rewardValues += `**${_keyLowCase}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "unitwallcount") {
                _keyLowCase = translationData.dialogs.ci_effect_unitWallCount_tt.substring(0, translationData.dialogs.ci_effect_unitWallCount_tt.length - 1);
                _value = `+${_value}`;
                rewardValues += `**${_keyLowCase}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "skillpoints") {
                _keyLowCase = translationData.dialogs.dialog_legendTemple_SkillPointPlural;
                rewardValues += `**${_keyLowCase}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase.endsWith("storage")) {
                storageValues += `**${translationData.generic[_keyLowCase.substring(0, _keyLowCase.length - 7)]}**: ${formatNum(data[_key])}\n`;
                continue;
            }
            if (_keyLowCase.endsWith("boost")) {
                productionValues += `**${translationData.generic[_keyLowCase.substring(0, _keyLowCase.length - 5)]} boost**: ${formatNum(data[_key])}%\n`;
                continue;
            }
            if (_keyLowCase === "hideout") {
                storageValues += `**Beveiligde opslag**: ${formatNum(data[_key])}\n`;
                continue;
            }
            if (_keyLowCase.endsWith("production")) {
                productionValues += `**${translationData.generic[_keyLowCase.substring(0, _keyLowCase.length - 10)]}**: ${formatNum(data[_key])}\n`;
                continue;
            }
            if (_keyLowCase === "allifoodproductionbonus") {
                productionValues += `**${translationData.generic.food}**: ${formatNum(data[_key])}\n`;
                continue;
            }
            if (_keyLowCase.startsWith("wall") || _keyLowCase.startsWith("gate") || _keyLowCase.startsWith("moat")) {
                protectionValues += `**${translationData.generic[_keyLowCase.substring(0, 4)]}**: +${formatNum(data[_key])}%\n`;
                continue;
            }
            if (_keyLowCase.endsWith("burnable") || _keyLowCase.endsWith("destructable") || _keyLowCase.endsWith("smashable")) {
                _value = data[_key] === "1" ? "Ja" : "Nee";
                if (_keyLowCase.endsWith("burnable")) _keyLowCase = _keyLowCase.replace("burnable", "brandbaar");
                else if (_keyLowCase.endsWith("destructable")) _keyLowCase = _keyLowCase.replace("destructable", "afbreekbaar");
                else if (_keyLowCase.endsWith("smashable")) _keyLowCase = _keyLowCase.replace("smashable", "verwoestbaar");
                _keyLowCase = _keyLowCase.substring(0, 1).toUpperCase() + _keyLowCase.substring(1);
                destructionValues += `**${_keyLowCase}**: ${_value}\n`;
                continue;
            }
            if (_keyLowCase === "maximumcount") {
                _keyLowCase = "Maximum aantal";
            }
            if (_keyLowCase === "districttypeid") {
                _keyLowCase = "Kan in district";
                switch (_value) {
                    case 1:
                    case "1":
                        _value = translationData.generic.MilitaryDistrict_name;
                        break;
                    case 3:
                    case "3":
                        _value = translationData.buildings_and_decorations.InnerDistrict_name;
                        break;
                    case 4:
                    case "4":
                        _value = translationData.dialogs.TradeDistrict_name;
                        break;
                    default:
                        _value = "-";
                }
            }

            _keyLowCase = _keyLowCase.substring(0, 1).toUpperCase() + _keyLowCase.substring(1);
            if (_key.toLowerCase() !== _keyLowCase.toLowerCase()) _key = _keyLowCase;
            values += `**${_key}**: ${_value}\n`;
        }
        if (constructionValues !== "") {
            embed.addFields({name: `**Constructie**`, value: constructionValues.trim(), inline: true,});
        }
        if (requirementsValues !== "") {
            requirementsValues += `**${translationData.generic.costs}**: zie '${translationData.generic.costs}'-knop onderaan`;
            embed.addFields({name: `**Benodigdheden**`, value: requirementsValues.trim(), inline: true});
        }
        if (rewardValues !== "") {
            embed.addFields({name: `**Voordelen**`, value: rewardValues.trim(), inline: true});
        }
        if (storageValues !== "") {
            embed.addFields({
                name: `**${translationData.buildings_and_decorations.storehouse_name}**`,
                value: storageValues.trim(),
                inline: true
            });
        }
        if (productionValues !== "") {
            embed.addFields({
                name: `**${translationData.generic.produce}**`,
                value: productionValues.trim(),
                inline: true
            });
        }
        if (protectionValues !== "") {
            embed.addFields({
                name: `**${translationData.generic.protection}**`,
                value: protectionValues.trim(),
                inline: true
            });
        }
        if (sellValues !== "") {
            embed.addFields({name: `**${translationData.generic.sellPrice}**`, value: sellValues.trim(), inline: true});
        }
        if (destructionValues !== "") {
            embed.addFields({name: `**Afbreekbaarheid**`, value: destructionValues.trim(), inline: true});
        }
        if (values.trim() !== "") {
            values = values.substring(0, 1000);
            embed.addFields({name: "**Overige informatie**", value: values.trim(), inline: true});
        }

        let components = [];
        if (minLevel !== maxLevel) {
            const _ActionRowBuilder = new ActionRowBuilder();
            if (level > minLevel) {
                _ActionRowBuilder.addComponents(
                    new ButtonBuilder()
                        .setLabel(`${translationData.generic.level} ${level - 1}`)
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`${_name} ${(level - 1)} ${gebouwNaam}`)
                )
            }
            if (level < maxLevel) {
                _ActionRowBuilder.addComponents(
                    new ButtonBuilder()
                        .setLabel(`${translationData.generic.level} ${level + 1}`)
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`${_name} ${(level + 1)} ${gebouwNaam}`)
                )
            }
            components = [_ActionRowBuilder];
        }
        const _ActionRowBuilder2 = new ActionRowBuilder();
        _ActionRowBuilder2.addComponents(
            new ButtonBuilder()
                .setLabel(translationData.generic.costs)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`gebouw kosten ${level} ${gebouwNaam}`)
        );
        components.push(_ActionRowBuilder2);
        if (interaction.options) {
            await interaction.followUp({embeds: [embed], components: components});
        } else {
            await interaction.editReply({embeds: [embed], components: components});
        }
    } catch (e) {
        console.log(e);
        await interaction.followUp({content: e.toString()});
    }
}