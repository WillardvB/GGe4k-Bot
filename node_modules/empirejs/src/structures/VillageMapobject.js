const BasicMapobject = require("./BasicMapobject");

class VillageMapobject extends BasicMapobject {
    constructor(client, data) {
        super(client, data);
        this.objectId = data[3];
        this.occupierId = data[4];
        this.villageType = data[5];
        this.kingdomId = data[6];
        if (data[7] > 0)
            this.lastSpyDate = new Date(Date.now() - data[7] * 1000);
        this.customName = data[8];
    }
}

module.exports = VillageMapobject;