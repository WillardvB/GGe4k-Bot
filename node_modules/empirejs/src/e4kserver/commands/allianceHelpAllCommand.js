module.exports = {
    name: "aha",
    execute(socket) {
        let C2SAllianceHelpAllVO = {
            getCmdId: "aha",
            params: {
                KID: 15,
            },
        }
        require('./../data').sendJsonVoSignal(socket, { "commandVO": C2SAllianceHelpAllVO, "lockConditionVO": null });
    }
}