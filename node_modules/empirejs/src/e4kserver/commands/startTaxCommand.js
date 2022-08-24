module.exports = {
    name: "txs",
    execute(socket, taxType = 0) {
        let C2SStartCollectTaxVO = {
            getCmdId: "txs",
            params: {
                TT: taxType,
                TX: 3,
            },
        }
        require('./../data').sendJsonVoSignal(socket, { "commandVO": C2SStartCollectTaxVO, "lockConditionVO": null });
    }
}