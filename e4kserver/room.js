const { sendAction } = require("./Commands/handlers/xml");

let _activeRoomId = -1;
let roomList = [];

module.exports = {
    activeRoomId: _activeRoomId,
    checkRoomList() {
        return _checkRoomList();
    },
    /**
     * 
     * @param {Array} data
     */
    setRoomList(data) {
        _setRoomList(data);
    },
    /**
     * 
     * @param {object} event
     */
    onJoinRoom(event) {
        _onJoinRoom(event);
    },
    /**
     * 
     * @param {number} index
     */
    getRoom(index) {
        return _getRoom(index);
    }
}

function _checkRoomList() {
    let roomListAvailable = true;
    if (roomList == null || false) {
        roomListAvailable = false;
        console.log("The room list is empty!\nThe client API cannot function properly until the room list is populated.\nPlease consult the documentation for more infos.");
    }
    return roomListAvailable;
}

/**
 * 
 * @param {Array} data
 */
function _setRoomList(data) {
    let rooms = getAllRooms();
    let index = data[1];
    let userCount = decompressInt(data[2]);
    let maxUsers = decompressInt(data[3]);
    let _loc3_ = decompressInt(data[4]);
    while (rooms.length <= index) (rooms.push({}));
    rooms[index] = {
        id: index,
        name: data[5],
        maxSpectators: 0,
        maxUsers: maxUsers,
        temp: (_loc3_ >> 1 & 1) == true,
        game: (_loc3_ >> 2 & 1) == true,
        priv: (_loc3_ >> 0 & 1) == true,
        limbo: (_loc3_ >> 3 & 1) == true,
        userCount: userCount,
        specCount: 0,
        userList: [],
        variables: [],
    };
    let roomData = { roomList: rooms };
    console.log("cannot find onRoomListUpdate for roomData: " + JSON.stringify(roomData));
}

/**
 * 
 * @param {number} index
 */
function _getRoom(index) {
    if (!checkRoomList()) {
        return null;
    }
    return roomList[index];
}

/**
 * 
 * @param {object} event
 */
function _onJoinRoom(event) {
    let _loc3_ = event.params["room"];
    activeRoomId = _loc3_.id;
    if (_loc3_.name == "Lobby") {
        //benchStartTime = Date.now();
        sendAction({ "t": "sys" }, "roundTrip", activeRoomId, "");
    }
    let RoomInfoVO = { name: (event.params.room).name };
    console.log("Vraagt een functie met alles in false if: roomInfoVO: " + JSON.stringify(RoomInfoVO));
}