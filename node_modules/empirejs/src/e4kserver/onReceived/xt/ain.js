const {Socket} = require("node:net");
const Client = require('./../../../Client');
const Alliance = require('./../../../structures/Alliance');

module.exports = {
    name: "ain",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {

        if (errorCode == 114 || !params || !params.A || params.A == undefined) {
            return socket["__get_alliance_error"] = "Alliance not found!";
        }
        const alliance = new Alliance(socket.client, params.A);
        /**
         * @type {Client}
         */
        const client = socket.client;
        client.alliances._add_or_update(alliance);
        socket["__alliance_found"] = true;
        socket["_searching_alliance_id"] = -1;
    }
}