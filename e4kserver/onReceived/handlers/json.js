module.exports = {
    execute() {
        let json = JSON.parse(msg);
        let type = json["t"];
        if (type == "xt") {
            xtHandleMessage(json["b"])
        }
        else if (type == "sys") {
            require('./../../data').sysHandleMessage(json["b"]);
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
    require('./../../data').onExtensionResponse(event);
}