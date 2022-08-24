module.exports = {
    name: "core_lga",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        switch (parseInt(errorCode) - 10005) {
            case 0:
                require('./../../connection.js').onLogin(socket);
                break;
            case 2:
                require('./../../connection.js').onLogin(socket, "AuthenticationProblem: Missing LoginData!");
                break;
            case 5:
                require('./../../connection.js').onLogin(socket, "AuthenticationProblem: User Not Found!");
                break;
            case 6:
                require('./../../connection.js').onLogin(socket, "AuthenticationProblem: Invalid Password!");
                break;
            case 7:
                require('./../../connection.js').onLogin(socket, "AuthenticationProblem: User Banned or Account Deleted!");
                break;
            case 11:
                require('./../../connection.js').onLogin(socket, "AuthenticationProblem: Invalid Language!");
                break;
            case 15:
                require('./../../connection.js').onLogin(socket, "AuthenticationProblem: User Kicked!");
                break;
            default:
                require('./../../connection.js').onLogin(socket, `ERROR ${errorCode}: ${JSON.stringify(params)}`);
                break;
        }
    }
}