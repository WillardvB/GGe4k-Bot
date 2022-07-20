module.exports = {
    name: "wsp",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(errorCode, params) {
        if (errorCode == 21) return;
        parseOwnerInfoArray(params.gaa.OI);
    },
    parseOwnerInfo(ownerInfo) {
        return parseOwnerInfo(ownerInfo);
    }
}

/**
 * 
 * @param {Array} ownerInfoArray
 */
function parseOwnerInfoArray(ownerInfoArray) {
    if (!ownerInfoArray) {
        return;
    }
    for (let ownerInfo in ownerInfoArray) {
        parseOwnerInfo(ownerInfoArray[ownerInfo]);
    }
}

/**
 * 
 * @param {object} ownerInfo
 */
function parseOwnerInfo(ownerInfo) {
    if (!ownerInfo || !ownerInfo.OID) {
        return null;
    }
    var playerId = ownerInfo.OID;
    var _worldMapOwnerInfoVO = {
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
    let tmpPlayers = require('./../../data.js').players;
    _worldMapOwnerInfoVO = tmpPlayers[playerId];
    if (ownerInfo.DUM) {
        if (!_worldMapOwnerInfoVO) {
            _worldMapOwnerInfoVO = {
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
            _worldMapOwnerInfoVO.playerId = playerId;
            _worldMapOwnerInfoVO.isDummy = true;
            tmpPlayers[playerId] = _worldMapOwnerInfoVO;
            require('./../../data.js').players = tmpPlayers;
        }
        return _worldMapOwnerInfoVO;
    }
    let isNPC = playerId < 0;
    if (isNPC) {
        return null;
    }
    if (!_worldMapOwnerInfoVO) {
        _worldMapOwnerInfoVO = {
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
        _worldMapOwnerInfoVO = worldMapOwnerFillFromParamObject(_worldMapOwnerInfoVO, ownerInfo);
        tmpPlayers = require('./../../data.js').players;
        tmpPlayers[playerId] = _worldMapOwnerInfoVO;
        require('./../../data.js').players = tmpPlayers;
    }
    else {
        tmpPlayers = require('./../../data.js').players;
        _worldMapOwnerInfoVO = worldMapOwnerFillFromParamObject(tmpPlayers[playerId], ownerInfo);
        tmpPlayers[playerId] = _worldMapOwnerInfoVO;
        require('./../../data.js').players = tmpPlayers;
    }
    //setTitleVOForOwnerInfo(_worldMapOwnerInfoVO, ownerInfo.TI);
    return _worldMapOwnerInfoVO;
}

/**
 * 
 * @param {object} worldMapOwnerInfoVO
 * @param {object} paramObj
 */
function worldMapOwnerFillFromParamObject(worldMapOwnerInfoVO, paramObj) {
    let vo = worldMapOwnerInfoVO;
    vo.playerId = paramObj["OID"];
    vo.isDummy = paramObj["DUM"];
    vo.playerName = paramObj.N;
    vo.crest = {
        backgroundType: paramObj["E"].BGT,
        backgroundColor1: paramObj["E"].BGC1,
        backgroundColor2: paramObj["E"].BGT == 0 ? paramObj["E"].BGC1 : paramObj["E"].BGC2,
        symbolPosType: paramObj["E"].SPT,
        symbolType1: paramObj["E"].S1,
        symbolType2: paramObj["E"].S2,
        symbolColor1: paramObj["E"].SC1,
        symbolColor2: paramObj["E"].SC2,
    };
    let _colors = [];
    let _colorsTwo = [];
    switch (parseInt(paramObj["E"].BGT)) {
        case 0:
            _colors.push(vo.crest.backgroundColor1, vo.crest.backgroundColor1, vo.crest.backgroundColor1, vo.crest.backgroundColor1);
            _colorsTwo.push(vo.crest.backgroundColor1, vo.crest.backgroundColor1);
            break;
        case 1:
            _colors.push(vo.crest.backgroundColor1, vo.crest.backgroundColor2, vo.crest.backgroundColor1, vo.crest.backgroundColor2);
            _colorsTwo.push(vo.crest.backgroundColor1, vo.crest.backgroundColor2);
            break;
        case 2:
            _colors.push(vo.crest.backgroundColor1, vo.crest.backgroundColor1, vo.crest.backgroundColor2, vo.crest.backgroundColor2);
            _colorsTwo.push(vo.crest.backgroundColor1, vo.crest.backgroundColor2);
            break;
        case 3:
            _colors.push(vo.crest.backgroundColor1, vo.crest.backgroundColor2, vo.crest.backgroundColor2, vo.crest.backgroundColor1);
            _colorsTwo.push(vo.crest.backgroundColor1, vo.crest.backgroundColor2);
    }
    vo.crest.colors = _colors;
    vo.crest.colorsTwo = _colorsTwo;
    vo.playerLevel = paramObj["L"];
    vo.paragonLevel = paramObj["LL"];
    vo.remainingNoobTime = paramObj["RNP"];
    //vo.noobTimeOffset = getTimer();
    vo.honor = paramObj["H"];
    vo.famePoints = paramObj["CF"];
    vo.isRuin = paramObj["R"] == 1;
    vo.allianceID = paramObj["AID"];
    vo.allianceRank = parseInt(paramObj["AR"]);
    vo.allianceName = !!paramObj["AN"] ? paramObj["AN"] : "";
    vo.allianceFame = paramObj["ACF"];
    vo.isSearchingAlliance = paramObj["SA"];
    vo.remainingPeaceTime = paramObj["RPT"];
    //vo.peaceTimeOffset = getTimer();
    vo.castlePosList = parsePosList(paramObj["AP"]);
    if (paramObj["VP"]) {
        vo.villagePosList = parsePosList(paramObj["VP"]);
    }
    vo.hasPremiumFlag = paramObj["PF"];
    vo.hasVIPFlag = paramObj["VF"];
    vo.might = !isNaN(paramObj["MP"]) ? paramObj["MP"] : -1;
    vo.achievementPoints = paramObj["AVP"];
    vo.prefixTitleId = paramObj["PRE"];
    vo.suffixTitleId = paramObj["SUF"];
    vo.relocateDurationEndTimestamp = Math.max(0, /*getTimer() +*/ paramObj["RRD"] * 1000);
    if (paramObj["FN"] && paramObj["FN"]["FID"] != -1) {
        vo.factionID = paramObj["FN"]["FID"];
        vo.factionMainCampID = paramObj["FN"]["MC"];
        vo.factionIsSpectator = paramObj["FN"]["SPC"] == 1;
        vo.factionProtectionStatus = paramObj["FN"]["PMS"];
        vo.factionProtectionEndTime = paramObj["FN"]["PMT"] * 1000;
        vo.factionNoobProtectionEndTime = paramObj["FN"]["NS"] * 1000;
    }
    return vo;
}

/**
 * 
 * @param {Array} posItems
 */
function parsePosList(posItems) {
    var _loc3_ = null;
    var _loc2_ = [];
    console.log(posItems);
    for (var i in posItems) {
        let _loc4_ = posItems[i];
        _loc3_ = {
            kingdomId: _loc4_[0],
            objectId: _loc4_[1],
            xPos: _loc4_[2],
            yPos: _loc4_[3],
            areaType: _loc4_[4],
            lineColor: -1,
            overlayIconVO: {
                view: null,//MovieClip,
                xPosOffset: 0,
                yPosOffset: 0,
            },
        };
        _loc2_.push(_loc3_);
    }
    return _loc2_;
}