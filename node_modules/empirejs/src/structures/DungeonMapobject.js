const BasicMapobject = require("./BasicMapobject");

class DungeonMapobject extends BasicMapobject {
    constructor(client, data) {
        super(client, data);
        if (data[3] > 0)
            this.lastSpyDate = new Date(Date.now() - data[3] * 1000);
        this.attackCount = data[4];
        if (data[5] > 0)
            this.attackCooldownEnd = new Date(Date.now() + data[5] * 1000);
        this.kingdomId = data[6];
    }
}

module.exports = DungeonMapobject;