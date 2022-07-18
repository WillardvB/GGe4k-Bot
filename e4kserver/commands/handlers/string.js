const data = require('./../../data.js');

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
    let stringMsg = "%" + "xt" + "%" + xtName + "%" + cmd + "%" + roomId + "%";
    let i = 0;
    while (i < paramObj.length) {
        stringMsg += paramObj[i].toString() + "%";
        i++;
    }
    console.log("[Sending - STR]: " + stringMsg + "\n");
    data.writeToSocket(stringMsg);
}