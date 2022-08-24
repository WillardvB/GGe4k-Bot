const BasicMapobject = require("./BasicMapobject");

class KingstowerMapobject extends BasicMapobject {
    constructor(client, data) {
        super(client, data);
        this.objectId = data[3];
        this.ownerId = data[4];
        this.kingdomId = data[5];
        if (data[6] > 0)
            this.lastSpyDate = new Date(Date.now() - data[6] * 1000);
        this.customName = data[7];
    }
}

module.exports = KingstowerMapobject;