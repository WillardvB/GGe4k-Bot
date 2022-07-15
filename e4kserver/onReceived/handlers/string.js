module.exports = {
    execute() {
        let msgParts = [];
        let type = (msgParts = msg.substring(1, msg.length - 1).split("%"))[0];
        if (type == "xt") {
            xtHandleMessage(msgParts.splice(1, msgParts.length - 1))
        }
        else if (type == "sys") {
            require('./../../data').sysHandleMessage(msgParts.splice(1, msgParts.length - 1));
        }
    }
}

/**
 * 
 * @param {any} msgObj
 */
function xtHandleMessage(msgObj) {
    let event = {
        dataObj: msgObj,
        type: "str",
    }
    require('./../../data').onExtensionResponse(event);
}