const { execute: collectTaxCommand } = require('./../../commands/collectTaxCommand');

module.exports = {
    name: "txs",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        setTimeout(collectTaxCommand, (params.txi.TX.RT + Math.random() * 10) * 1000, socket);
    }
}