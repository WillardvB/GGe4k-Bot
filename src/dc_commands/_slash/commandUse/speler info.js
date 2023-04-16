const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const empire = require("../../../empireClient");
const num = require("../../../tools/number");
const {Constants} = require("ggejs");
const translationData = require('e4k-data').languages.nl;
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
        let bgInfo = player.allianceName === "" ? "" : `${player.allianceName} (${translationData.dialogs["dialog_alliance_rank" + player.allianceRank]})`;

        let description = `Level: ${player.playerLevel}${player.playerLevel === 70 ? `-${player.paragonLevel}` : ''}\n` +
            `BG: ${bgInfo}\n` +
            (!player.peaceEndTime ? "" : `Duif tot: <t:${Math.round(player.peaceEndTime.getTime() / 1000)}:F>\n`) +
            `*id: ${player.playerId}*`;
        let punten = `${translationData.dialogs.dialog_fame_fame}: ${num.formatNum(player.famePoints)}\n` +
            `${translationData.generic.honorPoints}: ${num.formatNum(player.honor)}\n` +
            `${translationData.dialogs.mightPoints}: ${num.formatNum(player.might)}\n`
        let embed = new EmbedBuilder()
            .setTimestamp()
            .setColor("#000000")
            .setTitle(`**${player.playerName}**`)
            .setDescription(description)
            .addFields(
                {name: "**Punten**", value: punten},
                {name: `**${translationData.generic.panel_action_castleList}**`, value: listCastles(player)}
            );
        if (player.villages?.private.length !== 0 || player.villages?.public.length !== 0) {
            console.log("[Speler info:149] Missing dorp en eiland command!");
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

/**
 *
 * @param {Player} player
 * @return {string}
 */
function listCastles(player) {
    let castleListString = "";
    for (let i in kingdoms) {
        let _castlesInKId = [];
        for (let j in player.castles) {
            if (player.castles[j].kingdomId === kingdoms[i]) {
                _castlesInKId.push(player.castles[j]);
            }
        }
        if (kingdoms[i] === 0) {
            for (let j in player.kingsTowers) {
                _castlesInKId.push(player.kingsTowers[j].kingstower);
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
                if (y.areaType === 1 || y.areaType === 12 || y.areaType === 4)
                    return 1;
                return -1;
            }
            if (x.areaType === 4) {
                if (y.areaType === 1)
                    return 1;
                return -1;
            }
            if (x.areaType === 22) {
                if (y.areaType === 1 || y.areaType === 3 || y.areaType === 4)
                    return 1;
                return -1;
            }
            if (x.areaType === 23) {
                if (y.areaType === 1 || y.areaType === 3 || y.areaType === 4 || y.areaType === 22)
                    return 1;
                return -1;
            }
            return 1;
        })

        let kingdom = "_";
        switch (kingdoms[i]) {
            case Constants.Kingdom.Classic:
                kingdom = translationData.generic.kingdomName_Classic;
                break;
            case Constants.Kingdom.Icecream:
                kingdom = translationData.generic.kingdomName_Icecream;
                break;
            case Constants.Kingdom.Desert:
                kingdom = translationData.generic.kingdomName_Dessert;
                break;
            case Constants.Kingdom.Volcano:
                kingdom = translationData.generic.kingdomName_Volcano;
                break;
            case Constants.Kingdom.Island:
                kingdom = translationData.dialogs.dialog_island_header;
                break;
            case Constants.Kingdom.Faction:
                kingdom = translationData.generic.event_kingdom_berimond;
                break;
        }

        let castles = "";
        for (let i in _castlesInKId) {
            let _castle = _castlesInKId[i];
            let _castleType = "_";
            switch (parseInt(_castle.areaType)) {
                case Constants.WorldmapArea.MainCastle:
                    _castleType = "Hoofdkasteel";
                    break;
                case Constants.WorldmapArea.Capital:
                    _castleType = translationData.generic.capital;
                    break;
                case Constants.WorldmapArea.Outpost:
                    _castleType = translationData.generic.outpost;
                    break;
                case Constants.WorldmapArea.KingdomCastle:
                    _castleType = translationData.generic.kingdomCastle_name;
                    break;
                case Constants.WorldmapArea.Metropol:
                    _castleType = translationData.generic.metropol;
                    break;
                case Constants.WorldmapArea.Kingstower:
                    _castleType = translationData.generic.kingstower;
                    break;
                case Constants.WorldmapArea.Monument:
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
    return castleListString;
}