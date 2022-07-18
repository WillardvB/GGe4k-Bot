module.exports = {
    name: "ain",
    /**
     * 
     * @param {number} allianceId
     */
    execute(allianceId) {
        console.log("allianceId:  " + allianceId);
        let C2SGetAllianceInfoVO = {
            params: {
                AID: allianceId,
            },
            getCmdId: "ain",
        }
        require('./../data.js').sendJsonVoSignal({ "commandVO": C2SGetAllianceInfoVO, "lockConditionVO": "new DefaultLockConditionVO()" });
    }
}