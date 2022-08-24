const {Socket} = require("node:net");
const Client = require('./../../../Client');
const Player = require('./../../../structures/Player');

module.exports = {
    name: "gdi",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {

        if (errorCode == 21 || !params) {
            return socket["__get_player_error"] = "Player not found!";
        }
        const player = new Player(socket.client, params);
        /**
         * @type {Client}
         */
        const client = socket.client;
        client.players._add_or_update(player);
        socket["__player_found"] = true;
        socket["_searching_player_id"] = -1;
    }
}