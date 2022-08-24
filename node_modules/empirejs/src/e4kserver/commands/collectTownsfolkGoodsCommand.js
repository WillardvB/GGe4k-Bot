module.exports = {
    name: "irc",
    execute(socket) {
        let C2SResourceCitizenVO = {
            getCmdId: "irc",
            params: {},
        }
        require('./../data').sendJsonVoSignal(socket, { "commandVO": C2SResourceCitizenVO, "lockConditionVO": null });
    }
}