const json = require('./json.js');
const string = require('./string.js');
const xml = require('./xml.js');
const { checkRoomList, activeRoomId } = require('./../../room.js');

module.exports = {
    /**
     * 
     * @param {string} xtName
     * @param {string} cmd
     * @param {any} paramObj
     * @param {string} type
     * @param {number} roomId
     */
    sendMessage(xtName, cmd, paramObj, type = "xml", roomId = -1) {
        sendXtMessage(xtName, cmd, paramObj, type, roomId);
    }
}

/**
 * 
 * @param {string} xtName
 * @param {string} cmd
 * @param {any} paramObj
 * @param {string} type
 * @param {number} roomId
 */
function sendXtMessage(xtName, cmd, paramObj, type = "xml", roomId = -1) {
    if (!checkRoomList()) {
        return;
    }
    if (roomId == -1) {
        roomId = activeRoomId;
    }
    switch (type) {
        case "json": json.send(xtName, cmd, paramObj, roomId); break;
        case "string": string.send(xtName, cmd, paramObj, roomId); break;
        case "xml": xml.send(xtName, cmd, paramObj, roomId); break;
        default: break;
    }
}