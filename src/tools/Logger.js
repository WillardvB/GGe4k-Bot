const ErrorText = '\x1b[31m[ERROR]\x1b[0m ';
const ownerData = require('../owner/data');

/**
 *
 * @param {string} msg Message to log
 * @returns {Promise<void>}
 */
module.exports.log = async function (msg) {
    try {
        await ownerData.owner.send({content: msg});
        console.log(msg);
    } catch (e) {
        await this.logError(e);
    }
}

/**
 *
 * @param {Error} msg
 * @returns {Promise<void>}
 */
module.exports.logError = async function (msg) {
    try {
        let msgStr = msg.toString();
        console.log(ErrorText + msgStr);
        console.log(msg.stack)
        await ownerData.owner.send({content: `[ERROR] ${msgStr.substring(0, 1990)}`});
    } catch (e) {
        try {
            console.log(`${ErrorText}There was an error when trying to log: ${e}`);
            console.log(msg.stack)
            await ownerData.owner.send({content: `[ERROR] There was an error when trying to log: ${e.toString().substring(0, 1950)}`});
        } catch (e) {
            console.log(e);
        }
    }
}