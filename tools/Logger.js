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
    async logError(msg) {
        return new Promise((resolve, reject) => {
            console.log("[ERROR] " + msg);
            try {
                await logChannel.send({ content: "[ERROR]" + msg });
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    },
    async log(msg) {
        return new Promise((resolve, reject) => {
            console.log(msg);
            try {
                await logChannel.send({ content: msg });
                console.log("finished sending msg: " + msg);
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }
}