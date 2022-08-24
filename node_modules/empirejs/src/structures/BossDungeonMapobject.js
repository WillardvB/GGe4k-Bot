const BasicMapobject = require("./BasicMapobject");

class BossDungeonMapobject extends BasicMapobject {
    constructor(client, data) {
        super(client, data);
        if (data[3] !== -1)
            this.lastSpyDate = new Date(Date.now() - data[3] * 1000);
        this.dungeonLevel = data[4];
        if (data[5] > 0)
            this.attackCooldownEnd = new Date(Date.now() + data[5] * 1000);
        this.defeaterPlayerId = data[6];
        this.kingdomId = data[7];
    }
}

module.exports = BossDungeonMapobject;