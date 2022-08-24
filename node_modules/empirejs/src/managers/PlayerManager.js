'use strict'

const BaseManager = require('./BaseManager');
const searchPlayerByIdCommand = require('./../e4kserver/commands/searchPlayerById');
const getPlayerRankingsCommand = require('./../e4kserver/commands/getPlayerRankings');
const { WaitUntil } = require('./../tools/wait');

class PlayerManager extends BaseManager {
    #players = [];
    constructor(client) {
        super(client);
        this.on.bind(this);
    }
    getById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                await _getPlayerById(this._client._socket, id);
                let _player = this.#players.find(player => player.playerId === id);
                resolve(_player);
            }
            catch (e) {
                reject(e);
            }
        })
    }
    find(name) {
        return new Promise(async (resolve, reject) => {
            try {
                let _playerId = await _getPlayerByName(this._client._socket, name);
                if(_playerId === 0) reject("Player not found!");
                let _player = await this.getById(_playerId);
                resolve(_player);
            }
            catch (e) {
                reject(e);
            }
        })
    }
    _add_or_update(_player) {
        let found = false;
        for (let j in this.#players) {
            if (this.#players[j].playerId === _player.playerId) {
                this.#players[j] = _player;
                found = true;
                break;
            }
        }
        if (!found) {
            this.#players.push(_player);
        }
    }
}

function _getPlayerById(socket, id) {
    socket["_searching_player_id"] = id;
    socket["__player_found"] = false;
    socket["__get_player_error"] = "";
    return new Promise(async (resolve, reject) => {
        try {
            searchPlayerByIdCommand.execute(socket, id);
            await WaitUntil(socket, "__player_found", "__get_player_error");
            resolve();
        }
        catch (e) {
            reject(e);
        }
    });
}

function _getPlayerByName(socket, name) {
    socket["_searching_player_name"] = name;
    socket["__player_found"] = false;
    socket["__get_player_error"] = "";
    socket["__found_player_id"] = 0;
    return new Promise(async (resolve, reject) => {
        try {
            getPlayerRankingsCommand.execute(socket, name);
            await WaitUntil(socket, "__player_found", "__get_player_error");
            resolve(socket["__found_player_id"]);
        }
        catch (e) {
            reject(e);
        }
    });
}

module.exports = PlayerManager