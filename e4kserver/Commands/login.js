module.exports = {
    name: "login",
    execute() {
        let CoreC2SLoginWithAuthenticationVO = {
            params: {
                NM: "E4K-NL",
                PW: "E4K-NL-server",
                L: "nl",
                AID: "165774755424378480",
                DID: 5,
                PLFID: "3",
                ADID: "null",
                AFUID: "appsFlyerUID",
                IDFV: null,
            },
            getCmdId: "core_lga"
        }
        require('./../data.js').sendJsonVoSignal({ "commandVO": CoreC2SLoginWithAuthenticationVO, "lockConditionVO": "new DefaultLockConditionVO()" });
    }
}