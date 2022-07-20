const { Client, User } = require("discord.js");
const ErrorText = '\x1b[31m[ERROR]\x1b[0m ';

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
    /**
     * 
     * @param {string} msg
     */
    logError(msg) {
        return new Promise(async (resolve) => {
            try {
                if (!(msg.startsWith("Unknown xt command: ") || msg.startsWith("Unknown sys command: ")))
                    await logChannel.send({ content: "[ERROR]" + msg });
                console.log(ErrorText + msg);
                resolve();
            } catch (e) {
                await this.logError(e);
                resolve();
            }
        })
    },
    /**
     * 
     * @param {string} msg
     */
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