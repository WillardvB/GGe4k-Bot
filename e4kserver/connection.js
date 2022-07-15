const Socket = require('node:net').Socket;
const e4kServerData = require('./data.js');

let _socket = new Socket();

_socket.timeout = 10000;

_socket.connect(443, "e4k-live-nl1-game.goodgamestudios.com", () => {
    console.log("socket connected to server");
})

//#region eventListeners
_socket.on('connect', () => { console.log('succesfully connected'); });

_socket.on("close", (hadError) => { console.log("closed. had error:" + hadError); });

_socket.on('ready', () => { console.log("Socket ready"); sendVersionCheck(); });

_socket.on('drain', () => { console.log("Socket drained"); });

_socket.on('error', (err) => { console.log("[ERROR] Socket Error: " + err); });

_socket.on('data', (data) => { e4kServerData.onData(data); });

_socket.on('end', () => { console.log('server ends connection'); });

_socket.on('timeout', () => { console.log('socket timed out'); });
//#endregion

module.exports = {
    onConnection(obj) {
        if (obj.success) {
            let languageCode = "nl";
            let distributorID = 0;
            let zone = "EmpirefourkingdomsExGG_6";
            login(zone, "", `${NaN}${languageCode}%${distributorID}`);
            require('./Commands/login.js').execute();
        } else {
            console.log("[ERROR] " + o.error);
        }
    }
}

function login(zone, name, pass) {
    let header = { "t": "sys" };
    let msg = "<login z=\'" + zone + "\'><nick><![CDATA[" + name + "]]></nick><pword><![CDATA[" + pass + "]]></pword></login>";
    //send(header, "login", 0, msg);
}