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
        return new Promise(async (resolve, reject) => {
            try {
                await logChannel.send({ content: "[ERROR]" + msg });
                console.log("[ERROR] " + msg);
                resolve();
            } catch (e) {
                console.log("[ERROR] " + e);
                reject(e);
            }
        })
    },
    log(msg) {
        return new Promise(async (resolve, reject) => {
            try {
                await logChannel.send({ content: msg });
                console.log(msg);
                console.log("finished sending: " + msg);
                resolve();
            } catch (e) {
                console.log("[ERROR] " + e);
                reject(e);
            }
        })
    }
}