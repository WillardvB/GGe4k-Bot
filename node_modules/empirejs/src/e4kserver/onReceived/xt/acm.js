const ChatMessage = require("./../../../structures/ChatMessage");

module.exports = {
    name: "acm",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if (!params) return;
        const msg = new ChatMessage(socket.client, params.CM);
        socket.client.emit("chatMessage", msg);
    }
}