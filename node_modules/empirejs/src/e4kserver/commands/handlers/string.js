module.exports = {
    /**
     * 
     * @param {string} xtName
     * @param {string} cmd
     * @param {any} paramObj
     * @param {number} roomId
     */
    send(socket, xtName, cmd, paramObj, roomId) {
        _sendString(socket, xtName, cmd, paramObj, roomId);
    }
}

function _sendString(socket, xtName, cmd, paramObj, roomId) {
    let msg = "%" + "xt" + "%" + xtName + "%" + cmd + "%" + roomId + "%";
    let i = 0;
    while (i < paramObj.length) {
        msg += paramObj[i].toString() + "%";
        i++;
    }
    require('./../../data.js').writeToSocket(socket, msg);
}