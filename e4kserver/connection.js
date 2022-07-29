const Socket = require('node:net').Socket;
const logger = require('../tools/Logger.js');
const e4kServerData = require('./data.js');

let connected = false;

let _socket = new Socket();
_socket.timeout = 10000;

//#region eventListeners
_socket.on('connect', () => { logger.log('Succesfully connected'); });

_socket.on("close", (hadError) => { logger.log("Socket closed. Had error: " + hadError); });

_socket.on('ready', () => { logger.log("Socket ready"); sendVersionCheck(); });

_socket.on('drain', () => { logger.log("Socket drained"); });

_socket.on('error', (err) => { logger.logError("Socket Error: " + err); });

_socket.on('data', (data) => { e4kServerData.onData(data); });

_socket.on('end', () => { logger.log('Server ends connection'); });

_socket.on('timeout', () => { logger.log('Socket timed out'); });
//#endregion

module.exports = {
    execute() {
        _socket.connect(443, "e4k-live-nl1-game.goodgamestudios.com", () => {
            logger.log("Socket connected to server");
        })
    },
    onConnection(obj) {
        if (obj.success) {
            connected = true;
            let languageCode = "nl";
            let distributorID = 0;
            let zone = "EmpirefourkingdomsExGG_6";
            login(zone, "", `${NaN}${languageCode}%${distributorID}`);
            require('./commands/loginCommand').execute();
        } else {
            logger.logError(obj.error);
        }
    },
    onSuccessfulLogin() {
        require('./commands/pingpong.js').execute();
        require('./commands/searchAllianceById.js').execute(0);
        onSendMessage("-ares-", "test bericht!", "1i2ndadfhkjwe9");
    },
    socket: _socket,
    connected: connected,
}

const majVersion = 1;
const minVersion = 6;
const subVersion = 6;

function sendVersionCheck() {
    let header = { "t": "sys" };
    let version = "<ver v=\'" + majVersion.toString() + minVersion.toString() + subVersion.toString() + "\' />";
    require('./commands/handlers/xml.js').sendAction(header, "verChk", 0, version);
}

function login(zone, name, pass) {
    let header = { "t": "sys" };
    let msg = "<login z=\'" + zone + "\'><nick><![CDATA[" + name + "]]></nick><pword><![CDATA[" + pass + "]]></pword></login>";
    require('./commands/handlers/xml.js').sendAction(header, "login", 0, msg);
}

function onSendMessage(receiver, subject, copy) {
    let messageVO = null;
    let _subject = getValideSmartFoxJSONMailMessage(subject);
    var msg = getValideSmartFoxJSONMailMessage(copy);
    if (msg && msg != "") {
        switch (0) {
            case 0:
                messageVO = new C2SSendMessageVO(receiver, _subject, msg);
                break;
            case 1:
                messageVO = new C2SAllianceNewsletterVO(_subject, msg);
        }
        //btnSend.lock();
        e4kServerData.sendJsonVoSignal({ "commandVO": messageVO, "lockConditionVO": "new DefaultLockConditionVO()" });
    }
    else {
        logger.logError("Missing msg in onSendMessage()");
        //openDialogSignal.dispatch(new OpenDialogVO("StandardOkWithCharacterDialog", new OkWithCharDialogProperties(Localize.text("generic_alert_watchout"), Localize.text("dialog_newMessage_missingText")), 4));
    }
}

function getValideSmartFoxJSONMailMessage(value) {
    for (var _loc9_ in ["\\+", "#", "<", ">", "\"", "\\$"])
    {
        let _loc10_ = new RegExp("\\" + _loc9_, "gs");
        value = value.replace(_loc10_, "");
    }
    value = value.replace(/%/g, "&percnt;");
    value = value.replace(/'/g, "&#145;");
    value = value.replace(/"/g, "&quot;");
    value = value.replace(/\r/g, "<br />");
    value = value.replace(/\\/g, "%5C");
    value = value.replace(/\n/g, "<br />");
    return value.replace(/\t/g, " ");
}