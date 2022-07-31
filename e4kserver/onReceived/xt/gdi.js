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
        player.castles = parseCastleList(params.gcl);
        if (player.playerName.toLowerCase() === "denas") {
            player.villages = {
                public: parsePublicVillageList(params.kgv),
                private: parsePrivateVillageList(params.kgv),
            }
            player.kingsTowers = parseKingsTowerList(params.gkl);
            player.monuments = parseMonumentList(params.gml);
            player.allianceTowers = parseAllianceTowerList(params.tie);
        }
        require("../../data").players[player.playerId] = player;
    },
}

/**
 * 
 * @param {object} paramObject
 */
function parseCastleList(paramObject) {
    let _castles = {};
    if (!paramObject) {
        return _castles;
    }
    for(let _loc7_ in paramObject["C"])
    {
        let __obj = paramObject["C"][_loc7_];
        let _loc5_ = [];
        for (let i = 0; i < __obj["AI"].length; i++)
        {
            let _obj = __obj["AI"][i];
            let _objAI = _obj.AI;
            let _loc6_ = {
                areaType: _objAI[0],
                posX: _objAI[1],
                posY: _objAI[2],
                objectId: _objAI[3],
                keepLevel: _objAI[5],
                wallLevel: _objAI[6],
                gateLevel: _objAI[7],
                towerLevel: _objAI[8],
                moatLevel: _objAI[9],
                customName: _objAI[10],
                outpostType: _objAI[14],
                occupierID: _objAI[15],
                kingdomId: _objAI[16],
                equipmentID: _objAI[17],
            }
            if (_obj["OGT"]) {
                _loc6_.remainingOpenGateTime = _obj["OGT"];
            }
            if (_obj["OGC"]) {
                _loc6_.openGateCounter = _obj["OGC"];
            }
            if (_obj["AOT"]) {
                _loc6_.remainingAbandonOutpostTime = _obj["AOT"];
            }
            if (_obj["TA"]) {
                _loc6_.remainingCooldownAbandonOutpostTime = _obj["TA"];
            }
            if (_obj["CAT"]) {
                _loc6_.remainingCancelAbandonTime = _obj["CAT"];
            }
            _loc5_.push(_loc6_);
        }
        _castles[__obj["KID"]] = _loc5_;
    }
    return _castles;
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
        let _obj = paramObject["VI"][_loc6_];
        console.log(_obj);
        _loc4_ = _obj[0];
        //(_loc7_ = worldmapObjectFactory.createWorldMapAreaByInfo(_loc4_)/* as VillageMapobjectVO*/).ownerInfo = ownerInfo;
        if ((_loc5_ = _obj[1]) && _loc5_.length > 0) {
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
    //console.log('Private villages');
    for(var _loc4_ in paramObject["PV"])
    {
        //console.log(_loc4_);
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
    //console.log('KingsTowers');
    for(var _loc5_ in paramObject["AI"])
    {
        //console.log(_loc5_);
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
    //console.log('Monuments');
    for(var _loc4_ in paramObject["AI"])
    {
        //console.log(_loc4_);
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
    //console.log('Alliance towers');
    var _loc3_ = _loc2_.length;
    _loc4_ = 0;
    while (_loc4_ < _loc3_) {
        //console.log(_loc2_[_loc4_]);
        //(_loc5_ = worldmapObjectFactory.createWorldMapArea(41)/* as AllianceTowerMapobjectVO*/).parseAreaInfo(_loc2_[_loc4_]);
        //allianceTowers.push(_loc5_);
        _loc4_++;
    }
    return allianceTowers;
}