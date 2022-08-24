module.exports = {
    name: "ain",
    /**
     * 
     * @param {number} playerId
     */
    execute(socket, playerId) {
        let C2SGetDetailPlayerInfo = {
            params: {
                PID: playerId,
            },
            getCmdId: "gdi",
        }
        require('./../data').sendJsonVoSignal(socket, { "commandVO": C2SGetDetailPlayerInfo, "lockConditionVO": null });
    }
}