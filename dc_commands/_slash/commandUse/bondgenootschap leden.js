const { CommandInteraction } = require("discord.js");


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
        let allianceName = interaction.options.getString('naam').toLowerCase().trim();
        let _alliances = require("./../../../e4kserver/data").alliances;
        let allianceInfoVO = null;
        for (let allianceId in _alliances) {
            let _alliance = _alliances[allianceId];
            if (_alliance.allianceName.toLowerCase() == allianceName) {
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
        for (let i = 0; i < allianceInfoVO.memberList.length; i++) {
            let memberId = allianceInfoVO.memberList[i];
            memberVO = tmpPlayers[memberId];
            if (i == 0) console.log(memberVO);
            memberList += `[${memberVO.allianceRank}] ${memberVO.playerName}, level: ${memberVO.playerLevel}, id: ${memberVO.playerId}`;
        }
        interaction.followUp({
            content: memberList
        })
    }
}