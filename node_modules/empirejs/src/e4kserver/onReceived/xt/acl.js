const ChatMessage = require("./../../../structures/ChatMessage");

module.exports = {
    name: "acl",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        const msgs = params.CM;
        for(i in msgs){
            const msg = new ChatMessage(socket.client, msgs[i]);
            client.emit("chatMessage", msg);
        }
    }
}