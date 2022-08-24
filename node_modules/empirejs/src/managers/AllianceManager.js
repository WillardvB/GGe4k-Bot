'use strict'

const BaseManager = require('./BaseManager');
const searchAllianceByIdCommand = require('./../e4kserver/commands/searchAllianceById');
const getAllianceRankingsCommand = require('./../e4kserver/commands/getAllianceRankings');
const { WaitUntil } = require('./../tools/wait');

class AllianceManager extends BaseManager {
    #alliances = [];
    constructor(client) {
        super(client);
        this.on.bind(this);
        this._client = client;
    }
    getById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                await _getAllianceById(this._client._socket, id);
                let _alliance = this.#alliances.find(alliance => alliance.allianceId === id);
                resolve(_alliance);
            }
            catch (e) {
                reject(e);
            }
        })
    }
    find(name) {
        return new Promise(async (resolve, reject) => {
            try {
                let _allianceId = await _getAllianceByName(this._client._socket, name);
                if(_allianceId === 0) reject("Alliance not found!");
                let _alliance = await this.getById(_allianceId);
                resolve(_alliance);
            }
            catch (e) {
                reject(e);
            }
        })
    }
    _add_or_update(_alliance) {
        let found = false;
        for (let j in this.#alliances) {
            if (this.#alliances[j].allianceId === _alliance.allianceId) {
                this.#alliances[j] = _alliance;
                found = true;
                break;
            }
        }
        if (!found) {
            this.#alliances.push(_alliance);
        }
    }
    get mine(){
    //  if(this._client.players?.me?.playerId){
    //      WaitUntil(socket, )
    //  }
        return null;
    //  return this._client.
    }
}

function _getAllianceById(socket, id) {
    socket["_searching_alliance_id"] = id;
    socket["__alliance_found"] = false;
    socket["__get_alliance_error"] = "";
    return new Promise(async (resolve, reject) => {
        try {
            searchAllianceByIdCommand.execute(socket, id);
            await WaitUntil(socket, "__alliance_found", "__get_alliance_error");
            resolve();
        }
        catch (e) {
            reject(e);
        }
    });
}

function _getAllianceByName(socket, name) {
    socket["_searching_alliance_name"] = name;
    socket["__alliance_found"] = false;
    socket["__get_alliance_error"] = "";
    socket["__found_alliance_id"] = 0;
    return new Promise(async (resolve, reject) => {
        try {
            getAllianceRankingsCommand.execute(socket, name);
            await WaitUntil(socket, "__alliance_found", "__get_alliance_error");
            resolve(socket["__found_alliance_id"]);
        }
        catch (e) {
            reject(e);
        }
    });
}

module.exports = AllianceManager