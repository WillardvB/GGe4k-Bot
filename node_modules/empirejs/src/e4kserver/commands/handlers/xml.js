module.exports = {
    /**
     * 
     * @param {string} xtName
     * @param {string} cmd
     * @param {any} paramObj
     * @param {number} roomId
     */
    send(socket, xtName, cmd, paramObj, roomId) {
        _sendXml(socket, xtName, cmd, paramObj, roomId);
    },
    /**
     * 
     * @param {object} header
     * @param {string} action
     * @param {number} fromRoom
     * @param {string} message
     */
    sendAction(socket, header, action, fromRoom, message) {
        _send(socket, header, action, fromRoom, message)
    }
}

function _sendXml(socket, xtName, cmd, paramObj, roomId) {
    let headers = { "t": "xt" };
    let _loc10_ = {
        "name": xtName,
        "cmd": cmd,
        "param": paramObj
    };
    let msg = "<![CDATA[" + require('./../../../tools/xml.js').obj2xml(_loc10_).xmlStr + "]]>";
    _send(socket, headers, "xtReq", roomId, msg);
}

/**
 * 
 * @param {object} header
 * @param {string} action
 * @param {number} fromRoom
 * @param {string} message
 */
function _send(socket, header, action, fromRoom, message) {
    let msg = makeXmlHeader(header) + ("<body action=\'" + action + "\' r=\'" + fromRoom + "\'>" + message + "</body>" + "</msg>");
    require('./../../data.js').writeToSocket(socket, msg);
}

/**
 * 
 * @param {object} headerObj
 */
function makeXmlHeader(headerObj) {
    let header = "<msg";
    for (var _loc2_ in headerObj) {
        header += " " + _loc2_ + "=\'" + headerObj[_loc2_] + "\'";
    }
    return header + ">";
}