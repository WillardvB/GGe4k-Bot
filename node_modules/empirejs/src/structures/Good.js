const goodNames = {
    W:"wood",
    S:"stone",
    F:"food",
    C1: "coin",
    C2: "ruby"
}

class Good {
    constructor(client, data) {
        this.name = goodNames[data[0]];
        this.count = data[1];
    }
}

module.exports = Good;