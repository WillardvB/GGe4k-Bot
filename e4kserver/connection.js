const Socket = require('node:net').Socket;
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { connect } = require('node:tls');
const e4kServerData = require('./data.js');

let connected = false;

let _socket = new Socket();
_socket.timeout = 10000;

//#region eventListeners
_socket.on('connect', () => { console.log('succesfully connected'); });

_socket.on("close", (hadError) => { console.log("closed. had error: " + hadError); });

_socket.on('ready', () => { console.log("Socket ready"); sendVersionCheck(); });

_socket.on('drain', () => { console.log("Socket drained"); });

_socket.on('error', (err) => { console.log("[ERROR] Socket Error: " + err); });

_socket.on('data', (data) => { e4kServerData.onData(data); });

_socket.on('end', () => { console.log('server ends connection'); });

_socket.on('timeout', () => { console.log('socket timed out'); });
//#endregion

module.exports = {
    execute() {
        _socket.connect(443, "e4k-live-nl1-game.goodgamestudios.com", () => {
            console.log("socket connected to server");
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
            console.log("[ERROR] " + o.error);
        }
    },
    onSuccessfulLogin() {
        require('./commands/pingpong.js').execute();
        require('./commands/searchAllianceById.js').execute(0);
        fetch("https://media.goodgamestudios.com/loader/empirefourkingdoms").then(res => console.log(res)).catch(e => { console.log("[ERROR] " + e) });
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