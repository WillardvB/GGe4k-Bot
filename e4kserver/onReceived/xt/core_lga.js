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
                console.log("[ERROR] AuthenticationProblem: Missing LoginData!");
                break;
            case 5:
                console.log("[ERROR] AuthenticationProblem: User Not Found!");
                break;
            case 6:
                console.log("[ERROR] AuthenticationProblem: Invalid Password!");
                break;
            case 7:
                console.log("[ERROR] AuthenticationProblem: User Banned or Account Deleted!");
                break;
            case 11:
                console.log("[ERROR] AuthenticationProblem: Invalid Language!");
                break;
            case 15:
                console.log("[ERROR] AuthenticationProblem: User Kicked!");
                break;
            default:
                console.log("[ERROR] Ander probleem: errorCode: " + errorCode + " params: " + JSON.stringify(params));
        }
    }
}