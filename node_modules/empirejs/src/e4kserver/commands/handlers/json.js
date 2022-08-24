module.exports = {
    /**
     * 
     * @param {string} xtName
     * @param {string} cmd
     * @param {any} paramObj
     * @param {number} roomId
     */
    send(socket, xtName, cmd, paramObj, roomId) {
        _sendJson(socket, xtName, cmd, paramObj, roomId);
    }
}

function _sendJson(socket, xtName, cmd, paramObj, roomId) {
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
    require('./../../data.js').writeToSocket(socket, json);
}