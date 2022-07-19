const onJson = require('./onReceived/handlers/json.js');
const onString = require('./onReceived/handlers/string.js');
const onXml = require('./onReceived/handlers/xml.js');
const xt = require('./commands/handlers/xt');

let _alliances = {};
let _players = {};

let unfinishedDataString = "";
/**
 * 
 * @param {Buffer} data
 */
function internal_OnData(data) {
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
        if ((firstChar == "<" || firstChar == "%" || firstChar == "{") && !(_msg === "%xt%pin%1%0%" || _msg.startsWith("%xt%irc%1%0%") || _msg === "%xt%ain%1%114%{}%" || _msg.startsWith("%xt%ain%1%0%"))) {
            console.log("[RECEIVED]: " + _msg.substring(0, 50) + "..., (len: " + _msg.length + ")");
        }
        if (firstChar == "<") {
            onXml.execute(_msg);
        }
        else if (firstChar == "%") {
            onString.execute(_msg);
        }
        else if (firstChar == "{") {
            onJson.execute(_msg);
        }
    }
}

/**
 * 
 * @param {object} commandVO
 */
function sendCommandVO(commandVO) {
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
    xt.sendMessage("EmpirefourkingdomsExGG_6", msgId, params, "str", require('./room.js').activeRoomId);
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
function internal_writeToSocket(msg) {
    let _buff0 = Buffer.from(msg);
    let _buff1 = Buffer.alloc(1);
    _buff1.writeInt8(0);
    let bytes = Buffer.concat([_buff0, _buff1]);
    require('./connection.js').socket.write(bytes, "utf-8", (err) => { if (err) console.log("[ERROR] " + err); });
}

module.exports = {
    /**
     * 
     * @param {Buffer} data
     */
    onData(data) {
        internal_OnData(data);
    },
    /**
     * 
     * @param {object} sendJsonMessageVO
     */
    sendJsonVoSignal(sendJsonMessageVO) {
        sendCommandVO(sendJsonMessageVO.commandVO);
    },
    /**
     * 
     * @param {any} msg
     */
    writeToSocket(msg) {
        internal_writeToSocket(msg);
    },
    get alliances() { return _alliances },
    set alliances(val) { _alliances = val },
    get players() { return _players },
    set players(val) { _players = val },
}