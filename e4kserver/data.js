let sysCommands = {};
let xtCommands = {}

const sysCommandsPath = path.join(__dirname, 'onReceived/sys');
const xtCommandsPath = path.join(__dirname, 'onReceived/xt');
const sysCommandsFiles = fs.readdirSync(sysCommandsPath).filter(file => file.endsWith('.js'));
const xtCommandsFiles = fs.readdirSync(xtCommandsPath).filter(file => file.endsWith('.js'));
for (const file of sysCommandsFiles) {
    const filePath = path.join(sysCommandsPath, file);
    const command = require(filePath);
    sysCommands[command.name] = command.execute;
}
for (const file of xtCommandsFiles) {
    const filePath = path.join(xtCommandsPath, file);
    const command = require(filePath);
    xtCommands[command.name] = command.execute;
}

module.exports = {
    sysCommands: sysCommands,
    xtCommands: xtCommands,
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
     * @param {object} msgObj
     */
    sysHandleMessage(msgObj) {
        let action = msgObj.body["$"].action;
        let handler = sysCommands[action];
        if (handler != null) {
            handler.apply(this, [msgObj]);
        }
        else {
            console.log("[ERROR] Unknown sys command: " + action);
        }
    },
    /**
     * 
     * @param {object} event
     */
    onExtensionResponse(event) {
        /** @type Array */
        let params = [];
        let command = (params = event.dataObj).shift();
        switch (command) {
            case "rlu":
                //setRoomList(params);
                //if (!_hasAutoJoined) {
                //    _hasAutoJoined = true;
                //    autoJoinRoom();
                //}
                return;
            case "jro":
                //onJoinRoom({ params: { "room": getRoom(parseInt(params.shift())) } });
                return;
            default:
                params.shift();
                let responseVO = {
                    error: params.shift(),
                    commandID: command,
                    paramArray: params,
                }
                //executeExtensionResponseSignalCommand(responseVO);
                return;
        }
    }
}

let unfinishedDataString = "";
/**
 * 
 * @param {Buffer} data
 */
function internal_OnData(data) {
    let msg = data.toString('utf-8');
    if (msg.startsWith("%") && !(msg.charAt(msg.length - 2) == "%" && msg.charCodeAt(msg.length - 1) == 0)) {
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
            console.log("[RECEIVED]: " + _msg.substring(0, 25) + "..., (len: " + _msg.length + ")");
        }
        if (firstChar == "<") {
            require('./onReceived/handlers/xml.js').execute(_msg);
        }
        else if (firstChar == "%") {
            require('./onReceived/handlers/string.js').execute(_msg);
        }
        else if (firstChar == "{") {
            require('./onReceived/handlers/json.js').execute(_msg);
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
        //params[i] = getValideSmartFoxText(params[i]);
        i++;
    }
    //sendXtMessage(defaultZone, msgId, params, "str", activeRoomId);
}