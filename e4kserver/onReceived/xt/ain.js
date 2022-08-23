const myMongoDB = require('../../../myMongoDB.js');
const Logger = require('../../../tools/Logger.js');
const logger = require('../../../tools/Logger.js');

let allianceId = 0;
let alliancesFound = 0;
let allAlliancesInJSON = false;
let alliancesOpNLServer = 225;
let _alliancesInJson = 0;
let _playersInJson = 0;

async function onError() {
    if (!allAlliancesInJSON && alliancesFound < alliancesOpNLServer && allianceId <= 25000) {
        allianceId += 1;
        require('./../../commands/searchAllianceById.js').execute(allianceId);
    }
    else {
        finishedAllianceSearch();
    }
}

/**
 * 
 * @param {object} params
 */
async function onSuccess(params) {
    try {
        let tmpAlliances = require('./../../data.js').alliances;
        tmpAlliances[params.A.AID] = parseAllianceInfo(params.A);
        require('./../../data.js').alliances = tmpAlliances;
        alliancesFound = alliancesFound + 1;
        if (!allAlliancesInJSON && alliancesFound < alliancesOpNLServer) {
            allianceId += 1;
            require('./../../commands/searchAllianceById.js').execute(allianceId);
        }
        else {
            finishedAllianceSearch();
        }
    }
    catch (e) {
        logger.logError(e);
    }
}

async function finishedAllianceSearch() {
    try {
        let tmpAlliances = require('./../../data.js').alliances;
        let _tmpAllianceCount = Object.keys(tmpAlliances).length;
        if (_tmpAllianceCount !== _alliancesInJson) {
            _alliancesInJson = _tmpAllianceCount;
            await logger.log("alliances in data json: " + _tmpAllianceCount);
        }
        let _alliancesArray = [];
        for (let ___i in tmpAlliances) {
            _alliancesArray.push(tmpAlliances[___i]);
        }
        await myMongoDB.compareData(_alliancesArray, myMongoDB.Collection.E4K.ALLIANCES);
        let tmpPlayers = require('./../../data.js').players;
        let _tmpPlayerCount = Object.keys(tmpPlayers).length;
        if (_tmpPlayerCount !== _playersInJson) {
            _playersInJson = _tmpPlayerCount;
            await logger.log("players in data json: " + _tmpPlayerCount);
        }
        let _playersArray = [];
        for (let ___i in tmpPlayers) {
            _playersArray.push(tmpPlayers[___i]);
        }
        await myMongoDB.compareData(_playersArray, myMongoDB.Collection.E4K.PLAYERS);
        allAlliancesInJSON = true;
        waitAndNextCheck();
    }
    catch (e) {
        await logger.logError(e);
        allAlliancesInJSON = true;
        waitAndNextCheck();
    }
}

function waitAndNextCheck() {
    setTimeout(function () {
        allianceId = 0;
        allAlliancesInJSON = false;
        alliancesFound = 0;
        require('./../../commands/searchAllianceById.js').execute(allianceId);
    }, 300000); //5 minutes
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
    try {
        const wsp = require('./wsp.js');
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
            let member = wsp.parseOwnerInfo(memberListArray[i]);
            if (member === null) continue;
            if (memberListArray[i] && memberListArray[i].OID) {
                member = {
                    playerId: memberListArray[i].OID,
                    allianceRank: parseInt(memberListArray[i].AR),
                }
            }
            if (member !== null)
                _memberList.push(member);
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
    catch (e) {
        Logger.logError(e);
        return null;
    }
}

/**
 * 
 * @param {string} msgText
 */
function parseChatJSONMessage(msgText) {
    if (!msgText) {
        return "";
    }
    return msgText.replace(/&percnt;/g, "%").replace(/&quot;/g, "\"").replace(/&#145;/g, "\'").replace(/<br \/>/g, "\n").replace(/&lt;/g, "<");
}

module.exports = {
    name: "ain",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(errorCode, params) {
        if (errorCode == 114 || !params) {
            if (errorCode != 114) console.log("error but not 114: " + errorCode + "  " + JSON.stringify(params));
            onError();
            return;
        }
        onSuccess(params)
    },
    get allianceId() { return allianceId; },
}