module.exports = {
    name: "joinOK",
    execute(socket, xml) {
        let userName = null;
        let userId = 0;
        let isModerator = false;
        let isSpectator = false;
        let playerId = 0;
        let user = null;
        let roomID = xml.body.$.r;
        let _body = xml.body;
        let _users = xml.body.uLs.u;
        let _playerId = xml.body.pid.$.id;
        require('./../../room.js').activeRoomId = roomID;
        let room = require('./../../room.js').getRoom(roomID);
        room.userList = [];
        room.userCount = 0;
        room.specCount = 0;
        playerId = _playerId;
        room.myPlayerIndex = _playerId;
        if (_body.vars.toString().length > 0 && JSON.stringify(_body.vars) != "{}") {
            room.variables = [];
            room.variables = populateVariables(room.variables, _body);
        }
        if (_users != null) {
            for (let _user in _users) {
                userName = _user.n;
                userId = _user.$.i;
                isModerator = _user.$.m == "1" ? true : false;
                isSpectator = _user.$.s == "1" ? true : false;
                playerId = _user.$.p == null ? -1 : parseInt(_user.$.p);
                user = {
                    id: userId,
                    name: userName,
                    variables: [],
                    isSpec: isSpectator,
                    isMod: isModerator,
                    pId: playerId,
                }
                if (_user.vars.toString().length > 0) {
                    user.variables = populateVariables(user.variables, _user);
                }
                require('./../../room.js').addUserToRoom(user, userId, room.id);
            }
        }
        //changingRoom = false;
        let _loc6_ = { room: room };
        require('./../../room.js').setRoomListIndex(roomID, _loc6_);
        require('./../../room.js').onJoinRoom(socket, { params: _loc6_ });
    }
}