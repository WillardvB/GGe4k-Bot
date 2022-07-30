module.exports = {
    /**
     * 
     * @param {string} xtName
     * @param {string} cmd
     * @param {any} paramObj
     * @param {number} roomId
     */
    send(xtName, cmd, paramObj, roomId) {
        _sendString(xtName, cmd, paramObj, roomId);
    }
}

function _sendString(xtName, cmd, paramObj, roomId) {
    let msg = "%" + "xt" + "%" + xtName + "%" + cmd + "%" + roomId + "%";
    let i = 0;
    while (i < paramObj.length) {
        msg += paramObj[i].toString() + "%";
        i++;
    }
    if (cmd !== "pin" && cmd !== "ain" && cmd !== "gdi") {
        console.log("[Sending - STR]: " + msg);
    }
    require('./../../data.js').writeToSocket(msg);
}