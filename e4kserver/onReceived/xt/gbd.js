const logger = require('/app/tools/Logger.js');

module.exports = {
    name: "gbd",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(errorCode, params) {
        require('./../../commands/showMessages').execute();
    }
}