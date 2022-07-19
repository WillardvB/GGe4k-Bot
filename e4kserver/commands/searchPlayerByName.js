module.exports = {
    name: "wsp",
    /**
     * 
     * @param {number} playerName
     */
    execute(playerName) {
        let C2SSearchPlayerVO = {
            params: {
                PN: playerName,
            },
            getCmdId: "wsp",
        }
        require('./../data.js').sendJsonVoSignal({ "commandVO": C2SSearchPlayerVO, "lockConditionVO": "new DefaultLockConditionVO()" });
    }
}