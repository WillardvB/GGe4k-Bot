let allianceId = 0;
let alliancesFound = 0;
let allAlliancesInJSON = false;
let alliancesOpNLServer = 202;

function onError() {
    if (!allAlliancesInJSON && alliancesFound < alliancesOpNLServer && allianceId <= 25000) {
        allianceId += 1;
        require('./../../commands/searchAllianceById.js').execute(allianceId);
    }
    else {
        allAlliancesInJSON = true;
        waitAndNextCheck();
    }
}

/**
 * 
 * @param {object} params
 */
async function onSuccess(params) {
    let tmpAlliances = require('./../../data.js').alliances;
    tmpAlliances[params.A.AID] = parseAllianceInfo(params.A);
    require('./../../data.js').alliances = tmpAlliances;
    console.log(alliancesFound + ". " + params.A.AID + ": " + params.A.N);
    let client = require('/app/index.js').dc_client;
    const server = client.guilds.cache.find(guild => guild.id == require('./../../../data/kanalen.json').nlserver.id);
    const ik = server.members.cache.find(member => member.id == "346015807496781825");
    await ik.send({ content: (alliancesFound + ". " + params.A.AID + ": " + params.A.N) });
    alliancesFound = alliancesFound + 1;
    if (!allAlliancesInJSON && alliancesFound < alliancesOpNLServer) {
        allianceId += 1;
        require('./../../commands/searchAllianceById.js').execute(allianceId);
    }
    else {
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
        let member = require('./wsp.js').parseOwnerInfo(memberListArray[i]);
        if(member != null)
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

module.exports = {
    name: "ain",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(errorCode, params) {
        if (errorCode == 114 || !params) {
            onError();
            return;
        }
        onSuccess(params)
    },
    allianceId: allianceId,
}