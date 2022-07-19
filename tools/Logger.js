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
        try {
            await logChannel.send({ content: "[ERROR]" + msg });
            return new Promise((resolve, reject) => {
                console.log("[ERROR] " + msg);
                resolve();
            })
        } catch (e) {
            return new Promise((resolve, reject) => {
                console.log("[ERROR] " + e);
                reject(e);
            })
        }
    },
    async log(msg) {
        try {
            await logChannel.send({ content: msg });
            return new Promise((resolve, reject) => {
                console.log(msg);
                console.log("finished sending msg: " + msg);
                resolve();
            })
        } catch (e) {
            return new Promise((resolve, reject) => {
                console.log("[ERROR] " + e);
                reject(e);
            })
        }
    }
}