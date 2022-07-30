module.exports = {
    name: "gdi",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(errorCode, params) {
        if (errorCode == 21) return; //player not found.
        require("./wsp").parseOwnerInfo(params.O, true);
        console.log(JSON.stringify(params));
        /**
         var _loc2_:CastleListVO = new CastleListVO();
         _loc2_.ownerID = _loc4_.playerID;
         _loc2_.castles = castleListParser.parseCastleList(paramObj.gcl,_loc4_);
         _loc2_.publicVillages = castleListParser.parsePublicVillageList(paramObj.kgv,_loc4_);
         _loc2_.privateVillages = castleListParser.parsePrivateVillageList(paramObj.kgv,_loc4_);
         _loc2_.kingsTowers = castleListParser.parseKingsTowerList(paramObj.gkl);
         _loc2_.monuments = castleListParser.parseMonumentList(paramObj.gml);
         _loc2_.allianceTowers = new Vector.<AllianceTowerMapobjectVO>(0);
         var _loc3_:TIEParser = parserFactory.getParser("tie") as TIEParser;
         _loc3_.setParsePayload(_loc2_.allianceTowers);
         _loc3_.parse(paramObj["tie"]);
         detailPlayerInfoLoadedSignal.dispatch(_loc2_);
         */ 
    },
}