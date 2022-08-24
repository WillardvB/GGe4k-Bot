'use strict'

const BaseManager = require('./BaseManager');

class MovementManager extends BaseManager {
    #movements = [];
    constructor(client) {
        super(client);
        this.on.bind(this);
    }
    get() {
        return [...this.#movements];
    }
    _add_or_update(_movements) {
        _checkMovements(_movements);
        for (let i in _movements) {
            let _newMovement = _movements[i];
            let found = false;
            for (let j in this.#movements) {
                let _oldMovement = this.#movements[j];
                if (_oldMovement.movementId === _newMovement.movementId) {
                    this.#movements[j] = _newMovement;
                    this.emit('movementUpdate', _oldMovement, _newMovement);
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.#movements.push(_newMovement);
                this.emit("movementAdd", _newMovement);
            }
        }
    }
}

/**
 * 
 * @param {Movement[]} movements 
 */
function _checkMovements(movements) {
    let movementCount = movements.length;
    for (let i = movementCount - 1; i >= 0; i--) {
        let _movement = movements[i];
        try {
            if (_movement.arrivalTime.getTime() < Date.now()) {
                movements = movements.splice(i, 1);
            }
        }
        catch (e) {
            movements = movements.splice(i, 1);
        }
    }
    return movements;
}

module.exports = MovementManager