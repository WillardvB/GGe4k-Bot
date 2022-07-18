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
    if (strMessage !== "%xt%EmpirefourkingdomsExGG_6%pin%1%<RoundHouseKick>%" && !strMessage.startsWith("%xt%EmpirefourkingdomsExGG_6%ain%1%{")) {
        console.log("[Sending - STR]: " + strMessage);
    }
    require('./../../data.js').writeToSocket(stringMsg);
}