const EmptyMapobject = require("./EmptyMapobject");
const CastleMapobject = require("./CastleMapobject");
const Lord = require("./Lord");
const DungeonMapobject = require("./DungeonMapobject");
const CapitalMapobject = require("./CapitalMapobject");
const InteractiveMabobject = require("./InteractiveMapobject");
const VillageMapobject = require("./VillageMapobject");
const BossDungeonMapobject = require("./BossDungeonMapobject");
const KingstowerMapobject = require("./KingstowerMapobject");
const MonumentMapobject = require("./MonumentMapobject");

class BasicMovement {
    constructor(client, data) {
        const now = Date.now();
        this.movementType = data.M.T;
        this.movementId = data.M.MID;
        this.departureTime = new Date(now - data.M.PT * 1000);
        this.arrivalTime = new Date(now + (data.M.TT - data.M.PT) * 1000);
        this.direction = data.M.D;
        this.sourceArea = getAreaFromInfo(client, data.M.SA);
        this.targetArea = getAreaFromInfo(client, data.M.TA);
        let targetPos = this.sourceArea.position;
        let sourcePos = this.targetArea.position;
        this.distance = Math.round(Math.sqrt(Math.pow(Math.abs(sourcePos.X - targetPos.X), 2) + Math.pow(Math.abs(sourcePos.Y - targetPos.Y), 2)) * 10) / 10;
        this.ownerArea = this.direction === 0 ? this.sourceArea : this.targetArea;
        this.kingdomId = data.M.KID;
        this.horseBoosterWodId = data.M.HBW;
        if (data.M.UM) {
            this.endWaitTime = new Date(now + (data.M.TT - data.M.PT + data.M.UM.TWD - data.M.UM.PWD) * 1000);
            if (data.M.UM.L) {
                this.lord = new Lord(client, data.M.UM.L);
            }
        }
    }
}

function getAreaFromInfo(client, info) {
    switch (info[0]) {
        case 0: return new EmptyMapobject(client, info);
        case 1: return new CastleMapobject(client, info);
        case 2: return new DungeonMapobject(client, info);
        case 3: return new CapitalMapobject(client, info);
        case 4: return new CastleMapobject(client, info);
        case 10: return new VillageMapobject(client, info);
        case 11: return new BossDungeonMapobject(client, info);
        case 12: return new CastleMapobject(client, info);
        case 22: return new CapitalMapobject(client, info);
        case 23: return new KingstowerMapobject(client, info);
        case 26: return new MonumentMapobject(client, info);
        default:
            console.log(`Current mapobject (areatype ${info[0]}) isn't fully supported!`);
            return new InteractiveMabobject(client, info);
    }
}

module.exports = BasicMovement;