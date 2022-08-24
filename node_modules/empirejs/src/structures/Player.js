const Unit = require("./Unit");
const VillageMapobject = require("./VillageMapobject");
const CastleMapobject = require("./CastleMapobject");
const KingstowerMapobject = require("./KingstowerMapobject");
const MonumentMapobject = require("./MonumentMapobject");
const CapitalMapobject = require("./CapitalMapobject");
const InteractiveMabobject = require("./InteractiveMapobject");

class Player {
    constructor(client, data) {
        this.playerId = data.O.OID;
        this.isDummy = data.O.DUM;
        this.playerName = data.O.N;
        //this.crest = new Crest(client, data.O.E);
        this.playerLevel = data.O.L;
        this.paragonLevel = data.O.LL;
        if (data.O.RNP > 0)
            this.noobEndTime = new Date(Date.now() + data.O.RNP * 1000);
        this.honor = data.O.H;
        this.famePoints = data.O.CF;
        this.highestFamePoints = data.O.HF;
        this.isRuin = data.O.R === 1;
        this.allianceId = data.O.AID;
        this.allianceName = data.O.AN;
        this.allianceRank = data.O.AR;
        this.isSearchingAlliance = data.O.SA === 1;
        if (data.O.RPT > 0)
            this.peaceEndTime = new Date(Date.now() + data.O.RPT * 1000);
        this.castles = parseCastleList(client, data.gcl);
        this.villages = parseVillageList(client, data.kgv);
        this.kingsTowers = parseKingstowers(client, data.gkl);
        this.monuments = parseMonuments(client, data.gml);
        //this.allianceTowers = ; //horizon
        this.hasPremiumFlag = data.O.PF === 1;
        this.might = data.O.MP;
        this.achievementPoints = data.O.AVP;
        this.prefixTitleId = data.O.PRE;
        this.suffixTitleId = data.O.SUF;
        if (data.O.RRD > 0)
            this.relocateDurationEndTime = new Date(Date.now() + data.O.RRD * 1000);
        if (data.O.FN && data.O.FN.FID !== -1) {
            this.factionId = data.O.FN.FID;
            this.factionMainCampId = data.O.FN.MC;
            this.factionIsSpectator = data.O.FN.SPC === 1;
            this.factionProtectionStatus = data.O.FN.PMS;
            if (data.O.FN.PMT > 0)
                this.factionProtectionEndTime = new Date(Date.now() + data.O.FN.PMT * 1000);
            if (data.O.FN.NS > 0)
                this.factionNoobProtectionEndTime = new Date(Date.now() + data.O.FN.NS * 1000);
        }
    }
};

function parseCastleList(client, data) {
    if (!data) return;
    let output = [];
    for (i in data.C) {
        for (j in data.C[i].AI) {
            let obj = data.C[i].AI[j];
            let mapObject;
            switch(obj.AI[0]){
                case 1: ;
                case 4: ;
                case 12: mapObject = new CastleMapobject(client, obj.AI); break;
                case 3: ;
                case 22: mapObject = new CapitalMapobject(client, obj.AI); break;
                default: mapObject = new InteractiveMabobject(client, obj.AI); break;
            }
            if (obj.OGT) mapObject["remainingOpenGateTime"] = obj.OGT;
            if (obj.OGC) mapObject["openGateCounter"] = obj.OGC;
            if (obj.AOT) mapObject["remainingAbandonOutpostTime"] = obj.AOT;
            if (obj.TA) mapObject["remainingCooldownAbandonOutpostTime"] = obj.TA;
            if (obj.CAT) mapObject["remainingCancelAbandonTime"] = obj.CAT;
            output.push(mapObject);
        }
    }
    return output;
}

function parseVillageList(client, data) {
    if (!data) return;
    let publicVillagesData = [];
    for (i in data.VI) {
        let publicVillage = {};
        publicVillage["village"] = new VillageMapobject(client, data.VI[0][0]);
        if (data.VI[i].length >= 2) {
            publicVillage["units"] = parseUnits(client, data.VI[i][1]);
        }
        publicVillagesData.push(publicVillage)
    }
    let privateVillagesData = [];
    for (i in data.PV) {
        privateVillagesData.push({ uniqueId: data.PV[i].VID, privateVillageId: data.PV[i].XID });
    }
    let output = { public: publicVillagesData, private: privateVillagesData };
    return output;
}

function parseUnits(client, obj) {
    let output = [];
    for (i in obj) {
        output.push({
            unit: new Unit(client, obj[i][0]),
            count: obj[i][1],
        });
    }
    return output;
}

function parseKingstowers(client, data) {
    let kingstowers = [];
    for (i in data.AI) {
        let kingstower = new KingstowerMapobject(client, data.AI[i][0]);
        let units = [];
        if (data.AI[i].length >= 2 && data.AI[i][1] && data.AI[i][1].length > 0)
            units = parseUnits(client, data.AI[i][1]);
        kingstowers.push({ kingstower: kingstower, units: units });
    }
    return kingstowers;
}

function parseMonuments(client, data) {
    let monuments = [];
    for (i in data.AI) {
        let monument = new MonumentMapobject(client, data.AI[i][0]);
        let units = [];
        if (data.AI[i].length >= 2 && data.AI[i][1] && data.AI[i][1].length > 0)
            units = parseUnits(client, data.AI[i][1]);
            monuments.push({ monument: monument, units: units });
    }
    return monuments;
}

module.exports = Player;