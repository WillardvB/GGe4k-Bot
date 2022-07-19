const { Client, User } = require("discord.js");

/** @type User */
let logChannel;
/** @type Client */
let client;

module.exports = {
    /**
     * 
     * @param {Client} _client
     */
    execute(_client) {
        client = _client;
        logChannel = client.users.cache.get("346015807496781825");
    },
    logError(msg) {
        return new Promise((resolve, reject) => {
            console.log("[ERROR] " + msg);
            logChannel.send({ content: "[ERROR]" + msg }).then(resolve(null)).catch(e => reject(e));
        })
    },
    log(msg) {
        return new Promise((resolve, reject) => {
            console.log(msg);
            logChannel.send({ content: msg }).then(resolve(null)).catch(e => reject(e));
        })
    }
}