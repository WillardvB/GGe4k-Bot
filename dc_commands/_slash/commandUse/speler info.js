const { CommandInteraction, MessageEmbed } = require("discord.js");
const Logger = require("../../../tools/Logger");
const num = require("../../../tools/number");
const translationData = require('./../../../ingame_translations/nl.json');

let playerVO = {
    userData: {},
    playerInfoModel: {},
    kingdomData: {},
    playerId: 0,
    playerName: "",
    playerLevel: 0,
    paragonLevel: 0,
    crest: {},
    remainingNoobTime: 0,
    noobTimeOffset: 0,
    remainingPeaceTime: 0,
    peaceTimeOffset: 0,
    honor: 0,
    famePoints: 0,
    isRuin: false,
    allianceID: -1,
    allianceRank: 0,
    allianceName: "",
    allianceFame: 0,
    isSearchingAlliance: false,
    isOutpostOwner: false,
    isNPC: false,
    castlePosList: [{}],
    villagePosList: [{}],
    hasPremiumFlag: false,
    hasVIPFlag: false,
    isDummy: false,
    achievementPoints: 0,
    relocateDurationEndTimestamp: 0,
    might: 0,
    factionID: 0,
    factionMainCampID: 0,
    factionProtectionStatus: 0,
    factionProtectionEndTime: 0,
    factionNoobProtectionEndTime: 0,
    factionIsSpectator: false,
    titleVO: {},
    gameTickSignal: null,
    namesFactory: {},
    nameTextId: "",
    prefixTitleId: 0,
    suffixTitleId: 0,
    staticAreaName: "",
    castles: {},
    villages: { public: [], private: [] },
    kingsTowers: [],
    monuments: [],
};

let allianceRanks = {
    0: "Leider",
    1: "Substituut",
    2: "Veldmaarschalk",
    3: "Schatbewaarder",
    4: "Diplomaat",
    5: "Ronselaar",
    6: "Generaal",
    7: "Sergeant",
    8: "Lid",
    9: "Novice",
}

module.exports = {
    name: 'speler info',
    description: 'Toont informatie over het bondgenootschap!',
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        _execute(interaction);
    }
}

/**
 * 
 * @param {CommandInteraction} interaction
 * @param {boolean} retried
 */
async function _execute(interaction, retried = false) {
    try {
        let playerName = interaction.options.getString('naam').trim();
        playerName = playerName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let _players = require("./../../../e4kserver/data").players;
        playerVO = null;
        for (let playerId in _players) {
            let _player = _players[playerId];
            let _playerName = _player.playerName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (_playerName.toLowerCase() == playerName.toLowerCase()) {
                playerVO = _player;
                break;
            }
        }
        if (playerVO == null) {
            if (retried) {
                await interaction.followUp({ content: "Sorry, ik heb de speler nog niet gevonden!\nCheck of je de naam goed heb gespeld." });
            }
            else {
                require('./../../../e4kserver/commands/searchPlayerByName').execute(playerName);
                setTimeout(function () {
                    _execute(interaction, true);
                }, 2500);
            }
            return;
        }
        let bgInfo = playerVO.allianceName == "" ? "" : playerVO.allianceName + " (" + allianceRanks[playerVO.allianceRank] + ")";
        let castleListString = "";
        let castleKeys = Object.keys(playerVO.castles);
        for (let i = 0; i < castleKeys.length; i++) {
            let _key = parseInt(castleKeys[i]);
            /** @type Array */
            let _castlesInKId = playerVO.castles[_key];
            if (i === 0) _castlesInKId = _castlesInKId.concat(playerVO.kingsTowers, playerVO.monuments);
            _castlesInKId.sort((x, y) => { return x.customName.localeCompare(y.customName); });
            _castlesInKId.sort((x, y) => {
                if (x.areaType === y.areaType) return 0;
                if (x.areaType === 1) return 1;
                if (x.areaType === 3) {
                    if (y.areaType === 1 || y.areaType === 4) {
                        return -1;
                    }
                    else return 1;
                }
                if (x.areaType === 4) {
                    if (y.areaType === 1) {
                        return -1;
                    }
                    else return 1;
                }
                if (x.areaType === 22) {
                    if (y.areaType === 1 || y.areaType === 3 || y.areaType === 4) {
                        return -1;
                    }
                    else return 1;
                }
                return -1;
                if (x.areaType === 23) {
                    if (y.areaType === 1 || y.areaType === 3 || y.areaType === 4 || y.areaType === 22) {
                        return -1;
                    }
                    else return 1;
                }
                return -1;
            })
            if (i !== 0) castleListString += "\n";
            let kingdom = "_";
            switch (_key) {
                case 0: kingdom = translationData.generic.kingdomName_Classic; break;
                case 2: kingdom = translationData.generic.kingdomName_Icecream; break;
                case 1: kingdom = translationData.generic.kingdomName_Dessert; break;
                case 3: kingdom = translationData.generic.kingdomName_Volcano; break;
                case 4: kingdom = translationData.dialogs.dialog_island_header; break;
                case 10: kingdom = translationData.generic.event_kingdom_berimond; break;
            }
            let castles = "";
            for (let i = 0; i < _castlesInKId.length; i++) {
                let _castle = _castlesInKId[i];
                let _castleType = "_";
                switch (_castle.areaType) {
                    case "1": _castleType += "Hoofdkasteel"; break;
                    case "3": _castleType += translationData.generic.capital; break;
                    case "4": _castleType += translationData.generic.outpost; break;
                    case "12": _castleType += translationData.generic.kingdomCastle_name; break;
                    case "22": _castleType += translationData.generic.metropol; break;
                    case "23": _castleType += translationData.generic.kingstower; break;
                    case "26": _castleType += translationData.generic.monument; break;
                    default: _castleType += _castle.areaType;
                }
                castles = `\n${_castle.customName} (${_castle.posX}/${_castle.posY}) (${_castleType})`;
            }
            castleListString += `**${kingdom}:**${castles}`;
        }
        let description = "Level: " + (playerVO.playerLevel == 70 ? playerVO.playerLevel + "-" + playerVO.paragonLevel : playerVO.playerLevel) + "\n" +
            "BG: " + bgInfo + "\n" +
            "*id: " + playerVO.playerId + "*";
        let punten = translationData.dialogs.dialog_fame_fame + ": " + num.formatNum(playerVO.famePoints) + "\n" +
            translationData.generic.honorPoints + ": " + num.formatNum(playerVO.honor) + "\n" +
            translationData.dialogs.mightPoints + ": " + num.formatNum(playerVO.might);
        let embed = new MessageEmbed()
            .setTimestamp()
            .setColor("#000000")
            .setTitle(`**${playerVO.playerName}**`)
            .setDescription(description)
            .addField("Punten", punten)
            .addField("Kasteelposities", castleListString);
        if (playerVO.villages.private.length !== 0 || playerVO.villages.public.length !== 0) {
            console.log("[Speler info:192] Missing dorp en eiland command!");
            //embed.addField("Dorpen en eilanden", "Zie /speler dorpen voor dorp en eiland informatie");
        }
        await interaction.followUp({ embeds: [embed] });
    }
    catch (e) {
        Logger.logError(e);
    }
}