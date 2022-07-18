/**
 * 
 * @param {object} msg
 */
function handlePrivateMessage(msg) {
    console.log("Got message!: " + msg.message);
    console.log("Sender: " + msg.sender);
    console.log("user id: " + msg.userId);
}

module.exports = {
    name: "prvMsg",
    execute(o) {
        var roomId = o.body.$.r;
        var userId = o.body.user.$.id;
        var msgText = o.body.txt;
        var room = require('./../../room').getRoom(roomId);
        var sender = null;
        if (room != null) {
            sender = room.getUser(userId);
        }
        let msg = {
            message: Entities.decodeEntities(msgText),
            sender: sender,
            roomId: roomId,
            userId: userId,
        }
        handlePrivateMessage(msg);
    }
}