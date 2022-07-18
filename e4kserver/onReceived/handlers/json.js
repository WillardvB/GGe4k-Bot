const sys = require('./sys.js');
const xt = require('./xt');

module.exports = {
    /**
     * 
     * @param {string} msg
     */
    execute(msg) {
        let json = JSON.parse(msg);
        let type = json["t"];
        if (type == "xt") {
            xtHandleMessage(json["b"])
        }
        else if (type == "sys") {
            sys.onResponse(json["b"]);
        }
    }
}

/**
 * 
 * @param {any} msgObj
 */
function xtHandleMessage(msgObj) {
    let event = {
        dataObj: msgObj.o,
        type: "json",
    }
    xt.onResponse(event)
}