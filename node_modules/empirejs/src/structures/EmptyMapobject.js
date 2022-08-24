const BasicMapobject = require("./BasicMapobject");

class EmptyMapobject extends BasicMapobject {
    constructor(client, data) {
        super(client, data);
    }
}

module.exports = EmptyMapobject;