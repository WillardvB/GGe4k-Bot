const { execute: startTaxCommand } = require('./../../commands/startTaxCommand');

module.exports = {
    name: "txc",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        startTaxCommand(socket);
    }
}