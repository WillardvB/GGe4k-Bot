const { sendAction } = require("./commands/handlers/xml");

let _activeRoomId = -1;
let roomList = [];

module.exports = {
    get activeRoomId() { return _activeRoomId; },
    set activeRoomId(val) { _activeRoomId = val; },
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
    onJoinRoom(socket, event) {
        _onJoinRoom(socket, event);
    },
    /**
     * 
     * @param {number} index
     */
    getRoom(index) {
        return _getRoom(index);
    },
    autoJoinRoom(socket) {
        if (!_checkRoomList()) {
            return;
        }
        let headers = { "t": "sys" };
        sendAction(socket, headers, "autoJoin", !!_activeRoomId ? _activeRoomId : -1, "");
    },
    /**
     * 
     * @param {object} u
     * @param {number} id
     * @param {number} roomID
     */
    addUserToRoom(u, id, roomID) {
        roomList[roomID].userList[id] = u;
        if (roomList[roomID].game && u.isSpectator()) {
            roomList[roomID].specCount++;
        }
        else {
            roomList[roomID].userCount++;
        }
    },
    /**
     * 
     * @param {number} index
     * @param {object} room
     */
    setRoomListIndex(index, room) {
        roomList[index] = room;
    }
}

function _checkRoomList() {
    let roomListAvailable = true;
    if (roomList == null || false) {
        roomListAvailable = false;
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
}

function getAllRooms() {
    return roomList;
}

/**
 * 
 * @param {number} index
 */
function _getRoom(index) {
    if (!_checkRoomList()) {
        return null;
    }
    return roomList[index];
}

/**
 * 
 * @param {string} input
 */
function decompressInt(input) {
    let _loc3_ = 0;
    let _loc6_ = "A".charCodeAt(0);
    let _loc5_ = "z".charCodeAt(0);
    let _loc4_ = _loc5_ - _loc6_ + 1;
    let _loc2_ = 0;
    if (input && input.length > 0) {
        _loc3_ = input.length - 1;
        while (_loc3_ >= 0) {
            if (input.charCodeAt(_loc3_) < _loc6_ || input.charCodeAt(_loc3_) > _loc5_) {
                return -1;
            }
            _loc2_ = _loc2_ * _loc4_ + input.charCodeAt(_loc3_) - _loc6_;
            _loc3_--;
        }
    }
    return _loc2_;
}

/**
 * 
 * @param {object} event
 */
function _onJoinRoom(socket, event) {
    let room = event.params["room"];
    _activeRoomId = room.id;
    if (room.name == "Lobby") {
        sendAction(socket, { "t": "sys" }, "roundTrip", _activeRoomId, "");
    }
}