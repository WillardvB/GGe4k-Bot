module.exports = {
    name: "login",
    execute() {
        let accountID = "165774755424378480";//Date.now().toString() + (Math.random() * 999999).toFixed();
        let CoreC2SLoginWithAuthenticationVO = {
            params: {
                NM: "E4K-NL",
                PW: process.env.empirePassword,
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
        require('./../data.js').sendJsonVoSignal({ "commandVO": CoreC2SLoginWithAuthenticationVO, "lockConditionVO": "new DefaultLockConditionVO()" });
    },
}