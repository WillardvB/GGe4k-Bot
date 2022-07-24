const logger = require('/app/tools/Logger.js');

module.exports = {
    name: "gbd",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(errorCode, params) {
        console.log("Send Show message command!");
        let C2SShowRuinDataVO = {
            getCmdId: "gre",
            params: {},
        }
        require('./../../data').sendJsonVoSignal({ "commandVO": C2SShowRuinDataVO, "lockConditionVO": null });
        require('./../../commands/showMessages').execute();

    }
}