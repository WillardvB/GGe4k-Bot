module.exports = {
    name: "ain",
    /**
     * 
     * @param {number} allianceId
     */
    execute(allianceId) {
        let C2SGetAllianceInfoVO = {
            params: {
                AID: allianceId,
            },
            getCmdId: "ain",
        }
        require('./../data.js').sendJsonVoSignal({ "commandVO": C2SGetAllianceInfoVO, "lockConditionVO": "new DefaultLockConditionVO()" });
    }
}