const Client = require('./../../../Client');
const Movement = require("./../../../structures/BasicMovement");
const {Socket} = require("node:net");
const ArmyAttackMovement = require('./../../../structures/ArmyAttackMovement');
const ArmyTravelMovement = require('./../../../structures/ArmyTravelMovement');

let movements = [{
    id: 0,
    source: {
        areaType: 0,
        posX: 0,
        posY: 0,
        objectId: 0,
        playerId: 0,
        keepLevel: 0,
        wallLevel: 0,
        gateLevel: 0,
        towerLevel: 0,
        moatLevel: 0,
        customName: "",
        kingdomId: 0,
    },
    target: {
        areaType: 0,
        posX: 0,
        posY: 0,
        objectId: 0,
        playerId: 0,
        keepLevel: 0,
        wallLevel: 0,
        gateLevel: 0,
        towerLevel: 0,
        moatLevel: 0,
        customName: "",
        kingdomId: 0,
    },
    owner: {
        areaType: 0,
        posX: 0,
        posY: 0,
        objectId: 0,
        playerId: 0,
        keepLevel: 0,
        wallLevel: 0,
        gateLevel: 0,
        towerLevel: 0,
        moatLevel: 0,
        customName: "",
        kingdomId: 0,
    },
    departureTime: new Date(0),
    arrivalTime: new Date(0),
    direction: 0,
    kingdomId: 0,
    movementType: 0,
    horseBoosterWod: 0,
    guessedSize: 0,
    army: {
        L: [{ unitWodId: 0, count: 0 }],
        M: [{ unitWodId: 0, count: 0 }],
        R: [{ unitWodId: 0, count: 0 }]
    },
    armyState: 0,
    lord: {
    /*
            id: 0,
            wins: 0,
            defeats: 0,
            winSpree: 0,
            equipments: [{

            }],
            gems: [{
                id: 0,
                level: 0,
                isUnique: false,
                upgradeId: 0,
                setId: 0,
                starRarity: 0,
                startLevel: 0,
                reuseAssetFromEquipmentID: 0,
                gemColorId: 0,
                colorCode: 0,
                effects: [{
                    effectStaticVO: 
                }]
            }],
            additionalEffects: [{}],
            wearerId: 0,
            type: 0,
            pictureId: 0,
            consecutiveLordID: 0,
    */
    }
}];

module.exports = {
    name: "gam",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if (!params.M) {
            return;
        }
        let i = 0;
        let _movementsArray = [];
        for (i in params.M) {
            if(!params.M[i]) continue;
            let _movement;
            let _movObj = params.M[i];
            switch(_movObj.M.T){
                case 0: _movement = new ArmyAttackMovement(socket.client, _movObj); break;
                case 2: _movement = new ArmyTravelMovement(socket.client, _movObj); break;
                default: {
                    console.log(`Current movement (movementType ${_movObj.M.T}) isn't fully supported!`);
                    _movement = new Movement(socket.client, _movObj);
                }
            }
            if(_movement.sourceArea !== null || _movement.movementType === 6)
                _movementsArray.push(_movement);
            i++;
        }
        /**
         * @type {Client}
         */
        const client = socket.client;
        client.movements._add_or_update(_movementsArray);
    }
}