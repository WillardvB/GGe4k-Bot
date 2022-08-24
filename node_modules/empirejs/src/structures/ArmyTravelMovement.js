const CompactArmy = require("./CompactArmy");
const BasicMovement = require("./BasicMovement");
const Good = require("./Good");

class ArmyTravelMovement extends BasicMovement {
    constructor(client, data) {
        super(client, data);
        this.army = new CompactArmy(client, data.A);
        this.goods = parseGoods(client, data.G);
    }
}

function parseGoods(client, data) {
    let goods = []
    for (i in data) {
        goods.push(new Good(client, data[i]));
    }
    return goods;
}

module.exports = ArmyTravelMovement;