let _activeRoomId = -1;
let roomList = [];

module.exports = {
    activeRoomId: _activeRoomId,
    checkRoomList() {
        return _checkRoomList();
    },
}


function _checkRoomList() {
    let roomListAvailable = true;
    if (roomList == null || false) {
        roomListAvailable = false;
        console.log("The room list is empty!\nThe client API cannot function properly until the room list is populated.\nPlease consult the documentation for more infos.");
    }
    return roomListAvailable;
}