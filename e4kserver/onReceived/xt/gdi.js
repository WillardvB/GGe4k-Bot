const villages = require('./../../../ingame_data/villages.json');
const privateVillages = require('./../../../ingame_data/privateVillages.json');
const monuments = require('./../../../ingame_data/monuments.json');
const emptyAreas = require('./../../../ingame_data/emptyAreas.json');
const buildings = require('./../../../ingame_data/buildings.json');
const Logger = require('../../../tools/Logger');

module.exports = {
    name: "gdi",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(errorCode, params) {
        try {
            if (errorCode == 21) return; //player not found.
            let player = require("./wsp").parseOwnerInfo(params.O, true);
            if (player === null) return;
            player["castles"] = parseCastleList(params.gcl);
            player["villages"] = {
                public: parsePublicVillageList(params.kgv),
                private: parsePrivateVillageList(params.kgv),
            };
            player["kingsTowers"] = parseKingsTowerList(params.gkl);
            player["monuments"] = parseMonumentList(params.gml);
            let tmpPlayers = require("../../data").players;
            tmpPlayers[player.playerId] = player;
            require("../../data").players = tmpPlayers;
        }
        catch (e) {
            Logger.logError(e);
        }
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
            let _loc6_ = null;
            if (_objAI[0] === 3 || _objAI[0] === 22) {
                _loc6_ = {
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
                    occupierID: _objAI[14],
                    equipmentID: _objAI[15],
                    kingdomId: _objAI[16],
                    depletionTime: _objAI[17],
                    influencePoints: _objAI[18],
                }
            } else {
                _loc6_ = {
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
            }
            if (_obj["OGT"]) {
                _loc6_["remainingOpenGateTime"] = _obj["OGT"];
            }
            if (_obj["OGC"]) {
                _loc6_["openGateCounter"] = _obj["OGC"];
            }
            if (_obj["AOT"]) {
                _loc6_["remainingAbandonOutpostTime"] = _obj["AOT"];
            }
            if (_obj["TA"]) {
                _loc6_["remainingCooldownAbandonOutpostTime"] = _obj["TA"];
            }
            if (_obj["CAT"]) {
                _loc6_["remainingCancelAbandonTime"] = _obj["CAT"];
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
    var _loc2_ = [];
    if (!paramObject) {
        return _loc2_;
    }
    for(let item in paramObject["AI"]) {
        let __obj = paramObject["AI"][item];
        let _obj = __obj[0];
        if (_obj.length > 0) {
            let kingstowerMapobjectVO = {
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
    var _loc2_ = [];
    if (!paramObject) {
        return _loc2_;
    }
    for (let item in paramObject["AI"]) {
        let __obj = paramObject["AI"][item];
        let _obj = __obj[0];
        if (_obj.length > 0) {
            let monumentMapobjectVO = {
                areaType: _obj[0],
                posX: _obj[1],
                posY: _obj[2],
                objectId: _obj[3],
                occupierID: _obj[4],
                monumentType: _obj[5],
                level: _obj[6],
                kingdomId: _obj[7],
                customName: _obj[9],
                keepLevel: 0,
                wallLevel: 0,
                gateLevel: 0,
                moatLevel: 0,
            }
            const _emptyAreasKeys = Object.keys(emptyAreas);
            const _key = _emptyAreasKeys.find(x => {
                emptyAreas[x].areaType === monumentMapobjectVO.areaType && emptyAreas[x].isBattleground === "0"
            });
            const _emptyAreaData = emptyAreas[_key];
            if (_emptyAreaData !== undefined) {
                const _buildingKeys = Object.keys(buildings);
                if (_emptyAreaData.keepWodId !== "-1") {
                    let key = _buildingKeys.find(x => buildings[x].wodID === _emptyAreaData.keepWodId);
                    monumentMapobjectVO.keepLevel = buildings[key].level;
                }
                if (_emptyAreaData.wallWodId !== "-1") {
                    let key = _buildingKeys.find(x => buildings[x].wodID === _emptyAreaData.wallWodId);
                    monumentMapobjectVO.wallLevel = buildings[key].level;
                }
                if (_emptyAreaData.gateWodId !== "-1") {
                    let key = _buildingKeys.find(x => buildings[x].wodID === _emptyAreaData.gateWodId);
                    monumentMapobjectVO.gateLevel = buildings[key].level;
                }
            }
            const _monumentsKeys = Object.keys(monuments);
            const _key2 = _monumentsKeys.find(x => Math.max(monuments[x].level, 1) === monumentMapobjectVO.level);
            const _monumentData = monuments[_key2];
            monumentMapobjectVO["fameBoost"] = _monumentData.fameBoost;
            monumentMapobjectVO["requiredPoints"] = _monumentData.requiredPoints;
            _loc2_.push(monumentMapobjectVO);
        }
    }
    return _loc2_;
}