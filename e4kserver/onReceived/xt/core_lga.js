const logger = require('../../../tools/Logger.js');

module.exports = {
    name: "core_lga",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(errorCode, params) {
        switch (parseInt(errorCode) - 10005) {
            case 0:
                console.log("Successfully logged in ")
                require('./../../connection.js').onSuccessfulLogin();
                break;
            case 2:
                logger.logError("AuthenticationProblem: Missing LoginData!");
                break;
            case 5:
                logger.logError("AuthenticationProblem: User Not Found!");
                break;
            case 6:
                logger.logError("AuthenticationProblem: Invalid Password!");
                break;
            case 7:
                logger.logError("AuthenticationProblem: User Banned or Account Deleted!");
                break;
            case 11:
                logger.logError("AuthenticationProblem: Invalid Language!");
                break;
            case 15:
                logger.logError("AuthenticationProblem: User Kicked!");
                break;
            default:
                logger.logError("Ander probleem: errorCode: " + errorCode + " params: " + JSON.stringify(params));
        }
    }
}