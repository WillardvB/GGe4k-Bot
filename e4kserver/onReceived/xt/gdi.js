module.exports = {
    name: "gdi",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(errorCode, params) {
        if (errorCode == 21) return; //player not found.
        let player = require("./wsp").parseOwnerInfo(params.O, true);
        if (player === null) return;
        if (player.playerName.toLowerCase() === "denas") {
            player.castles = parseCastleList(params.gcl);
            player.villages = {
                public: parsePublicVillageList(params.kgv),
                private: parsePrivateVillageList(params.kgv),
            }
            player.kingsTowers = parseKingsTowerList(params.gkl);
            player.monuments = parseMonumentList(params.gml);
            player.allianceTowers = parseAllianceTowerList(params.tie);
        }
        /**
         var _loc2_:CastleListVO = new CastleListVO();
         _loc2_.ownerID = _loc4_.playerID;
         _loc2_.castles = castleListParser.parseCastleList(paramObj.gcl,_loc4_);
         _loc2_.publicVillages = castleListParser.parsePublicVillageList(paramObj.kgv,_loc4_);
         _loc2_.privateVillages = castleListParser.parsePrivateVillageList(paramObj.kgv,_loc4_);
         _loc2_.kingsTowers = castleListParser.parseKingsTowerList(paramObj.gkl);
         _loc2_.monuments = castleListParser.parseMonumentList(paramObj.gml);
         _loc2_.allianceTowers = new Vector.<AllianceTowerMapobjectVO>(0);
         var _loc3_:TIEParser = parserFactory.getParser("tie") as TIEParser;
         _loc3_.setParsePayload(_loc2_.allianceTowers);
         _loc3_.parse(paramObj["tie"]);
         detailPlayerInfoLoadedSignal.dispatch(_loc2_);
         */
        require("../../data").players[player.playerId] = player;
    },
}



/**
 * 
 * @param {Array} areaInfo
 */
/*
function createWorldMapAreaByInfo(areaInfo) {
    if (!areaInfo) {
        warn("areaInfo is null, IWorldmapObjectVO can\'t be created ");
        return null;
    }
    var _loc2_ = areaInfo[0];
    var _loc3_ = createWorldMapArea(_loc2_);
    _loc3_.parseAreaInfo(areaInfo);
    _loc3_.ownerInfo = _loc3_.ownerInfo || getDefaultOwnerInfo(_loc3_);
    return _loc3_;
}
*/
/**
 * 
 * @param {Array} params
 */
/*
function parseAreaInfo(params) {
    areaType = params[0];
    super.parseAreaInfo(params);
    objectID = params[3];
    ownerId = params[4];
    ownerInfo = WorldMapOwnerHelper.getOwnerInfoVO(_ownerId);
    keepLevel = params[5];
    wallLevel = params[6];
    gateLevel = params[7];
    towerLevel = params[8];
    _moatLevel = params[9];
    customName = params[10];
    attackCooldownSec = params[11];
    _sabotageCooldownEndTimestamp = getTimer() + params[12] * 1000;
    secondsSinceEspionage = params[13];
    outpostType = params[14];
    _occupierID = params[15];
    kingdomId = params[16];
    _equipmentID = params[17];
    onValueObjectChangedSignal.dispatch([]);
}
*/
/**
 * 
 * @param {object} paramObject
 */
function parseCastleList(paramObject) {
    var _loc6_ = null;
    var _loc3_ = {};
    if (!paramObject) {
        return _loc3_;
    }
    console.log('castles')
    for(var _loc7_ in paramObject["C"])
    {
        console.log(paramObject["C"])
        console.log("KID: " + paramObject["C"][_loc7_]["KID"]);
        let _loc5_ = [];
        for(var _loc4_ in _loc7_["AI"])
        {
            console.log(_loc4_);
            //_loc6_ = worldmapObjectFactory.createWorldMapAreaByInfo(_loc4_["AI"]);
            if (_loc4_["OGT"]) {
                _loc6_.remainingOpenGateTime = _loc4_["OGT"];
            }
            if (_loc4_["OGC"]) {
                _loc6_.openGateCounter = _loc4_["OGC"];
            }
            if (_loc4_["AOT"]) {
                _loc6_.remainingAbandonOutpostTime = _loc4_["AOT"];
            }
            if (_loc4_["TA"]) {
                _loc6_.remainingCooldownAbandonOutpostTime = _loc4_["TA"];
            }
            if (_loc4_["CAT"]) {
                _loc6_.remainingCancelAbandonTime = _loc4_["CAT"];
            }
            //_loc5_.push(_loc6_);
        }
        _loc3_[_loc7_["KID"]] = _loc5_;
    }
    return _loc3_;
}

/**
 * 
 * @param {object} paramObject
 */
function parsePublicVillageList(paramObject) {
    var _loc4_ = null;
    var _loc7_ = null;
    var _loc5_ = null;
    var _loc8_ = null;
    var _loc3_ = [];
    if (!paramObject) {
        return _loc3_;
    }
    console.log('Public villages');
    for(var _loc6_ in paramObject["VI"])
    {
        console.log(_loc6);
        _loc4_ = _loc6_[0];
        //(_loc7_ = worldmapObjectFactory.createWorldMapAreaByInfo(_loc4_)/* as VillageMapobjectVO*/).ownerInfo = ownerInfo;
        if ((_loc5_ = _loc6_[1]) && _loc5_.length > 0) {
        //    _loc8_ = castleInventoryParser.parseUnitsInventory(_loc5_);
        //    _loc7_.setUnits(_loc8_);
        }
        //_loc3_.push(_loc7_);
    }
    return _loc3_;
}

/**
 * 
 * @param {object} paramObject
 */
function parsePrivateVillageList(paramObject) {
    var _loc5_ = null;
    var _loc6_ = null;
    var _loc3_ = [];
    if (!paramObject) {
        return _loc3_;
    }
    console.log('Private villages');
    for(var _loc4_ in paramObject["PV"])
    {
        console.log(_loc4_);
        //if (_loc5_ = resourceVillageStaticData.getPrivateVillageStaticVOById(_loc4_["XID"])) {
        //    (_loc6_ = new PrivateVillageVO(_loc5_)).uniqueId = _loc4_["VID"];
        //    _loc3_.push(_loc6_);
        //}
    }
    return _loc3_;
}

/**
 * 
 * @param {object} paramObject
 */
function parseKingsTowerList(paramObject) {
    var _loc3_ = null;
    var _loc4_ = null;
    var _loc2_ = [];
    if (!paramObject) {
        return _loc2_;
    }
    console.log('KingsTowers');
    for(var _loc5_ in paramObject["AI"])
    {
        console.log(_loc5_);
        _loc3_ = _loc5_[0];
        //_loc4_ = worldmapObjectFactory.createWorldMapAreaByInfo(_loc3_);// as KingstowerMapobjectVO;
        if (_loc5_[1] && _loc5_[1].length > 0) {
        //    castleInventoryParser.parseUnitsInventory(_loc5_[1], _loc4_.unitInventory);
        }
        //_loc2_.push(_loc4_);
    }
    return _loc2_;
}

/**
 * 
 * @param {object} paramObject
 */
function parseMonumentList(paramObject) {
    var _loc3_ = null;
    var _loc5_ = null;
    var _loc2_ = [];
    if (!paramObject) {
        return _loc2_;
    }
    console.log('Monuments');
    for(var _loc4_ in paramObject["AI"])
    {
        console.log(_loc4_);
        _loc3_ = _loc4_[0];
        //_loc5_ = worldmapObjectFactory.createWorldMapAreaByInfo(_loc3_);// as MonumentMapobjectVO;
        if (_loc4_[1] && _loc4_[1].length > 0) {
        //    _loc5_.parseUnits(_loc4_[1]);
        }
        //_loc2_.push(_loc5_);
    }
    return _loc2_;
}

/**
 * 
 * @param {object} paramObj
 */
function parseAllianceTowerList(paramObj) {
    let allianceTowers = [];
    var _loc4_ = 0;
    var _loc5_ = null;
    var _loc2_ = [];
    if (paramObj && paramObj["T"] && typeof paramObj["T"] === Array)
    {
        _loc2_ = paramObj["T"];
    }
    console.log('Alliance towers');
    var _loc3_ = _loc2_.length;
    _loc4_ = 0;
    while (_loc4_ < _loc3_) {
        console.log(_loc2_[_loc4_]);
        //(_loc5_ = worldmapObjectFactory.createWorldMapArea(41)/* as AllianceTowerMapobjectVO*/).parseAreaInfo(_loc2_[_loc4_]);
        //allianceTowers.push(_loc5_);
        _loc4_++;
    }
    return allianceTowers;
}