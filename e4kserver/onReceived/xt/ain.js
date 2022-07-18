const { alliances } = require('./../../data.js');
const { execute: searchByAllianceId } = require('./../../commands/searchAllianceById.js');
const { parseOwnerInfo } = require('./wsp.js');

let allianceId = 0;
let alliancesFound = 0;
let allAlliancesInJSON = false;

module.exports = {
    name: "ain",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(errorCode, params) {
        if (errorCode == 114 || !params) {
            if (!allAlliancesInJSON && alliancesFound < alliancesOpNLServer && allianceId <= 25000) {
                allianceId += 1;
                searchByAllianceId(allianceId);
            }
            else allAlliancesInJSON = true;
            return;
        }
        alliances[params.A.AID] = parseAllianceInfo(params.A);
        alliancesFound = alliancesFound + 1;
        console.log("BG id: " + params.A.AID + ", BG naam: " + params.A.N + ", allianceFound nr.: " + alliancesFound);
        if (!allAlliancesInJSON && alliancesFound < alliancesOpNLServer) {
            allianceId += 1;
            searchByAllianceId(allianceId);
        }
        else{
            allAlliancesInJSON = true;
        }
    }
}

/**
 * 
 * @param {object} allianceInfo
 */
function parseAllianceInfo(allianceInfo) {
    if (!allianceInfo) {
        return null;
    }
    let _allianceInfoVO = allianceInfoFillFromParamObject(allianceInfo);
    return _allianceInfoVO;
}

/**
 * 
 * @param {object} paramObject
 */
function allianceInfoFillFromParamObject(paramObject) {
    let allianceInfoVO = {
        allianceId: paramObject.AID,
        allianceName: paramObject.N,
        allianceDescription: parseChatJSONMessage(paramObject.D),
        languageId: paramObject["ALL"],
        memberLevel: paramObject.ML,
        memberList: [],
        allianceStatusToOwnAlliance: paramObject.DOA,
        allianceFamePoints: paramObject.CF,
        allianceFamePointsHighestReached: -1,
        canInvitedForHardPact: paramObject.HP == 1,
        canInvitedForSoftPact: paramObject.SP == 1,
        isSearchingMembers: paramObject.IS,
        landmarks: [],
        isOpenAlliance: paramObject.IA != 0,
        freeRenames: paramObject.FR,
        might: parseInt(paramObject.MP),
    }
    let memberListArray = paramObject.M;
    let _memberList = [];
    let i = 0;
    while (i < memberListArray.length) {
        _memberList.push(parseOwnerInfo(memberListArray[i]));
        i++;
    }
    _memberList.sort((a, b) => {
        if (a.allianceRank < b.allianceRank) {
            return -1;
        }
        if (a.allianceRank > b.allianceRank) {
            return 1;
        }
        return 0;
    });

    let _memberIdList = [];
    i = 0;
    while (i < _memberList.length) {
        _memberIdList.push(_memberList[i].playerId);
        i++;
    }
    allianceInfoVO.memberList = _memberIdList;
    return allianceInfoVO;
}

/**
 * 
 * @param {string} msgText
 */
function parseChatJSONMessage(msgText) {
    if (!msgText) {
        return "";
    }
    return msgText.replace(/&percnt;/g, "%").replace(/&quot;/g, "\"").replace(/&#145;/g, "\'").replace(/<br \/>/g, "\r").replace(/&lt;/g, "<");
}