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
    if (msg !== "%xt%EmpirefourkingdomsExGG_6%pin%1%<RoundHouseKick>%" && !msg.startsWith("%xt%EmpirefourkingdomsExGG_6%ain%1%{" && !msg.startsWith("%xt%EmpirefourkingdomsExGG_6%gdi%1%{"))) {
        console.log("[Sending - STR]: " + msg);
    }
    require('./../../data.js').writeToSocket(msg);
}