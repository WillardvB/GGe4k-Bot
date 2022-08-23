const { CommandInteraction, MessageEmbed } = require("discord.js");
const logger = require("../../../tools/Logger");
const translationData = require('./../../../ingame_translations/nl.json');

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
        try {
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
                await interaction.followUp({ content: "Sorry, ik heb het bg niet gevonden!" });
                return;
            }
            let tmpPlayers = require('./../../../e4kserver/data').players;
            let memberList = "";
            let _allianceRank = "Leider";
            let isSecondField = false;
            for (let i = 0; i < allianceInfoVO.memberList.length; i++) {
                let memberId = allianceInfoVO.memberList[i];
                memberVO = tmpPlayers[memberId];
                let _rank = memberVO.allianceRank;
                if (rank == -1 || rank == _rank) {
                    if (memberList !== "" && _allianceRank !== translationData.dialogs["dialog_alliance_rank" + _rank]) {
                        let __allianceRank = _allianceRank
                        if (isSecondField) __allianceRank += 2;
                        embed.addField(__allianceRank, memberList, true);
                        memberList = "";
                        isSecondField = false;
                    }
                    _allianceRank = translationData.dialogs["dialog_alliance_rank" + _rank];
                    if ((memberList + `__${fixNameString(memberVO.playerName)}__, level: ${memberVO.playerLevel}\n`).length > 1020) {
                        embed.addField(_allianceRank, memberList, true);
                        memberList = "";
                        _allianceRank = translationData.dialogs["dialog_alliance_rank" + _rank];
                        isSecondField = true;
                    }
                    memberList += `__${fixNameString(memberVO.playerName)}__, level: ${memberVO.playerLevel}\n`;
                }
                if (memberList !== "" && (_allianceRank !== translationData.dialogs["dialog_alliance_rank" + _rank] || i === allianceInfoVO.memberList.length - 1)) {
                    let __allianceRank = _allianceRank
                    if (isSecondField) __allianceRank += 2;
                    embed.addField(__allianceRank, memberList, true);
                    memberList = "";
                    _allianceRank = translationData.dialogs["dialog_alliance_rank" + _rank];
                    isSecondField = false;
                }
            }
            await interaction.followUp({ embeds: [embed] });
        }
        catch (e) {
            logger.logError(e);
        }
    }
}

/**
 * 
 * @param {string} _string
 */
function fixNameString(_string) {
    return _string.replace('_', '\_').replace('*', '\*').replace('~', '\~');
}