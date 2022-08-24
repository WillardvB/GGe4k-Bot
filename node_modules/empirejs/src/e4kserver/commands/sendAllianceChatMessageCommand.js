module.exports = {
    name: "acm",
    execute(socket, message) {
        let C2SAllianceChatVO = {
            getCmdId: "acm",
            params: {
                M: validateMessage(message)
            },
        }
        require('./../data').sendJsonVoSignal(socket, { "commandVO": C2SAllianceChatVO, "lockConditionVO": null });
    }
}

function validateMessage(msg){
    return msg;
}