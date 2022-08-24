const { Socket } = require('node:net');

module.exports = {
    /** Resolves when socket[field] is true. Rejects when socket[errorField] !== "" */
    WaitUntil: _WaitUntil,
}

/**
 * @param {Socket} socket 
 * @param {string} field 
 * @param {string} errorField 
 * @returns 
 */
function _WaitUntil(socket, field, errorField = "") {
    return new Promise(async (resolve, reject) => {
        try {
            if (socket[field])
                resolve();
            else if (errorField !== "" && socket[errorField] && socket[errorField] !== "") {
                reject(socket[errorField]);
            }
            else {
                await new Promise(resolve => { setTimeout(() => resolve(), 5); });
                await _WaitUntil(socket, field, errorField);
                resolve();
            }
        }
        catch (e) {
            resolve(e);
        }
    })
}