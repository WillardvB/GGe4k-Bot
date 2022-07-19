module.exports = {
    name: "sne",
    execute() {
        let C2SShowMessagesVO = {
            getCmdId: "sne",
            params: {},
        }
        require('./../data.js').sendJsonVoSignal({ "commandVO": C2SShowMessagesVO, "lockConditionVO": "new DefaultLockConditionVO()" });
    }
}