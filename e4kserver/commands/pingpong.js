module.exports = {
    name: "pin",
    execute() {
        let PingPongVO = {
            getCmdId: "pin",
            params: {},
        }
        require('./../data.js').sendJsonVoSignal({ "commandVO": PingPongVO, "lockConditionVO": null });
    }
}