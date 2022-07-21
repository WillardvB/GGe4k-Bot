const Logger = require('../../../tools/Logger.js');
const sys = require('./sys.js');
const xt = require('./xt');

module.exports = {
    /**
     * 
     * @param {string} msg
     */
    execute(msg) {
        try {
            let json = JSON.parse(msg);
            let type = json["t"];
            if (type == "xt") {
                xtHandleMessage(json["b"])
            }
            else if (type == "sys") {
                sys.onResponse(json["b"]);
            }
        } catch (e) {
            Logger.logError(e);
            Logger.log(msg);
        };
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