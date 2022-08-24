const CompactArmy = require("./CompactArmy");
const BasicMovement = require("./BasicMovement");

class ArmyAttackMovement extends BasicMovement {
   constructor(client, data) {
      super(client, data);
      if (data.FA) {
         this.army = parseArmy(client, data.FA);
         this.armyState = 0;
      }
      else if (data.GA) {
         this.army = parseArmy(client, data.GA);
         this.armyState = 1;
      }
      else if (data.GS) {
         this.guessedSize = data.GS;
         this.armyState = 2;
      }
      this.attackType = parseInt(data.ATT);
      this.isShadowMovement = data.SM === 1;
      this.isForceCancelable = !!data.FC ? data.FC === 1 : false;
   }
}

function parseArmy(client, data) {
   return new CompactArmy(client, data);
}

module.exports = ArmyAttackMovement;