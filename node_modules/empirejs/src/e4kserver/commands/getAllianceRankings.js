module.exports = {
    name: "hgh",
    /**
     * 
     * @param {string} searchValue
     * @param {"dominion" | "honor" | "might" | "aqua"} rankingType
     */
    execute(socket, searchValue = "1", rankingType = "might") {
        let listType = 11;
        switch(rankingType)
        {
            case "honor": listType = 10; break;
            case "might": listType = 11; break;
            case "dominion": listType = 12; break;
            case "aqua": listType = 13; break;
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