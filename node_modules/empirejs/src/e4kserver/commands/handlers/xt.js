const json = require('./json.js');
const string = require('./string.js');
const xml = require('./xml.js');

module.exports = {
    /**
     * 
     * @param {string} xtName
     * @param {string} cmd
     * @param {any} paramObj
     * @param {string} type
     * @param {number} roomId
     */
    sendMessage(socket, xtName, cmd, paramObj, type = "xml", roomId = -1) {
        sendXtMessage(socket, xtName, cmd, paramObj, type, roomId);
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
function sendXtMessage(socket, xtName, cmd, paramObj, type = "xml", roomId = -1) {
    if (!require('./../../room.js').checkRoomList()) {
        return;
    }
    if (roomId == -1) {
        roomId = require('./../../room.js').activeRoomId;
    }
    switch (type) {
        case "json": json.send(socket, xtName, cmd, paramObj, roomId); break;
        case "str": string.send(socket, xtName, cmd, paramObj, roomId); break;
        case "xml": xml.send(socket, xtName, cmd, paramObj, roomId); break;
        default: break;
    }
}