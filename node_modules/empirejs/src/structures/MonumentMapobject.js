const BasicMapobject = require("./BasicMapobject");

class MonumentMapobject extends BasicMapobject {
    constructor(client, data) {
        super(client, data);
        this.objectId = data[3];
        this.occupierId = data[4];
        this.monumentType = data[5];
        this.monumentLevel = data[6];
        this.kingdomId = data[7];
        if(data[8] !== -1)
            this.lastSpyDate = new Date(Date.now() - data[8] * 1000);
        this.customName = data[9];
    }
}

module.exports = MonumentMapobject;