const { Client, User } = require("discord.js");
const ErrorText = '\x1b[31m[ERROR]\x1b[0m ';

/** @type User */
let logChannel;
/** @type Client */
let client;

let unknownXtCommands = [];
let unknownSysCommands = [];

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
     * @param {any} msg
     */
    logError(msg) {
        return new Promise(async (resolve) => {
            try {
                let msgStr = msg.toString();
                if (msgStr.startsWith("Unknown xt command: ")) {
                    let _cmd = msgStr.substring(20).trim();
                    if (unknownXtCommands.includes(_cmd)) {
                        resolve();
                        return;
                    }
                    else {
                        unknownXtCommands.push(_cmd);
                    }
                }
                else if (msgStr.startsWith("Unknown sys command: ")) {
                    let _cmd = msgStr.substring(21).trim();
                    if (unknownSysCommands.includes(_cmd)) {
                        resolve();
                        return;
                    }
                    else {
                        unknownSysCommands.push(_cmd);
                    }
                }
                else if (msgStr.startsWith("SyntaxError: Unexpected token") && msgStr.includes("in JSON at position")) {
                    console.log(ErrorText + msgStr);
                    resolve();
                    return;
                }
                await logChannel.send({ content: "[ERROR] " + msgStr.substring(0, 1990) });
                console.log(ErrorText + msgStr);
                resolve();
            }
            catch (e) {
                try {
                    await logChannel.send({ content: "[ERROR] There was an error when trying to log: " + e.toString().substring(0, 1950) });
                    console.log(ErrorText + "There was an error when trying to log: " + e);
                    resolve();
                }
                catch (e) {
                    console.log(e);
                }
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
            }
            catch (e) {
                await this.logError(e);
                resolve();
            }
        })
    }
}