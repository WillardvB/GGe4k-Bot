class BasicMapobject {
    constructor(client, data) {
        this.areaType = data[0];
        this.position = {
            X: data[1],
            Y: data[2]
        }
    }
}

module.exports = BasicMapobject;