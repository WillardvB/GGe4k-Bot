const villages = require('./../../../ingame_data/villages.json');
const privateVillages = require('./../../../ingame_data/privateVillages.json');
const emptyAreas = require('./../../../ingame_data/emptyAreas.json');
const buildings = require('./../../../ingame_data/buildings.json');

let _tmp_player = null;

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
        _tmp_player = player;
        if (player === null) return;
        player["castles"] = parseCastleList(params.gcl);
        player["villages"] = {
            public: parsePublicVillageList(params.kgv),
            private: parsePrivateVillageList(params.kgv),
        };
        if (player.playerName === "Denas" || player.playerName.toLowerCase() === "aura") {
            player["kingsTowers"] = parseKingsTowerList(params.gkl);
            player["monuments"] = parseMonumentList(params.gml);
            player["allianceTowers"] = parseAllianceTowerList(params.tie);
        }
        let tmpPlayers = require("../../data").players;
        tmpPlayers[player.playerId] = player;
        require("../../data").players = tmpPlayers;
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
    let _publicVillages = [];
    if (!paramObject) {
        return _publicVillages;
    }
    for(var _loc6_ in paramObject["VI"])
    {
        let __obj = paramObject["VI"][_loc6_];
        let _obj = __obj[0];
        let villageMapObjectVO = {
            areaType: _obj[0],
            posX: _obj[1],
            posY: _obj[2],
            objectId: _obj[3],
            villageType: _obj[5],
            kingdomId: _obj[6],
            customName: _obj[8],
            keepLevel: 0,
            wallLevel: 0,
            gateLevel: 0,
            moatLevel: 0,
        }
        const _villageKeys = Object.keys(villages);
        const _key = _villageKeys.find(x => villages[x].kID === villageMapObjectVO.kingdomId);
        const _villageData = villages[_key];
        if (_villageData !== undefined) {
            const _buildingKeys = Object.keys(buildings);
            if (_villageData.keepWodId !== "-1") {
                let key = _buildingKeys.find(x => buildings[x].wodID === _villageData.keepWodId);
                villageMapObjectVO.keepLevel = buildings[key].level;
            }
            if (_villageData.wallWodId !== "-1") {
                let key = _buildingKeys.find(x => buildings[x].wodID === _villageData.wallWodId);
                villageMapObjectVO.wallLevel = buildings[key].level;
            }
            if (_villageData.gateWodId !== "-1") {
                let key = _buildingKeys.find(x => buildings[x].wodID === _villageData.gateWodId);
                villageMapObjectVO.gateLevel = buildings[key].level;
            }
            if (_villageData.moatWodId !== "-1") {
                let key = _buildingKeys.find(x => buildings[x].wodID === _villageData.moatWodId);
                villageMapObjectVO.moatLevel = buildings[key].level;
            }
        }
        if ((_obj = __obj[1]) && _obj.length > 0) {
        //    _loc8_ = castleInventoryParser.parseUnitsInventory(_obj);
        //    _loc7_.setUnits(_loc8_);
        }
        _publicVillages.push(villageMapObjectVO);
    }
    return _publicVillages;
}

/**
 * 
 * @param {object} paramObject
 */
function parsePrivateVillageList(paramObject) {
    var _loc3_ = [];
    if (!paramObject) {
        return _loc3_;
    }
    for(let item in paramObject["PV"])
    {
        let _obj = paramObject["PV"][item];
        const _villageId = _obj.XID.toString();
        const _villageKeys = Object.keys(privateVillages);
        const _key = _villageKeys.find(x => privateVillages[x].villageID === _villageId);
        if (_key !== undefined) {
            const _villageData = privateVillages[_key];
            let privateVillageVO = {
                uniqueId: _obj.VID,
                villageID: _villageData.villageID,
                type: _villageData.type,
                villageLevel: _villageData.villageLevel,
                kID: _villageData.kID,
                costResourceVillageToken: _villageData.costResourceVillageToken,
                effects: _villageData.effects,
            }
            _loc3_.push(privateVillageVO);
        }
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
    console.log(paramObject);
    for(let item in paramObject["AI"])
    {
        let kingstowerMapobjectVO = null;
        let __obj = paramObject["AI"][item];
        console.log(__obj);
        let _obj = __obj[0];
        if (_obj.length > 0) {
            kingstowerMapobjectVO = {
                areaType: _obj[0],
                posX: _obj[1],
                posY: _obj[2],
                objectId: _obj[3],
                occupierID: _obj[4],
                kingdomId: _obj[5],
                customName: _obj[7],
                keepLevel: 0,
                wallLevel: 0,
                gateLevel: 0,
                moatLevel: 0,
            }
            const _emptyAreasKeys = Object.keys(emptyAreas);
            const _key = _emptyAreasKeys.find(x => {
                emptyAreas[x].areaType === kingstowerMapobjectVO.areaType && emptyAreas[x].isBattleground === "0"
            });
            const _emptyAreaData = emptyAreas[_key];
            if (_emptyAreaData !== undefined) {
                const _buildingKeys = Object.keys(buildings);
                if (_emptyAreaData.keepWodId !== "-1") {
                    let key = _buildingKeys.find(x => buildings[x].wodID === _emptyAreaData.keepWodId);
                    kingstowerMapobjectVO.keepLevel = buildings[key].level;
                }
                if (_emptyAreaData.wallWodId !== "-1") {
                    let key = _buildingKeys.find(x => buildings[x].wodID === _emptyAreaData.wallWodId);
                    kingstowerMapobjectVO.wallLevel = buildings[key].level;
                }
                if (_emptyAreaData.gateWodId !== "-1") {
                    let key = _buildingKeys.find(x => buildings[x].wodID === _emptyAreaData.gateWodId);
                    kingstowerMapobjectVO.gateLevel = buildings[key].level;
                }
            }
        }
        _obj = __obj[1];
        if (_obj && _obj.length > 0) {
        //    castleInventoryParser.parseUnitsInventory(_obj[1], _loc4_.unitInventory);
        }
        if (kingstowerMapobjectVO !== null) {
            console.log(kingstowerMapobjectVO);
            _loc2_.push(kingstowerMapobjectVO);
        }
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