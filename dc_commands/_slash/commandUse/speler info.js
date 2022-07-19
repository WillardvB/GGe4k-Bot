const { CommandInteraction } = require("discord.js");

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
    let playerName = interaction.options.getString('naam').toLowerCase().trim();
    let _players = require("./../../../e4kserver/data").players;
    playerVO = null;
    for (let playerId in _players) {
        let _player = _players[playerId];
        if (_player.playerName.toLowerCase() == playerName) {
            playerVO = _player;
            break;
        }
    }
    if (playerVO == null) {
        if (retried) {
            await interaction.followUp({ content: "Sorry, ik heb de speler nog niet gevonden!", ephemeral: false });
        }
        else {
            require('./../../../e4kserver/commands/searchPlayerByName').execute(playerName);
            await new Promise(resolve => setTimeout(resolve(), 2500));
            _execute(interaction, true);
        }
        return;
    }
    interaction.followUp({
        content:
            "Naam: " + playerVO.playerName + "\n" +
            "Level: " + playerVO.playerLevel + "\n" +
            "BG: " + playerVO.allianceName + "(" + allianceRanks[playerVO.allianceRank] + ")"+ "\n" +
            "Roempunten: " + playerVO.famePoints + "\n" +
            "Eerpunten: " + playerVO.honor + "\n" +
            "Machtpunten: " + playerVO.might + "\n" +
            "Kasteelposities: " + playerVO.castlePosList + "\n" +
            "Dorpposities: " + playerVO.villagePosList + "\n" +
            "*id: " + playerVO.playerId + "*"
    })
}