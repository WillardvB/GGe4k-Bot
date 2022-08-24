module.exports = {
    name: "pin",
    execute(socket) {
        let PingPongVO = {
            getCmdId: "pin",
            params: {},
        }
        require('./../data').sendJsonVoSignal(socket, { "commandVO": PingPongVO, "lockConditionVO": null });
    }
}