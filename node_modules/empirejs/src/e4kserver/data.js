const onJson = require('./onReceived/handlers/json.js');
const onString = require('./onReceived/handlers/string.js');
const onXml = require('./onReceived/handlers/xml.js');
const xt = require('./commands/handlers/xt');
const fs = require('fs');

let _alliances = {};
let _players = {};

let unfinishedDataString = "";
/**
 * 
 * @param {Buffer} data
 */
function internal_OnData(socket, data) {
    let msg = data.toString('utf-8');
    if (msg.startsWith("%xt%ain%1%0%{") && !(msg.charAt(msg.length - 3) == "}" && msg.charAt(msg.length - 2) == "%" && msg.charCodeAt(msg.length - 1) == 0)) {
        unfinishedDataString = unfinishedDataString + msg;
        return;
    }
    else if (!msg.startsWith("%xt%ain%") && msg.startsWith("%") && !(msg.charAt(msg.length - 2) == "%" && msg.charCodeAt(msg.length - 1) == 0)) {
        unfinishedDataString = unfinishedDataString + msg;
        return;
    }
    msg = unfinishedDataString + msg;
    unfinishedDataString = "";
    let msgParts = [];
    let msgChars = msg.split("");
    let _msgPart = "";
    for (let i = 0; i < msgChars.length; i++) {
        if (msgChars[i].charCodeAt(0) == 0) {
            if (_msgPart != "")
                msgParts.push(_msgPart);
            _msgPart = "";
        }
        else {
            _msgPart += msgChars[i];
            if (i == msgChars.length - 1 && _msgPart != "")
                msgParts.push(_msgPart);
        }
    }
    for (let i = 0; i < msgParts.length; i++) {
        let _msg = msgParts[i];
        let firstChar = _msg.charAt(0);
        if (firstChar == "<") {
            onXml.execute(socket, _msg);
        }
        else if (firstChar == "%") {
            onString.execute(socket, _msg);
        }
        else if (firstChar == "{") {
            onJson.execute(socket, _msg);
        }
    }
}

/**
 * 
 * @param {object} commandVO
 */
function sendCommandVO(socket, commandVO) {
    let msgId = commandVO.getCmdId;
    let params = [JSON.stringify(commandVO.params)];
    let i = 0;
    while (i < params.length) {
        if (params[i].trim() == "" || params[i].trim() == "{}") {
            params[i] = "<RoundHouseKick>";
        }
        params[i] = getValideSmartFoxText(params[i]);
        i++;
    }
    xt.sendMessage(socket, "EmpirefourkingdomsExGG_6", msgId, params, "str", require('./room.js').activeRoomId);
}

/**
 * 
 * @param {string} value
 */
function getValideSmartFoxText(value) {
    value = value.replace(/%/g, "&percnt;");
    return value.replace(/'/g, "");
}

/**
 * 
 * @param {any} msg
 */
function internal_writeToSocket(socket, msg) {
    let _buff0 = Buffer.from(msg);
    let _buff1 = Buffer.alloc(1);
    _buff1.writeInt8(0);
    let bytes = Buffer.concat([_buff0, _buff1]);
    socket.write(bytes, "utf-8", (err) => { if (err) { console.log("\x1b[31m[SOCKET ERROR] " + err + "\x1b[0m"); } });
}

module.exports = {
    /**
     * 
     * @param {Buffer} data
     */
    onData(socket, data) {
        internal_OnData(socket, data);
    },
    /**
     * 
     * @param {object} sendJsonMessageVO
     */
    sendJsonVoSignal(socket, sendJsonMessageVO) {
        sendCommandVO(socket, sendJsonMessageVO.commandVO);
    },
    /**
     * 
     * @param {any} msg
     */
    writeToSocket(socket, msg) {
        internal_writeToSocket(socket, msg);
    },
    get alliances() { return _alliances },
    set alliances(val) { _alliances = val },
    get players() { return _players },
    set players(val) { _players = val },
}