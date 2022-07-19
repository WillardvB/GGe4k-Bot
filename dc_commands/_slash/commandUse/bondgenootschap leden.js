const { CommandInteraction, MessageEmbed } = require("discord.js");
const logger = require("../../../tools/Logger");

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

let memberVO = {
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

module.exports = {
    name: 'bondgenootschap leden',
    /**
     * 
     * @param {any} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        let embed = new MessageEmbed();
        embed.setDescription("leden");
        embed.setTimestamp();
        embed.setColor("#000000");
        let allianceName = interaction.options.getString('naam').toLowerCase().trim();
        let rank = interaction.options.getInteger('rang');
        if (rank == null) rank = -1; else rank -= 1;
        let _alliances = require("./../../../e4kserver/data").alliances;
        let allianceInfoVO = null;
        for (let allianceId in _alliances) {
            let _alliance = _alliances[allianceId];
            if (_alliance.allianceName.toLowerCase() == allianceName) {
                embed.setTitle(_alliance.allianceName);
                allianceInfoVO = _alliance;
                break;
            }
        }
        if (allianceInfoVO == null) {
            await interaction.followUp({ content: "Sorry, ik heb het bg niet gevonden!", ephemeral: false });
            return;
        }
        let tmpPlayers = require('./../../../e4kserver/data').players;
        let memberList = "";
        let _allianceRank = "Leider";
        for (let i = 0; i < allianceInfoVO.memberList.length; i++) {
            let memberId = allianceInfoVO.memberList[i];
            memberVO = tmpPlayers[memberId];
            let _rank = memberVO.allianceRank;
            if (rank == -1 || rank == _rank) {
                if (memberList != "" && _allianceRank != allianceRanks[_rank]) {
                    embed.addField(_allianceRank, memberList);
                    memberList = "";
                    _allianceRank = allianceRanks[_rank];
                }
                memberList += `${memberVO.playerName}, level: ${memberVO.playerLevel}\n`;
            }
            if (memberList != "" && (_allianceRank != allianceRanks[_rank] || i == allianceInfoVO.memberList.length - 1)) {
                embed.addField(_allianceRank, memberList);
                memberList = "";
                _allianceRank = allianceRanks[_rank];
            }
        }
        interaction.followUp({
            embeds: [embed]
        }).catch(e => {
            logger.logError(e);
        })
    }
}