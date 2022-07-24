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