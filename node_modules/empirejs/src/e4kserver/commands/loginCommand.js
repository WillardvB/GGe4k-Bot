module.exports = {
    name: "login",
    /**
     * 
     * @param {string} name
     * @param {string} password
     */
    execute(socket, name, password) {
        let accountID = Date.now().toString() + (Math.random() * 999999).toFixed();
        let CoreC2SLoginWithAuthenticationVO = {
            params: {
                NM: name,
                PW: password,
                L: "nl",
                AID: accountID,
                DID: 5,
                PLFID: "3",
                ADID: "null",
                AFUID: "appsFlyerUID",
                IDFV: null,
            },
            getCmdId: "core_lga"
        }
        require('./../data').sendJsonVoSignal(socket, { "commandVO": CoreC2SLoginWithAuthenticationVO, "lockConditionVO": "new DefaultLockConditionVO()" });
    },
}