module.exports = {
    name: "txc",
    execute(socket) {
        let C2SCollectTaxVO = {
            getCmdId: "txc",
            params: {
                TR: 29,
            },
        }
        require('./../data').sendJsonVoSignal(socket, { "commandVO": C2SCollectTaxVO, "lockConditionVO": null });
    }
}