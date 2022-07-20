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
        return new Promise(async (resolve) => {
            try {
                await logChannel.send({ content: "[ERROR]" + msg });
                console.log('\x1b[31m[ERROR]\x1b[0m' + msg);
                resolve();
            } catch (e) {
                await this.logError(e);
                resolve();
            }
        })
    },
    log(msg) {
        return new Promise(async (resolve) => {
            try {
                await logChannel.send({ content: msg });
                console.log(msg);
                resolve();
            } catch (e) {
                await this.logError(e);
                resolve();
            }
        })
    }
}