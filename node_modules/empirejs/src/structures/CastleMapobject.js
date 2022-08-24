const InteractiveMapobject = require("./InteractiveMapobject");

class CastleMapobject extends InteractiveMapobject {
    constructor(client, data) {
        if (data.length <= 4) {
            this.areaType = data[0];
            this.position = {
                X: data[1],
                Y: data[2]
            };
            this.occupierId = data[3];
        }
        else {
            super(client, data);
            let _externalServerInformation = data[18];
        }
    }
}

module.exports = CastleMapobject;