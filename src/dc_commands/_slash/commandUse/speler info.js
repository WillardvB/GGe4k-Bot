const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const empire = require("../../../empireClient");
const num = require("../../../tools/number");
const translationData = require('./../../../ingame_translations/nl.json');
const kingdoms = [0, 2, 1, 3, 4, 10];

module.exports = {
    name: 'speler info',
    description: 'Toont informatie over het bondgenootschap!',
    /**
     *
     * @param {CommandInteraction | ButtonInteraction} interaction
     */
    async execute(interaction) {
        await _execute(interaction);
    }
}

/**
 *
 * @param {CommandInteraction | ButtonInteraction} interaction
 */
async function _execute(interaction) {
    try {
        let playerName = interaction.options.getString('naam').trim();
        const player = await empire.client.players.find(playerName);
        let bgInfo = player.allianceName === "" ? "" : player.allianceName + " (" + translationData.dialogs["dialog_alliance_rank" + player.allianceRank] + ")";
        let castleListString = "";
        for (let i in kingdoms) {
            let _castlesInKId = [];
            for (let j in player.castles) {
                if (player.castles[j].kingdomId === kingdoms[i]) {
                    _castlesInKId.push(player.castles[j]);
                }
            }
            if (kingdoms[i] === 0) {
                for (let j in player.kingstowers) {
                    _castlesInKId.push(player.kingstowers[j].kingstower);
                }
                for (let j in player.monuments) {
                    _castlesInKId.push(player.monuments[j].monument);
                }
            }
            _castlesInKId.sort((x, y) => {
                return (!x.customName || !y.customName) ? 0 : x.customName.localeCompare(y.customName);
            });
            _castlesInKId.sort((x, y) => {
                if (x.areaType === y.areaType) return 0;
                if (x.areaType === 1 || x.areaType === 12) return -1;
                if (x.areaType === 3) {
                    if (y.areaType === 1 || y.areaType === 12 || y.areaType === 4) {
                        return 1;
                    } else return -1;
                }
                if (x.areaType === 4) {
                    if (y.areaType === 1) {
                        return 1;
                    } else return -1;
                }
                if (x.areaType === 22) {
                    if (y.areaType === 1 || y.areaType === 3 || y.areaType === 4) {
                        return 1;
                    } else return -1;
                }
                if (x.areaType === 23) {
                    if (y.areaType === 1 || y.areaType === 3 || y.areaType === 4 || y.areaType === 22) {
                        return 1;
                    } else return -1;
                }
                return 1;
            })

            let kingdom = "_";
            switch (kingdoms[i]) {
                case 0:
                    kingdom = translationData.generic.kingdomName_Classic;
                    break;
                case 2:
                    kingdom = translationData.generic.kingdomName_Icecream;
                    break;
                case 1:
                    kingdom = translationData.generic.kingdomName_Dessert;
                    break;
                case 3:
                    kingdom = translationData.generic.kingdomName_Volcano;
                    break;
                case 4:
                    kingdom = translationData.dialogs.dialog_island_header;
                    break;
                case 10:
                    kingdom = translationData.generic.event_kingdom_berimond;
                    break;
            }

            let castles = "";
            for (let i in _castlesInKId) {
                let _castle = _castlesInKId[i];
                let _castleType = "_";
                switch (parseInt(_castle.areaType)) {
                    case 1:
                        _castleType = "Hoofdkasteel";
                        break;
                    case 3:
                        _castleType = translationData.generic.capital;
                        break;
                    case 4:
                        _castleType = translationData.generic.outpost;
                        break;
                    case 12:
                        _castleType = translationData.generic.kingdomCastle_name;
                        break;
                    case 22:
                        _castleType = translationData.generic.metropol;
                        break;
                    case 23:
                        _castleType = translationData.generic.kingstower;
                        break;
                    case 26:
                        _castleType = translationData.generic.monument;
                        break;
                    default:
                        _castleType = _castle.areaType;
                }
                castles += `\n${_castle.customName} (${_castle.position.X}/${_castle.position.Y}) (${_castleType})`;
            }

            if (i !== 0) castleListString += "\n";
            if (castles.trim() !== "")
                castleListString += `**${kingdom}:**${castles}`;
        }
        let description = "Level: " + (player.playerLevel === 70 ? player.playerLevel + "-" + player.paragonLevel : player.playerLevel) + "\n" +
            "BG: " + bgInfo + "\n" +
            (!player.peaceEndTime ? "" : `Duif tot: <t:${Math.round(player.peaceEndTime.getTime() / 1000)}:F>\n`) +
            "*id: " + player.playerId + "*";
        let punten = translationData.dialogs.dialog_fame_fame + ": " + num.formatNum(player.famePoints) + "\n" +
            translationData.generic.honorPoints + ": " + num.formatNum(player.honor) + "\n" +
            translationData.dialogs.mightPoints + ": " + num.formatNum(player.might);
        let embed = new EmbedBuilder()
            .setTimestamp()
            .setColor("#000000")
            .setTitle(`**${player.playerName}**`)
            .setDescription(description)
            .addFields(
                {name: "Punten", value: punten},
                {name: "Kasteelposities", value: castleListString}
            );
        if (player.villages?.private.length !== 0 || player.villages?.public.length !== 0) {
            console.log("[Speler info:123] Missing dorp en eiland command!");
            //embed.addFields({ name: "Dorpen en eilanden", value: "Zie /speler dorpen voor dorp en eiland informatie"});
        }
        let _components = [];
        if (player.allianceName !== "") {
            const _messRow = new ActionRowBuilder();
            _messRow.addComponents(
                new ButtonBuilder()
                    .setLabel(translationData.generic.alliance)
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`bondgenootschap info ${player.allianceName}`)
            )
            _components.push(_messRow);
        }
        const accountLinks = require('./../../../data/accountlinks.json');
        if (player.playerId !== 1194639 && !accountLinks.linkAccounts[interaction.user.id]) {
            const _messRow = new ActionRowBuilder();
            _messRow.addComponents(
                new ButtonBuilder()
                    .setLabel('Link account')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`speler link ${player.playerId}`)
            )
            _components.push(_messRow);
        }
        if (interaction.options) {
            await interaction.followUp({embeds: [embed], components: _components});
        } else if (interaction.customId) {
            await interaction.editReply({embeds: [embed], components: _components});
        }
    } catch (e) {
        await interaction.followUp({content: e.toString()});
    }
}