module.exports = {
    name: "hgh",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if (errorCode == 114) {
            return socket["__get_alliance_error"] = "Alliance not found!";
        }
        if(socket["_searching_alliance_name"] && socket["_searching_alliance_name"] !== ""){
            if(!params || !params.L || params.L == undefined){
                return socket["__get_alliance_error"] = "Alliance not found!";
            }
            let leaderbord = [];
            leaderbord = params.L;
            let _alliance = leaderbord.find(x => {
                let _name = socket["_searching_alliance_name"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                let _allianceName = x[2][1];
                _allianceName = _allianceName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return _allianceName === _name;
            });
            socket["__found_alliance_id"] =_alliance[2][0];
            socket["__alliance_found"] = true;
            socket["_searching_alliance_name"] = "";
        }
        if(socket["_searching_player_name"] && socket["_searching_player_name"] !== ""){
            if(!params || !params.L || params.L == undefined){
                return socket["__get_player_error"] = "Player not found!";
            }
            let leaderbord = [];
            leaderbord = params.L;
            let _player = leaderbord.find(x => {
                let _name = socket["_searching_player_name"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                let _playerName = x[2].N;
                _playerName = _playerName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return _playerName === _name;
            });
            socket["__found_player_id"] =_player[2].OID;
            socket["__player_found"] = true;
            socket["_searching_player_name"] = "";
        }
    }
}