const AllianceMember = require("./AllianceMember");

class Alliance {
    constructor(client, data) {
        this.allianceId = data.AID;
        this.allianceName = data.N;
        this.allianceDescription = parseChatJSONMessage(data.D);
        this.languageId = data["ALL"];
        this.memberLevel = data.ML;
        this.memberList = parseMembers(client, data.M, this);
        this.allianceStatusToOwnAlliance = data.DOA;
        this.allianceFamePoints = data.CF;
        this.allianceFamePointsHighestReached = -1;
        this.canInvitedForHardPact = data.HP == 1;
        this.canInvitedForSoftPact = data.SP == 1;
        if(data.IS)
            this.isSearchingMembers = data.IS;
        this._landmarks = [];
        this.isOpenAlliance = data.IA != 0;
        if(data.FR)
            this.freeRenames = data.FR;
        this.might = parseInt(data.MP);
    }
    get landmarks() {
        console.error("get landmarks() Not Implememented");
        //Door de leden heen gaan en de landmarks zo verzamelen(?);
        return this._landmarks;
    }
    _add_or_update_landmarks(landmarks) {
        console.error("_add_or_update_landmarks Not Implememented");
    }
}

module.exports = Alliance;

/**
 * 
 * @param {string} msgText
 */
function parseChatJSONMessage(msgText) {
    if (!msgText) {
        return "";
    }
    return msgText.replace(/&percnt;/g, "%").replace(/&quot;/g, "\"").replace(/&#145;/g, "\'").replace(/<br \/>/g, "\n").replace(/&lt;/g, "<");
}

/**
 * @param {object[]} members
 * @param {Alliance} _alliance
 * @returns {AllianceMember[]}
 */
function parseMembers(client, members, _alliance) {
    /**@type {AllianceMember[]} */
    let allianceMembers = [];
    for(let i in members){
        let _memberData = members[i];
        let _member = new AllianceMember(client, _memberData, _alliance);
        allianceMembers.push(_member);
    }
    allianceMembers.sort((a,b) => {
        if (a.allianceRank < b.allianceRank) {
            return -1;
        }
        if (a.allianceRank > b.allianceRank) {
            return 1;
        }
        return 0;
    })
    return allianceMembers;
}