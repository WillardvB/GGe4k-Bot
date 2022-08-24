class ChatMessage {
    constructor(client, data) {
        this.message = data.MT;
        this.sendDate = new Date(Date.now() - data.MA * 1000);
        this.senderPlayerId = data.PID;
        this.senderPlayerName = data.PN;
    }
}

module.exports = ChatMessage;