const sys = require('./sys.js');
const xt = require('./xt');

module.exports = {
    /**
     * 
     * @param {string} msg
     */
    execute(socket, msg) {
        let msgParts = [];
        let type = (msgParts = msg.substring(1, msg.length - 1).split("%"))[0];
        if (type == "xt") {
            xtHandleMessage(socket, msgParts.splice(1, msgParts.length - 1))
        }
        else if (type == "sys") {
            sys.onResponse(socket, msgParts.splice(1, msgParts.length - 1));
        }
    }
}

/**
 * 
 * @param {any} msgObj
 */
function xtHandleMessage(socket, msgObj) {
    let event = {
        dataObj: msgObj,
        type: "str",
    }
    xt.onResponse(socket, event);
}