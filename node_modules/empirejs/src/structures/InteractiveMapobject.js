const BasicMapobject = require("./BasicMapobject");

class InteractiveMabobject extends BasicMapobject {
    constructor(client, data) {
        super(client, data);
        this.objectId = data[3];
        this.ownerId = data[4];
        this.keepLevel = data[5];
        this.wallLevel = data[6];
        this.gateLevel = data[7];
        this.towerLevel = data[8];
        this.moatLevel = data[9];
        this.customName = data[10];
        if (data[11] > 0)
            this.attackCooldownEnd = new Date(Date.now() + data[11] * 1000);
        if (data[12] > 0)
            this.sabotageCooldownEnd = new Date(Date.now() + data[12] * 1000);
        if (data[13] > 0)
            this.lastSpyDate = new Date(Date.now() - data[13] * 1000);
        this.outpostType = data[14];
        this.occupierId = data[15];
        this.kingdomId = data[16];
        this.equipmentId = data[17];
    }
}

module.exports = InteractiveMabobject;