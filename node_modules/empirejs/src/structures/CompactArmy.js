const Unit = require("./Unit");

class CompactArmy {
    armySize = 0;
    constructor(client, data) {
        this.left = parse(client, data.L);
        this.middle = parse(client, data.M);
        this.right = parse(client, data.R);
        this.supportTools = parse(client, data.AST);
        for (i in this.left) {
            this.armySize += this.left[i].count;
        }
        for (i in this.middle) {
            this.armySize += this.middle[i].count;
        }
        for (i in this.right) {
            this.armySize += this.right[i].count;
        }
        for (i in this.supportTools) {
            this.armySize += this.supportTools[i].count;
        }
    }
}

function parse(client, obj) {
    let output = [];
    for (i in obj) {
        output.push({
            unit: new Unit(client, obj[i][0]),
            count: obj[i][1],
        });
    }
    return output;
}

module.exports = CompactArmy;