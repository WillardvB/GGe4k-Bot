class AllianceMember {
    constructor(client, data, alliance) {
        this.playerId = data.OID;
        this.playerName = data.N;
        this.playerLevel = data.L;
        this.paragonLevel = data.LL;
        this.alliance = alliance;
        this.allianceRank = data.AR;
    };
}

module.exports = AllianceMember;