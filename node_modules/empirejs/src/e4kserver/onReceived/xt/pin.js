const { execute: sendPingPong } = require('./../../commands/pingpong.js');

module.exports = {
    name: "pin",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        let nextPingTimeout = 15000;
        if (errorCode == 0 && params && params.length > 0) {
            let json = JSON.parse(params.shift());
            nextPingTimeout = parseInt(json.NP) * 1000;
        }
        setTimeout(function () {
           sendPingPong(socket);
        }, nextPingTimeout);
    }
}