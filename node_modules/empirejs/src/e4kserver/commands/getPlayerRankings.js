module.exports = {
    name: "hgh",
    /**
     * 
     * @param {string} searchValue
     * @param {"might" | "honor" | "loot" | "achievementPoints"} rankingType
     */
    execute(socket, searchValue = "1", rankingType = "might") {
        let listType = 2;
        switch(rankingType)
        {
            case "achievementPoints": listType = 1; break;
            case "loot": listType = 2; break;
            case "honor": listType = 5; break;
            case "might": listType = 6; break;
            default: break;
        }
        let C2SGetHighscoreVO = {
            params: {
                SV: searchValue,
                LT: listType,
                LID: 1
            },
            getCmdId: "hgh",
        }
        require('./../data').sendJsonVoSignal(socket, { "commandVO": C2SGetHighscoreVO, "lockConditionVO": "new DefaultLockConditionVO()" });
    }
}