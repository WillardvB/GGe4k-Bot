const { writeToSocket } = require('./../../data.js');

module.exports = {
    /**
     * 
     * @param {string} xtName
     * @param {string} cmd
     * @param {any} paramObj
     * @param {number} roomId
     */
    send(xtName, cmd, paramObj, roomId) {
        _sendJson(xtName, cmd, paramObj, roomId);
    }
}

function _sendJson(xtName, cmd, paramObj, roomId) {
    let jsonBodyObj = {
        x: xtName,
        c: cmd,
        r: roomId,
        p: paramObj,
    }
    let jsonObj = {
        t: "xt",
        b: jsonBodyObj,
    }
    let json = JSON.stringify(jsonObj);
    console.log("[Sending - JSON]: " + json + "\n");
    writeToSocket(json);
}